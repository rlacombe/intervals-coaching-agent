import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));

test("resource reads emit a content-free trace", () => {
  const directory = mkdtempSync(join(tmpdir(), "switchback-read-"));
  const trace = join(directory, "trace.jsonl");
  const result = spawnSync(process.execPath, [join(root, "scripts/read-resource.mjs"), "athlete/profile.example.md"], {
    cwd: root, env: { ...process.env, SWITCHBACK_TRACE_FILE: trace }, encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /# Athlete Profile/);
  const entry = JSON.parse(readFileSync(trace, "utf8"));
  assert.equal(entry.path, "athlete/profile.example.md");
  assert.doesNotMatch(JSON.stringify(entry), /Why You Run/);
});

test("activity-memory sync reconciles providers and advances one checkpoint", () => {
  const directory = mkdtempSync(join(tmpdir(), "switchback-memory-"));
  const intervals = join(directory, "intervals.json");
  const strava = join(directory, "strava.json");
  const athlete = join(directory, "athlete");
  mkdirSync(athlete);
  writeFileSync(join(athlete, "profile.md"), "# Profile\n- **Activity-memory last sync:** never\n");
  writeFileSync(intervals, JSON.stringify([{ id: "i1", name: "Long run", type: "Run", start_date_local: "2026-09-01T08:00:00Z", moving_time: 7200, distance: 20000, total_elevation_gain: 500 }]));
  writeFileSync(strava, JSON.stringify([{ id: "s1", name: "Long run", sport_type: "Run", start_date: "2026-09-01T08:02:00Z", moving_time: 7210, distance: 20100, total_elevation_gain: 505 }]));
  const result = spawnSync(process.execPath, [join(root, "scripts/sync-activity-memory.mjs"), "--intervals", intervals, "--strava", strava, "--through", "2026-09-01"], {
    cwd: directory, encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { status: "verified", through: "2026-09-01", records: 1, created: 1 });
  assert.match(readFileSync(join(directory, "athlete/activities/index.md"), "utf8"), /2026-09/);
  assert.match(readFileSync(join(directory, "athlete/profile.md"), "utf8"), /2026-09-01/);
  assert.equal(JSON.parse(readFileSync(join(directory, ".switchback/activity-memory-sync.json"), "utf8")).through, "2026-09-01");
});
