# Async & Parallelism in Agent Systems

Agents are deeply I/O bound. They wait on LLM APIs, database queries, and web requests.

## asyncio in Python
Use `async` and `await` to unblock the main thread during I/O.
```python
import asyncio
import httpx

async def fetch_data():
    async with httpx.AsyncClient() as client:
        return await client.get("https://api.example.com")
```

## Rate-Limit-Aware Concurrency
When parallelizing LLM calls, you will hit API limits. Use semaphores.
```python
sem = asyncio.Semaphore(5) # Max 5 concurrent requests

async def safe_llm_call(prompt):
    async with sem:
        return await call_llm(prompt)
```

---

