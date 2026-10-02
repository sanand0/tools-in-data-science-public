## Hybrid Retrieval Augmented Generation (Hybrid RAG) with TypeSense

Hybrid RAG combines semantic (vector) search with traditional keyword search to improve retrieval accuracy and relevance. By mixing exact text matches with embedding-based similarity, you get the best of both worlds: precision when keywords are present, and semantic recall when phrasing varies. [TypeSense](https://typesense.org/) makes this easy with built-in hybrid search and automatic embedding generation.

Below is a fully self-contained Hybrid RAG tutorial using TypeSense, Python, and the command line.

### Install and run TypeSense

[Install TypeSense](https://typesense.org/docs/guide/install-typesense.html).

```bash
mkdir typesense-data

docker run -p 8108:8108 \
  -v typesense-data:/data typesense/typesense:28.0 \
  --data-dir /data \
  --api-key=secret-key \
  --enable-cors
```

- **`docker run`**: spins up a containerized TypeSense server on port 8108
  - `-p 8108:8108` maps host port to container port.
  - `-v typesense-data:/data` mounts a Docker volume for persistence.
  - `--data-dir /data` points TypeSense at that volume.
  - `--api-key=secret-key` secures your API.
  - `--enable-cors` allows browser-based requests.

**Expected output:**

- Docker logs showing TypeSense startup messages, such as `Started Typesense API server`.
- Listening on `http://0.0.0.0:8108`.

### Embed and import documents into TypeSense

Follow the steps in the [RAG with the CLI](rag-cli.md) tutorial to create a `chunks.json` that has one `{id, content}` JSON object per line.

[TypeSense supports automatic embedding of documents](https://typesense.org/docs/28.0/api/vector-search.html#option-b-auto-embedding-generation-within-typesense). We'll use that capability.

Save the following as `addnotes.py` and run it with `uv run addnotes.py`.

```python
# /// script
# requires-python = ">=3.13"
# dependencies = ["httpx"]
# ///
import json
import httpx
import os

headers = {"X-TYPESENSE-API-KEY": "secret-key"}

schema = {
    "name": "notes",
    "fields": [
        {"name": "id", "type": "string", "facet": False},
        {"name": "content", "type": "string", "facet": False},
        {
            "name": "embedding",
            "type": "float[]",
            "embed": {
                "from": ["content"],
                "model_config": {
                    "model_name": "openai/text-embedding-3-small",
                    "api_key": os.getenv("OPENAI_API_KEY"),
                },
            },
        },
    ],
}

with open("chunks.json", "r") as f:
    chunks = [json.loads(line) for line in f.readlines()]

with httpx.Client() as client:
    # Create the collection
    if client.get(f"http://localhost:8108/collections/notes", headers=headers).status_code == 404:
        r = client.post("http://localhost:8108/collections", json=schema, headers=headers)

    # Embed the chunks
    result = client.post(
        "http://localhost:8108/collections/notes/documents/import?action=emplace",
        headers={**headers, "Content-Type": "text/plain"},
        data="\n".join(json.dumps(chunk) for chunk in chunks),
    )
    print(result.text)
```

- **`httpx.Client`**: an HTTP client for Python.
- **Collection schema**: `id` and `content` fields plus an `embedding` field with auto-generated embeddings from OpenAI.
- **Auto-embedding**: the `embed` block instructs TypeSense to call the specified model for each document.
- **`GET /collections/notes`**: checks existence.
- **`POST /collections`**: creates the collection.
- **`POST /collections/notes/documents/import?action=emplace`**: bulk upsert documents, embedding them on the fly.

**Expected output:**

- A JSON summary string like `{"success": X, "failed": 0}` indicating how many docs were imported.
- (On timeouts, re-run until all chunks are processed.)

### 4. Run a hybrid search and answer a question

Now, we can use a single `curl` against the Multi-Search endpoint to combine keyword and vector search as a [hybrid search](https://typesense.org/docs/28.0/api/vector-search.html#hybrid-search):

```bash
Q="What does the author affectionately call the => syntax?"

payload=$(jq -n --arg coll "notes" --arg q "$Q" \
  '{
     searches: [
       {
         collection: $coll,
         q:           $q,
         query_by:    "content,embedding",
         sort_by:     "_text_match:desc",
         prefix:      false,
         exclude_fields: "embedding"
       }
     ]
   }'
)
curl -s 'http://localhost:8108/multi_search' \
  -H "X-TYPESENSE-API-KEY: secret-key" \
  -d "$payload" \
  | jq -r '.results[].hits[].document.content' \
  | llm -s "${Q} - \$Answer ONLY from these notes. Cite verbatim from the notes." \
  | uvx streamdown
```

- **`query_by: "content,embedding"`**: tells TypeSense to score by both keyword and vector similarity.
- **`sort_by: "_text_match:desc"`**: boosts exact text hits.
- **`exclude_fields: "embedding"`**: keeps responses lightweight.
- **`curl -d`**: posts the search request.
- **`jq -r`**: extracts each hit’s `content`. See [jq manual](https://stedolan.github.io/jq/manual/)
- **`llm -s`** and **`uvx streamdown`**: generate and stream a grounded answer.

**Expected output:**

- The raw matched snippets printed first.
- Then a concise, streamed LLM answer citing the note verbatim.
