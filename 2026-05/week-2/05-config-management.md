# Config Management — Practical Notes

Config management means **same code, different values**. Your app code should not change between laptop, GitHub Actions, Hugging Face Spaces, staging, or production. Only environment variables change. This is the 12-factor idea: store config in the environment, not hardcoded in code.

```mermaid
flowchart LR
    Code["main.py / app.py<br/>same everywhere"]
    Local["Local .env<br/>dev values"]
    Bash["~/.bashrc<br/>machine-wide values"]
    GitHub["GitHub Actions Secrets<br/>CI/CD values"]
    HF["Hugging Face Space Secrets<br/>deployment values"]

    Local --> Code
    Bash --> Code
    GitHub --> Code
    HF --> Code
```

Real developers use config management for database URLs, API keys, model names, debug mode, allowed CORS origins, logging level, ports, feature flags, and deployment secrets. The golden rule: **commit code and `.env.example`; never commit `.env`**.

Start a tiny FastAPI project:

```bash
mkdir config-demo
cd config-demo

uv init
uv add fastapi uvicorn pydantic-settings python-dotenv

mkdir app
touch app/main.py app/config.py .env .env.example .gitignore
```

Use `.gitignore` immediately:

```gitignore
# Never commit real secrets
.env
*.env
.env.local
.env.*.local

# Python noise
.venv/
__pycache__/
*.pyc
```

`.env` is for your laptop only:

```bash
# .env
APP_NAME=Config Demo
APP_ENV=development
DEBUG=true
PORT=8000
DATABASE_URL=sqlite:///./dev.db
SECRET_KEY=change-this-to-a-long-random-secret
OPENAI_API_KEY=sk-local-fake-key
ALLOWED_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

`.env.example` is committed so others know what to create:

```bash
# .env.example
APP_NAME=Config Demo
APP_ENV=development
DEBUG=false
PORT=8000
DATABASE_URL=sqlite:///./dev.db
SECRET_KEY=generate-with-openssl-rand-hex-32
OPENAI_API_KEY=
ALLOWED_ORIGINS=["http://localhost:3000"]
```

Generate a real local secret:

```bash
openssl rand -hex 32
```

Use `.bashrc` for values you want available in every terminal session, not only one project:

```bash
# ~/.bashrc
export TDS_USER="your-name"
export APP_ENV="development"

# Reload without reopening terminal
source ~/.bashrc

# Check
echo "$APP_ENV"
```

Use `.env` for **project-specific config**. Use `.bashrc` for **machine/user-level defaults**. Use GitHub/Hugging Face secrets for **cloud/runtime config**.

```mermaid
flowchart TD
    A["Need a value?"] --> B{"Is it secret?"}
    B -->|Yes| C{"Where running?"}
    C -->|Local| D[".env<br/>gitignored"]
    C -->|GitHub Actions| E["Repo Settings → Secrets"]
    C -->|Hugging Face Spaces| F["Space Settings → Secrets"]
    B -->|No| G{"Project-specific?"}
    G -->|Yes| H[".env.example / env vars"]
    G -->|No| I["~/.bashrc or shell profile"]
```

Now write typed config once:

```python
# app/config.py
from functools import lru_cache
from typing import Literal

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Required values
    app_name: str
    database_url: str
    secret_key: SecretStr

    # Optional values with defaults
    app_env: Literal["development", "staging", "production"] = "development"
    debug: bool = False
    port: int = 8000
    log_level: str = "INFO"
    openai_api_key: SecretStr | None = None
    allowed_origins: list[str] = ["http://localhost:3000"]

    # Read .env locally; real environment variables can override it
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @field_validator("secret_key")
    @classmethod
    def secret_key_must_be_strong(cls, value: SecretStr) -> SecretStr:
        # SecretStr hides the value in logs, so unwrap only for validation
        if len(value.get_secret_value()) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters")
        return value

    @field_validator("log_level")
    @classmethod
    def log_level_must_be_valid(cls, value: str) -> str:
        value = value.upper()
        valid = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
        if value not in valid:
            raise ValueError(f"LOG_LEVEL must be one of {valid}")
        return value

    @field_validator("port")
    @classmethod
    def port_must_be_valid(cls, value: int) -> int:
        if not (1024 <= value <= 65535):
            raise ValueError("PORT must be between 1024 and 65535")
        return value


@lru_cache
def get_settings() -> Settings:
    # Settings is created once and reused by FastAPI dependencies
    return Settings()
```

`pydantic-settings` is better than raw `os.getenv()` because it gives types, defaults, validation errors at startup, and safer handling of secrets with `SecretStr`. `SecretStr` hides values when printed, and `lru_cache` avoids reading settings repeatedly.

Use it in FastAPI:

```python
# app/main.py
from fastapi import Depends, FastAPI
from app.config import Settings, get_settings

app = FastAPI()


@app.get("/")
def home(settings: Settings = Depends(get_settings)):
    return {
        "app": settings.app_name,
        "env": settings.app_env,
        "debug": settings.debug,
        # Never return secret_key or api keys
    }


@app.get("/health")
def health():
    return {"ok": True}
```

Run locally:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

Test missing config:

```bash
mv .env .env.backup

uv run uvicorn app.main:app --reload

