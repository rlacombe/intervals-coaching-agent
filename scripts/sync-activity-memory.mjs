#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "fs";
import { basename, join, resolve } from "path";
import { validateActivityNote } from "../src/activity-note-policy.mjs";
import { reconcileActivities } from "../src/activity-reconciliation.mjs";
import { acquireSyncLock, readCheckpoint, releaseSyncLock, writeCheckpoint } from "../src/sync-checkpoint.mjs";
import { traceOperation } from "../src/trace.mjs";

function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function readActivities(path) {
  if (!path) return [];
  const value = JSON.parse(readFileSync(path, "utf8"));
  if (!Array.isArray(value)) throw new Error(`${path} must contain a JSON array.`);
  return value;
}

function value(session, ...fields) {
  for (const source of [session.intervals, session.strava]) {
    for (const field of fields) if (source?.[field] !== undefined && source[field] !== null) return source[field];
  }
  return null;
}

function localDate(session) {
  const raw = value(session, "start_date_local", "start_date");
  if (!Number.isFinite(Date.parse(raw))) throw new Error("Every activity requires a valid start date.");
  return raw.slice(0, 10);
}

function safeToken(value) {
  const token = String(value ?? "").replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!token) throw new Error("Every activity requires a usable source ID.");
  return token;
}

function safeTitle(value) {
  return String(value || "Activity").replace(/[\r\n|]+/g, " ").trim() || "Activity";
}

function noteFor(session, retrievedAt) {
  const ids = [session.intervals?.id && `intervals:${session.intervals.id}`, session.strava?.id && `strava:${session.strava.id}`].filter(Boolean);
  const provider = session.intervals && session.strava ? "intervals+strava" : session.intervals ? "intervals" : "strava";
  const id = ids.join("+");
  const start = value(session, "start_date_local", "start_date");
  const type = value(session, "type", "sport_type") || "unknown";
  const name = safeTitle(value(session, "name"));
  const rows = [
    ["Distance", value(session, "distance")], ["Moving time", value(session, "moving_time")],
    ["Elevation gain", value(session, "total_elevation_gain")], ["Average heart rate", value(session, "avg_hr", "average_heartrate")],
    ["Training load", value(session, "icu_training_load")], ["Perceived exertion", value(session, "perceived_exertion")],
  ].filter(([, metric]) => metric !== null);
  return `---\nid: ${JSON.stringify(id)}\nprovider: ${provider}\nsource_activity_ids: [${ids.map(item => JSON.stringify(item)).join(", ")}]\nstart_date_local: ${JSON.stringify(start)}\nretrieved_at: ${JSON.stringify(retrievedAt)}\nrecord_status: current\nsupersedes: null\nsuperseded_by: null\nroute_retained: false\n---\n\n# ${name}\n\n## Snapshot\n\n| Metric | Provider value |\n|---|---|\n${rows.map(([label, metric]) => `| ${label} | ${metric} |`).join("\n")}\n\n## Plan and execution\n\nNo plan comparison recorded during synchronization.\n\n## Derived assessment (hypothesis)\n\nNo interpretation recorded during synchronization. Review this activity before drawing conclusions.\n\n## Data retention\n\nCompact provider facts only; routes and raw streams are excluded.\n`;
}

