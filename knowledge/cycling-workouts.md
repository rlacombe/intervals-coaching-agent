# Cycling Workout Types

## Summary
`workout-types.md` is the running session library. This is its cycling counterpart. The distinction matters because the two sports do not share a session vocabulary: running intervals are bounded by impact tolerance and are usually prescribed by pace or effort, while cycling intervals are bounded by recovery and are prescribed by power — an instantaneous, externally measured number that makes prescription precise to the watt. The consequence is that cycling can run far shorter work intervals and far shorter recoveries than running, because there is no eccentric damage accumulating underneath. That is why the most interesting recent interval research (Rønnestad's 30/15s) comes from cycling and does not transfer cleanly to the run. The unresolved arguments are about interval *duration* — Seiler's 4×8 versus Rønnestad's micro-intervals versus the traditional 2×20 at threshold — and about how much of a week should sit in sweet spot.

## Key Concepts

### Why the Bike Library Differs from the Run Library
| | Running | Cycling |
|---|---|---|
| Limiting tissue | Muscle, tendon, bone — eccentric damage | Nothing structural; recovery and life are the limit |
| Prescription anchor | Pace or effort; heart rate on easy work | Power, essentially always |
| Feedback lag | Pace responds to terrain and fatigue | Power is instantaneous and terrain-independent |
| Shortest useful rep | ~15–30 s (strides) | 15–30 s, and repeatable dozens of times |
| Recovery between reps | Long — the muscle needs it | Short — often shorter than the work interval |
| Coasting | Impossible | Free; recovery can be genuinely zero-load |

The practical upshot: a cycling session can accumulate far more time at a high fraction of VO2max than a running session of the same duration, because the recoveries are cheap and the reps can be short.

### Interval Duration and Time-at-Intensity
The organizing question for any aerobic interval is *how much time near VO2max does this session accumulate, and at what fatigue cost*. Long reps accumulate more time per rep but fewer reps; short reps with short recoveries keep oxygen uptake elevated *through* the recovery, so total time near maximum can be higher despite less total work.

This is the whole argument between the 4×8 school and the 30/15 school, and both are defensible.

### The Session Library
Power targets are % of FTP. Zones are Coggan (see `cycling-endurance.md`).

| Session | Target | Structure | Purpose | Weekly cost |
|---|---|---|---|---|
| **Recovery spin** | <55% | 30–60 min, high cadence, flat | Blood flow, nothing else. Must be genuinely easy. | Negligible |
| **Endurance** | 56–75% | 1.5–5 h+ | Aerobic base, fat oxidation, durability. The bulk of volume. | Low per hour, high in aggregate |
| **Endurance + late efforts** | 56–75% with 2–3 × 10–20 min at 88–95% placed in the **final third** | 3–5 h | Durability — the trait that predicts long-course and multi-day performance. Efforts late, never early. | High |
| **Tempo** | 76–90% | 2–3 × 20–40 min, 5–10 min easy between | Aerobic development at higher stimulus density than endurance. The "grey zone" if it displaces both easy volume and hard work. | Moderate |
| **Sweet spot** | 88–94% | 2–4 × 12–20 min, 5 min easy between | Most FTP gain per hour. The time-crunched staple. | Moderate–high |
| **Over-unders** | Alternate 2 min at 95% / 1 min at 105% | 3–4 × 9–15 min continuous alternation, 6–8 min easy between | Tolerance of repeated lactate excursions above threshold and clearance while still working — the physiology of a rolling road race or a variable climb. | High |
| **Threshold** | 95–105% | 2 × 20, 3 × 15, or 4 × 10 min, 5 min easy between | Raises FTP directly. The most straightforward and most boring session in the sport. | High |
| **Extended threshold** (Kolie Moore school) | 88–98%, progressively lengthened | 1 × 30 → 1 × 45 → 1 × 60 min, or 2 × 30 | Raises the duration FTP can be *held* rather than the number itself. | High |
| **VO2max — long reps** | 106–120% | 4 × 8 min or 5 × 5 min, recovery equal to work | Aerobic ceiling. Seiler's preferred format. | Very high |
| **VO2max — micro-intervals** | 30 s at ~120% / 15 s easy, 13 reps = 1 series | 3 series, 3 min easy between series | Same aerobic target, more total time near VO2max, lower perceived cost. Rønnestad's format. | Very high |
| **Anaerobic capacity** | 121–150% | 6–10 × 1–2 min, recovery 2–3× work | Repeatability of hard efforts; criterium and attack fitness. Little relevance to long-course. | Very high |
| **Neuromuscular / sprints** | >150%, maximal | 6–10 × 10–15 s, full recovery (3–5 min) | Peak power, recruitment. Fresh, early in a session, never fatigued. | Low aerobically, high on the nervous system |
| **Torque / low cadence** | 90–100% at 50–60 rpm | 4–6 × 5 min, seated | Contested. See the disagreement in `cycling-endurance.md`. **Contraindicated with any patellofemoral or meniscal history.** | Moderate, joint-loading |

### Micro-Intervals in More Detail
Bent Rønnestad's format — 30 s hard / 15 s easy, 13 reps per series, 3 series — is the most-replicated recent finding in cycling interval research. Compared against a matched 4 × 5 min session in trained cyclists, the short-interval format produced greater gains in VO2max, peak power, and 40-minute power despite lower total work.

The proposed mechanism: oxygen uptake does not fall much during a 15-second recovery, so the athlete stays near maximum across the whole series rather than climbing to it repeatedly. Perceived exertion is also lower, which matters for compliance.

Caveats worth stating: the effect sizes come from well-trained cyclists in relatively short interventions, and the format has not been shown superior for *threshold* development — only for the aerobic ceiling.

### Over-Unders, and What They Are Actually For
The "under" is not recovery. It is work at a power where lactate can still be cleared, immediately after a period where it was being produced faster than clearance. The adaptation being targeted is the ability to keep working while metabolically disturbed — which is what a rolling course, a group ride, or a climb with pitches actually demands.

If the athlete finishes an over-under session having averaged threshold power, they have done a threshold session with extra suffering. The alternation has to be real.

### Progressing a Session
Three levers, applied in this order:
1. **Add reps** at the same duration and power (3 × 10 → 4 × 10)
2. **Extend the reps** at the same power (4 × 10 → 4 × 12)
3. **Raise the power** — last, and only after the first two have stabilized

Shortening the recovery is a fourth lever, and the harshest. Use it deliberately, not by accident.

### Indoor vs Outdoor Session Choice
Structured intervals belong indoors for anything shorter than about five minutes — junctions, descents, and traffic make short reps unenforceable outdoors. Long threshold and sweet spot work outdoors on a suitable climb is often better, because the effort is continuous and the motivation is higher. Endurance rides should be outdoors whenever possible; the handling and pacing skill is not otherwise trainable.

## What the Experts Say

### Bent Rønnestad (Inland Norway University; interval research)
- **Short intervals beat long reps for aerobic ceiling.** 30/15 format repeatedly outperformed matched 4 × 5 min work in trained cyclists.
- **Block periodization of high intensity:** concentrating five HIT sessions into a single week, followed by low-intensity weeks, produced better gains than distributing two per week evenly. The finding is specific to already well-trained athletes.
- **Heavy strength training improves cycling economy and late-race power** without adding mass in endurance-trained cyclists — one of the few strength-and-endurance findings with consistent replication.

### Stephen Seiler
- **4 × 8 minutes is the sweet spot of interval duration** — his group compared 4 × 4, 4 × 8, and 4 × 16 min in trained cyclists and 4 × 8 produced the best adaptation balance.
- **Intensity distribution beats session design.** Which interval you pick matters far less than whether the other 80% of the week is genuinely easy.
- **The grey zone is the failure mode:** tempo that is neither easy enough to recover from nor hard enough to drive adaptation.

### Hunter Allen & Andrew Coggan
- **Prescribe from the power-duration curve, not from a template.** A rider weak at 5 minutes and strong at 20 needs different work from the reverse, and the curve says which.
- **Quadrant analysis:** two sessions with identical training load can place entirely different neuromuscular demands depending on force and cadence. A big-gear threshold session and a spinning one are not interchangeable.

### Frank Overton / FasCat (sweet spot tradition)
- **Sweet spot is the highest-return session per hour** for athletes under about 8 weekly hours.
- Progression by extending intervals before raising power; a season built on sweet spot blocks with periodic FTP tests.

### Chris Carmichael / CTS (The Time-Crunched Cyclist)
- **High-intensity blocks produce race fitness in 6–8 weeks** for athletes under 8 hours weekly, with an explicit acknowledgment that the fitness fades fast and does not support long events.

### Kolie Moore (Empirical Cycling)
- **Train the duration, not the number.** Argues for long, sub-maximal threshold work (30–60 min continuous at 88–98%) to extend how long threshold power can be held, rather than repeatedly testing and chasing a higher FTP figure.
- Skeptical of the 20-minute test and of FTP as a single defining number.

## Where They Agree
1. **Power is the prescription anchor.** Heart rate is too slow for anything under about ten minutes.
2. **The easy work has to be easy** for any of these sessions to be absorbed. Session design cannot rescue a badly distributed week.
3. **Two hard sessions a week is the usual ceiling** for an amateur, three in a deliberate block with reduced volume around it.
4. **Progress reps and duration before power.** Chasing the wattage first is the most common self-coaching error.
5. **Specificity late.** Whatever the base phase looked like, the final 6–8 weeks should resemble the target event's demands.

## Where They Disagree

### Interval Duration for VO2max
- **Seiler:** 4 × 8 min — enough time per rep to reach and hold maximum uptake.
- **Rønnestad:** 30/15 micro-intervals — more accumulated time near maximum, lower perceived cost.
- **Traditional:** 5 × 5 min, or 3 × 3 min for the very top end.
- **Resolution:** they target the same adaptation by different routes and can be alternated across a block. Rønnestad's format is easier to complete and easier to fit outdoors on a shorter climb; Seiler's is simpler to pace. Use micro-intervals when compliance or perceived cost is the constraint, long reps when the athlete paces poorly in short efforts.

### Sweet Spot's Place
- **FasCat / time-crunched tradition:** the core of the week.
- **Seiler:** the definition of the wasted middle.
- **Resolution by hours available.** Under ~8 h/week, sweet spot; over ~12 h, polarized. See the same argument in `cycling-endurance.md` — it is the same disagreement, one level down.

### FTP as an Organizing Number
- **Coggan / mainstream:** FTP anchors every zone and should be tested regularly.
- **Moore / Empirical Cycling:** the number is unstable, protocol-dependent, and encourages testing over training. Prescribe by duration and feel within a band.
- **Practical position:** keep FTP for zone-setting, but test with one protocol consistently and stop treating a 5 W change as information.

### Whether Torque Work Does Anything
Covered in `cycling-endurance.md`. Short version: forces in cycling are far below what limits muscular strength, so any adaptation is probably neuromuscular, while the joint loading is real. Not worth the risk for a rider with knee history.

## Coaching Decision Tree

### Step 1: Establish the reference points
FTP from a consistent protocol, plus the power-duration curve. Prescribe against weaknesses in the curve, not against a generic template.

### Step 2: Set the number of hard sessions from total hours
| Weekly hours | Hard sessions | Everything else |
|---|---|---|
| < 6 | 2–3 | Sweet spot and threshold carry the week |
| 6–10 | 2 | One threshold or sweet spot, one VO2max |
| 10–15 | 2 | One threshold, one VO2max; the rest genuinely easy |
| > 15 | 2–3 | Polarized, with volume doing the work |

### Step 3: Pick the session from the phase
- **Base:** endurance, tempo, sweet spot. Neuromuscular sprints to keep the top end alive.
- **Build:** threshold and VO2max. Over-unders if the event is variable.
- **Specialty / peak:** race-specific — long steady at race intensity factor for a time trial or triathlon, repeated hard efforts for a criterium, long rides with late efforts for a tour or brevet.
- **Taper:** keep intensity, cut volume. See `taper.md`.

### Step 4: Match the session to the event, not the calendar
| Event | The session that matters |
|---|---|
| Time trial / triathlon bike | Long threshold *in the aero position*. Power held on the hoods is not the power you will have. |
| Gran fondo / climbing event | Sustained efforts at the duration of the target climbs |
| Multi-day tour or brevet | Endurance with late efforts, and back-to-back days. See `multiday-events.md` |
| Criterium / road race | Over-unders, anaerobic repeatability, sprints |
| General fitness, no event | Sweet spot and endurance. Nothing else is needed. |

### Step 5: Audit what actually happened
Compare intended time-in-zone against actual. The two common findings are easy rides that were tempo, and interval sessions where the last two reps fell below target — which means the session was over-prescribed, not that the athlete was weak.

## Writing These as Intervals.icu Workouts
Bike steps take `Power` targets, and `% Power` is a percentage of FTP. Read `intervals-icu-workout-syntax.md` before writing any of these — one target per step, `m` means minutes, and every interval needs a paired recovery step inside the repeat block.

Sweet spot:
```
Warmup
- 15m ramp 50-70% Power

Main Set 3x
- 15m 88-94% Power
- 5m Z1 Power

Cooldown
- 10m 55% Power
```

Micro-intervals (one series; repeat the block three times with 3 min easy between):
```
Warmup
- 20m ramp 50-75% Power

Series 13x
- 30s 118-125% Power
- 15s Z1 Power

Cooldown
- 10m 55% Power
```

Over-unders:
```
Warmup
- 20m ramp 50-75% Power

Main Set 4x
- 2m 95% Power
- 1m 105% Power
- 2m 95% Power
- 1m 105% Power
- 2m 95% Power
- 8m Z1 Power

Cooldown
- 10m 55% Power
```

## Sources & Further Reading

### Books
- *Training and Racing with a Power Meter* — Hunter Allen & Andrew Coggan ([Amazon](https://www.amazon.com/Training-Racing-Power-Meter-Allen/dp/1937715930))
- *The Cyclist's Training Bible* — Joe Friel ([Amazon](https://www.amazon.com/Cyclists-Training-Bible-Worlds-Comprehensive/dp/1937715825))
- *The Time-Crunched Cyclist* — Chris Carmichael & Jim Rutberg

### Articles & Podcasts
- [Empirical Cycling podcast](https://www.empiricalcycling.com/) — Kolie Moore on threshold duration and FTP testing
- [FasCat — sweet spot training](https://fascatcoaching.com/blogs/training-tips/sweet-spot-training)
- [Seiler on polarized training](https://www.trainingpeaks.com/blog/polarized-training-for-endurance-athletes/)
- Rønnestad & Hansen, *Scandinavian Journal of Medicine & Science in Sports* — short vs long intervals in trained cyclists; and Rønnestad's block-periodization studies
- Seiler, Jøranson, Olesen & Hetlelid — interval intensity and total work duration (the 4×4 / 4×8 / 4×16 comparison)
