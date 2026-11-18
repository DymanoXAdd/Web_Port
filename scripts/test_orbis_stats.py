"""Tests for orbis-stats.py. Run: python scripts/test_orbis_stats.py"""
import datetime
import importlib.util
import json
import socket
import struct
import tempfile
import threading
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("orbis_stats", Path(__file__).with_name("orbis-stats.py"))
orbis = importlib.util.module_from_spec(spec)
spec.loader.exec_module(orbis)

A = "580f54f9-7b0b-4059-85a1-a8a45b2e8395"
B = "06c7d921-d97e-419a-9072-c6d4c957d8ee"
C = "e4f45465-c071-4e5e-b844-e342804c8315"


class BuildDocument(unittest.TestCase):
    def test_summarizes_named_players_who_played(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / "server.properties").write_text("motd=Orbis\nlevel-name=orbis\n")
            (root / "usercache.json").write_text(json.dumps([{"uuid": A, "name": "squid"}, {"uuid": B, "name": "idle"}]))
            stats = root / "orbis" / "players" / "stats"
            stats.mkdir(parents=True)
            (stats / f"{A}.json").write_text(json.dumps({"stats": {
                "minecraft:custom": {
                    "minecraft:play_time": 72000, "minecraft:deaths": 3, "minecraft:mob_kills": 9,
                    "minecraft:walk_one_cm": 1000, "minecraft:aviate_one_cm": 500, "minecraft:fall_one_cm": 99999,
                },
                "minecraft:mined": {"minecraft:stone": 10, "minecraft:dirt": 5},
            }}))
            (stats / f"{B}.json").write_text(json.dumps({"stats": {"minecraft:custom": {"minecraft:play_time": 0}}}))
            (stats / f"{C}.json").write_text(json.dumps({"stats": {"minecraft:custom": {"minecraft:play_time": 5}}}))  # no name
            (stats / "broken.json").write_text("{not json")

            now = datetime.datetime(2026, 11, 17, 20, 0, tzinfo=datetime.timezone.utc)
            doc = orbis.build_document(root, now)

        self.assertEqual(doc["_id"], "minecraftStats")
        self.assertEqual(doc["updatedAt"], "2026-11-17T20:00:00+00:00")
        self.assertEqual(doc["players"], [{
            "_key": A, "uuid": A, "name": "squid", "playTime": 72000, "deaths": 3,
            "mobKills": 9, "blocksMined": 15, "distanceCm": 1500,
        }])


class OptOut(unittest.TestCase):
    def test_hidden_players_are_left_out_by_name_or_uuid(self):
        with tempfile.TemporaryDirectory() as d:
            root = Path(d)
            (root / "usercache.json").write_text(json.dumps([{"uuid": A, "name": "Squid"}, {"uuid": B, "name": "Red"}, {"uuid": C, "name": "Snack"}]))
            stats = root / "world" / "players" / "stats"
            stats.mkdir(parents=True)
            for u in (A, B, C):
                (stats / f"{u}.json").write_text(json.dumps({"stats": {"minecraft:custom": {"minecraft:play_time": 100}}}))
            hide = root / "hidden.txt"
            hide.write_text(f"# players who opted out\nsquid\n{B.upper()}  # by uuid\n\n")

            hidden = orbis.read_hidden(hide)
            doc = orbis.build_document(root, datetime.datetime.now(datetime.timezone.utc), hidden)

        self.assertEqual([p["name"] for p in doc["players"]], ["Snack"])
        self.assertEqual(orbis.read_hidden(Path(d) / "missing.txt"), set())




class FakeRcon(threading.Thread):
    """A one-connection RCON server: checks the password, answers one command."""

    def __init__(self, password, reply):
        super().__init__(daemon=True)
        self.sock = socket.socket()
        self.sock.bind(("127.0.0.1", 0))
        self.sock.listen(1)
        self.port = self.sock.getsockname()[1]
        self.password, self.reply, self.command = password, reply, None

    def run(self):
        conn, _ = self.sock.accept()
        with conn:
            def read():
                length = struct.unpack("<i", conn.recv(4))[0]
                data = conn.recv(length)
                return struct.unpack("<ii", data[:8])[0], data[8:-2].decode()

            def send(req_id, body):
                data = struct.pack("<ii", req_id, 0) + body.encode() + b"\x00\x00"
                conn.sendall(struct.pack("<i", len(data)) + data)

            req_id, pw = read()
            if pw != self.password:
                send(-1, "")
                return
            send(req_id, "")
            req_id, self.command = read()
            send(req_id, self.reply)


class Rcon(unittest.TestCase):
    def test_runs_a_command_after_login(self):
        server = FakeRcon("secret", "Added Snack to the whitelist")
        server.start()
        reply = orbis.rcon("whitelist add Snack", "secret", port=server.port)
        self.assertEqual(reply, "Added Snack to the whitelist")
        self.assertEqual(server.command, "whitelist add Snack")

    def test_wrong_password_raises(self):
        server = FakeRcon("secret", "")
        server.start()
        with self.assertRaises(PermissionError):
            orbis.rcon("whitelist list", "wrong", port=server.port)


class HandleRequests(unittest.TestCase):
    def test_adds_approved_players_and_deletes_only_handled_requests(self):
        replies = {
            "whitelist add Snack": "Added Snack to the whitelist",
            "whitelist add Red_1901": "Player is already whitelisted",
            "whitelist add Ghost": "That player does not exist",
        }
        ran, deleted = [], []
        requests = [
            {"_id": "whitelist-requests.a", "username": "Snack"},
            {"_id": "whitelist-requests.b", "username": "Red_1901"},
            {"_id": "whitelist-requests.c", "username": "Ghost"},
            {"_id": "whitelist-requests.d", "username": "x; op Evil"},  # never reaches the console
        ]
        orbis.handle_requests(requests, lambda cmd: ran.append(cmd) or replies[cmd], deleted.append)
        self.assertEqual(ran, ["whitelist add Snack", "whitelist add Red_1901", "whitelist add Ghost"])
        self.assertEqual(deleted, ["whitelist-requests.a", "whitelist-requests.b"])


if __name__ == "__main__":
    unittest.main()
