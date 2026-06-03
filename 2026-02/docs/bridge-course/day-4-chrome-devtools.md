# Day 4 — Chrome DevTools

> **Goal:** Use Chrome DevTools to inspect network requests, debug API calls, and understand what happens behind the scenes when you load a web page or call an API.

---

## What Are Chrome DevTools?

Chrome DevTools is a set of developer tools built into Google Chrome. It lets you:
- Inspect HTML/CSS elements
- Monitor network requests (API calls, file downloads)
- Debug JavaScript
- Analyze performance
- View cookies and storage

For this course, the **Network tab** is the most important tool.

---

## Opening DevTools

Three ways to open DevTools:

```
Method 1: Right-click anywhere on a page → "Inspect"
Method 2: Press F12
Method 3: Press Ctrl + Shift + I (Linux/Windows) or Cmd + Option + I (Mac)
```

The DevTools panel opens at the bottom or side of your browser.

---

## The DevTools Tabs — Overview

| Tab | What it does |
|---|---|
| **Elements** | Inspect and modify HTML/CSS |
| **Console** | JavaScript console (run code, see errors) |
| **Sources** | View and debug JavaScript files |
| **Network** | **⭐ Inspect all HTTP requests and responses** |
| **Performance** | Analyze page load and runtime performance |
| **Application** | View cookies, storage, service workers |

---

## The Network Tab — Your API Debugging Superpower

### Setting Up

1. Open DevTools (`F12`)
2. Click the **Network** tab
3. Reload the page (`Ctrl + R`) — the Network tab fills with requests

### Understanding the Request List

Each row is one HTTP request:

```
Name         Status  Type       Size    Time
──────────────────────────────────────────────
api.example  200     fetch      1.2 KB  45 ms
styles.css   200     stylesheet 5.4 KB  12 ms
logo.png     200     png        23 KB   89 ms
script.js    200     script     45 KB   34 ms
```

| Column | Meaning |
|---|---|
| **Name** | URL path of the request |
| **Status** | HTTP status code (200, 404, 500...) |
| **Type** | Type of request (fetch/XHR, document, script, image...) |
| **Size** | Response size |
| **Time** | How long the request took |

### Filtering Requests

Use the filter buttons at the top:

```
All | Fetch/XHR | JS | CSS | Img | Media | Font | Doc | WS | Wasm | Manifest | Other
```

**For API debugging, always click "Fetch/XHR"** — this filters to only API calls.

### 🧠 Knowledge Check

**Q1:** When debugging an API in the Network tab, which filter should you click to hide images, CSS, and fonts?

- A) JS
- B) Doc
- C) Fetch/XHR
- D) All

<details>
<summary><b>Answer</b></summary>

**C** — `Fetch/XHR` filters the view to show only the asynchronous API requests made by the page.

</details>

---

## Inspecting a Request

Click on any request to see its details:

### Headers Tab

```
General:
  Request URL:    https://api.example.com/users
  Request Method: GET
  Status Code:    200 OK

Response Headers:
  Content-Type:   application/json
  X-RateLimit:    100

Request Headers:
  Authorization:  Bearer eyJhbG...
  Accept:         application/json
  User-Agent:     Mozilla/5.0...
```

### Preview Tab

Shows the response body in a readable format (for JSON, it's a collapsible tree).

### Response Tab

Shows the raw response body.

### Timing Tab

Shows how long each phase took:
- DNS lookup
- Connection setup
- Waiting for response (TTFB)
- Content download

---

## Copy as cURL — The Killer Feature

This is the most useful DevTools feature for developers:

1. Right-click on any request in the Network tab
2. Select **"Copy" → "Copy as cURL"**
3. Paste into your terminal

This gives you the exact command to reproduce that request:

```bash
curl 'https://api.example.com/users' \
  -H 'accept: application/json' \
  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiJ9...' \
  -H 'user-agent: Mozilla/5.0...'
```

> **Why is this so useful?** You can:
> - Reproduce browser requests in your terminal or scripts
> - Debug exactly what the browser is sending
> - Share requests with teammates for debugging
> - Convert to Python/httpx code easily

### 🧠 Knowledge Check

**Q1:** What is the main benefit of the "Copy as cURL" feature?

- A) It copies the visual appearance of the website
- B) It generates a terminal command that perfectly replicates the browser's HTTP request, including all headers and cookies
- C) It downloads the file directly to your desktop
- D) It copies the JavaScript source code of the fetch request

<details>
<summary><b>Answer</b></summary>

**B** — "Copy as cURL" allows you to instantly recreate a browser request in your terminal for testing and debugging.

</details>

---

## The Console Tab

