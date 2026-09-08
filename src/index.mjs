#!/usr/bin/env node
// Switchback MCP Server — zero dependencies
// Implements MCP protocol over stdio using only Node.js built-ins.

import { createInterface } from "readline";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { eventExternalId, normalizeEvent, sameEvent } from "./event-policy.mjs";
import { traceOperation } from "./trace.mjs";

// Load .env from project root (env vars already set in the shell take precedence)
try {
  const envFile = join(dirname(fileURLToPath(import.meta.url)), '..', '.env');
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const i = line.indexOf('=');
    if (i < 1 || line.trimStart().startsWith('#')) continue;
    const key = line.slice(0, i).trim().replace(/^export\s+/, '');
    const val = line.slice(i + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
    if (key && !(key in process.env)) process.env[key] = val;
  }
} catch {}

const API_KEY = process.env.INTERVALS_API_KEY;
const ATHLETE_ID = process.env.INTERVALS_ATHLETE_ID;

const BASE = "https://intervals.icu/api/v1";
const REQUEST_TIMEOUT_MS = Number(process.env.SWITCHBACK_HTTP_TIMEOUT_MS || 15000);
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
function requireConfiguration() {
  if (!API_KEY || !ATHLETE_ID) {
    throw new Error("Intervals.icu is not configured. Set INTERVALS_API_KEY and INTERVALS_ATHLETE_ID in .env.");
  }
}

// --- API helpers ---

