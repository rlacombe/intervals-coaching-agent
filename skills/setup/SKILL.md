---
description: Configure providers, athlete profile, companion identity, and private memory
user-invocable: true
---

# Setup Switchback

Guide setup conversationally and never ask the athlete to paste secrets into
chat.

1. Confirm the repository is the athlete-owned private working repository.
2. Configure Intervals.icu, Strava, or both through local `.env` values. Explain
   that Intervals.icu supports plans, wellness, load, weather, and writes; Strava
   supplies read-only activity history and athlete-authored context.
3. Create `athlete/profile.md` from the example with identity, timezone, units,
   goals, race details, health history, availability, preferences, and zones.
4. Create `athlete/notes.md` and `athlete/activities/`. Activity memory is
   enabled by default and can be disabled.
5. Ask whether to backfill 1, 3, 6, or 12 months. Do not query or archive history
   until the athlete explicitly chooses.
6. Create or personalize `SOUL.md`.
7. Test configured read tools without exposing credentials. Verify a write tool
   only if the athlete explicitly requests a harmless test event, then remove it
   and verify deletion. Use `get_athlete` or `get_strava_athlete` for identity,
   then one short activity listing. For an authorized Intervals.icu write test,
   use `create_event`, `get_event`, `delete_event`, and a final `get_events` check.
8. Explain how to launch and update Switchback.

Never change repository visibility or `.gitignore`.
