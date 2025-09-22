---
agent: Codex CLI
model: gpt-5-codex
description: 2025-09-22. Updated ai-coding-tools.md based on notes + research using style of other documents.
---

Here are notes I gathered about tools that AI coding agents (Codex, Claude Code, Cursor, ...) benefit from when generating code. Use this as raw material to update ai-coding-tools.md (which already has content on MCPs; move it to the end.)

Follow the style of writing in ai-coding-cli.md and ai-coding-strategies.md. Include videos where relevant.

De-duplicate these notes. Drop anything not directly related to tools AI coding agents can use to improve effectiveness.
Search online for specific practical material that will help Python developers and **include as examples** mentioning how to use it and where it is helpful.
It's OK to drop items from my notes below if you don't find enough good material about it or is not directly relevant - mention what's dropped in HTML comments.

- Mention tools that provide additional capabilities in AGENTS.md / CLAUDE.md / custom instructions / ...
- **Least-privilege ops** — per-tool scopes, auditable calls, and explicit approvals.
- Provide access to GitHub automation via `gh` to commit, push, review issues, review PRs, open PRs, request reviews, trigger workflows, and chatops hooks for agents.
- Provide access to CLI communication tools (if any), eg. Slack, JIRA, ...
- Data wrangling (text/JSON/YAML/CSV)
  - `jq` — slice/transform JSON for prompts, evals, agent logs.
  - `yq` (two flavors) — YAML ⇄ JSON with jq-style filters (`kislyuk/yq`) or native multi-format processor (`mikefarah/yq`).
  - `xsv` / `csvkit` — fast CSV stats, joins, sampling to prep datasets for tests/evals.
  - `pandoc` — convert specs/docs to/from Markdown/HTML/PDF for agent-readability.
- Local databases & analytics
  - SQLite (`sqlite3`) — ship tiny reproducible DBs; great for evals/artifacts.
  - `sqlite-utils` — create/tweak tables, import JSON/CSV, and query via CLI; pairs well with `llm embed`.
  - DuckDB — columnar SQL with Parquet/CSV support for fast local analytics.
  - Datasette — publish/query SQLite for API-style demos and agent tooling.
  - Redis
- Python env, packaging & project hygiene
  - `uv` (Astral) — blazing-fast Python package & venv manager; lock, sync, run.
  - `pipx` — install Python CLIs (e.g., `sqlite-utils`) in isolated envs.
  - `pyenv` — manage Python versions for reproducible agent sandboxes.
  - `pre-commit` or `preq` (which is faster) — enforce lint/format/tests before commits (great for AI PRs).
- Python code quality & tests (fast feedback for agents)
  - `ruff` — ultra-fast linter/fixer to keep AI code consistent.
  - `pytest` — unit/property tests + fixtures for agent-driven TDD.
  - `mypy` / `pyright` — static typing to catch AI mistakes early.
- HTTP & web automation
  - `curl` — scriptable HTTP for smoke tests and API fixtures.
  - HTTPie — human-friendly API calls with colored output for demos.
- Watchers & task runners
  - `watchexec` / `entr` — rerun `lint && test` on file changes to corral agents.
- Search & navigation on big repos
  - `ripgrep` / `ug` / `fd` / `fzf` — lightning-fast grep/find + fuzzy-pick to craft minimal context for agents.
- Simon Willison’s `llm` — run prompts, cache keys, stream output from the shell.
- Provide access to other coding agents, e.g. `npx -y codex exec` (or similar for Claude Code, Gemini CLI) as sub-agents
- Provide useful JS ecosystem tools, e.g. `node` for `npx` for browser automation, coding agent execution, ...
- Provide access to playwright for screenshots, scraping, etc.
- Provide access to cloud automation tools: AWS CLI, Azure CLI, Google Cloud CLI
- How to teach/use these together (quick recipes)
  - Pipe JSON → prompt — `rg -n "TODO" -g '!node_modules' | jq -Rs . | llm -m gpt-4o-mini 'Refactor these TODOs into issues'`.
  - Make eval suites trivial — `duckdb :memory: "select …" | xsv sample 200 | llm embed-multi --to sqlite eval.db` (store vectors in SQLite).
  - Agent-safe edits — run an MCP Filesystem server with allow-lists; guard with `pre-commit` so AI PRs can’t land red.
  - Web→context at scale — Fetch server pulls pages; `pandoc` cleans to Markdown; `llm` chunks/embeds to SQLite.
- Include other commonly useful tools like `uvx yt-dlp` for YouTube, `uvx markitdown` for PDF to Markdown, ...
- Prefer modern, efficient tools, e.g. `duckdb` over `sqlite`, `fd` over `find`, `rg` or `ug` over `grep`, etc.

## 2025-09-11 Add AGENTS.md example

Update ai-coding-tools.md with a concise example of an `AGENTS.md` (or `CLAUDE.md`) that will help coding agents use the tools listed in the document.
Search and incorporate best practices.
