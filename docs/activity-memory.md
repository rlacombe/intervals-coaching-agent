# Activity Memory

Switchback stores one compact Markdown note for every activity it reviews or explicitly archives. Activity memory is enabled by default; set **Activity memory** to `disabled` in `athlete/profile.md` to opt out of automatic archival. The note makes a runner's history readable and searchable without treating the repository as a data lake.

## What we retain

Each note has stable frontmatter and a short human-readable summary:

- provider and source activity ID, local start time, sport type, and tags;
- distance, moving time, elevation, pace or speed, heart rate, load, power or cadence when available, perceived exertion, and gear;
- the athlete-authored activity description when relevant;
- a concise planned-versus-actual comparison and companion assessment;
- whether richer provider streams remain available.

The canonical template is [`athlete/activity-note.example.md`](../athlete/activity-note.example.md). Personal notes live in `athlete/activities/YYYY/MM/YYYY-MM-DD--provider--activity-id.md`. This supports ordinary file search and later local analysis while preserving source provenance.

## What we do not retain by default

Do not commit GPX/TCX/FIT files, raw GPS coordinates, or full second-by-second streams. They are bulky, duplicate the provider, and can expose sensitive routes or home locations. Fetch streams transiently only for a concrete question such as heart-rate decoupling or climb-by-climb pacing.

Strava comments and kudos involve other people. The companion may retrieve comments only on request and must not copy them into activity memory without the athlete's explicit instruction. A user may instead request a non-attributed summary.

## Scope and limits

There is no background sync daemon. `/review` writes a note for the activity it analyzes while activity memory is enabled. `/archive` can backfill or refresh a date range even when automatic activity memory is disabled. During setup, Switchback offers a one-time backfill but requires the athlete to choose a lookback period, such as 1, 3, 6, or 12 months; it never silently archives history. The activity note is a compact retrieval record, not a medical record or a replacement for the original provider data.
