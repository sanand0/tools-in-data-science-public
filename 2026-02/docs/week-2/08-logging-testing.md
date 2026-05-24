id: logging-testing
# Logging & Testing

Two things that separate hobby projects from production code: **structured logging** (so you can search and analyze logs) and **automated tests** (so you know when you break something).

---

## Logging with structlog

Regular `logging` produces text like `2024-01-15 ERROR Something failed`. **structlog** produces JSON like `{"level": "error", "event": "Something failed", "user_id": 42, "duration_ms": 123}` — searchable and machine-readable.

```bash
uv add structlog
```

### Setup

```python title="logging_config.py"
import structlog
import logging
import sys

def setup_logging(debug: bool = False):
    """Configure structlog for the entire application"""

    # Set log level
    log_level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=log_level,
    )

    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            # JSON in production, pretty-print in dev
            structlog.dev.ConsoleRenderer() if debug
            else structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.stdlib.BoundLogger,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )
```

### Using structlog

```python title="main.py"
import structlog
from logging_config import setup_logging

setup_logging(debug=True)
log = structlog.get_logger()

@app.get("/users/{user_id}")
async def get_user(user_id: int, request: Request):
    # Bind context for all log calls in this request
    bound_log = log.bind(user_id=user_id, method="GET", path="/users")

    bound_log.info("Fetching user")
    user = db.get_user(user_id)

    if not user:
        bound_log.warning("User not found")
        raise HTTPException(404, "User not found")

    bound_log.info("User fetched successfully", email=user.email)
    return user
```

Output (dev mode, pretty):
```
2024-01-15T10:23:45Z [info     ] Fetching user   user_id=42 method=GET
2024-01-15T10:23:45Z [info     ] User fetched    user_id=42 email=arjun@iitm.ac.in
```

Output (production, JSON):
```json
{"timestamp": "2024-01-15T10:23:45Z", "level": "info", "event": "Fetching user", "user_id": 42}
{"timestamp": "2024-01-15T10:23:45Z", "level": "info", "event": "User fetched", "user_id": 42, "email": "arjun@iitm.ac.in"}
```

---

## Testing with pytest

```bash
uv add --dev pytest pytest-asyncio httpx
```

### Basic Test Structure

```python title="tests/test_api.py"
from fastapi.testclient import TestClient
from main import app

# TestClient doesn't need a running server
client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, World!"}

def test_create_task():
    response = client.post("/tasks", json={"title": "Buy groceries"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Buy groceries"
    assert "id" in data

def test_get_nonexistent_task():
    response = client.get("/tasks/fake-id")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
```

Run tests:
```bash
pytest                          # run all tests
pytest -v                       # verbose output
pytest tests/test_api.py -v     # specific file
pytest -k "test_create"         # run tests matching pattern
```

### Testing with Authentication

```python title="tests/conftest.py"
import pytest
from fastapi.testclient import TestClient
from main import app
from config import get_settings, Settings

# Override settings for tests
def get_test_settings():
    return Settings(
        secret_key="test-secret-key-that-is-long-enough-32chars",
        database_url="sqlite:///./test.db",
    )

app.dependency_overrides[get_settings] = get_test_settings

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def auth_headers(client):
    """Get a valid JWT token for testing"""
    # Create a test user token directly (bypass OAuth flow)
    from jose import jwt
    from datetime import datetime, timedelta

    token = jwt.encode(
        {"sub": "123", "email": "test@test.com", "exp": datetime.utcnow() + timedelta(hours=1)},
        "test-secret-key-that-is-long-enough-32chars",
        algorithm="HS256",
    )
    return {"Authorization": f"Bearer {token}"}
```

```python title="tests/test_protected.py"
def test_protected_without_auth(client):
    response = client.get("/protected")
    assert response.status_code == 401

def test_protected_with_auth(client, auth_headers):
    response = client.get("/protected", headers=auth_headers)
    assert response.status_code == 200
    assert "Hello" in response.json()["message"]
```

### Async Tests

```python title="tests/test_async.py"
import pytest
import httpx
from httpx import AsyncClient
from main import app

@pytest.mark.anyio
async def test_async_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
```

```bash
uv add --dev anyio[trio]
```

```ini title="pyproject.toml"
[tool.pytest.ini_options]
anyio_mode = "asyncio"
```

---

## Test Coverage

```bash
uv add --dev pytest-cov
```

```bash
# Run tests and measure coverage
pytest --cov=main --cov-report=term-missing

# Generate HTML report
pytest --cov=main --cov-report=html
# → Open htmlcov/index.html in browser
```

Output:
```
---------- coverage: platform linux, python 3.12 ----------
Name      Stmts   Miss  Cover   Missing
-----------------------------------------
main.py      45      3    93%   67, 71, 89
-----------------------------------------
TOTAL        45      3    93%
```

Add to `pyproject.toml`:
```toml
[tool.pytest.ini_options]
addopts = "--cov=. --cov-report=term-missing --cov-fail-under=80"
```

Now `pytest` always shows coverage and fails if it drops below 80%.

---

## Organizing Tests

```
tests/
├── conftest.py           ← shared fixtures
├── test_auth.py          ← auth endpoints
├── test_tasks.py         ← task CRUD
├── test_middleware.py    ← CORS, rate limits
└── test_websocket.py     ← WebSocket tests
```

```python title="tests/test_websocket.py"
from fastapi.testclient import TestClient
from main import app

def test_websocket_echo():
    client = TestClient(app)
    with client.websocket_connect("/ws") as ws:
        ws.send_text("hello")
        data = ws.receive_text()
        assert data == "Echo: hello"
```

---

## Summary

| Tool | Purpose |
|------|---------|
| `structlog` | Structured JSON logs, searchable in production |
| `pytest` | Test runner |
| `TestClient` | Test FastAPI without a running server |
| `AsyncClient` (httpx) | Test async endpoints |
| `conftest.py` | Shared fixtures (client, auth tokens, DB) |
| `dependency_overrides` | Swap real services with test fakes |
| `pytest-cov` | Measure how much code is tested |