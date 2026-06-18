# Multimodal Inputs

[![Multimodal Inputs Video](https://img.youtube.com/vi/wdeZIOJjjdE/0.jpg)](https://youtu.be/wdeZIOJjjdE?si=wFK2fsXu96TbYIiL)

Modern LLMs aren't just text-in, text-out. You can send images, PDFs, and audio directly in API requests and get back rich, structured analysis. This is the foundation of document processing pipelines, visual QA, and OCR-free data extraction.

---

## How Multimodal APIs Work

The API accepts a `content` list instead of a plain string. Each item in the list is a **content block** — either text, image, or document:

```
HTTP Request:
{
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text",  "text": "What's in this image?"},
      {"type": "image", "source": {"type": "base64", "data": "..."}}
    ]
  }]
}
```

---

## Images

### From a Local File

```python
import anthropic
import base64
from pathlib import Path

def encode_image(image_path: str) -> tuple[str, str]:
    """Returns (base64_data, media_type)"""
    path = Path(image_path)
    suffix = path.suffix.lower()
    media_type_map = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
    }
    media_type = media_type_map.get(suffix, "image/jpeg")
    data = base64.standard_b64encode(path.read_bytes()).decode("utf-8")
    return data, media_type

client = anthropic.Anthropic()

def describe_image(image_path: str, question: str = "Describe this image in detail.") -> str:
    data, media_type = encode_image(image_path)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": data,
                    },
                },
                {"type": "text", "text": question},
            ],
        }],
    )
    return response.content[0].text

# Basic description
print(describe_image("photo.jpg"))

# Targeted questions
print(describe_image("chart.png", "What are the key trends shown in this chart?"))
print(describe_image("screenshot.png", "List all the text visible in this screenshot."))
print(describe_image("diagram.png", "Explain the architecture shown in this diagram."))
```

### From a URL (Using `url` source type)

```python
def analyze_image_url(url: str, question: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "url",
                        "url": url,
                    },
                },
                {"type": "text", "text": question},
            ],
        }],
    )
    return response.content[0].text

result = analyze_image_url(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/200px-ChatGPT_logo.svg.png",
    "What logo is this?"
)
```

### Multiple Images in One Request

```python
def compare_images(image_paths: list[str], comparison_question: str) -> str:
    content = []
    for i, path in enumerate(image_paths):
        data, media_type = encode_image(path)
        content.append({
            "type": "text",
            "text": f"Image {i+1}:",
        })
        content.append({
            "type": "image",
            "source": {"type": "base64", "media_type": media_type, "data": data},
        })
    content.append({"type": "text", "text": comparison_question})

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": content}],
    )
    return response.content[0].text

result = compare_images(
    ["dashboard_before.png", "dashboard_after.png"],
    "What changed between Image 1 (before) and Image 2 (after)?"
)
```

---

## PDFs (Native PDF Support)

Claude natively understands PDFs — no text extraction step needed. Send the raw PDF bytes.

```python
import base64
from pathlib import Path

def analyze_pdf(pdf_path: str, question: str) -> str:
    pdf_bytes = Path(pdf_path).read_bytes()
    pdf_data = base64.standard_b64encode(pdf_bytes).decode("utf-8")

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data,
                    },
                },
                {"type": "text", "text": question},
            ],
        }],
    )
    return response.content[0].text

# Extract structured data from a PDF
result = analyze_pdf(
    "invoice.pdf",
    "Extract: vendor name, invoice number, date, total amount. Return as JSON."
)

# Summarize a research paper
result = analyze_pdf(
    "paper.pdf",
    "Summarize: 1) What problem does this solve? 2) What's the method? 3) Key results? 4) Limitations?"
)

# Compare multiple PDFs
def compare_pdfs(pdf_paths: list[str], question: str) -> str:
    content = []
    for i, path in enumerate(pdf_paths):
        pdf_data = base64.standard_b64encode(Path(path).read_bytes()).decode("utf-8")
        content.extend([
            {"type": "text", "text": f"Document {i+1}: {Path(path).name}"},
            {
                "type": "document",
                "source": {"type": "base64", "media_type": "application/pdf", "data": pdf_data},
            },
        ])
    content.append({"type": "text", "text": question})

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": content}],
    )
    return response.content[0].text
```

---

## Structured Extraction from Images/PDFs

Combine multimodal with Instructor for typed output:

```python
import instructor
import anthropic
from pydantic import BaseModel, Field
from typing import Optional
import base64
from pathlib import Path

class InvoiceData(BaseModel):
    vendor_name: str
    invoice_number: str
    invoice_date: str
    due_date: Optional[str] = None
    subtotal: float
    tax: Optional[float] = None
    total: float
    currency: str = "INR"
    line_items: list[dict] = Field(default_factory=list)

client = instructor.from_anthropic(anthropic.Anthropic())

def extract_invoice_data(pdf_path: str) -> InvoiceData:
    pdf_data = base64.standard_b64encode(Path(pdf_path).read_bytes()).decode("utf-8")

    return client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {"type": "base64", "media_type": "application/pdf", "data": pdf_data},
                },
                {"type": "text", "text": "Extract all invoice data from this document."},
            ],
        }],
        response_model=InvoiceData,
    )

# Process a batch of invoices
invoices = [extract_invoice_data(f) for f in Path("invoices/").glob("*.pdf")]
total_spend = sum(inv.total for inv in invoices)
print(f"Processed {len(invoices)} invoices. Total: {invoices[0].currency} {total_spend:,.2f}")
```

---

## Chart and Diagram Analysis

```python
class ChartAnalysis(BaseModel):
    chart_type: str
    title: Optional[str]
    x_axis_label: Optional[str]
    y_axis_label: Optional[str]
    key_trends: list[str]
    approximate_values: dict  # e.g. {"2021": 45, "2022": 67}
    conclusion: str

def analyze_chart(image_path: str) -> ChartAnalysis:
    data, media_type = encode_image(image_path)

    client_instructor = instructor.from_anthropic(anthropic.Anthropic())
    return client_instructor.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": data}},
                {"type": "text", "text": "Analyze this chart in detail. Extract all data you can see."},
            ],
        }],
        response_model=ChartAnalysis,
    )
```

---

## Audio (via Whisper for Transcription)

The Anthropic Claude API does not directly accept audio. Use **Whisper** to transcribe audio to text first, then send to Claude:

```bash
uv add openai  # for Whisper API (or use local faster-whisper)
```

```python
import openai

whisper_client = openai.OpenAI()

def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio file using Whisper."""
    with open(audio_path, "rb") as f:
        transcription = whisper_client.audio.transcriptions.create(
            model="whisper-1",
            file=f,
            response_format="verbose_json",  # includes timestamps
            timestamp_granularities=["segment"],
        )
    return transcription.text

def transcribe_with_timestamps(audio_path: str) -> list[dict]:
    """Returns list of {start, end, text} segments."""
    with open(audio_path, "rb") as f:
        transcription = whisper_client.audio.transcriptions.create(
            model="whisper-1",
            file=f,
            response_format="verbose_json",
            timestamp_granularities=["segment"],
        )
    return [
        {"start": seg.start, "end": seg.end, "text": seg.text}
        for seg in transcription.segments
    ]

# Full pipeline: audio → transcript → analysis
def analyze_meeting(audio_path: str) -> dict:
    print("Transcribing audio...")
    segments = transcribe_with_timestamps(audio_path)
    full_transcript = " ".join(s["text"] for s in segments)

    print("Analyzing with Claude...")
    analysis = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""Analyze this meeting transcript:

{full_transcript}

Provide:
1. Key decisions made
2. Action items with owners (if mentioned)
3. Topics discussed
4. Overall sentiment"""
        }],
    )

    return {
        "transcript": full_transcript,
        "segments": segments,
        "analysis": analysis.content[0].text,
    }
```

---

## Image Size and Cost Considerations

| Image Size | Tokens Used (approx) | Recommendation |
|-----------|---------------------|----------------|
| < 256×256 | ~85 tokens | Fine as-is |
| 512×512 | ~340 tokens | Fine as-is |
| 1024×1024 | ~1,335 tokens | Resize if cost-sensitive |
| 4K (3840×2160) | ~5,000 tokens | **Always resize** |

```python
from PIL import Image
import io

def resize_image_for_api(image_path: str, max_size: int = 1024) -> tuple[bytes, str]:
    """Resize large images to save tokens."""
    with Image.open(image_path) as img:
        if max(img.size) > max_size:
            img.thumbnail((max_size, max_size), Image.LANCZOS)

        buffer = io.BytesIO()
        fmt = "JPEG" if image_path.lower().endswith(".jpg") else "PNG"
        img.save(buffer, format=fmt, quality=85)
        return buffer.getvalue(), f"image/{fmt.lower()}"
```

---

## Summary

| Input Type | How to Send | API field |
|-----------|------------|-----------|
| Local image | base64 encode | `type: image, source: {type: base64}` |
| Remote image | URL | `type: image, source: {type: url}` |
| PDF | base64 encode | `type: document, source: {type: base64}` |
| Audio | Transcribe with Whisper first | `type: text` (text transcript) |
| Multiple files | List of content blocks | content: [{}, {}, {}] |

---

