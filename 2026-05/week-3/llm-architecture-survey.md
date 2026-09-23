# LLM Architecture Survey

Understanding how LLMs work under the hood helps you use them better: why does temperature affect creativity? Why do longer prompts cost more? Why does CoT work? This topic gives you the mental models.

---

## The Transformer (2017 — The Foundation of Everything)

Every modern LLM is built on the Transformer architecture introduced in "Attention Is All You Need" (Vaswani et al., 2017).

### Core Components

```
Input text: "The cat sat on"
    ↓
[Tokenization] → [1192, 4690, 6654, 319]  (token IDs)
    ↓
[Token Embedding] → 4 vectors of 768 dims each
    ↓
[Positional Encoding] → adds position information
    ↓
[Transformer Blocks] × N layers:
    │
    ├── [Self-Attention] — tokens attend to each other
    │       "sat" pays attention to "cat" (subject) and "on" (position)
    │
    ├── [Feed-Forward Network] — per-token transformation
    │       applies learned patterns to each position
    │
    └── [Layer Norm + Residual] — stability and gradient flow
    ↓
[Output Head] → probability over 50,000+ tokens
    ↓
Sample: "mat" (with probability 0.73)
```

### Self-Attention: The Core Mechanism

```python
import numpy as np

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q: queries  (seq_len × d_k)
    K: keys     (seq_len × d_k)
    V: values   (seq_len × d_v)
    """
    d_k = Q.shape[-1]

    # Step 1: compute attention scores
    scores = Q @ K.T / np.sqrt(d_k)       # scale to prevent vanishing gradients

    # Step 2: optional masking (for decoder — can't look at future tokens)
    if mask is not None:
        scores = scores + mask * -1e9      # -inf → 0 after softmax

    # Step 3: softmax to get attention weights (sum to 1)
    weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)

    # Step 4: weighted sum of values
    output = weights @ V

    return output, weights

# Intuition: for each token, how much should I "attend" to other tokens?
# High weight = "this token is very relevant to understanding me"
```

**Why attention is powerful:** "The animal didn't cross the street because it was too tired." What does "it" refer to? Attention lets the model look back at all previous tokens and learn that "it" → "animal" has high relevance.

---

## GPT-style (Decoder-Only)

GPT, Claude, Gemini, LLaMA — all use **decoder-only** Transformers. They generate text one token at a time, left-to-right.

```
Architecture:
  Input: "Translate to French: Hello"
  ↓
  [Stack of Decoder blocks, each with MASKED self-attention]
  ↓
  Outputs: "Bonjour" → then feeds back → " !" → then feeds back → <EOS>

Key property: CAUSAL (each token can only see past tokens)
Why: enables autoregressive generation
Cost: O(sequence_length²) per layer — this is why long prompts cost more!
```

**Models:** Claude (Anthropic), GPT-4o (OpenAI), Gemini (Google), LLaMA 4 (Meta), Qwen 3 (Alibaba)

---

## BERT-style (Encoder-Only)

BERT uses **encoder-only** Transformers. All tokens attend to all other tokens (bidirectional).

```
Architecture:
  Input: "The [MASK] sat on the mat"
  ↓
  [Stack of Encoder blocks, with FULL self-attention]
  ↓
  Predicts: [MASK] → "cat"

Key property: BIDIRECTIONAL (each token sees all tokens)
Why: better for understanding tasks (classification, NER, etc.)
Weakness: can't generate text (no causal masking)
```

**Models:** BERT, RoBERTa, DeBERTa  
**Best for:** Classification, sentence similarity, NER, text embeddings

**Embedding models like BGE-M3 are encoder-only** — they output a single vector representing the whole input, not token-by-token generation.

---

## Encoder-Decoder (Seq2Seq)

T5, BART — encoder processes the input, decoder generates the output.

```
Encoder: processes "Translate: The cat sat on the mat"
         → context representation

Decoder: generates "Le chat était assis sur le tapis"
         (attends to encoder output at each step)

Best for: Translation, summarization, question-answering
Models: T5, BART, mBART
```

---

## Mixture-of-Experts (MoE)

MoE models have multiple "expert" sub-networks. A **router** activates only 2–8 of them per token, making the model larger but not slower to run.

```
Standard Dense Model:
  Input token → [all 7B parameters process it] → output

MoE Model (e.g. 70B parameters, 8 experts):
  Input token → [Router] → activates 2 of 8 experts (14B params)
                         → each expert processes token → combine
  
Result: Model capacity of 70B, compute cost of ~14B!
```

**Models using MoE:**
- GPT-4 (rumored, OpenAI)
- Gemini 1.5 (Google) 
- Mixtral (Mistral AI) — open source, 8 experts, 2 active
- LLaMA 4 Scout/Maverick (Meta) — uses MoE

**Trade-offs:**
- ✅ More parameters = more knowledge/capability
- ✅ Same inference cost as a smaller dense model
- ❌ Harder to train (routing instability)
- ❌ Higher memory to load all experts

---

## Multimodal: CLIP and BLIP

### CLIP (Contrastive Language-Image Pretraining)

CLIP learns to match images and text descriptions by training on 400M image-text pairs.

```
Architecture:
  Image → [Image Encoder (ViT)] → image embedding (512-dim)
  Text  → [Text Encoder (Transformer)] → text embedding (512-dim)

Training: maximize similarity of matching pairs, minimize for non-matching

Result: "a photo of a cat" ↔ 🐱 get similar embeddings
        "a photo of a dog" ↔ 🐱 get dissimilar embeddings
```

