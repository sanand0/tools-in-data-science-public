id: fastapi-advanced
# FastAPI Advanced

Four powerful patterns that take FastAPI from a simple REST server to a production-grade application platform: **Background Tasks**, **WebSockets**, **Dependency Injection**, and **Lifespan Events**.

---

## Background Tasks

Background tasks run **after** the HTTP response is sent. Use them for things the user doesn't need to wait for: sending emails, writing to a database, calling external APIs, generating reports.

```python
from fastapi import FastAPI, BackgroundTasks
import time, logging

app = FastAPI()
logger = logging.getLogger(__name__)

def send_email(to: str, subject: str, body: str):
    """This runs after the response is sent"""
    time.sleep(2)  # simulate slow email sending
    logger.info(f"Email sent to {to}: {subject}")

def write_audit_log(user_id: int, action: str):
    """Log to a slow external system"""
    time.sleep(0.5)
    logger.info(f"Audit: user {user_id} did {action}")

@app.post("/register")
async def register_user(email: str, background_tasks: BackgroundTasks):
    # User registration logic here
    user_id = 42

    # Schedule background tasks — they run after this function returns
    background_tasks.add_task(send_email, email, "Welcome!", "Thanks for signing up.")
    background_tasks.add_task(write_audit_log, user_id, "register")

    # This response is sent immediately — user doesn't wait 2.5 seconds
    return {"message": "Registered! Check your email.", "user_id": user_id}
```

?> **When to use Background Tasks vs Celery/Redis Queue?**
?> - **Background Tasks**: Fast jobs (&lt;30 seconds), no retry needed, simple
?> - **Celery + Redis**: Long jobs, need retries, need progress tracking, distributed workers

---

## WebSockets

WebSockets provide **bi-directional, real-time communication** — unlike HTTP where only the client can initiate. Perfect for chat, live dashboards, collaborative editing, game servers.

### Simple Echo WebSocket

```python
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()        # complete the handshake
    try:
        while True:
            data = await websocket.receive_text()      # wait for message
            await websocket.send_text(f"Echo: {data}") # send back
    except WebSocketDisconnect:
        print("Client disconnected")
```

### Real-Time Chat Room

```python
from typing import List

class ConnectionManager:
    def __init__(self):
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        self.active.remove(ws)

    async def broadcast(self, message: str):
        for ws in self.active:
            await ws.send_text(message)

manager = ConnectionManager()

@app.websocket("/chat/{username}")
async def chat(websocket: WebSocket, username: str):
    await manager.connect(websocket)
    await manager.broadcast(f"🟢 {username} joined the chat")
    try:
        while True:
            msg = await websocket.receive_text()
            await manager.broadcast(f"{username}: {msg}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"🔴 {username} left the chat")
```

Test with a simple HTML client:
```html
<!-- test-chat.html -->
<script>
const ws = new WebSocket("ws://localhost:8000/chat/Arjun");
ws.onmessage = (e) => console.log(e.data);
ws.send("Hello everyone!");
</script>
```

---

## Dependency Injection

Dependency Injection (DI) is FastAPI's way to share logic, resources, and validation across routes without repeating code. The `Depends()` function is the key.

### Database Connection (most common use case)

```python
from fastapi import Depends
import sqlite3

def get_db():
    """Open a DB connection, yield it, then close it"""
    conn = sqlite3.connect("app.db")
    try:
        yield conn           # ← routes use this
    finally:
        conn.close()         # ← always runs after the route

@app.get("/users")
def list_users(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.execute("SELECT id, email FROM users")
    return [{"id": r[0], "email": r[1]} for r in cursor.fetchall()]

@app.post("/users")
def create_user(email: str, db: sqlite3.Connection = Depends(get_db)):
    db.execute("INSERT INTO users (email) VALUES (?)", [email])
    db.commit()
    return {"message": "Created"}
```

### Layered Dependencies

Dependencies can depend on other dependencies:

```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    return credentials.credentials

def get_current_user(token: str = Depends(get_token)) -> dict:
    """Builds on get_token"""
    user = decode_jwt(token)   # from google-oauth topic
    return user

def get_admin_user(user: dict = Depends(get_current_user)) -> dict:
    """Builds on get_current_user"""
    if user.get("role") != "admin":
        raise HTTPException(403, "Admin access required")
    return user

# Each route only asks for what it needs
@app.get("/dashboard")
def dashboard(user: dict = Depends(get_current_user)):
    return {"welcome": user["email"]}

@app.delete("/users/{id}")
def delete_user(id: int, admin: dict = Depends(get_admin_user)):
    return {"deleted": id}
```

### Caching Dependencies (singleton pattern)

```python
from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_url: str
    api_key: str
    class Config:
        env_file = ".env"

@lru_cache()          # only runs once, result cached for app lifetime
def get_settings() -> Settings:
    return Settings()

@app.get("/config")
def show_config(settings: Settings = Depends(get_settings)):
    return {"db_url": settings.db_url}  # api_key hidden
```

---

## Lifespan Events (Startup & Shutdown)

Use lifespan to set up resources when the app starts and clean them up when it shuts down: database connection pools, loading ML models, connecting to Redis.

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
import asyncpg   # async PostgreSQL driver

# Global state shared across requests
db_pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ─── STARTUP ───
    global db_pool
    print("🚀 Starting up — connecting to database...")
    db_pool = await asyncpg.create_pool(
        "postgresql://user:pass@localhost/mydb",
        min_size=5,
        max_size=20,
    )
    print("✅ Database pool ready")

    yield    # ← app runs here

    # ─── SHUTDOWN ───
    print("🛑 Shutting down — closing database pool...")
    await db_pool.close()
    print("✅ Cleaned up")

app = FastAPI(lifespan=lifespan)

@app.get("/users")
async def get_users():
    async with db_pool.acquire() as conn:
        rows = await conn.fetch("SELECT id, email FROM users")
        return [dict(r) for r in rows]
```

### Loading an ML Model at Startup

```python
from contextlib import asynccontextmanager
import joblib

ml_model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global ml_model
    print("Loading model... (this might take a moment)")
    ml_model = joblib.load("model.pkl")   # blocking but only once
    print("Model loaded!")
    yield
    ml_model = None   # cleanup

app = FastAPI(lifespan=lifespan)

@app.post("/predict")
def predict(features: list[float]):
    prediction = ml_model.predict([features])
    return {"prediction": prediction[0]}
```

---

## Putting It All Together

```python title="main.py"
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, BackgroundTasks, WebSocket
import asyncpg, logging

logger = logging.getLogger(__name__)
db_pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_pool
    db_pool = await asyncpg.create_pool("postgresql://...")
    yield
    await db_pool.close()

app = FastAPI(lifespan=lifespan)

async def get_db():
    async with db_pool.acquire() as conn:
        yield conn

def notify_admin(event: str):
    logger.info(f"Admin notification: {event}")

@app.post("/orders")
async def create_order(
    item: str,
    background_tasks: BackgroundTasks,
    db = Depends(get_db),
):
    await db.execute("INSERT INTO orders (item) VALUES ($1)", item)
    background_tasks.add_task(notify_admin, f"New order: {item}")
    return {"status": "created"}
```

---

## Summary

| Pattern | Problem It Solves |
|---------|------------------|
| Background Tasks | Don't make users wait for slow side effects |
| WebSockets | Real-time bidirectional communication |
| Dependency Injection | Share DB connections, auth, config without repetition |
| Lifespan Events | Reliable startup/shutdown for resources |

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

