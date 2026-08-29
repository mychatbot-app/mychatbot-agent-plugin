# Claude Code installation protocol

Source marketplace: `mychatbot-app/mychatbot-agent-plugin`

This is an agent-executable setup protocol. Read it completely before running
commands. Setup is complete only after installation, secure account-key entry,
four-server verification, and a clean working-conversation handoff.

## Host gate

Run installation only from Claude Code on the user's machine. A browser-only or
isolated remote conversation cannot install into the local plugin cache. In
that case, tell the user to open Claude Code locally and paste the installation
instruction from `https://mychatbot.app/claude`.

## Prerequisites

```bash
claude --version
git --version
```

Use a current Claude Code 2.x release. Git is required for the source
marketplace.

## Obtain the account access key

The user creates the key in MyChatBot from any Agent's **Tasks → Connect Claude
or Codex** dialog. It is shown once and works across the direct Sales, Agents,
and UGC MCP servers.

Do not ask the user to paste the key in chat. Do not put it in a command, shell
history, environment file, repository, or issue. Keep the masked configuration
dialog under the user's control.

## Install

```bash
claude plugin marketplace add mychatbot-app/mychatbot-agent-plugin
claude plugin marketplace list
claude plugin install mychatbot@mychatbot-app
```

Claude Code prompts for the required **MyChatBot account access key**. Tell the
user why the prompt appears, then let them paste the key into that masked field.
Claude Code stores it as sensitive plugin configuration.

If installation finishes without configuration, run `/plugin`, open
**Installed → MyChatBot → Configure**, and let the user enter the key there.
Then run `/reload-plugins`.

## Verify

```bash
claude plugin details mychatbot@mychatbot-app
claude mcp get plugin:mychatbot:mychatbot-sales
claude mcp get plugin:mychatbot:mychatbot-agents
claude mcp get plugin:mychatbot:mychatbot-ugc
claude mcp get plugin:mychatbot:mychatbot-docs
```

Expected account servers:

- Sales: `https://api.mychatbot.app/api/mcp/sales-management`
- Agents: `https://api.mychatbot.app/api/mcp/agents`
- UGC: `https://api.mychatbot.app/api/mcp/ugc`

Expected public server:

- Docs: `https://api.mychatbot.app/api/mcp/docs`

All must report connected. If an account server returns 401, configure the key
again and check for copied whitespace. Do not use `claude mcp login`; the plugin
does not authenticate these servers through OAuth. If Docs alone is unavailable,
report documentation lookup as degraded without treating the account as
unavailable.

## Required handoff

Reload plugins if needed, then begin a new Claude Code conversation. The first
turn reads the relevant account inventory and proposes bounded stages. It does
not write merely because installation was approved.

Good handoff prompts include:

- `Audit my MyChatBot account and propose the highest-impact improvements.`
- `Build a Sales assistant for my business, including knowledge and private tests.`
- `Set up an Agents Platform workflow with the right agents, skills, knowledge, and routine.`
- `Review my catalogs, feeds, FAQs, and Business Knowledge for gaps and duplicates.`
- `Prepare an outreach campaign, but do not contact anyone until I approve the exact audience and content.`

## Update

```bash
claude plugin marketplace update mychatbot-app
claude plugin update mychatbot@mychatbot-app
```

Run `/reload-plugins` or start a new conversation, then repeat verification.
