import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { acquireSyncLock, readCheckpoint, releaseSyncLock, writeCheckpoint } from "../src/sync-checkpoint.mjs";

test("sync checkpoint uses a lock and compare-and-swap update", () => {
  const dir = mkdtempSync(join(tmpdir(), "switchback-sync-"));
  const lock = join(dir, "sync.lock");
  const checkpoint = join(dir, "sync.json");
  try {
    acquireSyncLock(lock);
    assert.throws(() => acquireSyncLock(lock), /EEXIST/);
    writeCheckpoint(checkpoint, { through: "2026-09-01" }, null);
    assert.deepEqual(readCheckpoint(checkpoint), { through: "2026-09-01" });
    assert.throws(() => writeCheckpoint(checkpoint, { through: "2026-09-02" }, null), /concurrently/);
    releaseSyncLock(lock);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
