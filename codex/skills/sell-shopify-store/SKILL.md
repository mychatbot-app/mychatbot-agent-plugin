---
name: sell-shopify-store
description: >-
  Set up a MyChatBot Sales assistant that sells a Shopify store's products in
  chats (Instagram, Messenger, WhatsApp, Telegram, or a website widget) and
  sends checkout links to the store's own Shopify checkout. Use when a Shopify
  merchant wants their catalog synced from the storefront URL, kept fresh, and
  sold by an assistant.
---

# Sell a Shopify store in chats

Load `mychatbot-plugin-basics` first. This workflow combines
`business-knowledge`, `build-sales-assistant`, `test-and-evaluate`, and
`channels-and-integrations`; load each one when its stage starts and follow its
approval rules. Catalog configuration, assistant configuration, private
testing, and customer-facing activation are separate approvals.

## What MyChatBot reads from Shopify

- The store is added as a Product Feed from its public storefront URL:
  `https://yourstore.com`, `https://yourstore.com/products.json`, or one
  collection at `https://yourstore.com/collections/<handle>/products.json`.
  No Shopify app, API key, or admin access is needed. MyChatBot reads the same
  public product data the storefront shows shoppers, plus the store currency.
- Synced: product title, description, type, vendor, tags, images, product
  link, and every variant with its options (such as size or color), price,
  compare-at price, in-stock or sold-out state, and SKU. Each product is one
  catalog entry with its variants inside it.
- Not synced: orders, customers, discounts, inventory quantities (only in stock
  or sold out), and subscriptions or selling plans. The assistant cannot look
  up the status of a Shopify order.
- Prices and stock are as of the last sync.

## Inspect before proposing

Call `get_account_summary`, `list_assistants`, `list_integrations`, and
`list_channels` before proposing anything. Confirm the exact store URL and the
language of the product content with the owner. If a feed for the same store
already exists, reuse it and check it with `get_integration` instead of
creating a duplicate. A knowledge base holds at most three Product Feed
integrations.

Pass `assistant_id` for the assistant that should sell when you create the
feed. That assistant is attached to the feed's knowledge base if it has none
yet; one that already uses another knowledge base is never switched over, and
the result's `attach_note` says so. Without `assistant_id`, the feed attaches
only when exactly one assistant has no knowledge base; with several, none is
attached and `attach_note` lists them, so ask the owner which one and create
the next source with its `assistant_id`. The result's `attached_assistants`
lists every assistant that answers from that knowledge base.

Even when the store URL or language still needs confirming, the first reply
after these reads must outline the whole plan: the storefront feed with fast
start and auto-update, the assistant that sends checkout links, the private
test, and channel activation. Name each of these as a stage that needs its own
approval.

## Stage 1: add the store catalog

Load `business-knowledge`. Propose the knowledge base (existing or new), the
feed URL, the language, an optional display name (60 characters or fewer and
unique in that knowledge base), whether to index images, and an auto-update
period. Recommend `autoupdate_interval_hours` of 24, or 6 when stock changes
quickly; the allowed values are 1, 3, 6, 12, and 24. If the live
`create_product_feed_integration` schema does not list that parameter, do not
pass it; tell the owner to turn on auto-update for the feed in the MyChatBot
dashboard.

For a store that is not in the account yet, pass `fast_start: true`, and tell
the owner that the first 250 products are searchable within a couple of
minutes and the rest of the catalog syncs right after. If the live schema does
not list `fast_start`, omit it; the whole catalog then indexes in one pass.

After configuration approval, call `create_product_feed_integration` once.
Indexing runs in the background: poll `get_integration` at a reasonable
interval until the feed is ready or has failed, and report the product count.
While `feed_fast_start_pending` is true, the first 250 products are still
indexing; after it clears, the rest of the catalog syncs, so report the final
count only once that sync finishes. Never recreate the feed because it is
still processing.

If the store cannot be read, explain the likely cause instead of retrying:

- A password-protected store cannot be read until the password is removed.
- A store whose storefront is not served by Shopify at that address (a
  headless storefront) can be added by its `*.myshopify.com` address instead.
- Otherwise, the owner can add the feed URL from a Google Shopping feed app;
  the catalog then works, but checkout links do not.

## Stage 2: build or update the assistant

Load `build-sales-assistant` and follow its inventory, proposal, and
replacement rules. The assistant must use the knowledge base that holds the
Shopify feed.

Assistants that use a Shopify feed automatically get the assistant tool
`create_checkout_link`. It runs inside the assistant during customer chats; it
is not a MyChatBot MCP operation, so never call it or search for it. The link
opens the store's own Shopify checkout with the chosen items and variants
already in the cart. When a product has several variants, the assistant asks
the shopper which size or color before it creates the link; it never picks one
silently. If the assistant uses catalogs from more than one Shopify store, one
call returns one checkout link per store, and the shopper pays at each store
separately.

Propose instructions that tell the assistant to:

- search the catalog before answering about products, prices, sizes, or stock;
- confirm the product, variant, and quantity, then send a checkout link when
  the shopper wants to buy;
- apply a discount code only when it is one the owner gave the assistant, and
  list those exact codes in the instructions;
- not promise order status for Shopify orders and point those questions to the
  store's own contact.

## Stage 3: private test

Load `test-and-evaluate` and obtain private-test approval; `test_chat_start`
clears the assistant's previous test transcript. With `test_chat_send`, ask
about a real product from the synced catalog, choose a variant, and ask to buy
it. Use `test_chat_get_history` to confirm the assistant searched the catalog
and created a checkout link. Check that the link's host is the store the owner
gave you and that the link includes the chosen variant. Do not place an order.
Also test a sold-out or unknown product and an order-status question.

## Stage 4: connect channels

Load `channels-and-integrations`. Propose one channel at a time with its own
activation approval. Instagram, Messenger, and WhatsApp use the dashboard setup
links from that skill; a website widget or Telegram uses its direct activation
tool.

## Hand off

Tell the owner:

- Orders placed through the assistant's checkout links show the referral code
  `mychatbot` in the order's Conversion summary in Shopify admin.
- Prices and stock are as of the last sync; state the auto-update period that
  is set. Shopify may show an item as sold out at checkout if stock changed
  since the last sync.
- Checkout links do not support subscriptions (selling plans).
- With catalogs from two Shopify stores, a shopper who buys from both gets one
  checkout link per store and pays at each store separately.
- The official Shopify connector for Claude manages the store itself
  (products, inventory, orders). MyChatBot builds the assistant that sells in
  chats. Both can be used in the same conversation; neither replaces the other.
- Guide: https://docs.mychatbot.app/guides/shopify-store

Finish with the feed integration ID, status, and product count, the assistant
ID, test evidence including a sample checkout link host, active channels,
remaining human steps, and every live path not verified.
