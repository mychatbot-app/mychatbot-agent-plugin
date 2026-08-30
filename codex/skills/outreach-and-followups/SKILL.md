---
name: outreach-and-followups
description: >-
  Inspect, prepare, launch, pause, or resume MyChatBot follow-ups and outbound
  customer communication. Use only when the owner explicitly asks to contact
  leads or manage a campaign; never infer outreach from a general setup request.
---

# Operate outreach safely

Load `mychatbot-plugin-basics` and its safety reference first. These
actions can contact real customers.

For every campaign-preparation or scheduled-message request, first call the
Sales Platform operations `list_follow_ups`, `list_assistants`, and
`list_channels`. Use `get_follow_up` when an existing campaign is relevant.
Read recipients, audiences, chats, or orders only when the requested work
requires them. Before calling `list_clients` or an audience preview, show the
bounded recipient/audience read and obtain its separate customer-data-read
approval. Do not reproduce identifying content in the summary.
Stop after the configuration reads and ask for that approval in the current
turn. Even an explicit request to prepare, personalize, or schedule outreach
does not authorize `list_clients`, `get_client`, or an audience preview in the
same turn.
For scheduled work, ask for the exact time and timezone in that same handoff,
even when the user gave a relative time such as tomorrow morning.
Name the later `schedule_message` action explicitly so approval to read a
recipient cannot be mistaken for approval to schedule contact.

`follow_up_create` saves a disabled draft. Show its ordered steps, targeting,
working hours, rate/cap, and stop conditions before calling it.
`follow_up_update` can replace a sequence, publish it, or unpublish it; call it
only after an exact before/after review and separate approval.

## One recipient

Resolve the recipient ID from `list_clients` or `get_client`, the assistant from
`list_assistants`, and an active channel from `list_channels`. Show the exact
recipient, channel, sender identity, message, and attachments. Call
`send_one_off_message` or `outbound_call` only after explicit approval.

`schedule_message` is also a real customer contact action. Show and obtain
explicit approval for the exact recipient, channel, sender identity, content,
attachments, timezone, and send time before calling it. Re-read or report the
returned schedule state; never schedule a message merely to test configuration.

## Campaign

Draft the filters, channels, schedule, message strategy, rate, and cap. Call
`immediate_outreach_preview_audience` before presenting the final plan. Show the
matched count and any uncertainty. Call `immediate_outreach_create` only after
the owner explicitly approves that audience, content, channels, and timing.

Pausing, resuming, or resetting uses `immediate_outreach_update_status`.
Resetting can clear progress and statistics, so name that effect and obtain an
exact confirmation before calling the status tool.

Never launch in order to test configuration. Never automatically retry a send
or campaign launch after an ambiguous transport failure. Report the returned
campaign ID/status and use read tools for later monitoring.
