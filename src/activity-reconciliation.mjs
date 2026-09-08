function epoch(value) {
  const time = Date.parse(value || "");
  return Number.isFinite(time) ? time : null;
}

function number(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

export function samePhysicalActivity(left, right) {
  const leftStart = epoch(left?.start_date || left?.start_date_local);
  const rightStart = epoch(right?.start_date || right?.start_date_local);
  if (leftStart === null || rightStart === null || Math.abs(leftStart - rightStart) > 15 * 60 * 1000) return false;

  const leftDuration = number(left?.moving_time);
  const rightDuration = number(right?.moving_time);
  if (leftDuration !== null && rightDuration !== null) {
    const tolerance = Math.max(300, 0.1 * Math.max(leftDuration, rightDuration));
    if (Math.abs(leftDuration - rightDuration) > tolerance) return false;
  }

  const leftDistance = number(left?.distance);
  const rightDistance = number(right?.distance);
  if (leftDistance !== null && rightDistance !== null) {
    const tolerance = Math.max(500, 0.05 * Math.max(leftDistance, rightDistance));
    if (Math.abs(leftDistance - rightDistance) > tolerance) return false;
  }
  return true;
}

export function reconcileActivities(intervalsActivities = [], stravaActivities = []) {
  const unmatched = [...stravaActivities];
  const sessions = intervalsActivities.map(intervals => {
    const index = unmatched.findIndex(strava => samePhysicalActivity(intervals, strava));
    const strava = index >= 0 ? unmatched.splice(index, 1)[0] : null;
    return { intervals, strava, source_ids: [intervals?.id, strava?.id].filter(Boolean) };
  });
  return sessions.concat(unmatched.map(strava => ({ intervals: null, strava, source_ids: [strava?.id].filter(Boolean) })));
}
