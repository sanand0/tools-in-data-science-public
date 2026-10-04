# Day 2 — Basic Script Writing

> **Goal:** Write your first shell scripts — from simple one-liners to multi-step automation scripts with variables, conditionals, and loops.

---

## What Is a Shell Script?

A shell script is a text file containing a series of commands that the shell (bash) executes in order. Instead of typing 10 commands one by one, you put them in a file and run it once.

```bash
# Instead of typing these every day:
cd ~/projects/tds
git pull
python3 main.py
echo "Done!"

# Put them in a script and run: ./daily.sh
```

---

## Your First Script

### Step 1: Create the file

```bash
nano ~/hello.sh
```

### Step 2: Write the script

```bash
#!/bin/bash
# My first shell script

echo "Hello, World!"
echo "Today is $(date)"
echo "You are: $(whoami)"
echo "You are in: $(pwd)"
```

### Step 3: Make it executable

```bash
chmod +x ~/hello.sh
```

### Step 4: Run it

```bash
~/hello.sh
# Hello, World!
# Today is Mon Jan 15 10:30:00 IST 2026
# You are: alice
# You are in: /home/alice
```

---

## The Shebang Line — `#!/bin/bash`

The first line of every script should be the **shebang**:

```bash
#!/bin/bash
```

This tells the system: "Use bash to interpret this file." Without it, the system might use a different shell.

> The name "shebang" comes from **#** (hash) + **!** (bang).

---

## Variables

```bash
#!/bin/bash

# Defining variables (NO SPACES around =)
NAME="Alice"
AGE=25
GREETING="Hello, $NAME"

# Using variables
echo $NAME              # Alice
echo ${NAME}            # Alice (curly braces — safer in strings)
echo "$GREETING"        # Hello, Alice
echo "${NAME}_data"     # Alice_data (braces prevent confusion with $NAME_data)
```

### Rules for variables

| ✅ Correct | ❌ Wrong | Why |
|---|---|---|
| `NAME="alice"` | `NAME = "alice"` | No spaces around `=` |
| `echo $NAME` | `echo NAME` | Missing `$` to reference |
| `echo "${NAME}_log"` | `echo "$NAME_log"` | Without braces, bash looks for `$NAME_log` |

### Command substitution — putting command output in a variable

```bash
# Use $( ) to capture command output:
TODAY=$(date +%Y-%m-%d)
echo "Date: $TODAY"        # Date: 2026-01-15

PYTHON_VER=$(python3 --version)
echo "Python: $PYTHON_VER" # Python: Python 3.12.3

FILE_COUNT=$(ls *.csv 2>/dev/null | wc -l)
echo "CSV files: $FILE_COUNT"
```

### Arithmetic

```bash
A=10
B=3
SUM=$((A + B))          # 13
DIFF=$((A - B))         # 7
PRODUCT=$((A * B))      # 30
QUOTIENT=$((A / B))     # 3 (integer division)
REMAINDER=$((A % B))    # 1

echo "Sum: $SUM, Product: $PRODUCT"
```

### 🧠 Knowledge Check

**Q1:** How do you correctly assign the value "Alice" to a variable named `NAME` in a bash script?

- A) `NAME = "Alice"`
- B) `NAME="Alice"`
- C) `$NAME="Alice"`
- D) `set NAME to "Alice"`

<details>
<summary><b>Answer</b></summary>

**B** — In bash, variable assignment must not have spaces around the equals sign `=`.

</details>

**Q2:** How do you capture the output of a command like `date` and store it in a variable?

- A) `TODAY=date`
- B) `TODAY=${date}`
- C) `TODAY=$(date)`
- D) `TODAY="date"`

<details>
<summary><b>Answer</b></summary>

**C** — The `$(command)` syntax executes the command and substitutes its output, which can then be assigned to a variable.

</details>

---

## User Input — `read`

