---
description: "Archive reviewed activities as compact, source-linked Markdown memory"
user-invocable: true
---

# /archive — Activity Memory

Archive one activity or a requested date range into compact Markdown notes under `athlete/activities/YYYY/MM/`. This is a user-owned retrieval layer, not a raw-data mirror. An explicit `/archive` request always proceeds, even if automatic activity memory has been disabled.

1. Determine the requested activity or date range. Use Intervals.icu if available; otherwise use Strava. If both report the same session, archive one note with both source IDs rather than duplicate the activity.
2. Fetch the activity detail. Use streams only if needed to answer a specific question. Do not request route coordinates unless the athlete explicitly asks for route analysis.
3. Create or update the note at `athlete/activities/YYYY/MM/YYYY-MM-DD--provider--activity-id.md` using `athlete/activity-note.example.md` as the schema.
4. Retain: source ID, timestamp/timezone, sport type, distance, duration, elevation, pace/speed, heart rate, load, power/cadence, perceived exertion, gear, the athlete-authored description when relevant, and a concise plan/execution/assessment section.
5. Do not retain GPX/TCX/FIT files, GPS coordinates, raw streams, or third-party Strava comments. Record only that streams are available from the provider. Do not overwrite an athlete's manually edited narrative sections.
6. Put a pattern into `athlete/notes.md` only when it is durable across activities; an activity-specific observation stays in that activity note.
7. For a first-time backfill, ask the athlete for the desired lookback period before fetching: for example, 1, 3, 6, or 12 months. Do not choose a period or archive historical activities silently. After completion, record the selected period and completion date in `athlete/profile.md` under **Activity-memory backfill**.
8. Report the paths created or updated and the count of activities archived.
