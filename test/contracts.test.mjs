import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contract = JSON.parse(fs.readFileSync(path.join(root, "contracts/connector-tools.json"), "utf8"));
const tools = new Map(contract.tools.map((tool) => [tool.name, tool.risk]));
const profileTools = new Map(contract.profileTools.map((tool) => [tool.name, tool.risk]));
const agentsOperations = new Map(
  contract.agentsOperations.map((operation) => [operation.name, operation.gateway]),
);

test("high-risk connector actions cannot be classified as ordinary configuration", () => {
  for (const name of [
    "send_one_off_message",
    "immediate_outreach_create",
    "delete_assistant",
    "delete_channel",
    "update_assistant_instructions",
  ]) {
    assert.ok(tools.has(name), `${name} is missing from the pinned contract`);
    assert.ok(
      ["external-action", "destructive"].includes(tools.get(name)),
      `${name} has unsafe risk ${tools.get(name)}`,
    );
  }
});

test("default audit tools are read-only and avoid customer records", () => {
  assert.equal(profileTools.get("get_deployment_context"), "read");
  for (const name of [
    "get_demo_status",
    "get_subscription_info",
    "get_usage_summary",
    "list_assistants",
    "list_integrations",
    "list_channels",
  ]) {
    assert.equal(tools.get(name), "read", `${name} must stay safe for the default audit`);
  }
  for (const name of ["list_clients", "get_client", "list_chats", "get_chat_messages"]) {
    assert.equal(tools.get(name), "customer-data-read", `${name} must stay outside the default audit`);
  }
});

test("every connector tool has one explicit risk classification", () => {
  assert.equal(tools.size, contract.tools.length);
  assert.equal(tools.size, 48);
  assert.ok([...tools.values()].every(Boolean));
});

test("deployment profile stays compressed and risk separated", () => {
  assert.equal(profileTools.size, 5);
  assert.equal(profileTools.get("agents_discover_tools"), "read");
  assert.equal(profileTools.get("agents_call_read_tool"), "read");
  assert.equal(profileTools.get("agents_call_configuration_tool"), "configuration");
  assert.equal(profileTools.get("agents_call_destructive_tool"), "destructive");
});

test("all Agents operations have one static gateway class", () => {
  assert.equal(agentsOperations.size, contract.agentsOperations.length);
  assert.equal(agentsOperations.size, 34);
  assert.equal([...agentsOperations.values()].filter((value) => value === "read").length, 10);
  assert.equal([...agentsOperations.values()].filter((value) => value === "configuration").length, 16);
  assert.equal([...agentsOperations.values()].filter((value) => value === "destructive").length, 8);

  for (const name of [
    "cancel_routine_run",
    "reset_agent_configuration",
    "delete_custom_agent",
    "delete_skill",
    "disconnect_connector",
    "delete_knowledge_source",
    "delete_routine_schedule",
    "delete_trigger",
  ]) {
    assert.equal(agentsOperations.get(name), "destructive", `${name} must use the destructive gateway`);
  }
});
