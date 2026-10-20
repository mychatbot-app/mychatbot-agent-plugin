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

For every build or tuning request, first call `get_account_summary`,
`list_assistants`, `list_integrations`, `list_channels`, and `list_pipelines`.
Add `get_subscription_info` when eligibility or capacity matters. Complete this
inventory before proposing a new assistant, even when business details still
need clarification. Inspect `get_assistant` for the
exact existing assistant when tuning one; do not create a similarly named
assistant because a list result was inconvenient to inspect.

Establish who the assistant serves, its job, handoff boundaries, language,
channels, required business facts, lead fields, booking/order behavior, and
success cases. Use only facts supported by the owner or an approved source.
Even when business details are still needed, the first proposal must name the
knowledge configuration, private test, and customer-facing activation as
separate stages requiring their own approvals.

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
A `model` change can change what each message costs. No tool returns model
prices: tell the owner to check the price per message in the dashboard's model
picker, name the current and new model, and get approval for that change.

## Edit existing instructions and skills

Prefer patches to full replacements when changing text that already exists:

1. Read with `assistant_view_instructions` (the outline by default) or
   `assistant_view_skill` (a short skill comes back whole), then only the
   section, line range, or search hits you need. Keep the returned `version`.
2. Call `assistant_patch_instructions` (or `assistant_patch_skill`) with
   `dry_run: true`. Every `find` must match the current text exactly once. If a
   `find` is not found, copy it exactly from a fresh view (`near_miss` names a
   case, quote, or whitespace difference). If it matches several times, add
   surrounding text until it matches once (`match_lines` shows where). Show the
   owner the returned diff and say that a save is live at once on an active
   assistant; then get configuration approval.
3. Apply the same edits without `dry_run`, passing `expected_version`. A version
   conflict means someone else changed the text: read again, dry-run again, and
   get approval again if the diff differs. Report any `warnings`, such as a
   pending builder draft that would overwrite the change if accepted later in
   the dashboard. If moderation flags the new instructions, nothing is saved and
   the assistant is switched off: report that, and switch it back on only with
   activation approval.
4. Re-test the changed behavior privately with `test-and-evaluate`. For a large
   change to an active assistant, test the candidate first with an eval and
   `instruction_override`.
5. If the result is worse, find the previous version with
   `assistant_list_instruction_versions` (or `assistant_list_skill_versions`),
   preview it with `assistant_restore_instructions` (or `assistant_restore_skill`)
   and `dry_run: true`, then restore it after approval. A restore saves the
   current text as a version first, so it can be undone; a deleted skill can be
   restored the same way.

If skill version history is not set up (`skill_history_unavailable`), stop and
report it. Do not fall back to `assistant_update_skill`: a full replacement then
cannot be undone and needs separate replacement approval.

## Adjust behavior, hours, and Flight Control

Read the current state first: `assistant_get_settings`,
`assistant_get_working_hours`, `assistant_get_flight_control`,
`assistant_list_control_numbers`, or `assistant_list_live_notes`.

- `assistant_update_settings` changes only the keys passed: manager mode
  (`manageLeads`), the hand-off stop word or implicit hand-off, silent hand-off,
  auto-return and its interval, `end_conversation`, link handling, reply
  language, web search, and communication guidelines. Call it with
  `dry_run: true`, show the before and after, and get configuration approval.
  Three keys need activation approval instead, with their effect named: web
  search sends customers' questions to an external search provider and adds AI
  usage; communication guidelines add an extra AI pass over every reply; manager
  mode lets the assistant change lead statuses and labels in live chats. The
  server applies the dashboard's couplings (a stop word turns implicit hand-off
  off; turning auto-return off clears its interval), so report the returned
  `after`, not the request.
- `assistant_set_working_hours` changes only the days given (null closes a
  day; whole hours only). With hours set, the assistant switches itself on
  inside them and off outside them, plan and balance permitting: dry-run, show
  the week and timezone, and get activation approval. A week with no hours
  leaves the assistant on or off as it was last switched: read its status again
  with `get_assistant` and report it.
- A Flight Control Telegram group is connected by a person in Telegram from
  `connect_link`. Do not report it connected until `telegram_group_connected`
  is true.
- A control number gives a phone standing authority to instruct the assistant
  over WhatsApp (Pro plan or higher, at most 5). Add one with
  `assistant_add_control_number` only for a number the owner gave you for that
  purpose, with notes-only access unless they ask for more. Before adding
  access, name what each group lets that phone read: `clients` the customers,
  their chats and messages; `orders` orders; `bookings` calendar bookings;
  `setup` the assistant and its FAQ; `usage` usage figures. Dry-run, then get
  activation approval. `assistant_remove_control_number` needs exact approval.
- A live note (`assistant_add_live_note`, Pro plan or higher; at most 500
  characters and 20 in force) is temporary context every reply sees from the
  next message. Set `until` (for example `+2h`, `end_of_today`, `closing`),
  dry-run, show the text and the returned end in the assistant's timezone, and
  get configuration approval. `assistant_remove_live_note` ends one now: dry-run
  shows the note; get exact approval.

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
