# Day 1 — Path Reading

> **Goal:** Master absolute paths, relative paths, and special shortcuts (`~`, `.`, `..`) so you can always tell the system exactly where a file is — or figure out where you are.

---

## What Is a Path?

A **path** is the address of a file or folder on your system. Just like a street address tells you where a building is, a path tells the computer where to find a file.

```bash
/home/alice/projects/tds/data.csv
```

This path says: start at root (`/`), go into `home`, then `alice`, then `projects`, then `tds`, and there you'll find `data.csv`.

---

## Two Types of Paths

### 1. Absolute Path — The Full Address

An absolute path starts from the **root** `/` and gives the complete location.

```bash
/home/alice/projects/tds/data.csv
/etc/hosts
/usr/bin/python3
/tmp/scratch.txt
```

**Key feature:** An absolute path means the same thing no matter where you currently are. It's like a full postal address — works from anywhere in the world.

### 2. Relative Path — Directions from Here

A relative path starts from your **current directory** (where you are right now).

```bash
# If you are in /home/alice/projects/
tds/data.csv              # means /home/alice/projects/tds/data.csv
./tds/data.csv            # same thing (./ = current directory)
../alice/projects/        # go up one level, then back down
```

**Key feature:** A relative path changes meaning depending on where you are. It's like saying "turn left, then right" — only works from a specific starting point.

### 🧠 Knowledge Check

**Q1:** Which of the following is an **absolute** path?

- A) `../data.csv`
- B) `src/main.py`
- C) `/home/alice/data.csv`
- D) `./script.sh`

<details>
<summary><b>Answer</b></summary>

**C** — It starts with the root `/`, so it gives the complete location from the top of the filesystem.

</details>

**Q2:** When should you use a relative path?

- A) When you want a path that works from any directory on the computer
- B) When referring to a file in the same directory or a directory nearby, without writing out the full system path
- C) Whenever you are using Python
- D) When referring to system files in `/etc`

<details>
<summary><b>Answer</b></summary>

**B** — Relative paths are convenient for keeping paths short when working within a project folder, as they are relative to your current working directory.

</details>

---

## Special Path Symbols

| Symbol | Meaning | Example |
|---|---|---|
| `/` | Root of the filesystem | `ls /` |
| `~` | Your home directory | `cd ~` = `cd /home/yourname` |
| `.` | Current directory | `./script.sh` = run script in current dir |
| `..` | Parent directory (one level up) | `cd ..` = go up |
| `-` | Previous directory (with `cd`) | `cd -` = go back to where you were |

---

## Walking Through Examples

### Starting position

```bash
pwd
# /home/alice/projects/tds/week1
```

### Going UP with `..`

```bash
cd ..
pwd
# /home/alice/projects/tds

cd ../..
pwd
# /home/alice/projects
# (went up TWO levels from tds → projects)
```

### Going DOWN with folder names

```bash
cd tds/week1
pwd
# /home/alice/projects/tds/week1
```

### Combining UP and DOWN

```bash
# From /home/alice/projects/tds/week1
# Go to /home/alice/projects/tds/week2
cd ../week2
pwd
# /home/alice/projects/tds/week2
```

### Using `~` to jump home

```bash
# From anywhere:
cd ~/projects
pwd
# /home/alice/projects
```

---

## The `pwd` Command — "Where Am I?"

When you are lost, always run:

```bash
pwd
# /home/alice/projects/tds/week1
```

`pwd` = **P**rint **W**orking **D**irectory. It shows your current absolute path.

### 🧠 Knowledge Check

**Q1:** You just opened a new terminal. You aren't sure what folder you are in. What command do you type?

- A) `whereami`
- B) `pwd`
- C) `cd`
- D) `ls`

<details>
<summary><b>Answer</b></summary>

**B** — `pwd` (Print Working Directory) outputs the absolute path of your current location.

</details>

---

## Path Reading — A Skill You'll Use Constantly

Every time you see a command like:

```bash
python3 src/main.py
```

Ask yourself:
1. Where am I right now? (`pwd`)
2. Is `src/main.py` relative or absolute?
3. What is the full path?

If you're in `/home/alice/project/`, then `src/main.py` means `/home/alice/project/src/main.py`.

---

## Paths in Python

Python also works with paths. Always use `pathlib` for cross-platform safety:

```python
from pathlib import Path

# Current directory
here = Path(".")
print(here.resolve())  # shows absolute path

# Home directory
home = Path.home()
print(home)  # /home/alice

# Build paths safely (works on Windows AND Linux)
data_file = Path.home() / "projects" / "tds" / "data.csv"
print(data_file)  # /home/alice/projects/tds/data.csv
```

> **Never do this in Python:**
> ```python
> open("C:\\Users\\alice\\data.csv")  # Windows-only, breaks on Linux
> ```
> **Always do this:**
> ```python
> from pathlib import Path
> open(Path.home() / "data.csv")     # works everywhere
> ```

### 🧠 Knowledge Check

**Q1:** Why is using `pathlib` in Python better than hardcoding paths as strings like `"C:\\data\\file.txt"`?

- A) Because strings are slow in Python
- B) Because `pathlib` automatically downloads missing files
- C) Because `pathlib` makes your code cross-platform, handling Windows and Linux path separators correctly
- D) Because `pathlib` is required for reading CSV files

<details>
<summary><b>Answer</b></summary>

