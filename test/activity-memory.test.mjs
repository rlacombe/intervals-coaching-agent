import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("activity memory defaults to enabled and has a persistent opt-out", async () => {
  const profile = await read("athlete/profile.example.md");
  const companion = await read("COMPANION.md");
  const review = await read(".claude/skills/review/SKILL.md");

  assert.match(profile, /Activity memory:\*\* enabled \(default/);
  assert.match(profile, /set to `disabled`/);
  assert.match(companion, /Activity memory is enabled by default/);
  assert.match(review, /Activity memory\*\* preference/);
  assert.match(review, /set it to `disabled`/);
});

test("historical backfill requires an athlete-selected lookback period", async () => {
  const archive = await read(".claude/skills/archive/SKILL.md");
  const setup = await read(".claude/skills/setup/SKILL.md");
  const procedure = await read("agents/activity-memory.md");

  for (const document of [archive, setup, procedure]) assert.match(document, /1, 3, 6, or 12 months/);
  assert.match(archive, /Do not choose a period or archive historical activities silently/);
  assert.match(setup, /Do not backfill until they explicitly choose a period/);
  assert.match(procedure, /Never silently choose a period/);
  assert.match(archive, /explicit `\/archive` request always proceeds/i);
});

test("all agent harnesses share the activity-memory procedure", async () => {
  const [claude, codex, gemini, procedure] = await Promise.all([
    read("agents/claude.md"),
    read("agents/codex.md"),
    read("agents/gemini.md"),
    read("agents/activity-memory.md"),
  ]);

  for (const document of [claude, codex, gemini]) {
    assert.match(document, /agents\/activity-memory\.md/);
    assert.match(document, /Activity memory is enabled by default/);
  }
  assert.match(procedure, /GPX\/TCX\/FIT/);
  assert.match(procedure, /third-party comments/);
});
