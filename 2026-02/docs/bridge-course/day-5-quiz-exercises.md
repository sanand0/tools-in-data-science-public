# Day 5 Quiz & Exercises
## TDS Bridge Bootcamp — Git & GitHub Workflow

> **Instructions:** Attempt MCQs first. Then do the exercises in order — they build toward your final submission.

---

## Part A — 20 Multiple Choice Questions

**Q1.** You edit a file `app.py`. You run `git status` and see it listed under "Changes not staged for commit". What does this mean?

- [ ] A) The file has been committed to Git
- [ ] B) The file has been staged but not committed
- [ ] C) The file was modified but not yet staged
- [ ] D) The file is new and Git doesn't know about it

<details>
<summary>Answer</summary>

**C** — The file was modified but not yet staged

</details>

---

**Q2.** What is the correct order of the Git workflow?

- [ ] A) `git commit` → `git add` → `git push`
- [ ] B) `git add` → `git push` → `git commit`
- [ ] C) `git add` → `git commit` → `git push`
- [ ] D) `git push` → `git add` → `git commit`

<details>
<summary>Answer</summary>

**C** — add → commit → push is always the order

</details>


---

**Q3.** You run `git add .` — what does the `.` mean?

- [ ] A) Stage only files that have changed since the last commit
- [ ] B) Stage all files in the current directory and subdirectories
- [ ] C) Stage only hidden files
- [ ] D) Stage the file literally named `.`

<details>
<summary>Answer</summary>

**B** — `.` means current directory and everything below

</details>


---

**Q4.** What does `git diff` show you?

- [ ] A) The difference between your local repo and GitHub
- [ ] B) The list of all commits in the project
- [ ] C) The exact line-by-line changes in files that are modified but not yet staged
- [ ] D) The files that have been deleted

<details>
<summary>Answer</summary>

**C** — `git diff` shows unstaged changes; `git diff --staged` shows staged

</details>


---

**Q5.** You staged a file by mistake. Which command unstages it without deleting the changes?

- [ ] A) `git reset app.py`
- [ ] B) `git restore --staged app.py`
- [ ] C) `git undo app.py`
- [ ] D) `git remove app.py`

<details>
<summary>Answer</summary>

**B** — `git restore --staged` unstages without losing changes

</details>


---

**Q6.** What does `git log --oneline` show?

- [ ] A) A full diff of every commit
- [ ] B) A compact list of commits — one line each, with hash and message
- [ ] C) Only the last commit
- [ ] D) The list of files changed in each commit

<details>
<summary>Answer</summary>

**B** — `--oneline` = one line per commit: hash + message

</details>


---

**Q7.** What is `origin` in Git?

- [ ] A) The first commit in a repository
- [ ] B) The default branch of a repository
- [ ] C) A nickname for the remote repository URL (usually GitHub)
- [ ] D) The folder where Git stores its data

<details>
<summary>Answer</summary>

**C** — `origin` is a nickname/alias for the remote URL

</details>


---

**Q8.** What does `git push -u origin main` do that plain `git push` does not?

- [ ] A) Pushes all branches, not just main
- [ ] B) Sets `origin main` as the default remote/branch for future `git push` calls
- [ ] C) Creates a new branch called `origin`
- [ ] D) Uploads the entire `.git/` folder to GitHub

<details>
<summary>Answer</summary>

**B** — `-u` sets upstream so future `git push` needs no arguments

</details>


---

**Q9.** GitHub stopped accepting passwords for Git operations. The two alternatives are:

- [ ] A) SSH keys and API keys
- [ ] B) Personal Access Tokens (PAT) and SSH keys
- [ ] C) OAuth tokens and fingerprints
- [ ] D) 2FA codes and SSH keys

<details>
<summary>Answer</summary>

**B** — PAT (HTTPS) and SSH keys are the two options

</details>


---

**Q10.** You run `ssh-keygen -t ed25519 -C "me@example.com"`. Two files are created. Which one do you add to GitHub?

- [ ] A) `id_ed25519` (the private key)
- [ ] B) `id_ed25519.pub` (the public key)
- [ ] C) Both files
- [ ] D) Neither — you paste the passphrase to GitHub

<details>
<summary>Answer</summary>

**B** — Public key (`.pub`) goes to GitHub; private key stays local

</details>


---

