import { mkdirSync, openSync, closeSync, readFileSync, renameSync, rmSync, writeFileSync } from "fs";
import { dirname } from "path";

export function readCheckpoint(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

export function acquireSyncLock(path) {
  mkdirSync(dirname(path), { recursive: true });
  const fd = openSync(path, "wx", 0o600);
  closeSync(fd);
}

export function releaseSyncLock(path) {
  rmSync(path, { force: true });
}

export function writeCheckpoint(path, value, expectedPrevious = undefined) {
  const current = readCheckpoint(path);
  if (expectedPrevious !== undefined && JSON.stringify(current) !== JSON.stringify(expectedPrevious)) {
    throw new Error("Synchronization checkpoint changed concurrently.");
  }
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  renameSync(temporary, path);
}
