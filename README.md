# MyChatBot Agent Plugin

Build, test, and operate MyChatBot business systems from Claude Code and
Codex.

The plugin adds the workflow knowledge needed to use MyChatBot's broad account
tool catalog well. It covers sales assistants, Agents Platform systems,
Business Knowledge, catalogs and FAQs, channels, integrations, CRM work,
outreach, routines, automations, private testing, and UGC.

## One connection, complete platform access

The plugin connects to the API-owned MyChatBot plugin MCP at:

`https://api.mychatbot.app/api/mcp/plugin`

That connection composes the existing tool implementations without reducing
their catalogs:

- **Sales:** assistants, knowledge, integrations, channels, leads,
  conversations, pipelines, orders, outreach, test chats, evals, and usage.
- **Agents:** agents, skills, connectors, Business Knowledge, routines,
  schedules, triggers, validation, readiness, and previews.
- **UGC:** media generation, social publishing, analytics, and ads.
- **Docs:** public, read-only MyChatBot documentation.

The browser Claude connector is not used as an MCP tool gateway. Browser signup
authorization creates or reconnects the MyChatBot account; authenticated tool
traffic then goes directly to `api.mychatbot.app`.

The catalog-scoped Product MCP remains on demand because each catalog has a
different credential-bearing URL. The Business Knowledge skill explains when
direct catalog search verification needs that additional read-only connection.

## Install from the public source marketplace

### Claude Code

```bash
claude plugin marketplace add https://github.com/mychatbot-app/mychatbot-agent-plugin.git#main
claude plugin install mychatbot@mychatbot-app
```

Then sign in:

```bash
sh "${CLAUDE_PLUGIN_ROOT}/skills/mychatbot-plugin-basics-claude/login-mychatbot.sh"
```

The browser flow uses an email and one-time code. It can create the MyChatBot
account, so no dashboard visit or API-key handling is required. Start a new
conversation after authentication.

See [the complete Claude Code setup guide](docs/claude-code-install.md) for
verification and troubleshooting. The source install is the public release
path; an official directory listing is an additional discovery channel, not a
prerequisite.

### Codex

```bash
codex plugin marketplace add mychatbot-app/mychatbot-agent-plugin --ref main
codex plugin add mychatbot@mychatbot-app
```

Codex authenticates during installation. If needed, run
`codex mcp login mychatbot`, complete the same browser flow, and start a new
thread. See [the Codex source-install guide](docs/codex-install.md).

## Operating boundary

- A general audit reads configuration metadata, not customer records or messages.
- Configuration, private tests, billed generation, activation, customer
  communication, publication, replacement, and deletion are separate approval stages.
- Runtime MCP schemas and fresh account state are authoritative.
- Installing or authenticating the plugin does not authorize an account change.

MyChatBot's [privacy policy](https://mychatbot.app/legal/privacy-policy) applies
to hosted services. See [SECURITY.md](SECURITY.md) for authentication handling
and vulnerability reporting.

## Develop

```bash
npm test
claude plugin validate ./claude --strict
python3 /root/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py codex
```

Repository tests are fixture-based and do not contact MyChatBot accounts.

## Repository layout

```text
.claude-plugin/marketplace.json  Claude source marketplace
.agents/plugins/marketplace.json Codex/ChatGPT source marketplace
claude/                          Claude Code package
codex/                           Codex/ChatGPT package
contracts/                       Pinned tool inventory and risk map
evals/                           Workflow and approval scenarios
docs/                            Installation and architecture documents
scripts/                         Offline validators
test/                            Contract-focused tests
```
