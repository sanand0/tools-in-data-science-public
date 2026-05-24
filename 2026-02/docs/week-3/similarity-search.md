# Similarity Search

You have a million embeddings. A user queries arrive. Brute-force cosine similarity over 1M × 1536-dim vectors takes seconds. **Approximate Nearest Neighbor (ANN)** indices make it milliseconds — with only a small loss in recall.

---

## The Problem: Brute-Force Doesn't Scale

```python
import numpy as np
import time

n_docs = 1_000_000
dim = 1536

# Simulate 1M document embeddings
corpus = np.random.randn(n_docs, dim).astype(np.float32)
corpus /= np.linalg.norm(corpus, axis=1, keepdims=True)  # normalize

query = np.random.randn(dim).astype(np.float32)
query /= np.linalg.norm(query)

# Brute force
start = time.time()
similarities = corpus @ query
top5 = np.argsort(similarities)[::-1][:5]
elapsed = time.time() - start

print(f"Brute force: {elapsed*1000:.0f}ms for {n_docs:,} docs")
# → ~1,200ms on CPU — too slow for a web API
```

ANN indices trade a small amount of accuracy for 100–1000x speed:

| Method | Speed (1M docs) | Recall@10 | Memory | Use Case |
|--------|----------------|-----------|--------|---------|
| Brute force | ~1,200ms | 100% | O(n×d) | < 10k docs |
| FAISS IVF | ~5ms | 95% | O(n×d) | 100k–10M docs |
| HNSW | ~1ms | 98% | O(n×d × 1.1) | 100k–5M docs |
| FAISS PQ | ~2ms | 85% | O(n × m/8) | > 10M docs (compressed) |

---

## FAISS (Facebook AI Similarity Search)

FAISS is the most widely used library for similarity search. It supports CPU and GPU, multiple index types, and handles billions of vectors.

```bash
uv add faiss-cpu  # CPU version (for most use cases)
# uv add faiss-gpu  # if you have a CUDA GPU
```

### Flat Index (Exact, for < 100k docs)

```python
import faiss
import numpy as np

dim = 1536

# Build index
index = faiss.IndexFlatIP(dim)   # IP = inner product = cosine on normalized vectors
# Alternative: faiss.IndexFlatL2(dim) for L2 distance

# Add embeddings (must be float32, normalized for cosine)
corpus_np = np.array(embeddings, dtype=np.float32)
faiss.normalize_L2(corpus_np)    # normalize in place
index.add(corpus_np)

print(f"Index size: {index.ntotal:,} vectors")

# Search
query_np = np.array([query_embedding], dtype=np.float32)
faiss.normalize_L2(query_np)

k = 5  # top-5 results
distances, indices = index.search(query_np, k)

for rank, (dist, idx) in enumerate(zip(distances[0], indices[0])):
    print(f"[{rank+1}] score={dist:.4f} doc_id={idx}")
```

### IVF Index (Inverted File — for 100k–10M docs)

IVF clusters vectors into Voronoi cells. At search time, only nearby cells are searched:

```python
import faiss
import numpy as np

dim = 1536
n_docs = 500_000

# IVF parameters
n_clusters = int(np.sqrt(n_docs))   # rule of thumb: sqrt(n_docs)
n_probe = 32                         # how many clusters to search at query time
                                     # higher = more accurate but slower

# Build index
quantizer = faiss.IndexFlatIP(dim)
index = faiss.IndexIVFFlat(quantizer, dim, n_clusters, faiss.METRIC_INNER_PRODUCT)

# Training is required for IVF (learns cluster centers)
print("Training index...")
train_data = corpus_np[:min(n_docs, 100_000)]  # train on a subset if needed
index.train(train_data)

# Add all vectors
index.add(corpus_np)
index.nprobe = n_probe

print(f"Index trained on {train_data.shape[0]:,}, total: {index.ntotal:,}")

# Search is much faster now
distances, indices = index.search(query_np, k=5)
```

### IVFPQ Index (Compressed, for > 10M docs)

Product Quantization compresses vectors from 1536 floats (6144 bytes) to just 96 bytes per vector:

```python
import faiss

dim = 1536
n_clusters = 1024
m = 96        # number of sub-quantizers (must divide dim)
              # 1536 / 96 = 16 floats per sub-vector
bits = 8      # 8 bits per code = 256 centroids per sub-quantizer

quantizer = faiss.IndexFlatIP(dim)
index = faiss.IndexIVFPQ(quantizer, dim, n_clusters, m, bits, faiss.METRIC_INNER_PRODUCT)

index.train(corpus_np)
index.add(corpus_np)
index.nprobe = 32

# Memory: 96 bytes per vector vs 6144 bytes (64x compression!)
print(f"Memory per vector: {m} bytes (vs {dim * 4} bytes uncompressed)")
```

### Save and Load FAISS Index

```python
# Save
faiss.write_index(index, "my_index.faiss")

# Load
index = faiss.read_index("my_index.faiss")
index.nprobe = 32  # re-set nprobe after loading
```

---

## HNSW (Hierarchical Navigable Small World)

HNSW is often faster than FAISS IVF for medium-scale search and easier to use. It's the default index in ChromaDB, Qdrant, and Weaviate.

```bash
uv add hnswlib
```

