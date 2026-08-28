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
if (plugin.mcpServers?.mychatbot?.type !== "http") fail("plugin must declare an HTTP MCP server");
if (plugin.mcpServers.mychatbot.url !== contract.surface) fail("plugin and contract MCP URLs differ");
if (plugin.skills !== "./skills/") fail("plugin skills path must be ./skills/");
if (
  plugin.mcpServers.mychatbot.headers?.[contract.deploymentProfileHeader?.name] !==
  contract.deploymentProfileHeader?.value
) {
  fail("plugin deployment profile header differs from contract");
}

const allowedRisks = new Set([
  "read",
  "customer-data-read",
  "configuration",
  "private-test",
  "activation",
  "external-action",
  "destructive",
]);
const toolNames = new Set();
for (const tool of contract.tools ?? []) {
  if (!/^[a-z][a-z0-9_]+$/.test(tool.name)) fail(`invalid tool name: ${tool.name}`);
  if (toolNames.has(tool.name)) fail(`duplicate tool name: ${tool.name}`);
  if (!allowedRisks.has(tool.risk)) fail(`invalid risk for ${tool.name}: ${tool.risk}`);
  toolNames.add(tool.name);
}
if (toolNames.size < 1) fail("connector contract is empty");

const profileToolNames = new Set();
for (const tool of contract.profileTools ?? []) {
  if (!/^[a-z][a-z0-9_]+$/.test(tool.name)) fail(`invalid profile tool name: ${tool.name}`);
  if (profileToolNames.has(tool.name) || toolNames.has(tool.name)) {
    fail(`duplicate profile tool name: ${tool.name}`);
  }
  if (!allowedRisks.has(tool.risk)) fail(`invalid risk for ${tool.name}: ${tool.risk}`);
  profileToolNames.add(tool.name);
}
if (profileToolNames.size < 1) fail("deployment profile contract is empty");

const allowedGateways = new Set(["read", "configuration", "destructive"]);
const agentsOperationNames = new Set();
for (const operation of contract.agentsOperations ?? []) {
  if (!/^[a-z][a-z0-9_]+$/.test(operation.name)) {
    fail(`invalid Agents operation name: ${operation.name}`);
  }
  if (
    agentsOperationNames.has(operation.name) ||
    toolNames.has(operation.name) ||
    profileToolNames.has(operation.name)
  ) {
    fail(`duplicate Agents operation name: ${operation.name}`);
  }
  if (!allowedGateways.has(operation.gateway)) {
    fail(`invalid Agents gateway for ${operation.name}: ${operation.gateway}`);
  }
  agentsOperationNames.add(operation.name);
}
if (agentsOperationNames.size < 1) fail("Agents operation contract is empty");

const referencedNames = new Set([...toolNames, ...profileToolNames, ...agentsOperationNames]);

const skillsRoot = path.join(root, "claude", "skills");
const skillFiles = fs
  .readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({ folder: entry.name, file: path.join(skillsRoot, entry.name, "SKILL.md") }));

if (skillFiles.length < 2) fail("expected multiple workflow skills");

const toolLike = /`((?:add|agents|build|cancel|claim|connect|create|delete|disable|disconnect|enable|get|hire|immediate|list|probe|propose|replace|reset|send|set|start|test|update)_[a-z0-9_]+)`/g;
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
    if (!referencedNames.has(match[1])) fail(`${skill.folder} references unknown tool ${match[1]}`);
  }
}

console.log(
  `Validated ${skillFiles.length} skills, ${toolNames.size} owner tools, ` +
    `${profileToolNames.size} profile tools, and ${agentsOperationNames.size} Agents operations.`,
);
