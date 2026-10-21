---
name: crm-and-sales-operations
description: >-
  Inspect or maintain MyChatBot leads, pipelines, labels, custom lead fields,
  duplicates and merges, bulk lead changes, notes, tasks,
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

`funnel_status_update` renames, recolors, or moves one status of a pipeline
(`pipeline_id` plus the status name as `get_pipeline` lists it). A rename also
renames the status on every lead that has it (above 10,000 leads it is
refused), while follow-ups, automations, and assistant settings that name the
old status keep the old name and stop matching until they are updated. Run it
with `dry_run: true`, show the lead count and the settings it lists, and
obtain exact approval for the rename and for updating those settings.

## Team and lead fields

`list_managers` lists the people a lead can be assigned to; use a
`manager_id` it marks assignable, never a guessed UUID. `list_lead_fields`
shows the account's custom lead fields. `lead_field_create` and
`lead_field_update` change that list (text, or dropdown with options) and need
configuration approval: show the key as it will be saved (lowercase, spaces as
underscores) and run `dry_run: true` first. Fill values with `client_update`
`custom_lead_fields`. `lead_field_delete` removes a key from the list but keeps
the values already on leads, and saving a lead that still has a value adds the
key back; run its dry run, obtain exact delete approval, then call it with
`confirm: true`.

## Duplicates and bulk changes

`list_duplicate_clients` reads customer data (names, phone numbers, and
emails), so obtain customer-data-read approval first. Each pair names the lead
that owns a phone number and a lead whose chat carries it; propose the phone
owner as the merge target. `client_merge` moves the source
lead's chats, orders, notes, tasks, and attachments to the target and deletes
the source; it cannot be undone. Run it with `dry_run: true`, show both leads
and what will be filled in, obtain exact approval, then repeat the same call
with the `preview_token` the dry run returned.

`client_bulk_update` changes the status (with its `pipeline_id`), labels
(replace or add only labels `list_labels` shows; remove any), or the manager
of many leads at once, and never deletes a lead. Select up to 1,000 lead IDs,
or a filter using the `list_clients` filters except search: an unknown key is
refused, and an empty filter selects every lead (at most 10,000). Moving leads
into a status set to hand chats back to the AI does that for their
operator-held chats. Run it with `dry_run: true` first and show the count, the
sample, and the exact patch. After exact approval, repeat the same call with
`expected_count` and the `preview_token`. A count that moved since the dry run
is refused: preview again rather than adjusting the number.

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
