# Vibe-coding

The rise of AI coding tools has introduced a new development philosophy: [**vibe-coding**](https://en.wikipedia.org/wiki/Vibe_coding).

Vibe coding is different from AI coding. It's "fully giving in to the vibes..." and "forgetting that the code even exists", i.e., accept-all edits, don’t hand-edit diffs, etc. The goal is to get to a working prototype as fast as possible.

[![What is Vibe Coding?](https://i.ytimg.com/vi_webp/MUEgLWcaXTE/sddefault.webp)](https://youtu.be/MUEgLWcaXTE)

**Ship scrappy first drafts fast**: Focus on getting a working version quickly rather than polished code. AI can generate functional prototypes in minutes, allowing you to validate ideas before investing in refinement.

**Then tighten with deterministic gates**: Once you have a working prototype, add proper testing, code review, and quality assurance. This hybrid approach combines AI's speed with traditional software engineering rigor.

**Embrace the iteration loop**: AI coding tools excel at making incremental changes. Use this to your advantage by continuously refining your application through conversational editing.

This mindset shift recognizes that AI tools are best at getting you 80% of the way quickly, while human expertise and systematic processes handle the final 20% that ensures production quality.

Vibe-coding is not suitable for all scenarios. It works best for prototypes, internal tools, and projects where speed is prioritized over perfection. For mission-critical systems, a more cautious approach is warranted.

[![Vibe coding in prod | Code w/ Claude](https://i.ytimg.com/vi_webp/fHWFF_pnqDk/sddefault.webp)](https://youtu.be/fHWFF_pnqDk)

## AI coding safety

AI coding tools can introduce security risks if not used carefully. Here are some best practices to ensure safe usage:

- **Isolate tools in sandboxes**: Run AI-generated code in containerized environments or dedicated virtual machines. This prevents malicious code from accessing your main system or sensitive data.
- **Use MCP (Model Context Protocol) servers**: Implement MCP servers to create controlled interfaces between AI models and your tools. This provides a secure boundary for tool access and execution.
- **Redact secrets and sensitive data**: Never include API keys, passwords, or personal information in prompts. Use environment variables and secure storage for credentials.
- **Treat repository content as untrusted**: Any README.md, HTML files, or documentation in repositories could contain prompt injection attacks. Review content before processing with AI tools.
- **Require human approval for privileged actions**: Implement confirmation steps for file deletion, system changes, or deployment operations. Never allow AI tools to perform destructive actions automatically.
- **Limit web navigation and shell access**: Use allowlists for external URLs and shell commands. Restrict AI tools to only necessary domains and safe command sets.
- **Review tool execution plans**: Before allowing AI tools to execute complex workflows, review their planned actions. Many tools now provide execution previews for this purpose.

Recent security research has identified vulnerabilities in AI coding assistants, including prompt injection through repository content and arbitrary code execution risks. Stay informed about these issues through security advisories.

- [Google Gemini CLI prompt injection vulnerability](https://cyberscoop.com/google-gemini-cli-prompt-injection-arbitrary-code-execution/)
- [Code execution through deception in AI CLI tools](https://tracebit.com/blog/code-exec-deception-gemini-ai-cli-hijack)
- [Anthropic output styles and safety practices](https://docs.anthropic.com/en/docs/claude-code/output-styles)

Implementing these safety practices ensures that AI coding tools enhance your productivity without compromising security or introducing unnecessary risks to your development environment.
