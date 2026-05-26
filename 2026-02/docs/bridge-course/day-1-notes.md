# Day 1 — Setup Day: Complete Notes
### TDS Bridge Bootcamp

> **Goal of Day 1:** Before you write a single line of data science code, you need a working environment you *understand*. This day is not just "install stuff" — it is about building a mental model of where your files live, how your computer runs programs, and why things fail when they do.

---

## Table of Contents

1. [Linux vs Windows — The Mental Model](#1-linux-vs-windows--the-mental-model)
2. [What is WSL2 and How Does it Work](#2-what-is-wsl2-and-how-does-it-work)
3. [Filesystem Anatomy — Where Everything Lives](#3-filesystem-anatomy--where-everything-lives)
4. [The Terminal and the Shell](#4-the-terminal-and-the-shell)
5. [PATH and Environment Variables](#5-path-and-environment-variables)
6. [Installing Your Environment](#6-installing-your-environment)
7. [Verifying Your Setup](#7-verifying-your-setup)
8. [Day 1 Final Checklist](#day-1-final-checklist)

---

## 1. Linux vs Windows — The Mental Model

### 1.1 Why This Matters

Most Python tutorials assume you just "open a terminal and type." But if you are on Windows, there are **two completely different worlds** on your machine: the Windows world and the Linux world (via WSL2). Confusing them is the #1 source of beginner pain.

Even if you are on native Ubuntu, understanding the contrast helps you read documentation, Stack Overflow answers, and error messages correctly.

---

### 1.2 Paths: How Files Are Addressed

A **path** is the address of a file or folder on disk.

#### Windows paths
```
C:\Users\yourname\Documents\project\data.csv
```
- Starts with a **drive letter** (`C:`, `D:`)
- Uses **backslash** `\` as separator
- `C:` is your main drive; `D:` might be an external drive

#### Linux paths
```
/home/yourname/project/data.csv
```
- Starts with `/` — this is called the **root**
- Uses **forward slash** `/` as separator
- There are **no drive letters**. Everything hangs off `/`

#### Quick comparison table

| Concept | Windows | Linux |
|---|---|---|
| Root | `C:\` | `/` |
| Your home folder | `C:\Users\yourname` | `/home/yourname` |
| Separator | `\` | `/` |
| Temp folder | `C:\Windows\Temp` | `/tmp` |

#### In Python, this bites you like this:

```python
# BAD: Windows-only, will crash on Linux
open("C:\\Users\\yourname\\data.csv")

# GOOD: works everywhere
from pathlib import Path
open(Path.home() / "project" / "data.csv")
```

> **Rule:** Always use `pathlib.Path` in Python. Never hardcode `\` or `C:\` in your code.

---

### 1.3 Case Sensitivity

This is subtle but breaks things constantly.

```bash
# On Linux — these are THREE DIFFERENT FILES
data.csv
Data.csv
DATA.CSV
```

```
# On Windows — these all refer to the SAME file
data.csv
Data.csv
DATA.CSV
```

**Why it matters:**
- You write `import MyModule` on Windows → works.
- Your teammate on Linux runs the same code with `mymodule.py` saved → `ModuleNotFoundError`.
- You push a file named `README.MD` → GitHub shows it, but Linux scripts looking for `README.md` fail.

**Rule:** Always use **lowercase filenames** with hyphens or underscores. `my-data.csv`, `train_model.py`. Never `MyData.CSV`.

---

### 1.4 Line Endings (LF vs CRLF)

Every time you press Enter, a character is inserted in the file. But Windows and Linux disagree on which character.

| System | Line ending | Bytes |
|---|---|---|
| Linux / macOS | `LF` (Line Feed) | `\n` |
| Windows | `CRLF` (Carriage Return + Line Feed) | `\r\n` |

**What goes wrong:**

```bash
# A shell script written on Windows, opened on Linux:
#!/bin/bash
echo "hello"
# Error: /bin/bash^M: bad interpreter
# The ^M is the invisible \r Windows added
```

```python
# Reading a Windows file on Linux
line = "hello\r\n"
line.strip()  # → "hello"  ← strip() saves you here
# But if you don't strip:
if line == "hello\n":  # → False! Because \r is still there
    ...
```

**How to fix:**

```bash
# Convert Windows file to Linux line endings
sed -i 's/\r//' yourfile.sh

# Or use the dos2unix tool
dos2unix yourfile.sh
```

**Git's role:** Git can auto-convert line endings. This is controlled by `core.autocrlf`. On Linux, set it to `input`:

```bash
git config --global core.autocrlf input
```

---

### 1.5 File Permissions

Linux has a permission system Windows does not have in the same way.

```bash
ls -la
# -rwxr-xr-x  1 yourname  staff  1234  Jan 1  script.sh
#  ^^^------
#  |||
#  ||└── others: r-x (read, execute, no write)
#  |└─── group:  r-x
#  └──── owner:  rwx (read, write, execute)
```

Three types of permission: **r**ead, **w**rite, e**x**ecute.  
Three types of users: **owner**, **group**, **others**.

**The one you'll hit on Day 1:**

```bash
# You download a script and try to run it
./setup.sh
# bash: ./setup.sh: Permission denied

# Fix: make it executable
chmod +x setup.sh
./setup.sh  # works now
```

---

### ✅ Section 1 Summary

| Concept | Key takeaway |
|---|---|
| Paths | Linux uses `/`, no drive letters. Windows uses `C:\` and `\` |
| Case sensitivity | Linux cares. Windows does not. Always use lowercase filenames |
| Line endings | Windows = `\r\n`, Linux = `\n`. Git and `dos2unix` fix this |
| Permissions | Linux files need execute permission (`chmod +x`) to run as scripts |

---

### 📝 Section 1 — Questions

**MCQ 1.1**
What is the Linux equivalent of `C:\Users\alice\`?

- A) `C:/Users/alice/`
- B) `/Users/alice/`
- C) `/home/alice/`
- D) `~/Users/alice/`

> ✅ **Answer: C**
> `JS validation: check input === 'C' or input.toLowerCase().includes('/home/alice')`

---

**MCQ 1.2**
You save a file as `Report.csv` on Windows and push it to GitHub. Your teammate on Linux runs a script that opens `report.csv`. What happens?

- A) It works fine, Linux ignores case
- B) `FileNotFoundError` — Linux treats them as different files
- C) Git automatically renames the file
- D) Python's `open()` is case-insensitive

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**MCQ 1.3**
Which line ending does Linux use?

- A) `\r\n` (CRLF)
- B) `\n` (LF)
- C) `\r` (CR)
- D) None — Linux doesn't use line endings

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**Hands-on 1.A — Path Translation**
Convert this Windows path to its Linux equivalent:
`C:\Users\john\projects\tds\data.csv`

Expected answer: `/home/john/projects/tds/data.csv`

> `JS validation: normalize input → strip whitespace, lowercase → check === '/home/john/projects/tds/data.csv'`
> Accept also: `~/projects/tds/data.csv` as correct (with a note that ~ = /home/john)

---

**Hands-on 1.B — Permission fix**
You downloaded a file `run.sh`. What single command makes it executable?

Expected answer: `chmod +x run.sh`

> `JS validation: trim, check input === 'chmod +x run.sh'`

---

## 2. What is WSL2 and How Does it Work

### 2.1 The Big Picture

**WSL2** stands for **Windows Subsystem for Linux, version 2**. It lets you run a real Linux kernel inside Windows without a separate machine or full virtual machine setup.

Think of it like this:

```
┌─────────────────────────────────────────────┐
│              Your Windows Machine           │
│                                             │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Windows World │  │   Linux World   │  │
│  │                 │  │  (WSL2 / Ubuntu)│  │
│  │  Chrome, Word,  │  │  bash, python,  │  │
│  │  File Explorer  │  │  git, uv, vim   │  │
│  │                 │  │                 │  │
│  │  C:\Users\you\  │  │  /home/you/     │  │
│  └─────────────────┘  └─────────────────┘  │
│           ↑                    ↑            │
│           └────────────────────┘            │
│           They can talk to each other       │
└─────────────────────────────────────────────┘
```

WSL2 runs a **real Linux kernel** in a lightweight virtual machine managed by Windows. It is not emulation — it is actual Linux.

---

### 2.2 WSL1 vs WSL2 — Why Version Matters

You will see both mentioned online. Always use **WSL2**.

| Feature | WSL1 | WSL2 |
|---|---|---|
| Linux kernel | Translated (fake) | Real Linux kernel |
| File I/O speed | Fast for Windows files | Fast for Linux files |
| Full syscall support | No | Yes |
| Docker support | Limited | Full |
| Recommended | No | **Yes** |

---

### 2.3 Two Filesystems, One Machine

This is the most confusing part for beginners. WSL2 has **its own filesystem**, separate from Windows.

```
Windows filesystem:       C:\Users\you\Desktop\
                          C:\Users\you\Documents\

WSL2 Linux filesystem:    /home/you/
                          /etc/
                          /tmp/
```

They are **separate storage spaces**. But you can cross between them:

**From Linux, accessing Windows files:**
```bash
# Your Windows C: drive is mounted inside Linux at:
ls /mnt/c/Users/yourname/Documents/
```

**From Windows, accessing Linux files:**
Open File Explorer → type `\\wsl$\Ubuntu\home\yourname\` in the address bar.

---

### 2.4 The Golden Rule of WSL2

> **Keep your project files in the Linux filesystem (`/home/you/`), not on `/mnt/c/`.**

Why?

```bash
# Accessing files inside Linux (/home/you/) → FAST
# Accessing files through /mnt/c/... → UP TO 10x SLOWER

# This also causes permission issues:
# /mnt/c/ files may appear as executable even when they shouldn't be,
# and git sometimes can't track permission changes correctly.
```

**Practical rule:**
```bash
# Good: clone your repos here
cd ~
git clone https://github.com/you/tds-bootcamp.git

# Bad: working here causes slowness and weird issues
cd /mnt/c/Users/you/Documents/
git clone ...
```

---

### 2.5 Starting WSL2

Multiple ways to open a Linux terminal on Windows:

```
Option A: Start menu → search "Ubuntu" → click it
Option B: Windows Terminal → click the ▾ dropdown → Ubuntu
Option C: In VS Code → open terminal → select Ubuntu (WSL) profile
Option D: From PowerShell/CMD: type `wsl` and press Enter
```

Confirm you are inside WSL (not PowerShell):
```bash
uname -a
# Linux DESKTOP-XXX 5.15.x ... #1 SMP ... x86_64 x86_64 x86_64 GNU/Linux
#       ^^^ this means Linux kernel is running

# If you see something like:
# Windows PowerShell ... → you are NOT in WSL
```

---

### 2.6 For Native Ubuntu Users

If you are on native Ubuntu (not Windows), everything in this section still applies to you — except there is no WSL layer. Your Linux **is** your machine. You don't have `/mnt/c/` and you don't need to worry about the two-filesystem split.

Just use your home directory: `~` or `/home/yourname/`.

---

### ✅ Section 2 Summary

| Concept | Key takeaway |
|---|---|
| WSL2 | A real Linux kernel running inside Windows |
| Two filesystems | Windows (`C:\`) and Linux (`/home/you/`) are separate |
| `/mnt/c/` | Your Windows C: drive, accessible from Linux but slow |
| Golden rule | Keep all project files in `/home/you/`, not `/mnt/c/` |
| Checking you're in WSL | Run `uname -a` — should say Linux |

---

### 📝 Section 2 — Questions

**MCQ 2.1**
Where should you store your TDS project files when using WSL2?

- A) `C:\Users\you\projects\`
- B) `/mnt/c/Users/you/projects/`
- C) `/home/you/projects/`
- D) Anywhere is fine, there's no difference

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**MCQ 2.2**
How do you access your Windows `C:` drive from inside WSL2?

- A) It's not possible
- B) `cd /windows/c/`
- C) `cd /mnt/c/`
- D) `cd C:/`

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**MCQ 2.3**
You run `uname -a` in your terminal and see `Microsoft Windows...`. What does this mean?

- A) You are correctly inside WSL2
- B) You are in PowerShell/CMD, not in Linux
- C) WSL2 is installed correctly
- D) Your Linux kernel version is shown

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**Hands-on 2.A**
Open your WSL2/Ubuntu terminal and run `uname -a`. Paste just the first word of the output.

Expected answer: `Linux`

> `JS validation: trim, check input.toLowerCase() === 'linux'`

---

**Hands-on 2.B**
What is the full path to your Windows Documents folder as seen from inside WSL2?
(Replace `yourname` with your actual Windows username)

Expected pattern: `/mnt/c/Users/<name>/Documents`

> `JS validation: check input.startsWith('/mnt/c/Users/') && input.endsWith('/Documents')`

---

## 3. Filesystem Anatomy — Where Everything Lives

### 3.1 The Root and Its Children

Everything on Linux starts from `/`. Below it are standard directories that every Linux system has:

```
/
├── home/         ← user home directories
│   └── alice/    ← your personal space (also written as ~)
├── etc/          ← system configuration files
├── usr/          ← installed programs and libraries
│   ├── bin/      ← most command-line programs live here
│   └── lib/      ← shared libraries
├── bin/          ← essential system commands
├── tmp/          ← temporary files (deleted on reboot)
├── var/          ← logs, databases, variable data
│   └── log/      ← system log files
├── opt/          ← optional/third-party software
├── root/         ← home directory of the root (admin) user
├── proc/         ← virtual filesystem — info about running processes
├── dev/          ← device files (disks, terminals, etc.)
└── mnt/          ← mount points (e.g., /mnt/c for WSL Windows drive)
```

---

### 3.2 Your Home Directory — `~`

Your home directory is **your space**. You own it. You can create, delete, and modify anything here without needing admin rights.

```bash
# ~ is a shortcut for /home/yourname
cd ~
pwd
# /home/alice

# These are all identical:
cd ~
cd $HOME
cd /home/alice
```

**What lives in your home by default:**
```bash
ls -la ~
# .bashrc       ← bash config (runs every terminal open)
# .bash_profile ← login config (runs once at login)
# .gitconfig    ← your git settings
# .ssh/         ← your SSH keys
# .local/       ← user-installed programs
```

Files and folders starting with `.` are **hidden**. `ls` won't show them. Use `ls -a` or `ls -la` to see them.

---

### 3.3 `/etc` — Configuration

```bash
ls /etc
# hostname       ← your machine's name
# hosts          ← local DNS entries (IP to name mappings)
# passwd         ← list of all users (not passwords, confusingly)
# fstab          ← filesystems to mount at boot
# apt/           ← apt package manager config
```

You will rarely edit `/etc` directly. But you will **read** things from here when debugging.

```bash
# Check your machine's name:
cat /etc/hostname

# Check known hosts:
cat /etc/hosts
# 127.0.0.1   localhost
# ...
```

---

### 3.4 `/tmp` — Temporary Files

```bash
# /tmp is wiped on every reboot
# Safe to put throwaway files here
echo "test" > /tmp/test.txt
cat /tmp/test.txt
# test

# After reboot — gone
```

Useful for: download something you only need once, quick scratch files, testing.

---

### 3.5 `/usr/bin` and `/bin` — Where Programs Live

```bash
# When you type "python3", where does it come from?
which python3
# /usr/bin/python3

# When you type "ls":
which ls
# /usr/bin/ls

# List some programs:
ls /usr/bin/ | head -20
```

When you install a program (`sudo apt install something`), its executable usually lands in `/usr/bin/` or `/usr/local/bin/`.

---

### 3.6 `/var/log` — Logs

```bash
ls /var/log/
# syslog     ← general system log
# auth.log   ← login attempts
# apt/       ← package installation history

# Read last 20 lines of system log:
tail -20 /var/log/syslog
```

---

### 3.7 Absolute vs Relative Paths

This trips up almost everyone at some point.

**Absolute path** — starts from root `/`, always correct regardless of where you are:
```bash
/home/alice/projects/tds/data.csv   # always means the same file
```

**Relative path** — relative to your **current directory**:
```bash
# If you are in /home/alice/projects/
tds/data.csv           # means /home/alice/projects/tds/data.csv

# If you are in /home/alice/
projects/tds/data.csv  # same file, different relative path

# Special relative paths:
.       # current directory
..      # parent directory
../..   # grandparent directory
```

**Example:**
```bash
pwd
# /home/alice/projects

ls tds/          # relative — looks inside /home/alice/projects/tds/
ls /home/alice/  # absolute — always looks at /home/alice/

cd ..            # go up one level → /home/alice/
cd ../..         # go up two levels → /home/
```

---

### 3.8 `~` and `$HOME`

```bash
# ~ always expands to your home directory
echo ~
# /home/alice

# $HOME is an environment variable that holds the same thing
echo $HOME
# /home/alice

# Useful:
cd ~/projects      # go to /home/alice/projects
cp data.csv ~/backup/   # copy to your home's backup folder
```

---

### ✅ Section 3 Summary

| Directory | Purpose |
|---|---|
| `/` | Root of everything |
| `/home/you` or `~` | Your personal space — you own this |
| `/etc` | System config files |
| `/tmp` | Temp files, wiped on reboot |
| `/usr/bin` | Where installed programs live |
| `/var/log` | System and app log files |
| `/mnt` | Mount points (WSL: Windows drives here) |

| Path type | Example | Notes |
|---|---|---|
| Absolute | `/home/alice/data.csv` | Always works, unambiguous |
| Relative | `data.csv` or `../data.csv` | Depends on `pwd` |
| Home shortcut | `~/data.csv` | Same as `/home/alice/data.csv` |

---

### 📝 Section 3 — Questions

**MCQ 3.1**
Where does `apt install` usually place new program executables?

- A) `/home/you/bin/`
- B) `/tmp/`
- C) `/usr/bin/` or `/usr/local/bin/`
- D) `/etc/programs/`

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**MCQ 3.2**
You are currently in `/home/alice/projects/`. What does `cd ../..` do?

- A) Goes to `/home/alice/projects/../../`
- B) Goes to `/home/`
- C) Goes to `/`
- D) Error — you can't use `../..`

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**MCQ 3.3**
Which of these is an absolute path?

- A) `../data/file.csv`
- B) `data/file.csv`
- C) `./file.csv`
- D) `/home/alice/data/file.csv`

> ✅ **Answer: D**
> `JS validation: check input === 'D'`

---

**MCQ 3.4**
`/tmp` is a good place to store your TDS project repo. True or False?

- A) True
- B) False — `/tmp` is wiped on reboot

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**Hands-on 3.A**
Run `echo $HOME` in your terminal. What does it print?

Expected: `/home/<yourname>` (native Linux) or `/home/<yourname>` (WSL)

> `JS validation: check input.startsWith('/home/') → show "Correct! Your home is <input>"`
> `If input === '/root' → warn "You may be running as root — not recommended"`

---

**Hands-on 3.B**
You are in `/home/alice/projects/tds/week1/`. Write the relative path to reach `/home/alice/data.csv`.

Expected answer: `../../../data.csv` or `../../data.csv` (from week1/ → tds/ → projects/ → alice/ → data.csv... wait let's compute: week1 → tds → projects → home is 3 levels up... so `../../../data.csv` is wrong — home/alice/data.csv, from home/alice/projects/tds/week1/ we go: ../../../ = home/alice/ so `../../../data.csv`)

Expected: `../../../data.csv`

> `JS validation: trim, check input === '../../../data.csv'`

---

**Hands-on 3.C**
Using `which`, find where `git` is installed on your system. What is the full path?

Expected: `/usr/bin/git`

> `JS validation: trim, check input === '/usr/bin/git'`
> `Accept also /usr/local/bin/git with a note that both are valid`

---

## 4. The Terminal and the Shell

### 4.1 Terminal vs Shell — These Are Different Things

People use these words interchangeably but they are not the same.

```
┌─────────────────────────────────────┐
│           Terminal (emulator)       │  ← the window you see
│                                     │     handles: colors, fonts,
│  $ █                                │     keyboard input, scrollback
│                                     │
│    ↑ this is the prompt              │
│    rendered by the terminal          │
└─────────────────────────────────────┘
         │ sends keystrokes to
         ▼
┌─────────────────────────────────────┐
│              Shell                  │  ← the program running inside
│                                     │     interprets commands,
│   bash / zsh / sh / fish           │     manages variables,
│                                     │     runs other programs
└─────────────────────────────────────┘
```

**Terminal examples:** GNOME Terminal, Windows Terminal, iTerm2, VS Code integrated terminal  
**Shell examples:** bash, zsh, sh, fish, dash

You can run any shell inside any terminal. The shell is what actually interprets what you type.

---

### 4.2 bash — The Most Common Shell

`bash` = **B**ourne **A**gain **SH**ell. Default on most Ubuntu systems.

```bash
# Check which shell you are using:
echo $SHELL
# /bin/bash    ← you're using bash

# Or:
echo $0
# bash
```

`zsh` is the default on macOS and is also popular on Linux. Most things work the same between bash and zsh. When they differ, notes will say so.

---

### 4.3 The Prompt

```bash
alice@DESKTOP-ABC:~/projects$
^^^^^  ^^^^^^^^^^^  ^^^^^^^^ ^
|      |            |        └── $ means normal user
|      |            └─────────── current directory (~ = home)
|      └──────────────────────── machine name (hostname)
└─────────────────────────────── your username
```

If you see `#` instead of `$` at the end — you are running as **root** (admin). Be careful.

```bash
root@DESKTOP-ABC:/# 
                  ^── root prompt — dangerous, be careful
```

---

### 4.4 Running a Command

When you type a command and press Enter, here is what happens:

```
1. Shell reads what you typed: "python3 script.py"
2. Shell splits into: program = "python3", argument = "script.py"
3. Shell looks for "python3" in PATH (more on this in Section 5)
4. Shell finds it at /usr/bin/python3
5. Shell launches /usr/bin/python3 with argument "script.py"
6. python3 runs and exits
7. Shell shows the prompt again
```

---

### 4.5 Exit Codes

Every command exits with a number. **0 = success**. Anything else = some kind of failure.

```bash
ls /home/alice/
echo $?    # $? holds the exit code of the LAST command
# 0        ← success

ls /does/not/exist
# ls: cannot access '/does/not/exist': No such file or directory
echo $?
# 2        ← failure

python3 -c "import sys; sys.exit(42)"
echo $?
# 42
```

**Why this matters for TDS:**
- CI/CD pipelines check exit codes to know if tests passed
- Shell scripts use exit codes to chain commands conditionally
- `make`, `pytest`, `git` all use exit codes

```bash
# Run command, and ONLY run the next one if the first succeeds:
pytest tests/ && echo "All tests passed!"

# Run command, and ONLY run the next if the first FAILS:
pytest tests/ || echo "Tests failed, check above"
```

---

### 4.6 stdin, stdout, stderr — The Three Streams

Every running program has three standard channels:

```
             ┌──────────────┐
  stdin  ───▶│   Program    │───▶ stdout  (normal output)
  (input)    │              │───▶ stderr  (errors/warnings)
             └──────────────┘
```

```bash
# stdout: what you normally see
echo "hello"          # goes to stdout
ls /home/             # goes to stdout

# stderr: errors go here (separate channel)
ls /does/not/exist    # error message goes to stderr

# Redirect stdout to a file:
ls /home/ > output.txt      # stdout → file (overwrites)
ls /home/ >> output.txt     # stdout → file (appends)

# Redirect stderr to a file:
ls /does/not/exist 2> errors.txt

# Redirect both stdout and stderr:
python3 script.py > output.txt 2>&1

# Throw stderr away (silence errors):
ls /does/not/exist 2>/dev/null
```

---

### 4.7 Pipes — Connecting Programs

The `|` (pipe) connects the **stdout of one program** to the **stdin of the next**.

```bash
# Without pipe: two separate steps
ls /usr/bin/ > temp.txt
wc -l temp.txt
rm temp.txt

# With pipe: one step, no temp file
ls /usr/bin/ | wc -l
# 1234

# Chain multiple pipes:
cat /var/log/syslog | grep "error" | wc -l
# How many error lines in the system log?

# More complex pipeline:
cat words.txt | tr '[:upper:]' '[:lower:]' | sort | uniq -c | sort -rn | head -10
# Top 10 most frequent words (case-insensitive)
```

---

### 4.8 Useful Shell Shortcuts

These will save you hours:

```bash
# Tab completion — start typing, press Tab
cd ~/pro<Tab>          # completes to ~/projects/ if it exists
git che<Tab>           # completes to git checkout

# History — press Up arrow to scroll through previous commands
# Or search history:
Ctrl+R                 # reverse search — type part of a command

# Move cursor quickly:
Ctrl+A                 # jump to beginning of line
Ctrl+E                 # jump to end of line
Ctrl+W                 # delete last word
Ctrl+C                 # kill (cancel) the current running command
Ctrl+D                 # exit the shell (EOF)
Ctrl+L                 # clear the screen

# Run last command again:
!!                     # repeats last command
sudo !!                # run last command with sudo (very useful)
```

---

### ✅ Section 4 Summary

| Concept | Key takeaway |
|---|---|
| Terminal vs Shell | Terminal = window; Shell = interpreter (bash/zsh) |
| Prompt | `$` = normal user, `#` = root (be careful) |
| Exit code | `0` = success, non-zero = failure; check with `$?` |
| stdin/stdout/stderr | 3 streams; redirect with `>`, `2>`, `2>&1` |
| Pipes `\|` | Chain commands; stdout of left → stdin of right |
| Shortcuts | Tab, Ctrl+R, Ctrl+C, Ctrl+A/E save huge amounts of time |

---

### 📝 Section 4 — Questions

**MCQ 4.1**
After running a command, you check `echo $?` and see `0`. What does this mean?

- A) The command produced no output
- B) The command succeeded
- C) The command is still running
- D) There was an error

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**MCQ 4.2**
What does `ls /home/ 2>/dev/null` do with error messages?

- A) Prints them to the terminal in red
- B) Saves them to a file called `/dev/null` for later
- C) Discards them silently
- D) Sends them to stdout

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**MCQ 4.3**
You type `python3 script.py > output.txt`. Where does `stderr` (error messages) go?

