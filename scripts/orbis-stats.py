#!/usr/bin/env python3
"""Push Orbis player stats to Sanity for the /minecraft leaderboard.

Runs on the Minecraft server box from cron every 15 min. Reads the vanilla stats files
(<world>/players/stats/<uuid>.json, the 26.x location) and usercache.json for names, and
replaces the single Sanity document "minecraftStats". Standard library only.

    python3 orbis-stats.py --server-dir "/home/luisdev/Desktop/Minecraft Server" \
        --project tl1sng9j --dataset production --token-file ~/.config/orbis-stats/token

--dry-run prints the document instead of sending it. The token file must hold a Sanity
API token with Editor rights and nothing else; keep it chmod 600.
"""
import argparse
import datetime
import json
import os
import sys
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


def build_document(server_dir: Path, now: datetime.datetime) -> dict:
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
        players.append({"_key": uuid, "uuid": uuid, "name": names[uuid], **numbers})

    return {
        "_id": DOC_ID,
        "_type": DOC_ID,
        "updatedAt": now.astimezone(datetime.timezone.utc).isoformat(timespec="seconds"),
        "players": players,
    }


def push(doc: dict, project: str, dataset: str, token: str) -> None:
    req = urllib.request.Request(
        f"https://{project}.api.sanity.io/v{API_VERSION}/data/mutate/{dataset}",
        data=json.dumps({"mutations": [{"createOrReplace": doc}]}).encode(),
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
    p.add_argument("--dry-run", action="store_true")
    a = p.parse_args()

    doc = build_document(a.server_dir.expanduser(), datetime.datetime.now(datetime.timezone.utc))
    if a.dry_run:
        print(json.dumps(doc, indent=2))
        return 0
    token = a.token_file.expanduser().read_text(encoding="utf-8").strip()
    try:
        push(doc, a.project, a.dataset, token)
    except urllib.error.HTTPError as e:  # never print the token; Sanity's reply says what is wrong
        print(f"Sanity answered {e.code}: {e.read().decode(errors='replace')[:300]}", file=sys.stderr)
        return 1
    print(f"pushed {len(doc['players'])} players at {doc['updatedAt']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
