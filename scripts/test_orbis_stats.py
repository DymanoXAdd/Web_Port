"""Tests for orbis-stats.py. Run: python scripts/test_orbis_stats.py"""
import datetime
import importlib.util
import json
import tempfile
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


if __name__ == "__main__":
    unittest.main()
