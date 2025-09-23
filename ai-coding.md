# AI Coding

AI-assisted development pairs human judgment with generative models across every workspace. This module shows how to set up productive collaborations, feed models the right project context, and ship code you trust.

You'll explore:

- **Creative prompting** that shapes tone and flow through vibe coding sessions and scenario planning.
- **Environment-specific tooling** for working in browser editors, IDE extensions, and CLI companions without losing momentum.
- **Context engineering practices** that stage repositories, snippets, and docs so models stay grounded in your codebase.
- **Quality safeguards** that weave in automated tests, structured reviews, and targeted tool calls to keep AI-written code production ready.

By the end you will know when to lean on AI, how to steer it with precise context, and the guardrails that turn generated snippets into maintainable features.

Remember that AI coding is a fast-evolving field. Some techniques in this course are likely to become **more important** with time, like:

1. **[Spec-first development](ai-coding-context.md#spec-first-development)** — regulation, SLAs, and team audits rise; clear specs make agents repeatable and safe.
2. **[Premortem tests](ai-coding-tests.md#premortem-tests-first)** — cheaper runs + judge limits mean runnable tests become the contract, not chat.
3. **[Context engineering](ai-coding-context.md#ai-coding-context-engineering)** — longer, cheaper context rewards right-sized, high-signal inputs; models “pay attention” better.
4. **[IDE-native agents](ai-coding-ide.md#ai-coding-in-ides)** — deeper codebase awareness + live previews beat copy-paste as default.
5. **[Model Context Protocol (MCP)](ai-coding-tools.md#model-context-protocol-mcp)** — real exploits + enterprise controls push standard, least-privilege tool access.
6. **[Sandbox/approvals (least-privilege)](ai-coding-tools.md#least-privilege-automation)** — prompt-injection and governance make allowlists and approvals mandatory.
7. **[Scorecard-driven eval loops](ai-coding-tests.md#build-evaluation-loops)** — throughput gains enable multi-variant drafts; automatic selectors pick winners.
8. **[Parallel agents (MoA)](ai-coding-strategies.md#parallel-agents)** — faster inference + LLM-judges favor draft-and-select over one-shot tries.
9. **[Property-based fuzzing](ai-coding-tests.md#property-based-fuzzing-for-ai-patches)** — AI code fails at edges; cheap fuzzing finds them.
10. **[Mutation testing](ai-coding-tests.md#coverage-and-mutation-guardrails)** — ensures tests bite; counters “almost-right” patches.
11. **[LLM-assisted grading (advisory)](ai-coding-tests.md#llm-assisted-grading-with-guardrails)** — judges are useful signals; pair with runnable tests as costs drop.
12. **[CLI-first agents & CI](ai-coding-cli.md#ai-coding-in-the-cli)** — on-device + auditability + low cost make batch/CI flows standard.
13. **[Inline AI coding sandboxes](ai-coding-online.md#artifacts-inline-ai-coding-sandboxes)** — dynamic code + multimodal previews shrink idea→demo time.
14. **[Sub-agents](ai-coding-strategies.md#sub-agents)** — bigger tasks and longer context benefit from scoped roles; less drift, safer edits.

Some of the things covered in this course are likely to become **less important**, like:

1. **[Copy-paste chat ↔ editor](ai-coding-ide.md#copy-paste-workflows)** — still useful for learning, but IDE/CLI agents with context beat it daily.
2. **[Monolithic all-access agents](ai-coding-tools.md#least-privilege-automation)** — replaced by least-privilege tools, approvals, and scoped servers.
3. **[Judge-only approvals](ai-coding-tests.md#llm-assisted-grading-with-guardrails)** — LLM judges stay advisory; tests and gates make the final call.
4. **[Stuff-everything prompts](ai-coding-context.md#llmstxt)** — long context helps, but right-sizing beats dumping; fetch extra only when needed.
5. **[Hosted workbenches for pro teams](ai-coding-online.md#online-coding-agents)** — great for demos/edu; privacy and on-device tilt pros to IDE/CLI.
6. **[Manual, unlogged prompt tinkering](ai-coding-context.md#versioning-prompts)** — replaced by versioned prompts, PR links, and logs for audit.
7. **[One-thread-does-everything sessions](ai-coding-strategies.md#reset-over-repair)** — reset-over-repair and sub-agents are faster and cleaner.
8. **[After-the-fact testing](ai-coding-tests.md#premortem-tests-first)** — premortem tests become the norm; they lock intent before agents code.

Via [AI coding techniques impact: ChatGPT](https://chatgpt.com/share/68d2428c-0a74-800c-bfa0-226a1bd94c2d)
