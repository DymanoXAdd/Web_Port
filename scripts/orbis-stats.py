#!/usr/bin/env python3
"""Push Orbis player stats to Sanity and whitelist approved join requests.

Runs on the Minecraft server box from cron every 5 min. Reads the vanilla stats files
(<world>/players/stats/<uuid>.json, the 26.x location) and usercache.json for names, and
replaces the single Sanity document "minecraftStats". Standard library only.

    python3 orbis-stats.py --server-dir "/home/luisdev/Desktop/Minecraft Server" \
        --project tl1sng9j --dataset production --token-file ~/.config/orbis-stats/token

Join requests approved in Studio are added with "whitelist add" over RCON (password in
--rcon-file), then deleted from Sanity.

--dry-run prints the document instead of sending it. Players listed in --hide-file (default
~/.config/orbis-stats/hidden.txt, one username or UUID per line) are left out: the opt-out the
site's privacy policy promises. The token file must hold a Sanity
API token with Editor rights and nothing else; keep it chmod 600.
"""
import argparse
import datetime
import json
import os
import re
import socket
import struct
import sys
import urllib.parse
import urllib.error
import urllib.request
from pathlib import Path

API_VERSION = "2025-11-20"
DOC_ID = "minecraftStats"


def summarize(stats: dict) -> dict:
    """The five leaderboard numbers from one player's stats file, in raw game units."""
    s = stats.get("stats", {})
    custom = s.get("minecraft:custom", {})
    return {
        "playTime": custom.get("minecraft:play_time", 0),
        "deaths": custom.get("minecraft:deaths", 0),
        "mobKills": custom.get("minecraft:mob_kills", 0),
        "blocksMined": sum(s.get("minecraft:mined", {}).values()),
        # every way of travelling (walk, sprint, swim, fly, boat, horse...) except falling
        "distanceCm": sum(
            v for k, v in custom.items() if k.endswith("_one_cm") and k != "minecraft:fall_one_cm"
        ),
    }


def read_hidden(path: Path) -> set:
    """Players who opted out of the leaderboard: one username or UUID per line, # starts a comment."""
    if not path.exists():
        return set()
    lines = (line.split("#", 1)[0].strip().lower() for line in path.read_text(encoding="utf-8").splitlines())
    return {line for line in lines if line}


def build_document(server_dir: Path, now: datetime.datetime, hidden: set = frozenset()) -> dict:
    level = "world"
    props = server_dir / "server.properties"
    if props.exists():
        for line in props.read_text(encoding="utf-8").splitlines():
            if line.startswith("level-name="):
                level = line.split("=", 1)[1].strip() or "world"
    names = {}
    cache = server_dir / "usercache.json"
    if cache.exists():
        names = {u["uuid"]: u["name"] for u in json.loads(cache.read_text(encoding="utf-8"))}

    players = []
    for f in sorted((server_dir / level / "players" / "stats").glob("*.json")):
        uuid = f.stem
        try:
            numbers = summarize(json.loads(f.read_text(encoding="utf-8")))
        except (ValueError, AttributeError) as e:  # a half-written file: skip it this run
            print(f"skipping {f.name}: {e}", file=sys.stderr)
            continue
        if numbers["playTime"] <= 0 or uuid not in names:  # never played, or no name to show
            continue
        if uuid.lower() in hidden or names[uuid].lower() in hidden:  # opted out (privacy policy)
            continue
        players.append({"_key": uuid, "uuid": uuid, "name": names[uuid], **numbers})

    return {
        "_id": DOC_ID,
        "_type": DOC_ID,
        "updatedAt": now.astimezone(datetime.timezone.utc).isoformat(timespec="seconds"),
        "players": players,
    }


MC_USERNAME = re.compile(r"^[A-Za-z0-9_]{3,16}$")


