# Day 4 — HTTP Fundamentals

> **Goal:** Understand how the web works at the protocol level — HTTP methods, status codes, headers, and request/response structure — so you can debug APIs and build web services.

---

## What Is HTTP?

**HTTP** (HyperText Transfer Protocol) is the language that browsers and servers speak. Every time you:
- Open a web page
- Submit a form
- Fetch data from an API
- Upload a file

...an HTTP **request** goes out and an HTTP **response** comes back.

```
Client (browser/script)              Server
     │                                 │
     │──── HTTP Request ──────────────▶│
     │     GET /api/users              │
     │     Host: example.com           │
     │                                 │
     │◀─── HTTP Response ─────────────│
     │     200 OK                      │
     │     [{"name": "Alice"}, ...]    │
```

---

## HTTP Methods — What Action Are You Requesting?

| Method | Purpose | Example |
|---|---|---|
| `GET` | **Read** data | Get a list of users |
| `POST` | **Create** something new | Create a new user |
| `PUT` | **Replace** an entire resource | Replace user data completely |
| `PATCH` | **Update** part of a resource | Update just the email |
| `DELETE` | **Remove** a resource | Delete a user |

### The CRUD mapping

| Operation | HTTP Method | SQL equivalent |
|---|---|---|
| **C**reate | POST | INSERT |
| **R**ead | GET | SELECT |
| **U**pdate | PUT / PATCH | UPDATE |
| **D**elete | DELETE | DELETE |

### Examples

```
GET    /api/users           → Get all users
GET    /api/users/42        → Get user with ID 42
POST   /api/users           → Create a new user
PUT    /api/users/42        → Replace user 42's data
PATCH  /api/users/42        → Update user 42's email only
DELETE /api/users/42        → Delete user 42
```

> **GET requests should never change data.** GET is for reading only. If an API changes data on GET, it's poorly designed.

### 🧠 Knowledge Check

**Q1:** Which HTTP method is best suited for updating a specific field (like a user's email) without replacing their entire profile?

- A) `GET`
- B) `POST`
- C) `PUT`
- D) `PATCH`

<details>
<summary><b>Answer</b></summary>

**D** — `PATCH` is used for partial updates, whereas `PUT` typically replaces the entire resource.

</details>

---

## HTTP Status Codes — What Happened?

Status codes are three-digit numbers in the response that tell you the result.

### The Ranges

| Range | Category | Meaning |
|---|---|---|
| `1xx` | Informational | Request received, continuing... |
| `2xx` | **Success** | Request succeeded |
| `3xx` | Redirection | Go somewhere else |
| `4xx` | **Client Error** | You made a mistake |
| `5xx` | **Server Error** | The server broke |

### Codes You Must Know

| Code | Name | What it means |
|---|---|---|
| **200** | OK | Request succeeded (GET returned data) |
| **201** | Created | Resource was created (POST succeeded) |
| **204** | No Content | Success, but nothing to return (DELETE) |
| **301** | Moved Permanently | URL has permanently changed |
| **302** | Found | Temporary redirect |
| **400** | Bad Request | Your request is malformed (typo, wrong JSON) |
| **401** | Unauthorized | You need to authenticate (login) |
| **403** | Forbidden | You're authenticated but not allowed |
| **404** | Not Found | The resource doesn't exist |
| **405** | Method Not Allowed | Wrong HTTP method (POST to a GET-only endpoint) |
| **422** | Unprocessable Entity | Syntax OK but semantically wrong |
| **429** | Too Many Requests | Rate limited — you're sending too fast |
| **500** | Internal Server Error | Server crashed — not your fault |
| **502** | Bad Gateway | Server behind a proxy crashed |
| **503** | Service Unavailable | Server is overloaded or down for maintenance |

### Memory aids

```
2xx = 😊 Everything is fine
4xx = 😬 You messed up (fix your request)
5xx = 💥 Server messed up (try again later or contact admin)
```

### 🧠 Knowledge Check

**Q1:** You made a request to `/api/users` and received a `404` status code. What does this mean?

- A) You are not authorized to view the users
- B) The server crashed while processing your request
- C) The resource `/api/users` does not exist
- D) You sent the request too fast

