# Day 3 — Virtual Environments

> **Goal:** Understand why virtual environments exist, how they work, and how to create and use them — so your projects never break each other's dependencies.

---

## The Problem: Why Virtual Environments?

Imagine you have two Python projects:

```
Project A — needs pandas==1.5.0
Project B — needs pandas==2.1.0
```

If you install both globally (system-wide), only one version of `pandas` can exist at a time. Installing one breaks the other.

```bash
# Without virtual environments:
pip install pandas==1.5.0    # Project A works
pip install pandas==2.1.0    # Project A BREAKS, Project B works
```

This is called **dependency hell**.

### 🧠 Knowledge Check

**Q1:** What problem do virtual environments solve?

- A) They make Python code run faster
- B) They allow you to write Python code in a web browser
- C) They prevent dependency conflicts by allowing different projects to have their own isolated package versions
- D) They hide your code from other users

<details>
<summary><b>Answer</b></summary>

**C** — Virtual environments isolate dependencies so that upgrading a package in Project A doesn't accidentally break Project B.

</details>

---

## The Solution: Virtual Environments

A **virtual environment** is an isolated Python installation for a single project. Each project gets its own set of packages.

```
System Python (/usr/bin/python3)
│
├── Project A  (/home/you/project-a/.venv/)
│   └── pandas==1.5.0
│   └── numpy==1.24.0
│
└── Project B  (/home/you/project-b/.venv/)
    └── pandas==2.1.0
    └── numpy==1.26.0
```

Each `.venv/` folder contains:
- A copy/link to the Python interpreter
- Its own `pip`
- Its own installed packages

> **Rule:** Every Python project should have its own virtual environment. Never install project dependencies globally.

---

## How Virtual Environments Work

When you **activate** a virtual environment, your shell temporarily changes which `python` and `pip` commands point to:

```bash
# Before activation:
which python3
# /usr/bin/python3         ← system Python

# After activation:
source .venv/bin/activate
which python3
# /home/you/project/.venv/bin/python3   ← project's Python
```

The activation modifies your `PATH` so `.venv/bin/` comes first.

---

## Creating Virtual Environments — Three Methods

### Method 1: Using `python3 -m venv` (built-in)

```bash
cd ~/my-project

# Create the virtual environment:
python3 -m venv .venv

# Activate it:
source .venv/bin/activate

# Your prompt changes:
# (.venv) alice@machine:~/my-project$

# Install packages (isolated):
pip install requests

# Deactivate when done:
deactivate
```

### Method 2: Using `uv` (recommended — much faster)

```bash
cd ~/my-project

# Create the virtual environment:
uv venv

# Activate it:
source .venv/bin/activate

# Install packages (blazing fast):
uv pip install requests

# Deactivate:
deactivate
```

### Method 3: Let `uv` manage it automatically

With `uv`, you often don't need to manually create or activate environments:

```bash
# uv init creates a project with its own environment:
uv init my-project
cd my-project

# uv add installs packages into the project's environment:
uv add requests

# uv run executes commands inside the environment:
uv run python main.py

# No manual activation needed!
```

> **We recommend Method 3** for this course. `uv` handles environments automatically.

---

## The `.venv` Directory

```bash
ls -la .venv/
# bin/          ← python, pip, activate (the executables)
# lib/          ← installed packages
# include/      ← C header files (for compiled packages)
# pyvenv.cfg    ← configuration file
```

### Important: `.venv` should NOT be committed to Git

Add it to `.gitignore`:

```bash
echo ".venv/" >> .gitignore
```

Why? The `.venv/` directory is large (can be hundreds of MB) and is machine-specific. Instead, you share a `requirements.txt` or `pyproject.toml` so others can recreate it.

---

## Dependency Files

### `requirements.txt` (traditional)

```bash
# Generate from current environment:
pip freeze > requirements.txt

# Install from file:
pip install -r requirements.txt
```

Example `requirements.txt`:
```
requests==2.31.0
pandas==2.1.4
numpy==1.26.2
```

### `pyproject.toml` (modern — used by `uv`)

```toml
[project]
name = "my-project"
version = "0.1.0"
dependencies = [
    "requests>=2.31",
    "pandas>=2.1",
]
```

### `uv.lock` (lockfile — exact versions)

`uv` generates a lockfile that pins exact versions for reproducibility:

```bash
uv lock    # creates/updates uv.lock
uv sync    # installs exactly what's in uv.lock
```

> **Commit `pyproject.toml` and `uv.lock` to Git.** Do NOT commit `.venv/`.

### 🧠 Knowledge Check

**Q1:** What is the purpose of the `uv.lock` file?

- A) It encrypts your source code
- B) It prevents other users from editing your project
- C) It records the exact versions of all installed dependencies to ensure everyone working on the project has an identical environment
- D) It locks the virtual environment so it cannot be deleted

<details>
<summary><b>Answer</b></summary>

**C** — A lockfile guarantees reproducibility by pinning exact package versions (e.g., `requests==2.31.0` rather than just `requests>=2.31`).

</details>

---

## Common Workflow

```bash
# 1. Create project
uv init my-tool
cd my-tool

# 2. Add dependencies
uv add httpx rich

# 3. Write code
cat > main.py << 'EOF'
import httpx
from rich import print

response = httpx.get("https://httpbin.org/get")
print(response.json())
EOF

# 4. Run code
uv run python main.py

# 5. Share with teammate
# They clone your repo and run:
uv sync          # installs exact same packages
uv run python main.py
```

