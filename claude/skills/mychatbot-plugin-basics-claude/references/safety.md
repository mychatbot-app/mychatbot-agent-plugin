# MyChatBot action safety

Use the highest applicable tier for a planned stage.

## Read-only account state

Read only the state needed for the request. Customer chats, messages, clients,
and audience previews contain customer data and are not part of a default
account audit. Summarize without reproducing identifying content.

## Reversible configuration

Creating an assistant, knowledge source, catalog, or disabled configuration
still changes live account state. Show the bounded stage and obtain approval.
Prefer find-or-update over near-duplicate creation.

Changing a lead, note, task, attachment, or collected context uses the separate
customer-data write gateway. Show the exact record and fields; never broaden a
single-record request into a batch update.

## Private tests and generation

Test chats do not contact customers, but starting or ending one changes the
stored private test session. Confirm the target assistant and do not present a
model reply as proof of production channel behavior.

UGC generation can spend balance even when nothing is published. Preview the
prompt, model, variants, and known cost or limit before generating. Poll the
returned task instead of starting duplicates.

## Activation, spending, and external actions

Connecting a channel, enabling order-taking, running a billed job, scheduling a
routine, generating media, sending a message, starting a campaign, or publishing
content needs separate approval after a concrete preview. State audience,
channel, timing, content, and known cost or limit. Do not combine configuration
approval with launch approval.

## Destructive and replacement actions

Before deletion, disconnection, reset, or full replacement:

1. Read the exact target and dependent-resource warnings.
2. Show the target name and ID plus the irreversible or cascading effect.
3. Obtain an explicit confirmation for that exact action.
4. Execute once; never automatically retry an ambiguous failure.
5. Re-read state and report whether recovery is possible.
