# Vector Databases

> Embeddings without a vector database are like data without a database — unusable at scale.

---

## What Is a Vector Database?

A vector database stores high-dimensional vectors (embeddings) and answers the question: **"Which vectors are most similar to this query vector?"**

This is the "Retrieve" in Retrieval-Augmented Generation.

```mermaid
graph LR
  A[Query: 'What is RAG?'] --> B[Embed Query]
  B --> C{Vector DB}
  C --> D["[0.12, -0.34, 0.87, ...]"]
  D --> E[ANN Search: Top-K similar chunks]
  E --> F[Retrieved Context]
```

---

## The Four You'll Use

| DB | Type | Best For | Scale |
|----|------|----------|-------|
| **FAISS** | Library | Research, GPU search | Millions (single machine) |
| **ChromaDB** | Embedded DB | Prototyping, local dev | < 10M vectors |
| **Qdrant** | Production DB | Production RAG | Billions, distributed |
| **PGVector** | Postgres ext. | Existing Postgres stack | Millions |

---

## FAISS — Facebook AI Similarity Search

FAISS is a **library**, not a server. It runs embedded in your Python process. Fastest for exact or approximate nearest-neighbor search.

### Install & Basic Usage

```bash
uv add faiss-cpu  # CPU version
# uv add faiss-gpu  # if you have CUDA
```

```python
import faiss
import numpy as np

# Simulate 1000 vectors of dimension 1536 (OpenAI embedding size)
d = 1536          # embedding dimension
n = 1000          # number of vectors
vectors = np.random.randn(n, d).astype("float32")

# --- Flat Index (Exact search) ---
index = faiss.IndexFlatL2(d)   # L2 distance (Euclidean)
index.add(vectors)
print(f"Index has {index.ntotal} vectors")

# Search: find 5 nearest neighbors to a query
query = np.random.randn(1, d).astype("float32")
distances, indices = index.search(query, k=5)
print("Top-5 indices:", indices[0])
print("Distances:", distances[0])
```

### Approximate Search (HNSW) — Faster for Large Datasets

```python
# HNSW index — much faster, slight accuracy trade-off
M = 32          # number of connections per node
ef_construction = 200

index = faiss.IndexHNSWFlat(d, M)
index.hnsw.efConstruction = ef_construction
index.add(vectors)

# At search time, set ef_search
index.hnsw.efSearch = 64
distances, indices = index.search(query, k=5)
```

### Save & Load Index

```python
faiss.write_index(index, "my_index.faiss")
loaded_index = faiss.read_index("my_index.faiss")
```

### FAISS with LangChain

```python
from langchain.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()

# Build from documents
vectorstore = FAISS.from_texts(
    texts=["FAISS is fast", "ChromaDB is simple", "Qdrant is production-ready"],
    embedding=embeddings,
)

# Search
results = vectorstore.similarity_search("Which DB is for production?", k=2)
for doc in results:
    print(doc.page_content)

# Save & load
vectorstore.save_local("faiss_index")
loaded = FAISS.load_local("faiss_index", embeddings,
                          allow_dangerous_deserialization=True)
```

---

## ChromaDB — Developer-Friendly Embedded DB

Chroma is the fastest path from idea to working RAG. Persistent storage, metadata filtering, no server needed.

```bash
uv add chromadb
```

```python
import chromadb
from chromadb.utils import embedding_functions

# Local persistent storage
client = chromadb.PersistentClient(path="./chroma_db")

# Use OpenAI embeddings
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key="YOUR_OPENAI_KEY",
    model_name="text-embedding-3-small"
)

collection = client.get_or_create_collection(
    name="tds_course",
    embedding_function=openai_ef,
    metadata={"hnsw:space": "cosine"}
)

# Add documents
collection.add(
    documents=[
        "RAG stands for Retrieval-Augmented Generation.",
        "FAISS is a library for efficient similarity search.",
        "ChromaDB is an AI-native vector database.",
    ],
    metadatas=[
        {"week": 4, "topic": "RAG"},
        {"week": 4, "topic": "FAISS"},
        {"week": 4, "topic": "ChromaDB"},
    ],
    ids=["doc1", "doc2", "doc3"]
)

# Query with metadata filter
results = collection.query(
    query_texts=["How does RAG work?"],
    n_results=2,
    where={"week": 4}   # metadata filter
)

for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
    print(f"[{meta['topic']}] {doc}")
```

