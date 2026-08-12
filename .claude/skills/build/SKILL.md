---
description: "Build structured workouts and training plans, then add them to your Intervals.icu calendar"
user-invocable: true
---

# /build — Build & Schedule Workouts

The user will describe what they need (e.g., "plan next week", "build a 4-week block", "create a long run for Saturday", "I need a tempo workout tomorrow").

## Step 0: Establish the sport

**Do this before anything else.** Every later step branches on it, and the
wrong assumption produces a workout the watch cannot enforce.

- If the request names a sport ("tempo ride", "CSS set", "long run"), use it.
- If it does not, infer from the athlete's calendar and recent training rather
  than defaulting to running. An athlete whose last four weeks are 80% cycling
  is asking for a bike workout unless they say otherwise.
- If it is genuinely ambiguous, ask. One short question beats a wasted plan.

Then **check that the sport's zones are actually configured** before designing
anything. `athlete/profile.md` caches them; `get_athlete` refreshes.

| Sport | Required for percentage targets | If missing |
|---|---|---|
| Run | `threshold_pace` | `% Pace` resolves against nothing — use HR zones, and say why |
| Bike | `ftp` | `% Power` resolves against nothing — use HR zones, and say why |
| Swim | swim pace zones | Prescribe distance and rest only, without zone targets |

Say so plainly when a zone set is missing, and suggest the test that would fix
it — a 20-minute FTP test, a threshold-pace test, or the 400/200 Critical Swim
Speed protocol in `swimming.md`. Do not silently emit targets that resolve to
nothing.

## Step 1: Read knowledge base

Always read:
- `knowledge/periodization.md` — phase structure, block design, intensity ordering
- `knowledge/volume-progression.md` — safe ramp rates, recovery week placement
- `knowledge/intervals-icu-workout-syntax.md` — the parser rules (see Step 4)

Then read for the sport in question:

| Building | Read |
|---|---|
| Running | `workout-types.md`, `long-runs.md` (long runs), `muscular-endurance.md` (ME sessions) |
| Cycling | `cycling-workouts.md` — the session library; `cycling-endurance.md` for power zones, sweet spot vs polarized, durability |
| Swimming | `swim-workouts.md` — set construction and notation; `swimming.md` for CSS and open-water specifics |
| Triathlon | `triathlon.md` — hour allocation, bricks, bike Intensity Factor by distance |
| Multi-day / stage events | `multiday-events.md` — back-to-back progression, overnight fuelling |
| Strength alongside any of it | `strength-training.md` |

## Step 2: Gather context

Fetch data using MCP tools (call them directly, in parallel where possible):
- Fitness endpoint for the last 14 days — current CTL/ATL/TSB trend
- Activities endpoint for the last 14 days — recent training load and volume
- Events endpoint for the date range the user is asking about — existing planned workouts
- Wellness endpoint for the last 7 days — sleep, HRV, fatigue trends

## Step 3: Design the plan

Based on the user's request and the data:
- Respect current fitness level and volume progression (no >10% weekly increase)
- Follow periodization principles (easy/hard alternation, step-back weeks every 3–4 weeks)
- Use the athlete's actual zones from `athlete/profile.md` for intensity prescription
- If planning multiple weeks, include a step-back week at ~70% volume every 3–4 weeks
- Consider the race date if one is set — work backward from taper
- Check for existing events in the date range and work around them (or note conflicts)

**Ramp rate is per-discipline, but recovery is not.** The 10% rule applies to
each sport's own volume — a runner adding cycling has not violated it, but they
have added total load. Check both: each discipline's week-over-week change, and
the change in overall training load. An athlete can hold every individual sport
under 10% and still ramp their total by 30%.

Sport-specific design notes:

- **Cycling** — default the intensity target to power, not heart rate; power
  does not lag or drift. Choose the distribution from the athlete's available
  hours, not from doctrine: under ~8 h/week, sweet spot; over ~12 h/week,
  polarized. `cycling-endurance.md` argues both sides. For long-event
  preparation put efforts *late* in long rides — that is what trains
  durability, and it is invisible in any fresh test.
