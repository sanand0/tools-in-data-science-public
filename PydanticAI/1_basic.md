# Pydantic-Ai

## Why Pydantic-Ai?

Llm output is generally unstructred. Getting structured output is often very lenghty process.  
Pydantic AI is useful because it bridges the gap between messy AI outputs and structured, safe, typed data—making AI-powered applications easier to build, debug, and trust.

## Installation

Requires **Python 3.10+**  
- **uv**: `uv add pydantic-ai`  
- **pip**: `pip install pydantic-ai`

## Messages Types in Chatbots

- **System Message**: Set the context, rules or persona for the conversation.
- **User Message**: What user ask to ai.
- **Assistance/Model Message**: What ai respond back to user.

## LLMs are Stateless

* The raw model (like GPT, Claude, Gemini etc.) is **stateless**.
* It **does not remember previous chats on its own**.
* Hence we must **send past messages again** in every request.


## Api key setup in Pydantic-AI

**Method-1: in .bashrc**

`.bashrc`
```bash
export OPENAI_API_KEY="your_api_key"
export GOOGLE_API_KEY="your_api_key"
export ANTHROPIC_API_KEY="your_api_key"


export OPENAI_BASE_URL="https://api.openai.com/v1"
# export OPENAI_BASE_URL=https://aipipe.org/openai/v1 # if aipipe token used
export GOOGLE_API_BASE_URL="https://generativelanguage.googleapis.com/v1beta"
export ANTHROPIC_BASE_URL="https://api.anthropic.com"
```

**Method-2: in main python file**  We avoide this method

```python
import os
os.environ["GOOGLE_API_KEY"] = "paste your api key here"
```

**Method-3: use .env file** We always try to use this method

`.env`
```text
GOOGLE_API_KEY=yourapikeyhere
```

`pythonfile`
```python
...
from dotenv import load_dotenv
load_dotenv()
...
```

## Example:1 Just ask to ai

`.env`
```text
# Google Api key from --> https://aistudio.google.com/apikey
GOOGLE_API_KEY=your-api-key
```

`main.py`
```python
from pydantic_ai import Agent

from dotenv import load_dotenv
load_dotenv() # make sure in .env => GOOGLE_API_KEY=your-api-key

agent = Agent(
    model="gemini-2.5-flash",
    system_prompt="You answer within one small sentence with a small reason."
)

user_prompt1 = "Note, My name is Hritik."
user_prompt2 = "What is my name?"

result1 = agent.run_sync(user_prompt1) # return type is RunResult
result2 = agent.run_sync(user_prompt2)

print(result1.output)
print(result2.output)
```

**Output**
```text
❯ uv run main.py
Noted, Hritik, for future reference.
I don't know your name because I don't retain information from past conversations.
```

### RunResult methods
- `all_messages()` and `all_messages_json()`
- `new_messages()` and `new_messages_json()`

```text
[ ModelRequest(...), ModelResponse(...), ...]

ModelRequest( parts = [SystemPromptpart, UserPromptPart] )
ModelReponse( parts = [TextPart] )
```

### `Agent.run` vs `Agent.run_sync`

1. **Agent.run()**: asynchornous & returns `RunResult` where response is wrapped.
2. **Agent.run_sync()**: synchornous & returns `RunResult` where response is wrapped.

## Example:2 Just ask to ai with history

```{.python .no-execute hl_lines="1 13 14"}
from pydantic_ai import Agent

from dotenv import load_dotenv
load_dotenv() # make sure in .env => GOOGLE_API_KEY=your-api-key

agent = Agent(
    model="gemini-2.5-flash",
    system_prompt="You answer within one small sentence with a small reason."
)

user_prompt1 = "Note, My name is Hritik"
user_prompt2 = "What did I say my name was?"
user_prompt3 = "List down all the things that i asked/told you?"

result1 = agent.run_sync(user_prompt1)
result2 = agent.run_sync(user_prompt2, message_history=result1.new_messages())
result3 = agent.run_sync(user_prompt3, message_history=result2.new_messages())


print(result1.output)
print(result2.output)
print(result3.output)

# print(result1.all_messages()) # [ModelRequest(parts=[systemprompt, userprompt]), ModelResponse(parts=[Textpart]) ]
# print(result2.all_messages()) # [ModelRequest(parts=[userprompt]), ModelResponse(parts=[Textpart]), ... ]
# print(result3.all_messages())

# print(result3.new_messages()) # [ModelRequest(parts=[userprompt]), ModelResponse(parts=[Textpart]) ]
```

**Output**

```text
Okay, Hritik, I've noted your name to personalize our conversation.
Your name is Hritik, as you just mentioned it to me.
Based on our current conversation, here are the things you have asked/told me:

1.  "What did I say my name was?"
2.  "List down all the things that i asked/told you?"
...
```