---

## Q&A

<details>
<summary><b>Q: What happens if I forget to activate the virtual environment?</b></summary>

**A:** You'll use the system Python and system packages instead of your project's. This means:
- Packages you installed in the venv won't be available
- Packages you install will go to the system Python (affecting all projects)

With `uv run`, you don't need to activate — it automatically uses the project's environment.

</details>

<details>
<summary><b>Q: Can I delete <code>.venv/</code> and recreate it?</b></summary>

**A:** Yes! The `.venv/` is completely regenerable from your `pyproject.toml` and `uv.lock`:
```bash
rm -rf .venv
uv sync          # recreates .venv with exact same packages
```

This is why you should never commit `.venv/` to Git — it's a derived artifact.

</details>

<details>
<summary><b>Q: What is the difference between <code>pip install</code> and <code>uv add</code>?</b></summary>

**A:**
- `pip install requests` — installs the package but doesn't record it anywhere permanently
- `uv add requests` — installs the package AND adds it to `pyproject.toml` AND updates `uv.lock`

With `uv add`, your dependencies are always tracked in your project configuration.

</details>

<details>
<summary><b>Q: Why not just install everything globally?</b></summary>

**A:** Because:
1. **Version conflicts** — different projects need different versions
2. **Reproducibility** — you can't tell which packages belong to which project
3. **Cleanup** — uninstalling a project's packages is a nightmare
4. **Collaboration** — teammates can't reproduce your exact environment

</details>

<details>
<summary><b>Q: How do I know if my virtual environment is active?</b></summary>

**A:** Look at your terminal prompt. When active, you'll see `(.venv)` at the beginning:
```bash
(.venv) alice@machine:~/project$
```

You can also check:
```bash
which python3
# If it shows .venv/bin/python3 → venv is active
# If it shows /usr/bin/python3 → venv is NOT active
```

</details>

---

## Exercises

**Exercise 1: Create a virtual environment manually**

```bash
mkdir -p /tmp/venv-test
cd /tmp/venv-test

# Create a venv:
python3 -m venv .venv

# Check what was created:
ls .venv/bin/
```

<details>
<summary><b>What do you see in <code>.venv/bin/</code>?</b></summary>

```
activate       activate.csh   activate.fish
pip            pip3           pip3.12
python         python3        python3.12
```

These are the virtual environment's executables. When you activate, `python3` points to `.venv/bin/python3` instead of `/usr/bin/python3`.

</details>

---

**Exercise 2: Activate and install**

```bash
cd /tmp/venv-test

# Activate:
source .venv/bin/activate

# Check:
which python3
pip install rich

# Test:
python3 -c "from rich import print; print('[bold green]It works![/bold green]')"

# Deactivate:
deactivate

# Try again (should fail):
python3 -c "from rich import print; print('test')"
```

<details>
<summary><b>What happens after deactivate?</b></summary>

After `deactivate`, `python3` points back to the system Python, which doesn't have `rich` installed. You'll get:
```
ModuleNotFoundError: No module named 'rich'
```

This proves the virtual environment is isolated.

</details>

---

**Exercise 3: Use uv to manage a project**

```bash
cd /tmp
uv init my-demo
cd my-demo

# Add a dependency:
uv add httpx

# Check what was created:
cat pyproject.toml
ls -la

# Write and run a script:
echo 'import httpx; print(httpx.get("https://httpbin.org/ip").json())' > main.py
uv run python main.py
```

<details>
<summary><b>What does this do?</b></summary>

1. `uv init` creates a project with `pyproject.toml`, `README.md`, etc.
2. `uv add httpx` installs `httpx` into the project's `.venv/` and records it in `pyproject.toml`
3. `uv run python main.py` runs the script using the project's Python environment

The output should show your public IP address (from the httpbin API).

</details>

---

**Exercise 4: MCQ**

**Q1:** What does a virtual environment isolate?

- A) Your files from other users
- B) Your Python packages from other projects
- C) Your terminal from the rest of the system
- D) Your code from the internet

<details>
<summary><b>Answer</b></summary>

**B** — A virtual environment gives each project its own set of Python packages, preventing version conflicts between projects.

</details>

---

**Q2:** Which file should be committed to Git?

- A) `.venv/`
- B) `pyproject.toml`
- C) `.venv/lib/`
- D) `.venv/bin/python3`

<details>
<summary><b>Answer</b></summary>

**B** — `pyproject.toml` (and `uv.lock`) should be committed. The `.venv/` directory should be in `.gitignore` — it's large and machine-specific.

</details>

---

**Q3:** What does `uv run python script.py` do differently from `python3 script.py`?

- A) Nothing — they are identical
- B) `uv run` automatically uses the project's virtual environment
- C) `uv run` runs Python faster
- D) `uv run` requires the internet

<details>
<summary><b>Answer</b></summary>

**B** — `uv run` ensures the command runs inside the project's virtual environment, even if you haven't manually activated it. It also ensures dependencies are synced first.

</details>

---

Clean up:

```bash
rm -rf /tmp/venv-test /tmp/my-demo
```
