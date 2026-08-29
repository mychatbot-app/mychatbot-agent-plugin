---
name: mychatbot-plugin-basics-claude
description: >-
  Mandatory operating context before the first MyChatBot MCP call in a Claude
  Code conversation. Use for account audits, Sales or Agents setup, knowledge,
  channels, CRM work, routines, outreach, UGC, testing, or when a bundled
  MyChatBot server is missing or rejects its account key.
---

# MyChatBot plugin basics

Use this skill before the first MyChatBot MCP call. Treat the connected account
as live business state even when someone calls it a demo. Read
`references/platform-model.md` to choose the owning platform and
`references/safety.md` before customer data, tests, spending, activation,
external actions, replacement, or deletion.

## Route to the direct server

- **mychatbot-sales:** Sales assistants, instructions and skills, FAQs,
  websites, catalogs and feeds, integrations, channels, leads, chats, pipelines,
  labels, orders, calendars, follow-ups, outreach, test chats, evals, and Sales
  account usage.
- **mychatbot-agents:** Agents Platform agents, skills, connectors, Business
  Knowledge, routine YAML, schedules, triggers, validation, readiness, and
  tool-free previews.
- **mychatbot-ugc:** media generation, social accounts and posts, analytics,
  and ads.
- **mychatbot-docs:** public product documentation. Documentation is guidance,
  not evidence of current account state.

Call the named operation directly from its owning server. Do not look for an
extra orchestration wrapper; this plugin intentionally bundles the account MCPs
themselves. The current tool description and input schema are authoritative.
Never add or guess an
`account_id`; the server resolves the account from the configured key.

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
When a tool is not visible, search by the exact operation name and server; do
not substitute a similarly named operation from another platform.

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

## Credentials and human authorization

Never ask for the MyChatBot account access key, an OAuth token, API key,
password, or custom MCP Authorization header in the conversation. The account
key belongs only in Claude Code's masked plugin configuration. Third-party OAuth
uses the consent URL returned by its setup operation. API-key connectors and
credential-bearing custom MCP headers remain human entry steps in MyChatBot.

## Missing or rejected servers

Verify before reinstalling:

```bash
claude plugin details mychatbot@mychatbot-app
claude mcp get plugin:mychatbot:mychatbot-sales
claude mcp get plugin:mychatbot:mychatbot-agents
claude mcp get plugin:mychatbot:mychatbot-ugc
claude mcp get plugin:mychatbot:mychatbot-docs
```

If Sales, Agents, or UGC returns 401, direct the user to `/plugin` → Installed →
MyChatBot → Configure and let them enter a newly created account key in the
masked field. Do not run `claude mcp login`; these servers use the plugin's
sensitive key configuration. Reload plugins after the user applies it.
