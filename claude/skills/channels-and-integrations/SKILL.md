---
name: channels-and-integrations
description: >-
  Inspect, connect, configure, test, disable, or hand off MyChatBot Sales
  channels and integrations or Agents Platform connectors, including Sales
  domains, OAuth apps, and custom MCP servers. Use when external connectivity is
  the primary task.
---

# Configure channels, integrations, and connectors

Load `mychatbot-plugin-basics-claude` and its safety reference first. A saved
configuration, human authorization, live activation, and verified connectivity
are separate states.

## Inspect both platform layers

For Sales, discover and read `list_channels`, `list_integrations`, and the
specific `get_integration`. For Agents, read
`get_account_authoring_inventory`. Resolve the assistant/agent and reuse a
healthy account-scoped connection rather than creating duplicates.

Sales integrations support customer-facing assistants. Agents connectors give
operator/back-office agents tools. Connecting a Sales domain to Agents uses
`connect_sales_platform_connector`; it does not create a Sales integration.

## Sales channels and integrations

Use `channel_get_config_link` or `get_integration_config_link` when setup
requires a dashboard OAuth or credential flow. Do not claim success until a
fresh list/detail read shows the connected state.

`create_website_widget`, `create_calls_channel_sdk`, and
`connect_telegram` activate customer-facing behavior and use
`call_activation_operation`. Prefer a configuration link for credentials.
If the user explicitly chooses a direct Telegram token flow supported by the
schema, explain that Claude will transmit it to MyChatBot, never repeat it, and
verify only non-secret channel metadata afterward.

`channel_toggle` can disable a live route and therefore uses
`call_destructive_operation` for both directions. Show the exact assistant,
page/channel ID, current state, desired state, customer impact, and rollback.

## Agents connectors and MCPs

- `start_connector_authorization` returns a human OAuth URL. Authorization is
  not complete until later inventory confirms it.
- `connect_sales_platform_connector` enables one exact account-owned Sales
  domain without OAuth.
- `probe_connector` performs a live initialize/discovery handshake only. It
  does not call vendor tools or prove that reads/writes will work.
- `disconnect_connector` can break agents, Business Knowledge, routines, or
  triggers and requires the destructive gateway after dependency review.

API-key connectors and authenticated custom MCP headers are app-only. Direct the
user to **Agents → Connectors** for secret entry. Claude may help choose the URL,
transport, display name, and expected tools, then inspect and probe the saved
connector without asking for header values.

Finish with connected versus merely configured state, enabled agents, probe
evidence, configuration/consent links, credential steps for the human, and live
operations not exercised.
