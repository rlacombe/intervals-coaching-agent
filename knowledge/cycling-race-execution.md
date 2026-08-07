# Cycling Race Execution

## Summary
`race-execution.md` is trail-ultra race craft — aid stations, cutoffs, crew,
DNFs. A century, a gran fondo, a brevet, a time trial, or a road race is a
different problem, and it has one enormous advantage over every other endurance
event: **the pacing instrument is objective and available in real time.** A
runner has to infer effort; a cyclist can read the number that determines
whether the day works. The consequence is that bike events are rarely lost to
mysterious fatigue. They are lost to a specific, measurable error — riding the
first hour and the early climbs too hard — and that error is visible on the
head unit as it happens.

The second theme is that a great deal of cycling race execution is not
physiological at all. Drafting is worth a quarter to a third of the energy cost,
stops eat the time budget on long events, and a mechanical you cannot fix ends
the day regardless of fitness. Those are preparation problems, and they are
cheaper to solve than fitness.

## Key Concepts

### Normalized Power, Intensity Factor, and Variability Index
Three numbers do most of the work.

- **Normalized power (NP)** weights the ride toward the harder moments, because
  the physiological cost of surging is disproportionate to the extra watts.
  A ride averaging 200 W with constant surges may carry the cost of a steady
  230 W.
- **Intensity factor (IF)** is NP divided by FTP — the single number describing
  how hard a ride was relative to the rider.
- **Variability index (VI)** is NP divided by average power. It measures how
  evenly the ride was paced. A flat time trial should read close to 1.00. A
  hilly gran fondo might read 1.10–1.15. **A VI above about 1.2 on an event
  where the rider intended to pace evenly is a diagnosis: they surged, and they
  paid for it.**

### Target Intensity Factor by Duration
The most useful table in the file. These are targets for the whole event, not
for good moments within it.

| Event duration | Target IF | Typical event |
|---|---|---|
| < 30 min | 1.05+ | Short time trial, hill climb |
| 30–70 min | 0.95–1.05 | 40 km time trial |
| 1–2 h | 0.85–0.95 | Criterium, short road race |
| 2–3 h | 0.80–0.85 | Road race, hard gran fondo |
| 3–4 h | 0.75–0.80 | Century at effort, 70.3 bike leg sits at the low end |
| 4–6 h | 0.70–0.75 | Hard century, hilly gran fondo |
| 6–10 h | 0.65–0.70 | Long gran fondo, 200 km brevet, Ironman bike sits below this |
| 10 h+ | 0.55–0.65 | 300 km+, multi-day. See `multiday-events.md` |

Two notes. Triathlon bike targets sit **below** the equivalent standalone
figures, because the run has to follow — see `triathlon.md`. And for any event
where the rider intends to finish strong, subtract 0.02–0.03 from the target for
the first third.

### Kilojoules Are Calories
A convenient physiological coincidence: human cycling efficiency is roughly 20–25%,
so the mechanical work in kilojoules and the metabolic cost in kilocalories come
out close to 1:1. **A 3,000 kJ ride costs about 3,000 kcal.**

This makes fuelling arithmetic unusually easy on the bike. A rider who knows a
century will be around 3,000 kJ, and who is taking in 90 g/h of carbohydrate
(360 kcal/h) over five hours, knows they are replacing about 1,800 of 3,000 —
a manageable deficit. The same rider taking 30 g/h is not fuelling a bike race;
they are rationing. See the discipline table in `nutrition.md`.

Kilojoules are also the honest measure of how big a ride was. Two riders both
"did a century," and one did 2,200 kJ and the other 3,600.

### The First Hour Is the Whole Race
Nearly every badly executed bike event is decided in the first 45 minutes, for
reasons that are social rather than physiological: a mass start, fresh legs,
adrenaline, and a group riding above what any individual would choose. Power
that feels trivially easy at minute twenty is the power that ends the day at
hour four.

The practical rule: **set a hard ceiling for the first 30–45 minutes** — no more
than the target IF, and ideally slightly under — and accept losing the wheel of
a group that is going too fast. On a long event they will come back.

### Climbs Are Where the Ceiling Breaks
Power naturally rises on a climb because the rider has no ability to coast and
every incentive to keep up. This is where the day is over-spent.

- **Set a climb-specific ceiling** in watts, and treat it as a rule rather than
  a target. Something like target IF + 0.10 for a climb under 20 minutes, and
  target IF + 0.05 for anything longer.
- **Do not chase on climbs.** Gaps close on the flat and on descents at a
  fraction of the metabolic cost.
- **Gearing is a pacing tool.** A rider who cannot spin their climbs will
  over-power them whatever the plan says. Choose the gearing for the course, not
  for the ego. See `cycling-injury-bike-fit.md` for the joint consequences.

