# Day 4 Quiz & Exercises
## TDS Bridge Bootcamp — HTTP, APIs & Chrome DevTools

> **Instructions:** Attempt MCQs first. Then run the exercises — you'll need your terminal, a browser with DevTools, and your FastAPI app running.

---

## Part A — 20 Multiple Choice Questions

**Q1.** You click "Submit" on a login form. The username and password are sent to the server. Which HTTP method is almost certainly being used?

- [ ] A) GET
- [ ] B) DELETE
- [ ] C) POST
- [ ] D) PATCH

<details>
<summary>Answer</summary>

**C** — POST is used to send data to the server to create or update a resource

</details>

---

**Q2.** You want to fetch a list of products from an e-commerce API without changing any data. Which method should you use?

- [ ] A) POST
- [ ] B) GET
- [ ] C) PUT
- [ ] D) DELETE

<details>
<summary>Answer</summary>

**B** — GET is for fetching data without side effects

</details>


---

**Q3.** What is the difference between `PUT` and `PATCH`?

- [ ] A) PUT is for creating; PATCH is for deleting
- [ ] B) PUT replaces the entire resource; PATCH updates only specific fields
- [ ] C) PUT is faster; PATCH is safer
- [ ] D) They are identical — use either one

<details>
<summary>Answer</summary>

**B** — PUT replaces whole resource; PATCH updates specific fields

</details>


---

**Q4.** You call an API and get back `401`. What does this mean?

- [ ] A) The URL you requested does not exist
- [ ] B) The server crashed
- [ ] C) You are not authenticated — your token is missing or invalid
- [ ] D) You are authenticated but don't have permission for this resource

<details>
<summary>Answer</summary>

**C** — 401 = unauthenticated — who are you?

</details>


---

**Q5.** You get a `403` response. Which of these is the most accurate interpretation?

- [ ] A) Your request body is malformed
- [ ] B) The resource doesn't exist
- [ ] C) You are logged in but not allowed to access this resource
- [ ] D) The server is temporarily down

<details>
<summary>Answer</summary>

**C** — 403 = authenticated but forbidden

</details>


---

**Q6.** A student calls an API and gets `429`. What should they do?

- [ ] A) Check their JSON syntax — it's probably malformed
- [ ] B) Add an `Authorization` header — they're not logged in
- [ ] C) Slow down — they're making too many requests and hitting the rate limit
- [ ] D) Change the HTTP method from GET to POST

<details>
<summary>Answer</summary>

**C** — 429 = rate limit — slow down

</details>


---

**Q7.** What does the `Content-Type: application/json` header tell the server?

- [ ] A) That the client can accept JSON responses
- [ ] B) That the request body is formatted as JSON
- [ ] C) That the server should compress the response
- [ ] D) That the client is a browser

<details>
<summary>Answer</summary>

**B** — `Content-Type` describes what you're sending

</details>


---

**Q8.** What is the difference between `Content-Type` and `Accept` headers?

- [ ] A) They are the same — use either one
- [ ] B) `Content-Type` describes the format you're sending; `Accept` tells the server what format you want back
- [ ] C) `Accept` describes the format you're sending; `Content-Type` tells the server what you want back
- [ ] D) `Accept` is for GET requests; `Content-Type` is for POST requests

<details>
<summary>Answer</summary>

**B** — `Content-Type` = outgoing format; `Accept` = desired response format

</details>


---

**Q9.** In Chrome DevTools Network tab, you want to see only API/data requests and filter out images, fonts, and scripts. Which filter should you click?

- [ ] A) All
- [ ] B) Doc
- [ ] C) Fetch/XHR
- [ ] D) Media

<details>
<summary>Answer</summary>

**C** — Fetch/XHR filters to data requests only

</details>


---

**Q10.** You right-click a request in DevTools and select "Copy as cURL". What does this give you?

- [ ] A) A Python `requests` snippet you can paste into your code
- [ ] B) A `curl` command that reproduces the exact same request in the terminal
- [ ] C) A link to the API documentation
- [ ] D) The response body as a JSON file

<details>
<summary>Answer</summary>

**B** — Copy as cURL = exact terminal-reproducible request

</details>


---

**Q11.** You run this curl command and get no output. What flag should you add to see what went wrong?