The Console is a JavaScript REPL (like Python's `>>>` prompt):

```javascript
// Try these in the Console:
console.log("Hello from DevTools!")
document.title                    // Get the page title
document.querySelectorAll('a')    // Find all links
fetch('/api/status').then(r => r.json()).then(console.log)
```

### Common use: Quick API test from Console

```javascript
// Make a GET request:
fetch('https://httpbin.org/get')
  .then(response => response.json())
  .then(data => console.log(data))

// Make a POST request:
fetch('https://httpbin.org/post', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({name: 'Alice', course: 'TDS'})
})
  .then(r => r.json())
  .then(console.log)
```

---

## The Elements Tab

Inspect and modify the live HTML/CSS of any page:

1. Right-click on any element → "Inspect"
2. The Elements tab highlights that element's HTML
3. On the right, you see its CSS styles
4. You can **edit** the HTML and CSS live (changes are temporary)

### Useful for:
- Understanding page structure
- Temporarily changing text/styles for screenshots
- Finding CSS selectors for web scraping

---

## The Application Tab

View and modify client-side storage:

```
Cookies:       Session tokens, preferences
Local Storage: Key-value pairs (persistent)
Session Storage: Key-value pairs (cleared on tab close)
```

### Viewing cookies

1. Go to Application tab → Cookies → select the domain
2. You'll see all cookies with their names, values, expiration, etc.

---

## Practical Workflow: Debugging an API Call

**Scenario:** You're calling an API from Python and getting a 401 error.

### Step-by-step debugging:

1. **Open the same API in the browser** — does it work?
2. **Open DevTools Network tab** → filter by "Fetch/XHR"
3. **Find the working request** → click it
4. **Compare headers** — what's the browser sending that your Python code isn't?
5. **Copy as cURL** → run in terminal → does it work?
6. **Compare your Python code** with the working cURL command
7. **Fix the missing/wrong header** in your Python code

---

## Q&A

<details>
<summary><b>Q: The Network tab is empty. Why?</b></summary>

**A:** DevTools only records requests that happen **after** you open it. You need to:
1. Open DevTools (`F12`)
2. Go to the Network tab
3. **Reload the page** (`Ctrl + R`)

Now you'll see all requests.

</details>

<details>
<summary><b>Q: What is XHR/Fetch?</b></summary>

**A:** XHR (XMLHttpRequest) and Fetch are browser APIs for making HTTP requests from JavaScript. When you filter by "Fetch/XHR" in the Network tab, you see only API calls (not images, CSS, or other static resources). This is where 99% of your API debugging happens.

</details>

<details>
<summary><b>Q: Can I modify requests in DevTools?</b></summary>

**A:** Not directly in the Network tab. But you can:
1. **Copy as cURL**, modify the command, and run it in terminal
2. Use the Console to make new requests with `fetch()`
3. Use tools like Postman or Requestly to intercept and modify requests

</details>

<details>
<summary><b>Q: Does DevTools work in other browsers?</b></summary>

**A:** Yes! Firefox, Edge, and Safari all have similar developer tools. The concepts are the same — only the UI differs slightly. Chrome DevTools is the most popular and well-documented.

</details>

---

## Exercises

**Exercise 1: Inspect a website**

1. Open [https://httpbin.org](https://httpbin.org) in Chrome
2. Open DevTools → Network tab
3. Reload the page
4. How many requests were made?
5. Find the main document request — what is its status code?

<details>
<summary><b>What to look for</b></summary>

- The main document request (type: `document`) should have status **200 OK**
- You'll see several other requests for CSS, JavaScript, images, etc.
- The total count varies but is typically 5-15 requests

</details>

---

**Exercise 2: Inspect an API call**

1. Open DevTools → Network tab → filter by "Fetch/XHR"
2. In the Console tab, run:
   ```javascript
   fetch('https://httpbin.org/get').then(r => r.json()).then(console.log)
   ```
3. Switch back to Network tab — you should see a new request
4. Click on it and explore: Headers, Preview, Response, Timing

<details>
<summary><b>What should you find?</b></summary>

- **Headers tab:** Request method is GET, status 200
- **Preview tab:** A JSON object with your IP, User-Agent, etc.
- **Response tab:** Same JSON as raw text
- **Timing tab:** Shows DNS lookup, connection, and response times

</details>

---

**Exercise 3: Copy as cURL**

1. From Exercise 2, right-click the `https://httpbin.org/get` request
2. Select "Copy" → "Copy as cURL"
3. Open your terminal and paste it
4. Run the command — does it return the same data?

<details>
<summary><b>Expected result</b></summary>

The cURL command should output JSON similar to:
```json
{
  "args": {},
  "headers": {
    "Accept": "*/*",
    "Host": "httpbin.org",
    "User-Agent": "curl/8.x.x"
  },
  "origin": "your.ip.address",
  "url": "https://httpbin.org/get"
}
```

Note: The `User-Agent` will say `curl` instead of `Mozilla` since you're now making the request from the terminal.

</details>

---

**Exercise 4: MCQ**

**Q1:** You want to see only API calls in the Network tab. Which filter should you use?

- A) All
- B) JS
- C) Fetch/XHR
- D) Doc

<details>
<summary><b>Answer</b></summary>

**C** — "Fetch/XHR" shows only API calls made by JavaScript (AJAX requests). This filters out static resources like images, CSS, and fonts.

</details>

---

**Q2:** What does "Copy as cURL" give you?

- A) The HTML of the page
- B) A terminal command to reproduce the exact same HTTP request
- C) The JavaScript source code
- D) A screenshot of the request

<details>
<summary><b>Answer</b></summary>

**B** — "Copy as cURL" creates a `curl` command with the exact same URL, headers, method, and body as the browser request. You can paste it into a terminal to reproduce the request.

</details>

---

**Q3:** The Network tab is empty after opening DevTools. What should you do?

- A) Close and reopen Chrome
- B) Reload the page
- C) Switch to the Console tab
- D) Clear the browser cache

<details>
<summary><b>Answer</b></summary>

**B** — DevTools only captures requests made after it's opened. Reloading the page makes the browser send all requests again, which DevTools then records.

</details>

---