# App should fail early with a clear validation error
# This is good: fail at startup, not after deployment
mv .env.backup .env
```

Config priority is important:

```mermaid
flowchart TD
    A["1. Values passed directly in code<br/>highest priority"]
    B["2. Real environment variables"]
    C["3. .env file"]
    D["4. Defaults in Settings class<br/>lowest priority"]

    A --> B --> C --> D
```

So this overrides `.env` temporarily:

```bash
APP_ENV=production DEBUG=false uv run uvicorn app.main:app
```

Environment-specific files are useful, but don’t overcomplicate early projects:

```bash
# .env.development
APP_ENV=development
DEBUG=true
DATABASE_URL=sqlite:///./dev.db

# .env.production
APP_ENV=production
DEBUG=false
DATABASE_URL=postgresql://user:pass@host/db
```

A simple pattern:

```python
# app/config.py
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

env = os.getenv("APP_ENV", "development")

class Settings(BaseSettings):
    database_url: str
    secret_key: str

    model_config = SettingsConfigDict(
        env_file=f".env.{env}",
        case_sensitive=False,
    )
```

But for deployment, prefer **real environment variables/secrets** over production `.env` files.

GitHub Actions secrets are stored in GitHub and accessed through the `secrets` context. A secret must be explicitly passed to a workflow step to be usable — it doesn't appear automatically.

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    env:
      APP_ENV: test
      DEBUG: "false"
      DATABASE_URL: sqlite:///./test.db
      SECRET_KEY: ${{ secrets.SECRET_KEY }}
      OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v5

      - name: Install dependencies
        run: uv sync

      - name: Check app imports
        run: uv run python -c "from app.config import get_settings; print(get_settings().app_env)"

      # Never echo secrets
      # Bad: echo "$OPENAI_API_KEY"
```

Never echo or print secrets anywhere in logs. GitHub redacts stored secrets in logs, but redaction isn't guaranteed for every transformed form of the value.

For Hugging Face Spaces, add secrets in Space Settings — they arrive as environment variables when the Space starts.

In Hugging Face Spaces:

```text
Space → Settings → Variables and secrets

Secret:
OPENAI_API_KEY = sk-...

Variable:
APP_ENV = production
MODEL_NAME = gpt-4.1-mini
```

Then read normally:

```python
# app.py on Hugging Face Space
import os

api_key = os.getenv("OPENAI_API_KEY")
model_name = os.getenv("MODEL_NAME", "default-model")

# Do not print api_key
print("Model:", model_name)
```

For a Gradio/FastAPI Space, the same `pydantic-settings` pattern works because secrets arrive as environment variables.

Common beginner mistakes:

```text
Mistake: committing .env
Safe habit: commit .env.example only

Mistake: putting API_KEY = "..." inside Python
Safe habit: read from Settings

Mistake: printing settings object directly
Safe habit: use SecretStr and never log secrets

Mistake: assuming .bashrc is loaded everywhere
Safe habit: CI, Docker, Hugging Face, and servers need their own env vars

Mistake: using production secrets locally
Safe habit: use separate dev/staging/prod keys

Mistake: changing code for deployment
Safe habit: change config, not code
```

One complete working structure:

```text
config-demo/
├── app/
│   ├── config.py
│   └── main.py
├── .env              # local only, ignored
├── .env.example      # committed
├── .gitignore
├── pyproject.toml
└── .github/
    └── workflows/
        └── test.yml
```

Useful commands:

```bash
# See environment variable for current shell
echo "$APP_ENV"

# Set variable for one command only
APP_ENV=production uv run python -c "import os; print(os.getenv('APP_ENV'))"

# Export variable for current terminal session
export APP_ENV=production
uv run uvicorn app.main:app

# Remove variable from current shell
unset APP_ENV

# Check whether .env is accidentally tracked
git check-ignore .env

# If .env was already committed, remove from Git tracking
git rm --cached .env
git commit -m "Stop tracking local env file"

# Important: if a real secret was committed, rotate/revoke it
```

## Important Q&A

**Q: Should I put my `.env` file in Docker?**
A: You can pass an `--env-file` to Docker, but do not build the `.env` file into your Docker image. The image should remain environment-agnostic.

**Q: What happens if I forget to use `SecretStr`?**
A: If you use a regular `str` for passwords or keys, printing the `Settings` object (e.g. `print(settings)`) will log the actual secret to your terminal or server logs, creating a huge security risk.

**Q: Is `lru_cache` really necessary for settings?**
A: Yes! Without it, `Settings()` reads the disk (`.env`) every single time a request comes in. `lru_cache` ensures it only reads the disk once at startup.

---

## Video Resources

Watch this video to understand environment variables and why they are used to manage configuration and secrets in Python:

[![Python Environment Variables - Corey Schafer](https://i.ytimg.com/vi_webp/5iWhQWVXosU/sddefault.webp)](https://youtu.be/5iWhQWVXosU)

---

Final revision checklist:

```text
[ ] Code has no hardcoded passwords, tokens, API keys, or DB URLs
[ ] .env exists locally but is ignored by Git
[ ] .env.example is committed and contains fake/example values
[ ] Settings class uses pydantic-settings
[ ] Required config fails fast at startup
[ ] Secret values use SecretStr where practical
[ ] FastAPI uses get_settings() with lru_cache
[ ] GitHub Actions uses ${{ secrets.NAME }} for secrets
[ ] Hugging Face Spaces stores secrets in Space Settings
[ ] Logs never print secrets
[ ] Dev, staging, and production use same code with different config
```

