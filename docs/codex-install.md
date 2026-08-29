# Install MyChatBot in Codex from source

The public repository is a complete Codex marketplace. A third-party directory
listing is not required.

```bash
codex plugin marketplace add mychatbot-app/mychatbot-agent-plugin --ref main
codex plugin add mychatbot@mychatbot-app
```

Authenticate when Codex prompts, or run:

```bash
codex mcp login mychatbot
```

The browser flow lets the user create or reconnect a MyChatBot account with
email and a one-time code. No account key needs to be copied from the app.

Start a new Codex thread after installation or authentication, then ask for a
specific business outcome. For example:

> Audit my MyChatBot account and prioritize improvements. Do not change
> anything until you show me the plan and I approve a bounded step.
