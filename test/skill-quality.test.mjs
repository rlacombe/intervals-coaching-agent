import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);
const skillsRoot = new URL("skills/", root);
const MCP_TOOLS = new Set([
  "get_athlete", "get_events", "get_event", "get_activities", "get_activity",
  "get_activity_streams", "get_wellness", "get_fitness", "get_weather",
  "create_event", "update_event", "delete_event", "get_strava_athlete",
  "get_strava_activities", "get_strava_activity", "get_strava_activity_streams",
  "get_strava_activity_comments",
]);

async function skillDocuments() {
  const directories = await readdir(skillsRoot, { withFileTypes: true });
  return Promise.all(directories.filter(entry => entry.isDirectory()).map(async entry => ({
    name: entry.name,
    text: await readFile(new URL(`${entry.name}/SKILL.md`, skillsRoot), "utf8"),
  })));
}

test("skills have complete metadata and operational prose", async () => {
  const skills = await skillDocuments();
  assert.equal(skills.length, 12);
  for (const { name, text } of skills) {
    assert.match(text, /^---\ndescription: .+\nuser-invocable: true\n---\n\n# /, name);
    assert.doesNotMatch(text, /UltraBench|benchmark|SWITCHBACK_TRACE_FILE/i, name);
  }
});

test("skills reference only implemented MCP tools", async () => {
  for (const { name, text } of await skillDocuments()) {
    const references = [...text.matchAll(/`((?:get|create|update|delete)_[a-z_]+)`/g)].map(match => match[1]);
    for (const reference of references) assert.ok(MCP_TOOLS.has(reference), `${name}: ${reference}`);
  }
});

test("skills that write calendar state require verification", async () => {
  for (const name of ["adjust", "briefing", "build", "race", "setup"]) {
    const text = await readFile(new URL(`skills/${name}/SKILL.md`, root), "utf8");
    assert.match(text, /read (?:it )?back|verify deletion|final `get_events` check/i, name);
  }
});
