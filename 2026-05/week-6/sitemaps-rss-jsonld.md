# Sitemaps, RSS & Structured Data

> **Before you write a single selector, check whether the site is already handing out its data — as a URL index, a change feed, or clean JSON embedded in the page.**

⏱ ~8 min read · ~15 min hands-on
🔗 needs: [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/) · [Hidden JSON APIs](/2026-05/week-6/hidden-json-apis/)

Sites publish structured data on purpose — for search engines, feed readers, and social previews. It's stable, it's meant to be machine-read, and almost nobody checks for it before writing a fragile HTML parser.

## Try it in 5 minutes — find every URL on a site

Start at `robots.txt`, which usually names the sitemap:

```bash
curl -s https://docs.python.org/robots.txt | grep -i sitemap
curl -s https://docs.python.org/sitemap.xml | head -20
```

✅ A machine-readable index of the site's pages — no crawling required.

Large sites publish a *sitemap index* (a sitemap of sitemaps) instead. Compare:

```bash
curl -s https://www.gov.uk/sitemap.xml | head -8   # <sitemapindex> — 35 child sitemaps
```

Your parser has to handle both shapes.

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28"]
# ///
"""List URLs from a sitemap, following sitemap-index files one level down.

Run:  uv run sitemap.py https://docs.python.org/sitemap.xml
  or: uv run sitemap.py https://www.gov.uk/sitemap.xml   # a sitemap *index*
"""

import sys
import xml.etree.ElementTree as ET

import httpx

NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def urls_from(sitemap_url: str, client: httpx.Client) -> list[str]:
    root = ET.fromstring(client.get(sitemap_url).raise_for_status().content)
    # A <sitemapindex> points at more sitemaps; a <urlset> holds the actual pages.
    if root.tag.endswith("sitemapindex"):
        children = [el.text for el in root.findall(".//sm:sitemap/sm:loc", NS)]
        return [u for child in children[:3] for u in urls_from(child, client)]
    return [el.text for el in root.findall(".//sm:url/sm:loc", NS)]


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "https://docs.python.org/sitemap.xml"
    with httpx.Client(timeout=30, follow_redirects=True) as client:
        found = urls_from(target, client)
    print("\n".join(found[:20]))
    print(f"\n{len(found)} URLs found")
```

## Three free structured sources

| Source | Where | Gives you |
|---|---|---|
| **`sitemap.xml`** | `/sitemap.xml`, or the `Sitemap:` line in `/robots.txt` | Every URL the site wants indexed, often with `lastmod` dates |
| **RSS / Atom** | `/feed`, `/rss`, or `<link rel="alternate" type="application/rss+xml">` | New items only — ideal for [change detection](/2026-05/week-6/change-detection-dedup/) |
| **JSON-LD** | `<script type="application/ld+json">` in the page HTML | The article/product/event as clean, typed JSON |

**`lastmod` is underrated:** it tells you which pages changed since your last run, so you can re-fetch a handful instead of the whole site.

## JSON-LD: the whole record, already parsed

Most publishers embed [schema.org](https://schema.org/) metadata for Google. It's frequently the entire item — headline, author, date, price, rating — as JSON, sitting in the HTML you already downloaded:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28", "selectolax>=0.3"]
# ///
"""Pull JSON-LD structured data out of a page.

Run:  uv run jsonld.py https://en.wikipedia.org/wiki/Web_scraping
"""

import json
import sys

import httpx
from selectolax.parser import HTMLParser

url = sys.argv[1] if len(sys.argv) > 1 else "https://en.wikipedia.org/wiki/Web_scraping"
html = httpx.get(url, timeout=15, follow_redirects=True).raise_for_status().text

for node in HTMLParser(html).css('script[type="application/ld+json"]'):
    data = json.loads(node.text())
    print(json.dumps(data, indent=2)[:800])
```

Check the `@type` field — `Article`, `Product`, `Recipe`, `JobPosting`, `Organization` — and you know the schema without reverse-engineering anything.

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| `sitemap.xml` is 404 | Not published there | Check `robots.txt`; try `/sitemap_index.xml` |
| Parser finds no URLs | It's a sitemap *index*, not a urlset | Follow `<sitemap><loc>` one level down |
| Sitemap is `.xml.gz` | Compressed (allowed by spec) | Decompress with `gzip` before parsing |
| `ET.fromstring` fails on namespaces | Sitemap XML is namespaced | Use the `sm:` prefix map, as above |
| No JSON-LD found | Site uses microdata/RDFa, or none | Fall back to OpenGraph `<meta>` tags, then HTML parsing |
| JSON-LD is a list, not an object | Multiple entities on the page | Handle both: `data if isinstance(data, list) else [data]` |

## Your turn (≈15 min)

1. Find the sitemap for a news site or docs site you like; count its URLs with `sitemap.py`.
2. Find its RSS/Atom feed and note which fields the feed gives you for free.
3. Run `jsonld.py` on one article and list the fields you'd otherwise have scraped by hand.
4. Using `lastmod`, write the one-line rule you'd use to decide which pages to re-fetch tomorrow.

## Checklist

- [ ] I check `robots.txt` for a `Sitemap:` line before crawling.
- [ ] I can tell a sitemap index from a urlset and follow it down.
- [ ] I use `lastmod` to re-fetch only what changed.
- [ ] I look for JSON-LD before writing CSS selectors.
- [ ] I know RSS/Atom is the cheapest change feed available.

## Go deeper

- [sitemaps.org protocol](https://www.sitemaps.org/protocol.html) — the format, including index files and `lastmod`.
- [schema.org](https://schema.org/) — the vocabulary behind JSON-LD `@type` values.
- [Google's structured data docs](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) — why sites publish it in the first place.

<!-- SOURCES: https://www.sitemaps.org/protocol.html , https://schema.org/ , https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data , https://docs.python.org/sitemap.xml , https://www.gov.uk/sitemap.xml (both tested 200; python.org/sitemap.xml is 404 — do not use) -->
