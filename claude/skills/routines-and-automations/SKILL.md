---
name: routines-and-automations
description: >-
  Design, validate, stage, test, activate, pause, or remove MyChatBot automation:
  Agents routines, schedules and triggers, Sales Lead Forms routing, or
  follow-up workflow dependencies. Use when event or time-driven behavior is
  the primary task.
---

# Build routines and automations

Load `mychatbot-plugin-basics-claude`. Use `build-agent-system` for agent,
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

Finish with saved resource IDs, readiness blockers/warnings, preview evidence,
enabled state, next-fire/event behavior, and unverified external effects.