- A) Into `output.txt`
- B) Still prints to the terminal
- C) Gets discarded
- D) Into a file called `error.txt`

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**MCQ 4.4**
What does `cat log.txt | grep ERROR | wc -l` count?

- A) Total lines in log.txt
- B) Number of files in the directory
- C) Number of lines containing the word ERROR
- D) Number of unique words

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**Hands-on 4.A**
Run a command that will deliberately fail (e.g., `ls /does/not/exist`), then immediately run `echo $?`. What number do you see?

Expected: any non-zero number (commonly `2`)

> `JS validation: parseInt(input) !== 0 → Correct (non-zero means failure)`
> `If input === '0' → Wrong, your command may have succeeded`

---

**Hands-on 4.B**
Write a single pipeline command that:
1. Lists all files in `/usr/bin/`
2. Filters lines containing the word `python`
3. Counts how many there are

Expected command: `ls /usr/bin/ | grep python | wc -l`

> `JS validation: check input contains '|' and 'grep' and 'wc' → structurally valid`
> `Accept variations like ls /usr/bin | grep python | wc -l`

---

**Hands-on 4.C**
What keyboard shortcut cancels a running command (e.g., a stuck program)?

Expected: `Ctrl+C`

> `JS validation: normalize → check input.toLowerCase().includes('ctrl') && input.toLowerCase().includes('c')`

