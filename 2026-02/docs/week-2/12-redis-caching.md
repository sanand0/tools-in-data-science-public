id: redis-caching

# Redis Caching

Redis is an in-memory data store — think of it as a Python dictionary that lives outside your app, survives restarts (optional), and can be shared across multiple server instances. It's **blazing fast** (sub-millisecond reads) because everything is in RAM.

?> **Four main uses in a FastAPI app**
?> 1. **Response caching** — cache expensive API results (LLM calls, DB queries)
?> 2. **Session management** — store user sessions server-side
?> 3. **Rate limiting counters** — count requests per IP per minute
?> 4. **Pub/Sub** — broadcast events between services

---

## Install and Start Redis

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis

# Docker (easiest — no install needed)
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Verify it's running
redis-cli ping
# → PONG
```

```bash
# Python client
uv add redis "redis[asyncio]" hiredis
```

---

## Basic Redis Operations

Understanding Redis data types helps you use it correctly:

```python
import redis

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

# ── Strings (key-value) ────────────────────────────────────────
r.set("name", "Arjun")
r.get("name")                   # "Arjun"
r.set("counter", 0)
r.incr("counter")               # atomic increment → 1
r.incr("counter")               # → 2

# With expiry (TTL)
r.set("session:abc123", "user_id:42", ex=3600)  # expires in 1 hour
r.ttl("session:abc123")         # seconds remaining → 3598
r.expire("session:abc123", 7200)  # extend TTL

# ── Hashes (nested key-value) ─────────────────────────────────
r.hset("user:42", mapping={
    "name": "Arjun",
    "email": "arjun@iitm.ac.in",
    "role": "student",
})
r.hget("user:42", "email")      # "arjun@iitm.ac.in"
r.hgetall("user:42")            # all fields as dict

# ── Lists ─────────────────────────────────────────────────────
r.rpush("queue", "task1", "task2", "task3")  # push right
r.lpop("queue")                              # pop left → "task1"
r.lrange("queue", 0, -1)        # all items

# ── Sets ──────────────────────────────────────────────────────
r.sadd("online_users", "user:1", "user:2", "user:3")
r.sismember("online_users", "user:1")  # True
r.smembers("online_users")             # all members
r.scard("online_users")                # count → 3

# ── Sorted Sets (with scores) ─────────────────────────────────
r.zadd("leaderboard", {"arjun": 95, "priya": 88, "raj": 72})
r.zrange("leaderboard", 0, -1, withscores=True, rev=True)
# [("arjun", 95.0), ("priya", 88.0), ("raj", 72.0)]
```

---

## Response Caching in FastAPI

Cache expensive operations (LLM calls, complex DB queries) so repeated requests return instantly:

```python title="cache.py"
import redis.asyncio as aioredis
import json
import hashlib
from functools import wraps
from typing import Any, Optional, Callable
import asyncio

# Global Redis client
redis_client: Optional[aioredis.Redis] = None

async def get_redis() -> aioredis.Redis:
    global redis_client
    if redis_client is None:
        redis_client = aioredis.Redis(
            host="localhost",
            port=6379,
            decode_responses=True,
        )
    return redis_client

def cache_response(ttl: int = 300, prefix: str = "cache"):
    """Decorator to cache async function results in Redis"""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            r = await get_redis()

            # Build cache key from function name + arguments
            key_data = f"{func.__name__}:{args}:{sorted(kwargs.items())}"
            cache_key = f"{prefix}:{hashlib.md5(key_data.encode()).hexdigest()}"

            # Check cache first
            cached = await r.get(cache_key)
            if cached:
                return json.loads(cached)

            # Cache miss — call the actual function
            result = await func(*args, **kwargs)

            # Store in cache
            await r.set(cache_key, json.dumps(result), ex=ttl)
            return result
        return wrapper
    return decorator
```

```python title="main.py"
from fastapi import FastAPI, Depends
import asyncio

app = FastAPI()

@cache_response(ttl=600, prefix="llm")  # cache LLM responses for 10 minutes
async def generate_summary(text: str) -> dict:
    """Expensive LLM call"""
    await asyncio.sleep(2)  # simulate slow LLM
    return {"summary": f"Summary of: {text[:50]}..."}

@app.get("/summarize")
async def summarize(text: str):
    result = await generate_summary(text)
    return result
```

First call: 2 seconds. Subsequent calls with same `text`: &lt;1ms.

---

## Manual Cache Pattern (More Control)

```python
from fastapi import FastAPI, Depends
import redis.asyncio as aioredis
import json

app = FastAPI()

async def get_redis():
    return aioredis.Redis(host="localhost", port=6379, decode_responses=True)

@app.get("/products/{product_id}")
async def get_product(product_id: int, r: aioredis.Redis = Depends(get_redis)):
    cache_key = f"product:{product_id}"

    # 1. Try cache
    cached = await r.get(cache_key)
    if cached:
        return {**json.loads(cached), "source": "cache"}

    # 2. Cache miss — fetch from DB
    product = await db.get_product(product_id)  # slow DB query
    if not product:
        raise HTTPException(404, "Product not found")

    # 3. Store in cache for 5 minutes
    await r.set(cache_key, json.dumps(product.dict()), ex=300)

    return {**product.dict(), "source": "db"}

@app.put("/products/{product_id}")
async def update_product(product_id: int, data: ProductUpdate, r = Depends(get_redis)):
    # Update DB
    product = await db.update_product(product_id, data)

    # Invalidate cache — CRITICAL!
    await r.delete(f"product:{product_id}")

    return product
