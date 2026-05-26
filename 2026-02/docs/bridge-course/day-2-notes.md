# Day 2 — Linux & Shell Essentials: The Survival Toolkit
### TDS Bridge Bootcamp

> **Goal of Day 2:** Move from "I can type a command if someone tells me what to type" → "I can navigate, manage files, edit text, and write simple shell scripts independently." These are the skills you will use every single day as a data practitioner.

---

## Table of Contents

1. [Navigating the Filesystem](#1-navigating-the-filesystem)
2. [Working with Files and Directories](#2-working-with-files-and-directories)
3. [Reading File Contents](#3-reading-file-contents)
4. [Pipes and Redirection](#4-pipes-and-redirection)
5. [Text Editors](#5-text-editors)
6. [Shell Variables and Simple Scripts](#6-shell-variables-and-simple-scripts)
7. [Getting Help](#7-getting-help)
8. [Lab 2 — Workspace Creator and Documenter](#8-lab-2--workspace-creator-and-documenter)

---

## 1. Navigating the Filesystem

### 1.1 `pwd` — Where Am I?

```bash
pwd
# /home/alice/projects/tds
```

`pwd` = **P**rint **W**orking **D**irectory. Always run this if you are lost.

---

### 1.2 `ls` — What Is Here?

`ls` is the command you will run hundreds of times a day. Learn its flags.

```bash
ls                   # basic list
ls -l                # long format (permissions, size, date)
ls -a                # show hidden files (starting with .)
ls -la               # combine both — most useful
ls -lh               # human-readable file sizes (KB, MB, GB)
ls -lt               # sort by modification time, newest first
ls -lS               # sort by file size, largest first
ls -R                # recursive — list all subdirectories too
ls *.py              # list only .py files (glob pattern)
ls -la ~/projects/   # list a specific directory without cd-ing there
```

**Understanding `ls -la` output:**
```bash
ls -la
# total 48
# drwxr-xr-x  4 alice alice 4096 Jan 15 10:23 .
# drwxr-xr-x 12 alice alice 4096 Jan 15 09:00 ..
# -rw-r--r--  1 alice alice  234 Jan 15 10:23 README.md
# -rwxr-xr-x  1 alice alice  891 Jan 14 18:45 run.sh
# drwxr-xr-x  2 alice alice 4096 Jan 14 15:30 data
# lrwxrwxrwx  1 alice alice   12 Jan 13 11:00 latest -> data/v2/
#  ^            ^^^^^  ^^^^^  ^^^  ^^^^^^^^^^^^  ^^^^^^^^^^^
#  |            owner  group  size  date          name
#  type+permissions
#
# First character:
# d = directory
# - = regular file
# l = symlink (→ shows where it points)
```

---

### 1.3 `cd` — Move Around

```bash
cd /home/alice/projects   # absolute path
cd projects               # relative — works if projects/ is in current dir
cd ..                     # parent directory
cd ../..                  # two levels up
cd ~                      # home directory
cd -                      # back to previous directory (like browser Back)
cd                        # no argument = same as cd ~
```

**Pro tip — `cd -` for rapid back-and-forth:**
```bash
cd ~/projects/tds/day-2/data/
# do some work...
cd /tmp
# now go back:
cd -
# /home/alice/projects/tds/day-2/data/  ← returned
```

---

### 1.4 `tree` — Visual Directory Structure

`tree` is not always installed. Install it:

```bash
sudo apt install tree -y

# Basic usage:
tree
# .
# ├── data
# │   ├── raw.csv
# │   └── processed.csv
# ├── notebooks
# │   └── analysis.ipynb
# └── README.md

# Limit depth (very useful for large projects):
tree -L 2

# Show hidden files:
tree -a

# Show only directories:
tree -d

# Show file sizes:
tree -sh

# Output to file (useful for documentation):
tree -L 2 > structure.txt
```

---

### 1.5 Creating and Navigating Your TDS Workspace

```bash
# Create your full workspace structure in one command:
mkdir -p ~/tds-bootcamp/{day-1,day-2,day-3,day-4,day-5}
# The -p flag: create parent dirs as needed, no error if exists
# The {d1,d2} syntax: brace expansion — creates multiple at once

# Verify:
tree ~/tds-bootcamp/
# ~/tds-bootcamp/
# ├── day-1
# ├── day-2
# ├── day-3
# ├── day-4
# └── day-5

# Create nested structure:
mkdir -p ~/tds-bootcamp/day-2/{data,outputs,scripts}
tree ~/tds-bootcamp/day-2/
```

---

### ✅ Section 1 Summary

| Command | What it does | Most useful flag |
|---|---|---|
| `pwd` | Print current directory | — |
| `ls` | List directory contents | `-la` (long + hidden) |
| `cd` | Change directory | `cd -` (go back) |
| `tree` | Visual directory tree | `-L 2` (limit depth) |
| `mkdir` | Create directory | `-p` (create parents) |

---

### 📝 Section 1 — Questions

**MCQ 1.1**
You are in `/home/alice/projects/tds/day-2/`. After running `cd ../../`, where are you?

- A) `/home/alice/projects/`
- B) `/home/alice/`
- C) `/home/`
- D) `/home/alice/projects/tds/`

> ✅ **Answer: A**
> `JS validation: check input === 'A'`

---

**MCQ 1.2**
What does `ls -lt` sort by?

- A) File size (largest first)
- B) Alphabetical order (reversed)
- C) Modification time (newest first)
- D) File type

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**MCQ 1.3**
What does the `d` at the start of `drwxr-xr-x` mean in `ls -la` output?

