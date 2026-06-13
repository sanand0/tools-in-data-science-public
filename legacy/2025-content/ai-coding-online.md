# AI Coding Online

Modern AI coding tools have transformed how we build software, enabling rapid prototyping and deployment through natural language interfaces. This module covers the mindset shift toward "vibe-coding" and the essential tools for AI-assisted development.

In this module, you'll learn:

- **Inline AI coding sandboxes**: Use Claude Artifacts, Gemini Canvas, and ChatGPT Canvas for iterative development
- **Hosted agent workbenches**: Leverage Replit Agent, Bolt.new, and Lovable for end-to-end app creation

## Artifacts: Inline AI coding sandboxes

AI artifacts provide side-by-side code and chat interfaces that revolutionize how we iterate on applications. These tools show visible diffs, run code in real-time, and allow for conversational editing.

### Claude Artifacts

[Claude Artifacts](https://support.anthropic.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them) creates interactive content in a dedicated window alongside your conversation. It automatically generates artifacts for significant, self-contained content over 15 lines.

Claude creates artifacts for documents, code snippets, HTML websites, SVG images, diagrams, and React components. You can edit, iterate, and export your creations directly from the interface.

**Key features:**

- Version tracking with rollback capabilities
- Real-time preview for web applications
- Direct export to files or clipboard
- Support for AI-powered apps with Claude API integration

**Best for:** Complex React components, data visualizations, and interactive prototypes requiring multiple iterations.

[![15 Powerful Claude Artifacts Use Cases You Should Try](https://i.ytimg.com/vi_webp/UA2W4xTqQzs/sddefault.webp)](https://youtu.be/UA2W4xTqQzs)

### Gemini Canvas and ChatGPT Canvas

[Gemini Canvas](https://gemini.google/overview/canvas/) and [ChatGPT Canvas](https://openai.com/index/introducing-canvas/) provide similar side-by-side editing experiences with their respective AI models.

These platforms excel at collaborative editing where you can highlight specific sections for targeted changes, making them ideal for documentation, code refactoring, and educational content.

**Best for:** Document editing, code explanations, and collaborative writing tasks.

- [Prototyping with canvas in ChatGPT](https://youtu.be/JbIvaFh44EY)
- [Introducing Canvas in Gemini](https://youtu.be/4Leardp_AGc)

## Online Coding Agents

These platforms combine AI agents with full development environments, handling everything from initial scaffolding to deployment. They're perfect for 0-to-demo workflows and sharing prototypes.

### Replit Agent

[Replit Agent](https://docs.replit.com/replitai/agent) is an AI-powered coding assistant that works within Replit's browser-based IDE. It can create complete applications from natural language descriptions, handle file editing, run code, and deploy applications.

The agent understands your project context and can make complex, multi-file changes. It integrates with Replit's deployment system, allowing you to share working applications instantly.

**Key features:**

- Complete app generation from descriptions
- Multi-file editing and project management
- Integrated deployment and sharing
- Real-time collaboration capabilities
- Mobile app support for coding on-the-go

**Best for:** Full-stack applications, educational projects, and rapid prototyping with immediate deployment needs.

[![Meet the Replit Agent](https://i.ytimg.com/vi_webp/IYiVPrxY8-Y/sddefault.webp)](https://youtu.be/IYiVPrxY8-Y)

[Import from GitHub to Replit](https://docs.replit.com/getting-started/quickstarts/import-from-github)

### Bolt.new (StackBlitz)

[Bolt.new](https://bolt.new/) is StackBlitz's AI-powered development platform that runs entirely in your browser using WebContainers. It excels at creating full-stack prototypes quickly with real-time preview capabilities.

The platform specializes in modern web frameworks and provides instant deployment. It's particularly strong for front-end development and can handle complex JavaScript frameworks without local setup.

**Key features:**

- WebContainer technology for browser-based execution
- Real-time preview and hot reloading
- No local installation required
- Instant sharing and deployment
- Support for popular web frameworks (React, Vue, Angular, etc.)

**Best for:** Front-end prototypes, web applications, and demos that need immediate sharing capabilities.

[![Get Started with Bolt.new](https://i.ytimg.com/vi_webp/iFcc7FZH-xs/sddefault.webp)](https://youtu.be/iFcc7FZH-xs)

[Bolt.new Gallery: See what others have built](https://bolt.new/gallery)

### Lovable

[Lovable](https://docs.lovable.dev/) is an AI web builder that creates full-stack applications from natural language descriptions. It's designed for users of any skill level and focuses on producing deployable web applications.

Lovable excels at creating business applications, landing pages, and functional web tools. It provides templates and integrations to accelerate development beyond basic prototyping.

**Key features:**

- Natural language to full-stack application
- Template library for common use cases
- Built-in integrations (payments, auth, databases)
- Professional deployment options
- No-code/low-code approach

**Best for:** Business applications, landing pages, and functional web tools that need professional deployment.

[![Lovable 2.0 is here. Multiplayer vibe coding. Smarter & more secure.](https://i.ytimg.com/vi_webp/xDwR1_vrIg8/sddefault.webp)](https://youtu.be/xDwR1_vrIg8)

- [Lovable Templates: Browse pre-built applications](https://lovable.dev/templates)
- [Lovable Use Cases: Video tutorials and examples](https://docs.lovable.dev/use-case)

### Jules (Google)

[Jules](https://cloud.google.com/blog/products/ai-machine-learning/google-jules-ai-assistant) is Google's multi-agent coding environment announced at Google Cloud Next '25 with team-based tiers. It combines a shared workspace, orchestration primitives, and a live execution runtime so agents can collaborate on data and application tasks.

Jules now offers a CLI and API for scripting agent workflows, plus deep integrations with Vertex AI, BigQuery, and Workspace. Builders can define guardrails, share reusable playbooks, and hand off tasks between agents who stay in sync through a shared memory layer.

**Key features:**

- Multi-agent workspace with live whiteboard, task queue, and reviewer roles ([Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/google-jules-ai-assistant), [Google Cloud Next '25 recap](https://cloud.google.com/blog/products/ai-machine-learning/next-25-build-with-jules))
- Jules CLI and API for automating agent runs, webhooks, and CI/CD pipelines ([Google Cloud Next '25 recap](https://cloud.google.com/blog/products/ai-machine-learning/next-25-build-with-jules))
- Workspace and Vertex AI integrations for Sheets, Docs, Gemini, and BigQuery ([Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/google-jules-ai-assistant))
- Built-in guardrails with DLP, audit trails, and policy enforcement for regulated teams ([Google Cloud blog](https://cloud.google.com/blog/products/ai-machine-learning/google-jules-ai-assistant))
- Library of reusable playbooks and shared context for handoffs between agents ([Google Cloud Next '25 recap](https://cloud.google.com/blog/products/ai-machine-learning/next-25-build-with-jules))

**Best for:** Product and data teams that need coordinated agents to ship prototypes inside Google Cloud environments.

[![Jules launch overview](https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Jules_Thumbnail.width-1300.png)](https://storage.googleapis.com/gweb-uniblog-publish-prod/original_videos/Jules_Hero.mp4)

- [Jules launch post (August 29, 2025)](https://blog.google/technology/google-labs/jules/)
- [Google Cloud Next '25 demo: Build with Jules](https://cloud.google.com/blog/products/ai-machine-learning/next-25-build-with-jules)

### Codex (OpenAI)

[OpenAI Codex Workspace](https://openai.com/index/codex-platform-update/) is a web IDE that pairs Codex's planning agent with shared project context. The September 24, 2025 release expanded it for teams so everyone can co-edit, review, and ship code directly in the browser.

Codex Workspace keeps a live execution plan next to Git history, lets reviewers stage or block changes, and enforces policies before autop-run edits merge. Canvas sessions and CLI runs stay linked, keeping web edits and scripted workflows in sync.

**Key features:**

- Team feed and shared repositories with inline reviewer assignments and policy controls ([Codex Workspace update](https://openai.com/index/codex-platform-update/))
- Workspace sync that merges Codex plans with Git history and CI checks ([Codex Workspace update](https://openai.com/index/codex-platform-update/))
- Canvas-to-workspace linking for conversational edits that land in the web IDE ([Codex Workspace update](https://openai.com/index/codex-platform-update/))
- Guardrails with audit trails, reviewer gates, and environment-scoped permissions ([Codex Workspace update](https://openai.com/index/codex-platform-update/))
- Live telemetry and test status surfaced before commits land in shared branches ([Codex Workspace update](https://openai.com/index/codex-platform-update/))

**Best for:** Engineering orgs using Codex in the browser who need collaborative reviews and policy-aware automation without leaving the web app.

[![OpenAI Build Hour: Codex](https://i.ytimg.com/vi/WvMqA4Xwx_k/sddefault.jpg)](https://www.youtube.com/watch?v=WvMqA4Xwx_k)

- [Codex Workspace update (September 24, 2025)](https://openai.com/index/codex-platform-update/)
- [OpenAI Build Hour: Codex (September 8, 2025)](https://www.youtube.com/watch?v=WvMqA4Xwx_k)
