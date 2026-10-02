# Playwright Advanced

> **Intercept the network, reuse a saved login, and block the junk — the difference between a browser script that crawls and one that flies.**

⏱ ~9 min read · ~15 min hands-on
🔗 needs: [Playwright & Selenium](/2026-05/week-6/playwright-selenium/) · [Authenticated Scraping](/2026-05/week-6/authenticated-scraping/)

Once basic automation works, three techniques make it production-grade: **request interception**, **saved authentication state**, and **tracing**. Together they typically cut runtime by 3–5× and eliminate most flakiness.

## Try it in 5 minutes — make it 5× faster

Images, fonts, ads, and analytics are pure overhead when you only want text. Block them at the network layer:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["playwright>=1.40"]
# ///
"""Compare page-load time with and without blocking heavy resources.

Setup: uv run --with playwright playwright install chromium
Run:   uv run fast_browser.py
"""

import time

from playwright.sync_api import sync_playwright

URL = "https://quotes.toscrape.com/js/"
BLOCK = {"image", "media", "font", "stylesheet"}


def load(block: bool) -> float:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        if block:
            # Abort heavy requests before they leave the browser.
            page.route(
                "**/*",
                lambda route: route.abort()
                if route.request.resource_type in BLOCK
                else route.continue_(),
            )
        start = time.perf_counter()
        page.goto(URL, wait_until="networkidle")
        page.wait_for_selector(".quote")
        elapsed = time.perf_counter() - start
        browser.close()
        return elapsed


print(f"normal:   {load(False):.2f}s")
print(f"blocking: {load(True):.2f}s")
```

✅ Same data, less time. On image-heavy sites the gap is dramatic.

## Capture the API the page calls

Interception works in the other direction too — you can *read* responses the page receives, which hands you the [hidden JSON API](/2026-05/week-6/hidden-json-apis/) without opening DevTools:

```python
page.on("response", lambda r: print(r.url) if "api" in r.url and r.ok else None)
```

Let the page load once with this attached, note the endpoints, then drop the browser entirely and call them with `httpx`. Browser to *discover*, HTTP client to *collect*.

## Save the login once, reuse it forever

Logging in on every run is slow and suspicious — and impossible with MFA. Do it once, persist the session:

```python
# One-off, run headed so you can complete any MFA by hand:
#   context = browser.new_context()
#   page = context.new_page(); page.goto(LOGIN_URL)
#   input("Log in in the browser window, then press Enter…")
#   context.storage_state(path="auth.json")

# Every run after that:
context = browser.new_context(storage_state="auth.json")
```

`auth.json` holds cookies and `localStorage` — it **is** your session. Never commit it; add it to `.gitignore` and treat it like a password. See [Authenticated Scraping](/2026-05/week-6/authenticated-scraping/) for when this is appropriate at all.

## Debug with a trace, not print statements

```python
context.tracing.start(screenshots=True, snapshots=True, sources=True)
# … your automation …
context.tracing.stop(path="trace.zip")
```

Then open it:

```bash
uv run --with playwright playwright show-trace trace.zip
```

You get a timeline with a DOM snapshot at every step — for headless failures on CI, this is far quicker than guessing.

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| Blocking broke the page | Site needs its CSS/JS to render content | Don't block `stylesheet`/`script`; block only `image`/`media`/`font` |
| `storage_state` stops working | Session expired or is IP/UA-bound | Re-harvest; keep the same UA and network path |
| `networkidle` never fires | Page polls or holds a websocket open | Wait for a specific selector instead |
| Memory grows over a long run | Contexts/pages never closed | One context per job; close in a `finally` |
| Fails only on CI | No display, different UA, datacenter IP | Use the trace; see [Anti-bot Patterns](/2026-05/week-6/anti-bot-patterns/) |

## Your turn (≈15 min)

1. Run `fast_browser.py` and record both timings.
2. Attach the `page.on("response", …)` listener to a real site and note any JSON endpoints it reveals.
3. Capture a `trace.zip` and open it with `show-trace`.
4. Add `image`/`font` blocking to your solution from [Playwright & Selenium](/2026-05/week-6/playwright-selenium/) and compare.

## Checklist

- [ ] I can block heavy resource types with `page.route`.
- [ ] I can discover hidden APIs by listening to responses, then drop the browser.
- [ ] I can save and reuse `storage_state`, and I keep it out of git.
- [ ] I debug headless failures with traces, not guesswork.
- [ ] I close contexts so long runs don't leak memory.

## Go deeper

- [Playwright — network interception](https://playwright.dev/python/docs/network) — routing, aborting, mocking.
- [Playwright — authentication](https://playwright.dev/python/docs/auth) — storage state in depth.
- [Playwright — trace viewer](https://playwright.dev/python/docs/trace-viewer) — the debugging tool worth learning.

<!-- SOURCES: https://playwright.dev/python/docs/network , https://playwright.dev/python/docs/auth , https://playwright.dev/python/docs/trace-viewer -->
