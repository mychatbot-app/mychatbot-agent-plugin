# Connect MyChatBot

Use this setup guide when the plugin is installed or activated but its
MyChatBot MCP server is not connected yet.

1. Inspect the bundled server:

   ```bash
   claude mcp get plugin:mychatbot:mychatbot
   ```

2. If it needs authentication, tell the user that a browser will open, then
   run this in an interactive terminal:

   ```bash
   claude mcp login plugin:mychatbot:mychatbot
   ```

   The user signs in with email and a one-time code. Never ask them to paste a
   MyChatBot access token, OAuth token, API key, password, or callback URL into
   the conversation.

3. Verify that the server reports `Connected`:

   ```bash
   claude mcp get plugin:mychatbot:mychatbot
   claude mcp get plugin:mychatbot:mychatbot-docs
   claude plugin details mychatbot@mychatbot-app
   ```

   The public Docs server does not require login. If it is unavailable, report
   that current documentation lookup is degraded; do not treat it as evidence
   that the account server or account itself is unavailable.

4. Reload plugins or start a new Claude Code conversation so the authenticated
   tool inventory is present. Begin the working conversation with a read-only
   account audit. Do not interpret install or sign-in approval as permission to
   change the account.

If login cannot run interactively, ask the user to execute the login command in
their terminal. Do not invent a token-based workaround or reinstall a plugin
that is already present.
