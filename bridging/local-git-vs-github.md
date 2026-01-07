# Local Git vs GitHub (Beginner Guide)

This note explains:

- What Git is on your computer (local)
- What GitHub is (remote hosting)
- Why teams use GitHub
- GitHub basics and the GitHub CLI
- How to open the diagram in draw.io / diagrams.net

---

## Local Git (on your computer)

**Git** runs locally and tracks your project history.
You can commit, branch, and view history **without the internet**.

Local Git gives you:
- **Commits** (snapshots)
- **Branches** (safe experiments)
- **History and diffs** (what changed and when)

---

## GitHub (remote hosting)

**GitHub** is a website that stores **remote copies** of Git repositories.
It adds collaboration tools on top of Git.

GitHub gives you:
- **Remotes** for backup and sharing
- **Pull requests** for review
- **Issues** for tasks and bugs
- **Actions** for automation

---

## Why use both?

- You work locally with Git.
- You push to GitHub to share, back up, and collaborate.
- Others can pull your changes or review them.

---

## GitHub basics (key ideas)

- **Repo**: a project with code and history.
- **Remote**: the GitHub copy of your repo.
- **Pull request (PR)**: a request to merge changes into main.
- **Issue**: a tracked task or bug.

---

## GitHub CLI (gh) basics

The **GitHub CLI** lets you use GitHub from the terminal.
It does **not** replace Git; it helps with GitHub tasks.

Common commands:

```bash
# Log in to GitHub

gh auth login

# Create a new repo on GitHub

gh repo create

# View repo info

gh repo view --web

# List issues

gh issue list

# Create a pull request

gh pr create

# View PR status

gh pr status
```

You still use Git for local work:

```bash
# Local Git workflow

git status

git add .

git commit -m "message"

git push
```

---

## Diagrams (draw.io / diagrams.net)

Open this `.drawio` file in draw.io / diagrams.net (File -> Open From -> Device):

- `bridging/git-local-vs-github.drawio`
