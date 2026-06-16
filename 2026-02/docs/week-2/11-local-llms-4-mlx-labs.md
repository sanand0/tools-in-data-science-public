# 10. MLX / mlx-lm: Apple Silicon-native path

## 10.1 What it is

MLX is Apple’s machine-learning framework for Apple Silicon. It is designed for efficient and flexible machine learning on Apple Silicon, has Python/C++/Swift/C support, uses a NumPy-like API, supports CPU/GPU, and is designed around unified memory.

`mlx-lm` is the LLM package for generating text and fine-tuning LLMs on Apple Silicon. It supports Hugging Face Hub integration, quantization, upload, low-rank/full fine-tuning, and distributed inference/fine-tuning.

## 10.2 Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install mlx-lm
```

Or:

```bash
conda install -c conda-forge mlx-lm
```

`mlx-lm` officially documents both pip and conda installation.

## 10.3 First run

```bash
mlx_lm.generate --prompt "Explain attention in transformers simply."
```

Chat REPL:

```bash
mlx_lm.chat
```

Specific model:

```bash
mlx_lm.generate \
  --model mlx-community/Qwen3-4B-Instruct-2507-4bit \
  --prompt "Write a Python function to reverse a string."
```

The MLX community page shows MLX-compatible models and example `mlx_lm.generate` / `mlx_lm.chat` usage.

## 10.4 Python API

```python
from mlx_lm import load, generate

model, tokenizer = load("mlx-community/Qwen3-4B-Instruct-2507-4bit")

messages = [
    {"role": "user", "content": "Explain vector databases in simple words."}
]

prompt = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True
)

text = generate(model, tokenizer, prompt=prompt, verbose=True)
print(text)
```

## 10.5 Convert and quantize a model

```bash
mlx_lm.convert \
  --model Qwen/Qwen3-4B-Instruct-2507 \
  -q
```

Upload converted model:

```bash
mlx_lm.convert \
  --model Qwen/Qwen3-4B-Instruct-2507 \
  -q \
  --upload-repo your-name/Qwen3-4B-MLX-4bit
```

MLX community docs show `mlx_lm.convert --model ... -q` for quantization and `--upload-repo` for uploading converted models.

## 10.6 Local API server

Depending on installed version, run:

```bash
mlx_lm.server \
  --model mlx-community/Qwen3-4B-Instruct-2507-4bit \
  --port 8080
```

Then use OpenAI-style Python:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8080/v1",
    api_key="local"
)

response = client.chat.completions.create(
    model="mlx-community/Qwen3-4B-Instruct-2507-4bit",
    messages=[
        {"role": "user", "content": "Explain MLX unified memory."}
    ]
)

print(response.choices[0].message.content)
```

## 10.7 Fine-tuning path

MLX is especially interesting for Mac users who want local LoRA-style fine-tuning.

Typical concept:

```text
Base model
+ training data
+ LoRA adapter
= customized model behavior
```

Student exercise:

```text
1. Create 50–200 examples in JSONL format.
2. Fine-tune a small model with LoRA.
3. Test before/after behavior.
4. Export or use adapter.
```

Use cases:

```text
- Personal writing style
- Company FAQ assistant
- Code style assistant
- Domain-specific extraction
- SQL generation assistant
```

## 10.8 Clean uninstall

```bash
deactivate
rm -rf .venv

# Optional: remove Hugging Face cache
rm -rf ~/.cache/huggingface/hub

# Optional: remove local converted models
rm -rf mlx_model
```

## 10.9 Real developer uses

Use MLX for:

```text
- Mac-native local LLMs
- Local fine-tuning
- Swift app integration
- On-device private AI
- Apple Silicon experiments
- Fast local prototyping on M-series machines
```

## 10.10 Pros and cons

Pros:

```text
- Excellent Apple Silicon path
- Unified memory helps larger local models
- Good for local fine-tuning
- Python and Swift ecosystem
- MIT-licensed
```

Cons:

```text
- Apple-focused
- Not the standard NVIDIA server production path
- Smaller ecosystem than llama.cpp/vLLM
```

Recommended video: **Explore large language models on Apple silicon with MLX** by Apple WWDC.

