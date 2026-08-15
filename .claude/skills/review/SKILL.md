---
description: "Post-workout analysis — compare planned vs actual for most recent activity"
user-invocable: true
---

# /review — Post-Workout Analysis

1. Get today's date. Read `knowledge/workout-types.md` to understand the purpose and targets of the workout type being reviewed. For long runs, also read `knowledge/long-runs.md`. For intervals, also read `knowledge/aerobic-base.md`.
2. Fetch data using MCP tools (call them directly, in parallel where possible):
   - Intervals.icu activities endpoint for the last 3 days, if configured; otherwise Strava activities for the same period
   - Intervals.icu events endpoint for the last 3 days when available, to find a matching planned workout
   - If both providers report the same session, treat it as one physical activity, not two workouts.
3. Identify the most recent activity and fetch its details. Use Intervals.icu interval data where available; use Strava detail for athlete-authored notes, perceived exertion, and gear when relevant. Do not fetch Strava comments unless the athlete asks about them.
4. Display:
   - **Workout Summary:** Name, type, date
   - **Planned vs Actual table:**
     | Metric | Planned | Actual | Diff |
     |--------|---------|--------|------|
     | Distance (mi) | | | |
     | Duration | | | |
     | Avg Pace (min/mi) | | | |
     | Elevation (ft) | | | |
   - **Heart Rate:** Avg, max, time in zones (if available)
   - **Cadence:** Avg (if available)
   - **Intervals/Laps:** Key splits if interval data exists
   - **Training Load:** load/TSS from the activity
5. If the activity warrants deeper analysis (tempo runs, intervals, long runs over 2 hours), use the activity streams endpoint to examine:
   - **Pace drift:** Compare first-half vs second-half average pace from `velocity_smooth`
   - **HR decoupling:** Compare pace:HR ratio in first half vs second half (decoupling > 5% suggests aerobic ceiling was reached)
   - **Elevation profile:** Correlate altitude changes with pace/HR to assess climbing efficiency
   Only fetch streams when the analysis would add value — not for every easy run.
6. Flag any planned-vs-actual deviations > 10%
7. One-line coaching note on the workout execution, grounded in the training science from the knowledge base (e.g., reference HR decoupling thresholds from `knowledge/aerobic-base.md`, or pacing principles from `knowledge/long-runs.md`)
8. Read the **Activity memory** preference in `athlete/profile.md`. It is enabled by default. Unless the athlete has set it to `disabled`, archive the reviewed activity using the `/archive` schema. Write `athlete/activities/YYYY/MM/YYYY-MM-DD--provider--activity-id.md` with a compact metrics snapshot, athlete-authored note if relevant, plan/execution comparison, and companion assessment. Never store GPX, GPS coordinates, raw streams, or third-party comments. Preserve any manually edited narrative in an existing note.
