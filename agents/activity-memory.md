# Activity Memory Procedure

Activity memory is enabled by default. Use this procedure after a review unless `athlete/profile.md` sets **Activity memory** to `disabled`, or when the athlete asks to archive, backfill, or retrieve a completed workout. An explicit archive request always proceeds.

1. Identify the activity or requested date range. Prefer Intervals.icu when it is configured; otherwise use Strava. When both providers describe the same physical session, create one record with both source IDs rather than duplicates.
2. Fetch compact activity detail. Retrieve streams only for a concrete analysis, such as heart-rate decoupling or climbing pacing. Do not retrieve route coordinates unless the athlete explicitly requests route analysis.
3. Create or update `athlete/activities/YYYY/MM/YYYY-MM-DD--provider--activity-id.md` using `athlete/activity-note.example.md`.
4. Retain source IDs, local start time and timezone, sport type, distance, duration, elevation, pace or speed, heart rate, training load, power/cadence, perceived exertion, gear, athlete-authored description when relevant, and short plan/execution/assessment sections.
5. Preserve manually written narrative in an existing record. Put cross-workout patterns in `athlete/notes.md` only when they are durable; activity-specific observations stay with the activity.
6. Do not retain GPX/TCX/FIT files, GPS coordinates, raw streams, or third-party comments and kudos. Those remain provider-side and are retrieved transiently only when useful and permitted.
7. For a first historical backfill, ask the athlete to choose a lookback period (for example 1, 3, 6, or 12 months) before querying provider history. Never silently choose a period. Record the selected period and completion date in `athlete/profile.md`.
8. Report the record path and whether it was created or updated. For a date range, report the count and any duplicate sessions reconciled.

See `docs/activity-memory.md` for the rationale and retention policy.
