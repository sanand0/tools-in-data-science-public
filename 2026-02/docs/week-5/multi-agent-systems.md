# Multi-Agent Systems

When tasks become too complex for one prompt, we split them across multiple agents.

## Supervisor Pattern
A central LLM (Supervisor) analyzes the task and delegates sub-tasks to specialized worker agents.
```text
User -> Supervisor -> Coder Agent
                   -> Researcher Agent
                   -> Reviewer Agent
```

## Swarm Architecture
Agents act as peers. Any agent can hand off the conversation to any other agent. (e.g., OpenAI's Swarm framework).

## A2A (Agent-to-Agent) Protocols
Standardized communication protocols where agents negotiate, pass structured data, and share context securely.

---

