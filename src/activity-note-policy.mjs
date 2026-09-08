const REQUIRED = ["id", "provider", "start_date_local", "retrieved_at", "record_status", "route_retained"];
const FORBIDDEN = [/\blatlng\b/i, /<trkpt\b/i, /coordinates\s*:/i];

function scalar(raw) {
  const value = raw.trim();
  if (value === "null") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith("[") && value.endsWith("]")) {
    return value.slice(1, -1).split(",").map(item => item.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
  }
  return value.replace(/^(['"])(.*)\1$/, "$2");
}

export function parseFrontMatter(markdown) {
  if (typeof markdown !== "string" || !markdown.startsWith("---\n")) throw new Error("Activity note requires YAML front matter.");
  const end = markdown.indexOf("\n---", 4);
  if (end < 0) throw new Error("Activity note front matter is not closed.");
  const data = {};
  for (const [index, line] of markdown.slice(4, end).split("\n").entries()) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const match = line.match(/^([a-z][a-z0-9_]*):\s*(.*)$/);
    if (!match) throw new Error(`Invalid front matter on line ${index + 2}.`);
    if (match[1] in data) throw new Error(`Duplicate front matter field: ${match[1]}.`);
    data[match[1]] = scalar(match[2]);
  }
  return { data, body: markdown.slice(end + 4) };
}

export function validateActivityNote(markdown) {
  const { data, body } = parseFrontMatter(markdown);
  for (const field of REQUIRED) if (!(field in data)) throw new Error(`Activity note requires ${field}.`);
  if (!String(data.id).includes(":")) throw new Error("id must include a provider namespace.");
  const currentIds = Array.isArray(data.source_activity_ids) && data.source_activity_ids.length > 0;
  const legacyId = data.source_activity_id !== undefined && String(data.source_activity_id).length > 0;
  if (!currentIds && !legacyId) throw new Error("source_activity_ids must be a non-empty list.");
  if (!Number.isFinite(Date.parse(data.start_date_local))) throw new Error("start_date_local must be a valid date-time.");
  if (!Number.isFinite(Date.parse(data.retrieved_at))) throw new Error("retrieved_at must be a valid date-time.");
  if (!["current", "superseded"].includes(data.record_status)) throw new Error("record_status must be current or superseded.");
  if (typeof data.route_retained !== "boolean" || data.route_retained) throw new Error("route_retained must be false.");
  if (data.record_status === "superseded" && !data.superseded_by) throw new Error("A superseded record requires superseded_by.");
  if (!/^## (Derived assessment \(hypothesis\)|Decision)$/m.test(body)) throw new Error("Activity note must label its interpretation as a hypothesis or decision.");
  for (const pattern of FORBIDDEN) if (pattern.test(markdown)) throw new Error("Activity note contains retained route coordinates.");
  return true;
}
