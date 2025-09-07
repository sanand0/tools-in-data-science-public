# AI Coding Context Engineering

Context engineering is the systematic approach to providing AI coding assistants with the right information at the right level of detail. Unlike general prompt engineering, code context engineering focuses specifically on code-related workflows, project structure, and development processes.

Effective context engineering transforms AI from a simple code generator into an intelligent development partner that understands your project's architecture, conventions, and goals.

In this module, you'll learn:

- [**File context**](#file-context): Techniques for providing relevant code snippets and files to AI tools
- [**Spec-first development**](#spec-first-development): Using a specification document as the single source of truth for AI-driven development
- [**Project context**](#project-context): Using `CLAUDE.md` or `AGENTS.md` to give AI persistent knowledge about your codebase
- [**Library context**](#library-context): Supplying documentation for third-party libraries to improve AI understanding
- [**Project documentation**](#project-documentation): Generating and maintaining human and AI-readable docs for better collaboration
- [**llms.txt**](#llmstxt): Implementing the llms.txt standard to help LLMs understand your website or API
- [**Instruction templates**](#instruction-templates): Using lightweight schemas to eliminate ambiguity in prompts
- [**Best practices and tips**](#best-practices-and-tips): Maintaining context hygiene, cost optimization, and team collaboration

[![AI Coding 101: Ultimate Prompt Guide (37 tips)](https://i.ytimg.com/vi_webp/uwA3MMYBfAQ/sddefault.webp)](https://youtu.be/uwA3MMYBfAQ)

## File context

The easiest way to provide context to AI is by copy-pasting or uploading the code directly. For single files, this is straightforward. For multi-file projects, you can use:

```bash
uvx files-to-prompt --cxml file1.py file2.js repo/ ...
```

This concatenates the files into an XML structure (recommended by Claude, supported by most AI tools) that you can paste or pass to your AI tool.

For small files, this works well. If your code is large, you may want to pass files and chunks selectively.

## Spec-first development

Spec-first development places a detailed specification document at the center of your AI coding workflow. Instead of giving ad-hoc instructions to AI tools, you maintain a living spec that serves as the authoritative source for project requirements, constraints, and acceptance criteria.

There is no formal standard for AI coding specs. Here are some sections you might want to include in your `README.md` (or a separate `spec.md`):

1. **Meta**: _Status_, _Version_, _Owners_, _Repo/Issue links_, _Last reviewed_
2. **Problem & Scope**: One-paragraph problem; _Goals_ vs _Out-of-scope_.
3. **Users & Flows**: Primary personas; 1–2 happy-path flows; edge cases as bullets.
4. **Requirements**: Functional & non-functional (latency, cost, availability, privacy). Use **MUST/SHOULD/MAY** precisely.
5. **Interfaces & Data Contracts**: REST/GraphQL/event contracts (OpenAPI/GraphQL SDL/AsyncAPI); shared **JSON Schemas** for requests, responses, events, and errors. Prefer contract-first.
6. **AI-Specific Contracts**: **Prompt & Tool Schemas** (inputs/outputs, invariants), **strict parsing** requirements, safety guardrails, cost, budgets, fallback & timeout policy. If using tool/function calling, document JSON schema + strictness.
7. **Acceptance Examples**: Executable examples that double as tests. Keep 1 scenario per behavior.
8. **Evaluation Plan (for LLM features)**: Golden/regression tests, challenge sets, rubrics, and pass/fail gates. Automate.
9. **Risk, Safety & Privacy**: Threat model & mitigations (e.g. aligned to **OWASP LLM Top 10**); PII handling/redaction rules.
10. **Change Log & Versioning**: Human-readable changes; link to related ADRs; follow a clear changelog style.

Some things to remember:

- **Keep docs as code.** Version the spec, run doc linters in CI, and require spec updates for feature PRs (“docs-as-code”).
- **Keep it updated**. Update whenever a new decision/change is made. Record decisions, not debates.
- **Change transparently.** Maintain a **CHANGELOG.md** in plain language and link each entry to spec sections / architecture decision records.
- **Avoid bloated specs**. Focus on the most important decisions (not reasons).
- **Avoid vagueness**. This can confuse AI. Ideally, replace with executable examples.

## Project context

Project context provides AI tools with persistent knowledge about your codebase.

- Codex uses [`AGENTS.md`](https://agents.md/)
- Gemini CLI uses `GEMINI.md` (see “Memory Management” in their docs)
- Claude Code uses [`CLAUDE.md`](https://docs.anthropic.com/en/docs/claude-code/memory)

Claude Code and Gemini CLI provide a `/init` command to bootstrap these files based on your project structure and `README.md`. You can edit the generated file.

Each project has its own style and preferences. Most often, these files include instructions on how to build and test the project and coding conventions.

- [Examples of CLAUDE.md on GitHub](https://github.com/search?q=path%3A**%2FCLAUDE.md&type=code)
- [Examples of AGENTS.md on GitHub](https://github.com/search?q=path%3A**%2FAGENTS.md&type=code)

[![Claude Code best practices | Code w/ Claude](https://i.ytimg.com/vi_webp/gv0WHhKelSE/sddefault.webp)](https://youtu.be/gv0WHhKelSE)

Some developers also version their prompts in a `PROMPTS.md` file.

- [Examples of PROMPTS.md on GitHub](https://github.com/search?q=path:**/PROMPTS.md&type=code)

## Library context

When using libraries (e.g. from [PyPI](https://pypi.org/) or [npm](https://www.npmjs.com/)), providing context about the library can help AI understand it better.

You can add this instruction:

```markdown
- Use `curl -s https://pypi.org/pypi/package-name/json | jq -r .info.description` to get PyPI package docs
- Use `npm view package-name readme` to get npm package docs
- Use `curl -s https://context7.com/owner/repo/llms.txt` for https://github.com/owner/repo docs
```

PyPi and NPM provide the first two natively. For GitHub repos, you can create an account on [context7.com](https://context7.com/) to add any public GitHub repos you want the docs for.

## Project documentation

Human developers need to understand the codebase to contribute to a project. AI tools can help with this.

A simple approach is to use a coding agent to generate documentation from the codebase. Here are examples:

```bash
uvx files-to-prompt --cxml . | llm "Generate a comprehensive README.md for this project" > README.md
claude -p "Update README.md with project overview, setup, and usage examples"
codex exec "Update README.md with project overview, setup, and usage examples"
```

[DeepWiki](https://deepwiki.com/) is a tool that generates documentation from GitHub repos. For example

- https://deepwiki.com/openai/openai-python has the generated documentation for [openai/openai-python](https://github.com/openai/openai-python)
- https://deepwiki.com/sanand0/tools-in-data-science-public has the generated documentation for this [Tools in Data Science](https://github.com/sanand0/tools-in-data-science-public) course

You can replace `github.com` with `deepwiki.com` and generate docs for your own public repos.

## llms.txt

[**/llms.txt**](https://llmstxt.org/) is a standard to provide information to help LLMs use a website at inference time. For example:

- [Yoast llms.txt](https://yoast.com/llms.txt)
- [Vercel llms.txt](https://vercel.com/llms.txt)
- [Klarna llms.txt](https://docs.klarna.com/llms.txt)
- [Examples of llms.txt on GitHub](https://github.com/search?q=path%3A**%2Fllms.txt&type=code)

[Several](https://apify.com/jakub.kopecky/llmstxt-generator) [tools](https://github.com/firecrawl/create-llmstxt-py) [can](https://wordlift.io/generate-llms-txt/) generate `llms.txt` files.

**Context right-sizing**: Include only the essential information that AI needs for current tasks. For large context, you can:

- **Break-it up**. [OpenAI's llms.txt](https://cdn.openai.com/API/docs/txt/llms-full.txt) is 2.8MB, for example. So they've broken it up into [llms-models-pricing.txt](https://cdn.openai.com/API/docs/txt/llms-models-pricing.txt), [llms-guides.txt](https://cdn.openai.com/API/docs/txt/llms-guides.txt), and [llms-api-reference.txt](https://cdn.openai.com/API/docs/txt/llms-api-reference.txt).
- **Use tool-calling** or MCP servers to fetch additional context on demand rather than bloating every prompt.
- **Compress it**. Tools like [llm-min.txt](https://github.com/marv1nnnnn/llm-min.txt) use LLMs to compress large llms.txt. Or tools that measure [prompt ablation](https://www.thoughtworks.com/en-sg/insights/blog/generative-ai/effective-way-estimate-token-importance-llm-prompts) to find the most important parts of a prompt.

## Instruction templates

Use lightweight schemas to eliminate ambiguity. For example:

```markdown
## Code Review Schema

| Aspect          | Rating (1-5) | Issues | Suggestions |
| --------------- | ------------ | ------ | ----------- |
| Security        |              |        |             |
| Performance     |              |        |             |
| Maintainability |              |        |             |
| Test Coverage   |              |        |             |

## Bug Report Schema

- **Reproduction Steps**: [numbered list]
- **Expected Behavior**: [one sentence]
- **Actual Behavior**: [one sentence]
- **Environment**: [OS, browser, version]
- **Logs**: [relevant error messages]
```

## Best practices and tips

- Context hygiene
  - **Version control all context files**: Treat CLAUDE.md, spec.md, and related files as first-class code artifacts that should be versioned and reviewed.
  - **Keep contexts focused**: Resist the urge to include everything. Each context file should serve a specific purpose and audience.
  - **Regular context maintenance**: Review and update context files as your project evolves. Outdated context can be worse than no context.
- Cost optimization
  - **Monitor token usage**: Track how much context you're including in each AI interaction and optimize for the highest-value information.
  - **Use tiered context**: Start with minimal context and let AI tools request additional information as needed.
  - **Cache common contexts**: Store frequently-used project context in AI tool memories to avoid repeating large context blocks.
- Team collaboration
  - **Standardize context formats**: Ensure all team members use consistent file names and structures for project context.
  - **Share context libraries**: Create reusable context templates for common project types and development patterns.
  - **Document context decisions**: Explain why certain information is included or excluded from project context files.