**Q11.** After adding your SSH key to GitHub, you run `ssh -T git@github.com`. The expected successful response is:

- [ ] A) `Connection established. Ready to push.`
- [ ] B) `Permission granted.`
- [ ] C) `Hi yourname! You've successfully authenticated, but GitHub does not provide shell access.`
- [ ] D) `SSH handshake complete.`

<details>
<summary>Answer</summary>

**C** — This exact message confirms successful SSH authentication

</details>


---

**Q12.** Your remote URL is `https://github.com/alice/project.git`. You want to switch it to SSH. Which command is correct?

- [ ] A) `git remote switch git@github.com:alice/project.git`
- [ ] B) `git remote set-url origin git@github.com:alice/project.git`
- [ ] C) `git remote update origin git@github.com:alice/project.git`
- [ ] D) `git push --ssh git@github.com:alice/project.git`

<details>
<summary>Answer</summary>

**B** — `git remote set-url origin <new-url>` changes the remote URL

</details>


---

**Q13.** Which `git tag` command creates an annotated tag?

- [ ] A) `git tag v0.1.0`
- [ ] B) `git tag --annotate v0.1.0`
- [ ] C) `git tag -a v0.1.0 -m "First release"`
- [ ] D) `git tag -l v0.1.0 "First release"`

<details>
<summary>Answer</summary>

**C** — `-a` = annotated, `-m` = message

</details>


---

**Q14.** You create a tag locally. How do you push it to GitHub?

- [ ] A) `git push` (tags are included automatically)
- [ ] B) `git push --tags`
- [ ] C) `git push origin v0.1.0`
- [ ] D) Both B and C work

<details>
<summary>Answer</summary>

**D** — Both `--tags` (all tags) and `origin v0.1.0` (specific tag) work

</details>


---

**Q15.** What does `v1.2.3` mean in semantic versioning?

- [ ] A) Version 1, Release 2, Hotfix 3
- [ ] B) Major version 1, minor version 2, patch 3
- [ ] C) Year 1, Month 2, Day 3
- [ ] D) Build 1, iteration 2, fix 3

<details>
<summary>Answer</summary>

**B** — Major.Minor.Patch is the semantic versioning format

</details>


---

**Q16.** You release `v1.1.0`. You then fix a small bug without adding any new features. What should the next version be?

- [ ] A) `v1.2.0`
- [ ] B) `v2.0.0`
- [ ] C) `v1.1.1`
- [ ] D) `v1.1.0-fix`

<details>
<summary>Answer</summary>

**C** — Bug fix only = increment patch: `1.1.0` → `1.1.1`

</details>


---

**Q17.** You accidentally committed sensitive data (an API key) to Git. Which of these is the correct response?

- [ ] A) Delete the file and commit again — the old commit is automatically removed
- [ ] B) The key is now in Git history; revoke and regenerate the key immediately, then remove it from history
- [ ] C) Rename the file and commit — Git won't notice it's the same content
- [ ] D) Run `git restore` to undo the commit

<details>
<summary>Answer</summary>

**B** — Revoke the key immediately — deleting the file doesn't erase history

</details>


---

**Q18.** Which commit message is best?

- [ ] A) `"final"`
- [ ] B) `"updated files"`
- [ ] C) `"fix: handle 401 response from external API"`
- [ ] D) `"made some changes to the auth stuff"`

<details>
<summary>Answer</summary>

**C** — Clear, specific, follows a convention

</details>


---

**Q19.** `git restore app.py` (without `--staged`) does what?

- [ ] A) Deletes `app.py` from the repo
- [ ] B) Discards unsaved changes in `app.py` and reverts it to the last committed version
- [ ] C) Stages `app.py` for the next commit
- [ ] D) Moves `app.py` to the staging area

<details>
<summary>Answer</summary>

**B** — Discards working tree changes, restores to last commit

</details>


---

**Q20.** What is the difference between `git reset --soft HEAD~1` and `git reset --hard HEAD~1`?

- [ ] A) `--soft` undoes the last commit but keeps your changes; `--hard` undoes the commit and permanently deletes your changes
- [ ] B) `--hard` undoes the last commit but keeps your changes; `--soft` deletes everything
- [ ] C) They do the same thing
- [ ] D) `--soft` is for staged files; `--hard` is for committed files

