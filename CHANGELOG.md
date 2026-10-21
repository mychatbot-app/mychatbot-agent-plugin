# Changelog

All notable plugin changes are recorded here.

## [0.9.0] - 2026-10-21

### Added

- `automation_set_paused`: pause or resume one Sales automation without
  deleting it (Trigger Outreach, Instagram/Facebook Keyword Responder, Lead
  Forms, Lead Form Instant Outreach), with a preview before `confirm=true`.
  Settings, webhook URLs, and assistant links stay. While paused, sends already
  queued are dropped and nobody is messaged; a paused Lead Forms automation
  still captures leads into the CRM, while Trigger Outreach and Lead Form
  Instant Outreach capture nothing. Nothing is replayed on resume. Kinds that do
  not read the switch are refused.
- `assistant_attach_follow_up` and `assistant_detach_follow_up`: attach a
  postponed follow-up to an assistant (a live one then arms for that
  assistant's matching chats on their next message or status change; a draft
  waits until published) or detach it, keeping the sequence. Chats already
  part-way through a sequence keep their queued steps until it is unpublished.
  Both preview before `confirm=true`.
- The bundled catalog grows from 209 to 212 tools (157 Sales).
  `automation_set_paused` and `assistant_attach_follow_up` are activation;
  `assistant_detach_follow_up` is destructive, like the other removals.
- `routines-and-automations` covers the pause switch and what a pause loses;
  `outreach-and-followups` covers attaching and detaching follow-ups.

## [0.8.0] - 2026-10-20

### Added

