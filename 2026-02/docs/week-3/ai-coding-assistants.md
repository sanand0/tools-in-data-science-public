# AI Coding Assistants

AI coding assistants are not just autocomplete. Used well, they can write, test, refactor, and explain entire codebases. Used poorly, they produce confident-sounding but wrong code. This page is about using them well.

---

## Claude Code

Claude Code is Anthropic's agentic CLI coding tool. It reads your project files, writes code, runs commands, and iterates — all from the terminal.

### Installation

```bash
# Install Node 18+ first (use nvm)
nvm install 24
nvm use 24

# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Login
claude
# → Opens browser for Anthropic authentication
```

### Basic Usage

```bash
# Start a session in your project directory
cd my-project
claude

# Or ask a specific question
claude "Explain what this codebase does"
claude "Add input validation to the create_user endpoint"
claude "Write tests for the auth module"
claude "Fix the bug in database.py line 47"
```

### Practical Workflows

**Starting a new feature:**
```bash
# Claude Code reads your entire project first, then implements
claude "Add a /tasks endpoint to main.py that supports CRUD operations.
Use the existing auth pattern from google-oauth.py.
Write tests in tests/test_tasks.py matching the style of tests/test_auth.py."
```

**Debugging:**
```bash
# Paste the error and let Claude Code trace through your code
claude "I'm getting this error:
AttributeError: 'NoneType' object has no attribute 'email'
It happens when calling /me after login. Find the bug and fix it."
```

**Refactoring:**
```bash
# Scope the refactor explicitly
claude "Refactor main.py to:
1. Extract all database operations into a separate db.py module
2. Replace print() calls with structlog
3. Keep the same API surface (routes and response models unchanged)
Do not change any tests."
```

**The CLAUDE.md file:**

Claude Code automatically reads `CLAUDE.md` at the root of your project. This is your opportunity to give Claude Code permanent context about your project.

```markdown title="CLAUDE.md"
# My Project

## Quick Start
```bash
uv run uvicorn main:app --reload   # dev server
uv run pytest                      # tests
```

## Architecture
- All routes in main.py
- DB operations via asyncpg (no ORM)
- Tests mirror the module structure in tests/

## Style Rules
- Use structlog for logging
- Pydantic models for all I/O
- Never use print() in production code

## Common Pitfalls
- DB connections are async — always use `await`
- Rate limit LLM calls to 1/second (see llm_client.py)
```

### Claude Code Tips

```bash
# Use /clear to reset context when switching tasks
/clear

# Use /compact to summarize long context (saves tokens)
/compact

# Reference specific files
claude "Look at tests/test_auth.py and write similar tests for tasks.py"

# Use --print for non-interactive mode (great for scripts)
claude --print "Summarize the main.py file in 3 bullet points"

# Stop and review before Claude applies changes
# Claude Code always shows you the plan before executing
```

---

## Gemini CLI

Google's CLI for Gemini models. Tight integration with Google tools and very large context windows (1M tokens on Gemini 2.5).

### Installation

```bash
# Install Node 18+, then:
npm install -g @google/gemini-cli

# Login with Google account
gemini auth login
```

### Usage

```bash
# Basic query
gemini "What is the capital of France?"

# With files (massive context window advantage)
gemini -f large_codebase.py "Explain all the design patterns used in this file"
gemini -f *.py "Find all functions that make database calls without error handling"

# Pipe output
cat debug.log | gemini "Summarize these logs and identify the root cause"

# Code generation
gemini "Write a Python function that parses IITM student roll numbers
like CS21B1001 into {department, year, number}"

# With Gemini 2.5 Pro's 1M token window
cat entire_codebase.md | gemini "Refactor suggestions for this entire codebase"
```

---

## GitHub Copilot

Copilot works inside your editor (VS Code, JetBrains, Vim). The key is knowing **when to accept** and **when to reject**.

### Setup in VS Code

```
1. Install "GitHub Copilot" extension
2. Sign in to GitHub account with Copilot subscription
3. The extension activates automatically
```

### Copilot Chat Commands

```
# In VS Code: Ctrl+Shift+I (Copilot Chat)

@workspace "How is authentication implemented in this project?"
@workspace "Where are all the database queries?"
@workspace "Add logging to all API endpoints"

/explain     # explain selected code
/fix         # fix selected code  
/tests       # generate tests for selected code
/doc         # generate docstrings
```

### Inline Completion Tips

