# Crawl4AI

Crawl4AI is an open-source LLM-friendly web crawler that simplifies extracting structured data from unstructured web pages.

## Why Crawl4AI?
Instead of writing complex CSS selectors that break when the site updates, you pass a Pydantic schema and an LLM extracts the data for you.

## Example
```python
from crawl4ai import WebCrawler
from pydantic import BaseModel

class Product(BaseModel):
    name: str
    price: float

crawler = WebCrawler()
result = crawler.run("https://store.example.com", schema=Product)
print(result.extracted_data)
```

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

