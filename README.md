# MyChatBot agent plugin

Claude Code plugin for guided MyChatBot setup and operations workflows.

The plugin connects Claude Code to the existing OAuth-backed MyChatBot connector
and adds the process knowledge needed to use that connector safely: inspect the
account, propose a bounded plan, obtain approval for mutations, verify persisted
state, and leave a clear handoff.

Installing or authenticating this plugin connects to a live MyChatBot account.
Use mock tests during development; do not run account-writing checks without
authorization for the exact account.

## Product boundary

- The browser Claude connector is the beginner path for creating a first demo.
- This plugin is the advanced path for audits, account configuration, testing,
  operations, and Agents Platform systems.
- Skills own workflow and judgment. MCP tools remain the source of truth for
  schemas, account state, authorization, and writes.

## Install from the public marketplace

```bash
claude plugin marketplace add https://github.com/mychatbot-app/mychatbot-agent-plugin.git
claude plugin install mychatbot@mychatbot-app
claude mcp login plugin:mychatbot:mychatbot
```

Start a new Claude Code conversation after authentication. See
[`docs/claude-code-install.md`](docs/claude-code-install.md) for the complete
agent-executable installation and handoff protocol.

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
claude/skills/                   Workflow and safety skills
contracts/                       Pinned MCP capability contracts
docs/                            Installation and architecture documents
scripts/validate.mjs             Zero-dependency static validator
test/                            Contract-focused tests
```
