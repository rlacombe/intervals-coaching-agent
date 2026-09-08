import assert from "node:assert/strict";
import test from "node:test";
import { reconcileActivities, samePhysicalActivity } from "../src/activity-reconciliation.mjs";

const intervals = { id: "i1", start_date_local: "2026-09-08T08:00:00Z", moving_time: 7200, distance: 20000 };
const strava = { id: "s1", start_date: "2026-09-08T08:04:00Z", moving_time: 7250, distance: 20100 };

test("provider reconciliation matches one physical activity", () => {
  assert.equal(samePhysicalActivity(intervals, strava), true);
  assert.deepEqual(reconcileActivities([intervals], [strava])[0].source_ids, ["i1", "s1"]);
});

test("provider reconciliation keeps materially different activities separate", () => {
  assert.equal(reconcileActivities([intervals], [{ ...strava, start_date: "2026-09-08T12:00:00Z" }]).length, 2);
});
