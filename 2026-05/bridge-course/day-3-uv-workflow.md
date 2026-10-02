# Day 3 — UV Workflow

> **Goal:** Learn the day-to-day `uv` commands to create projects, manage dependencies, run scripts, and keep your Python environment reproducible.

---

## What Is UV?

**uv** is an extremely fast Python package and project manager built by [Astral](https://astral.sh/) (the same team behind `ruff`). It replaces several tools:

| Traditional tool | What it does | uv equivalent |
|---|---|---|
| `pip` | Install packages | `uv pip install` / `uv add` |
| `venv` | Create virtual environments | `uv venv` |
| `pyenv` | Manage Python versions | `uv python install` |
| `pipx` | Run CLI tools | `uvx` |
| `pip-tools` | Lock dependencies | `uv lock` |

**Why uv?** It's 10-100x faster than pip. A full dependency install that takes pip 30 seconds takes uv under 1 second.

---

## Installing UV

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh

# Verify:
uv --version
```

If `uv` is not found after install, add it to your PATH:
```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

## Managing Python Versions

```bash
# See what Python versions are available:
uv python list

# Install a specific version:
uv python install 3.13

# See installed versions:
uv python list --only-installed
```

---

## Creating a New Project

### Method 1: Application (script/app you run)

```bash
uv init my-app
cd my-app
```

This creates:
```
my-app/
├── .python-version     ← which Python version to use
├── README.md
├── main.py             ← entry point
└── pyproject.toml      ← project metadata + dependencies
```

### Method 2: Library (package others install)

```bash
uv init --lib my-library
cd my-library
```

This creates:
```
my-library/
├── .python-version
├── README.md
├── pyproject.toml
└── src/
    └── my_library/
        ├── __init__.py
        └── py.typed
```

The `--lib` flag creates a `src/` layout — best practice for publishable packages.

### 🧠 Knowledge Check

**Q1:** If you are building a tool that you intend to publish as a reusable Python package, which command should you use to initialize it?

- A) `uv init my-library`
- B) `uv init --lib my-library`
- C) `uv create my-library`
- D) `uv new my-library`

<details>
<summary><b>Answer</b></summary>

**B** — The `--lib` flag sets up a `src/` layout, which is the standard best practice for building Python libraries.

</details>

---

## Managing Dependencies

### Adding packages

```bash
# Add a dependency:
uv add requests
uv add pandas numpy

# Add a development-only dependency:
uv add --dev pytest ruff

# Add with version constraints:
uv add "requests>=2.31"
uv add "pandas>=2.0,<3.0"
```

### What happens when you `uv add`:

1. Installs the package into `.venv/`
2. Adds it to `pyproject.toml` under `[project.dependencies]`
3. Updates `uv.lock` with exact resolved versions

### Removing packages

```bash
uv remove requests
```

### Syncing (installing from lockfile)

```bash
# Install everything from uv.lock:
uv sync

# Install including dev dependencies:
uv sync --all-groups
```

> **When to use `uv sync`:** After cloning a repo, or after pulling changes that updated `pyproject.toml` or `uv.lock`.

---

## Running Scripts and Commands

### `uv run` — Run inside the project environment

```bash
# Run a Python script:
uv run python main.py

# Run a module:
uv run python -m pytest

# Run any command in the project's environment:
uv run ruff check .
```

**`uv run` automatically:**
- Creates the `.venv/` if it doesn't exist
- Syncs dependencies if needed
- Runs the command inside the environment

### `uvx` — Run CLI tools without installing

```bash
# Run a tool without adding it to your project:
uvx ruff check .
uvx black main.py
uvx httpie GET https://httpbin.org/get
```

`uvx` is like `npx` for Python — runs a tool in a temporary, isolated environment.

---

## The `pyproject.toml` File

This is the heart of your project. Here's what a typical one looks like:

```toml
[project]
name = "my-app"
version = "0.1.0"
description = "A cool tool built during TDS bootcamp"
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
    "httpx>=0.27",
    "rich>=13.0",
]

[dependency-groups]
dev = [
    "pytest>=8",
    "ruff>=0.8",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

| Section | Purpose |
|---|---|
| `[project]` | Metadata: name, version, description |
| `dependencies` | Packages your code needs to run |
| `[dependency-groups] dev` | Packages only needed for development |
| `requires-python` | Minimum Python version |
| `[build-system]` | How to build the package |

### 🧠 Knowledge Check

**Q1:** Which file does `uv` use to keep track of project metadata and required dependencies?

- A) `requirements.txt`
- B) `package.json`
- C) `pyproject.toml`
- D) `Pipfile`

<details>
<summary><b>Answer</b></summary>

**C** — `pyproject.toml` is the modern standard for Python project configuration and dependency tracking.

</details>

---

## The `uv.lock` File

The lockfile pins **exact versions** of every dependency (including transitive ones):

```
# This file is auto-generated by uv
# Do not edit manually

[[package]]
name = "httpx"
version = "0.27.2"
source = { registry = "https://pypi.org/simple" }
dependencies = [
    { name = "anyio" },
    { name = "certifi" },
    ...
]
```

**Why it matters:**
- `pyproject.toml` says "I need httpx >= 0.27"
- `uv.lock` says "I need httpx == 0.27.2 with anyio == 4.6.2 with certifi == 2024.8.30 ..."

The lockfile ensures everyone gets exactly the same versions.

> **Commit both `pyproject.toml` AND `uv.lock` to Git.**

---

## Complete Workflow Example

Let's build a tiny tool from scratch:

```bash
# 1. Create project
uv init weather-report
cd weather-report

# 2. Add dependencies
uv add httpx rich

