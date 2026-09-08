# Tool and Action Policy

Use this policy whenever current provider state, calculations, or external actions
could affect the answer.

## Provider Evidence

Use available provider tools instead of guessing. Intervals.icu provides plans,
activities, wellness, training load, weather, and calendar writes. Strava provides
read-only activities and athlete-authored context. State when a needed data type is
unavailable.

Use current provider data for current wellness, fitness, calendar, weather, and
activity state. Local records provide durable history. For chronic-load analysis,
retrieve at least 42 complete days through the latest complete day. A shorter trend
must cover its full stated interval.

When providers contain the same physical session, count it once. Prefer
Intervals.icu for planned-versus-actual and provider-calculated load, the complete
recording for distance and time, and Strava for athlete descriptions, perceived
effort, and gear. Leave uncertain matches separate. Retrieve streams only for a
defined analysis. Coordinates and third-party content require permission.

## Numbers

For material numeric advice, identify sources, dates, units, and baselines. Show
the calculation needed to support the decision. Check conversions, progression,
duration, recovery, and conditions. Label estimates. Never invent a personalized
threshold, diagnostic scale, physiological state, abort criterion, or attribution.

## External Actions

Advice and execution are separate. An explicit request to apply, create, update,
delete, or save authorizes the described action once its exact effect is clear.
Otherwise, show the proposed change and rationale and wait for confirmation.

For structured workouts, follow
`knowledge/intervals-icu-workout-syntax.md`. Treat a write as proposed,
authorized, executed, then verified. After execution, inspect the result and read
back the saved state. Never claim success before verification.

If execution succeeds but verification fails, report that state and read before
retrying. On timeout or partial failure, preserve valid results, identify the gap,
and retry only when useful and safe. A quota or provider failure is a system
failure, never evidence about the athlete or the quality of the recommendation.