---

## 5. PATH and Environment Variables

### 5.1 What is PATH?

When you type `python3`, your shell does not magically know where Python is. It searches through a list of directories called **PATH**.

```bash
# See your current PATH:
echo $PATH
# /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/alice/.local/bin
#  ^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^
#   each directory separated by colons
```

The shell looks in each directory **left to right** and runs the **first match** it finds.

```bash
# Which python3 does the shell find first?
which python3
# /usr/bin/python3

# This means /usr/bin/ is in PATH, and python3 lives there
```

---

### 5.2 Why PATH Errors Happen

```bash
# You install something but it's not in PATH
./my-tool --version
# bash: my-tool: command not found

# Reason: my-tool is installed at /home/alice/.local/bin/my-tool
# but /home/alice/.local/bin/ is NOT in PATH

# Fix option 1: call it by full path
/home/alice/.local/bin/my-tool --version

# Fix option 2: add the directory to PATH
export PATH="$HOME/.local/bin:$PATH"
my-tool --version   # works now
```

---

### 5.3 Making PATH Changes Permanent

`export PATH=...` in the terminal only lasts for **that session**. To make it permanent:

```bash
# Open your shell config file:
nano ~/.bashrc       # for bash
# or
nano ~/.zshrc        # for zsh

# Add this line at the bottom:
export PATH="$HOME/.local/bin:$PATH"

# Save and exit (Ctrl+O, Enter, Ctrl+X in nano)

# Apply changes to current session:
source ~/.bashrc
```

