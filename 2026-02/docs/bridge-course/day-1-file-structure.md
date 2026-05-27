# Day 1 — File Structure: Windows vs Linux

> **Goal:** Understand how files are organized on Linux vs Windows so you never get confused about "where my file went" or "why can't Python find my data."

---

## The Big Picture

On **Windows**, your files live under drive letters:
```
C:\Users\alice\Documents\project\data.csv
D:\backup\photos\
```

On **Linux**, everything starts from a single root `/`:
```
/home/alice/projects/data.csv
/tmp/scratch.txt
```

There are **no drive letters** on Linux. Every file on the entire system hangs off `/`.

### 🧠 Knowledge Check

**Q1:** In Linux, what is the equivalent of the `C:\` drive in Windows?

- A) `/home/`
- B) `/` (root)
- C) `~`
- D) `/drive/c/`

<details>
<summary><b>Answer</b></summary>

**B** — Everything in Linux starts from the single root directory `/`.

</details>

---

## Linux Directory Tree — What Lives Where

```
/                        ← root: the top of everything
├── home/                ← all user home directories
│   ├── alice/           ← Alice's personal files (also written as ~)
│   └── bob/             ← Bob's personal files
├── etc/                 ← system configuration files
├── usr/                 ← installed software
│   ├── bin/             ← most programs you run (python3, git, ls)
│   └── lib/             ← shared libraries
├── bin/                 ← essential system commands
├── tmp/                 ← temporary files (wiped on reboot!)
├── var/                 ← variable data (logs, databases)
│   └── log/             ← system logs
├── opt/                 ← optional third-party software
├── root/                ← home directory of the root (admin) user
├── proc/                ← virtual: info about running processes
├── dev/                 ← device files (disks, terminals)
└── mnt/                 ← mount points (WSL: Windows drives here)
    └── c/               ← (WSL only) your Windows C: drive
```

---

## Key Directories You Should Know

### `/home/yourname` (a.k.a. `~`)

This is **your space**. You own everything here. No `sudo` needed.

```bash
# These are all the same:
cd ~
cd $HOME
cd /home/yourname

# Check:
echo $HOME
# /home/alice
```

**What you'll find in your home:**
```bash
ls -la ~
# .bashrc         ← your shell config (runs every time you open a terminal)
# .gitconfig      ← your git settings
# .ssh/           ← your SSH keys (for GitHub, servers)
# .local/         ← user-installed programs (uv lives here)
```

> **Important:** Files starting with `.` are **hidden**. Use `ls -a` to see them.

### `/tmp` — Temporary Files

```bash
# Anything here is deleted when you reboot
echo "scratch work" > /tmp/notes.txt
# After reboot → gone
```

**Use it for:** throwaway downloads, test files, temporary processing.
**Never use it for:** your actual project files!

### `/usr/bin` — Where Programs Live

```bash
which python3     # /usr/bin/python3
which git         # /usr/bin/git
which ls          # /usr/bin/ls
```

When you install a program with `sudo apt install`, its executable usually ends up here.

### `/etc` — System Configuration

```bash
cat /etc/hostname     # your machine's name
cat /etc/hosts        # local DNS (IP-to-name mappings)
cat /etc/passwd       # list of all users (not actual passwords!)
```

You'll rarely edit these, but you'll **read** them when debugging.

### 🧠 Knowledge Check

**Q1:** Where do your personal files live on Linux?

- A) `/tmp`
- B) `/usr/bin`
- C) `/home/yourname` (or `~`)
- D) `/etc`

<details>
<summary><b>Answer</b></summary>

**C** — `/home/yourname` is your personal space where you have full permissions. It is also represented by `~`.

</details>

**Q2:** Why should you avoid storing project files in `/tmp`?

- A) Because they are public to everyone on the internet
- B) Because `/tmp` is strictly for system configuration files
- C) Because files in `/tmp` are deleted automatically when the system reboots
- D) Because `/tmp` limits file size to 1MB

<details>
<summary><b>Answer</b></summary>

**C** — The `/tmp` directory is meant for short-lived temporary files and is wiped clean upon reboot.

</details>

---

## Windows vs Linux — Side by Side

| Concept | Windows | Linux |
|---|---|---|
| Root of filesystem | `C:\` | `/` |
| Your home folder | `C:\Users\alice` | `/home/alice` or `~` |
| Path separator | `\` (backslash) | `/` (forward slash) |
| Temp folder | `C:\Windows\Temp` | `/tmp` |
| Programs folder | `C:\Program Files\` | `/usr/bin/` |
| Config files | Registry / AppData | `/etc/` and `~/.config/` |
| Hidden files | Set via attribute | Name starts with `.` |

---

## WSL2: Two Filesystems on One Machine

If you are on Windows using WSL2, there are **two separate filesystems**:

```
Windows filesystem:      C:\Users\alice\Documents\
Linux filesystem:        /home/alice/projects/
```

They can see each other:

```bash
# From Linux → access Windows files:
ls /mnt/c/Users/alice/Documents/

