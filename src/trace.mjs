import { appendFileSync, mkdirSync } from "fs";
import { dirname } from "path";

export function traceOperation(entry) {
  const path = process.env.SWITCHBACK_TRACE_FILE;
  if (!path) return;
  mkdirSync(dirname(path), { recursive: true });
  appendFileSync(path, `${JSON.stringify({ at: new Date().toISOString(), ...entry })}\n`, { mode: 0o600 });
}
