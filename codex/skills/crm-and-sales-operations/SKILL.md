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
After deferred tool discovery, call each returned MCP operation directly. Never
invoke an MCP operation through a shell or generated script.

## Pipelines and labels

Use ordinary reads for `list_pipelines`, `get_pipeline`, and `list_labels`.
For a broad cleanup request, finish these configuration reads and present the
bounded customer-record scope before calling `list_clients` or `scan_clients`.
The phrase "update the right records" is not approval to enumerate customer
records; obtain the separate customer-data-read approval first.
If the desired cleanup is unclear, propose a bounded record scope and ask for
customer-data-read approval explicitly; do not end with clarification questions
alone.
Create or update bounded configuration with `pipeline_create`,
`pipeline_update`, `funnel_status_create`, or `label_create` only after
showing names, ordering implications, and assistant assignments.

Deleting a pipeline, funnel status, or label may affect many leads. Inspect
dependencies first, obtain exact delete approval, and state whether the
operation will remove labels from customer records or invalidate assignments.

`funnel_status_update` renames, recolours, or moves one status. A rename also
renames the status on every lead that has it, while follow-ups, automations,
and assistant settings that name the old status keep the old name. Run it with
`dry_run: true`, show the lead count and the settings it lists, and obtain
approval before the change.

## Team and lead fields

`list_managers` lists the people a lead can be assigned to; use its
`manager_id` values, never a guessed UUID. `list_lead_fields` shows the
account's custom lead fields. `lead_field_create` and `lead_field_update`
change that list (text, or dropdown with options) and need configuration
approval: show the key as it will be saved (lowercase, spaces as underscores)
and run `dry_run: true` first. `lead_field_delete` removes a key from the list
but keeps the values already on leads; run its dry run, obtain exact delete
approval, then call it with `confirm: true`.

## Duplicates and bulk changes

`list_duplicate_clients` reads customer data (names and phone numbers), so
obtain customer-data-read approval first. `client_merge` moves the source
lead's chats, orders, notes, tasks, and attachments to the target and deletes
the source; it cannot be undone. Run it with `dry_run: true`, show both leads
and what will be filled in, obtain exact approval, then repeat the same call
with the `preview_token` the dry run returned.

`client_bulk_update` changes status (with its pipeline), labels (replace, add,
or remove), or the manager of many leads at once, and never deletes a lead.
Run it with `dry_run: true` first and show the count, the sample, and the exact
patch. After exact approval, repeat the same call with `expected_count` and the
`preview_token`. A count that moved since the dry run is refused: preview
again rather than adjusting the number.

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
