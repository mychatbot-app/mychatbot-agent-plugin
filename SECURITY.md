# Security

Report suspected vulnerabilities privately to `support@mychatbot.app`. Do not
include credentials, customer records, message contents, or other sensitive
data in a public issue.

## Authentication

The plugin uses the host's MCP OAuth flow. The user signs in or creates an
account in a MyChatBot browser page with an email and one-time code. Claude Code
or Codex manages the resulting credential through its own MCP connection
controls.

Never paste an `mcp_…` key, OAuth token, one-time code, password, connector
credential, or authenticated MCP URL into a conversation, command, repository,
issue, or support message. MyChatBot tools must not return stored secrets.

The plugin MCP resolves the tenant from the authenticated credential on every
request. Tool schemas and skills do not grant access beyond server-side account
authorization, ownership checks, plan gates, and validation.

## Side effects

Installation and authentication authorize connectivity only. The plugin keeps
customer-data access, configuration, private tests, billed generation,
activation, external communication, publication, replacement, and deletion as
separate user decisions. Writes are not automatically retried after an
ambiguous transport result.

The Product MCP is not bundled because its per-catalog URL is itself a
credential. Add it only through the selected catalog's human-controlled
connection flow.