- **Swimming** — frequency beats duration. Three swims a week is the floor for
  holding feel for the water, four to five is where skill improves. Two long
  swims is the worst common pattern. Put technique work in the warmup while
  fresh, never at the end.
- **Triathlon** — allocate roughly 15–20% swim, 50–60% bike, 25–30% run of
  weekly hours, shifted toward the limiter. Never take run above ~35%; that is
  where injury cost climbs disproportionately. Short frequent bricks beat rare
  heroic ones — the adaptation saturates fast.
- **Multi-day events** — the specific preparation is consecutive days, not
  single long ones. Build back-to-backs progressively and rehearse the
  overnight turnaround, which is the part that actually fails.
- **Non-endurance sessions already on the calendar** (martial arts, gym
  classes, dance, court sports) still consume recovery. Read their actual
  measured load rather than assuming they are free. Check `athlete/notes.md` —
  the athlete may have a recorded intensity baseline for them.

## Step 4: Write workouts using description syntax

Build each workout's `description` field using the Intervals.icu workout text format. The API parses this to generate structured workout steps that sync to Garmin.

**Read `knowledge/intervals-icu-workout-syntax.md` before writing any workout.** It is the source of truth for the parser rules, with worked examples and a validation checklist. The short version:

- Every step starts with `- ` (dash + space).
- Every step has exactly **one** quantitative target: `Z2 HR`, `Z3 Pace`, `Z2 Power`, `88-94% Power`, `90-95% LTHR`, `250W`, etc. Never `easy`, and never two targets on one step.
- `m` means minutes. Use `mtr` for meters, `km`, or `mi`.
- Every fast interval has a paired recovery step inside the same repeat block.
- Repeats use `Nx` (e.g. `Strides 4x` as a section header).
- **Cycling has seven power zones, not five.** `Z6 Power` and `Z7 Power` are valid; `Z6 Pace` on a run is not.
- **Swim steps are distance, not time** — except rests. `100m` means 100 *minutes*; write `100mtr`.

**Canonical examples, one per sport:**

Run — easy aerobic with strides:
```
Warmup
- 5m Z1 HR

Main Set
- 30m Z2 HR

Strides 4x
- 20s 95% Pace 95rpm
- 40s Z1 HR

Cooldown
- 5m Z1 HR
```

Bike — sweet spot intervals:
```
Warmup
- 15m ramp 50-70% Power

Main Set 3x
- 12m 88-94% Power
- 5m Z1 Power

Cooldown
- 10m 55% Power
```

Swim — threshold set at Critical Swim Speed:
```
Warmup
- 400mtr Z1 Pace

Main Set 8x
- 100mtr Z4 Pace
- 15s Z1 Pace

Cooldown
- 200mtr Z1 Pace
```

The syntax file carries nine more templates covering endurance, threshold, VO2
max, durability rides with late efforts, a race-pace brick leg, and open-water
simulation. All have been validated against the live parser — prefer adapting
one over composing from scratch.

Run every workout through the validation checklist in `knowledge/intervals-icu-workout-syntax.md` before calling `create_event`. The checklist has a per-sport section; use the rows for the sport you are building.

## Step 5: Present the plan

Display each day's workout clearly:
- **Date** — Workout name
  - Type (Run, Ride, etc.), planned duration, planned distance
  - Workout description (the structured text)
  - Brief coaching rationale for the session

If planning multiple weeks, show a week-by-week summary table first, then the daily detail.

## Step 6: Wait for confirmation

Explicitly ask: **"Should I add these workouts to your calendar?"**

Do NOT call the create event endpoint until the user confirms. If they want changes, revise and show again.

## Step 7: Create events

After confirmation, for each workout call the create event endpoint with:
- `category`: `"WORKOUT"`
- `start_date_local`: the date in `YYYY-MM-DD` format
- `name`: workout name
- `description`: the structured workout text from Step 3
- `type`: sport type (e.g., `"Run"`, `"Ride"`)
- `moving_time`: planned duration in seconds (if specified)
- `distance`: planned distance in meters (if specified)

Show confirmation of all created events with their IDs.
