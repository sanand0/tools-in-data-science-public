# Advanced Docker

> **A 1.2 GB image that rebuilds from scratch on every code change is a build-system bug. Multi-stage builds and correct layer order fix both size and speed.**

⏱ ~10 min read · ~20 min hands-on
🔗 needs: [Docker & Compose](/2026-05/week-2/06-docker-compose/) · [GitHub Actions Advanced](/2026-05/week-7/01-github-actions-advanced/)

You can already write a Dockerfile. Production adds three requirements: **small** (fast pulls, less to attack), **cached** (rebuild in seconds), and **safe** (no root, no secrets baked in).

## Try it in 5 minutes — multi-stage + correct layer order

```dockerfile
# syntax=docker/dockerfile:1

# ---- build stage: toolchain lives here and never ships ----
FROM python:3.13-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app

# Dependencies FIRST, in their own layer. Code changes won't invalidate this.
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

# Now the source. Edits below this line only rebuild from here down.
COPY . .
RUN uv sync --frozen --no-dev

# ---- runtime stage: only what's needed to run ----
FROM python:3.13-slim
WORKDIR /app

# Never run as root.
RUN useradd --create-home --uid 1000 app
COPY --from=builder --chown=app:app /app /app
USER app

ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8000/health')"
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

✅ Two wins in one file: build tools never reach the final image, and because dependencies are copied *before* source, editing a `.py` file rebuilds in seconds instead of minutes.

## The layer-cache rule

Docker caches each layer and invalidates every layer *after* the first change. So order from **least to most frequently changed**:

```
1. Base image           ← changes rarely
2. System packages      ← changes rarely
3. Dependency manifests ← changes occasionally   ← install deps HERE
4. Application source   ← changes constantly
```

`COPY . .` before installing dependencies is the single most common Dockerfile mistake: every one-character edit re-downloads the whole dependency tree.

Add a `.dockerignore` or you'll ship your `.git`, `.venv`, and secrets — and bust the cache constantly:

```
.git
.venv
__pycache__/
*.pyc
.env
data/
```

## Secrets: never `COPY`, never `ARG`

Anything added to a layer stays in the image history, even if a later layer deletes it. `docker history` reveals it. Use BuildKit mounts for build-time secrets:

```dockerfile
RUN --mount=type=secret,id=pip_token \
    PIP_TOKEN=$(cat /run/secrets/pip_token) uv sync --frozen
```

```bash
docker build --secret id=pip_token,env=PIP_TOKEN .
```

Runtime secrets come from the environment or a secret manager — never the image.

## Smaller and safer

| Technique | Effect |
|---|---|
| `-slim` base | Hundreds of MB smaller than the full image |
| Multi-stage | Compilers/headers never ship |
| Distroless / Alpine | Smaller still; Alpine's musl can break Python wheels — test |
| Non-root `USER` | Container escape doesn't hand over root |
| Pin base tags/digests | Reproducible builds; no surprise upgrades |
| Scan images | `docker scout cves` or Trivy in CI |

## Cache Docker builds in CI

Without this, CI rebuilds everything every time:

```yaml
      - uses: docker/setup-buildx-action@v3
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| Every build reinstalls deps | `COPY . .` before install | Copy manifests first |
| Image is over 1 GB | Full base + build tools shipped | `-slim` + multi-stage |
| `Permission denied` after `USER` | Files owned by root | `COPY --chown=app:app` |
| Secret visible in `docker history` | `ARG`/`COPY` for secrets | BuildKit `--mount=type=secret` |
| Works locally, fails on the server | Architecture mismatch (arm64 vs amd64) | `docker buildx --platform linux/amd64` |
| Alpine build fails on a Python dep | musl vs glibc wheels | Use `-slim` instead |

## Your turn (≈20 min)

1. Containerise a FastAPI app with the Dockerfile above; note the final image size.
2. Change one line of Python and rebuild — time it. Then move `COPY . .` above the dependency install and rebuild again. Compare.
3. Confirm `whoami` inside the container isn't root.
4. Run `docker scout cves` (or Trivy) and fix or record the findings.
5. Add the buildx cache to a workflow and compare cold vs warm CI builds.

## Checklist

- [ ] I use multi-stage builds so build tools never ship.
- [ ] I order layers least- to most-frequently-changed.
- [ ] I keep a `.dockerignore`.
- [ ] I run as a non-root `USER`.
- [ ] I never bake secrets into layers.
- [ ] I cache Docker layers in CI and scan images for CVEs.

## Go deeper

- [Dockerfile best practices](https://docs.docker.com/build/building/best-practices/) — layer caching and image size, from the source.
- [Build secrets](https://docs.docker.com/build/building/secrets/) — the BuildKit mount pattern.
- [docker/build-push-action](https://github.com/docker/build-push-action) — CI builds with caching.

<!-- SOURCES: https://docs.docker.com/build/building/best-practices/ , https://docs.docker.com/build/building/secrets/ , https://github.com/docker/build-push-action -->
