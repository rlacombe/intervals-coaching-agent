const EXTENT = /\b(?:\d+h(?:\d+m)?|\d+m(?:\d+s)?|\d+s|\d+(?:\.\d+)?(?:km|mi|mtr)|\d+['"])\b/i;
const ZONE_TARGET = /\bZ[1-7](?:-Z?[1-7])?\s+(HR|Pace|Power)\b/gi;
const PERCENT_TARGET = /\b\d+(?:%?-\d+)?%\s+(HR|Pace|LTHR|FTP|Power)\b/gi;
const PACE_TARGET = /\b\d+:\d{2}(?:-\d+:\d{2})?\/(?:km|mi)\s+Pace\b/gi;
const POWER_TARGET = /\b\d+(?:-\d+)?w\b/gi;
const CADENCE = /\b\d+(?:-\d+)?rpm\b/i;
const REPEAT = /^-\s+\d+x$/i;

function targetKinds(line) {
  const kinds = [];
  for (const [pattern, fixedKind] of [[ZONE_TARGET], [PERCENT_TARGET], [PACE_TARGET, "pace"], [POWER_TARGET, "power"]]) {
    pattern.lastIndex = 0;
    for (const match of line.matchAll(pattern)) kinds.push(fixedKind || match[1].toLowerCase());
  }
  return kinds;
}

export function validateWorkoutDescription(description) {
  if (typeof description !== "string" || !description.trim()) {
    throw new Error("A structured workout requires a description.");
  }
  const lines = description.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  let section = false;
  let steps = 0;
  for (const line of lines) {
    if (!line.startsWith("-")) {
      if (!/^[A-Za-z][A-Za-z0-9 &/()-]*(?:\s+\d+x)?$/.test(line)) throw new Error(`Invalid workout section: ${line}`);
      section = true;
      continue;
    }
    if (!section) throw new Error("Workout steps must follow a named section.");
    if (REPEAT.test(line)) continue;
    if (!EXTENT.test(line)) throw new Error(`Workout step lacks a duration or distance: ${line}`);
    if (/[()]/.test(line)) throw new Error(`Workout steps cannot contain parenthetical text: ${line}`);
    const targets = targetKinds(line);
    if (targets.length !== 1) throw new Error(`Workout step requires exactly one quantitative target: ${line}`);
    const cadenceTokens = line.match(/\b\d+(?:-\d+)?rpm\b/gi) || [];
    if (cadenceTokens.length > 1 || (/rpm/i.test(line) && !CADENCE.test(line))) throw new Error(`Invalid cadence target: ${line}`);
    steps += 1;
  }
  if (!section || steps === 0) throw new Error("A structured workout requires a section and at least one step.");
  return true;
}

export function looksStructured(description) {
  if (typeof description !== "string") return false;
  const lines = description.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  return lines.some((line, index) =>
    !line.startsWith("-") &&
    /^[A-Za-z][A-Za-z0-9 &/()-]*(?:\s+\d+x)?$/.test(line) &&
    lines.slice(index + 1).some(candidate => candidate.startsWith("-"))
  );
}
