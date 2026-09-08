#!/usr/bin/env node
import { readFileSync } from "fs";
import { reconcileActivities } from "../src/activity-reconciliation.mjs";

const [intervalsPath, stravaPath] = process.argv.slice(2);
if (!intervalsPath || !stravaPath) {
  process.stderr.write("Usage: switchback reconcile <intervals.json> <strava.json>\n");
  process.exit(2);
}
const read = path => JSON.parse(readFileSync(path, "utf8"));
process.stdout.write(`${JSON.stringify(reconcileActivities(read(intervalsPath), read(stravaPath)), null, 2)}\n`);