- A) The file was deleted
- B) It is a directory
- C) It belongs to the root user
- D) It is a device file

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**Hands-on 1.A**
Create the directory structure `~/tds-bootcamp/day-2/data/` using a single command. What command did you use?

Expected: `mkdir -p ~/tds-bootcamp/day-2/data` (or equivalent)

> `JS validation: check input.includes('mkdir') && input.includes('-p') && input.includes('day-2')`

---

**Hands-on 1.B**
Run `tree ~/tds-bootcamp/ -L 1` and paste the output.

Expected: lines containing day-1 through day-5

> `JS validation: check output includes 'day-2' and 'day-3' etc.`

---

## 2. Working with Files and Directories

### 2.1 `touch` — Create an Empty File

```bash
touch notes.txt              # create empty file
touch file1.txt file2.txt    # create multiple files
touch -t 202401011200 old.txt  # create with specific timestamp

# Also used to update the modification time of an existing file:
touch existing.txt    # updates timestamp without changing content
```

---

### 2.2 `cp` — Copy

```bash
cp source.txt destination.txt          # copy file
cp source.txt /home/alice/backup/      # copy to directory
cp -r sourcedir/ destdir/              # copy directory recursively (-r is required)
cp -i source.txt dest.txt              # interactive — asks before overwriting
cp -v source.txt dest.txt              # verbose — shows what it copied
cp *.csv /backup/csvfiles/             # copy all .csv files

# Preserve permissions and timestamps:
cp -p source.txt dest.txt
cp -rp sourcedir/ destdir/             # recursive + preserve
```

**Common mistake:**
```bash
# Copying a directory WITHOUT -r fails:
cp myproject/ backup/
# cp: -r not specified; omitting directory 'myproject/'

# Fix:
cp -r myproject/ backup/
```

---

### 2.3 `mv` — Move and Rename

```bash
mv oldname.txt newname.txt             # rename file
mv file.txt ~/projects/                # move to directory
mv *.log /var/archive/logs/            # move all .log files
mv -i source.txt dest.txt             # ask before overwrite
mv -v file.txt ~/backup/               # verbose

# Rename a directory:
mv old-project-name/ new-project-name/

# Move and rename simultaneously:
mv ~/Downloads/report-v1.pdf ~/projects/tds/report-final.pdf
```

> **mv vs cp:** `mv` does not keep the original. Think of it as cut+paste, not copy+paste.

---

