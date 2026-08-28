---
name: outreach-and-followups
description: >-
  Inspect, prepare, launch, pause, or resume MyChatBot follow-ups and outbound
  customer communication. Use only when the owner explicitly asks to contact
  leads or manage a campaign; never infer outreach from a general setup request.
---

# Operate outreach safely

Load `mychatbot-plugin-basics-claude` and its safety reference first. These
actions can contact real customers.

For inspection, use `list_follow_ups` and `get_follow_up` through
`call_read_operation`. Use `call_customer_data_read_operation` for recipients,
audiences, chats, or orders only when the requested work requires them, and do
not reproduce identifying content in the summary.

`follow_up_create` saves a disabled draft through
`call_configuration_operation`. Show its ordered steps, targeting, working
hours, rate/cap, and stop conditions. `follow_up_update` can replace a sequence,
publish it, or unpublish it and therefore uses `call_destructive_operation`
after an exact before/after review.

## One recipient

Resolve the recipient ID from `list_clients` or `get_client`, the assistant from
`list_assistants`, and an active channel from `list_channels`. Show the exact
recipient, channel, sender identity, message, and attachments. Call
`send_one_off_message` or `outbound_call` through
`call_external_action_operation` only after explicit approval.

## Campaign

Draft the filters, channels, schedule, message strategy, rate, and cap. Call
`immediate_outreach_preview_audience` through
`call_customer_data_read_operation` before presenting the final plan. Show the
matched count and any uncertainty. Call `immediate_outreach_create` through
`call_external_action_operation` only after the owner explicitly approves that
audience, content, channels, and timing.

Pausing, resuming, or resetting uses `immediate_outreach_update_status`.
Resetting can clear progress and statistics, so name that effect and obtain an
exact confirmation before `call_destructive_operation`.

Never launch in order to test configuration. Never automatically retry a send
or campaign launch after an ambiguous transport failure. Report the returned
campaign ID/status and use read tools for later monitoring.
