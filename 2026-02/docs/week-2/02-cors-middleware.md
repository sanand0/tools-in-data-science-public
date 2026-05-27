id: cors-middleware
# CORS & Middleware

**CORS** (Cross-Origin Resource Sharing) is the browser's security policy that blocks your React frontend from calling your Python API unless the API explicitly says "it's okay". **Middleware** is code that runs on every request before it hits your route handler — perfect for logging, rate limiting, auth checks, and timing.

---

## Why CORS Matters

```
Browser (localhost:3000)  →  API (localhost:8000)
                              ↑
                         Different origin!
                         Browser blocks this by default.
```

If you ever see this error in your browser console:
```
Access to fetch at 'http://localhost:8000/api' from origin 'http://localhost:3000'
has been blocked by CORS policy
```
→ You need to configure CORS on your FastAPI server.

---

## Setting Up CORS

```python title="main.py"
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",          # React dev server
        "https://myapp.vercel.app",       # Production frontend
    ],
    allow_credentials=True,    # Allow cookies / Authorization headers
    allow_methods=["*"],       # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],       # Content-Type, Authorization, etc.
)
```

!> **Never use `allow_origins=["*"]` in production**
!> `["*"]` means any website can call your API. Fine for development, dangerous in production — an attacker's site could call your API using your users' cookies.

---

## CORS for Public APIs

If your API is truly public (like a weather API), using `*` is fine:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],       # Read-only public API
    allow_headers=["*"],
)
```

---

## Custom Middleware

Middleware in FastAPI is a function that wraps every request. Use it for:

### 1. Request Timing Middleware

```python
import time
from fastapi import Request

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.time()
    response = await call_next(request)          # ← run the actual route
    duration = time.time() - start
    response.headers["X-Process-Time"] = str(round(duration * 1000, 2)) + "ms"
    return response
```

Every response now has an `X-Process-Time: 23.4ms` header. Great for debugging slow endpoints.

### 2. Request Logging Middleware

```python
import logging

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"→ {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"← {response.status_code} {request.url}")
    return response
```

### 3. Trusted Host Middleware

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["myapp.com", "*.myapp.com", "localhost"],
)
```

---

## Rate Limiting with slowapi

```bash
uv add slowapi
```

```python title="main.py"
from fastapi import FastAPI, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Use the client's IP address as the rate limit key
limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/data")
@limiter.limit("10/minute")          # 10 requests per minute per IP
async def get_data(request: Request):
    return {"data": "here"}

@app.get("/api/search")
@limiter.limit("5/minute")           # stricter limit for expensive endpoint
async def search(request: Request, q: str):
    return {"results": []}
```

When a client exceeds the limit they get:
```json
HTTP 429 Too Many Requests
{"error": "Rate limit exceeded: 10 per 1 minute"}
```

---

## Request Validation Middleware

Reject requests missing required headers:

```python
from fastapi import Request, HTTPException

@app.middleware("http")
async def validate_content_type(request: Request, call_next):
    # Only validate POST/PUT/PATCH requests
    if request.method in ("POST", "PUT", "PATCH"):
        content_type = request.headers.get("content-type", "")
        if "application/json" not in content_type:
            raise HTTPException(
                status_code=415,
                detail="Content-Type must be application/json",
            )
    return await call_next(request)
```

---

## Middleware Execution Order

Middleware runs like **nested wrappers** — the first one added is the outermost:

```
Request  → Middleware 1 → Middleware 2 → Route Handler
Response ← Middleware 1 ← Middleware 2 ← Route Handler
```

Order matters for things like logging (should be outermost) vs. auth (should be inner).

```python
# Added first = outermost (runs first on request, last on response)
app.add_middleware(CORSMiddleware, ...)
app.add_middleware(TrustedHostMiddleware, ...)

# Decorator middleware (runs in definition order)
@app.middleware("http")
async def timing(request, call_next): ...   # runs before logging below

@app.middleware("http")
async def logging(request, call_next): ...  # runs after timing above
```

Wait — decorator middleware runs in **reverse** order (last defined = first to run). To avoid confusion, use `add_middleware()` for ordering control.

---

## Complete Production Setup

```python title="main.py"
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time, logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myapp.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_and_time(request: Request, call_next):
    start = time.time()
    logger.info(f"→ {request.method} {request.url.path}")
    response = await call_next(request)
    ms = round((time.time() - start) * 1000, 1)
    response.headers["X-Response-Time"] = f"{ms}ms"
    logger.info(f"← {response.status_code} ({ms}ms)")
    return response

@app.get("/")
@limiter.limit("30/minute")
async def root(request: Request):
    return {"status": "ok"}
```

---

## Key Takeaways

| Problem | Solution |
|---------|----------|
| Browser blocks API calls from different origin | `CORSMiddleware` with specific origins |
| Abuse / DDoS | `slowapi` rate limiting |
| Want timing on every request | `@app.middleware("http")` with timer |
| Reject bad content types | Middleware checking `Content-Type` header |
| Block unknown hosts | `TrustedHostMiddleware` |

---

