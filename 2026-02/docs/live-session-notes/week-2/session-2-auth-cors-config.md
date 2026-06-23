# Session 2: Auth, CORS, and config

<div class="live-session-note" data-deck-id="week-2-session-2-auth-cors-config" data-week="Week 2" data-session="Session 2" data-title="Auth, CORS, and config" data-video="https://youtu.be/iMLGnriiecc" data-faq="live-sessions/20250522-iMLGnriiecc.md">
<textarea data-live-session-slides>
# Auth, CORS, and config
## Week 2 session 2

- Separate identity from authorization
- Make browsers happy with CORS
- Configure apps without editing code
---
## Identity vs permission

| Question | Concept |
| --- | --- |
| Who are you? | authentication |
| What can you do? | authorization |
| Can this browser call me? | CORS |
---
## API key pattern

```python
import os
from fastapi import Header, HTTPException

API_KEY = os.environ["API_KEY"]

def require_key(x_api_key: str = Header()):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401)
```
---
## CORS in one sentence

CORS is a browser rule that controls whether a page from one origin can call an API on another origin.
---
## CORS middleware

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```
---
## Configuration checklist

- Environment variables documented
- Defaults safe for local use
- Secrets never committed
- Production values set in hosting platform
- Startup fails clearly when config is missing
---
## Testing auth and CORS

```bash
curl -i http://localhost:8000/private
curl -i -H "x-api-key: $API_KEY" http://localhost:8000/private
```
---
## Annotation exercise

- Mark what belongs in environment variables
- Highlight the allowed origin
- Draw where the browser blocks a request
---
## End state

You can explain why an API call is rejected: missing identity, missing permission, or browser-origin policy.
</textarea>
</div>