---

### 5.4 Environment Variables

PATH is just one **environment variable**. There are many others. They are key-value pairs that affect how programs behave.

```bash
# See ALL environment variables:
env
# or:
printenv

# See a specific one:
echo $HOME       # /home/alice
echo $USER       # alice
echo $SHELL      # /bin/bash
echo $PWD        # current directory
echo $LANG       # en_US.UTF-8

# Set a variable for this session:
export MY_KEY="secret123"
echo $MY_KEY
# secret123

# Set for a single command only (doesn't persist):
MY_VAR=hello python3 -c "import os; print(os.environ['MY_VAR'])"
# hello
```

**Why this matters for TDS:**
```bash
# APIs use environment variables for secrets
export OPENAI_API_KEY="sk-..."
# Python reads it:
import os
key = os.environ["OPENAI_API_KEY"]

# NEVER hardcode secrets in your code. Always use env vars.
```

---

### 5.5 `.bashrc` vs `.bash_profile` vs `.profile`

This confuses many people:

| File | When it runs | Use it for |
|---|---|---|
| `~/.bashrc` | Every new **interactive** terminal | Aliases, PATH, functions |
| `~/.bash_profile` | **Login** shells only (SSH, console login) | Environment setup |
| `~/.profile` | Login shells, for non-bash shells too | Cross-shell compatibility |

