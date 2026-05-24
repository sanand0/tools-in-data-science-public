# Hybrid Search

> **Dense search finds synonyms. Sparse search finds exact terms. Hybrid search wins.**

---

## The Problem with Pure Vector Search

Vector (dense) search is powerful but has blind spots:

- **Keyword mismatch** — "myocardial infarction" ≠ "heart attack" in dense space without enough training data  
- **Rare terms** — product codes, model numbers, names get diluted  
- **Exact match needs** — legal terms, codes, IDs should match exactly

BM25 (sparse) search has the opposite profile: great for exact terms, poor for semantic similarity.

**Hybrid = best of both worlds.**

---

## Dense Retrieval (Semantic Search)

You already know this from Week 3. Query gets embedded → nearest neighbors retrieved.

```python
from langchain.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

vectorstore = Chroma(
    collection_name="tds_docs",
    embedding_function=OpenAIEmbeddings()
)

# Dense search
dense_results = vectorstore.similarity_search_with_score(
    "how does gradient descent work?", k=10
)
```

---

## Sparse Retrieval — BM25

BM25 (Best Match 25) is the gold standard TF-IDF variant. It counts term frequencies, penalizes long documents, rewards rare terms.

```bash
uv add rank_bm25
```

```python
from rank_bm25 import BM25Okapi

# Tokenize corpus
corpus = [
    "RAG uses dense retrieval to find relevant documents",
    "BM25 is a sparse retrieval method based on TF-IDF",
    "Hybrid search combines dense and sparse retrieval",
]

tokenized_corpus = [doc.lower().split() for doc in corpus]
bm25 = BM25Okapi(tokenized_corpus)

# Search
query = "sparse retrieval TF-IDF method"
tokenized_query = query.lower().split()

scores = bm25.get_scores(tokenized_query)
top_k_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:3]

for i in top_k_indices:
    print(f"Score: {scores[i]:.3f} | {corpus[i]}")
```

---

## Reciprocal Rank Fusion (RRF)

RRF merges ranked lists from multiple retrieval methods. The key insight: **position matters more than score**.

```math
\text{RRF}(d) = \sum_{r \in R} \frac{1}{k + r(d)}
```

Where:
- $r(d)$ = rank of document $d$ in ranked list $r$  
- $k$ = constant (typically 60) that limits the impact of very high ranks

```python
from typing import List, Dict, Tuple

def reciprocal_rank_fusion(
    ranked_lists: List[List[str]],
    k: int = 60
) -> List[Tuple[str, float]]:
    """
    Fuse multiple ranked lists using RRF.
    
    Args:
        ranked_lists: Each list is a ranked list of document IDs
        k: Constant (default 60, recommended in original paper)
    
    Returns:
        List of (doc_id, rrf_score) sorted by score descending
    """
    scores: Dict[str, float] = {}
    
    for ranked_list in ranked_lists:
        for rank, doc_id in enumerate(ranked_list, start=1):
            if doc_id not in scores:
                scores[doc_id] = 0.0
            scores[doc_id] += 1.0 / (k + rank)
    
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)

# Example
dense_ranking = ["doc_c", "doc_a", "doc_b"]    # dense search ranked list
sparse_ranking = ["doc_a", "doc_d", "doc_c"]   # BM25 ranked list

fused = reciprocal_rank_fusion([dense_ranking, sparse_ranking])
print("Fused rankings:")
for doc_id, score in fused:
    print(f"  {doc_id}: {score:.4f}")
```

---

## Full Hybrid RAG Pipeline

