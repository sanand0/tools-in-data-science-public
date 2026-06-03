# Custom MCP Servers

Building MCP servers allows you to expose your custom logic to AI agents.

## FastMCP
FastMCP is a Python framework that makes building MCP servers as easy as FastAPI.

```python
from fastmcp import FastMCP

mcp = FastMCP("My Server")

@mcp.tool()
def calculate_tax(amount: float) -> float:
    """Calculate standard 20% tax"""
    return amount * 0.20

if __name__ == "__main__":
    mcp.run()
```

## MCP Inspector
Use the official MCP Inspector to test your server independently of any specific LLM client. It provides a UI to call tools and read resources.

---

