# Day 2 — Terminal Navigation

> **Goal:** Move around the Linux filesystem with confidence using `pwd`, `ls`, `cd`, and `tree` — so you never feel lost in the terminal.

---

## Where Am I? — `pwd`

The first command to learn. Run it whenever you are lost:

```bash
pwd
# /home/alice/projects/tds
```

`pwd` = **P**rint **W**orking **D**irectory. It tells you the absolute path of where your terminal is right now.

> Every command you run operates relative to this location. If you run `ls`, it lists what's in this directory. If you run `python3 script.py`, it looks for `script.py` here.

---

## What Is Here? — `ls`

`ls` shows you what's in a directory. You will use this hundreds of times a day.

### Basic usage

```bash
ls                    # list files in current directory
ls /home/alice/       # list files in a specific directory
ls ~/projects/        # list files in home/projects
```

### Essential flags

```bash
ls -l                 # long format: permissions, size, date
ls -a                 # show hidden files (starting with .)
ls -la                # both — the most useful combo
ls -lh                # human-readable sizes (KB, MB, GB)
ls -lt                # sort by modification time (newest first)
ls -lS                # sort by file size (largest first)
ls -R                 # recursive — list subdirectories too
```

### Reading `ls -la` output

```bash
ls -la
# drwxr-xr-x  4 alice alice 4096 Jan 15 10:23 .
# drwxr-xr-x 12 alice alice 4096 Jan 15 09:00 ..
# -rw-r--r--  1 alice alice  234 Jan 15 10:23 README.md
# -rwxr-xr-x  1 alice alice  891 Jan 14 18:45 run.sh
# drwxr-xr-x  2 alice alice 4096 Jan 14 15:30 data
```

Breaking down a line:

```
-rw-r--r--  1  alice  alice  234  Jan 15 10:23  README.md
│             │      │       │    │              │
│             owner  group   size  date          filename
│
└─ permissions:
   - = regular file (d = directory, l = symlink)
   rw- = owner can read+write
   r-- = group can read
   r-- = others can read
```

### Glob patterns with `ls`

```bash
ls *.py               # all Python files
ls data_*.csv         # files starting with "data_" ending in ".csv"
ls -la *.md           # long listing of all Markdown files
```

### 🧠 Knowledge Check

**Q1:** What does the command `ls -la` do?

- A) Lists only hidden files
- B) Lists all files (including hidden ones) in a long format showing permissions and size
- C) Lists files sorted by size
- D) Lists directories only

<details>
<summary><b>Answer</b></summary>

**B** — `-l` stands for long format, and `-a` stands for all (including hidden `.dotfiles`).

</details>

---

## Move Around — `cd`

`cd` = **C**hange **D**irectory. This is how you navigate.

```bash
# Absolute path
cd /home/alice/projects

# Relative path
cd projects           # goes into projects/ from current dir
cd data/raw/          # goes into nested directories

# Go UP
cd ..                 # parent directory (one level up)
cd ../..              # grandparent (two levels up)

# Go HOME
cd ~                  # home directory
cd                    # same as cd ~ (no argument)
cd $HOME              # same thing using env variable

# Go BACK to previous location
cd -                  # toggle between current and previous
```

### `cd -` — The back button

This is incredibly useful:

```bash
cd ~/projects/tds/week1/data/
# do some work...
cd /etc/
# check something...
cd -
# /home/alice/projects/tds/week1/data/  ← back where you were!
```

---

## See the Tree — `tree`

`tree` shows a visual representation of your directory structure. It's not always installed by default:

```bash
# Install it:
sudo apt install tree -y
```

### Usage

```bash
tree                  # full tree from current directory
tree -L 2             # limit depth to 2 levels
tree -a               # include hidden files
tree -d               # directories only (no files)
tree -sh              # show file sizes in human-readable format
tree ~/projects/      # tree of a specific path
```

### Example output

```bash
tree -L 2
# .
# ├── day-1
# │   └── README.md
# ├── day-2
# │   ├── data
# │   ├── outputs
# │   └── scripts
# └── README.md
```

### Save tree output to a file

```bash
tree -L 2 > structure.txt
cat structure.txt
```

### 🧠 Knowledge Check

**Q1:** Why is it recommended to use the `-L` flag with `tree`?

- A) To list files alphabetically
- B) To show long file properties
- C) To limit the depth of the directory tree displayed, preventing the terminal from being flooded with thousands of lines
- D) To display only symlinks

<details>
<summary><b>Answer</b></summary>

**C** — The `-L` flag (Level) restricts how deep `tree` goes, which is crucial in large directories.

</details>

---

## Creating Directories — `mkdir`

```bash
mkdir mydir                           # create a directory
mkdir -p a/b/c/d                      # create nested directories
mkdir -p project/{src,tests,docs}     # create multiple at once
```

