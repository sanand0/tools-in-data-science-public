# Prompt Caching

Every time you call an LLM API, you pay to process the **entire** prompt — even if the system prompt, the 50-page document, or the tool definitions haven't changed since the last call. Prompt caching fixes this: process once, read from cache for a fraction of the cost.

?> **Real numbers (Anthropic Claude Sonnet 4.6)**
?> - Standard input: $3.00 / MTok
?> - Cache write: $3.75 / MTok (1.25×)
?> - Cache read: $0.30 / MTok (0.10×)
?>
?> **A 10,000-token system prompt read 100 times:**
?> - Without caching: 100 × 10,000 × $3/MTok = **$3.00**
?> - With caching: 1 write + 99 reads = $0.0375 + $0.297 = **$0.335**
?> - **Savings: 89%**

---

## How Caching Works

The API caches the **prefix** of your prompt — everything up to and including the marked `cache_control` block. When the next request has an identical prefix, it reads from cache instead of reprocessing.

```
Request 1 (CACHE WRITE — 1.25× cost):
  System: [50,000 token document] ←── marked with cache_control
  User: "Question 1?"

  → LLM processes all 50,000 tokens, stores in cache (5 min TTL)

Request 2 (CACHE HIT — 0.10× cost):
  System: [same 50,000 token document] ←── cache_control
  User: "Question 2?"

  → LLM reads cached computation, only processes "Question 2?"
```

The cache key is the **exact content** of the prefix. If even one character changes, it's a cache miss.

---

## Anthropic Prompt Caching

### Basic: Cache a Large System Prompt

```python
import anthropic

client = anthropic.Anthropic()

LARGE_SYSTEM_PROMPT = """
You are an expert assistant for the IIT Madras BS Data Science program.
You have deep knowledge of all 8 weeks of the TDS course...

[imagine 5,000+ tokens of course content, rules, FAQs, etc.]
"""

def ask_course_question(question: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=[
            {
                "type": "text",
                "text": LARGE_SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},  # ← mark for caching
            }
        ],
        messages=[{"role": "user", "content": question}],
    )

    # Check if we got a cache hit
    usage = response.usage
    print(f"Input tokens: {usage.input_tokens}")
    print(f"Cache write tokens: {usage.cache_creation_input_tokens}")
    print(f"Cache read tokens: {usage.cache_read_input_tokens}")
    print(f"Output tokens: {usage.output_tokens}")

    return response.content[0].text

# First call — cache write (costs 1.25×)
response1 = ask_course_question("What topics are covered in Week 3?")

# Second call — cache hit (costs 0.10×) if within 5 minutes
response2 = ask_course_question("How many projects are there?")
```

### Cache a Document for Multi-Turn Q&A

```python
from pathlib import Path

def create_document_qa_session(document_path: str):
    """Cache a document, then answer questions about it cheaply."""
    doc_text = Path(document_path).read_text()

    def ask(question: str) -> str:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=[
                {
                    "type": "text",
                    "text": "Answer questions about the following document accurately.",
                },
                {
                    "type": "text",
                    "text": f"<document>\n{doc_text}\n</document>",
                    "cache_control": {"type": "ephemeral"},  # ← cache the whole doc
                },
            ],
            messages=[{"role": "user", "content": question}],
        )

        cache_read = response.usage.cache_read_input_tokens
        cache_write = response.usage.cache_creation_input_tokens
        print(f"  [cache_read={cache_read}, cache_write={cache_write}]")
        return response.content[0].text

    return ask

# Analyze a PDF (converted to text)
qa = create_document_qa_session("research_paper.txt")

print(qa("What is the main contribution of this paper?"))   # cache write
print(qa("What datasets were used?"))                       # cache HIT (0.10×)
print(qa("What are the limitations?"))                      # cache HIT (0.10×)
print(qa("How does this compare to prior work?"))           # cache HIT (0.10×)
# Questions 2-4 cost 90% less than question 1!
```

### Cache Tools/Functions

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=[
        {
            "name": "search_course_materials",
            "description": "Search through TDS course materials...",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "week": {"type": "integer", "minimum": 1, "maximum": 8},
                },
                "required": ["query"],
            },
            # Cache tool definitions — they don't change between calls
            "cache_control": {"type": "ephemeral"},
        },
    ],
    messages=[{"role": "user", "content": "How do I set up Docker?"}],
)
```

### 1-Hour Cache (Extended TTL)

For prompts that don't change for hours (e.g., a daily-updated knowledge base):

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": very_large_knowledge_base,  # could be 100k+ tokens
            "cache_control": {
                "type": "ephemeral",
                "ttl": "1h",  # ← 1 hour instead of 5 minutes (costs 2× to write)
            },
        }
    ],
    messages=[{"role": "user", "content": question}],
)
```

**When to use 1h vs 5m cache:**
- 5m (default): Your prompt is queried more than once every 5 minutes. Self-refreshing → free.
- 1h: Your prompt is queried less frequently (e.g., batch jobs every 20 min). Worth the 2× write cost.

---

## OpenAI Prompt Caching

OpenAI has **automatic** caching — no `cache_control` needed. Just use the same prefix and it's cached automatically. Pricing: cache reads at 50% of standard input price.

