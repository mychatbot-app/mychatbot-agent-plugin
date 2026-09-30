# Changelog

All notable plugin changes are recorded here.

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
