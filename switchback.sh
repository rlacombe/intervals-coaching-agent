#!/bin/bash
# Switchback Running — multi-agent launcher
# Detects installed AI agents, remembers your preference, and launches
# with agent-appropriate configuration.

set -euo pipefail
cd "$(dirname "$0")" || exit 1

# Load .env if it exists (exports vars for all agents, not just Claude)
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

UPSTREAM="rlacombe/switchback-running"
PREF_FILE=".switchback-agent"

# ---- Deterministic framework operations ----

case "${1:-}" in
  route)
    shift
    exec node scripts/route-workflow.mjs "$@"
    ;;
  reconcile)
    shift
    exec node scripts/reconcile-activities.mjs "$@"
    ;;
  resource)
    [ "${2:-}" = "read" ] || { echo "Usage: switchback resource read <path>" >&2; exit 2; }
    shift 2
    exec node scripts/read-resource.mjs "$@"
    ;;
  memory)
    [ "${2:-}" = "sync" ] || { echo "Usage: switchback memory sync [--intervals file] [--strava file] --through YYYY-MM-DD" >&2; exit 2; }
    shift 2
    exec node scripts/sync-activity-memory.mjs "$@"
    ;;
esac

# ---- Update command ----

if [ "${1:-}" = "update" ]; then
  echo ""
  echo "Switchback — updating framework"
  echo "================================"
  echo ""

  # Resolve once, then download that immutable commit.
  TMPDIR=$(mktemp -d)
  trap "rm -rf $TMPDIR" EXIT

  echo "  → Downloading latest version..."
  LATEST=$(curl --connect-timeout 5 --max-time 20 -sf "https://api.github.com/repos/$UPSTREAM/commits/main" \
    | grep '"sha"' | head -1 | cut -d'"' -f4)
  [ -n "$LATEST" ] || { echo "Unable to resolve the latest Switchback commit." >&2; exit 1; }
  ARCHIVE="$TMPDIR/switchback.tar.gz"
  curl --connect-timeout 5 --max-time 120 -fsSL "https://github.com/$UPSTREAM/archive/$LATEST.tar.gz" -o "$ARCHIVE"
  tar tzf "$ARCHIVE" >/dev/null
  tar xzf "$ARCHIVE" -C "$TMPDIR" --strip-components=1

  # Framework files to overwrite (everything except personal data)
  echo "  → Updating framework files..."

  # Directories — sync entirely
  for dir in knowledge agents scripts src skills docs .gemini; do
    if [ -d "$TMPDIR/$dir" ]; then
      rm -rf "$dir"
      cp -r "$TMPDIR/$dir" "$dir"
    fi
  done


  # Claude discovers the same provider-neutral skills through its native path.
  rm -rf .claude/skills
  ln -s ../skills .claude/skills

  # Root files — overwrite framework, skip personal
  for file in COMPANION.md CLAUDE.md AGENTS.md GEMINI.md README.md LICENSE \
              switchback.sh install.sh SOUL.example.md athlete/profile.example.md \
              athlete/activity-note.example.md athlete/checkpoint.example.md \
              athlete/activities-index.example.md athlete/monthly-summary.example.md \
              .claude/settings.json .mcp.json .env.example; do
    if [ -f "$TMPDIR/$file" ]; then
      mkdir -p "$(dirname "$file")"
      cp "$TMPDIR/$file" "$file"
    fi
  done

  # Make scripts executable
  chmod +x switchback.sh install.sh scripts/*.sh 2>/dev/null || true

  # Leave framework changes visible for review. Never commit or push automatically.
  if ! git diff --quiet -- ':!athlete/' ':!SOUL.md' 2>/dev/null || \
     [ -n "$(git ls-files --others --exclude-standard -- ':!athlete/' ':!SOUL.md' 2>/dev/null)" ]; then
    echo "  ✓ Framework updated; review and commit the changes when ready"
  else
    echo "  ✓ Already up to date"
  fi

  echo "$LATEST" > "$VERSION_FILE"

  echo ""
  exit 0
fi

# ---- Agent detection ----

declare -a AVAILABLE=()
command -v claude &>/dev/null && AVAILABLE+=("claude")
command -v codex  &>/dev/null && AVAILABLE+=("codex")
command -v gemini &>/dev/null && AVAILABLE+=("gemini")

if [ ${#AVAILABLE[@]} -eq 0 ]; then
  echo "No supported agent found. Install one of:"
  echo "  Claude Code:  npm install -g @anthropic-ai/claude-code"
  echo "  Codex CLI:    npm install -g @openai/codex"
  echo "  Gemini CLI:   npm install -g @google/gemini-cli"
  exit 1
fi

# ---- Agent selection ----

AGENT=""

# 1. --agent flag takes priority
ARGS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --agent)  AGENT="$2"; shift 2 ;;
    --agent=*) AGENT="${1#*=}"; shift ;;
    *) ARGS+=("$1"); shift ;;
  esac
done

# 2. Saved preference (verify still installed)
if [ -z "$AGENT" ] && [ -f "$PREF_FILE" ]; then
  SAVED=$(tr -d '[:space:]' < "$PREF_FILE")
  if printf '%s\n' "${AVAILABLE[@]}" | grep -qx "$SAVED"; then
    AGENT="$SAVED"
  fi
fi

# 3. Only one agent available — use it
if [ -z "$AGENT" ] && [ ${#AVAILABLE[@]} -eq 1 ]; then
  AGENT="${AVAILABLE[0]}"
fi

# 4. Ask the user
if [ -z "$AGENT" ]; then
  echo "Multiple agents detected. Which would you like to use?"
  echo ""
  for i in "${!AVAILABLE[@]}"; do
    echo "  $((i+1))) ${AVAILABLE[$i]}"
  done
  echo ""
  read -rp "Pick a number (saved for next time): " choice
  idx=$((choice - 1))
  if [ "$idx" -ge 0 ] && [ "$idx" -lt ${#AVAILABLE[@]} ]; then
    AGENT="${AVAILABLE[$idx]}"
    echo "$AGENT" > "$PREF_FILE"
    echo "Saved: $AGENT"
  else
    echo "Invalid choice." >&2
    exit 1
  fi
fi

# Validate
if ! printf '%s\n' "${AVAILABLE[@]}" | grep -qx "$AGENT"; then
  echo "Agent '$AGENT' is not installed." >&2
  exit 1
fi

# ---- Launch ----

case "$AGENT" in
  claude)
    exec claude "Hey!"
    ;;

  codex)
    exec codex "Hey!"
    ;;

  gemini)
    exec gemini "Hey!"
    ;;
esac
