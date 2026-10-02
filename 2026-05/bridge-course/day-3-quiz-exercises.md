# Day 3 Quiz & Exercises
## TDS Bridge Bootcamp — VS Code + Python Projects with uv

> **Instructions:** Attempt MCQs first, then do the exercises in order in your terminal.

---

## Part A — 20 Multiple Choice Questions

**Q1.** You run `pip install pandas` without a virtual environment. A week later you start a new project that needs a different version of pandas. What is the likely problem?

- [ ] A) pip won't allow installing pandas twice
- [ ] B) Both projects share the same global pandas — changing the version for one breaks the other
- [ ] C) pip automatically creates separate environments per project
- [ ] D) You'll need to uninstall Python and reinstall it

<details>
<summary>Answer</summary>

**B** — Both projects share the same global pandas — changing the version for one breaks the other

</details>

---

**Q2.** What does `uv init myproject` do?

- [ ] A) Installs Python inside a folder called `myproject`
- [ ] B) Creates a new project folder with `pyproject.toml` and a starter structure
- [ ] C) Initialises a Git repository called `myproject`
- [ ] D) Downloads `myproject` from PyPI

<details>
<summary>Answer</summary>

**B** — `uv init` scaffolds a project with `pyproject.toml`

</details>


---

**Q3.** After running `uv add requests`, where are the installed files stored?

- [ ] A) Globally in `/usr/local/lib/python/`
- [ ] B) In a `.venv/` folder inside your project
- [ ] C) In `~/.local/share/uv/packages/`
- [ ] D) In the `pyproject.toml` file directly

<details>
<summary>Answer</summary>

**B** — uv installs into the project-local `.venv/`

</details>


---

**Q4.** What is the purpose of `uv.lock`?

- [ ] A) Prevents other users from modifying your project
- [ ] B) Records the exact versions of all packages so anyone can recreate the same environment
- [ ] C) Locks the Python version permanently
- [ ] D) Stores your API keys securely

<details>
<summary>Answer</summary>

**B** — Lock file freezes exact versions for reproducibility

</details>


---

**Q5.** A teammate clones your project and wants to install all the dependencies. Which command should they run?

- [ ] A) `pip install -r requirements.txt`
- [ ] B) `uv install`
- [ ] C) `uv sync`
- [ ] D) `uv add --all`

<details>
<summary>Answer</summary>

**C** — `uv sync` installs everything from `pyproject.toml` + lock

</details>


---

**Q6.** What is `pyproject.toml` used for?

- [ ] A) Running your Python script
- [ ] B) Storing project metadata and the list of dependencies
- [ ] C) Configuring VS Code settings
- [ ] D) Replacing your `.bashrc` for Python projects

<details>
<summary>Answer</summary>

**B** — `pyproject.toml` = project config + dependency list

</details>


---

**Q7.** You run `uv run main.py`. What happens?

- [ ] A) uv uploads `main.py` to a remote server and runs it there
- [ ] B) uv activates the project's virtual environment and runs `main.py` inside it
- [ ] C) uv installs `main.py` as a system command
- [ ] D) uv creates a new file called `main.py` and opens it

<details>
<summary>Answer</summary>

**B** — `uv run` uses the project's `.venv` automatically

</details>


---

**Q8.** What is the difference between `uv run script.py` and activating the venv manually then running `python script.py`?

- [ ] A) `uv run` is slower because it does extra setup
- [ ] B) The end result is the same — `uv run` just handles the activation for you automatically
- [ ] C) `uv run` uses a different Python than the virtual environment
- [ ] D) You must manually activate the venv first, then use `uv run`

<details>
<summary>Answer</summary>

**B** — Same result; `uv run` just saves you the activate step

</details>


---

**Q9.** In VS Code, how do you open the Command Palette?

- [ ] A) `Ctrl+P`
- [ ] B) `Ctrl+Shift+P`
- [ ] C) `Ctrl+Alt+P`
- [ ] D) `F1+P`

<details>
<summary>Answer</summary>

