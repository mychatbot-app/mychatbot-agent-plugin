import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const json = (relative) => JSON.parse(read(relative));
const fail = (message) => {
  throw new Error(message);
};

const packageJSON = json("package.json");
const contract = json("contracts/direct-mcp-tools.json");
const claudeMarketplace = json(".claude-plugin/marketplace.json");
const codexMarketplace = json(".agents/plugins/marketplace.json");
const claudePlugin = json("claude/.claude-plugin/plugin.json");
const codexPlugin = json("codex/.codex-plugin/plugin.json");
const claudeServers = json("claude/.mcp.json").mcpServers;
const codexServers = json("codex/.mcp.json").mcpServers;

if (packageJSON.version !== claudePlugin.version || packageJSON.version !== codexPlugin.version) {
  fail("package, Claude, and Codex versions must match");
}
if (!read("CHANGELOG.md").includes(`## [${packageJSON.version}]`)) {
  fail("current version must have a CHANGELOG entry");
}
for (const [host, plugin] of [["Claude", claudePlugin], ["Codex", codexPlugin]]) {
  if (plugin.name !== "mychatbot") fail(`${host} plugin name must be mychatbot`);
  if (plugin.skills !== "./skills/") fail(`${host} skills path must be ./skills/`);
  if (plugin.mcpServers !== "./.mcp.json") fail(`${host} MCP config path must be ./.mcp.json`);
  if (plugin.repository !== "https://github.com/mychatbot-app/mychatbot-agent-plugin.git") {
    fail(`${host} repository URL mismatch`);
  }
  if (plugin.license !== "MIT") fail(`${host} license must be MIT`);
  if (plugin.userConfig !== undefined) fail(`${host} plugin must not request pasted credentials`);
}

if (claudeMarketplace.name !== "mychatbot-app") fail("unexpected Claude marketplace name");
if (!Array.isArray(claudeMarketplace.plugins) || claudeMarketplace.plugins.length !== 1) {
  fail("Claude marketplace must contain exactly one plugin");
}
const claudeEntry = claudeMarketplace.plugins[0];
if (claudeEntry.name !== claudePlugin.name) fail("Claude marketplace/plugin name mismatch");
if (claudeEntry.source !== "./claude") fail("Claude marketplace source must be ./claude");
if (claudeEntry.version !== undefined) fail("Claude marketplace must use manifest version only");
if (claudeEntry.repository !== claudePlugin.repository) fail("Claude repository mismatch");
if (claudeEntry.homepage !== claudePlugin.homepage) fail("Claude homepage mismatch");

if (codexMarketplace.name !== "mychatbot-app") fail("unexpected Codex marketplace name");
if (!Array.isArray(codexMarketplace.plugins) || codexMarketplace.plugins.length !== 1) {
  fail("Codex marketplace must contain exactly one plugin");
}
const codexEntry = codexMarketplace.plugins[0];
if (codexEntry.name !== codexPlugin.name) fail("Codex marketplace/plugin name mismatch");
if (codexEntry.source?.source !== "local" || codexEntry.source?.path !== "./codex") {
  fail("Codex marketplace must point to ./codex");
}
if (codexEntry.policy?.installation !== "AVAILABLE") fail("Codex plugin must be public");
if (codexEntry.policy?.authentication !== "ON_INSTALL") fail("Codex OAuth must run on install");
if (codexEntry.policy?.products !== undefined) fail("Codex plugin must not be product-gated");

const pluginServer = contract.servers?.plugin;
if (!pluginServer || pluginServer.authentication !== "oauth" || pluginServer.bundled !== true) {
  fail("contract must define one bundled OAuth plugin server");
}
if (JSON.stringify(pluginServer.composes) !== JSON.stringify(["sales", "agents", "ugc", "docs"])) {
  fail("plugin server must compose Sales, Agents, UGC, and Docs");
}
for (const [host, servers, requireType] of [
  ["Claude", claudeServers, true],
  ["Codex", codexServers, false],
]) {
  if (JSON.stringify(Object.keys(servers ?? {})) !== JSON.stringify(["mychatbot"])) {
    fail(`${host} must configure exactly one MyChatBot server`);
  }
  const server = servers.mychatbot;
  if (requireType && server.type !== "http") fail("Claude server must use HTTP transport");
  if (server.url !== pluginServer.url || server.oauth_resource !== pluginServer.url) {
    fail(`${host} OAuth resource must match the plugin endpoint`);
  }
  if (server.headers !== undefined || server.http_headers !== undefined) {
    fail(`${host} server must not embed authorization headers`);
  }
}

