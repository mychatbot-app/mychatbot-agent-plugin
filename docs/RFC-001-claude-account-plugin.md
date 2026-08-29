# RFC 001: Claude Code direct-MCP plugin

Status: direct-MCP foundation for public release

Owners: MyChatBot product, platform, and developer experience

Initial host: Claude Code

## Decision

Create a Claude Code marketplace plugin that bundles the existing direct Sales,
Agents, UGC, and Docs MCP servers. Do not route their operations through the
browser Claude connector.

The plugin solves a tool-use problem, not a transport problem. MyChatBot already
has the necessary account operations; integrators need durable process knowledge
for choosing the owning platform, reading current state, sequencing dependent
changes, using the right tool among a large inventory, testing privately, and
separating configuration from live effects.

## Authentication

One existing `mcp_` account access key resolves the tenant server-side and works
across Sales, Agents, and UGC. The plugin declares one required, sensitive
`userConfig` value and substitutes it into each server's Authorization header.
Claude Code masks the input and stores it in secure plugin configuration.

This is the public v1 path because it is already implemented and supports one
plugin install without backend, database, or consent-page changes. Browser OAuth
for the direct MCP endpoints remains a worthwhile usability follow-up, but it is
not a marketplace prerequisite.

The browser connector remains available for the browser Claude experience and
beginner onboarding. It is not a dependency of this plugin.

## Bundled servers

```text
Claude Code plugin
   |-- Sales MCP   https://api.mychatbot.app/api/mcp/sales-management
   |-- Agents MCP  https://api.mychatbot.app/api/mcp/agents
   |-- UGC MCP     https://api.mychatbot.app/api/mcp/ugc
   `-- Docs MCP    https://api.mychatbot.app/api/mcp/docs
```

The first three receive the same account key. Docs is public and read-only.
Omitting `domain` on Sales and UGC intentionally exposes every domain on those
surfaces; Claude Code's MCP tool search can defer large tool catalogs, while
plugin skills provide semantic routing.

## Catalog Product MCP boundary

The Product MCP exposes ten read-only search and catalog-inspection tools for
one selected integration. Its URL contains the account and integration IDs and
functions as a credential. It therefore cannot be a universal bundled server.

The knowledge workflow configures catalogs through Sales, attaches existing
catalogs to Agents as Business Knowledge, and uses Sales test chats or evals for
normal verification. When direct catalog search is specifically required, the
user obtains that catalog's server URL through its **Connect AI tools** flow and
adds it as a separate MCP server.

## Tool inventory

The pinned contract contains:

- 115 Sales operations;
- 34 Agents operations;
- 17 UGC operations;
- 3 public Docs operations;
- 10 optional Product operations.

Runtime `tools/list` schemas and fresh account state are authoritative. The
contract exists to test complete coverage, route workflows, and classify risk;
it does not replace server-side schemas or authorization.

## Workflow model

The plugin provides focused skills for:

- account audit and implementation planning;
- Sales assistant setup;
- Agents systems and routines;
- catalogs, feeds, FAQs, websites, and Business Knowledge;
- channels, integrations, connectors, and custom MCPs;
- CRM and Sales operations;
- outreach and follow-ups;
- routines and automations;
- private testing and evals;
- UGC generation, publishing, analytics, and ads.

Each skill names the direct tools to use and the required ordering. The common
skill explains platform ownership, authentication, approval boundaries, fresh
reads, ID resolution, verification, partial-state handling, and ambiguous-write
behavior.

## Safety invariants

- Tenant identity comes only from the account credential.
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

These are plugin workflow rules. Server-side tenant isolation, ownership checks,
plan gates, input validation, and routine preview capabilities remain the hard
enforcement boundary.

## Verification

- Static validation checks the marketplace and plugin manifests, one sensitive
  required key, exact direct endpoints, skills, references, and complete tool
  classifications.
- Contract tests check all tool counts, uniqueness, server ownership, and risk
  boundaries.
- Claude's current strict plugin validator checks the package schema.
- Local packaging tests use no network and no live account.
- Live read/write checks require separate authorization for the exact test
  account and exact effects.

## Release path

1. Finish and validate the source marketplace package.
2. Document secure key creation and four-server verification.
3. Test install and read-only inventory with an explicitly authorized account.
4. Test bounded synthetic writes only after exact approval.
5. Publish the repository and source marketplace for every account.
6. Submit through Anthropic's official plugin form.
7. Update app and landing onboarding after the stable install contract is known.

Every repository ships through its own feature branch and pull request. Hosted
service changes, database changes, releases, and live-account tests retain their
separate authorization requirements.
