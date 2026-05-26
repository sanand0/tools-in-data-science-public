# Day 5 — Git: init, add, commit

> **Goal:** Master the hands-on commands for creating repositories, staging changes, and making commits — the commands you'll use every single day.

---

## `git init` — Create a New Repository

```bash
# Create a project directory and initialize Git:
mkdir my-project
cd my-project
git init
# Initialized empty Git repository in /home/you/my-project/.git/
```

### What `git init` creates

```bash
ls -la .git/
# HEAD          ← points to current branch
# config        ← repository-level settings
# hooks/        ← scripts that run on events (commit, push, etc.)
# objects/      ← where Git stores file contents and commits
# refs/         ← branch and tag pointers
```

> You never need to touch `.git/` directly. Git commands manage it for you.

### Configure your identity (one-time setup per machine)

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"

# Verify:
git config --list
# user.name=Your Full Name
# user.email=your.email@example.com
```

### 🧠 Knowledge Check

**Q1:** What does `git init` actually do when you run it in a project folder?

- A) It uploads the folder to GitHub
- B) It creates a hidden `.git` folder that tracks your project's version history
- C) It stages all your files for a commit
- D) It deletes all untracked files

<details>
<summary><b>Answer</b></summary>

**B** — `git init` turns a regular folder into a Git repository by creating the `.git` directory to store its data.

</details>

---

## `git add` — Stage Changes

`git add` moves changes from the **working tree** to the **staging area** (also called the "index").

### Staging specific files

```bash
git add README.md              # stage one file
git add main.py test_main.py   # stage multiple files
git add src/                   # stage an entire directory
```

### Staging everything

```bash
git add .                      # stage all changes in current dir and below
git add -A                     # stage all changes in the entire repo
```

### Interactive staging (`-p` / `--patch`)

This lets you review and select specific changes within a file:

```bash
git add -p
# Git shows each change (hunk) and asks:
# Stage this hunk [y,n,q,a,d,s,e,?]?
# y = yes, stage this change
# n = no, skip this change
# s = split into smaller hunks
# q = quit (stop staging)
```

> **Use `-p` when:** You've made multiple unrelated changes in one file and want to put them in separate commits.

### Unstaging (removing from staging area)

```bash
git restore --staged README.md    # unstage one file
git restore --staged .            # unstage everything
```

### 🧠 Knowledge Check

**Q1:** You made changes to 5 files, but you only want to stage `main.py` and `utils.py` for your next commit. What command(s) should you run?

- A) `git add .`
- B) `git add main.py utils.py`
- C) `git commit main.py utils.py`
- D) `git stage *`

<details>
<summary><b>Answer</b></summary>

**B** — Specifying the files after `git add` lets you selectively stage only those files.

</details>

---

## `git commit` — Save a Snapshot

`git commit` creates a permanent snapshot of everything in the staging area.

### Basic commit

```bash
git commit -m "feat: add user authentication"
```

### Commit with a longer message

```bash
git commit
# This opens your default editor (vim/nano) where you can write:
# Line 1: short summary (50 chars or less)
# Line 2: (blank)
# Line 3+: detailed explanation
```

### Set your default editor

```bash
# Use nano (easiest for beginners):
git config --global core.editor "nano"

# Or VS Code:
git config --global core.editor "code --wait"
```

### Shortcut: add + commit in one step

```bash
# Stage all TRACKED files and commit (skips untracked files):
git commit -am "fix: correct calculation in parser"
```

> **Note:** `-a` only stages files Git already knows about. New files must be `git add`-ed first.

### Amend the last commit

```bash
# Fix the commit message:
git commit --amend -m "feat: better commit message"

# Add a forgotten file to the last commit:
git add forgotten-file.py
git commit --amend --no-edit
```

⚠️ Don't amend commits that are already pushed to GitHub (unless you're the only person using the branch).

---

## The Full Init → Add → Commit Workflow

Here's a complete example from scratch:

```bash
# 1. Create a project
mkdir ~/tds-bootcamp/day-5
cd ~/tds-bootcamp/day-5

# 2. Initialize Git
git init

# 3. Create .gitignore FIRST
cat > .gitignore << 'EOF'
.venv/
__pycache__/
*.pyc
.env
EOF

# 4. Create your files
echo "# Day 5 — Git Practice" > README.md

cat > main.py << 'PYEOF'
"""Simple greeting module."""

def greet(name: str) -> str:
    return f"Hello, {name}!"

if __name__ == "__main__":
    print(greet("TDS"))
PYEOF

# 5. Check what Git sees
git status
# Untracked files:
#   .gitignore
#   README.md
#   main.py

# 6. Stage everything
git add .

# 7. Verify what's staged
git status
# Changes to be committed:
#   new file: .gitignore
#   new file: README.md
#   new file: main.py

# 8. Commit
git commit -m "feat: initial project setup"

# 9. Verify
git log --oneline
# abc1234 (HEAD -> main) feat: initial project setup
```

---

## Making More Commits

```bash
# Make a change:
cat >> main.py << 'PYEOF'

def farewell(name: str) -> str:
    return f"Goodbye, {name}!"
PYEOF

# Check what changed:
git diff
# +
# +def farewell(name: str) -> str:
# +    return f"Goodbye, {name}!"

# Stage and commit:
git add main.py
git commit -m "feat: add farewell function"

# Check the log:
git log --oneline
# def5678 (HEAD -> main) feat: add farewell function
# abc1234 feat: initial project setup
```

---

## Viewing History

```bash
# Compact history:
git log --oneline

