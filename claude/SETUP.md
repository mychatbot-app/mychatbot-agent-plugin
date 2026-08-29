# Connect MyChatBot

Use this guide when the plugin is installed but one or more MyChatBot MCP
servers are not connected.

## Obtain the account key

The user must create the key in MyChatBot. Direct them to any Agent's **Tasks →
Connect Claude or Codex → Create access key**. The full value is shown once.

Never ask the user to paste the key into the conversation or a shell command.
They must enter it only in Claude Code's masked plugin configuration prompt:

1. Run `/plugin`.
2. Open **Installed → MyChatBot → Configure**.
3. Paste the value into **MyChatBot account access key**.
4. Apply the configuration and run `/reload-plugins` when prompted.

If only a masked old key is visible in MyChatBot, it cannot be recovered. The
user can create a new key, configure it, confirm all servers connect, and then
revoke the old key.

## Verify the direct servers

```bash
claude mcp get plugin:mychatbot:mychatbot-sales
claude mcp get plugin:mychatbot:mychatbot-agents
claude mcp get plugin:mychatbot:mychatbot-ugc
claude mcp get plugin:mychatbot:mychatbot-docs
claude plugin details mychatbot@mychatbot-app
```

Expected URLs:

- `https://api.mychatbot.app/api/mcp/sales-management`
- `https://api.mychatbot.app/api/mcp/agents`
- `https://api.mychatbot.app/api/mcp/ugc`
- `https://api.mychatbot.app/api/mcp/docs`

The first three use the same account key. Docs is public. A 401 on an account
server normally means the key is missing, revoked, or copied with extra
whitespace. Do not run `claude mcp login`: these direct servers use the plugin's
sensitive account-key configuration, not MCP OAuth.

After all four servers connect, start a new conversation with the user's actual
task. Begin with the relevant read-only inventory; installation is not approval
to change account state.
