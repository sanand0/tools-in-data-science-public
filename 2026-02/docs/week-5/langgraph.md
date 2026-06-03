# LangGraph

LangGraph models agent workflows as state machines (graphs).

## Why Graphs?
Standard LLM chains are linear. Agents require loops (e.g., trying a tool, failing, thinking, trying again). Graphs natively support cyclic execution.

## Core Concepts
- **State:** A typed object passed between nodes.
- **Nodes:** Python functions that read the state, do work, and return state updates.
- **Edges:** Conditional routing logic (e.g., "If tool failed, go to ErrorNode").

## Human-in-the-Loop & Checkpointing
LangGraph can persist state to a database. You can pause execution, wait for a human to approve an action, and resume exactly where it left off.

---