# Detailed history:
git log

# Show what changed in each commit:
git log -p

# Show stats (files changed, insertions/deletions):
git log --stat

# Show specific commit:
git show abc1234

# Show who changed each line of a file:
git blame main.py
```

---

## Q&A

<details>
<summary><b>Q: What happens if I run <code>git init</code> in a folder that's already a Git repo?</b></summary>

**A:** Nothing bad — Git just says "Reinitialized existing Git repository." It won't delete your history or anything. It's safe to run `git init` multiple times.

</details>

<details>
<summary><b>Q: What is the difference between <code>git add .</code> and <code>git add -A</code>?</b></summary>

**A:**
- `git add .` — stages all changes in the **current directory** and below
- `git add -A` — stages all changes in the **entire repository**, regardless of where you are

In practice, if you're in the root of your repo, they are the same.

</details>

<details>
<summary><b>Q: Can I commit without a message?</b></summary>

**A:** No — Git requires a message. If you run `git commit` without `-m`, it opens an editor for you to write one. If you close the editor without typing anything, Git aborts the commit.

Pro tip: Use `git commit -m "message"` for quick commits.

</details>

<details>
<summary><b>Q: I accidentally committed a file I shouldn't have (like .env). How do I remove it?</b></summary>

**A:**
```bash
# Remove from Git tracking (but keep the file on disk):
git rm --cached .env

# Add to .gitignore so it doesn't happen again:
echo ".env" >> .gitignore

# Commit the fix:
git add .gitignore
git commit -m "chore: remove .env from tracking"
```

⚠️ If `.env` contained secrets and was pushed to GitHub, consider those secrets compromised. Rotate them.

</details>

<details>
<summary><b>Q: What does <code>git commit -am</code> do?</b></summary>

**A:** `-a` automatically stages all **modified tracked files** before committing. `-m` provides the message inline. Combined: `-am` stages modified files and commits in one step.

**Important:** `-a` does NOT stage **new** (untracked) files. You must `git add` new files explicitly.

</details>

---

## Exercises

**Exercise 1: Create a complete project**

Create a new Git repository with three files across two commits:

<details>
<summary><b>Solution</b></summary>

```bash
mkdir -p /tmp/git-init-practice
cd /tmp/git-init-practice
git init

# Commit 1: Project setup
echo "# My Tool" > README.md
echo ".venv/" > .gitignore
git add README.md .gitignore
git commit -m "feat: initial project setup"

# Commit 2: Add code
echo 'print("hello world")' > main.py
git add main.py
git commit -m "feat: add main script"

# Verify:
git log --oneline
```

Expected log:
```
def5678 (HEAD -> main) feat: add main script
abc1234 feat: initial project setup
```

</details>

---

**Exercise 2: Selective staging**

Create two files, but commit them in separate commits:

```bash
cd /tmp/git-init-practice
echo "# API docs" > docs.md
echo "import sys" > utils.py
```

<details>
<summary><b>Solution</b></summary>

```bash
# Commit only docs.md:
git add docs.md
git commit -m "docs: add API documentation"

# Commit only utils.py:
git add utils.py
git commit -m "feat: add utility functions"

# Verify:
git log --oneline
```

Each file is in its own commit with a descriptive message.

</details>

---

**Exercise 3: Amend a commit**

Make a commit, then fix the message:

```bash
cd /tmp/git-init-practice
echo "# test" > test.py
git add test.py
git commit -m "add tset file"    # oops, typo!
```

<details>
<summary><b>How to fix it</b></summary>

```bash
git commit --amend -m "test: add test file"
git log --oneline -1
# Now shows: test: add test file
```

`--amend` replaces the last commit with a corrected version.

</details>

---

**Exercise 4: Use git diff**

```bash
cd /tmp/git-init-practice

# Modify main.py:
echo 'print("goodbye world")' >> main.py

# What does git diff show?
git diff
```

<details>
<summary><b>Expected diff output</b></summary>

```diff
diff --git a/main.py b/main.py
--- a/main.py
+++ b/main.py
@@ -1 +1,2 @@
 print("hello world")
+print("goodbye world")
```

The `+` line shows what was added. Stage it and check `git diff --staged` to see the same diff for staged changes.

</details>

---

**Exercise 5: MCQ**

**Q1:** What does `git init` create?

- A) A new file called `git`
- B) A `.git/` directory that stores version history
- C) A GitHub repository
- D) A virtual environment

<details>
<summary><b>Answer</b></summary>

**B** — `git init` creates a hidden `.git/` directory in your project. This is where Git stores all its data (commits, branches, configuration). It does NOT create a GitHub repository — that's a separate step.

</details>

---

**Q2:** You've edited three files. You want to commit only one of them. What do you do?

- A) `git commit -am "message"`
- B) `git add specific-file.py` then `git commit -m "message"`
- C) `git add .` then `git commit -m "message"`
- D) `git push`

<details>
<summary><b>Answer</b></summary>

**B** — Stage only the file you want with `git add specific-file.py`, then commit. Options A and C would include all modified files.

</details>

---

**Q3:** What does `git restore --staged file.py` do?

- A) Deletes file.py from disk
- B) Moves file.py from staging area back to working tree (unstages it)
- C) Reverts file.py to its last committed version
- D) Removes file.py from the Git repository

<details>
<summary><b>Answer</b></summary>

**B** — It unstages the file without changing its contents. The file still has your modifications in the working tree; it's just no longer queued for the next commit.

</details>

---

Clean up:

```bash
rm -rf /tmp/git-init-practice
```

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

