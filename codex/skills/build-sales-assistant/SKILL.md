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
