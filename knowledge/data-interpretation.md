# Data Interpretation: Single Data Points vs. Trends

## Summary

Training data is inherently noisy. The companion's job is calm pattern recognition: one bad data point is noise, a pattern of two or three is a signal worth naming. This file provides domain-specific thresholds and a decision framework for when to mention something vs. when to wait and watch.

Cross-references `sleep.md`, `recovery-overtraining.md`, and `injury-prevention.md` for detailed protocols once action is warranted.

## The Core Principle

- Day-to-day variation in HR, HRV, pace, sleep, soreness, and motivation is normal.
- A single off reading almost never warrants a change in plan.
- Two to three consecutive readings trending the same direction warrant acknowledgment and closer monitoring.
- A sustained trend (5-7+ days, or multiple metrics converging) warrants a conversation about adjusting the plan.

The companion walks beside and notices patterns. It doesn't panic at a puddle but pays attention when the trail stays wet.

## When a Single Data Point IS Worth Flagging

Some readings are significant on their own — don't wait for a trend:

- **Acute injury signals.** Sharp, sudden pain during a run (not dull soreness). Stop and assess. Always recommend medical consultation. See the Roches' injury decision framework in `injury-prevention.md`.
- **Extreme HR anomaly.** Resting HR >10 bpm above the athlete's baseline — not 5, which is normal variation. A single reading this far out warrants a check-in.
- **Safety situations.** Dizziness, chest pain, vision changes, signs of hyponatremia or heat stroke during a run. One instance = stop immediately.
- **Illness onset.** First sign of fever, chills, or acute sickness. Johnston: "When the first signs of an illness show up, stop training."
- **Johnston's D or F workout grade.** A single D (couldn't finish / had to significantly reduce) or F (couldn't train at all) is significant on its own. See `recovery-overtraining.md`.

## Domain-Specific Thresholds

### Workout Quality

- **Noise:** A single C-grade workout (flat, off day). Happens to everyone — weather, sleep, fueling, stress, time of day all affect performance.
- **Signal:** Two consecutive Cs, or a C + D in one week. Stop and assess.
- **Source:** Johnston's workout grading in `recovery-overtraining.md`.

### HR and Pace Drift

- **Noise:** One run where pace feels harder than usual at a given HR. Weather, sleep, fueling, terrain, and time of day all affect this.
- **Signal:** HR consistently elevated 5+ bpm above baseline for the same effort across 3+ runs in a 7-day window. Or: pace declining at the same HR across 3+ comparable sessions.
- **Source:** `sleep.md` (RHR baseline); `aerobic-base.md` for HR:pace relationship.

### HRV

- **Noise:** A single low HRV reading. Uphill Athlete explicitly warns against over-relying on HRV apps due to excessive false positives.
- **Signal:** 7-day rolling average trending downward. HRV is most useful as a trend metric, not a daily decision-maker.
- **Source:** `sleep.md`; Johnston/Uphill Athlete's position on HRV apps.

### Sleep

- **Noise:** One bad night (<6 hours). Adjust intensity but proceed with easy runs.
- **Signal:** Three or more consecutive bad nights = recovery trigger. 7-day average <7 hours for 2+ weeks = chronic deficit requiring load reduction.
- **Source:** `sleep.md`, coaching decision tree section.

### Pain and Soreness

- **Noise:** Post-run muscle soreness (DOMS) that resolves within 48 hours. A single twinge that disappears during warm-up.
- **Signal:** Pain that persists beyond 48 hours. Pain that appears on consecutive days. Pain that worsens during a run rather than improving with warm-up. The Roches' rope analogy: you can lose a strand or two, but keep pulling and the whole thing unravels.
- **Single-point exception:** Sharp, sudden, localized pain during a run. This is acute and warrants immediate attention regardless of pattern. Always recommend medical consultation.
- **Source:** `injury-prevention.md`, Roches' injury decision framework.

### Motivation

- **Noise:** One day of not feeling like running. Normal human variation. The Roches' growth mindset: bad days are part of the process.
- **Signal:** Lack of motivation persisting across 3+ days. Magness: "Lack of motivation is the body telling you to back off. Don't train compulsively." Cross-reference with other metrics — if motivation is low AND sleep is poor AND workout quality is declining, the pattern is clear.
- **Source:** `recovery-overtraining.md`, Magness section.

### Performance Decline

- **Noise:** One workout where performance dips. Bad days happen.
- **Signal:** Performance declines 3-8% on 2 of the last 3 workouts. OR: feeling progressively worse during runs for 3 consecutive days. Either triggers a recovery phase.
- **Source:** `recovery-overtraining.md`; Koop Ch. 12.

## The Consecutive-Days Framework

A general heuristic when no domain-specific threshold exists:

| Days in a row | Interpretation          | Companion response                                                                     |
|---------------|-------------------------|----------------------------------------------------------------------------------------|
| 1             | Noise. Note it.         | Monitor quietly. Mention only if the athlete asks or if it's an extreme/safety value.  |
| 2             | Possible signal.        | Name it gently: "I notice [X] was off yesterday too. Worth keeping an eye on."         |
| 3+            | Signal confirmed.       | Name the pattern clearly, show the data, suggest adjustments.                          |

Some domains have specific thresholds that override this — Johnston's workout grading uses 2 Cs, Koop uses 2-of-3 workouts. Use the domain-specific threshold when one exists; fall back to the 1-2-3 framework otherwise.

## Compounding Signals

When multiple metrics trend together, the signal is stronger than any single metric:

- **Poor sleep + elevated RHR:** Stronger signal than either alone. Skip intensity, prioritize easy movement.
- **Poor sleep + declining HRV + declining workout quality:** Overtraining likely. Take a full recovery week.
- **Low motivation + declining performance + high life stress:** Reduce training load proactively.

Name the convergence: "I'm seeing three things pointing in the same direction: [X], [Y], and [Z]. Any one of these alone wouldn't concern me, but together they suggest we should ease back."

See `sleep.md` (compounding factors section) for additional combinations.

## Expert Positions

| Expert               | Key framework                                                            | Documented in              |
|----------------------|--------------------------------------------------------------------------|----------------------------|
| Johnston             | Workout grading A-F. >2 Cs in a row = stop and assess                   | `recovery-overtraining.md` |
| Johnston / House     | 3 warning signs (slow warm-up, poor sleep, injury). Any ONE = skip       | `recovery-overtraining.md` |
| Koop                 | 3-8% performance decline on 2 of last 3 workouts = recovery phase       | `recovery-overtraining.md` |
| Koop                 | Feel worse for 3 consecutive days = recovery phase                       | `recovery-overtraining.md` |
| Uphill Athlete       | HRV: 7-day rolling average, not single readings. Skeptical of HRV apps  | `sleep.md`                 |
| Sleep consensus      | Single bad night = adjust intensity. 3+ consecutive = recovery trigger   | `sleep.md`                 |
| The Roches           | Pain >1 day, worsens while running, uncomfortable walking = don't run    | `injury-prevention.md`     |
| Magness              | Lack of motivation = body telling you to back off                        | `recovery-overtraining.md` |

## Companion Decision Framework

### When reviewing a single run or data point:

1. Is this an extreme/safety value? (See "When a Single Data Point IS Worth Flagging" above.) If yes, flag it immediately.
2. If not extreme: note it internally. Do not lead with concern. If the athlete mentions it, acknowledge and normalize: "One off day is just that — an off day."

### When reviewing multiple days of data:

1. Look for patterns across 2-3+ days in any single metric.
2. Look for convergence across multiple metrics (compounding signals).
3. If a pattern exists: name it calmly, show the data, reference the relevant threshold.
4. Present options, not directives: "Here's what I'm seeing. Here are a few ways we could respond. What feels right to you?"

### Tone guidance:

- **Day 1** of an off reading: say nothing unless asked, or unless extreme.
- **Day 2:** a gentle observation. "Yesterday was off too — just noting it."
- **Day 3+:** a clear, calm statement of the pattern with a suggestion. Not alarm, not lecture. Walking beside.
