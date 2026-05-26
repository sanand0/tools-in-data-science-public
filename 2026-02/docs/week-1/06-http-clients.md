# 06 · HTTP Clients

?> **TL;DR**
?> Before you write a single line of Python to talk to an API, test it with an HTTP client. **curl** is in every Linux/macOS/Windows (since 2018) install. **httpie** is curl for humans. **Postman** is for saving and sharing collections of requests.

## Why Learn Multiple Clients?

Each has its sweet spot:

| Client | Best for |
|--------|----------|
| **curl** | Scripts, CI, server-side automation, docs (every API doc uses it) |
| **httpie** | Exploring APIs interactively with clean output |
| **Postman / Requestly API Client** | Saving request collections, teams, environments, pre-request scripts |
| **VS Code REST Client extension** | Requests checked into Git alongside your code |

## curl — The Universal Client

`curl` is preinstalled on macOS, most Linux distros, and Windows 10+.

### The 80% you need

```bash
# GET
curl https://api.github.com/users/octocat

# GET with headers
curl -H "Accept: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     https://api.github.com/user

# POST JSON
curl -X POST https://httpbin.org/post \
     -H "Content-Type: application/json" \
     -d '{"name": "Alice", "role": "admin"}'

# POST from a file
curl -X POST https://httpbin.org/post \
     -H "Content-Type: application/json" \
     -d @payload.json

# Follow redirects, show headers, verbose
curl -L -i -v https://example.com

# Download a file
curl -O https://example.com/big.zip       # save as big.zip
curl -o out.zip https://example.com/big.zip
```

### Useful flags

| Flag | Purpose |
|------|---------|
| `-X METHOD` | Set HTTP method (`GET`, `POST`, `PUT`, ...) |
| `-H "K: V"` | Add a header |
| `-d "data"` | Request body |
| `-d @file` | Body from file |
| `-F "file=@path"` | Multipart upload |
| `-u user:pass` | Basic auth |
| `-o file` / `-O` | Write response body to file |
| `-i` | Include response headers in output |
| `-I` | HEAD request (headers only) |
| `-L` | Follow redirects |
| `-v` | Verbose (see full request/response) |
| `-s` | Silent (for scripting) |
| `-w "%{http_code}"` | Print HTTP status code |
| `--fail-with-body` | Exit non-zero on 4xx/5xx, still show body |

### Real-world curl patterns

```bash
# Piping to jq for pretty JSON
curl -s https://api.github.com/users/octocat | jq .

# Save cookies and reuse
curl -c cookies.txt -b cookies.txt https://example.com/login

# Upload a file via multipart
curl -X POST https://httpbin.org/post \
     -F "file=@report.pdf" \
     -F "description=Q3 report"

# Test a GraphQL endpoint
curl -X POST https://api.example.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ viewer { login name } }"}'

# Download everything (resume + retries)
curl -L -C - --retry 5 --retry-delay 2 -O https://example.com/data.zip
```

## httpie — curl for humans

`httpie` makes output colorful, pretty-prints JSON, and uses a cleaner command syntax.

```bash
# Install
brew install httpie
# or
sudo apt install httpie
# or
uv tool install httpie
```

### The syntax

```bash
# GET
http GET https://api.github.com/users/octocat
# Or shorter:
http api.github.com/users/octocat

# POST JSON (httpie assumes JSON by default)
http POST httpbin.org/post name=Alice role=admin
# Equivalent to:
# curl -X POST ... -d '{"name": "Alice", "role": "admin"}'

# Headers with `Name:Value`
http httpbin.org/headers Authorization:"Bearer abc123" User-Agent:TDS

# Query params with `name==value`
http api.github.com/search/repositories q==tensorflow per_page==5

# File body (@)
http POST httpbin.org/post @payload.json
```

### Output features

```bash
# Just the headers
http --headers GET httpbin.org/get

# Just the body, suitable for piping
http --body httpbin.org/get | jq .

# Follow redirects; show all the intermediate responses
http --follow --all GET bit.ly/somelink

# Print request too (-v)
http -v POST httpbin.org/post name=alice
```

### Sessions and auth

```bash
# Basic auth
http -a user:pass GET httpbin.org/basic-auth/user/pass

# Bearer token (stored in session)
http --session=github api.github.com Authorization:"Bearer $GH_TOKEN"
http --session=github api.github.com/user       # reuses token
```

