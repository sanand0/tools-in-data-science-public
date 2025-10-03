# Pydantic AI - Output Handling Guide

## Overview

The **Output** in Pydantic AI refers to the final value returned from running an agent. This can be plain text, structured data, or the result of a function called with arguments provided by the model.

```python
agent ==> AgentRunResult or StreamedRunResult
```


## Output Types

The `Agent` class constructor accepts an `output_type` argument that supports:

- **Simple scalar types**: `str`, `int`, `float`, `bool`
- **Pydantic models**: `BaseModel` subclasses
- **Dataclasses**: Python dataclasses
- **TypedDict**: Typed dictionaries
- **Functions**: Output functions that process model arguments
- **Lists/Unions**: Multiple output types (e.g., `[Fruit, Vehicle]`)

```python
Agent class
    -> output_type argument -> Pydantic models, dataclasses, typedict, function, list etc.
        -> agent = Agent('model-id', output_type=str)
        -> agent = Agent('model-id', output_type=split_into_words)
        -> agent = Agent('model-id', output_type=[Fruit, Vehicle]) # either fruit or vehicle
```

### Scalar Types

```python
from dotenv import load_dotenv
load_dotenv(dotenv_path='.env')

from pydantic_ai import Agent

agent1 = Agent('google-gla:gemini-2.5-flash', output_type=str) # default value is string
agent2 = Agent('google-gla:gemini-2.5-flash', output_type=int)

result1 = agent1.run_sync('hi how can i solve 54*10')
result2 = agent2.run_sync('hi how can i solve 54*10')

print("===Result1.output===")
print(result1.output)
print("===Result2.output===")
print(result2.output)
```

```text
===Result1.output===
Solving $54 \times 10$ is quite straightforward!

Here's how you do it:

1.  **The Rule for Multiplying by 10:** When you multiply a whole number by 10, you simply add one zero to the end of that number.        

2.  **Apply the Rule:**
    *   Your original number is 54.
    *   Add a zero to the end of 54.
    *   You get 540.

So, $54 \times 10 = 540$.
===Result2.output===
540
```

### Basic Example - Pydantic Model

```python
from pydantic import BaseModel
from pydantic_ai import Agent

class CityLocation(BaseModel):
    city: str
    country: str

agent = Agent('google-gla:gemini-1.5-flash', output_type=CityLocation)
result = agent.run_sync('Where were the olympics held in 2012?')
print(result.output)
# Output: city='London' country='United Kingdom'
```


### Multiple Output Types

```python
from dotenv import load_dotenv
load_dotenv(dotenv_path='.env')
from pydantic import BaseModel
from pydantic_ai import Agent

class Box(BaseModel):
    width: int
    height: int
    depth: int
    units: str

agent = Agent(
    'openai:gpt-5-nano',
    output_type=[Box, str],  # Either Box or str
    system_prompt=(
        "Extract box dimensions, "
        "if you can't extract all data, ask the user to try again."
    ),
)

result = agent.run_sync('The box is 10x20x30')
print(result.output, type(result.output))
# Output: "Please provide the units...", <class 'str'>

result = agent.run_sync('The box is 10x20x30 cm')
print(result.output, type(result.output))
# Output: Box(width=10, height=20, depth=30, units='cm'), <class '__main__.Box'>
```


## Output Functions

Output functions allow the model to call a function with arguments, and the function's return value becomes the agent's output.

### Simple Output Function

```python
from dotenv import load_dotenv
load_dotenv(dotenv_path='.env')

from pydantic_ai import Agent

def table_of(num: int) -> str:
    print("Number choose is:", num, type(num))
    r = ''
    for i in range(1,10):
        r += str(num*i) + ' '
    return r

agent = Agent('google-gla:gemini-2.5-flash', output_type=table_of)

result = agent.run_sync('hi how can i solve 5*3')

print(result.output)
# Number choose is: 15 <class 'int'>
# 15 30 45 60 75 90 105 120 135 
```


