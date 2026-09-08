#!/bin/bash
# Generates harness contracts from the canonical contract and, where needed, a
# provider-specific adapter.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f COMPANION.md ]; then
  echo "Error: COMPANION.md not found" >&2
  exit 1
fi

for output in AGENTS.md GEMINI.md; do
  {
    echo "<!-- Generated from COMPANION.md — do not edit directly -->"
    echo ""
    cat COMPANION.md
  } > "$output"
  echo "Generated $output"
done

{
  echo "<!-- Generated from COMPANION.md + agents/claude.md — do not edit directly -->"
  echo ""
  cat COMPANION.md
  echo ""
  echo ""
  cat agents/claude.md
} > CLAUDE.md
echo "Generated CLAUDE.md"
