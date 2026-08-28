import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contract = JSON.parse(fs.readFileSync(path.join(root, "contracts/connector-tools.json"), "utf8"));
const profileTools = new Map(contract.profileTools.map((tool) => [tool.name, tool.risk]));

const platformOperations = (platform) => {
  const result = new Map();
  for (const [gateway, names] of Object.entries(contract.operations[platform].gateways)) {
    for (const name of names) result.set(name, gateway);
  }
  return result;
};

const sales = platformOperations("sales");
const agents = platformOperations("agents");
const ugc = platformOperations("ugc");

test("public package declares setup, support, and source metadata", () => {
  const plugin = JSON.parse(
    fs.readFileSync(path.join(root, "claude/.claude-plugin/plugin.json"), "utf8"),
  );
  const marketplace = JSON.parse(
    fs.readFileSync(path.join(root, ".claude-plugin/marketplace.json"), "utf8"),
  );
  assert.equal(plugin.homepage, "https://mychatbot.app");
  assert.equal(plugin.author.email, "support@mychatbot.app");
  assert.equal(marketplace.plugins[0].displayName, "MyChatBot");
  assert.equal(marketplace.plugins[0].version, plugin.version);
  assert.equal(marketplace.plugins[0].repository, plugin.repository);
  assert.equal(
    plugin.mcpServers["mychatbot-docs"].url,
    "https://api.mychatbot.app/api/mcp/docs",
  );
  assert.deepEqual(contract.auxiliaryServers.docs.tools, [
    "get_docs_structure",
    "search_docs",
    "read_docs_page",
  ]);
  assert.ok(fs.existsSync(path.join(root, "claude/SETUP.md")));
  assert.ok(fs.existsSync(path.join(root, "SECURITY.md")));
});

test("compact profile exposes eleven risk-separated orchestration tools", () => {
  assert.equal(profileTools.size, 11);
  assert.equal(profileTools.get("get_account_context"), "read");
  assert.equal(profileTools.get("discover_operations"), "read");
  assert.equal(profileTools.get("call_customer_data_read_operation"), "customer-data-read");
  assert.equal(profileTools.get("call_customer_data_write_operation"), "customer-data-write");
  assert.equal(profileTools.get("call_test_operation"), "private-test");
  assert.equal(profileTools.get("call_generation_operation"), "generation");
  assert.equal(profileTools.get("call_activation_operation"), "activation");
  assert.equal(profileTools.get("call_external_action_operation"), "external-action");
  assert.equal(profileTools.get("call_destructive_operation"), "destructive");
});

test("complete upstream catalogs are pinned without duplicate operation names", () => {
  assert.equal(sales.size, 115);
  assert.equal(agents.size, 34);
  assert.equal(ugc.size, 17);
  const all = [...sales.keys(), ...agents.keys(), ...ugc.keys()];
  assert.equal(new Set(all).size, 166);
});

test("customer data is outside ordinary read and configuration gateways", () => {
  for (const name of ["list_clients", "get_client", "get_chat_messages", "get_order", "get_event"]) {
    assert.equal(sales.get(name), "customer_data_read", `${name} must use the private-data read gateway`);
  }
  for (const name of ["client_create", "client_update", "client_create_note", "client_update_task"]) {
    assert.equal(sales.get(name), "customer_data_write", `${name} must use the customer-record write gateway`);
  }
});

test("activation, external effects, generation, and destructive work remain distinct", () => {
  for (const name of ["connect_telegram", "create_website_widget", "enable_order_taking", "set_lead_form_mapping"]) {
    assert.equal(sales.get(name), "activation", `${name} must use the activation gateway`);
  }
  for (const name of ["send_one_off_message", "outbound_call", "immediate_outreach_create"]) {
    assert.equal(sales.get(name), "external_action", `${name} must use the external-action gateway`);
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
    assert.equal(sales.get(name), "destructive", `${name} must use the destructive gateway`);
  }
});

test("Agents full replacements, tests, activation, and cleanup use their exact classes", () => {
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
    assert.equal(agents.get(name), "destructive", `${name} must use the destructive gateway`);
  }
});