<details>
<summary>Answer</summary>

**A** — `--soft` preserves changes; `--hard` destroys them permanently

</details>


---



**Q21.** Why does GitHub recommend merging multiple accounts into a single account?

- [ ] A) GitHub charges for multiple accounts
- [ ] B) GitHub's terms of service allow only one free account per human
- [ ] C) Git cannot handle multiple accounts on one computer
- [ ] D) It makes your profile look better

<details>
<summary>Answer</summary>

**B** — GitHub TOS states one free account per person.

</details>

---

**Q22.** Which file tells Git to completely ignore certain files (like `.env` or `__pycache__`)?

- [ ] A) `.gitconfig`
- [ ] B) `.gitignore`
- [ ] C) `.git/ignore`
- [ ] D) `ignore.txt`

<details>
<summary>Answer</summary>

**B** — `.gitignore` is standard for this.

</details>

---

**Q23.** You made a typo in your last commit message, but you haven't pushed it yet. How do you fix it?

- [ ] A) `git commit --amend -m "new message"`
- [ ] B) `git rename commit "new message"`
- [ ] C) `git undo`
- [ ] D) You can't, you must delete the repo

<details>
<summary>Answer</summary>

**A** — `--amend` alters the last commit.

</details>

---

**Q24.** What is the main branch in modern Git repositories usually called?

- [ ] A) `master`
- [ ] B) `main`
- [ ] C) `trunk`
- [ ] D) `production`

<details>
<summary>Answer</summary>

**B** — `main` is the modern default.

</details>

---

**Q25.** How do you set your default branch to `main` globally in Git?

- [ ] A) `git branch default main`
- [ ] B) `git config --global init.defaultBranch main`
- [ ] C) `git switch main`
- [ ] D) `git set main`

<details>
<summary>Answer</summary>

**B** — `init.defaultBranch` changes the default for new repos.

</details>

---

**Q26.** You want to see the difference between your staged changes and your last commit. Which command do you use?

- [ ] A) `git diff`
- [ ] B) `git diff --staged`
- [ ] C) `git status`
- [ ] D) `git show`

<details>
<summary>Answer</summary>

**B** — `--staged` shows what you're about to commit.

</details>

---

**Q27.** What is the purpose of `git clone`?

- [ ] A) To copy a local repository to another folder
- [ ] B) To download a full copy of a remote repository to your local machine
- [ ] C) To create a new branch
- [ ] D) To upload your code to GitHub

<details>
<summary>Answer</summary>

**B** — `clone` downloads remote repositories.

</details>

---

**Q28.** A file named `secrets.json` was tracked by Git, but now you added it to `.gitignore`. What happens?

- [ ] A) Git deletes the file
- [ ] B) Git stops tracking changes to it, but it remains in the repo history
- [ ] C) Git ignores it only if you run `git rm --cached secrets.json`
- [ ] D) It is removed from everyone's computer

<details>
<summary>Answer</summary>

**C** — Once tracked, you must remove it from the cache first.

</details>

---

**Q29.** What does `git log -p` show?

- [ ] A) A compact log
- [ ] B) The log with full patch diffs for every commit
- [ ] C) Only your commits
- [ ] D) A graphical tree of commits

<details>
<summary>Answer</summary>

**B** — `-p` displays the full diff (patch).

</details>

---

**Q30.** Why should commit messages be meaningful instead of "fixed stuff"?

- [ ] A) So you or your teammates can understand what changed and why when reviewing history
- [ ] B) Because Git rejects short messages
- [ ] C) Because GitHub AI reads them
- [ ] D) Meaningful messages execute faster

<details>
<summary>Answer</summary>

**A** — Good commit messages are crucial for collaboration.

</details>

---

<details>
<summary>Full Answer Key (spoilers)</summary>

| Q | Answer |
|---|--------|
| 1 | C |
| 2 | C |
| 3 | B |
| 4 | C |
| 5 | B |
| 6 | B |
| 7 | C |
| 8 | B |
| 9 | B |
| 10 | B |
| 11 | C |
| 12 | B |
| 13 | C |
| 14 | D |
| 15 | B |
| 16 | C |
| 17 | B |
| 18 | C |
| 19 | B |
| 20 | A |
| 21 | B |
| 22 | B |
| 23 | A |
| 24 | B |
| 25 | B |
| 26 | B |
| 27 | B |
| 28 | C |
| 29 | B |
| 30 | A |