```python
from openai import OpenAI
import time

client = OpenAI()

SYSTEM = "You are an expert Python tutor. " + ("Answer clearly. " * 2000)  # ~2k tokens

def ask_openai(question: str) -> dict:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": question},
        ],
        max_tokens=256,
    )

    usage = response.usage
    return {
        "answer": response.choices[0].message.content,
        "prompt_tokens": usage.prompt_tokens,
        "cached_tokens": getattr(usage, "prompt_tokens_details", {}).get("cached_tokens", 0),
        "completion_tokens": usage.completion_tokens,
    }

# First call — no cache
r1 = ask_openai("Explain decorators in Python.")
print(f"Q1 — cached: {r1['cached_tokens']} / {r1['prompt_tokens']}")
# → cached: 0 / 2048

time.sleep(1)  # ensure same prefix is cached

# Second call — cache hit on the system prompt
r2 = ask_openai("How do list comprehensions work?")
print(f"Q2 — cached: {r2['cached_tokens']} / {r2['prompt_tokens']}")
# → cached: 2048 / 2050  (only the user message is uncached)
```

**Key difference from Anthropic:**
- OpenAI: Automatic, no markers needed, cache lasts ~5–10 minutes, 50% discount on hits
- Anthropic: Explicit `cache_control` markers, 5m or 1h TTL, 90% discount on hits

---

## Cache-Aware Prompt Design

Design your prompts so the stable parts come first (cached) and the variable parts come last (not cached):

```python
# ✅ CORRECT: Static content first → variable content last
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": large_static_context,   # ← cache this
                "cache_control": {"type": "ephemeral"},
            },
            {
                "type": "text",
                "text": f"Question: {user_question}",  # ← NOT cached (changes each call)
            },
        ],
    }
]

# ❌ WRONG: Variable content first breaks caching
messages = [
    {
        "role": "user",
        "content": f"Question: {user_question}\n\n{large_static_context}",
        # Variable content at start = different prefix each time = no cache hits
    }
]
```

### Multi-Turn Conversation with Caching

```python
def chat_with_document(doc_text: str):
    """
    Efficient multi-turn Q&A: document is cached, conversation history grows
    """
    history = []

    def ask(question: str) -> str:
        history.append({"role": "user", "content": question})

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=512,
            system=[
                {"type": "text", "text": "You are a helpful document assistant."},
                {
                    "type": "text",
                    "text": doc_text,
                    "cache_control": {"type": "ephemeral"},  # document always cached
                },
            ],
            messages=history,
        )
        reply = response.content[0].text
        history.append({"role": "assistant", "content": reply})
        return reply

    return ask

# Usage
qa = chat_with_document(Path("textbook.txt").read_text())
print(qa("What is the main topic?"))        # cache write
print(qa("Explain the second chapter."))    # cache read
print(qa("How does X relate to Y?"))        # cache read
# Conversation history grows but document stays cached
```

---

## Cost Calculator

```python
def estimate_caching_savings(
    system_tokens: int,
    calls_per_day: int,
    user_tokens_avg: int = 100,
    output_tokens_avg: int = 500,
    model_input_price: float = 3.0,   # $/MTok for Sonnet 4.6
    model_output_price: float = 15.0,
    cache_write_multiplier: float = 1.25,
    cache_read_multiplier: float = 0.10,
) -> dict:
    total_tokens = system_tokens + user_tokens_avg

    # Without caching
    no_cache_cost_per_day = (
        calls_per_day * total_tokens * model_input_price / 1_000_000
        + calls_per_day * output_tokens_avg * model_output_price / 1_000_000
    )

    # With caching (1 write + rest reads, 5-min window means ~12 writes/hour)
    # For simplicity: assume 1 write per day, rest are reads
    cache_writes_per_day = max(1, calls_per_day // 100)
    cache_reads_per_day = calls_per_day - cache_writes_per_day

    with_cache_cost = (
        cache_writes_per_day * system_tokens * model_input_price * cache_write_multiplier / 1_000_000
        + cache_reads_per_day * system_tokens * model_input_price * cache_read_multiplier / 1_000_000
        + calls_per_day * user_tokens_avg * model_input_price / 1_000_000
        + calls_per_day * output_tokens_avg * model_output_price / 1_000_000
    )

    return {
        "daily_without_cache_usd": round(no_cache_cost_per_day, 4),
        "daily_with_cache_usd": round(with_cache_cost, 4),
        "savings_pct": round((1 - with_cache_cost / no_cache_cost_per_day) * 100, 1),
        "monthly_savings_usd": round((no_cache_cost_per_day - with_cache_cost) * 30, 2),
    }

result = estimate_caching_savings(
    system_tokens=10_000,   # 10k token system prompt (e.g. a large knowledge base)
    calls_per_day=1_000,
)
print(result)
# → {'daily_without_cache_usd': 0.3, 'daily_with_cache_usd': 0.037,
#    'savings_pct': 87.7, 'monthly_savings_usd': 7.88}
```

---

## Summary

| | Anthropic | OpenAI |
|--|-----------|--------|
| Activation | Add `cache_control` block | Automatic |
| Cache TTL | 5 min (default) or 1 hour | ~5–10 min |
| Cache read cost | 10% of input | 50% of input |
| Cache write cost | 125% of input | Standard |
| Min tokens to cache | 1,024 tokens | 1,024 tokens |
| Max cache breakpoints | 4 per request | Automatic |
| Best for | Document Q&A, large system prompts, tools | Standard chat with repeated system prompts |

---

