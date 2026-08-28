---
name: account-audit
description: >-
  Perform a read-only MyChatBot account audit and produce a
  prioritized implementation plan. Use when an owner or integrator asks what
  is configured, what is missing, whether the account is ready, or where to
  begin. Do not use customer records as a default audit input.
---

# Audit a MyChatBot account

Load `mychatbot-plugin-basics-claude` first. This workflow is read-only.

## Inspect

Call `get_account_context` first. Treat every section with `status: error`
and every partial Agents inventory as unknown, not empty. Use
`discover_operations` with `platform: sales` and exact names, then
`call_read_operation`. A normal Sales audit inspects:

- `get_subscription_info` and `get_usage_summary` for eligibility and capacity;
- `list_assistants` for Sales assistants;
- `list_integrations` for knowledge and connected services;
- `list_channels` for customer-facing channel state;
- `list_follow_ups` only when automation or outreach is in scope.

Do not call `list_clients`, `list_chats`, `get_chat_messages`, or
`immediate_outreach_preview_audience` for a general audit. If the request needs
customer-data analysis, state why before reading it and keep the result
aggregated and de-identified.

For Agents work, discover `get_routine_authoring_context`,
`get_account_authoring_inventory`, `list_routines`, or the specific resource
reads needed, then use `call_read_operation`. Do not use another gateway in an
audit. If a platform is unavailable, mark it as not inspected; never infer an
empty inventory.

UGC is not part of a normal setup audit. When it is in scope, discover its
domains and use only configuration-free reads such as `list_accounts`,
`get_posting_frequency`, or `list_ad_accounts`. Do not generate or publish.

## Report

Separate observed facts from recommendations. Report:

1. Current resources and their readiness.
2. Blockers, warnings, duplicates, and unresolved asynchronous states.
3. A staged plan ordered by dependency.
4. The approval and human authorization required for each stage.
5. What was not inspected or could not be verified.

End by asking which proposed stage the owner wants to approve. Do not perform a
write in the audit turn.
