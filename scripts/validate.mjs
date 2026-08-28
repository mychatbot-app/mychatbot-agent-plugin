import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const json = (relative) => JSON.parse(read(relative));
const fail = (message) => {
  throw new Error(message);
};

const marketplace = json(".claude-plugin/marketplace.json");
const plugin = json("claude/.claude-plugin/plugin.json");
const contract = json("contracts/connector-tools.json");

if (marketplace.name !== "mychatbot-app") fail("unexpected marketplace name");
if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length !== 1) {
  fail("marketplace must contain exactly one plugin");
}
if (marketplace.plugins[0].name !== plugin.name) fail("marketplace/plugin name mismatch");
if (marketplace.plugins[0].source !== "./claude") fail("marketplace source must be ./claude");
if (marketplace.plugins[0].version !== plugin.version) fail("marketplace/plugin version mismatch");
if (marketplace.plugins[0].repository !== plugin.repository) fail("marketplace/plugin repository mismatch");
if (plugin.mcpServers?.mychatbot?.type !== "http") fail("plugin must declare an HTTP MCP server");
if (plugin.mcpServers.mychatbot.url !== contract.surface) fail("plugin and contract MCP URLs differ");
if (plugin.mcpServers?.["mychatbot-docs"]?.type !== "http") {
  fail("plugin must declare the public Docs MCP server");
}
if (plugin.mcpServers["mychatbot-docs"].url !== contract.auxiliaryServers?.docs?.url) {
  fail("plugin and contract Docs MCP URLs differ");
}
if (plugin.skills !== "./skills/") fail("plugin skills path must be ./skills/");
if (!fs.existsSync(path.join(root, "claude", "SETUP.md"))) fail("plugin must include claude/SETUP.md");
if (!fs.existsSync(path.join(root, "SECURITY.md"))) fail("public plugin must include SECURITY.md");
if (
  plugin.mcpServers.mychatbot.headers?.[contract.pluginProfileHeader?.name] !==
  contract.pluginProfileHeader?.value
) {
  fail("plugin profile header differs from contract");
}

const allowedRisks = new Set([
  "read",
  "customer-data-read",
  "configuration",
  "customer-data-write",
  "private-test",
  "generation",
  "activation",
  "external-action",
  "destructive",
]);
const profileToolNames = new Set();
for (const tool of contract.profileTools ?? []) {
  if (!/^[a-z][a-z0-9_]+$/.test(tool.name)) fail(`invalid profile tool name: ${tool.name}`);
  if (profileToolNames.has(tool.name)) {
    fail(`duplicate profile tool name: ${tool.name}`);
  }
  if (!allowedRisks.has(tool.risk)) fail(`invalid risk for ${tool.name}: ${tool.risk}`);
  profileToolNames.add(tool.name);
}
if (profileToolNames.size < 1) fail("plugin profile contract is empty");

const allowedGateways = new Set([
  "read",
  "customer_data_read",
  "configuration",
  "customer_data_write",
  "test",
  "generation",
  "activation",
  "external_action",
  "destructive",
]);
const operationNames = new Set();
const operationCounts = {};
for (const [platform, platformContract] of Object.entries(contract.operations ?? {})) {
  let count = 0;
  for (const [gateway, names] of Object.entries(platformContract.gateways ?? {})) {
    if (!allowedGateways.has(gateway)) fail(`invalid ${platform} gateway: ${gateway}`);
    if (!Array.isArray(names)) fail(`${platform}.${gateway} must be an array`);
    for (const name of names) {
      if (!/^[a-z][a-z0-9_]+$/.test(name)) fail(`invalid ${platform} operation name: ${name}`);
      if (operationNames.has(name) || profileToolNames.has(name)) fail(`duplicate operation name: ${name}`);
      operationNames.add(name);
      count++;
    }
  }
  if (count !== platformContract.catalogSize) {
    fail(`${platform} catalog has ${count} operations; expected ${platformContract.catalogSize}`);
  }
  operationCounts[platform] = count;
}
if (!operationCounts.sales || !operationCounts.agents || !operationCounts.ugc) {
  fail("Sales, Agents, and UGC operation contracts are required");
}

const auxiliaryToolNames = new Set();
for (const [server, auxiliary] of Object.entries(contract.auxiliaryServers ?? {})) {
  if (auxiliary.risk !== "read") fail(`${server} auxiliary server must be read-only`);
  for (const name of auxiliary.tools ?? []) {
    if (!/^[a-z][a-z0-9_]+$/.test(name)) fail(`invalid ${server} auxiliary tool name: ${name}`);
    if (auxiliaryToolNames.has(name) || operationNames.has(name) || profileToolNames.has(name)) {
      fail(`duplicate auxiliary tool name: ${name}`);
    }
    auxiliaryToolNames.add(name);
  }
}
if (auxiliaryToolNames.size !== 3) fail("Docs MCP contract must pin its three read-only tools");

const referencedNames = new Set([...profileToolNames, ...operationNames, ...auxiliaryToolNames]);

const skillsRoot = path.join(root, "claude", "skills");
const skillFiles = fs
  .readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({ folder: entry.name, file: path.join(skillsRoot, entry.name, "SKILL.md") }));

if (skillFiles.length < 2) fail("expected multiple workflow skills");

const toolLike = /`((?:add|assistant|call|cancel|channel|claim|client|connect|create|delete|disable|disconnect|discover|enable|eval|export|follow|funnel|generate|get|hire|immediate|label|learn|list|outbound|pipeline|probe|remove|replace|reset|scan|send|set|start|test|tts|update|validate)_[a-z0-9_]+)`/g;
const documentedNonOperations = new Set([
  "assistant_id",
  "channel_id",
  "client_context",
  "client_id",
]);
for (const skill of skillFiles) {
  if (!fs.existsSync(skill.file)) fail(`missing SKILL.md for ${skill.folder}`);
  const body = fs.readFileSync(skill.file, "utf8");
  const frontmatter = body.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) fail(`missing frontmatter in ${skill.folder}`);
  const name = frontmatter[1].match(/^name:\s*([^\n]+)$/m)?.[1]?.trim();
  if (name !== skill.folder) fail(`skill name/folder mismatch: ${skill.folder}`);
  if (!/^description:\s*(?:>-|[^\n]+)/m.test(frontmatter[1])) {
    fail(`missing description in ${skill.folder}`);
  }
  if (/\b(?:TODO|TBD|FIXME)\b/.test(body)) fail(`unfinished placeholder in ${skill.folder}`);
  for (const match of body.matchAll(toolLike)) {
    if (documentedNonOperations.has(match[1])) continue;
    if (!referencedNames.has(match[1])) fail(`${skill.folder} references unknown tool ${match[1]}`);
  }
}

console.log(
  `Validated ${skillFiles.length} skills, ${profileToolNames.size} compact account tools, ` +
    `${auxiliaryToolNames.size} public Docs tools, and ` +
    `${operationNames.size} operations (${operationCounts.sales} Sales, ` +
    `${operationCounts.agents} Agents, ${operationCounts.ugc} UGC).`,
);