### 2.4 `rm` — Remove (Permanent — No Trash)

```bash
rm file.txt                      # delete a file
rm file1.txt file2.txt           # delete multiple files
rm *.tmp                         # delete all .tmp files
rm -r directory/                 # delete directory and all contents
rm -i file.txt                   # interactive — asks for each file
rm -v file.txt                   # verbose — shows what's deleted

# DANGER ZONE:
rm -rf /path/to/directory/       # force recursive delete, no prompts
# -f = force (no error if file doesn't exist, no prompts)
# NEVER run: rm -rf /    or    rm -rf ~    or    rm -rf ./
```

> **There is no Undo for `rm`.** Files do not go to trash. They are gone. Use `-i` when in doubt, or `trash-cli` if you want a safety net:
> ```bash
> sudo apt install trash-cli
> trash file.txt        # sends to trash instead of deleting
> trash-list            # see what's in trash
> restore-trash         # restore items
> ```

---

### 2.5 `mkdir` and `rmdir`

```bash
mkdir newdir                     # create directory
mkdir -p a/b/c/d                 # create full path
mkdir -p project/{src,tests,docs,data}   # brace expansion

rmdir emptydir/                  # remove empty directory
rm -r nonemptydir/               # remove directory with contents
```

---

### 2.6 Wildcards (Glob Patterns)

```bash
# * matches anything (zero or more characters)
ls *.txt            # all .txt files
rm temp_*.csv       # all files starting with temp_ ending in .csv

# ? matches exactly one character
ls file?.txt        # matches file1.txt, fileA.txt, NOT file10.txt

# [abc] matches one character from the set
ls file[123].txt    # matches file1.txt, file2.txt, file3.txt
ls [A-Z]*.py        # Python files starting with uppercase

# ** recursive glob (in some shells/tools)
ls **/*.py          # all .py files in any subdirectory
```

---

### ✅ Section 2 Summary

| Command | Use | Key flag |
|---|---|---|
| `touch` | Create empty file / update timestamp | — |
| `cp` | Copy file or directory | `-r` for dirs, `-i` to be safe |
| `mv` | Move or rename | `-i` to be safe |
| `rm` | Delete permanently | `-r` for dirs, **be careful** |
| `mkdir` | Create directory | `-p` for nested paths |
| `*`, `?`, `[]` | Match multiple files (globs) | — |

---

### 📝 Section 2 — Questions

**MCQ 2.1**
You want to copy a folder `my-data/` to `my-data-backup/`. Which command works?

- A) `cp my-data/ my-data-backup/`
- B) `cp -r my-data/ my-data-backup/`
- C) `copy my-data/ my-data-backup/`
- D) `mv my-data/ my-data-backup/`

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**MCQ 2.2**
What happens when you run `rm -rf ./temp/`?

- A) Moves `temp/` to the Recycle Bin
- B) Asks you to confirm before deleting
- C) Immediately and permanently deletes `temp/` and everything inside it
- D) Fails — you need `sudo`

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**MCQ 2.3**
Which glob pattern matches `file1.csv`, `file2.csv` but NOT `file10.csv`?

- A) `file*.csv`
- B) `file?.csv`
- C) `file[12].csv`
- D) `file[0-9][0-9].csv`

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**Hands-on 2.A**
Create a file called `test.txt` in `/tmp/`, then rename it to `renamed.txt`. What two commands did you use?

Expected:
```
touch /tmp/test.txt
mv /tmp/test.txt /tmp/renamed.txt
```
> `JS validation: check input includes 'touch' and 'mv'`

---

**Hands-on 2.B**
Run `mkdir -p ~/tds-bootcamp/day-2/{data,outputs,scripts}` then `tree ~/tds-bootcamp/day-2/`. How many subdirectories were created?

Expected: `3`

> `JS validation: trim, check input === '3'`

---

## 3. Reading File Contents

### 3.1 `cat` — Print File Contents

```bash
cat file.txt                     # print whole file
cat -n file.txt                  # print with line numbers
cat file1.txt file2.txt          # concatenate and print both
cat file1.txt file2.txt > combined.txt  # merge two files
```