**B** — `Ctrl+Shift+P` opens the VS Code Command Palette

</details>


---

**Q10.** You've created a `uv` project but VS Code keeps using the wrong Python. What should you do?

- [ ] A) Reinstall VS Code
- [ ] B) Open Command Palette → "Python: Select Interpreter" → choose the `.venv` path
- [ ] C) Delete `.venv` and reinstall packages
- [ ] D) Add `python = ".venv"` to `pyproject.toml`

<details>
<summary>Answer</summary>

**B** — Select Interpreter tells VS Code which Python to use

</details>


---

**Q11.** What does the VS Code shortcut `Ctrl+Shift+F` do?

- [ ] A) Format the current file
- [ ] B) Find and replace in the current file only
- [ ] C) Search for text across all files in the project
- [ ] D) Open a new terminal

<details>
<summary>Answer</summary>

**C** — `Ctrl+Shift+F` = project-wide search

</details>


---

**Q12.** Which VS Code extension provides type checking and fast autocompletion for Python?

- [ ] A) Black
- [ ] B) Pylance
- [ ] C) Ruff
- [ ] D) Jupyter

<details>
<summary>Answer</summary>

**B** — Pylance provides IntelliSense and type checking

</details>


---

**Q13.** You're exploring a dataset for the first time — trying different filters, plotting, printing shapes. Which file type is more appropriate?

- [ ] A) A `.py` script, because it's faster
- [ ] B) A `.ipynb` notebook, because you want to run code cell by cell and see output interactively
- [ ] C) A `.toml` file, because it's more structured
- [ ] D) A `.sh` script, because Python is too slow for data exploration

<details>
<summary>Answer</summary>

**B** — Notebooks are ideal for interactive exploration

</details>


---

**Q14.** You've finished exploring data in a notebook and want to turn your cleaning code into something you can run every day automatically. What should you do?

- [ ] A) Keep using the notebook — just run all cells every day
- [ ] B) Move the code into a `.py` script that can be run from the terminal
- [ ] C) Convert the notebook to a `.toml` file
- [ ] D) Upload the notebook to GitHub and run it from there

<details>
<summary>Answer</summary>

**B** — Scripts are repeatable, testable, and automatable

</details>


---

**Q15.** What does the `source .venv/bin/activate` command do? (Method B)

- [ ] A) Installs packages into the virtual environment
- [ ] B) Creates the virtual environment
- [ ] C) Activates the virtual environment so `python` and `pip` point to it
- [ ] D) Deletes the virtual environment

<details>
<summary>Answer</summary>

**C** — `activate` redirects `python` and `pip` to the venv

</details>


---

**Q16.** After activating a virtual environment, your terminal prompt changes to show `(venv)` at the start. You then run `pip install flask`. Where does Flask get installed?

- [ ] A) Globally, because pip ignores the venv
- [ ] B) Into the active virtual environment only
- [ ] C) In the `pyproject.toml` file
- [ ] D) Into `~/.local/lib/`

<details>
<summary>Answer</summary>

**B** — Packages go into the active venv when it's activated

</details>


---

**Q17.** Which `uv` command removes a package from your project?

- [ ] A) `uv delete requests`
- [ ] B) `uv uninstall requests`
- [ ] C) `uv remove requests`
- [ ] D) `uv pip uninstall requests`

<details>
<summary>Answer</summary>

**C** — `uv remove <package>` removes it from the project

</details>


---

**Q18.** What does `uv venv` create?

- [ ] A) A new project with `pyproject.toml`
- [ ] B) A plain virtual environment folder (`.venv/`) without a full project structure
- [ ] C) A virtual machine
- [ ] D) A GitHub repository

<details>
<summary>Answer</summary>

**B** — `uv venv` = plain venv, no project structure

</details>


---

**Q19.** A friend gives you a project folder. It has `pyproject.toml` and `uv.lock` but no `.venv/`. What is the first command you should run?

- [ ] A) `uv init`
- [ ] B) `uv add`
- [ ] C) `uv sync`
- [ ] D) `python -m venv .venv`

