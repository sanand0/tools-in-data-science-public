# Day 2 — File Operations: touch, mkdir, rm, cp, mv

> **Goal:** Master the essential file management commands so you can create, copy, move, rename, and delete files and directories entirely from the terminal.

---

## Creating Files — `touch`

`touch` creates an empty file (or updates the timestamp of an existing file).

```bash
touch notes.txt                    # create one empty file
touch file1.txt file2.txt file3.txt  # create multiple files
touch ~/projects/README.md         # create in a specific location
```

If the file already exists, `touch` updates its "last modified" time without changing content.

```bash
ls -l notes.txt
# -rw-r--r-- 1 alice alice 0 Jan 15 10:00 notes.txt

touch notes.txt
ls -l notes.txt
# -rw-r--r-- 1 alice alice 0 Jan 15 10:05 notes.txt  ← timestamp updated
```

---

## Creating Directories — `mkdir`

```bash
mkdir mydir                             # create one directory
mkdir dir1 dir2 dir3                    # create multiple directories
mkdir -p parent/child/grandchild        # create nested path (-p = parents)
mkdir -p project/{src,tests,docs,data}  # brace expansion: create four dirs
```

**The `-p` flag is critical:**
- Without `-p`: fails if parent directories don't exist
- With `-p`: creates all missing parents, no error if it already exists

```bash
# Without -p — fails:
mkdir a/b/c
# mkdir: cannot create directory 'a/b/c': No such file or directory

# With -p — works:
mkdir -p a/b/c     # creates a/, a/b/, and a/b/c/
```

---

## Copying Files — `cp`

```bash
# Copy a file
cp source.txt destination.txt

# Copy a file to a directory
cp report.pdf ~/backup/

# Copy with a new name into a directory
cp report.pdf ~/backup/report-v2.pdf

# Copy all .csv files to a folder
cp *.csv ~/data/

# Copy a DIRECTORY (must use -r)
cp -r myproject/ myproject-backup/
```

### Important flags

```bash
cp -r   # recursive — REQUIRED for directories
cp -i   # interactive — asks before overwriting
cp -v   # verbose — shows what's being copied
cp -p   # preserve — keeps original permissions and timestamps
```

### Common mistake

```bash
# This fails — cp requires -r for directories:
cp mydir/ backup/
# cp: -r not specified; omitting directory 'mydir/'

# Correct:
cp -r mydir/ backup/
```

---

## Moving and Renaming — `mv`

`mv` does two things: **move** files to a new location, and **rename** files.

```bash
# Rename a file (same directory, different name)
mv old-name.txt new-name.txt

# Move a file to another directory
mv report.txt ~/archive/

# Move AND rename
mv ~/Downloads/data.csv ~/projects/tds/raw-data.csv

# Move multiple files to a directory
mv *.log ~/logs/

# Rename a directory
mv old-project/ new-project/
```

### Important flags

```bash
mv -i   # interactive — asks before overwriting
mv -v   # verbose — shows what's being moved
```

> **Key difference:** `mv` does NOT keep the original. It's cut+paste, not copy+paste. If you want to keep the original, use `cp`.

### 🧠 Knowledge Check

**Q1:** You want to rename a file named `report_draft.txt` to `report_final.txt`. Which command should you use?

- A) `cp report_draft.txt report_final.txt`
- B) `rename report_draft.txt report_final.txt`
- C) `mv report_draft.txt report_final.txt`
- D) `touch report_final.txt`

<details>
<summary><b>Answer</b></summary>

**C** — The `mv` (move) command is used for both moving files to new directories AND renaming files.

</details>

---

## Deleting Files — `rm`

⚠️ **WARNING:** `rm` is permanent. There is no Recycle Bin. Files are gone.

```bash
# Delete a file
rm file.txt

# Delete multiple files
rm file1.txt file2.txt file3.txt

# Delete all .tmp files
rm *.tmp

# Delete a directory and everything inside it
rm -r mydir/

# Force delete (no prompts, no errors for missing files)
rm -rf mydir/
```

### Important flags

