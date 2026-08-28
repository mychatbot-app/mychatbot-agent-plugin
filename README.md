# MyChatBot agent plugin

Claude Code plugin for audited MyChatBot deployment and operations workflows.

The plugin connects Claude Code to the existing OAuth-backed MyChatBot connector
and adds the process knowledge needed to use that connector safely: inspect the
account, propose a bounded plan, obtain approval for mutations, verify persisted
state, and leave a deployment handoff.

> Status: private integrator pilot. Installing or authenticating this plugin
> connects to production MyChatBot accounts. Use mock tests during development;
> do not run account-writing checks without authorization for the exact account.

## Product boundary

- The browser Claude connector is the beginner path for creating a first demo.
- This plugin is the professional path for audits, production configuration,
  testing, operations, and eventually Agents Platform deployments.
- Skills own workflow and judgment. MCP tools remain the source of truth for
  schemas, account state, authorization, and writes.

## Install from the private pilot marketplace

Your local Git credentials must be able to read this repository.

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
