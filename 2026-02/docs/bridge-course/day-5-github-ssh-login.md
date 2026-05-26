# Day 5 — GitHub SSH Login

> **Goal:** Set up SSH key authentication for GitHub so you can push and pull without entering passwords, and understand how public-key cryptography works in practice.

---

## Why SSH?

When you push code to GitHub, GitHub needs to verify you are who you say you are. There are two main ways:

| Method | How it works | Pros | Cons |
|---|---|---|---|
| **HTTPS + Token** | Password/token sent with each request | Easy setup | Must manage tokens |
| **SSH Keys** | Cryptographic key pair | No password needed, more secure | One-time setup is longer |

**We recommend SSH** — once set up, it just works. No tokens to manage or expire.

---

## How SSH Keys Work

SSH uses **public-key cryptography**. You generate a **pair** of keys:

```
┌──────────────────┐      ┌──────────────────┐
│   Private Key    │      │   Public Key     │
│   (SECRET!)      │      │   (shareable)    │
│                  │      │                  │
│   ~/.ssh/id_ed25519     │   ~/.ssh/id_ed25519.pub
│                  │      │                  │
│   Never share    │      │   Upload to      │
│   Never upload   │      │   GitHub         │
│   Keep on YOUR   │      │                  │
│   machine only   │      │   Like a lock    │
│                  │      │   that only your │
│   Like a key     │      │   key can open   │
│   that opens the │      │                  │
│   lock           │      │                  │
└──────────────────┘      └──────────────────┘
```

**Analogy:** Think of it like a padlock:
- **Public key** = the padlock (you give copies to GitHub, GitLab, servers)
- **Private key** = the key to the padlock (you keep it secret, only on your machine)

When you push to GitHub:
1. GitHub sends a challenge encrypted with your **public key**
2. Your machine decrypts it with your **private key**
3. GitHub verifies you are legit ✓

### 🧠 Knowledge Check

**Q1:** What is the primary difference between a public key and a private key in SSH?

- A) The public key is for reading files, the private key is for writing files
- B) You upload the public key to GitHub, but you keep the private key secret on your local machine
- C) The private key is uploaded to GitHub, and you keep the public key
- D) They are identical; you just rename one of them

<details>
<summary><b>Answer</b></summary>

**B** — The public key acts like a padlock that you can give to anyone (like GitHub). The private key is the actual key that unlocks it, and it must never be shared.

</details>

---

## Step-by-Step Setup

### Step 1: Check for Existing Keys

```bash
ls -la ~/.ssh/
# If you see id_ed25519 and id_ed25519.pub, you already have keys!
# If ~/.ssh/ doesn't exist or is empty, proceed to Step 2.
```

### Step 2: Generate a New SSH Key

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

You'll see:

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/you/.ssh/id_ed25519): [press Enter]
Enter passphrase (empty for no passphrase): [press Enter or type a passphrase]
Enter same passphrase again: [press Enter]
```

- **File location:** Press Enter to accept the default (`~/.ssh/id_ed25519`)
- **Passphrase:** Optional. Adds extra security — you'll type it once per session

> **ed25519 vs RSA:** We use `ed25519` because it's faster, more secure, and generates shorter keys than RSA. All modern systems support it.

### Step 3: Verify Your Keys

```bash
ls -la ~/.ssh/
# id_ed25519       ← private key (NEVER share this)
# id_ed25519.pub   ← public key (this goes to GitHub)
```

View your public key:

```bash
cat ~/.ssh/id_ed25519.pub
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGx... your.email@example.com
```

### Step 4: Start the SSH Agent

The SSH agent remembers your key so you don't have to type the passphrase every time:

```bash
eval "$(ssh-agent -s)"
# Agent pid 12345

ssh-add ~/.ssh/id_ed25519
# Identity added: /home/you/.ssh/id_ed25519 (your.email@example.com)
```

### Step 5: Add Your Public Key to GitHub

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the entire output (starts with "ssh-ed25519")
   ```