</details>

---

## Part B — Terminal Exercises

> These exercises use your Day 4 FastAPI project as the real thing to version. Have it ready.

---

### Exercise 1 — Explore your repo's current state

```bash
cd ~/tds/bootcamp/day4-api    # or wherever your project is

# See the full state
git status
git log --oneline
git remote -v
```

**Write down:**
- How many commits does your repo have?
- What is the remote URL — is it HTTPS or SSH format?

---

### Exercise 2 — Practice the status → diff → add → commit loop

Make a small change to your project:

```bash
# Add a description to README.md
echo "" >> README.md
echo "## About" >> README.md
echo "A minimal FastAPI service built during TDS Bridge Bootcamp Day 4." >> README.md
```

Now go through the full workflow:

```bash
# 1. Check what changed
git status

# 2. See the exact diff
git diff

# 3. Stage the file
git add README.md

# 4. Confirm what's staged
git status

# 5. Commit with a clear message
git commit -m "docs: add project description to README"

# 6. Check the log
git log --oneline
```

**Confirm:** Does `git log --oneline` now show your new commit at the top?

---

### Exercise 3 — Set up SSH authentication

```bash
# 1. Check if you already have an SSH key
ls ~/.ssh/

# If id_ed25519.pub already exists, skip to step 3

# 2. Generate a new key
ssh-keygen -t ed25519 -C "youremail@example.com"
# Press Enter for default location, optionally add a passphrase

# 3. Copy your public key
cat ~/.ssh/id_ed25519.pub
```

Now go to GitHub:
- **Settings → SSH and GPG keys → New SSH key**
- Paste the public key, title it "My Laptop" or similar

Back in the terminal:

```bash
# 4. Test the connection
ssh -T git@github.com
```

**Expected:** `Hi yourname! You've successfully authenticated...`

```bash
# 5. Switch your remote to SSH (if it's currently HTTPS)
git remote -v                   # Check current URL
git remote set-url origin git@github.com:yourname/reponame.git

# 6. Test by pushing your commit from Exercise 2
git push
```

**Confirm:** Did `git push` work without asking for a password?

---

### Exercise 4 — Make a second commit and check history

```bash
# Add a .gitignore file (important for Python projects)
cat > .gitignore << 'EOF'
.venv/
__pycache__/
*.pyc
.env
EOF

git add .gitignore
git commit -m "chore: add .gitignore for Python project"

git log --oneline
```

You should now have at least 2 new commits. Check what changed in a specific commit:

```bash
# Show the full diff of your last commit
git show HEAD

# Show just the files changed in the last commit
git show HEAD --name-only
```

---

### Exercise 5 — Tag and release

```bash
# 1. Create an annotated tag
git tag -a v0.1.0 -m "TDS Bridge Bootcamp complete — Day 5"

# 2. Verify the tag
git tag
git show v0.1.0

# 3. Push the tag to GitHub
git push origin v0.1.0
```

Now go to GitHub:
1. Go to your repo → **Releases** → **Create a new release**
2. Click "Choose a tag" → select `v0.1.0`
3. Title: `v0.1.0 — Bridge Bootcamp Complete`
4. Description: Write 2–3 lines about what's in this release
5. Click **Publish release**

**Paste the release URL in your `day5.md` file.**

---

### Bonus Exercise — Undo safely

```bash
# Make a bad commit (intentionally)
echo "this is a mistake" >> app.py
git add app.py
git commit -m "oops"

# See it in the log
git log --oneline

# Undo the last commit, keep the change in working tree
git reset --soft HEAD~1

# See the log again — commit is gone
git log --oneline

# See the change is still there
git status

# Now discard the change too
git restore app.py
git status    # Should be clean
```

**Write in `day5.md`:** What is the difference between `git reset --soft` and `git restore`?

---

*End of Day 5 Quiz & Exercises — and the TDS Bridge Bootcamp* 🎉
### Exercise 6 — Additional Practice

1. Run `git config --global init.defaultBranch main` in your terminal.
2. Run `git config --global --list` and verify that `user.name`, `user.email`, and `init.defaultbranch` are correctly set.

**Question to answer:** Why is setting a correct `user.email` important for GitHub?

---