### Descents and Flats Are Free Speed
The corollary nobody executes: time gained on a descent costs nothing
metabolically, and most amateurs give it away. Pedalling through the top of a
descent, holding an aerodynamic position, and cornering with confidence are all
free. Handling is trainable and is one of the few areas where an hour of
practice returns more than an hour of training.

### Drafting Is the Largest Single Variable
Sitting in a group saves roughly 25–40% of the power required at the same speed,
depending on position, group size, and speed. Nothing else in cycling race
execution comes close.

- **Find a group and keep it.** On a gran fondo or a long brevet, riding with
  others is worth more than any fitness difference between reasonable
  candidates.
- **The cost is surges.** A group's pace is variable, and a rider hanging on at
  the back does more above-threshold work than a solo rider going the same
  average speed. Watch VI. If the group is spiking the rider repeatedly, the
  saving has been spent.
- **Position matters:** middle of the group, not the back, where the accordion
  effect is worst.
- **Know the rules.** Drafting is illegal in most non-draft triathlon and in
  time trials, with defined distances and penalties.

### The Time Budget on Long Events
On brevets and long gran fondos, the constraint is **elapsed time, not moving
time**, and this is the mistake that fails riders who were fit enough.

A 200 km brevet with a 13.5-hour limit at 22 km/h moving gives just over nine
hours of riding and about four hours of margin. Four hours sounds enormous until
it is spent in four control stops, two mechanicals, a wrong turn, and a long
lunch. Randonneurs put it simply: **control your controls.** Decide before the
start what each stop is for and how long it gets.

- Aim for stops of 5–10 minutes, not 20
- Eat while riding; use stops for bottles and the bathroom
- Have the next stop's plan decided before arriving at this one
- Track elapsed-time margin against control cutoffs, not average speed

See `multiday-events.md` for events spanning more than a day.

### Fuelling and Hydration on the Move
The bike is the easiest discipline in which to fuel and the one where
under-fuelling is most punished, because the event is long and the gut works.

- **Carry capacity is the planning variable:** two bottles is roughly 1.5 L,
  which is one to two hours in heat. Know where the water is before starting.
- **Start eating in the first 30 minutes**, before hunger and before the first
  climb. Fuelling deficits are almost impossible to reverse mid-event.
- **Solid food early, liquid late.** Gut tolerance declines through a long day.
- **Rehearse the exact plan** on a long training ride at event intensity. See
  `nutrition.md`.
- **Sweat losses are underestimated on the bike** because the airflow evaporates
  them. See the discipline section in `heat-altitude.md`.

### Mechanicals and Self-Sufficiency
The difference between a five-minute inconvenience and a day-ending failure is
preparation, and this is uniquely a cycling concern.

- Carry two tubes or a plug kit plus one tube, tyre levers, a pump or CO2 with a
  spare, a multitool, a quick link, and a spare derailleur hanger on a long
  event
- **Practise a tyre change before the event**, in the cold, with gloves on. A
  rider who has never done one under pressure will discover it at the worst time
- Know whether the event is supported, neutral-support, or fully self-supported.
  Brevets and most gravel events are self-supported by rule, and asking for
  outside help can be a disqualification

### Position Over Hours
A position that is comfortable for two hours can be intolerable at five, and
the failure is neck, hands, and lower back rather than legs.

- Change hand position on a schedule, not when it hurts
- Stand briefly every 10–15 minutes on long events
- For a time trial or triathlon, **the only power that counts is power in the
  aero position** — train in it, and if position cannot be held for the event
  duration, it is the wrong position
- See `cycling-injury-bike-fit.md`

### When It Goes Wrong
The ADAPT framework in `race-execution.md` transfers unchanged — the crisis
management of an ultra applies to a bad patch at hour six of a brevet. Two
cycling-specific additions: a bad patch is very often fuelling, and eating
before diagnosing costs twenty minutes and fixes it more often than not; and
unlike running, a cyclist can soft-pedal at almost zero cost while they sort
themselves out. Use that. There is no equivalent of walking a runner out of a
bad patch that is as cheap as sitting on a wheel and eating.

## What the Experts Say

### Hunter Allen & Andrew Coggan
- **Pace by normalized power, not average power or heart rate.** Heart rate
  drifts with heat and fatigue and is useless as a ceiling late in a long event.
- **Intensity factor targets by duration** are the foundation of power-based
  race planning, and the source of the table above.
- **Variability index as a post-race audit.** A high VI on an event that should
  have been steady tells the rider exactly what to change.

### Joe Friel
- **Rehearse the race in training**, including nutrition, position, and pacing —
  the fitness is the easy part.
- **Prioritize events.** A season with four A races has no A races.
- **Masters riders:** the pacing error costs more with age because the recovery
  from an early over-effort is slower within the same ride.

### Chris Carmichael / CTS
- **Race-specific preparation in the final weeks**, matched to the actual demands
  — repeated hard efforts for a road race, sustained tempo for a fondo.
