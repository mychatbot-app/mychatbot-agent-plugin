import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (relative) =>
  JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const contract = readJson("contracts/direct-mcp-tools.json");
const claudePlugin = readJson("claude/.claude-plugin/plugin.json");
const codexPlugin = readJson("codex/.codex-plugin/plugin.json");
const claudeServers = readJson("claude/.mcp.json").mcpServers;
const codexServers = readJson("codex/.mcp.json").mcpServers;

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

test("both hosts use one API-owned OAuth MCP connection", () => {
  assert.deepEqual(contract.servers.plugin, {
    url: "https://api.mychatbot.app/api/mcp/plugin",
    authentication: "oauth",
    bundled: true,
    composes: ["sales", "agents", "ugc", "docs"],
  });
  for (const servers of [claudeServers, codexServers]) {
    assert.deepEqual(Object.keys(servers), ["mychatbot"]);
    assert.equal(servers.mychatbot.url, contract.servers.plugin.url);
    assert.equal(servers.mychatbot.oauth_resource, contract.servers.plugin.url);
    assert.equal(servers.mychatbot.headers, undefined);
    assert.equal(servers.mychatbot.http_headers, undefined);
  }
  assert.equal(claudeServers.mychatbot.type, "http");
  assert.equal(claudePlugin.userConfig, undefined);
  assert.equal(codexPlugin.userConfig, undefined);
});

test("complete composed catalogs are pinned without duplicates", () => {
  assert.equal(sales.size, 154);
  assert.equal(agents.size, 35);
  assert.equal(ugc.size, 17);
  const accountTools = [...sales.keys(), ...agents.keys(), ...ugc.keys()];
  assert.equal(new Set(accountTools).size, 206);
  assert.equal(accountTools.length + contract.servers.docs.tools.length, 209);
  for (const platform of ["sales", "agents", "ugc", "docs"]) {
    assert.equal(contract.servers[platform].bundled, false);
    assert.equal(contract.servers[platform].composedBy, "plugin");
  }
});

test("Docs is composed and catalog Product MCP stays on demand", () => {
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
  assert.equal(agents.get("get_routine_session_history"), "customer_data_read");
  for (const name of ["client_create", "client_update", "client_create_note", "client_update_task"]) {
    assert.equal(sales.get(name), "customer_data_write", `${name} classification`);
  }
  assert.deepEqual(contract.mcpSafety.readOnlyExceptions, ["export_clients"]);
  assert.equal(sales.get("export_clients"), "customer_data_read");
  assert.equal(sales.get("export_chats"), "customer_data_read");
  assert.deepEqual(new Set(contract.mcpSafety.openWorldReads), new Set([
    "probe_connector", "test_knowledge_search", "get_docs_structure", "search_docs", "read_docs_page",
    "list_lead_forms", "get_lead_forms_automation",
    "get_post", "get_post_analytics", "get_best_times_to_post",
    "get_daily_metrics", "get_content_decay", "get_posting_frequency",
    "get_post_timeline", "list_ad_accounts", "list_campaigns",
    "get_campaign_tree", "list_ads",
  ]));
});

test("activation, external effects, generation, and destructive work stay distinct", () => {
  for (const name of ["connect_telegram", "create_website_widget", "enable_order_taking", "set_lead_form_mapping"]) {
    assert.equal(sales.get(name), "activation", `${name} classification`);
  }
  for (const name of [
    "send_one_off_message",
    "schedule_message",
    "outbound_call",
    "immediate_outreach_create",
  ]) {
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
    "update_integration_trigger",
  ]) {
    assert.equal(sales.get(name), "destructive", `${name} classification`);
  }
});

test("instruction and skill editing keeps reads apart from reversible writes", () => {
  for (const name of [
    "assistant_view_instructions",
    "assistant_list_instruction_versions",
    "assistant_view_skill",
    "assistant_list_skill_versions",
  ]) {
    assert.equal(sales.get(name), "read", `${name} classification`);
  }
  for (const name of [
    "assistant_patch_instructions",
    "assistant_restore_instructions",
    "assistant_patch_skill",
    "assistant_restore_skill",
  ]) {
    assert.equal(sales.get(name), "configuration", `${name} classification`);
  }
});

test("assistant setup tools keep reads, configuration, activation, and removals apart", () => {
  for (const name of [
    "assistant_get_settings",
    "assistant_get_working_hours",
    "assistant_get_flight_control",
    "assistant_list_control_numbers",
    "assistant_list_live_notes",
  ]) {
    assert.equal(sales.get(name), "read", `${name} classification`);
  }
  for (const name of ["assistant_update_settings", "set_channel_options", "assistant_add_live_note"]) {
    assert.equal(sales.get(name), "configuration", `${name} classification`);
  }
  // Activation: a new outbound data flow (an endpoint tool), hours that switch
  // the assistant on and off, a phone with standing authority over it.
  for (const name of ["api_action_create", "api_action_attach", "assistant_set_working_hours", "assistant_add_control_number"]) {
    assert.equal(sales.get(name), "activation", `${name} classification`);
  }
  for (const name of ["api_action_update", "assistant_remove_control_number", "assistant_remove_live_note"]) {
    assert.equal(sales.get(name), "destructive", `${name} classification`);
  }
});

test("lead structure and knowledge tools keep reads, customer data, configuration, and removals apart", () => {
  for (const name of ["list_managers", "list_lead_fields", "list_knowledge_sources", "test_knowledge_search", "assistant_get_model"]) {
    assert.equal(sales.get(name), "read", `${name} classification`);
  }
  // Duplicate pairs name customers and their phone numbers.
  assert.equal(sales.get("list_duplicate_clients"), "customer_data_read");
  for (const name of ["lead_field_create", "lead_field_update", "add_document_knowledge", "refresh_knowledge_source"]) {
    assert.equal(sales.get(name), "configuration", `${name} classification`);
  }
  // No undo, or many records at once: a merge deletes the source lead, a bulk
  // update overwrites many leads' status, labels or manager, a status rename
  // rewrites every lead in the status and leaves name-keyed settings behind,
  // a field key leaves the account's list.
  for (const name of ["lead_field_delete", "client_merge", "client_bulk_update", "funnel_status_update"]) {
    assert.equal(sales.get(name), "destructive", `${name} classification`);
  }
  // A website source is searched live.
  assert.ok(contract.mcpSafety.openWorldReads.includes("test_knowledge_search"));
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

test("public packages include source, support, legal, and release metadata", () => {
  const claudeMarketplace = readJson(".claude-plugin/marketplace.json");
  const codexMarketplace = readJson(".agents/plugins/marketplace.json");
  assert.equal(claudePlugin.version, "0.8.0");
  assert.equal(codexPlugin.version, claudePlugin.version);
  assert.equal(claudePlugin.author.email, "support@mychatbot.app");
  assert.equal(claudePlugin.license, "MIT");
  assert.equal(codexPlugin.license, "MIT");
  assert.equal(claudeMarketplace.plugins[0].version, undefined);
  assert.equal(codexMarketplace.plugins[0].source.path, "./codex");
  assert.equal(codexMarketplace.plugins[0].policy.authentication, "ON_INSTALL");
  assert.equal(codexPlugin.interface.privacyPolicyURL, "https://mychatbot.app/legal/privacy-policy");
  assert.equal(codexPlugin.interface.termsOfServiceURL, "https://mychatbot.app/legal/terms-of-service");
  for (const file of ["claude/SETUP.md", "README.md", "SECURITY.md", "CHANGELOG.md", "docs/RELEASING.md"]) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} exists`);
  }
});