# From Windows → access Linux files:
# Open File Explorer → type \\wsl$\Ubuntu\home\alice\ in address bar
```

> **⚠️ Golden Rule:** Keep your project files in `/home/you/`, NOT in `/mnt/c/`. Working across the filesystem boundary (`/mnt/c/`) is **up to 10x slower** and causes permission headaches.

### 🧠 Knowledge Check

**Q1:** You are using WSL2. Where is the best place to create your new Python project?

- A) `C:\Users\YourName\Documents\project`
- B) `/mnt/c/Users/YourName/projects`
- C) `/home/yourname/projects`
- D) `/tmp/projects`

<details>
<summary><b>Answer</b></summary>

**C** — For optimal performance and to avoid permission issues, keep your WSL files inside the Linux filesystem (`/home/yourname/`).

</details>

---

## Case Sensitivity — A Silent Bug Factory

```bash
# On Linux, these are THREE different files:
data.csv
Data.csv
DATA.CSV

# On Windows, they are all THE SAME file!
```

**Why this bites you:**
- You name a Python module `MyUtils.py` on Windows → works fine.
- Push to GitHub → your teammate on Linux does `import myutils` → `ModuleNotFoundError`.

**Rule:** Always use **lowercase** with hyphens or underscores: `my-data.csv`, `train_model.py`.

---

## Line Endings — LF vs CRLF

When you press Enter in a file:
- **Linux** inserts `\n` (LF = Line Feed)
- **Windows** inserts `\r\n` (CRLF = Carriage Return + Line Feed)

**What goes wrong:**
```bash
# A script written on Windows, run on Linux:
./setup.sh
# /bin/bash^M: bad interpreter
# The ^M is the invisible \r that Windows added
```

**Fix:**
```bash
# Convert Windows line endings to Linux:
sed -i 's/\r//' setup.sh

# Or use dos2unix:
sudo apt install dos2unix -y
dos2unix setup.sh
```

**Prevent it with Git:**
```bash
git config --global core.autocrlf input
# This tells Git: convert CRLF → LF on commit, keep LF on checkout
```

---

## File Permissions

Linux has a permission system that Windows doesn't have:

```bash
ls -la
# -rwxr-xr-x  1 alice alice 1234 Jan 1 script.sh
#  |||
#  ||└── others can: read + execute
#  |└─── group can: read + execute  
#  └──── owner can: read + write + execute
```

Three permissions: **r**ead, **w**rite, e**x**ecute.
Three levels: **owner**, **group**, **others**.

**The one you will hit:**
```bash
./my-script.sh
# Permission denied

