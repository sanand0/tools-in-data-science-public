# Multimodal Input in Pydantic AI

Modern LLMs can understand **images, audio, video, and documents** in addition to text.

***

## Image Input

**Two methods:** Use URL or local file.

### Method 1: From URL

```python
from dotenv import load_dotenv
load_dotenv()
from pydantic_ai import Agent, ImageUrl

agent = Agent(model='openai:gpt-5-nano')

result = agent.run_sync(
    [
        'What company is this logo from?',
        ImageUrl(url='https://images.moneycontrol.com/static-mcnews/2024/02/rbi.jpeg?impolicy=website&width=770&height=431')
    ]
)

print(result.output)
# Output: Reserve Bank of India (RBI) — the central bank of India.
```


### Method 2: From Local File

```python
from dotenv import load_dotenv
load_dotenv()
from pathlib import Path
from pydantic_ai import Agent, BinaryContent

# Read local image
image_data = Path('rbi.png').read_bytes()

agent = Agent(model='openai:gpt-5-nano')

result = agent.run_sync(
    [
        'What company is this logo from?',
        BinaryContent(data=image_data, media_type='image/png')
    ]
)

print(result.output)
# Output: The Reserve Bank of India (RBI).
```

**Key points:**

- Use `ImageUrl` for web images
- Use `BinaryContent` for local files
- Specify correct `media_type` (e.g., 'image/png', 'image/jpeg')

***

## Audio/Video/Document Input

Works the **same way** as images.

```python
from pydantic_ai import Agent, AudioUrl, ImageUrl

AudioUrl(url='https://example.com/audio.mp3')
VideoUrl(url='https://example.com/video.mp4')
DocumentUrl(url='https://example.com/paper.pdf')

from pathlib import Path
from pydantic_ai import Agent, BinaryContent
pdf_data = Path('report.pdf').read_bytes()

BinaryContent(data=video_data, media_type='video/mp4')
BinaryContent(data=audio_data, media_type='audio/mpeg')
BinaryContent(data=pdf_data, media_type='application/pdf')
```

## Multiple Inputs

You can pass **multiple files** in a single request.

```python
from dotenv import load_dotenv
load_dotenv()
from pathlib import Path
from pydantic_ai import Agent, ImageUrl, DocumentUrl

agent = Agent(model='openai:gpt-5-nano')

result = agent.run_sync(
    [
        'Compare the logo in the image with the company name in the PDF',
        ImageUrl(url='https://images.moneycontrol.com/static-mcnews/2024/02/rbi.jpeg?impolicy=website&width=770&height=431'),
        DocumentUrl(url='https://morth.nic.in/sites/default/files/dd12-13_0.pdf')
    ]
)

print(result.output)

'''
- Logo in the image: Reserve Bank of India (RBI) emblem — circular orange seal with a tiger and a palm tree, text around the edge in English and Hindi: “RESERVE BANK OF INDIA” / “भारतीय रिज़र्व बैंक”.

- Company name in the PDF: The page text shown is “Dummy PDF file” (no actual company name is present).

Conclusion: The RBI logo does not match the company name shown in the PDF. The PDF appears to be a placeholder with no real company name. If you provide the correct PDF or specify the expected company name, I can re-check.
'''
```


***

## URL Download Behavior

**Default:** Pydantic AI downloads file content from URLs and sends it to the model.

**Exceptions:**

- **Anthropic:** PDFs via `DocumentUrl` are sent as URLs (not downloaded)
- **Google Vertex AI:** All URLs sent directly (not downloaded)
- **Google GLA:** YouTube URLs sent directly


### Force Download

If the model **can't access a URL**, force local download:

```python
from pydantic_ai import Agent, ImageUrl

agent = Agent(model='google-gla:gemini-2.5-flash')

result = agent.run_sync(
    [
        'Describe this image',
        ImageUrl(url='https://private-site.com/image.png', force_download=True)
    ]
)
```

Setting `force_download=True` makes Pydantic AI download the file first.

***

## Summary Table

| Input Type | URL Class | BinaryContent | Media Type Example |
| :-- | :-- | :-- | :-- |
| Image | `ImageUrl` | Supported | `image/png`, `image/jpeg` |
| Audio | `AudioUrl` | Supported | `audio/mpeg`, `audio/wav` |
| Video | `VideoUrl` | Supported | `video/mp4`, `video/avi` |
| Document | `DocumentUrl` | Supported | `application/pdf` |



***

## Key Takeaways

1. **Two options:** URL-based or local file-based input
2. **Use BinaryContent** for local files with correct `media_type`
3. **Model support varies** → Check model documentation first
4. **Multiple files** can be passed in one request
5. **Download behavior** differs by provider