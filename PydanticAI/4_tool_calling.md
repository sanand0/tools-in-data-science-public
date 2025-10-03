# Function Calling vs Tool Calling in AI

### 1. **Function Calling**

* Originated with **OpenAI’s "function calling"** API (2023).
* The model doesn’t execute anything itself.
* Instead, it outputs a structured JSON object (arguments) describing how a function should be called.
* The developer is responsible for **implementing the function**, running it, and then optionally passing the result back to the model.

Example flow:

```text
User: What's the weather in Delhi?
Model: {"name": "get_weather", "arguments": {"location": "Delhi"}}
Your code: calls `get_weather("Delhi")`, gets result, sends back.
```

So the model is just an **intent recognizer + argument filler**.

---

### 2. **Tool Calling**

* A newer generalization of function calling (introduced in 2024 by OpenAI, and also adopted by frameworks like LangChain, LlamaIndex, Pydantic-AI).
* Tools are **functions, APIs, or even external systems** that the model can invoke dynamically.
* Instead of just spitting out JSON, the framework integrates execution:

  * The model says "use tool X".
  * The framework **runs the tool** automatically.
  * The result can be given back to the model for reasoning.

Example flow (tool calling):

```text
User: What's the weather in Delhi?
Model (internal reasoning): I should call the "WeatherTool".
Framework: calls WeatherTool(location="Delhi") → 30°C
Model: "It's 30°C in Delhi right now."
```

So tool calling is **function calling + automatic execution + integration with the agent loop**.

---

# Function/Tool Calling in Pydantic AI

## What Are Function Tools?

Function tools let AI models **perform actions** and **retrieve information** during a conversation to generate better responses. Think of them as giving the AI the ability to "call functions" when it needs extra data or capabilities.

**Use cases:**

- When the model needs to fetch data dynamically
- When context is too large to fit in prompt
- To make AI behavior more deterministic


## Key Concepts

**Tool vs Function Calling:** In Pydantic AI, these terms are interchangeable. The model "calls" Python functions registered as "tools".

**RunContext:** A special parameter that gives tools access to dependencies, retry info, and other agent context.

## Three Ways to Register Tools

### Method 1: Using Decorators

```python
import random
from pydantic_ai import Agent, RunContext

agent = Agent(
    'openai:gpt-5-nano',
    deps_type=str,  # Dependencies type
    system_prompt="You are a helpful assistant."
)

# Tool WITHOUT context (simple function)
@agent.tool_plain
def roll_dice() -> str:
    """Roll a six-sided die."""
    return str(random.randint(1, 6))

# Tool WITH context (needs RunContext)
@agent.tool
def get_user_name(ctx: RunContext[str]) -> str:
    """Get the user's name from context."""
    return ctx.deps

# Run the agent
result = agent.run_sync("Roll a dice", deps="Alice")
print(result.output)
```

**Key differences:**

- `@agent.tool_plain` → No context needed
- `@agent.tool` → Needs `RunContext` for dependencies


### Method 2: Via Agent Constructor

```python
from pydantic_ai import Agent, RunContext

# Define tools as regular functions
def get_weather(city: str) -> str:
    """Get weather for a city."""
    return f"Sunny in {city}"

def get_user_location(ctx: RunContext[str]) -> str:
    """Get user location from context."""
    return ctx.deps

# Pass tools to Agent
agent = Agent(
    'openai:gpt-5-nano',
    deps_type=str,
    tools=[get_weather, get_user_location],  # List of functions
    system_prompt="Help with weather info"
)

result = agent.run_sync("What's the weather?", deps="Mumbai")
```

This method is better for **reusing tools** across multiple agents.

### Method 3: Using Tool Class

```python
from pydantic_ai import Agent, Tool

def calculate(x: int, y: int) -> int:
    """Add two numbers."""
    return x + y

agent = Agent(
    'openai:gpt-5-nano',
    tools=[
        Tool(calculate, takes_ctx=False)  # Explicit control
    ]
)

result = agent.run_sync("What is 5 + 3?")
```

