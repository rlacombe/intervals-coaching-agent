---
description: "Post-workout analysis — compare planned vs actual for most recent activity"
user-invocable: true
---

# /review — Post-Workout Analysis

1. Get today's date. Identify the activity's **sport** first — it determines which metrics matter, which knowledge file applies, and what decoupling even means.

   | Sport | Read |
   |---|---|
   | Run | `workout-types.md`; `long-runs.md` for long runs; `aerobic-base.md` for intervals |
   | Bike | `cycling-workouts.md` for what the session was meant to do; `cycling-endurance.md`; `multiday-events.md` if part of consecutive days |
   | Swim | `swim-workouts.md` for what the set was meant to do; `swimming.md` |
   | Triathlon / brick | `triathlon.md` |
2. Fetch data using MCP tools (call them directly, in parallel where possible):
   - Activities endpoint for the last 3 days (to find the most recent)
   - Events endpoint for the last 3 days (to find matching planned workout)
3. Identify the most recent activity and fetch its details from the activity endpoint (with intervals)
4. Display:
   - **Workout Summary:** Name, type, date
   - **Planned vs Actual table**, with the rows that fit the sport:

     | Sport | Rows to show |
     |---|---|
     | Run | distance, duration, avg pace, elevation |
     | Bike | distance, duration, avg and normalized power, Intensity Factor, elevation, avg speed |
     | Swim | distance, duration, avg pace per 100 |
     | Other | duration, and whatever the device recorded |

     Use the athlete's preferred units throughout — miles and min/mi, or km and
     min/km. Swim pace is always per 100 m or 100 yd.
   - **Heart Rate:** Avg, max, time in zones (if available)
   - **Cadence:** Avg (if available) — rpm on the bike, spm running, stroke rate swimming
   - **Intervals/Laps:** Key splits if interval data exists
   - **Training Load:** load/TSS from the activity
5. If the activity warrants deeper analysis (tempo efforts, intervals, anything over 2 hours), use the activity streams endpoint. What to compute depends on the sport:

   - **Run — pace:HR decoupling.** Compare the pace:HR ratio in the first half
     against the second, using `velocity_smooth` and `heartrate`. Above 5%
     suggests the aerobic ceiling was reached.
   - **Bike — power:HR decoupling.** Same idea using `watts` and `heartrate`,
     and it is the more reliable version of the measurement because power does
     not drift with heat or fatigue the way pace does. Above 5% on a steady
     endurance ride indicates the aerobic ceiling. This is also the direct
     measure of **durability** — see `cycling-endurance.md`. On a long ride,
     comparing normalized power for the last hour against the first, at matched
     perceived effort, is the single most informative number available.
   - **Swim — pace consistency across the set.** Compare per-100 splits from
     first rep to last. Rising splits mean the target was too aggressive;
     falling splits mean it was too easy.
   - **Elevation profile:** correlate altitude with pace, power, and HR to
     assess climbing. On the bike also check cadence on climbs — sustained
     low-cadence grinding matters for anyone with a knee history.

   Only fetch streams when the analysis would add value — not for every easy session.
6. Flag any planned-vs-actual deviations > 10%
7. One-line coaching note on the workout execution, grounded in the training science from the knowledge base — decoupling thresholds from `knowledge/aerobic-base.md`, pacing from `knowledge/long-runs.md`, durability and power distribution from `knowledge/cycling-endurance.md`, or set consistency from `knowledge/swimming.md`, whichever fits the sport.
