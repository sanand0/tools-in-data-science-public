# Vector Embeddings

An **embedding** is a fixed-length list of numbers (a vector) that represents the meaning of a text. Texts with similar meanings have vectors that are close to each other in high-dimensional space. This is the mathematical foundation of semantic search, RAG, and recommendation systems.

?> **Intuition**
?> "King" − "Man" + "Woman" ≈ "Queen"
?>
?> This isn't magic — embeddings place semantically related words in similar geometric regions of the vector space.

---

## What is an Embedding?

```python
from openai import OpenAI

client = OpenAI()

text = "The cat sat on the mat."
response = client.embeddings.create(
    model="text-embedding-3-small",
    input=text,
)

embedding = response.data[0].embedding
print(f"Text: '{text}'")
print(f"Embedding dimensions: {len(embedding)}")  # 1536
print(f"First 5 values: {embedding[:5]}")
# → [-0.0123, 0.0456, -0.0789, 0.0234, 0.0567, ...]
```

Each number in the vector captures some aspect of the text's meaning. Individually meaningless, but together they encode semantics.

---

## Choosing an Embedding Model

| Model | Dimensions | Max Tokens | Cost | Best For |
|-------|-----------|-----------|------|---------|
| `text-embedding-3-small` | 1536 | 8191 | $0.02/MTok | General purpose, fast |
| `text-embedding-3-large` | 3072 | 8191 | $0.13/MTok | Higher quality |
| `BGE-M3` (local) | 1024 | 8192 | Free | Multilingual, on-premise |
| `embed-v4.0` (Cohere) | 1024 | 512 | $0.10/MTok | With reranking pipeline |
| `nomic-embed-text` (Ollama) | 768 | 8192 | Free | Local, quick experiments |

---

## OpenAI Embeddings

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def embed(text: str, model: str = "text-embedding-3-small") -> list[float]:
    response = client.embeddings.create(model=model, input=text)
    return response.data[0].embedding

def embed_batch(texts: list[str], model: str = "text-embedding-3-small") -> list[list[float]]:
    """Embed multiple texts in one API call (much more efficient)."""
    response = client.embeddings.create(model=model, input=texts)
    # Sort by index to maintain order
    return [item.embedding for item in sorted(response.data, key=lambda x: x.index)]

# Batch is ~10x cheaper per token than individual calls
texts = ["Python is great", "Java is verbose", "Rust is fast"]
embeddings = embed_batch(texts)
print(f"Embedded {len(embeddings)} texts, each {len(embeddings[0])} dimensions")
```

---

## BGE-M3 (Local, Free, Multilingual)

BGE-M3 from BAAI is one of the best open-source embedding models. Runs locally, free, supports 100+ languages.

```bash
uv add sentence-transformers torch
```

```python
from sentence_transformers import SentenceTransformer
import numpy as np

# Download on first run (~600MB), cached after
model = SentenceTransformer("BAAI/bge-m3")

def embed_local(text: str) -> np.ndarray:
    # BGE-M3 instruction prefix improves retrieval quality
    instruction = "Represent this sentence for searching relevant passages: "
    return model.encode(instruction + text, normalize_embeddings=True)

def embed_local_batch(texts: list[str], batch_size: int = 32) -> np.ndarray:
    instruction = "Represent this sentence for searching relevant passages: "
    instructed = [instruction + t for t in texts]
    return model.encode(
        instructed,
        batch_size=batch_size,
        normalize_embeddings=True,
        show_progress_bar=True,
    )

# Local embedding (no API cost!)
embedding = embed_local("What is the capital of Tamil Nadu?")
print(f"Shape: {embedding.shape}")  # (1024,)
```

### BGE-M3 Multilingual

```python
# Works in any language — great for Indian language content
texts = [
    "Python is a programming language.",        # English
    "Python एक प्रोग्रामिंग भाषा है।",           # Hindi
    "Python ஒரு நிரலாக்க மொழி.",               # Tamil
]

embeddings = model.encode(texts, normalize_embeddings=True)

# Cross-lingual similarity — these should be similar!
from numpy.linalg import norm

def cosine_sim(a, b):
    return float(np.dot(a, b))  # normalized vectors, dot = cosine

print(cosine_sim(embeddings[0], embeddings[1]))  # ~0.85 (English-Hindi)
print(cosine_sim(embeddings[0], embeddings[2]))  # ~0.83 (English-Tamil)
```

---

## Cosine Similarity

The standard metric for comparing embedding vectors:

```python
import numpy as np

