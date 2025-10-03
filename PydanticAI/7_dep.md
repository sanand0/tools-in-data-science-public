## What Are Dependencies?

**Dependencies** are external resources, data, or services that your AI agent needs to access during execution.

- Can be **any Python type**: databases, API clients, configuration, user context, etc.
- Passed to agents via **dependency injection** pattern
- Accessible in: system prompts, instructions, tools, and output validators

***


## Where Dependencies Are Used

| Component | Access Via | Use Case |
| :-- | :-- | :-- |
| **Instructions** | `@agent.instructions` decorator with `RunContext` | Dynamic, per-request context (user info, session data) |
| **System Prompts** | `@agent.system_prompt` decorator with `RunContext` | Runtime configuration (API keys, settings) |
| **Tools** | `@agent.tool` decorator with `RunContext` | External data fetching (DB queries, API calls) |
| **Output Validators** | `@agent.output_validator` with `RunContext` | Validation against external rules |


***

## Basic Syntax - Quick Example

```python
from dataclasses import dataclass
from pydantic_ai import Agent, RunContext

# 1. Define dependency container
@dataclass
class MyDeps:
    api_key: str
    user_name: str

# 2. Create agent with deps_type (type, not instance!)
agent = Agent('openai:gpt-4o', deps_type=MyDeps)

# 3. Access deps via RunContext in instructions/tools
@agent.instructions
def add_context(ctx: RunContext[MyDeps]) -> str:
    # Access via ctx.deps
    return f"User is {ctx.deps.user_name}, API key: {ctx.deps.api_key}"

@agent.tool
def get_data(ctx: RunContext[MyDeps], query: str) -> str:
    # Use deps in tools
    return f"Fetching {query} for {ctx.deps.user_name}"

# 4. Run with actual dependency instance
deps = MyDeps(api_key='secret123', user_name='Alice')
result = agent.run_sync('Help me', deps=deps)
```

**Key Points:**

- `deps_type=MyDeps` in agent creation (just the type)
- `ctx: RunContext[MyDeps]` in functions (for type safety)
- `ctx.deps.attribute` to access dependency values
- `deps=instance` when running the agent

***

## Instructions vs System Prompt with Dependencies

**Use with `instructions` (Recommended):**

- When each request has different context (different users, sessions)
- Dynamic dependencies that change per run
- Multi-agent systems with varying contexts

**Use with `system_prompt`:**

- When context is consistent across conversation
- Single agent maintaining state across turns

***

## Example 1: Customer Support with Dynamic Context (Using `instructions`)

### Scenario

Bank support agent that needs customer-specific information for each request.

```python
from dataclasses import dataclass
from pydantic import BaseModel
from pydantic_ai import Agent, RunContext

# 1. Define Dependencies Container
@dataclass
class SupportDependencies:
    customer_id: int
    db: DatabaseConn  # Database connection

# 2. Define Output Structure
class SupportOutput(BaseModel):
    support_advice: str
    block_card: bool
    risk: int

# 3. Create Agent with Dependencies Type
support_agent = Agent(
    'openai:gpt-4o',
    deps_type=SupportDependencies,  # ← Specify dependency type
    output_type=SupportOutput,
    instructions="You are a support agent. Reply using the customer's name."
)

# 4. Dynamic Instructions Using Dependencies
@support_agent.instructions
async def add_customer_name(ctx: RunContext[SupportDependencies]) -> str:
    # Access database through dependencies
    customer_name = await ctx.deps.db.customer_name(id=ctx.deps.customer_id)
    return f"The customer's name is {customer_name!r}"

# 5. Tool Using Dependencies
@support_agent.tool
async def customer_balance(
    ctx: RunContext[SupportDependencies], 
    include_pending: bool
) -> str:
    """Returns the customer's current account balance."""
    balance = await ctx.deps.db.customer_balance(
        id=ctx.deps.customer_id,
        include_pending=include_pending
    )
    return f'${balance:.2f}'

# 6. Run Agent with Specific Dependencies
deps = SupportDependencies(customer_id=123, db=DatabaseConn())
result = support_agent.run_sync('What is my balance?', deps=deps)
print(result.output)
# Output: support_advice='Hello John, your balance is $123.45.' 
#         block_card=False risk=1

# Different customer - fresh dependencies
deps2 = SupportDependencies(customer_id=456, db=DatabaseConn())
result2 = support_agent.run_sync('What is my balance?', deps=deps2)
# Gets Alice's information - clean context switch
```

**Why This Works:**

- Each customer gets **fresh dependencies** with their own context
- Database connection is shared but customer_id changes
- Instructions dynamically include the correct customer name
- Tools access the right customer's data

***

**Dependencies** enable agents to access external resources in a type-safe, testable way. Use them with `instructions` for dynamic, per-request context (like customer info), or with `system_prompt` for consistent, conversation-wide context (like API credentials).