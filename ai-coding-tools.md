# ai-coding-tools

> [!WARNING] This content is work in progress.

## Model Context Protocol (MCP)

[Model Context Protocol](https://modelcontextprotocol.io/) is an open standard that enables AI applications to securely connect to external systems like databases, APIs, and development tools. Think of MCP as "USB-C for AI" – a standardized way to extend AI capabilities safely.

### Core MCP concepts

**Servers**: Applications that expose capabilities to AI models
**Clients**: AI applications that consume server capabilities
**Resources**: Data sources like files, databases, or APIs
**Tools**: Actions the AI can perform, like running commands or making API calls
**Prompts**: Reusable prompt templates with parameters

### Safe tool integration

MCP provides explicit capability control and auditability that's essential for production AI workflows:

```json
{
  "mcpServers": {
    "database": {
      "command": "npx @mcp/server-sqlite",
      "args": ["./dev.db"],
      "allowedOperations": ["read", "aggregate"],
      "restrictions": ["no-write", "no-delete"]
    },
    "browser": {
      "command": "npx @mcp/server-browser",
      "allowedDomains": ["docs.example.com", "api.example.com"],
      "restrictions": ["no-downloads", "no-file-uploads"]
    }
  }
}
```

### Common MCP servers for development

**SQLite Server**: Safe database access with read-only or limited write permissions

```bash
npx @mcp/server-sqlite ./project.db --read-only
```

**Memory Server**: Persistent context across AI sessions

```bash
npx @mcp/server-memory --storage ./ai-memory.json
```

**Sequential Thinking Server**: Enhanced reasoning capabilities

```bash
npx @mcp/server-sequential-thinking
```

**File System Server**: Controlled file access with path restrictions

```bash
npx @mcp/server-filesystem --root ./src --readonly
```

### Integration patterns

**CI/CD Integration**: Connect AI to your build and deployment systems

```yaml
# .github/workflows/ai-review.yml
- name: Run AI Code Review
  run: |
    npx @mcp/server-github-api | llm "Review this PR for issues"
```

**Development Workflow**: Use MCP servers for common development tasks

```bash
# Database schema analysis
echo "ANALYZE" | npx @mcp/server-sqlite project.db | llm "Suggest index optimizations"

# Log analysis
npx @mcp/server-filesystem logs/ | llm "Find error patterns in recent logs"
```

[![Model Context Protocol Clearly Explained | MCP Beyond the Hype](https://i.ytimg.com/vi_webp/tzrwxLNHtRY/sddefault.webp)](https://youtu.be/tzrwxLNHtRY)

- [The Model Context Protocol (MCP)](https://youtu.be/CQywdSdi5iA)
- [MCP Crash Course for Python Developers](https://youtu.be/5xqFjh56AwM)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/introduction)
