import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(root, "claude", "skills");
const skill = (name) => fs.readFileSync(path.join(skillsRoot, name, "SKILL.md"), "utf8");
const expectTerms = (name, terms) => {
  const body = skill(name).toLowerCase();
  for (const term of terms) {
    assert.ok(body.includes(term.toLowerCase()), `${name} must cover ${term}`);
  }
};

test("skill catalog covers the recurring integrator job families", () => {
  const names = fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(names, [
    "account-audit",
    "build-agent-system",
    "build-sales-assistant",
    "business-knowledge",
    "channels-and-integrations",
    "content-and-publishing",
    "crm-and-sales-operations",
    "mychatbot-plugin-basics-claude",
    "outreach-and-followups",
    "routines-and-automations",
    "test-and-evaluate",
  ]);

  expectTerms("build-agent-system", [
    "agents platform",
    "skills",
    "connectors",
    "business knowledge",
    "routine",
    "schedules",
    "triggers",
  ]);
  expectTerms("build-sales-assistant", [
    "sales assistant",
    "instructions",
    "knowledge",
    "pipeline",
    "order",
    "channel",
  ]);
  expectTerms("business-knowledge", ["website", "faq", "catalog", "feed", "business knowledge"]);
  expectTerms("channels-and-integrations", ["channels", "integrations", "connectors", "custom mcp"]);
  expectTerms("crm-and-sales-operations", [
    "leads",
    "pipelines",
    "labels",
    "notes",
    "tasks",
    "attachments",
    "orders",
    "calendar",
    "conversations",
  ]);
  expectTerms("outreach-and-followups", ["follow-up", "one recipient", "campaign", "pausing", "resuming"]);
  expectTerms("routines-and-automations", ["routines", "schedules", "triggers", "lead forms", "follow-up"]);
  expectTerms("test-and-evaluate", ["test_chat", "eval", "regression", "tool-call"]);
  expectTerms("content-and-publishing", ["generate", "publish", "schedule", "analytics", "ads"]);
});

test("every workflow inherits the base account and approval contract", () => {
  const base = skill("mychatbot-plugin-basics-claude");
  assert.match(base, /Call `get_account_context` first/);
  assert.match(base, /Never retry a non-read operation/);
  assert.match(base, /customer contact, publication/);

  for (const entry of fs.readdirSync(skillsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "mychatbot-plugin-basics-claude") continue;
    assert.match(
      skill(entry.name),
      /Load `mychatbot-plugin-basics-claude`/,
      `${entry.name} must load the mandatory base skill`,
    );
  }
});

test("public plugin copy contains no retired rollout or prompt syntax", () => {
  const publicFiles = [
    "README.md",
    "SECURITY.md",
    "claude/SETUP.md",
    "docs/claude-code-install.md",
    ...fs
      .readdirSync(skillsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `claude/skills/${entry.name}/SKILL.md`),
  ];
  const copy = publicFiles.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
  assert.doesNotMatch(copy, /private pilot/i);
  assert.doesNotMatch(copy, /\bdeployment\b/i);
  assert.doesNotMatch(copy, /\/goal\b/i);
});
