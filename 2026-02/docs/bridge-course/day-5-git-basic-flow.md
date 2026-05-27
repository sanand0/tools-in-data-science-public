# Day 5 — Git Basic Flow

> **Goal:** Understand the core Git mental model — working tree, staging area, and commits — so you know exactly what happens at each step and never feel lost.

---

## What Is Git?

**Git** is a version control system. It tracks changes to your files over time, letting you:
- See what changed, when, and by whom
- Undo mistakes by going back to any previous version
- Work on features in parallel without breaking things
- Collaborate with others without overwriting each other's work

> Every professional developer uses Git daily. It is non-negotiable.

---

## The Three Areas of Git

Git organizes your files into three areas. Understanding this mental model is the key to never being confused:

```
┌─────────────────┐     git add     ┌─────────────────┐    git commit    ┌──────────────────┐
│  Working Tree   │ ──────────────▶ │  Staging Area   │ ──────────────▶  │   Repository     │
│  (your files)   │                 │  (index)        │                  │   (.git/)        │
│                 │                 │                 │                  │                  │
│  Edit files     │                 │  Prepare what   │                  │  Permanent       │
│  freely here    │                 │  goes into the  │                  │  snapshots of    │
│                 │                 │  next commit    │                  │  your project    │
└─────────────────┘                 └─────────────────┘                  └──────────────────┘
```

| Area | What it is | Analogy |
|---|---|---|
| **Working Tree** | Your actual files on disk | Your desk — messy, in-progress work |
| **Staging Area** | What you've marked for the next commit | A box you're packing — only selected items |
| **Repository** | Permanent history of all commits | The warehouse — safely stored, labeled |

### The key insight

You don't commit everything at once. You:
1. **Edit** files (working tree changes)
2. **Stage** the specific changes you want (`git add`)
3. **Commit** the staged changes (`git commit`)

This two-step process (`add` then `commit`) gives you fine-grained control over what goes into each commit.

### 🧠 Knowledge Check

**Q1:** What is the main purpose of the "Staging Area" in Git?

- A) To backup your files to the cloud
- B) To temporarily hold your changes before they are bundled into a permanent commit
- C) To run tests automatically
- D) To share code with teammates

<details>
<summary><b>Answer</b></summary>

**B** — The staging area is a prep zone where you group related changes together before creating a final, permanent snapshot (commit).

</details>

---

## Your First Git Workflow

### 1. Initialize a repository

```bash
mkdir ~/my-project
cd ~/my-project
git init
# Initialized empty Git repository in /home/you/my-project/.git/
```

This creates a hidden `.git/` folder that stores all version history.

### 2. Create a file

```bash
echo "# My Project" > README.md
```

### 3. Check status

```bash
git status
# On branch main
# Untracked files:
#   README.md
```

"Untracked" means Git sees the file but isn't tracking it yet.

### 4. Stage the file

```bash
git add README.md
git status
# Changes to be committed:
#   new file: README.md
```

The file is now in the staging area, ready to be committed.

### 5. Commit

```bash
git commit -m "Initial commit: add README"
# [main (root-commit) abc1234] Initial commit: add README
#  1 file changed, 1 insertion(+)
#  create mode 100644 README.md
```

The snapshot is saved permanently. The `abc1234` is the commit hash — a unique ID.

---

## The Calm Triad — Commands You Run 100x/Day

### `git status` — What's changed?

```bash
git status
# Shows:
# - Modified files (changed since last commit)
# - Staged files (ready to commit)
# - Untracked files (new files Git doesn't know about)
```

### `git diff` — What exactly changed?

```bash
# See changes in working tree (not yet staged):
git diff

# See changes that are staged (ready to commit):
git diff --staged

# See changes for a specific file:
git diff README.md
```

### `git log` — What's been committed?

```bash
# Full log:
git log

# Compact one-line format:
git log --oneline

# Last 5 commits:
git log --oneline -5

# Visual branch graph:
git log --oneline --graph --all
```

Example output:
```
a1b2c3d (HEAD -> main) Add data processing script
f4e5d6c Fix typo in README
1a2b3c4 Initial commit: add README
```

---

## The Core Workflow

Here's what you'll do dozens of times per day:

