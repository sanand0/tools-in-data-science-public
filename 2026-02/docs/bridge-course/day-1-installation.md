# Day 1 — Installation Guide

> **Goal:** Get a fully working development environment — terminal, editor, Git, Python, and `uv` — so you can start coding from Day 2 onwards with zero friction.

---

## What You Need Installed by the End

| Tool | Purpose | Verify with |
|---|---|---|
| **Ubuntu Linux** (native or WSL2) | Your operating system / shell environment | `uname -a` |
| **VS Code** | Code editor | `code --version` |
| **Git** | Version control | `git --version` |
| **Python 3.11+** | Programming language | `python3 --version` |
| **uv** | Python package/project manager | `uv --version` |

---

## Option A — Native Ubuntu Linux

If you are already running Ubuntu (22.04 or later), you just need to install the tools.

### Step 1: Update your system

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Git

```bash
sudo apt install git -y
git --version
# git version 2.x.x
```

### Step 3: Install Python

Ubuntu comes with Python, but let's make sure you have a recent version:

```bash
python3 --version
# If below 3.11, install a newer one:
sudo apt install python3.12 -y
```

### Step 4: Install VS Code

```bash
# Download from https://code.visualstudio.com/
# Or install via snap:
sudo snap install code --classic
code --version
```

### Step 5: Install uv

`uv` is a blazing-fast Python package manager that replaces `pip`, `venv`, and more.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# Restart your terminal, then:
uv --version
```

> **What is `uv`?** Think of it as a single tool that does what `pip`, `venv`, `pyenv`, and `pipx` do — but 10–100x faster. It was built by the same team that made `ruff` (the fast Python linter).

### 🧠 Knowledge Check

**Q1:** What command combines updating the package list and upgrading installed packages in Ubuntu?

- A) `sudo apt install update`
- B) `sudo apt update && sudo apt upgrade -y`
- C) `apt update --all`
- D) `sudo snap install code`

<details>
<summary><b>Answer</b></summary>

**B** — `sudo apt update` fetches the latest package lists, and `sudo apt upgrade -y` installs the updates without asking for confirmation.

</details>

**Q2:** Why do we use `uv` instead of traditional `pip`?

- A) Because `uv` is built into Ubuntu natively
- B) Because `pip` is deprecated and no longer supported
- C) Because `uv` is 10-100x faster and replaces multiple tools like pip, venv, and pyenv
- D) Because `uv` works without Python

<details>
<summary><b>Answer</b></summary>

**C** — `uv` is a blazing-fast, all-in-one replacement for Python dependency and environment management.

</details>

---

## Option B — Windows + WSL2 (Ubuntu)

If you are on Windows, you will install Linux **inside** Windows using WSL2.

### Step 1: Enable WSL2

Open **PowerShell as Administrator** and run:

```powershell
wsl --install
```

This installs WSL2 + Ubuntu. **Restart your computer** when prompted.

### Step 2: Set up Ubuntu

After restart, Ubuntu will open automatically and ask you to create a username and password. This is your **Linux** username — it can be different from your Windows username.

```bash
# Verify you are in WSL2:
uname -a
# Should contain "Linux" and "microsoft" in the output
```

### Step 3: Update Ubuntu inside WSL

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 4: Install Git

```bash
sudo apt install git -y
git --version
```

### Step 5: Install Python

```bash
python3 --version
# Should be 3.10+ on Ubuntu 22.04/24.04
```

### Step 6: Install VS Code (on Windows side)

1. Download VS Code from [code.visualstudio.com](https://code.visualstudio.com/)
2. Install it on Windows (not inside WSL)
3. Install the **"WSL" extension** inside VS Code
4. Now open VS Code from your WSL terminal:

```bash
code .
# This opens VS Code connected to WSL — you will see "WSL: Ubuntu" in the bottom-left
```

### Step 7: Install uv (inside WSL)

```bash
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# Close and reopen terminal
uv --version
```

### 🧠 Knowledge Check

**Q1:** What does the command `wsl --install` do when run in PowerShell?

- A) It installs a new version of Windows PowerShell
- B) It installs WSL2 and sets up a default Linux distribution (Ubuntu)
- C) It installs VS Code
- D) It updates Windows

<details>
<summary><b>Answer</b></summary>

**B** — It enables the Windows Subsystem for Linux (WSL) and installs Ubuntu automatically.

</details>

**Q2:** When using WSL2, where should VS Code be installed?

- A) Only inside the WSL terminal
- B) On both Windows and inside WSL separately
- C) On the Windows side, but with the "WSL" extension installed
- D) It doesn't matter

<details>
<summary><b>Answer</b></summary>

**C** — You install VS Code on Windows and use the WSL extension to connect it seamlessly to your Linux environment.

</details>

---

## Verification Checklist

Run each of these commands. If any fail, go back and fix that step.

```bash
# 1. Check you are on Linux
uname -a
# Expected: ... Linux ... (if WSL, you'll also see "microsoft")

