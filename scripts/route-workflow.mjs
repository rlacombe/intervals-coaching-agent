#!/usr/bin/env node
import { routeWorkflow } from "../src/workflow-router.mjs";
import { traceOperation } from "../src/trace.mjs";

const query = process.argv.slice(2).join(" ");
try {
  const route = routeWorkflow(query);
  traceOperation({ kind: "workflow", candidates: route.candidates.map(candidate => candidate.task) });
  process.stdout.write(`${JSON.stringify(route)}\n`);
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