function storedRecords(root) {
  if (!existsSync(root)) return [];
  const files = readdirSync(root, { recursive: true }).filter(path => /\.md$/.test(path) && !/(?:^|\/)summary\.md$/.test(path) && path !== "index.md");
  return files.map(relativePath => {
    const path = join(root, relativePath);
    const text = readFileSync(path, "utf8");
    validateActivityNote(text);
    const metric = label => Number(text.match(new RegExp(`\\| ${label} \\| ([0-9.]+) \\|`))?.[1] || 0);
    return {
      path,
      date: text.match(/^start_date_local:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1],
      name: text.match(/^# (.+)$/m)?.[1] || "Activity",
      moving_time: metric("Moving time"), distance: metric("Distance"), elevation: metric("Elevation gain"),
    };
  }).filter(record => record.date);
}

function writeSummaries(root) {
  const records = storedRecords(root);
  const months = new Map();
  for (const record of records) {
    const month = record.date.slice(0, 7);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(record);
  }
  const index = ["# Activity Memory Index", ""];
  for (const [month, entries] of [...months].sort()) {
    const [year, number] = month.split("-");
    const directory = join(root, year, number);
    mkdirSync(directory, { recursive: true });
    const total = field => entries.reduce((sum, entry) => sum + Number(entry[field] || 0), 0);
    const summary = `# ${month} Activity Summary\n\n- Activities: ${entries.length}\n- Moving time (seconds): ${total("moving_time")}\n- Distance (meters): ${total("distance")}\n- Elevation gain (meters): ${total("elevation")}\n\n## Records\n\n${entries.map(entry => `- [${entry.name}](${basename(entry.path)})`).join("\n")}\n`;
    writeFileSync(join(directory, "summary.md"), summary);
    index.push(`- [${month}](${year}/${number}/summary.md): ${entries.length} activities.`);
  }
  writeFileSync(join(root, "index.md"), `${index.join("\n")}\n`);
}

function updateProfileCheckpoint(through) {
  const path = resolve("athlete/profile.md");
  if (!existsSync(path)) return;
  const current = readFileSync(path, "utf8");
  const marker = /^- \*\*Activity-memory last sync:\*\*.*$/m;
  if (!marker.test(current)) throw new Error("athlete/profile.md lacks the Activity-memory last sync field.");
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, current.replace(marker, `- **Activity-memory last sync:** ${through}`), { mode: 0o600 });
  renameSync(temporary, path);
}

function validateProfileCheckpoint() {
  const path = resolve("athlete/profile.md");
  if (existsSync(path) && !/^- \*\*Activity-memory last sync:\*\*.*$/m.test(readFileSync(path, "utf8"))) {
    throw new Error("athlete/profile.md lacks the Activity-memory last sync field.");
  }
}

const intervalsPath = option("--intervals");
const stravaPath = option("--strava");
const through = option("--through");
const throughTime = Date.parse(`${through}T00:00:00Z`);
if ((!intervalsPath && !stravaPath) || !/^\d{4}-\d{2}-\d{2}$/.test(through || "") || !Number.isFinite(throughTime) || new Date(throughTime).toISOString().slice(0, 10) !== through) {
  process.stderr.write("Usage: switchback memory sync [--intervals file] [--strava file] --through YYYY-MM-DD\n");
  process.exit(2);
}

const root = resolve("athlete/activities");
const statePath = resolve(".switchback/activity-memory-sync.json");
const lockPath = resolve(".switchback/activity-memory-sync.lock");
const previous = readCheckpoint(statePath);
const retrievedAt = new Date().toISOString();
validateProfileCheckpoint();
acquireSyncLock(lockPath);
try {
  const sessions = reconcileActivities(readActivities(intervalsPath), readActivities(stravaPath));
  const records = [];
  let created = 0;
  for (const session of sessions) {
    const date = localDate(session);
    const provider = session.intervals && session.strava ? "combined" : session.intervals ? "intervals" : "strava";
    const sourceId = safeToken(session.intervals?.id || session.strava?.id);
    const directory = join(root, date.slice(0, 4), date.slice(5, 7));
    const path = join(directory, `${date}--${provider}--${sourceId}.md`);
    mkdirSync(directory, { recursive: true });
    if (!existsSync(path)) {
      const note = noteFor(session, retrievedAt);
      validateActivityNote(note);
      writeFileSync(path, note, { mode: 0o600 });
      created += 1;
    } else {
      validateActivityNote(readFileSync(path, "utf8"));
    }
    records.push({ path, date, name: value(session, "name") || "Activity", moving_time: value(session, "moving_time"), distance: value(session, "distance"), elevation: value(session, "total_elevation_gain") });
  }
  writeSummaries(root);
  writeCheckpoint(statePath, { through, completed_at: retrievedAt, records: records.length }, previous);
  updateProfileCheckpoint(through);
  traceOperation({ kind: "activity_memory_sync", through, records: records.length, created });
  process.stdout.write(`${JSON.stringify({ status: "verified", through, records: records.length, created })}\n`);
} finally {
  releaseSyncLock(lockPath);
}
