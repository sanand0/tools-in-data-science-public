# Day 4 — API Testing with curl

> **Goal:** Use `curl` to send HTTP requests from the terminal — GET, POST, headers, JSON bodies — so you can test and debug APIs without leaving the command line.

---

## What Is curl?

`curl` (Client URL) is a command-line tool for making HTTP requests. It comes pre-installed on most Linux systems.

```bash
curl --version
# curl 8.x.x ...
```

Think of `curl` as a browser for your terminal — but instead of rendering a web page, it shows you the raw HTTP response.

---

## Basic GET Request

```bash
# The simplest curl command:
curl https://httpbin.org/get
```

This sends a GET request and prints the response body. `httpbin.org` is a free API for testing HTTP requests.

### Useful flags for GET

```bash
# Show response headers too (-i = include headers):
curl -i https://httpbin.org/get

# Show ONLY headers (-I = head request):
curl -I https://httpbin.org/get

# Silent mode — hide progress bar (-s):
curl -s https://httpbin.org/get

# Follow redirects (-L):
curl -L https://httpbin.org/redirect/1

# Show verbose debug info (-v):
curl -v https://httpbin.org/get
```

### 🧠 Knowledge Check

**Q1:** You want to see both the response body and the HTTP headers that the server sends back. Which `curl` flag should you use?

- A) `-v`
- B) `-i`
- C) `-I`
- D) `-s`

<details>
<summary><b>Answer</b></summary>

**B** — `-i` includes the response headers in the output before the response body.

</details>

---

## GET with Query Parameters

Query parameters go after `?` in the URL:

```bash
# Single parameter:
curl "https://httpbin.org/get?name=Alice"

# Multiple parameters (use & to separate):
curl "https://httpbin.org/get?name=Alice&role=student&course=TDS"
```

> **Important:** Always put the URL in quotes if it contains `&`, `?`, or other special characters.

---

## Setting Headers

Use `-H` to add headers:

```bash
# Accept JSON:
curl -H "Accept: application/json" https://httpbin.org/get

# Multiple headers:
curl -H "Accept: application/json" \
     -H "X-Custom-Header: hello" \
     https://httpbin.org/headers

# Authorization header:
curl -H "Authorization: Bearer my-token-123" \
     https://httpbin.org/bearer
```

---

## POST Requests — Sending Data

### Sending JSON

```bash
# POST with JSON body (-d = data, -X = method):
curl -X POST https://httpbin.org/post \
     -H "Content-Type: application/json" \
     -d '{"name": "Alice", "age": 25}'
```

### Shorter way — POST is implied with `-d`

```bash
# curl automatically uses POST when you provide -d:
curl https://httpbin.org/post \
     -H "Content-Type: application/json" \
     -d '{"name": "Alice", "age": 25}'
```

### Sending form data

```bash
# URL-encoded form data (like an HTML form):
curl -X POST https://httpbin.org/post \
     -d "name=Alice&age=25"

# File upload:
curl -X POST https://httpbin.org/post \
     -F "file=@myfile.txt"
```

### Reading data from a file

```bash
# Create a JSON file:
echo '{"name": "Alice", "email": "alice@example.com"}' > /tmp/user.json

# Send it:
curl -X POST https://httpbin.org/post \
     -H "Content-Type: application/json" \
     -d @/tmp/user.json
```

### 🧠 Knowledge Check

**Q1:** What does the `-d` flag in curl do?

- A) Downloads a file
- B) Deletes a resource
- C) Sends data as the request body and automatically sets the method to POST
- D) Disables SSL verification

<details>
<summary><b>Answer</b></summary>

**C** — The `-d` (or `--data`) flag sends the specified data in the request body. When used, `curl` automatically assumes you want to make a `POST` request.

</details>

---

## PUT, PATCH, DELETE Requests

```bash
# PUT — replace a resource:
curl -X PUT https://httpbin.org/put \
     -H "Content-Type: application/json" \
     -d '{"name": "Alice Updated", "age": 26}'

# PATCH — partial update:
curl -X PATCH https://httpbin.org/patch \
     -H "Content-Type: application/json" \
     -d '{"age": 26}'

# DELETE — remove a resource:
curl -X DELETE https://httpbin.org/delete
```

