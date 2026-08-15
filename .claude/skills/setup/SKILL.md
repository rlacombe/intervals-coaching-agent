---
description: "Guided setup — connects Intervals.icu and/or Strava, then builds your athlete profile"
user-invocable: true
---

# /setup — Guided Setup

Walk the user through setup step by step. Be friendly and patient — assume they are not technical. Confirm each step before moving to the next. Do not dump a wall of instructions; go one step at a time.

## Step 1: Choose data providers

Switchback can use Intervals.icu, Strava, or both. Explain the trade-off concisely:

- **Intervals.icu (recommended for the full experience):** planned calendar, training-load and wellness trends, structured workouts, and watch sync.
- **Strava:** completed activity history, athlete-authored descriptions, gear, and optional social context. It works without Intervals.icu but cannot provide wellness/fitness metrics or calendar writes.

Ask which they want to connect. Never require Strava from an athlete who only wants Intervals.icu.

### Intervals.icu

Check if `INTERVALS_API_KEY` and `INTERVALS_ATHLETE_ID` are set in the environment (either from a `.env` file or shell env).

**If both are set:** Tell the user Intervals.icu is already configured.

**If either is missing:** Walk them through it:

1. Ask if they have an Intervals.icu account. If not, tell them to create one at https://intervals.icu (it's free) and connect their watch/device, then come back.
2. Guide them to create an API key:
   - Go to https://intervals.icu/settings
   - Scroll to the **Developer** section
   - Click **Create API Key**
   - Copy the key
3. Guide them to find their Athlete ID:
   - It's in their Intervals.icu profile URL — looks like `i123456`
   - Or visible on the Settings page
4. Ask the user to enter their API key and Athlete ID directly in the `.env` file; do not ask them to put secrets in chat.
5. Confirm that their `.env` file contains:
   ```
   INTERVALS_API_KEY=their_key
   INTERVALS_ATHLETE_ID=their_id
   ```
   This file is already gitignored — their credentials stay local.
6. Tell the user to **restart Claude Code** (or open a new terminal) for the environment variables to take effect.

### Strava