```python
import hnswlib
import numpy as np

dim = 1536
max_elements = 100_000

# Build index
index = hnswlib.Index(space="cosine", dim=dim)
index.init_index(
    max_elements=max_elements,
    ef_construction=200,   # higher = better quality, slower build
    M=16,                  # number of edges per node; 16 is good default
)

# Add items with IDs
ids = np.arange(len(embeddings))
corpus_np = np.array(embeddings, dtype=np.float32)
index.add_items(corpus_np, ids)

# Set ef for search (higher = more accurate, slower)
index.set_ef(50)  # ef >= top_k

# Search
query_np = np.array([query_embedding], dtype=np.float32)
labels, distances = index.knn_query(query_np, k=5)

for rank, (label, dist) in enumerate(zip(labels[0], distances[0])):
    print(f"[{rank+1}] doc_id={label}, distance={dist:.4f}")

# Save and load
index.save_index("hnsw_index.bin")
index_loaded = hnswlib.Index(space="cosine", dim=dim)
index_loaded.load_index("hnsw_index.bin", max_elements=max_elements)
```

### HNSW Parameters Guide

| Parameter | Default | Effect |
|-----------|---------|--------|
| `M` | 16 | Edges per node. Higher = better recall, more memory |
| `ef_construction` | 200 | Build quality. Higher = slower build, better index |
| `ef` (search) | 50 | Search quality. Higher = slower search, better recall |

For most use cases: `M=16, ef_construction=200, ef=50` gives >95% recall.

---

## Putting It Together: A Complete Search System

```python
import faiss
import numpy as np
import json
from pathlib import Path
from openai import OpenAI

class EmbeddingSearchIndex:
    def __init__(self, dim: int = 1536, use_hnsw: bool = True):
        self.dim = dim
        self.documents: list[str] = []
        self.metadata: list[dict] = []

        if use_hnsw:
            import hnswlib
            self.index = hnswlib.Index(space="cosine", dim=dim)
            self._type = "hnsw"
        else:
            self.index = faiss.IndexFlatIP(dim)
            self._type = "faiss"

        self.client = OpenAI()

    def _embed(self, texts: list[str]) -> np.ndarray:
        response = self.client.embeddings.create(
            model="text-embedding-3-small",
            input=texts,
        )
        embs = np.array([r.embedding for r in sorted(response.data, key=lambda x: x.index)], dtype=np.float32)
        faiss.normalize_L2(embs)
        return embs

    def build(self, documents: list[str], metadata: list[dict] = None, batch_size: int = 100):
        self.documents = documents
        self.metadata = metadata or [{} for _ in documents]

        if self._type == "hnsw":
            self.index.init_index(max_elements=len(documents), ef_construction=200, M=16)

        print(f"Embedding {len(documents)} documents...")
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i+batch_size]
            embs = self._embed(batch)
            if self._type == "hnsw":
                self.index.add_items(embs, np.arange(i, i+len(batch)))
            else:
                self.index.add(embs)
            print(f"  {min(i+batch_size, len(documents))}/{len(documents)}", end="\r")

        print(f"\nIndex built: {len(documents)} documents")

        if self._type == "hnsw":
            self.index.set_ef(50)

    def search(self, query: str, top_k: int = 5) -> list[dict]:
        q_emb = self._embed([query])

        if self._type == "hnsw":
            labels, distances = self.index.knn_query(q_emb, k=top_k)
            results = [
                {"text": self.documents[i], "score": 1 - float(d), "metadata": self.metadata[i]}
                for i, d in zip(labels[0], distances[0])
            ]
        else:
            distances, indices = self.index.search(q_emb, top_k)
            results = [
                {"text": self.documents[i], "score": float(d), "metadata": self.metadata[i]}
                for d, i in zip(distances[0], indices[0])
                if i >= 0
            ]

        return results

# Usage
search = EmbeddingSearchIndex(use_hnsw=True)
search.build(
    documents=course_materials,
    metadata=[{"week": w, "topic": t} for w, t in zip(weeks, topics)],
)

results = search.search("How do I add authentication to FastAPI?", top_k=3)
for r in results:
    print(f"Score: {r['score']:.3f} | Week {r['metadata']['week']} — {r['text'][:100]}")
```

---

## Choosing the Right Index

```
Number of vectors?
    < 10,000   → Brute force (IndexFlatIP) — simplest, exact
    < 500,000  → HNSW (hnswlib) — fast, good recall, easy
    < 5M       → FAISS IVF — fast, good recall, needs training
    > 5M       → FAISS IVFPQ — compressed, approximate

Memory constrained?
    → FAISS PQ (64x compression, lower recall)

Need GPU acceleration?
    → faiss-gpu, supports all index types on CUDA

Need to update index (add/delete)?
    → HNSW (supports add); FAISS requires rebuilding for deletes

Production scale search?
    → Use a vector database (Qdrant, ChromaDB, Weaviate) — they wrap these
       indices with persistence, filtering, and API access
```

---

## Summary

| Library | Index Type | Speed | Recall | Memory | Update |
|---------|-----------|-------|--------|--------|--------|
| `faiss` (Flat) | Exact | Slow | 100% | High | ✅ Add |
| `faiss` (IVF) | Cluster | Fast | 95% | High | ✅ Add |
| `faiss` (IVFPQ) | Compressed | Fast | 85% | Low | ✅ Add |
| `hnswlib` | Graph | Fastest | 98% | Medium | ✅ Add |
| `annoy` | Tree | Medium | 90% | Medium | ❌ Rebuild |