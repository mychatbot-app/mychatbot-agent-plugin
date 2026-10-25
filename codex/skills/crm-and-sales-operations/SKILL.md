---
name: crm-and-sales-operations
description: >-
  Inspect or maintain MyChatBot leads, pipelines, labels, custom lead fields,
  duplicates and merges, bulk lead changes, notes, tasks,
  attachments, orders, calendars, conversation records, and whether the AI or a
  person answers a chat. Use for CRM and operational data work, not for general
  account audits or outbound messaging.
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

`assistant_set_pipeline` chooses the pipeline an assistant files its leads in
(`pipeline_id` from `list_pipelines`), as the dashboard's Lead Management card
does. New leads of that assistant go into it and the assistant sets statuses
from its statuses. Leads already filed keep their pipeline and status; the
assistant moves one into the new pipeline when it next sets that lead's status.
Run it with `dry_run: true`, show the before and after pipeline, its statuses,
and the notes it returns, and get configuration approval.

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

## Who answers a chat: the AI or a person

`chat_set_mode` switches one chat (`chat_id` from `list_chats`) between `ai`
(the assistant answers) and `manager` (it stays silent and a person answers),
exactly as the AI switch in the dashboard's chat does; the chat also leaves the
Needs-attention queue. Run it with `dry_run: true`, name the chat and both
modes, and get activation approval. A chat given back to the AI is not answered
for what the customer wrote meanwhile: the assistant answers their next
message. A chat handed to a manager gets its lead assigned by the assistant's
auto-assignment rules, as when the assistant hands a chat over.

`chat_bulk_return_to_ai` gives chats stuck with a manager back to the AI, in
two calls:

1. Call it with the filters: `assistant_id`, `communication_channel`,
   `page_id`, `quiet_hours` (how long nobody on the team has written, 24 by
   default; 0 takes every chat with a manager), `include_escalations`, and
   `limit` (at most 100). As called it is a dry run and changes nothing. It
   returns how many chats match, their `chat_ids`, how many have a customer
   waiting for an answer (`customers_waiting`), a sample with customer names,
   what stays with a manager (the assistant's own escalations nobody answered,
   spam, and chats whose messages cannot be read), and a `preview_token`. It
   reads customer data: get customer-data-read approval first.
2. Show the count, the waiting customers, the sample, and what stays, and get
   activation approval for that list. Say that waiting customers leave the
   Needs-attention queue and the AI answers only their next message. Then repeat the same filters with `dry_run: false`, the
   `chat_ids` exactly as listed, and the `preview_token` (good for 30 minutes).
   Only those chats change; one that changed meanwhile (a manager wrote, or it
   is with the AI already) is skipped and reported. Never assemble `chat_ids`
   or a token yourself; for more chats, run the dry run again.

Leave `include_escalations` off unless the owner asks for the chats the
assistant escalated: those customers were told a person is coming.

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

## Built-in calendar setup

The built-in Calendar (not Google Calendar) has its settings, staff, services,
weekly hours, and bookings. An account can hold several calendars, one per
assistant: pass `integration_id` (from `calendar_get_settings`) whenever it
has more than one. `list_calendar_staff` and `list_calendar_services` show
each row's `integration_id`.

- Read first: `calendar_get_settings` (timezone, default duration, business
  hours, currency, booking instructions, staff and service counts) and
  `calendar_get_staff_hours`. A member without hours of their own works the
  business hours, Monday to Friday. The assistant offers times inside each
  member's hours; a booking itself is checked only against other bookings.
- Every calendar write runs twice: first without `confirm` (the preview, which
  changes nothing), then, after the approval its class needs, the same call
  with `confirm: true`. Never send `confirm: true` without having shown the
  preview of that exact call.
- `calendar_update_settings`, `calendar_set_staff_hours`,
  `calendar_staff_update`, and `calendar_service_update` are configuration:
  show the before and after and get configuration approval. A new timezone keeps every booking at its moment and
  reads all hours on the new clock: say so. `calendar_set_staff_hours` replaces
  the whole week (a day left out is a day off; `{}` returns the member to the
  business hours), lists bookings to come that fall outside, and keeps them.
- `calendar_staff_create` and `calendar_service_create` are activation: the
  assistant can book the new member or service at once; show the preview and
  get activation approval. `calendar_staff_delete` and
  `calendar_service_delete` are destructive and are refused while bookings are
  still to come; show the preview and get exact approval.
- `calendar_booking_create` writes a customer's booking: show its preview
  (staff, service, start and end, the customer) and get customer-data write
  approval. `calendar_booking_update` moves, cancels, or completes one by its
  `EVT-…` reference: show the before and after and get exact approval. A moved
  booking keeps its length. Neither notifies the customer: say that the owner
  tells them. Group classes are booked and moved in the
  dashboard; a reference two bookings share is refused.

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
