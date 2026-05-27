# Model Context Protocol (MCP)

MCP standardizes how AI models interact with external data sources and tools.

## The Architecture
- **MCP Host:** The application running the AI (e.g., Claude Desktop, Cursor).
- **MCP Client:** Connects the host to servers.
- **MCP Server:** Exposes local tools, files, or APIs to the client securely.

## Capabilities
1. **Resources:** Read-only data (files, API responses).
2. **Tools:** Executable functions (run scripts, hit APIs).
3. **Prompts:** Reusable prompt templates.

MCP allows developers to write a tool once and use it across any compatible AI assistant.

---