# 3. Write the code
cat > main.py << 'PYEOF'
"""Fetch and display weather data."""
import httpx
from rich.console import Console
from rich.table import Table

console = Console()

def get_weather():
    """Fetch weather data from a public API."""
    url = "https://wttr.in/?format=j1"
    response = httpx.get(url, timeout=10)
    data = response.json()

    current = data["current_condition"][0]

    table = Table(title="Current Weather")
    table.add_column("Metric", style="cyan")
    table.add_column("Value", style="green")

    table.add_row("Temperature", f"{current['temp_C']}°C")
    table.add_row("Feels Like", f"{current['FeelsLikeC']}°C")
    table.add_row("Humidity", f"{current['humidity']}%")
    table.add_row("Description", current["weatherDesc"][0]["value"])

    console.print(table)

if __name__ == "__main__":
    get_weather()
PYEOF

# 4. Run it
uv run python main.py

# 5. Add a test
uv add --dev pytest

cat > test_main.py << 'PYEOF'
from main import get_weather

def test_get_weather_runs():
    """Smoke test — just make sure it doesn't crash."""
    # This will make a real HTTP call
    get_weather()
PYEOF

# 6. Run tests
uv run pytest -v

# 7. Check what's in the project
tree -a -I '.git|.venv|__pycache__'
```

---

## UV Command Cheatsheet

| Command | What it does |
|---|---|
| `uv init my-app` | Create a new application project |
| `uv init --lib my-lib` | Create a new library project |
| `uv add <package>` | Add a dependency |
| `uv add --dev <package>` | Add a dev dependency |
| `uv remove <package>` | Remove a dependency |
| `uv sync` | Install all dependencies from lockfile |
| `uv run <command>` | Run a command in the project environment |
| `uv lock` | Update the lockfile |
| `uv python install 3.13` | Install a Python version |
| `uv build` | Build a distributable package |
| `uvx <tool>` | Run a CLI tool without installing |

---

## Q&A

<details>
<summary><b>Q: Do I need to activate the virtual environment when using uv?</b></summary>

**A:** No — `uv run` handles it for you. It automatically uses the project's `.venv/`. You only need to activate manually if you want to use `python` or `pip` directly without the `uv run` prefix.

</details>

<details>
<summary><b>Q: What is the difference between <code>uv add</code> and <code>uv pip install</code>?</b></summary>

**A:**
- `uv add requests` — adds to `pyproject.toml`, updates `uv.lock`, installs in `.venv/`. The dependency is tracked.
- `uv pip install requests` — installs in `.venv/` but does NOT update `pyproject.toml`. The dependency is untracked.

**Always use `uv add`** for project dependencies.

</details>

<details>
<summary><b>Q: How do I update a package to its latest version?</b></summary>

**A:**
```bash
uv add --upgrade requests    # update a specific package
uv lock --upgrade            # update all packages to latest compatible versions
uv sync                      # install the updated versions
```

</details>

<details>
<summary><b>Q: What if I clone someone else's uv project?</b></summary>

**A:** Just run:
```bash
git clone <repo-url>
cd <repo>
uv sync         # installs exact versions from uv.lock
uv run python main.py
```

That's it — `uv sync` creates the `.venv/` and installs everything.

</details>

---

## Exercises

**Exercise 1: Create and run a project**

```bash
uv init /tmp/uv-practice
cd /tmp/uv-practice
uv add rich
```

Write a script that prints a styled message:

```python
# main.py
from rich import print
print("[bold magenta]Hello from UV![/bold magenta]")
print("[green]Dependencies are managed automatically.[/green]")
```

<details>
<summary><b>Run it and check</b></summary>

```bash
uv run python main.py
```

You should see colorful, styled text in your terminal. If `rich` wasn't installed, `uv run` would fail with `ModuleNotFoundError`.

</details>

---

**Exercise 2: Inspect the project structure**

```bash
cat pyproject.toml
ls -la .venv/bin/ | head -10
cat .python-version
```

<details>
<summary><b>What should you see?</b></summary>

- `pyproject.toml` shows `rich` in the `dependencies` list
- `.venv/bin/` contains `python`, `python3`, and possibly `rich` CLI tools
- `.python-version` shows something like `3.13`

</details>

---

**Exercise 3: Add and remove packages**

```bash
uv add httpx
cat pyproject.toml   # httpx should appear in dependencies

uv remove httpx
cat pyproject.toml   # httpx should be gone
```

<details>
<summary><b>What happened?</b></summary>

- `uv add httpx` added `"httpx>=0.27"` (or similar) to `[project.dependencies]` in `pyproject.toml` and updated `uv.lock`.
- `uv remove httpx` removed it from both files and uninstalled it from `.venv/`.

</details>

---

**Exercise 4: MCQ**

**Q1:** What does `uv init --lib my-package` create that `uv init my-app` does not?

- A) A `pyproject.toml` file
- B) A `src/` directory with proper package layout
- C) A virtual environment
- D) A `README.md` file

<details>
<summary><b>Answer</b></summary>

**B** — `--lib` creates a `src/` layout with `__init__.py`, which is the best practice for Python libraries that will be installed by others.

</details>

---

**Q2:** After cloning a uv project, which single command sets up the environment?

- A) `pip install -r requirements.txt`
- B) `uv sync`
- C) `python3 -m venv .venv`
- D) `uv init`

<details>
<summary><b>Answer</b></summary>

**B** — `uv sync` reads `uv.lock`, creates `.venv/` if needed, and installs all dependencies at the exact pinned versions.

</details>

---

Clean up:

```bash
rm -rf /tmp/uv-practice
```

---

