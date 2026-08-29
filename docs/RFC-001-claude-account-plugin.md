# RFC 001: source-installable MyChatBot agent plugin

Status: public source release

Owners: MyChatBot product, platform, and developer experience

Initial hosts: Claude Code and Codex

## Decision

Publish a source-installable plugin that presents one API-owned MCP endpoint and
guides agents through real MyChatBot implementation work. The endpoint composes
the existing Sales, Agents, content, and Docs operations in-process. It does not
proxy tool calls through the browser Claude connector or expose a reduced
connector catalog.

The plugin solves both access and tool-use problems. A browser flow lets a user
create or reconnect a MyChatBot account without copying credentials. Workflow
skills then teach the host how to choose the owning platform, inspect current
state, sequence dependencies, use the right operation, test privately, and keep
configuration separate from live effects.

## Architecture

```text
Claude Code or Codex
   |-- OAuth discovery and browser approval
   |      `-- connector.mychatbot.app (authorization service only)
   `-- authenticated MCP calls
          `-- api.mychatbot.app/api/mcp/plugin
                 |-- Sales Platform implementations
                 |-- Agents Platform implementations
                 |-- content implementations
                 `-- public Docs implementations
```

The plugin endpoint is a thin composition layer in the API process. Existing
tool schemas, handlers, tenant resolution, ownership checks, plan gates, and
validation remain authoritative. The authorization service is reused only for
email verification, account creation/reconnection, consent, and token issuance.
No plugin tool call is routed through its connector MCP.

## Authentication and signup

The MCP protected-resource metadata points to the existing MyChatBot
authorization service. Claude Code or Codex starts OAuth with PKCE, opens the
browser, and receives a bearer credential after approval. In that browser flow,
email plus a one-time code reconnects the matching account or creates one when
none exists.

Plugin instructions must never ask the user to paste an account key, token,
one-time code, password, or custom Authorization header into the conversation.
Third-party connector credentials remain human-only steps in their own consent
or secure configuration interfaces.

## Catalog boundary

The bundled endpoint exposes:

- 117 Sales Platform operations;
- 35 Agents Platform operations;
- 17 content operations;
- 3 public Docs operations.

The optional Product MCP has ten read-only search and catalog-inspection tools
for one selected integration. Its URL contains account and integration
identifiers and functions as a credential, so it remains an on-demand,
separately connected server. Normal product work uses Sales catalog/feed
configuration and Agents Business Knowledge attachments.

Runtime `tools/list` schemas and fresh account state are authoritative. The
pinned contract exists to test complete coverage, route workflows, and classify
risk; it does not replace server-side schemas or authorization.

## Workflow model

The plugin provides focused skills for:

- account audits and implementation planning;
- Sales assistant setup;
- Agents systems and routines;
- catalogs, feeds, FAQs, websites, and Business Knowledge;
- channels, integrations, connectors, and custom MCPs;
- CRM and Sales operations;
- outreach and follow-ups;
- routines and automations;
- private testing and evals;
- content generation, publishing, analytics, and ads.

Each skill names the direct operations and required ordering. The common skill
explains platform ownership, OAuth, approval boundaries, fresh reads, ID
resolution, verification, partial-state handling, and ambiguous-write behavior.

## Safety invariants

- Tenant identity comes only from the authenticated connection.
- Runtime schemas and fresh account state are authoritative.
- Reads precede writes; identifiers are resolved from fresh results and never
  guessed.
- A general audit does not read customer records or messages.
- Configuration, customer-data changes, private tests, spending, activation,
  external communication, publication, replacement, and deletion are separate
  approval stages.
- Full-replacement tools require a current read and an explicit complete value.
- Writes are never automatically retried after an ambiguous result.
- Existing Sales resources are reused as Agents Business Knowledge instead of
  duplicated.
- API keys, OAuth tokens, and authenticated custom MCP headers are entered only
  in their human authorization interfaces.

These are plugin workflow rules. Server-side isolation and validation remain the
hard enforcement boundary.

## Verification

- Static validation checks both host packages, manifests, one OAuth endpoint,
  skills, references, version metadata, and all 172 bundled classifications.
- Contract tests check counts, uniqueness, ownership, and risk boundaries.
- Offline workflow evals check realistic integrator prompts, required reads,
  approval boundaries, and forbidden early actions.
- Claude and Codex package validators check host-specific schemas.
- Local packaging and unit tests use no network and no live account.
- Live account checks require separate authorization for the exact account and
  exact effects.

## Release path

1. Validate Claude Code installation directly from the public repository.
2. Validate OAuth discovery, browser signup/reconnect, and one-server login.
3. Validate the Codex package and source marketplace metadata.
4. Publish versioned source instructions, changelog, and release checklist.
5. Ship the API endpoint and public plugin repository for every account.
6. Add compact host instruction pages and intent-based prompts to the website.
7. Treat third-party directory listings as optional discovery channels; source
   installation remains fully supported.

Every repository ships through its own feature branch and pull request. Hosted
service changes, database changes, releases, and live-account tests retain their
separate authorization requirements.