2. Go to **GitHub** → **Settings** → **SSH and GPG Keys** → **New SSH Key**
   - Direct link: [github.com/settings/keys](https://github.com/settings/keys)

3. Fill in:
   - **Title:** Something descriptive like "My Ubuntu Laptop" or "WSL2 Desktop"
   - **Key type:** Authentication
   - **Key:** Paste your public key

4. Click **Add SSH Key**

### Step 6: Test the Connection

```bash
ssh -T git@github.com
# Hi username! You've been successfully authenticated, but GitHub
# does not provide shell access.
```

If you see "Hi username!" — you're connected! 🎉

---

## Using SSH with Git

### Clone a repo via SSH

```bash
# SSH URL format:
git clone git@github.com:username/repo-name.git

# HTTPS URL format (for comparison):
git clone https://github.com/username/repo-name.git
```

> Always use the SSH URL (starts with `git@github.com:`) when you have SSH set up.

### Switch an existing repo from HTTPS to SSH

```bash
# Check current remote:
git remote -v
# origin  https://github.com/username/repo.git (fetch)

# Switch to SSH:
git remote set-url origin git@github.com:username/repo.git

# Verify:
git remote -v
# origin  git@github.com:username/repo.git (fetch)
```

### Push and pull (no password needed!)

```bash
git push origin main        # push changes — no password prompt
git pull origin main        # pull changes — no password prompt
```

### 🧠 Knowledge Check

**Q1:** If you have an existing repository using HTTPS, what command changes it to use SSH?

- A) `git switch-to-ssh`
- B) `git remote set-url origin git@github.com:username/repo.git`
- C) `git clone ssh://github`
- D) `git config --global use-ssh true`

<details>
<summary><b>Answer</b></summary>

**B** — `git remote set-url` updates the URL of the remote named `origin` to the new SSH URL.

</details>

---

## Creating a GitHub Repo from the Terminal

If you have the GitHub CLI (`gh`) installed:

```bash
# Install gh:
sudo apt install gh -y
# Or: see https://cli.github.com/

# Authenticate:
gh auth login
# Choose: GitHub.com → SSH → select your key

# Create a repo and push:
cd ~/my-project
gh repo create my-project --public --source=. --remote=origin --push
```

Without `gh`, create the repo on GitHub's website, then:

```bash
git remote add origin git@github.com:username/my-project.git
git branch -M main
git push -u origin main
```

---

## Troubleshooting

<details>
<summary><b>"Permission denied (publickey)" error</b></summary>

This means GitHub didn't accept your SSH key. Check:

1. Is the SSH agent running?
   ```bash
   ssh-add -l
   # Should show your key. If "no identities," run:
   ssh-add ~/.ssh/id_ed25519
   ```

2. Is the correct public key on GitHub?
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Compare with what's on github.com/settings/keys
   ```

3. Are you using the SSH URL?
   ```bash
   git remote -v
   # Should start with git@github.com:, NOT https://
   ```

</details>

<details>
<summary><b>"Could not resolve hostname github.com"</b></summary>

This is a DNS/network issue, not an SSH issue. Check your internet connection:
```bash
ping github.com
```

</details>

<details>
<summary><b>"WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED"</b></summary>

This usually means GitHub's SSH key fingerprint changed (rare) or you connected to a different server. If you trust the connection:
```bash
ssh-keygen -R github.com
ssh -T git@github.com    # accept the new fingerprint
```

</details>

<details>
<summary><b>"Enter passphrase for key" keeps appearing</b></summary>

Your key has a passphrase, and the SSH agent isn't remembering it. Fix:
```bash
# Start the agent:
eval "$(ssh-agent -s)"

# Add your key (will ask for passphrase once):
ssh-add ~/.ssh/id_ed25519

# Make it persistent across terminal sessions — add to ~/.bashrc:
echo 'eval "$(ssh-agent -s)" > /dev/null 2>&1' >> ~/.bashrc
echo 'ssh-add ~/.ssh/id_ed25519 2>/dev/null' >> ~/.bashrc
```

</details>

---

## HTTPS Alternative (if SSH doesn't work)

If you can't use SSH (corporate firewall, etc.), use HTTPS with a Personal Access Token (PAT):

```bash
# 1. Create a PAT at: github.com/settings/tokens
#    Select scopes: repo (full access)

# 2. Store it so Git remembers:
git config --global credential.helper store

# 3. Push — enter your token when asked for "password":
git push origin main
# Username: your-github-username
# Password: ghp_your_personal_access_token
```

> The token is stored in `~/.git-credentials` (plain text). SSH keys are more secure.

---

## Q&A

<details>
<summary><b>Q: What is the difference between SSH and HTTPS for Git?</b></summary>

**A:**
- **SSH:** Uses a key pair (public + private). Once set up, no password/token needed. More secure.
- **HTTPS:** Uses a username + token. Simpler to set up but you need to manage tokens.

Both work fine. SSH is preferred for daily development.

</details>

<details>
<summary><b>Q: Can I use the same SSH key for multiple GitHub accounts?</b></summary>

**A:** No — GitHub only allows each SSH key to be added to one account. If you have multiple accounts (personal + work), generate separate keys and configure SSH to use the right one for each:

```bash
# ~/.ssh/config
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
```

</details>

<details>
<summary><b>Q: Is my private key ever sent to GitHub?</b></summary>

**A:** **No, never.** Your private key stays on your machine. Only the public key is uploaded to GitHub. During authentication, a mathematical challenge-response happens — your private key proves you own the public key without ever being transmitted.

</details>

<details>
<summary><b>Q: What is <code>known_hosts</code>?</b></summary>

**A:** `~/.ssh/known_hosts` stores the fingerprints of servers you've connected to. The first time you connect to GitHub via SSH, you'll see:
```
The authenticity of host 'github.com' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no)?
```

Type `yes`. This saves GitHub's fingerprint so SSH can verify it's really GitHub next time (not an impersonator).

</details>

---

## Exercises

**Exercise 1: Generate an SSH key**

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
ls -la ~/.ssh/
cat ~/.ssh/id_ed25519.pub
```

