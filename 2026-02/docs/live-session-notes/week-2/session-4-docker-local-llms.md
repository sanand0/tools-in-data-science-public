# Session 4: Podman, Docker & Local LLMs

<div class="live-session-note" data-deck-id="week-2-session-4-docker-local-llms" data-week="Week 2" data-session="Session 4" data-title="Podman, Docker & Local LLMs">
<textarea data-live-session-slides>
# Podman, Docker & Local LLMs
## Week 2 Session 4

- Containerization: Containers vs Virtual Machines
- Docker/Podman network, volume, and multi-container setups
- Running local LLMs using Ollama & vLLM
- Quantization, Ollama API, and custom Modelfiles
---
## Container vs Virtual Machine

- **VMs** bundle an entire OS kernel + hardware emulation layer. Slow startup, heavy resource footprint.
- **Containers** share the host system kernel and run as isolated processes. Fast, lightweight.

```
+-------------------+      +-------------------+
|  App   |   App    |      |  App   |   App    |
+--------+----------+      +--------+----------+
|   Docker Engine   |      | Guest OS| Guest OS|
+-------------------+      +--------+----------+
|     Host OS       |      |    Hypervisor     |
+-------------------+      +-------------------+
|  Physical Server  |      |  Physical Server  |
+-------------------+      +-------------------+
```
---
## Docker Compose

Run multi-container apps (e.g. FastAPI app + PostgreSQL) easily:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
  db:
    image: postgres:15
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secretpassword

volumes:
  pgdata:
```
---
## Local LLMs: Ollama & vLLM

- **Ollama**: CPU/GPU optimized lightweight model runner. Perfect for local dev.
- **vLLM**: High-throughput distributed LLM serving engine using PagedAttention. Best for production.

Start Ollama server and run a model:
```bash
ollama serve
ollama run gemma2:2b
```
---
## Ollama REST API

You can programmatically query local models:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "gemma2:2b",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

Returns standard JSON output containing the model's response.
---
## Quantization & Model Files

- **Quantization** reduces model precision (e.g. 16-bit to 4-bit weights) to save VRAM, allowing large models to run on consumer hardware with minimal quality loss.
- **Modelfile**: Configure system prompts and parameters:

```dockerfile
# Modelfile
FROM gemma2:2b
PARAMETER temperature 0.3
PARAMETER num_ctx 4096
SYSTEM """
You are Antigravity, a coding assistant working at Google DeepMind. Keep answers brief.
"""
```
Build it: `ollama create antigravity -f ./Modelfile`
---
## Annotation Exercise

- Circle the volumes section in the Docker Compose file
- Highlight the difference in resource sharing between VM and Container
- Underline the model parameters declared in the custom Modelfile
- Mark the Ollama API endpoint in the curl command
</textarea>
</div>