```bash
#!/bin/bash
echo "What is your name?"
read USER_NAME
echo "Hello, $USER_NAME!"

# With a prompt on the same line:
read -p "Enter project name: " PROJECT
echo "Creating project: $PROJECT"
```

---

## Conditionals — `if` / `elif` / `else`

```bash
#!/bin/bash

FILE="config.json"

if [ -f "$FILE" ]; then
    echo "✓ $FILE found"
else
    echo "✗ $FILE not found"
fi
```

### Common test conditions

| Test | Meaning |
|---|---|
| `[ -f file ]` | File exists and is a regular file |
| `[ -d dir ]` | Directory exists |
| `[ -e path ]` | Path exists (file or directory) |
| `[ -z "$VAR" ]` | Variable is empty |
| `[ -n "$VAR" ]` | Variable is non-empty |
| `[ "$A" = "$B" ]` | Strings are equal |
| `[ "$A" != "$B" ]` | Strings are not equal |
| `[ $NUM -gt 10 ]` | Number greater than 10 |
| `[ $NUM -lt 5 ]` | Number less than 5 |
| `[ $NUM -eq 0 ]` | Number equals 0 |

### Full example

```bash
#!/bin/bash

read -p "Enter a number: " NUM

if [ $NUM -gt 100 ]; then
    echo "That's a big number!"
elif [ $NUM -gt 0 ]; then
    echo "That's a positive number."
elif [ $NUM -eq 0 ]; then
    echo "That's zero."
else
    echo "That's a negative number."
fi
```

---

## Loops

### `for` loop — iterate over a list

```bash
#!/bin/bash

# Loop over words
for fruit in apple banana cherry; do
    echo "I like $fruit"
done

# Loop over files
for file in *.csv; do
    echo "Processing $file..."
    wc -l "$file"
done

# Loop with a number range
for i in {1..5}; do
    echo "Step $i"
done

# Loop over command output
for user in $(cat /etc/passwd | cut -d: -f1 | head -5); do
    echo "User: $user"
done
```

### `while` loop — repeat while condition is true

```bash
#!/bin/bash

count=0
while [ $count -lt 5 ]; do
    echo "Count: $count"
    count=$((count + 1))
done

# Read lines from a file
while read -r line; do
    echo "Line: $line"
done < input.txt
```

### 🧠 Knowledge Check

**Q1:** Which loop is best suited for iterating over a specific list of items or files?

- A) `while` loop
- B) `for` loop
- C) `if` statement
- D) `repeat` loop

<details>
<summary><b>Answer</b></summary>

**B** — A `for` loop is ideal for iterating through a sequence, list, or set of files (e.g., `for file in *.txt; do ...`).

</details>

---

## Pipes and Redirection in Scripts

```bash
#!/bin/bash

# Redirect output to a file
echo "Report generated on $(date)" > report.txt

# Append to a file
echo "=== File Count ===" >> report.txt
ls -la | wc -l >> report.txt

# Redirect stderr to a separate file
python3 risky_script.py 2> errors.txt

# Use tee to both display AND save
echo "Starting process..." | tee logfile.txt
```

---

## Script Arguments — `$1`, `$2`, etc.

Scripts can accept command-line arguments:

```bash
#!/bin/bash
# Usage: ./greet.sh <name> <greeting>

NAME=$1
GREETING=${2:-"Hello"}   # default value if $2 is not provided

echo "$GREETING, $NAME!"
```

```bash
./greet.sh Alice
# Hello, Alice!

./greet.sh Bob "Good morning"
# Good morning, Bob!
```

### Special variables

| Variable | Meaning |
|---|---|
| `$0` | Script name |
| `$1`, `$2`, ... | Arguments |
| `$#` | Number of arguments |
| `$@` | All arguments (as separate words) |
| `$?` | Exit code of last command (0 = success) |

---

## A Real Example — Workspace Setup Script

