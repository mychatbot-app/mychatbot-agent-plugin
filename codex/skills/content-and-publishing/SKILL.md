---
name: content-and-publishing
description: >-
  Generate MyChatBot UGC media or speech, inspect social accounts, analytics,
  and ads, or publish and schedule social posts. Use only for explicit
  UGC/content work; never infer publication from a request to generate a draft.
---

# Generate and publish content

Load `mychatbot-plugin-basics` and its safety reference. Generation,
approval, and publication are distinct stages.

## Inspect

Use content operations from the single MyChatBot connection. Read `list_models`,
`list_accounts`, and only the analytics or ads reports needed, such as `list_ad_accounts`,
`list_campaigns`, `get_campaign_tree`, or `list_ads`. Subscription gates and
current tool schemas are authoritative.

## Generate

Before `generate_media` or `tts`, show the prompt/text, model, media type,
dimensions/duration, variants, source assets, and known cost or limit. Obtain
approval, call the exact generation tool once, then poll `get_media_task`.
Do not create a duplicate because processing is slow or a write response was
ambiguous.

Treat generated output as a draft. Inspect the returned artifact and report
failures or moderation limits; do not imply it has been posted.

## Publish or schedule

Resolve the exact connected account with `list_accounts`. Before
`create_post`, show account(s), final text, media, link, publish/schedule time
and timezone, and whether the action is immediate. Obtain a separate publication
approval and call `create_post` once.

Verify with `get_post` and report platform post IDs/status, scheduled time,
partial platform failures, and edits or deletions that the current MCP does not
support. Never automatically retry an ambiguous publication result.
