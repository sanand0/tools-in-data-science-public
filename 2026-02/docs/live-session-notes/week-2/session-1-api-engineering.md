# Session 1: API engineering

<div class="live-session-note" data-deck-id="week-2-session-1-api-engineering" data-week="Week 2" data-session="Session 1" data-title="API engineering" data-video="https://youtu.be/Ptq0Me5tmFk" data-faq="live-sessions/20250522-Ptq0Me5tmFk.md">
<textarea data-live-session-slides>
# API engineering
## Week 2 session 1

- Turn code into an HTTP service
- Use request and response contracts
- Test behavior before deployment
---
## API mental model

```text
client -> request -> route -> function -> response -> client
```

Each arrow can fail independently.
---
## FastAPI skeleton

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"ok": True}
```
---
## Run locally

```bash
uv add fastapi uvicorn
uv run uvicorn main:app --reload
curl http://127.0.0.1:8000/health
```
---
## Request shape

- Method: GET, POST, PUT, DELETE
- URL path
- Query parameters
- Headers
- Body
- Authentication
---
## Response shape

```json
{
  "answer": 42,
  "source": "computed",
  "warnings": []
}
```

Make the response boring and predictable.
---
## Failure responses

Use clear status codes:

- 400: bad input
- 401: unauthenticated
- 403: unauthorized
- 404: missing resource
- 500: server error
---
## Annotation exercise

- Draw the request path
- Circle the contract fields
- Mark where validation should happen
---
## End state

You can run a local API, call it with curl, and explain the request/response contract.
</textarea>
</div>
