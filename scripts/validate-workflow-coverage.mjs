import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJSON = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const contract = readJSON("contracts/direct-mcp-tools.json");
const coverage = readJSON("contracts/workflow-coverage.json");
const write = process.argv.includes("--write");

const fail = (message) => { throw new Error(message); };
const expectedWorkflows = [
  "mychatbot-plugin-basics",
  "account-audit",
  "build-sales-assistant",
  "business-knowledge",
  "channels-and-integrations",
  "crm-and-sales-operations",
  "outreach-and-followups",
  "routines-and-automations",
  "build-agent-system",
  "test-and-evaluate",
  "content-and-publishing",
];
const allTools = new Set([
  ...Object.values(contract.operations).flatMap((platform) =>
    Object.values(platform.riskClasses).flat(),
  ),
  ...contract.servers.docs.tools,
  ...contract.servers.product.tools,
]);
const owners = new Map();

if (coverage.schemaVersion !== 1) fail("unsupported workflow coverage schema");
if (JSON.stringify(Object.keys(coverage.workflows)) !== JSON.stringify(expectedWorkflows)) {
  fail("workflow coverage keys or order do not match the shipped skills");
}
for (const [workflow, entry] of Object.entries(coverage.workflows)) {
  if (!Array.isArray(entry.tools) || entry.tools.length === 0) {
    fail(`${workflow} must own at least one operation`);
  }
  for (const tool of entry.tools) {
    if (!allTools.has(tool)) fail(`${workflow} owns unknown operation ${tool}`);
    if (owners.has(tool)) fail(`${tool} is owned by both ${owners.get(tool)} and ${workflow}`);
    owners.set(tool, workflow);
  }
}
const missing = [...allTools].filter((tool) => !owners.has(tool));
if (missing.length) fail(`operations without workflow ownership: ${missing.join(", ")}`);

const title = (workflow) => workflow
  .split("-")
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join(" ")
  .replace("Mychatbot", "MyChatBot");
const lines = [
  "# Operation map",
  "",
  "Use this index only to route an operation to the right workflow skill. The",
  "live MCP description and input schema are authoritative. Product operations",
  "require the separate on-demand Product MCP; all other operations use the",
  "bundled MyChatBot connection.",
  "",
];
for (const workflow of expectedWorkflows) {
  lines.push(`## ${title(workflow)}`, "", `Load \`${workflow}\` for:`, "");
  const workflowTools = coverage.workflows[workflow].tools;
  for (let index = 0; index < workflowTools.length; index += 6) {
    lines.push(workflowTools.slice(index, index + 6).map((tool) => `\`${tool}\``).join(", ") + ".");
  }
  lines.push("");
}
const rendered = `${lines.join("\n").trim()}\n`;
const targets = [
  "claude/skills/mychatbot-plugin-basics-claude/references/operation-map.md",
  "codex/skills/mychatbot-plugin-basics/references/operation-map.md",
];
for (const relative of targets) {
  const absolute = path.join(root, relative);
  if (write) fs.writeFileSync(absolute, rendered);
  else if (!fs.existsSync(absolute) || fs.readFileSync(absolute, "utf8") !== rendered) {
    fail(`${relative} is stale; run node scripts/validate-workflow-coverage.mjs --write`);
  }
}

console.log(`Validated intentional workflow ownership for ${allTools.size} direct operations.`);
