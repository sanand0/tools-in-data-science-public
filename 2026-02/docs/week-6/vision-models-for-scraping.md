# Vision Models for Scraping

Sometimes data is in an image, a chart, or a highly obfuscated UI where DOM parsing fails.

## Visual Extraction
Pass a screenshot to a Vision-Language Model (VLM) and ask it to extract the data into JSON.

## Open Weights Models
- **MoonDream:** Tiny (1.6B parameters), runs on CPU, great for simple OCR and answering basic questions about images.
- **LLaVA:** Excellent open-source vision model.
- **Gemma 2 2B IT / Gemma4V:** Google's lightweight multimodal models.

## Workflow
1. Playwright takes a screenshot of the target element.
2. Send image to VLM with prompt: `Extract the pricing tiers from this image as JSON.`
3. Parse the output.