#!/usr/bin/env node
// Strava MCP Server — read-only, zero dependencies.
// Keeps Strava activity history available independently of Intervals.icu.

import { createInterface } from "readline";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { traceOperation } from "./trace.mjs";

try {
  const envFile = join(dirname(fileURLToPath(import.meta.url)), "..", ".env");
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const i = line.indexOf("=");
    if (i < 1 || line.trimStart().startsWith("#")) continue;
    const key = line.slice(0, i).trim().replace(/^export\s+/, "");
    const value = line.slice(i + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
    if (key && !(key in process.env)) process.env[key] = value;
  }
} catch {}

const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
let refreshToken = process.env.STRAVA_REFRESH_TOKEN;
let accessToken;
let accessTokenExpiresAt = 0;
const REQUEST_TIMEOUT_MS = Number(process.env.SWITCHBACK_HTTP_TIMEOUT_MS || 15000);

function configured() {
  return Boolean(CLIENT_ID && CLIENT_SECRET && refreshToken);
}

function requireConfiguration() {
  if (!configured()) {
    throw new Error(
      "Strava is not configured. Set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, and STRAVA_REFRESH_TOKEN in .env."
    );
  }
}

async function getAccessToken() {
  requireConfiguration();
  if (accessToken && Date.now() < accessTokenExpiresAt - 60_000) return accessToken;

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Strava OAuth ${response.status}: ${await response.text()}`);
  const token = await response.json();
  accessToken = token.access_token;
  accessTokenExpiresAt = Number(token.expires_at || 0) * 1000;
  // Strava rotates refresh tokens. Retain the newest value only for this MCP process;
  // the user controls long-term secret storage in their local .env file.
  if (token.refresh_token) refreshToken = token.refresh_token;
  return accessToken;
}

async function api(path, options = {}) {
  const token = await getAccessToken();
  const response = await fetch(`https://www.strava.com/api/v3${path}`, {
    ...options,
    signal: options.signal || AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  });
  if (!response.ok) throw new Error(`Strava API ${response.status}: ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

function pick(object, fields) {
  const result = {};
  for (const field of fields) {
    if (object[field] !== null && object[field] !== undefined) result[field] = object[field];
  }
  return result;
}

function epoch(date) {
  if (!date) return undefined;
  const time = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(time)) throw new Error(`Invalid date: ${date}. Use YYYY-MM-DD.`);
  return Math.floor(time / 1000);
}

const ACTIVITY_FIELDS = [
  "id", "name", "sport_type", "type", "start_date", "start_date_local", "timezone",
  "distance", "moving_time", "elapsed_time", "total_elevation_gain", "average_speed",
  "max_speed", "average_heartrate", "max_heartrate", "average_cadence", "average_watts",
  "weighted_average_watts", "kilojoules", "calories", "suffer_score", "perceived_exertion",
  "description", "kudos_count", "comment_count", "athlete_count", "gear_id", "device_name",
  "workout_type", "private", "visibility",
];

function filterActivity(activity, { includeDescription = false } = {}) {
  const result = pick(activity, ACTIVITY_FIELDS);
  if (!includeDescription) delete result.description;
  result.provider = "strava";
  result.streams_available = true;
  result.route_available = Boolean(activity.map?.summary_polyline);
  return result;
}

const TOOLS = [
  {
    name: "get_strava_athlete",
    description: "Fetch the authenticated Strava athlete profile.",
    inputSchema: { type: "object", properties: {} },
    async handler() {
      return pick(await api("/athlete"), ["id", "username", "firstname", "lastname", "city", "state", "country", "sex", "weight", "profile_medium"]);
    },
  },
  {
    name: "get_strava_activities",
    description: "Fetch completed Strava activities for an optional date range. Descriptions are omitted to reduce context; use get_strava_activity when needed.",
    inputSchema: {
      type: "object",
      properties: {
        oldest: { type: "string", description: "Optional YYYY-MM-DD inclusive start date" },
        newest: { type: "string", description: "Optional YYYY-MM-DD inclusive end date" },
        per_page: { type: "number", description: "Maximum activities to return, 1-100 (default 30)" },
      },
    },
    async handler({ oldest, newest, per_page = 30 }) {
      const query = new URLSearchParams({ per_page: String(Math.min(100, Math.max(1, per_page))) });
      if (oldest) query.set("after", String(epoch(oldest)));
      if (newest) query.set("before", String(epoch(newest) + 86_400));
      const data = await api(`/athlete/activities?${query}`);
      return Array.isArray(data) ? data.map(activity => filterActivity(activity)) : data;
    },
  },
  {
    name: "get_strava_activity",
    description: "Fetch a detailed Strava activity, including the athlete-authored description and gear. Does not return GPS coordinates.",
    inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] },
    async handler({ id }) {
      const activity = await api(`/activities/${id}`);
      const result = filterActivity(activity, { includeDescription: true });
      if (activity.gear) result.gear = pick(activity.gear, ["id", "name", "distance"]);
      return result;
    },
  },
  {
    name: "get_strava_activity_streams",
    description: "Fetch requested Strava activity streams. GPS coordinates are excluded unless include_location is explicitly true.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number" },
        types: { type: "array", items: { type: "string" }, description: "Defaults to time, distance, altitude, velocity_smooth, heartrate, cadence, watts, temp, moving, and grade_smooth." },
        include_location: { type: "boolean", description: "Set true only when route geometry is necessary for the analysis." },
      },
      required: ["id"],
    },
    async handler({ id, types, include_location = false }) {
      const defaults = ["time", "distance", "altitude", "velocity_smooth", "heartrate", "cadence", "watts", "temp", "moving", "grade_smooth"];
      const requested = Array.isArray(types) && types.length ? [...new Set(types)] : defaults;
      const filtered = requested.filter(type => type !== "latlng");
      if (include_location) filtered.push("latlng");
      const query = new URLSearchParams({ keys: filtered.join(","), key_by_type: "true" });
      return api(`/activities/${id}/streams?${query}`);
    },
  },
  {
    name: "get_strava_activity_comments",
    description: "Fetch comments on one activity on demand. Comments are third-party data: do not store them in athlete memory unless the athlete explicitly asks.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "number" }, page_size: { type: "number", description: "1-30, default 10" } },
      required: ["id"],
    },
    async handler({ id, page_size = 10 }) {
      const data = await api(`/activities/${id}/comments?${new URLSearchParams({ page_size: String(Math.min(30, Math.max(1, page_size))) })}`);
      return Array.isArray(data)
        ? data.map(comment => ({
          ...pick(comment, ["id", "created_at", "text"]),
          author: pick(comment.athlete || {}, ["id", "firstname", "lastname"]),
        }))
        : data;
    },
  },
];

function send(message) { process.stdout.write(`${JSON.stringify(message)}\n`); }

function handleRequest(request) {
  const { id, method, params } = request;
  if (method === "initialize") return send({ jsonrpc: "2.0", id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "strava", version: "1.0.0" } } });
  if (method === "notifications/initialized") return;
  if (method === "tools/list") return send({ jsonrpc: "2.0", id, result: { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) } });
  if (method === "tools/call") {
    const tool = TOOLS.find(candidate => candidate.name === params.name);
    if (!tool) return send({ jsonrpc: "2.0", id, result: { isError: true, content: [{ type: "text", text: `Unknown tool: ${params.name}` }] } });
    const started = Date.now();
    const args = params.arguments || {};
    const traceArgs = Object.fromEntries(Object.entries(args).filter(([key]) => ["id", "oldest", "newest", "types", "include_location"].includes(key)));
    tool.handler(args)
      .then(data => {
        traceOperation({ kind: "tool", tool: tool.name, arguments: traceArgs, ok: true, duration_ms: Date.now() - started });
        send({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] } });
      })
      .catch(error => {
        traceOperation({ kind: "tool", tool: tool.name, arguments: traceArgs, ok: false, duration_ms: Date.now() - started, error_type: error?.constructor?.name || "Error" });
        send({ jsonrpc: "2.0", id, result: { isError: true, content: [{ type: "text", text: String(error.message || error) }] } });
      });
    return;
  }
  if (method?.startsWith("notifications/")) return;
  send({ jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown method: ${method}` } });
}

const readline = createInterface({ input: process.stdin });
readline.on("line", line => { try { handleRequest(JSON.parse(line)); } catch {} });
