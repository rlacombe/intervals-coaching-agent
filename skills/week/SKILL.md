---
description: Summarize a completed week and preview the next one
user-invocable: true
---

# Weekly Summary

Retrieve the latest and preceding complete weeks of activities, matching plans,
the next week's calendar, and available wellness and load. Use enough earlier
history to interpret progression; use at least 42 complete days for chronic-load
claims. Count duplicate provider activities once.

Use `get_activities`, `get_events`, `get_wellness`, and `get_fitness` with
explicit date ranges. If Intervals.icu is unavailable, use
`get_strava_activities` and state that wellness, load, and planned-versus-actual
analysis are unavailable.

Calculate total time or distance, elevation, relevant intensity or load,
completion, and changes from the prior week and four-week baseline. Treat a 10%
change as a review trigger, not an automatic violation. Explain the block,
recovery, material deviations, and next week's purpose. State unavailable data.
Preserve only durable patterns or accepted decisions.