<details>
<summary>Answer</summary>

**C** — `uv sync` recreates `.venv/` from the lock file

</details>


---

**Q20.** Which of these is true about `.venv/`?

- [ ] A) It should be committed to Git so teammates can use it
- [ ] B) It is listed in `.gitignore` because it can be recreated from `pyproject.toml` — no need to share it
- [ ] C) It contains your source code
- [ ] D) It is required to run `uv init`

<details>
<summary>Answer</summary>

**B** — `.venv/` is regenerable — never commit it to Git

</details>


---



**Q21.** Which command updates `uv` to the latest version?

- [ ] A) `uv update`
- [ ] B) `uv self update`
- [ ] C) `uv upgrade`
- [ ] D) `pip install --upgrade uv`

<details>
<summary>Answer</summary>

**B** — `uv self update` is the built-in update mechanism.

</details>

---

**Q22.** When you run `uv add pandas`, what happens to `pyproject.toml`?

- [ ] A) It is deleted
- [ ] B) `pandas` is added to the dependencies list
- [ ] C) It is backed up as `pyproject.bak`
- [ ] D) Nothing, it only affects `uv.lock`

<details>
<summary>Answer</summary>

**B** — `uv add` updates `pyproject.toml` and then `uv.lock`.

</details>

---

**Q23.** How do you run a specific Python script, like `test.py`, using `uv`?

- [ ] A) `uv test.py`
- [ ] B) `uv execute test.py`
- [ ] C) `uv run test.py`
- [ ] D) `uv python test.py`

<details>
<summary>Answer</summary>

**C** — `uv run` executes a script using the project's environment.

</details>

---

**Q24.** What is the benefit of a `.ipynb` file over a `.py` file?

- [ ] A) It runs much faster
- [ ] B) It can mix markdown text, code, and inline visualizations
- [ ] C) It is smaller in size
- [ ] D) It doesn't require Python to run

<details>
<summary>Answer</summary>

**B** — Notebooks are interactive and support markdown and outputs.

</details>

---

**Q25.** If you want to use a virtual environment without a `pyproject.toml`, which command do you use?

- [ ] A) `uv init`
- [ ] B) `uv venv`
- [ ] C) `uv add`
- [ ] D) `uv sync`

<details>
<summary>Answer</summary>

**B** — `uv venv` creates a raw `.venv` folder.

</details>

---

**Q26.** Where is the temporary virtual environment created when you run a script with `uv run --with pandas script.py`?

- [ ] A) In `.venv`
- [ ] B) In a global temporary cache managed by `uv`
- [ ] C) In the current directory as `temp_venv`
- [ ] D) In `/tmp/`

<details>
<summary>Answer</summary>

**B** — `uv` creates temporary, cached environments for ad-hoc scripts.

</details>

---

**Q27.** Why should you NOT run `pip install package` globally using `sudo`?

- [ ] A) It makes Python slower
- [ ] B) It can break system-level tools that rely on specific package versions
- [ ] C) It consumes too much disk space
- [ ] D) pip doesn't support sudo

<details>
<summary>Answer</summary>

**B** — Modifying global system packages can break the OS.

</details>

---

**Q28.** In VS Code, how do you verify you are using the correct Python interpreter?

- [ ] A) Check the bottom-right corner of the status bar
- [ ] B) Open settings and search for Python
- [ ] C) You have to run a script to find out
- [ ] D) It always uses the global Python

<details>
<summary>Answer</summary>

**A** — The selected interpreter is shown in the status bar.

</details>

---

**Q29.** What is the purpose of `uv sync`?

- [ ] A) Uploads your code to GitHub
- [ ] B) Syncs the `.venv` to perfectly match `uv.lock`
- [ ] C) Formats your Python files
- [ ] D) Deletes unused variables

<details>
<summary>Answer</summary>

**B** — `uv sync` ensures your environment matches the lockfile exactly.

</details>

---

**Q30.** Can `uv` manage Python versions itself?

