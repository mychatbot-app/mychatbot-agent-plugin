---
name: deploy-sales-assistant
description: >-
  Design, create, upgrade, or launch a customer-facing MyChatBot Sales
  assistant. Use for production chatbot, sales-agent, support-agent, website
  widget, or messaging-channel deployments. Includes grounded proposal,
  approval, knowledge, private testing, verification, and launch handoff.
---

# Deploy a Sales assistant

Load `mychatbot-plugin-basics-claude` first. Treat “build” and “launch” as
separate approvals.

## Establish the target

Call `get_demo_status`, `list_assistants`, `list_integrations`, and
`list_channels`. Determine whether to tune an existing assistant, use the demo,
or create a new one. Do not create a similarly named assistant because a list
result was inconvenient to inspect.

Learn only business facts supported by the owner, their site, or their current
knowledge. Ask only for decisions that materially change the deployment.

## Propose before creating

Draft the assistant name, greeting, role, complete instructions, grounded
starter knowledge, and ordered build plan. Call `propose_assistant_setup` to
show the proposal. Stop and wait for approval or requested revisions.

After approval, call `build_assistant` once with the approved content. This
creates the assistant and starter knowledge; it does not by itself prove that a
customer channel is live. Re-read assistants and integrations and report any
partial failure.

For an existing assistant, call `propose_instructions_update` with the complete
replacement instructions. Apply them with `update_assistant_instructions` only
after the owner approves that exact replacement.

## Add only required capabilities

Use the `business-knowledge` skill for websites, FAQs, or catalogs. Configure
order taking only when the business actually wants the assistant to take
orders. Use `enable_order_taking` after separate approval; never infer it from
the existence of a product catalog.

## Test, then launch

Use the `test-and-evaluate` skill before a production channel launch. When the
assistant passes the agreed cases, propose one channel at a time:

- `create_website_widget` returns an embed snippet and hosted test page.
- Setup-link tools hand WhatsApp, Instagram, or Telegram authorization to the
  dashboard without exposing credentials in chat.
- `connect_telegram` accepts a bot credential directly; prefer the dashboard
  link unless the owner explicitly chooses direct credential submission.

Obtain a separate launch approval, verify with `list_channels`, and finish with
the assistant ID, knowledge sources, tests performed, channel status, links,
and remaining human steps.