```

!> **Always invalidate the cache on updates!**
!> If you update a product in the DB but don't delete the Redis key, users will see stale data for 5 minutes. The pattern: **update DB → delete cache key**.

---

## Session Management

Store user sessions in Redis instead of in-memory (so they survive restarts):

```python title="sessions.py"
import redis.asyncio as aioredis
import json
import secrets
from datetime import timedelta

SESSION_TTL = 86400  # 24 hours in seconds

async def create_session(r: aioredis.Redis, user_data: dict) -> str:
    session_id = secrets.token_urlsafe(32)
    await r.set(
        f"session:{session_id}",
        json.dumps(user_data),
        ex=SESSION_TTL,
    )
    return session_id

async def get_session(r: aioredis.Redis, session_id: str) -> dict | None:
    data = await r.get(f"session:{session_id}")
    return json.loads(data) if data else None

async def delete_session(r: aioredis.Redis, session_id: str):
    await r.delete(f"session:{session_id}")

async def refresh_session(r: aioredis.Redis, session_id: str):
    """Reset TTL on every request"""
    await r.expire(f"session:{session_id}", SESSION_TTL)
```

```python title="main.py"
from fastapi import FastAPI, Cookie, Response, HTTPException, Depends
from sessions import create_session, get_session, delete_session

@app.post("/login")
async def login(email: str, response: Response, r = Depends(get_redis)):
    # Validate user (simplified)
    user = {"id": 42, "email": email, "role": "student"}
    session_id = await create_session(r, user)

    # Set session cookie
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,   # JS can't read it (XSS protection)
        secure=True,     # HTTPS only
        samesite="lax",
        max_age=86400,
    )
    return {"message": "Logged in"}

@app.get("/profile")
async def profile(session_id: str = Cookie(None), r = Depends(get_redis)):
    if not session_id:
        raise HTTPException(401, "Not authenticated")
    user = await get_session(r, session_id)
    if not user:
        raise HTTPException(401, "Session expired")
    return user

@app.post("/logout")
async def logout(response: Response, session_id: str = Cookie(None), r = Depends(get_redis)):
    if session_id:
        await delete_session(r, session_id)
    response.delete_cookie("session_id")
    return {"message": "Logged out"}
```

---

## Rate Limiting with Redis

More robust than `slowapi` for distributed systems (works across multiple API instances):

```python
from fastapi import Request, HTTPException
import redis.asyncio as aioredis
import time

async def check_rate_limit(
    r: aioredis.Redis,
    key: str,
    limit: int,
    window: int,   # seconds
) -> tuple[bool, int]:
    """
    Sliding window rate limiter.
    Returns (allowed: bool, remaining: int)
    """
    now = time.time()
    window_start = now - window

    pipe = r.pipeline()
    # Remove old requests outside the window
    pipe.zremrangebyscore(key, 0, window_start)
    # Count current requests in window
    pipe.zcard(key)
    # Add current request
    pipe.zadd(key, {str(now): now})
    # Set expiry
    pipe.expire(key, window)
    results = await pipe.execute()

    count = results[1]
    allowed = count < limit
    remaining = max(0, limit - count - 1)
    return allowed, remaining

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    r = await get_redis()
    client_ip = request.client.host
    key = f"ratelimit:{client_ip}"

    allowed, remaining = await check_rate_limit(r, key, limit=100, window=60)

    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Try again in 1 minute.",
            headers={"X-RateLimit-Remaining": "0", "Retry-After": "60"},
        )

    response = await call_next(request)
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    return response
```

---

## Pub/Sub (Real-Time Events Between Services)

Redis Pub/Sub lets services broadcast events to each other without polling:

```python title="publisher.py"
import redis.asyncio as aioredis
import json

async def publish_event(channel: str, event: dict):
    r = aioredis.Redis(host="localhost", port=6379)
    await r.publish(channel, json.dumps(event))
    await r.aclose()

# When a new order is created
await publish_event("orders", {
    "type": "order.created",
    "order_id": 42,
    "user_id": 7,
    "amount": 299.99,
})
```

```python title="subscriber.py"
import redis.asyncio as aioredis
import json
import asyncio

async def listen_for_events():
    r = aioredis.Redis(host="localhost", port=6379)
    pubsub = r.pubsub()
    await pubsub.subscribe("orders", "payments")

    print("Listening for events...")
    async for message in pubsub.listen():
        if message["type"] == "message":
            event = json.loads(message["data"])
            channel = message["channel"]
            print(f"[{channel}] {event['type']}: {event}")

            if event["type"] == "order.created":
                # Send confirmation email, update inventory, etc.
                pass

asyncio.run(listen_for_events())
```

---

## Redis in Docker Compose

```yaml title="docker-compose.yml"
services:
  api:
    build: .
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes   # persist data
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s

volumes:
  redis_data:
```

```python
# Use REDIS_URL from environment
import os, redis.asyncio as aioredis

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
r = aioredis.from_url(REDIS_URL, decode_responses=True)
```

---

## Video Reference

[![Redis Tutorial for Beginners](https://img.youtube.com/vi/jgpVdJB2sKQ/0.jpg)](https://youtu.be/jgpVdJB2sKQ "Redis Tutorial for Beginners")

---

## Summary

| Pattern | Redis Command | TTL? | Use Case |
|---------|--------------|------|----------|
| Response cache | `SET key value EX 300` | ✅ | LLM results, DB queries |
| Session store | `SET session:id data EX 86400` | ✅ | User sessions |
| Rate limiter | `ZADD`, `ZCARD`, `EXPIRE` | ✅ | API rate limiting |
| Pub/Sub | `PUBLISH`, `SUBSCRIBE` | ❌ | Event broadcasting |
| Counter | `INCR`, `EXPIRE` | ✅ | View counts, analytics |
| Leaderboard | `ZADD`, `ZRANGE` | ❌ | Rankings, scores |