**Simple rule for Day 1:** Put your PATH additions in `~/.bashrc`. On most Ubuntu setups, `.bash_profile` sources `.bashrc` anyway.

```bash
# Check what's in your .bashrc:
cat ~/.bashrc
```

---

### 5.6 `which`, `type`, `whereis`

```bash
# which: find the first match in PATH
which python3
# /usr/bin/python3

# type: also tells you if it's a shell builtin or alias
type ls
# ls is aliased to `ls --color=auto`

type cd
# cd is a shell builtin   ← not a program, built into bash

# whereis: finds binary + man page + source
whereis git
# git: /usr/bin/git /usr/share/man/man1/git.1.gz
```

---

### ✅ Section 5 Summary

| Concept | Key takeaway |
|---|---|
| PATH | Colon-separated list of dirs the shell searches for programs |
| `command not found` | Usually means the program's dir is not in PATH |
| `export PATH=...` | Temporary — add to `~/.bashrc` to persist |
| Env vars | Key-value pairs. Use for config, secrets, customization |
| `$HOME`, `$USER`, `$SHELL` | Common built-in env vars |
| `which` | Shows which program would run for a given name |

---

### 📝 Section 5 — Questions

**MCQ 5.1**
You type `myapp` and get `command not found`. The program is at `/opt/myapp/bin/myapp`. What is the most correct fix?

