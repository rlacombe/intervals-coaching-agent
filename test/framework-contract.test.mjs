import assert from "node:assert/strict";
import { lstat, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("..", import.meta.url);
const read = path => readFile(new URL(path, root), "utf8");

test("canonical contract preserves core decision invariants", async () => {
  const contract = await read("COMPANION.md");
  for (const phrase of [
    "as\\s+evidence",
    "Set the health boundary",
    "least\\s+restrictive safe action",
    "Continuity through adaptation",
    "prior expectation, observed outcome",
    "long-term development; target events",
    "athlete/notes.md",
  ]) assert.match(contract, new RegExp(phrase));
});

test("deferred policies preserve tool, privacy, and memory invariants", async () => {
  const [tools, memory] = await Promise.all([read("agents/tool-policy.md"), read("agents/memory-policy.md")]);
  assert.match(tools, /42 complete days/);
  assert.match(tools, /read\s+back the saved state/);
  assert.match(tools, /count it once/);
  assert.match(memory, /Supersede\s+stale memory/i);
  assert.match(memory, /private athlete repository authorizes routine local notes/i);
  assert.match(memory, /Private-file reads may transmit content to the model provider/);
});

test("all generated harnesses share the canonical operations", async () => {
  const contracts = await Promise.all(["CLAUDE.md", "AGENTS.md", "GEMINI.md"].map(read));
  for (const contract of contracts) {
    assert.doesNotMatch(contract, /deliver the briefing|suggest 2-3 things/);
    assert.match(contract, /## Operations/);
    assert.match(contract, /Call MCP tools directly/);
    assert.match(contract, /agents\/activity-memory\.md/);
    assert.doesNotMatch(contract, /SWITCHBACK_TRACE_FILE|evaluation runners/i);
  }
});

test("contract routes before retrieval and keeps traces internal", async () => {
  const contract = await read("COMPANION.md");
  assert.ok(contract.indexOf("Select the relevant skill") < contract.indexOf("Retrieve athlete evidence"));
  assert.match(contract, /Keep\s+procedure names and traces out of athlete-facing prose/i);
});

test("contract defines consequential work, continuity, memory authority, and private retrieval", async () => {
  const contract = await read("COMPANION.md");
  assert.match(contract, /Advice is consequential when it changes/);
  assert.ok(contract.indexOf("athlete/checkpoint.md") < contract.indexOf("SOUL.md"));
  assert.ok(contract.indexOf("athlete/profile.md") < contract.indexOf("athlete/notes.md"));
  assert.match(contract, /what the athlete reports/);
  assert.match(contract, /agents\/memory-policy.md/);
});

test("skills have one provider-neutral source and Claude discovery alias", async () => {
  const alias = await lstat(new URL(".claude/skills", root));
  assert.equal(alias.isSymbolicLink(), true);
  await read("skills/build/SKILL.md");
});

test("skills implement calibrated evidence rules", async () => {
  const [adjust, build, check, race, review] = await Promise.all(
    ["adjust", "build", "check", "race", "review"].map(name => read(`skills/${name}/SKILL.md`)),
  );
  assert.doesNotMatch(adjust, /always recommend medical consultation/i);
  assert.match(adjust, /least restrictive safe option/);
  assert.match(build, /42 complete/);
  assert.match(check, /42 complete/);
  assert.doesNotMatch(race, /estimate finish time.*CTL/i);
  assert.match(race, /Never infer finish time/);
  assert.match(review, /10% as a review trigger interpreted in context/);
});

test("launcher does not give one provider privileged athlete context", async () => {
  const launcher = await read("switchback.sh");
  assert.doesNotMatch(launcher, /append-system-prompt-file|Build context/);
  for (const agent of ["claude", "codex", "gemini"]) assert.match(launcher, new RegExp(`exec ${agent} "Hey!"`));
});

test("knowledge base declares an evidence hierarchy", async () => {
  const policy = await read("knowledge/README.md");
  for (const kind of ["Research finding", "Coaching framework", "Operational heuristic", "Worked example"])
    assert.match(policy, new RegExp(kind));
});