> **Use `cat` for small files.** For files larger than a few hundred lines, use `less` or `head`/`tail` instead — `cat` will flood your terminal.

---

### 3.2 `less` — Page Through Large Files

```bash
less bigfile.txt
# Once inside less:
# Space / f      → next page
# b              → previous page
# /searchterm    → search forward (press n for next match)
# ?searchterm    → search backward
# G              → jump to end
# g              → jump to beginning
# q              → quit
# :n             → open next file (if multiple given)
```

```bash
less +F logfile.log    # follow mode — like tail -f, appends as file grows
                       # Ctrl+C to stop following, q to quit
```

---

### 3.3 `head` and `tail` — Peek at Files

```bash
head file.txt            # first 10 lines (default)
head -5 file.txt         # first 5 lines
head -c 100 file.txt     # first 100 bytes

tail file.txt            # last 10 lines
tail -20 file.txt        # last 20 lines
tail -c 500 file.txt     # last 500 bytes

# MOST IMPORTANT tail flag:
tail -f server.log       # follow — prints new lines as they appear
                         # Use this to watch a log file live
                         # Ctrl+C to stop
```

---

### 3.4 `wc` — Count Lines, Words, Characters

```bash
wc file.txt              # lines  words  chars  filename
wc -l file.txt           # line count only
wc -w file.txt           # word count only
wc -c file.txt           # byte count
wc -m file.txt           # character count (handles unicode correctly)

# Count files in a directory:
ls /usr/bin/ | wc -l
```

---

### ✅ Section 3 Summary

| Command | Use | Key flag |
|---|---|---|
| `cat` | Print small files | `-n` for line numbers |
| `less` | Page through large files | `/` to search, `q` to quit |
| `head` | First N lines | `-n 5` |
| `tail` | Last N lines | `-f` to follow live |
| `wc` | Count lines/words/chars | `-l` for lines |

---

### 📝 Section 3 — Questions

**MCQ 3.1**
What does `tail -f server.log` do?

- A) Shows the last file in the directory
- B) Shows the last 10 lines and then exits
- C) Continuously prints new lines as they are added to the file
- D) Follows symlinks to the real log file

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**Hands-on 3.A**
Use `wc -l` to count the number of lines in `/etc/passwd`. What command did you use?

Expected: `wc -l /etc/passwd`

> `JS validation: check input.includes('wc') && input.includes('-l') && input.includes('/etc/passwd')`

---

## 4. Pipes and Redirection

### 4.1 Redirection — Controlling Where Output Goes

Every command has three streams: stdin (input), stdout (output), stderr (errors).

```bash
# Redirect stdout to a file (overwrites):
ls > filelist.txt

# Redirect stdout to a file (appends):
echo "new line" >> notes.txt

# Redirect stderr to a file:
python3 buggy.py 2> errors.txt

# Redirect both stdout and stderr to same file:
python3 script.py > output.txt 2>&1
# The 2>&1 means: "redirect stderr (2) to wherever stdout (1) is going"

# Separate stdout and stderr:
python3 script.py > output.txt 2> errors.txt

# Discard stderr (silence it):
python3 noisy.py 2>/dev/null

# Discard ALL output:
python3 script.py > /dev/null 2>&1

# Redirect stdin — feed a file as input:
python3 processor.py < input.txt

# Here-string — feed a string as stdin:
python3 -c "import sys; print(sys.stdin.read())" <<< "hello world"
```

---

### 4.2 Pipes — Connecting Programs

The pipe `|` connects stdout of the left program to stdin of the right program. No temporary files.

```bash
# Basic pipe
ls -la | wc -l          # count total items in directory

# Count Python files in a project:
find . -name "*.py" | wc -l
```

---

### 4.3 `xargs` — Pass Pipe Output as Arguments

