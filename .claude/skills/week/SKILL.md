---
description: "Weekly summary — volume by discipline, compliance, fitness trend, and next week preview"
user-invocable: true
---

# /week — Weekly Summary

1. Determine the current week (Monday–Sunday). Read `knowledge/volume-progression.md` for safe ramp rates and recovery week guidelines, and `knowledge/periodization.md` for training phase context.
2. Fetch data using MCP tools (call them directly, in parallel where possible):
   - Activities endpoint for this week
   - Events endpoint for this week (planned)
   - Activities endpoint for last week (for comparison)
   - Events endpoint for next week (preview)
   - Fitness endpoint for the last 14 days (trend)
3. **Group by discipline before summarising.** A single mileage total is
   meaningless for anyone who does more than one sport — 40 km of running and
   40 km of cycling are not comparable quantities. Report each discipline in its
   own natural unit, and use training load as the only cross-sport total.

   | Discipline | Report |
   |---|---|
   | Run | distance, time, elevation |
   | Bike | distance, time, elevation, average power if available |
   | Swim | distance, time |
   | Strength, court sports, martial arts, dance | sessions and time |
   | Walking | distance and time, listed separately from training |

4. Display:
   - **This Week — by discipline:** a row per sport with its volume, time, and training load, then a total row carrying time and load only.
   - **Sessions:** completed vs planned, and the compliance rate.
   - **vs Last Week:** change per discipline (absolute and %), plus the change in total load. Flag any discipline up more than 10%, *and* flag total load up more than 10% even when no single sport is.
   - **Fitness Trend (14-day):** fitness, fatigue, and form with current values and direction.
   - **Next Week Preview:** upcoming planned sessions by day with sport and duration, plus planned volume per discipline.
5. End with a brief coaching note on the week, grounded in training science:
   - If any discipline or the total increased >10%: flag per `knowledge/volume-progression.md`
   - If compliance is low: consider whether it signals fatigue per `knowledge/recovery-overtraining.md`
   - Preview next week in the context of periodization principles from `knowledge/periodization.md`
   - For a multisport athlete, comment on the *balance* as well as the total — whether the allocation matches the goal. `triathlon.md` has the reference split for three-sport athletes; `cycling-endurance.md` and `swimming.md` cover single-discipline emphasis.

**Do not treat non-running work as "cross-training."** Cycling is cycling and
swimming is swimming. For most athletes with a load-sensitive joint, the bike
*is* the aerobic backbone rather than a supplement to running. Describe each
discipline on its own terms and let the athlete's goals decide which one is
primary.
