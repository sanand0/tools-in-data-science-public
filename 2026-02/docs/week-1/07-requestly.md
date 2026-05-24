# 07 · Requestly

?> **TL;DR**
?> Requestly is a free, open-source browser extension + desktop app that lets you **intercept any request your browser makes, modify it on the fly, redirect it, or mock the response entirely** — without touching backend code or deploying anything. Acquired by BrowserStack in 2025. Installed by 300,000+ developers.

## Why Interception?

You're a frontend developer. The backend API isn't ready yet. Or it's returning real production data and you want to test the "error" case. Or you need to point the app at a staging server while the URL is hard-coded to prod.

Classical solutions all suck:

1. **Change the backend** — requires coordination, deploys, permissions.
2. **Change the frontend code** — you forget and ship the hack.
3. **Set up Charles/Fiddler proxy** — certificate dance, corporate VPN issues.

**Requestly sits inside your browser** (no proxy, no certificates) and lets you intercept, modify, and mock with one-click rules.

[![Requestly — The All-in-One API Tester and HTTP Interceptor](https://img.youtube.com/vi/xrqmAffe86k/0.jpg)](https://youtu.be/xrqmAffe86k "Requestly — The All-in-One API Tester and HTTP Interceptor")

## Install

1. **Chrome / Edge / Firefox extension** — [Chrome Web Store](https://chromewebstore.google.com/detail/requestly-supercharge-you/mdnleldcmiljblolnjhpnblkcekpdkpa) (or [requestly.com](https://requestly.com/)).
2. **Desktop app** (optional) — intercepts mobile apps, desktop apps, and iOS/Android simulators. Get it from [requestly.com/desktop](https://requestly.com/desktop).

Pin the extension to your toolbar after install.

## The Rule Types

Each feature in Requestly is a **rule** you create. The extension evaluates them on every network request.

| Rule Type | What it does |
|-----------|--------------|
| **Redirect** | Point one URL to another (map prod → staging, or file on disk) |
| **Modify Response** | Override a response body, status code, or headers |
| **Modify Headers** | Add/remove request or response headers |
| **Modify Query Params** | Add/change URL query parameters |
| **Modify Request Body** | Change the payload before it leaves the browser |
| **Insert Script** | Inject JS/CSS into a page |
| **Delay / Block** | Simulate slow network or fail a request |
| **Replace** | Find/replace text in URLs or bodies |

Rules can target:

- Exact URL, URL contains, URL matches regex
- Source filter (which website made the request)
- HTTP method
- Resource type (XHR, script, image, stylesheet)

## Recipe 1 — Mock an API Response

Your backend `/api/users` isn't ready. Mock it in 30 seconds:

1. Open Requestly → **New Rule** → **Modify API Response**.
2. URL contains: `/api/users`
3. Status code: `200`
4. Response body:
   ```json
   [
     {"id": 1, "name": "Alice", "role": "admin"},
     {"id": 2, "name": "Bob",   "role": "viewer"}
   ]
   ```
5. Save → Enable.

Now when your page calls `/api/users`, Requestly returns this mock — the real server is never hit.

### Dynamic mocks with JavaScript

Need the mock to respond differently based on the request? Switch to **Programmatic** mode:

```js
// `response` is the original response (or null if mocked).
// `request` contains URL, method, body, headers.
if (request.url.includes("userId=1")) {
  return {
    id: 1,
    name: "Alice",
    premium: true
  };
}
return { id: 0, name: "Unknown", premium: false };
```

## Recipe 2 — Redirect production to localhost

You're debugging a bug that only happens in prod — but your local dev server has your fix.

1. **New Rule** → **Redirect Request**.
2. If URL contains: `prod.example.com/api/`
3. Redirect to: `localhost:8000/api/`
4. Enable → reload the prod site in your browser.

Now every API call from prod goes to your laptop. **Nobody else sees this.**

### Map Local — serve a local file as the response

1. **Redirect Request** → source pattern that matches a JS bundle URL.
2. Redirect to: `file:///Users/you/dev/myapp/dist/app.js`

This is brilliant for testing a fix live on production *before* you deploy.

## Recipe 3 — Inject a debug script

Want to see what events a page fires?

1. **New Rule** → **Insert Script**.
2. Page URL contains: `example.com`
3. Script (inject at **start**):
   ```js
   // Log every fetch call
   const origFetch = window.fetch;
   window.fetch = function(...args) {
     console.log("[fetch]", args[0], args[1]);
     return origFetch(...args);
   };
   ```

Now every page load on `example.com` logs its `fetch` calls. No source changes, no build.

## Recipe 4 — Simulate errors and slow networks

Test your error handling without waiting for something to actually break:

| Goal | Rule | Config |
|------|------|--------|
| Fake a 500 error | Modify Response | Status: `500`, body: `{"error": "boom"}` |
| Simulate slow API | Delay Request | Delay: `3000` ms |
| Block analytics | Block Request | URL contains: `google-analytics.com` |
| Inject rate-limit | Modify Response | Status: `429`, header `Retry-After: 60` |

## Recipe 5 — Modify Request Headers

Add an `Authorization` header only on your frontend:

1. **New Rule** → **Modify Headers**.
2. Target: Request.
3. Action: Add.
4. Header: `Authorization`
5. Value: `Bearer debug-token`
6. URL contains: `localhost:8000`

Useful when testing APIs that require auth, without hardcoding the token.

## Sessions — Record Bug Reports

**Sessions** record a full browser session — network requests, console logs, DOM changes, screen recording — in a single shareable file. When a QA engineer finds a bug, they click record → reproduce → share. The developer gets everything they need to debug.

- **Automatic** mode records every tab in the background (retains last N minutes).
- **Manual** mode: click Record → Reproduce → Stop → Share URL.

## Local Workspaces — Git-Friendly Collaboration

Unlike Postman, Requestly's API Client and rules can store everything as **plain JSON in a local folder**. Point to `~/dev/myapp/requestly/` and every teammate sharing that folder via Git, iCloud, or Google Drive gets the same collections, environments, and rules.

## Requestly as an API Client (Postman Alternative)

The Requestly desktop app also includes a full API client:

- Build requests with collections, environments, variables
- Pre-request + post-response scripts
- Team workspaces
- No mandatory login, no cloud lock-in
- Import Postman/Bruno/Insomnia collections

## When NOT to Use Requestly

- **End-to-end browser automation** — use Playwright (Week 6). Requestly is for interactive dev, not CI.
- **Server-to-server debugging** — requests from your Python script won't go through the extension. Use `mitmproxy` or log at the request level.
- **HTTPS issues at the network layer** — Requestly works *inside* the browser; for full-stack transparent proxy, use the desktop app or a real proxy.

## 5-Minute Exercise

1. Install the Chrome extension.
2. Open [jsonplaceholder.typicode.com/users/1](https://jsonplaceholder.typicode.com/users/1). Note the real response.
3. Create a **Modify Response** rule:
   - URL contains: `jsonplaceholder.typicode.com/users/1`
   - Response body: `{"id": 1, "name": "MOCKED!"}`
4. Reload the page → you should see the mocked response.
5. Disable the rule → real response returns.

Bonus: make the rule dynamic — return `MOCKED!` only if the query string has `mock=true`.

## Further Reading

- [Requestly docs](https://docs.requestly.com/)
- [Requestly on GitHub](https://github.com/requestly/requestly) (open source)
- [Sessions feature deep-dive](https://requestly.com/features/session-recording/)
- [Local-first workspaces](https://docs.requestly.com/general/workspaces/local-workspace-beta)