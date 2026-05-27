id: fastapi

# FastAPI Fundamentals

FastAPI is a modern Python web framework that gives you **automatic API documentation**, **type checking at runtime**, and performance close to NodeJS and Go — all from plain Python type hints.

?> **Why FastAPI over Flask/Django?**
?> - **Auto docs** — Swagger UI and ReDoc generated from your code, zero config
?> - **Pydantic validation** — request/response validated automatically, no manual checks
?> - **Async native** — built on Starlette + asyncio, handles concurrent requests
?> - **Speed** — one of the fastest Python frameworks, benchmarked near Node

---

## Installation

```bash
# Create a new project with UV
uv init my-api
cd my-api

# Add FastAPI and Uvicorn (the ASGI server)
uv add fastapi "uvicorn[standard]"
```

---

## Your First API in 10 Lines

```python title="main.py"
from fastapi import FastAPI

app = FastAPI(title="My First API", version="1.0.0")

@app.get("/")
def root():
    return {"message": "Hello, World!"}

@app.get("/health")
def health():
    return {"status": "ok"}
```

Run it:
```bash
uvicorn main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs   (Swagger UI)
# → http://localhost:8000/redoc  (ReDoc)
```

Open `http://localhost:8000/docs` — you get a **fully interactive API explorer** for free.

---

## Path Parameters

```python
@app.get("/users/{user_id}")
def get_user(user_id: int):
    # FastAPI validates that user_id is an integer
    # Sending /users/abc → 422 Unprocessable Entity automatically
    return {"user_id": user_id, "name": f"User {user_id}"}

@app.get("/items/{item_id}/reviews/{review_id}")
def get_review(item_id: int, review_id: int):
    return {"item_id": item_id, "review_id": review_id}
```

---

## Query Parameters

```python
from typing import Optional

@app.get("/search")
def search(
    q: str,                          # required
    page: int = 1,                   # optional with default
    limit: int = 10,                 # optional with default
    active: Optional[bool] = None,   # fully optional
):
    return {
        "query": q,
        "page": page,
        "limit": limit,
        "active": active,
    }

# Usage: /search?q=python&page=2&limit=5
```

---

## Request Body with Pydantic

```python
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr          # validates email format
    age: Optional[int] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

@app.post("/users", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate):
    # FastAPI validates the incoming JSON against UserCreate
    # and validates the return value against UserResponse
    return {"id": 42, "name": user.name, "email": user.email}
```

Send a POST request:
```json
{
  "name": "Arjun",
  "email": "arjun@example.com",
  "age": 22
}
```

If you send `"email": "not-an-email"` → FastAPI returns a 422 with a detailed error message automatically.

---

## Response Models & Status Codes

```python
from fastapi import HTTPException
from typing import List

# Fake DB for demo
items_db = {1: "Laptop", 2: "Phone", 3: "Tablet"}

@app.get("/items", response_model=List[str])
def list_items():
    return list(items_db.values())

@app.get("/items/{item_id}")
def get_item(item_id: int):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")
    return {"id": item_id, "name": items_db[item_id]}

@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    del items_db[item_id]
    # 204 = No Content, return nothing
```

---

## Full CRUD Example

```python title="main.py"
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import uuid

app = FastAPI(title="Tasks API", version="1.0.0")

# --- Models ---
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    done: bool = False

class Task(TaskCreate):
    id: str

# --- In-memory store ---
tasks: dict[str, Task] = {}

# --- Routes ---
@app.get("/tasks", response_model=List[Task])
def list_tasks():
    return list(tasks.values())

@app.post("/tasks", response_model=Task, status_code=201)
def create_task(payload: TaskCreate):
    task = Task(id=str(uuid.uuid4()), **payload.model_dump())
    tasks[task.id] = task
    return task

@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    if task_id not in tasks:
        raise HTTPException(404, "Task not found")
    return tasks[task_id]

@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, payload: TaskCreate):
    if task_id not in tasks:
        raise HTTPException(404, "Task not found")
    tasks[task_id] = Task(id=task_id, **payload.model_dump())
    return tasks[task_id]

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: str):
    if task_id not in tasks:
        raise HTTPException(404, "Task not found")
    del tasks[task_id]
```

---

## Auto-Generated Docs

FastAPI generates **two** documentation UIs automatically:

| URL | UI | Best For |
|-----|-----|---------|
| `/docs` | Swagger UI | Interactive testing, sending requests |
| `/redoc` | ReDoc | Clean reading, sharing with teams |
| `/openapi.json` | Raw OpenAPI spec | Generating client SDKs |

You can customize the docs:
```python
app = FastAPI(
    title="TDS Tasks API",
    description="A simple task management API for the TDS course",
    version="1.0.0",
    docs_url="/docs",       # change URL if needed
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)
```

---

## Key Concepts Summary

| Concept | What It Does |
|---------|-------------|
| `@app.get/post/put/delete` | Route decorator, maps HTTP method + path |
| `path_param: int` | Path parameter with type validation |
| `query: str = "default"` | Query parameter with optional default |
| `body: MyModel` | Request body, parsed from JSON |
| `response_model=MyModel` | Validates and filters response |
| `HTTPException` | Returns error responses with status codes |
| `status_code=201` | Sets the success HTTP status code |

---

## Video Reference

[![FastAPI Full Tutorial - Beginner to Advanced](https://img.youtube.com/vi/0RS9W8MtZe4/0.jpg)](https://youtu.be/0RS9W8MtZe4 "FastAPI Full Tutorial - Beginner to Advanced")

---

## Practice

1. Add a `priority: int` field (1-5) to the Task model with a validator that rejects values outside 1-5
2. Add a `GET /tasks?done=true` filter that returns only completed tasks
3. Add a `PATCH /tasks/{id}` endpoint that only updates the `done` field

---