```bash
# 1. Make changes (edit files)
echo "New feature code" >> main.py

# 2. Review what changed
git status               # which files changed?
git diff                 # what exactly changed?

# 3. Stage changes
git add main.py          # stage specific file
# or: git add .          # stage everything (use carefully)

# 4. Review staged changes
git diff --staged        # double-check before committing

# 5. Commit
git commit -m "feat: add data processing pipeline"
```

---

## Staging in Detail

### Add specific files

```bash
git add file1.py
git add file2.py
git add data/
```

### Add everything

```bash
git add .                 # add all changes in current directory
git add -A                # add all changes in entire repo
```

### Interactive staging (select specific changes within a file)

```bash
git add -p                # patch mode — review each change and choose y/n
```

### Unstage a file (remove from staging without losing changes)

```bash
git restore --staged file.py
# The file goes back to "modified" but changes are preserved
```

---

## Writing Good Commit Messages

### Format

```
type: short description (50 chars or less)

Optional longer explanation (wrap at 72 chars).
Explain WHY, not what (the diff shows what).
```

### Common types

| Type | When to use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation change |
| `refactor:` | Code restructuring (no behavior change) |
| `test:` | Adding/fixing tests |
| `chore:` | Build, CI, or maintenance tasks |

### Examples

```bash
# Good:
git commit -m "feat: add CSV export for user data"
git commit -m "fix: handle empty input in parser"
git commit -m "docs: add setup instructions to README"

# Bad:
git commit -m "update"
git commit -m "fix stuff"
git commit -m "final version"
git commit -m "asdfgh"
```

### 🧠 Knowledge Check

**Q1:** Why is it bad practice to write a commit message like `"update"`?

- A) Git will reject it because it's too short
- B) It lacks the required `feat:` or `fix:` prefix
- C) It provides zero context about *what* was changed or *why*, making it useless for future debugging
- D) It causes a merge conflict

<details>
<summary><b>Answer</b></summary>

**C** — Commit messages should help you or a teammate understand the changes 6 months later. "Update" explains nothing.

</details>

---

## Undoing Things Safely

### Discard changes in working tree

```bash
git restore file.py          # undo changes to file.py
git restore .                # undo ALL changes (dangerous!)
```

### Unstage a file

```bash
git restore --staged file.py
```

### Amend the last commit (fix message or add forgotten file)

```bash
# Fix the commit message:
git commit --amend -m "feat: better description"

# Add a forgotten file to the last commit:
git add forgotten-file.py
git commit --amend --no-edit
```

### Revert a commit (create a new commit that undoes a previous one)

```bash
git revert abc1234           # safely undoes commit abc1234
```

---

## `.gitignore` — What Git Should Ignore

Create a `.gitignore` file to tell Git which files to skip:

```bash
# .gitignore
.venv/              # virtual environments
__pycache__/        # Python bytecode cache
*.pyc               # compiled Python files
.env                # secrets and environment variables
node_modules/       # Node.js packages
dist/               # build output
*.log               # log files
.DS_Store           # macOS junk
```

> **Always create `.gitignore` early** — before your first commit. It's harder to un-track files that are already committed.

---

## Q&A

<details>
<summary><b>Q: What is the difference between <code>git add</code> and <code>git commit</code>?</b></summary>

**A:**
- `git add` moves changes from the working tree to the **staging area**. It's like putting items in a box.
- `git commit` takes everything in the staging area and creates a permanent **snapshot**. It's like sealing the box and putting a label on it.

You must `add` before you `commit`. This gives you control over what goes into each commit.

</details>

<details>
<summary><b>Q: Why not just <code>git add .</code> every time?</b></summary>

**A:** `git add .` stages everything. This is fine for simple cases, but sometimes you want to commit related changes separately. For example, if you fixed a bug AND added a new feature, you might want two separate commits so each one is clean and reviewable.

</details>

<details>
<summary><b>Q: What is a commit hash?</b></summary>

**A:** A commit hash is a unique identifier (like `a1b2c3d4e5f6...`) generated from the commit's contents. It's a SHA-1 hash. You only need the first 7-8 characters to reference a commit:
```bash
git show a1b2c3d      # show details of this commit
git revert a1b2c3d    # undo this commit
```

</details>

<details>
<summary><b>Q: What does HEAD mean?</b></summary>

