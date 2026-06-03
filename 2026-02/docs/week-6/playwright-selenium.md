# Playwright & Selenium

Modern web scraping often requires executing JavaScript. Tools like Playwright and Selenium automate real browsers.

## Playwright
Playwright is generally faster and more modern than Selenium. It supports async execution natively in Python.

```python
import asyncio
from playwright.async_api import async_playwright

async def scrape():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("https://example.com")
        
        # Wait for an element and extract text
        await page.wait_for_selector("h1")
        title = await page.inner_text("h1")
        print(title)
        
        await browser.close()

asyncio.run(scrape())
```

## Selectors
Mastering CSS selectors and XPath is critical. Prefer data attributes (like `data-testid`) when available, as class names change frequently in modern React/Vue apps.

---

