import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contract = JSON.parse(fs.readFileSync(path.join(root, "contracts/connector-tools.json"), "utf8"));
const tools = new Map(contract.tools.map((tool) => [tool.name, tool.risk]));

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
