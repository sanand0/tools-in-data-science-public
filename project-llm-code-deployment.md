# Project: LLM Code Deployment

<!-- https://chatgpt.com/c/68cb90cb-7a64-8331-bfbf-aa222df475de -->

In this project, students will build an application that can build, deploy, update an application!

1. **Build**. The student:
   - receives & verifies a **request** containing an app brief
   - uses an **LLM-assisted generator** to build the app,
   - deployes to **GitHub Pages**,
   - then **pings an evaluation API** with repo details
2. **Evaluate**. The instructors:
   - run automated **static, dynamic (Playwright), and and LLM** checks
   - store and publish the results **after the deadline**
   - send a **second request** tailored to the student’s codebase
3. **Revise**. The student
   - verifies secret
   - **updates** the app based on the request
   - **re‑deploys** Pages
   - then **pings a second evaluation API** with repo metadata.

## Request

The request is a JSON file like this:

```jsonc
{
  // Student email ID
  "email": "student@example.com",
  // Student-provided secret
  "secret": "...",
  // A unique task ID.
  "task": "captcha-solver-...",
  // There will be multiple rounds per task. This is the round index
  "round": 1,
  // Pass this nonce back to the evaluation URL below
  "nonce": "ab12-...",
  // brief: mentions what the app needs to do
  "brief": "Create a captcha solver that handles ?url=https://.../image.png. Default to attached sample.",
  // checks: mention how it will be evaluated
  "checks": [
    "Repo has MIT license",
    "README.md is professional",
    "Page displays captcha URL passed at ?url=...",
    "Page displays solved captcha text within 15 seconds"
  ],
  // Send repo & commit details to the URL below
  "evaluation_url": "https://example.com/notify",
  // Attachments will be encoded as data URIs
  "attachments": [
    { "name": "sample.png", "url": "data:image/png;base64,iVBORw..." }
  ]
}
```

## Build

Students will:

1. Host an API endpoint that accepts a JSON POST sent via:
   ```bash
   curl https://example.com/api-endpoint \
     -H "Content-Type: application/json" \
     -d '{"brief": "...", ...}'
   ```
2. Check if the `secret` matches what they had shared in the Google Form.
3. Send a HTTP 200 JSON response
4. Parse the request and attachments.
   Use LLMs to generate minimal app.
5. Create a repo & push.
   - Use the GitHub API / CLI app with a personal access token.
   - Use a unique repo name based on `.task`.
   - Make your repo public
   - Add an MIT `LICENSE` at repo root
   - Enable GitHub Pages and make it reachable (200 OK)
   - Avoid secrets in git history (trufflehog, gitleaks)
   - Write a complete `README.md` (summary, setup, usage, code explanation, license)
6. Enable GitHub Pages
7. POST to `evaluation.url` (header: `Content-Type: application/json`), within 10 minutes of the request, this JSON structure:
   ```jsonc
   {
     // Copy these from the request
     "email": "...",
     "task": "captcha-solver-...",
     "round": 1,
     "nonce": "ab12-...",
     // Send these based on your GitHub repo and commit
     "repo_url": "https://github.com/user/repo",
     "commit_sha": "abc123",
     "pages_url": "https://user.github.io/repo/"
   }
   ```
8. Ensure a HTTP 200 response. On error, re-submit with a 1, 2, 4, 8, ... second delay.

## Revise

Students will:

1. Accept a second POST request (`{"round": 2}`) to add/modify features, refactor the code, etc.
2. Verify the secret
3. Send a HTTP 200 JSON response
4. Modify the repo based on the `brief` (e.g. "handle SVG images")
   - Update `README.md` accordingly
5. Modify code accordingly & push to redeploy GitHub pages
6. POST to the same `evaluation.url` with `{"round": 2}`, within 10 minutes of the request
7. Ensure a HTTP 200 response.

## Evaluate

Instructors will:

