# Lab: WebSocket Chat with Redis & PostgreSQL

This practical lab guides you through building a real-time, authenticated chat application. You will implement Google OAuth for authentication, use a PostgreSQL database to persist messages, integrate Redis to cache sessions and chat histories, and establish WebSockets for instantaneous messaging.

```mermaid
flowchart TD
    Browser[Web Browser]
    FastAPI[FastAPI Backend]
    Google[Google OAuth Server]
    Postgres[(PostgreSQL Database)]
    Redis[(Redis Cache)]

    Browser -->|1. OAuth Redirect & Callback| Google
    Browser -->|2. HTTP Requests with Session Cookie| FastAPI
    Browser -->|3. Establish WebSocket Connection| FastAPI
    FastAPI -->|Check/Set Session & Cache History| Redis
    FastAPI -->|Query/Persist Messages & Users| Postgres
```

### Real Developer Use Case
In production systems, raw WebSockets are stateful and memory-intensive. Keeping chat histories or sessions in-memory limits scalability. By storing persistent records in PostgreSQL and using Redis for high-speed session checks and chat history caches, you create a stateless, horizontally-scalable backend capable of handling thousands of concurrent users.

---

### Step 1: Setup Local Environment & Services
<details>
<summary>Click to view Docker & project initialization steps</summary>

First, create a project directory and initialize it with `uv`. Spin up the PostgreSQL database and Redis cache locally using Docker Compose.

1. **Initialize Project:**
```bash
# Create directory and initialize with uv
mkdir socket-chat
cd socket-chat
uv init

# Add all required backend dependencies
uv add fastapi "uvicorn[standard]" redis sqlalchemy asyncpg authlib httpx python-dotenv
```

2. **Docker Compose Setup (`docker-compose.yml`):**
Create a compose file to orchestrate PostgreSQL and Redis services.
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: chat_postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: chatdb
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: chat_redis
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

3. **Environment Variables Config (`.env`):**
Create a `.env` file to hold local connection details and OAuth credentials.
```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/chatdb
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
SESSION_SECRET=make-sure-this-is-a-long-random-alphanumeric-string
ENV=development
```

4. **Start local services:**
```bash
docker compose up -d
```
</details>

---

### Step 2: Database Layer (SQLAlchemy & Postgres)
<details>
<summary>Click to view Database models and asyncpg configuration</summary>

Define the database schemas for storing user profiles (synced from Google OAuth) and the messages table. We will use SQLAlchemy 2.0 with the asynchronous `asyncpg` driver.

```python
# Create database.py
import os
from typing import Optional
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import Column, String, Integer, Text, ForeignKey, BigInteger

# Pull database URL from env
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/chatdb")

# Initialize async engine
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    # Store Google-authenticated email as unique ID
    email: Mapped[str] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(nullable=False)
    picture: Mapped[Optional[str]] = mapped_column(nullable=True)

class Message(Base):
    __tablename__ = "messages"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    sender: Mapped[str] = mapped_column(ForeignKey("users.email"), nullable=False)
    receiver: Mapped[str] = mapped_column(ForeignKey("users.email"), nullable=False)
    text: Mapped[str] = mapped_column(nullable=False)
    timestamp: Mapped[int] = mapped_column(nullable=False) # Unix timestamp in milliseconds
```
</details>

---

### Step 3: Google OAuth & Redis Session Caching
<details>
<summary>Click to view Google OAuth login flow and Redis session handling</summary>

Implement Google OAuth using `authlib`. When a user successfully authenticates, their profile is stored/updated in PostgreSQL. Then, a random session token is generated, stored in Redis with a 24-hour TTL, and set in the client's browser as a secure `HttpOnly` cookie.

