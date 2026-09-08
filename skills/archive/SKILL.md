---
description: Archive or backfill compact records of completed activities
user-invocable: true
---

# Archive Activity Memory

Follow `agents/memory-policy.md`, `agents/activity-memory.md`, and
`athlete/activity-note.example.md`. An explicit archive request proceeds even
when automatic activity memory is disabled.

For a named activity, retrieve it directly. For first historical backfill, ask
the athlete to choose 1, 3, 6, or 12 months; do not choose or query a historical
range silently. For incremental sync, use the stored synchronization date and
query through today.

Use `get_activities` or `get_strava_activities` for listings, then
`get_activity` or `get_strava_activity` for compact detail. If both providers are
used, pass their complete listing results to `switchback memory sync`; otherwise
pass the available provider result. Keep temporary synchronization inputs outside
`athlete/` and remove them after a verified sync.

Reconcile duplicate provider records as one session. Store provenance, local
time, metrics, athlete report, derived metrics, and labeled hypotheses or
decisions. Preserve manually written narrative. Exclude GPX, coordinates, raw
streams, and third-party content by default. Update synchronization state only
after successful writes, then report records created, updated, or reconciled.