---

## Working with the Response

### Saving response to a file

```bash
# Save response body:
curl -s https://httpbin.org/get -o response.json

# Save to file named from URL:
curl -s -O https://example.com/data.csv
```

### Piping to other tools

```bash
# Pretty-print JSON with jq:
curl -s https://httpbin.org/get | jq .

# Extract specific fields:
curl -s https://httpbin.org/get | jq '.headers."User-Agent"'

# Count response size:
curl -s https://httpbin.org/get | wc -c

# Search response:
curl -s https://httpbin.org/get | grep "origin"
```

### Getting just the status code

```bash
# Output only the HTTP status code:
curl -s -o /dev/null -w "%{http_code}\n" https://httpbin.org/get
# 200

curl -s -o /dev/null -w "%{http_code}\n" https://httpbin.org/status/404
# 404
```

---

## Authentication with curl

### Basic auth

```bash
curl -u "username:password" https://httpbin.org/basic-auth/username/password
```

### Bearer token

```bash
curl -H "Authorization: Bearer my-token-123" https://httpbin.org/bearer
```

### API key in header

```bash
curl -H "X-API-Key: abc123" https://api.example.com/data
```

---

## Debugging with `-v` (Verbose)

The `-v` flag shows the full request and response:

```bash
curl -v https://httpbin.org/get
```

```
* Trying 34.193.x.x:443...
* Connected to httpbin.org
> GET /get HTTP/2                    ← request line
> Host: httpbin.org                  ← request headers
> User-Agent: curl/8.x.x
> Accept: */*
>
< HTTP/2 200                         ← response status
< content-type: application/json     ← response headers
< content-length: 256
<
{                                     ← response body
  "args": {},
  "headers": {...},
  ...
}
```

Lines starting with `>` are what you sent. Lines starting with `<` are what the server returned.

---

## curl Cheatsheet

| Flag | What it does | Example |
|---|---|---|
| `-X METHOD` | Set HTTP method | `-X POST`, `-X DELETE` |
| `-H "..."` | Add a header | `-H "Content-Type: application/json"` |
| `-d '...'` | Send data (body) | `-d '{"key": "value"}'` |
| `-d @file` | Send data from file | `-d @data.json` |
| `-i` | Include response headers | `curl -i url` |
| `-I` | Headers only (HEAD request) | `curl -I url` |
| `-s` | Silent (no progress bar) | `curl -s url` |
| `-v` | Verbose (debug) | `curl -v url` |
| `-L` | Follow redirects | `curl -L url` |
| `-o file` | Save output to file | `-o response.json` |
| `-u user:pass` | Basic authentication | `-u admin:secret` |
| `-w "format"` | Custom output format | `-w "%{http_code}"` |
| `-F "key=val"` | Form/file upload | `-F "file=@photo.jpg"` |

---

## Q&A

<details>
<summary><b>Q: What is the difference between <code>-d</code> and <code>-F</code>?</b></summary>

**A:**
- `-d` sends data as the request body (typically JSON or form-encoded)
- `-F` sends data as `multipart/form-data` — used for file uploads

```bash
# -d: JSON data
curl -d '{"name": "Alice"}' -H "Content-Type: application/json" url

# -F: file upload
curl -F "photo=@selfie.jpg" -F "caption=My photo" url
```

</details>

<details>
<summary><b>Q: How do I send a POST with an empty body?</b></summary>

**A:**
```bash
curl -X POST https://api.example.com/action -d ''
# or:
curl -X POST https://api.example.com/action -H "Content-Length: 0"
```

</details>

<details>
<summary><b>Q: How do I install <code>jq</code> for pretty-printing JSON?</b></summary>

**A:**
```bash
sudo apt install jq -y

# Now you can:
curl -s https://httpbin.org/get | jq .        # pretty-print
curl -s https://httpbin.org/get | jq '.origin' # extract field
```

`jq` is an essential tool for working with JSON on the command line.

</details>

<details>
<summary><b>Q: Can I use curl with HTTPS?</b></summary>

