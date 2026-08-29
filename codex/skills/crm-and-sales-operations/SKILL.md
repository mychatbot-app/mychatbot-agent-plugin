---
name: crm-and-sales-operations
description: >-
  Inspect or maintain MyChatBot leads, pipelines, labels, notes, tasks,
  attachments, orders, calendars, and conversation records. Use for CRM and
  operational data work, not for general account audits or outbound messaging.
---

# Work with CRM and Sales operations

Load `mychatbot-plugin-basics` and its safety reference. Customer data
is not a default audit input. Establish the smallest record set, fields, date
window, and output needed before reading it.

## Pipelines and labels

Use ordinary reads for `list_pipelines`, `get_pipeline`, and `list_labels`.
Create or update bounded configuration with `pipeline_create`,
`pipeline_update`, `funnel_status_create`, or `label_create` only after
showing names, ordering implications, and assistant assignments.

Deleting a pipeline, funnel status, or label may affect many leads. Inspect
dependencies first, obtain exact delete approval, and state whether the
operation will remove labels from customer records or invalidate assignments.

## Leads and related records

Use Sales Platform operations for `list_clients`, `scan_clients`,
`get_client`, notes, tasks, attachments, and exports. Use bounded list queries
for interactive work and `scan_clients` only for an explicit exhaustive batch.

Before a customer-data write, show the exact tool, client ID, and field-level
change. Keep `custom_lead_fields` (editable business fields)
separate from `client_context` (AI-collected structured context). Prefer
`client_update` or `client_context_merge` after duplicate detection rather
than creating a near-duplicate lead.

Create/update notes, tasks, and attachment records only for already authorized
content and exact targets. Deletion requires separate exact approval; do not
delete a client merely to correct one field.

## Conversations, orders, and calendar

Chats, messages, orders, bookings, eval transcripts, and exports are sensitive
customer-data reads. Resolve IDs from fresh list results and distinguish
chat IDs, external client IDs, and common client UUIDs.

Use aggregate reads such as `get_order_stats` or `get_event_stats` when
individual records are unnecessary. Enabling order taking is customer-facing
activation; disabling it or deleting test orders is destructive. Calendar staff
and services are configuration metadata, while events may identify customers.

Summarize results with minimal identifying detail and report filters,
pagination/completeness, changed record IDs, verification reads, and anything
not inspected.
