# Activity Memory

Switchback stores one compact Markdown note for each completed workout it
synchronizes, reviews, or explicitly archives. Activity memory is enabled by
default; set **Activity memory** to `disabled` in `athlete/profile.md` to opt out
of automatic synchronization and review archival. The notes make a runner's
history readable and searchable without treating the repository as a data lake.

## What we retain

Each note has stable frontmatter and a short human-readable summary:

- provider and all reconciled source activity IDs, local start time, sport type,
  and tags;
- distance, moving time, elevation, pace or speed, heart rate, load, power or cadence when available, perceived exertion, and gear;
- the athlete-authored activity description when relevant;
- a planned-versus-actual comparison and interpretation labeled as a derived
  metric, hypothesis, or decision;
- whether richer provider streams remain available.

Frontmatter also records whether the note is current or superseded and links a
replacement when corrected. Validate new or changed notes with
`node scripts/validate-activity-note.mjs <path>`.

The canonical template is [`athlete/activity-note.example.md`](../athlete/activity-note.example.md). Personal notes live in `athlete/activities/YYYY/MM/YYYY-MM-DD--provider--activity-id.md`. This supports ordinary file search and later local analysis while preserving source provenance.

`athlete/activities/index.md` points to monthly summaries. Each summary links to
its activity records and reports aggregate time, distance, elevation, and load
with the source dates used. This keeps retrieval bounded as history grows.
The canonical monthly format is
[`athlete/monthly-summary.example.md`](../athlete/monthly-summary.example.md).

## What we do not retain by default

Do not commit GPX/TCX/FIT files, raw GPS coordinates, or full second-by-second streams. They are bulky, duplicate the provider, and can expose sensitive routes or home locations. Fetch streams transiently only for a concrete question such as heart-rate decoupling or climb-by-climb pacing.

Strava comments and kudos involve other people. The companion may retrieve comments only on request and must not copy them into activity memory without the athlete's explicit instruction. A user may instead request a non-attributed summary.

## Scope and limits

There is no background sync daemon. Once per session after activity-related
work, Switchback queries from the last successful synchronization or newest local
activity through today and writes missing completed workouts. It advances the
stored synchronization date only after every note validates. `/review` writes
the activity it analyzes, and
`/archive` can backfill or refresh a date range even when automatic activity
memory is disabled. Before the first synchronization or backfill, the athlete
must choose a lookback period, such as 1, 3, 6, or 12 months; Switchback never
silently chooses how much history to import. Synchronization writes and validates
records before updating monthly summaries and the last-sync checkpoint. A
concurrent checkpoint change stops the update for reconciliation. An activity note is a compact
retrieval record, not a medical record or replacement for provider data.

For deterministic synchronization after provider data has been retrieved, run:

```bash
switchback memory sync --intervals /tmp/intervals.json --strava /tmp/strava.json --through YYYY-MM-DD
```

Either provider file may be omitted. The command owns reconciliation, validated
note creation, summary and index rebuilding, and atomic checkpoint advancement.