```bash
# Without xargs — this is WRONG for many programs:
find . -name "*.tmp" | rm       # ERROR: rm doesn't read from stdin

# With xargs — CORRECT:
find . -name "*.tmp" | xargs rm

# -I{} lets you place the argument anywhere:
find . -name "*.txt" | xargs -I{} cp {} /backup/

# Process one at a time with -n 1:
echo "a b c" | xargs -n 1 echo

# Show what would be done (dry run):
find . -name "*.tmp" | xargs echo
```

---

### ✅ Section 4 Summary

| Operator/Command | What it does |
|---|---|
| `>` | Redirect stdout to file (overwrite) |
| `>>` | Redirect stdout to file (append) |
| `2>` | Redirect stderr to file |
| `2>&1` | Redirect stderr to same place as stdout |
| `2>/dev/null` | Discard stderr |
| `\|` | Pipe stdout of left to stdin of right |
| `xargs` | Convert stdin to command arguments |

---

### 📝 Section 4 — Questions

**MCQ 4.1**
What does `command > file.txt 2>&1` do?

- A) Redirects stdout to file.txt and discards stderr
- B) Redirects both stdout and stderr to file.txt
- C) Redirects stderr to stdout and both to file.txt
- D) Appends both stdout and stderr to file.txt

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**MCQ 4.2**
What does `echo 'file1.txt file2.txt' | xargs rm` do?

- A) Deletes `file1.txt` and `file2.txt`
- B) Prints `file1.txt file2.txt` to the screen
- C) Creates `file1.txt` and `file2.txt`
- D) Fails with a syntax error

> ✅ **Answer: A**
> `JS validation: check input === 'A'`

---

**Hands-on 4.A**
Write a command that appends the line "Data Science" to the file `/tmp/tds.txt`.

Expected: `echo "Data Science" >> /tmp/tds.txt`

> `JS validation: check input.includes('echo') && input.includes('>>') && input.includes('/tmp/tds.txt')`

---

## 5. Text Editors

When working on a remote server or inside a terminal environment, you won't have a graphical editor like VS Code or Notepad. You must know how to edit files directly inside the command line. The two most common terminal text editors are `nano` and `vim`.

---

### 5.1 `nano` — The Simple Editor

`nano` is a beginner-friendly terminal editor. It displays shortcuts at the bottom of the screen, making it very easy to use.

#### How to use Nano:
1. **Open or create a file:**
   ```bash
   nano myfile.txt
   ```
2. **Editing:** Just start typing. You can use your arrow keys to navigate the file.
3. **Saving (Write Out):** Press `Ctrl + O`, then press `Enter` to confirm the filename.
4. **Exiting:** Press `Ctrl + X` to exit. (If you have unsaved changes, it will ask if you want to save them first).

---

### 5.2 `vim` — The Professional Editor

`vim` (Vi Improved) is an extremely powerful, modal text editor. It is installed on almost every Linux system by default. Unlike standard editors, Vim has different **modes** of operation.

#### Vim Modes:
* **Normal Mode (Command Mode):** This is the default mode when you open a file. Keystrokes are interpreted as commands (e.g., navigating, copying, deleting), not text.
* **Insert Mode:** This is where you actually type text.

#### How to use Vim:
1. **Open or create a file:**
   ```bash
   vim myfile.txt
   ```
   *You start in **Normal Mode**. You cannot type text yet!*
2. **Enter Insert Mode:** Press `i`. You will see `-- INSERT --` at the bottom of the screen. Now you can type text.
3. **Return to Normal Mode:** Press the `Esc` key.
4. **Save and Exit:** From **Normal Mode**, type `:wq` and press `Enter` (`w` = write/save, `q` = quit).
5. **Exit Without Saving:** From **Normal Mode**, type `:q!` and press `Enter` (discards all changes).
6. **Move around in Normal Mode:** Use arrow keys, or the classic keys `h` (left), `j` (down), `k` (up), `l` (right).

---

### 5.3 Nano vs Vim Quick Reference

