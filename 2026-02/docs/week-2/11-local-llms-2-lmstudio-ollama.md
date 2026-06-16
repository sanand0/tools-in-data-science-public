# 6. LM Studio: best beginner GUI and local API tool

## 6.1 What it is

LM Studio is a desktop app for downloading, managing, chatting with, and serving local models. It supports local model search/download, chat UI, MCP servers, OpenAI-like endpoints, prompt/config management, and document chat. It runs on macOS, Windows, and Linux.

Use it when students need to **see local AI working quickly**.

## 6.2 Installation

Download the app from the official LM Studio website.

On supported systems, LM Studio includes the `lms` CLI. After opening LM Studio once, check:

```bash
lms --help
```

The official docs say `lms` ships with LM Studio and supports chat, model downloads, local model listing, server control, daemon management, runtimes, and more.

## 6.3 Where files go

Expected model structure:

```text
~/.lmstudio/models/
└── publisher/
    └── model/
        └── model-file.gguf
```

LM Studio preserves a Hugging Face-like directory structure for local models.

## 6.4 First practical use

GUI path:

```text
Open LM Studio
→ Search model
→ Download small model
→ Load model
→ Chat
→ Open Developer tab
→ Start local server
```

Good starter models:

```text
Qwen 2.5 / Qwen 3 small instruct models
Llama 3.2 1B/3B
Gemma small models
Mistral 7B if enough RAM/VRAM
```

## 6.5 CLI workflow

```bash
# Start daemon
lms daemon up

# Search/download model
lms get qwen

# List downloaded models
lms ls

# Load model
lms load <model-name> --gpu=auto --context-length=4096

# See loaded models
lms ps

# Terminal chat
lms chat

# Start API server
lms server start

# Stop API server
lms server stop
```

`lms load` supports GPU offload and context length options; `--gpu=1.0` attempts to offload all computation to GPU.

## 6.6 Use LM Studio from Python

Start the server from the Developer tab or:

```bash
lms server start
```

Then:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:1234/v1",
    api_key="lm-studio"
)

response = client.chat.completions.create(
    model="local-model",
    messages=[
        {"role": "user", "content": "Explain RAG with one example."}
    ],
    temperature=0.2,
)

print(response.choices[0].message.content)
```

LM Studio can serve local LLMs on localhost or the network, and supports REST APIs, client libraries, OpenAI-compatible endpoints, and Anthropic-compatible endpoints.

## 6.7 Document chat / RAG in LM Studio

LM Studio lets you attach `.docx`, `.pdf`, and `.txt` files to a chat. If the document fits in context, it may include it directly; if it is too long, it uses retrieval-augmented generation to pull relevant parts.

Practical student exercise:

```text
1. Download a small instruct model.
2. Attach a PDF.
3. Ask: “Summarize section 2 only.”
4. Ask: “Give exact bullet points from the document.”
5. Ask: “Which page or section supports this?”
```

Teach students this limitation: local RAG is not magic. Retrieval can miss important chunks, so ask specific questions using words that likely appear in the document.

## 6.8 Real developer uses

Use LM Studio for:

```text
- Quickly testing many models
- Teaching local LLMs visually
- Comparing GGUF vs MLX models
- Running a local OpenAI-compatible endpoint
- Document chat demos
- Testing prompt templates
- Testing structured output and tool use
- Using MCP tools locally
```

## 6.9 Clean uninstall

macOS/Linux:

```bash
# Remove app using OS method first.
# Optional: delete downloaded models and LM Studio local data.
rm -rf ~/.lmstudio
```

Windows PowerShell:

```powershell
# Uninstall from Windows Apps first.
# Optional: delete local data and models.
Remove-Item -Recurse -Force "$env:USERPROFILE\.lmstudio"
```

Only delete `.lmstudio` when you want to remove models, presets, and local config.

## 6.10 Pros and cons

Pros:

```text
- Best beginner experience
- GUI model search/download
- Local API server
- Good for demos and teaching
- Supports document chat
- Supports llama.cpp and MLX runtimes
```

Cons:

```text
- Desktop app is proprietary
- Not the best serious server deployment tool
- Less reproducible than pure Docker/server setups
```

Recommended video: **How to Use LM Studio: A Step-by-Step Guide**.

---

# 7. Ollama: best fast developer prototype tool

## 7.1 What it is

Ollama is the easiest CLI/API-based local model runner. After installation, its API is served by default at:

```text
http://localhost:11434/api
```

The official API docs show that once Ollama is running, you can call it with `curl`, and it also has official Python and JavaScript libraries.

## 7.2 Installation

Linux/macOS:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Windows PowerShell:

```powershell
irm https://ollama.com/install.ps1 | iex
```

Docker:

```bash
docker run -d \
  --name ollama \
  -p 11434:11434 \
  -v ollama:/root/.ollama \
  ollama/ollama
```

Ollama’s GitHub page says the official Docker image is `ollama/ollama`.

## 7.3 Where files go

Common locations:

```text
Linux service files  → /etc/systemd/system/ollama.service
Linux models/data    → /usr/share/ollama
macOS app            → /Applications/Ollama.app
macOS CLI symlink    → /usr/local/bin/ollama
macOS user data      → ~/.ollama and ~/Library/... Ollama folders
Windows              → app install + user .ollama directory
```

Ollama’s Linux uninstall docs remove the service, binary, libraries, user/group, and `/usr/share/ollama`; macOS uninstall docs include `/Applications/Ollama.app`, `/usr/local/bin/ollama`, and `~/.ollama`.

## 7.4 First run

```bash
ollama run llama3.2:3b
```

Useful commands:

```bash
ollama list                 # list downloaded models
ollama ps                   # list running models
ollama pull llama3.2:3b     # download model
ollama run llama3.2:3b      # run model
ollama rm llama3.2:3b       # remove model
ollama show llama3.2:3b     # model info
ollama serve                # start server manually
```

## 7.5 REST API usage

Generate endpoint:

```bash
curl http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:3b",
    "prompt": "Explain Docker in simple words.",
    "stream": false
  }'