<details>
<summary><b>What should you see?</b></summary>

```bash
ls -la ~/.ssh/
# -rw-------  1 you you  411 Jan 15 10:00 id_ed25519       ← private (600 permissions)
# -rw-r--r--  1 you you   97 Jan 15 10:00 id_ed25519.pub   ← public

cat ~/.ssh/id_ed25519.pub
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGx... your.email@example.com
```

Note: The private key has `600` permissions (only you can read it). This is required — SSH refuses to use keys with looser permissions.

</details>

---

**Exercise 2: Add key to GitHub and test**

1. Copy your public key (`cat ~/.ssh/id_ed25519.pub`)
2. Go to [github.com/settings/keys](https://github.com/settings/keys) → **New SSH Key**
3. Paste and save
4. Test:

```bash
ssh -T git@github.com
```

<details>
<summary><b>Expected output</b></summary>

```
Hi your-username! You've been successfully authenticated, but GitHub
does not provide shell access.
```

If you see this, SSH authentication is working. You can now push/pull without passwords.

</details>

---

**Exercise 3: Push a repo via SSH**

```bash
mkdir -p /tmp/ssh-test
cd /tmp/ssh-test
git init
echo "# SSH Test" > README.md
git add .
git commit -m "test: verify SSH push"

# Create repo on GitHub (requires gh CLI):
gh repo create ssh-test --public --source=. --remote=origin --push

# Or manually:
# 1. Create repo on github.com
# 2. git remote add origin git@github.com:your-username/ssh-test.git
# 3. git push -u origin main
```

<details>
<summary><b>How to verify</b></summary>

Visit `https://github.com/your-username/ssh-test` — you should see your README.md. The push happened over SSH with no password prompt.

Clean up:
```bash
gh repo delete ssh-test --yes   # delete the test repo
rm -rf /tmp/ssh-test
```

</details>

---

**Exercise 4: Check and switch remote URL**

```bash
# For any existing repo:
cd ~/your-existing-repo
git remote -v
```

If it shows `https://`, switch to SSH:

```bash
git remote set-url origin git@github.com:username/repo.git
git remote -v    # should now show git@github.com:
```

<details>
<summary><b>Why switch?</b></summary>

With HTTPS, you need a token/password for every push. With SSH, authentication is handled by your key pair automatically. One `set-url` command switches permanently for that repo.

</details>

---

**Exercise 5: MCQ**

**Q1:** Which file do you upload to GitHub?

- A) `~/.ssh/id_ed25519` (private key)
- B) `~/.ssh/id_ed25519.pub` (public key)
- C) `~/.ssh/known_hosts`
- D) `~/.ssh/config`

<details>
<summary><b>Answer</b></summary>

**B** — You upload the **public key** (`.pub` file) to GitHub. The private key stays on your machine and should never be shared with anyone.

</details>

---

**Q2:** You run `ssh -T git@github.com` and get "Permission denied (publickey)." What is the most likely cause?

- A) GitHub is down
- B) Your public key isn't added to GitHub, or the SSH agent doesn't have your key
- C) You need to install Git
- D) Your internet connection is slow

<details>
<summary><b>Answer</b></summary>

**B** — Either:
- Your public key isn't on GitHub (add it at github.com/settings/keys)
- The SSH agent doesn't have your key loaded (run `ssh-add ~/.ssh/id_ed25519`)

</details>

---

**Q3:** What is the SSH URL format for cloning a GitHub repo?

- A) `https://github.com/user/repo.git`
- B) `ssh://github.com/user/repo`
- C) `git@github.com:user/repo.git`
- D) `github.com:user/repo`

<details>
<summary><b>Answer</b></summary>

**C** — The SSH URL for GitHub is `git@github.com:user/repo.git`. Note the colon `:` between `github.com` and `user`, not a slash.

</details>

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