---

# 11. Cross-tool practical labs

These labs replace the earlier separate “30-day curriculum” and are now integrated as practical engineering work.

## Lab 1: Same prompt across all tools

Prompt:

```text
Explain Docker volumes to a beginner with one real project example.
```

Test in:

```text
LM Studio GUI
Ollama CLI
llama.cpp CLI
vLLM API
MLX CLI
```

Record:

```text
model name
quantization
RAM/VRAM usage
tokens/sec
answer quality
startup time
```

## Lab 2: Same Python app, different backend

Change only these values:

```python
base_url = "http://localhost:11434/v1"  # Ollama
model = "llama3.2:3b"
```

Then try:

```text
LM Studio    → http://localhost:1234/v1
llama.cpp    → http://localhost:8080/v1
vLLM         → http://localhost:8000/v1
```

This teaches a senior-level idea: **separate application logic from model provider**.

## Lab 3: Build a tiny local RAG system

Concept:

```text
PDF/text files
→ chunk text
→ create embeddings
→ store in vector DB
→ retrieve top chunks
→ send chunks + question to LLM
```

Minimal architecture:

```text
Ollama/LM Studio embedding model
+ ChromaDB/FAISS
+ local chat model
+ Python API
```

Student should learn:

```text
chunk size
overlap
embedding model
retrieval top-k
reranking
context limit
citation/grounding
```

## Lab 4: Structured extraction

Input:

```text
"Rahul knows Python, Docker, and SQL. He wants a backend internship."
```

Expected output:

```json
{
  "name": "Rahul",
  "skills": ["Python", "Docker", "SQL"],
  "goal": "backend internship"
}
```

Try with:

```text
Ollama format=json
llama.cpp grammar
LM Studio structured output
vLLM guided/structured output where supported
```

## Lab 5: Production-style local API

Use vLLM:

```text
Docker
API key
reverse proxy
logs
health check
GPU monitoring
load test
```

A simple production stack:

```text
Nginx/Caddy
→ vLLM
→ Hugging Face model cache
→ Prometheus/Grafana or basic logs
```

## Lab 6: Model comparison

Compare:

```text
3B model
7B/8B model
14B model
Q4 vs Q5 vs Q8
short context vs long context
CPU vs GPU
```

Measure:

```text
quality
speed
memory
startup time
hallucination rate
JSON correctness
coding ability
```

---

# 12. Advanced topics students should not miss

## 12.1 Prompt templates

A chat model expects messages in a certain format.

Wrong template:

```text
User: ...
Assistant: ...
```

Right template depends on model:

```text
<|system|>...
<|user|>...
<|assistant|>...
```

Most tools hide this, but when using llama.cpp manually, wrong templates can reduce model quality badly.

## 12.2 System prompts

System prompt controls role and boundaries:

```text
You are a concise Python tutor.
Use beginner-friendly language.
Give runnable examples.
Do not invent commands.
```

## 12.3 Temperature

```text
0.0–0.2 → deterministic, good for code/extraction
0.3–0.7 → balanced
0.8+    → creative, less predictable
```

## 12.4 Top-p

`top_p` controls sampling diversity. For production, keep it stable:

```text
temperature: 0.1–0.3
top_p: 0.8–0.95
```

## 12.5 Stop tokens

Stop tokens prevent unwanted continuation:

```text
stop=["</json>", "User:"]
```

## 12.6 Tool calling

Tool calling means:

```text
LLM decides it needs a tool
→ app runs tool
→ tool result goes back to LLM
→ LLM answers
```

Use for:

```text
database query
file search
calculator
web search
calendar/email workflow
shell command
```

## 12.7 Multimodal models

Some local models support images.

Use cases:

```text
image description
OCR-like extraction
screenshot explanation
chart understanding
UI debugging
```

But multimodal local models need more memory.

## 12.8 Safety and privacy

Local does not automatically mean safe.

Check:

```text
Is the server bound to 127.0.0.1 or 0.0.0.0?
Is there an API key?
Are logs storing prompts?
Are documents sensitive?
Are models downloaded from trusted sources?
Is the model license safe for your use?
```