If the athlete chooses Strava, check for `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, and `STRAVA_REFRESH_TOKEN`.

**If all are set:** Tell them Strava is already configured.

**If any are missing:** Explain that Strava uses OAuth and guide them through one step at a time:
1. Create a personal application at https://www.strava.com/settings/api and record the Client ID and Client Secret. The secret stays only in their local `.env` file.
2. Request `read,activity:read_all` access using Strava's official authentication guide: https://developers.strava.com/docs/authentication/. Confirm that `activity:read_all` was accepted so private activities can be read.
3. Exchange the returned authorization code for a refresh token following the same guide. Ask the athlete to enter the resulting credentials directly in `.env`:
   ```
   STRAVA_CLIENT_ID=your_client_id
   STRAVA_CLIENT_SECRET=your_client_secret
   STRAVA_REFRESH_TOKEN=your_refresh_token
   ```
4. Explain that Switchback refreshes the short-lived access token in memory. If Strava rotates the refresh token, they may need to update the `.env` value after reconnecting.

## Step 2: Verify connections

For Intervals.icu, make a test call using `get_wellness` for today. For Strava, call `get_strava_athlete`. If a selected provider fails, help debug its credentials or scopes. Do not block profile setup if at least one selected provider works.

## Step 3: Build the athlete profile

Tell the user you're going to ask a few questions to personalize the coaching. Ask them conversationally — one or two questions at a time, not a long form. Create the `athlete/` directory if it doesn't exist, then use their answers to fill in `athlete/profile.md` (copied from `athlete/profile.example.md` if it doesn't exist yet). Also create an empty `athlete/notes.md` for the companion's persistent observations.

Questions to cover (adapt based on what they've already answered):
- What's your name?
- How old are you?
- Height, weight, body type?
- How many miles per week are you currently running?
- What's your running experience? (years, races, distances)
- Any injuries or weaknesses to watch for?
- What does your typical training week look like? (days available, trail access, cross-training)
- What race are you training for? (name, date, distance, elevation, cutoffs)
- Why do you run? What motivates you?
- Any long-term goals beyond this race?

After gathering answers, write their data to `athlete/profile.md` (filling in the template from `athlete/profile.example.md`). Show them what you wrote and ask if anything needs adjusting.

If Intervals.icu is connected, fetch zones from its athlete endpoint and populate the **Zones** section of `athlete/profile.md` with the athlete's actual HR zones, pace zones, LTHR, FTP, and max HR. This caches zones locally so daily briefings and workout skills do not need to call the athlete endpoint every time. If only Strava is connected, leave the section editable and ask the athlete for any known zones; never invent them.

Create `athlete/activities/`. Explain that activity memory is enabled by default: `/review` will save a concise note for each reviewed activity. The athlete can opt out at any time by setting **Activity memory** to `disabled` in `athlete/profile.md`. It stores retrieval-friendly metrics and athlete-authored context, not raw GPS tracks or third-party comments.

Then offer a one-time historical backfill: ask whether they want to archive existing activity history, and if so, ask them to choose a lookback period such as 1, 3, 6, or 12 months. Do not backfill until they explicitly choose a period. Use `/archive` for the selected period and record the choice in their profile.

## Step 4: Import existing notes

Ask: "Do you have any existing training notes, race reports, or logs you'd like to share? Things like Obsidian notes, markdown files, text files — anything that would help me understand your training history better."

**If yes:**
1. Ask for the folder path (e.g., `~/Documents/Obsidian/Running/`).
2. Create the `athlete/docs/` directory if it doesn't exist.
3. Copy all `.md` and `.txt` files from the source folder into `athlete/docs/`, preserving filenames. If there are subdirectories, flatten them — prefix filenames with the subfolder name to avoid collisions (e.g., `races/western-states.md` → `races-western-states.md`).
4. Tell the athlete how many files were imported and list them.
5. Let them know: "I won't read all of these at once — I'll check them when they're relevant, like when we're planning a race you've run before or reviewing your training history. You can add more files anytime by dropping them in `athlete/docs/`."

**If no:** Move on. Mention they can always add files to `athlete/docs/` later.

## Step 5: Verify repo setup

Confirm that the athlete understands personal data belongs in a private fork or local repository. Do not modify `.gitignore` or repository visibility; the installer and repository setup control those boundaries.

## Step 6: Personalize your companion

Tell the athlete they can customize who their companion is. Copy `SOUL.example.md` to `SOUL.md` as a starting point, then ask:

1. **Name**: "What would you like to call your companion? The default is Virgil, but you can pick any name — some runners name it after someone who inspires them."
2. **Inspiration**: "Is there a runner, coach, or person you admire? This helps shape the companion's personality." (e.g., Kilian Jornet, Courtney Dauwalter, their first coach, a training partner)
3. **Personality dimensions** — ask one at a time, offering two ends of a spectrum:
   - **Tone**: "Do you want your companion to feel more like a casual training buddy, or a professional coach?"
   - **Intensity**: "When your body is ready for hard work, do you want gentle encouragement, or someone who'll tell you straight: 'you've got more in you'?"
   - **Detail**: "Do you prefer brief, just-the-essentials advice, or deep explanations with the science behind it?"
   - **Humor**: "Should your companion keep things light, or stay serious?"
   - **Celebration**: "After a great session, do you want to be hyped up, or just get the analysis and move on?"

Write their answers to `SOUL.md`. If they want to skip this step, keep the defaults from `SOUL.example.md`.

Tell the athlete: "You can always change your companion's personality later by editing `SOUL.md` — it's a plain text file in your project folder. Change the name, tone, humor, or anything else. The companion reads it fresh at the start of every session."

## Step 7: Set up the `switchback` command

Ask the user: "Would you like to be able to launch Switchback from anywhere by just typing `switchback`?"

If yes:

1. Detect their shell from `$SHELL` (zsh → `~/.zshrc`, bash → `~/.bashrc`).
2. Get the absolute path to `switchback.sh` in this project directory (use `$PWD/switchback.sh`).
3. Check if an alias or function named `switchback` already exists in their shell profile. If so, tell them it's already set up.
4. If not, add the alias to their shell profile:
   ```
   alias switchback="/absolute/path/to/switchback-running/switchback.sh"
   ```
5. Run `source` on the profile file so it takes effect immediately.
6. Tell them they can now type `switchback` from any directory to start a session.

If they decline, tell them they can always run `./switchback.sh` from the project directory.

## Step 8: Done

Tell them they're all set — greet them by name using their new companion persona. Suggest they try `switchback` (or `/today`) to see their first morning briefing, or just start chatting.
