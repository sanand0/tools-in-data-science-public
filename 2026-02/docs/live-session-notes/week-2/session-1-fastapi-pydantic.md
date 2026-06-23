# Session 1: Pydantic & FastAPI

<div class="live-session-note" data-deck-id="week-2-session-1-fastapi-pydantic" data-week="Week 2" data-session="Session 1" data-title="Pydantic & FastAPI">
<textarea data-live-session-slides>
# Pydantic & FastAPI
## Week 2 Session 1

- Data validation with Pydantic
- FastAPI Routing and CORS middleware
- GET and POST requests with Pydantic schemas
- Async/await and Background Tasks with httpx
---
## Pydantic validations

Pydantic enforces type hints at runtime:

```python
from pydantic import BaseModel, Field, EmailStr

class UserSchema(BaseModel):
    id: int
    name: str = Field(min_length=2, max_length=50)
    email: EmailStr
    age: int = Field(ge=18, le=100)
```

Invalid types raise a `ValidationError` with detailed debug locations.
---
## FastAPI & CORS Setup

Initialize FastAPI and secure it with Cross-Origin Resource Sharing (CORS):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Tighten in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
---
## GET / POST Routes

Handle validated payloads:

```python
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"id": user_id, "status": "active"}

@app.post("/users")
async def create_user(user: UserSchema):
    # Already validated!
    return {"message": "Created", "user": user}
```
---
## Async / Await Under the Hood

- `async def` defines a coroutine.
- `await` pauses execution of the current coroutine, allowing the event loop to run other tasks.
- Non-blocking I/O (like network calls or database queries) should be awaited.

```python
import asyncio

async def fetch_data():
    await asyncio.sleep(1) # Yields control
    return "done"
```
---
## Background Tasks & httpx

Using `httpx` for outbound requests in a FastAPI background thread:

```python
import httpx
from fastapi import BackgroundTasks

async def send_web_payload(url: str, data: dict):
    async with httpx.AsyncClient() as client:
        await client.post(url, json=data)

@app.post("/trigger")
async def trigger_process(url: str, tasks: BackgroundTasks):
    payload = {"status": "processed"}
    tasks.add_task(send_web_payload, url, payload)
    return {"message": "Background process queued"}
```
---
## Annotation Exercise

- Highlight where Pydantic checks minimum age constraints
- Circle the middleware definition for CORS
- Draw an arrow showing how control flows in `await client.post()`
- Mark where the background task is queued
</textarea>
</div>
