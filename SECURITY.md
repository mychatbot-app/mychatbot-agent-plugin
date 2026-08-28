# Security

## Report a vulnerability

Please report suspected vulnerabilities privately to
[support@mychatbot.app](mailto:support@mychatbot.app). Do not open a public
issue containing credentials, customer data, exploit details, or an account
identifier. Include the plugin version, affected component, reproduction steps,
and impact without including live secrets.

## Trust boundary

This plugin includes Markdown workflow skills, one hosted OAuth MyChatBot
account MCP server, and one public read-only MyChatBot Docs MCP server. It
installs no local executable, hook, or background process. Claude Code
authenticates to the account server with OAuth; the account credential must not
be placed in prompts, logs, repository files, or issue reports.

The compact MCP surface separates ordinary reads, customer-data reads,
configuration, customer-record writes, private tests, billed generation,
activation, external actions, and destructive operations. These classifications
support informed approval but do not replace the user's responsibility to
review a requested tool call and its arguments.

Third-party OAuth and credential entry remain human steps. Authenticated custom
MCP headers and API keys are entered in the MyChatBot application and must not
be sent through this plugin.