```python
import openai
from rank_bm25 import BM25Okapi
from langchain.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

class HybridRetriever:
    def __init__(self, documents: list[str], k: int = 5):
        self.documents = documents
        self.k = k
        self.doc_ids = [f"doc_{i}" for i in range(len(documents))]
        
        # Dense index
        self.vectorstore = Chroma.from_texts(
            texts=documents,
            embedding=OpenAIEmbeddings(),
            metadatas=[{"id": did} for did in self.doc_ids]
        )
        
        # Sparse index (BM25)
        tokenized = [doc.lower().split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized)
    
    def dense_search(self, query: str, k: int = 10) -> list[str]:
        results = self.vectorstore.similarity_search(query, k=k)
        return [r.metadata["id"] for r in results]
    
    def sparse_search(self, query: str, k: int = 10) -> list[str]:
        tokenized_query = query.lower().split()
        scores = self.bm25.get_scores(tokenized_query)
        ranked = sorted(
            range(len(scores)),
            key=lambda i: scores[i],
            reverse=True
        )[:k]
        return [self.doc_ids[i] for i in ranked]
    
    def retrieve(self, query: str) -> list[str]:
        dense_ranking = self.dense_search(query, k=self.k * 2)
        sparse_ranking = self.sparse_search(query, k=self.k * 2)
        
        # RRF fusion
        fused = reciprocal_rank_fusion([dense_ranking, sparse_ranking])
        
        # Return top-k document texts
        top_ids = [doc_id for doc_id, _ in fused[:self.k]]
        id_to_doc = {did: doc for did, doc in zip(self.doc_ids, self.documents)}
        return [id_to_doc[did] for did in top_ids if did in id_to_doc]

# Usage
docs = [
    "FAISS stands for Facebook AI Similarity Search.",
    "Hybrid search improves RAG over pure semantic search.",
    "BM25 is a probabilistic ranking function.",
    "Dense retrieval uses embedding similarity.",
    "RRF stands for Reciprocal Rank Fusion.",
]

retriever = HybridRetriever(docs)
results = retriever.retrieve("what is dense vs sparse retrieval?")
for r in results:
    print(f"• {r}")
```

---

## SPLADE — Learned Sparse Representations

SPLADE is a neural sparse retrieval model — it learns sparse representations that outperform BM25 significantly.

```bash
uv add transformers torch
```

```python
from transformers import AutoModelForMaskedLM, AutoTokenizer
import torch

model_id = "naver/splade-cocondenser-ensemble-distil"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForMaskedLM.from_pretrained(model_id)

def encode_splade(text: str) -> dict:
    """Returns sparse representation as {token_id: weight}"""
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        output = model(**inputs)
    
    # SPLADE: max over sequence, relu activation
    logits = output.logits
    sparse = torch.log(1 + torch.relu(logits)).max(dim=1).values.squeeze()
    
    # Get non-zero tokens
    nonzero_indices = torch.nonzero(sparse).squeeze().tolist()
    if isinstance(nonzero_indices, int):
        nonzero_indices = [nonzero_indices]
    
    return {
        tokenizer.decode([i]).strip(): sparse[i].item()
        for i in nonzero_indices
        if sparse[i].item() > 0
    }

sparse_vec = encode_splade("What is retrieval augmented generation?")
# Top-10 terms and weights
top10 = sorted(sparse_vec.items(), key=lambda x: x[1], reverse=True)[:10]
print(top10)
```

---

## Qdrant Native Hybrid Search

Qdrant 1.7+ supports hybrid search natively:

```python
from qdrant_client import QdrantClient
from qdrant_client.models import (
    SparseVector, SparseVectorParams, SparseIndexParams,
    NamedSparseVector, NamedVector, Prefetch, FusionQuery, Fusion
)

client = QdrantClient("http://localhost:6333")

# Create collection with both dense and sparse vectors
client.recreate_collection(
    collection_name="hybrid_collection",
    vectors_config={
        "dense": VectorParams(size=1536, distance=Distance.COSINE),
    },
    sparse_vectors_config={
        "sparse": SparseVectorParams(index=SparseIndexParams(on_disk=False))
    }
)

# Query with hybrid fusion
results = client.query_points(
    collection_name="hybrid_collection",
    prefetch=[
        Prefetch(query=dense_vector, using="dense", limit=20),
        Prefetch(query=SparseVector(indices=sparse_indices, values=sparse_values),
                 using="sparse", limit=20),
    ],
    query=FusionQuery(fusion=Fusion.RRF),
    limit=5,
)
```

---

## Key Takeaways

1. **Always start with hybrid** — it's rarely worse than either method alone  
2. **RRF k=60** is a solid default; tune if you have labeled data  
3. **BM25 is fast and free** — no embedding needed for the sparse side  
4. **SPLADE > BM25** in quality but requires GPU inference  
5. **Production**: Qdrant or Elasticsearch both have native hybrid search APIs

---

## Further Reading

- [Hybrid Search — Pinecone Blog](https://www.pinecone.io/learn/hybrid-search-intro/)  
- [RRF Original Paper — Cormack et al. 2009](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)  
- [SPLADE Paper](https://arxiv.org/abs/2107.05720)