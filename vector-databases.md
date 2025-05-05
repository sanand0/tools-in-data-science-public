## Vector Databases

Vector databases are specialized databases that store and search vector embeddings efficiently.

Use vector databases when your embeddings exceed available memory or when you want it run fast at scale. (This is important. If your code runs fast and fits in memory, you **DON'T** need a vector database. You can can use `numpy` for these tasks.)

Vector databases are an evolving space.

The first generation of vector databases were written in C and typically used an algorithm called [HNSW](https://en.wikipedia.org/wiki/Hierarchical_navigable_small_world) (a way to approximately find the nearest neighbor). Some popular ones are:

- **[chroma 19,637 ⭐ May 2025](https://github.com/chroma-core/chroma)**
- **[qdrant 23,341 ⭐ May 2025](https://github.com/qdrant/qdrant)**
- **[lancedb 6,327 ⭐ May 2025](https://github.com/lancedb/lancedb)**
- **[faiss 34,684 ⭐ May 2025](https://github.com/facebookresearch/faiss)**
- **[milvus 34,476 ⭐ May 2025](https://github.com/milvus-io/milvus)**
- **[weaviate 13,222 ⭐ May 2025](https://github.com/weaviate/weaviate)**

In addition, most relational databases now support vector search. For example:

- **[DuckDB](https://duckdb.org/)**: Supports vector search with [`vss`](https://duckdb.org/docs/extensions/vss.html).
- **[SQLite](https://www.sqlite.org/)**: Supports vector search with [`sqlite-vec`](https://github.com/asg017/sqlite-vec).
- **[PostgreSQL](https://www.postgresql.org/)**: Supports vector search with [`pgvector`](https://github.com/pgvector/pgvector).

Take a look at this [Vector DB Comparison](https://superlinked.com/vector-db-comparison).

Watch this Vector Database Tutorial (3 min):

[![Vector databases are so hot right now. WTF are they? (3 min)](https://i.ytimg.com/vi/klTvEwg3oJ4/sddefault.jpg)](https://youtu.be/klTvEwg3oJ4)

### ChromaDB

Here's a minimal example using Chroma:

```python
# /// script
# requires-python = "==3.12"
# dependencies = [
#   "chromadb",
#   "sentence-transformers",
# ]
# ///

import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer

async def setup_vector_db():
    """Initialize Chroma DB with an embedding function."""
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="BAAI/bge-base-en-v1.5"
    )
    client = chromadb.PersistentClient(path="./vector_db")
    collection = client.create_collection(
        name="documents",
        embedding_function=sentence_transformer_ef
    )
    return collection

async def search_similar(collection, query: str, n_results: int = 3) -> list[dict]:
    """Search for documents similar to the query."""
    d = collection.query(query_texts=[query], n_results=n_results)
    return [
        {"id": id, "text": text, "distance": distance}
        for id, text, distance in zip(d["ids"][0], d["documents"][0], d["distances"][0])
    ]

async def main():
    collection = await setup_vector_db()

    # Add some documents
    collection.add(
        documents=["Apple is a fruit", "Orange is citrus", "Computer is electronic"],
        ids=["1", "2", "3"]
    )

    # Search
    results = await search_similar(collection, "fruit")
    print(results)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

### LanceDB

Here's the same example using LanceDB:

```python
# /// script
# requires-python = "==3.12"
# dependencies = [
#   "lancedb",
#   "pyarrow",
#   "sentence-transformers",
# ]
# ///

import lancedb
import pyarrow as pa
from sentence_transformers import SentenceTransformer

async def setup_vector_db():
    """Initialize LanceDB with an embedding function."""
    model = SentenceTransformer("BAAI/bge-base-en-v1.5")
    db = lancedb.connect("./vector_db")

    # Create table with schema for documents
    table = db.create_table(
        "documents",
        schema=pa.schema([
            pa.field("id", pa.string()),
            pa.field("text", pa.string()),
            pa.field("vector", pa.list_(pa.float32(), list_size=768))
        ])
    )
    return table, model

async def search_similar(table, model, query: str, n_results: int = 3) -> list[dict]:
    """Search for documents similar to the query."""
    query_embedding = model.encode(query)
    results = table.search(query_embedding).limit(n_results).to_list()
    return [{"id": r["id"], "text": r["text"], "distance": float(r["_distance"])} for r in results]

async def main():
    table, model = await setup_vector_db()

    # Add some documents
    documents = ["Apple is a fruit", "Orange is citrus", "Computer is electronic"]
    embeddings = model.encode(documents)

    table.add(data=[
        {"id": str(i), "text": text, "vector": embedding}
        for i, (text, embedding) in enumerate(zip(documents, embeddings), 1)
    ])

    # Search
    results = await search_similar(table, model, "fruit")
    print(results)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

### DuckDB

Here's the same example using DuckDB:

```python
# /// script
# requires-python = "==3.12"
# dependencies = [
#   "duckdb",
#   "sentence-transformers",
# ]
# ///

import duckdb
from sentence_transformers import SentenceTransformer

async def setup_vector_db() -> tuple[duckdb.DuckDBPyConnection, SentenceTransformer]:
    """Initialize DuckDB with VSS extension and embedding model."""
    # Initialize model
    model = SentenceTransformer("BAAI/bge-base-en-v1.5")
    vector_dim = model.get_sentence_embedding_dimension()

    # Setup DuckDB with VSS extension
    conn = duckdb.connect(":memory:")
    conn.install_extension("vss")
    conn.load_extension("vss")

    # Create table with vector column
    conn.execute(f"""
        CREATE TABLE documents (
            id VARCHAR,
            text VARCHAR,
            vector FLOAT[{vector_dim}]
        )
    """)

    # Create HNSW index for vector similarity search
    conn.execute("CREATE INDEX vector_idx ON documents USING HNSW (vector)")
    return conn, model

async def search_similar(conn: duckdb.DuckDBPyConnection, model: SentenceTransformer,
                        query: str, n_results: int = 3) -> list[dict]:
    """Search for documents similar to query using vector similarity."""
    # Encode query to vector
    query_vector = model.encode(query).tolist()

    # Search using HNSW index with explicit FLOAT[] cast
    results = conn.execute("""
        SELECT id, text, array_distance(vector, CAST(? AS FLOAT[768])) as distance
        FROM documents
        ORDER BY array_distance(vector, CAST(? AS FLOAT[768]))
        LIMIT ?
    """, [query_vector, query_vector, n_results]).fetchall()

    return [{"id": r[0], "text": r[1], "distance": float(r[2])} for r in results]

async def main():
    conn, model = await setup_vector_db()

    # Add sample documents
    documents = ["Apple is a fruit", "Orange is citrus", "Computer is electronic"]
    embeddings = model.encode(documents).tolist()

    # Insert documents and vectors
    conn.executemany("""
        INSERT INTO documents (id, text, vector)
        VALUES (?, ?, ?)
    """, [(str(i), text, embedding)
          for i, (text, embedding) in enumerate(zip(documents, embeddings), 1)])

    # Search similar documents
    results = await search_similar(conn, model, "fruit")
    print(results)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```
