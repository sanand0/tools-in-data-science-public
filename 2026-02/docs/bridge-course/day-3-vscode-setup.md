# Day 3 — VS Code Setup

> **Goal:** Set up VS Code as your primary code editor with the right extensions, terminal integration, and settings so you can write, run, and debug Python efficiently.

---

## What Is VS Code?

**Visual Studio Code (VS Code)** is a free, lightweight code editor by Microsoft. It's the most popular editor among developers because:

- It works on Windows, macOS, and Linux
- It has a built-in terminal
- It has thousands of extensions for every language
- It connects to WSL2, remote servers, and containers
- It has great Git integration built-in

> VS Code is **not** the same as Visual Studio (which is a full IDE). VS Code is lighter and more flexible.

---

## Opening VS Code

### From the terminal (recommended)

```bash
# Open VS Code in the current directory:
code .

# Open a specific file:
code main.py

# Open a specific folder:
code ~/projects/tds/
```

### WSL2 users

When you run `code .` from inside WSL, VS Code opens on the Windows side but connects to your Linux filesystem. You should see **"WSL: Ubuntu"** in the bottom-left corner.

```bash
# From WSL terminal:
cd ~/projects/tds
code .
# VS Code opens, connected to WSL — bottom-left shows "WSL: Ubuntu"
```

---

## The VS Code Interface

```
┌────────────────────────────────────────────────────────┐
│ Menu Bar  (File, Edit, View, ...)                      │
├────┬──────────────────────────────────────┬────────────┤
│    │                                      │            │
│ S  │    Editor Area                       │  Minimap   │
│ i  │    (where you write code)            │            │
│ d  │                                      │            │
│ e  │                                      │            │
│    │                                      │            │
│ B  │                                      │            │
│ a  │                                      │            │
│ r  │──────────────────────────────────────│            │
│    │    Terminal Panel                     │            │
│    │    $ _                               │            │
├────┴──────────────────────────────────────┴────────────┤
│ Status Bar (branch, errors, encoding, line/col)        │
└────────────────────────────────────────────────────────┘
```

### Key areas

| Area | What it does |
|---|---|
| **Side Bar** (left) | File explorer, search, Git, extensions |
| **Editor** (center) | Where you read and write code |
| **Terminal** (bottom) | Built-in bash/zsh terminal |
| **Status Bar** (bottom) | Shows current branch, errors, file info |
| **Minimap** (right edge) | Bird's-eye view of your file |

---

## Essential Keyboard Shortcuts

Learn these first — they save hours:

| Action | Shortcut (Linux/Windows) | What it does |
|---|---|---|
| Command Palette | `Ctrl + Shift + P` | Search for any command |
| Quick Open file | `Ctrl + P` | Find and open files by name |
| Toggle Terminal | `` Ctrl + ` `` | Show/hide the built-in terminal |
| Save | `Ctrl + S` | Save current file |
| Find in file | `Ctrl + F` | Search current file |
| Find in workspace | `Ctrl + Shift + F` | Search all files |
| Go to line | `Ctrl + G` | Jump to a specific line number |
| Multi-cursor | `Alt + Click` | Add cursors at multiple positions |
| Select word | `Ctrl + D` | Select the word under cursor (repeat to select next occurrence) |
| Comment/Uncomment | `Ctrl + /` | Toggle line comment |
| Move line up/down | `Alt + ↑/↓` | Move entire line up or down |
| Duplicate line | `Shift + Alt + ↓` | Copy current line below |
| Delete line | `Ctrl + Shift + K` | Delete entire line |

> **Tip:** The most important shortcut is `Ctrl + Shift + P` (Command Palette). If you forget anything, open it and search.

---

## Essential Extensions

Open the Extensions panel (`Ctrl + Shift + X`) and install these:

### Must-have

| Extension | What it does |
|---|---|
| **Python** (by Microsoft) | Python language support, IntelliSense, debugging |
| **Pylance** (by Microsoft) | Fast type checking and autocompletion for Python |
| **Jupyter** (by Microsoft) | Run Jupyter notebooks inside VS Code |
| **WSL** (by Microsoft) | Connect to WSL from Windows (WSL users only) |

### Highly recommended

| Extension | What it does |
|---|---|
| **GitLens** | See who changed what line, when, and why |
| **Ruff** | Ultra-fast Python linter and formatter |
| **Error Lens** | Show errors/warnings inline in your code |
| **indent-rainbow** | Color-code indentation levels |

### Install from terminal

```bash
# You can also install extensions from the command line:
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension ms-toolsai.jupyter
```

---

## Settings You Should Configure

Open settings: `Ctrl + ,` (or `File → Preferences → Settings`)

### Key settings

```json
{
    "editor.fontSize": 14,
    "editor.tabSize": 4,
    "editor.formatOnSave": true,
    "editor.wordWrap": "on",
    "editor.minimap.enabled": true,
    "editor.bracketPairColorization.enabled": true,
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "terminal.integrated.defaultProfile.linux": "bash",
    "python.defaultInterpreterPath": "python3"
}
```

To edit as JSON: `Ctrl + Shift + P` → "Preferences: Open User Settings (JSON)"

---

## The Integrated Terminal

VS Code has a built-in terminal that runs inside the editor. This is where you'll run most commands.

### Open it

- Shortcut: `` Ctrl + ` `` (backtick)
- Menu: `Terminal → New Terminal`

