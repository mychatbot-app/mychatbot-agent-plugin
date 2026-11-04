---
name: business-knowledge
description: >-
  Add, update, validate, or remove MyChatBot business knowledge: documents, live websites,
  Sales FAQs, Product YAML lists, product feeds, or Agents Business
  Knowledge attachments, and read the account's Catalog. Use when an assistant or agent needs grounded company
  or catalog information.
---

# Configure business knowledge

Load `mychatbot-plugin-basics-claude` first and select the owning platform using
its platform-model reference.

## Find before creating

Call the Sales Platform operation `list_integrations` first.
Prefer extending one suitable FAQ knowledge base and one suitable product
catalog over creating duplicates.
When the request also targets an Agents Platform agent, call
`get_account_authoring_inventory` before proposing changes on either platform.
Do not postpone that cross-platform inventory until after the Sales proposal.
The proposal must identify the existing suitable Sales knowledge resources and
say which ones will be reused instead of duplicated.
Stop after the inventories and clarification questions. Show the exact reuse or
creation plan and ask for configuration approval before any knowledge write or
agent enablement.

- Use `learn_website` when a Sales assistant needs stored website-derived FAQ
  and business facts, including voice assistants that cannot live-search.
  It replaces the stored knowledge it wrote before, so inspect the target and
  call it only after showing that replacement effect and obtaining approval.
- Use `add_website_knowledge` when the site should remain a live source.
- Use `add_document_knowledge` for a PDF, DOCX, TXT (UTF-8), or CSV file the
  owner links over https: a direct file link up to 25 MB, not a share page. It
  adds the file to the group's Business Files source (at most 30 documents) and
  indexes it in the background. Run it with `dry_run: true` first to check the
  download and the file type. Add one file at a time: while the source is
  indexing, the next add is refused, so wait until `list_knowledge_sources`
  shows it done.
- Use `create_faq_knowledge_base` for maintained question/answer content.
- Use `create_product_yaml` for a Product YAML list: products the owner writes
  by hand, with any fields (Knowledge -> Sources -> Product YAML in the app).
- Use `create_product_feed_integration` when the owner already has a feed.
  A Shopify storefront URL (`https://yourstore.com` or its `/products.json`)
  is a valid feed URL. To sell a Shopify store in chats with checkout links,
  load `sell-shopify-store`.

Show the proposed source, content count, ownership, and update strategy, then
obtain approval before calling the exact create tool. Never invent
prices, policies, availability, or product attributes.

## Update and verify

For FAQ or product updates, list the current entries first and preserve their
real IDs. Show additions, changes, and removals; update tools may remove omitted
content and therefore need exact approval.

Feed and product processing may be asynchronous. Poll `get_integration` at a
reasonable interval until it reaches a terminal or usable state; do not recreate
the integration merely because it is still processing.

`list_knowledge_sources` shows each source's indexing status, error or
warning, documents, and the assistants that use its group.
`refresh_knowledge_source` re-indexes one source after configuration approval;
a website source is read live and needs none, and a source that is indexing is
refused. After a change, ask `test_knowledge_search` a question a customer
would ask (not a real customer's message) to see the snippets and search
results the assistant retrieves; it runs knowledge searches only.

`update_faq_knowledge_base_entries` and `update_product_yaml_items` can remove omitted or
explicitly removed content. Show the exact add/change/remove diff and obtain
replacement approval before calling the update tool.

## Read the Catalog

The account's Catalog (Knowledge -> Catalog in the app: products with
variants, warehouse stock, and marketplace export) is separate from the
knowledge sources above. `list_knowledge_products` reads the knowledge sources
(Product YAML, Product Spreadsheet, Product Feed), not the Catalog.

- `catalog_list_products` lists Catalog products a page at a time, with price,
  status, and stock available for sale; follow `next_offset` for more.
- `catalog_get_product` returns one product by its id or SKU: variants, stock
  per warehouse, photos, and export state.
- `catalog_list_warehouses` lists the warehouses that stock lines name.
- `catalog_get_ai_sync` says whether assistants can search the Catalog and
  through which knowledge base: only assistants using that knowledge base can.

These are reads only. Changes to Catalog products, stock, or its sync are made
in the app for now; say so rather than writing a Product YAML copy of the
Catalog.

Deletion requires the exact integration ID, a statement of indexed content that
will be removed, and separate confirmation before calling the delete tool.
After any write, re-read the integration and summarize what is searchable versus
still pending.

For an Agents Platform agent, use the `build-agent-system` skill. Reuse
an existing Sales resource through Agents Business Knowledge when the inventory
shows that provider; do not duplicate its content. Create or update the
Business Knowledge source with Agents Platform operations only after showing
the current schema, provider identity, display name, enabled state,
read-only declaration, and exact non-secret config. Credential values never
belong in tool arguments; provider authorization uses its human consent
flow.
