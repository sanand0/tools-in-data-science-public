# Agent Memory Systems

Without memory, agents are goldfish. Memory gives them continuity.

## Short-Term Memory
The immediate context window. It contains the current conversation history and recent tool outputs.

## Long-Term Memory
Persisted storage across sessions.
- **Episodic Memory:** Remembering past events ("Yesterday, the user asked me to deploy the app and it failed").
- **Semantic Memory:** Remembering facts about the user ("The user prefers Python over JavaScript").

## Implementation
Long-term memory is typically implemented via Vector Databases (retrieving relevant past memories via embeddings) combined with Knowledge Graphs for explicit relationships.

---

