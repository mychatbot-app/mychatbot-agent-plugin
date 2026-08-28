---
name: deployment-audit
description: >-
  Perform a read-only MyChatBot deployment or account audit and produce a
  prioritized implementation plan. Use when an owner or integrator asks what
  is configured, what is missing, whether a deployment is ready, or where to
  begin. Do not use customer records as a default audit input.
---

# Audit a MyChatBot deployment

Load `mychatbot-plugin-basics-claude` first. This workflow is read-only.

## Inspect

Call `get_deployment_context` first. Treat every section with `status: error`
and every partial Agents inventory as unknown, not empty. If Sales deployment
is in scope, call `get_demo_status`, then collect only the details relevant to
the request. A normal Sales audit uses:

- `get_subscription_info` and `get_usage_summary` for eligibility and capacity;
- `list_assistants` for Sales assistants;
- `list_integrations` for knowledge and connected services;
- `list_channels` for customer-facing deployment state;
- `list_follow_ups` only when automation or outreach is in scope.

Do not call `list_clients`, `list_chats`, `get_chat_messages`, or
`immediate_outreach_preview_audience` for a general audit. If the request needs
customer-data analysis, state why before reading it and keep the result
aggregated and de-identified.

For Agents work, call `agents_discover_tools`, then use
`agents_call_read_tool` for the discovered `get_routine_authoring_context`,
`get_account_authoring_inventory`, `list_routines`, or specific resource reads
needed by the request. Do not use a configuration or destructive gateway in an
audit. If the deployment gateways are absent, mark Agents Platform as “not
inspected through the current plugin surface”; never infer an empty inventory.

## Report

Separate observed facts from recommendations. Report:

1. Current resources and their readiness.
2. Blockers, warnings, duplicates, and unresolved asynchronous states.
3. A staged plan ordered by dependency.
4. The approval and human authorization required for each stage.
5. What was not inspected or could not be verified.

End by asking which proposed stage the owner wants to approve. Do not perform a
write in the audit turn.
