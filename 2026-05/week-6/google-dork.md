# Google Dorking

> **Turn a search box into a precision data-sourcing tool — find the exact files and datasets you need, then automate it into a reproducible pipeline.**

⏱ ~9 min read · ~15 min hands-on
🔗 needs: [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/) · [Hidden JSON APIs](/2026-05/week-6/hidden-json-apis/)

"Dorking" is just using search operators well. The same operators that find a public dataset in seconds also reveal what an organisation has *accidentally* left indexed — so this is both a sourcing skill and the first move in a footprint audit. Here we focus on **sourcing + automation**; the defensive exposure-hunting side is [Week 7 → Dorking for Recon](/2026-05/week-7/dorking-recon/).

> ⚖️ Use exposure-style dorks **only against domains you own or are authorised to audit**. Running "find exposed files" patterns against strangers can be illegal and is never a course exercise. See [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/).

## Try it in 5 minutes — compose a query

No code needed. Paste these into a normal Google search box and watch the web collapse to exactly what you want:

- `site:data.gov.in filetype:csv "air quality"`
- `site:*.edu filetype:pdf "machine learning" after:2024`
- `intitle:"index of" "dataset"` — auto-generated directory listings
- `("annual report" OR "10-K") filetype:pdf site:company.com`

✅ You just filtered billions of pages down to a handful of the right files. Operators compose like SQL `WHERE` clauses — start broad, then layer.

## The operator toolkit

| Operator | Use |
|---|---|
| `site:` | Restrict to a domain, subdomain, or TLD (`site:.gov.in`) |
| `filetype:` | Only indexed files of a type (`csv`, `pdf`, `xlsx`, `json`) |
| `inurl:` | Require a token in the URL (`inurl:download`, `inurl:api`) |
| `intext:` | Require a token in the page body |
| `intitle:` | Require a token in the HTML title |
| `before:` / `after:` | Date-bound results (`after:2024-01-01`) |
| `-` (minus) | Exclude a term or site (`-site:pinterest.com`) |
| `OR` | Match either alternative (uppercase) |
| `"..."` | Exact phrase |
| `*` | Wildcard for unknown word(s) inside a phrase |

No space after the operator: `site:nytimes.com`, not `site: nytimes.com`.

## Automate it into a dataset

Manual clicking doesn't scale, and **scraping Google's results page directly violates its Terms** and gets you CAPTCHA'd fast. Use a search API that returns clean JSON:

| Service | Note |
|---|---|
| [SerpAPI](https://serpapi.com/search-api) | Accepts real Google-style queries (`site:`, `filetype:`…) → structured JSON |
| [Brave Search API](https://brave.com/search/api/) | Independent index, simple REST, open to new users |
| [Exa](https://exa.ai/docs/reference/search) | Neural/semantic search — great for "find similar documents" |
| [Google Programmable Search (Custom Search JSON API)](https://developers.google.com/custom-search/v1/overview) | **Legacy:** closed to new customers and **shut down on 1 Jan 2027**. Existing keys only; Vertex AI Search is Google's successor. |

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28"]
# ///
"""Run a 'dork' through the Brave Search API and get structured JSON.

Get a free key at https://api-dashboard.search.brave.com/ then:
  export BRAVE_API_KEY=...
  uv run dork_api.py 'site:data.gov.in filetype:csv air quality'
"""

import os
import sys
import httpx

query = sys.argv[1] if len(sys.argv) > 1 else 'site:data.gov.in filetype:csv "air quality"'

r = httpx.get(
    "https://api.search.brave.com/res/v1/web/search",
    params={"q": query, "count": 20},
    headers={"X-Subscription-Token": os.environ["BRAVE_API_KEY"], "Accept": "application/json"},
    timeout=15,
)
r.raise_for_status()
for item in r.json()["web"]["results"]:
    print(item["title"], "→", item["url"])
```

The reproducible pattern: keep a list of dork **templates** (`site:{domain} filetype:csv "{topic}" after:{year}`), call the API with rate limiting, normalise to `{query_id, rank, title, url, retrieved_at}`, and dedupe on URL. Now your sourcing is versioned and repeatable.

## Audit your own footprint (a taster)

The [Google Hacking Database](https://www.exploit-db.com/google-hacking-database) catalogues dork *patterns* by exposure class. Used defensively, it's a checklist to run against **your own** `site:`:

| Exposure class | What to look for | Why it matters |
|---|---|---|
| Open directory listings | `intitle:"index of"` on your hosts | Accidentally browsable backups/exports |
| Env / config leakage | Indexed `.env`, `web.config`, keys in static assets | Search engines cache briefly-public secrets |
| Open buckets | World-readable S3/GCS/Azure URLs on your naming | A recurring source of dataset/PII leaks |

The full discover → verify → take-down → rotate → `noindex` → [Search Console removal](https://search.google.com/search-console) loop is in [Week 7 → Dorking for Recon](/2026-05/week-7/dorking-recon/).

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| "Unusual traffic" / CAPTCHA | Scripting raw `google.com/search` | Use a search API, not the HTML SERP |
| Results differ run-to-run | Personalisation, region, freshness | Pin params in the API; record `retrieved_at` |
| Operator ignored | Google sometimes "helpfully" relaxes | Use quotes; verify with `filetype:`/`site:` combos |

## Your turn (≈15 min)

1. Compose **three** dorks that find a public dataset (CSV or PDF) for a topic you care about. Save the ones that work.
2. Run `site:` on **your own** domain (or your GitHub Pages site). Note one exposure class from the table you'd want to check for real.
3. *(Optional, needs a free key)* Run `dork_api.py` and turn one dork into a small JSON result set.

## Checklist

- [ ] I can compose layered operator queries (`site:` + `filetype:` + phrase + date).
- [ ] I know scraping Google's SERP directly violates its Terms, and I use an API instead.
- [ ] I know Google's Custom Search JSON API is sunsetting (Jan 2027) and what to use instead.
- [ ] I only run exposure-style dorks against domains I'm authorised to audit.

## Go deeper

- [Refine Google searches — operator reference](https://support.google.com/websearch/answer/2466433)
- [SerpAPI](https://serpapi.com/search-api) · [Brave Search API](https://brave.com/search/api/) · [Exa](https://exa.ai/docs/reference/search)
- [Google Hacking Database — Exploit-DB](https://www.exploit-db.com/google-hacking-database)

[![HakByte: How to find anything on the internet with Google Dorks — Hak5](https://img.youtube.com/vi/lESeJ3EViCo/0.jpg)](https://youtu.be/lESeJ3EViCo "HakByte: How to find anything on the internet with Google Dorks — Hak5")

<!-- SOURCES: https://support.google.com/websearch/answer/2466433 , https://serpapi.com/search-api , https://brave.com/search/api/ , https://exa.ai/docs/reference/search , https://developers.google.com/custom-search/v1/overview , https://www.exploit-db.com/google-hacking-database , https://search.google.com/search-console , https://policies.google.com/terms , https://youtu.be/lESeJ3EViCo -->