def rcon(command: str, password: str, host: str = "127.0.0.1", port: int = 25575) -> str:
    """Run one command on the server's RCON console and return its reply."""
    def packet(req_id: int, kind: int, body: str) -> bytes:
        data = struct.pack("<ii", req_id, kind) + body.encode("utf-8") + b"\x00\x00"
        return struct.pack("<i", len(data)) + data

    def read(sock: socket.socket) -> tuple:
        def exactly(n: int) -> bytes:
            buf = b""
            while len(buf) < n:
                chunk = sock.recv(n - len(buf))
                if not chunk:
                    raise ConnectionError("RCON closed the connection")
                buf += chunk
            return buf
        (length,) = struct.unpack("<i", exactly(4))
        data = exactly(length)
        req_id, _kind = struct.unpack("<ii", data[:8])
        return req_id, data[8:-2].decode("utf-8", errors="replace")

    with socket.create_connection((host, port), timeout=10) as sock:
        sock.sendall(packet(1, 3, password))  # 3 = login
        if read(sock)[0] == -1:
            raise PermissionError("RCON login failed")
        sock.sendall(packet(2, 2, command))  # 2 = command
        return read(sock)[1]


def handle_requests(requests: list, run, delete) -> None:
    """Add each approved player to the whitelist, then delete their request. Failures stay for the next run."""
    for r in requests:
        name = r.get("username") or ""
        if not MC_USERNAME.match(name):  # never put anything else into a console command
            print(f"skipping request {r.get('_id')}: bad username {name!r}", file=sys.stderr)
            continue
        reply = run(f"whitelist add {name}")
        if "Added" in reply or "already whitelisted" in reply:
            delete(r["_id"])
            print(f"whitelisted {name}")
        else:
            print(f"whitelist add {name} failed: {reply!r}", file=sys.stderr)


def sanity_query(query: str, project: str, dataset: str, token: str) -> list:
    url = f"https://{project}.api.sanity.io/v{API_VERSION}/data/query/{dataset}?" + urllib.parse.urlencode({"query": query})
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.loads(res.read())["result"] or []


def sanity_mutate(mutations: list, project: str, dataset: str, token: str) -> None:
    req = urllib.request.Request(
        f"https://{project}.api.sanity.io/v{API_VERSION}/data/mutate/{dataset}",
        data=json.dumps({"mutations": mutations}).encode(),
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as res:
        res.read()


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--server-dir", required=True, type=Path)
    p.add_argument("--project", required=True)
    p.add_argument("--dataset", required=True)
    p.add_argument("--token-file", type=Path, default=Path("~/.config/orbis-stats/token"))
    p.add_argument("--hide-file", type=Path, default=Path("~/.config/orbis-stats/hidden.txt"))
    p.add_argument("--rcon-file", type=Path, default=Path("~/.config/orbis-stats/rcon"))
    p.add_argument("--rcon-port", type=int, default=25575)
    p.add_argument("--dry-run", action="store_true")
    a = p.parse_args()

    hidden = read_hidden(a.hide_file.expanduser())
    doc = build_document(a.server_dir.expanduser(), datetime.datetime.now(datetime.timezone.utc), hidden)
    if a.dry_run:
        print(json.dumps(doc, indent=2))
        return 0
    token = a.token_file.expanduser().read_text(encoding="utf-8").strip()
    status = 0
    try:
        sanity_mutate([{"createOrReplace": doc}], a.project, a.dataset, token)
        print(f"pushed {len(doc['players'])} players at {doc['updatedAt']}")
    except urllib.error.HTTPError as e:  # never print the token; Sanity's reply says what is wrong
        print(f"Sanity answered {e.code}: {e.read().decode(errors='replace')[:300]}", file=sys.stderr)
        status = 1

    # Join requests Luis approved in Studio (published only): whitelist them over RCON.
    rcon_file = a.rcon_file.expanduser()
    if rcon_file.exists():
        password = rcon_file.read_text(encoding="utf-8").strip()
        try:
            approved = sanity_query(
                '*[_type == "whitelistRequest" && status == "approved"]{_id, username}', a.project, a.dataset, token
            )
            base = lambda i: i.removeprefix("drafts.")
            handle_requests(
                approved,
                lambda cmd: rcon(cmd, password, port=a.rcon_port),
                lambda i: sanity_mutate(
                    [{"delete": {"id": base(i)}}, {"delete": {"id": f"drafts.{base(i)}"}}], a.project, a.dataset, token
                ),
            )
        except (OSError, urllib.error.HTTPError) as e:  # server down or Sanity unreachable: retry next run
            print(f"join requests skipped this run: {e}", file=sys.stderr)
            status = 1
    return status


if __name__ == "__main__":
    sys.exit(main())
