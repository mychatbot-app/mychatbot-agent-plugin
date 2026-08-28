---
name: business-knowledge
description: >-
  Add, update, validate, or remove MyChatBot business knowledge: live websites,
  Sales FAQs, manual product catalogs, product feeds, or future Agents Business
  Knowledge attachments. Use when an assistant or agent needs grounded company
  or catalog information.
---

# Configure business knowledge

Load `mychatbot-plugin-basics-claude` first and select the owning platform using
its platform-model reference.

## Find before creating

Call `list_integrations` first. Prefer extending one suitable FAQ knowledge base
and one suitable product catalog over creating duplicates.

- Use `add_website_knowledge` for a website that should remain a live source.
- Use `create_faq_knowledge_base` for maintained question/answer content.
- Use `create_products_integration` for a manually maintained catalog.
- Use `create_product_feed_integration` when the owner already has a feed.

Show the proposed source, content count, ownership, and update strategy, then
obtain approval before writing. Never invent prices, policies, availability, or
product attributes.

## Update and verify

For FAQ or product updates, list the current entries first and preserve their
real IDs. Show additions, changes, and removals; update tools may remove omitted
content and therefore need exact approval.

Feed and product processing may be asynchronous. Poll `get_integration` at a
reasonable interval until it reaches a terminal or usable state; do not recreate
the integration merely because it is still processing.

Deletion requires the exact integration ID, a statement of indexed content that
will be removed, and separate confirmation. After any write, re-read the
integration and summarize what is searchable versus still pending.

If the request concerns an Agents Platform agent and Agents tools are absent,
do not substitute a Sales knowledge write. Explain that the source can be
prepared in Sales but cannot yet be attached as Agents Business Knowledge
through the current plugin surface.