- [ ] A) Yes, `uv python install` can install different Python versions
- [ ] B) No, you must install Python separately
- [ ] C) Yes, but only on Windows
- [ ] D) No, `uv` only manages packages, not Python

<details>
<summary>Answer</summary>

**A** — `uv` has built-in Python version management.

</details>

---

<details>
<summary>Full Answer Key (spoilers)</summary>

| Q | Answer |
|---|--------|
| 1 | B |
| 2 | B |
| 3 | B |
| 4 | B |
| 5 | C |
| 6 | B |
| 7 | B |
| 8 | B |
| 9 | B |
| 10 | B |
| 11 | C |
| 12 | B |
| 13 | B |
| 14 | B |
| 15 | C |
| 16 | B |
| 17 | C |
| 18 | B |
| 19 | C |
| 20 | B |
| 21 | B |
| 22 | B |
| 23 | C |
| 24 | B |
| 25 | B |
| 26 | B |
| 27 | B |
| 28 | A |
| 29 | B |
| 30 | A |

</details>

---

## Part B — Terminal Exercises

> All exercises use the terminal and VS Code. Do them in order.

---

### Exercise 1 — Create a project and add packages

```bash
cd ~/tds/bootcamp
uv init day3-practice
cd day3-practice
```

Now add two packages:

```bash
uv add requests pandas
```

Verify:

```bash
cat pyproject.toml    # Are requests and pandas listed?
ls -la                # Do you see .venv/ and uv.lock?
```

**Write down:** What exact versions of `requests` and `pandas` were installed? (Check `uv.lock`)

---

### Exercise 2 — Write and run a script

Create a file `main.py` in your project:

```python
# main.py
import requests
import pandas as pd

# Fetch some JSON data
response = requests.get("https://jsonplaceholder.typicode.com/users")
users = response.json()

# Put it in a DataFrame
df = pd.DataFrame(users)[["id", "name", "email", "phone"]]

# Sort by name
df = df.sort_values("name")

print(df.to_string(index=False))
```

Run it:

```bash
uv run main.py
```

**Expected:** A sorted table of 10 fake users printed to the terminal.

**Question:** What happens if you run `python main.py` instead of `uv run main.py`? Try it and explain why.

---

### Exercise 3 — Open in VS Code and select the interpreter

```bash
code .
```

Inside VS Code:
1. Open `main.py`
2. Press `Ctrl+Shift+P` → type `Python: Select Interpreter`
3. Choose the one with `.venv` in the path
4. Hover over `pd` or `requests` in the code — does VS Code show you the type info?
5. Press `` Ctrl+` `` to open the integrated terminal and run `uv run main.py` from there

---

### Exercise 4 — Understand what uv.lock does

```bash
# See the lockfile
cat uv.lock | head -30
```

Now simulate what a teammate would do after cloning your project:

```bash
# Delete the .venv to simulate a fresh clone
rm -rf .venv

# Restore everything from the lockfile
uv sync

# Confirm it works
uv run main.py
```

**Confirm:** Does the script still work after `uv sync`? That's reproducibility.

---

### Exercise 5 — Script vs Notebook comparison

1. In VS Code, create a new file called `explore.ipynb`
2. VS Code will open it as a Jupyter notebook
3. Add a cell with:

```python
import pandas as pd
df = pd.DataFrame({"name": ["Alice", "Bob", "Charlie"], "score": [88, 92, 75]})
df.sort_values("score", ascending=False)
```

4. Run the cell — you see the output inline

**Reflect and write in `day3.md`:** What can you do in the notebook that you can't do as easily in `main.py`? What can `main.py` do that the notebook can't?

---

*End of Day 3 Quiz & Exercises*
### Exercise 6 — Additional Practice

1. Try installing a new Python version using `uv python install 3.11`.
2. Create a temporary script `hello.py` that imports `requests` and prints `requests.__version__`.
3. Run it using `uv run --with requests hello.py`.

**Question to answer:** Did `uv` create a `pyproject.toml` or `.venv` in your folder for this script? Why is this useful?

---
