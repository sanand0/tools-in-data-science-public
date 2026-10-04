# Module 3: HTTP & Chrome DevTools

By the end, you can:

- Send a web request and inspect its response.
- Find the request behind a browser action.
- Change a page locally and explain why a reload removes the edit.

**Bring:**

- Chrome, curl and `~/bridge-lab`.
- Invented practice data for [httpbin](https://httpbin.org/), which echoes what you send.

<style>
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
