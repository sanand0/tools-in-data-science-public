## Container hosting: Hugging Face Spaces with Docker

Container platforms let you deploy applications in isolated, portable environments that include all dependencies. They're perfect for ML applications that need *custom environments, specific packages, or persistent state*. Here are some common real-life uses:

- A text summarization API that processes documents using custom NLP models (runs for 10-30 seconds per request)
- An image classification tool that requires specific computer vision libraries (runs for 5-15 seconds per upload)
- A chatbot with custom fine-tuned models that need GPU acceleration (runs for 2-5 seconds per message)
- A data processing pipeline that transforms CSV files into insights (runs for 30-120 seconds per file)
- A multi-model ensemble that combines different AI models for better predictions (runs for 15-45 seconds per inference)

Unlike serverless functions, containers can maintain state, install any packages, write to the filesystem, and run background processes. They provide more control over the environment but require more configuration.

[Hugging Face Spaces](https://huggingface.co/spaces) is a platform that makes it easy to deploy ML applications using Docker containers. It's integrated with the Hugging Face ecosystem, supports GPU acceleration, and provides free hosting for public applications.

Spaces supports three deployment options: Gradio (for quick ML demos), Streamlit (for data apps), and Docker (for custom applications). [Docker Spaces](https://huggingface.co/docs/hub/spaces-sdks-docker) give you complete control over your environment and dependencies.

### Setting up a Docker Space

[Sign up with Hugging Face](https://huggingface.co/join) and create a new Space. Choose "Docker" as your SDK.

Your Space repository needs these essential files:

**README.md** - Configure your Space with [YAML frontmatter](https://huggingface.co/docs/hub/spaces-config-reference):
```yaml
---
title: My FastAPI App
emoji: 🚀
colorFrom: blue
colorTo: green
sdk: docker
app_port: 7860
---

# My FastAPI Application
Description of your app goes here.
```

**Dockerfile** - Define your container environment (see [Dockerfile documentation](https://huggingface.co/docs/hub/spaces-docker-custom-image)):
```dockerfile
# Use Python 3.9 as base image
FROM python:3.9

# Set up a new user named "user" with user ID 1000 (required by Hugging Face). [3]
RUN useradd -m -u 1000 user

# Switch to the "user" user
USER user

# Set home to the user's home directory
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set the working directory to the user's home directory
WORKDIR $HOME/app

# Copy requirements first for better caching
COPY --chown=user requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY --chown=user . .

# Expose the port your app runs on. [4]
EXPOSE 7860

# Command to run your application. [15]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

**requirements.txt** - List your Python dependencies:
```text
fastapi
uvicorn[standard]
transformers
torch
```

**main.py** - Your [FastAPI](https://fastapi.tiangolo.com/) application:
```python
from fastapi import FastAPI
from transformers import pipeline

app = FastAPI()

# Initialize your model (this happens once when container starts)
classifier = pipeline("sentiment-analysis")

@app.get("/")
def read_root():
    return {"message": "Hello from Hugging Face Spaces!"}

@app.post("/analyze")
def analyze_sentiment(text: str):
    result = classifier(text)
    return {"sentiment": result[0]["label"], "score": result[0]["score"]}
```

### Deployment Process

1.  **Create Space**: Visit [huggingface.co/new-space](https://huggingface.co/new-space) and select Docker SDK.
2.  **Clone Repository**: `git clone https://huggingface.co/spaces/your-username/your-space-name`
3.  **Add Files**: Create the files above in your local repository.
4.  **Deploy**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push
   ```

Your Space will automatically build and deploy. The build process can take 5-15 minutes depending on your dependencies.

### Writing Files and Data Persistence

Docker Spaces support both temporary and persistent storage. All Spaces come with free ephemeral storage that is deleted when the Space restarts.

**Temporary Files** (reset on restart):
```python
import tempfile
import os

# Write temporary files
with tempfile.NamedTemporaryFile(mode='w', delete=False) as f:
    f.write("This will be lost on restart")
    temp_path = f.name

# Read it back
with open(temp_path, 'r') as f:
    content = f.read()
```

**Persistent Files** (with paid persistent storage):

To save files that persist across restarts, you must upgrade to a [paid persistent storage plan](https://huggingface.co/docs/hub/spaces-storage). Once upgraded, a `/data` directory is mounted as a persistent volume.
```python
import os

# Write to persistent storage (requires upgrade)
data_dir = "/data"
if os.path.exists(data_dir):
    with open(f"{data_dir}/persistent_file.txt", "w") as f:
        f.write("This persists across restarts")
```

**Using Hugging Face Hub for Data Storage** (Free Alternative):

As a free alternative to persistent storage, you can programmatically upload files to a [Hugging Face Dataset repository](https://huggingface.co/docs/hub/datasets-overview) using the [`huggingface_hub` library](https://huggingface.co/docs/huggingface_hub/guides/upload).
```python
from huggingface_hub import HfApi, upload_file

# Upload files to a dataset repository for persistence. [21]
api = HfApi()
upload_file(
    path_or_fileobj="local_file.json",
    path_in_repo="data/saved_data.json",
    repo_id="your-username/your-dataset",
    repo_type="dataset"
)
```

### Environment Variables and Secrets

**Adding Variables**: Go to your Space settings → **Variables & secrets** tab. Add environment variables and secrets that will be available in your container.

**Using Variables in Code**:
```python
import os

# Access environment variables
model_name = os.environ.get("MODEL_NAME", "default-model")
api_key = os.environ.get("SECRET_API_KEY") # For secrets
```

**Using Variables in Dockerfile**:
You can expose variables at build time using the `ARG` directive.
```dockerfile
# Declare build-time variables
ARG MODEL_REPO_NAME
ENV MODEL_NAME=$MODEL_REPO_NAME

# Use in your application
RUN echo "Using model: $MODEL_NAME"
```

### Advanced Features

**GPU Support**: Upgrade to [GPU hardware](https://huggingface.co/docs/hub/spaces-gpus) in your Space settings. Use NVIDIA CUDA base images in your Dockerfile for GPU compatibility.
```dockerfile
FROM nvidia/cuda:11.8-runtime-ubuntu20.04
```

**Multiple Ports**: While you can only expose one port directly, you can run a reverse proxy like Nginx inside your container to route traffic from the main exposed port to multiple internal applications.
```dockerfile
# Install nginx
RUN apt-get update && apt-get install -y nginx

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
```

**Custom Dependencies**: Install system packages using `apt-get` within your Dockerfile:```dockerfile
# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*
