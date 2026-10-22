---
name: routines-and-automations
description: >-
  Design, validate, stage, test, activate, pause, or remove MyChatBot automation:
  Agents routines, schedules and triggers, Sales Lead Forms routing, Sales
  Trigger Outreach, Keyword Responder and Lead Form Instant Outreach setup, a
  Sales automation's pause switch, or follow-up workflow dependencies. Use when
  event or time-driven behavior is the primary task.
---

# Build routines and automations

Load `mychatbot-plugin-basics`. Use `build-agent-system` for agent,
skill, connector, Business Knowledge, and routine YAML details. Use
`outreach-and-followups` when the automation contacts an audience.

## Agents routines

Read `get_routine_authoring_context`, its returned Markdown references,
`get_account_authoring_inventory`, and existing routines. Validate complete
YAML with `validate_routine`; show canonical YAML, dependencies, conservative
Agent-call estimate, and unchanged behavior before saving.
Validation does not save or enable anything. Label the YAML as a draft and
never describe a validated, unsaved routine, schedule, or trigger as enabled.
If required behavior is still unclear, ask for it and state the remaining
stages explicitly: draft and validate, obtain configuration approval, save with
schedules and triggers disabled, privately test after separate approval, and
activate each automation only after another approval.

Call `create_routine` only after configuration approval. `update_routine` is a
complete replacement and needs separate replacement approval. Re-read
`get_routine_readiness` after every save.

Run `start_routine_dry_run` only after a
separate preview approval. It is persisted and tool-free: it does not verify
connectors, Business Knowledge, customer data, memory, or live effects.

## Schedules and triggers

Create `create_routine_schedule` and `create_trigger` disabled. Show the
target routine, cron/timezone or event source, filters, input template,
deduplication, rate limit, and dependencies. Re-read readiness.

Enabling with `set_routine_schedule_enabled` or `set_trigger_enabled` needs
separate activation approval; an enabled connector-event trigger may create an
external subscription. Disable, delete, or cancel only after showing downstream
impact and obtaining exact approval.

For a Sales integration trigger, `update_integration_trigger` uses a mandatory
two-step contract and has no version guard. Call it with `confirm=false`, show
the exact before/after preview and live effect, obtain exact approval, then call
once with `confirm=true`.

## Sales Lead Forms automation

Read `list_lead_forms` and `get_lead_forms_automation`. Draft one mapping
with assistant, capture/outreach mode, channels, message strategy, pipeline,
delay/window/timezone, interval, and fallback behavior.

`set_lead_form_mapping` has its own preview/confirm contract and needs activation
approval because a confirmed mapping can message future
leads. Call first without confirmation, show the returned before/after preview,
obtain exact approval, then apply once. `remove_lead_form_mapping` needs
separate removal approval.

## Set up Sales Trigger Outreach, Keyword Responder, Lead Form Instant Outreach

Each goes live as soon as it is saved: a trigger acts on every call to its
webhook, the others on every matching comment or lead email. In the outreach
modes they message people; capture-only and collect-only only capture leads
into the CRM. Each needs activation approval. Call the tool without `confirm`,
show the returned preview and its warnings (a paused automation, an assistant
switched off, an automation shared with another assistant), obtain exact
approval, then apply once with `confirm=true`.

- `create_integration_trigger` adds a webhook trigger to the assistant's
  Trigger Outreach automation, creating the automation when there is none.
  Draft its name, capture-and-outreach or capture-only, channels (each connected
  for the assistant), instruction or exact message, and schedule. The result
  carries the webhook URL: a credential, so hand it only to the owner or the
  system that will call it, and never paste it into chats, tickets or logs.
  `delete_integration_trigger` needs separate removal approval: the URL stops
  for good and queued sends are dropped.
- `set_keyword_responder` creates or changes the assistant's Keyword Responder.
  Pick posts with `list_social_posts`, then draft the keywords, the public reply
  (200 characters at most, or none) and the DM: an instruction the assistant
  composes from, or an exact message. Only what you pass changes.
- `set_lead_form_instant_outreach` creates (with `assistant_id`) or changes
  (with `integration_id`) one automation per lead-form sender address. The lead
  emails arrive in the assistant's connected mailbox. Collect-only captures the
  lead; collect-and-outreach also messages it on the channels given, composed
  from the instruction.

## Pause or resume a Sales automation

`automation_set_paused` pauses or resumes one automation without deleting it:
Trigger Outreach, the Instagram/Facebook Keyword Responder, Lead Forms, or Lead
Form Instant Outreach. Its settings, webhook URLs, and assistant links stay.
Find its `integration_id` with `list_integrations` type=automation. Call it
without `confirm`, show what the pause does to that kind, obtain exact approval,
then apply once with `confirm=true`. The approval must name what is lost: while
paused, sends already queued are dropped, and a lead that arrives through
Trigger Outreach or Lead Form Instant Outreach is not captured; a paused Lead
Forms automation still captures leads into the CRM. Nothing is replayed on
resume, and resuming starts messaging leads again, so it needs separate
activation approval. Any other automation kind is refused: stop it in the
dashboard instead.

Finish with saved resource IDs, readiness blockers/warnings, preview evidence,
enabled state, next-fire/event behavior, and unverified external effects.
