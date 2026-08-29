import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (relative) =>
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const contract = readJson("contracts/direct-mcp-tools.json");
const plugin = readJson("claude/.claude-plugin/plugin.json");
const mcpServers = readJson("claude/.mcp.json").mcpServers;

const platformTools = (platform) => {
  const result = new Map();
  for (const [risk, names] of Object.entries(contract.operations[platform].riskClasses)) {
    for (const name of names) result.set(name, risk);
  }
  return result;
};

const sales = platformTools("sales");
const agents = platformTools("agents");
const ugc = platformTools("ugc");

test("plugin bundles four direct MyChatBot servers", () => {
  assert.equal(plugin.mcpServers, "./.mcp.json");
  assert.deepEqual(Object.keys(mcpServers).sort(), [
    "mychatbot-agents",
    "mychatbot-docs",
    "mychatbot-sales",
    "mychatbot-ugc",
  ]);
  assert.equal(
    mcpServers["mychatbot-sales"].url,
    "https://api.mychatbot.app/api/mcp/sales-management",
  );
  assert.equal(
    mcpServers["mychatbot-agents"].url,
    "https://api.mychatbot.app/api/mcp/agents",
  );
  assert.equal(
    mcpServers["mychatbot-ugc"].url,
    "https://api.mychatbot.app/api/mcp/ugc",
  );
  assert.equal(
    mcpServers["mychatbot-docs"].url,
    "https://api.mychatbot.app/api/mcp/docs",
  );
  for (const name of ["mychatbot-sales", "mychatbot-agents", "mychatbot-ugc"]) {
    assert.equal(
      mcpServers[name].headers.Authorization,
      "Bearer ${user_config.account_access_key}",
    );
  }
  assert.equal(mcpServers["mychatbot-docs"].headers, undefined);
});

test("account key is required and stored as sensitive plugin configuration", () => {
  assert.deepEqual(
    {
      type: plugin.userConfig.account_access_key.type,
      sensitive: plugin.userConfig.account_access_key.sensitive,
      required: plugin.userConfig.account_access_key.required,
    },
    { type: "string", sensitive: true, required: true },
  );
});

test("complete direct account catalogs are pinned without duplicates", () => {
  assert.equal(sales.size, 115);
  assert.equal(agents.size, 34);
  assert.equal(ugc.size, 17);
  const all = [...sales.keys(), ...agents.keys(), ...ugc.keys()];
  assert.equal(new Set(all).size, 166);
});

test("Docs is bundled and catalog Product MCP stays on demand", () => {
  assert.deepEqual(contract.servers.docs.tools, [
    "get_docs_structure",
    "search_docs",
    "read_docs_page",
  ]);
  assert.equal(contract.servers.docs.authentication, "public");
  assert.equal(contract.servers.product.bundled, false);
  assert.equal(contract.servers.product.authentication, "credential-bearing-url");
  assert.equal(contract.servers.product.tools.length, 10);
  assert.ok(contract.servers.product.tools.includes("semantic_product_search"));
});

test("customer data stays distinct from ordinary reads and configuration", () => {
  for (const name of ["list_clients", "get_client", "get_chat_messages", "get_order", "get_event"]) {
    assert.equal(sales.get(name), "customer_data_read", `${name} classification`);
  }
  for (const name of ["client_create", "client_update", "client_create_note", "client_update_task"]) {
    assert.equal(sales.get(name), "customer_data_write", `${name} classification`);
  }
});

test("activation, external effects, generation, and destructive work stay distinct", () => {
  for (const name of ["connect_telegram", "create_website_widget", "enable_order_taking", "set_lead_form_mapping"]) {
    assert.equal(sales.get(name), "activation", `${name} classification`);
  }
  for (const name of ["send_one_off_message", "outbound_call", "immediate_outreach_create"]) {
    assert.equal(sales.get(name), "external_action", `${name} classification`);
  }
  assert.equal(ugc.get("generate_media"), "generation");
  assert.equal(ugc.get("tts"), "generation");
  assert.equal(ugc.get("create_post"), "external_action");
  for (const name of [
    "assistant_update_instructions",
    "update_faq_knowledge_base_entries",
    "learn_website",
    "channel_toggle",
    "delete_assistant",
    "eval_run_cancel",
  ]) {
    assert.equal(sales.get(name), "destructive", `${name} classification`);
  }
});

test("Agents replacements, tests, activation, and cleanup retain exact classes", () => {
  assert.equal(agents.get("start_routine_dry_run"), "test");
  assert.equal(agents.get("set_routine_schedule_enabled"), "activation");
  assert.equal(agents.get("set_trigger_enabled"), "activation");
  for (const name of [
    "update_routine",
    "replace_agent_configuration",
    "replace_skill",
    "disconnect_connector",
    "delete_knowledge_source",
  ]) {
    assert.equal(agents.get(name), "destructive", `${name} classification`);
  }
});

test("public package includes source, support, setup, and privacy metadata", () => {
  const marketplace = readJson(".claude-plugin/marketplace.json");
  assert.equal(
    plugin.homepage,
    "https://docs.mychatbot.app/agents/claude-code-plugin",
  );
  assert.equal(plugin.author.email, "support@mychatbot.app");
  assert.equal(plugin.license, "MIT");
  assert.equal(marketplace.plugins[0].displayName, "MyChatBot");
  assert.equal(marketplace.plugins[0].version, plugin.version);
  assert.equal(marketplace.plugins[0].homepage, plugin.homepage);
  assert.ok(fs.existsSync(path.join(root, "claude/SETUP.md")));
  assert.ok(fs.existsSync(path.join(root, "SECURITY.md")));
  assert.match(fs.readFileSync(path.join(root, "README.md"), "utf8"), /privacy policy/i);
});
