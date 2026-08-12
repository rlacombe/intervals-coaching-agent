---
description: "Deep health and readiness audit — overtraining signals, volume trends, injury risk"
user-invocable: true
---

# /check — Health & Readiness Audit

Goes deeper than `/today`'s daily snapshot. Analyzes multi-week trends to flag overtraining risk, volume ramp issues, recovery adequacy, and injury warning signs.

## Step 1: Read knowledge base

Read these coaching files for detection criteria and thresholds:
- `knowledge/recovery-overtraining.md` — FOR/NFOR/OTS stages, detection methods, warning signs
- `knowledge/injury-prevention.md` — red flags, volume ramp limits, return protocols (running; impact-injury model)
- `knowledge/cycling-injury-bike-fit.md` — for a cycling-dominant athlete: positional causes, numbness rules, bone density
- `knowledge/return-to-run.md` — if the athlete is coming back from injury or layoff: entry criteria and the 24-hour rule
- `knowledge/volume-progression.md` — 10% rule, build:recovery ratios, CTL ramp rates
- `knowledge/age-gender.md` — age/gender-specific recovery considerations

## Step 2: Gather data

Fetch data using MCP tools (call them directly, in parallel where possible):
- Wellness endpoint for the last 30 days — sleep, HRV, resting HR, fatigue, mood trends
- Fitness endpoint for the last 30 days — CTL/ATL/TSB progression
- Activities endpoint for the last 30 days — actual volume, frequency, intensity
- Events endpoint for the last 30 days — planned vs completed (compliance)
Read `athlete/profile.md` for injury history, age, known weaknesses, and cached zones.

## Step 3: Analyze

### Volume Trends
Analyse **per discipline and in total** — the two can tell different stories,
and the dangerous case is the one only visible in the total.

- Weekly volume progression over 4 weeks, per discipline — flag any sport increasing >10%/week
- Total training load progression over the same 4 weeks — flag >10%/week even when no individual sport breaches it. An athlete can hold running, cycling, and swimming each under 10% and still ramp their overall load by 30%
- Acute:chronic ratio — flag a single session generating more than ~2× current fitness. That is a race, not a training day, and it warrants race-equivalent recovery
- CTL ramp rate — flag if >5 points/week sustained
- Are recovery weeks happening? Check for step-back every 3-4 weeks
- Build:recovery ratio — is it 3:1 or 2:1? Should it be?
- **Impact load specifically.** Running and court sports carry far more injury
  risk per unit of training stress than cycling or swimming. A week where total
  load held steady but running doubled is a higher-risk week than the load
  number shows. Weight the assessment accordingly.

### Wellness Trends
- HRV trend: declining over 7+ days = concern
- Resting HR trend: rising over 7+ days = concern
- Sleep: average over 30 days, trend direction, any sustained <7h periods
- Fatigue/mood: worsening trend over 7+ days

### Overtraining Risk Assessment
Using the FOR → NFOR → OTS framework from `knowledge/recovery-overtraining.md`:
- Steve House's 3 warning signs: slow warmup, poor sleep, suspected injury (2+ = immediate rest)
- Performance decline: are recent workouts showing pace/HR regression?
- Compliance: missed workouts may indicate fatigue-driven avoidance

### Injury Risk
- Volume spike detection (acute:chronic ratio)
- Any reported soreness or pain patterns
- **Equipment and contact points, by discipline:**
  - Running — shoe mileage if tracked
  - Cycling — saddle, hands, and feet on long or consecutive days; bike fit if
    knee or back pain appears; gearing if the athlete has a knee history, since
    low-cadence grinding is the aggravating pattern
  - Swimming — shoulder load, which rises with volume and with paddle use
- **Low heart rate does not mean low joint load.** A session can be
  cardiovascularly trivial and mechanically significant — pivoting, jumping,
  and court sports all qualify. Assess the mechanical demand separately from
  the load number, particularly for an athlete with a joint history.
- Check `athlete/notes.md` for any recorded intensity baseline for the
  athlete's non-endurance activities before assuming what they cost.

## Step 4: Display

Present findings as a health report card:

**Overall Status:** Green / Yellow / Red

**Volume & Load**
- Weekly progression (table: last 4 weeks)
- CTL trend and ramp rate
- Recovery week compliance

**Wellness Trends**
- HRV: current vs 30-day average, trend direction
- Resting HR: current vs 30-day average, trend direction
- Sleep: average, trend, any flags
- Fatigue/mood: trend

**Risk Flags**
- List any specific concerns with severity (watch / caution / stop)
- For each flag, cite the reasoning from the knowledge base

**Recommendations**
- Specific actions based on findings (e.g., "Take a recovery week", "Reduce volume by 20% this week", "Monitor HRV for 3 more days before deciding")
- If red flags: recommend consulting a medical professional for any pain or injury concerns
- Reference the relevant expert guidance
