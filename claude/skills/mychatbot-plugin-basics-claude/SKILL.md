---
name: mychatbot-plugin-basics-claude
description: >-
  Mandatory operating context before the first MyChatBot plugin MCP call in a
  Claude Code conversation. Use for MyChatBot account audits, sales-agent or
  chatbot deployment, knowledge, channels, tests, customer operations,
  outreach, or when the MyChatBot tools are missing or need authentication.
---

# MyChatBot plugin basics

Use this skill before the first tool call to `plugin:mychatbot:mychatbot`.
Treat the connected account as live business state even when the owner calls it
a demo. MCP schemas and fresh tool results are the runtime contract.

## Establish orientation

In a new connection, call `get_demo_status` first. It identifies any demo
created during OAuth signup and prevents accidentally creating a second widget.
For deployment work, continue with the smallest read-only inventory needed for
the request. Prefer `list_assistants`, `list_integrations`, `list_channels`,
`get_subscription_info`, and `get_usage_summary` before proposing changes.

Do not read chats, messages, clients, or campaign audiences merely to make an
account audit look comprehensive. Those tools expose customer data; use them
only when the task actually requires that data.

## Platform boundary

MyChatBot has two related platforms:

- The Sales Platform runs customer-facing assistants, channels, sales
  knowledge, leads, orders, follow-ups, and conversations.
- The Agents Platform runs account-scoped agents, connectors, Business
  Knowledge, skills, and routines for operator and back-office work.

The current plugin gateway exposes the curated Sales Platform surface. Do not
claim that Agents Platform resources were inspected or configured unless the
corresponding Agents tools are visible in the runtime manifest. Product search
for an Agents Platform agent belongs in Business Knowledge, not a Sales tools
toggle.

Read [references/platform-model.md](references/platform-model.md) when choosing
between Sales knowledge, product catalogs, and Agents Business Knowledge. Read
[references/safety.md](references/safety.md) before billed, externally visible,
credential-bearing, or destructive work.

## Operating contract

1. Inspect relevant state immediately before planning a write.
2. Explain the intended outcome and exact resources affected.
3. Group reversible configuration into a bounded stage and obtain approval.
4. Obtain separate approval for activation, spending, customer communication,
   publication, scheduling, or deletion.
5. Execute only the approved stage. Never infer launch from “configure.”
6. Re-read persisted state and report partial failures honestly.
7. Hand back resource names/IDs, configuration links, completed tests, pending
   human steps, and anything not verified.

Use IDs only from fresh results. For full replacements such as instructions,
show the proposed complete value before calling the write tool. Never retry a
write merely because the transport result is ambiguous.

## Credentials and authorization

Never ask the user to paste a MyChatBot access token, OAuth token, API key, or
password into the conversation. Use the plugin OAuth login flow. Prefer
dashboard authorization links for third-party channels. If a tool accepts a
third-party credential directly, use it only after the owner explicitly chooses
that path and understands the host will transmit the credential to MyChatBot;
never repeat the value in the response or logs.

## Missing tools

If no MyChatBot tools are present, do not reinstall blindly. Verify the plugin
and MCP server, then authenticate:

```bash
claude plugin details mychatbot@mychatbot-app
claude mcp get plugin:mychatbot:mychatbot
claude mcp login plugin:mychatbot:mychatbot
```

After authentication, reload plugins or begin a new conversation so Claude Code
refreshes the available skills and tools.
