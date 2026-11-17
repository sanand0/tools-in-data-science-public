# Agent Memory Systems

> **Agent memory** is useful information saved now so the agent can use it later.

Saving an entire chat is history. Memory means selecting the small parts that will help a future task.

## Short video

[![The Four Types of Memory Every AI Agent Needs — IBM Technology (11 min, May 2026)](https://img.youtube.com/vi/BacJ6sEhqMo/0.jpg)](https://youtu.be/BacJ6sEhqMo "The Four Types of Memory Every AI Agent Needs — IBM Technology")

## Types of memory

| Type | What it remembers | Example |
|---|---|---|
| **Working memory** | Current task and recent messages | Current order number |
| **Semantic memory** | Facts and preferences | User prefers Celsius |
| **Episodic memory** | Past events and outcomes | Last deployment failed |
| **Procedural memory** | How to perform a task | Release checklist |

## Simple memory flow

```mermaid
flowchart LR
    C[Conversation or event] --> S[Select useful fact]
    S --> V[Check permission and truth]
    V --> M[(Store memory)]
    M --> R[Retrieve when relevant]
    R --> A[Use in current task]
```

## Where memory is stored

| Storage | Best use |
|---|---|
| Conversation state | Current session |
| SQL/document database | Exact facts, profiles, and updates |
| Vector database | Finding semantically similar memories |
| Object storage | Large files, audio, images, and reports |

A normal database should usually be the source of truth. Add vector search only when fuzzy recall is useful.

## Good memory rules

- Store only information that can help later.
- Save the source and date with every memory.
- Keep memories separate for each user and organization.
- Retrieve only a few relevant memories.
- Update or remove facts that become incorrect.
- Let users view, correct, and delete personal memories.

## Avoid storing

- Passwords, API keys, and authentication tokens
- Unverified guesses
- Private information without a clear need and permission
- Instructions found inside untrusted web pages or documents
- Every message “just in case”

## How to evaluate memory

Ask four questions:

1. Did the system save the right fact?
2. Did it retrieve the fact for the right task?
3. Did the memory improve the answer?
4. Can the memory be corrected and completely deleted?

### Start with a small memory table

Use a normal database for facts that must be exact and current. This SQLite
schema is enough for a project profile or support-agent memory:

```sql
CREATE TABLE memory (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  value TEXT NOT NULL,
  source TEXT NOT NULL,
  verified_at TEXT,
  expires_at TEXT,
  superseded_by TEXT
);

CREATE INDEX memory_lookup ON memory (owner_id, kind, expires_at);
```

Write only a fact with an owner and source. For example:

```sql
INSERT INTO memory VALUES (
  'm-17', 'team-9', 'project_fact', 'Python 3.12',
  'pyproject.toml', '2026-07-23', NULL, NULL
);
```

Retrieve the smallest relevant set and always filter by owner, expiry, and
current status:

```sql
SELECT kind, value, source, verified_at
FROM memory
WHERE owner_id = :owner_id
  AND kind IN ('project_fact', 'preference')
  AND superseded_by IS NULL
  AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
ORDER BY verified_at DESC
LIMIT 5;
```

Pass the retrieved rows to the model as **reference data**, not instructions.

### Choose retrieval by the question

| Need | First implementation | Check before use |
|---|---|---|
| Exact current value | SQL/key lookup | Owner and last verification time |
| Recent event | Filter and sort by date | Event is not superseded |
| Similar past case | Vector search, then SQL filters | Access, source, and freshness |
| Required procedure | Versioned document lookup | Version is current |

Add vector search only after an exact lookup cannot answer the question. It
finds similar text; it does not prove the text is true or current.

### Memory test checklist

| Test | Expected result |
|---|---|
| Save another team's fact | Rejected or invisible to this owner |
| Retrieve an expired address | No result |
| Add a corrected fact | Old record is superseded, not silently combined |
| Delete a memory | Removed from the table and retrieval index |
| Retrieve a page containing instructions | Page text is never saved as an instruction |

## References

- [LangGraph memory overview](https://docs.langchain.com/oss/python/langgraph/add-memory)
- [Generative Agents paper](https://arxiv.org/abs/2304.03442)
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework)