**A:** `HEAD` is a pointer to the current commit — the snapshot your working tree is based on. Usually, `HEAD` points to the latest commit on your current branch:
```
a1b2c3d (HEAD -> main) Latest commit
f4e5d6c Previous commit
1a2b3c4 First commit
```

</details>

<details>
<summary><b>Q: Can I undo a commit after pushing to GitHub?</b></summary>

**A:** Yes, using `git revert`:
```bash
git revert abc1234    # creates a new commit that undoes abc1234
git push              # push the revert
```

Avoid `git reset --hard` on pushed commits — it rewrites history and causes problems for teammates.

</details>

---

## Exercises

**Exercise 1: First repository**

```bash
mkdir -p /tmp/git-practice
cd /tmp/git-practice
git init

echo "# Git Practice" > README.md
git add README.md
git commit -m "Initial commit"

git log --oneline
```

<details>
<summary><b>What should git log show?</b></summary>

```
abc1234 (HEAD -> main) Initial commit
```

One commit, pointing to `HEAD` on the `main` branch. The hash will be different on your machine.

</details>

---

**Exercise 2: The add-commit cycle**

```bash
cd /tmp/git-practice

# Create two files:
echo "print('hello')" > main.py
echo "import pytest" > test_main.py

# Stage only main.py:
git add main.py
git status    # main.py is staged, test_main.py is untracked

# Commit:
git commit -m "feat: add main script"

# Now stage and commit the test file:
git add test_main.py
git commit -m "test: add test file"

git log --oneline
```

<details>
<summary><b>Expected log output</b></summary>

```
def5678 (HEAD -> main) test: add test file
abc1234 feat: add main script
ghi9012 Initial commit
```

Three commits, each with a clear message. The latest is at the top.

</details>

---

**Exercise 3: Diff practice**

```bash
cd /tmp/git-practice

# Modify a file:
echo "print('world')" >> main.py

# See the diff:
git diff

# Stage it:
git add main.py

# See the staged diff:
git diff --staged
```

<details>
<summary><b>What does the diff look like?</b></summary>

```diff
diff --git a/main.py b/main.py
--- a/main.py
+++ b/main.py
@@ -1 +1,2 @@
 print('hello')
+print('world')
```

Lines starting with `+` are additions. Lines starting with `-` are deletions. After staging, `git diff` shows nothing (because changes are staged), but `git diff --staged` shows the same diff.

</details>

---

**Exercise 4: Undo practice**

```bash
cd /tmp/git-practice

# Make a change you want to undo:
echo "MISTAKE" >> main.py
cat main.py    # shows the mistake

# Undo the change:
git restore main.py
cat main.py    # mistake is gone!
```

<details>
<summary><b>What happened?</b></summary>

`git restore main.py` discarded the uncommitted changes and reverted the file to its last committed state. The "MISTAKE" line is gone.

⚠️ **Warning:** `git restore` permanently discards changes — there is no undo for the undo!

</details>

---

**Exercise 5: MCQ**

**Q1:** What does `git add` do?

- A) Saves changes permanently
- B) Moves changes from working tree to staging area
- C) Pushes changes to GitHub
- D) Creates a new branch

<details>
<summary><b>Answer</b></summary>

**B** — `git add` stages changes. It prepares them for the next `git commit`. No permanent snapshot is created until you commit.

</details>

---

**Q2:** You run `git status` and see a file listed under "Changes not staged for commit." What does this mean?

- A) The file is ready to be committed
- B) The file has been modified but not yet staged with `git add`
- C) The file has been deleted
- D) The file is ignored by `.gitignore`

<details>
<summary><b>Answer</b></summary>

**B** — The file has been modified in your working tree but hasn't been added to the staging area yet. Run `git add <file>` to stage it.

</details>

---

**Q3:** Which commit message is best practice?

- A) `git commit -m "update"`
- B) `git commit -m "fix: resolve null pointer in user parser"`
- C) `git commit -m "final version v2 REAL final"`
- D) `git commit -m "changes"`

<details>
<summary><b>Answer</b></summary>

**B** — A good commit message has a type prefix (`fix:`), is specific about what changed, and explains the problem that was solved.

</details>

---

Clean up:

```bash
rm -rf /tmp/git-practice
```

---

