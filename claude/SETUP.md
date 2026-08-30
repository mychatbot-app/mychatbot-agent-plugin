# Connect MyChatBot

Use this guide when the plugin is installed but the MyChatBot MCP server is
not authenticated.

## Sign in or create an account

From an interactive terminal, run:

```bash
claude mcp login plugin:mychatbot:mychatbot
```

When Claude itself is running setup from a non-interactive Bash tool, start the
same command through a pseudo-terminal and use a unique temporary log:

```bash
login_log="$(mktemp "${TMPDIR:-/tmp}/mychatbot-login.XXXXXX.log")"
python3 -c 'import pty,sys; pty.spawn(sys.argv[1:])' \
  claude mcp login plugin:mychatbot:mychatbot > "$login_log" 2>&1 &
printf 'MyChatBot sign-in started. Follow progress in %s\n' "$login_log"
```

Read and poll only the printed log file until it reports success. If the
browser does not open, copy the authorization URL from that log and open it for
the user. Do not print credential material.

The browser flow asks for an email address and a one-time code. It reconnects
an account with that verified email or creates a MyChatBot account when none
exists. The user does not need to open MyChatBot first and must never copy an
`mcp_…` key into Claude.

On Windows, run the same direct command in an interactive PowerShell window:

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
