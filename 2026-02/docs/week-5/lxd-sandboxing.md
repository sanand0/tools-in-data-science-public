# LXD Sandboxing

Giving an AI agent the ability to execute code is extremely dangerous without isolation.

## What is LXD?
LXD is a next-generation system container manager. It provides full OS environments (unlike Docker's application containers) but is lighter than full VMs.

## Why Sandbox?
- Prevent agents from reading `.env` files or SSH keys.
- Prevent infinite loops from crashing the host machine.
- Provide a reproducible, disposable environment that resets after the task.

## Code Execution Flow
1. Agent writes a Python script.
2. System pushes the script into the LXD container.
3. Script executes; stdout/stderr is captured.
4. Output is returned to the agent.