id: deployment-platforms
# Deployment Platforms

You've built a great API. Now you need it on the internet. There are four major options for deploying Python APIs without managing your own servers.

---

## Platform Comparison

| Platform | Free Tier | Best For | Cold Start | GPU Support |
|----------|-----------|----------|------------|-------------|
| **HuggingFace Spaces** | ✅ Generous | ML demos, model APIs | Slow (free) | ✅ Yes |
| **Render** | ✅ Limited | Long-running APIs | Yes (free tier) | ❌ No |
| **Railway** | ✅ $5 credit | Full-stack apps, DBs | ❌ No | ❌ No |
| **Vercel** | ✅ Good | Serverless functions | ❌ No | ❌ No |

---

## HuggingFace Spaces

Best for: **ML model demos**, **model-serving APIs**, anything that needs **GPU**.

### Step-by-Step Deployment

**1. Create a Space**
```
huggingface.co → New Space → SDK: Docker → Name: my-api
```

**2. Project structure**
```
my-api/
├── Dockerfile
├── main.py
├── pyproject.toml
└── uv.lock
```

**3. Dockerfile for HF Spaces**

HuggingFace Spaces uses port **7860** and runs as user with UID 1000:

```dockerfile title="Dockerfile"
FROM python:3.12-slim

RUN useradd -m -u 1000 user
WORKDIR /app

RUN pip install uv

COPY --chown=user pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

COPY --chown=user . .

USER user

EXPOSE 7860

CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

**4. README.md (required metadata)**

```yaml title="README.md"
---
title: My TDS API
emoji: 🚀
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# My API

FastAPI service deployed on HuggingFace Spaces.
```

**5. Deploy via Git**

```bash
# One-time setup
git remote add space https://huggingface.co/spaces/YOUR_USERNAME/my-api

# Deploy
git push space main
```

Your API will be live at: `https://your-username-my-api.hf.space`

---

## Render

Best for: **persistent APIs**, **background workers**, **PostgreSQL databases**.

### Step-by-Step

**1. Create a `render.yaml`** (Infrastructure as Code):

```yaml title="render.yaml"
services:
  - type: web
    name: tds-api
    runtime: python
    buildCommand: pip install uv && uv sync --frozen
    startCommand: uv run uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: SECRET_KEY
        generateValue: true       # Render auto-generates a random value
      - key: DATABASE_URL
        fromDatabase:
          name: tds-db
          property: connectionString

databases:
  - name: tds-db
    databaseName: myapp
    user: myapp
```

**2. Connect GitHub**
- Go to [render.com](https://render.com) → New → Web Service
- Connect your GitHub repo
- Render auto-deploys on every `git push`

**3. Environment Variables**
Set in Render dashboard → Environment tab, or via `render.yaml`.

**Free tier limitation**: Spins down after 15 minutes of inactivity. First request takes ~30 seconds (cold start).

---

## Railway

Best for: **full-stack apps**, **PostgreSQL + Redis + API** all in one place, **no cold starts**.

### Step-by-Step

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Add services
railway add postgresql
railway add redis

# Deploy
railway up
```

Or via the dashboard at [railway.app](https://railway.app):
1. New Project → Deploy from GitHub repo
2. Add PostgreSQL service (auto-sets `DATABASE_URL` in your app)
3. Add Redis service (auto-sets `REDIS_URL`)
4. Railway auto-detects Python and runs uvicorn

```python
# Railway sets DATABASE_URL automatically from the PostgreSQL service
import os
DATABASE_URL = os.getenv("DATABASE_URL")
```

**Free tier**: $5 credit/month, enough for most course projects.

---

## Environment Variables on Each Platform

| Platform | How to Set Env Vars |
|----------|---------------------|
| HuggingFace | Space → Settings → Repository secrets |
| Render | Dashboard → Service → Environment |
| Railway | Dashboard → Variables tab or `railway.toml` |

Never commit `.env` to your repo. Use the platform's secrets UI.

---

## Health Check Endpoints

Every deployed service should have a health check:

```python
@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}

@app.get("/ready")
async def ready(db = Depends(get_db)):
    """Check if dependencies are ready"""
    try:
        await db.execute("SELECT 1")
        return {"status": "ready", "db": "ok"}
    except Exception as e:
        raise HTTPException(503, f"Not ready: {str(e)}")
```

Configure health checks in `render.yaml`:
```yaml
healthCheckPath: /health
```

---

## Choosing the Right Platform

```
Need GPU for ML model?
  → HuggingFace Spaces

Need PostgreSQL + Redis + no cold starts?
  → Railway

Need long-running background jobs?
  → Render

Just a simple API, cost-conscious?
  → Render free tier or Railway free credit
```

---

## Summary

| Step | HuggingFace | Render | Railway |
|------|-------------|--------|---------|
| Port | 7860 | `$PORT` env var | `$PORT` env var |
| Config | README.md metadata | render.yaml | railway.toml |
| Deploy | git push | Auto on push | `railway up` or push |
| Free GPU | ✅ | ❌ | ❌ |
| Persistent disk | ❌ | ✅ (paid) | ✅ |

---

