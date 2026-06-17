# Coding Environment Setup

This page walks through the baseline tools you need before starting any Week 1 work. Set
these up once and verify each step before moving on. Everything here is cross-platform
(Linux, macOS, WSL on Windows).

> Demo content for the May 2026 term. Commands are illustrative — confirm versions against
> the official course announcements.

## What you will install

| Tool | Why | Verify with |
| --- | --- | --- |
| A terminal / shell | Run every other tool from one place | `echo $SHELL` |
| `uv` + Python | Manage Python and dependencies reproducibly | `uv --version` |
| VS Code | Edit code, run notebooks, use extensions | `code --version` |
| Git + GitHub | Track and submit your work | `git --version` |

## 1. Terminal and shell

Open your terminal (Terminal on macOS, your distro's terminal on Linux, or Ubuntu/WSL on
Windows) and confirm you have a working shell:

```bash
echo "$SHELL"
uname -a
```

If you are new to the command line, start with the [shell basics](../bash.md) guide.

## 2. Python with `uv`

We use [`uv`](../uv.md) to install Python and manage project environments. It is fast and
keeps each project's dependencies isolated and reproducible.

```bash
# Install uv (macOS / Linux / WSL)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Restart the shell, then verify
uv --version

# Install a Python version and create a scratch project
uv python install 3.12
uv init tds-week1 && cd tds-week1
uv add requests
uv run python -c "import requests, sys; print(sys.version)"
```

You should see a Python 3.12 version string and no import errors.

## 3. VS Code

Install [VS Code](../vscode.md) and the Python extension. Enabling the `code` command lets
you open any folder from the terminal:

```bash
code --version
code .            # opens the current folder in VS Code
```

Recommended extensions for this course: **Python**, **Jupyter**, and **GitLens**.

## 4. Git and GitHub

You will submit work through GitHub, so configure [Git](../git.md) with your identity:

```bash
git --version
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"

# Confirm
git config --global --list
```

Create a free GitHub account if you do not have one, and add an SSH key or sign in with the
GitHub CLI so you can push without typing a password each time.

## Verify everything

Run this quick checklist — every command should print a version, not an error:

```bash
echo "$SHELL" && uv --version && code --version && git --version
```

## Checklist

- [ ] Terminal opens and reports a shell
- [ ] `uv` installs and runs Python 3.12
- [ ] VS Code opens folders from the `code` command
- [ ] Git knows your name and email
- [ ] GitHub account ready for submissions

## Next

- Continue to [VS Code Workflow](vs-code-workflow.md)
- Back to [Week 1 overview](README.md)
