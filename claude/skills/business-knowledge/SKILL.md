---
name: business-knowledge
description: >-
  Add, update, validate, or remove MyChatBot business knowledge: live websites,
  Sales FAQs, manual product catalogs, product feeds, or Agents Business
  Knowledge attachments. Use when an assistant or agent needs grounded company
  or catalog information.
---

# Configure business knowledge

Load `mychatbot-plugin-basics-claude` first and select the owning platform using
its platform-model reference.

## Find before creating

Discover `list_integrations` and call it through `call_read_operation` first.
Prefer extending one suitable FAQ knowledge base and one suitable product
catalog over creating duplicates.

- Use `learn_website` when a Sales assistant needs stored website-derived FAQ
  and business facts, including voice assistants that cannot live-search.
  It replaces the stored knowledge it wrote before, so inspect the target and
  use `call_destructive_operation` after showing that effect.
- Use `add_website_knowledge` when the site should remain a live source.
- Use `create_faq_knowledge_base` for maintained question/answer content.
- Use `create_products_integration` for a manually maintained catalog.
- Use `create_product_feed_integration` when the owner already has a feed.

Show the proposed source, content count, ownership, and update strategy, then
obtain approval before calling `call_configuration_operation`. Never invent
prices, policies, availability, or product attributes.

## Update and verify

For FAQ or product updates, list the current entries first and preserve their
real IDs. Show additions, changes, and removals; update tools may remove omitted
content and therefore need exact approval.

Feed and product processing may be asynchronous. Poll `get_integration` at a
reasonable interval until it reaches a terminal or usable state; do not recreate
the integration merely because it is still processing.

`update_faq_knowledge_base_entries` and `update_products` can remove omitted or
explicitly removed content. Show the exact add/change/remove diff and use
`call_destructive_operation`, not the configuration gateway.

Deletion requires the exact integration ID, a statement of indexed content that
will be removed, and separate confirmation through `call_destructive_operation`.
After any write, re-read the integration and summarize what is searchable versus
still pending.

For an Agents Platform agent, use the `build-agent-system` skill. Reuse
an existing Sales resource through Agents Business Knowledge when the inventory
shows that provider; do not duplicate its content. Create or update the
Business Knowledge source through the configuration gateway only after showing
the discovered schema, provider identity, display name, enabled state,
read-only declaration, and exact non-secret config. Credential values never
belong in gateway arguments; provider authorization uses its human consent
flow.
