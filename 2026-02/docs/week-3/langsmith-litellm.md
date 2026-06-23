# LangSmith & LiteLLM

Two tools that give you **visibility and control** over your LLM API usage:

- **LangSmith** — trace every LLM call: see inputs, outputs, latency, cost per call
- **LiteLLM** — one API to call 100+ LLM providers; built-in spend tracking and budget limits

---

## LangSmith

LangSmith is an observability platform for LLM applications. Every call is logged as a trace — you see exactly what prompt went in, what came out, how long it took, and what it cost.

### Setup

```bash
uv add langsmith openai anthropic
```

```bash title=".env"
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls__your-langsmith-api-key
LANGCHAIN_PROJECT=tds-week-3
```

Get your API key from [smith.langchain.com](https://smith.langchain.com) → Settings → API Keys.

### Trace OpenAI Calls with @traceable

```python
import os
from langsmith import traceable
from openai import OpenAI

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "ls__..."
os.environ["LANGCHAIN_PROJECT"] = "tds-week-3"

client = OpenAI()

@traceable(name="summarize_document")
def summarize(text: str, max_words: int = 100) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=max_words * 2,
        messages=[
            {"role": "system", "content": "Summarize the given text concisely."},
            {"role": "user", "content": text},
        ],
    )
    return response.choices[0].message.content

# This call appears in LangSmith with full trace
result = summarize("Python is a high-level programming language...")
print(result)
```

All calls to `summarize()` now appear in LangSmith with:
- Input: the `text` argument
- Output: the returned summary
- Token usage and cost
- Latency

### Trace Anthropic Calls

```python
from anthropic import Anthropic
from langsmith.wrappers import wrap_anthropic

# Wrap the client — all calls automatically traced
client = wrap_anthropic(Anthropic())

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=256,
    messages=[{"role": "user", "content": "Explain Docker briefly."}],
)
# → automatically logged in LangSmith
```

### Trace a Multi-Step Pipeline

```python
from langsmith import traceable

@traceable(name="classify_and_extract")
def classify_ticket(ticket_text: str) -> dict:
    """Multi-step: classify category, then extract details."""

    # Step 1: classify
    category = _classify(ticket_text)

    # Step 2: extract based on category
    details = _extract_details(ticket_text, category)

    return {"category": category, "details": details}

@traceable(name="classify_category")
def _classify(text: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=20,
        messages=[
            {"role": "system", "content": "Classify as: BUG, FEATURE, or QUESTION"},
            {"role": "user", "content": text},
        ],
    )
    return response.choices[0].message.content.strip()

@traceable(name="extract_details")
def _extract_details(text: str, category: str) -> dict:
    # ... extraction logic
    pass

# LangSmith shows the full call tree:
# classify_and_extract
#   ├── classify_category
#   └── extract_details
result = classify_ticket("The login button doesn't work on mobile")
```

### Adding Metadata and Tags

```python
@traceable(
    name="generate_response",
    tags=["production", "v1.2"],
    metadata={"environment": "prod", "user_tier": "premium"},
)
def generate(prompt: str, user_id: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
        extra_body={
            "metadata": {"ls_user_id": user_id}  # track per-user costs
        }
    )
    return response.choices[0].message.content
```

### Querying the LangSmith API

```python
from langsmith import Client

ls_client = Client()

# Get all runs in your project
runs = list(ls_client.list_runs(
    project_name="tds-week-3",
    run_type="llm",   # only LLM calls
    limit=100,
))

# Compute total cost
total_tokens = sum(
    r.total_tokens or 0
    for r in runs
    if r.total_tokens
)

# Group by model
from collections import defaultdict
by_model = defaultdict(lambda: {"calls": 0, "tokens": 0})
for run in runs:
    model = run.extra.get("invocation_params", {}).get("model", "unknown")
    by_model[model]["calls"] += 1
    by_model[model]["tokens"] += run.total_tokens or 0

for model, stats in sorted(by_model.items()):
    print(f"{model}: {stats['calls']} calls, {stats['tokens']:,} tokens")
```

---

## LiteLLM

LiteLLM is an **AI gateway** — a unified interface to 100+ LLM providers. One API format, any model. Built-in spend tracking, rate limiting, and fallback routing.

### Install and Basic Usage

```bash
uv add litellm
```

```python
import litellm

# Call any model with the same interface
# LiteLLM translates to each provider's native API format

# OpenAI
response = litellm.completion(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}],
)

# Anthropic — same code!
response = litellm.completion(
    model="anthropic/claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Hello!"}],
)

# Google Gemini — same code!
response = litellm.completion(
    model="gemini/gemini-2.0-flash",
    messages=[{"role": "user", "content": "Hello!"}],
)

# Local Ollama — same code!
response = litellm.completion(
    model="ollama/llama3.2",
    messages=[{"role": "user", "content": "Hello!"}],
)

# Response always has the same structure:
print(response.choices[0].message.content)
print(response.usage.total_tokens)
```

### Spend Tracking

```python
import litellm

# Enable spend tracking
litellm.success_callback = ["langsmith"]   # send to LangSmith

# Or track locally
def track_spend(kwargs, completion_response, start_time, end_time):
    cost = litellm.completion_cost(completion_response=completion_response)
    model = kwargs["model"]
    duration = (end_time - start_time).total_seconds()
    print(f"Model: {model} | Cost: ${cost:.6f} | Time: {duration:.2f}s")

litellm.success_callbacks = [track_spend]

# Now every call is automatically tracked
response = litellm.completion(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "What is 2+2?"}],
)
# → Model: gpt-4o-mini | Cost: $0.000012 | Time: 0.43s
```

### Fallback Routing

```python
import litellm

# If the primary model fails, fall back to alternatives
response = litellm.completion(
    model="anthropic/claude-sonnet-4-6",
    messages=[{"role": "user", "content": "Explain recursion."}],
    fallbacks=["gpt-4o-mini", "ollama/llama3.2"],  # try these if primary fails
    num_retries=2,
)
```

### LiteLLM Proxy Server (AI Gateway)

The proxy runs locally and gives you an OpenAI-compatible endpoint that routes to any model:

```bash
# Install
pip install 'litellm[proxy]'

# Create config
cat > config.yaml << 'EOF'
model_list:
  - model_name: claude-fast
    litellm_params:
      model: anthropic/claude-haiku-4-5-20251001
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: claude-smart
    litellm_params:
      model: anthropic/claude-sonnet-4-6
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: gpt-mini
    litellm_params:
      model: openai/gpt-4o-mini
      api_key: os.environ/OPENAI_API_KEY

  - model_name: local
    litellm_params:
      model: ollama/llama3.2
      api_base: http://localhost:11434

litellm_settings:
  success_callback: ["langsmith"]
  budget_manager: True

general_settings:
  master_key: sk-my-gateway-key
EOF

# Start the proxy
litellm --config config.yaml --port 4000
```

Now call any model through the proxy using OpenAI SDK:

```python
from openai import OpenAI

# Point to your LiteLLM proxy
proxy_client = OpenAI(
    api_key="sk-my-gateway-key",
    base_url="http://localhost:4000",
)

# All models available through one interface
response = proxy_client.chat.completions.create(
    model="claude-smart",   # ← your alias for Claude Sonnet
    messages=[{"role": "user", "content": "Hello!"}],
)
```

### Budget Caps with LiteLLM

```python
import litellm

# Set per-user budget
litellm.set_verbose = False

# Budget manager prevents overspending
budget_manager = litellm.BudgetManager(
    project_name="tds-week3",
    client_type="local",  # or "hosted" for LiteLLM cloud
)

def call_with_budget(user_id: str, message: str, budget_usd: float = 0.10) -> str:
    # Create budget for this user if it doesn't exist
    if not budget_manager.is_valid_user(user_id):
        budget_manager.create_budget(
            total_budget=budget_usd,
            user=user_id,
            duration="daily",
        )

    # Check if they have budget remaining
    current_spend = budget_manager.get_current_cost(user=user_id)
    if current_spend >= budget_usd:
        raise Exception(f"User {user_id} has exceeded daily budget of ${budget_usd}")

    response = litellm.completion(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": message}],
        user=user_id,
    )

    # Update spend
    cost = litellm.completion_cost(completion_response=response)
    budget_manager.update_cost(completion_obj=response, user=user_id)

    remaining = budget_usd - budget_manager.get_current_cost(user=user_id)
    print(f"Cost: ${cost:.6f} | Remaining budget: ${remaining:.4f}")

    return response.choices[0].message.content

# Each student gets $0.10/day budget
call_with_budget("student_001", "Explain HNSW indexing.", budget_usd=0.10)
```

---

## Combining LangSmith + LiteLLM

```python
import litellm
import os

# Enable LangSmith tracing through LiteLLM
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "ls__..."
os.environ["LANGCHAIN_PROJECT"] = "tds-cost-benchmark"

litellm.success_callback = ["langsmith"]

# Now every litellm.completion() call appears in LangSmith with:
# - The exact prompt
# - The model used
# - Token counts
# - Cost
# - Latency

models_to_benchmark = [
    "gpt-4o-mini",
    "anthropic/claude-haiku-4-5-20251001",
    "ollama/llama3.2",
]

prompt = "Explain the difference between TCP and UDP in 3 sentences."

for model in models_to_benchmark:
    try:
        import time
        start = time.time()
        response = litellm.completion(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            metadata={"ls_run_name": f"benchmark_{model}"},
        )
        elapsed = time.time() - start
        cost = litellm.completion_cost(completion_response=response)
        print(f"{model}: ${cost:.6f}, {elapsed:.2f}s, {response.usage.total_tokens} tokens")
    except Exception as e:
        print(f"{model}: ERROR — {e}")
```

---

## Video Reference

[![LangSmith Tutorial](https://img.youtube.com/vi/XkekH2z94Fo/0.jpg)](https://youtu.be/XkekH2z94Fo?si=MxMcvxyfDerN-ZJo)

---

## Summary

| Tool | What It Does | When to Use |
|------|-------------|------------|
| `@traceable` decorator | Log function calls to LangSmith | Debug any Python function |
| `wrap_anthropic()` | Auto-trace all Anthropic calls | Drop-in wrapper |
| `ls_client.list_runs()` | Query your traces programmatically | Cost reports, analysis |
| `litellm.completion()` | Single API for 100+ models | Model comparison, fallbacks |
| LiteLLM proxy | Centralized API gateway | Team/production deployment |
| `BudgetManager` | Per-user spend limits | Multi-user applications |

---