```bash
#!/bin/bash
# setup-workspace.sh — Create a project workspace
# Usage: ./setup-workspace.sh <project-name>

PROJECT_NAME="${1:?Usage: $0 <project-name>}"
BASE_DIR="$HOME/tds-bootcamp"
PROJECT_DIR="$BASE_DIR/$PROJECT_NAME"

# Check if it already exists
if [ -d "$PROJECT_DIR" ]; then
    echo "Error: $PROJECT_DIR already exists!"
    exit 1
fi

echo "Creating project: $PROJECT_NAME"

# Create structure
mkdir -p "$PROJECT_DIR"/{data,outputs,scripts,docs}

# Create README
cat > "$PROJECT_DIR/README.md" << EOF
# $PROJECT_NAME

Created: $(date +%Y-%m-%d)
Author: $(whoami)

## Directory Structure
- \`data/\`     — input data files
- \`outputs/\`  — generated output files
- \`scripts/\`  — shell scripts and automation
- \`docs/\`     — documentation
EOF

# Create a placeholder script
cat > "$PROJECT_DIR/scripts/run.sh" << 'EOF'
#!/bin/bash
echo "Running analysis..."
echo "Data directory: $(ls ../data/ 2>/dev/null | wc -l) files"
echo "Done!"
EOF

chmod +x "$PROJECT_DIR/scripts/run.sh"

echo ""
echo "✓ Project created at: $PROJECT_DIR"
tree "$PROJECT_DIR"
```

---

## Q&A

<details>
<summary><b>Q: Why does <code>NAME = "alice"</code> (with spaces) fail?</b></summary>

**A:** Bash interprets spaces as argument separators. With spaces, bash thinks `NAME` is a command, `=` is its first argument, and `"alice"` is its second argument. Without spaces, bash knows it's a variable assignment.

```bash
NAME = "alice"    # Error: NAME: command not found
NAME="alice"      # Correct
```

</details>

<details>
<summary><b>Q: What does <code>#!/bin/bash</code> actually do?</b></summary>

**A:** When you run `./script.sh`, the OS reads the first line. If it starts with `#!` (shebang), the OS uses the specified program (`/bin/bash`) to interpret the rest of the file. Without it, the OS might use `/bin/sh` (a more limited shell) or fail.

</details>

<details>
<summary><b>Q: What is the difference between single quotes and double quotes?</b></summary>

**A:**
- **Double quotes** `" "` — variables and commands are **expanded**:
  ```bash
  NAME="Alice"
  echo "Hello $NAME"     # Hello Alice
  echo "Date: $(date)"   # Date: Mon Jan 15...
  ```
- **Single quotes** `' '` — everything is **literal** (no expansion):
  ```bash
  echo 'Hello $NAME'     # Hello $NAME  (literally)
  echo 'Date: $(date)'   # Date: $(date)  (literally)
  ```

</details>

<details>
<summary><b>Q: How do I debug a script that isn't working?</b></summary>

**A:** Use `bash -x` to run the script in debug mode. It shows each command before executing it:

```bash
bash -x ./myscript.sh
# + NAME=alice
# + echo 'Hello, alice'
# Hello, alice
```

The `+` lines show what bash is actually executing.

</details>

---

## Exercises

**Exercise 1: Variable practice**

Write a script `info.sh` that prints your username, home directory, current date, and number of files in your home directory.

<details>
<summary><b>Solution</b></summary>

```bash
#!/bin/bash
# info.sh — System information

USERNAME=$(whoami)
HOME_DIR=$HOME
TODAY=$(date +%Y-%m-%d)
FILE_COUNT=$(ls ~ | wc -l)

echo "=== System Info ==="
echo "User: $USERNAME"
echo "Home: $HOME_DIR"
echo "Date: $TODAY"
echo "Files in home: $FILE_COUNT"
```

```bash
chmod +x info.sh
./info.sh
```

</details>

---

**Exercise 2: Conditional script**