```

Chat endpoint:

```bash
curl http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:3b",
    "messages": [
      {"role": "system", "content": "You are a helpful Linux tutor."},
      {"role": "user", "content": "Explain chmod 755."}
    ],
    "stream": false
  }'
```

Ollama has `/api/generate`, `/api/chat`, and OpenAI-compatible endpoints for connecting existing applications.

## 7.6 Python usage through OpenAI-compatible API

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

response = client.chat.completions.create(
    model="llama3.2:3b",
    messages=[
        {"role": "user", "content": "Write a beginner-friendly Git explanation."}
    ],
)

print(response.choices[0].message.content)
```

## 7.7 Modelfile: custom model behavior

Create a file called `Modelfile`:

```text
FROM llama3.2:3b

SYSTEM """
You are a patient Python tutor.
Use small examples.
Ask one practice question at the end.
"""

PARAMETER temperature 0.2
PARAMETER num_ctx 8192
```

Build and run:

```bash
ollama create python-tutor -f Modelfile
ollama run python-tutor
```

Modelfile also supports instructions like `LICENSE`, `MESSAGE`, and `REQUIRES`; `MESSAGE` can provide example conversation behavior.

## 7.8 Embeddings for RAG

Many local apps use Ollama for embeddings:

```bash
ollama pull nomic-embed-text
```

Example request:

```bash
curl http://localhost:11434/api/embed \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nomic-embed-text",
    "input": "Local LLMs can run on your laptop."
  }'
```

Use embeddings for:

```text
PDF search
document Q&A
semantic search
local knowledge base
```

## 7.9 Structured output

For JSON-style output, use low temperature and ask for a strict schema. Ollama’s generate endpoint supports structured output through `format`, including `"json"` or a JSON schema object.

Example:

```bash
curl http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:3b",
    "prompt": "Extract name and skills from: Riya knows Python and Docker.",
    "format": "json",
    "stream": false
  }'
```

## 7.10 Tool calling

Ollama supports tool/function calling so a model can request external tools and incorporate tool results into its answer.

Real use cases:

```text
- Calculator tool
- Weather lookup
- Database query
- File search
- Coding agent command execution
```

## 7.11 Performance metrics

Ollama API responses include timing and token metrics such as `total_duration`, `load_duration`, `prompt_eval_count`, `eval_count`, and evaluation durations.

Use these to compare models:

```text
Same prompt
Same context length
Same temperature
Compare tokens/sec and answer quality
```

## 7.12 Coding tools and agents

Ollama can connect to coding assistants and tools. Its GitHub docs mention integrations such as Claude Code, OpenClaw, OpenCode, Codex, and Copilot CLI.

Example:

```bash
ollama launch codex
```

For coding tools, prefer models with larger context windows and strong code capability.

## 7.13 Clean uninstall

Linux:

```bash
sudo systemctl stop ollama
sudo systemctl disable ollama
sudo rm -f /etc/systemd/system/ollama.service

# Remove binary
sudo rm -f "$(which ollama)"

# Remove downloaded models/data
sudo rm -rf /usr/share/ollama ~/.ollama

# Remove service user/group
sudo userdel ollama 2>/dev/null || true
sudo groupdel ollama 2>/dev/null || true
```

macOS:

```bash
sudo rm -rf /Applications/Ollama.app
sudo rm -f /usr/local/bin/ollama
rm -rf ~/.ollama
rm -rf ~/Library/Application\ Support/Ollama
rm -rf ~/Library/Caches/ollama
rm -rf ~/Library/Caches/com.electron.ollama
rm -rf ~/Library/WebKit/com.electron.ollama
```

Windows: uninstall from **Add or remove programs**. If you changed `OLLAMA_MODELS`, the installer may not remove downloaded models.

## 7.14 Pros and cons

Pros:

```text
- Very easy CLI
- Great local API
- Good for prototypes
- Good for coding tool integrations
- Official Docker image
- Model management is simple
```

Cons:

```text
- Less low-level tuning than llama.cpp
- Not the strongest multi-user production server
- Model abstraction hides some internals
```

Recommended video: **Ollama Course – Build AI Apps Locally** by freeCodeCamp.

---


## Important Q&A

**Q: Can I use Ollama and LM Studio at the same time?**
A: You can have both installed, but if they both try to bind to the same default API port (which happens sometimes depending on config), one might fail. Ensure they use different ports or run one at a time.

**Q: Do I need a GPU to run Ollama?**
A: No, Ollama can run entirely on the CPU using system RAM, but it will be much slower. A GPU is highly recommended for real-time text generation speeds.

**Q: Where are the models stored in LM Studio?**
A: By default, they are stored in `~/.lmstudio/models`. You can change this directory in the LM Studio app settings if your main drive is full.

## Final revision checklist

```text
[ ] I know how to install and start LM Studio.
[ ] I can use the `lms` CLI to download and manage models.
[ ] I can start the LM Studio local API server.
[ ] I know how to pull and run models with Ollama (`ollama run`).
[ ] I can use the Ollama REST API to generate text and chat.
[ ] I understand how to create a custom `Modelfile` in Ollama.
```

