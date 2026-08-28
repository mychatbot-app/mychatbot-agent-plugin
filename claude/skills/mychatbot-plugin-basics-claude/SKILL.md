---
name: mychatbot-plugin-basics-claude
description: >-
  Mandatory operating context before the first MyChatBot plugin MCP call in a
  Claude Code conversation. Use for account audits, Sales or Agents setup,
  knowledge, channels, CRM work, routines, outreach, UGC, testing, or when the
  MyChatBot plugin is missing or needs authentication.
---

# MyChatBot plugin basics

Use this skill before the first call to `plugin:mychatbot:mychatbot`. Treat the
connected account as live business state even when someone calls it a demo.
Fresh tool results and schemas returned by `discover_operations` are the runtime
contract.

## Orient before planning

Call `get_account_context` first. It returns secret-free Sales metadata and the
Agents authoring inventory, changes nothing, and marks partial sections. Empty
or failed sections are unknown, not proof that no resource exists.

Use `discover_operations` narrowly:

- choose `sales`, `agents`, or `ugc`;
- browse with a relevant domain or query;
- request exact `tool_names` before calling so the current schemas are included;
- call only the returned `gateway_tool`, with schema-shaped arguments and no
  account ID.

The plugin exposes 11 orchestration tools over 166 statically classified
operations. It does not expose the browser connector's simplified tool aliases.
Read [references/platform-model.md](references/platform-model.md) when choosing
the owning platform. Read [references/safety.md](references/safety.md) before
private data, tests, spending, activation, external actions, or destructive work.

The bundled public Docs MCP adds `get_docs_structure`, `search_docs`, and
`read_docs_page`. Use it for current product concepts, feature behavior, and
human setup instructions that the discovered operation schema does not answer.
Documentation is not account-state evidence; re-read the account before acting.

## Work in bounded stages

1. Inspect the exact target immediately before planning a change.
2. Explain the outcome, affected resources, full replacements, and what remains
   unchanged.
3. Obtain approval for one bounded configuration or customer-record stage.
4. Obtain separate approval for private tests, billed generation, activation,
   customer contact, publication, scheduling, disabling, replacement, or deletion.
5. Execute the approved stage once. Never retry a non-read operation after an
   ambiguous result.
6. Re-read persisted state and report partial outcomes honestly.
7. Hand back resource IDs, tests, enabled state, consent/configuration links,
   remaining human steps, and every live boundary not verified.

Default audits use `call_read_operation`, not
`call_customer_data_read_operation`. Customer records, messages, bookings,
orders, audiences, exports, and eval transcripts are read only when the task
requires them and are summarized without unnecessary identifying detail.

## Credentials and human authorization

Never ask for a MyChatBot access token, OAuth token, API key, password, or
custom MCP authorization header in the conversation. Use the plugin OAuth flow.
Third-party OAuth uses the consent URL returned by the relevant operation.
API-key connectors and authenticated custom MCP headers remain app-only; direct
the user to **Agents → Connectors** rather than routing a secret through Claude.

## Missing tools

If the tools are absent, verify the installed plugin before reinstalling:

```bash
claude plugin details mychatbot@mychatbot-app
claude mcp get plugin:mychatbot:mychatbot
claude mcp get plugin:mychatbot:mychatbot-docs
claude mcp login plugin:mychatbot:mychatbot
```

After authentication, reload plugins or start a new Claude Code conversation.
