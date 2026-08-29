---
name: build-sales-assistant
description: >-
  Design, create, upgrade, test, or activate a customer-facing MyChatBot Sales
  assistant. Use for sales, support, booking, ordering, website chat, voice, or
  messaging assistants. Not for back-office Agents Platform routines.
---

# Build a Sales assistant

Load `mychatbot-plugin-basics` first. Configuration, private testing,
and customer-facing activation are separate approvals.

## Inspect and choose the target

Use Sales Platform operations to call `get_account_summary`, `list_assistants`,
`list_integrations`, `list_channels`, `list_pipelines`, and
`get_subscription_info` as the task requires. Inspect `get_assistant` for the
exact existing assistant when tuning one; do not create a similarly named
assistant because a list result was inconvenient to inspect.

Establish who the assistant serves, its job, handoff boundaries, language,
channels, required business facts, lead fields, booking/order behavior, and
success cases. Use only facts supported by the owner or an approved source.

## Propose a bounded configuration

Show the complete proposal before writing:

- assistant name, welcome message, instructions, model/language choices;
- Sales skills or toolkit toggles actually required;
- FAQ, website, product, calendar, or integration dependencies;
- pipeline/client-context behavior;
- private tests and later activation stages.

For a new assistant, use the current `assistant_create` schema and call it once
after approval. Re-read with `get_assistant`.
Create skills and reversible toolkit configuration as a separately approved
bounded stage.

`assistant_update_instructions`, `assistant_update_skill`, and
`assistant_update_client_context_schema` are full replacements. Read the current
resource, show the complete retained and changed value, obtain replacement
approval, then call the exact tool. `assistant_update` can switch
customer-facing behavior on or off and needs separate activation approval.

## Add knowledge and business capabilities

Use `business-knowledge` for websites, FAQs, feeds, and catalogs. Use
`channels-and-integrations` for channels, calendars, and external services.
Enable order taking only when requested: inspect the exact
`enable_order_taking` schema, preview required customer/item fields and currency,
then call it only after activation approval.

## Test, then activate

Use `test-and-evaluate` before any customer-facing activation. After the agreed
cases pass, propose one channel at a time. Discover its current schema, show
credential or human OAuth steps, expected public behavior, and rollback path.
Call the exact channel tool only after exact activation approval.

Finish with the assistant ID, knowledge and integration dependencies, tests and
failures, active channels, order/lead settings, configuration links, remaining
human steps, and every live path not verified.
