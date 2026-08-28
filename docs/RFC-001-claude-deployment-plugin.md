# RFC 001: Claude Code deployment plugin

Status: implemented foundation for private integrator pilot

Owners: MyChatBot product, platform, connector, and developer experience

Initial host: Claude Code

## Decision

Create a Claude Code marketplace plugin that connects to the existing
`connector.mychatbot.app/mcp` OAuth service and teaches Claude audited MyChatBot
deployment workflows. Evolve `claude-connector` into the single owner-facing
gateway; do not create a second authentication or proxy service.

The browser connector remains the beginner, demo-first experience. The plugin
serves integrators and advanced owners who need to inspect, configure, test,
operate, and hand off a production deployment.

## User journey

The landing page presents one stable installation prefix and intent controls
that change only the final task sentence. Examples:

- Audit my deployment.
- Deploy a Sales assistant.
- Improve my business knowledge.
- Test and tune my assistant.
- Build an Agents Platform system.

The copied instruction sends Claude to `/claude`. That page is human-readable
in a browser and an executable plain-text protocol for an agent. Installation
finishes only after marketplace install, OAuth, connection verification, and a
new-session handoff carrying the selected intent.

The first deployment action is read-only. The plugin reports current state and
a staged plan; it never interprets install authorization as authorization to
modify the account.

## Architecture

```text
mychatbot.app/claude
        |
        v
Claude marketplace plugin ---- workflow skills
        |
        v OAuth 2.1 + PKCE
connector.mychatbot.app/mcp ---- curated, annotated gateway
        |
        +---- Sales Management MCP
        +---- Agents MCP
        +---- UGC MCP (later capability pack)
        +---- Docs MCP
        `---- Product/catalog lookup (selected integration only)
```

The gateway keeps the 48 curated Sales tools named. The wider Agents surface is
compressed into schema discovery plus read, configuration, and destructive
routers. Those routers accept only one of 34 statically classified operation
names; discovery filters the authoritative upstream schemas through the same
allowlist, so an upstream addition never appears automatically.

## Invariants

- Tenant identity comes only from the authenticated credential.
- Runtime schemas and fresh account state are authoritative.
- Skills may route and sequence tools but may not expand authorization.
- Reads precede writes; IDs are never guessed.
- Configuration, activation, billed work, customer communication, and
  destructive work are separate approval stages.
- High-risk preview/execute boundaries must be enforced by the server where
  possible, not only stated in prompt text.
- Customer data is excluded from general audits and summaries are de-identified.
- Writes are never automatically retried after an ambiguous result.
- Existing Sales resources are reused as Agents Business Knowledge rather than
  duplicated.

## Authorization

The existing connector implements OAuth-as-signup, dynamic client registration,
PKCE, and bearer validation. Its current access token is an account-wide MCP
token. Before public release, token records need machine-enforced capabilities
or an equivalent connector-bound credential so a stolen token cannot bypass the
gateway and call every account MCP surface.

Proposed capability vocabulary:

- `account.read`
- `sales.read`, `sales.configure`, `sales.activate`
- `agents.read`, `agents.configure`, `agents.activate`
- `customer_data.read`
- `outreach.send`
- `ugc.read`, `ugc.generate`, `ugc.publish`
- `destructive.execute`

Consent should start narrow. Higher-risk capabilities can be authorized later
without requiring the user to share a secret with Claude.

## Tool safety contract

Every gateway tool supplies annotation title plus explicit read-only,
destructive, idempotent, and open-world hints. Risk levels are:

1. Read-only configuration.
2. Customer-data read.
3. Reversible configuration.
4. Private test or billed simulation.
5. Activation or external communication.
6. Destructive/reset/full replacement.

External communication and destructive operations need an exact preview and a
separate execution step or a short-lived confirmation capability tied to the
previewed payload.

## Capability rollout

### Pilot contract

Use the connector's curated Sales surface plus the exact-header deployment
profile: one read-only account context, Agents schema discovery, and the three
risk-class gateways. Preserve the Agents MCP sequence: authoring context,
inventory, validate, show canonical YAML, approval, save, readiness, optional
approved dry run, and disabled-first schedules/triggers. The plugin pins all 48
Sales tools, five profile tools, and 34 routed Agents operations in
`contracts/connector-tools.json`; validation fails when a skill references an
unknown operation.

### Public v1

Add connector-bound token capabilities, higher-risk consent/confirmation
contracts, pilot evidence, and a public-repository/security review. The compact
gateway shape can remain unchanged.

### Later packs

Add UGC generation/posting only after spend and publication previews are
server-enforced. Add direct product search for selected catalogs without
exposing capability URLs. Operational customer-data tools require a distinct
consent capability.

## Repository changes

- `mychatbot-agent-plugin`: manifests, install protocol, skills, pinned contract,
  static validation, and behavioral fixtures.
- `claude-connector`: gateway surface, OAuth capabilities, annotations,
  deployment context, upstream proxies, and mocked E2E coverage.
- `api.mychatbot.app`: scoped token enforcement and missing upstream annotations
  or confirmation contracts. Database migration is a separately authorized
  production-impacting step.
- `mychatbot.app`: `/claude` agent/human page and intent-based copy control.
- `docs.mychatbot.app`: current five-surface documentation and plugin/operator
  guides.
- `app.mychatbot.app`: replace long copy-paste orchestration prompts with plugin
  entry points where appropriate.
- `agentos.mychatbot.app` and `product.mychatbot.app`: change only where contract
  tests demonstrate a real integration gap; avoid speculative churn.

## Test strategy

- Plugin static validation: manifest, marketplace, skill frontmatter, unique
  capability contract, and known tool references.
- Connector tests: zero-network OAuth E2E, exact tool allowlist, annotations,
  read retry/write no-retry, tenant propagation, and upstream failure surfaces.
- API tests: scoped token allow/deny matrix, legacy compatibility, tenant
  isolation, migration behavior, and high-risk confirmation replay/expiry.
- Landing tests: content negotiation, intent-to-prompt mapping, clipboard,
  keyboard access, responsive layout, and reduced motion.
- Browser E2E: install page and local landing; later Claude login/install against
  an explicitly authorized account.
- Account verification: create dedicated disposable resources with a unique
  prefix, inspect them, test privately, and remove only those exact resources
  after separate deletion approval.

## Rollout gates

1. Private repository and mocked tests green.
2. Internal install against local/mock gateway.
3. OAuth/scoping review and security tests.
4. Hidden or unlinked landing route in production.
5. Explicitly authorized test-account read audit.
6. Explicitly authorized bounded test-account writes.
7. Integrator allowlist beta with monitoring and rollback.
8. Public repository and visible landing CTA only after a clean review window.

Each repository ships through a feature branch and PR. Every push restarts the
required 15-minute CI and automated-review window. Deployment verification is
read-only unless a new exact impact is approved.