---

## Qdrant — Production Vector Database

Qdrant is written in Rust. It runs as a server (Docker or cloud), handles billions of vectors, and has rich payload filtering.

### Run Locally with Docker

```bash
docker run -d -p 6333:6333 -p 6334:6334 \
  -v $(pwd)/qdrant_storage:/qdrant/storage:z \
  qdrant/qdrant
```

```bash
uv add qdrant-client
```

```python
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct,
    Filter, FieldCondition, MatchValue
)
import uuid

client = QdrantClient("http://localhost:6333")

# Create collection
client.recreate_collection(
    collection_name="tds_docs",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
)

# Insert vectors (in production, use batch mode)
import openai
oai = openai.OpenAI()

texts = [
    "Qdrant is written in Rust for high performance.",
    "Vector databases power semantic search in RAG.",
    "Cosine similarity measures angle between vectors.",
]

embeddings = oai.embeddings.create(
    input=texts, model="text-embedding-3-small"
).data

points = [
    PointStruct(
        id=str(uuid.uuid4()),
        vector=e.embedding,
        payload={"text": t, "week": 4}
    )
    for t, e in zip(texts, embeddings)
]

client.upsert(collection_name="tds_docs", points=points)

# Search with payload filter
query_embedding = oai.embeddings.create(
    input=["what is qdrant?"], model="text-embedding-3-small"
).data[0].embedding

results = client.search(
    collection_name="tds_docs",
    query_vector=query_embedding,
    limit=3,
    query_filter=Filter(
        must=[FieldCondition(key="week", match=MatchValue(value=4))]
    )
)

for r in results:
    print(f"Score: {r.score:.3f} | {r.payload['text']}")
```

### Batch Upsert (Production Pattern)

```python
from qdrant_client.models import Batch

# Upsert 1000 points at a time — much faster
BATCH_SIZE = 100

for i in range(0, len(all_points), BATCH_SIZE):
    batch = all_points[i:i + BATCH_SIZE]
    client.upsert(collection_name="tds_docs", points=batch)
    print(f"Uploaded {min(i + BATCH_SIZE, len(all_points))}/{len(all_points)}")
```

---

## PGVector — Vector Search in PostgreSQL

If you already have Postgres, add vector search without a new service.

```bash
# Enable pgvector in Postgres
psql -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

```python
from langchain.vectorstores.pgvector import PGVector
from langchain_openai import OpenAIEmbeddings

CONNECTION_STRING = "postgresql+psycopg2://user:pass@localhost:5432/mydb"

vectorstore = PGVector.from_texts(
    texts=["pgvector integrates vector search into PostgreSQL."],
    embedding=OpenAIEmbeddings(),
    connection_string=CONNECTION_STRING,
    collection_name="tds_collection",
)

results = vectorstore.similarity_search("postgres vector search", k=3)
```

---

## Comparison: Which to Choose?

```python
def choose_vector_db(n_vectors: int, need_server: bool, existing_postgres: bool):
    if existing_postgres:
        return "PGVector — no new infra"
    if n_vectors < 100_000 and not need_server:
        return "ChromaDB — simplest for prototyping"
    if n_vectors < 10_000_000 and need_server:
        return "Qdrant — production-ready, rich filtering"
    return "FAISS — raw speed for research/batch"
```

| Criterion | FAISS | Chroma | Qdrant | PGVector |
|-----------|-------|--------|--------|----------|
| Setup complexity | Low | Very Low | Medium | Medium |
| Persistence | Manual | Built-in | Built-in | Built-in |
| Metadata filtering | No | Yes | Yes (rich) | Yes (SQL) |
| Horizontal scale | No | No | Yes | Postgres |
| Best scale | ~50M | ~10M | Billions | ~5M |
| Use case | Research | Dev/MVP | Production | Existing PG |

---

## Further Reading

- [FAISS GitHub](https://github.com/facebookresearch/faiss)
- [ChromaDB Docs](https://docs.trychroma.com/)
- [Qdrant Docs](https://qdrant.tech/documentation/)
- [pgvector GitHub](https://github.com/pgvector/pgvector)

---

