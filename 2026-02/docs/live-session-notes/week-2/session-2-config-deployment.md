# Session 2: Configuration & Deployment

<div class="live-session-note" data-deck-id="week-2-session-2-config-deployment" data-week="Week 2" data-session="Session 2" data-title="Configuration & Deployment">
<textarea data-live-session-slides>
# Configuration & Deployment
## Week 2 Session 2

- Building a micro-application
- Deploying to Hugging Face Spaces
- Managing configurations with env variables
- Designing a robust logging pipeline
---
## Micro FastAPI App

A complete, single-file application ready for deployment:

```python
# main.py
import uvicorn
from fastapi import FastAPI

app = FastAPI(title="TDS Deploy App")

@app.get("/")
def read_root():
    return {"status": "running", "environment": "production"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=7860)
```
---
## Deployment on Hugging Face

Hugging Face Spaces supports FastAPI apps out of the box:

1. Create a **Docker Space** or python Space.
2. Port binding must be **`7860`** (Hugging Face default).
3. Add a simple `Dockerfile`:
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```
---
## Config Management

Avoid hardcoding settings. Use Pydantic's `BaseSettings`:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    api_key: str
    db_url: str = "sqlite:///./prod.db"
    debug_mode: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
```

Create a local `.env` file for development and bind environment variables in HF Settings for production.
---
## Structured Logging

Configure logging to stream to files or standard output for troubleshooting:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("tds-logger")

@app.get("/action")
def perform_action():
    logger.info("Performing critical user action...")
    return {"message": "Success"}
```
---
## Annotation Exercise

- Circle the port number Hugging Face requires
- Highlight the env file declaration inside Settings Config
- Mark where log records are outputted
- Connect logging handlers to their targets
</textarea>
</div>
