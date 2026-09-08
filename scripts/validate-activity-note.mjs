#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { validateActivityNote } from "../src/activity-note-policy.mjs";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: node scripts/validate-activity-note.mjs <activity-note.md> [...]");
  process.exit(2);
}
for (const file of files) {
  validateActivityNote(await readFile(file, "utf8"));
  console.log(`valid: ${file}`);
}
