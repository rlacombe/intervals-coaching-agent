import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("activity memory defaults to enabled and has a persistent opt-out", async () => {
  const profile = await read("athlete/profile.example.md");
  const memoryPolicy = await read("agents/memory-policy.md");
  const review = await read("skills/review/SKILL.md");

  assert.match(profile, /Activity memory:\*\* enabled \(default/);
  assert.match(profile, /set to `disabled`/);
  assert.match(memoryPolicy, /Activity memory is enabled unless/);
  assert.match(memoryPolicy, /agents\/activity-memory\.md/);
  assert.match(review, /When activity memory is enabled/);
  assert.match(review, /archive the workout/);
});

test("historical backfill requires an athlete-selected lookback period", async () => {
  const archive = await read("skills/archive/SKILL.md");
  const setup = await read("skills/setup/SKILL.md");
  const procedure = await read("agents/activity-memory.md");

  for (const document of [archive, setup, procedure]) assert.match(document, /1, 3, 6, or 12 months/);
  assert.match(archive, /do not choose or query a historical.*silently/is);
  assert.match(setup, /Do not query or archive history.*explicitly chooses/is);
  assert.match(procedure, /Never silently choose a period/);
  assert.match(archive, /explicit archive request proceeds/i);
});

test("all agent harnesses share the activity-memory procedure", async () => {
  const [claude, codex, gemini, procedure, memoryPolicy] = await Promise.all([
    read("CLAUDE.md"),
    read("AGENTS.md"),
    read("GEMINI.md"),
    read("agents/activity-memory.md"),
    read("agents/memory-policy.md"),
  ]);

  for (const document of [claude, codex, gemini]) {
    assert.match(document, /agents\/activity-memory\.md/);
    assert.match(document, /agents\/memory-policy\.md/);
  }
  assert.match(memoryPolicy, /Activity memory is enabled unless/);
  assert.match(procedure, /GPX\/TCX\/FIT/);
  assert.match(procedure, /third-party comments/);
  assert.match(procedure, /archive every missing completed workout/i);
});