**Applications:**
- Zero-shot image classification (no retraining needed)
- Image search using text queries
- DALL-E / Stable Diffusion use CLIP to understand text prompts

```python
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Zero-shot image classification
image = Image.open("photo.jpg")
labels = ["a cat", "a dog", "a car", "a building"]

inputs = processor(text=labels, images=image, return_tensors="pt", padding=True)
outputs = model(**inputs)

probs = outputs.logits_per_image.softmax(dim=1)
for label, prob in zip(labels, probs[0]):
    print(f"{label}: {prob:.1%}")
# → a cat: 92.3%, a dog: 5.1%, a car: 1.8%, a building: 0.8%
```

### BLIP / BLIP-2 (Bootstrapped Language-Image Pretraining)

BLIP extends CLIP to support **image captioning** and **visual question answering**:

```python
from transformers import BlipProcessor, BlipForConditionalGeneration

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

image = Image.open("photo.jpg")
inputs = processor(image, return_tensors="pt")
caption = model.generate(**inputs)
print(processor.decode(caption[0], skip_special_tokens=True))
# → "a cat sitting on a mat"
```

---

## SoTA Models in 2025–2026

| Model | Company | Context | Key Strength |
|-------|---------|---------|-------------|
| **Claude Opus 4.6 / Sonnet 4.6** | Anthropic | 1M tokens | Reasoning, safety, coding |
| **GPT-4o / GPT-4.1** | OpenAI | 128K | Multimodal, speed |
| **Gemini 2.5 Pro** | Google | 1M tokens | Multilingual, very long context |
| **LLaMA 4 Scout/Maverick** | Meta | 10M tokens | Open-source, MoE, local hosting |
| **Qwen 3** | Alibaba | 128K | Multilingual, code, open weights |
| **DeepSeek V3** | DeepSeek | 128K | Strong on math/code, very cheap |
| **Mistral Large 2** | Mistral | 128K | European, GDPR-friendly |

### Choosing a Model for a Task

```
Simple Q&A, summaries, classification:
  → claude-haiku-4-5 or gpt-4o-mini (fast, cheap)

Complex reasoning, coding, analysis:
  → claude-sonnet-4-6 or gpt-4o (balanced)

Most difficult tasks, long documents:
  → claude-opus-4-6 or gemini-2.5-pro (best quality)

Free/local inference:
  → LLaMA 4 via Ollama, Qwen 3, Mistral (via llama.cpp)

Embeddings:
  → text-embedding-3-small (OpenAI), BGE-M3 (local)

Image understanding:
  → claude-sonnet-4-6, gpt-4o, gemini-2.0-flash
```

---

## Why CoT Works (Architecture Perspective)

Chain-of-Thought works because **generating intermediate reasoning steps gives the model more "compute"** before producing the final answer.

```
Without CoT:
  Input tokens → [forward pass] → "42"
  The model has one forward pass to "think"

With CoT:
  Input tokens → [forward pass] → "First, 847 × 300 = 254,100..."
               → [forward pass] → "Then, 847 × 293 - 847 × 7 = 254,100 - 5,929..."
               → [forward pass] → "= 248,171"
  Each generated token is another opportunity to compute
```

This is why CoT improves accuracy on hard tasks — it's not magic, it's giving the model more inference compute.

---

## Why Temperature Matters

```python
import numpy as np

def sample_with_temperature(logits: np.ndarray, temperature: float) -> int:
    """
    temperature=0: always pick the highest logit (greedy, deterministic)
    temperature=1: standard sampling from the distribution
    temperature=2: much more random (high entropy)
    """
    if temperature == 0:
        return int(np.argmax(logits))

    scaled = logits / temperature          # divide → sharpens or flattens
    probs = np.exp(scaled) / np.sum(np.exp(scaled))  # softmax
    return int(np.random.choice(len(probs), p=probs))

# Example: logits for ["the", "a", "this", "one"]
logits = np.array([3.0, 2.0, 1.5, 0.5])

print("temp=0.0:", ["the", "a", "this", "one"][sample_with_temperature(logits, 0.001)])
# → always "the" (highest logit)

print("temp=1.0:", ["the", "a", "this", "one"][sample_with_temperature(logits, 1.0)])
# → usually "the", sometimes "a"

print("temp=2.0:", ["the", "a", "this", "one"][sample_with_temperature(logits, 2.0)])
# → more random, sometimes "this" or "one"
```

**Practical guide:**
- `temperature=0`: factual Q&A, structured extraction, math (always want same answer)
- `temperature=0.7`: balanced creativity (default for most tasks)
- `temperature=1.0+`: creative writing, brainstorming (want diversity)

---

## Video Reference

[![But what is a GPT? Visual intro to transformers](https://img.youtube.com/vi/wjZofJX0v4M/0.jpg)](https://youtu.be/wjZofJX0v4M "But what is a GPT? Visual intro to transformers")

---

## Summary

| Architecture | Direction | Best For | Examples |
|-------------|-----------|---------|---------|
| Decoder-only (GPT) | Left-to-right | Text generation, chat | Claude, GPT-4, LLaMA |
| Encoder-only (BERT) | Bidirectional | Embeddings, classification | BERT, BGE-M3 |
| Encoder-Decoder | Both | Translation, summarization | T5, BART |
| MoE | Either | Scale without compute | Mixtral, LLaMA 4 |
| CLIP | Cross-modal | Image-text matching | CLIP, OpenCLIP |
| BLIP | Cross-modal | Image captioning, VQA | BLIP-2, InstructBLIP |

---

