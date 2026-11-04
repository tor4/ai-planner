#!/usr/bin/env bash
set -eu
git init -q -b main . && git config user.email t@example.com && git config user.name Tester
mkdir -p planner
cat > planner/blocks.py <<'PY'
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo


def block_end(start_local: datetime, minutes: int, zone: str) -> datetime:
    """Return the end of a block that starts at start_local in zone."""
    start = start_local.replace(tzinfo=ZoneInfo(zone))
    return start + timedelta(minutes=minutes)
PY
git add . && git commit -qm "Add block end calculation"
cat > planner/blocks.py <<'PY'
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo


def block_end(start_local: datetime, minutes: int, zone: str) -> datetime:
    """Return the end of a block that starts at start_local in zone."""
    start = start_local.replace(tzinfo=ZoneInfo(zone)).astimezone(timezone.utc)
    return (start + timedelta(minutes=minutes)).astimezone(ZoneInfo(zone))
PY
git add planner/blocks.py
