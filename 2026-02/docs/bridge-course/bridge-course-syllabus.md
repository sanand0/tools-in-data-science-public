# TDS Bridge Bootcamp (Day 1–Day 5)

This bootcamp prepares you to start **Tools in Data Science (TDS)** smoothly. It is designed for students who **already know Python programming** (syntax, functions, basic data structures) but have **limited experience with Linux, developer tools, and web/API debugging**.

It includes **five instructional days (Day 1–Day 5)**.

## Outcomes (by the end of Day 5)

You will be able to:

- Use Linux terminal confidently: navigate, search, edit, automate with pipes.
- Set up Python projects cleanly using `uv` and virtual environments.
- Use VS Code effectively for Python: linting, debugging, Jupyter, terminals.
- Use Git + GitHub for day-to-day workflow: branches, PRs, reviews.
- Debug web/API issues using Chrome DevTools (Network tab) and HTTP clients.
- Build and test a tiny FastAPI service locally.
- Work comfortably with JSON in API requests/responses.
- Ship a small improvement via GitHub (Branch → optional PR/Issue → Tag/Release).

## Assumptions & Setup

- Recommended OS: **Ubuntu Linux** (native) or **Windows + WSL2 (Ubuntu)**.
- Accounts: GitHub account (create before or during Day 1).
- Day 1 is a guided setup day; you can arrive with nothing installed.

## Bootcamp Structure

- **Each session/day:** 2 teaching blocks + 1 hands-on lab + 1 short recap quiz/checklist.
- **Deliverables:** one small artifact per day that you push to GitHub.

---

## Day 1 — Setup Day (WSL/Linux Install + Filesystem Basics)

This session exists because many “Python-only” learners get blocked before they even start: terminal access, path confusion, permissions, and where files live.

### Teaching topics