```python
# Copilot is best when your function name and type hints are precise:

# ✅ Copilot gives great suggestions for:
def parse_student_id(roll_number: str) -> dict[str, str]:
    """Parse IITM roll number format: CS21B1001
    Returns: {department, year, type, number}
    """
    # ← Copilot completes this well

# ❌ Copilot struggles with:
def process(data):
    # ← Too vague, completions are generic
```

### When to Accept vs Reject

```
✅ Accept when:
- Simple utility functions (parsing, formatting, validation)
- Boilerplate (CRUD endpoints, test setup, argparse)
- Well-understood patterns you know how to verify
- Type hint generation

❌ Reject when:
- Security-sensitive code (auth, crypto) — always write manually
- Complex business logic — verify every line carefully
- Database queries — SQL injection risk
- You don't understand what it wrote
```

---

## Cursor

Cursor is a VS Code fork with deep AI integration. Best for long context edits across multiple files.

### Key Features

| Feature | How to Use | When to Use |
|---------|-----------|-------------|
| **Tab completion** | Just press Tab | Quick inline completions |
| **Cmd+K** | Edit selected code with instruction | Targeted refactors |
| **Cmd+L** | Chat with codebase | Exploration, questions |
| **Composer** | Multi-file changes | Feature implementation |
| **@ mentions** | `@file.py`, `@function`, `@docs` | Give context explicitly |

### Practical Cursor Workflows

**Multi-file feature implementation (Composer):**
```
Cmd+Shift+I → Composer

"Add Redis caching to the /products endpoint.
@main.py @cache.py @tests/test_products.py

1. Cache GET /products for 5 minutes
2. Invalidate cache on POST/PUT/DELETE
3. Add tests for cache hit and miss scenarios"
```

**Targeted refactor (Cmd+K):**
```python
# Select this function, press Cmd+K, type:
# "Convert to async, use asyncpg instead of sqlite3"

def get_user(user_id: int):
    conn = sqlite3.connect("users.db")
    row = conn.execute("SELECT * FROM users WHERE id=?", [user_id]).fetchone()
    conn.close()
    return dict(row) if row else None
```

**Understanding a new codebase (Cmd+L):**
```
Cmd+L chat:
"@codebase What is the overall architecture of this project?
Walk me through how a request flows from HTTP to database and back."
```

### Cursor Rules (.cursorrules)

```markdown title=".cursorrules"
You are helping me build a FastAPI service for the TDS course at IIT Madras.

## Tech Stack
- Python 3.12, FastAPI, asyncpg, Redis, UV
- Tests with pytest + httpx AsyncClient

## My Coding Style
- Always use type hints
- Use structlog for logging (never print)
- Async everywhere — no sync DB calls
- Tests for every new route

## Common Patterns
- Route handler → calls service function → calls db function
- All DB functions in db/ directory
- Pydantic models in models/ directory

## Do Not
- Use ORMs (use raw asyncpg)
- Generate placeholder comments like "# TODO: implement this"
- Use global variables (use FastAPI Depends for shared state)
```

---

## Comparing the Tools

| | Claude Code | Gemini CLI | Copilot | Cursor |
|--|-------------|-----------|---------|--------|
| **Context** | Reads whole project | 1M token window | IDE workspace | Codebase index |
| **Mode** | Terminal, agentic | Terminal | Editor inline | Editor, multi-file |
| **Best for** | Complex tasks, refactors | Large file analysis | Boilerplate, snippets | Feature implementation |
| **Cost** | Claude API pricing | Gemini API pricing | $10/mo subscription | $20/mo subscription |
| **Executes commands** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Free tier** | Via Anthropic account | ✅ 60 req/min free | ❌ No | ✅ Limited |

---

## Effective AI-Assisted Development Workflow

The best developers use AI assistants **as a pair programmer**, not as a vending machine:

```
1. PLAN first (yourself)
   "I need to add rate limiting to the API"
   
2. SCOPE the task for the AI
   "Add slowapi rate limiting to main.py.
    5 requests/minute on /generate.
    50 requests/minute on all other endpoints."
   
3. REVIEW what it produces
   Read every line. Do you understand it?
   
4. TEST it (don't trust, verify)
   Run the tests. Add new ones if missing.
   
5. ITERATE
   "The test for rate limit exceeded returns 500 instead of 429. Fix it."
```

!> **Never blindly accept AI-generated code in these areas**
!> - Authentication and authorization logic
!> - Password hashing or crypto
!> - SQL queries (SQL injection risk)
!> - Payment processing
!> - Any code that handles PII
!>
!> Always write these yourself and review them carefully.