| Feature | `nano` | `vim` |
|---|---|---|
| **Learning Curve** | Very low (easy) | High (steep) |
| **Default Mode** | Editing | Command / Normal |
| **How to Edit** | Just type | Press `i` first |
| **How to Save** | `Ctrl + O` | `Esc` then `:w` or `:wq` |
| **How to Exit** | `Ctrl + X` | `Esc` then `:q!` or `:wq` |
| **Availability** | Usually installed | Installed everywhere |

---

### ✅ Section 5 Summary

* Use `nano` for quick, simple edits when you want a straightforward editor.
* Use `vim` when you need a powerful editor available on any server, or when performing advanced text editing tasks.
* Remember: in Vim, if you get stuck, press `Esc` multiple times, then type `:q!` to get out!

---

### 📝 Section 5 — Questions

**MCQ 5.1**
Which shortcut is used to exit `nano`?

- A) `Ctrl + S`
- B) `Ctrl + X`
- C) `:q!`
- D) `Ctrl + C`

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**MCQ 5.2**
How do you enter "Insert Mode" in `vim` to start typing text?

- A) Press `Ctrl + I`
- B) Type `:insert`
- C) Press `i`
- D) Press `Enter`

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**MCQ 5.3**
In `vim`, how do you save and exit a file?

- A) Press `Ctrl + S` then `Ctrl + Q`
- B) Press `Esc` then type `:wq` and press `Enter`
- C) Type `:quit`
- D) Press `Esc` then type `:q!` and press `Enter`

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**Hands-on 5.A**
Use `nano` or `vim` to create a file in `/tmp/editor_test.txt` with the single line "Terminal editors are awesome!".
What tool did you use, and what is the exact command to view the contents of this file?

Expected command: `cat /tmp/editor_test.txt`

> `JS validation: check input.includes('cat') && input.includes('editor_test.txt')`

---

## 6. Shell Variables and Simple Scripts

### 6.1 Variables

```bash
# Define a variable (no spaces around =):
NAME="alice"
echo $NAME         # alice
echo ${NAME}       # alice (curly braces = safer, especially in strings)
echo "${NAME}_log" # alice_log  ← without braces: $NAME_log looks for $NAME_log var

# Variable types (bash is loosely typed):
COUNT=5
SUM=$((COUNT + 3))    # arithmetic: use $(( ))
echo $SUM             # 8

# Command output into a variable:
TODAY=$(date +%Y-%m-%d)
echo $TODAY            # 2024-01-15

PYTHON_VER=$(python3 --version)
echo $PYTHON_VER       # Python 3.11.2

# Read-only variable:
readonly PI=3.14159
PI=3                   # Error: PI: readonly variable
```

---

### 6.2 Conditionals

```bash
# if / else:
if [ condition ]; then
    commands
elif [ other_condition ]; then
    other_commands
else
    fallback_commands
fi

# Common conditions:
[ -f file.txt ]       # true if file exists and is a regular file
[ -d mydir ]          # true if directory exists
[ -z "$VAR" ]         # true if variable is empty
[ -n "$VAR" ]         # true if variable is non-empty
[ "$A" = "$B" ]       # string equality
[ "$A" != "$B" ]      # string inequality
[ $NUM -gt 10 ]       # numeric: greater than (-lt, -ge, -le, -eq, -ne)

# Example:
if [ -f "config.json" ]; then
    echo "Config found"
else
    echo "Config missing — creating default"
    cp config.default.json config.json
fi
```

---

### 6.3 Loops

```bash
# For loop over list:
for fruit in apple banana cherry; do
    echo "I like $fruit"
done

# For loop over files:
for file in *.csv; do
    echo "Processing $file..."
    wc -l "$file"
done

# For loop with range:
for i in {1..5}; do
    echo "Step $i"
done

# While loop:
count=0
while [ $count -lt 5 ]; do
    echo "count is $count"
    count=$((count + 1))
done

# While with input:
while read -r line; do
    echo "Got: $line"
done < input.txt
```

---

### 6.4 Writing Your First Shell Script