- Lead structure tools: `list_managers` (the team a lead can be assigned to),
  the custom lead-field list (`list_lead_fields`, `lead_field_create`,
  `lead_field_update`, and `lead_field_delete`, which keeps the values already
  on leads and needs `confirm: true` after its dry run), `funnel_status_update`
  (rename, recolor, or move a status; a rename also renames it on its leads
  and lists the settings that still name the old status, so it is classed
  destructive),
  `list_duplicate_clients`, `client_merge` (the dashboard's merge, with a dry
  run), and `client_bulk_update` (status, labels, or manager for many leads,
  with a dry run, a sample, and the dashboard's count check; never a delete).
- Knowledge tools: `add_document_knowledge` (a PDF, DOCX, TXT, or CSV file from
  an https link, up to 25 MB, fetched from public addresses only),
  `list_knowledge_sources` (indexing status, documents, and the assistants
  that use each group), `refresh_knowledge_source`, and
  `test_knowledge_search` (what an assistant's knowledge retrieves for a
  question; knowledge searches only).
- `assistant_get_model`: the model an assistant answers with, where it comes
  from, its price per 100 messages, and the selectable models at the same
  price.
- The bundled catalog grows from 195 to 209 tools (154 Sales).
- `crm-and-sales-operations` covers the team, lead fields, status updates and
  the settings a rename leaves behind, duplicates and merges (propose the phone
  owner as the target), and bulk changes (what a filter selects, the status
  hand-back effect; dry run, exact approval, then the same call with
  `expected_count` and the `preview_token`). `business-knowledge` covers
  documents by link (one at a time, 30 per source, direct file links),
  source status, re-indexing, and the search test. `build-sales-assistant`
  reads the model and its price before a model change, and asks the owner to
  check the price of a model outside the same-price list.

## [0.7.0] - 2026-10-20

### Added

- API Actions and channel options are public Sales tools (they were available
  only to MyChatBot's support routine): `api_action_create`,
  `api_action_update`, `api_action_attach`, and `set_channel_options`. The owner
  sets the endpoint URL and customer-details sharing; header values (API keys)
  stay dashboard-only, and an action with header values keeps its server
  (scheme, host, and port).
- Assistant setup tools: `assistant_get_settings` and
  `assistant_update_settings` (manager mode, hand-off, auto-return,
  end-of-conversation, link handling, reply language, web search, and
  communication guidelines, checked as the dashboard checks them, with
  before/after and `dry_run`), `assistant_get_working_hours` and
  `assistant_set_working_hours`, `assistant_get_flight_control`, control numbers
  (`assistant_list_control_numbers`, `assistant_add_control_number`,
  `assistant_remove_control_number`), and live notes
  (`assistant_list_live_notes`, `assistant_add_live_note`,
  `assistant_remove_live_note`). The bundled catalog grows from 180 to 195
  tools (140 Sales).
- `build-sales-assistant` covers settings (activation approval for web search,
  communication guidelines and manager mode), Work Hours (an activation: the
  assistant then switches itself on and off), Flight Control (a person connects
  the Telegram group), control numbers (only a number the owner gave,
  notes-only by default, what each access group exposes), live notes, and the
  price of a model change.
- `channels-and-integrations` covers API actions (activation on create and
  attach, customer-details sharing named explicitly, header values
  dashboard-only) and channel options (dry run to read the current values).

## [0.6.0] - 2026-10-20

### Added

- Eight Sales tools for editing long instructions and skills safely:
  `assistant_view_instructions`, `assistant_patch_instructions`,
  `assistant_list_instruction_versions`, `assistant_restore_instructions`,
  `assistant_view_skill`, `assistant_patch_skill`,
  `assistant_list_skill_versions`, and `assistant_restore_skill`. Views and
  version lists are reads; patches and restores are reversible configuration
  writes. The bundled catalog grows from 172 to 180 tools (125 Sales).
- `build-sales-assistant` teaches the edit loop: read the outline, patch with
  `dry_run`, apply with `expected_version`, re-test privately, and restore the
  previous version when a change makes the assistant worse. It names the live
  effects (a save is live at once; flagged text switches the assistant off) and
  stops instead of falling back to a full replacement when skill history is
  unavailable.

### Changed

- `test-and-evaluate` routes fixes to existing instruction or skill text
  through the patch flow instead of full replacements.

## [0.5.2] - 2026-10-02

### Changed

- `sell-shopify-store` passes `assistant_id` when it creates the feed and reads
  `attached_assistants` / `attach_note` from the result. The api no longer
  attaches a new knowledge base to every assistant without one (api#2146):
  only the named assistant, or the only blank one when none is named.

## [0.5.1] - 2026-09-30

### Changed

- `sell-shopify-store` passes `fast_start: true` for a new store and tells the
  owner the first 250 products are searchable within a couple of minutes, with
  the rest of the catalog syncing right after.
- `sell-shopify-store` warns that creating a feed also attaches its knowledge
  base to every assistant with no knowledge base yet, so it reads
  `list_assistants` and names those assistants in the proposal.
- `sell-shopify-store` explains one checkout link per store when an assistant
  uses catalogs from two Shopify stores, and that the assistant asks for the
  variant instead of picking one.
- Shopify limitations no longer depend on `/products.json`: password-protected
  stores, headless storefronts (use the `*.myshopify.com` address), and the
  Google Shopping feed app fallback without checkout links.

## [0.5.0] - 2026-09-30

### Added

- A `sell-shopify-store` workflow for Shopify merchants: add the store as a
  Product Feed from its storefront URL with auto-update, build a Sales
  assistant that sends checkout links to the store's own Shopify checkout,
  test it privately, connect channels, and explain the `mychatbot` referral
  code, freshness, and limits to the owner.
- Business Knowledge guidance that a Shopify storefront URL is a valid feed URL.
- A mocked behavior scenario and compact trace for the Shopify workflow.

## [0.4.1] - 2026-08-30

### Fixed

- Account audits now distinguish attempted, successful, and failed reads and
  never report a required failed read as completed.
- Approval-policy refusals are reported as host policy failures instead of
  being misdiagnosed as expired OAuth connections.
- The public safety contract now keeps customer-data approval classes separate
  from MCP protocol hints for exports that create external files, and marks
  vendor-backed Sales and UGC reads as open-world.

## [0.4.0] - 2026-08-30

### Added

- Intentional workflow ownership and packaged lookup references for all 172
  bundled operations and all 10 on-demand Product operations.
- A reproducible Claude Code behavior suite backed by a local synthetic MCP.
- CI checks for Claude and Codex package discovery plus public and local links.

### Changed

- Browser login now uses Claude Code's direct MCP login command and a portable
  inline pseudo-terminal fallback, with no plugin-root dependency.
- Workflow guidance now requires complete initial inventories, bounds customer
  data access, and separates draft validation from saved or enabled state.
- Evaluation documentation distinguishes static contract checks, mocked model
  traces, and separately authorized production checks.

## [0.3.0] - 2026-08-29

### Added

- Browser OAuth that creates or reconnects a MyChatBot account without copied
  credentials.
- One API-owned MCP connection composing all 172 bundled Sales, Agents, content,
  and Docs operations.
- A Codex package and repository marketplace alongside Claude Code.
- Integrator workflow evals and explicit safety guidance for scheduled messages,
  integration-trigger changes, and routine-session history.
- Source-first install, verification, and release documentation.

### Changed

- Claude Code setup now uses browser authorization instead of plugin key
  configuration.
- Workflow skills route through one MyChatBot namespace while preserving owning
  platform boundaries.

## [0.2.0] - 2026-08-28

- Initial public Claude Code plugin with direct account workflow skills.

[0.5.1]: https://github.com/mychatbot-app/mychatbot-agent-plugin/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/mychatbot-app/mychatbot-agent-plugin/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/mychatbot-app/mychatbot-agent-plugin/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/mychatbot-app/mychatbot-agent-plugin/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/mychatbot-app/mychatbot-agent-plugin/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/mychatbot-app/mychatbot-agent-plugin/releases/tag/v0.2.0
