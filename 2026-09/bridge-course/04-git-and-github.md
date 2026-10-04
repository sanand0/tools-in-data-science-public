# Module 4: Git & GitHub

By the end, you can:

- Record your bridge lab in Git.
- Push it to GitHub.
- Clone it into a new folder and run your scripts again.

**Bring:**

- `~/bridge-lab` from the earlier modules.
- Git and a GitHub account.
- Use this practice lab for the exercises.

<style>
.markdown #game {
  margin: 1.5rem 0;
  border-inline-start: 4px solid var(--color-link);
  border-radius: 0.5rem;
  background: var(--gray-100);
}
.markdown #game > summary { color: var(--color-link); line-height: 1.4; }
.markdown #game > summary strong { font-size: 1.125rem; }
.markdown #game > summary span {
  display: block;
  margin-top: 0.35rem;
  color: var(--body-font-color);
  font-size: 0.875rem;
  font-weight: normal;
}
.markdown #game > summary:focus-visible { outline: 2px solid var(--color-link); outline-offset: 3px; }
.markdown #game details > summary::before { transform: rotate(0deg); }
.markdown #game details[open] > summary::before { transform: rotate(90deg); }
</style>

<details class="bridge-game" id="game">
<summary><strong>Game mission: Oh My Git!</strong><span>Make a snapshot. See what Git remembers. | 3 challenges</span></summary>

## Start here