```bash
#!/bin/bash
# Day 2 workspace setup script
# Usage: ./setup-workspace.sh <project-name>

PROJECT_NAME="${1:?Usage: $0 <project-name>}"
BASE_DIR="$HOME/tds-bootcamp"
PROJECT_DIR="$BASE_DIR/$PROJECT_NAME"

echo "Creating project: $PROJECT_NAME"

# Create directory structure
mkdir -p "$PROJECT_DIR"/{data,outputs,scripts,docs}

# Create README
cat > "$PROJECT_DIR/README.md" << EOF
# $PROJECT_NAME
Created: $(date +%Y-%m-%d)

## Structure
- data/     : input data files
- outputs/  : generated files
- scripts/  : shell scripts
- docs/     : documentation
EOF

echo "Done! Project created at: $PROJECT_DIR"
echo ""
tree "$PROJECT_DIR"
```

Make it executable and run:
```bash
chmod +x setup-workspace.sh
./setup-workspace.sh my-analysis
```

---

### ✅ Section 6 Summary

| Concept | Syntax |
|---|---|
| Variable | `NAME="value"` — no spaces around `=` |
| Use variable | `$NAME` or `${NAME}` |
| Arithmetic | `$(( expression ))` |
| Command in variable | `$(command)` |
| Condition test | `[ condition ]` |
| File exists | `[ -f file ]` |
| For loop | `for x in list; do ... done` |

---

### 📝 Section 6 — Questions

**MCQ 6.1**
What is the correct way to define a variable in bash?

- A) `NAME = "alice"`
- B) `NAME = alice`
- C) `NAME="alice"`
- D) `$NAME="alice"`

> ✅ **Answer: C**
> `JS validation: check input === 'C'`

---

**MCQ 6.2**
What does `TODAY=$(date +%Y-%m-%d)` do?

- A) Sets TODAY to the literal string "date +%Y-%m-%d"
- B) Runs `date +%Y-%m-%d` and stores its output in TODAY
- C) Fails — you can't use command output in variable assignment
- D) Sets TODAY to today's date as a timestamp number

> ✅ **Answer: B**
> `JS validation: check input === 'B'`

---

**Hands-on 6.A**
Write a one-liner that creates 5 files named `data_1.txt` through `data_5.txt` in `/tmp/`.

Expected: `for i in {1..5}; do touch /tmp/data_$i.txt; done`

> `JS validation: check input includes 'for' and '{1..5}' and 'touch' and 'data_'`
> `OR check input includes 'touch /tmp/data_1.txt' and '/tmp/data_5.txt'`

---

**Hands-on 6.B**
Write a script fragment that checks if a file `config.json` exists in the current directory and prints "Found" or "Missing" accordingly.

Expected:
```bash
if [ -f "config.json" ]; then
    echo "Found"
else
    echo "Missing"
fi
```
> `JS validation: check input includes '[ -f' and 'echo' and 'else' and 'fi'`

---

## 7. Getting Help

### 7.1 `--help`

```bash
# Almost every command supports --help:
ls --help
grep --help | head -30      # pipe to head if it's too long
find --help 2>&1 | less     # pipe to less for paging
```

---

### 7.2 `man` — Manual Pages

```bash
man ls              # open manual for ls
man grep
man bash            # full bash reference (very long)

# Inside man:
# Space / f   → next page
# b           → back a page
# /term       → search
# q           → quit

# Search across all man pages:
man -k "copy file"     # find man pages related to copying files
apropos copy           # same as man -k
```

---

### 7.3 `tldr` — Practical Examples (Install if Available)

```bash
# Install:
sudo apt install tldr -y
tldr --update    # download the database

# Use:
tldr ls          # practical examples for ls
tldr grep        # common grep patterns
tldr tar         # tar is notoriously hard to remember
# tar: xkcd.com/1168
```

---

### 7.4 `type`, `which`, `info`

```bash
type ls            # ls is aliased to 'ls --color=auto'
type cd            # cd is a shell builtin
type python3       # python3 is /usr/bin/python3

which python3      # /usr/bin/python3
which -a python3   # show ALL matches in PATH, not just the first

info coreutils     # more detailed documentation (GNU tools)
```

