# Claude Code installation protocol

This document is the source for the agent-readable `https://mychatbot.app/claude`
installation page. The pilot marketplace is private:

`https://github.com/mychatbot-app/mychatbot-agent-plugin.git`

## Host gate

Run installation only from Claude Code on the user's machine. A browser-only or
isolated remote conversation cannot install into the local Claude plugin cache.
In that case, stop and tell the user to open Claude Code locally and paste:

`Read https://mychatbot.app/claude and follow it completely to install the MyChatBot plugin, connect my account, and start a read-only deployment audit.`

## Execution contract

Read this entire guide before running commands. Setup means install, OAuth
login, verification, and a clean-session handoff; do not stop after one step.
Never ask the user to paste a MyChatBot access token.

## Prerequisites

```bash
claude --version
git --version
```

Claude Code 2.x is required. During the private pilot, Git must already be able
to read the `mychatbot-app/mychatbot-agent-plugin` repository.

## Install

```bash
claude plugin marketplace add https://github.com/mychatbot-app/mychatbot-agent-plugin.git
claude plugin marketplace list
claude plugin install mychatbot@mychatbot-app
```

## Connect the account

```bash
claude mcp login plugin:mychatbot:mychatbot
```

Tell the user a browser will open. They authenticate by email and a one-time
code; the flow can connect an existing account or create a trial account. Wait
for the CLI to report successful authentication. Do not print browser callback
parameters or tokens.

If the shell is non-interactive, ask the user to run the login command in their
own terminal rather than inventing a token-based workaround.

## Verify

```bash
claude plugin details mychatbot@mychatbot-app
claude mcp get plugin:mychatbot:mychatbot
```

Expected: plugin `mychatbot`, server `plugin:mychatbot:mychatbot`, connected URL
`https://connector.mychatbot.app/mcp`, and the plugin's workflow skills.

If authentication is still required, repeat only the login step. If the plugin
is absent, check the marketplace name before reinstalling.

## Required handoff

Reload plugins if the host supports it, then start a new Claude Code
conversation. Use the requested intent as the final sentence. The default is:

`The MyChatBot plugin is installed. Start with a read-only deployment audit of my current Sales Platform and any visible Agents Platform resources. Summarize what exists, what is missing, and a staged plan. Do not change account state until I approve a specific stage.`

Other supported pilot intents:

- Deploy a Sales assistant: audit the current deployment, then propose a
  production Sales assistant and its knowledge/test/launch stages.
- Improve business knowledge: inspect existing sources, find gaps, and propose
  additions without creating duplicates.
- Test and tune: inspect existing assistants and propose a private regression
  test matrix before changing instructions.

The installation conversation is not the deployment conversation. If a
task-spawning control is available, create a one-click handoff using the chosen
prompt. Otherwise print the exact prompt in a copyable block and tell the user
to paste it into a new conversation.

## Update

```bash
claude plugin marketplace update mychatbot-app
claude plugin update mychatbot@mychatbot-app
```

Reload plugins or begin a new conversation, then rerun verification.