Important:

```text
127.0.0.1 → only local machine
0.0.0.0   → accessible from network if firewall allows
```

## 12.9 Do not expose local servers publicly

Bad:

```bash
vllm serve model --host 0.0.0.0 --port 8000
# no auth, public server
```

Better:

```text
Firewall
VPN
API key
Reverse proxy
Rate limit
HTTPS
Logs
Monitoring
```

---

# 13. Troubleshooting guide

## Problem: model downloads but does not run

Check:

```bash
df -h
free -h
nvidia-smi
```

Possible causes:

```text
not enough RAM
not enough VRAM
wrong model format
corrupted partial download
context too large
GPU driver issue
```

## Problem: very slow response

Try:

```text
smaller model
lower quantization size
GPU offload
shorter context
fewer parallel requests
lower max_tokens
```

## Problem: server not reachable

Check port:

```bash
curl http://localhost:11434/api/version   # Ollama
curl http://localhost:1234/v1/models      # LM Studio
curl http://localhost:8080/v1/models      # llama.cpp
curl http://localhost:8000/v1/models      # vLLM
```

Check process:

```bash
ps aux | grep ollama
lms ps
nvidia-smi
docker ps
```

## Problem: disk full

Check caches:

```bash
du -sh ~/.cache/huggingface
du -sh ~/.ollama
du -sh ~/.lmstudio
```

Delete only what you no longer need:

```bash
ollama rm model-name
rm -rf ~/.cache/huggingface/hub
rm -rf ~/.lmstudio/models/unused-publisher/unused-model
```

## Problem: bad answers

Try:

```text
better model
correct instruct/chat model
proper prompt template
lower temperature
more specific system prompt
more context
better RAG retrieval
less aggressive quantization
```

## Problem: JSON invalid

Try:

```text
temperature 0
JSON schema / grammar
shorter output
ask for JSON only
validate and retry in code
```

---

# 14. Final recommended teaching order

Teach students in this order:

```text
1. LM Studio
   See local LLMs working visually.

2. Ollama
   Learn CLI, API, model running, simple app integration.

3. llama.cpp
   Learn GGUF, quantization, context, GPU offload, internals.

4. vLLM
   Learn real production serving, batching, Docker, API keys, load testing.

5. MLX
   Learn Apple Silicon-native inference and fine-tuning path.
```

Best final mental model:

```text
LM Studio teaches confidence.
Ollama teaches developer workflow.
llama.cpp teaches control.
vLLM teaches production.
MLX teaches Apple-native optimization.
```

For real projects:

```text
Personal local assistant       → LM Studio or Ollama
Local coding helper            → Ollama or LM Studio
Offline document Q&A           → Ollama/LM Studio + RAG
Low-level embedded/offline app  → llama.cpp
Company inference API          → vLLM
Mac-native private AI app       → MLX / mlx-lm
```


## Important Q&A

**Q: Does MLX only work on Apple Silicon?**
A: Yes. MLX is specifically designed by Apple to take advantage of the unified memory architecture (CPU and GPU sharing the same memory pool) on Apple Silicon (M1, M2, M3, etc.). It will not work on Intel Macs or Windows/Linux machines.

**Q: Is fine-tuning on a laptop actually practical?**
A: With MLX, yes! Because of unified memory, you can perform LoRA fine-tuning on small-to-medium models (like 7B parameters) directly on a MacBook with 16GB or 32GB of RAM, which would traditionally require a dedicated Nvidia GPU.

**Q: Should I use `mlx-lm` for a production server?**
A: Usually no. While `mlx_lm.server` is great for local development and private on-device apps, for a high-traffic production server handling many concurrent users, you typically deploy to the cloud using Linux servers with Nvidia GPUs running `vLLM` or `TGI`.

## Final revision checklist

```text
[ ] I know how to install `mlx-lm`.
[ ] I understand that MLX leverages Apple's unified memory.
[ ] I can use `mlx_lm.generate` and `mlx_lm.chat` in the terminal.
[ ] I can use the OpenAI-style API with the `mlx_lm.server`.
[ ] I understand that MLX enables efficient local LoRA fine-tuning on Macs.
```

