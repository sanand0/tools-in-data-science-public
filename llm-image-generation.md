## Gemini Flash Experimental Image Generation and Editing APIs

In March 2025, Google introduced native image generation and editing capabilities in the Gemini 2.0 Flash Experimental model. You can now generate and iteratively edit images via a single REST endpoint ([Experiment with Gemini 2.0 Flash native image generation](https://developers.googleblog.com/en/experiment-with-gemini-20-flash-native-image-generation/?utm_source=chatgpt.com), [Generate images | Gemini API | Google AI for Developers](https://ai.google.dev/gemini-api/docs/image-generation?utm_source=chatgpt.com)).

[![How to use Latest Gemini 2.0 Native Image Generation with API? (9 min)](https://i.ytimg.com/vi_webp/wgs4UYx6quY/sddefault.webp)](https://youtu.be/wgs4UYx6quY) ([How to use Latest Gemini 2.0 Native Image Generation with API?](https://www.youtube.com/watch?v=wgs4UYx6quY&utm_source=chatgpt.com))

### 1. Simple image generation

To generate a basic image, send a POST request to the `generateContent` method:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "contents": [{ "parts": [{ "text": "A serene landscape of rolling hills at sunrise, digital art" }] }],
    "generationConfig": { "responseModalities": ["TEXT", "IMAGE"] }
  }'
```

Replace `$GEMINI_API_KEY` with your key. ([Gemini API | Google AI for Developers](https://ai.google.dev/gemini-api/docs?utm_source=chatgpt.com))

### 2. Generation options

You can tweak the output with these `generationConfig` parameters:

- `responseModalities`: Modalities to return (`TEXT`, `IMAGE`).
- `temperature` (0.0–2.0): Controls randomness (default 1.0).
- `topP` (0.0–1.0): Nucleus sampling threshold.
- `topK`: Token selection cutoff.
- `candidateCount`: Number of image/text variations.
- `maxOutputTokens`: Max tokens for text parts.
- `stopSequences`: Sequences to end generation.
- `seed`: For reproducibility.
- `responseMimeType`: Output format (`image/png`, `image/jpeg`).

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "contents": [
      { "parts": [{ "text": "A futuristic city skyline at dusk, neon lights" }] }
    ],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "temperature": 0.7,
      "topP": 0.9,
      "maxOutputTokens": 1024,
      "candidateCount": 3,
      "responseMimeType": "image/png"
    }
  }'
```

([Generate content with the Gemini API in Vertex AI  |  Generative AI on Vertex AI  |  Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference))

### 3. Simple image editing

To edit an existing image, include it in the `contents` as `inlineData` (base64-encoded):

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "inlineData": {
              "mimeType": "image/png",
              "data": "<BASE64_IMAGE_DATA>"
            }
          }
        ]
      },
      {
        "parts": [
          { "text": "Replace the background with a starry night sky" }
        ]
      }
    ],
    "generationConfig": {
      "responseModalities": ["TEXT", "IMAGE"],
      "temperature": 0.5
    }
  }'
