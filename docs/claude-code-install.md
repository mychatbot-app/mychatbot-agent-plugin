# Claude Code installation protocol

Source marketplace: `mychatbot-app/mychatbot-agent-plugin`

This is an agent-executable setup protocol. Read it completely before running
commands. Setup is complete only after source installation, browser
authentication, connection verification, and a clean handoff to a new
conversation.

## Host gate

Run installation only from Claude Code on the user's computer. A browser-only
or isolated remote conversation cannot install into the local plugin cache. In
that case, tell the user to open Claude Code locally and paste the instruction
from `https://docs.mychatbot.app/agents/claude-code-plugin.md`.

## Prerequisites

```bash
claude --version
git --version
```

Use a current Claude Code 2.x release. Git is required for the public source
marketplace.

## Install from source

```bash
claude plugin marketplace add https://github.com/mychatbot-app/mychatbot-agent-plugin.git#main
claude plugin marketplace list
claude plugin install mychatbot@mychatbot-app
```

Treat the marketplace command as a long-running clone. Poll until it exits;
ordinary short-command silence is not failure.

## Sign in or create the account

Do not ask the user to find, copy, or paste an `mcp_…` key. In an interactive
terminal, start OAuth directly:

```bash
claude mcp login plugin:mychatbot:mychatbot
```

Claude Code opens a MyChatBot authorization page. Tell the user that the page
will ask for their email and a one-time code. A verified existing email
reconnects its account; a new email creates an account without requiring a
visit to the dashboard first.

When Claude is executing setup through a non-interactive Bash tool, use the
inline pseudo-terminal command in `claude/SETUP.md`. It creates a unique log and
does not rely on `CLAUDE_PLUGIN_ROOT`. On Windows, ask the user to run the
direct login command in an interactive PowerShell window.

Wait for the login output to report authentication success. Do not run several
login attempts at once. A timeout requires a fresh attempt after the current
one exits; it does not require reinstalling the plugin.

## Verify

```bash
claude plugin details mychatbot@mychatbot-app
claude mcp get plugin:mychatbot:mychatbot
```

Expected server URL:

`https://api.mychatbot.app/api/mcp/plugin`

The single authenticated connection contains the complete Sales, Agents, UGC,
and Docs tool catalogs. If it reports that authentication is needed, return to
the login step.

## Required handoff

The installation conversation cannot use tools that were added after it
started. Begin a new Claude Code conversation with the user's actual goal.
Installing and signing in does not authorize account changes.

Useful starting requests include:

- `Audit my MyChatBot account and propose the highest-impact improvements.`
- `Build a sales assistant for my business, add the right knowledge, and test it privately.`
- `Create an Agents Platform system with the right agents, skills, knowledge, and routine.`
- `Review my catalogs, feeds, FAQs, and Business Knowledge for gaps and duplicates.`
- `Prepare a follow-up campaign, but do not contact anyone until I approve the audience and content.`

## Update

```bash
claude plugin marketplace update mychatbot-app
claude plugin update mychatbot@mychatbot-app
```

Start a new conversation and repeat connection verification.
