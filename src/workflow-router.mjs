const RULES = {
  archive: [/\barchive\b/i, /\bbackfill\b/i, /save .*activit/i],
  review: [/\breview\b/i, /\banaly[sz]e\b/i, /\bdebrief\b/i, /planned versus actual/i, /post[- ]workout/i],
  week: [/\bweekly\b/i, /\bthis week\b/i, /\blast week\b/i, /week ahead/i, /week summary/i],
  adjust: [/\badjust\b/i, /\b(reschedule|swap|skip|replace)\b/i, /should i (run|train|rest)/i],
  build: [/\b(build|create|write|schedule)\b.*\b(workout|session|week|block|training)\b/i, /training plan/i],
  race: [/\brace\b/i, /\bcutoff\b/i, /aid station/i, /pacing plan/i, /course strategy/i],
  nutrition: [/\b(fuel|fueling|nutrition|carb|sodium|hydration|gel|electrolyte)\b/i],
  check: [/health check/i, /\b(injury|pain|sick|fever|fatigue|sore|hrv|recovery)\b/i],
  today: [/\b(today|tomorrow|this morning|tonight|next workout)\b/i],
  why: [/\b(why|explain|science|evidence|reasoning)\b/i],
  setup: [/\b(setup|configure|connect|install)\b/i, /build .*profile/i],
  briefing: [/\bbriefing\b/i, /coaching note/i, /daily note/i],
};

export function routeWorkflow(query) {
  const text = String(query || "").trim();
  if (!text) throw new Error("A request is required for workflow routing.");
  const candidates = Object.entries(RULES)
    .map(([task, patterns]) => ({ task, score: patterns.reduce((score, pattern) => score + Number(pattern.test(text)), 0) }))
    .filter(candidate => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.task.localeCompare(right.task));
  return {
    candidates: candidates.map(candidate => ({ ...candidate, skill: `skills/${candidate.task}/SKILL.md` })),
    requires_judgment: candidates.length !== 1 || candidates[0]?.score === candidates[1]?.score,
  };
}
