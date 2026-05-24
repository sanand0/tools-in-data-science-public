# Capstone — Autonomous Research Agent

## Objective
Build a multi-agent system using LangGraph that can research a complex topic, execute code to gather data, and write a comprehensive report.

## Architecture
- **Planner Agent:** Breaks the prompt into sub-tasks.
- **Researcher Agent:** Uses a web search tool to find information.
- **Coder Agent:** Writes and executes Python code in a sandbox to process data.
- **Summarizer Agent:** Compiles findings into a Markdown report.

## Requirements
1. Implement state management using LangGraph.
2. Include a "Human-in-the-Loop" checkpoint before the final report is generated.
3. Ensure the Coder agent is sandboxed securely.

## Deliverables
- Source code in a GitHub repository.
- A sample generated report on "The impact of quantum computing on RSA encryption".