- A) Copy `myapp` to `/tmp/`
- B) Add `export PATH="/opt/myapp/bin:$PATH"` to `~/.bashrc`
- C) Rename the file to something shorter
- D) Run `sudo myapp` instead

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**MCQ 5.2**
You run `export MY_VAR=hello` in one terminal, then open a new terminal and run `echo $MY_VAR`. What do you see?

- A) `hello`
- B) Empty — env vars set with `export` only last the session
- C) An error
- D) `MY_VAR`

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**MCQ 5.3**
Where should API keys like `OPENAI_API_KEY` be stored?

- A) Hardcoded in your Python file
- B) In a comment in your Git repo
- C) As environment variables, ideally in a `.env` file not committed to Git
- D) In `/etc/passwd`

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**Hands-on 5.A**
Run `echo $PATH` and count how many directories are listed. Paste the count.

> `JS validation: ask student to count — accept any number 4–15 as likely correct`
> `Feedback: "Great — your PATH has X directories. The shell searches them left to right."`

---

**Hands-on 5.B**
Run `which git`. What is the full path output?

Expected: `/usr/bin/git`

> `JS validation: trim, check input.endsWith('/git') && input.startsWith('/')`

---

**Hands-on 5.C**
Run this command and paste the output:
```bash
python3 -c "import os; print(os.environ.get('HOME', 'not set'))"
```

Expected: `/home/<yourname>`

> `JS validation: check input.startsWith('/home/') or input.startsWith('/root')`

---

## 6. Installing Your Environment

### 6.1 Overview of What You Need

By end of Day 1, you need these four things working:

| Tool | What it does | Check command |
|---|---|---|
| Git | Version control | `git --version` |
| Python 3.11+ | Runtime | `python3 --version` |
| uv | Python package/env manager | `uv --version` |
| VS Code | Editor with WSL support | `code --version` |

---

### 6.2 Path A — Native Ubuntu

If you are on Ubuntu (20.04, 22.04, or 24.04 LTS), follow this path.

#### Step 1: Update package list

```bash
sudo apt update
sudo apt upgrade -y
```

> `sudo` = run as superuser (admin). It will ask for your password.

#### Step 2: Install Git

```bash
sudo apt install git -y
git --version
# git version 2.x.x
```

#### Step 3: Install Python

Ubuntu usually ships with Python 3. Check:

```bash
python3 --version
# Python 3.x.x

# If not installed:
sudo apt install python3 python3-pip -y
```

#### Step 4: Install uv

`uv` is a fast Python package and project manager. It replaces pip + venv + pyenv for most tasks.

```bash
# Official installer:
curl -LsSf https://astral.sh/uv/install.sh | sh

# After install, restart your terminal or:
source ~/.bashrc

# Verify:
uv --version
# uv 0.x.x
```

> **What `curl ... | sh` does:** Downloads an install script and runs it. This is the standard way to install many developer tools. If you are security-conscious, you can `curl` the script to a file first, inspect it, then run it.

#### Step 5: Install VS Code

```bash
# Install via snap (simplest on Ubuntu):
sudo snap install code --classic

# Or download .deb from: https://code.visualstudio.com/download

code --version
# 1.xx.x
```

---

### 6.3 Path B — Windows + WSL2

#### Step 1: Enable WSL2

Open **PowerShell as Administrator** (right-click → Run as Administrator):

```powershell
wsl --install
```

This installs WSL2 and Ubuntu. **Restart your computer** when prompted.

If Ubuntu doesn't install automatically:

```powershell
wsl --install -d Ubuntu
```

After restart, Ubuntu opens and asks you to create a username and password. Do it — this is your Linux user, separate from your Windows user.

#### Step 2: Open Ubuntu

- Start Menu → search "Ubuntu" → click
- Or Windows Terminal → open Ubuntu tab

#### Step 3: Update Ubuntu

```bash
sudo apt update && sudo apt upgrade -y
```

#### Step 4: Install Git and Python

```bash
sudo apt install git python3 python3-pip -y
```

