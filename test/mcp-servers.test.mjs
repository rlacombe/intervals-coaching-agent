import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = new URL("..", import.meta.url);
const rootPath = fileURLToPath(root);

async function runMcp(relativePath, requests) {
  const child = spawn(process.execPath, [fileURLToPath(new URL(relativePath, root))], {
    cwd: rootPath,
    env: {
      ...process.env,
      INTERVALS_API_KEY: "",
      INTERVALS_ATHLETE_ID: "",
      STRAVA_CLIENT_ID: "",
      STRAVA_CLIENT_SECRET: "",
      STRAVA_REFRESH_TOKEN: "",
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout.on("data", chunk => { stdout += chunk; });
  child.stderr.on("data", chunk => { stderr += chunk; });
  child.stdin.end(`${requests.map(request => JSON.stringify(request)).join("\n")}\n`);

  const exitCode = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  });
  assert.equal(exitCode, 0, stderr);
  return stdout.trim().split("\n").filter(Boolean).map(JSON.parse);
}

test("Strava MCP advertises its read-only tools without credentials", async () => {
  const responses = await runMcp("src/strava.mjs", [
    { jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
    { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
  ]);

  assert.equal(responses[0].result.serverInfo.name, "strava");
  const tools = responses[1].result.tools;
  assert.deepEqual(tools.map(tool => tool.name), [
    "get_strava_athlete",
    "get_strava_activities",
    "get_strava_activity",
    "get_strava_activity_streams",
    "get_strava_activity_comments",
  ]);
  assert.match(tools.find(tool => tool.name === "get_strava_activity_streams").description, /explicitly true/);
  assert.match(tools.find(tool => tool.name === "get_strava_activity_comments").description, /third-party data/);
});

test("Strava MCP reports missing configuration only when a data tool is called", async () => {
  const [response] = await runMcp("src/strava.mjs", [
    { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "get_strava_athlete", arguments: {} } },
  ]);

  assert.equal(response.result.isError, true);
  assert.match(response.result.content[0].text, /STRAVA_CLIENT_ID/);
});

test("Intervals MCP remains available to Strava-only users", async () => {
  const responses = await runMcp("src/index.mjs", [
    { jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
    { jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "get_athlete", arguments: {} } },
  ]);

  assert.equal(responses[0].result.serverInfo.name, "intervals-icu");
  assert.equal(responses[1].result.isError, true);
  assert.match(responses[1].result.content[0].text, /INTERVALS_API_KEY/);
});

test("Intervals MCP rejects malformed writes before network access", async () => {
  const [response] = await runMcp("src/index.mjs", [
    { jsonrpc: "2.0", id: 1, method: "tools/call", params: {
      name: "create_event", arguments: { name: "Run", start_date_local: "tomorrow" },
    } },
  ]);

  assert.equal(response.result.isError, true);
  assert.match(response.result.content[0].text, /YYYY-MM-DD/);
});
