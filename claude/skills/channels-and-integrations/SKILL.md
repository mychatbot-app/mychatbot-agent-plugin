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

For Sales, call `list_channels`, `list_integrations`, and the specific Sales
Platform `get_integration` operation. For Agents, read
`get_account_authoring_inventory`. Resolve the assistant/agent and reuse a
healthy account-scoped connection rather than creating duplicates.
Complete `list_channels`, `list_integrations`, and
`get_account_authoring_inventory` before any integration detail lookup or
proposal; a missing Agents inventory cannot be treated as no connectors.

Sales integrations support customer-facing assistants. Agents connectors give
operator/back-office agents tools. Connecting a Sales domain to Agents uses
`connect_sales_platform_connector`; it does not create a Sales integration.

## Sales channels and integrations

Use `channel_get_config_link` or `get_integration_config_link` when setup
requires a dashboard OAuth or credential flow. Do not claim success until a
fresh list/detail read shows the connected state.

`create_website_widget`, `create_calls_channel_sdk`, and
`connect_telegram` activate customer-facing behavior and require separate
activation approval. Prefer a configuration link for credentials.
If the user explicitly chooses a direct Telegram token flow supported by the
schema, explain that Claude will transmit it to MyChatBot, never repeat it, and
verify only non-secret channel metadata afterward.

`channel_toggle` can disable a live route and needs exact approval in either
direction. Show the exact assistant,
page/channel ID, current state, desired state, customer impact, and rollback.

`update_integration_trigger` can alter a live integration trigger and has no
version guard. First call it with `confirm=false` to obtain the exact preview.
Show the before/after state and customer-facing effect, obtain exact approval,
then apply once with `confirm=true`. Never infer approval from a broader
integration request.
When trigger work is requested, name the `confirm=false` no-change preview in
the proposal even if required routing details must be clarified first. Do not
ask for trigger-change approval until that preview has been shown.
State that connector authorization uses browser OAuth or another human
authorization flow and that saved configuration is not proof of authorization.

## API actions and channel options

`api_action_create` gives an assistant a tool that calls the owner's HTTPS
endpoint with the fields it collects (Pro plan or higher). It is live at once on
an active assistant, as is `api_action_attach` to another assistant: preview the
endpoint host, fields, and customer-facing effect and get activation approval.
`api_action_update` changes only the properties given (a `parameters` list
replaces the whole list), with no version history and no dry run: read the
action with `get_integration` (it shows the endpoint's host, not the full URL),
show the before and after, and get exact approval. Attaching also needs Pro or
higher. `send_client_context` sends the
customer's name, phone, and chat to the endpoint; name that explicitly. Header
values (API keys, bearer tokens) are dashboard-only: never ask for them, and
send the owner to Integrations → API Action. An action with header values keeps
its server here (scheme, host, and port); moving it to another one is a
dashboard change.

`set_channel_options` sets one channel's reply delay (0-180 seconds) and
reaction handling. `list_channels` does not show these values: call
`set_channel_options` with `dry_run: true` to read the current ones (`before`),
show them with the new ones, and get configuration approval.

## Agents connectors and MCPs

- `start_connector_authorization` returns a human OAuth URL. Authorization is
  not complete until later inventory confirms it.
- `connect_sales_platform_connector` enables one exact account-owned Sales
  domain without OAuth.
- `probe_connector` performs a live initialize/discovery handshake only. It
  does not call vendor tools or prove that reads/writes will work.
- `disconnect_connector` can break agents, Business Knowledge, routines, or
  triggers and requires dependency review and exact disconnection approval.

API-key connectors and authenticated custom MCP headers are app-only. Direct the
user to **Agents → Connectors** for secret entry. Claude may help choose the URL,
transport, display name, and expected tools, then inspect and probe the saved
connector without asking for header values.

Finish with connected versus merely configured state, enabled agents, probe
evidence, configuration/consent links, credential steps for the human, and live
operations not exercised.
