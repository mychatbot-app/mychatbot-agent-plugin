---
name: test-and-evaluate
description: >-
  Privately test and tune a MyChatBot Sales assistant with rehearsal chats or
  repeatable eval scenarios. Use for regression cases, candidate instructions,
  tool-call inspection, stability scoring, or readiness checks before launch.
---

# Test and evaluate a Sales assistant

Load `mychatbot-plugin-basics` first. Resolve the target with
`list_assistants` and `get_assistant`. For every regression or repeatable-eval
request, also call `eval_scenario_list` before proposing the matrix. Agree on a compact matrix covering the
assistant's job, business facts, tool use, unsupported requests, lead capture,
handoff, and safety boundaries.
Call the proposed matrix a regression eval and explain whether it will use a
private test chat, saved eval scenarios, or both.

## Interactive rehearsal

`test_chat_start` clears the assistant's previous private test transcript, so
state that effect and obtain approval before calling it. Send cases one at a
time with `test_chat_send`, preserving context only when the scenario requires
it. Inspect `test_chat_get_history` when tool calls matter.
These calls do not contact customers.

Evaluate factual grounding, policy, workflow, and tool results—not fluency alone.
Record each failure with input, observed behavior, expected behavior, evidence,
and likely configuration cause. Full instruction or skill replacements require a
complete proposed value and separate replacement approval; repeat failing cases
from a clean session.

Use `test_chat_end` only when the owner wants the stored test transcript cleared.

## Repeatable evals

Use `eval_scenario_list` to find existing scenarios. `eval_scenario_get` and
`eval_run_get` may contain copied conversation turns, so call them only when
needed and treat results as customer data.

`eval_scenario_save` upserts by name and can replace an existing scenario. Show
the exact turns, references, source, and existing same-name scenario before
calling it. Prefer inline synthetic turns unless the
owner explicitly asks to derive a scenario from real customer data.

Start `eval_run_start` only after private-test approval. Candidate
`instruction_override` text tests a change without altering the live assistant.
Poll the returned run with `eval_run_get`; do not start duplicates. Cancel only
after exact cancellation approval.

Report the matrix, passes/failures, tool-call evidence, stability/reference
metrics, changes tested versus saved, and which live channel paths remain
unverified. One successful path is not readiness evidence.
