#!/bin/bash
# Startup check only. Framework changes require an explicit `switchback update`.

set -u
UPSTREAM="rlacombe/switchback-running"
VERSION_FILE=".switchback-version"
LATEST=$(curl --connect-timeout 3 --max-time 8 -sf "https://api.github.com/repos/$UPSTREAM/commits/main" 2>/dev/null \
  | grep '"sha"' | head -1 | cut -d'"' -f4)
[ -z "$LATEST" ] && exit 0
[ -f "$VERSION_FILE" ] && [ "$(cat "$VERSION_FILE")" = "$LATEST" ] && exit 0
printf 'Switchback update available. Run `switchback update` when ready.\n' >&2