const interfaceData = codexPlugin.interface;
for (const field of [
  "displayName",
  "shortDescription",
  "longDescription",
  "developerName",
  "category",
  "websiteURL",
  "privacyPolicyURL",
  "termsOfServiceURL",
]) {
  if (!interfaceData?.[field]) fail(`Codex interface is missing ${field}`);
}
if (!Array.isArray(interfaceData.defaultPrompt) || interfaceData.defaultPrompt.length !== 3) {
  fail("Codex must provide exactly three starter prompts");
}
for (const prompt of interfaceData.defaultPrompt) {
  if (prompt.length > 128) fail("Codex starter prompt exceeds 128 characters");
}

for (const required of [
  "claude/SETUP.md",
  "README.md",
  "SECURITY.md",
  "docs/claude-code-install.md",
  "docs/codex-install.md",
  "docs/RELEASING.md",
  "evals/README.md",
]) {
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
  const server = contract.servers?.[platform];
  if (!server || server.bundled !== false || server.composedBy !== "plugin") {
    fail(`${platform} must be composed by the plugin server`);
  }
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
if (operationCounts.sales !== 117 || operationCounts.agents !== 35 || operationCounts.ugc !== 17) {
  fail("unexpected account operation counts");
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
if (contract.servers.product.bundled !== false || contract.servers.product.tools.length !== 10) {
  fail("Product must remain a ten-tool on-demand server");
}
if (operationNames.size + contract.servers.docs.tools.length !== 172) {
  fail("bundled plugin contract must contain exactly 172 tools");
}

const referencedNames = new Set([...operationNames, ...auxiliaryToolNames]);
const toolLike = /`((?:add|assistant|cancel|channel|claim|client|connect|create|delete|disable|disconnect|enable|eval|export|filter|find|follow|funnel|generate|get|hire|immediate|label|learn|list|outbound|pipeline|probe|remove|replace|reset|scan|schedule|semantic|send|set|start|test|tts|update|validate)_[a-z0-9_]+)`/g;
const documentedNonTools = new Set([
  "account_id",
  "assistant_id",
  "channel_id",
  "client_context",
  "client_id",
]);
const hostSkills = [
  { host: "Claude", root: "claude/skills", base: "mychatbot-plugin-basics-claude" },
  { host: "Codex", root: "codex/skills", base: "mychatbot-plugin-basics" },
];
for (const host of hostSkills) {
  const skillsRoot = path.join(root, host.root);
  const skillFolders = fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);
  if (skillFolders.length !== 11 || !skillFolders.includes(host.base)) {
    fail(`${host.host} must contain the base skill and ten workflow skills`);
  }
  for (const folder of skillFolders) {
    const file = path.join(skillsRoot, folder, "SKILL.md");
    if (!fs.existsSync(file)) fail(`missing ${host.host} SKILL.md for ${folder}`);
    const body = fs.readFileSync(file, "utf8");
    const frontmatter = body.match(/^---\n([\s\S]*?)\n---\n/);
    if (!frontmatter) fail(`missing frontmatter in ${host.host} ${folder}`);
    const name = frontmatter[1].match(/^name:\s*([^\n]+)$/m)?.[1]?.trim();
    if (name !== folder) fail(`skill name/folder mismatch: ${host.host} ${folder}`);
    if (!/^description:\s*(?:>-|[^\n]+)/m.test(frontmatter[1])) {
      fail(`missing description in ${host.host} ${folder}`);
    }
    if (/\b(?:TODO|TBD|FIXME)\b/.test(body)) fail(`unfinished placeholder in ${host.host} ${folder}`);
    for (const match of body.matchAll(toolLike)) {
      if (documentedNonTools.has(match[1])) continue;
      if (!referencedNames.has(match[1])) {
        fail(`${host.host} ${folder} references unknown direct tool ${match[1]}`);
      }
    }
  }
}

const publicFiles = [
  "README.md",
  "SECURITY.md",
  "claude/SETUP.md",
  "docs/claude-code-install.md",
  "docs/codex-install.md",
  ...hostSkills.flatMap((host) =>
    fs
      .readdirSync(path.join(root, host.root), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `${host.root}/${entry.name}/SKILL.md`),
  ),
];
const publicCopy = publicFiles.map(read).join("\n");
if (/private pilot/i.test(publicCopy) || /\bdeployment\b/i.test(publicCopy) || /\/goal\b/i.test(publicCopy)) {
  fail("public copy contains retired rollout or prompt language");
}
if (/account_access_key|Bearer \$\{user_config/i.test(publicCopy)) {
  fail("public copy contains retired pasted-key configuration");
}

console.log(
  `Validated Claude and Codex packages, 22 skills, and 172 bundled tools ` +
    `(${operationCounts.sales} Sales, ${operationCounts.agents} Agents, ` +
    `${operationCounts.ugc} content, 3 Docs), plus 10 on-demand Product tools.`,
);
