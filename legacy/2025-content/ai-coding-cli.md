# AI Coding in the CLI

Command-line AI coding tools bring the power of large language models directly to your terminal, enabling scripted automation, pipeline integration, and efficient developer workflows. These tools excel at batch processing, git integration, and system-level automation that GUI tools can't match.

In this module, you'll learn:

- **Claude Code CLI**: Terminal-first coding agent for interactive development and review
- **Codex CLI (OpenAI)**: Local coding agent with sandbox, approvals, CI-friendly exec
- **GitHub Copilot CLI**: GitHub-native terminal agent with policy-aware approvals and MCP extensions
- **Gemini CLI**: Large-context, multimodal agent with non-interactive mode
- **Simon Willison's `llm`**: Shell-native AI with UNIX pipeline integration and extensive tooling

## Claude Code CLI

[Claude Code](https://claude.ai/code) is Anthropic’s terminal-first coding agent (npm: `@anthropic-ai/claude-code`). It runs locally in your project, understands your codebase, and assists with routine tasks, explanations, and git workflows.

### Basic usage

```bash
# Install and start. Run Claude Code from the project root so it has full context.
npm i -g @anthropic-ai/claude-code
claude

# One-shot code generation
claude -p "Find and fix security issues in script.py"

# Process files from stdin
git diff | claude -p "Write a conventional commit message for this diff"
```

### Key features

**Interactive, project-aware**: Launch in a repo to let Claude read, propose changes, and manage common dev tasks.

**Git workflows**: Ask Claude to explain diffs, propose commit messages, or draft PR descriptions.

**Agentic edits**: Approve or reject suggested edits; iterate quickly on changes and tests.

**Continue sessions (`--continue` and `--resume [sessionId]`)**: Continue the most recent conversation or a specific session by ID.

**Tool call visibility (`--debug`)**: Shows exactly what tools Claude is calling, helping you understand the AI's reasoning process and debug complex operations.

Always review proposed edits and commands before applying them—especially for untrusted input or system-level changes. Prefer running in a version‑controlled workspace and keep changes small and reviewable.

### Usage

Claude Code supports slash commands. Here are some popular ones:

- **/add-dir**: Add additional working directories
- **/agents**: Manage custom AI subagents for specialized tasks
- **/compact**: [instructions] Compact conversation with optional focus instructions
- **/config**: View/modify configuration
- **/cost**: Show token usage statistics (see cost tracking guide for subscription-specific details)
- **/init**: Initialize project with CLAUDE.md guide
- **/memory**: Edit CLAUDE.md memory files
- **/model**: Select or change the AI model
- **/permissions**: View or update permissions
- **/pr_comments**: View pull request comments
- **/review**: Request code review
- **/status**: View account and system statuses

References:

- [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)

[![Claude Code Beginner's Tutorial: Build a Movie App in 15 Minutes (2025)](https://i.ytimg.com/vi_webp/GepHGs_CZdk/sddefault.webp)](https://youtu.be/GepHGs_CZdk)

[![Claude Code best practices | Code w/ Claude](https://i.ytimg.com/vi_webp/gv0WHhKelSE/sddefault.webp)](https://youtu.be/gv0WHhKelSE)

## Codex CLI (OpenAI)

[OpenAI Codex CLI](https://github.com/openai/codex) is an open‑source coding agent that runs locally. It features a secure sandbox, explicit approval modes, image attachment support, and a non‑interactive “exec” mode for CI.

### Key features

**Sandbox + approvals**: Runs commands in an OS sandbox (Seatbelt on macOS, Landlock/seccomp on Linux) with configurable approvals.

**Images as input**: Attach screenshots and diagrams to prompts (`-i/--image`).

**Edit previous messages**: Use Esc–Esc in the TUI to backtrack and edit a prior user message, then re‑run from that point.

**Non‑interactive mode**: Use `codex exec "..."` for headless tasks in scripts and CI.

### Examples

```bash
# Image‑to‑code prompt
codex -i design.png "Implement this UI in React"

# Headless CI step (non‑interactive)
codex exec --full-auto "update CHANGELOG for next release"

# Enable high-reasoning effort. (-c updates config options)
codex -c model_reasoning_effort=high
```

### Slash commands (popular)

- **/approvals**: Switch approval mode (Read Only, Auto, Full Access). Tip: Read Only for skimming; Auto for repo edits; Full Access only in trusted environments.
- **/init**: Generate a tailored `CLAUDE.md` for the current repo. Tip: run once per project to prime behavior.
- **/status**: Inspect workspace roots, sandbox mode, and auth. Tip: check if network is enabled before web‑dependent tasks.
- **/model**: Switch models on the fly. Tip: pick higher‑reasoning models for complex refactors or test generation.
- **/compact**: Summarize conversation to prevent hitting the context limit.
- **/diff**: Show git diff (including untracted files).
- **/my-prompt**: Custom prompts from `~/.codex/prompts/my-prompt.md`. Tip: save repeatable reviews or commit‑message templates.

[![How to Install And Use OpenAI Codex CLI](https://i.ytimg.com/vi_webp/Zn8n2U8sTkw/sddefault.webp)](https://youtu.be/Zn8n2U8sTkw)

- [New OpenAI Release: Is Codex Better Than Claude Code?](https://youtu.be/VTXEgGIL010)
- [How to Use OpenAI Codex CLI in VS Code with GPT-5 Model](https://youtu.be/RaFxPRG98Lg)

## GitHub Copilot CLI

[GitHub Copilot CLI](https://github.com/features/copilot/cli) is GitHub’s terminal-native coding agent (npm: `@github/copilot`) that runs locally with GitHub-aware context, policy inheritance, and explicit approvals. GitHub opened the public preview on September 25, 2025 for Copilot Pro, Pro+, Business, and Enterprise subscribers.

### Basic usage

Requires Node.js 22+, npm 10+, and runs on macOS, Linux, and Windows via WSL. Launch it from a trusted repository so it can inspect local context before acting.

```bash
# Install or update the CLI
npm install -g @github/copilot

# Start an interactive session (asks to trust the folder on first run)
copilot

# Switch models for a run (e.g., GPT-5) via an environment variable
COPILOT_MODEL=gpt-5 copilot
```

### Key features

**GitHub context + MCP**: Reads repository files, issues, and pull requests, and can call GitHub’s built-in MCP server or your custom MCP servers for richer automation.

**Policy-aligned approvals**: Inherits organization policies, prompts before executing potentially destructive tools, and keeps every action reviewable.

**Terminal agent for build/debug/refactor**: Plans and runs multi-step coding tasks, including editing files and running commands, without leaving the shell.

**Custom instructions**: Honors `.github/copilot-instructions.md`, nested instruction files, and per-task `AGENTS.md` guides to steer behavior.

**Model flexibility**: Defaults to Claude Sonnet 4 but can target GPT-5 or other approved models by setting `COPILOT_MODEL` or using CLI config.

### Slash commands (popular)

- **/login**: Authenticate with GitHub when the session isn’t already linked.
- **/add-dir**: Trust and add additional directories for the running session.
- **/cwd**: Switch the working directory without restarting.
- **/mcp add**: Register extra MCP servers so Copilot can call domain-specific tools.

## Gemini CLI

[Gemini CLI](https://github.com/google-gemini/gemini-cli) is an open‑source, terminal‑first agent for Google’s Gemini models. It supports multimodal inputs, built‑in tools (file ops, shell, web fetch/search), MCP, and a non‑interactive mode for scripts.

### Core workflow

**Interactive or one‑shot**: Start `gemini` in a repo, or run `gemini -p "..."` for non‑interactive scans and sub‑agent calls. You can also pipe input: `echo "Explain this code" | gemini`.

**Large context**: Gemini 2.5 Pro supports very large context windows—use it to reason over big codebases and long documents.

**Built‑in tools**: Use web grounding, file operations, and shell commands directly from the CLI when approved.

### Examples

```bash
# Analyze many files via stdin
find . -name "*.py" -exec cat {} + | uvx files-to-prompt | gemini -p "Analyze this Python codebase for architectural issues"

# One‑shot prompt (non‑interactive)
gemini -p "Summarize key design decisions from README.md and docs/"

# One‑shot from JSON params (reads .prompt)
gemini -p "$(jq -r .prompt prompt.json)"
```

### Security and tool execution

**Approval mode**: Control auto‑exec. Use `--approval-mode default|auto_edit|yolo` (or `--yolo`) and consider `--allowed-tools` for trusted tools. After upgrades or config changes, verify these settings—avoid unintended YOLO.

**Confirm tool calls**: Review proposed shell/file/web actions before approving. Use restrictive profiles when working with untrusted code.

**Isolated processing**: Prefer containerized environments for risky analyses. Enable `--sandbox` or project Docker sandbox as needed.

### Slash commands (popular)

- **/help** (or `/?`): List commands and usage. Tip: use this to discover shortcuts quickly.
- **/chat save|resume|list|delete**: Conversation checkpoints. Tip: tag states before big refactors; resume later.
- **/directory add|show**: Manage additional workspace roots. Tip: add multiple packages in a monorepo.
- **/mcp [desc|schema]**: Inspect configured MCP servers and tools. Tip: use `desc` to see tool descriptions.
- **/memory add|show|clear|export**: Manage hierarchical `GEMINI.md` memory. Tip: keep global guidance minimal; prefer project‑local.
- **/init**: Generate a tailored `GEMINI.md` for the current repo. Tip: run once per project to prime behavior.
- **/clear** and **/copy**: Clear screen or copy last output. Tip: `Ctrl+L` also clears.

## Simon Willison's `llm`

[`llm`](https://llm.datasette.io/) is the ultimate shell-native AI tool, designed specifically for UNIX workflows and pipeline integration. It excels at connecting AI capabilities with traditional command-line tools and automation scripts.

### Core philosophy

**Shell-native design**: Built from the ground up to work seamlessly with pipes, redirects, and standard UNIX tools. Every feature is designed to integrate naturally with shell scripting.

**Pipeline integration**: Pipe any shell output directly to AI models for processing, analysis, or transformation without temporary files or complex setup.

**Extensive logging**: Every interaction is automatically logged to SQLite, providing full audit trails and the ability to analyze usage patterns over time.

### Essential commands

```bash
# Basic AI integration
llm "Write a single line bash script to backup my home directory"

# Git workflow integration
git diff | llm "Write a Conventional Commit message from this diff"

# Security analysis pipeline
uvx files-to-prompt codebase/ | llm "Find security issues and rank by severity"

# Audio processing
llm -m gemini-2.5-flash "Transcribe and clean up this audio" -a meeting.mp3

# Structured data extraction
llm "Extract contact information as JSON" -a business_card.jpg --schema "name,email,phone"
```

### Advanced features

**Templates**: Save and reuse complex prompts (optionally with system prompts, model, options, schema, and fragments) for consistent, reproducible pipelines.

```bash
# Save a template (bundles system + defaults)
llm --system 'Review for bugs, performance, security, readability' --save code-review

# Use the template on stdin
cat auth.py | llm -t code-review
```

**Tool calling (0.26+)**: Expose safe Python functions as tools that models can call across providers that support tools (OpenAI, Anthropic, Gemini, etc.). Great for grep/tests/format hooks.

```bash
# Try default tools (built-in)
llm -T llm_version -T llm_time 'Report LLM version and current time' --td

# Inline Python functions as tools
llm --functions 'def reverse_string(s: str) -> str:
    """Return the reversed string."""
    return s[::-1]
' -T reverse_string 'Reverse this: $input'

# Example: expose a tiny grep helper (use cautiously)
llm --functions '
import subprocess, shlex
def grep(pattern: str, path: str = ".") -> str:
    """Run ripgrep recursively and return matches."""
    cmd = f"rg -n --no-heading {shlex.quote(pattern)} {shlex.quote(path)}"
    return subprocess.run(cmd, shell=True, capture_output=True, text=True).stdout
' -T grep 'Find TODOs in this repo and summarize'
```

**Fragments**: Store large, reusable context once and reference it across commands; reduces tokens and can enable vendor prompt caching.

```bash
# Store large context once (set an alias)
llm fragments set large-codebase ./docs/architecture.md

# Reference that fragment in future prompts
llm -f large-codebase "Optimize the authentication logic"
```

### Logging and caching

**SQLite logs**: Every run is logged to a local SQLite DB. Filter, export, and audit.

```bash
# Recent runs (short view) and JSON with fragments expanded
llm logs -s | head -n 10
llm logs -c --json --expand | jq '.[] | {when: .datetime_utc, model: .model, prompt: .prompt | tostring}'

# Filter by fragment or tool usage
llm logs -c -f large-codebase --short
llm logs -c --tools llm_time
```

**Prompt caching**: Using `-f/--fragment` stores large, repeated context once and may leverage vendor prompt caches to cut cost. Compose multiple fragments per run.

**Cheap model diffs**: Re-run the same template across models and diff outputs.

```bash
diff -u \
  <(llm -t code-review -m openai:gpt-4o < auth.py) \
  <(llm -t code-review -m anthropic:claude-3-5-sonnet < auth.py)
```

### Real-world automation examples

```bash
# Automated code review in CI/CD
git diff origin/main...HEAD | llm "Generate code review comments" --schema "file,line,severity,comment"

# Log analysis and alerting
tail -f /var/log/nginx/access.log | llm "Alert on suspicious patterns"

# Documentation automation
find . -name "*.py" | xargs cat | llm "Generate README.md with usage examples"

# Multi-language support
llm "Translate these error messages to Spanish" < error_messages.json

# Performance analysis
llm "Analyze this performance profile and suggest optimizations" < perf_report.txt
```

### Plugin ecosystem

```bash
# Install useful plugins
llm install llm-cmd        # Shell command generation
llm install llm-cluster    # Text clustering and analysis
llm install llm-embed      # Embedding generation
llm install llm-anthropic  # Claude models
llm install llm-gemini     # Google models
```

[![Language models on the command-line w/ Simon Willison](https://i.ytimg.com/vi_webp/QUXQNi6jQ30/sddefault.webp)](https://youtu.be/QUXQNi6jQ30)

- [10+ Tools to Use AI in the Terminal](https://youtu.be/0OUODPRgPl8)
- [Prompt Engineering Master Class for ENGINEERS](https://youtu.be/ujnLJru2LIs)
- [Simon Willison's blog: CLI Language Models](https://simonwillison.net/2024/Jun/17/cli-language-models/)

## Tips and best practices

### Standard CLI hygiene

**Pipe logs and tests into agents**: Use shell pipes to feed log files, test results, and error messages directly into AI models for analysis and debugging suggestions.

```bash
# Log analysis
tail -100 error.log | llm "Identify root cause and suggest fixes"

# Test failure analysis
pytest --tb=short | llm "Explain test failures and suggest solutions"
```

**Prefer idempotent scripts**: Write automation scripts that can be run multiple times safely, using AI to generate consistent, repeatable operations.

**Persist prompts and outputs**: Store important prompts and responses in your repository for audit trails and team collaboration.

```bash
# Store in version control
echo "Analyze database performance" | llm > analysis_$(date +%Y%m%d).md
git add analysis_*.md
```

**Never give full execution access** outside of isolated sandboxes. Flags like `--dangerously-skip-permissions` (Claude Code) or `--dangerously-bypass-approvals-and-sandbox` (Codex CLI) disable safety checks and can execute arbitrary commands on your system.

### Cost and telemetry monitoring

**Monitor usage patterns**: Track API costs, rate limits, and usage patterns to optimize your AI workflows.

```bash
# LLM usage tracking
llm logs list --csv > usage_report.csv

# Cost analysis
llm logs --since "last week" | awk '{sum+=$tokens} END {print "Total tokens:", sum}'
```

**Set up rate limiting**: Configure tools to respect API limits and avoid unexpected charges.

**Log analysis tools**: Use `ccusage` for Claude Code, built‑in logging for Codex CLI (`~/.codex/log/`), or `llm logs` for comprehensive usage reports.

### Remote and background execution

**Remote containers**: Run long‑running AI tasks in containers or remote runners to avoid blocking your local machine.

**Background processing**: Use screen, tmux, or systemd services for AI agents that need to run continuously.

```bash
# Background AI monitoring
screen -dmS ai-monitor llm --streaming "Monitor system logs" < /var/log/syslog
```

**Keep host clean**: Avoid installing large AI dependencies on your development machine by using containerized execution.

### GitHub integration

**PR review automation**: Set up "@claude" or similar bots for automated code review via GitHub Actions.

```bash
# GitHub Actions workflow
name: AI Code Review
on: pull_request
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: git diff | llm "Review this PR: summarize risks and changes" | gh pr comment --body-file -
```

**Issue triage**: Automate issue classification and initial response using AI agents.

**Commit message generation**: Integrate AI-powered commit message generation into git hooks.

### CI/CD integration

**Automated code review**: Add AI-powered code review steps to your CI/CD pipeline using `llm`, Claude Code, or Codex CLI.

```bash
# Pre-commit hook example
#!/bin/bash
git diff --cached | llm "Check for obvious bugs or issues" --exit-code
```

**Changelog generation**: Automatically generate changelogs from commit messages and PR descriptions.

**Security scanning**: Integrate AI-powered security analysis into your deployment pipeline.

**Documentation updates**: Automatically update documentation when code changes using AI analysis of diffs.

### Reproducible workflows

**Bootstrap scripts**: Create setup scripts that configure AI tools with consistent settings across environments.

```bash
#!/bin/bash
# setup-ai-tools.sh
llm install llm-anthropic llm-gemini
llm keys set openai $OPENAI_KEY
llm templates save code-review "Review for bugs, performance, security"
```

**Environment templates**: Use `.env` templates and configuration files to ensure consistent AI tool behavior across team members.

**Fast linters and tests**: Integrate AI tools with existing linting and testing infrastructure so they follow the same quality gates.

**Pre-commit hooks**: Set up pre-commit hooks that run AI-powered checks automatically, ensuring consistent code quality.

These CLI tools represent the cutting edge of AI-powered development workflows, enabling unprecedented automation and productivity gains for developers willing to invest in command-line proficiency.
