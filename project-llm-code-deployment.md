# Project: LLM Code Deployment

<!-- https://chatgpt.com/c/68cb90cb-7a64-8331-bfbf-aa222df475de -->

In this project, students will build an application that can build, deploy, update an application!

1. **Build**. The student:
   - receives & verifies a **signed request** containing an app brief
   - uses an **LLM-assisted generator** to build the app,
   - deployes to **GitHub Pages**,
   - then **pings an evaluation API** with repo details
2. **Evaluate**. The instructors:
   - run automated **static, dynamic (Playwright), and and LLM** checks
   - store and publish the results **after the deadline**
   - send a **second signed request** tailored to the student’s codebase
3. **Revise**. The student
   - verifies signature
   - **updates** the app based on the request
   - **re‑deploys** Pages
   - then **pings a second evaluation API** with repo metadata.

## Request

The request is a JSON file like this:

```jsonc
{
  // Student email ID
  "email": "student@example.com",
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
    "Repo has MIT license"
    "README.md is professional",
    "Page displays captcha URL passed at ?url=...",
    "Page displays solved captcha text within 15 seconds",
  ],
  // Send repo & commit details to the URL below
  "evaluation_url": "https://example.com/notify",
  // Attachments will be encoded as data URIs
  "attachments": [{ "name": "sample.png", "url": "data:image/png;base64,iVBORw..." }],
  // Signature to ensure this is an official request
  "signature": "..."
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
2. [Verify the `signature`](#verify-signature). Reject request if invalid
3. Send a HTTP 200 JSON response with `{"usercode": "..."}` containing student's unique code (see [Evaluation](#evaluation) below)
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
7. POST to `evaluation.url` (header: `Content-Type: application/json`) this JSON structure:
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
2. [Verify the `signature`](#verify-signature)
3. Send a HTTP 200 JSON response with the `usercode`
4. Modify the repo based on the `brief` (e.g. "handle SVG images")
   - Update `README.md` accordingly
5. Modify code accordingly & push to redeploy GitHub pages
6. POST to the same `evaluation.url` with `{"round": 2}`
7. Ensure a HTTP 200 response.

> [!WARNING]
> Stuff below this is **work in progress**. Some stuff may change.

## Evaluate

Instructors will:

- Publish a Google Form where students can submit their API URLs and their `usercode` #TODO
- For each submission, create a unique task request.
- POST the request to their latest API URL.
  - If the `usercode` doesn't match, try up to 3 times over 3-24 hours. Then fail.
- Accept POST requests on the `evaluation_url`. Add it to queue to evaluate and return a HTTP 200 response.
- Evaluate the repo based on the task-specific as well as common checks and log these.
  - Repo-level rule-based checks (e.g. `LICENSE` is MIT)
  - LLM-based static checks (e.g. code quality, `README.md` quality)
  - Dynamic checks (e.g. use Playwright to load your page, run and test your app)
- Save the results in a `results` table.
- For all `{"round": 1}` requests, generate and POST a unique round 2 task request (even if checks failed).
- Publish the database after the deadline.

Students must:

- Call `evaluation.url` within 10 minutes of receivng the request.

## Evaluation Script

Setup:

- Download the submissions as a `submissions.csv` with `timestamp,email,endpoint,usercode` columns.
- Set up a remote database with tables:
  - `tasks` for tasks sent. Updated by `round1.py`, `round2.py`. Fields: `timestamp,email,task,round,nonce,brief,attachments,checks,evaluation_url,endpoint,statuscode,usercode`
  - `repos` submitted. Updated by `evaluation_url` API. Fields: `timestamp,email,task,round,nonce,repo_url,commit_sha,pages_url`
  - `results` evaluated. Updated by `evaluate.py`. Fields: `timestamp,email,email,task,round,repo_url,commit_sha,pages_url,check,score,reason,logs`
- Create a series of parametrizable task templates

Evaluation scripts:

- Create a `round1.py` script. For each `submissions.csv` row, it will:
  - Skip if `tasks` table has a matching `email`, `usercode`, `round=1` - indicating a succesful round 1
  - Generate the task with fields:
    - email
    - task: `{template.id}-{hash({ brief, attachments })[:5]}`
    - round: 1
    - nonce: UUID7
    - signature: `{nonce}` signed with private key
    - brief + attachments + checks: randomly picked from task templates and parametrized with seed (email, YYYY-MM-DD-HH), expiring hourly
    - evaluation_url: #TODO
  - POST it to the `endpoint` and receive the HTTP status code and `{usercode}`
  - Log into the `tasks` table
- Create an `evaluation_url` API endpoint. This will:
  - Accept a JSON payload
  - If the `tasks` table has a matching `email`, `task`, `round`, `nonce`, insert these fields along with `repo_url`, `commit_sha`, `pages_url`, into the `repos` table and return a HTTP 200.
  - Else return a HTTP 400 with reason.
- Create an `evaluate.py` script. It will go through each row in `repos` and:
  - Check if `repo_url@commit_sha` has an MIT `LICENSE` in the root folder
  - Send the `README.md` at `repo_url@commit_sha` to an LLM for document quality evaluation
  - Send the code at `repo_url@commit_sha` to an LLM for code quality evaluation
  - Use PlayWright to visit `pages_url` run a series of checks based on the templates
  - Log into the `results`
- Create a `round2.py` script. For each row in the `repos` table, it will:
  - Skip if `results` table has a matching `email`, `task`, `round=2` - indicating a succesful round 2
  - Generate a task with the same fields as `round1.py`, except:
    - brief + attachments + checks: randomly picked from the same task template but for round 2
  - POST it to the `endpoint` and receive the HTTP status code and `{usercode}`
  - Log into the `tasks` table

Sample task templates:

```yaml
brief: Publish a web page that contains the sum of the sales column in data.csv.
attachments: [{ "name": "data.csv", "url": "data:text/csv;base64,${seed}" }],
checks:
  - #TODO
round2: #TODO
```

```yaml
brief: Publish a web page that includes this Markdown converted to HTML.
attachments: [{ "name": "input.md", "url": "data:text/markdown;base64,${seed}" }],
checks:
  - #TODO
round2: #TODO
```

```yaml
brief: >
  Create a web page that has a form with an input id="github-user-${seed}".
  On submit, show that GitHub user's account creation date (YYYY-MM-DD in UTC) within 5 seconds.
  If the request contains a ?token=... then use that as the GitHub API token.
checks:
  -  #TODO
round2: #TODO
```

```yaml
brief: >
  Create a web page that has a form with a textarea id="code-${seed}".
  When the user types something (e.g. 'What is the 50th prime number') and submits,
  use AIPipe to have an LLM write JS code to solve the problem, run it, and show the result
  within 10 seconds.
  If the request contains a ?token=.... then use that as the AIPipe token.
checks:
  -  #TODO
round2: #TODO
```

## Verify signature

#TODO
