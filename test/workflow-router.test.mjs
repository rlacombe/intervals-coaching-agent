import assert from "node:assert/strict";
import test from "node:test";
import { routeWorkflow } from "../src/workflow-router.mjs";

test("workflow router returns candidates without inventing a default", () => {
  assert.equal(routeWorkflow("Review yesterday's run").candidates[0].task, "review");
  assert.deepEqual(routeWorkflow("Tell me something unrelated").candidates, []);
  const compound = routeWorkflow("Plan my race nutrition and fueling").candidates.map(candidate => candidate.task);
  assert.ok(compound.includes("race"));
  assert.ok(compound.includes("nutrition"));
});
