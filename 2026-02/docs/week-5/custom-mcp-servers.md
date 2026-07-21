# Custom MCP Servers

> A **custom MCP server** exposes your own functions or data to compatible AI applications.

Build one when the same capability should work in several AI hosts. For one small application, a normal function may be simpler.

## Short video

[![Python + FastMCP Tutorial — Eugen Bondarev (11 min, October 2025)](https://img.youtube.com/vi/Xxo0MA44zxs/0.jpg)](https://youtu.be/Xxo0MA44zxs "Python + FastMCP Tutorial — Eugen Bondarev")

## Development flow

```mermaid
flowchart LR
    I[Choose one capability] --> B[Build server]
    B --> T[Test with Inspector]
    T --> C[Connect AI host]
    C --> O[Observe and improve]
```

## Small Python server

This uses the official MCP Python SDK. On 22 July 2026, v1 is stable and v2 is still pre-release.

```bash
uv init calculator-mcp
cd calculator-mcp
uv add "mcp[cli]>=1,<2"
```

```python
# server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("calculator")

@mcp.tool()
def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b

if __name__ == "__main__":
    mcp.run()  # local stdio server
```

The function name, type hints, and docstring help create the tool definition.

## Test it

```bash
npx -y @modelcontextprotocol/inspector \
  uv --directory "$PWD" run server.py
```

The Inspector lets you list and call tools before connecting a real AI host.

## Tools, resources, and prompts

```text
@mcp.tool()                 # model can request an action
@mcp.resource("note://1") # application can read data
@mcp.prompt()               # user can select a template
```

Add only the features the server actually needs.

## Practical rules

- Make every tool small and clearly named.
- Validate values inside the function.
- Do not expose a general unrestricted shell tool.
- Keep secrets in environment variables or a secret manager.
- For stdio, write protocol messages to stdout and logs to stderr.
- Require authentication, TLS, and scopes for remote HTTP servers.
- Ask for confirmation before destructive or public actions.
- Pin SDK versions and test before upgrading.

### Design the contract before the server

Write down one capability as a contract before writing Python:

```text
Tool: get_invoice(invoice_id)
Input: invoice_id is a non-empty string the caller may access
Output: invoice number, status, amount, currency, and issued date
Errors: NOT_FOUND, FORBIDDEN, INVALID_ARGUMENT, TEMPORARY_FAILURE
Side effect: none
```

This makes the boundary clear to the model, host, and developer. A tool should
return useful structured data, not a paragraph intended only for a human. The
host can turn that data into a friendly answer later.

### Resources versus tools

Use a **resource** for data that is safe to read and has a stable identifier:
for example `docs://handbook/leave-policy` or `invoice://123`. Use a **tool**
when a request needs parameters, computation, authorization, or a side effect.
For example, `search_handbook(query)` is a tool because it accepts a query;
`docs://handbook/index` can be a resource.

Keep resource contents concise. Returning a whole private database dump gives
the model more data than it needs and makes prompt-injection review harder.

### Authentication and authorization

Authentication answers “who is connected?” Authorization answers “may this
identity perform this exact operation?” Remote servers should make both checks
inside the server or the service it calls. Do not rely on a tool description
such as “admins only.”

Use narrow scopes such as `invoices:read` or `issues:write`, associate every
call with an identity, and re-check access for each tenant or record. Never
place a long-lived provider token in a tool result.

### Errors and observability

Return safe, actionable errors. `INVALID_ARGUMENT: date must be YYYY-MM-DD` is
better than a stack trace; a stack trace can reveal internal paths or secrets.
Log a request ID, tool name, caller identity, latency, outcome, and safe input
summary. Redact secrets and sensitive fields. These logs make it possible to
debug a bad tool call without storing an entire private conversation.

### Test cases worth keeping

- Valid call returns the documented shape.
- Missing or malformed input is rejected.
- A user from another tenant receives `FORBIDDEN` or no record.
- A downstream timeout returns a retryable safe error.
- A destructive tool requires the expected confirmation value.
- The server writes no protocol logs to stdout in stdio mode.

Start with one read-only tool, test it in Inspector, then add capabilities only
when a real user task needs them.

## References

- [Official MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [MCP server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [MCP transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