The `-p` flag is essential:
- Creates parent directories as needed
- Doesn't error if the directory already exists

### Brace expansion for multiple directories

```bash
mkdir -p ~/tds-bootcamp/{day-1,day-2,day-3,day-4,day-5}
# Creates all five day directories in one command

mkdir -p ~/tds-bootcamp/day-2/{data,outputs,scripts}
# Creates three subdirectories inside day-2
```

---

## Putting It All Together

Here's a typical navigation workflow:

```bash
# 1. Start at home
cd ~
pwd                    # /home/alice

# 2. Create a workspace
mkdir -p ~/tds/bootcamp/day-2
cd ~/tds/bootcamp/day-2
pwd                    # /home/alice/tds/bootcamp/day-2

# 3. See what's here
ls -la                 # nothing yet (empty directory)

# 4. Create some structure
mkdir -p data scripts outputs
ls                     # data  outputs  scripts

# 5. Verify with tree
tree ..                # shows day-2 structure from parent
```

---

## Q&A

<details>
<summary><b>Q: What happens if I type <code>cd</code> with no arguments?</b></summary>

**A:** It takes you to your home directory (`~`). Same as `cd ~` or `cd $HOME`.

</details>

<details>
<summary><b>Q: What is the difference between <code>ls</code> and <code>ls -a</code>?</b></summary>

**A:** `ls` hides files starting with `.` (dotfiles). `ls -a` shows everything, including hidden files like `.bashrc`, `.gitconfig`, `.ssh/`. These hidden files are typically configuration files.

</details>

<details>
<summary><b>Q: Can I use <code>tree</code> on large directories?</b></summary>

**A:** Yes, but always use `-L` to limit depth. Running `tree /` without limits will flood your terminal with thousands of lines. `tree -L 2` is a safe starting point.

</details>

<details>
<summary><b>Q: What does <code>.</code> and <code>..</code> mean in <code>ls -la</code> output?</b></summary>

**A:**
- `.` = the current directory itself
- `..` = the parent directory

Every directory contains these two entries. They are how `cd .` (stay here) and `cd ..` (go up) work.

</details>

---

## Exercises

**Exercise 1: Navigate and report**

```bash
cd /usr/bin
pwd
ls | wc -l       # How many programs are installed?
cd ~
pwd
```

<details>
<summary><b>What did you find?</b></summary>

- `pwd` after `cd /usr/bin` → `/usr/bin`
- `ls | wc -l` → likely 1000+ programs (varies by system)
- `pwd` after `cd ~` → `/home/yourname`

This shows `/usr/bin` contains hundreds/thousands of programs that came with your system.

</details>

---

**Exercise 2: Create and explore**

```bash
mkdir -p ~/nav-practice/{alpha,beta,gamma}/{data,logs}
tree ~/nav-practice/ -L 2
```

Now navigate using only relative paths:

```bash
cd ~/nav-practice/alpha/data
pwd                              # should be /home/you/nav-practice/alpha/data
cd ../../beta/logs
pwd                              # should be /home/you/nav-practice/beta/logs
cd ../../gamma
pwd                              # should be /home/you/nav-practice/gamma
```

<details>
<summary><b>Check your answers</b></summary>

1. After `cd ~/nav-practice/alpha/data` → `/home/you/nav-practice/alpha/data` ✓
2. After `cd ../../beta/logs` → from `alpha/data`, up 2 = `nav-practice/`, then into `beta/logs` ✓
3. After `cd ../../gamma` → from `beta/logs`, up 2 = `nav-practice/`, then into `gamma` ✓

Clean up:
```bash
rm -r ~/nav-practice
```

</details>

---

**Exercise 3: MCQ**

**Q1:** What does `cd -` do?

- A) Goes to the root directory
- B) Goes to the home directory
- C) Goes to the previous directory you were in
- D) Goes up one level

<details>
<summary><b>Answer</b></summary>

**C** — `cd -` toggles between your current directory and the last directory you were in. Like a "back" button.

</details>

---

**Q2:** You run `ls -la` and see a line starting with `d`. What does the `d` mean?

- A) The file has been deleted
- B) It is a directory
- C) It is a device file
- D) It is a dotfile

<details>
<summary><b>Answer</b></summary>

**B** — `d` at the start means it's a directory. `-` means regular file, `l` means symlink.

</details>

---

**Q3:** What command creates `/home/alice/a/b/c/` when only `/home/alice/` exists?

- A) `mkdir /home/alice/a/b/c/`
- B) `mkdir -r /home/alice/a/b/c/`
- C) `mkdir -p /home/alice/a/b/c/`
- D) `touch /home/alice/a/b/c/`

<details>
<summary><b>Answer</b></summary>

**C** — The `-p` flag creates parent directories as needed. Without `-p`, `mkdir` would fail because `a/` and `b/` don't exist yet.

</details>
