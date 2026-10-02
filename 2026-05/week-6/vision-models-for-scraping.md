# Vision Models for Scraping

> **When the data is a chart, a scanned table, or a UI built to defeat parsing — screenshot it and ask a vision model for JSON.**

⏱ ~8 min read · ~15 min hands-on
🔗 needs: [Playwright & Selenium](/2026-05/week-6/playwright-selenium/) · [Structured Output](/2026-05/week-3/structured-output/)

Some data simply isn't in the DOM: values baked into an image, a canvas-rendered chart, a scanned PDF page, or a deliberately obfuscated layout. A vision-language model (VLM) reads the *rendered pixels* the way a person would.

It's the **last** resort — slower and costlier than [a hidden API](/2026-05/week-6/hidden-json-apis/) or [HTML parsing](/2026-05/week-6/html-to-markdown/) — but it works where everything else fails.

## Try it in 5 minutes — screenshot → JSON

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["playwright>=1.40"]
# ///
"""Screenshot one element, ready to hand to a vision model.

Setup: uv run --with playwright playwright install chromium
Run:   uv run shot.py
"""

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto("https://books.toscrape.com/")
    page.wait_for_selector(".product_pod")

    # Crop to just the region that matters — fewer tokens, better accuracy.
    page.query_selector(".product_pod").screenshot(path="element.png")
    print("Saved element.png")
    browser.close()
```

✅ Now send `element.png` to any vision model with a strict prompt:

> Extract the book title, price, and star rating from this image. Return **only** JSON matching `{"title": str, "price": str, "rating": int}`.

## Choosing a model

| Model | Why you'd pick it |
|---|---|
| **[Qwen3-VL](https://github.com/QwenLM/Qwen3-VL)** | The leading open-weight VLM family in 2026 — strong OCR (32 languages), documents, forms, multiple sizes |
| **InternVL3** | Strongest MIT-licensed option; permissive for commercial work |
| **DeepSeek-VL2** | Excellent OCR/document understanding at low compute |
| **Hosted (Claude, Gemini, GPT)** | Best accuracy with zero setup; you send the image to a third party |

Run open weights locally via [Ollama](/2026-05/week-2/11-local-llms-2-lmstudio-ollama/) when the images are sensitive or the volume makes API pricing hurt.

## Make the output trustworthy

VLMs hallucinate confidently — a misread digit looks exactly like a correct one. Three defences:

1. **Force a schema.** Demand JSON and validate it — [Structured Output](/2026-05/week-3/structured-output/). A parse failure is a signal.
2. **Crop tightly.** One element per image beats a full-page screenshot for both cost and accuracy.
3. **Verify what you can.** Do the line items sum to the stated total? Is the date plausible? Cross-check a sample by hand.

> ⚖️ Screenshotting doesn't change permissions. The rules that govern scraping the page govern the pixels too — [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/).

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| Numbers subtly wrong | Low resolution | Screenshot at `device_scale_factor=2`; crop tighter |
| Model invents fields | Vague prompt | Give an explicit schema; say "return null if absent" |
| Output isn't valid JSON | No format constraint | Use structured output / JSON mode; retry on parse failure |
| Costs explode | Full-page images every time | Crop; cache by image hash; try HTML first |
| Rotated/skewed scans | Not deskewed | Pre-process → [Image Processing Pipeline](/2026-05/week-6/image-processing-pipeline/) |

## Your turn (≈15 min)

1. Run `shot.py`, then ask a vision model for `{"title","price","rating"}` JSON. Compare against the real HTML.
2. Re-shoot at `device_scale_factor=2` and see whether accuracy improves.
3. Try a full-page screenshot instead of the cropped element — note the accuracy and cost difference.
4. Write a validator that rejects any response missing a key or with `rating` outside 1–5.

## Checklist

- [ ] I try hidden APIs and HTML parsing before reaching for pixels.
- [ ] I can screenshot a single element with Playwright.
- [ ] I always demand a schema and validate the JSON.
- [ ] I crop tightly to cut tokens and raise accuracy.
- [ ] I know when to run open weights locally instead of a hosted API.

## Go deeper

- [Qwen3-VL](https://github.com/QwenLM/Qwen3-VL) — the leading open-weight vision family.
- [Playwright screenshots](https://playwright.dev/python/docs/screenshots) — element, full-page, and scale options.
- [Structured Output (Week 3)](/2026-05/week-3/structured-output/) — making model output parseable by construction.

<!-- SOURCES: https://github.com/QwenLM/Qwen3-VL , https://playwright.dev/python/docs/screenshots , https://books.toscrape.com/ -->