async function api(path, opts = {}) {
  requireConfiguration();
  const auth = "Basic " + Buffer.from(`API_KEY:${API_KEY}`).toString("base64");
  let r;
  try {
    r = await fetch(`${BASE}${path}`, {
      ...opts,
      signal: opts.signal || AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Authorization: auth, "Content-Type": "application/json", ...opts.headers },
    });
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw new Error(`API timeout after ${REQUEST_TIMEOUT_MS} ms`);
    }
    throw error;
  }
  if (!r.ok) throw new ApiError(r.status, `API ${r.status}: ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}

function pick(obj, fields) {
  const r = {};
  for (const f of fields) if (obj[f] !== null && obj[f] !== undefined) r[f] = obj[f];
  return r;
}

// --- Field filters ---

const ATHLETE_F = ["id","name","sex","birthday","weight","city","country","timezone","locale","max_hr","resting_hr","lthr","threshold_pace","ftp","run_ftp","weight_kg","sportSettings","hr_zones","pace_zones","power_zones"];
const ACTIVITY_F = ["id","name","type","start_date_local","updated","distance","moving_time","elapsed_time","avg_hr","max_hr","total_elevation_gain","icu_training_load","icu_intensity","icu_efficiency_factor","average_speed","description","pace","icu_average_watts","suffer_score","calories","source"];
const EVENT_F = ["id","uid","external_id","start_date_local","icu_training_load","name","category","type","moving_time","distance","description"];
const INTERVAL_F = ["type","label","distance","moving_time","elapsed_time","average_speed","gap","average_heartrate","max_heartrate","average_cadence","total_elevation_gain","average_gradient","zone","intensity"];
const GROUP_F = ["id","count","distance","moving_time","average_speed","gap","average_heartrate","average_cadence","total_elevation_gain","zone"];

// --- Tool definitions ---

const TOOLS = [
  { name: "get_athlete", description: "Fetch athlete profile: HR/pace/power zones, weight, sport settings.",
    inputSchema: { type: "object", properties: {} },
    async handler() { return pick(await api(`/athlete/${ATHLETE_ID}`), ATHLETE_F); }},

  { name: "get_events", description: "Fetch planned workouts for a date range (YYYY-MM-DD).",
    inputSchema: { type: "object", properties: { oldest: { type: "string" }, newest: { type: "string" } }, required: ["oldest", "newest"] },
    async handler({ oldest, newest }) {
      const d = await api(`/athlete/${ATHLETE_ID}/events.json?oldest=${oldest}&newest=${newest}`);
      return Array.isArray(d) ? d.map(e => {
        const filtered = pick(e, EVENT_F);
        // Keep listings compact; get_event returns the complete prescription.
        if (filtered.description && filtered.description.length > 200)
          filtered.description = filtered.description.slice(0, 200) + '...';
        return filtered;
      }) : d;
    }},

  { name: "get_event", description: "Fetch one planned event with its complete workout description.",
    inputSchema: { type: "object", properties: { id: { type: "number", minimum: 1 } }, required: ["id"] },
    async handler({ id }) {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Event id must be a positive integer.");
      return pick(await api(`/athlete/${ATHLETE_ID}/events/${id}`), EVENT_F);
    }},

  { name: "get_activities", description: "Fetch completed activities for a date range (YYYY-MM-DD).",
    inputSchema: { type: "object", properties: { oldest: { type: "string" }, newest: { type: "string" } }, required: ["oldest", "newest"] },
    async handler({ oldest, newest }) {
      const d = await api(`/athlete/${ATHLETE_ID}/activities?oldest=${oldest}&newest=${newest}`);
      return Array.isArray(d) ? d.map(a => pick(a, ACTIVITY_F)) : d;
    }},

  { name: "get_activity", description: "Fetch a single activity by ID with filtered interval details.",
    inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
    async handler({ id }) {
      const raw = await api(`/activity/${id}?intervals=true`);
      const a = pick(raw, ACTIVITY_F);
      if (Array.isArray(raw.icu_intervals)) a.icu_intervals = raw.icu_intervals.map(i => pick(i, INTERVAL_F));
      if (Array.isArray(raw.icu_groups)) a.icu_groups = raw.icu_groups.map(g => pick(g, GROUP_F));
      for (const f of ["icu_hr_zones", "icu_pace_zones", "icu_power_zones"]) if (raw[f]) a[f] = raw[f];
      return a;
    }},

  { name: "get_activity_streams", description: "Fetch second-by-second time-series data for an activity.",
    inputSchema: { type: "object", properties: { id: { type: "string" }, types: { type: "array", items: { type: "string" }, description: "e.g. heartrate, watts, cadence, altitude, velocity_smooth" } }, required: ["id"] },
    async handler({ id, types }) {
      const path = types?.length ? `/activity/${id}/streams.json?types=${types.join(",")}` : `/activity/${id}/streams.json`;
      return api(path);
    }},

  { name: "get_wellness", description: "Fetch wellness data (HRV, sleep, weight, fatigue, mood) for a date range (YYYY-MM-DD).",
    inputSchema: { type: "object", properties: { oldest: { type: "string" }, newest: { type: "string" } }, required: ["oldest", "newest"] },
    async handler({ oldest, newest }) { return api(`/athlete/${ATHLETE_ID}/wellness.json?oldest=${oldest}&newest=${newest}`); }},

  { name: "get_fitness", description: "Fetch fitness metrics (CTL, ATL, TSB) and recent trend.",
    inputSchema: { type: "object", properties: { oldest: { type: "string" }, newest: { type: "string" } } },
    async handler({ oldest, newest }) {
      const o = oldest || new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
      const n = newest || new Date().toISOString().slice(0, 10);
      const rows = await api(`/athlete/${ATHLETE_ID}/wellness.json?oldest=${o}&newest=${n}`);
      const FF = ["id", "ctl", "atl", "rampRate", "ctlLoad", "atlLoad"];
      return (Array.isArray(rows) ? rows : []).map(r => {
        const e = pick(r, FF);
        if (e.ctl != null && e.atl != null) e.tsb = e.ctl - e.atl;
        return e;
      }).filter(e => Object.keys(e).length > 1);
    }},

  { name: "get_weather", description: "Fetch current conditions and 7-day forecast. Use athlete's lat/lon from profile.",
    inputSchema: { type: "object", properties: {
      latitude: { type: "number" }, longitude: { type: "number" },
      timezone: { type: "string" },
      temperature_unit: { type: "string", enum: ["fahrenheit", "celsius"] },
      wind_speed_unit: { type: "string", enum: ["mph", "kmh"] },
      precipitation_unit: { type: "string", enum: ["inch", "mm"] }
    }, required: ["latitude", "longitude"] },
    async handler({ latitude, longitude, timezone = "auto", temperature_unit = "fahrenheit", wind_speed_unit = "mph", precipitation_unit = "inch" }) {
      const u = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_gusts_10m,weather_code&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,weather_code,sunrise,sunset,uv_index_max&temperature_unit=${temperature_unit}&wind_speed_unit=${wind_speed_unit}&precipitation_unit=${precipitation_unit}&timezone=${timezone}&forecast_days=7`;
      const r = await fetch(u, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
      if (!r.ok) throw new Error(`Weather ${r.status}`);
      return r.json();
    }},

  { name: "create_event", description: "Create a planned workout or note on the calendar.",
    inputSchema: { type: "object", properties: {
      category: { type: "string", enum: ["WORKOUT", "NOTE", "TARGET"] },
      start_date_local: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}(T.*)?$", description: "YYYY-MM-DD or local ISO date-time" },
      name: { type: "string" }, description: { type: "string" },
      type: { type: "string", description: "e.g. Run, Ride, Swim" },
      moving_time: { type: "number", minimum: 0, description: "seconds" },
      distance: { type: "number", minimum: 0, description: "meters" }
    }, required: ["start_date_local", "name"] },
    async handler(p) {
      const body = normalizeEvent(p);
      body.external_id = eventExternalId(body);
      const day = body.start_date_local.slice(0, 10);
      const existing = await api(`/athlete/${ATHLETE_ID}/events.json?oldest=${day}&newest=${day}`);
      const duplicate = Array.isArray(existing) ? existing.find(event => sameEvent(event, body)) : null;
      if (duplicate) return { execution: "not_needed", verification: "verified", deduplicated: true, event: pick(duplicate, EVENT_F) };
      const created = await api(`/athlete/${ATHLETE_ID}/events`, { method: "POST", body: JSON.stringify(body) });
      if (!created?.id) {
        return { execution: "executed", verification: "unverified", deduplicated: false, event: pick(created || body, EVENT_F), retry: "read_before_retry" };
      }
      try {
        const verified = await api(`/athlete/${ATHLETE_ID}/events/${created.id}`);
        return { execution: "executed", verification: "verified", deduplicated: false, event: pick(verified, EVENT_F) };
      } catch (error) {
        return { execution: "executed", verification: "failed", deduplicated: false, event: pick(created, EVENT_F), error: error.message, retry: "read_before_retry" };
      }
    }},

  { name: "update_event", description: "Update a planned workout/event.",
    inputSchema: { type: "object", properties: {
      id: { type: "number", minimum: 1, description: "Event ID" },
      name: { type: "string" }, description: { type: "string" },
      start_date_local: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}(T.*)?$" },
      category: { type: "string", enum: ["WORKOUT", "NOTE", "TARGET"] },
      type: { type: "string" }, moving_time: { type: "number", minimum: 0 },
      distance: { type: "number", minimum: 0 }
    }, required: ["id"] },
    async handler({ id, ...rest }) {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Event id must be a positive integer.");
      const body = normalizeEvent(rest, { partial: true });
      const updated = await api(`/athlete/${ATHLETE_ID}/events/${id}`, { method: "PUT", body: JSON.stringify(body) });
      try {
        const verified = await api(`/athlete/${ATHLETE_ID}/events/${id}`);
        return { execution: "executed", verification: "verified", event: pick(verified, EVENT_F) };
      } catch (error) {
        return { execution: "executed", verification: "failed", event: pick(updated || { id, ...body }, EVENT_F), error: error.message, retry: "read_before_retry" };
      }
    }},

  { name: "delete_event", description: "Delete a planned workout/event.",
    inputSchema: { type: "object", properties: { id: { type: "number", minimum: 1, description: "Event ID" } }, required: ["id"] },
    async handler({ id }) {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Event id must be a positive integer.");
      await api(`/athlete/${ATHLETE_ID}/events/${id}`, { method: "DELETE" });
      try {
        await api(`/athlete/${ATHLETE_ID}/events/${id}`);
        return { execution: "executed", verification: "failed", deleted: false, id, error: "Event still exists after deletion." };
      } catch (error) {
        if (error?.status === 404) return { execution: "executed", verification: "verified", deleted: true, id };
        return { execution: "executed", verification: "failed", deleted: null, id, error: error.message, retry: "read_before_retry" };
      }
    }},
];