## Postman / Requestly API Client — GUI Collections

A GUI is indispensable when you're dealing with:

- **Collections** — dozens of related requests saved and shared.
- **Environments** — swap `baseUrl`, `token` across `dev`/`staging`/`prod` with one click.
- **Pre-request scripts** — compute signatures, refresh tokens.
- **Tests** — assertions on responses (`pm.test("status 200", ...)`)
- **Documentation** — auto-generated API docs from your collection.

[**Postman**](https://www.postman.com/) (the original) is great but increasingly requires login and pushes cloud features. [**Requestly API Client**](https://requestly.com/) (covered next page) is a privacy-first alternative that stores collections as plain JSON in a folder — so you can commit them to Git. We'll use Requestly throughout this course.

### Postman quick tour

```
Workspaces → Collections → Folders → Requests
       └── Environments (variables)
```

1. Create a request: `GET https://api.github.com/users/{{username}}`
2. Create an environment with `username = octocat`.
3. Switch environments to test as different users.
4. Write tests in the "Tests" tab:
   ```js
   pm.test("Status is 200", () => pm.response.to.have.status(200));
   const data = pm.response.json();
   pm.expect(data.login).to.eql("octocat");
   ```

## VS Code REST Client — Requests in Git

The [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) lets you write `.http` files with your requests. Save, commit, share.

```http title="api-tests.http"
### Get user (click "Send Request" above the line)
GET https://api.github.com/users/octocat
Accept: application/json

### Variables
@host = https://api.github.com
@token = {{$processEnv GITHUB_TOKEN}}

### Authenticated request
GET {{host}}/user
Authorization: Bearer {{token}}

### POST example
POST {{host}}/repos
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "test-repo",
  "private": false
}
```

No separate app, no cloud account, fully auditable via Git.

## REST vs GraphQL — The Quick Comparison

| | REST | GraphQL |
|---|------|---------|
| Endpoints | Many (`/users/1`, `/users/1/repos`) | One (`/graphql`) |
| Methods | `GET`, `POST`, `PUT`, `DELETE` | Always `POST` |
| Over/under-fetching | Common | Client picks exact fields |
| Caching | HTTP caches work natively | Harder — needs client cache |
| Learning curve | Low | Medium |
| Docs/Discovery | OpenAPI / Swagger | Introspection built-in |

GraphQL request with curl:

```bash
curl -X POST https://api.github.com/graphql \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ viewer { login repositories(first: 5) { nodes { name } } } }"}' \
  | jq .
```

## HTTP Status Codes — The Quick Map

| Range | Meaning | Common codes |
|-------|---------|--------------|
| **2xx** | Success | `200 OK`, `201 Created`, `204 No Content` |
| **3xx** | Redirect | `301 Moved`, `302 Found`, `304 Not Modified` |
| **4xx** | **Your** fault | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `429 Too Many Requests` |
| **5xx** | **Server** fault | `500 Internal`, `502 Bad Gateway`, `503 Unavailable`, `504 Timeout` |

Rule of thumb: if you get `401`, check your token; `403`, check permissions; `404`, check the URL; `429`, back off and retry; `5xx`, retry with exponential backoff.

## A Playground for Testing: httpbin.org

Use [httpbin.org](https://httpbin.org) to experiment without touching a real API:

```bash
http GET httpbin.org/get                  # echo back your request
http POST httpbin.org/post name=test      # see what the server received
http GET httpbin.org/status/429           # simulate rate-limit
http GET httpbin.org/delay/3              # 3-second response
http GET httpbin.org/basic-auth/u/p -a u:p
```

## 5-Minute Exercise

1. Get a GitHub personal access token: github.com → Settings → Developer settings → Personal access tokens → generate classic, no scopes needed.
2. Run:
   ```bash
   export GH=ghp_your_token
   curl -s -H "Authorization: Bearer $GH" https://api.github.com/user | jq .login
   ```
3. Same with `httpie`:
   ```bash
   http api.github.com/user "Authorization:Bearer $GH"
   ```
4. Create a `.http` file in VS Code with the same request. Install the REST Client extension. Click "Send Request".
5. Compare output ergonomics.

## Further Reading

- [curl man page](https://curl.se/docs/manpage.html)
- [httpie docs](https://httpie.io/docs/cli)
- [Postman Learning Center](https://learning.postman.com/)
- [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [HTTP status codes — Mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

