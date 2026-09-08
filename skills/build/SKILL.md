---
description: Build workouts or training plans from athlete evidence and race demands
user-invocable: true
---

# Build Training

## Trigger
Use for one workout, a week, or a multi-week training block.

## Minimum evidence
Read profile, goals, preferences, relevant memory, existing calendar, recent
completed training, and current wellness. For progression, establish the latest
and preceding complete weeks plus a four-week baseline; use at least 42 complete
days for chronic-load claims. Retrieve zones, race demands, weather, and
availability when relevant. Use forecasts only for dates covered by
`get_weather`; treat later conditions as uncertainty rather than a forecast.

Use `get_events`, `get_activities`, `get_wellness`, and `get_fitness` for the
required windows. Use `get_athlete` when profile zones are missing or stale and
`get_weather` with profile coordinates for forecast-range sessions.

## Knowledge
Select only the chapters needed for the requested phase and workout type. Common
choices are periodization, volume progression, workout types, long runs,
strength, or muscular endurance. Treat heuristics as defaults requiring context.

## Design
State the training objective and constraints. Verify volume, vertical gain,
intensity distribution, recovery, duration, and calendar conflicts. Use athlete
history before generic templates. If evidence cannot support a precise target,
give a labeled range or ask for the missing fact.

## Action
Present a summary before daily detail. Include every workout's purpose, estimated
duration, intensity, and alternatives. For Intervals.icu writes, read
`knowledge/intervals-icu-workout-syntax.md`, validate every step, obtain
authorization under the contract, write, and read back. With Strava alone,
provide portable workout text. Preserve accepted plans and material rationale.
