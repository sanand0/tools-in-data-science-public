# Anti-bot Patterns

> **Most blocks aren't Cloudflare-grade. Learn the short ladder of defences sites use — and the honest response to each rung.**

⏱ ~8 min read · ~12 min hands-on
🔗 needs: [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/) · [Hidden JSON APIs](/2026-05/week-6/hidden-json-apis/)

Before you reach for stealth browsers, know the ladder. Nine times out of ten a "block" is something simple — a missing header, too many requests, or a session cookie you didn't carry. Each rung has a *correct* response and an *arms-race* response; prefer the correct one.

> ⚖️ Escalating against a site that clearly doesn't want you is a legal and ethical decision, not just a technical one. "I got past it" is not "I was allowed." Re-read [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/) before you climb.

## Try it in 5 minutes — see what you're broadcasting

The fastest way to understand blocking is to see what your client sends. `httpbin.org` echoes it back:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28"]
# ///
"""See the headers your client broadcasts — and the dead giveaway.

Run:  uv run whoami.py
"""

import httpx

r = httpx.get("https://httpbin.org/headers")
print(r.json()["headers"])
```

✅ Look at `User-Agent`: it says `python-httpx/…`. That one string is the simplest bot tell there is — and the simplest to fix honestly.

## The defence ladder

| Rung | How it spots you | The honest response |
|---|---|---|
| **Rate limiting / IP block** | Too many requests from one IP | Slow down, cache, respect `Retry-After` → [Rate Limits](/2026-05/week-6/rate-limits-retries-caching/) |
| **Header / User-Agent filter** | Missing or `python-*` UA, no `Accept` | Send complete, honest headers (identify your bot) |
| **Session / token check** | No cookie or CSRF token | Reuse an `httpx.Client`; grab the token first → [Authenticated Scraping](/2026-05/week-6/authenticated-scraping/) |
| **Browser fingerprinting** | `navigator.webdriver`, headless markers | Drive a real browser → [Playwright](/2026-05/week-6/playwright-selenium/); stealth builds if permitted |
| **TLS / HTTP2 fingerprint** | Python's TLS stack ≠ a browser's | `curl_cffi` impersonation → [Cloudflare Bot Protection](/2026-05/week-6/cloudflare-bot/) |
| **CAPTCHA / Turnstile** | An interactive challenge | Solve it in a browser *you* run, get permission, or stop |

The rungs are ordered by effort *and* by how far into an arms race they take you. Climb only as far as your permission does.

## Set honest headers first

Most "hard" sites relent the moment you look like a real client and behave politely:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28"]
# ///
"""A polite, honestly-identified client — the baseline before any 'evasion'.

Run:  uv run polite.py https://httpbin.org/get
"""

import sys
import httpx

HEADERS = {
    # Identify yourself honestly, with a contact — many operators allow-list good bots.
    "User-Agent": "tds-course-bot/1.0 (+mailto:student@example.com)",
    "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
    "Accept-Language": "en",
}

with httpx.Client(headers=HEADERS, timeout=10, follow_redirects=True) as client:
    r = client.get(sys.argv[1] if len(sys.argv) > 1 else "https://httpbin.org/get")
    print(r.status_code, r.request.headers["User-Agent"])
```

## The arms-race rungs — and why they're a last resort

Proxy-rotation services and CAPTCHA-solving services (2Captcha, commercial residential-proxy pools, and the like) exist and work. But reaching for them means you're now *fighting* a site that has said "no" in code — which is exactly the fact pattern that made [hiQ lose on breach of contract](/2026-05/week-6/legal-ethical-scraping/). The stronger the wall, the louder the site is telling you to use the front door:

1. Is there an API, feed, or dataset? ([Sitemaps & feeds](/2026-05/week-6/sitemaps-rss-jsonld/))
2. Is it in an archive? ([Wayback & Common Crawl](/2026-05/week-6/wayback-commoncrawl/))
3. Can you just ask for access?

If all three are no and the Terms forbid it, the correct engineering answer is often **don't**.

## Your turn (≈12 min)

1. Run `whoami.py`, then `polite.py` — confirm the `User-Agent` changed.
2. Fetch `https://httpbin.org/status/403` and `https://httpbin.org/status/429`; write down which rung each status hints at.
3. Pick one real site and read its `robots.txt` + Terms. Decide, in one sentence, how far up the ladder your permission actually reaches.

## Checklist

- [ ] I can list the anti-bot ladder from rate limits up to CAPTCHA.
- [ ] I send honest, complete headers before assuming a site is "hard".
- [ ] I know which rung `curl_cffi` solves and which needs a real browser.
- [ ] I recognise that proxy-rotation + CAPTCHA-solving is an ethical/legal decision, not just a technical one.
- [ ] I check for an API, feed, or archive before climbing.

## Go deeper

- [Cloudflare Bot Protection](/2026-05/week-6/cloudflare-bot/) — the specialised, fingerprint-level version of this ladder.
- [What is `robots.txt` — RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) — the rule most blocks are quietly enforcing.
- [Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright-python) — a stealth Playwright build, for the fingerprinting rung.

<!-- SOURCES: https://httpbin.org , https://www.rfc-editor.org/rfc/rfc9309.html , https://github.com/Kaliiiiiiiiii-Vinyzu/patchright-python -->