```bash
curl https://api.example.com/data
```

- [ ] A) `-s`
- [ ] B) `-o output.txt`
- [ ] C) `-v`
- [ ] D) `-X GET`

<details>
<summary>Answer</summary>

**C** — `-v` (verbose) shows full request/response headers and errors

</details>


---

**Q12.** Which curl command correctly sends a POST request with a JSON body?

- [ ] A) `curl -POST '{"name":"Alice"}' https://api.example.com/users`
- [ ] B) `curl -X POST -d '{"name":"Alice"}' -H "Content-Type: application/json" https://api.example.com/users`
- [ ] C) `curl https://api.example.com/users --body '{"name":"Alice"}'`
- [ ] D) `curl -json '{"name":"Alice"}' https://api.example.com/users`

<details>
<summary>Answer</summary>

**B** — Correct: `-X POST` + `-d` + `-H "Content-Type"`

</details>


---

**Q13.** You want to call an API that requires a Bearer token. Which curl flag adds the Authorization header?

- [ ] A) `-d "Authorization: Bearer mytoken"`
- [ ] B) `-H "Authorization: Bearer mytoken"`
- [ ] C) `-token "Bearer mytoken"`
- [ ] D) `-X AUTH "Bearer mytoken"`

<details>
<summary>Answer</summary>

**B** — `-H` adds a header; `Authorization: Bearer token` is the format

</details>


---

**Q14.** You run `curl -v https://api.example.com`. Lines starting with `>` show:

- [ ] A) The server's response headers
- [ ] B) Debug messages from curl itself
- [ ] C) The request headers curl sent
- [ ] D) The response body

<details>
<summary>Answer</summary>

**C** — `>` lines = outgoing request; `<` lines = incoming response

</details>


---

**Q15.** In FastAPI, what decorator do you use to create an endpoint that handles GET requests at `/users`?

- [ ] A) `@app.route("/users", methods=["GET"])`
- [ ] B) `@app.get("/users")`
- [ ] C) `@get("/users")`
- [ ] D) `@app.handle("GET", "/users")`

<details>
<summary>Answer</summary>

**B** — `@app.get("/path")` is the FastAPI decorator

</details>


---

**Q16.** You start your FastAPI server with `uvicorn app:app --reload`. What does `--reload` do?

- [ ] A) Restarts the server every 60 seconds automatically
- [ ] B) Reloads static files but not Python code
- [ ] C) Automatically restarts the server when you save a Python file
- [ ] D) Reloads the database connection on each request

<details>
<summary>Answer</summary>

**C** — `--reload` watches for file changes and restarts

</details>


---

**Q17.** Your FastAPI app is running. Where do you go in the browser to see the auto-generated interactive API documentation?

- [ ] A) `http://localhost:8000/api`
- [ ] B) `http://localhost:8000/swagger`
- [ ] C) `http://localhost:8000/docs`
- [ ] D) `http://localhost:8000/help`

<details>
<summary>Answer</summary>

**C** — FastAPI serves Swagger UI at `/docs` by default

</details>


---

**Q18.** Your `POST /echo` endpoint receives a request but returns `422 Unprocessable Entity`. What is the most likely cause?

- [ ] A) The server crashed
- [ ] B) The client forgot the `Authorization` header
- [ ] C) The request body doesn't match the expected structure (wrong type, missing field)
- [ ] D) The endpoint doesn't exist

<details>
<summary>Answer</summary>

**C** — 422 = body structure is wrong or type mismatch

</details>


---

**Q19.** You call `curl http://localhost:8000/health` while your FastAPI server is not running. What error do you get?

- [ ] A) `404 Not Found`
- [ ] B) `500 Internal Server Error`
- [ ] C) `curl: (7) Failed to connect to localhost port 8000: Connection refused`
- [ ] D) `401 Unauthorized`

<details>
<summary>Answer</summary>

**C** — "Connection refused" means nothing is listening on that port

</details>


---

**Q20.** A URL has this query string: `/search?q=python&page=2&sort=recent`. How many query parameters does it have?

- [ ] A) 1
- [ ] B) 2
- [ ] C) 3
- [ ] D) 4

<details>
<summary>Answer</summary>

**C** — `q`, `page`, `sort` — three parameters

