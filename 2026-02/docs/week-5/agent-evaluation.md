# Agent Evaluation

Evaluating agents is harder than evaluating text generation because agents have open-ended trajectories.

## Benchmarks
- **AgentBench:** Evaluates agents on OS interaction, databases, and web navigation.
- **GAIA:** A benchmark for General AI Assistants requiring reasoning, tool use, and web browsing.

## Custom Failure Analysis
When building agents, you must track:
1. **Tool Error Rate:** How often does the agent supply malformed JSON?
2. **Trajectory Length:** How many steps did it take? (Shorter is usually better).
3. **Looping:** Did the agent get stuck repeating the same failed action?

Use LangSmith or similar tracing tools to visualize agent trajectories.

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