# Fix:
chmod +x my-script.sh
./my-script.sh   # works now
```

---

## Q&A

<details>
<summary><b>Q: What does the <code>~</code> symbol mean?</b></summary>

**A:** `~` is a shortcut for your home directory. If your username is `alice`, then `~` = `/home/alice`. You can use it anywhere:
```bash
cd ~/projects        # same as cd /home/alice/projects
ls ~/.ssh            # same as ls /home/alice/.ssh
```

</details>

<details>
<summary><b>Q: Why does Linux not have drive letters like C: and D:?</b></summary>

**A:** Linux uses a single tree structure rooted at `/`. External drives and partitions are **mounted** at specific points in the tree (e.g., `/mnt/usb`, `/media/alice/external`). This is more flexible — you can mount any storage anywhere in the tree.

</details>

<details>
<summary><b>Q: If I delete a file in /tmp, is it really gone?</b></summary>

**A:** Yes. There is no Recycle Bin on Linux (by default). When you `rm` a file, it's gone. `/tmp` additionally gets cleared on every reboot — so don't store important work there.

</details>

<details>
<summary><b>Q: How do I know if I'm inside WSL or regular Windows?</b></summary>

**A:** Run `uname -a`. If you see `Linux` and `microsoft`, you are inside WSL. If you see nothing or a Windows reference, you are in PowerShell/CMD.

</details>

---

## Exercises

**Exercise 1: Explore the filesystem**

Run each command and note what it shows:

```bash
ls /
ls /home/
ls -la ~
cat /etc/hostname
```

<details>
<summary><b>What should I see? (click to reveal)</b></summary>

- `ls /` → shows top-level directories: `home`, `etc`, `usr`, `tmp`, `var`, `bin`, etc.
- `ls /home/` → shows your username (and any other users on the system).
- `ls -la ~` → shows hidden files like `.bashrc`, `.gitconfig`, `.ssh/`.
- `cat /etc/hostname` → shows your machine's name (e.g., `DESKTOP-ABC` on WSL).

</details>

---

**Exercise 2: Find where programs live**

```bash
which python3
which git
which ls
which uv
```

<details>
<summary><b>Expected output</b></summary>

```
/usr/bin/python3
/usr/bin/git
/usr/bin/ls
/home/yourname/.local/bin/uv
```

Notice: system tools are in `/usr/bin/`, but `uv` (installed per-user) is in `~/.local/bin/`.

</details>

---

**Exercise 3: Case sensitivity test**

```bash
cd /tmp
touch test.txt Test.txt TEST.TXT
ls test* Test* TEST*
```

<details>
<summary><b>How many files were created?</b></summary>

**On Linux:** 3 files — `test.txt`, `Test.txt`, `TEST.TXT` are all different.

**On Windows (if you tried there):** Only 1 file — they all point to the same file.

Clean up:
```bash
rm /tmp/test.txt /tmp/Test.txt /tmp/TEST.TXT
```

</details>

---

**Exercise 4: Line endings**

```bash
# Create a file with Windows-style line endings:
printf "line1\r\nline2\r\nline3\r\n" > /tmp/windows-file.txt

# Check for \r characters:
cat -v /tmp/windows-file.txt
# You should see ^M at the end of each line

# Fix it:
sed -i 's/\r//' /tmp/windows-file.txt
cat -v /tmp/windows-file.txt
# No more ^M
```

<details>
<summary><b>What is <code>cat -v</code>?</b></summary>

`cat -v` shows **non-printable characters** visually. The `\r` (carriage return) shows up as `^M`. After running `sed`, the `^M` should disappear.

</details>

---

**Exercise 5: MCQ practice**

**Q1:** What is the Linux equivalent of `C:\Users\bob\Desktop\`?

- A) `/Users/bob/Desktop/`
- B) `/home/bob/Desktop/`
- C) `C:/Users/bob/Desktop/`
- D) `/mnt/bob/Desktop/`

<details>
<summary><b>Answer</b></summary>

**B** — Linux home directories are under `/home/username/`.

</details>

---

**Q2:** You save a file as `Config.yaml` on Windows and push to GitHub. Your teammate on Linux opens `config.yaml`. What happens?

- A) Works fine
- B) `FileNotFoundError` — Linux sees them as different files
- C) Git renames it automatically
- D) The file opens but is empty

<details>
<summary><b>Answer</b></summary>

**B** — Linux is case-sensitive. `Config.yaml` ≠ `config.yaml`.

</details>

---

**Q3:** Where should WSL2 project files live for best performance?

- A) `C:\Users\you\projects\`
- B) `/mnt/c/Users/you/projects/`
- C) `/home/you/projects/`
- D) `/tmp/projects/`

<details>
<summary><b>Answer</b></summary>

**C** — The Linux filesystem (`/home/you/`) is fast. `/mnt/c/` crosses the filesystem boundary and is up to 10x slower.

</details>

---

