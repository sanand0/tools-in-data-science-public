# Module 4: Git & GitHub

By the end, your bridge notebook will have local snapshots, a copy on GitHub, and a second local copy recovered with clone. Your first goal is the simple everyday workflow.

> Have your `bridge-lab` folder and a GitHub account ready. Practise inside this folder, not an existing course or work repository.

## Quick game: Oh My Git!

1. Download and open [Oh My Git!](https://ohmygit.org/) for your operating system.
2. Start an introductory level and predict what an add or commit action will change.
3. Play the action, inspect the visual result, and explain what Git staged or committed.

Use its practice repositories; stop before advanced topics.

## Optional game: Githug

Use this only if you already have a compatible Ruby environment.

1. Run `gem install githug`, then create and enter `~/bridge-games/githug-practice`.
2. Run `githug`, read the puzzle, make the Git change, then run `githug` again to check it.
3. If stuck, run `githug hint`; use `githug reset` only inside the game's folder.

Githug may not work with Ruby 3+. If so, use Oh My Git! instead. [Githug instructions](https://github.com/Gazler/githug#readme)

## Learning path

Open a section to begin. Work in order, try the commands, and reveal answers only after choosing your own.

<details name="module-4">
<summary><strong>4.1 · Before version control</strong></summary>

## Learn

Imagine submitting `assignment.zip`, then `assignment-final.zip`, then `assignment-final-really.zip`. Which one fixed the error? Which changes came from your teammate? Whole-folder copies are easy to create but hard to compare.

### From folder copies to version control

A **version control system (VCS)** records changes with an author and an explanation.

| Approach | Where history lives | What to remember |
| --- | --- | --- |
| ZIP copies | Separate copies you name and organise | Hard to compare changes or identify the latest work |
| Local VCS | On one machine | History is recorded locally |
| Centralised VCS | Shared history on a central server | The server holds the shared repository history |
| Distributed VCS, such as Git | Each normal clone has its own repository history | Record work offline, then share commits later |

### Git and GitHub are different

**Git is the tool. GitHub is a hosting service.** You do not need a GitHub account to make local commits. You do need a remote copy if you want your committed work available after losing your laptop.

```text
Working files → git add → Staged snapshot → git commit → Local history
                                                          ↓ git push
                                                     GitHub repository
```

### Follow one change

1. **Save:** write editor changes to the working file.
2. **`git add`:** select content for the next snapshot.
3. **`git commit`:** record that snapshot in local history.
4. **`git push`:** send commits to the remote.

> **Remember:** saving is necessary before adding a file, but saving is not itself a commit.

## Predict

After a local commit, can someone see it on your GitHub page before you push?

<details>
<summary>Answer</summary>

No. Local history and remote history are separate until you transfer commits. GitHub also cannot back up uncommitted files merely because the folder is a Git repository.

</details>

</details>

<details name="module-4">
<summary><strong>4.2 · Configure Git once</strong></summary>

## Practice

Check `git --version`. If missing, use Module 1’s install instructions. Configure new repositories to start with a branch called `main`:

```bash
git config --global init.defaultBranch main
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global --get init.defaultBranch
git config --global --get user.name
git config --global --get user.email
```

### Choose your commit identity

- Replace the name and email before running the commands.
- These fields label your commits; they are **not your GitHub password or login**.
- Use an email verified on GitHub.
- For email privacy, copy the exact no-reply address in **Settings → Emails**.

`--global` applies to this user account on this machine. `init.defaultBranch` affects newly initialised repositories, not the branch names of existing ones. We only use one branch in this bridge. [Git init reference](https://git-scm.com/docs/git-init).

## Check

- [ ] The three `--get` commands show `main` and your chosen identity.

Create a project description:

```bash
cd ~/bridge-lab
nano README.md
```

Include three things in README:

- A project title, beginning with Markdown’s `#` heading marker.
- The skills you practised.
- The run instruction: `uv run --script scripts/check-in.py`.

Save the file. Ordinary sentences need no special Markdown markup.

</details>

<details name="module-4">
<summary><strong>4.3 · Make local snapshots</strong></summary>

## Practice

From `~/bridge-lab`, initialise Git once:

```bash
git init
ls -a
```

## Check

- [ ] `ls -a` shows `.git`.
- [ ] I can explain why existing files are still working files until I add and commit them.

`.git` contains the repository metadata and history. Do not edit or delete it manually.

Create `nano .gitignore` with these lines, then save:

```text
.venv/
__pycache__/
.env
.DS_Store
```

| Pattern | Leave out of future adds |
| --- | --- |
| `.venv/` | Local environments |
| `__pycache__/` | Generated Python cache files |
| `.env` | A common file for secrets and local settings |
| `.DS_Store` | macOS folder metadata |

> **Important:** an ignore rule does not remove anything already committed. Only keep harmless practice material in your notes.

### Stage, inspect, then commit

```bash
git status
git add README.md .gitignore scripts notes
git diff --cached
git commit -m "Record my bridge course practice"
git log --oneline
```

`status` reports file state; `diff --cached` lets you inspect the staged snapshot (`q` exits a pager); `log` shows recorded commits. Confirm no passwords, tokens, or private keys are staged before committing.

### Pause and explain

**Why run `git diff --cached` instead of only looking at the file in your editor before committing?**

<details>
<summary>Check your explanation</summary>

Git commits the staged snapshot, not automatically the latest working-file contents. `git diff --cached` shows exactly what the next commit would record, including whether you staged the intended files and avoided secrets.

</details>

## Try it yourself

Add a sentence to README, save it, then run `git add README.md` and `git commit -m "Explain what I learned"`.

## Check

- [ ] `git log --oneline` shows two commits.
- [ ] I can explain why an untracked practice folder is absent from those commits.

A commit records staged content, not every file on the machine.

</details>

<details name="module-4">
<summary><strong>4.4 · Create your SSH key</strong></summary>

## Practice

SSH lets GitHub recognise your machine using a key pair.

| Key | Default filename | Where it belongs |
| --- | --- | --- |
| **Public** | `id_ed25519.pub` | Upload to GitHub |
| **Private** | `id_ed25519` | Keep on your machine, outside the project; never share |

### Look for an existing key

In the same Ubuntu/WSL/macOS environment where you run Git:

```bash
ls -la ~/.ssh
```

“No such file” is normal on a new setup. If a working GitHub key already exists, reuse it; do not overwrite it. Otherwise run:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

### Answer the prompts carefully

1. Replace the email in the command with your own.
2. Accept the default file path only if it is unused.
3. Choose a passphrase you can remember.
4. If asked to overwrite a file, answer **no** and choose a new filename. Substitute that path in the next commands.

### Load the key

For a key saved at the default path:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

The agent holds the unlocked identity for your session. `ssh-add` may ask for your key’s passphrase, not your GitHub password. [GitHub’s key generation guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) covers OS-specific options.

### Pause and explain

**Why can you upload the `.pub` key to GitHub but must never share the matching private key?**

<details>
<summary>Check your explanation</summary>

GitHub uses the public key to verify signatures made by the matching private key. The private key is the secret proof that you control that identity; anyone who obtains it may be able to authenticate as you, especially if they also obtain its passphrase.

</details>

## Check

- [ ] `ssh-add -l` lists a key fingerprint.
- [ ] I know that a fingerprint identifies the loaded key without exposing the private key.

If `ssh-keygen` is missing on Ubuntu, install `openssh-client` using apt.

</details>

<details name="module-4">
<summary><strong>4.5 · Connect the key to GitHub</strong></summary>

## Practice

Display **only** the public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

1. Copy the entire public-key line.
2. Open GitHub’s **Settings → SSH and GPG keys → New SSH key**.
3. Choose an authentication key.
4. Give it a device name and paste the public key.

See [GitHub’s account instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

Then test:

```bash
ssh -T git@github.com
```

### Interpret the connection test

1. **Before accepting:** compare the host fingerprint with [GitHub’s published fingerprints](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints).
2. **Look for your username:** a successful test greets your GitHub account.
3. **Expect “no shell access”:** GitHub does not provide an interactive shell. The successful authentication test can still exit with status 1.

See the [connection test guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection).

<details>
<summary>Permission denied (publickey)?</summary>

1. Confirm you uploaded the matching `.pub` key.
2. Run `ssh-add -l` and check that it lists the intended identity.
3. Use the same terminal environment: WSL and Windows have separate home folders.
4. If you chose a custom key filename, add that file to the agent.
5. If your network blocks port 22, follow GitHub’s [SSH over HTTPS port](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port) route or ask for help.

</details>

## Check

- [ ] The SSH greeting names my intended GitHub account.

Keep your private key out of websites, repositories, screenshots, and chats.

</details>

<details name="module-4">
<summary><strong>4.6 · Add origin and push</strong></summary>

## Practice

### 1. Create an empty remote repository

1. Create a GitHub repository called `bridge-lab`.
2. Choose **Private** for your learning notebook.
3. Leave README, license, and `.gitignore` unchecked: you already have local files and commits.

### 2. Connect and upload

Copy its **SSH** URL. Replace `YOUR_USERNAME` below with your GitHub username:

```bash
cd ~/bridge-lab
git remote add origin git@github.com:YOUR_USERNAME/bridge-lab.git
git remote -v
git push -u origin main
```

| Part | Meaning |
| --- | --- |
| `origin` | Conventional local nickname for the remote URL, not a special server |
| `push` | Transfer your branch’s commits |
| `-u` | Remember the upstream connection so later pushes can use `git push` |

## Check

- [ ] On GitHub I can see README, `scripts`, `notes`, and the two commit messages.
- [ ] I cannot see `.venv`, because it was not added and pushed.

GitHub receives the commits you push, not every untracked file in your folder.

<details>
<summary>Common first-push errors</summary>

- **origin already exists:** inspect `git remote -v`. If the URL is wrong, correct it with `git remote set-url origin YOUR_COPIED_SSH_URL`.
- **src refspec main does not match:** check `git log --oneline` and `git branch --show-current`; this lab expects a commit on main.
- **Rejected because the remote contains work:** do not force-push. You may have created a remote README. For this beginner lab, clone that repository to a separate folder, copy in your practice source files, add, commit, and push.

</details>

</details>

<details name="module-4">
<summary><strong>4.7 · Clone means ready-made Git</strong></summary>

## Practice

### What a normal clone sets up

- **Working files:** a new folder with a checked-out working branch.
- **History:** the repository’s recorded commits.
- **`.git`:** the repository metadata directory.
- **`origin`:** the connection to the repository you cloned.

See the [Git clone reference](https://git-scm.com/docs/git-clone).

From your home directory, with the username replaced:

```bash
cd ~
git clone git@github.com:YOUR_USERNAME/bridge-lab.git bridge-lab-recovered
cd bridge-lab-recovered
ls -a
git remote -v
git log --oneline
uv run --script scripts/check-in.py
```

## Check

- [ ] The clone contains `.git` and has an `origin` URL.
- [ ] The two commits appear in its log.
- [ ] The Python script runs after uv recreates its environment from inline metadata.

The original `.venv` folders do not need to travel with the clone.

Do **not** run `git init` or `git remote add origin` after this normal clone—they are already set up. Cloning into an existing non-empty folder fails; choose a fresh destination rather than deleting your work.

**Everyday loop:** edit → save → `git add` → `git commit` → `git push`. Use `git status` whenever you are unsure. If you later work from multiple copies, you will also need to learn `git pull`; for this exercise, stop editing the original copy after this recovery check.

</details>

## Check your understanding

These three distinctions are enough for the bridge.

### 1. You edit a file after git add, then commit without adding it again. What is recorded?

- **A.** Always the latest text in the editor
- **B.** The content staged by the earlier git add
- **C.** Everything on GitHub

**Answer and why:** B. Staging selects a snapshot of content. Save and add again to include the later edit in the next commit.

### 2. Which key belongs in GitHub’s SSH key form?

- **A.** The public key ending in .pub
- **B.** The private key without .pub
- **C.** Your GitHub password

**Answer and why:** A. The public key lets GitHub verify your machine’s authentication. The private key must stay private.

### 3. After a normal git clone, what should you expect?

- **A.** Files only; run git init and add origin yourself
- **B.** An empty directory
- **C.** Working files, repository history, .git, and an origin remote

**Answer and why:** C. Clone establishes the repository and its remote connection. It differs from downloading a ZIP of source files.

## Ready for the main course

- [ ] I can navigate my project and explain a path or permission.
- [ ] I can run my Bash and Python scripts from the recovered clone.
- [ ] I can explain where uv gets the script’s dependencies.
- [ ] I can identify a request’s method, status, and response in DevTools.
- [ ] I can add, commit, push, and find my committed work on GitHub.

Revisit the relevant module if an item is uncertain. Keep your repository and notes as your reference.

## Explore yourself

Choose **Oh My Git!** above for visual practice or **Githug** for checked terminal puzzles. Repeat one add/commit exercise until you can predict its effect.


---

**Bridge complete:** keep your repository as a reference for the main course.