</details>


---



**Q21.** Which status code indicates that the server successfully processed the request?

- [ ] A) 200 OK
- [ ] B) 400 Bad Request
- [ ] C) 404 Not Found
- [ ] D) 500 Internal Server Error

<details>
<summary>Answer</summary>

**A** — 200 OK means success.

</details>

---

**Q22.** What does a `500 Internal Server Error` mean?

- [ ] A) The client sent bad data
- [ ] B) The server encountered an unexpected condition and crashed/failed
- [ ] C) The requested resource was moved
- [ ] D) The client is not authenticated

<details>
<summary>Answer</summary>

**B** — 500 indicates a problem on the server side.

</details>

---

**Q23.** In Chrome DevTools, where do you change the simulated network speed (e.g., Fast 3G)?

- [ ] A) Elements Tab
- [ ] B) Console Tab
- [ ] C) Network Tab -> Throttling dropdown
- [ ] D) Application Tab

<details>
<summary>Answer</summary>

**C** — Throttling options are in the Network tab.

</details>

---

**Q24.** How do you send a custom header in `curl`?

- [ ] A) `-H "Key: Value"`
- [ ] B) `--header "Key: Value"`
- [ ] C) Both A and B
- [ ] D) `-C "Key: Value"`

<details>
<summary>Answer</summary>

**C** — Both `-H` and `--header` work.

</details>

---

**Q25.** If a FastAPI endpoint is defined with `@app.delete("/items/{item_id}")`, how do you access `item_id`?

- [ ] A) It is passed as a function argument `item_id`
- [ ] B) You read it from `request.body`
- [ ] C) It is a query parameter
- [ ] D) You use `os.environ`

<details>
<summary>Answer</summary>

**A** — Path parameters are passed as function arguments in FastAPI.

</details>

---

**Q26.** What does Swagger UI (the `/docs` endpoint) allow you to do?

- [ ] A) See your database tables
- [ ] B) Edit your Python code in the browser
- [ ] C) Interactively explore and test your API endpoints
- [ ] D) Deploy your app to the cloud

<details>
<summary>Answer</summary>

**C** — Swagger UI provides interactive API documentation.

</details>

---

**Q27.** You want to simulate a different browser (e.g., mobile Safari) to see how the server responds. Which header do you modify?

- [ ] A) `Accept-Language`
- [ ] B) `User-Agent`
- [ ] C) `Content-Type`
- [ ] D) `Host`

<details>
<summary>Answer</summary>

**B** — The `User-Agent` string identifies the browser/client.

</details>

---

**Q28.** What is the query string in `https://api.example.com/search?q=apple&page=1`?

- [ ] A) `https://api.example.com`
- [ ] B) `/search`
- [ ] C) `q=apple&page=1`
- [ ] D) `apple`

<details>
<summary>Answer</summary>

**C** — The query string starts after the `?`.

</details>

---

**Q29.** What is the purpose of `OPTIONS` HTTP method?

- [ ] A) To submit data
- [ ] B) To delete a resource
- [ ] C) To describe the communication options (like CORS) for the target resource
- [ ] D) To get the headers of a resource

<details>
<summary>Answer</summary>

**C** — `OPTIONS` is commonly used for CORS preflight requests.

</details>

---

**Q30.** When building an API, why is returning correct HTTP status codes important?

- [ ] A) It's not, you can always return 200 and put the error in JSON
- [ ] B) Browsers and client libraries use them to understand if the request succeeded or failed without parsing the body
- [ ] C) It makes the API faster
- [ ] D) It is required by Python

<details>
<summary>Answer</summary>

**B** — Status codes are a universal standard for communication.

</details>

---

<details>
<summary>Full Answer Key (spoilers)</summary>

| Q | Answer |
|---|--------|
| 1 | C |
| 2 | B |
| 3 | B |
| 4 | C |
| 5 | C |
| 6 | C |
| 7 | B |
| 8 | B |
| 9 | C |
| 10 | B |
| 11 | C |
| 12 | B |
| 13 | B |
| 14 | C |
| 15 | B |
| 16 | C |
| 17 | C |
| 18 | C |
| 19 | C |
| 20 | C |
| 21 | A |
| 22 | B |
| 23 | C |
| 24 | C |
| 25 | A |
| 26 | C |
| 27 | B |
| 28 | C |
| 29 | C |
| 30 | B |

