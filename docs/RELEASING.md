# Release the MyChatBot agent plugin

The public repository is the release channel for Claude Code and Codex. Vendor
directory review is optional and does not hold back source installation.

## Before a pull request

1. Choose one semantic version and update `package.json`, the Claude manifest,
   the Codex manifest, and `CHANGELOG.md`.
2. Keep the Claude marketplace entry unversioned so the package manifest remains
   authoritative.
3. Run `npm test`.
4. Run Claude's strict plugin validator and the Codex plugin validator.
5. Package both host directories and inspect the archives for secrets, generated
   logs, missing references, or files outside their package roots.
6. Do not use a live MyChatBot account during these checks.

## Pull request and source release

Create a feature branch and pull request. Merge only after required checks pass,
all review comments are resolved, and the workspace review window has elapsed.
Source users can install from `main` as soon as the merge is available.

After merge, create an annotated `vX.Y.Z` tag from the merge commit and publish a
GitHub release using that version's changelog entry. Tags provide a stable pin;
the documented source command intentionally follows `main` for the latest public
release.

## Verify without an account

```bash
claude plugin marketplace add ./
claude plugin validate ./claude --strict
codex plugin marketplace add ./
codex plugin list
```

Verify that each host discovers one `mychatbot` MCP server at
`https://api.mychatbot.app/api/mcp/plugin` and offers browser authorization. A
real signup, account read, or write is a separate production check and requires
explicit authorization for the exact account and effects.

## Update an installed source marketplace

```bash
claude plugin marketplace update mychatbot-app
codex plugin marketplace upgrade mychatbot-app
```

Reinstall or update the plugin, complete browser authorization if requested, and
start a new conversation so the new skills and tool catalog are loaded.
