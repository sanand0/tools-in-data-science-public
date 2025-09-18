# AI Coding Strategies

Strategic approaches to AI-assisted software development have evolved rapidly in 2025. Unlike simple code completion, these methodologies focus on sustainable, team-oriented workflows that maximize AI productivity while maintaining code quality and developer control.

Modern AI coding strategies combine human expertise with AI capabilities through structured patterns, parallel processing, and iterative feedback loops. The most effective approaches treat AI as a collaborative partner rather than a replacement, establishing clear boundaries and verification processes.

In this module, you'll learn:

- **Mixture-of-Agents (MoA)**: Running multiple AI models in parallel for higher success rates
- **Test-driven AI development**: Using automated tests to validate and select AI-generated code
- **Parallel drafting patterns**: Generating multiple solutions simultaneously and benchmarking results
- **Reset-over-repair workflows**: Strategic session management and context preservation

[![Software engineering with LLMs in 2025: reality check](https://i.ytimg.com/vi_webp/EO3_qN_Ynsk/sddefault.webp)](https://youtu.be/EO3_qN_Ynsk)

## Voice-to-code workflow

This is an emerging approach: coding while walking.

- **Matt Webb** (Interconnected): records on Apple Watch with Whisper Memos while running. At home, he pastes the transcript to Claude. [Diane, I wrote a lecture by talking about it](https://simonwillison.net/2025/Apr/23/diane/)
- **Simon Willison** uses AI-powered voice interfaces like ChatGPT’s Voice Mode to code while walking a dog. [Notes on using LLMs for code](https://simonwillison.net/2024/Sep/20/using-llms-for-code/)
- **Anand S** uses [Codex](https://chatgpt.com/codex) "Dictate" to speak edits required to a repositoring and has it code a pull request while walking. [Turning Walks into Pull Requests](https://www.s-anand.net/blog/turning-walks-into-pull-requests/)

Not all kinds of coding work well for this. It's best for:

- **Documentation**. Low risk, boring. LLMs do this well.
- **Adding tests**. Low risk, boring. LLMs do this moderately well.
- **Coding from examples**. Medium risk, slightly boring. LLMs copy well from examples.

For refactoring, bug fixing, or new features, it works well when you have robust automated test cases and can review the output easily while walking.

## Meta-prompting & optimization

Using LLMs to optimize prompts before execution can reduce confusion. For example:

```bash
# First agent refines the prompt
npx -y @openai/codex exec "Write a specific, actionable prompt to fix the login bug"
```

This generates a detailed prompt, e.g.:

- **Role**: You are a senior backend engineer working in the ...
- **Goals**: ...
- **Constraints**: ...
- **Implement**: ...
- **Tests (write first)**: ...
- **Acceptance criteria**: ...

Pass _this_ prompt to a coding agent to generate the code changes. This increases the chance of success in a **single-shot**.

There are specialized prompt optimization tools like [OpenAI's Prompt Optimizer](https://platform.openai.com/chat/edit?models=gpt-5&optimize=true). You could also use [ChatGPT](https://chat.openai.com/), [Claude](https://claude.ai/), etc. to refine your prompt. But using a coding agent lets it see your context directly.

## Sub-agents

Coding agent context windows fill up fast, leading to forgotten functions, broken suggestions, and inefficiency.

Sub-agents are a way around this. Instead of using the same agent thread, it spawns tasks to dedicated agents for specialized tasks (e.g., file creation, git commits, running tests). Each runs in its _own_ context window, so their token usage doesn’t drain the main agent’s memory.

Claude Code has native [Subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents) support. To add a new sub-agent, just type `/agent` and explain what it should do, along with the tools it has access to. You can now use it.

[![Solving Claude Code's (Short-Term) Memory Problem](https://i.ytimg.com/vi_webp/YL8KsWTlCKI/sddefault.webp)](https://youtu.be/YL8KsWTlCKI)

## Parallel agents

Running multiple AI models in parallel can have several benefits.

On approach is to perform different tasks in parallel. For example:

- **Ask and Code**: Run two coding models side-by-side (e.g. Claude Code on two windows). Use one to plan, ask questions, improve the prompt, and other read-only operations. Use the other to generate code. Useful to reduce context size and get single-shot success.
- **Parallel generation**: Run two coding models side-by-side. Each works on a different, independent task. For example, one codes the backend while the other codes the frontend.
- **Staged aggregation**: Use one model to generate multiple solution approaches, then a second model to evaluate and select the best combination.

Another approach is to have multiple models work on the same task, generating different solutions that can be compared and evaluated. For example, [Codex](https://chatgpt.com/codex) lets you draft up to 4 variations using the same prompt.

Here are ways to use this:

- **Multi-architecture generation**: Run the same prompt in parallel, comparing different architectures. For example:
  - **Library alternatives**: Request implementations using different libraries or frameworks (React vs Vue, FastAPI vs Django) for the same feature.
  - **Algorithm variations**: Generate multiple algorithmic approaches (recursive vs iterative, caching vs recomputation) and benchmark performance.
  - **Design pattern options**: Explore different architectural patterns (Repository, Factory, Observer) for the same business logic.
- **Prompt variations**: Generate multiple versions of the same prompt with different framing, then select the best result or combine approaches.

## Test-driven AI development

Test-driven AI development uses automated tests as both specification and validation for AI-generated code. Instead of manually reviewing AI output, you write tests first and let the AI iterate until all tests pass.

- **Typed-first development**: Prefer TypeScript, Rust, Go, or typed Python to give AI compile-time guardrails that catch errors early, while linting or compiling.
- **Write (failing) tests first**: Before generating implementation code, ask AI to create comprehensive tests covering normal cases, edge cases, and error conditions.
- **Test invariants**: Generate tests that verify invariants and properties rather than specific outputs, making them more robust against AI creativity.
- **Loop until green**: Use AI to iteratively fix code until all tests pass, rather than trying to get it right in one shot.
- **Observability-driven post-mortems**: Log AI decisions, tool usage, and success rates. Have LLMs review and sugges what patterns work best for your team and codebase.
- Set up the environment and provide instructions for the agent to be able to run the tests at one shot.
- Use popular test frameworks (pytest, jest, playwright). They have rich features and agents have less to learn.
- Prefer automated test tools over writing test code, e.g. linters, type checkers, SAST/DAST, coverage/mutation tools. Introduce these in the CI pipeline.
- Keep tests fast. Run `lint && test` on every agent response. Cache. Prioritize quick property/unit tests.

[![Test driven development just got way easier (using Claude code)](https://i.ytimg.com/vi_webp/UkXUldJDHIo/sddefault.webp)](https://youtu.be/UkXUldJDHIo)

## Reset over repair

When AI-generated code starts to drift from requirements or introduces subtle bugs, it's often faster to restart with clear requirements than to guide the AI through incremental fixes.

- **Session boundaries**: Start fresh AI sessions for new features rather than accumulating context drift over long conversations.
- **Checkpoint patterns**: Save working implementations before attempting modifications, enabling quick rollback.
- **Scope isolation**: Keep changes small and independently verifiable rather than allowing AI to make sweeping modifications.

### Fast feedback loops

Optimize development environment for speed (instant builds, hot reload, fast tests) since slow feedback kills AI productivity more than almost any other factor.

- **Instant builds**: Choose technologies and tools with minimal build times to enable rapid iteration and comparison.
- **Hot reload workflows**: Use development tools that provide immediate feedback on code changes (Vite, Next.js dev mode, uvicorn --reload).
- **Checkpoint commits**: Make git commits at stable states before attempting complex changes, enabling easy rollback if AI suggestions go off track.
- **Automated comparison**: Set up CI pipelines that automatically benchmark and compare different implementations on every commit.

## Code review automation

Using a second AI model to evaluate, grade, and select code produced by other AI models creates an automated quality control system that can operate at scale.

- **Multi-criteria evaluation**: Configure AI reviewers to assess code across multiple dimensions: correctness, security, performance, maintainability, and style compliance.
- **Rubric-based scoring**: Provide specific scoring criteria and examples of high/low quality code to ensure consistent evaluation.
- **Consensus mechanisms**: Use multiple AI reviewers and require agreement or vote-based selection for high-stakes changes.
- **Human review protocols**: Define clear criteria for when AI-generated code needs human review vs when it can be auto-merged based on test passing.

---

AI coding strategies represent a fundamental shift from individual productivity tools to systematic development methodologies. The most successful teams treat AI as a force multiplier that amplifies human expertise rather than a replacement for engineering judgment.