**A:** Yes, curl handles HTTPS by default. It verifies SSL certificates automatically. If you get certificate errors on a dev/test server, you can skip verification with `-k` (insecure — only for testing):
```bash
curl -k https://self-signed-server.local/api
```

</details>

---

## Exercises

**Exercise 1: Basic GET requests**

```bash
# 1. Fetch your public IP:
curl -s https://httpbin.org/ip

# 2. Get just the status code of google.com:
curl -s -o /dev/null -w "%{http_code}\n" https://www.google.com

# 3. Get the headers of github.com:
curl -I https://github.com
```

<details>
<summary><b>Expected results</b></summary>

```bash
# 1. Your IP in JSON:
{"origin": "your.ip.address"}

# 2. Status code (after redirects):
200

# 3. Response headers including:
HTTP/2 200
content-type: text/html; charset=utf-8
server: GitHub.com
...
```

</details>

---

**Exercise 2: POST with JSON**

Send a POST request to httpbin with your name and course:

```bash
curl -s -X POST https://httpbin.org/post \
     -H "Content-Type: application/json" \
     -d '{"name": "YOUR_NAME", "course": "TDS", "year": 2026}'
```

<details>
<summary><b>What should you see?</b></summary>

httpbin echoes back your request. Look for the `json` field in the response:

```json
{
  "json": {
    "name": "YOUR_NAME",
    "course": "TDS",
    "year": 2026
  },
  ...
}
```

This confirms the server received your JSON data correctly.

</details>

---

**Exercise 3: Headers and authentication**

```bash
# 1. Send a custom header:
curl -s https://httpbin.org/headers \
     -H "X-Student-Name: Alice" \
     -H "X-Course: TDS" | jq '.headers'

# 2. Test basic auth (username: testuser, password: testpass):
curl -s -u "testuser:testpass" https://httpbin.org/basic-auth/testuser/testpass

# 3. Test with WRONG password — what status code do you get?
curl -s -o /dev/null -w "%{http_code}\n" \
     -u "testuser:wrongpass" https://httpbin.org/basic-auth/testuser/testpass
```

<details>
<summary><b>Answers</b></summary>

1. You'll see your custom headers in the response:
   ```json
   {"X-Course": "TDS", "X-Student-Name": "Alice", ...}
   ```

2. Successful auth returns:
   ```json
   {"authenticated": true, "user": "testuser"}
   ```

3. Wrong password returns status code **401** (Unauthorized).

</details>

---

**Exercise 4: Chain curl with jq**

```bash
# Install jq if not present:
sudo apt install jq -y

# Fetch data and extract specific fields:
curl -s https://httpbin.org/get | jq '{ip: .origin, agent: .headers."User-Agent"}'
```

<details>
<summary><b>Expected output</b></summary>

```json
{
  "ip": "your.ip.address",
  "agent": "curl/8.x.x"
}
```

`jq` extracted just the fields you asked for from the full response.

</details>

---

**Exercise 5: MCQ**

**Q1:** What does `curl -s -o /dev/null -w "%{http_code}\n" URL` output?

- A) The full response body
- B) The response headers
- C) Just the HTTP status code
- D) The URL itself

<details>
<summary><b>Answer</b></summary>

**C** — This clever combination:
- `-s` = silent (no progress bar)
- `-o /dev/null` = discard the response body
- `-w "%{http_code}\n"` = print just the status code

</details>

---

**Q2:** Which flag makes curl show the full request AND response debug info?

- A) `-s`
- B) `-v`
- C) `-i`
- D) `-I`

<details>
<summary><b>Answer</b></summary>

**B** — `-v` (verbose) shows the full request headers (lines starting with `>`) and response headers (lines starting with `<`), plus connection details.

</details>

---

**Q3:** You need to send `{"action": "start"}` as a POST request. Which curl command is correct?

- A) `curl -X GET url -d '{"action": "start"}'`
- B) `curl url -H "Content-Type: application/json" -d '{"action": "start"}'`
- C) `curl url -d "action=start"`
- D) `curl -X POST url -d {"action": "start"}`

<details>
<summary><b>Answer</b></summary>

**B** — This sets the Content-Type to JSON and sends the JSON body. `-d` implies POST automatically. Option D is missing quotes around the JSON.

</details>

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

