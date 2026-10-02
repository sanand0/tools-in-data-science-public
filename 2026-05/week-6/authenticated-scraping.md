# Authenticated Scraping

> **Carry a login session in code — CSRF tokens, cookies, saved browser state — and recognise when the login *is* the line you shouldn't cross.**

⏱ ~9 min read · ~15 min hands-on
🔗 needs: [Hidden JSON APIs](/2026-05/week-6/hidden-json-apis/) · [Playwright & Selenium](/2026-05/week-6/playwright-selenium/) · [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/)

Plenty of data sits behind a login. Sometimes you're clearly entitled to it — your own account, your own app, or an API that issues you a token. Sometimes the login is precisely the access control you must not defeat.

> ⚖️ Logging into a service you don't control to extract data is usually a **Terms of Service breach**, and defeating an access control can be **unauthorised access** under computer-misuse law. Automate authentication only for **your own accounts/apps** or with explicit permission. This is the exact line [hiQ crossed](/2026-05/week-6/legal-ethical-scraping/).

## Try it in 5 minutes — a session with a CSRF token

The `quotes.toscrape.com` sandbox has a real login form (it accepts any credentials) guarded by a CSRF token — the same mechanics as a production login:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28", "selectolax>=0.3"]
# ///
"""Log in to the quotes.toscrape.com sandbox, carrying the CSRF token + cookie.

Run:  uv run login.py
"""

import httpx
from selectolax.parser import HTMLParser

BASE = "https://quotes.toscrape.com"

with httpx.Client(base_url=BASE, timeout=10, follow_redirects=True) as client:
    # 1. GET the login page and scrape the hidden CSRF token
    token = HTMLParser(client.get("/login").text).css_first('input[name="csrf_token"]').attributes["value"]
    # 2. POST credentials WITH the token — the Client keeps the session cookie
    client.post("/login", data={"csrf_token": token, "username": "demo", "password": "demo"})
    # 3. The cookie now proves we're logged in
    print("Logged in!" if "Logout" in client.get("/").text else "Login failed")
```

✅ You carried a CSRF token *and* a session cookie across three requests — that's the machinery behind every authenticated scrape.

## What a login actually needs

| Ingredient | Where it comes from | How you carry it |
|---|---|---|
| **Session cookie** | Set by the server on login | Reuse one `httpx.Client` (or `Session`) — it stores cookies |
| **CSRF / hidden token** | A hidden `<input>` on the form | Scrape it, submit it with the POST |
| **Auth header / bearer token** | An API login or OAuth flow | Send `Authorization: Bearer …` on each request |

The [hidden-API trick](/2026-05/week-6/hidden-json-apis/) applies here too: many logins POST to a JSON endpoint you can find in the Network tab, which is cleaner than parsing the HTML form.

## Reuse a browser login — saved storage state

For JavaScript-heavy logins, or an MFA step you complete by hand once, log in **once** in a real browser and save the session, then replay it headlessly:

```python
# Log in interactively once, save the cookies + localStorage:
#   context.storage_state(path="auth.json")
# Later runs skip the login entirely:
#   context = browser.new_context(storage_state="auth.json")
```

This is the standard Playwright pattern — details on [Playwright Advanced](/2026-05/week-6/playwright-advanced/). Treat `auth.json` like a password: it *is* your session.

## Prefer the front door: OAuth & API tokens

If the service offers an OAuth API (Google, GitHub, most SaaS), use it — that's *sanctioned* authenticated access with scopes and revocation, not a workaround. You already met this in [Week 2 → Google OAuth](/2026-05/week-2/03-google-oauth/).

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| Login returns 200 but you're still logged out | Missing CSRF token or dropped cookie | Scrape the token; reuse one `Client` |
| Works, then `401`/redirect later | Session/token expired | Detect it and re-authenticate; refresh tokens |
| Login needs MFA | Can't be fully scripted | Log in once by hand, reuse `storage_state` |
| CAPTCHA on the login itself | The site is refusing automation | Stop — get permission or an API |

## Your turn (≈15 min)

1. Run `login.py` and confirm the `Logout` link appears.
2. Change the CSRF step to *skip* sending the token — watch the login fail. Now you understand why it's there.
3. On a site where you have your **own** account, log in once with headed Playwright, save `storage_state`, and reuse it in a second script. Note how you'd keep `auth.json` secret.

## Checklist

- [ ] I can carry a session cookie by reusing one client.
- [ ] I can scrape a CSRF/hidden token and submit it with a POST.
- [ ] I can save and reuse browser `storage_state` for JS logins and MFA.
- [ ] I reach for an OAuth API before scripting a raw login.
- [ ] I only authenticate to my own accounts/apps or with written permission.

## Go deeper

- [quotes.toscrape.com](https://quotes.toscrape.com/login) — the login sandbox used above.
- [Playwright — authentication & storage state](https://playwright.dev/python/docs/auth) — save once, reuse everywhere.
- [Google OAuth (Week 2)](/2026-05/week-2/03-google-oauth/) — the sanctioned way in.

<!-- SOURCES: https://quotes.toscrape.com/login , https://playwright.dev/python/docs/auth -->
