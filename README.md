# MyChatBot for Claude Code

Build, test, and operate MyChatBot business systems from Claude Code.

The plugin connects Claude directly to MyChatBot's account-scoped MCP servers
and adds the workflow knowledge needed to use their larger tool catalog well. It
covers Sales assistants, Agents Platform systems, Business Knowledge, catalogs
and FAQs, channels, integrations, CRM operations, outreach, routines,
automations, private testing, and UGC.

## What it connects

- **Sales MCP:** assistants, knowledge, integrations, channels, leads,
  conversations, pipelines, orders, outreach, test chats, evals, and account
  usage.
- **Agents MCP:** agents, skills, connectors, Business Knowledge, routines,
  schedules, triggers, validation, readiness, and tool-free previews.
- **UGC MCP:** media generation, social publishing, analytics, and ads.
- **Docs MCP:** public, read-only MyChatBot documentation.

The plugin does not use the browser Claude connector as a gateway. One existing
MyChatBot account access key authenticates the three account servers directly.
Claude Code asks for it once and stores it as sensitive plugin configuration.

The catalog-scoped Product MCP is intentionally on demand. Each catalog has a
different credential-bearing URL, so a universal plugin must not embed or guess
one. The Business Knowledge skill explains when to add a selected catalog's
Product MCP for direct search verification.

## Install from the source marketplace

1. In MyChatBot, open any Agent, choose **Tasks → Connect Claude or Codex**, and
   create an account access key. The full key is shown once.
2. In Claude Code, run:

   ```bash
   claude plugin marketplace add mychatbot-app/mychatbot-agent-plugin
   claude plugin install mychatbot@mychatbot-app
   ```

3. Paste the key only into Claude Code's masked configuration prompt. Do not
   paste it into a conversation or put it in an install command.
4. Start a new conversation and ask Claude to audit or build the system you
   need.

See [the complete Claude Code setup guide](docs/claude-code-install.md) for
verification and troubleshooting.

## Operating boundary

- A general audit reads configuration metadata, not customer records or
  messages.
- Configuration, private tests, billed generation, activation, customer
  communication, publication, replacement, and deletion are separate approval
  stages.
- Direct MCP schemas and fresh account state are authoritative. Skills provide
  routing and safety judgment; they do not expand account permissions.
- Installing or configuring the plugin does not authorize an account change.

MyChatBot's [privacy policy](https://mychatbot.app/legal/privacy-policy) applies
to hosted services. See [SECURITY.md](SECURITY.md) for credential handling and
vulnerability reporting.

## Develop

```bash
npm test
claude plugin validate ./claude --strict
```

Tests are local and fixture-based. They do not contact MyChatBot services.

## Repository layout

```text
.claude-plugin/marketplace.json  Claude marketplace catalog
claude/                          Claude Code plugin package
claude/.mcp.json                Four direct hosted MCP server definitions
claude/SETUP.md                  Connection and verification guide
claude/skills/                   Integrator workflows and references
contracts/                       Pinned direct-MCP inventory and risk map
docs/                            Installation and architecture documents
scripts/validate.mjs             Offline static validator
test/                            Contract-focused tests
```