# 2. Git
git --version
# Expected: git version 2.x.x

# 3. Python
python3 --version
# Expected: Python 3.11.x or higher

# 4. uv
uv --version
# Expected: uv 0.x.x

# 5. VS Code (run from terminal)
code --version
# Expected: version number + commit hash
```

If all five work, you are ready for Day 2.

---

## Troubleshooting

<details>
<summary><b>"wsl --install" does nothing or fails</b></summary>

- Make sure you are running PowerShell **as Administrator** (right-click → Run as administrator).
- On older Windows 10 builds, you may need to enable WSL manually:
  ```powershell
  dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
  dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
  ```
  Then restart and run `wsl --install -d Ubuntu`.
- Requires Windows 10 version 2004+ or Windows 11.

</details>

<details>
<summary><b>"code" command not found in WSL</b></summary>

- Make sure VS Code is installed on the **Windows** side (not inside WSL).
- Install the **WSL extension** in VS Code.
- Try closing and reopening your WSL terminal.
- If still not found, add VS Code to your PATH:
  ```bash
  export PATH="$PATH:/mnt/c/Users/$USER/AppData/Local/Programs/Microsoft VS Code/bin"
  ```

</details>

<details>
<summary><b>"uv" command not found after install</b></summary>

The installer adds `uv` to `~/.local/bin/`. This directory may not be in your PATH.

```bash
# Add to PATH (paste into terminal):
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Now try again:
uv --version
```

</details>

<details>
<summary><b>Python version is too old (below 3.11)</b></summary>

Use `uv` itself to install a newer Python:

```bash
uv python install 3.13
uv python list
# You should see 3.13 in the list
```

You can also install from the `deadsnakes` PPA:
```bash
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install python3.12 -y
```

</details>

---

## Q&A

<details>
<summary><b>Q: Do I need to install Python separately if I have uv?</b></summary>

**A:** `uv` can manage Python versions for you (`uv python install 3.13`), but having a system Python is still useful for quick one-off scripts. It's good to have both.

</details>

<details>
<summary><b>Q: Should I use the Windows Terminal or the built-in Ubuntu terminal?</b></summary>

**A:** Use **Windows Terminal** — it supports tabs, better fonts, and you can have PowerShell and Ubuntu side by side. Install it from the Microsoft Store if you don't have it.

</details>

<details>
<summary><b>Q: Can I use macOS instead of Linux/WSL?</b></summary>

**A:** Yes. macOS is Unix-based, so most commands work the same. Use `brew` (Homebrew) instead of `apt` for installing packages. The main TDS course assumes Linux, but macOS is very close.

</details>

<details>
<summary><b>Q: What is the difference between pip and uv?</b></summary>

**A:** `pip` is the traditional Python package installer. `uv` is a modern replacement that:
- Installs packages 10-100x faster
- Creates virtual environments automatically
- Manages Python versions
- Handles project setup (`pyproject.toml`)
- Works as a drop-in replacement: `uv pip install` works just like `pip install`

</details>

---

## Exercises

**Exercise 1: Screenshot your verification**

Run the five verification commands above. Save the output to a file:

```bash
{
  echo "=== uname ==="
  uname -a
  echo "=== git ==="
  git --version
  echo "=== python ==="
  python3 --version
  echo "=== uv ==="
  uv --version
  echo "=== vscode ==="
  code --version
} > ~/environment-check.txt

cat ~/environment-check.txt
```

<details>
<summary><b>Expected output (click to check)</b></summary>

```
=== uname ===
Linux your-machine 5.15.x-x-x ... GNU/Linux
=== git ===
git version 2.43.0
=== python ===
Python 3.12.3
=== uv ===
uv 0.7.x
=== vscode ===
1.96.x
abc123...
x64
```

Your version numbers will differ, but all five sections should show a version (no errors).

</details>

---

**Exercise 2: Configure Git identity**

Git needs to know who you are before you can make commits:

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"
```

Verify:

```bash
git config --global --list
```

<details>
<summary><b>What should I see?</b></summary>

```
user.name=Your Full Name
user.email=your.email@example.com
```

This is stored in `~/.gitconfig`. You only need to do this once per machine.

</details>

---

**Exercise 3: Create your bootcamp workspace**

```bash
mkdir -p ~/tds/bootcamp/day-1
cd ~/tds/bootcamp/day-1
pwd
```

<details>
<summary><b>What does `pwd` show?</b></summary>

```
/home/yourname/tds/bootcamp/day-1
```

This confirms you created the directory and navigated into it successfully.

</details>
