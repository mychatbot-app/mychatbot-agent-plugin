# MyChatBot agent plugin

Claude Code plugin for guided MyChatBot setup and operations workflows.

The plugin connects Claude Code to the existing OAuth-backed MyChatBot connector
and adds the process knowledge needed to use that connector safely: inspect the
account, propose a bounded plan, obtain approval for mutations, verify persisted
state, and leave a clear handoff.

It covers everyday integrator work across Sales assistants, Agents Platform
systems, Business Knowledge, FAQs and catalogs, feeds, channels, connectors,
CRM records, outreach and follow-ups, routines and automations, private tests,
and content generation or publishing.

Installing or authenticating this plugin connects to a live MyChatBot account.
Use mock tests during development; do not run account-writing checks without
authorization for the exact account.

## Product boundary

- The browser Claude connector is the beginner path for creating a first demo.
- This plugin is the advanced path for audits, account configuration, testing,
  operations, and Agents Platform systems.
- Skills own workflow and judgment. MCP tools remain the source of truth for
  schemas, account state, authorization, and writes.

## Install from the source marketplace

```bash
claude plugin marketplace add https://github.com/mychatbot-app/mychatbot-agent-plugin.git
claude plugin install mychatbot@mychatbot-app
claude mcp login plugin:mychatbot:mychatbot
```

Start a new Claude Code conversation after authentication. See
[`docs/claude-code-install.md`](docs/claude-code-install.md) for the complete
agent-executable installation and handoff protocol.

After acceptance into Anthropic's official directory, the same plugin will also
be installable from the preconfigured official marketplace.

## Permissions and data

- The plugin includes one OAuth account MCP server plus MyChatBot's public,
  read-only Docs MCP. It installs no local executable, hook, or background
  process.
- OAuth selects the user's MyChatBot account; users never paste an account
  access token into Claude.
- A general audit reads configuration metadata only. Customer records and
  messages have a separate tool and are read only for a task that needs them.
- Configuration, private tests, billed generation, activation, customer
  communication, publication, replacement, and deletion are separate approval
  boundaries.
- The MCP server receives operation arguments and returns account data needed
  for the requested workflow. MyChatBot's
  [privacy policy](https://mychatbot.app/legal/privacy-policy) applies to the
  service.

See [SECURITY.md](SECURITY.md) for vulnerability reporting and the connector
trust boundary.

## Develop

```bash
npm test
claude plugin validate ./claude
```

Tests are local and fixture-based. They do not contact MyChatBot services.

## Repository layout

```text
.claude-plugin/marketplace.json  Claude marketplace catalog
claude/                          Claude Code plugin package
claude/SETUP.md                  Post-install OAuth and server verification guide
claude/skills/                   Workflow and safety skills
contracts/                       Pinned MCP capability contracts
docs/                            Installation and architecture documents
scripts/validate.mjs             Zero-dependency static validator
test/                            Contract-focused tests
```
