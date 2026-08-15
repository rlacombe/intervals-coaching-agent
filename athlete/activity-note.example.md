---
id: "strava:1234567890"
provider: strava
source_activity_id: "1234567890"
start_date_local: "2026-08-14T06:30:00-07:00"
timezone: America/Los_Angeles
activity_type: TrailRun
tags: [long-run, trail]
retrieved_at: "2026-08-14T16:00:00-07:00"
streams_available: true
route_retained: false
---

# Example Trail Run

## Snapshot

| Metric | Value |
|---|---|
| Distance | 12.4 mi |
| Moving time | 2:14:08 |
| Elevation gain | 2,340 ft |
| Average pace | 10:49 /mi |
| Average / max heart rate | 142 / 161 bpm |
| Training load | 126 TSS |
| Perceived exertion | 5 / 10 |
| Gear | Example trail shoe |

## Athlete-reported note

Optional athlete-authored description from the activity provider. Do not copy third-party comments here by default.

## Plan and execution

What was planned, what happened, and any material deviation.

## Companion assessment

A short, evidence-based interpretation. Put only durable cross-workout patterns in `athlete/notes.md`.

## Data retention

This note retains a compact summary and source identifier. It intentionally excludes GPX, GPS coordinates, and raw second-by-second streams; retrieve those transiently from the provider only when a specific analysis requires them.