### Multiple terminals

```
# Click the + button to create new terminals
# Click the dropdown to switch between them
# Right-click a terminal tab to rename it
```

### Split terminals

```
# Ctrl + Shift + 5 — split the terminal panel
# Useful for running a server in one terminal and testing in another
```

### WSL terminal

If you're on Windows, make sure your default terminal profile is set to **Ubuntu (WSL)**:

`Ctrl + Shift + P` → "Terminal: Select Default Profile" → Choose "Ubuntu (WSL)"

### 🧠 Knowledge Check

**Q1:** How can you open the integrated terminal in VS Code?

- A) `Ctrl + T`
- B) `` Ctrl + ` `` (backtick)
- C) `Alt + T`
- D) `Ctrl + Shift + T`

<details>
<summary><b>Answer</b></summary>

**B** — `` Ctrl + ` `` is the default shortcut to toggle the integrated terminal.

</details>

---

## Running Python in VS Code

### Method 1: Terminal

```bash
# In the integrated terminal:
python3 script.py
```

### Method 2: Run button

- Open a `.py` file
- Click the **▶ Run** button (top right)
- Or press `Ctrl + F5` (Run Without Debugging)

### Method 3: Debug mode

- Set breakpoints by clicking in the gutter (left of line numbers)
- Press `F5` to start debugging
- Step through code, inspect variables

### Method 4: Jupyter Notebook

- Create a file with `.ipynb` extension
- Or create a `.py` file with `# %%` cell markers:

```python
# %% Cell 1
print("This is cell 1")
x = 42

# %% Cell 2
print(f"x = {x}")
```

Each `# %%` creates a runnable cell. Click "Run Cell" above each cell.

---

## Multi-Cursor Editing — A Superpower

Multi-cursor lets you edit multiple lines simultaneously:

```bash
# 1. Alt + Click — add cursors at specific positions
# 2. Ctrl + D — select the current word, then next occurrence
# 3. Ctrl + Shift + L — select ALL occurrences of current selection
```

### Example

You have:
```python
name = "alice"
print(name)
greeting = "hello " + name
```

Want to rename `name` to `username` everywhere? Select `name`, press `Ctrl + D` repeatedly to select each occurrence, then type `username`. All change at once.

### 🧠 Knowledge Check

**Q1:** You want to change all occurrences of the variable `count` to `total` in your current file. What's the fastest way using multi-cursor editing?

- A) Use backspace and type the new word manually everywhere
- B) Select `count`, press `Ctrl + Shift + L` to select all occurrences, then type `total`
- C) Press `Ctrl + C` and `Ctrl + V`
- D) Use `Ctrl + F` and hit enter

<details>
<summary><b>Answer</b></summary>

**B** — `Ctrl + Shift + L` instantly selects all occurrences of your current selection, allowing you to edit them all simultaneously.

</details>

---

## Q&A