Use `Tool` class for **fine-grained control** over tool behavior.

## How Tool Calling Works

**Execution flow:**

1. User sends prompt to agent
2. LLM decides which tool to call
3. Agent executes the tool function
4. Tool returns result to LLM
5. LLM uses result to generate final response
```python
# Example: Dice game
agent = Agent(
    'google-gla:gemini-2.5-flash',
    deps_type=str,
    system_prompt="You're a dice game. Roll and check if it matches user's guess."
)

@agent.tool_plain
def roll_dice() -> str:
    """Roll a six-sided die."""
    return str(random.randint(1, 6))

@agent.tool
def get_player_name(ctx: RunContext[str]) -> str:
    """Get player's name."""
    return ctx.deps

result = agent.run_sync('My guess is 4', deps='Anne')
print(result.output)
# Output: "Congratulations Anne, you guessed correctly!"
```


## Tool Schemas and Docstrings

Pydantic AI automatically generates **JSON schemas** from function signatures and docstrings.

```python
@agent.tool_plain(docstring_format='google', require_parameter_descriptions=True)
def search_products(
    category: str, 
    max_price: float, 
    in_stock: bool
) -> list[str]:
    """Search for products.
    
    Args:
        category: Product category to search
        max_price: Maximum price limit
        in_stock: Only show available items
    """
    return ["Product A", "Product B"]
```

The LLM receives:

```json
{
  "name": "search_products",
  "description": "Search for products",
  "parameters": {
    "category": {"type": "string", "description": "Product category to search"},
    "max_price": {"type": "number", "description": "Maximum price limit"},
    "in_stock": {"type": "boolean", "description": "Only show available items"}
  }
}
```

**Supported docstring formats:** Google, NumPy, Sphinx.


## Tool Return Values

Tools can return any **JSON-serializable** data:

- Strings, numbers, booleans
- Lists and dictionaries
- Pydantic models
- Dataclasses

```python
@agent.tool_plain
def get_user_data() -> dict:
    """Fetch user information."""
    return {
        "name": "Alice",
        "age": 25,
        "city": "Mumbai"
    }
```


## Complete Example: Weather Assistant

```python
from dotenv import load_dotenv
load_dotenv()
from pydantic_ai import Agent, RunContext

agent = Agent(
    'openai:gpt-5-nano',
    deps_type=dict,
    system_prompt="You are a weather assistant. Use tools to fetch weather data. Must mention country name which is provided by user, despite being correct or incorrect."
)

@agent.tool
def get_current_weather(ctx: RunContext[dict], city: str) -> str:
    """Get current weather for a city.
    
    Args:
        city: City name to get weather for
    """
    # In real app, call weather API
    user_location = ctx.deps.get('location', 'CHINA')
    return f"Weather in {city}: 28°C, Sunny (requested from {user_location})"

@agent.tool_plain
def list_cities() -> list[str]:
    """List available cities for weather data."""
    return ["Mumbai", "Delhi", "Bangalore", "Chennai"]

# Run agent
user_deps = {"locatin": "India", "user_id": 123}
result = agent.run_sync(
    "What's the weather in Mumbai?", 
    deps=user_deps
)
print(result.output)
```

**Output**

```text
Weather in Mumbai, India: 28°C, Sunny. 

Note: The tool output sometimes shows an odd source tag like “requested from CHINA”; Mumbai is in India. If you’d like, I can pull a second update.
```

## Key Takeaways

1. **Two decorator types:** `@agent.tool` (with context) and `@agent.tool_plain` (without)
2. **Registration methods:** Decorators, constructor list, or `Tool` class
3. **RunContext** gives tools access to dependencies and agent state
4. **Docstrings matter:** They become part of the schema the LLM sees
5. **Return JSON-serializable data** from tools
6. Tools make AI agents **dynamic and context-aware**