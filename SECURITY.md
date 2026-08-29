# Security

## Report a vulnerability

Report suspected vulnerabilities privately to
[support@mychatbot.app](mailto:support@mychatbot.app). Do not open a public
issue containing credentials, customer data, exploit details, or an account
identifier. Include the plugin version, affected component, reproduction steps,
and impact without including live secrets.

## Trust boundary

This plugin contains Markdown workflow skills and four hosted HTTP MCP server
definitions. It installs no local executable, hook, or background process.

One account access key authenticates the direct Sales, Agents, and UGC MCP
servers. Claude Code stores that value as sensitive plugin configuration and
substitutes it into the servers' Authorization headers. Never put the key in a
prompt, shell command, repository, log, screenshot, issue, or support message.
Revoke exposed keys in MyChatBot and create a replacement.

The Docs MCP is public and read-only. A catalog Product MCP is not bundled
because its URL contains account and catalog identifiers and functions as a
credential. Obtain and configure such a URL only through that catalog's
**Connect AI tools** flow.

Tool schemas, tenant resolution, plan checks, and writes are enforced by the
hosted services. Plugin skills classify operations and require informed approval
for customer-data reads, configuration, tests, spending, activation, external
communication, publication, replacement, and destructive work. Those workflow
rules do not grant permissions beyond the account access key.

Third-party OAuth and credential entry remain human steps. API keys and
authenticated custom MCP headers are entered in MyChatBot and must not be sent
through this plugin.
