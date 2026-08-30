import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hostRoots = {
  claude: path.join(root, "claude", "skills"),
  codex: path.join(root, "codex", "skills"),
};
const skill = (host, name) => fs.readFileSync(path.join(hostRoots[host], name, "SKILL.md"), "utf8");
const workflowNames = [
  "account-audit",
  "build-agent-system",
  "build-sales-assistant",
  "business-knowledge",
  "channels-and-integrations",
  "content-and-publishing",
  "crm-and-sales-operations",
  "outreach-and-followups",
  "routines-and-automations",
  "test-and-evaluate",
];
const expectTerms = (host, name, terms) => {
  const body = skill(host, name).toLowerCase();
  for (const term of terms) assert.ok(body.includes(term.toLowerCase()), `${host}/${name} covers ${term}`);
};

test("both hosts cover every recurring integrator job family", () => {
  assert.deepEqual(
    fs.readdirSync(hostRoots.claude, { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name).sort(),
    [...workflowNames, "mychatbot-plugin-basics-claude"].sort(),
  );
  assert.deepEqual(
    fs.readdirSync(hostRoots.codex, { withFileTypes: true }).filter((x) => x.isDirectory()).map((x) => x.name).sort(),
    [...workflowNames, "mychatbot-plugin-basics"].sort(),
  );
  for (const host of ["claude", "codex"]) {
    expectTerms(host, "build-agent-system", ["agents platform", "skills", "connectors", "business knowledge", "routine", "schedules", "triggers"]);
    expectTerms(host, "build-sales-assistant", ["sales assistant", "instructions", "knowledge", "pipeline", "order", "channel"]);
    expectTerms(host, "business-knowledge", ["website", "faq", "catalog", "feed", "business knowledge"]);
    expectTerms(host, "channels-and-integrations", ["channels", "integrations", "connectors", "custom mcp"]);
    expectTerms(host, "crm-and-sales-operations", ["leads", "pipelines", "labels", "notes", "tasks", "attachments", "orders", "calendar", "conversations"]);
    expectTerms(host, "outreach-and-followups", ["follow-up", "one recipient", "campaign", "pausing", "resuming", "schedule_message"]);
    expectTerms(host, "routines-and-automations", ["routines", "schedules", "triggers", "lead forms", "follow-up", "update_integration_trigger"]);
    expectTerms(host, "test-and-evaluate", ["test_chat", "eval", "regression", "tool-call"]);
    expectTerms(host, "content-and-publishing", ["generate", "publish", "schedule", "analytics", "ads"]);
    expectTerms(host, "build-agent-system", ["get_routine_session_history", "customer inputs"]);
  }
});

test("every workflow inherits its host base and both copies stay aligned", () => {
  for (const name of workflowNames) {
    const claude = skill("claude", name);
    const codex = skill("codex", name);
    assert.match(claude, /Load `mychatbot-plugin-basics-claude`/);
    assert.match(codex, /Load `mychatbot-plugin-basics`/);
    const normalize = (body) => body
      .replaceAll("mychatbot-plugin-basics-claude", "mychatbot-plugin-basics")
      .replaceAll("Claude", "HOST")
      .replaceAll("Codex", "HOST");
    assert.equal(normalize(codex), normalize(claude), `${name} host copies drifted`);
  }
});

test("base skills enforce one OAuth connection and bounded approvals", () => {
  const claude = skill("claude", "mychatbot-plugin-basics-claude");
  const codex = skill("codex", "mychatbot-plugin-basics");
  for (const base of [claude, codex]) {
    assert.match(base, /Start with the smallest relevant read inventory/);
    assert.match(base, /Never automatically retry a non-read/);
    assert.match(base, /one namespace/);
    assert.match(base, /browser/);
    assert.match(base, /create or reconnect an\s+account/);
    assert.match(base, /Do not ask the user to\s+copy a\s+token/);
  }
  assert.match(claude, /plugin:mychatbot:mychatbot/);
  assert.match(claude, /claude mcp login plugin:mychatbot:mychatbot/);
  assert.doesNotMatch(claude, /\$\{CLAUDE_PLUGIN_ROOT\}/);
  assert.match(codex, /codex mcp login mychatbot/);
  assert.match(codex, /mcp__mychatbot__\*/);
});

test("behavior regressions have explicit workflow guardrails", () => {
  for (const host of ["claude", "codex"]) {
    expectTerms(host, "build-agent-system", ["even when the compact inventory", "separate approval"]);
    expectTerms(host, "build-sales-assistant", ["knowledge configuration", "private test", "customer-facing activation"]);
    expectTerms(host, "business-knowledge", ["reused instead of duplicated", "configuration approval"]);
    expectTerms(host, "channels-and-integrations", ["before any integration detail", "confirm=false", "browser oauth"]);
    expectTerms(host, "crm-and-sales-operations", ["through a shell or generated script", "bounded record scope"]);
    expectTerms(host, "outreach-and-followups", ["exact time and timezone", "schedule_message"]);
    expectTerms(host, "routines-and-automations", ["label the yaml as a draft", "separate approval"]);
    expectTerms(host, "test-and-evaluate", ["regression eval", "saved eval scenarios"]);
    expectTerms(host, "content-and-publishing", ["get_best_times_to_post", "before the exact model"]);
  }
});

test("skills contain no retired server split or connector router", () => {
  const copy = Object.entries(hostRoots)
    .flatMap(([host]) => fs.readdirSync(hostRoots[host], { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => skill(host, entry.name)))
    .join("\n");
  assert.doesNotMatch(copy, /mychatbot-(?:sales|agents|ugc|docs)/);
  assert.doesNotMatch(copy, /connector\.mychatbot\.app/);
  assert.doesNotMatch(copy, /get_account_context/);
  assert.doesNotMatch(copy, /discover_operations/);
  assert.doesNotMatch(copy, /call_(?:read|customer_data_read|configuration|customer_data_write|test|generation|activation|external_action|destructive)_operation/);
});

test("Claude setup performs browser signup and verifies the single server", () => {
  const setup = fs.readFileSync(path.join(root, "claude", "SETUP.md"), "utf8");
  assert.match(setup, /browser flow/);
  assert.match(setup, /email address and a one-time code/);
  assert.match(setup, /creates a MyChatBot account/);
  assert.match(setup, /plugin:mychatbot:mychatbot/);
  assert.match(setup, /mktemp/);
  assert.doesNotMatch(setup, /\$\{CLAUDE_PLUGIN_ROOT\}/);
  assert.match(setup, /https:\/\/api\.mychatbot\.app\/api\/mcp\/plugin/);
  assert.doesNotMatch(setup, /Configure.*key/is);
});

test("public plugin copy contains no retired rollout or prompt syntax", () => {
  const publicFiles = [
    "README.md",
    "SECURITY.md",
    "claude/SETUP.md",
    "docs/claude-code-install.md",
    "docs/codex-install.md",
    ...Object.entries(hostRoots).flatMap(([host, directory]) =>
      fs.readdirSync(directory, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.relative(root, path.join(directory, entry.name, "SKILL.md"))),
    ),
  ];
  const copy = publicFiles.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
  assert.doesNotMatch(copy, /private pilot/i);
  assert.doesNotMatch(copy, /\bdeployment\b/i);
  assert.doesNotMatch(copy, /\/goal\b/i);
  assert.doesNotMatch(copy, /account_access_key/);
});
