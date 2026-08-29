# MyChatBot platform model

## Sales Platform

Use for customer-facing sales and support systems: assistants, live
channels, FAQs, websites, product catalogs, client context, orders, test chats,
follow-ups, and customer conversations.

Sales knowledge sources are live resources used by Sales assistants:

- A website source is queried as live knowledge.
- An FAQ knowledge base holds maintained question/answer entries.
- A manual product catalog holds products maintained through MyChatBot.
- A feed catalog imports an external XML, JSON, YML, or shopping feed and may
  require asynchronous processing before it is searchable.

## Agents Platform

Use for operator and back-office systems: account-scoped agents, enabled
capabilities, connectors, skills, Business Knowledge, routines, schedules, and
triggers. Conversation history is thread-scoped; connector authorization,
knowledge sources, memories, and skill libraries are account-scoped; enabled
capabilities are agent-scoped.

Business Knowledge may expose existing Sales resources, including catalogs, to
Agents Platform agents without duplicating their content. Product search for an
agent is provided through Business Knowledge.

## UGC

Use for account-owned media generation, social posting or scheduling, social
analytics, and ad reporting. Generation and publication are separate stages:
generated media is not automatically approved for a live account.

## Catalog-scoped Product MCP

The Product MCP is a direct semantic-search capability for one selected catalog.
Its URL is a credential and is intentionally not bundled by the account-wide
plugin. Configure catalogs through Sales, attach them to Agents through Business
Knowledge, and verify customer behavior through Sales test chats or evals. Use a
catalog's explicit **Connect AI tools** flow only when direct semantic catalog
queries are the task.

## Selection rule

Choose based on who performs the work:

- A customer-facing assistant answering or selling in a channel belongs to the
  Sales Platform.
- An internal or delegated agent executing a workflow for the account belongs
  to the Agents Platform.
- A catalog or FAQ can be owned by Sales and attached to Agents as Business
  Knowledge; do not recreate it merely to cross the platform boundary.
- Media generation, social publication, analytics, and ads belong to UGC.
