id: docker-compose

# Docker & Compose

Docker packages your app and all its dependencies into a **container** — a lightweight, isolated environment that runs identically on any machine. No more "works on my machine" problems.

?> **Key Mental Model**
?> - **Image** = blueprint (like a class in Python)
?> - **Container** = running instance of an image (like an object)
?> - **Dockerfile** = recipe for building an image
?> - **Docker Compose** = run multiple containers together

---

## Installing Docker

Download [Docker Desktop](https://www.docker.com/products/docker-desktop/) for Windows/Mac. On Linux:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # add yourself to docker group
# logout and login again
docker run hello-world           # verify it works
```

---

## Your First Dockerfile

```dockerfile title="Dockerfile"
# Base image — Python 3.12 slim (smaller than full Python image)
FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# Install UV first (for fast installs)
RUN pip install uv

# Copy dependency files first (Docker layer caching trick)
COPY pyproject.toml uv.lock ./

# Install dependencies (this layer is cached unless deps change)
RUN uv sync --frozen --no-dev

# Copy application code
COPY . .

# Tell Docker which port the app listens on
EXPOSE 8000

# Command to run the app
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t my-api .           # build image, tag it "my-api"
docker run -p 8000:8000 my-api     # run, map host:8000 → container:8000
# → http://localhost:8000
```

---

## .dockerignore

Like `.gitignore` but for Docker. Keeps your image small and fast:

```text title=".dockerignore"
.env
.env.*
__pycache__
*.pyc
*.pyo
.git
.gitignore
.venv
venv
*.egg-info
dist/
build/
.pytest_cache
.mypy_cache
README.md
docs/
tests/
```

Without `.dockerignore`, Docker copies your entire project including `.venv` (hundreds of MB) into the build context.

---

## Multi-Stage Build (Production Best Practice)

Multi-stage builds create smaller, more secure images by separating the build environment from the runtime environment:

```dockerfile title="Dockerfile"
# ── Stage 1: Builder ──────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# Install UV
RUN pip install uv

# Install dependencies into a virtual environment
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# ── Stage 2: Runtime ─────────────────────────────────────────
FROM python:3.12-slim AS runtime

# Security: don't run as root
RUN useradd --create-home appuser
USER appuser
WORKDIR /home/appuser/app

# Copy only the installed packages from builder
COPY --from=builder /app/.venv /home/appuser/app/.venv

# Copy application code
COPY --chown=appuser:appuser . .

# Activate venv
ENV PATH="/home/appuser/app/.venv/bin:$PATH"

EXPOSE 8000

# Use exec form (not shell form) for proper signal handling
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

Result: the runtime image has no build tools, no pip, no UV — just Python and your app. Typically **70-80% smaller** than a naive image.

---

## Essential Docker Commands

```bash
# Building
docker build -t my-api .                    # build with tag
docker build -t my-api:v1.0 .              # build with version tag

# Running
docker run my-api                           # run (stops when terminal closes)
docker run -d my-api                        # run in background (detached)
docker run -d -p 8000:8000 my-api          # detached + port mapping
docker run -d -p 8000:8000 \
  -e DATABASE_URL=sqlite:///./db.sqlite \  # pass env vars
  my-api

# Inspecting
docker ps                                   # running containers
docker ps -a                               # all containers (including stopped)
docker logs my-container                   # view logs
docker logs -f my-container               # follow logs (like tail -f)
docker exec -it my-container bash         # shell inside running container

# Cleanup
docker stop my-container                   # graceful stop
docker rm my-container                     # delete container
docker rmi my-api                          # delete image
docker system prune                        # delete all unused stuff
```

---

## Docker Compose

Compose runs multiple containers as a single application. Your FastAPI app needs both the API server and a Redis cache — Compose handles them together.

```yaml title="docker-compose.yml"
version: "3.9"

services:
  # ── FastAPI App ────────────────────────────────────────────
  api:
    build: .                          # build from local Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
      - REDIS_URL=redis://redis:6379
    env_file:
      - .env                          # also load .env file
    depends_on:
      db:
        condition: service_healthy    # wait for postgres to be ready
      redis:
        condition: service_started
    volumes:
      - ./app:/app                    # mount code for hot reload
    restart: unless-stopped

  # ── PostgreSQL ─────────────────────────────────────────────
  db:
    image: postgres:16-alpine         # use official image, don't build
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data  # persist data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  # ── Redis ──────────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # ── Grafana (monitoring) ───────────────────────────────────
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  redis_data:
  grafana_data:
```

```bash
# Start everything
docker compose up

# Start in background
docker compose up -d

# View logs from all services
docker compose logs -f

# View logs from one service
docker compose logs -f api

# Stop everything
docker compose down

# Stop and delete volumes (wipe database!)
docker compose down -v

# Rebuild after code changes
docker compose up --build
```

---

## Compose Profiles (Advanced)

Run different subsets of services:

```yaml title="docker-compose.yml"
services:
  api:
    build: .
    ports: ["8000:8000"]

  db:
    image: postgres:16-alpine
    profiles: ["full", "db"]    # only starts with these profiles

  prometheus:
    image: prom/prometheus
    profiles: ["monitoring"]    # only starts with monitoring profile

  grafana:
    image: grafana/grafana
    profiles: ["monitoring"]
```

```bash
# Start just the API (no DB, no monitoring)
docker compose up api

# Start API + DB
docker compose --profile db up

# Start everything including monitoring
docker compose --profile full --profile monitoring up
```

---

## Layer Caching — The Key to Fast Builds

Docker caches each layer. If a layer hasn't changed, it uses the cache. The trick: **copy files that change least first**.

```dockerfile
# GOOD: deps first (rarely change), code second (often changes)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen                # cached unless deps change
COPY . .                            # only re-copies when code changes

# BAD: code first (always changes, invalidates all layers after)
COPY . .                            # changes every time
RUN uv sync --frozen                # always re-runs!
```

---

## Video Reference

[![Docker Tutorial for Beginners](https://img.youtube.com/vi/pg19Z8LL06w/0.jpg)](https://youtu.be/pg19Z8LL06w "Docker Tutorial for Beginners")

---

## Summary

| Concept | Purpose |
|---------|---------|
| `FROM` | Base image to build on |
| `WORKDIR` | Working directory inside container |
| `COPY` | Copy files from host to container |
| `RUN` | Execute commands during build |
| `CMD` | Command to run when container starts |
| `EXPOSE` | Document which port the app uses |
| Multi-stage | Smaller production images |
| `.dockerignore` | Exclude files from build context |
| `docker-compose.yml` | Define multi-container applications |
| `depends_on` | Control container startup order |
| `healthcheck` | Verify service is actually ready |