```mermaid
sequenceDiagram
    participant Browser
    participant API as FastAPI Backend
    participant Google as Google OAuth
    participant DB as Postgres
    participant Redis as Redis Cache

    Browser->>API: GET /api/auth/login
    API-->>Browser: Redirect to Google Consent
    Browser->>Google: Consent & Authenticate
    Google->>API: Redirect to /api/auth/callback?code=...
    API->>Google: Exchange authorization code for profile
    Google-->>API: User email, name, picture
    API->>DB: Upsert user details
    API->>Redis: Set session:<session_token> -> user profile (TTL 24h)
    API-->>Browser: Set-Cookie: session_token=<value> (HttpOnly) & redirect to /
```

Here is the implementation of the authentication endpoints:
```python
import json
import secrets
from fastapi import Request, HTTPException, Response
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
import redis.asyncio as redis

# Setup redis async connection
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
r = redis.from_url(REDIS_URL, decode_responses=True)

oauth = OAuth()
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    client_kwargs={'scope': 'openid email profile'}
)

async def get_user_from_session(session_token: str | None) -> dict:
    # Resolve cookie and retrieve user profile from Redis cache
    if not session_token:
        raise HTTPException(status_code=401, detail="Session missing")
    
    session_data = await r.get(f"session:{session_token}")
    if not session_data:
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Touch session key to extend its life
    await r.expire(f"session:{session_token}", 3600 * 24)
    return json.loads(session_data)
```
</details>

---

### Step 4: WebSocket Real-Time Connection Manager
<details>
<summary>Click to view WebSocket connection and routing code</summary>

FastAPI handles WebSockets using the `WebSocket` class. We create a `ConnectionManager` to keep track of active WebSocket connections mapped to user emails. The endpoint extracts the cookie to authorize the connection before accepting it.

```python
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict

class ConnectionManager:
    def __init__(self):
        # Maps user email -> Active WebSocket
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, email: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[email] = websocket

    def disconnect(self, email: str):
        self.active_connections.pop(email, None)

    async def send_private_message(self, recipient_email: str, message: dict):
        ws = self.active_connections.get(recipient_email)
        if ws:
            await ws.send_json(message)

manager = ConnectionManager()
```
</details>

---

### Step 5: Cache-Aside Chat History & Cache Invalidation
<details>
<summary>Click to view the cache-aside caching pattern and full main.py code</summary>

When a user requests history with a peer:
1. Search Redis using key `chat:<user1>:<user2>` (emails sorted alphabetically).
2. If found, return cached data immediately (Cache Hit).
3. If not found, fetch last 100 messages from Postgres, write to Redis with a 10-minute TTL, and return (Cache Miss).
4. **Invalidation:** When a new WebSocket message is received, write it to Postgres, then delete the corresponding cache key in Redis so the next history request reads the updated database.

```mermaid
sequenceDiagram
    participant Browser
    participant API as FastAPI Backend
    participant Redis as Redis Cache
    participant DB as Postgres

    Browser->>API: GET /api/chat/history/{peer}
    API->>Redis: GET chat:alice:bob
    alt Cache Hit
        Redis-->>API: JSON Chat List
        API-->>Browser: Return history (Source: Cache)
    else Cache Miss
        Redis-->>API: None
        API->>DB: Query messages table
        DB-->>API: List of records
        API->>Redis: SET chat:alice:bob with TTL 600s
        API-->>Browser: Return history (Source: Database)
    end
```

Create the main application file `main.py` combining the database, auth, WS manager, and caching logic:

```python
# main.py
import os
import json
import time
import secrets
from typing import Dict, Optional
from contextlib import asynccontextmanager

import redis.asyncio as redis
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Response, Request, Cookie
from fastapi.responses import HTMLResponse, RedirectResponse
from pydantic import BaseModel

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, Mapped, mapped_column
from sqlalchemy import select, or_, and_

from authlib.integrations.starlette_client import OAuth
from starlette.middleware.sessions import SessionMiddleware

# 1. Config & Initializations
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/chatdb")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
SESSION_SECRET = os.getenv("SESSION_SECRET", "super-secret-key-change-me")
ENV = os.getenv("ENV", "development")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create Postgres tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(title="Socket Chat Lab", lifespan=lifespan)
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET)

# Connect to Redis & DB
r = redis.from_url(REDIS_URL, decode_responses=True)
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# 2. Database Models
class User(Base):
    __tablename__ = "users"
    email: Mapped[str] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(nullable=False)
    picture: Mapped[Optional[str]] = mapped_column(nullable=True)

class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    sender: Mapped[str] = mapped_column(nullable=False)
    receiver: Mapped[str] = mapped_column(nullable=False)
    text: Mapped[str] = mapped_column(nullable=False)
    timestamp: Mapped[int] = mapped_column(nullable=False)

# 3. Google OAuth Register
oauth = OAuth()
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    client_kwargs={'scope': 'openid email profile'}
)

async def get_user_from_session(session_token: Optional[str]) -> dict:
    if not session_token:
        raise HTTPException(status_code=401, detail="Session missing")
    data = await r.get(f"session:{session_token}")
    if not data:
        raise HTTPException(status_code=401, detail="Session expired")
    await r.expire(f"session:{session_token}", 3600 * 24)
    return json.loads(data)

def get_chat_cache_key(email1: str, email2: str) -> str:
    sorted_emails = sorted([email1, email2])
    return f"chat:{sorted_emails[0]}:{sorted_emails[1]}"

# 4. REST Endpoints
@app.get("/")
async def get_home():
    if os.path.exists("static/index.html"):
        with open("static/index.html", "r") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse("<h1>Frontend not found! Verify Step 6.</h1>")

@app.get("/api/auth/login")
async def login(request: Request):
    redirect_uri = request.url_for('auth_callback')
    if ENV == "production":
        redirect_uri = str(redirect_uri).replace("http://", "https://")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/api/auth/callback")
async def auth_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    userinfo = token.get("userinfo")
    if not userinfo:
        raise HTTPException(status_code=400, detail="OAuth profile retrieval failed")
    
    email = userinfo.get("email")
    name = userinfo.get("name", email.split("@")[0])
    picture = userinfo.get("picture")

    # Save to PostgreSQL
    async with async_session() as session:
        async with session.begin():
            res = await session.execute(select(User).where(User.email == email))
            user = res.scalar_one_or_none()
            if not user:
                session.add(User(email=email, name=name, picture=picture))
            else:
                user.name = name
                user.picture = picture
            await session.commit()

    # Generate session key and cache in Redis
    session_token = secrets.token_urlsafe(32)
    await r.set(f"session:{session_token}", json.dumps({"email": email, "name": name, "picture": picture}), ex=3600*24)

    response = RedirectResponse(url="/")
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=(ENV == "production"),
        samesite="lax",
        max_age=3600 * 24
    )
    return response

@app.post("/api/auth/logout")
async def logout(response: Response, session_token: Optional[str] = Cookie(None)):
    if session_token:
        await r.delete(f"session:{session_token}")
    response.delete_cookie("session_token")
    return {"status": "logged_out"}

@app.get("/api/me")
async def get_me(session_token: Optional[str] = Cookie(None)):
    return await get_user_from_session(session_token)

@app.get("/api/users")
async def get_users(session_token: Optional[str] = Cookie(None)):
    current_user = await get_user_from_session(session_token)
    async with async_session() as session:
        res = await session.execute(select(User).where(User.email != current_user["email"]))
        users = res.scalars().all()
        return [{"email": u.email, "name": u.name, "picture": u.picture} for u in users]

@app.get("/api/chat/history/{peer_email}")
async def get_chat_history(peer_email: str, session_token: Optional[str] = Cookie(None)):
    curr_user = await get_user_from_session(session_token)
    my_email = curr_user["email"]
    cache_key = get_chat_cache_key(my_email, peer_email)

    # Cache-Aside: 1. Try Cache
    cached = await r.get(cache_key)
    if cached:
        return {"source": "cache", "messages": json.loads(cached)}

    # Cache-Aside: 2. Fallback to DB
    async with async_session() as session:
        stmt = select(Message).where(
            or_(
                and_(Message.sender == my_email, Message.receiver == peer_email),
                and_(Message.sender == peer_email, Message.receiver == my_email)
            )
        ).order_by(Message.timestamp.asc())
        res = await session.execute(stmt)
        history = [
            {"sender": m.sender, "receiver": m.receiver, "text": m.text, "timestamp": m.timestamp}
            for m in res.scalars().all()
        ]

    # Cache-Aside: 3. Set Cache
    await r.set(cache_key, json.dumps(history), ex=600)
    return {"source": "database", "messages": history}

# 5. WebSockets Logic
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, email: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[email] = websocket

    def disconnect(self, email: str):
        self.active_connections.pop(email, None)

    async def send_private_message(self, recipient: str, msg: dict):
        ws = self.active_connections.get(recipient)
        if ws:
            await ws.send_json(msg)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    session_token = websocket.cookies.get("session_token")
    try:
        user = await get_user_from_session(session_token)
    except Exception:
        await websocket.close(code=1008)
        return

    my_email = user["email"]
    await manager.connect(my_email, websocket)

    try:
        while True:
            data = await websocket.receive_json()
            recipient = data.get("to")
            text = data.get("text", "").strip()

            if not recipient or not text:
                continue

            timestamp = int(time.time() * 1000)

            # A. Persist message to Postgres DB
            async with async_session() as session:
                async with session.begin():
                    session.add(Message(sender=my_email, receiver=recipient, text=text, timestamp=timestamp))
                await session.commit()

            # B. Invalidate Redis Cache Key (Delete cache key)
            cache_key = get_chat_cache_key(my_email, recipient)
            await r.delete(cache_key)

            # C. Publish message
            payload = {"sender": my_email, "receiver": recipient, "text": text, "timestamp": timestamp}
            await manager.send_private_message(recipient, payload)
            await manager.send_private_message(my_email, payload)

    except WebSocketDisconnect:
        manager.disconnect(my_email)
```
</details>

