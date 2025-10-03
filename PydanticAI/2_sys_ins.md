# Agent System Prompt vs Instruction

```python
from dotenv import load_dotenv
from pprint import pprint
load_dotenv()

from pydantic_ai import Agent

print("=" * 80)
print("SCENARIO 1: Using system_prompt")
print("=" * 80)

# Agent 1: Sales (system_prompt)
sales_agent = Agent(
    'openai:gpt-5-nano',
    system_prompt="You are a SALES agent. Always mention 'premium features'. Reply in short"
)

# Agent 2: Support (system_prompt)
support_agent = Agent(
    'openai:gpt-5-nano',
    system_prompt="You are a SUPPORT agent. Always say 'let me help you troubleshoot'. Reply in short"
)

# Customer talks to sales first
result1 = sales_agent.run_sync('I want to buy something')
print("\n[Sales Response]:", result1.output)

# Customer is transferred to support WITH HISTORY
result2 = support_agent.run_sync(
    'How do I use it?',
    message_history=result1.new_messages()
)
print("\n[Support Response]:", result2.output)

print("\n[MESSAGE HISTORY - What support_agent sees]:")
print(result2.all_messages())


print("\n" + "=" * 80)
print("SCENARIO 2: Using instructions")
print("=" * 80)

# Agent 1: Sales (instructions)
sales_agent2 = Agent(
    'openai:gpt-5-nano',
    instructions="You are a SALES agent. Always mention 'premium features'. Reply in short"
)

# Agent 2: Support (instructions)
support_agent2 = Agent(
    'openai:gpt-5-nano',
    instructions="You are a SUPPORT agent. Always say 'let me help you troubleshoot'. Reply in short"
)

# Customer talks to sales first
result3 = sales_agent2.run_sync('I want to buy something')
print("\n[Sales Response]:", result3.output)

# Customer is transferred to support WITH HISTORY
result4 = support_agent2.run_sync(
    'How do I use it?',
    message_history=result3.new_messages()
)
print("\n[Support Response]:", result4.output)

print("\n[MESSAGE HISTORY - What support_agent2 sees]:")
print(result4.all_messages())
```

**Output**

```text

================================================================================
SCENARIO 1: Using system_prompt
================================================================================

[Sales Response]: Great—what are you looking to buy? We offer premium features that enhance value. Tell me your category (electronics, home, fashion, etc.), budget, and must-haves, and I’ll suggest the best options.

[Support Response]: Happy to help. Here’s a quick generic setup:

- Unbox, charge/assemble.
- Power on and install the companion app (or connect via Bluetooth).
- Create or sign in to your account.
- Add the device in the app and connect to Wi‑Fi or your network.
- Follow the on-screen setup and any firmware updates.
- Explore basic functions, then enable premium features in the app for enhanced controls, automation, and insights.

Tell me the exact product category and model, and I’ll give you a precise, step-by-step guide.

[MESSAGE HISTORY - What support_agent sees]:
[ModelRequest(parts=[SystemPromptPart(content="You are a SALES agent. Always mention 'premium features'. Reply in short", timestamp=datetime.datetime(2025, 9, 30, 15, 53, 58, 277426, tzinfo=datetime.timezone.utc)), UserPromptPart(content='I want to buy something', timestamp=datetime.datetime(2025, 9, 30, 15, 53, 58, 277430, tzinfo=datetime.timezone.utc))]),
 ModelResponse(parts=[TextPart(content='Great—what are you looking to buy? We offer premium features that enhance value. Tell me your category (electronics, home, fashion, etc.), budget, and must-haves, and I’ll suggest the best options.')], usage=RequestUsage(input_tokens=30, output_tokens=310, details={'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 256, 'rejected_prediction_tokens': 0}), model_name='gpt-5-nano-2025-08-07', timestamp=datetime.datetime(2025, 9, 30, 15, 54, 14, tzinfo=TzInfo(UTC)), provider_name='openai', provider_details={'finish_reason': 'stop'}, provider_response_id='chatcmpl-CLWy6UwXqvokulygAYkxKjmC6WzE3', finish_reason='stop'),
 ModelRequest(parts=[UserPromptPart(content='How do I use it?', timestamp=datetime.datetime(2025, 9, 30, 15, 54, 4, 37086, tzinfo=datetime.timezone.utc))]),
 ModelResponse(parts=[TextPart(content='Happy to help. Here’s a quick generic setup:\n\n- Unbox, charge/assemble.\n- Power on and install the companion app (or connect via Bluetooth).\n- Create or sign in to your account.\n- Add the device in the app and connect to Wi‑Fi or your network.\n- Follow the on-screen setup and any firmware updates.\n- Explore basic functions, then enable premium features in the app for enhanced controls, automation, and insights.\n\nTell me the exact product category and model, and I’ll give you a precise, step-by-step guide.')], usage=RequestUsage(input_tokens=91, output_tokens=698, details={'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 576, 'rejected_prediction_tokens': 0}), model_name='gpt-5-nano-2025-08-07', timestamp=datetime.datetime(2025, 9, 30, 15, 54, 18, tzinfo=TzInfo(UTC)), provider_name='openai', provider_details={'finish_reason': 'stop'}, provider_response_id='chatcmpl-CLWyA0pLXAMfEjZBjWLlMKtWUv7rF', finish_reason='stop')]

================================================================================
SCENARIO 2: Using instructions
================================================================================

[Sales Response]: Awesome—what would you like to buy? Tell me the category, budget, and any must-haves, and I’ll suggest options with premium features and help you compare.

[Support Response]: let me help you troubleshoot. Which product is it and what part is unclear? In general: 1) charge/power on, 2) install/open the companion app, 3) connect (Bluetooth/Wi‑Fi) and sign in, 4) follow the setup wizard, 5) run a quick task and adjust settings. Tell me the model for exact steps.

[MESSAGE HISTORY - What support_agent2 sees]:
[ModelRequest(parts=[UserPromptPart(content='I want to buy something', timestamp=datetime.datetime(2025, 9, 30, 15, 54, 11, 804367, tzinfo=datetime.timezone.utc))], instructions="You are a SALES agent. Always mention 'premium features'. Reply in short"),
 ModelResponse(parts=[TextPart(content='Awesome—what would you like to buy? Tell me the category, budget, and any must-haves, and I’ll suggest options with premium features and help you compare.')], usage=RequestUsage(input_tokens=30, output_tokens=364, details={'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 320, 'rejected_prediction_tokens': 0}), model_name='gpt-5-nano-2025-08-07', timestamp=datetime.datetime(2025, 9, 30, 15, 54, 26, tzinfo=TzInfo(UTC)), provider_name='openai', provider_details={'finish_reason': 'stop'}, provider_response_id='chatcmpl-CLWyIyogmima2hoadH0i1gQyhuu0I', finish_reason='stop'),
 ModelRequest(parts=[UserPromptPart(content='How do I use it?', timestamp=datetime.datetime(2025, 9, 30, 15, 54, 16, 410786, tzinfo=datetime.timezone.utc))], instructions="You are a SUPPORT agent. Always say 'let me help you troubleshoot'. Reply in short"),
 ModelResponse(parts=[TextPart(content='let me help you troubleshoot. Which product is it and what part is unclear? In general: 1) charge/power on, 2) install/open the companion app, 3) connect (Bluetooth/Wi‑Fi) and sign in, 4) follow the setup wizard, 5) run a quick task and adjust settings. Tell me the model for exact steps.')], usage=RequestUsage(input_tokens=84, output_tokens=791, details={'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 704, 'rejected_prediction_tokens': 0}), model_name='gpt-5-nano-2025-08-07', timestamp=datetime.datetime(2025, 9, 30, 15, 54, 30, tzinfo=TzInfo(UTC)), provider_name='openai', provider_details={'finish_reason': 'stop'}, provider_response_id='chatcmpl-CLWyMvMtLq1sxyCJXVMjjrI7TGzbl', finish_reason='stop')]

```

