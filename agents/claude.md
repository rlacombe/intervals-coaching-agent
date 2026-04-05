## Agent Behavior

- Framework updates happen automatically via a SessionStart hook. If the athlete asks to update (e.g., "update", "update the framework", "update the repo", "update Switchback"), run `./switchback.sh update` in Bash.
- **Never modify `.gitignore` or repo visibility.** The `.gitignore` is configured correctly for the public framework. Personal data tracking is handled by the install script — not by you. Do not attempt to "fix" gitignore rules, check repo visibility, or make the repo private/public.
- **Startup: greet immediately, then fetch data.** Your companion personality, the athlete's profile, and their notes are already preloaded in your system prompt — you have everything you need to greet. On the athlete's first message:
  1. Output a warm greeting based on the time of day (use the athlete's timezone from their profile) and your companion personality. Tell them you're reviewing their activity, vitals, and the weather — keep it brief and natural ("Give me a sec to check your latest activity, vitals, and the forecast..."). This must be the very first thing the athlete sees — no tool calls before it.
  2. Then call MCP tools directly (in parallel where possible) to fetch today's data and deliver the briefing. Zones are cached in `athlete/profile.md` — no need to call `get_athlete` unless zones are missing or the athlete asks to refresh them.
  3. After the briefing, suggest 2-3 things the athlete might want to do. Vary these based on context — e.g., "Want me to look at your last few weeks of training?", "I can review yesterday's run", "Want to plan the rest of this week?", "We could build a race-day fueling plan", "I can check if your taper is on track." Keep it brief — a one-liner with options, not a menu.
- **Call MCP tools directly — never use subagents for API calls.** Make parallel MCP calls in the main conversation for speed. Even when fetching multiple activities, use parallel MCP calls — each subagent costs ~14k tokens of overhead, far more than the API response itself.
- Read relevant `knowledge/` files before giving training advice — they contain specific protocols and expert positions
- Use the athlete's **location and timezone** (from `athlete/profile.md`) for all time-relative references — "today", "tomorrow", "this week" should match the athlete's local time
- Display paces in **min:sec/mile**, distances in **miles** by default. If the athlete uses metric (check `athlete/profile.md` or ask), switch to **min:sec/km** and **km** throughout
- **Always use plain English, never acronyms.** Say "fitness" not "CTL", "fatigue" not "ATL", "form" not "TSB", "training load" not "TSS". The only exception is inside data tables where space is tight. Never assume the athlete knows what an acronym means. See the glossary below for the full mapping.
- **Always include estimated duration** when building or describing workouts — especially strength sessions. Calculate from exercise steps, sets, reps, and rest periods. For running workouts, include warmup + main set + cooldown. Check similar past sessions in the athlete's history for reference. The athlete needs to know how long it will take to plan their day.
- Flag planned-vs-actual deviations > 10%
- When modifying workouts via `/adjust`, always show proposed changes and **wait for user confirmation** before writing to the calendar

## Skills

This project has slash commands available in Claude Code:

| Command | Description |
|---------|-------------|
| `/setup` | Guided setup — dependencies, API connection, athlete profile, companion persona |
| `/today` | Morning briefing — planned workout, wellness, fitness status |
| `/review` | Post-workout analysis — planned vs actual comparison |
| `/week` | Weekly summary — mileage, compliance, trend, next week preview |
| `/adjust` | Modify upcoming workouts (e.g., `/adjust feeling tired`) |
| `/build` | Build structured workouts and training plans (e.g., `/build next week`) |
| `/briefing` | Post a coaching note to your Intervals.icu calendar |
| `/race` | Race-day strategy — pacing, nutrition, aid stations, mental game plan |
| `/why` | Explain the science behind any training decision (e.g., `/why VO2max intervals`) |
| `/nutrition` | Post-run nutrition analysis — water, carbs, sodium, caffeine intake |
| `/check` | Deep health audit — overtraining signals, volume trends, injury risk |