```bash
rm -r   # recursive — REQUIRED for directories
rm -f   # force — no confirmation prompts
rm -i   # interactive — asks before each deletion (safer)
rm -v   # verbose — shows what's being deleted
```

### Safety tips

```bash
# SAFE: use -i to confirm each deletion
rm -i *.csv
# rm: remove regular file 'data1.csv'? y
# rm: remove regular file 'data2.csv'? n   ← skipped!

# DANGEROUS — never run these:
rm -rf /           # deletes EVERYTHING on your system
rm -rf ~           # deletes your entire home directory
rm -rf .           # deletes everything in current directory
```

> ```bash
> sudo apt install trash-cli -y
> trash file.txt         # moves to trash instead of deleting
> trash-list             # see what's in trash
> trash-restore          # bring files back
> ```

### 🧠 Knowledge Check

**Q1:** What is the safest way to delete multiple files using wildcards?

- A) Use `rm -rf *`
- B) Use `rm -i` so it prompts you for confirmation before each deletion
- C) Use `rm -f`
- D) You cannot delete multiple files with `rm`

<details>
<summary><b>Answer</b></summary>

**B** — The `-i` (interactive) flag is crucial for safety, especially when using wildcards, as it asks for confirmation before deleting each file.

</details>

---

## Removing Empty Directories — `rmdir`

```bash
rmdir emptydir/      # only works if the directory is empty
# rmdir: failed to remove 'emptydir/': Directory not empty

# If it has contents, use rm -r instead:
rm -r nonemptydir/
```

---

## Wildcards (Glob Patterns)

Wildcards let you match multiple files at once:

| Pattern | Matches | Example |
|---|---|---|
| `*` | Zero or more characters | `*.py` → all Python files |
| `?` | Exactly one character | `file?.txt` → `file1.txt`, NOT `file10.txt` |
| `[abc]` | One character from the set | `file[123].txt` → `file1.txt`, `file2.txt`, `file3.txt` |
| `[a-z]` | One character in the range | `[A-Z]*.py` → Python files starting with uppercase |

```bash
# Examples:
ls *.md                  # all Markdown files
rm temp_*.log            # all files matching temp_*.log
cp data_[0-9].csv backup/ # data_0.csv through data_9.csv
mv report?.pdf archive/  # report1.pdf, reportA.pdf (single char)
```

---

## Quick Reference

| Command | Purpose | Key flag |
|---|---|---|
| `touch` | Create empty file / update timestamp | — |
| `mkdir` | Create directory | `-p` (create parents) |
| `cp` | Copy file or directory | `-r` (required for dirs) |
| `mv` | Move or rename | `-i` (ask before overwrite) |
| `rm` | Delete permanently | `-r` (dirs), `-i` (safe) |
| `rmdir` | Delete empty directory | — |

---

## Q&A

<details>
<summary><b>Q: What is the difference between <code>cp</code> and <code>mv</code>?</b></summary>

**A:**
- `cp` = **copy** — the original file stays. You now have two copies.
- `mv` = **move** — the original is gone. The file is now at the new location.

Think of it as copy+paste vs cut+paste.

</details>

<details>
<summary><b>Q: Why do I need <code>-r</code> for directories but not for files?</b></summary>

**A:** A directory can contain other directories, which contain other directories, etc. The `-r` (recursive) flag tells the command to go into every subdirectory. Without it, the command would only work on single files, which is a safety measure to prevent accidental bulk operations on directories.

</details>

<details>
<summary><b>Q: Is there a way to undo <code>rm</code>?</b></summary>

**A:** No. Once a file is deleted with `rm`, it is gone permanently. There is no trash or undo. Prevention strategies:
- Use `rm -i` to get confirmation prompts
- Install `trash-cli` for a trash-can workflow
- Use version control (Git) — committed files can always be recovered

</details>

<details>
<summary><b>Q: What does <code>touch</code> do if the file already exists?</b></summary>

**A:** It updates the file's "last modified" timestamp to the current time without changing the contents. This is sometimes useful for triggering build systems that watch file modification times.