```python
from dotenv import load_dotenv
load_dotenv(dotenv_path='.env')

from pydantic_ai import Agent

def table_of(num: int) -> str:
    """Despite user input, model/llm will choose number 2"""
    print("Number choose is:", num, type(num))
    r = ''
    for i in range(1,10):
        r += str(num*i) + ' '
    return r

agent = Agent('google-gla:gemini-2.5-flash', output_type=table_of)

result = agent.run_sync('hi how can i solve 5*3')

print(result.output)
# Number choose is: 2 <class 'int'>
# 2 4 6 8 10 12 14 16 18 
```

**Learning**  
> Docstring are passed and interpereted by llm before responding.


### Output Function with Pydantic Model

```python
from dotenv import load_dotenv
load_dotenv(dotenv_path='.env')

from pydantic import BaseModel, Field
from pydantic_ai import Agent

class Fruit(BaseModel):
    name: str = Field(..., min_length=3, max_length=4)
    country: str = Field(
        description='Country short code (reversed) e.g., USA -> ASU'
    )

def format_fruit(f: Fruit) -> str:
    return f"{f.name} is from {f.country}"

agent = Agent('openai:gpt-5-nano', output_type=format_fruit)
result = agent.run_sync('The fruit Salak is commonly known as?')
print(result) # AgentRunResult(output='SNA is from NDI')
```


### Key Features of Output Functions

- Arguments are validated using Pydantic
- Can optionally take `RunContext` as first argument
- Can raise `ModelRetry` to ask the model to try again
- The result is **not** passed back to the model


## Output Validators

Add validation logic that requires IO or is asynchronous using the `@agent.output_validator` decorator.

```python
from pydantic import BaseModel
from pydantic_ai import Agent, RunContext, ModelRetry

class Success(BaseModel):
    sql_query: str

class InvalidRequest(BaseModel):
    error_message: str

agent = Agent('google-gla:gemini-1.5-flash', output_type=Success | InvalidRequest)

@agent.output_validator
async def validate_sql(ctx: RunContext, output: Success | InvalidRequest):
    if isinstance(output, InvalidRequest):
        return output
    
    try:
        await ctx.deps.execute(f'EXPLAIN {output.sql_query}')
    except QueryError as e:
        raise ModelRetry(f'Invalid query: {e}') from e
    else:
        return output
```


## Output Validator - A Good Example To Understand
```python
from dotenv import load_dotenv
load_dotenv(dotenv_path='.env')

from pydantic import BaseModel
from pydantic_ai import Agent, RunContext, ModelRetry

class ValidAge(BaseModel):
    age: int
    name: str

class InvalidAge(BaseModel):
    error: str

# Agent with union output type
agent = Agent(
    'openai:gpt-5-nano',
    output_type=ValidAge | InvalidAge, 
    system_prompt='Model Will always Extract person name and age from text, ValidAge is 0 to 200',
    retries=3
)

@agent.output_validator
async def validate_age(ctx: RunContext[None], output: ValidAge | InvalidAge):
    # If already an error, return it
    if isinstance(output, InvalidAge):
        return output
    
    # Check if age is reasonable (between 0 and 120)
    if (output.age < 0 or output.age > 100) and ctx.retry<2:
        # Ask model to try again
        print(f"retrying{ctx.retry} {output.age}")
        raise ModelRetry(
            f'What if my age is {output.age-1}'
        )
    if ctx.retry == 2:
        raise ModelRetry(
            f'What if my age is {output.age+100}'
        )  
    
    return output

# Usage
result = agent.run_sync('My name is John and I am 25 years old')
print(result.output)
print()
# Output: ValidAge(age=25, name='John')

result2 = agent.run_sync('My name is Alice and I am 105 years old')
print(result2.output, type(result2))
```

**Output**  
```text
age=25 name='John'

retrying0 105
retrying1 104
error='Invalid age: 203. Age must be between 0 and 200.' <class 'pydantic_ai.run.AgentRunResult'>
```

## Key Points

- Default output type is `str`
- Output is wrapped in `AgentRunResult` or `StreamedRunResult`
- Access usage data via `result.usage()`
- Output functions can raise `ModelRetry` for validation errors

