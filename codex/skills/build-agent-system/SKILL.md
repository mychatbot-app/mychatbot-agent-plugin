---
name: build-agent-system
description: >-
  Inspect, design, configure, validate, privately preview, activate, or hand off
  a MyChatBot Agents Platform system: account agents, skills, connectors,
  Business Knowledge, custom routines, schedules, and triggers. Use for
  operator/back-office agents and multi-agent workflows, not customer-facing
  Sales assistants.
---

# Build an Agents Platform system

Load `mychatbot-plugin-basics` and its safety reference first. Use the
Agents Platform operations from the single MyChatBot connection.

## Discover and inspect

At minimum, call `get_account_authoring_inventory`. The current direct tool
descriptions and input schemas are authoritative. Never pass an account ID.
Before routine work,
also inspect `get_routine_authoring_context` and read the authoritative Markdown
references it returns, then call `list_routines` before proposing routine work.
Call `list_routines` even when the compact inventory reports an empty routines
section; compact inventory does not replace the workflow-specific list.
Use `get_routine`, `get_agent`, and `get_skill` only as the target requires.

Inventory is configured-state evidence. It does not prove a vendor is reachable
or that external data exists. A partial inventory section is unknown. Use
`probe_connector` only when a live discovery handshake is necessary; it probes
metadata but does not read or write vendor data.

## Plan one configuration stage

Show the intended resources, dependencies, complete replacement values, and
what remains unchanged. Obtain approval before calling the exact write tool.
In the initial proposal, state that saved configuration, private preview,
schedule or trigger activation, destructive replacement, and routine session
history access each require separate approval when applicable.
Use the words “separate approval” in the handoff so the stages cannot be read as
one bundled confirmation.

- `claim_custom_agent` uses a free custom slot from fresh inventory.
- `hire_library_agent` adds a library archetype without editing its platform
  defaults.
- `replace_agent_configuration` is a full override replacement. Read
  `get_agent` first and include every override that must remain.
- `create_skill` and `replace_skill` save account-scoped instruction modules.
  Read `get_skill` before replacement and include all retained files/content.
- `start_connector_authorization` returns a human OAuth consent URL. Do not
  claim authorization succeeded until later inventory confirms it. API-key
  credentials remain app-only.
- `connect_sales_platform_connector` enables one account-owned Sales domain;
  use the exact toolkit from inventory.
- `create_knowledge_source` and `update_knowledge_source` manage Business
  Knowledge. Default new sources to read-only, reuse Sales resources when
  available, and never send credential values.

Execute the approved configuration once. Re-read the affected resource and
report partial or ambiguous outcomes without retrying the write.

Authenticated custom MCP headers are app-only. Codex may inspect existing
custom connectors from inventory and probe a configured connector, but must
send the user to **Agents → Connectors → Custom connector** to enter a URL and
headers. Never ask for those header values in chat.

## Author a routine

Use this sequence:

1. Read `get_routine_authoring_context` and its Markdown references.
2. Read `get_account_authoring_inventory` and `list_routines`.
3. Draft complete YAML and run `validate_routine` until valid.
4. Show the complete canonical YAML, conservative Agent-call estimate, and
   dependencies; obtain explicit approval.
5. Call `create_routine` directly. Existing routine replacement uses
   `update_routine` only after showing the complete canonical YAML and obtaining
   separate replacement approval.
6. Read `get_routine_readiness`; resolve blockers and explain warnings.

Routine creation/update saves live account configuration. It does not launch a
run or create an automation.

## Preview separately

`start_routine_dry_run` is a billed, persisted, tool-free simulation. It does
not attach connectors, customer data, Business Knowledge, memory, or live
effects. Show the sample input, known cost boundary, and limitation, then obtain
separate approval. Call `start_routine_dry_run` once, poll with
`get_routine_run`, and use `cancel_routine_run` only after exact approval.

A passing preview demonstrates prompt flow and output shape only. It is not
production readiness evidence for live tools or external systems.

Read `get_routine_session_history` only for an explicitly requested diagnostic.
It may contain customer inputs, agent outputs, and tool details. Limit the
result and detail level to what the diagnosis needs, and summarize without
unnecessary identifying content.

## Stage automation disabled, then activate

`create_routine_schedule` and `create_trigger` stage disabled resources. Show
the cron/timezone or trigger source, target, input template, deduplication, and
rate limit before creation. Re-read readiness after staging.

Enabling via `set_routine_schedule_enabled` starts future cron firing.
Enabling via `set_trigger_enabled` may create an external subscription. Treat
each as a separate approval after configuration and private testing, then call
the exact enable tool directly.

Deletion, disconnection, reset, cancellation, and full replacements such as
`replace_agent_configuration` and `replace_skill` need their own exact approval.
Name the resource and cascading effect,
obtain separate confirmation, execute once, then verify. Finish with resource
slugs/IDs, readiness, tests, enabled state, consent links or human steps, and
every unverified live boundary.
