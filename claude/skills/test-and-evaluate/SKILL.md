---
name: test-and-evaluate
description: >-
  Privately test and tune a MyChatBot Sales assistant before customer launch.
  Use for rehearsal conversations, instruction changes, regression cases, or
  readiness checks. Never use a live customer channel as the default test.
---

# Test and tune a Sales assistant

Load `mychatbot-plugin-basics-claude` first. Resolve the target with
`list_assistants` and agree on a compact test matrix covering the assistant's
actual job, important boundaries, handoff behavior, and unsupported questions.

Call `test_chat_start` once for the target assistant. Starting replaces any
previous private test transcript, so state that effect first. Send cases one at
a time with `test_chat_send`, preserving context only when the scenario depends
on it. Test chats are private and do not contact customers.

Evaluate answers against the agreed facts and behaviors; do not grade only for
fluency. Record failures with the input, observed response, expected behavior,
and likely cause.

When instructions need a full replacement, call
`propose_instructions_update`, show the complete diff card, and wait. Only after
approval call `update_assistant_instructions`, then repeat the failing cases in
a fresh test session.

Call `test_chat_end` when the owner wants the private transcript cleared. Do not
claim production readiness from one successful path. Report tested cases,
failures, changes applied, remaining risks, and that live channel delivery was
not exercised.

The current connector does not expose the Sales eval-scenario MCP tools. If the
owner asks for batch eval runs, state that limitation instead of simulating a
batch result.