// --- MCP Protocol (JSON-RPC over stdio) ---

function send(msg) { process.stdout.write(JSON.stringify(msg) + "\n"); }

function handleRequest(req) {
  const { id, method, params } = req;
  if (method === "initialize") return send({ jsonrpc: "2.0", id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "intervals-icu", version: "3.0.0" } } });
  if (method === "notifications/initialized") return;
  if (method === "tools/list") return send({ jsonrpc: "2.0", id, result: { tools: TOOLS.map(t => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })) } });
  if (method === "tools/call") {
    const tool = TOOLS.find(t => t.name === params.name);
    if (!tool) return send({ jsonrpc: "2.0", id, result: { isError: true, content: [{ type: "text", text: `Unknown tool: ${params.name}` }] } });
    const started = Date.now();
    const args = params.arguments || {};
    const traceArgs = Object.fromEntries(Object.entries(args).filter(([key]) => ["id", "oldest", "newest", "category", "start_date_local", "types"].includes(key)));
    tool.handler(args)
      .then(data => {
        traceOperation({ kind: "tool", tool: tool.name, arguments: traceArgs, ok: true, duration_ms: Date.now() - started, execution: data?.execution, verification: data?.verification });
        send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] } });
      })
      .catch(e => {
        traceOperation({ kind: "tool", tool: tool.name, arguments: traceArgs, ok: false, duration_ms: Date.now() - started, error_type: e?.constructor?.name || "Error" });
        send({ jsonrpc: "2.0", id, result: { isError: true, content: [{ type: "text", text: String(e.message || e) }] } });
      });
    return;
  }
  if (method?.startsWith("notifications/")) return;
  send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown method: ${method}` } });
}

const rl = createInterface({ input: process.stdin });
rl.on("line", line => { try { handleRequest(JSON.parse(line)); } catch {} });
