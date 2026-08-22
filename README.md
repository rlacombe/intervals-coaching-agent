# Switchback

Switchback is an open-source training companion for ultratrail runners. It reads the training data you choose to connect, retrieves exercise-science guidance, and helps you plan, review, and adapt over a season.

```
Your watch  →  Intervals.icu / Strava  →  AI agent  →  Switchback
Garmin, Suunto,      training and activity     reasoning and     your training
COROS, Apple Watch   data                       conversation      companion
```

## Quickstart

```bash
curl -fsSL switchback.run/install.sh -o /tmp/sb.sh && bash /tmp/sb.sh
```

The installer creates a local framework and private athlete files, then guides you through selecting an AI agent, connecting [Intervals.icu](https://intervals.icu) and/or [Strava](https://www.strava.com), and setting up your profile. Start a session with `switchback`.

Also works with [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Codex CLI](https://github.com/openai/codex), or [OpenClaw](https://github.com/openclaw/openclaw). More at **[switchback.run](https://switchback.run)**.

## Why Switchback

Ultratrail training compounds long-term planning with changing fitness, recovery, weather, work, and family constraints. Switchback turns the resulting stream of workouts, wellness signals, and athlete notes into a durable record that an AI companion can inspect with the runner. Its training framework draws on [Training for the Uphill Athlete](#recommended-reading), [Training Essentials for Ultrarunners](#recommended-reading), [Science of Running](#recommended-reading), and [The Happy Runner](#recommended-reading).

## What You Can Do

### Morning check-in

```
> What's on tap for today?

Today's workout: Easy run — 6 mi, Zone 2
Wellness: Sleep 7.2h, HRV 48 (below your 52 avg), resting HR 54
Form: -4 (neutral) — Fitness 42, Fatigue 46

You're slightly fatigued with below-average HRV. Good day for your easy run,
but keep it genuinely easy. If you feel flat in the first mile, no shame in
cutting to 5.
```

### Checking your progress

```
> How's my training been going?

Looking at the last 14 days:
- Volume: 42 → 51 mi (+21%) — above the 10% ramp guideline
- Sleep: averaging 6.1h (down from 7.3h two weeks ago)
- HRV: 3-day trend declining, now 12% below your baseline
- Form: -18 and falling

This is a yellow flag. The volume jump alone is manageable, but
combined with declining sleep and HRV, you're accumulating more
fatigue than you're absorbing. I'd recommend swapping tomorrow's
intervals for an easy run and prioritizing sleep this week. If HRV
doesn't recover by Friday, consider making this a recovery week.
```

### Race readiness

```
> Am I on track to run UTMB in 4 months?

Let me pull your data and check...

Based on 12 weeks of training history:
- Current fitness: 52 — you'll want 65-75 for UTMB
- Weekly volume: 45 mi avg — target is 55-65 mi with significant vert
- Vert: 4,200 ft/week — UTMB demands suggest building to 8,000-10,000
- Long run: longest is 3:45 — you'll need multiple 5-6h efforts

You have time, but it's tight. Here's what I'd prioritize over the
next 16 weeks...
```

### Just ask

You can ask your companion anything about your training:

- *"Should I run or cross-train tomorrow?"*
- *"What's my vert progression been like this month?"*
- *"Is my HRV trend concerning?"*
- *"How should I fuel for a 50K?"*
- *"Build me a 12-week plan for a mountain 50K"*

### Make it yours

During setup, you choose the companion's name, tone, humor, and level of detail. The default name, Virgil, reflects the system's intended role: a guide who explains the terrain and leaves the decisions to the athlete.

## Skills (Claude Code)

These slash commands are available in Claude Code. Other agents support the same capabilities through natural conversation — just ask.

| Command | Description |
|---------|-------------|
| `/setup` | Guided setup — dependencies, API connection, athlete profile, companion persona |
| `/today` | Morning briefing — planned workout, wellness, fitness status |
| `/review` | Post-workout analysis — planned vs actual comparison and compact activity memory |
| `/archive` | Backfill or refresh compact, source-linked activity notes |
| `/week` | Weekly summary — mileage, compliance, trend, next week preview |
| `/adjust` | Modify upcoming workouts (e.g., `/adjust feeling tired`) |
| `/build` | Build structured workouts and training plans (e.g., `/build next week`) |
| `/briefing` | Post a coaching note to your Intervals.icu calendar |
| `/race` | Race-day strategy — pacing, nutrition, aid stations, mental game plan |
| `/nutrition` | Post-run nutrition analysis — water, carbs, sodium, caffeine intake |
| `/why` | Explain the science behind any training decision (e.g., `/why VO2max intervals`) |
| `/check` | Deep health audit — overtraining signals, volume trends, injury risk |

## Getting Started

### What you'll need

1. **A training-data provider** — [Intervals.icu](https://intervals.icu) is recommended for the full experience: it syncs Garmin, Suunto, COROS, Apple Watch, and other devices while providing planned workouts, wellness, and fitness metrics. [Strava](https://www.strava.com) is also supported as an independent, read-only activity provider for runners who do not use Intervals.icu. Both can be connected together.

2. **An AI agent** — install at least one of these:

| Agent | Install command | Notes |
|-------|---------|----------|
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | `npm install -g @google/gemini-cli` | **Free tier** — 1,000 requests/day, no credit card, just a Google account |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | `npm install -g @anthropic-ai/claude-code` | Recommended — full experience with slash commands |
| [Codex CLI](https://github.com/openai/codex) | `npm install -g @openai/codex` | Full experience with MCP support |

### Data providers

Connect either provider during `/setup`, or connect both. When an activity appears in both services, Switchback treats it as one session and uses the richer source for the question at hand.

| Provider | What it provides | What it does not provide |
|---|---|---|
| [Intervals.icu](https://intervals.icu) | Planned workouts and calendar updates; completed activities; training load; wellness; fitness and form trends; weather | Strava activity descriptions, gear, and social context |
| [Strava](https://www.strava.com) | Completed activities; athlete-authored activity descriptions; perceived exertion; gear; opt-in streams; on-demand comments | Training calendar writes; wellness; fitness/form metrics |

Intervals.icu is recommended when you want calendar planning and readiness-aware advice. Strava is useful on its own for activity review and history, and complements Intervals.icu with the narrative context that athletes often write after a run.

#### Strava setup

Strava is optional and read-only. Create a personal API application at [Strava API Settings](https://www.strava.com/settings/api), authorize it with `read,activity:read_all`, and follow [Strava's OAuth guide](https://developers.strava.com/docs/authentication/) to obtain a refresh token. Add the following only to your local `.env` file, never to Git or chat:

```bash
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REFRESH_TOKEN=your_refresh_token
```

Switchback refreshes short-lived access tokens in memory. The `activity:read_all` scope is needed to access activities visible only to you. No Strava data is written back by Switchback.

### Install

Open a terminal and run:

```bash
curl -fsSL switchback.run/install.sh -o /tmp/sb.sh && bash /tmp/sb.sh
```

The installer will:
- Download the Switchback framework and create a local repo
- Optionally create a **private GitHub repo** to back up your data (works with Claude Code Cloud too)
- Install everything and set up the `switchback` command
- Launch your companion for first-time setup — connecting Intervals.icu and/or Strava, building your athlete profile, and choosing a companion personality

It also creates a local `.env` from `.env.example` for provider credentials. The file stays outside Git.

**After that, just type `switchback` from anywhere to start a session.**

You can also open your private repo in [Claude Code Desktop](https://claude.ai/code) or [Claude Code Cloud](https://claude.ai/code) — it works everywhere.

### Updating

**Updates happen automatically.** At the start of each session, Switchback checks for new versions and updates the framework in the background. Your personal data (athlete profile, companion notes, race plans) is never touched.

### How it works

Switchback is not a traditional app — there's no UI, no server to run. The repository is a knowledge base and companion framework that your AI agent reads automatically. When you start a session, your companion greets you, pulls available training data from Intervals.icu and/or Strava, and picks up where you left off.

### Activity memory

Activity memory is enabled by default. After a post-workout review, Switchback stores a compact, source-linked Markdown note in your private `athlete/activities/YYYY/MM/` directory. The note gives the companion durable evidence without turning your repository into a copy of a fitness platform. To opt out of automatic archival, set **Activity memory** to `disabled` in `athlete/profile.md`.

Each note retains:

- activity source ID, local time, type, tags, distance, duration, elevation, pace, heart rate, load, power/cadence, perceived exertion, and gear when available;
- your activity description when it adds context;
- planned-versus-actual context and a concise companion assessment.

It deliberately does **not** copy GPX/FIT/TCX files, raw GPS coordinates, full streams, or friends' comments. GPS and streams can expose sensitive locations and are both large and already provider-hosted. Friends' comments are third-party data: Switchback retrieves them only when asked and never archives them without your explicit instruction.

`/review` writes a note for the workout it analyzes while activity memory is enabled. During setup, Switchback offers to backfill history but requires you to choose the lookback period, such as 1, 3, 6, or 12 months. You can also request it later with `/archive`, for example: `archive my trail runs from the last 3 months`. There is no background sync daemon, so no historical activity is archived without an explicit request. See [activity-memory.md](docs/activity-memory.md) for the full retention policy and [the note template](athlete/activity-note.example.md) for the on-disk schema.

Your personal data (athlete profile, training zones, coaching notes, companion persona) lives in your private repo and is never shared publicly. You can launch Switchback from any machine — your data travels with you.

## Training Philosophy

Three principles guide every recommendation:

1. **Health before performance.** Long-term health always comes first. Overtraining, under-recovery, and injury risk get flagged — even if it means recommending DNS.
2. **Push hard when ready.** Within the bounds of health, your companion is direct and demanding. Easy days easy, hard days hard.
3. **Evidence over tradition.** Recommendations cite physiology and established frameworks. When experts disagree, both approaches are presented with reasoning — you choose.

### Knowledge Base

The `knowledge/` directory contains 18 reference docs covering training science topics — from aerobic base and periodization to race execution and injury prevention. Each doc synthesizes positions from Johnston, Koop, Magness, and the Roches with specific protocols, quotes, and decision frameworks. Your companion reads these before making recommendations.

## Recommended Reading

The training framework draws from these books. We recommend them for any ultrarunner who wants to understand the science behind their training:

- **Training for the Uphill Athlete** by Scott Johnston, Steve House & Kilian Jornet — [Amazon](https://www.amazon.com/Training-Uphill-Athlete-Mountain-Mountaineers/dp/1938340841) | [Evoke Endurance](https://evokeendurance.com) · [Uphill Athlete](https://uphillathlete.com)
- **Training Essentials for Ultrarunners** by Jason Koop — [Amazon](https://www.amazon.com/Training-Essentials-Ultrarunning-Compete-Ultramarathon/dp/1937715566) | [jasonkoop.com](https://jasonkoop.com) · [CTS](https://trainright.com)
- **Science of Running** by Steve Magness — [Amazon](https://www.amazon.com/Science-Running-Efficiently-Ultramarathons-Sprints/dp/0615942946) | [stevemagness.com](https://stevemagness.com)
- **The Happy Runner** by Dr. Megan Roche & David Roche — [Amazon](https://www.amazon.com/Happy-Runner-Lasting-Running-Success/dp/1492567647) | [SWAP Running](https://www.swaprunning.com)

This project is not affiliated with these authors or organizations. Reading their work remains the best way to understand the training frameworks behind Switchback.

## Working with a Coach

Switchback can organize training data, explain a plan, and preserve the context between sessions. A qualified coach can observe form, ask better questions, and adapt to the parts of life that a wearable does not measure. Coaches may also adapt the framework for their own practice; feedback belongs in [GitHub Issues](https://github.com/rlacombe/switchback-running/issues).

The authors of the [recommended books](#recommended-reading) also offer coaching services:
- [Evoke Endurance](https://evokeendurance.com) (Scott Johnston)
- [Jason Koop / CTS](https://jasonkoop.com)
- [Uphill Athlete](https://uphillathlete.com)
- [Steve Magness](https://stevemagness.com)
- [SWAP Running](https://www.swaprunning.com) (Dr. Megan Roche & David Roche)

## Disclaimer

> [!IMPORTANT]
> Switchback provides educational training support. It does not diagnose or treat health conditions. Consult a qualified healthcare professional about pain, illness, injury, or changes to a training program. You remain responsible for training decisions and trail safety.

## License

MIT