</details>

---

## Exercises

**Exercise 1: File operations practice**

```bash
# Create a practice area:
mkdir -p /tmp/file-ops-practice
cd /tmp/file-ops-practice

# Create files:
touch apple.txt banana.txt cherry.txt grape.csv melon.csv

# List them:
ls -la
```

Now perform these tasks:

1. Copy `apple.txt` to `apple-backup.txt`
2. Rename `banana.txt` to `yellow-fruit.txt`
3. Create a directory called `fruits/`
4. Move all `.txt` files into `fruits/`
5. Delete `melon.csv`

<details>
<summary><b>Solution</b></summary>

```bash
# 1. Copy
cp apple.txt apple-backup.txt

# 2. Rename
mv banana.txt yellow-fruit.txt

# 3. Create directory
mkdir fruits

# 4. Move all .txt files
mv *.txt fruits/

# 5. Delete
rm melon.csv

# Verify:
ls                    # grape.csv  fruits/
ls fruits/            # apple-backup.txt  apple.txt  cherry.txt  yellow-fruit.txt
```

</details>

---

**Exercise 2: Directory operations**

```bash
# Create this structure in one command:
mkdir -p /tmp/project/{src,tests,docs,data/{raw,processed}}

# Verify:
tree /tmp/project/
```

<details>
<summary><b>Expected tree output</b></summary>

```
/tmp/project/
├── data
│   ├── processed
│   └── raw
├── docs
├── src
└── tests
```

</details>

Now copy the entire project:

```bash
cp -r /tmp/project/ /tmp/project-backup/
tree /tmp/project-backup/
```

<details>
<summary><b>What should you see?</b></summary>

The exact same structure under `/tmp/project-backup/`. The `-r` flag copied everything recursively.

</details>

---

**Exercise 3: Wildcard practice**

```bash
cd /tmp
touch report1.txt report2.txt report10.txt summary.txt data.csv

# Which command lists only report1.txt and report2.txt (not report10.txt)?
```

<details>
<summary><b>Answer</b></summary>

```bash
ls report?.txt
# report1.txt  report2.txt
```

The `?` matches exactly **one** character, so `report?.txt` matches `report1.txt` and `report2.txt` but NOT `report10.txt` (which has two characters after "report").

To match all report files including `report10.txt`:
```bash
ls report*.txt
# report1.txt  report10.txt  report2.txt
```

</details>

---

**Exercise 4: MCQ**

**Q1:** Which command copies a directory `src/` to `src-backup/`?

- A) `cp src/ src-backup/`
- B) `cp -r src/ src-backup/`
- C) `mv src/ src-backup/`
- D) `mkdir src-backup/ && cp src/ src-backup/`

<details>
<summary><b>Answer</b></summary>

**B** — `cp -r` (recursive) is required for copying directories. Option A fails without `-r`. Option C moves (doesn't keep the original).

</details>

---

**Q2:** What happens when you run `rm -rf /tmp/test/` if `/tmp/test/` doesn't exist?

- A) Error message displayed
- B) Nothing happens (silent success)
- C) Creates the directory
- D) Deletes `/tmp/` instead

<details>
<summary><b>Answer</b></summary>

**B** — The `-f` flag suppresses errors for non-existent files. Without `-f`, you'd get `rm: cannot remove '/tmp/test/': No such file or directory`.

</details>

---

**Q3:** You have files `a.csv`, `b.csv`, `c.csv`, `notes.txt`. Which command deletes only the CSV files?

- A) `rm *`
- B) `rm *.csv`
- C) `rm ?.csv`
- D) `rm csv`

<details>
<summary><b>Answer</b></summary>

**B** — `*.csv` matches all files ending in `.csv`. Option A deletes everything. Option C matches only single-character names before `.csv`.

</details>

---

Clean up all exercise files:

```bash
rm -rf /tmp/file-ops-practice /tmp/project /tmp/project-backup
rm /tmp/report1.txt /tmp/report2.txt /tmp/report10.txt /tmp/summary.txt /tmp/data.csv
```