def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Returns a value from -1 to 1. Higher = more similar."""
    a_arr = np.array(a)
    b_arr = np.array(b)
    return float(np.dot(a_arr, b_arr) / (np.linalg.norm(a_arr) * np.linalg.norm(b_arr)))

# Pre-normalized vectors: cosine similarity = dot product
def cosine_similarity_normalized(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b))

# Pairwise similarities
texts = [
    "I love playing cricket",
    "Cricket is my favourite sport",
    "Python programming is fun",
    "Data science involves statistics",
]

from openai import OpenAI
client = OpenAI()
response = client.embeddings.create(model="text-embedding-3-small", input=texts)
embs = [r.embedding for r in response.data]

print("Similarity matrix:")
for i, t1 in enumerate(texts):
    for j, t2 in enumerate(texts):
        sim = cosine_similarity(embs[i], embs[j])
        print(f"  {i+1}↔{j+1}: {sim:.3f} | {t1[:20]} ↔ {t2[:20]}")
```

Output shows cricket texts are similar to each other (0.8+), but not to programming texts (0.2–0.3).

---

## Semantic Search from Scratch

```python
import numpy as np
from openai import OpenAI

client = OpenAI()

class SimpleSemanticSearch:
    def __init__(self, model: str = "text-embedding-3-small"):
        self.model = model
        self.documents: list[str] = []
        self.embeddings: np.ndarray | None = None

    def index(self, documents: list[str]):
        """Embed and store all documents."""
        self.documents = documents
        response = client.embeddings.create(model=self.model, input=documents)
        embs = [r.embedding for r in sorted(response.data, key=lambda x: x.index)]
        self.embeddings = np.array(embs)

        # Normalize for fast cosine similarity (dot product on normalized = cosine)
        norms = np.linalg.norm(self.embeddings, axis=1, keepdims=True)
        self.embeddings = self.embeddings / norms

    def search(self, query: str, top_k: int = 3) -> list[dict]:
        """Find top_k most similar documents."""
        # Embed query
        q_response = client.embeddings.create(model=self.model, input=query)
        q_emb = np.array(q_response.data[0].embedding)
        q_emb = q_emb / np.linalg.norm(q_emb)  # normalize

        # Compute similarities (matrix dot product)
        similarities = self.embeddings @ q_emb  # shape: (n_docs,)

        # Get top-k
        top_indices = np.argsort(similarities)[::-1][:top_k]
        return [
            {
                "text": self.documents[i],
                "score": float(similarities[i]),
                "rank": rank + 1,
            }
            for rank, i in enumerate(top_indices)
        ]

# Example: search TDS course topics
searcher = SimpleSemanticSearch()
searcher.index([
    "FastAPI is a modern Python web framework for building REST APIs with automatic documentation",
    "Docker containers package applications with all dependencies for consistent deployment",
    "Prompt engineering techniques include zero-shot, few-shot, and chain-of-thought",
    "Vector embeddings represent text as numerical vectors in high-dimensional space",
    "Redis is an in-memory data store used for caching and session management",
    "LangSmith traces LLM API calls for debugging and cost monitoring",
    "GitHub Actions automates CI/CD workflows triggered by repository events",
])

results = searcher.search("how do I cache API responses?", top_k=3)
for r in results:
    print(f"[{r['rank']}] score={r['score']:.3f} — {r['text'][:80]}...")
# → Redis caching (0.78), FastAPI (0.45), Docker (0.32)
```

---

## Dimensionality and Truncation

You can reduce embedding dimensions to save storage and speed up search. OpenAI's newer models support native truncation:

```python
# text-embedding-3-small supports reducing from 1536 to any size
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="Hello, world!",
    dimensions=512,  # ← reduce from 1536 to 512
)
print(len(response.data[0].embedding))  # 512

# Or manually with PCA / truncation (for BGE-M3 etc.)
from sklearn.decomposition import PCA
import numpy as np

# Fit PCA on your document corpus
pca = PCA(n_components=256)
corpus_embeddings = embed_local_batch(your_documents)
pca.fit(corpus_embeddings)

# Transform any embedding to 256 dims
reduced = pca.transform(corpus_embeddings)
print(f"Original: {corpus_embeddings.shape[1]}, Reduced: {reduced.shape[1]}")
print(f"Variance explained: {pca.explained_variance_ratio_.sum():.1%}")
```

---

## Cohere Embeddings

```bash
uv add cohere
```

```python
import cohere

co = cohere.Client("your-cohere-api-key")

def embed_cohere(texts: list[str], input_type: str = "search_document") -> list[list[float]]:
    """
    input_type:
      - "search_document" for corpus documents
      - "search_query" for user queries (different embedding for queries!)
    """
    response = co.embed(
        texts=texts,
        model="embed-v4.0",
        input_type=input_type,
        embedding_types=["float"],
    )
    return response.embeddings.float_

# ✅ Cohere requires you to specify query vs document
doc_embeddings = embed_cohere(documents, input_type="search_document")
query_embedding = embed_cohere([query], input_type="search_query")[0]
```

---

## Video Reference

[![Word Embeddings and Word2Vec](https://img.youtube.com/vi/ySus5ZS0b94/0.jpg)](https://youtu.be/ySus5ZS0b94 "Word Embeddings and Word2Vec")

---

## Summary

| Concept | Key Point |
|---------|----------|
| Embedding | Fixed-size vector representing text meaning |
| Dimensions | Higher = more expressive, more expensive, slower |
| Cosine similarity | Standard metric: 1.0 = identical, 0.0 = unrelated, -1.0 = opposite |
| BGE-M3 | Best local model: free, multilingual, 1024-dim |
| text-embedding-3-small | Best cloud model: cheap, fast, 1536-dim |
| Batch embedding | Always batch multiple texts — 10x more efficient |
| Normalization | Normalize vectors → cosine similarity becomes dot product |

---

