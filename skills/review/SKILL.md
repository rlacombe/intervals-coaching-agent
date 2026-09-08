---
description: Compare a completed workout with its plan and preserve useful evidence
user-invocable: true
---

# Review a Workout

## Minimum evidence
Identify the requested activity. Retrieve its compact detail and the matching
planned event; use both providers only when each adds material evidence. Read the
profile, relevant activity memory, and the knowledge chapter for the workout's
purpose. Retrieve streams only for a defined analysis such as pace drift,
heart-rate decoupling, intervals, or climbing.

Use `get_activities` or `get_strava_activities` to identify the session, then
`get_activity` or `get_strava_activity` for detail. Use `get_event` for the full
planned prescription. Request only the stream types needed for the named analysis.

## Analysis
Count duplicate provider records once. Distinguish planned and completed values.
Report material differences in distance or time, elevation, intensity, and load;
use 10% as a review trigger interpreted in context. Verify units and calculations.
Separate provider facts, athlete narrative, derived metrics, and hypotheses.

## Output and memory
Explain whether the workout served its purpose, what the evidence supports, what
remains uncertain, and what should change next. Avoid unsupported praise or
diagnosis. When activity memory is enabled, archive the workout using
`agents/activity-memory.md` and the activity template. Preserve athlete-written
text and label the companion assessment as a hypothesis or decision where
appropriate.