---

## 8. Lab 2 — Workspace Creator and Documenter

### Setup

In this lab, you will put your new navigation, file management, text editing, and scripting skills to work by building an automated workspace backup pipeline.

---

### Lab Tasks

**Task 1: Navigate and Create a Workspace**
Create a project workspace inside `/tmp/lab-workspace/` with subdirectories `data`, `scripts`, and `backups`.
```bash
mkdir -p /tmp/lab-workspace/{data,scripts,backups}
```

**Task 2: Create files using redirection**
Create a mock data CSV file named `/tmp/lab-workspace/data/raw.csv` and populate it with two headers and records:
```bash
echo "id,name,role" > /tmp/lab-workspace/data/raw.csv
echo "1,alice,engineer" >> /tmp/lab-workspace/data/raw.csv
echo "2,bob,designer" >> /tmp/lab-workspace/data/raw.csv
```

**Task 3: Edit a file using Nano or Vim**
Use `nano` or `vim` to open `/tmp/lab-workspace/data/raw.csv` and add a third data row manually:
```csv
3,carol,manager
```

**Task 4: Write a simple backup script**
Use your editor to create a script `/tmp/lab-workspace/scripts/backup.sh` that copies all `.csv` files from the `data/` directory to the `backups/` directory.

Your script should:
1. Define a variable `SOURCE_DIR` for `/tmp/lab-workspace/data` and `DEST_DIR` for `/tmp/lab-workspace/backups`.
2. Check if the backup directory exists (using an `if` condition); if it doesn't, create it.
3. Use a `for` loop to copy each CSV file and print a message.

Example script content:
```bash
#!/bin/bash
SOURCE_DIR="/tmp/lab-workspace/data"
DEST_DIR="/tmp/lab-workspace/backups"

if [ -d "$DEST_DIR" ]; then
    echo "Backup directory exists."
else
    echo "Backup directory missing. Creating..."
    mkdir -p "$DEST_DIR"
fi

echo "Starting backup..."
for file in $SOURCE_DIR/*.csv; do
    cp "$file" "$DEST_DIR/"
    echo "Copied $file to $DEST_DIR/"
done
echo "Backup complete!"
```

**Task 5: Make the script executable and run it**
```bash
chmod +x /tmp/lab-workspace/scripts/backup.sh
/tmp/lab-workspace/scripts/backup.sh
```

**Task 6: Verify and count**
Verify that the backed-up file exists and count its lines using `wc -l`.
```bash
wc -l /tmp/lab-workspace/backups/raw.csv
```

---

### Lab Deliverable

In `/tmp/lab-workspace/`, you should have:
```
/tmp/lab-workspace/
├── backups/
│   └── raw.csv            (backed-up CSV)
├── data/
│   └── raw.csv            (the edited CSV)
└── scripts/
    └── backup.sh          (the backup shell script)
```

---

## Day 2 Final Checklist

- [ ] I can navigate the filesystem without looking at a cheat sheet
- [ ] I know the difference between `>` (overwrite) and `>>` (append)
- [ ] I can build a simple pipeline using `|`
- [ ] I can edit files using `nano` and `vim` inside the terminal
- [ ] I can write a simple shell script with variables, a conditional, and a loop
- [ ] I have completed Lab 2 and verified the backup script works

---

## Quick Reference — Day 2 Commands

```bash
# Navigation
pwd / ls -la / cd / cd - / tree -L 2

# File operations
touch / cp -r / mv / rm -r / mkdir -p

# Reading files
cat -n / less / head -5 / tail -f / wc -l

# Pipelines and Redirection
|  >  >>  2>  2>&1  2>/dev/null  xargs

# Text Editors
nano / vim

# Shell Variables and Scripts
NAME="value" / $((expression)) / $(command) / [ -d dir ] / [ -f file ] / for x in list; do ... done

# Help
command --help / man command / tldr command / which command
```

---

*End of Day 2 Notes — Next up: Day 3 — VS Code + Python Project Setup with uv*

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