**C** — Hardcoding backslashes (`\`) makes your code Windows-only. `pathlib` ensures your code works across Linux, macOS, and Windows without modification.

</details>

---

## Q&A

<details>
<summary><b>Q: How do I tell if a path is absolute or relative?</b></summary>

**A:** If it starts with `/` (or `~` which expands to an absolute path), it's absolute. If it starts with anything else (a folder name, `.`, `..`), it's relative.

```bash
/home/alice/data.csv    # absolute (starts with /)
~/data.csv              # absolute (~ expands to /home/alice)
data.csv                # relative
./data.csv              # relative (same as above)
../data.csv             # relative (parent directory)
```

</details>

<details>
<summary><b>Q: What does <code>./</code> mean at the start of a command?</b></summary>

**A:** `./` means "in the current directory." It's important for running scripts:
```bash
script.sh       # shell searches PATH for "script.sh" → probably not found
./script.sh     # explicitly runs the script.sh in THIS directory
```

Linux does NOT search the current directory by default (unlike Windows). You must use `./` to run a script in the current folder.

</details>

<details>
<summary><b>Q: Can I use <code>~</code> in Python code?</b></summary>

**A:** No — `~` is a shell feature, not a Python feature. In Python, use:
```python
from pathlib import Path
home = Path.home()           # same as ~
config = Path("~").expanduser()  # also works
```

</details>

<details>
<summary><b>Q: What is the difference between <code>.</code> and <code>./</code>?</b></summary>

**A:** They mean the same thing — the current directory. `./script.sh` is just `.` (current directory) + `/` (path separator) + `script.sh`. Some commands require the `./` for clarity.

</details>

---

## Exercises

**Exercise 1: Path identification**

For each path, write whether it is **absolute** or **relative**:

1. `/etc/hosts`
2. `data/raw.csv`
3. `~/projects/tds/`
4. `../../backup/`
5. `./run.sh`
6. `/tmp/test.txt`

<details>
<summary><b>Answers</b></summary>

1. `/etc/hosts` → **Absolute** (starts with `/`)
2. `data/raw.csv` → **Relative** (starts with folder name)
3. `~/projects/tds/` → **Absolute** (`~` expands to `/home/yourname`)
4. `../../backup/` → **Relative** (starts with `..`)
5. `./run.sh` → **Relative** (starts with `.`)
6. `/tmp/test.txt` → **Absolute** (starts with `/`)

</details>

---

**Exercise 2: Path translation**

You are currently in `/home/alice/projects/tds/week1/`. Write the **relative path** to reach each target:

1. `/home/alice/projects/tds/week2/data.csv`
2. `/home/alice/notes.txt`
3. `/home/alice/projects/tds/README.md`

<details>
<summary><b>Answers</b></summary>

Starting from `/home/alice/projects/tds/week1/`:

1. `../week2/data.csv` — go up to `tds/`, then into `week2/`
2. `../../../notes.txt` — go up three levels: `week1/ → tds/ → projects/ → alice/`
3. `../README.md` — go up one level to `tds/`

</details>

---

**Exercise 3: Navigate and verify**

Run these commands and predict the output of each `pwd`:

```bash
cd ~
pwd                    # Q: What does this show?

cd /tmp
pwd                    # Q: What does this show?

cd -
pwd                    # Q: What does this show?

mkdir -p ~/test/a/b/c
cd ~/test/a/b/c
cd ../../
pwd                    # Q: What does this show?
```

<details>
<summary><b>Answers</b></summary>

```bash
cd ~
pwd                    # /home/yourname

cd /tmp
pwd                    # /tmp

cd -
pwd                    # /home/yourname  (cd - goes back to previous)

mkdir -p ~/test/a/b/c
cd ~/test/a/b/c
cd ../../
pwd                    # /home/yourname/test/a
                       # (from c/ → up to b/ → up to a/)
```

Clean up:
```bash
rm -r ~/test
```

</details>

---

**Exercise 4: Windows-to-Linux path conversion**

Convert these Windows paths to their Linux equivalents:

1. `C:\Users\john\Documents\project\main.py`
2. `C:\Users\john\Desktop\`
3. `C:\Windows\Temp\scratch.txt`

<details>
<summary><b>Answers</b></summary>

1. `/home/john/Documents/project/main.py` (or `~/Documents/project/main.py`)
2. `/home/john/Desktop/` (or `~/Desktop/`)
3. `/tmp/scratch.txt` (Linux temp folder is `/tmp`, not `/Windows/Temp`)

**Key changes:** `C:\Users\name` → `/home/name`, backslashes → forward slashes, drive letter removed.

</details>

---

**Exercise 5: MCQ**

**Q1:** You are in `/home/bob/code/`. What does `cd ../data/` take you to?

- A) `/home/bob/data/`
- B) `/home/data/`
- C) `/home/bob/code/data/`
- D) `/data/`

<details>
<summary><b>Answer</b></summary>

**A** — `..` goes up one level from `/home/bob/code/` to `/home/bob/`, then `data/` takes you into `/home/bob/data/`.

</details>

---

**Q2:** Which of these is NOT a valid way to go to your home directory?

- A) `cd ~`
- B) `cd $HOME`
- C) `cd`
- D) `cd /`

<details>
<summary><b>Answer</b></summary>

**D** — `cd /` goes to the **root** of the filesystem, not your home directory. The other three all go to `/home/yourname`.

</details>

---

**Q3:** You run `./analyze.py` and get "Permission denied." What should you do?

- A) Run `sudo rm analyze.py`
- B) Run `chmod +x analyze.py`
- C) Rename the file to `analyze.sh`
- D) Run `cd analyze.py`

<details>
<summary><b>Answer</b></summary>

**B** — The file needs execute permission. `chmod +x analyze.py` adds it. Alternatively, you can run `python3 analyze.py` directly (Python interprets it; no execute permission needed for the file itself).

</details>

---