</details>

---

## Part B — Terminal & Browser Exercises

---

### Exercise 1 — Read status codes hands-on

Run each `curl` command and note the status code. Use `-s -o /dev/null -w "%{http_code}"` to print only the code.

```bash
# Successful GET
curl -s -o /dev/null -w "%{http_code}" https://jsonplaceholder.typicode.com/posts/1

# Resource that exists
curl -s -o /dev/null -w "%{http_code}" https://jsonplaceholder.typicode.com/users/5

# Resource that doesn't exist
curl -s -o /dev/null -w "%{http_code}" https://jsonplaceholder.typicode.com/posts/99999

# Unauthorized (httpbin simulates it)
curl -s -o /dev/null -w "%{http_code}" https://httpbin.org/status/401

# Server error (simulated)
curl -s -o /dev/null -w "%{http_code}" https://httpbin.org/status/500
```

**Write down:** What status code did each return? Does it match what you expected?

---

### Exercise 2 — curl GET with query parameters

```bash
# Fetch posts from user 1 only
curl "https://jsonplaceholder.typicode.com/posts?userId=1" | python3 -m json.tool | head -30

# How many posts does user 1 have?
curl -s "https://jsonplaceholder.typicode.com/posts?userId=1" | python3 -m json.tool | grep '"id"' | wc -l
```

**Question:** Can you modify the URL to get posts from user 2 instead?

---

### Exercise 3 — curl POST

```bash
curl -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "My First API Post", "body": "Sent from curl", "userId": 1}' \
  | python3 -m json.tool
```

**Write down:** What `id` did the server assign to your post? What status code came back? (Add `-s -o response.json -w "\nStatus: %{http_code}"` to capture both.)

---

### Exercise 4 — DevTools Network tab

1. Open Chrome and go to `https://jsonplaceholder.typicode.com`
2. Open DevTools (`F12`) → Network tab
3. Filter by **Fetch/XHR**
4. In the browser address bar, navigate to `https://jsonplaceholder.typicode.com/posts/1`
5. Click the request that appears in the Network tab
6. Find and note:
   - The request method
   - The response status code
   - The `Content-Type` response header
7. Right-click the request → **Copy → Copy as cURL**
8. Paste it in your terminal and run it

**Write the copied cURL command in `day4.md` under "My curl Commands".**

---

### Exercise 5 — Build and test your FastAPI app

```bash
cd ~/tds/bootcamp
uv init day4-api
cd day4-api
uv add fastapi "uvicorn[standard]"
```

Create `app.py`:

```python
from fastapi import FastAPI
from datetime import datetime, timezone

app = FastAPI()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/echo")
def echo(payload: dict):
    return {
        "received": payload,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
```

Start the server in one terminal:

```bash
uv run uvicorn app:app --reload
```

Open a second terminal and test:

```bash
# Test health
curl http://localhost:8000/health

# Test echo
curl -X POST http://localhost:8000/echo \
  -H "Content-Type: application/json" \
  -d '{"student": "your-name", "day": 4}'
```

Then open `http://localhost:8000/docs` in the browser and test both endpoints from the Swagger UI.

**Write down:** What does the `/echo` response look like? What timestamp did it return?

---

### Bonus Exercise — Inspect your own API in DevTools

While your FastAPI server is still running:

1. Go to `http://localhost:8000/docs` in Chrome
2. Open DevTools → Network tab → filter Fetch/XHR
3. Click "Try it out" → "Execute" on the `/echo` endpoint in Swagger UI
4. Watch the request appear in the Network tab
5. Click it and inspect the headers and response
6. Copy it as cURL and paste into your terminal

**Question:** Does the cURL command copied from DevTools produce the same result as the one you wrote manually?

---

*End of Day 4 Quiz & Exercises*
### Exercise 6 — Additional Practice

1. Modify your FastAPI app to add a new endpoint `GET /greet/{name}` that returns `{"message": "Hello, <name>!"}`.
2. Open `http://localhost:8000/docs` and test this new endpoint.
3. Make a `curl` request to it from the terminal.

**Question to answer:** How does FastAPI know that `{name}` is a path parameter?

---
