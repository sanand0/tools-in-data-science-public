# Playwright & Selenium

> **When there's genuinely no API behind the page, drive a real browser — and drive it so it waits for content instead of guessing.**

⏱ ~9 min read · ~15 min hands-on
🔗 needs: [Hidden JSON APIs](/2026-05/week-6/hidden-json-apis/) · [HTTP clients](/2026-05/week-1/06-http-clients/)

Browser automation is the heavyweight option: it renders JavaScript, executes the page's own code, and sees exactly what a user sees. It's also 10–100× slower than an HTTP request and far more fragile. Use it **after** you've checked for a [hidden JSON API](/2026-05/week-6/hidden-json-apis/), not before.

## Try it in 5 minutes

Playwright ships its own browsers, so setup is two commands:

```bash
uv run --with playwright playwright install chromium
```

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["playwright>=1.40"]
# ///
"""Scrape a JS-rendered page with Playwright.

Setup: uv run --with playwright playwright install chromium
Run:   uv run scroll_scrape.py
"""

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://quotes.toscrape.com/js/")  # quotes rendered by JavaScript

    page.wait_for_selector(".quote")  # wait for content, never sleep()
    quotes = [
        {"text": q.inner_text(), "author": q.get_attribute("data-author")}
        for q in page.query_selector_all(".quote span.text")
    ]
    print(f"{len(quotes)} quotes")
    print(quotes[0]["text"])
    browser.close()
```

✅ `quotes.toscrape.com/js/` renders entirely in JavaScript — `httpx` alone returns an empty shell, but the browser sees all ten.

## Playwright or Selenium?

| | **Playwright** | **Selenium** |
|---|---|---|
| Waiting | **Auto-waits** for elements to be actionable | Manual `WebDriverWait` / explicit waits |
| Setup | `playwright install` fetches matched browsers | Manage driver binaries yourself |
| Speed | Faster; one protocol, async-native | Slower; more moving parts |
| Ecosystem | Newer, excellent docs | Older, vast legacy corpus, wide language support |

**Default to Playwright** for new work. Learn Selenium when you inherit it — the concepts transfer directly.

## Selectors that survive a redesign

The single biggest cause of "my scraper broke overnight" is a brittle selector. Prefer, in order:

1. **Test/data attributes** — `[data-testid="price"]`. Put there deliberately; rarely churn.
2. **Semantic roles / text** — `page.get_by_role("button", name="Next")`. Reads like intent.
3. **Stable IDs** — `#search-results`.
4. **Structural CSS** — `.col-md-8 > div:nth-child(3)`. Last resort; breaks on any layout tweak.

Generated class names (`.css-1x2y3z`, Tailwind soups) change on every build. Never anchor to them.

## Never `sleep()` — wait for a condition

```python
page.wait_for_selector(".quote")            # an element exists
page.wait_for_load_state("networkidle")     # network has settled
page.get_by_role("button", name="Next").click()   # auto-waits for actionable
```

A fixed `time.sleep(3)` is simultaneously too slow (usually) and too short (occasionally) — the worst of both. Condition-based waits are faster *and* more reliable.

> ⚖️ A browser executes the site's JavaScript and looks exactly like a user. That doesn't change what you're permitted to collect — [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/) still applies, and browsers make it easy to hammer a site by accident. Pair with [Rate Limits](/2026-05/week-6/rate-limits-retries-caching/).

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| `TimeoutError` waiting for a selector | Element is in an iframe, or never appears | `page.frame_locator(...)`; verify the selector in DevTools |
| Works headed, fails headless | Site detects headless, or layout differs | Try `headless=False`; see [Anti-bot Patterns](/2026-05/week-6/anti-bot-patterns/) |
| Empty text from a real element | Read before hydration finished | Wait on the *content*, not just the node |
| Random flakiness | `sleep()`-based timing | Replace with `wait_for_selector` / `expect` |
| Painfully slow at scale | Loading images, fonts, ads | Block them → [Playwright Advanced](/2026-05/week-6/playwright-advanced/) |

## Your turn (≈15 min)

1. Run `scroll_scrape.py`. Then fetch the same URL with plain `httpx` and confirm the quotes are **absent** — that contrast is the whole reason browsers exist.
2. Switch to `headless=False` and watch it run.
3. Rewrite the extraction using `page.get_by_role`/`get_by_text` instead of CSS classes.
4. Add pagination: click "Next" until it disappears → [Pagination & Infinite Scroll](/2026-05/week-6/pagination-infinite-scroll/).

## Checklist

- [ ] I check for a JSON API before reaching for a browser.
- [ ] I can launch Playwright, navigate, wait for a selector, and extract text.
- [ ] I prefer `data-testid` / roles over generated class names.
- [ ] I never use `sleep()` for synchronisation.
- [ ] I know why a page can be empty in `httpx` but full in a browser.

## Go deeper

- [Playwright Python docs](https://playwright.dev/python/docs/intro) — the official starting point.
- [Playwright locators](https://playwright.dev/python/docs/locators) — the recommended selector strategy.
- [Selenium docs](https://www.selenium.dev/documentation/) — for inherited codebases.
- [Playwright Advanced](/2026-05/week-6/playwright-advanced/) — interception, saved auth, tracing, speed.

<!-- SOURCES: https://playwright.dev/python/docs/intro , https://playwright.dev/python/docs/locators , https://www.selenium.dev/documentation/ , https://quotes.toscrape.com/js/ -->