```

Here `<BASE64_IMAGE_DATA>` is your image encoded to base64. ([Generate content with the Gemini API in Vertex AI  |  Generative AI on Vertex AI  |  Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference))

### 4. Editing options

Editing requests support:

- `inlineData`: Embed raw image bytes.
- `fileData`: Reference public URLs.
- All `generationConfig` options listed above.
- `safetySettings`: Per-request safety rules.
- Multi-turn edits by repeating `contents` in conversation history.

### 5. Costs and optimization

Gemini 2.0 Flash Experimental uses token-based billing:

- **Input** (text/image/video): free tier, then $0.10 per 1M tokens.
- **Output** (text/image): free tier, then $0.40 per 1M tokens.
- **Per-image flat cost** for Pro models: ~$0.001315 /image ([Gemini Developer API Pricing | Gemini API | Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing?utm_source=chatgpt.com), [Solved: Re: Outdated Gemini Pro image pricing? By tile, or...](https://www.googlecloudcommunity.com/gc/AI-ML/Outdated-Gemini-Pro-image-pricing-By-tile-or-by-image/m-p/813755?utm_source=chatgpt.com)).

To optimize:

- Use smaller image sizes by setting `responseMimeType`.
- Cache or reuse prompts with `cachedContent`.
- Lower `candidateCount` or `temperature` for fewer tokens.

## OpenAI gpt-image-1 Model for Image Generation and Editing

OpenAI’s GPT Image 1 (`gpt-image-1`) is a state-of-the-art multimodal model released on April 23, 2025, for high-fidelity image creation and editing ([GPT-4o](https://en.wikipedia.org/wiki/GPT-4o?utm_source=chatgpt.com)).

[![OpenAI’s New GPT Image Model API in 5 Minutes (5 min)](https://i.ytimg.com/vi_webp/k-G71JZA75A/sddefault.webp)](https://youtu.be/k-G71JZA75A) ([OpenAI's New GPT Image Model API in 5 Minutes - YouTube](https://www.youtube.com/watch?v=k-G71JZA75A&utm_source=chatgpt.com))

### 1. Simple image generation

Use the Image Generations endpoint:

```bash
curl --location 'https://api.openai.com/v1/images/generations' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer $OPENAI_API_KEY' \
  --data '{
    "model": "gpt-image-1",
    "prompt": "A whimsical illustration of a cat playing chess",
    "n": 1,
    "size": "1024x1024"
  }'
```

([Generate Image | OpenAI API - Postman](https://www.postman.com/devrel/openai/request/riub8s3/generate-image?utm_source=chatgpt.com))

### 2. Generation options

Adjust these JSON parameters:

- `model`: `gpt-image-1` (default).
- `prompt`: Text description.
- `n`: Number of images.
- `size`: `256x256`, `512x512`, or `1024x1024`.
- `response_format`: `"url"` (default) or `"b64_json"`.

```json
{
  "model": "gpt-image-1",
  "prompt": "...",
  "n": 2,
  "size": "512x512",
  "response_format": "b64_json"
}
```

### 3. Simple image editing

Use the Edits endpoint with an image and a mask:

```bash
curl https://api.openai.com/v1/images/edits \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-image-1",
    "image": "data:image/png;base64,<BASE64_IMAGE>",
    "mask": "data:image/png;base64,<BASE64_MASK>",
    "prompt": "Add a rainbow in the sky above the mountains",
    "n": 1,
    "size": "1024x1024"
  }'
```

([curl - What's the correct URL to test OpenAI API? - Stack Overflow](https://stackoverflow.com/questions/75041247/whats-the-correct-url-to-test-openai-api?utm_source=chatgpt.com))

### 4. Editing options

Editing requests accept:

- `image`: Original image (base64 or URL).
- `mask`: PNG mask for inpainting.
- `prompt`: Instruction for the edit.
- `n`, `size`, `response_format` as above.
- Optional `user` field for attribution.

### 5. Costs and optimization

GPT Image 1 pricing (per 1M tokens): text input $5, image input $10, image output $40. Rough per-image costs:

- Low quality: ~$0.02
- Medium quality: ~$0.07
- High quality: ~$0.19 ([OpenAI's GPT-Image-1 API — Create Stunning Images for Your Apps!](https://medium.com/h7w/openais-gpt-image-1-api-create-stunning-images-for-your-apps-902c4f6745b1?utm_source=chatgpt.com), [Usage of gpt-image-1 is priced per token, with ... - Hacker News](https://news.ycombinator.com/item?id=43787769&utm_source=chatgpt.com))

To optimize:

- Choose smaller sizes (`256x256`).
- Generate fewer images (`n:1`).
- Use `response_format:"url"` to reduce payload.
- Cache frequent prompts or images.
