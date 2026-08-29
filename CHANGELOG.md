# Changelog

All notable plugin changes are recorded here.

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

[0.3.0]: https://github.com/mychatbot-app/mychatbot-agent-plugin/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/mychatbot-app/mychatbot-agent-plugin/releases/tag/v0.2.0
