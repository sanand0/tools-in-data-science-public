## Multimodal Embeddings

Multimodal embeddings map **text** and **images** into the **same** vector space, enabling direct comparison between, say, a caption — “A cute cat” — and an image of that cat. This unified representation powers real-world applications like:

- **Cross-modal search** (e.g. “find images of a sunset” via text queries)
- **Content recommendation** (suggesting visually similar products to text descriptions)
- **Clustering & retrieval** (grouping documents and their associated graphics)
- **Anomaly detection** (spotting unusual image–text pairings)

By reducing different data types to a common numeric form, you unlock richer search, enhanced recommendations, and tighter integration of visual and textual data.

## Get API keys

Below are the steps to grab a free API key for each provider.

### Nomic Atlas

1. **Sign up** at the Nomic Atlas homepage:
   👉 [https://atlas.nomic.ai/](https://atlas.nomic.ai/) ([Atlas | Nomic Atlas Documentation][1])
2. Once logged in, open the **Dashboard** and navigate to **Settings → API Keys**.
3. Click **Create API Key**, name it, and copy the generated key.

Set in your shell:

```bash
export NOMIC_API_KEY="your-nomic-api-key"
```

### Jina AI

1. **Visit** the Jina AI Embeddings page:
   👉 [https://jina.ai/embeddings/](https://jina.ai/embeddings/) ([Jina AI][2])
2. Click **Get Started** (no credit card needed) and register for a free account. Every new key comes with **1 million free tokens**.
3. In the dashboard, go to **API Key & Billing** and copy your key.

Set in your shell:

```bash
export JINA_API_KEY="your-jina-api-key"
```

### Google Vertex AI

1. **Sign up** for Google Cloud’s free tier (90 days, \$300 credit):
   👉 [https://cloud.google.com/free](https://cloud.google.com/free) ([Google Cloud][3])
2. In the Cloud Console, open **APIs & Services → Credentials**:
   👉 [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials) ([Google Cloud][4])
3. Click **Create credentials → API key**, then copy the key.

Set in your shell:

```bash
export GOOGLE_API_KEY="your-google-api-key"
export PROJECT_ID="your-gcp-project-id"
```

## Example Requests

Below are fully-workable snippets that:

- **Embed two texts** (“A cute cat”, “A cardboard box”)
- **Embed two images** (`cat.jpg`, `box.png`)
- **Send** them to the respective API

Replace variables (`$NOMIC_API_KEY`, `$JINA_API_KEY`, `$GOOGLE_API_KEY`, `$PROJECT_ID`) before running.

### 1. Nomic Atlas

Text Embeddings

```bash
curl -X POST "https://api-atlas.nomic.ai/v1/embedding/text" \
  -H "Authorization: Bearer $NOMIC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "nomic-embed-text-v1.5",
        "task_type": "search_document",
        "texts": ["A cute cat", "A cardboard box"]
      }'
```

Image Embeddings

```bash
curl -X POST "https://api-atlas.nomic.ai/v1/embedding/image" \
  -H "Authorization: Bearer $NOMIC_API_KEY" \
  -F "model=nomic-embed-vision-v1.5" \
  -F "images=@cat.jpg" \
  -F "images=@box.png"
```

### 2. Jina AI

Jina’s unified `/v1/embeddings` endpoint accepts text strings **and** base64-encoded image bytes in one batch. ([Jina AI][2])

```bash
curl -X POST "https://api.jina.ai/v1/embeddings" \
  -H "Authorization: Bearer $JINA_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
        \"model\": \"jina-clip-v2\",
        \"input\": [
          {\"text\":\"A cute cat\"},
          {\"text\":\"A cardboard box\"},,
          {\"image\":\"$(base64 -w 0 cat.jpg)\"},
          {\"image\":\"$(base64 -w 0 box.png)\"}
        ]
      }"
```

### 3. Google Vertex AI Multimodal Embeddings

Vertex AI’s multimodal model (`multimodalembedding@001`) takes JSON instances combining text and **base64** image data. ([Google Cloud][5])

```bash
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/$PROJECT_ID/locations/us-central1/publishers/google/models/multimodalembedding@001:predict?key=$GOOGLE_API_KEY" \
  -d "{
        \"instances\": [
          {
            \"text\": \"A cute cat\",
            \"image\": {\"bytesBase64Encoded\": \"$(base64 -w 0 cat.jpg)\"}
          },
          {
            \"text\": \"A cardboard box\",
            \"image\": {\"bytesBase64Encoded\": \"$(base64 -w 0 box.png)\"}
          }
        ]
      }"
```

With these steps, you’re all set to explore and experiment with multimodal embeddings across text + image data—unifying your applications’ visual and linguistic understanding.

[1]: https://docs.nomic.ai/atlas/quick-start "Quickstart | Nomic Atlas Documentation"
[2]: https://jina.ai/embeddings/ "Embedding API - Jina AI"
[3]: https://cloud.google.com/free "Free Trial and Free Tier Services and Products - Google Cloud"
[4]: https://cloud.google.com/docs/authentication/api-keys "Manage API keys | Authentication - Google Cloud"
[5]: https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/multimodal-embeddings-api "Multimodal embeddings API | Generative AI on Vertex AI"
