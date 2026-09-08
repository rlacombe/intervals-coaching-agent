---
description: Adapt upcoming training to symptoms, recovery, schedule, or changing goals
user-invocable: true
---

# Adjust Training

## Trigger
Use for a proposed change to one or more upcoming workouts.

## Minimum evidence
Read the profile and relevant memory. Retrieve the affected calendar, recent
completed training, and current wellness. Add zones and weather when they affect
execution. For a schedule-only move, inspect adjacent hard sessions and recovery.

Use `get_events` for the affected window, `get_activities` for recent training,
and `get_wellness` and `get_fitness` when recovery or load matters. Use
`get_weather` with profile coordinates when conditions affect execution. Fetch the
complete event with `get_event` before changing it.

## Knowledge
Retrieve only chapters implicated by the evidence: injury prevention for pain;
recovery for fatigue or illness; periodization for schedule changes; volume
progression for added load.

## Decision
Apply the contract's health triage. Pain does not automatically require medical
referral: classify the evidence, ask only decision-changing questions, and choose
the least restrictive safe option. Preserve the workout's purpose where possible.
Show observations, hypotheses, decision, and reassessment trigger.

## Action
Present exact before-and-after dates, duration, intensity, and rationale. An
explicit request to apply a fully specified change authorizes the write; otherwise
ask once. Use Intervals.icu for writes, then read back each changed event. With
Strava alone, provide portable text. Record a durable health or scheduling lesson
only when it should affect future decisions.