---

### Step 6: Interactive Frontend (Vanilla CSS & JS UI)
<details>
<summary>Click to view index.html & custom glassmorphism styles</summary>

Create `static/index.html`. It uses vanilla HTML/CSS to build a responsive, modern interface. It manages WebSocket lifecycle events (connect, send, close, reconnect) and displays a green/orange status badge indicating whether history was served from Redis cache or Postgres DB.

```html
<!-- static/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Socket Chat Lab</title>
  <style>
    :root {
      --bg-gradient: linear-gradient(135deg, #0f172a, #1e1b4b, #311042);
      --glass-bg: rgba(255, 255, 255, 0.03);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-active: rgba(255, 255, 255, 0.12);
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #8b5cf6;
      --accent-hover: #a78bfa;
      --success: #10b981;
      --warning: #f59e0b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(16px);
      width: 100%;
      max-width: 1000px;
      height: 600px;
      border-radius: 20px;
      display: flex;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .auth-card {
      margin: auto;
      text-align: center;
      padding: 40px;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .btn-google {
      background: var(--accent);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
    }
    .btn-google:hover {
      background: var(--accent-hover);
      transform: translateY(-2px);
    }
    .sidebar {
      width: 300px;
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
    }
    .profile-section {
      padding: 20px;
      border-bottom: 1px solid var(--glass-border);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .profile-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--accent);
    }
    .user-list {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }
    .user-item {
      padding: 12px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 6px;
      transition: background 0.2s;
    }
    .user-item:hover, .user-item.active {
      background: var(--glass-active);
    }
    .chat-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: rgba(0, 0, 0, 0.1);
    }
    .chat-header {
      padding: 20px;
      border-bottom: 1px solid var(--glass-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 700;
    }
    .badge-cache { background: var(--success); color: #000; }
    .badge-db { background: var(--warning); color: #000; }
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .msg-bubble {
      max-width: 60%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }
    .msg-sent {
      align-self: flex-end;
      background: var(--accent);
      border-bottom-right-radius: 4px;
    }
    .msg-received {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.08);
      border-bottom-left-radius: 4px;
    }
    .chat-input-area {
      padding: 20px;
      border-top: 1px solid var(--glass-border);
      display: flex;
      gap: 10px;
    }
    .input-txt {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      padding: 12px;
      border-radius: 10px;
      color: white;
      outline: none;
    }
    .btn-send {
      background: var(--accent);
      border: none;
      color: white;
      padding: 0 20px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
    }
    .logout-btn {
      margin-left: auto;
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-muted);
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 11px;
    }
    .logout-btn:hover { color: var(--text-main); background: rgba(255, 0, 0, 0.15); }
  </style>
</head>
<body>

  <div class="container" id="app">
    <!-- Auth screen -->
    <div class="auth-card" id="auth-screen">
      <h2>Socket Chat Lab</h2>
      <p style="color: var(--text-muted);">Real-time messaging demo featuring Google Sign-in, Postgres storage, and Redis caching.</p>
      <button class="btn-google" onclick="loginWithGoogle()">Sign in with Google</button>
    </div>

    <!-- Active App screen -->
    <div style="display: none; width:100%; height:100%;" id="main-screen">
      <div class="sidebar">
        <div class="profile-section">
          <img src="" id="profile-pic" class="profile-img" alt="avatar">
          <div>
            <div id="profile-name" style="font-weight: 600;">Loading...</div>
          </div>
          <button class="logout-btn" onclick="logout()">Logout</button>
        </div>
        <div class="user-list" id="users-container"></div>
      </div>

      <div class="chat-area">
        <div class="chat-header">
          <h3 id="chat-title">Select a Peer to Chat</h3>
          <span id="cache-source-badge"></span>
        </div>
        <div class="messages" id="messages-container"></div>
        <div class="chat-input-area">
          <input type="text" class="input-txt" id="msg-input" placeholder="Type a message..." onkeydown="if(event.key === 'Enter') sendMsg()">
          <button class="btn-send" onclick="sendMsg()">Send</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let currentUser = null;
    let selectedPeerEmail = null;
    let ws = null;

    async function checkAuth() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          currentUser = await res.json();
          showApp();
        } else {
          showAuth();
        }
      } catch (err) {
        showAuth();
      }
    }

    function showAuth() {
      document.getElementById("auth-screen").style.display = "flex";
      document.getElementById("main-screen").style.display = "none";
    }

    function showApp() {
      document.getElementById("auth-screen").style.display = "none";
      document.getElementById("main-screen").style.display = "flex";
      
      document.getElementById("profile-name").innerText = currentUser.name;
      document.getElementById("profile-pic").src = currentUser.picture || "https://api.dicebear.com/7.x/bottts/svg?seed=" + currentUser.email;

      loadUsers();
      connectWebSocket();
    }

    function loginWithGoogle() {
      window.location.href = "/api/auth/login";
    }

    async function logout() {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    }

    async function loadUsers() {
      const res = await fetch("/api/users");
      const users = await res.json();
      const container = document.getElementById("users-container");
      container.innerHTML = "";
      
      users.forEach(u => {
        const div = document.createElement("div");
        div.className = "user-item";
        div.onclick = () => selectPeer(u, div);
        div.innerHTML = `
          <img src="${u.picture || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + u.email}" class="profile-img" style="width:30px; height:30px;">
          <div>
            <div style="font-size:14px; font-weight:500;">${u.name}</div>
            <div style="font-size:11px; color:var(--text-muted);">${u.email}</div>
          </div>
        `;
        container.appendChild(div);
      });
    }

    async function selectPeer(user, element) {
      document.querySelectorAll(".user-item").forEach(item => item.classList.remove("active"));
      element.classList.add("active");
      
      selectedPeerEmail = user.email;
      document.getElementById("chat-title").innerText = `Chat with ${user.name}`;
      
      await loadChatHistory();
    }

    async function loadChatHistory() {
      if (!selectedPeerEmail) return;
      const res = await fetch(`/api/chat/history/${encodeURIComponent(selectedPeerEmail)}`);
      const data = await res.json();
      
      // Update green/orange caching badge
      const badge = document.getElementById("cache-source-badge");
      if (data.source === "cache") {
        badge.className = "badge badge-cache";
        badge.innerText = "Redis Cache ⚡";
      } else {
        badge.className = "badge badge-db";
        badge.innerText = "Postgres DB 💾";
      }

      const container = document.getElementById("messages-container");
      container.innerHTML = "";
      data.messages.forEach(displayMessage);
      container.scrollTop = container.scrollHeight;
    }

    function displayMessage(msg) {
      const container = document.getElementById("messages-container");
      const div = document.createElement("div");
      
      const isMe = msg.sender === currentUser.email;
      div.className = `msg-bubble ${isMe ? 'msg-sent' : 'msg-received'}`;
      div.innerText = msg.text;
      
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function connectWebSocket() {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        // Display immediately if conversation with sender/recipient is active
        if (selectedPeerEmail && (msg.sender === selectedPeerEmail || msg.receiver === selectedPeerEmail)) {
          displayMessage(msg);
        }
      };

      ws.onclose = () => {
        setTimeout(connectWebSocket, 3000); // Reconnect loop
      };
    }

    function sendMsg() {
      const input = document.getElementById("msg-input");
      const text = input.value.strip ? input.value.strip() : input.value.trim();
      if (!text || !selectedPeerEmail || !ws) return;

      ws.send(JSON.stringify({
        to: selectedPeerEmail,
        text: text
      }));
      input.value = "";
    }

    // Auto check login session on startup
    checkAuth();
  </script>
</body>
</html>
```
</details>

