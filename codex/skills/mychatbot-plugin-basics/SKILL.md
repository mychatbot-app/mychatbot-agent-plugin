---
name: mychatbot-plugin-basics
description: >-
  Mandatory operating context before the first MyChatBot MCP call in a Codex
  conversation. Use for account audits, Sales or Agents setup, knowledge,
  channels, CRM work, routines, outreach, content, testing, or when the
  MyChatBot connection is missing or needs browser authorization.
---

# MyChatBot plugin basics

Host scope: this skill is for Codex. In Claude Code, use
`mychatbot-plugin-basics-claude` instead.

Use this skill before the first MyChatBot MCP call. Treat the connected account
as live business state even when someone calls it a demo. Read
`references/platform-model.md` to choose the owning platform and
`references/safety.md` before customer data, tests, spending, activation,
external actions, replacement, or deletion.
For an uncommon operation or an ambiguous workflow, read
`references/operation-map.md` to find its intended workflow. Load only the
workflow skill that owns the task; the live tool description and schema remain
authoritative.

Before any domain MCP call, load the one matching workflow skill. Do not
continue from this base skill alone:

- account review → `account-audit`
- Sales assistant → `build-sales-assistant`
- agent, skill, or multi-agent system → `build-agent-system`
- FAQ, website, catalog, feed, or Business Knowledge → `business-knowledge`
- channel, integration, connector, or custom MCP → `channels-and-integrations`
- lead, chat, pipeline, label, order, or calendar → `crm-and-sales-operations`
- follow-up, campaign, outbound call, or message → `outreach-and-followups`
- routine, schedule, trigger, or Lead Forms mapping → `routines-and-automations`
- private chat test or eval → `test-and-evaluate`
- media, social post, analytics, or ads → `content-and-publishing`

## Route through the direct plugin connection

- **Sales Platform operations:** Sales assistants, instructions and skills,
  FAQs, websites, catalogs and feeds, integrations, channels, leads, chats,
  pipelines, labels, orders, calendars, follow-ups, outreach, test chats, evals,
  and Sales account usage.
- **Agents Platform operations:** agents, skills, connectors, Business
  Knowledge, routine YAML, schedules, triggers, validation, readiness, and
  tool-free previews.
- **Content operations:** media generation, social accounts and posts,
  analytics, and ads.
- **Product guidance:** public product documentation. Documentation is guidance,
  not evidence of current account state.

The configured `mychatbot` MCP server exposes these operations through
`mcp__mychatbot__*` in one namespace and dispatches each call to its owning
platform implementation. Call the named operation directly; do not look for an
orchestration wrapper or register a second MyChatBot server. The active MCP
schema is authoritative. Never add or guess an `account_id`; the authenticated
connection resolves the account.

When Codex discovers a deferred `mcp__mychatbot__*` operation, invoke that MCP
tool directly. Never type an MCP operation name into the shell or present it as
a command-line program.
If a direct tool is deferred, discover and then emit that MCP tool call. Do not
construct a shell script, subprocess, or `codex mcp call` workaround.

## Orient before planning

Start with the smallest relevant read inventory:

- Sales or a cross-platform audit: `get_account_summary`, then the targeted
  list/detail tools; add `get_subscription_info` or `get_usage_summary` when
  eligibility or capacity matters.
- Agents work: `get_account_authoring_inventory`; before routines also call
  `get_routine_authoring_context` and read the authoritative Markdown URLs it
  returns.
- Content work: only the exact models, social accounts, reports, or task state
  the explicit request needs.

Treat an error or partial section as unknown, not empty. Resolve real IDs from
fresh list/detail results. Prefer an existing healthy resource over a duplicate.
An omitted field in a compact list or partial detail response is also unknown;
do not turn missing response fields into claims that configuration is absent.
Complete every initial inventory read required by the selected workflow before
proposing configuration, even when owner details are still needed later.
When a tool is not visible, search by the exact operation name; do not
substitute a similarly named operation from another platform.

## Work in bounded stages

1. Read the exact target and dependencies immediately before proposing a change.
2. Show the intended outcome, affected resources, complete replacement values,
   and what remains unchanged.
3. Obtain approval for one bounded configuration or customer-record stage.
4. Obtain separate approval for a private test, billed preview or generation,
   activation, customer contact, publication, scheduling, disabling, full
   replacement, reset, disconnect, or deletion.
5. Execute the approved operation once. Never automatically retry a non-read
   operation after an ambiguous result.
6. Re-read persisted state and report partial or asynchronous outcomes honestly.
7. Hand back resource IDs, test evidence, enabled state, consent/configuration
   links, remaining human steps, and every live effect not verified.

A general audit does not call `list_clients`, `list_chats`,
`get_chat_messages`, order/event detail, audience previews, exports, or eval
detail. Read customer data only when the task requires it; minimize the record
set and summarize without unnecessary identifying detail.
A broad request to clean up records, prepare outreach, or update the right
customers does not authorize an unbounded customer-data read. Inspect ordinary
configuration first, then ask for the bounded customer-data-read stage.

## Credentials and human authorization

Never ask for a MyChatBot access key, OAuth token, one-time code, password, API
key, or custom MCP Authorization header in the conversation. MyChatBot account
authorization happens in the browser: the user can create or reconnect an
account with email and a one-time code, then approve Codex. Third-party OAuth
uses the consent URL returned by its setup operation. API-key connectors and
credential-bearing custom MCP headers remain human entry steps in MyChatBot.

## Missing or rejected connection

If the user says they do not have a MyChatBot account yet, do not delay for a
verification command. Offer the direct login command immediately and explain
that its browser flow creates or reconnects the account with email and a
one-time code. Say explicitly that it can create a new account or reconnect an
existing one.

Verify the configured server with `codex mcp get mychatbot`. If OAuth is needed,
offer to run `codex mcp login mychatbot`; it opens the browser signup/sign-in
flow. If browser authentication is unavailable from the CLI, direct the user to
re-authorize MyChatBot in Codex's MCP or plugin settings. Do not ask the user to
copy a token from the MyChatBot app.

After successful authorization, start a new Codex thread so the tools are
available. Reinstall only when `codex mcp get mychatbot` shows that the server
itself is missing.