- [Publish a Google Form](https://forms.gle/PRyt6zD6f86dNTxJ6) where students can submit their API URLs, their `secret`, and their GitHub repo URLs
- For each submission, create a unique task request.
- POST the request to their latest API URL.
  - If the response is not HTTP 200, try up to 3 times over 3-24 hours. Then fail.
- Accept POST requests on the `evaluation_url`. Add it to queue to evaluate and return a HTTP 200 response.
- Evaluate the repo based on the task-specific as well as common checks and log these.
  - Repo-level rule-based checks (e.g. `LICENSE` is MIT)
  - LLM-based static checks (e.g. code quality, `README.md` quality)
  - Dynamic checks (e.g. use Playwright to load your page, run and test your app)
- Save the results in a `results` table.
- For all `{"round": 1}` requests, generate and POST a unique round 2 task request (even if checks failed).
- Publish the database after the deadline.

Instructors may, at their discretion, send up to 3 such tasks.

> [!WARNING]
> Stuff below this is **work in progress**. Some stuff may change.

## Evaluation Script

Setup:

- Download the submissions as a `submissions.csv` with `timestamp,email,endpoint,secret` columns.
- Set up a remote database with tables:
  - `tasks` for tasks sent. Updated by `round1.py`, `round2.py`. Fields: `timestamp,email,task,round,nonce,brief,attachments,checks,evaluation_url,endpoint,statuscode,secret`
  - `repos` submitted. Updated by `evaluation_url` API. Fields: `timestamp,email,task,round,nonce,repo_url,commit_sha,pages_url`
  - `results` evaluated. Updated by `evaluate.py`. Fields: `timestamp,email,email,task,round,repo_url,commit_sha,pages_url,check,score,reason,logs`
- Create a series of parametrizable task templates

Evaluation scripts:

- Create a `round1.py` script. For each `submissions.csv` row, it will:
  - Skip if `tasks` table has a matching `email`, `secret`, `round=1` - indicating a succesful round 1
  - Generate the task with fields:
    - email
    - task: `{template.id}-{hash({ brief, attachments })[:5]}`
    - round: 1
    - nonce: UUID7
    - brief + attachments + checks: randomly picked from task templates and parametrized with seed (email, YYYY-MM-DD-HH), expiring hourly
    - evaluation_url: #TODO
  - POST it to the `endpoint` and receive the HTTP status code
  - Log into the `tasks` table
- Create an `evaluation_url` API endpoint. This will:
  - Accept a JSON payload
  - If the `tasks` table has a matching `email`, `task`, `round`, `nonce`, insert these fields along with `repo_url`, `commit_sha`, `pages_url`, into the `repos` table and return a HTTP 200.
  - Else return a HTTP 400 with reason.
- Create an `evaluate.py` script. It will go through each row in `repos` and:
  - Check if the `repo_url` was created after task request time
  - Check if `repo_url@commit_sha` has an MIT `LICENSE` in the root folder
  - Send the `README.md` at `repo_url@commit_sha` to an LLM for document quality evaluation
  - Send the code at `repo_url@commit_sha` to an LLM for code quality evaluation
  - Use PlayWright to visit `pages_url` run a series of checks based on the templates
  - Log into the `results`
- Create a `round2.py` script. For each row in the `repos` table, it will:
  - Skip if `results` table has a matching `email`, `task`, `round=2` - indicating a succesful round 2
  - Generate a task with the same fields as `round1.py`, except:
    - brief + attachments + checks: randomly picked from the same task template but for round 2
  - POST it to the `endpoint` and receive the HTTP status code
  - Log into the `tasks` table

Sample task templates:

```yaml
id: sum-of-sales
brief: Publish a single-page site that fetches data.csv from attachments, sums its sales column, sets the title to "Sales Summary ${seed}", displays the total inside #total-sales, and loads Bootstrap 5 from jsdelivr.
attachments:
  - name: data.csv
    url: data:text/csv;base64,${seed}
checks:
  - js: document.title === `Sales Summary ${seed}`
  - js: !!document.querySelector("link[href*='bootstrap']")
  - js: Math.abs(parseFloat(document.querySelector("#total-sales").textContent) - ${result}) < 0.01
round2:
  - brief: Add a Bootstrap table #product-sales that lists each product with its total sales and keeps #total-sales accurate after render.
    checks:
      - js: document.querySelectorAll("#product-sales tbody tr").length >= 1
      - js: >-
          (() => {
            const rows = [...document.querySelectorAll("#product-sales tbody tr td:last-child")];
            const sum = rows.reduce((acc, cell) => acc + parseFloat(cell.textContent), 0);
            return Math.abs(sum - ${result}) < 0.01;
          })()
  - brief: Introduce a currency select #currency-picker that converts the computed total using rates.json from attachments and mirrors the active currency inside #total-currency.
    attachments:
      - name: rates.json
        url: data:application/json;base64,${seed}
    checks:
      - js: !!document.querySelector("#currency-picker option[value='USD']")
      - js: !!document.querySelector("#total-currency")
  - brief: Allow filtering by region via #region-filter, update #total-sales with the filtered sum, and set data-region on that element to the active choice.
    checks:
      - js: document.querySelector("#region-filter").tagName === "SELECT"
      - js: document.querySelector("#total-sales").dataset.region !== undefined
```

```yaml
id: markdown-to-html
brief: Publish a static page that converts input.md from attachments to HTML with marked, renders it inside #markdown-output, and loads highlight.js for code blocks.
attachments:
  - name: input.md
    url: data:text/markdown;base64,${seed}
checks:
  - js: !!document.querySelector("script[src*='marked']")
  - js: !!document.querySelector("script[src*='highlight.js']")
  - js: document.querySelector("#markdown-output").innerHTML.includes("<h")
round2:
  - brief: Add tabs #markdown-tabs that switch between rendered HTML in #markdown-output and the original Markdown in #markdown-source while keeping content in sync.
    checks:
      - js: document.querySelectorAll("#markdown-tabs button").length >= 2
      - js: document.querySelector("#markdown-source").textContent.trim().length > 0
  - brief: Support loading Markdown from a ?url= parameter when present and fall back to the attachment otherwise, showing the active source in #markdown-source-label.
    checks:
      - js: document.querySelector("#markdown-source-label").textContent.length > 0
      - js: !!document.querySelector("script").textContent.includes("fetch(")
  - brief: Display a live word count badge #markdown-word-count that updates after every render and formats numbers with Intl.NumberFormat.
    checks:
      - js: document.querySelector("#markdown-word-count").textContent.includes(",")
      - js: !!document.querySelector("script").textContent.includes("Intl.NumberFormat")
```

```yaml
id: github-user-created
brief: Publish a Bootstrap page with form id="github-user-${seed}" that fetches a GitHub username, optionally uses ?token=, and displays the account creation date in YYYY-MM-DD UTC inside #github-created-at.
checks:
  - js: document.querySelector("#github-user-${seed}").tagName === "FORM"
  - js: document.querySelector("#github-created-at").textContent.includes("20")
  - js: !!document.querySelector("script").textContent.includes("https://api.github.com/users/")
round2:
  - brief: Show an aria-live alert #github-status that reports when a lookup starts, succeeds, or fails.
    checks:
      - js: document.querySelector("#github-status").getAttribute("aria-live") === "polite"
      - js: !!document.querySelector("script").textContent.includes("github-status")
  - brief: Display the account age in whole years inside #github-account-age alongside the creation date.
    checks:
      - js: parseInt(document.querySelector("#github-account-age").textContent, 10) >= 0
      - js: document.querySelector("#github-account-age").textContent.toLowerCase().includes("years")
  - brief: Cache the last successful lookup in localStorage under "github-user-${seed}" and repopulate the form on load.
    checks:
      - js: !!document.querySelector("script").textContent.includes("localStorage.setItem(\"github-user-${seed}\"")
      - js: !!document.querySelector("script").textContent.includes("localStorage.getItem(\"github-user-${seed}\"")
```
