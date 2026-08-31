---
name: account-audit
description: >-
  Perform a read-only MyChatBot account audit and produce a prioritized
  implementation plan. Use when an owner or integrator asks what is configured,
  what is missing, whether the account is ready, or where to begin. Do not use
  customer records as a default audit input.
---

# Audit a MyChatBot account

Load `mychatbot-plugin-basics-claude` first. This workflow is read-only.

## Inspect Sales

Call the Sales Platform operation `get_account_summary`, then use the smallest
relevant set of direct reads:

- `get_subscription_info` and `get_usage_summary` for eligibility and capacity;
- `list_assistants` for Sales assistants;
- `list_integrations` for knowledge and connected services;
- `list_channels` for customer-facing channel state;
- `list_follow_ups` only when automation or outreach is in scope.

Read a specific assistant, integration, channel, or follow-up only when needed
to judge readiness. Do not call `list_clients`, `list_chats`,
`get_chat_messages`, audience previews, exports, or individual order/event tools
for a general audit. If customer-data analysis is requested, state why, bound
the fields and date range, and keep the report aggregated and de-identified.

## Inspect Agents

Call the Agents Platform operation `get_account_authoring_inventory`. Treat
partial inventory sections as unknown. Use `list_routines`, `get_routine_readiness`,
`get_agent`, or `get_skill` only as the task requires. Configured inventory does
not prove a vendor is reachable or that external data exists; use
`probe_connector` only when the owner requests or approves a real discovery
handshake.

UGC is not part of a normal account setup audit. When explicitly in scope, use
only targeted reads such as `list_accounts`, `get_posting_frequency`, or
`list_ad_accounts`; do not generate or publish.

## Report

Track every requested read as `succeeded`, `failed`, or `not attempted`. A tool
call that returned an MCP or host error was attempted but did not complete; do
not count it as a successful read or infer account state from it. Do not replace
a failed read with a broader operation.

Attribute failures to the layer that reported them. A host message that a tool
requires approval is an approval-policy refusal, not evidence that OAuth is
expired. Recommend reconnecting only when the MCP server reports an
authentication failure or authorization challenge. Otherwise report the exact
unverified area and the bounded next step needed to inspect it.

Separate observed facts from recommendations. Report:

1. Current resources and readiness.
2. Blockers, warnings, duplicates, and unresolved asynchronous states.
3. A dependency-ordered implementation plan.
4. The approval and human authorization required for each stage.
5. What was not inspected or could not be verified.

When any read fails, include attempted, successful, and failed counts and name
the failed operation without reproducing its arguments or result. Never label
the audit complete when required reads failed.

Always state explicitly that customer records and messages were not inspected
unless the user separately approved a bounded customer-data read.

End by asking which proposed stage the owner wants to approve. Do not perform a
write in the audit turn.
