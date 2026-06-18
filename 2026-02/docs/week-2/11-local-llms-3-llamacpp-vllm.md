# 8. llama.cpp: best low-level control tool

[![Llama cpp Video](https://img.youtube.com/vi/8F_5pdcD3HY/0.jpg)](https://youtu.be/8F_5pdcD3HY?si=zQT8bgUXqXxnqAXr)

## 8.1 What it is

llama.cpp is a C/C++ inference engine for running LLMs locally, especially GGUF models. It supports many backends including Metal, CUDA, HIP/ROCm, Vulkan, SYCL, OpenCL, WebGPU, CPU backends, and more.

Use llama.cpp when you want to understand what is really happening under the hood.

## 8.2 Installation

macOS/Linux with Homebrew:

```bash
brew install llama.cpp
```

Windows:

```powershell
winget install llama.cpp
```

Build from source:

```bash
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp

# CPU build
cmake -B build
cmake --build build --config Release -j

# NVIDIA CUDA build
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release -j
```

llama.cpp can be installed through brew, winget, prebuilt binaries, Docker, or source build.

## 8.3 Where files go

llama.cpp does not force a model directory. A good structure:

```text
~/models/
├── qwen/
│   └── qwen.Q4_K_M.gguf
├── llama/
│   └── llama.Q5_K_M.gguf
└── embeddings/
    └── embed.gguf
```

When using Hugging Face download mode, llama.cpp can download and cache compatible models; Hugging Face notes that the `LLAMA_CACHE` environment variable controls that cache location.

```bash
export LLAMA_CACHE="/data/llama-cache"
```

## 8.4 Run a GGUF model

```bash
llama-cli \
  -m ~/models/qwen/qwen.Q4_K_M.gguf \
  -p "Explain recursion with a Python example." \
  -n 300
```

Conversation mode:

```bash
llama-cli -m ~/models/qwen/qwen.Q4_K_M.gguf -cnv
```

Run from Hugging Face directly:

```bash
llama-cli -hf bartowski/Llama-3.2-3B-Instruct-GGUF:Q8_0
```

llama.cpp supports `llama-cli -hf ...` and can run GGUF models directly from Hugging Face-compatible repos.

## 8.5 Start local API server

```bash
llama-server \
  -m ~/models/qwen/qwen.Q4_K_M.gguf \
  --host 127.0.0.1 \
  --port 8080 \
  --ctx-size 8192
```

Call it:

```bash
curl http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer no-key" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain Linux pipes."}
    ],
    "temperature": 0.2
  }'
```

llama.cpp’s `llama-server` is a lightweight OpenAI-compatible HTTP server, defaults to port 8080, and exposes `/v1/chat/completions`.

## 8.6 Important performance flags

```bash
llama-server \
  -m model.gguf \
  --ctx-size 8192 \
  --threads 8 \
  --batch-size 512 \
  -ngl 999
```

Meaning:

```text
--ctx-size     context window
--threads      CPU threads
--batch-size   prompt processing batch size
-ngl           number of layers offloaded to GPU
```

Common GPU offload pattern:

```bash
-ngl 999
```

This means “try to offload as many layers as possible.”

## 8.7 Quantization and conversion

Typical workflow:

```bash
# Convert Hugging Face model to GGUF
python convert_hf_to_gguf.py /path/to/hf-model --outfile model-f16.gguf

# Quantize
llama-quantize model-f16.gguf model-q4_k_m.gguf Q4_K_M
llama-quantize model-f16.gguf model-q5_k_m.gguf Q5_K_M
llama-quantize model-f16.gguf model-q8_0.gguf Q8_0
```

Hugging Face says PyTorch models can be converted to GGUF, and llama.cpp’s repository points to tools for converting and quantizing models.

## 8.8 Grammar / JSON-constrained output

llama.cpp supports grammar-constrained output. This is useful when you need valid JSON.

```bash
llama-cli \
  -m model.gguf \
  --grammar-file grammars/json.gbnf \
  -p 'Extract name and skills from: Riya knows Python and Docker.'
```

llama.cpp docs show grammar-constrained output and JSON grammar examples.

## 8.9 Embeddings and reranking

Serve an embedding model:

```bash
llama-server \
  -m embedding-model.gguf \
  --embedding \
  --pooling cls \
  --port 8081
```

Serve a reranker:

```bash
llama-server \
  -m reranker-model.gguf \
  --reranking \
  --port 8082
```

llama.cpp’s server supports embedding and reranking modes.

## 8.10 Benchmarking

```bash
llama-bench -m model.gguf
```

Compare:

```text
model size
quantization
tokens/sec
prompt processing speed
RAM/VRAM use
answer quality
```

## 8.11 Clean uninstall

Homebrew:

```bash
brew uninstall llama.cpp
```

Winget:

```powershell
winget uninstall llama.cpp
```

Source build:

```bash
rm -rf ~/path/to/llama.cpp
```

Delete models only if desired:

```bash
rm -rf ~/models
rm -rf ~/.cache/huggingface/hub
rm -rf "$LLAMA_CACHE"
```

## 8.12 Real developer uses

Use llama.cpp for:

```text
- Running GGUF files directly
- CPU-only inference
- Edge devices
- Offline internal tools
- Quantization experiments
- Grammar-constrained JSON
- Embeddings/reranking
- Understanding GPU offload and context tradeoffs
- Building custom C/C++ integrations
```

## 8.13 Pros and cons

Pros:

```text
- Maximum control
- Excellent GGUF support
- Many hardware backends
- Great for offline use
- Great for learning internals
```

Cons:

```text
- More manual setup
- You manage models, templates, flags, and performance
- Less beginner-friendly than LM Studio/Ollama
```

Recommended video: **Quantize any LLM with GGUF and Llama.cpp**.

---

# 9. vLLM: production inference server

## 9.1 What it is

vLLM is for high-throughput and memory-efficient LLM serving. It includes PagedAttention, continuous batching, chunked prefill, prefix caching, quantization support, OpenAI-compatible serving, streaming, tool-calling/reasoning parsers, distributed inference, and support for many hardware backends.

Use vLLM when you need:

```text
Many users
High GPU utilization
OpenAI-compatible production API
Batching
Monitoring
Docker/Kubernetes deployment
Large model serving
```

## 9.2 Installation

Recommended Python environment:

```bash
uv venv --python 3.12 --seed
source .venv/bin/activate
uv pip install vllm --torch-backend=auto
```

vLLM’s quickstart recommends `uv`, supports Python 3.10–3.13 on Linux, and shows `uv pip install vllm --torch-backend=auto`.

Quick temporary command:

```bash
uv run --with vllm vllm --help
```

## 9.3 Where files go

vLLM is installed inside:

```text
.venv/
```

or inside a Docker image.

Models usually download to:

```text
~/.cache/huggingface/hub
```

For servers, mount the cache:

```bash
-v ~/.cache/huggingface:/root/.cache/huggingface
```

## 9.4 Start a local server

```bash
vllm serve Qwen/Qwen2.5-1.5B-Instruct \
  --host 0.0.0.0 \
  --port 8000
```

Then:

```bash
curl http://localhost:8000/v1/models
```

vLLM starts an OpenAI-compatible server on `localhost:8000` by default, and `--host` / `--port` can change it.

## 9.5 Chat completions

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-1.5B-Instruct",
    "messages": [
      {"role": "system", "content": "You are a helpful backend engineer."},
      {"role": "user", "content": "Explain reverse proxy."}
    ],
    "temperature": 0.2
  }'
```

Python:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="EMPTY"
)

response = client.chat.completions.create(
    model="Qwen/Qwen2.5-1.5B-Instruct",
    messages=[
        {"role": "user", "content": "Explain load balancing."}
    ],
)

print(response.choices[0].message.content)
```

vLLM is designed to work with OpenAI completions and chat completions APIs.

## 9.6 Docker deployment

```bash
docker run --runtime nvidia --gpus all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  --env "HF_TOKEN=$HF_TOKEN" \
  -p 8000:8000 \
  --ipc=host \
  vllm/vllm-openai:latest \
  --model Qwen/Qwen3-0.6B
```

vLLM provides official Docker images such as `vllm/vllm-openai`, and the docs recommend `--ipc=host` or shared memory configuration because PyTorch uses shared memory for tensor-parallel inference.

## 9.7 Add API key

```bash
vllm serve Qwen/Qwen2.5-1.5B-Instruct \
  --host 0.0.0.0 \
  --port 8000 \
  --api-key "my-secret-key"
```

Then request:

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Authorization: Bearer my-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-1.5B-Instruct",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

vLLM supports `--api-key` and `VLLM_API_KEY` for API-key checking.

## 9.8 Offline batch inference

Use vLLM directly inside Python when you have many prompts:

```python
from vllm import LLM, SamplingParams

prompts = [
    "Explain Docker.",
    "Explain Kubernetes.",
    "Explain Redis.",
]

sampling_params = SamplingParams(
    temperature=0.2,
    top_p=0.95,
    max_tokens=200,
)

llm = LLM(model="Qwen/Qwen2.5-1.5B-Instruct")
outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    print(output.outputs[0].text)
```

vLLM’s quickstart covers offline batched inference using `LLM` and `SamplingParams`.

## 9.9 Production concepts to teach deeply

### Continuous batching

Normal server:

```text
Request 1 waits
Request 2 waits
Request 3 waits
```

vLLM-style serving:

```text
Requests are batched continuously token-by-token
GPU stays busy
Throughput improves
```

### PagedAttention

PagedAttention manages KV cache memory more efficiently, similar in spirit to virtual memory paging. This helps serve many requests without wasting huge blocks of GPU memory. vLLM highlights PagedAttention as a core reason for its throughput.

### Prefix caching

If many users share the same system prompt or long context, prefix caching can reuse previously processed tokens.

Use cases:

```text
Same company policy document
Same system prompt
Same RAG instruction prefix
Same coding repository summary
```

### Tensor parallelism

When one model is too large for one GPU:

```bash
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --tensor-parallel-size 4
```

Meaning:

```text
Split model across 4 GPUs.
```

### Production reverse proxy

Typical production layout:

```text
User
→ Nginx / Caddy / API Gateway
→ Auth / rate limit
→ vLLM server
→ GPU
```

Do not expose an unauthenticated local LLM server directly to the public internet.

## 9.10 Benchmarking

```bash
vllm bench latency \
  --model Qwen/Qwen2.5-1.5B-Instruct \
  --input-len 128 \
  --output-len 128
```

```bash
vllm bench serve \
  --model Qwen/Qwen2.5-1.5B-Instruct \
  --host localhost \
  --port 8000 \
  --num-prompts 100
```

Measure:

```text
TTFT
tokens/sec
requests/sec
p50 latency
p95 latency
p99 latency
GPU memory
GPU utilization
error rate
```

## 9.11 Clean uninstall

Python environment:

```bash
deactivate
rm -rf .venv
```

Package only:

```bash
pip uninstall -y vllm
```

Docker:

```bash
docker rm -f vllm-server 2>/dev/null
docker image rm vllm/vllm-openai:latest
```

Optional model cache cleanup:

```bash
rm -rf ~/.cache/huggingface/hub
```

## 9.12 Real developer uses

Use vLLM for:

```text
- Internal company LLM API
- RAG backend serving
- Multi-user chat applications
- GPU inference cluster
- OpenAI-compatible replacement
- Batch summarization
- Evaluation pipelines
- Production load testing
```

## 9.13 Pros and cons

Pros:

```text
- Best production throughput
- OpenAI-compatible
- Docker-friendly
- Strong batching and KV-cache management
- Supports many model architectures
- Production monitoring/deployment friendly
```

Cons:

```text
- More infrastructure knowledge needed
- Usually needs Linux + GPU
- More complex than Ollama/LM Studio
```

Recommended video/course: **vLLM Serving Tutorial: High-Performance LLM Inference** or DeepLearning.AI’s vLLM course.

---


## Important Q&A

**Q: Can I run vLLM on a CPU or MacBook?**
A: vLLM is primarily designed for high-performance Nvidia/AMD GPUs. If you are on a CPU or a Mac, you are much better off using `llama.cpp` or MLX.

**Q: What does `-ngl 999` do in `llama.cpp`?**
A: `ngl` stands for "Number of GPU Layers". Setting it to a very high number like 999 tells `llama.cpp` to try to offload all parts of the neural network to the GPU. If your GPU memory fills up, it will offload whatever it can and run the rest on the CPU.

**Q: Why use `vLLM` over `Ollama` in production?**
A: `Ollama` processes one request at a time sequentially. `vLLM` uses continuous batching and PagedAttention to process hundreds of requests simultaneously, giving you vastly higher throughput and GPU utilization.

## Final revision checklist

```text
[ ] I know how to run a GGUF model using `llama-cli`.
[ ] I understand how `-ngl` offloads layers to the GPU in `llama.cpp`.
[ ] I know how to start the `llama.cpp` local API server.
[ ] I understand when to use `vLLM` (production, GPUs, high traffic).
[ ] I can explain continuous batching and PagedAttention in simple terms.
```

