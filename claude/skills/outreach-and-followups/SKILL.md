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

For inspection, use `list_follow_ups` and `get_follow_up`. Read customer records
only when the requested audience or recipient cannot be resolved otherwise, and
do not reproduce identifying content in the summary.

## One recipient

Resolve the recipient ID from `list_clients` or `get_client`, the assistant from
`list_assistants`, and an active channel from `list_channels`. Show the exact
recipient, channel, sender identity, and message. Call `send_one_off_message`
only after explicit approval of all four.

## Campaign

Draft the filters, channels, schedule, message strategy, rate, and cap. Call
`immediate_outreach_preview_audience` before presenting the final plan. Show the
matched count and any uncertainty. Call `immediate_outreach_create` only after
the owner explicitly approves that audience, content, channels, and timing.

Pausing, resuming, or resetting uses `immediate_outreach_update_status`.
Resetting can clear progress and statistics, so name that effect and obtain an
exact confirmation.

Never launch in order to test configuration. Never automatically retry a send
or campaign launch after an ambiguous transport failure. Report the returned
campaign ID/status and use read tools for later monitoring.
