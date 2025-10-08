## Pydantic AI

[Pydantic](https://docs.pydantic.dev/) is Python's most widely used data validation library. [Pydantic AI](https://ai.pydantic.dev/) extends this to build production-grade AI agents with structured outputs and type safety.

### What's Pydantic?

Python doesn't enforce type hints at runtime. Pydantic validates data automatically using type annotations:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic"]
# ///

from pydantic import BaseModel, Field

class User(BaseModel):
    name: str
    age: int = Field(..., gt=0, le=120)
    email: str

# Automatic validation and type conversion
user = User(name="Alice", age="25", email="alice@example.com")
print(user.age, type(user.age))  # 25 <class 'int'>

# Invalid data raises ValidationError
try:
    User(name="Bob", age=-5, email="invalid")
except Exception as e:
    print(f"Validation failed: {e}")
```

Pydantic is used by FastAPI, LangChain, the OpenAI SDK, and 8,000+ packages on PyPI. It's fast (core written in Rust), integrates with IDEs, and generates JSON schemas automatically.

### Pydantic Basics

**Field constraints** validate data beyond types:

```python
from pydantic import BaseModel, Field, EmailStr

class Product(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    price: float = Field(..., gt=0)
    email: EmailStr  # Validates email format
    quantity: int = Field(default=0, ge=0)

product = Product(
    name="Widget",
    price="19.99",  # Converted to float
    email="shop@example.com"
)
print(product.model_dump())
# {'name': 'Widget', 'price': 19.99, 'email': 'shop@example.com', 'quantity': 0}
```

**Nested models** handle complex structures:

```python
from pydantic import BaseModel

class Address(BaseModel):
    city: str
    country: str

class Customer(BaseModel):
    name: str
    address: Address

customer = Customer(
    name="Alice",
    address={"city": "London", "country": "UK"}
)
print(customer.address.city)  # London
```

### What's Pydantic AI?

Pydantic AI brings type-safe AI agent development with structured outputs, tool calling, and dependency injection. Built by the Pydantic team, it works with OpenAI, Anthropic, Google Gemini, Groq, and other providers.

Watch this Pydantic AI Tutorial (33 min):

[![How to Build AI Agents with PydanticAI (Beginner Tutorial) (33 min)](https://i.ytimg.com/vi/zcYtSckecD8/sddefault.jpg)](https://youtu.be/zcYtSckecD8)

Here's a minimal example:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic-ai"]
# ///

from pydantic_ai import Agent

# Create an agent with any supported model
agent = Agent('openai:gpt-4o-mini')

# Run synchronously
result = agent.run_sync('What is the capital of France?')
print(result.output)
# Paris
```

Set your API key in the environment:

```bash
export OPENAI_API_KEY="your-api-key-here"
```

Or use a `.env` file:

```bash
pip install python-dotenv
```

```python
# .env file:
# OPENAI_API_KEY=your-api-key-here

from dotenv import load_dotenv
load_dotenv()

from pydantic_ai import Agent
agent = Agent('openai:gpt-4o-mini')
```

### Structured Outputs

The power of Pydantic AI is in structured, validated responses:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic-ai"]
# ///

from pydantic import BaseModel
from pydantic_ai import Agent

class CityInfo(BaseModel):
    city: str
    country: str
    population: int

agent = Agent('openai:gpt-4o-mini', output_type=CityInfo)

result = agent.run_sync('Tell me about Tokyo')
print(result.output)
# city='Tokyo' country='Japan' population=14000000
print(type(result.output))
# <class '__main__.CityInfo'>
```

The model's response is automatically validated and converted to the Pydantic model. Invalid responses trigger retry with error feedback.

### Multiple Output Types

Handle different response scenarios:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic-ai"]
# ///

from pydantic import BaseModel
from pydantic_ai import Agent

class WeatherData(BaseModel):
    location: str
    temperature: float
    conditions: str

agent = Agent(
    'openai:gpt-4o-mini',
    output_type=[WeatherData, str],  # Either structured data or error message
    system_prompt='Provide weather data when available, or explain why you cannot.'
)

# Complete data available
result1 = agent.run_sync('Weather in London: 15°C, cloudy')
print(result1.output)
# location='London' temperature=15.0 conditions='cloudy'

# Incomplete data
result2 = agent.run_sync('Weather in London')
print(result2.output)
# "I don't have current weather data..."
```

### Tool Calling

Give agents access to functions for dynamic data:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic-ai"]
# ///

from pydantic_ai import Agent

agent = Agent(
    'openai:gpt-4o-mini',
    system_prompt='You help with weather queries using available tools.'
)

@agent.tool_plain
def get_weather(city: str) -> str:
    """Get current weather for a city."""
    # In production, call a real weather API
    return f"Weather in {city}: 22°C, sunny"

@agent.tool_plain
def list_cities() -> list[str]:
    """List cities with weather data available."""
    return ["London", "Paris", "Tokyo", "New York"]

result = agent.run_sync('What is the weather in Paris?')
print(result.output)
# The weather in Paris is 22°C and sunny.
```

The agent automatically:

1. Decides which tool to call
2. Executes the function
3. Uses the result in its response

**Tool with validation:**

```python
from pydantic import Field

@agent.tool_plain
def search_products(
    category: str,
    max_price: float = Field(..., gt=0),
    in_stock: bool = True
) -> list[str]:
    """Search products by category and price.

    Args:
        category: Product category to search
        max_price: Maximum price in dollars
        in_stock: Only show available items
    """
    return [f"Product in {category} under ${max_price}"]
```

Pydantic validates tool arguments before execution. Invalid arguments trigger automatic retry.

### Dependencies and Context

Pass runtime data to agents using dependency injection:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic-ai"]
# ///

from dataclasses import dataclass
from pydantic_ai import Agent, RunContext

@dataclass
class UserContext:
    user_id: int
    name: str

agent = Agent(
    'openai:gpt-4o-mini',
    deps_type=UserContext
)

@agent.instructions
def add_user_context(ctx: RunContext[UserContext]) -> str:
    return f"The user's name is {ctx.deps.name}"

@agent.tool
def get_user_data(ctx: RunContext[UserContext]) -> str:
    """Get user information."""
    return f"User {ctx.deps.name} (ID: {ctx.deps.user_id})"

# Run with specific user context
deps = UserContext(user_id=123, name="Alice")
result = agent.run_sync('What is my user ID?', deps=deps)
print(result.output)
# Your user ID is 123, Alice.
```

Dependencies are type-safe and can include database connections, API clients, or configuration.

### Message History

Maintain conversation context:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic-ai"]
# ///

from pydantic_ai import Agent

agent = Agent('openai:gpt-4o-mini')

result1 = agent.run_sync('My name is Alice')
print(result1.output)
# Hello Alice! How can I help you?

result2 = agent.run_sync(
    'What did I say my name was?',
    message_history=result1.new_messages()
)
print(result2.output)
# You said your name is Alice.
```

Use `new_messages()` to get only the latest exchange, or `all_messages()` for the full conversation.

### System Prompts vs Instructions

**System prompts** set persistent context:

```python
agent = Agent(
    'openai:gpt-4o-mini',
    system_prompt='You are a helpful assistant. Be concise.'
)
```

**Instructions** are dynamic and per-request:

```python
@agent.instructions
def dynamic_instructions(ctx: RunContext) -> str:
    return f"Current user: {ctx.deps.username}"
```

Use `instructions` when context changes per request (different users, sessions). Use `system_prompt` for consistent agent behavior.

### Output Validators

Add custom validation with external checks:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic-ai"]
# ///

from pydantic import BaseModel
from pydantic_ai import Agent, RunContext, ModelRetry

class Age(BaseModel):
    age: int
    name: str

agent = Agent('openai:gpt-4o-mini', output_type=Age)

@agent.output_validator
async def validate_age(ctx: RunContext, output: Age) -> Age:
    if output.age < 0 or output.age > 120:
        raise ModelRetry(f'Age {output.age} seems unrealistic. Please verify.')
    return output

result = agent.run_sync('John is 150 years old')
print(result.output)
# After retry: age=50 name='John' (model corrects itself)
```

Validators can query databases, call APIs, or perform complex checks. Raising `ModelRetry` asks the model to try again with feedback.

### Multimodal Input

Process images, audio, video, and documents:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic-ai"]
# ///

from pydantic_ai import Agent, ImageUrl
from pathlib import Path

agent = Agent('openai:gpt-4o-mini')

# From URL
result = agent.run_sync([
    'What company is this?',
    ImageUrl(url='https://example.com/logo.png')
])

# From local file
from pydantic_ai import BinaryContent
image_data = Path('logo.png').read_bytes()

result = agent.run_sync([
    'Describe this image',
    BinaryContent(data=image_data, media_type='image/png')
])
```

Supports: `ImageUrl`, `AudioUrl`, `VideoUrl`, `DocumentUrl` and `BinaryContent` for local files.

### Web Search

Enable real-time information retrieval:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic-ai"]
# ///

from pydantic_ai import Agent, WebSearchTool

agent = Agent(
    'gemini-2.5-flash',
    builtin_tools=[WebSearchTool()]
)

result = agent.run_sync('What is the current price of Bitcoin?')
print(result.output)
# Bitcoin is currently trading at $X,XXX USD (real-time data)
```

The agent automatically searches the web when it needs current information.

### Model Support

Pydantic AI works with multiple providers:

```python
# OpenAI
agent = Agent('openai:gpt-4o')

# Anthropic
agent = Agent('anthropic:claude-sonnet-4-0')

# Google Gemini
agent = Agent('gemini-2.5-flash')

# Groq
agent = Agent('groq:llama-3.1-70b-versatile')

# Ollama (local)
agent = Agent('ollama:llama3.2')
```

### Testing Agents

Use test models for unit tests:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["pydantic-ai"]
# ///

from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.test import TestModel

class Response(BaseModel):
    answer: str

# Create test model with predefined responses
test_model = TestModel()
agent = Agent(test_model, output_type=Response)

# Run test
result = agent.run_sync('test question')
print(result.output)
# answer='test response'
```

TestModel provides predictable outputs for testing without API calls.

### Key Concepts

1. **Type Safety**: Full type hints for IDE support and static analysis
2. **Structured Outputs**: Guaranteed valid Pydantic models from LLM responses
3. **Tool Calling**: Give agents access to functions and external data
4. **Dependencies**: Type-safe dependency injection for runtime context
5. **Validation**: Automatic validation with custom validators
6. **Model Agnostic**: Works with OpenAI, Anthropic, Google, Groq, and more
7. **Observability**: Built-in Pydantic Logfire integration for monitoring

### Resources

- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Pydantic AI Documentation](https://ai.pydantic.dev/)
- [Pydantic AI Examples](https://ai.pydantic.dev/examples/setup/)
- [Pydantic GitHub](https://github.com/pydantic/pydantic)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
