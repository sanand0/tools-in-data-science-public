# Wayback Machine & Common Crawl

> **Someone already crawled the web for you. Get the page — and its entire history — without sending the target a single request.**

⏱ ~9 min read · ~15 min hands-on
🔗 needs: [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/) · [Hidden JSON APIs](/2026-05/week-6/hidden-json-apis/)

Two public archives cover a large share of the web: the **Internet Archive's Wayback Machine** (snapshots of individual URLs over time) and **Common Crawl** (petabyte-scale crawls released free for research). Reach for them when a site blocks you, when you need *history* rather than the current page, or when you need breadth no polite scraper could achieve.

## Try it in 5 minutes — a URL's whole history

The Wayback **CDX API** lists every capture it holds:

```bash
curl -s 'https://web.archive.org/cdx/search/cdx?url=iitm.ac.in&output=json&limit=5'
```

You get a JSON array whose **first row is the column headers** — `urlkey, timestamp, original, mimetype, statuscode, digest, length`. Each later row is one snapshot; the 14-digit `timestamp` (`YYYYMMDDhhmmss`) rebuilds the archived URL:

```
https://web.archive.org/web/20240115120000/https://iitm.ac.in/
```

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28"]
# ///
"""Count Wayback snapshots per year for a URL — a free time-series, zero load on the site.

Run:  uv run wayback_history.py iitm.ac.in
"""

import sys
from collections import Counter

import httpx

url = sys.argv[1] if len(sys.argv) > 1 else "iitm.ac.in"

rows = httpx.get(
    "https://web.archive.org/cdx/search/cdx",
    params={"url": url, "output": "json", "fl": "timestamp,statuscode", "limit": 2000},
    timeout=60,
).raise_for_status().json()

header, *captures = rows  # first row is the header
per_year = Counter(ts[:4] for ts, _status in captures)
for year, n in sorted(per_year.items()):
    print(f"{year}  {'█' * (n * 40 // max(per_year.values()))} {n}")
print(f"\n{len(captures)} snapshots total")
```

✅ A histogram of how often a site was archived — built entirely from the archive. The site itself saw nothing.

## Which archive, when

| | **Wayback Machine** | **Common Crawl** |
|---|---|---|
| Shape | Many snapshots of *one URL* over time | One massive snapshot of *many URLs* per crawl |
| Best for | History, deleted pages, "what did this say in 2019?" | Web-scale corpora, cross-site analysis, LLM datasets |
| Access | [CDX API](https://web.archive.org/cdx/search/cdx) + [Availability API](https://archive.org/wayback/available) | [Index API](https://index.commoncrawl.org/) + WARC files on S3 |
| Freshness | Continuous, uneven per site | Monthly crawls (e.g. `CC-MAIN-2026-30`) |

**Availability API** — the quick "is there a snapshot near this date?" lookup:

```bash
curl -s 'https://archive.org/wayback/available?url=iitm.ac.in&timestamp=20200101'
```

**Common Crawl index** — ask which crawls contain a URL pattern. Collections are named by crawl (`CC-MAIN-2026-30` was July 2026); the current list lives at [`collinfo.json`](https://index.commoncrawl.org/collinfo.json):

```bash
curl -s 'https://index.commoncrawl.org/CC-MAIN-2026-30-index?url=iitm.ac.in/*&output=json' | head -3
```

Each line is a JSON record pointing into a **WARC** file (the raw HTTP request/response, stored on S3 with byte offsets) — so you can fetch just the bytes for one page instead of downloading a petabyte.

> ⚖️ Archives are a legitimate source, but the **content** in them still has an owner. Copyright and personal-data rules apply exactly as they would on the live site — see [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/). Be gentle with these APIs too: they're free public infrastructure.

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| Empty CDX result | URL never archived, or wrong form | Try `www.`/no-`www`, add `matchType=domain` or a `*` wildcard |
| Snapshot renders broken | Assets weren't captured | Use the raw capture: add `id_` after the timestamp (`/web/20240115120000id_/…`) |
| CDX request times out | Asking for a huge domain-wide range | Add `limit=`, narrow with `from=`/`to=` years |
| Common Crawl returns nothing | That crawl didn't include the URL | Try another collection from `collinfo.json` |
| Archived page is stale | Last capture is years old | Confirm the date — an archive proves *was*, not *is* |

## Your turn (≈15 min)

1. Run `wayback_history.py` on your institution's domain; note the busiest year.
2. Use the Availability API to find the closest snapshot to `20200101`, open it, and compare against the live site.
3. Fetch one archived page's raw HTML (`id_` form) and extract its title.
4. Query the Common Crawl index for a domain you like and count how many URLs it holds.

## Checklist

- [ ] I know the CDX API's first row is the header row.
- [ ] I can rebuild an archived URL from a 14-digit timestamp.
- [ ] I know when to use Wayback (history of one URL) vs Common Crawl (breadth).
- [ ] I check archives *before* fighting a site that blocks me.
- [ ] I remember an archived page proves what *was* true, not what is.

## Go deeper

- [Wayback CDX Server API](https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server) — every query parameter, documented.
- [Common Crawl — Get Started](https://commoncrawl.org/get-started) and the [CDXJ index](https://commoncrawl.org/cdxj-index) — the corpus and how it's indexed.
- [cdx_toolkit](https://pypi.org/project/cdx-toolkit/) — one Python API over both Wayback and Common Crawl.

<!-- SOURCES: https://web.archive.org/cdx/search/cdx , https://archive.org/wayback/available , https://index.commoncrawl.org/ , https://index.commoncrawl.org/collinfo.json , https://commoncrawl.org/get-started , https://commoncrawl.org/cdxj-index , https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server , https://pypi.org/project/cdx-toolkit/ -->