1. **Linux vs Windows (practical differences)**
   - Paths: `/home/you/...` vs `C:\Users\you\...`
   - Separators: `/` vs `\`
   - Case-sensitivity: `File.txt` vs `file.txt`
   - Line endings: LF vs CRLF (why Git sometimes complains)
2. **Where your course files should live**
   - Recommended: keep your repo in Linux home (WSL) or native Linux home
   - Avoid working inside `/mnt/c/...` if it becomes slow or permission-weird
3. **Installing your environment**
   - Option A: Ubuntu Linux (native)
   - Option B: Windows + WSL2 (Ubuntu)
   - Verify installs: VS Code, Git, Python, `uv`
4. **First terminal confidence**
   - Open a terminal in VS Code
   - Confirm commands exist: `python --version`, `git --version`, `uv --version`

### Small exercises (20–30 min)

- Find and write down:
  - Your Linux home directory path
  - The folder where your TDS work will live
- Create `~/tds/bootcamp/` and practice opening it in VS Code.

### Lab 1 (45–60 min)

**Lab 1: Environment verification checklist (with screenshots/logs)**

- Create a folder `day-1/` and capture:
  - Terminal output of version commands (`python`, `git`, `uv`)
  - A short note explaining where your files are stored
  - One common pitfall you hit (if any) and how you fixed it

### Deliverable

- Create a GitHub repo called `tds-bootcamp`.
- Push `day-1/README.md` with your environment checklist.

### Exit checklist

- I can open VS Code connected to WSL/Linux.
- I know where my repo lives on disk.
- I can run `python`, `git`, and `uv` from the terminal.

---

## Day 2 — Linux & Shell Essentials (The Survival Toolkit)

### Teaching topics

1. **Terminal basics**
   - What is a shell? Bash vs zsh
   - Prompt, PATH, exit codes
2. **Filesystem & navigation**
   - `pwd`, `ls`, `cd`, `tree`, hidden files
   - Absolute vs relative paths
3. **Working with files**
   - `cat`, `less`, `head`, `tail`, `wc`, `grep`
   - `cp`, `mv`, `rm`, `mkdir`, `touch`
4. **Pipes and redirection**
   - `|`, `>`, `>>`, `2>`, `tee`
   - Why pipelines are powerful for data work
5. **Command help & learning**
   - `--help`, `man`, `tldr` (optional)

### Small exercises (30–45 min)

- Create a folder structure for a course workspace; practice navigation quickly.
- Download a text file (or use any `.md` file in this repo) and answer:
  - How many lines/words does it have?
  - Find all lines containing a keyword.
- Build a pipeline: “count the top 10 most frequent words” (case-insensitive).

### Lab 2 (60–90 min)

**Lab 2: Log explorer**

- You are given a `build_output.txt` (or any log file).
- Tasks:
  - Extract all lines that look like warnings/errors.
  - Save them to `outputs/errors.txt`.
  - Summarize counts by keyword (e.g., `ERROR`, `WARN`).

### Deliverable

- Add a `day-2/README.md` containing:
  - Your favorite 10 commands with examples.
  - The exact pipelines you used for the lab.

### Exit checklist

- I can navigate without clicking folders.
- I can search text quickly with `grep`.
- I understand pipes and redirection.

---

## Day 3 — VS Code + Python Project Setup with UV

### Teaching topics

1. **VS Code essentials for Python**
   - Integrated terminal, file explorer, search, multi-cursor
   - Extensions (Python, Pylance, Jupyter)
   - Formatting basics (Black/Ruff conceptually)
2. **Python environments (the practical mental model)**
   - Why global installs hurt
   - Virtual environments, dependency pinning
3. **UV workflow**
   - Creating a project (`pyproject.toml`)
   - Adding dependencies, locking
   - Running scripts and tools via `uv`
4. **Jupyter in VS Code**
   - Notebooks vs scripts, when to use which

### Small exercises (30–45 min)

- Create a new Python project folder `day-3/hello-uv/`.
- Using `uv`, add `httpx` and `rich`.
- Write a script `main.py` that prints a colored “environment report”:
  - Python version
  - Platform
  - Location of the interpreter

### Lab 3 (60–90 min)

**Lab 3: Reproducible mini-tool**

- Build a tiny CLI tool `weather` (or `quote`) that:
  - Fetches JSON from a public API
  - Prints a clean terminal output
- Add a `README.md` with:
  - Setup instructions using `uv`
  - A sample command and output

### Deliverable

- Push `day-3/` to GitHub.
- Confirm a teammate can run it using only your README.

### Exit checklist

- I can set up a Python project without pip confusion.
- I can run and debug code from VS Code.
- I can explain what a lockfile is for.

---

## Day 4 — HTTP, APIs, Chrome DevTools & Request Debugging

This day bridges directly into TDS Week 1 (HTTP clients) and Week 2 (API engineering).

### Teaching topics

1. **HTTP fundamentals (practical)**
   - Methods: GET/POST/PUT/PATCH/DELETE
   - Status codes (200/201/204, 400/401/403/404, 429, 500)
   - Headers, cookies, auth (basic)
2. **Chrome DevTools (must-have skill)**
   - Elements, Console (basic)
   - **Network tab**: inspect requests, payloads, headers, timing
   - Copy as cURL
3. **HTTP clients**
   - `curl` basics
   - `httpie` mental model (optional)
   - Postman concept (optional)
4. **API mocking/interception concept**
   - What tools like Requestly are used for (when a backend is missing)

### Small exercises (30–45 min)

- Use DevTools Network tab to inspect requests on any website:
  - Identify one XHR/fetch request
  - Copy it as cURL and run it in terminal
- Use `curl` to:
  - Send a query parameter
  - Send a JSON POST body
  - Add a header (e.g., `Accept: application/json`)

### Lab 4 (60–90 min)

**Lab 4: Build and test a tiny API (this continues into Day 5)**

- Create a minimal FastAPI app with 2 endpoints:
  - `GET /health` → `{ "status": "ok" }`
  - `POST /echo` → returns the received JSON plus a timestamp
- Add one intentionally "TODO" feature for tomorrow (pick one):
   - Add basic request logging middleware
   - Add an API key header check (simple)
   - Add one pytest test for `/health`
- Test it using:
  - Browser + Swagger UI
  - `curl` (and/or `httpx` from Python)
- Use DevTools to inspect at least one request.

To make Day 5 (Git/GitHub) meaningful, do **not** try to perfect the app today. The goal is to have a small project worth versioning.

### Deliverable

- Push `day-4/` with:
   - `app.py`
   - `README.md` showing `uv` setup + run command
   - Example `curl` calls
   - A `TODO.md` listing the one feature you will implement on Day 5

### Exit checklist

- I can read status codes and know what to try next.
- I can use DevTools Network tab to debug API issues.
- I can reproduce browser requests from terminal.

---

## Day 5 — Git & GitHub Workflow (Using Yesterday’s API Project)

This session uses the Day 4 FastAPI mini-project as the "real thing" you will version and publish. Since PRs/Issues are already familiar by now, today focuses on the parts that usually block beginners: **Git fundamentals + authentication + tags/releases**.

### Teaching topics

1. **Git fundamentals (daily commands)**
   - Working tree vs staging vs commits
   - The calm triad: `git status`, `git diff`, `git log`
   - Core workflow: `git add`, `git commit`, `git push`, `git pull`
   - Undo safely: `git restore`, `git reset` (conceptual), `git revert`
2. **Remotes & publishing**
   - What is `origin`? what is `main`?
   - `git remote -v`, `git push -u origin <branch>`
   - Switching remote URL (HTTPS ↔ SSH)
3. **Authentication (must-know in 2026)**
   - HTTPS auth: why password auth is gone; PAT/token-based auth
   - SSH auth: public/private keys, `ssh-agent`, `known_hosts`
   - How this differs from API auth concepts:
     - Basic auth (username/password) as a protocol concept
     - API keys / bearer tokens (common for REST APIs)
     - Public/private key crypto (used by SSH and sometimes signed requests)
4. **Tags & releases**
   - Lightweight vs annotated tags
   - Semantic versioning basics (`v0.1.0`, `v1.0.0`)
   - GitHub Releases (what they are, why they matter)

### Small exercises (30–45 min)

- Configure Git identity (once): set `user.name` and `user.email`.
- Make sure your Day 4 project is a git repo and has a remote.
- Practice the fundamentals on a tiny change:
   - Edit one line, then run `git status` → `git diff` → `git add -p` → `git commit`.
- Auth practice (pick one path):
   - **SSH path:** generate an SSH key, add it to GitHub, test with `ssh -T git@github.com`.
   - **HTTPS path:** confirm you can push using a token-based flow (PAT / credential manager).

### Lab 5 (60–90 min)

**Lab 5: Authenticate + ship a version (continuation of Day 4)**

Goal: you should be able to publish your code from a fresh machine without getting stuck on credentials.

1. Convert your Day 4 `TODO.md` into a concrete change (implement the TODO).
2. Ensure your repo pushes using **SSH** (recommended) OR a token-based **HTTPS** flow.
   - Demonstrate by running a successful `git push`.
3. Create a clean history:
   - At least 2 commits with meaningful messages (no “final.py” commits).
4. Tag a version:
   - Create an annotated tag `v0.1.0`.
   - Push the tag to GitHub.
 5. Create a GitHub Release for `v0.1.0` (UI or `gh release create`).

Optional (only if time): use a short-lived branch and merge it, just to confirm you still can.

### Deliverable

- Your repo has:
   - Day 1–Day 5 folders
   - A successful push using SSH or token-based HTTPS
   - A version tag on GitHub (`v0.1.0`) and a corresponding Release

### Exit checklist

- I can explain HTTPS vs SSH auth for Git.
- I can set up SSH keys (public/private) and push successfully.
- I can tag a version and create a GitHub Release.

---

## How This Bootcamp Maps to the TDS Syllabus

- **Week 1 (Environment & Tooling):** Day 1–Day 3 cover setup, Linux, VS Code, UV, Bash basics.
- **Week 1/2 bridge (HTTP + API confidence):** Day 4 covers HTTP clients + Chrome DevTools + a tiny FastAPI service.
- **Week 1 (Git/GitHub):** Day 5 covers core Git commands plus GitHub authentication (SSH/HTTPS) and publishing via tags/releases.

If you want, I can also add a “pre-bootcamp checklist” (install steps for Linux/WSL + `uv`) tailored to your lab machines.

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

