#!/usr/bin/env node
import { readFileSync, realpathSync } from "fs";
import { relative, resolve, sep } from "path";
import { traceOperation } from "../src/trace.mjs";

const requested = process.argv[2];
if (!requested) {
  process.stderr.write("Usage: switchback resource read <path>\n");
  process.exit(2);
}
const root = realpathSync(process.cwd());
const path = realpathSync(resolve(root, requested));
const local = relative(root, path);
if (local.startsWith(`..${sep}`) || local === "..") throw new Error("Resource path must remain inside the athlete repository.");
const allowed = ["SOUL.md", "SOUL.example.md", "COMPANION.md", "athlete/", "skills/", "knowledge/", "agents/"];
if (!allowed.some(prefix => local === prefix || local.startsWith(prefix))) throw new Error("Resource path is outside the Switchback resource map.");
traceOperation({ kind: "resource_read", path: local });
process.stdout.write(readFileSync(path, "utf8"));
