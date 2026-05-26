id: local-llms

# Local LLMs

Running LLMs locally means **no API costs**, **full privacy** (data never leaves your machine), and **no rate limits**. The trade-off is you need a decent GPU (or patience with CPU).

---

## Hardware Requirements

| Model Size | RAM Needed | GPU VRAM | Speed (CPU) |
|-----------|------------|----------|-------------|
| 1B–3B | 4 GB | 4 GB | Fast |
| 7B–8B | 8 GB | 6–8 GB | Medium |
| 13B | 16 GB | 10–12 GB | Slow |
| 70B | 64 GB | 40 GB | Very slow |

Most IIT Madras students: run **7B models** on CPU (slow but works) or Google Colab T4 GPU.

---

## Ollama (Recommended for Most Use Cases)

Ollama is the easiest way to run local LLMs. It manages downloads, serves an OpenAI-compatible API, and handles model loading.

### Install

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows: Download from https://ollama.com/download
```

### Run Models

```bash
# Download and run Llama 3.2 (3B, fast, fits in 4GB RAM)
ollama run llama3.2

# Gemma 3 (Google's model, great quality)
ollama run gemma3

# Qwen 2.5 (great for code)
ollama run qwen2.5-coder

# Mistral (good all-rounder)
ollama run mistral

# Chat interactively
>>> Tell me about FastAPI
```

### Ollama API (OpenAI-Compatible)

Ollama serves a REST API on port 11434 that's compatible with the OpenAI SDK:

```bash
# Direct HTTP
curl http://localhost:11434/api/generate \
  -d '{"model": "llama3.2", "prompt": "What is Docker?", "stream": false}'

# List installed models
curl http://localhost:11434/api/tags
```

```python
# Use with the official OpenAI SDK — just change the base_url
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",   # required but ignored by Ollama
)

response = client.chat.completions.create(
    model="llama3.2",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain Docker in 3 sentences."},
    ],
)
print(response.choices[0].message.content)
```

### Integrate with FastAPI

```python title="main.py"
from fastapi import FastAPI
from openai import AsyncOpenAI
from pydantic import BaseModel

app = FastAPI()

# Point to local Ollama
llm_client = AsyncOpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
)

class ChatRequest(BaseModel):
    message: str
    model: str = "llama3.2"

@app.post("/chat")
async def chat(req: ChatRequest):
    response = await llm_client.chat.completions.create(
        model=req.model,
        messages=[{"role": "user", "content": req.message}],
    )
    return {"reply": response.choices[0].message.content}
```

---

## LM Studio (GUI Approach)

LM Studio provides a desktop app for downloading, managing, and chatting with local models. Ideal if you prefer a GUI over CLI.

1. Download from [lmstudio.ai](https://lmstudio.ai)
2. Search and download a model (e.g., `Qwen2.5-7B-Instruct-GGUF`)
3. Load the model
4. Enable local server (Settings → Local Server → Start Server)
5. API available at `http://localhost:1234/v1`

```python
# Same code, different base_url
client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio",
)
```

---

## GGUF Format

GGUF is the file format used for quantized local models. Quantization reduces model size:

| Quantization | Size (7B model) | Quality | RAM |
|-------------|-----------------|---------|-----|
| Q2_K | ~2.7 GB | Low | 4 GB |
| Q4_K_M | ~4.4 GB | Good | 6 GB |
| Q5_K_M | ~5.1 GB | Better | 8 GB |
| Q8_0 | ~7.7 GB | Best | 10 GB |
| F16 | ~14 GB | Full | 16 GB |

For most use cases, **Q4_K_M** is the sweet spot: 4-bit quantization, good quality, fits in 6GB VRAM.

Find GGUF models on HuggingFace:
- Search: `bartowski/Llama-3.2-3B-Instruct-GGUF`
- Download the `Q4_K_M` version

---

## llama.cpp (Maximum Control)

llama.cpp is the C++ engine that Ollama uses under the hood. Use it directly when you need maximum performance or custom setups:

```bash
# Clone and build
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
cmake -B build
cmake --build build --config Release

# Download a model
huggingface-cli download bartowski/Llama-3.2-3B-Instruct-GGUF \
  --include "Llama-3.2-3B-Instruct-Q4_K_M.gguf" \
  --local-dir models/

# Run inference server
./build/bin/llama-server \
  --model models/Llama-3.2-3B-Instruct-Q4_K_M.gguf \
  --ctx-size 4096 \
  --port 8080
```

---

## Ollama Quick Reference

```bash
ollama list              # list installed models
ollama pull gemma3       # download model
ollama rm llama3.2       # remove model
ollama show llama3.2     # show model info
ollama ps                # list running models
ollama stop llama3.2     # unload from memory

# Run with options
ollama run llama3.2 --verbose   # show token stats
```

---

## Video Reference

[![Run Local LLMs with Ollama](https://img.youtube.com/vi/BsaBH1xMuXQ/0.jpg)](https://youtu.be/BsaBH1xMuXQ "Run Local LLMs with Ollama")

---

## Summary

| Tool | Best For |
|------|---------|
| **Ollama** | Easy CLI, OpenAI-compatible API, most popular |
| **LM Studio** | GUI, easy model management, same API |
| **llama.cpp** | Maximum performance, custom builds |
| **GGUF Q4_K_M** | Best quality/size/speed balance |

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

