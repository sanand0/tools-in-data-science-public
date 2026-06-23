# Session 3: Docker and GitHub Actions

<div class="live-session-note" data-deck-id="week-2-session-3-docker-github-actions" data-week="Week 2" data-session="Session 3" data-title="Docker and GitHub Actions" data-video="https://youtu.be/JXiJVWisKns" data-faq="live-sessions/20250524-JXiJVWisKns.md">
<textarea data-live-session-slides>
# Docker and GitHub Actions
## Week 2 session 3

- Package an app with its runtime
- Run repeatable checks in CI
- Build confidence before deploy
---
## Why containers?

Containers make the runtime explicit:

- operating-system base
- installed packages
- project files
- start command
- exposed port
---
## Minimal Dockerfile

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN pip install fastapi uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
---
## Build and run

```bash
docker build -t tds-api .
docker run --rm -p 8000:8000 tds-api
curl http://localhost:8000/health
```
---
## GitHub Actions shape

```yaml
name: test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: python --version
      - run: pytest
```
---
## CI should answer

- Does it install?
- Do tests pass?
- Does linting pass?
- Does the build artifact exist?
- Can deployment start from this commit?
---
## Common CI failures

| Symptom | Check |
| --- | --- |
| works locally only | missing dependency |
| secret missing | repository secret |
| test path not found | working directory |
| slow build | cache dependencies |
---
## Annotation exercise

- Box the container start command
- Mark the CI trigger
- Highlight the first reproducibility risk
---
## End state

You can containerize a tiny API and run automated checks on every push.
</textarea>
</div>
