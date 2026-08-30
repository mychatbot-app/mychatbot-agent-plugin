---
name: mychatbot-plugin-basics-claude
description: >-
  Mandatory operating context before the first MyChatBot MCP call in a Claude
  Code conversation. Use for account audits, Sales or Agents setup, knowledge,
  channels, CRM work, routines, outreach, UGC, testing, or when a bundled
  MyChatBot connection is missing or needs browser authorization.
---

# MyChatBot plugin basics

Use this skill before the first MyChatBot MCP call. Treat the connected account
as live business state even when someone calls it a demo. Read
`references/platform-model.md` to choose the owning platform and
`references/safety.md` before customer data, tests, spending, activation,
external actions, replacement, or deletion.
For an uncommon operation or an ambiguous workflow, read
`references/operation-map.md` to find its intended workflow. Load only the
workflow skill that owns the task; the live tool description and schema remain
authoritative.

Before any domain MCP call, load the one matching workflow skill with Claude's
`Skill` tool. Do not continue from this base skill alone:

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

- **Sales Platform operations:** Sales assistants, instructions and skills, FAQs,
  websites, catalogs and feeds, integrations, channels, leads, chats, pipelines,
  labels, orders, calendars, follow-ups, outreach, test chats, evals, and Sales
  account usage.
- **Agents Platform operations:** agents, skills, connectors, Business
  Knowledge, routine YAML, schedules, triggers, validation, readiness, and
  tool-free previews.
- **Content operations:** media generation, social accounts and posts, analytics,
  and ads.
- **Product guidance:** public product documentation. Documentation is guidance,
  not evidence of current account state.

The single `plugin:mychatbot:mychatbot` connection exposes these operations in
one namespace and dispatches each call to its owning platform implementation.
Call the named operation directly; do not look for an orchestration wrapper or
choose a second MyChatBot server. The current tool description and input schema
are authoritative. Never add or guess an `account_id`; the authenticated
connection resolves the account.

When Claude uses `ToolSearch`, invoke the returned
`mcp__plugin_mychatbot_mychatbot__*` tool directly. Never type an MCP operation
name into Bash or present it as a shell command.
If a direct tool is deferred, use `ToolSearch` and then emit that MCP tool call.
Do not construct a Bash script, Python subprocess, or `claude mcp call`
workaround.

## Orient before planning

Start with the smallest relevant read inventory:

- Sales or a cross-platform audit: `get_account_summary`, then the targeted
  list/detail tools; add `get_subscription_info` or `get_usage_summary` when
  eligibility or capacity matters.
- Agents work: `get_account_authoring_inventory`; before routines also call
  `get_routine_authoring_context` and read the authoritative Markdown URLs it
  returns.
- UGC work: only the exact models, social accounts, reports, or task state the
  explicit request needs.

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
account with email and a one-time code, then approve Claude Code. Third-party
OAuth uses the consent URL returned by its setup operation. API-key connectors
and credential-bearing custom MCP headers remain human entry steps in
MyChatBot.

## Missing or rejected servers

If the user says they do not have a MyChatBot account yet, do not delay for a
verification command. Give the direct login command immediately and explain
that its browser flow creates or reconnects the account with email and a
one-time code. Say explicitly that it can create a new account or reconnect an
existing one.

Verify before reinstalling:

```bash
claude plugin details mychatbot@mychatbot-app
claude mcp get plugin:mychatbot:mychatbot
```

If the connection is missing, reinstall from the source marketplace before
continuing. If it needs authorization, ask the user to run this command in an
interactive terminal:

```bash
claude mcp login plugin:mychatbot:mychatbot
```

When Claude itself must start the interactive command from a non-interactive
Bash tool, use Python's pseudo-terminal support inline and write progress to a
new temporary log file; do not depend on `CLAUDE_PLUGIN_ROOT`:

```bash
login_log="$(mktemp "${TMPDIR:-/tmp}/mychatbot-login.XXXXXX.log")"
python3 -c 'import pty,sys; pty.spawn(sys.argv[1:])' \
  claude mcp login plugin:mychatbot:mychatbot > "$login_log" 2>&1 &
printf 'MyChatBot sign-in started. Follow progress in %s\n' "$login_log"
```

Tell the user to complete the browser flow. Poll only the printed temporary
file for a success or error message without printing credential material.
After successful authorization, start a new Claude Code session so the tools
are available. Do not ask the user to copy a token from the MyChatBot app.