<details>
<summary><b>Answer</b></summary>

**C** — `404 Not Found` means the URL you requested doesn't point to an existing resource.

</details>

---

## Anatomy of an HTTP Request

```
POST /api/users HTTP/1.1          ← method, path, version
Host: api.example.com             ← headers start here
Content-Type: application/json
Authorization: Bearer eyJhbGci...
Accept: application/json
                                   ← empty line separates headers from body
{                                  ← request body (for POST/PUT/PATCH)
    "name": "Alice",
    "email": "alice@example.com"
}
```

### Key parts

| Part | What it is |
|---|---|
| **Method** | GET, POST, PUT, PATCH, DELETE |
| **Path** | The URL path (e.g., `/api/users`) |
| **Headers** | Metadata about the request |
| **Body** | Data you're sending (not used in GET) |

---

## Anatomy of an HTTP Response

```
HTTP/1.1 201 Created              ← status line
Content-Type: application/json
Date: Mon, 15 Jan 2026 10:30:00 GMT
X-Request-Id: abc-123
                                   ← empty line
{                                  ← response body
    "id": 42,
    "name": "Alice",
    "email": "alice@example.com",
    "created_at": "2026-01-15T10:30:00Z"
}
```

---

## Common HTTP Headers

### Request Headers (you send)

| Header | Purpose | Example |
|---|---|---|
| `Content-Type` | Format of the body you're sending | `application/json` |
| `Accept` | Format you want back | `application/json` |
| `Authorization` | Authentication credentials | `Bearer <token>` |
| `User-Agent` | Identifies your client | `Mozilla/5.0...` or `python-httpx/0.27` |
| `Cookie` | Session cookies | `session_id=abc123` |

### Response Headers (server sends)

| Header | Purpose | Example |
|---|---|---|
| `Content-Type` | Format of the response body | `application/json` |
| `Content-Length` | Size of the response in bytes | `1234` |
| `Set-Cookie` | Tells browser to store a cookie | `session=xyz; HttpOnly` |
| `Cache-Control` | Caching rules | `max-age=3600` |
| `X-RateLimit-Remaining` | API rate limit info | `48` |

---

## JSON — The Language of APIs

Most APIs speak **JSON** (JavaScript Object Notation):

```json
{
    "name": "Alice",
    "age": 25,
    "is_student": true,
    "courses": ["TDS", "PDSA"],
    "address": {
        "city": "Chennai",
        "state": "Tamil Nadu"
    }
}
```

### JSON types

| Type | Example |
|---|---|
| String | `"hello"` |
| Number | `42`, `3.14` |
| Boolean | `true`, `false` |
| Null | `null` |
| Array | `[1, 2, 3]` |
| Object | `{"key": "value"}` |

### JSON in Python

```python
import json

# Python dict → JSON string
data = {"name": "Alice", "age": 25}
json_str = json.dumps(data)
print(json_str)  # '{"name": "Alice", "age": 25}'

# JSON string → Python dict
parsed = json.loads(json_str)
print(parsed["name"])  # Alice
```

---

## Authentication — How APIs Know Who You Are

### 1. API Keys

A simple token sent in a header or query parameter:

```bash
# In header:
curl -H "X-API-Key: abc123" https://api.example.com/data

# In query parameter:
curl "https://api.example.com/data?api_key=abc123"
```

### 2. Bearer Tokens (JWT)

A signed token sent in the `Authorization` header:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." https://api.example.com/data
```

### 3. Basic Auth

Username and password encoded in Base64:

```bash
curl -u "username:password" https://api.example.com/data
# Equivalent to: Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

---

## Q&A

<details>
<summary><b>Q: What is the difference between 401 and 403?</b></summary>

**A:**
- **401 Unauthorized** — "I don't know who you are." You haven't provided credentials, or they're invalid. Fix: add/fix your authentication.
- **403 Forbidden** — "I know who you are, but you're not allowed." You're authenticated but don't have permission for this resource.

</details>

<details>
<summary><b>Q: When should I use PUT vs PATCH?</b></summary>

**A:**
- **PUT** — sends the **complete** resource. Everything you don't include gets reset/deleted.
- **PATCH** — sends only the **changes**. Fields you don't include stay as they are.