<details>
<summary><b>Q: VS Code says "Select Python Interpreter." What do I do?</b></summary>

**A:** Click on the Python version in the status bar (bottom) or press `Ctrl + Shift + P` → "Python: Select Interpreter." Choose the Python that matches your project:
- If using `uv`, choose the Python in `.venv/bin/python`
- Otherwise, choose `/usr/bin/python3`

</details>

<details>
<summary><b>Q: My terminal in VS Code shows PowerShell instead of bash. How do I fix it?</b></summary>

**A:** You're likely on Windows and not connected to WSL.
1. `Ctrl + Shift + P` → "Terminal: Select Default Profile" → Choose "Ubuntu (WSL)"
2. Or click the dropdown arrow next to `+` in the terminal panel and select "Ubuntu (WSL)"

</details>

<details>
<summary><b>Q: What is the difference between "Run" and "Debug"?</b></summary>

**A:**
- **Run** (`Ctrl + F5`) — executes your script normally, start to finish
- **Debug** (`F5`) — executes with breakpoints active. The program pauses at breakpoints so you can inspect variables, step through code line by line, and understand what's happening

</details>

<details>
<summary><b>Q: Should I use VS Code or Jupyter notebooks?</b></summary>

**A:** Both! Use:
- **VS Code (`.py` files)** for production code, scripts, libraries, anything that runs in a pipeline
- **Jupyter notebooks (`.ipynb`)** for exploration, visualization, teaching, prototyping
- **VS Code + `# %%` cells** for the best of both — Python files with notebook-like interactive cells

</details>

---

## Exercises

**Exercise 1: Open a project in VS Code**

```bash
mkdir -p ~/tds-bootcamp/day-3
cd ~/tds-bootcamp/day-3
code .
```

In the terminal inside VS Code, create a file:

```bash
echo 'print("VS Code works!")' > test.py
```

Run it using the terminal:

```bash
python3 test.py
```

<details>
<summary><b>What should happen?</b></summary>

VS Code opens with the `day-3` folder in the sidebar. The terminal shows:
```
VS Code works!
```

You should also see `test.py` in the file explorer on the left.

</details>

---

**Exercise 2: Keyboard shortcut practice**

Open `test.py` in the editor and practice these:

1. `Ctrl + Shift + P` — open Command Palette, search "Toggle Word Wrap"
2. `Ctrl + G` — go to line 1
3. `Ctrl + D` — select the word "print"
4. `` Ctrl + ` `` — toggle the terminal panel
5. `Ctrl + /` — comment out the line, then uncomment it

<details>
<summary><b>How do I know it worked?</b></summary>

- Command Palette opens a search bar at the top of the editor
- `Ctrl + G` shows a "Go to Line" input box
- `Ctrl + D` highlights the word under your cursor
- Terminal panel appears/disappears
- Line gets `# ` prepended (comment) or removed (uncomment)

</details>

---

**Exercise 3: Install extensions**

Install the Python extension from the terminal:

```bash
code --install-extension ms-python.python
```

Then verify it's installed:

```bash
code --list-extensions | grep -i python
```

<details>
<summary><b>Expected output</b></summary>

```
ms-python.python
ms-python.vscode-pylance
```

(Pylance is often auto-installed with the Python extension.)

</details>

---

**Exercise 4: MCQ**

**Q1:** What does `Ctrl + Shift + P` open in VS Code?

- A) The terminal
- B) The settings
- C) The Command Palette
- D) The file explorer

<details>
<summary><b>Answer</b></summary>

**C** — The Command Palette lets you search for and execute any VS Code command. It's the most important shortcut to remember.

</details>

---

**Q2:** You open VS Code from WSL and see "WSL: Ubuntu" in the bottom-left corner. What does this mean?

- A) VS Code is running inside Ubuntu
- B) VS Code on Windows is connected to your WSL Linux filesystem
- C) Ubuntu is not installed correctly
- D) You need to switch to PowerShell

<details>
<summary><b>Answer</b></summary>

**B** — VS Code runs on the Windows side but connects to WSL to read/write files and run terminals. This is the correct setup for WSL users.

</details>

---