Write a script `check-tools.sh` that checks if `git`, `python3`, and `uv` are installed, printing ✓ or ✗ for each.

<details>
<summary><b>Solution</b></summary>

```bash
#!/bin/bash
# check-tools.sh — Verify required tools

for tool in git python3 uv; do
    if command -v "$tool" > /dev/null 2>&1; then
        echo "✓ $tool is installed: $(command -v $tool)"
    else
        echo "✗ $tool is NOT installed"
    fi
done
```

```bash
chmod +x check-tools.sh
./check-tools.sh
```

`command -v` checks if a command exists. The `> /dev/null 2>&1` suppresses output so we only see our custom messages.

</details>

---

**Exercise 3: Loop script**

Write a script that creates 5 files named `day-1.md` through `day-5.md` in a directory called `/tmp/bootcamp/`, each containing the text "Notes for Day X".

<details>
<summary><b>Solution</b></summary>

```bash
#!/bin/bash
# create-days.sh — Create daily note files

mkdir -p /tmp/bootcamp

for i in {1..5}; do
    echo "# Notes for Day $i" > "/tmp/bootcamp/day-$i.md"
    echo "Created day-$i.md"
done

echo ""
echo "Files created:"
ls -la /tmp/bootcamp/
```

```bash
chmod +x create-days.sh
./create-days.sh
cat /tmp/bootcamp/day-3.md
# # Notes for Day 3
```

</details>

---

**Exercise 4: Backup script**

Write a script `backup.sh` that:
1. Takes a directory name as an argument (`$1`)
2. Checks if the directory exists
3. If yes, copies it to `<name>-backup-<date>/`
4. If no, prints an error

<details>
<summary><b>Solution</b></summary>

```bash
#!/bin/bash
# backup.sh — Backup a directory
# Usage: ./backup.sh <directory>

DIR="${1:?Usage: $0 <directory>}"
DATE=$(date +%Y%m%d)
BACKUP="${DIR}-backup-${DATE}"

if [ ! -d "$DIR" ]; then
    echo "Error: '$DIR' is not a directory or does not exist."
    exit 1
fi

if [ -d "$BACKUP" ]; then
    echo "Error: Backup '$BACKUP' already exists."
    exit 1
fi

cp -r "$DIR" "$BACKUP"
echo "✓ Backed up '$DIR' → '$BACKUP'"
echo "Contents:"
tree "$BACKUP" -L 1
```

Test it:
```bash
mkdir -p /tmp/myproject/{src,data}
chmod +x backup.sh
./backup.sh /tmp/myproject
# ✓ Backed up '/tmp/myproject' → '/tmp/myproject-backup-20260115'
```

</details>

---

**Exercise 5: MCQ**

**Q1:** What is the correct shebang line for a bash script?

- A) `# /bin/bash`
- B) `#!/bin/bash`
- C) `//bin/bash`
- D) `@!/bin/bash`

<details>
<summary><b>Answer</b></summary>

**B** — The shebang is `#!` followed by the path to the interpreter. `#!/bin/bash` tells the OS to use bash.

</details>

---

**Q2:** What does `${2:-"default"}` mean?

- A) The variable `2` minus `"default"`
- B) Use `$2` if provided, otherwise use `"default"`
- C) Set variable 2 to `"default"`
- D) Delete variable 2

<details>
<summary><b>Answer</b></summary>

**B** — This is bash's default value syntax. If `$2` is not provided (or empty), it uses `"default"` instead.

</details>

---

**Q3:** What does `$?` contain after running a command?

- A) The command's output
- B) The command's name
- C) The exit code (0 = success, non-zero = failure)
- D) The command's process ID

<details>
<summary><b>Answer</b></summary>

**C** — `$?` holds the exit code of the last command. Convention: `0` = success, anything else = failure. You can use it in conditionals:
```bash
grep "error" logfile.txt
if [ $? -eq 0 ]; then
    echo "Errors found!"
fi
```

</details>

---

