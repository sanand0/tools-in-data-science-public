# Rate Limits, Retries & Caching

> **Scrape so politely you never get banned, and so efficiently you never fetch the same page twice.**

⏱ ~9 min read · ~15 min hands-on
🔗 needs: [HTTP clients](/2026-05/week-1/06-http-clients/) · [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/)

The difference between a scraper that runs for months and one that's blocked on day one is rarely cleverness — it's restraint. Three habits do almost all the work: **cap your concurrency**, **back off when told to**, and **cache everything**.

## Try it in 5 minutes — get rate-limited on purpose

`httpbin.org` will return any status you ask for, so you can practise handling a `429` without annoying a real site:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://httpbin.org/status/429
```

Now handle it properly. This client backs off exponentially, adds jitter, and obeys `Retry-After`:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28"]
# ///
"""Retry on 429/5xx with exponential backoff + jitter, honouring Retry-After.

Run:  uv run polite_get.py https://httpbin.org/status/429
"""

import random
import sys
import time

import httpx

RETRY_ON = {429, 500, 502, 503, 504}
MAX_ATTEMPTS = 5


def get(client: httpx.Client, url: str) -> httpx.Response:
    for attempt in range(MAX_ATTEMPTS):
        r = client.get(url)
        if r.status_code not in RETRY_ON:
            return r
        # The server may tell us exactly how long to wait — always prefer that.
        retry_after = r.headers.get("Retry-After")
        delay = float(retry_after) if retry_after and retry_after.isdigit() else 2**attempt
        delay += random.uniform(0, 0.5)  # jitter stops clients retrying in lockstep
        print(f"  {r.status_code} → sleeping {delay:.1f}s (attempt {attempt + 1})")
        time.sleep(delay)
    raise RuntimeError(f"Gave up after {MAX_ATTEMPTS} attempts: {url}")


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "https://httpbin.org/status/429"
    with httpx.Client(timeout=10) as client:
        try:
            print("Final:", get(client, url).status_code)
        except RuntimeError as e:
            print(e)
```

✅ Watch the delays grow `1 → 2 → 4 → 8`. That's a scraper being a good citizen instead of a battering ram.

## Why jitter, and why only some requests

**Exponential backoff** doubles the wait after each failure, so a struggling server gets breathing room instead of a retry storm. **Jitter** — a small random addition — stops a thousand clients that all failed at the same instant from retrying at the same instant.

Retry only requests that are **safe to repeat**: `GET`, `HEAD`, and other reads. Retrying a `POST` can double-submit. And retry only *transient* failures:

| Status | Retry? | Why |
|---|---|---|
| `429 Too Many Requests` | ✅ | You're going too fast — slow down and obey `Retry-After` |
| `500 / 502 / 503 / 504` | ✅ | Server-side hiccup, usually temporary |
| `403 / 401` | ❌ | Permission problem — retrying won't fix it → [Anti-bot Patterns](/2026-05/week-6/anti-bot-patterns/) |
| `404` | ❌ | It isn't there. It won't be there next time either |

## Cap concurrency

Async makes it trivially easy to open 500 connections at once and take a small site down. Bound it in two places:

```python
import asyncio
import httpx

limits = httpx.Limits(max_connections=10, max_keepalive_connections=5)
sem = asyncio.Semaphore(5)  # at most 5 in flight, regardless of how many tasks exist


async def fetch(client: httpx.AsyncClient, url: str) -> str:
    async with sem:
        r = await client.get(url)
        return r.text


async def main(urls: list[str]) -> list[str]:
    async with httpx.AsyncClient(limits=limits, timeout=10) as client:
        return await asyncio.gather(*(fetch(client, u) for u in urls))
```

If `robots.txt` specifies a `Crawl-delay`, honour it — [the checker in Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/) prints it for you.

## Cache: the politest optimisation

Most re-runs re-request pages that haven't changed. A cache makes your scraper faster *and* dramatically reduces load on the target — the rare win-win. [`hishel`](https://hishel.com/) adds standards-compliant HTTP caching to `httpx` with almost no code:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["hishel>=0.1"]
# ///
"""Second run is served from disk — the site never sees the request.

Run twice:  uv run cached.py
"""

import time
import hishel

with hishel.CacheClient(storage=hishel.FileStorage(ttl=3600)) as client:
    start = time.perf_counter()
    r = client.get("https://httpbin.org/cache/60")
    print(f"{r.status_code} in {time.perf_counter() - start:.3f}s  from_cache={r.extensions.get('from_cache')}")
```

Run it twice: the second run returns in near-zero time with `from_cache=True`.

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| Fine locally, `429` in CI | No delay + a datacenter IP | Add backoff; lower concurrency |
| Retries make it *worse* | Retrying non-transient errors, no jitter | Retry only 429/5xx; add jitter |
| Retry loop never ends | No attempt cap | Always bound `MAX_ATTEMPTS` |
| Cache never hits | Target sends `no-store`, or URL varies | Check response headers; strip volatile query params |
| Duplicate records after a retry | Retried a non-idempotent write | Retry reads only; make writes idempotent |

## Your turn (≈15 min)

1. Run `polite_get.py` and record the delay sequence. Change the base from `2**attempt` to `1.5**attempt` and compare.
2. Point it at `https://httpbin.org/delay/3` with `timeout=1` — watch a *timeout* fail differently from a `429`, and decide whether it should retry.
3. Run `cached.py` twice and confirm the second run reports `from_cache=True`.
4. Take the paginate loop from [Pagination & Infinite Scroll](/2026-05/week-6/pagination-infinite-scroll/) and add backoff between pages.

## Checklist

- [ ] I retry only safe, transient failures (429/5xx on reads), never 403/404.
- [ ] I use exponential backoff **with jitter** and honour `Retry-After`.
- [ ] I always cap retry attempts so a loop fails loudly instead of forever.
- [ ] I bound concurrency with `httpx.Limits` and/or an `asyncio.Semaphore`.
- [ ] I cache responses so re-runs don't re-hit the target.

## Go deeper

- [HTTP 429 — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429) and [Retry-After — MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After) — what the server is actually telling you.
- [hishel — HTTP caching for httpx](https://hishel.com/) — drop-in, standards-compliant caching.
- [httpx — Limits & connection pooling](https://www.python-httpx.org/advanced/clients/) — bounding connections properly.

<!-- SOURCES: https://httpbin.org , https://hishel.com/ , https://www.python-httpx.org/advanced/clients/ , https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429 , https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After -->
