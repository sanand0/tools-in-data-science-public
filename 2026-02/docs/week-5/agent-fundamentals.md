# Agent Fundamentals

Agents extend LLMs from simple text generators to autonomous systems capable of reasoning, using tools, and acting on the world. 

## Core Architectures

### 1. ReAct (Reason + Act)
The ReAct framework interleaves reasoning traces with actions. 
- **Thought:** The agent thinks about what to do next.
- **Action:** The agent decides to use a tool.
- **Observation:** The tool returns a result.
(This cycle repeats until completion).

### 2. Plan-and-Execute
Instead of deciding step-by-step, the agent creates a full plan upfront, executes it sequentially, and adjusts only if a step fails. Great for long-horizon tasks.

### 3. Reflexion & LATS
**Reflexion** adds a self-reflection step where the agent critiques its own past actions. 
**Language Agent Tree Search (LATS)** combines MCTS (Monte Carlo Tree Search) with LLMs to explore multiple reasoning paths before acting.

## Implementation Example
```python
# Simple ReAct Loop Concept
def react_agent(prompt):
    while True:
        thought, action = llm.think_and_act(prompt)
        if action == "DONE":
            break
        observation = execute_tool(action)
        prompt += f"\nObservation: {observation}"
```