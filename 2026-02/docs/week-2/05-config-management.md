id: config-management
# Config Management

Your code should be the same in development, staging, and production. Only the **configuration** should differ. This is the core idea behind the [12-Factor App](https://12factor.net/config) methodology — and `pydantic-settings` makes it easy.

!> **Never hardcode secrets in your code**
!> If you push `API_KEY = "sk-abc123"` to GitHub, that secret is compromised — even if you delete it in the next commit. Git history keeps it forever.

---

## The 12-Factor Config Rule

> Store config in the **environment**, not in the code.

This means:
- Database URLs, API keys, passwords → environment variables
- Your code reads from the environment at startup
- Different values for dev/staging/prod → different environment variables, same code

---

## python-dotenv

For local development, a `.env` file holds your environment variables:

```bash title=".env"
DATABASE_URL=postgresql://localhost/mydb
OPENAI_API_KEY=sk-your-key-here
SECRET_KEY=my-super-secret-key
DEBUG=true
PORT=8000
```

```bash
# .gitignore — NEVER commit .env
.env
*.env
.env.local
```

```python
from dotenv import load_dotenv
import os

load_dotenv()  # reads .env into environment variables

db_url = os.getenv("DATABASE_URL")       # returns None if missing
port = int(os.getenv("PORT", "8000"))    # with default
```

---

## pydantic-settings (The Better Way)

`pydantic-settings` gives you type validation, default values, and clear error messages when required config is missing.

```bash
uv add pydantic-settings
```

```python title="config.py"
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyUrl, SecretStr
from typing import Optional

class Settings(BaseSettings):
    # Required — app will CRASH at startup if missing, not at runtime
    database_url: AnyUrl
    secret_key: SecretStr           # SecretStr hides value in logs/repr

    # Optional with defaults
    debug: bool = False
    port: int = 8000
    log_level: str = "INFO"
    allowed_origins: list[str] = ["http://localhost:3000"]

    # Optional, truly nullable
    openai_api_key: Optional[SecretStr] = None
    sentry_dsn: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,       # DATABASE_URL = database_url = Ok
    )

# Create a single instance — pydantic validates on creation
settings = Settings()
```

If `DATABASE_URL` is not set, you get a clear error at startup:
```
pydantic_settings.env_settings.SettingsError: 1 validation error for Settings
database_url
  Field required [type=missing, input_value=...]
```

Much better than a `KeyError` deep in your code at 3am in production.

---

## Using Settings in FastAPI

### The `lru_cache` Pattern (Singleton)

```python title="config.py"
from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    openai_api_key: str
    debug: bool = False

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    """Cache the settings — only reads .env once"""
    return Settings()
```

```python title="main.py"
from fastapi import FastAPI, Depends
from config import Settings, get_settings

app = FastAPI()

@app.get("/info")
def app_info(settings: Settings = Depends(get_settings)):
    return {
        "debug": settings.debug,
        "version": "1.0.0",
        # Never expose secret_key or api_key!
    }
```

---

## Secrets Management

### SecretStr

```python
from pydantic import SecretStr

class Settings(BaseSettings):
    api_key: SecretStr

settings = Settings(api_key="my-secret")

# Safe in logs/repr
print(settings.api_key)          # SecretStr('**********')
print(repr(settings.api_key))    # SecretStr('**********')

# Get actual value only when needed
print(settings.api_key.get_secret_value())  # my-secret
```

### Environment-Specific Config

```python title="config.py"
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    environment: str = "development"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def database_echo(self) -> bool:
        """Print SQL queries in development only"""
        return not self.is_production

    class Config:
        env_file = f".env.{os.getenv('APP_ENV', 'development')}"
```

```bash
# .env.development
DATABASE_URL=sqlite:///./dev.db
SECRET_KEY=dev-secret-not-secure
DEBUG=true

# .env.production
DATABASE_URL=postgresql://prod-server/mydb
SECRET_KEY=actual-secure-random-key
DEBUG=false
```

Run with:
```bash
APP_ENV=production uvicorn main:app
```

---

## Multiple Config Sources (Priority Order)

`pydantic-settings` reads from multiple sources in priority order:

```
1. Init arguments (highest priority)
2. Environment variables
3. .env file
4. Default values (lowest priority)
```

So an environment variable always overrides a `.env` file. This is exactly what you want: set defaults in `.env`, override in CI/CD with real environment variables.

---

## Real Project Structure

```
my-api/
├── .env                 ← local dev secrets (gitignored)
├── .env.example         ← committed, shows required vars without values
├── config.py            ← Settings class
├── main.py              ← FastAPI app
└── pyproject.toml
```

```bash title=".env.example"
# Copy this to .env and fill in your values
DATABASE_URL=postgresql://localhost/mydb
SECRET_KEY=generate-with-openssl-rand-hex-32
OPENAI_API_KEY=sk-...
DEBUG=false
```

---

## Validation with Validators

```python
from pydantic import field_validator, AnyUrl
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str
    port: int = 8000
    log_level: str = "INFO"

    @field_validator("secret_key")
    @classmethod
    def secret_key_must_be_strong(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters")
        return v

    @field_validator("log_level")
    @classmethod
    def log_level_must_be_valid(cls, v: str) -> str:
        valid = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
        if v.upper() not in valid:
            raise ValueError(f"log_level must be one of {valid}")
        return v.upper()

    @field_validator("port")
    @classmethod
    def port_must_be_valid(cls, v: int) -> int:
        if not (1024 <= v <= 65535):
            raise ValueError("port must be between 1024 and 65535")
        return v
```

---

## Summary

| Tool | Use Case |
|------|----------|
| `.env` file | Local development secrets |
| `.env.example` | Document required variables (commit this) |
| `pydantic-settings` | Typed, validated settings with defaults |
| `SecretStr` | Prevent secrets from appearing in logs |
| `@lru_cache` | Load settings once, reuse everywhere |
| Environment variables | Override `.env` in CI/CD and production |