### SCENARIO 1: Using `system_prompt`

**What's in the message history:**

```python
ModelRequest(
    parts=[
        SystemPromptPart(content="You are a SALES agent..."),  # ← Sales prompt
        UserPromptPart(content='I want to buy something')
    ]
)
ModelResponse(...)
ModelRequest(
    parts=[
        UserPromptPart(content='How do I use it?')  # ← NO support system prompt!
    ]
)
ModelResponse(...)
```

**Key observations:**

1. Sales agent's `SystemPromptPart` is visible in history 
2. Support agent's system prompt is **NOT generated** at all 
3. Only the OLD sales system prompt exists in the conversation

***

### SCENARIO 2: Using `instructions`

**What's in the message history:**

```python
ModelRequest(
    parts=[UserPromptPart(content='I want to buy something')],
    instructions="You are a SALES agent..."  # ← Sales instructions as METADATA
)
ModelResponse(...)
ModelRequest(
    parts=[UserPromptPart(content='How do I use it?')],
    instructions="You are a SUPPORT agent..."  # ← NEW Support instructions as METADATA
)
ModelResponse(...)
```

**Key observations:**

1. No `SystemPromptPart` in the parts list at all
2. Instructions appear as a **separate field** on `ModelRequest` (not as a part)
3. BOTH sales instructions AND support instructions are visible in the history
4. Each `ModelRequest` has its own `instructions` field

***

## The Critical Difference Explained

### With `system_prompt`:

**Storage**: `SystemPromptPart` inside the `parts` list of `ModelRequest`

**Behavior with message_history**:

- When you provide `message_history`, Pydantic AI says: "There's already a SystemPromptPart in the history, so I won't generate a new one"
- Result: Support agent **doesn't add its own system prompt**
- Problem: Support agent is constrained by the OLD sales system prompt

**From documentation:**  
> "If `message_history` is set and not empty, a new system prompt is not generated — we assume the existing message history includes a system prompt."

***

### With `instructions`:

**Storage**: `instructions` field as **metadata** on the `ModelRequest` object (not in `parts`)

**Behavior with message_history**:

- Instructions are stored SEPARATELY from the message parts
- Each agent adds its OWN instructions to its `ModelRequest`
- Old instructions remain visible in history BUT as metadata
- New instructions are ALWAYS added for the current agent

**Key insight**: Instructions don't get "filtered out" — they're just stored differently. Both old and new instructions exist in the history, but as separate metadata fields on their respective requests.

**From documentation:**  
> "When an explicit message_history is provided, instructions from any existing messages in the history are NOT included in the request to the model — only the instructions of the current agent are included."

***

## The Bottom Line

**Use `instructions`** because:

- Each agent **always gets its own instructions** field, even with message_history
- No risk of the second agent being "stuck" with the first agent's guidance
- Cleaner data structure (metadata vs content)

**Use `system_prompt`** only when:

- You want a single agent to maintain one consistent role across a long conversation
- You don't need to change the system guidance mid-conversation

Thank you for providing the actual output — this clarified everything! The key insight is that `instructions` are stored as **metadata**, not as message parts.