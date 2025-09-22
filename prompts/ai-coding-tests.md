---
agent: Codex CLI
model: gpt-5-codex
description: 2025-09-22. Generated ai-coding-tests.md based on notes + research using style of other documents.
---

Here are notes I gathered about testing AI-generated code from multiple sources. Use this as raw material to write ai-coding-tests.md. De-duplicate. Drop anything not directly related to testing AI-generated (or vibe-coded) code (e.g. testing non-code LLM output). Search online for specific practical material that will help Python developers and include as examples. It's OK to drop items from my notes below if you don't find enough good material about it or is not directly relevant - mention what's dropped in HTML comments.

Follow the style of writing in ai-coding-cli.md and ai-coding-strategies.md. Include videos where relevant.

- **Bench/eval suites** — track success rates over time; prefer scorecards the agent can optimize against.
- **Coverage + mutation** — measure, then mutate to ensure tests fail when they should / watch coverage but use mutation/fault-injection to ensure tests actually bite.
- **E2E smoke** — minimal E2E flows per feature to block regressions early.
- **Evaluation-in-the-loop** — bake unit/property tests, task scorecards, and CI checks before merging; prefer verifiable tasks. (Reinforced across videos and notes.)
- **Hidden/adversarial tests** — discourage overfitting; include tricky edges (e.g., sample vs population, rounding modes).
- **Hidden/robust checks** — use hidden tests and adversarial inputs to avoid overfitting to visible specs / include adversarial and property-based checks for generalization.
- **LLM as judge** — auto-score diffs, docs, UX flows using rubric prompts; keep human final say.
- **Playwright/Agents** — let agents drive UI with browser tools (via MCP or platform tools) to validate end-to-end flows.
- **Premortem TDD** — generate failing tests first, then code to pass them.
- **Property tests** — define invariants and let tools fuzz around them; catches “almost right” agent code.
- **Selection by tests** — when MoA or multi-draft, choose the winning patch via model-generated tests + final selector pass.
- **Selector harness** — when running multi-draft/MoA, pick the winner by test results not by vibes.
- **Test data packs** — maintain tiny, representative fixtures for speed and repeatability.
- **Unit + property tests** — combine classic unit tests with property/fuzz tests to catch “it kinda works” AI outputs.
