# Multimodal Embeddings

> Text-only RAG misses 80% of real-world documents — PDFs with charts, tables, figures. Multimodal embeddings fix that.

---

## The Problem with Text-Only RAG

Standard RAG pipeline:
1. Parse PDF → extract text → chunk text → embed text
2. Lost: tables, diagrams, headers in images, scanned pages

**Multimodal embedding** treats the document as an **image** — no text extraction needed.

---

## CLIP — Connecting Text and Images

CLIP (OpenAI) embeds images and text into the **same vector space**. You can query with text and retrieve images, or vice versa.

```bash
uv add transformers torch Pillow
```

```python
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import requests

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Load an image
image = Image.open("diagram.png")

# Embed image and texts in same space
texts = [
    "A diagram showing RAG pipeline architecture",
    "A photo of a cat",
    "A table of database comparison metrics",
]

inputs = processor(
    text=texts,
    images=image,
    return_tensors="pt",
    padding=True
)

with torch.no_grad():
    outputs = model(**inputs)

# Similarities: which text matches the image?
logits_per_image = outputs.logits_per_image
probs = logits_per_image.softmax(dim=1)

for text, prob in zip(texts, probs[0]):
    print(f"{prob:.3f} — {text}")
```

---

## ColPali — Document-as-Image RAG

ColPali (from Hugging Face) treats each **PDF page as an image**, embeds it with a vision-language model, and retrieves at the page level using late interaction (like ColBERT).

No text parsing. No chunking. No OCR errors.

```bash
uv add colpali-engine byaldi Pillow
```

```python
from byaldi import RAGMultiModalModel
from pdf2image import convert_from_path

# Load ColPali model
RAG = RAGMultiModalModel.from_pretrained("vidore/colpali-v1.2")

# Index a PDF (converts pages to images internally)
RAG.index(
    input_path="technical_report.pdf",
    index_name="my_doc_index",
    store_collection_with_index=True,  # store page images for display
    overwrite=True,
)

# Query with natural language
results = RAG.search("Show me the architecture diagram", k=3)

for result in results:
    print(f"Page {result['page_num']}: score {result['score']:.4f}")
    # result['base64'] contains the page image if store_collection_with_index=True
```

### Display Retrieved Pages in Streamlit

```python
import streamlit as st
import base64
from io import BytesIO
from PIL import Image

def display_colpali_result(result):
    """Display a retrieved PDF page."""
    if result.get("base64"):
        img_data = base64.b64decode(result["base64"])
        img = Image.open(BytesIO(img_data))
        st.image(img, caption=f"Page {result['page_num']} (score: {result['score']:.3f})")
```

---

## OpenAI Vision for Document Q&A

For targeted extraction from specific pages:

```python
import base64
from openai import OpenAI
from pdf2image import convert_from_path

client = OpenAI()

def pdf_page_to_base64(pdf_path: str, page_num: int) -> str:
    """Convert a PDF page to base64 JPEG."""
    pages = convert_from_path(pdf_path, first_page=page_num, last_page=page_num)
    img = pages[0]
    from io import BytesIO
    buf = BytesIO()
    img.save(buf, format="JPEG")
    return base64.b64encode(buf.getvalue()).decode()

def ask_about_page(pdf_path: str, page_num: int, question: str) -> str:
    """Ask a question about a specific PDF page using vision."""
    img_b64 = pdf_page_to_base64(pdf_path, page_num)
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{img_b64}",
                            "detail": "high"
                        }
                    },
                    {"type": "text", "text": question}
                ]
            }
        ],
        max_tokens=500,
    )
    
    return response.choices[0].message.content

# Usage
answer = ask_about_page("report.pdf", page_num=5, question="What does the chart on this page show?")
print(answer)
```

---

## Choosing Your Approach

| Scenario | Approach |
|----------|----------|
| Text-heavy PDFs, good OCR | Standard text RAG (chunking + embeddings) |
| PDFs with charts/figures | ColPali (page-as-image) |
| Text + image search across corpus | CLIP embeddings |
| Single page deep analysis | GPT-4o Vision direct call |

---

## Further Reading

- [ColPali Paper](https://arxiv.org/abs/2407.01449)
- [Byaldi (ColPali wrapper)](https://github.com/AnswerDotAI/byaldi)
- [CLIP Paper — Radford et al.](https://arxiv.org/abs/2103.00020)

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

