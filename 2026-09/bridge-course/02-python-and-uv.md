# Module 2: Python & uv

You will run the same small program in two environments, then let uv manage a standalone script for you. No Python programming background is needed for these examples.

> Start with Module 1 complete. Keep your Python code outside `.venv`; that folder is for installed software.

## Quick game: CodeCombat

Use the free beginner levels to see Python-like instructions produce an immediate result.

1. Open [CodeCombat](https://codecombat.com/play) and select a beginner level and **Python**.
2. Read the goal, predict what the supplied code will do, then run it.
3. Change one instruction, run again, and state what changed.
4. Stop after one completed level; if payment is requested, do not continue.

CodeCombat's hero commands belong to the game. Then edit `scripts/hello.py` in this module to practise real local Python.

## Learning path

Open a section to begin. Work in order, try the commands, and reveal answers only after choosing your own.

<details name="module-2">
<summary><strong>2.1 · Your first Python file</strong></summary>

## Learn + try

Python is a language; the Python interpreter is the program that runs your code. A package is reusable code someone else has written.

```bash
cd ~/bridge-lab
nano scripts/hello.py
```

Enter this Python code, save with Ctrl+O and Enter, and exit with Ctrl+X:

```python
name = "Explorer"
tools = ["terminal", "Python", "HTTP", "Git"]
print(f"Hello, {name}!")
print(f"I am learning {len(tools)} tools.")
```

### Read the Python code

| Part | Meaning |
| --- | --- |
| `name` | A variable storing text |
| `tools` | A list of tool names |
| `len(tools)` | Count the list’s entries |
| `print(...)` | Display a value |
| `f"Hello, {name}!"` | Insert an expression’s value inside `{}` into a string |

### Run your file

```bash
python3 scripts/hello.py
```

## Check

- [ ] The script prints `Hello, Explorer!` and `I am learning 4 tools.`
- [ ] I changed the name and added one tool, predicted the new number, saved, and ran it again.

If `python3` is not found, return to Module 1’s installation section. If Python reports a syntax error, check matching quotes, brackets, and the line number. You can use your existing editor instead of nano.

</details>

<details name="module-2">
<summary><strong>2.2 · Why environments?</strong></summary>

## Learn

Imagine two projects needing different versions of a package. Installing everything into the operating system’s Python can make those projects interfere with one another. A virtual environment gives a project its own interpreter entry point and package directory.

Here are the **two environment workflows** we will compare. These are not two incompatible kinds of Python:

| Workflow | Create it | Install a package | Run code |
| --- | --- | --- | --- |
| Python’s built-in `venv` + pip | `python3 -m venv .venv` | Activate, then `python -m pip install rich` | `python file.py` |
| uv-created environment | `uv venv` | `uv pip install rich` | `.venv/bin/python file.py` |

### Understand activation

- Both workflows can create a local `.venv` directory.
- **Activation:** changes which `python` your current shell finds.
- **Direct path:** activation is unnecessary if you use `.venv/bin/python` explicitly.
- **New terminal:** activate again to use the environment through `python`.

See [Python’s explanation](https://docs.python.org/3/library/venv.html) and [uv’s environment workflow](https://docs.astral.sh/uv/pip/environments/).

We use **separate practice directories** to compare the workflows without accidentally reusing one environment. A third convenience, **uv script mode**, manages an environment automatically rather than making you activate one. You will try that later in this module.

### Pause and explain

**Why is `python -m pip install rich` safer here than typing `pip install rich`?**

<details>
<summary>Check your explanation</summary>

`python -m pip` runs the `pip` belonging to the exact `python` command you chose. A bare `pip` can refer to a different installation, especially when several Python versions or environments exist.

</details>

## Predict

Does copying `.venv` into your friend’s project reliably reproduce your environment?

<details>
<summary>Answer</summary>

No. Environments can contain machine-specific paths. Share source files and dependency information; recreate the environment on the other machine.

</details>

</details>

<details name="module-2">
<summary><strong>2.3 · Try standard venv</strong></summary>

## Practice

On Ubuntu/WSL, confirm environment support is installed first:

```bash
sudo apt install python3-venv
```

On macOS, use Python from the official installer; no separate `apt` package is needed. Now all learners run:

```bash
mkdir -p ~/bridge-lab/venv-practice
cd ~/bridge-lab/venv-practice
python3 -m venv .venv
source .venv/bin/activate
python -m pip install rich
python -c 'import sys; print(sys.executable)'
python -c 'from rich import print; print("[green]My environment works![/green]")'
python ../scripts/hello.py
deactivate
```

### Decode the commands

| Part | Purpose |
| --- | --- |
| `-m venv` | Run Python’s environment module |
| `source` | Apply activation to this shell |
| `python -m pip` | Use that interpreter’s package installer |
| `-c` | Run the short Python code given in quotes |
| `rich` | Add formatted terminal output |
| `deactivate` | Restore the shell’s previous interpreter selection |

## Check

- [ ] The interpreter path includes `venv-practice/.venv/bin/python`.
- [ ] My greeting still runs, and `deactivate` returns to the earlier interpreter selection without deleting the environment.

## Try it yourself

Activate again and run the green message a second time. Then deactivate before the next section.

<details>
<summary>When installation fails</summary>

- **ensurepip/venv missing on Ubuntu:** install the matching venv package for your Python version; for the default Ubuntu Python, start with `python3-venv`.
- **Externally managed environment:** check that activation succeeded and the printed interpreter path contains `.venv`; do not bypass the system protection.
- **Download error:** check your connection and retry the package installation.

</details>

</details>

<details name="module-2">
<summary><strong>2.4 · Try uv venv</strong></summary>

## Practice

Start in a fresh directory with no activated environment:

```bash
mkdir -p ~/bridge-lab/uv-practice
cd ~/bridge-lab/uv-practice
uv venv
uv pip install rich
.venv/bin/python -c 'import sys; print(sys.executable)'
.venv/bin/python -c 'from rich import print; print("[green]uv environment works![/green]")'
.venv/bin/python ../scripts/hello.py
```

## Check

- [ ] The interpreter path includes `uv-practice/.venv/bin/python` without activating the environment.
- [ ] `rich` imports from this environment. `uv pip` installed it without needing a separate pip installation.

### Optional: try activation

1. Activate with `source .venv/bin/activate`.
2. Use `python` instead of the full interpreter path.
3. Run `deactivate` before moving on.

The important question is always: **which interpreter is running this file?**

### Compare in your notes

1. Find `.venv` in both practice folders.
2. Locate your shared source file: `scripts/hello.py`.
3. Explain why installing a package in one environment does not install it into the other.

### If something fails

- **`uv` missing:** reopen the terminal after installation and recheck `uv --version`.
- **Package missing:** inspect `sys.executable` before reinstalling anything.

</details>

<details name="module-2">
<summary><strong>2.5 · Let uv manage a project</strong></summary>

## Practice

Use a project when several files share dependencies. It keeps a manifest (`pyproject.toml`) and a resolved dependency record (`uv.lock`). `uv run` creates or updates the project’s environment when needed. [Project workflow reference](https://docs.astral.sh/uv/guides/projects/).

```bash
cd ~/bridge-lab
uv init --bare --vcs none uv-project
cd uv-project
uv add rich
uv run python -c 'from rich import print; print("[bold green]Project ready[/bold green]")'
ls -a
```

### What each option does

- **`--bare`:** start with minimal project scaffolding.
- **`--vcs none`:** avoid a nested Git repository before our Git lesson.
- **`uv add`:** record the dependency.
- **`uv run`:** select the project environment without manual activation.

### Know the project files

| Item | What it contains |
| --- | --- |
| `pyproject.toml` | Declared project requirements |
| `uv.lock` | Resolved dependency versions |
| `.venv/` | The local environment uv can recreate |

### Pause and explain

**Why keep both `pyproject.toml` and `uv.lock` if uv can recreate `.venv`?**

<details>
<summary>Check your explanation</summary>

`pyproject.toml` states the dependencies you intend to use. `uv.lock` records the exact resolved versions used together. uv can rebuild the machine-specific `.venv` from those portable project files.

</details>

## Check

- [ ] I found `pyproject.toml`, `uv.lock`, and `.venv`.
- [ ] I used `cat pyproject.toml` and found `rich` in the project manifest.

**Choice rule:** use a project for a growing folder of code. Use the next section’s script workflow for a small, shareable one-file task.

</details>

<details name="module-2">
<summary><strong>2.6 · One file, automatic environment</strong></summary>

## Practice

uv supports dependency metadata inside a Python file. It creates and reuses a managed, isolated environment for that script; you do not manually create or activate a project `.venv`.

```bash
cd ~/bridge-lab
uv init --script scripts/check-in.py --python 3.12
uv add --script scripts/check-in.py rich
nano scripts/check-in.py
```

Keep the generated `# /// script` metadata at the top. Replace the generated program **below** that metadata with:

```python
import sys
from rich import print

print("[bold green]Bridge check-in: ready to learn![/bold green]")
print(f"Python executable: {sys.executable}")
```

Save, then run twice:

```bash
uv run --script scripts/check-in.py
uv run --script scripts/check-in.py
```

### What happens when you run it?

1. **Identify:** `--script` identifies the target script.
2. **Read requirements:** inline metadata declares Python and package requirements.
3. **Prepare:** the first run may download Python or packages.
4. **Reuse:** later runs can reuse cached resources.

A script with metadata is isolated even when it sits in a uv project.

> **There is still an environment; uv manages it for you.**

See the [script guide](https://docs.astral.sh/uv/guides/scripts/) and [run command reference](https://docs.astral.sh/uv/reference/cli/).

## Check

- [ ] The message prints on both runs.
- [ ] The interpreter path points to uv’s managed environment rather than either practice `.venv`.
- [ ] `cat scripts/check-in.py` shows `rich` in the script’s metadata.

## Try it yourself

Change the message to name a skill you learned in this module and rerun. This file will be part of your final project.

</details>

## Check your understanding

Answer, then explain your choice out loud.

### 1. What does activating a venv change?

- **A.** It permanently replaces your operating system’s Python
- **B.** It changes interpreter selection in the current shell
- **C.** It uploads your packages to GitHub

**Answer and why:** B. Activation adjusts the shell’s environment. A different terminal is independent, and `deactivate` restores the previous selection.

### 2. Why can your metadata-equipped uv script run without manual activation?

- **A.** It never uses an environment
- **B.** rich is now part of every Python installation
- **C.** uv resolves the declared requirements and manages the script environment

**Answer and why:** C. Automatic environment management removes manual setup, not isolation. An ordinary script without dependency metadata does not automatically acquire packages it imports.

## Before you continue

- [ ] I ran hello.py and changed its output.
- [ ] I compared interpreter paths from standard venv and uv venv.
- [ ] I found rich in pyproject.toml and in script metadata.
- [ ] I ran check-in.py from a newly opened terminal using uv run --script.

If your imports fail, return to the interpreter-path check. If you are done, write three sentences comparing **manual venv**, **uv project**, and **uv script** in `notes/python.txt`.

## Explore yourself

Use one small script to strengthen your Python environment habits.

- Re-run `scripts/check-in.py` from a newly opened terminal with `uv run --script scripts/check-in.py`.
- Change one printed message, run it again, and use `cat scripts/check-in.py` to inspect its metadata.
- Return to the **CodeCombat** quick game above for a short Python adventure.

**Try next:** explain to yourself which environment runs the script and where `rich` is declared.


---

**Next:** [Module 3: HTTP & Chrome DevTools →](../03-http-and-devtools/)
