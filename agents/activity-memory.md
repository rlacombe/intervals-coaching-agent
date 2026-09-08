# Activity Memory Procedure

Activity memory is enabled by default. Use this procedure to synchronize newly
completed workouts during training conversations, after a review, or when the
athlete asks to archive, backfill, or retrieve an activity. Skip automatic
synchronization when `athlete/profile.md` sets **Activity memory** to `disabled`;
an explicit archive request still proceeds.

1. For incremental synchronization, read **Activity-memory last sync** from the
   athlete profile, then find the newest local activity date. Query from the
   earlier date through today and archive every missing completed workout.
   If no local baseline exists, ask the athlete to choose a lookback period
   before querying history. For a review or archive request, identify the named
   activity or date range directly.
2. Prefer Intervals.icu when configured; otherwise use Strava. When both
   providers are available, reconcile records with `switchback reconcile`: match
   start times within 15 minutes, then
   require compatible duration and distance. Create one record with both source
   IDs. Leave uncertain matches separate and flag them for review.
3. Fetch compact activity detail. Retrieve streams only for a concrete analysis,
   such as heart-rate decoupling or climbing pacing. Do not retrieve route
   coordinates unless the athlete explicitly requests route analysis.
4. Create or update
   `athlete/activities/YYYY/MM/YYYY-MM-DD--provider--activity-id.md` using
   `athlete/activity-note.example.md`.
5. Retain source IDs, local start time and timezone, sport type, distance,
   duration, elevation, pace or speed, heart rate, training load, power/cadence,
   perceived exertion, gear, relevant athlete-authored description, and short
   plan and execution sections. Label each interpretation as a derived metric,
   hypothesis, or decision.
6. Preserve manually written narrative in an existing record. Put cross-workout
   patterns in `athlete/notes.md` only when durable; activity-specific
   observations stay with the activity.
7. Do not retain GPX/TCX/FIT files, GPS coordinates, raw streams, or third-party comments and kudos. Retrieve them transiently only when useful and permitted.
8. For a first historical backfill, ask the athlete to choose a lookback period
   (for example 1, 3, 6, or 12 months). Never silently choose a period. Record the
   selected period and completion date in `athlete/profile.md`.
9. Validate each written record with
   `node scripts/validate-activity-note.mjs <path>`.
   For routine synchronization, prefer the transactional
   `switchback memory sync` command, which performs reconciliation, validation,
   index rebuilding, and checkpoint advancement under one lock.
10. After all requested records are written and validated, update **Activity-memory
   last sync** in `athlete/profile.md`. Write records first, validate them, update
   `athlete/activities/index.md` and the affected `YYYY/MM/summary.md`, then move
   the checkpoint using the lock and compare-and-swap helpers in
   `src/sync-checkpoint.mjs`. Do not advance it after a partial failure. If
   concurrent work changed the checkpoint, stop and reconcile instead of
   overwriting it.
11. Correct stale or mistaken content by marking the old record `superseded` and
   linking its replacement; honor deletion requests rather than preserving an
   unwanted record.
12. Report how many records were created or updated and any duplicate sessions
   reconciled. A single-activity operation should also report its record path.
13. Promote a cross-workout pattern only after at least two dated supporting
   activities, unless the athlete explicitly records a preference or decision.
   Store supporting IDs, confidence (`low`, `medium`, or `high`), and a review
   date. Monthly summaries link to source notes and retain no raw streams.

See `docs/activity-memory.md` for the rationale and retention policy.
