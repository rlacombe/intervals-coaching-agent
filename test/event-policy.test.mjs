import assert from "node:assert/strict";
import test from "node:test";
import { eventExternalId, normalizeEvent, sameEvent } from "../src/event-policy.mjs";

test("event policy validates and normalizes writes", () => {
  assert.deepEqual(normalizeEvent({ name: "Easy run", start_date_local: "2026-09-09" }), {
    name: "Easy run", start_date_local: "2026-09-09T00:00:00", category: "WORKOUT",
  });
  assert.throws(() => normalizeEvent({ name: "", start_date_local: "tomorrow" }), /name/);
  assert.throws(() => normalizeEvent({ name: "Run", start_date_local: "tomorrow" }), /YYYY-MM-DD/);
  assert.throws(() => normalizeEvent({ name: "Run", start_date_local: "2026-02-30" }), /invalid calendar date/);
  assert.throws(() => normalizeEvent({ name: "Run", start_date_local: "2026-09-09", distance: -1 }), /distance/);
  assert.throws(() => normalizeEvent({}, { partial: true }), /changed field/);
});

test("event policy validates documented structured workout syntax", () => {
  assert.doesNotThrow(() => normalizeEvent({ name: "Tempo", start_date_local: "2026-09-09", description: "Warmup\n- 10m ramp Z1-Z2 HR\n\nMain Set 3x\n- 8m 90-95% LTHR\n- 3m Z1 HR\n\nStrides 4x\n- 20s 95% Pace 90-95rpm\n- 40s Z1 HR" }));
  assert.doesNotThrow(() => normalizeEvent({ name: "Tempo", start_date_local: "2026-09-09", description: "Main Set\n- Climb hard 1km 8:30/mi Pace" }));
  assert.throws(() => normalizeEvent({ name: "Tempo", start_date_local: "2026-09-09", description: "Warmup\n- 10m easy" }), /exactly one quantitative target/);
  assert.throws(() => normalizeEvent({ name: "Tempo", start_date_local: "2026-09-09", description: "Warmup\n- 10m Z1 HR Z1 Pace" }), /exactly one quantitative target/);
});

test("event policy validates standalone structured sections", () => {
  assert.throws(() => normalizeEvent({
    name: "Strides",
    start_date_local: "2026-09-09",
    description: "Strides 4x\n- 20s easy",
  }), /quantitative target/);
});

test("calendar idempotency includes workout content", () => {
  const base = { name: "Easy run", start_date_local: "2026-09-09T08:00:00", category: "WORKOUT" };
  assert.equal(sameEvent({ ...base, moving_time: 3600 }, { ...base, moving_time: 7200 }), false);
});

test("calendar idempotency uses a stable content key", () => {
  const event = normalizeEvent({ name: "Easy run", start_date_local: "2026-09-09", moving_time: 3600 });
  assert.equal(eventExternalId(event), eventExternalId({ ...event }));
  assert.notEqual(eventExternalId(event), eventExternalId({ ...event, moving_time: 7200 }));
  assert.equal(sameEvent({ external_id: eventExternalId(event) }, { external_id: eventExternalId(event) }), true);
});

test("event policy identifies duplicate calendar writes", () => {
  assert.equal(sameEvent(
    { name: "Easy run", start_date_local: "2026-09-09T08:00:00", category: "WORKOUT" },
    { name: "Easy run", start_date_local: "2026-09-09T08:00:00", category: "WORKOUT" },
  ), true);
});
