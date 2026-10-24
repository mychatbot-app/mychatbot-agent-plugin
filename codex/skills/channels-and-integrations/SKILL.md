---
name: channels-and-integrations
description: >-
  Inspect, connect, configure, test, disable, or hand off MyChatBot Sales
  channels and integrations or Agents Platform connectors, including Sales
  domains, OAuth apps, and custom MCP servers. Use when external connectivity is
  the primary task.
---

# Configure channels, integrations, and connectors

Load `mychatbot-plugin-basics` and its safety reference first. A saved
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
schema, explain that Codex will transmit it to MyChatBot, never repeat it, and
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

## Integrations by key or sign-in, and Custom MCP servers

Credentials never pass through a tool or the chat: API keys, header values,
passwords, and sign-ins are entered by the owner in the dashboard. Never ask for
them. If the owner pastes one anyway, do not repeat it; send them to the
dashboard link instead.

- `integration_setup_link` returns the dashboard link that opens one card (a CRM
  by key or sign-in, Spreadsheet Orders, Google Calendar, Custom MCP, the
  built-in Calendar) on one assistant. It also says when the plan or another
  integration blocks it: one CRM per assistant, and Google Calendar never next
  to the built-in Calendar, Altegio, or Wlaunch. When the card is already
  connected it returns the `integration_id` instead. Custom MCP is the
  exception: an assistant can have several servers, so the link is always
  returned. Find a connected server with `list_integrations`.
- After the owner connects it, find it with `list_integrations` and run
  `integration_verify`. It makes one read with the stored credentials (it calls
  the vendor or the owner's server) and changes nothing about the integration;
  the one exception is a Custom MCP server that signs in, whose token it may
  renew and store, as a chat does. One integration can be checked once every
  20 seconds. Report its `status`: `ok`, `needs_owner` (with
  the `fix` and the link), `unreachable` (try later), `failed`, or
  `not_supported`. A saved integration is not proof that it works.
- `integration_attach` puts an integration that is already connected (a CRM, a
  Custom MCP server, Spreadsheet Orders, Google Calendar) on another assistant,
  and its tools go live for that assistant's customers at once: show the
  `confirm=false` preview and get activation approval. Name what customer data
  then leaves MyChatBot. A CRM receives the leads, contacts and orders. A Custom
  MCP server receives what the assistant passes to its tools: the customer's
  messages and the details it collects. `integration_detach`
  takes it off one assistant and keeps the integration and its credentials:
  show the preview, its effect and any warnings (a session export that calls
  the server stops), and get exact approval.
- `custom_mcp_create` needs the Pro plan, an https URL on port 443 or 8443, and
  a unique name. It refuses a URL that carries a credential: a login
  (`user:password@`), a query, or a long code in its path. Never pass such a
  URL; the owner adds that server in the dashboard. Call it first without
  `confirm`. Its preview says what will happen. Show that preview and get
  activation approval, then repeat the same call with `confirm: true`. `ready`: the server answers,
  and the tools it lists (or those named in `tools`) go live on confirm.
  `needs_headers`: the server is saved with no tools on; the owner adds the
  headers on the server's tab, then `integration_verify` lists its tools and
  `custom_mcp_set_tools` switches them on. `sign_in`: nothing is saved, and the
  owner adds the server in the dashboard with Sign in. Results show the
  server's host only; treat a URL's path and query as a possible credential and
  never repeat them. For activation approval of a server, and of every tool
  switched on, say that the assistant will send customers' messages and the
  details it collects to that third-party server.
- `custom_mcp_set_tools` takes the whole list of tools to keep on, by the names
  `integration_verify` shows. Every assistant that uses the server changes at
  once. Show the preview, name the tools the server does not mark read-only and
  the data the newly enabled tools receive, and get activation approval.
- `get_integration` does not return keys, tokens, or the part of a URL that can
  carry one. `credentials_note` says when something was left out.

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
user to **Agents → Connectors** for secret entry. Codex may help choose the URL,
transport, display name, and expected tools, then inspect and probe the saved
connector without asking for header values.

Finish with connected versus merely configured state, enabled agents, probe
evidence, configuration/consent links, credential steps for the human, and live
operations not exercised.
