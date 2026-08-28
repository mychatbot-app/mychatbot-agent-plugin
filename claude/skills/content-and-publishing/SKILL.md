---
name: content-and-publishing
description: >-
  Generate MyChatBot UGC media or speech, inspect social accounts and analytics,
  or publish and schedule social posts. Use only for explicit UGC/content work;
  never infer publication from a request to generate a draft.
---

# Generate and publish content

Load `mychatbot-plugin-basics-claude` and its safety reference. Generation,
approval, and publication are distinct stages.

## Inspect

Use `discover_operations` with `platform: ugc` and the relevant content,
posting, analytics, or ads domain. Read `list_models`, `list_accounts`, and
only the analytics or ad reports needed through `call_read_operation`.
Subscription gates and fresh operation schemas are authoritative.

## Generate

Before `generate_media` or `tts`, show the prompt/text, model, media type,
dimensions/duration, variants, source assets, and known cost or limit. Obtain
approval, call `call_generation_operation` once, then poll `get_media_task`.
Do not create a duplicate because processing is slow or a write response was
ambiguous.

Treat generated output as a draft. Inspect the returned artifact and report
failures or moderation limits; do not imply it has been posted.

## Publish or schedule

Resolve the exact connected account with `list_accounts`. Before
`create_post`, show account(s), final text, media, link, publish/schedule time
and timezone, and whether the action is immediate. Obtain a separate publication
approval and call `call_external_action_operation` once.

Verify with `get_post` and report platform post IDs/status, scheduled time,
partial platform failures, and edits or deletions that the current MCP does not
support. Never automatically retry an ambiguous publication result.