- **The time-crunched rider must pace more conservatively**, not less, because
  they have less durability to absorb an early mistake.

### The randonneuring / audax tradition
- **Control your controls.** The event is elapsed time and the stops are where
  it is lost.
- **Steady, unglamorous pacing** — the culture is explicitly anti-heroic, and
  finishing within the limit is the whole objective.
- **Self-sufficiency is the sport**, not an inconvenience within it.

### Road racing tradition
- **Position in the bunch is free energy**, and moving up costs less before a
  climb than during one.
- **Races are won by conserving until a decisive moment**, which is the opposite
  instinct to a time trial and is why riders who are strong at one are often
  poor at the other.

## Where They Agree
1. **Power is the pacing instrument**; heart rate is a poor ceiling and RPE
   drifts optimistic when fresh.
2. **The first hour is where the event is lost.**
3. **Fuel from the start.** No source supports waiting for hunger.
4. **Drafting is worth more than fitness differences** between comparable riders.
5. **Rehearse everything** — nutrition, position, kit, and the tyre change.
6. **Climbs are where the plan breaks** and need their own explicit ceiling.

## Where They Disagree

### Even Pacing vs Variable Pacing on Rolling Terrain
- **Even-power camp:** hold a constant power; it is simplest and metabolically
  cheapest.
- **Variable-pacing camp:** for a fixed metabolic cost, pushing harder uphill and
  easing on descents is *faster*, because time is spent disproportionately on
  the slow parts of the course. The physics is not in dispute.
- **Where it lands:** variable pacing is genuinely faster on rolling courses, but
  the optimal variation is smaller than riders think, and it costs more glycogen.
  Deliberate, bounded variation — roughly ±5–10% around target on rolling
  terrain — captures most of the benefit. Uncontrolled variation captures none of
  it and all of the cost.

### Whether to Ride in a Group
- **Energy view:** always. A third of the power is a third of the power.
- **Pacing view:** a group that surges will drag a rider above their target IF
  repeatedly, and the drafting saving is spent on the accelerations.
- **Resolution:** ride with a group that is going roughly the right speed, and
  let go of one that is not. The discipline required is letting a fast group go
  in the first hour.

### How Aggressive to Be Early on Climbs
- **Racing view:** climbs are where selections happen; being conservative means
  being dropped and then riding alone.
- **Pacing view:** an early climb ridden at threshold costs more than being alone
  later.
- **Depends entirely on whether the rider is competing or completing**, and that
  question should be settled before the start rather than on the first gradient.

## Coaching Decision Tree

### Step 1: Classify the event
Competing or completing? Supported or self-supported? Drafting legal? Elapsed-time
cutoffs or none? These four answers determine everything downstream, and riders
routinely do not know all four.

### Step 2: Estimate the numbers before the start
Duration, target IF, expected kilojoules, and therefore the fuelling plan in
grams per hour and the fluid plan in bottles per hour. Write them down. A rider
with a number to hold will over-pace less than one riding on feel.

### Step 3: Set three ceilings
- **First 45 minutes:** at or slightly below target IF
- **Climbs:** target IF plus a defined margin, as a rule not a target
- **Any single effort:** an absolute watt ceiling above which the rider simply
  does not go, regardless of what the group is doing

### Step 4: Plan the stops
For anything over four hours: where, how long, what happens at each. On a brevet,
against the control cutoffs with margin tracked in elapsed time.

### Step 5: Rehearse
One long ride at event intensity with the exact nutrition, kit, and position.
Plus a tyre change. The rehearsal ride is also the last chance to discover that
the position does not hold for the duration.

### Step 6: Execute, and check VI afterwards
Post-event, look at IF against target, VI against intent, kilojoules against the
fuelling actually taken, and where the power spiked. Nearly every lesson is in
those four numbers, and they are more useful than how the rider felt.

## Sources & Further Reading

### Books
- *Training and Racing with a Power Meter* — Hunter Allen & Andrew Coggan ([Amazon](https://www.amazon.com/Training-Racing-Power-Meter-Allen/dp/1937715930)) — NP, IF, VI, and the pacing-by-duration framework
- *The Cyclist's Training Bible* — Joe Friel ([Amazon](https://www.amazon.com/Cyclists-Training-Bible-Worlds-Comprehensive/dp/1937715825))
- *The Time-Crunched Cyclist* — Chris Carmichael & Jim Rutberg

### Articles & Resources
- [Randonneurs USA — rules and control procedures](https://rusa.org/) — brevet structure, cutoffs, self-sufficiency
- [Audax UK](https://www.audax.uk/) — the long-distance tradition and its pacing culture
- [TrainingPeaks — pacing by intensity factor](https://www.trainingpeaks.com/) — IF targets by event duration
- [Empirical Cycling podcast](https://www.empiricalcycling.com/) — durability and its relationship to late-event pacing