1. Download [Oh My Git!](https://ohmygit.org/) for your OS.
2. Extract it and launch the included executable/app.
3. Open the introductory chapter and read each level's goal.
4. Run the commands below in the **game's black terminal**.

**Warm-ups, if shown:**

- **Living dangerously:** open `form.txt`, add a reason on a new line and save.
- **Making backups:** repeat in `form2_really_final.txt`.
- **Save:** Ctrl+S (Windows/Linux) or Cmd+S (macOS); click **Next Level** after completion.

### Challenge 1: Enter the time machine

Try the blue **init** card before opening the walkthrough.

<details>
<summary>Walkthrough: start tracking</summary>

1. Drag the **init** card upward to play it.
2. Check the goal completes, then click **Next Level**.

- **Meaning:** Git is ready to track history; no snapshot exists yet.

</details>

### Challenge 2: The command line

1. Click the black terminal.
2. Enter this command and press Enter:

```bash
git init
```

3. Check the goal completes and continue to **Your first commit**.

- **Meaning:** typing the command performs the same action as the init card.

### Challenge 3: Your first commit

Save two versions of the glass.

<details>
<summary>Walkthrough: two snapshots</summary>

1. In the game's terminal, record the full glass:

```bash
git add glass
git commit -m "Full glass"
```

2. Open `glass`, change its text to `The glass is empty.` and save.
3. Record the changed glass:

```bash
git add glass
git commit -m "Empty glass"
git log --oneline
```

4. Click each snapshot in the visual history and compare the contents.

- **Success:** two commits appear and the level completes.
- **Meaning:** add selects content; commit records that selection.

</details>

- **Stuck?** Read the goal and run `git status`; editing alone does not create a commit.
- **Can't run the game?** Practise the same operations in the lab below.
- **Reference:** [official introductory levels](https://github.com/git-learning-game/oh-my-git/tree/main/levels/intro).

</details>

## Your lab

- **Git:** saves version history on your computer.
- **GitHub:** hosts the history you push online.
- **Flow:** edit → save → add → inspect → commit → push.

Open **Setup** first, then follow sections **4.1–4.4**.

<details name="module-4" id="git-setup">
<summary><strong>Setup · Git identity and defaults (once)</strong></summary>

Replace the name/email with yours; use a verified GitHub email or your no-reply address from **Settings → Emails**.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

- **Name/email:** label the author of your commits; these are not login credentials.
- **Default branch:** new repositories start on `main`.
- **`--global`:** saves settings for your user on this machine; do this once.

</details>

<details name="module-4">
<summary><strong>4.1 · Create a local snapshot</strong></summary>

1. In `~/bridge-lab`, create `README.md` with a title and the run instruction `uv run scripts/check-in.py`.
2. Create `.gitignore` with these lines:

```text
.venv/
__pycache__/
.env
.DS_Store
```

- **Ignore:** local environments, caches, secret settings and macOS metadata. Keep passwords and private keys outside the lab.

```bash
cd ~/bridge-lab
git init
git add .
git diff --cached
git commit -m "Save my bridge lab"
git log --oneline
```

1. **Initialise:** `git init` starts a repository; the setup above makes its first branch `main`.
2. **Stage:** `git add .` selects new/changed files under this folder, respecting `.gitignore` for untracked files.
3. **Inspect:** `git diff --cached` shows the staged content; press `q` if a pager opens.
4. **Commit:** saves the staged snapshot locally; `-m` supplies its message.
5. **History:** `git log --oneline` lists commits compactly; expect one commit.

- **Check before committing:** source files are staged; `.venv` and private data are absent.
- **Later edits:** save and add again before committing; commit uses the staged version.

</details>

<details name="module-4">
<summary><strong>4.2 · Connect to GitHub: generate → copy → paste</strong></summary>

If you already have a working GitHub SSH key, reuse it. Otherwise:

1. Generate a key pair:

```bash
ssh-keygen
```

2. Accept the default save path if unused; do not overwrite an existing key. Enter a passphrase when prompted.
3. Find the output line **Your public key has been saved in ...**. Use that exact `.pub` path with `cat`:

```bash
cat "/path/from/ssh-keygen.pub"
```

4. Copy the entire printed line.
5. On GitHub: **Settings → SSH and GPG keys → New SSH key**.
6. Choose **Authentication Key**, name the device, paste and save.

- **Replace the example path:** use the public-key path printed on your computer.
- **Key pair:** share the `.pub` file; keep the private key on your machine.
- **Default location:** SSH can use the key directly; an agent is optional. Enter your passphrase when asked.

<details id="ssh-options">
<summary>Optional SSH options: when to use them and why</summary>

**Choose a key type and label** — use this instead of plain `ssh-keygen` when you want to specify both:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

- **`-t`:** chooses Ed25519; **`-C`:** adds an email label to identify the key.

**Avoid repeated passphrase prompts** — load your private key into an agent for this session:

```bash
eval "$(ssh-agent -s)"
ssh-add "/path/to/private/key"
```

- **`eval ...`:** starts the agent and connects this shell to it.
- **`ssh-add`:** unlocks and loads the private key; replace the path and omit `.pub`.

**Use a custom key path** — if you saved outside the default location, add/update this block in `~/.ssh/config`:

```text
Host github.com
  IdentityFile /path/to/private/key
  IdentitiesOnly yes
```

- **`IdentityFile`:** chooses your private key; **`IdentitiesOnly`:** limits which identities SSH offers.

**Check the connection** — use this before pushing or when diagnosing login problems:

```bash
ssh -T git@github.com
```

- **`-T`:** disables terminal allocation; GitHub authenticates you without providing a shell.
- **First host prompt:** compare with [GitHub's fingerprints](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints) before accepting.
- **Success:** GitHub greets your username; "no shell access" is expected.

</details>

</details>

<details name="module-4">
<summary><strong>4.3 · Push your commits to GitHub</strong></summary>

1. On GitHub, create a **Private** repository named `bridge-lab`.
2. Leave README, license and `.gitignore` unchecked; you already have local files.
3. Copy its **SSH** URL and replace `YOUR_USERNAME` below:

```bash
cd ~/bridge-lab
git remote add origin git@github.com:YOUR_USERNAME/bridge-lab.git
git push -u origin main
```

1. **Remote:** `origin` is a nickname for your GitHub repository's URL.
2. **Push:** uploads commits from `main`; `-u` remembers the upstream so later pushes use `git push`.

- **Check:** GitHub shows your README, code and commit; `.venv` is absent.
- **Remember:** GitHub receives pushed commits, not unsaved or uncommitted edits.

</details>

<details name="module-4">
<summary><strong>4.4 · Clone and continue working</strong></summary>

Use a destination that does not already exist; replace `YOUR_USERNAME`.

```bash
cd ~
git clone git@github.com:YOUR_USERNAME/bridge-lab.git bridge-lab-recovered
cd bridge-lab-recovered
git log --oneline
uv run scripts/check-in.py
```

1. **Clone:** downloads working files and Git history, and sets up `origin` automatically.
2. **Enter:** `cd` moves into the recovered copy.
3. **Verify:** your commit appears and the NumPy script runs; uv prepares its dependencies.

- **Already set up:** no new `git init` or `remote add` is needed.
- **During this exercise:** edit only the recovered copy.

</details>

## Finish without copying

1. In the recovered copy, add a sentence to README and save.
2. Stage, inspect, commit with a useful message, then push.
3. Check that the new commit appears on GitHub.

| Command | Remember |
| --- | --- |
| `git status` | What changed; what is staged? |
| `git add README.md` | Select the saved changes |
| `git diff --cached` | Inspect what you will commit |
| `git commit -m "Explain my NumPy example"` | Record a local snapshot |
| `git push` | Send commits to GitHub |

- [ ] I completed the three guided game levels.
- [ ] I can explain add, commit and push.
- [ ] My cloned script runs and my second commit is on GitHub.

**Stuck?**

- **SSH permission denied:** check your public key on GitHub and load the matching private key in the same terminal environment.
- **`origin` exists:** inspect `git remote -v`; correct a wrong URL with `git remote set-url origin YOUR_COPIED_SSH_URL`.

**Explore:** run `git diff` before staging, then `git diff --cached` after staging. Explain the difference.

**References:** [Git tutorial](https://git-scm.com/docs/gittutorial) · [GitHub SSH setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

---

**Bridge complete:** keep your repository and notes as your reference for the main course.