---

### Step 7: Cloud Deployment Guide
<details>
<summary>Click to view deployment steps on Neon, Upstash, and Render</summary>

Follow these steps to deploy this full-stack application online for free:

1. **Deploy the Database (Neon or Supabase):**
   - Go to [Neon.tech](https://neon.tech/) or [Supabase.com](https://supabase.com/).
   - Spin up a free PostgreSQL instance.
   - Copy the direct connection string (URI) starting with `postgresql://...`.
   - Change the driver scheme prefix in your environment variables from `postgresql://` to `postgresql+asyncpg://`.

2. **Deploy the Cache (Upstash Redis):**
   - Go to [Upstash.com](https://upstash.com/) and register.
   - Create a free Serverless Redis database.
   - Under database configuration, copy the **Redis URL** (looks like `redis://default:xxx@xxx.upstash.io:6379`).

3. **Deploy the API Service (Render or Railway):**
   - Connect your GitHub repository containing the project files.
   - Set Build command to: `pip install -r requirements.txt` (or if using uv: `uv pip compile pyproject.toml -o requirements.txt` and then `pip install -r requirements.txt`).
   - Set the Start command to: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
   - Setup these environment variables under the service's Environment settings:
     * `DATABASE_URL`: `postgresql+asyncpg://[username]:[password]@[host]/[dbname]`
     * `REDIS_URL`: `rediss://default:...` (Note: Upstash production uses SSL, change protocol from `redis://` to `rediss://`).
     * `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
     * `GOOGLE_CLIENT_SECRET`: Your Google OAuth Secret key.
     * `SESSION_SECRET`: A long random string.
     * `ENV`: `production`

4. **Update Google OAuth Redirect URI:**
   - Go back to your Google Developer Console.
   - Add your production URL callback to Authorized Redirect URIs: `https://your-render-url.onrender.com/api/auth/callback`.
</details>

---

## What is Redis doing in this app?

```mermaid
flowchart TD
    A[Login] --> B[Redis Session Storage]
    B -->|Check Session Cookie| C{Is Session Active?}
    C -- Yes --> D[Authenticate Request]
    C -- No --> E[Return 401 Unauthorized]

    F[Fetch Chat History] --> G{Is History Cached in Redis?}
    G -- Yes (Cache Hit) --> H[Return Cache Instantaneously]
    G -- No (Cache Miss) --> I[Fetch from Postgres]
    I --> J[Save to Redis Cache with TTL 600s]
    J --> H

    K[New Message Sent] --> L[Delete Redis Chat Cache Key]
    L --> M[Next Request Forces Cache Miss & DB Reload]
```

Redis keys used:
- `session:<session_token>`: Stores authenticated user profile details to bypass querying Postgres on every WebSocket authorization check.
- `chat:<sorted_sender_email>:<sorted_receiver_email>`: Temporary cache store for list of messages between two users (expires in 10 minutes to save memory).

---

## Beginner Mistakes and Safe Habits

- **Mistake: Storing raw database credentials in source code.**
  * *Safe habit:* Always use a `.env` file and read configuration variables using `os.getenv`. Add `.env` to `.gitignore`.
- **Mistake: Forgetting to invalidate the cache after an update.**
  * *Safe habit:* When writes occur (like a new chat message), delete the corresponding cache key `await r.delete(...)`. This guarantees the next read fetches accurate, fresh data.
- **Mistake: Missing secure Cookie properties in production.**
  * *Safe habit:* Set `secure=True` on cookies in production to prevent them from being transmitted over unencrypted HTTP.
- **Mistake: Unrestricted Redis connection without SSL.**
  * *Safe habit:* When connecting to a cloud provider like Upstash in production, always prefix the URL with `rediss://` to ensure connection traffic is encrypted.

---

## Important Q&A

**Q: Why store sessions in Redis instead of using a standard stateless JWT?**
A: Stateless JWTs cannot be easily revoked before they expire. If a user logs out, they remain authorized until the JWT's expiration window closes. By storing sessions in Redis, calling `logout()` deletes the session key, instantly revoking API access.

**Q: Why use Cache-Aside instead of reading directly from PostgreSQL every time?**
A: Databases are disk-bound and relatively slow. Real-time apps with high activity (like active chatting) can easily exhaust database connection pools. Caching read history in-memory with Redis reduces queries on the database by up to 90%, speeding up response times.

**Q: Do WebSockets bypass CORS check?**
A: Browser CORS headers do not apply to WebSocket connections. However, you should validate the `Origin` header during the WebSocket handshake (`/ws` connection initiation) to prevent malicious third-party sites from launching cross-site scripting attacks on your WebSocket endpoints.

---

## Video Resources

Watch these videos to learn about WebSockets in FastAPI and scaling real-time apps with Redis Pub/Sub:

[![FastAPI WebSocket Chat Application with Vanilla JavaScript](https://i.ytimg.com/vi_webp/77c12i5C64U/sddefault.webp)](https://youtu.be/77c12i5C64U)

[![FastApi Web socket App + Broadcast + Redis](https://img.youtube.com/vi/525j4-5uM2k/0.jpg)](https://www.youtube.com/watch?v=525j4-5uM2k)

---

## Revision Checklist

- [ ] local PostgreSQL and Redis services are running via Docker.
- [ ] Google OAuth credentials are set up and redirected properly to `/api/auth/callback`.
- [ ] User profile details are persisted to PostgreSQL on first OAuth login.
- [ ] Active sessions are saved to Redis with a valid TTL and loaded from cookies.
- [ ] Chat history queries hit Redis cache on successive loads (showing `Redis Cache ⚡`).
- [ ] Cache key is deleted on new WebSocket message writes.
- [ ] Production environment variables are mapped to secure cloud service targets.
