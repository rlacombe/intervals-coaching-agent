import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { validateActivityNote } from "../src/activity-note-policy.mjs";

test("activity note template has provenance and labeled interpretation", async () => {
  const note = await readFile(new URL("../athlete/activity-note.example.md", import.meta.url), "utf8");
  assert.equal(validateActivityNote(note), true);
});

test("activity note validation rejects coordinates and unlabeled assessments", () => {
  const note = `---\nid: strava:x\nprovider: strava\nsource_activity_ids: ["strava:1"]\nstart_date_local: 2026-01-01T08:00:00Z\nretrieved_at: 2026-01-02T08:00:00Z\nrecord_status: current\nroute_retained: false\n---\n## Decision\ncoordinates: 1,2`;
  assert.throws(() => validateActivityNote(note), /coordinates/);
  assert.throws(() => validateActivityNote(note.replace("## Decision", "## Assessment").replace("coordinates: 1,2", "text")), /label/);
});

test("activity note validation rejects invalid structured metadata", () => {
  const note = `---\nid: strava:x\nprovider: strava\nsource_activity_ids: []\nstart_date_local: yesterday\nretrieved_at: 2026-01-02T08:00:00Z\nrecord_status: current\nroute_retained: false\n---\n## Decision\nRest.`;
  assert.throws(() => validateActivityNote(note), /source_activity_ids/);
});

test("activity note validation reads legacy singular source IDs", () => {
  const note = `---\nid: strava:x\nprovider: strava\nsource_activity_id: 1\nstart_date_local: 2026-01-01T08:00:00Z\nretrieved_at: 2026-01-02T08:00:00Z\nrecord_status: current\nroute_retained: false\n---\n## Decision\nRest.`;
  assert.equal(validateActivityNote(note), true);
});