Example: updating a user's email:
```json
// PUT /users/42 — must send EVERYTHING:
{"name": "Alice", "email": "new@email.com", "age": 25}

// PATCH /users/42 — send only what changed:
{"email": "new@email.com"}
```

</details>

<details>
<summary><b>Q: What does "rate limiting" (429) mean?</b></summary>

**A:** The API limits how many requests you can make per second/minute/hour. If you exceed the limit, you get a 429 response. Fix: slow down, add delays between requests, or check the `Retry-After` header.

</details>

<details>
<summary><b>Q: What is the difference between HTTP and HTTPS?</b></summary>

**A:** HTTPS = HTTP + TLS encryption. With HTTPS, the data between you and the server is encrypted — no one in the middle can read it. Always use HTTPS for APIs that involve authentication or sensitive data.

</details>

<details>
<summary><b>Q: Can GET requests have a body?</b></summary>

**A:** Technically, the HTTP spec doesn't forbid it, but practically **no**. GET requests should not have bodies. If you need to send data, use POST. If you need to filter data with GET, use query parameters: `GET /users?role=admin&limit=10`.

</details>

---

## Exercises

**Exercise 1: Status code identification**

For each scenario, what status code would you expect?

1. You request a user profile and get the data back
2. You try to access an admin endpoint without logging in
3. You send a POST request to create a new item, and it's created
4. You request `/api/users/99999` but user 99999 doesn't exist
5. The server crashes while processing your request

<details>
<summary><b>Answers</b></summary>

1. **200 OK** — successful GET request
2. **401 Unauthorized** — no authentication provided
3. **201 Created** — successful POST that created something
4. **404 Not Found** — resource doesn't exist
5. **500 Internal Server Error** — server-side crash

</details>

---

**Exercise 2: Method identification**

What HTTP method would you use for each action?

1. Viewing a list of all blog posts
2. Publishing a new blog post
3. Changing the title of an existing blog post
4. Deleting a comment
5. Replacing an entire user profile with new data

<details>
<summary><b>Answers</b></summary>

1. `GET /api/posts` — reading data
2. `POST /api/posts` — creating new data
3. `PATCH /api/posts/42` — updating part of a resource
4. `DELETE /api/comments/17` — removing a resource
5. `PUT /api/users/5` — completely replacing a resource

</details>

---

**Exercise 3: Read the response**

Given this HTTP response, answer the questions:

```
HTTP/1.1 403 Forbidden
Content-Type: application/json
X-RateLimit-Remaining: 0

{"error": "Access denied", "message": "Upgrade to premium for this endpoint"}
```

1. Was the request successful?
2. What does the status code mean?
3. What format is the response body in?
4. Why might you be getting this error?

<details>
<summary><b>Answers</b></summary>

1. **No** — 403 is a client error (4xx range)
2. **Forbidden** — the server knows who you are but won't let you access this resource
3. **JSON** (`Content-Type: application/json`)
4. The message says "Upgrade to premium" — this endpoint requires a paid subscription. Also, `X-RateLimit-Remaining: 0` suggests you may have hit your rate limit.

</details>

---

**Exercise 4: MCQ**

**Q1:** A `201 Created` response is returned after which type of request?

- A) GET
- B) DELETE
- C) POST
- D) OPTIONS

<details>
<summary><b>Answer</b></summary>

**C** — `201 Created` is typically returned after a successful POST request that creates a new resource.

</details>

---

**Q2:** You get a `500 Internal Server Error`. What should you do?

- A) Check your request headers for typos
- B) Wait and try again — it's a server-side issue
- C) Change the HTTP method
- D) Delete your API key and create a new one

<details>
<summary><b>Answer</b></summary>

**B** — `500` means the **server** had a problem, not your request. Try again later, or contact the API provider if it persists.

</details>

---

**Q3:** Which header tells the server what format you're sending data in?

- A) `Accept`
- B) `Content-Type`
- C) `Authorization`
- D) `User-Agent`

<details>
<summary><b>Answer</b></summary>

**B** — `Content-Type` describes the format of the request body (e.g., `application/json`). `Accept` tells the server what format you want in the response.

</details>

---

