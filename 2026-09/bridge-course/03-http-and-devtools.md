# Module 3: HTTP & Chrome DevTools

By the end, you can:

- Send a web request and inspect its response.
- Find the request behind a browser action.
- Change a page locally and explain why a reload removes the edit.

**Bring:**

- Chrome, curl and `~/bridge-lab`.
- Invented practice data for [httpbin](https://httpbin.org/), which echoes what you send.

<style>
.markdown .bridge-roadmap {
  margin: 1.5rem 0;
  padding: clamp(1rem, 3vw, 2rem);
  border: 1px solid var(--roadmap-track);
  border-radius: 1.25rem;
  background: linear-gradient(145deg, #fff, var(--roadmap-soft));
  color: #243746;
}
.markdown .bridge-roadmap .roadmap-eyebrow {
  margin: 0 0 0.5rem;
  color: var(--roadmap-accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.markdown .bridge-roadmap .roadmap-intro { margin: 0; line-height: 1.65; }
.markdown .bridge-roadmap svg { display: block; width: 100%; height: auto; margin: 1rem 0; }
.markdown .bridge-roadmap .roadmap-stops {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.markdown .bridge-roadmap .roadmap-stops > li,
.markdown .bridge-roadmap .roadmap-challenge {
  min-width: 0;
  margin: 0;
  padding: 1.1rem;
  border: 1px solid var(--roadmap-track);
  border-radius: 0.85rem;
  background: #fff;
}
.markdown .bridge-roadmap .roadmap-stops > .roadmap-stretch { border-color: #e7c1a6; background: #fffaf5; }
.markdown .bridge-roadmap .roadmap-challenge { margin-bottom: 1.25rem; }
.markdown .bridge-roadmap .roadmap-featured {
  border-color: transparent;
  background: linear-gradient(135deg, #f2fbf8, #f7f4ff) padding-box,
    linear-gradient(115deg, #087e70, #7963bd, #087e70, #7963bd) border-box;
  background-size: 100% 100%, 300% 100%;
  background-position: 0 0, 0% 50%;
  box-shadow: 0 4px 18px #087e7015;
}
.markdown .bridge-roadmap .roadmap-step { display: flex; align-items: center; gap: 0.65rem; }
.markdown .bridge-roadmap .roadmap-number {
  display: grid;
  place-items: center;
  flex: 0 0 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--roadmap-soft);
  color: var(--roadmap-accent);
  font-size: 0.8rem;
  font-weight: 700;
}
.markdown .bridge-roadmap .roadmap-level { color: var(--roadmap-accent); font-size: 0.8rem; font-weight: 700; }
.markdown .bridge-roadmap .roadmap-challenge-label {
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #087e70, #6350a5);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}
.markdown .bridge-roadmap .roadmap-featured h3 a { font-weight: 700; }
.markdown .bridge-roadmap .roadmap-stretch .roadmap-number { background: #fbe9d9; color: #934321; }
.markdown .bridge-roadmap .roadmap-stretch .roadmap-level { color: #934321; }
.markdown .bridge-roadmap h3 { margin: 0.8rem 0 0.35rem; font-size: 1.1rem; line-height: 1.4; }
.markdown .bridge-roadmap a { color: var(--roadmap-accent); text-decoration: underline; text-underline-offset: 0.2em; }
.markdown .bridge-roadmap a:hover { color: #934321; }
.markdown .bridge-roadmap a:focus-visible { outline: 2px solid var(--roadmap-accent); outline-offset: 4px; border-radius: 2px; }
.markdown .bridge-roadmap code { padding: 0.1em 0.25em; border-radius: 0.2rem; background: var(--roadmap-soft); color: #243746; overflow-wrap: anywhere; }
.markdown .bridge-roadmap li p,
.markdown .bridge-roadmap .roadmap-challenge p { margin: 0.65rem 0 0; font-size: 0.9rem; line-height: 1.6; }
.markdown .bridge-roadmap li .roadmap-access,
.markdown .bridge-roadmap .roadmap-challenge .roadmap-access { margin: 0; color: #526373; font-size: 0.75rem; }
.markdown .bridge-roadmap li .roadmap-checkpoint,
.markdown .bridge-roadmap .roadmap-challenge .roadmap-checkpoint { padding-top: 0.65rem; border-top: 1px solid #dce3e8; }
.markdown .bridge-roadmap .roadmap-note { margin: 1rem 0 0; font-size: 0.85rem; line-height: 1.6; }
@media (max-width: 600px) {
  .markdown .bridge-roadmap .roadmap-stops { grid-template-columns: 1fr; }
  .markdown .bridge-roadmap .roadmap-svg-label { display: none; }
}
@media (prefers-reduced-motion: no-preference) {
  .markdown .bridge-roadmap .roadmap-stops > li { transition: box-shadow 160ms ease; }
  .markdown .bridge-roadmap .roadmap-stops > li:hover { box-shadow: 0 4px 16px #24374612; }
  .markdown .bridge-roadmap .roadmap-featured { animation: tds-roadmap-flow 12s linear infinite; }
}
@keyframes tds-roadmap-flow {
  0%, 100% { background-position: 0 0, 0% 50%; }
  50% { background-position: 0 0, 100% 50%; }
}
.markdown #game {
  margin: 1.5rem 0;
  border-inline-start: 4px solid var(--color-link);
  border-radius: 0.5rem;
  background: var(--gray-100);
}
.markdown #game > summary { color: var(--color-link); line-height: 1.4; }
.markdown #game > summary strong { font-size: 1.125rem; }
.markdown #game > summary span {
  display: block;
  margin-top: 0.35rem;
  color: var(--body-font-color);
  font-size: 0.875rem;
  font-weight: normal;
}
.markdown #game > summary:focus-visible { outline: 2px solid var(--color-link); outline-offset: 3px; }
.markdown #game details > summary::before { transform: rotate(0deg); }
.markdown #game details[open] > summary::before { transform: rotate(90deg); }
</style>

## Practice roadmap

<section class="bridge-roadmap" aria-label="TDS Games challenge and three HTTP and DevTools practice levels" style="--roadmap-accent: #087e70; --roadmap-soft: #edf7f3; --roadmap-track: #bddbd1;">
<p class="roadmap-eyebrow">Start where you are · Choose your target</p>
<p class="roadmap-intro">Try Mayank's TDS Games challenge. Build your skills with 01 for browser investigation, 02 for API testing, and 03 for Natas web-security puzzles. Choose your starting level; use the request and Network labs below when you need a foundation.</p>
<svg viewBox="0 0 880 216" role="img" aria-labelledby="http-roadmap-title http-roadmap-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="http-roadmap-title">Your HTTP and DevTools learning roadmap</title>
  <desc id="http-roadmap-desc">An unnumbered TDS Games challenge by Mayank connects to three practice levels: 01 SolveJS for browser investigation, 02 API Challenges for testing, and 03 Natas for web-security puzzles.</desc>
  <defs>
    <linearGradient id="http-roadmap-featured-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#087e70"/>
      <stop offset="100%" stop-color="#6350a5"/>
    </linearGradient>
  </defs>
  <path d="M90 140C185 140 205 66 320 66S430 140 550 140S670 66 780 66S830 66 850 66" fill="none" stroke="#bddbd1" stroke-width="16" stroke-linecap="round"/>
  <path d="M90 140C185 140 205 66 320 66S430 140 550 140S670 66 780 66S830 66 850 66" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="7 10"/>
  <g text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="700">
    <circle cx="90" cy="140" r="31" fill="url(#http-roadmap-featured-gradient)" stroke="#fff" stroke-width="3"/>
    <path d="M80 129L69 140L80 151M100 129L111 140L100 151M94 125L86 155" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="320" cy="66" r="31" fill="#fff" stroke="#087e70" stroke-width="3"/>
    <text x="320" y="76" fill="#087e70">01</text>
    <circle cx="550" cy="140" r="31" fill="#fff" stroke="#087e70" stroke-width="3"/>
    <text x="550" y="150" fill="#087e70">02</text>
    <circle cx="780" cy="66" r="31" fill="#fff0e3" stroke="#934321" stroke-width="3"/>
    <text x="780" y="76" fill="#934321">03</text>
  </g>
  <g class="roadmap-svg-label" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#243746">
    <text x="90" y="188">Challenge</text>
    <text x="90" y="208" font-size="14" fill="#087e70">TDS Games</text>
    <text x="320" y="121">Investigate</text>
    <text x="550" y="195">Test</text>
    <text x="780" y="121" fill="#934321">Unlock</text>
  </g>
  <path d="M850 66V24" stroke="#243746" stroke-width="3"/>
  <path d="M852 24H876L868 34L876 44H852Z" fill="#934321"/>
  <circle cx="185" cy="44" r="6" fill="#bddbd1"/>
  <circle cx="437" cy="184" r="5" fill="#edbf8d"/>
  <path d="M639 190L656 163L674 190Z" fill="#edf7f3"/>
</svg>
<article class="roadmap-challenge roadmap-featured" aria-labelledby="tds-games-challenge">
  <div class="roadmap-step"><span class="roadmap-challenge-label">Challenge</span><span class="roadmap-level">DevTools · Debug</span></div>
  <h3 id="tds-games-challenge"><a href="https://tds-games.mynkpdr.in/" target="_blank" rel="noopener">TDS Games · Debug Paradox ↗</a></h3>
  <p class="roadmap-access">Made by Mayank · Chrome DevTools · Sign in to play</p>
  <p>Read the <a href="https://tds-games.mynkpdr.in/2026-09/#guide" target="_blank" rel="noopener">workshop guide ↗</a>, then investigate the game's twelve broken campus systems. Look for clues in response headers, HTML comments and console output. Use Network, Elements and Console to test one hypothesis at a time, then explain the evidence behind each solution.</p>
  <p class="roadmap-checkpoint"><strong>Challenge goal:</strong> solve three scenarios and record the clue, DevTools panel and action that led to each solution.</p>
</article>
<ol class="roadmap-stops">
  <li>
    <div class="roadmap-step"><span class="roadmap-number">01</span><span class="roadmap-level">Foundation · Investigate</span></div>
    <h3><a href="https://solvejs.com/challenges/recon?lang=en" target="_blank" rel="noopener">SolveJS: DevTools puzzles ↗</a></h3>
    <p class="roadmap-access">Browser · Free account for full catalog · Selected demos without login</p>
    <p>Recover a response-header or XHR flag in <strong>Find the flag</strong>. Then solve <strong>The role cookie</strong> and the Medium <strong>Forged role token</strong> puzzle in <a href="https://solvejs.com/challenges/tamper?lang=en" target="_blank" rel="noopener">Tamper the request</a>. Compare requests before and after changing the cookie.</p>
    <p class="roadmap-checkpoint"><strong>Move on when:</strong> three puzzles pass and you can locate response evidence and explain how cookie changes affected the server reply.</p>
  </li>
  <li>
    <div class="roadmap-step"><span class="roadmap-number">02</span><span class="roadmap-level">Intermediate · Test</span></div>
    <h3><a href="https://apichallenges.com/gui/challenges" target="_blank" rel="noopener">API Challenges ↗</a></h3>
    <p class="roadmap-access">Free · curl or API client · Temporary challenger ID; no personal account</p>
    <p>Create a session with <code>POST /api/challenger</code> and reuse its <code>X-CHALLENGER</code> header. Complete a TODO create/read/update/delete cycle, then filtering, pagination, unsupported Content-Type and failed-authentication challenges. Use the board's API documentation to construct your requests.</p>
    <p class="roadmap-checkpoint"><strong>Move on when:</strong> eight relevant board entries pass and you can explain the difference between a <code>415</code> input-format rejection and a <code>401</code> authentication failure.</p>
  </li>
  <li class="roadmap-stretch">
    <div class="roadmap-step"><span class="roadmap-number">03</span><span class="roadmap-level">Optional stretch · Unlock</span></div>
    <h3><a href="https://overthewire.org/wargames/natas/" target="_blank" rel="noopener">OverTheWire · Natas ↗</a></h3>
    <p class="roadmap-access">Free · Browser + DevTools or curl · Published starter credentials</p>
    <p>Use the game mission below to reach <code>natas3</code>, then attempt the next levels independently. Each recovered password opens the next level's website. Inspect page content and requests, replay them with curl when useful, and keep notes on why each clue works. Continue beyond the guided levels toward your own target.</p>
    <p class="roadmap-checkpoint"><strong>Target:</strong> reach <code>natas6</code> and explain three independently solved levels using request, response or page evidence.</p>
  </li>
</ol>
<p class="roadmap-note">Build request skills in labs 3.1–3.2 and the <a href="#network-lab">Network lab</a>. Save your API Challenges session before breaks; idle data may expire. Keep recovered Natas passwords out of your lab notes and practise only on the named game hosts.</p>
</section>

<details class="bridge-game" id="game">
<summary><strong>Game mission: Natas</strong><span>Look behind the page. Find the next clue. | 3 challenges</span></summary>

## Start here

- **Game:** [Natas](https://overthewire.org/wargames/natas/), a web-security training game.
- **Flow:** find a password → open the next level's URL → enter it in the browser's login dialog.
- **Goal:** log into `natas3`.
- **Scope:** use only the designated game hosts.

1. Open [Level 0](http://natas0.natas.labs.overthewire.org/) in Chrome.
2. In the **browser's login dialog**, enter `natas0` for both **Username** and **Password**, then click **Sign in**.
3. Check the page heading is `natas0`, then start Challenge 1.

- **Private notes:** keep recovered passwords outside `bridge-lab`.

<details>
<summary>Where does the password go? Browser login vs “Submit token”</summary>

- **To advance:** open the next Natas URL. Enter that level's username and the recovered password in the browser's login dialog (HTTP Basic authentication).
- **`realwechallform` / “Submit token”:** submits to `wechall.net` for the optional [WeChall scoreboard](https://overthewire.org/information/wechall.html); leave it unchanged for this lab.
- **`type="hidden"`:** hides those fields from the page; it does not disable them. Revealing or editing them does not open the next Natas level.

</details>

### Challenge 1: Inspect the HTML comment (Level 0 → 1)

1. Right-click the page → **Inspect**.
2. Select **Elements** and expand `<body>` → `<div id="content">`.
3. Look for a comment: `<!-- ... -->`.

<details>
<summary>Walkthrough: read the hidden comment</summary>

1. Inside `div#content`, find the comment identifying the password for `natas1`.
2. Copy only the password, without the surrounding comment text.
3. Open [Level 1](http://natas1.natas.labs.overthewire.org/) in a new tab.
4. In the browser's login dialog, enter **Username:** `natas1`.
5. Paste the recovered value into **Password**, then click **Sign in**.

- **Success:** the page heading is `natas1`.
- **Lesson:** HTML comments can contain information that the visible page does not display.

</details>

### Challenge 2: Inspect when right-click is blocked (Level 1 → 2)

1. Try right-clicking; the page blocks the menu.
2. Open DevTools with **Ctrl+Shift+I** (Windows/Linux) or **Cmd+Option+I** (macOS).
3. Select **Elements** and inspect the HTML again.

<details>
<summary>Walkthrough: use the keyboard to open DevTools</summary>

1. Expand `<body>` → `<div id="content">` in **Elements**.
2. Find the comment identifying the password for `natas2`.
3. Copy only that password.
4. Open [Level 2](http://natas2.natas.labs.overthewire.org/) in a new tab.
5. In the browser's login dialog, enter **Username:** `natas2`.
6. Paste the recovered value into **Password**, then click **Sign in**.

- **Success:** the page heading is `natas2`.
- **Lesson:** blocking right-click does not prevent you from inspecting the page's HTML.

</details>

### Challenge 3: Follow the image's HTML path (Level 2 → 3)

1. Right-click → **Inspect** and open **Elements**.
2. Expand `<body>` → `<div id="content">`.
3. Find the `<img>` tag and read its `src` path.

<details>
<summary>Walkthrough: follow the resource path</summary>

1. Find `<img src="files/pixel.png">`; the clue is the `files/` directory.
2. In the authenticated Level 2 tab, change the address to `http://natas2.natas.labs.overthewire.org/files/`.
3. Open `users.txt` from the directory listing.
4. Find the `natas3` entry; copy the password after its colon.
5. Open [Level 3](http://natas3.natas.labs.overthewire.org/) in a new tab.
6. In the browser's login dialog, enter **Username:** `natas3`.
7. Paste the password from `users.txt` into **Password**, then click **Sign in**.

- **Success:** the page heading is `natas3`.
- **Lesson:** an HTML resource path can reveal a directory containing other files.

</details>

**Stuck?**

- **Comment missing:** expand `div#content`. In DevTools settings → **Preferences → Elements**, enable **Show HTML comments** if disabled.
- **Find a clue:** click inside **Elements**, press **Ctrl+F** / **Cmd+F**, and search for `password` or `pixel.png`.
- **`401`:** match the username to the hostname and use the previous level's password, without comment markers or extra spaces.
- **No login dialog:** if the correct level already loads, the browser has remembered its credentials; continue from that page.
- **Reference:** [official Natas instructions](https://overthewire.org/wargames/natas/) · [Chrome's Elements guide](https://developer.chrome.com/docs/devtools/dom).

**Keep the skill:**

1. Record each clue's location and why it worked in `notes/http.txt`.
2. Leave out passwords and copied credential-bearing requests.
3. Try Level 3 independently using the [official game description](https://overthewire.org/wargames/natas/).

</details>

## Your lab

<details name="module-3">
<summary><strong>3.1 · Send a request and read the reply</strong></summary>

```bash
curl -i 'https://httpbin.org/get?topic=python&module=3'
```

**Check:**

- **Status:** a success response.
- **Content-Type:** JSON.
- **`args`:** both query values appear.

**Read the command:**

- `-i` includes response headers.
- Quotes keep the shell from treating `&` as a background-command operator.

- **Client:** curl or a browser sends a request.
- **Server:** returns a response.
- **HTTPS:** encrypts the transport.

```text
Client -- method + URL + headers + optional body --> Server
Client <-- status + headers + response body -------- Server
```

| URL part | In this request |
| --- | --- |
| Scheme / host | `https` / `httpbin.org` |
| Path | `/get` |
| Query parameters | `topic=python`, `module=3` |

- **Endpoint:** an address that accepts requests.
- **API:** defines how software can use endpoints.
- **JSON:** a text data format; `{"module":3,"ready":true}` contains a number and a boolean.
- **JSON syntax:** keys and strings use double quotes.

**Your turn:**

1. Change only `topic`.
2. Predict which response field changes, then run again.
3. Save and format the body:

```bash
cd ~/bridge-lab
curl -sS 'https://httpbin.org/get?topic=linux' -o notes/http-get.json
python3 -m json.tool notes/http-get.json
```

- **`-sS`:** hides progress but shows errors.
- **`-o`:** writes the body to a file.
- **Check:** the formatted `args` contains `"topic": "linux"`.

**If formatting fails:**

1. Inspect the file; a service error may return HTML instead of JSON.
2. Record the status/error.
3. Retry later.

</details>

<details name="module-3">
<summary><strong>3.2 · Compare bodies, methods and status codes</strong></summary>

Send a JSON body:

```bash
curl -i 'https://httpbin.org/post' \
  -H 'Content-Type: application/json' \
  -d '{"learner":"Explorer","module":3}'
```

- **`-H`:** adds a request header.
- **`-d`:** supplies a body and selects POST by default.
- **Backslashes:** continue this command across lines.
- **Check:** your object appears in the response's `json` field.

| Part | Question it answers |
| --- | --- |
| Method and URL | What action, at which address? |
| Request headers and body | What extra information/data did I send? |
| Status and response headers | What happened; what type of data came back? |
| Response body | What did the server return? |

### Try methods

```bash
curl -i -X PUT 'https://httpbin.org/put' -H 'Content-Type: application/json' -d '{"ready":true}'
curl -i -X PATCH 'https://httpbin.org/patch' -H 'Content-Type: application/json' -d '{"topic":"git"}'
curl -i -X DELETE 'https://httpbin.org/delete'
```

- **`-X`:** chooses a method explicitly.
- **GET:** retrieves data.
- **POST:** submits data.
- **PUT:** commonly replaces a resource.
- **PATCH:** changes part of a resource.
- **DELETE:** requests removal.
- **httpbin:** echoes these actions; it does not maintain a learner record.

### Predict a response

```bash
curl -i 'https://httpbin.org/status/404'
curl -i 'https://httpbin.org/status/500'
curl -i 'https://httpbin.org/redirect/1'
curl -i -L 'https://httpbin.org/redirect/1'
```

| Family | Meaning | Example |
| --- | --- | --- |
| `2xx` | Success | `200` |
| `3xx` | Redirect | `302`; `-L` follows it |
| `4xx` | Request cannot be fulfilled as sent | `401` authentication required; `404` not found |
| `5xx` | Server-side failure | `500` |

**Check:**

1. Compare the two redirect calls.
2. Find the successive response headers shown by `-i -L`.

**Your turn:**

1. Record one method, status and echoed field in `notes/http.txt`.
2. Explain whether `404` is the same as a connection timeout.

<details>
<summary>Check your explanation</summary>

- **`404`:** an HTTP response arrived, but the resource was not found.
- **Timeout or DNS failure:** may occur before any HTTP response arrives.
- **Response received:** does not guarantee success.

</details>

</details>

<details name="module-3" id="network-lab">
<summary><strong>3.3 · Find the request behind an action</strong></summary>

Open Chrome's [Network demo](https://chrome.dev/devtools-network-activity/getstarted.html).

1. Open DevTools → **Network**, then reload; each row is a request/resource.
2. Click **Get Data** on the demo.
3. Filter for `getstarted.json` and select it.
4. In **Headers**, find Request URL, Request Method and Status Code.
5. Compare request and response headers.
6. Read **Response** (raw data), **Preview** (formatted view) and **Timing** (timeline).

**Check:**

- Name the action that caused the request.
- Find one returned value.
- For panel help, use the [official tutorial](https://developer.chrome.com/docs/devtools/network).

### Replay your own harmless request

1. Open **Network**, then visit `https://httpbin.org/get?topic=browser`.
2. Select its document request.
3. Right-click → **Copy → Copy as cURL**.
4. Inspect the command, then run it in your terminal.

- **Compare:** the endpoint and query match; headers may differ.
- **Private requests:** commands from signed-in sites may contain cookies/tokens. Do not share them.

### Explore suggestions

1. Open [Google Search](https://www.google.com/) and clear Network.
2. Type `weather in ch` without submitting.
3. Inspect new requests for your query and suggestion data.
4. Try **Fetch/XHR**, then **All** if needed.

- **Record:** host/path, method/status and evidence connecting the response to the suggestions.
- **Evidence:** `suggest` in a filename is a clue; verify the response data.
- **Fallback:** results vary by region/session. If no request appears, use the Get Data demo.
- **API distinction:** an internal endpoint may not be a supported public API.

</details>

<details name="module-3">
<summary><strong>3.4 · Change what your browser displays</strong></summary>

- **Elements:** shows the DOM, the browser's current page representation.

On Google's homepage:

1. Right-click the logo → **Inspect**, or use the element picker: Ctrl+Shift+C / Cmd+Option+C.
2. Select the image or its wrapper. Under `element.style` in **Styles**, add:

   ```css
   filter: grayscale(1);
   transform: rotate(-8deg);
   ```

3. Uncheck each property to compare its effect.
4. Reload; with normal settings and no local overrides, the edits disappear.

- **Check:** explain why only your page view changed.
- **Fallback:** if the doodle is difficult to select, edit a heading in the [official DOM demo](https://developer.chrome.com/docs/devtools/dom).

**Your turn:**

1. Load a page, then disconnect from the network.
2. Edit its style.
3. Explain why editing the existing DOM can work while fetching a new page cannot.

</details>

## Finish without copying

1. Inspect a new request.
2. Identify its method, URL, status and one response value.
3. Explain which browser action triggered it and how you know.

- [ ] I reached `natas3` and can explain all three clues.
- [ ] I sent GET and POST requests and found my input in the replies.
- [ ] I distinguished an HTTP error from a connection failure.
- [ ] I changed a page locally and verified what reload did.

**Explore:**

1. Try httpbin's `/headers` endpoint with `-H 'X-Lab: bridge'`.
2. Predict where your custom header appears, then verify it.
3. Keep observations in `notes/http.txt`.

---

**Next:** [Module 4: Git & GitHub →](../04-git-and-github/)
