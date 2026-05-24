# Firecrawl & Apify

When scraping at scale, managing proxies, browsers, and retries is tedious. Managed services solve this.

## Firecrawl
Firecrawl turns entire websites into clean Markdown, optimized for LLM contexts.
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Authorization: Bearer YOUR_KEY" \
  -d '{"url": "https://example.com"}'
```

## Apify
Apify is a platform for running serverless scraping scripts ("Actors"). You can find pre-built actors for Instagram, Google Maps, etc., or deploy your own Playwright scripts.