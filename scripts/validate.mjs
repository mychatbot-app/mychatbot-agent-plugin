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
const mcpServers = json("claude/.mcp.json").mcpServers;
const contract = json("contracts/direct-mcp-tools.json");

if (marketplace.name !== "mychatbot-app") fail("unexpected marketplace name");
if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length !== 1) {
  fail("marketplace must contain exactly one plugin");
}
const entry = marketplace.plugins[0];
if (entry.name !== plugin.name) fail("marketplace/plugin name mismatch");
if (entry.source !== "./claude") fail("marketplace source must be ./claude");
if (entry.version !== plugin.version) fail("marketplace/plugin version mismatch");
if (entry.repository !== plugin.repository) fail("marketplace/plugin repository mismatch");
if (plugin.skills !== "./skills/") fail("plugin skills path must be ./skills/");
if (plugin.mcpServers !== "./.mcp.json") fail("plugin MCP config path must be ./.mcp.json");

const keyConfig = plugin.userConfig?.account_access_key;
if (!keyConfig || keyConfig.type !== "string") fail("account access key config is required");
if (keyConfig.sensitive !== true || keyConfig.required !== true) {
  fail("account access key must be sensitive and required");
}

const pluginServerNames = {
  sales: "mychatbot-sales",
  agents: "mychatbot-agents",
  ugc: "mychatbot-ugc",
  docs: "mychatbot-docs",
};
const accountAuth = "Bearer ${user_config.account_access_key}";
for (const [contractName, pluginName] of Object.entries(pluginServerNames)) {
  const declared = mcpServers?.[pluginName];
  const expected = contract.servers?.[contractName];
  if (!declared || declared.type !== "http") fail(`missing HTTP server ${pluginName}`);
  if (declared.url !== expected?.url) fail(`${pluginName} URL differs from contract`);
  if (expected.authentication === "account-access-key") {
    if (declared.headers?.Authorization !== accountAuth) {
      fail(`${pluginName} must use sensitive account access key substitution`);
    }
  } else if (declared.headers?.Authorization) {
    fail(`${pluginName} must not send an account Authorization header`);
  }
}
if (Object.keys(mcpServers ?? {}).length !== 4) {
  fail("plugin must bundle exactly Sales, Agents, UGC, and Docs");
}
if (contract.servers.product?.bundled !== false) fail("Product MCP must remain on demand");

for (const required of ["claude/SETUP.md", "README.md", "SECURITY.md"]) {
  if (!fs.existsSync(path.join(root, required))) fail(`missing ${required}`);
}

const allowedRisks = new Set([
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
  if (platformContract.server !== platform) fail(`${platform} server ownership mismatch`);
  if (!contract.servers?.[platform]) fail(`${platform} server contract is missing`);
  let count = 0;
  for (const [risk, names] of Object.entries(platformContract.riskClasses ?? {})) {
    if (!allowedRisks.has(risk)) fail(`invalid ${platform} risk class: ${risk}`);
    if (!Array.isArray(names)) fail(`${platform}.${risk} must be an array`);
    for (const name of names) {
      if (!/^[a-z][a-z0-9_]+$/.test(name)) fail(`invalid ${platform} tool name: ${name}`);
      if (operationNames.has(name)) fail(`duplicate account tool name: ${name}`);
      operationNames.add(name);
      count++;
    }
  }
  if (count !== platformContract.catalogSize) {
    fail(`${platform} catalog has ${count} tools; expected ${platformContract.catalogSize}`);
  }
  operationCounts[platform] = count;
}
if (!operationCounts.sales || !operationCounts.agents || !operationCounts.ugc) {
  fail("Sales, Agents, and UGC contracts are required");
}

const auxiliaryToolNames = new Set();
for (const serverName of ["docs", "product"]) {
  const server = contract.servers[serverName];
  if (server.risk !== "read") fail(`${serverName} tools must be read-only`);
  for (const name of server.tools ?? []) {
    if (!/^[a-z][a-z0-9_]+$/.test(name)) fail(`invalid ${serverName} tool name: ${name}`);
    if (operationNames.has(name) || auxiliaryToolNames.has(name)) {
      fail(`duplicate direct tool name: ${name}`);
    }
    auxiliaryToolNames.add(name);
  }
}
if (contract.servers.docs.tools.length !== 3) fail("Docs must pin three tools");
if (contract.servers.product.tools.length !== 10) fail("Product must pin ten tools");

const referencedNames = new Set([...operationNames, ...auxiliaryToolNames]);
const skillsRoot = path.join(root, "claude", "skills");
const skillFiles = fs
  .readdirSync(skillsRoot, { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => ({ folder: item.name, file: path.join(skillsRoot, item.name, "SKILL.md") }));

if (skillFiles.length < 2) fail("expected multiple workflow skills");
const toolLike = /`((?:add|assistant|cancel|channel|claim|client|connect|create|delete|disable|disconnect|enable|eval|export|filter|find|follow|funnel|generate|get|hire|immediate|label|learn|list|outbound|pipeline|probe|remove|replace|reset|scan|semantic|send|set|start|test|tts|update|validate)_[a-z0-9_]+)`/g;
const documentedNonTools = new Set([
  "account_id",
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
    if (documentedNonTools.has(match[1])) continue;
    if (!referencedNames.has(match[1])) {
      fail(`${skill.folder} references unknown direct tool ${match[1]}`);
    }
  }
}

console.log(
  `Validated ${skillFiles.length} skills and ${operationNames.size + contract.servers.docs.tools.length} ` +
    `bundled tools (${operationCounts.sales} Sales, ${operationCounts.agents} Agents, ` +
    `${operationCounts.ugc} UGC, 3 Docs), plus 10 on-demand Product tools.`,
);
