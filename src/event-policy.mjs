import { looksStructured, validateWorkoutDescription } from "./workout-policy.mjs";
import { createHash } from "crypto";

const DATE = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?)?$/;
const CATEGORIES = new Set(["WORKOUT", "NOTE", "TARGET"]);

export function normalizeEvent(input, { partial = false } = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Event input must be an object.");
  }
  const event = { ...input };
  if (partial && Object.keys(event).length === 0) throw new Error("Event update requires at least one changed field.");
  if (!partial || "name" in event) {
    if (typeof event.name !== "string" || !event.name.trim()) throw new Error("Event name is required.");
    event.name = event.name.trim();
  }
  if (!partial || "start_date_local" in event) {
    if (typeof event.start_date_local !== "string" || !DATE.test(event.start_date_local)) {
      throw new Error("start_date_local must use YYYY-MM-DD or a local ISO date-time.");
    }
    const [date, time] = event.start_date_local.split("T");
    const [year, month, day] = date.split("-").map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) {
      throw new Error("start_date_local contains an invalid calendar date.");
    }
    if (time) {
      const [hour, minute, second = "0"] = time.split(":").map(Number);
      if (hour > 23 || minute > 59 || second > 59) throw new Error("start_date_local contains an invalid local time.");
    }
    if (!event.start_date_local.includes("T")) event.start_date_local += "T00:00:00";
  }
  if (event.category !== undefined && !CATEGORIES.has(event.category)) throw new Error("Invalid event category.");
  if (!partial && !event.category) event.category = "WORKOUT";
  for (const field of ["moving_time", "distance"]) {
    if (event[field] !== undefined && (!Number.isFinite(event[field]) || event[field] < 0)) {
      throw new Error(`${field} must be a non-negative number.`);
    }
  }
  if (event.description !== undefined && typeof event.description !== "string") {
    throw new Error("description must be text.");
  }
  if ((event.category || "WORKOUT") === "WORKOUT" && looksStructured(event.description)) {
    validateWorkoutDescription(event.description);
  }
  return event;
}

export function sameEvent(left, right) {
  if (left?.external_id && right?.external_id) return left.external_id === right.external_id;
  return left?.name === right?.name &&
    String(left?.start_date_local || "").slice(0, 16) === String(right?.start_date_local || "").slice(0, 16) &&
    (left?.category || "WORKOUT") === (right?.category || "WORKOUT") &&
    (left?.type || "") === (right?.type || "") &&
    Number(left?.moving_time || 0) === Number(right?.moving_time || 0) &&
    Number(left?.distance || 0) === Number(right?.distance || 0) &&
    (left?.description || "") === (right?.description || "");
}

export function eventExternalId(event) {
  const fields = ["category", "start_date_local", "name", "type", "moving_time", "distance", "description"];
  const canonical = Object.fromEntries(fields.map(field => [field, event?.[field] ?? null]));
  return `switchback-${createHash("sha256").update(JSON.stringify(canonical)).digest("hex").slice(0, 24)}`;
}