#### Step 5: Install uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
uv --version
```

#### Step 6: Install VS Code on Windows

Download from: https://code.visualstudio.com

Then install the **WSL extension** in VS Code:
1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search "WSL"
4. Install "WSL" by Microsoft

#### Step 7: Open VS Code connected to WSL

In your Ubuntu terminal:
```bash
cd ~
code .
```

VS Code opens. Bottom-left corner shows: `WSL: Ubuntu` — this means VS Code is fully connected to your Linux environment.

---

### 6.4 Configure Git (Everyone Does This)

After installing Git, tell it who you are. This information appears in every commit you make.

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Set default branch name to 'main' (modern standard):
git config --global init.defaultBranch main

# Set VS Code as default editor for git:
git config --global core.editor "code --wait"

# Fix line endings (important on WSL):
git config --global core.autocrlf input

# Verify all settings:
git config --list
```

These settings are stored in `~/.gitconfig`:
```bash
cat ~/.gitconfig
# [user]
#     name = Your Name
#     email = your@email.com
# [core]
#     autocrlf = input
#     editor = code --wait
```

---

### 6.5 Install VS Code Extensions

Extensions make VS Code work well for Python and data science. Open VS Code and install these (search in Extensions panel `Ctrl+Shift+X`):

| Extension | Publisher | Why |
|---|---|---|
| Python | Microsoft | Core Python support |
| Pylance | Microsoft | Type checking, autocomplete |
| Jupyter | Microsoft | Run `.ipynb` notebooks |
| WSL | Microsoft | WSL integration (Windows only) |
| GitLens | GitKraken | Richer Git info inline |

Or install from terminal:
```bash
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension ms-toolsai.jupyter
```

---

### 6.6 Understanding `uv` Before Using It

`uv` is the tool you will use every day in TDS for Python project management. Understand what it replaces:

| Old way | uv equivalent |
|---|---|
| `pip install requests` | `uv add requests` |
| `python -m venv .venv` | `uv venv` (or automatic) |
| `pip freeze > requirements.txt` | `uv lock` (creates `uv.lock`) |
| `pip install -r requirements.txt` | `uv sync` |
| `pyenv install 3.11` | `uv python install 3.11` |

**Creating a new project with uv:**
```bash
# Create project:
uv init my-project
cd my-project

# See what was created:
ls -la
# pyproject.toml   ← project metadata and dependencies
# .python-version  ← which Python version to use
# hello.py         ← sample script

# Add a dependency:
uv add requests

# Run a script:
uv run hello.py

# Open a Python shell with the project environment:
uv run python3
```

**Why not just use pip?**
```bash
# pip problem: global installs collide
pip install requests   # installs globally
pip install httpx      # installs globally
# Project A needs requests==2.28, Project B needs requests==2.31 → conflict

# uv solution: every project is isolated
cd project-a && uv add "requests==2.28"
cd project-b && uv add "requests==2.31"
# No conflict — each project has its own environment
```

---

### ✅ Section 6 Summary

| Step | Command to verify |
|---|---|
| Git installed | `git --version` |
| Python installed | `python3 --version` |
| uv installed | `uv --version` |
| VS Code installed | `code --version` |
| Git configured | `git config --list` |
| VS Code extensions | Check Extensions panel |

---

### 📝 Section 6 — Questions

**MCQ 6.1**
What does `uv sync` do?

- A) Syncs your Git repository with GitHub
- B) Installs all dependencies listed in the lockfile into the project environment
- C) Updates uv to the latest version
- D) Runs all Python scripts in the project

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**MCQ 6.2**
You clone a colleague's project that uses uv. What is the first command to run to get all dependencies installed?

- A) `pip install -r requirements.txt`
- B) `python setup.py install`
- C) `uv sync`
- D) `npm install`

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**MCQ 6.3**
`sudo apt update` does what?

- A) Installs all available updates
- B) Updates the list of available packages and their versions
- C) Upgrades the operating system version
- D) Updates sudo itself

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**Hands-on 6.A — Version Check**
Run all four version commands and paste the output of `uv --version`.

Expected format: `uv 0.x.x` (any version starting with `uv`)

> `JS validation: trim, check input.toLowerCase().startsWith('uv ')`

---

**Hands-on 6.B — Git Config Check**
Run `git config user.email`. Paste the output.

Expected: any valid email string

> `JS validation: check input.includes('@') && input.includes('.') → looks like an email`
> `If empty → "You haven't configured git yet. Run: git config --global user.email 'you@email.com'"`

---

**Hands-on 6.C — Create your first uv project**
Run:
```bash
cd ~
uv init tds-test
cd tds-test
ls
```
What files are listed?

Expected: `pyproject.toml` should be in the list

> `JS validation: check input.includes('pyproject.toml')`

---

## 7. Verifying Your Setup

### 7.1 The Verification Script

Run each command below. Every line should produce output without errors. This is your Day 1 verification.

```bash
#!/bin/bash
# Day 1 Verification — run each line and check the output

echo "=== System ==="
uname -a                         # should say Linux

echo ""
echo "=== Git ==="
git --version                    # git version 2.x.x
git config user.name             # your name
git config user.email            # your email

echo ""
echo "=== Python ==="
python3 --version                # Python 3.x.x (should be 3.10+)
python3 -c "import sys; print('Python OK:', sys.version)"

echo ""
echo "=== uv ==="
uv --version                     # uv 0.x.x

echo ""
echo "=== VS Code ==="
code --version                   # 1.xx.x (may not work inside WSL terminal)

echo ""
echo "=== Paths ==="
echo "Home: $HOME"               # /home/yourname
echo "Shell: $SHELL"             # /bin/bash or /bin/zsh
echo "User: $USER"               # yourname
echo "PWD: $PWD"                 # current directory

echo ""
echo "=== uv project test ==="
cd /tmp
uv init verify-test 2>&1
cd verify-test
uv add requests 2>&1 | tail -1
uv run python3 -c "import requests; print('requests version:', requests.__version__)"
cd ..
rm -rf /tmp/verify-test
echo "uv project test: PASSED"

echo ""
echo "=== All checks done ==="
```

Save this as `~/verify-day0.sh`, make it executable, and run it:

```bash
chmod +x ~/verify-day0.sh
~/verify-day0.sh
```

---

### 7.2 Common Problems and Fixes

**`python3: command not found`**
```bash
sudo apt install python3 -y
```

