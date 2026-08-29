# Connect MyChatBot

Use this guide when the plugin is installed but the MyChatBot MCP server is
not authenticated.

## Sign in or create an account

Run the bundled login helper:

```bash
sh "${CLAUDE_PLUGIN_ROOT}/skills/mychatbot-plugin-basics-claude/login-mychatbot.sh"
```

It starts Claude Code's MCP OAuth login in an interactive pseudo-terminal and
writes progress to `/tmp/mychatbot-login.log`. Read and poll that file until it
reports success. If the browser does not open, copy the authorization URL from
the log and open it for the user.

The browser flow asks for an email address and a one-time code. It reconnects
an account with that verified email or creates a MyChatBot account when none
exists. The user does not need to open MyChatBot first and must never copy an
`mcp_…` key into Claude.

On Windows, run this in an interactive PowerShell window instead:

```powershell
claude mcp login plugin:mychatbot:mychatbot
```

Do not start overlapping login attempts. If one times out, let it exit before
starting a fresh attempt.

## Verify the connection

```bash
claude mcp get plugin:mychatbot:mychatbot
claude plugin details mychatbot@mychatbot-app
```

Expected MCP URL:

`https://api.mychatbot.app/api/mcp/plugin`

The server should report authenticated and connected. It exposes the complete
Sales, Agents, UGC, and Docs catalogs through one API-owned connection. If it
still needs authentication, repeat the login step rather than reinstalling the
plugin.

After login, start a new conversation with the user's actual task. Plugins and
MCP tools are captured at session start, and installation alone is not approval
to change the account.