**`uv: command not found` (after installing)**
```bash
# uv install script adds to PATH in .bashrc
# Either restart terminal or:
source ~/.bashrc
# If still not found:
export PATH="$HOME/.local/bin:$PATH"
source ~/.bashrc
```

**`code: command not found` (in WSL)**
```bash
# VS Code needs to be installed on Windows, then:
# 1. Install WSL extension in VS Code (Windows side)
# 2. Then from WSL terminal: code .
# The 'code' command is injected by the WSL extension
```

**`Permission denied` when running a script**
```bash
chmod +x yourscript.sh
```

**`git push` asks for username/password and fails**
```bash
# GitHub no longer accepts passwords for push
# You need either SSH key or Personal Access Token (PAT)
# We cover this in detail on Day 4
# For now, just clone with HTTPS and don't push yet
```

**VS Code opens but says "Not connected to WSL"**
```bash
# From your Ubuntu terminal (not PowerShell):
cd ~
code .
# VS Code should show "WSL: Ubuntu" in bottom-left
```

**Slow file operations in `/mnt/c/`**
```bash
# Move your project files to Linux filesystem:
cp -r /mnt/c/Users/you/project ~/project
cd ~/project
# Now work from here
```

---

### 7.3 Your Day 1 Project Structure

After Day 1, your working directory should look like this:

```
~/tds-bootcamp/
└── day-1/
    ├── README.md          ← your environment checklist
    └── verify-day1.sh     ← the verification script
```

Create it:
```bash
mkdir -p ~/tds-bootcamp/day-1
cd ~/tds-bootcamp/day-1
```

Your `day-1/README.md` should contain:
```markdown
# Day 1 — Environment Setup

## My Setup
- OS: Ubuntu 22.04 / WSL2 Ubuntu 22.04 (pick one)
- Machine: [your machine description]

## Verified Versions
- Git: [output of git --version]
- Python: [output of python3 --version]
- uv: [output of uv --version]
- VS Code: [output of code --version]

## Where My Files Live
- Linux home: /home/[yourname]/
- Project folder: /home/[yourname]/tds-bootcamp/

## One Problem I Hit and How I Fixed It
[Write something here even if "none" — the habit of documenting is important]
```

---

### ✅ Section 7 Summary

| Check | Expected output |
|---|---|
| `uname -a` | Contains "Linux" |
| `git --version` | `git version 2.x.x` |
| `git config user.email` | Your email address |
| `python3 --version` | `Python 3.10+` |
| `uv --version` | `uv 0.x.x` |
| `code --version` | `1.xx.x` |

---

### 📝 Section 7 — Final Hands-on Exercises

**Hands-on 7.A — Full verification output**
Run `python3 --version` and paste the full output.

Expected: starts with `Python 3.`

> `JS validation: trim, check input.startsWith('Python 3.')`
> `If 'Python 2.' → warn "You're running Python 2 — install Python 3"`

---

**Hands-on 7.B — Create project structure**
Create the folder `~/tds-bootcamp/day-1/`. Then run `ls ~/tds-bootcamp/` and paste the output.

Expected: `day-1`

> `JS validation: trim, check input.includes('day-1')`

---

**Hands-on 7.C — uv project**
Inside `~/tds-bootcamp/day-1/`, run:
```bash
uv init hello-day1
cd hello-day1
uv add rich
uv run python3 -c "from rich import print; print('[bold green]Day 1 complete![/bold green]')"
```
What does the last command print (without formatting)?

Expected: `Day 1 complete!`

> `JS validation: trim input, check input.toLowerCase().includes('day 1 complete')`

---

## Day 1 Final Checklist

Go through each item. Check it off only when you can do it **from memory**, not by looking at notes.

### Environment
- [ ] I know the difference between Windows filesystem and Linux filesystem
- [ ] I know where my project files should live (hint: `~/`)
- [ ] My terminal shows a `$` prompt (not `#`, not PowerShell)
- [ ] VS Code bottom-left shows `WSL: Ubuntu` (if on Windows)

### Tools
- [ ] `git --version` works
- [ ] `git config user.name` and `git config user.email` return my info
- [ ] `python3 --version` shows 3.10 or newer
- [ ] `uv --version` works
- [ ] `code --version` works (or `code .` opens VS Code from terminal)

### Concepts
- [ ] I can explain why `/home/you/` is better than `/mnt/c/` for project files
- [ ] I know what `$PATH` is and what `command not found` means
- [ ] I know what exit code `0` means vs non-zero
- [ ] I know the difference between absolute and relative paths
- [ ] I know what `~` expands to

### First steps done
- [ ] `~/tds-bootcamp/day-1/README.md` is created with my version info
- [ ] `verify-day1.sh` ran successfully with no errors

---

## Quick Reference — Day 1 Commands

```bash
# Navigation
pwd                         # where am I?
ls -la                      # list files including hidden
cd ~                        # go home
cd -                        # go back to previous directory

# System info
uname -a                    # OS and kernel info
echo $HOME                  # home directory
echo $SHELL                 # which shell
echo $PATH                  # program search directories
which <program>             # where is this program?

# Environment
export VAR=value            # set env variable (this session)
echo $VAR                   # read env variable
env                         # list all env variables

# Files
cat file.txt                # print file contents
head -5 file.txt            # first 5 lines
tail -10 file.txt           # last 10 lines
grep "word" file.txt        # find lines containing word
wc -l file.txt              # count lines

# Permissions
chmod +x script.sh          # make script executable
ls -la                      # see permissions

# Pipes and redirection
cmd | cmd2                  # pipe stdout to next command
cmd > file.txt              # redirect stdout to file
cmd >> file.txt             # append stdout to file
cmd 2> err.txt              # redirect stderr to file
cmd 2>/dev/null             # discard stderr
echo $?                     # last exit code

# Package management
sudo apt update             # refresh package list
sudo apt install pkg -y     # install package

# uv
uv init my-project          # create new project
uv add package              # add dependency
uv run script.py            # run script in project env
uv sync                     # install all dependencies from lockfile
```

---

*End of Day 1 Notes — Next up: Day 2 — Linux & Shell Essentials*

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

