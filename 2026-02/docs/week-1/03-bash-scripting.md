# Bash Scripting — Practical Notes

Bash is useful because every Linux server, Docker container, CI runner, and cloud VM gives you a shell. Python is better for large programs, but Bash excels at gluing commands together: download → filter → transform → run script → save logs → schedule daily job. The core idea: **small commands + pipes + files + automation**.

---

## 1. How the terminal reads your command

When you type:

```bash
echo "hello $USER" > out.txt
```

Bash roughly does this:

```bash
# 1. Read the line
echo "hello $USER" > out.txt

# 2. Split into words, but respect quotes
# command = echo
# argument = "hello $USER"
# redirect stdout to out.txt

# 3. Expand variables
# $USER becomes your username

# 4. Run the command
# echo receives one argument: hello hritil

# 5. Redirect output
# output goes into out.txt instead of screen
```

Important rule:

```bash
name="TDS Student"

echo $name
# Bad habit: unquoted variable can split into multiple words

echo "$name"
# Good habit: always quote variables unless you intentionally want splitting

echo '$name'
# Single quotes mean literal text, output: $name
```

Bash treats spaces as separators unless protected by quotes.

```bash
mkdir my folder
# Creates two folders: my and folder

mkdir "my folder"
# Creates one folder: my folder
```

---

## 2. Shebang, executable script, and strict mode

Create your first script:

```bash
nano hello.sh
```

Put this inside:

```bash
#!/usr/bin/env bash
set -euo pipefail

name="${1:-world}"

echo "Hello, ${name}!"
```

Run it:

```bash
chmod +x hello.sh

./hello.sh
# Hello, world!

./hello.sh TDS
# Hello, TDS!
```

Understand the first two lines:

```bash
#!/usr/bin/env bash
# Use bash from the system PATH

set -euo pipefail
# -e: stop script when a command fails
# -u: error if using an undefined variable
# -o pipefail: fail pipeline if any command inside pipe fails
```

Always start scripts with strict mode — it makes scripts fail loudly instead of continuing silently with errors.

---

## 3. Variables, command output, arithmetic

```bash
#!/usr/bin/env bash
set -euo pipefail

course="TDS"
today="$(date +%F)"
count=$((3 + 4))

echo "Course: $course"
echo "Today: $today"
echo "Count: $count"
```

Useful variable patterns:

```bash
name="${1:-guest}"
# Use first argument; if missing, use guest

file="${2:?Please provide file path}"
# If second argument missing, stop with message

length="${#name}"
# Length of string

new_name="${name/student/developer}"
# Replace first occurrence of student with developer
```

---

## 4. Arguments and options

Basic positional arguments:

```bash
#!/usr/bin/env bash
set -euo pipefail

input="${1:?Usage: $0 <input-file>}"
output="${2:-output.txt}"

echo "Input file: $input"
echo "Output file: $output"
```

Run:

```bash
./convert.sh data.csv result.txt
# input = data.csv, output = result.txt

./convert.sh data.csv
# input = data.csv, output = output.txt
```

Now a practical script with options:

```bash
#!/usr/bin/env bash
set -euo pipefail

dry_run=false
verbose=false
file=""

usage() {
  echo "Usage: $0 --file FILE [--dry-run] [--verbose]"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --file)
      file="${2:-}"
      shift 2
      ;;
    --dry-run)
      dry_run=true
      shift
      ;;
    --verbose)
      verbose=true
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      ;;
  esac
done

[[ -z "$file" ]] && usage
[[ ! -f "$file" ]] && echo "File not found: $file" >&2 && exit 1

if [[ "$verbose" == true ]]; then
  echo "Processing file: $file"
fi

if [[ "$dry_run" == true ]]; then
  echo "Dry run only. No changes made."
else
  wc -l "$file"
fi
```

Run:

```bash
chmod +x process.sh

./process.sh --file app.log
./process.sh --file app.log --verbose
./process.sh --file app.log --dry-run
```

---

## 5. If-else, tests, loops

Use `[[ ... ]]` for conditions.

```bash
#!/usr/bin/env bash
set -euo pipefail

path="${1:-.}"

if [[ -f "$path" ]]; then
  echo "It is a file"
elif [[ -d "$path" ]]; then
  echo "It is a directory"
else
  echo "Not found: $path" >&2
  exit 1
fi
```

Common tests:

```bash
[[ -f "$file" ]]
# file exists

[[ -d "$dir" ]]
# directory exists

[[ -z "$text" ]]
# string is empty

[[ -n "$text" ]]
# string is not empty

[[ "$a" == "$b" ]]
# strings equal

[[ "$num" -gt 10 ]]
# number greater than 10
```

Loops:

```bash
for file in *.csv; do
  echo "Processing $file"
  wc -l "$file"
done
```

Safe line-by-line reading:

```bash
while IFS= read -r line; do
  echo "Line: $line"
done < input.txt
```

`case` is cleaner than many `if` checks:

```bash
command="${1:-help}"

case "$command" in
  start)
    echo "Starting service"
    ;;
  stop)
    echo "Stopping service"
    ;;
  restart)
    echo "Restarting service"
    ;;
  *)
    echo "Usage: $0 {start|stop|restart}"
    exit 1
    ;;
esac
```

---

## 6. Pipes and redirects

A pipe sends output of one command into another command.

```bash
cat app.log | grep "ERROR" | wc -l
# read file -> keep ERROR lines -> count lines
```

Better version:

```bash
grep "ERROR" app.log | wc -l
# Avoid useless cat when command can read file directly
```

Common redirects:

```bash
python script.py > output.txt
# stdout to file, overwrite

python script.py >> output.txt
# stdout to file, append

python script.py 2> error.log
# stderr to file

python script.py > output.log 2> error.log
# stdout and stderr separate

python script.py > all.log 2>&1
# stdout and stderr together

python script.py &> all.log
# shorter Bash syntax for both stdout and stderr
```

Success/failure chaining:

```bash
mkdir data && cd data
# cd only runs if mkdir succeeds

grep "ERROR" app.log || echo "No errors found"
# second command runs only if grep fails
```

Pipeline mental model:

```mermaid
flowchart LR
    A[file / stdin] --> B[command 1]
    B --> C[command 2]
    C --> D[command 3]
    D --> E[screen / file / stdout]
    B -- stderr --> F[error.log]
```

Example:

```bash
grep "ERROR" app.log \
  | cut -d' ' -f1,2 \
  | sort \
  | uniq -c \
  | sort -rn
```

---

## 7. Text processing: grep, tr, jq, bc, sed, awk

`grep` finds matching lines.

```bash
grep "ERROR" app.log
# lines containing ERROR

grep -i "error" app.log
# case-insensitive

grep -v "DEBUG" app.log
# exclude DEBUG lines

grep -n "TODO" *.py
# show line number

grep -r "api_key" .
# recursive search

grep -E "user_[0-9]+" users.txt
# extended regex
```

`tr` transforms characters.

```bash
echo "hello world" | tr 'a-z' 'A-Z'
# HELLO WORLD

echo "A,B,C" | tr ',' '\n'
# A
# B
# C

cat file.txt | tr -d '\r'
# remove Windows carriage return characters

cat file.txt | tr -s ' '
# squeeze repeated spaces into one space
```

`jq` processes JSON from the command line — extremely useful since most APIs and web services return JSON.

```bash
curl -s https://api.github.com/users/octocat | jq .
# pretty-print JSON

curl -s https://api.github.com/users/octocat | jq -r '.name'
# extract name as raw text

jq '.users[] | select(.active == true)' users.json
# filter active users

jq -r '.users[] | [.id, .name, .email] | @csv' users.json
# convert JSON array to CSV
```

Example JSON file:

```bash
cat > users.json <<'EOF'
{
  "users": [
    {"id": 1, "name": "Asha", "active": true},
    {"id": 2, "name": "Ravi", "active": false},
    {"id": 3, "name": "Mira", "active": true}
  ]
}
EOF

jq -r '.users[] | select(.active == true) | .name' users.json
# Asha
# Mira
```

`bc` is for calculator-style arithmetic, especially decimals.

```bash
echo "2 + 3" | bc
# 5

echo "10 / 3" | bc
# 3

echo "scale=2; 10 / 3" | bc
# 3.33

price=99
tax=18

echo "scale=2; $price + ($price * $tax / 100)" | bc
# 116.82
```

`sed` edits streams.

```bash
sed 's/error/ERROR/' app.log
# replace first error per line

sed 's/error/ERROR/g' app.log
# replace all errors per line

sed -n '10,20p' app.log
# print lines 10 to 20

sed '/^$/d' notes.txt
# remove empty lines
```

`awk` is great for columns.

```bash
awk '{print $1}' data.txt
# first column

awk -F',' '{print $2}' data.csv
# second CSV column

awk '$3 > 100 {print $1, $3}' data.txt
# print rows where third column > 100

awk '{sum += $2} END {print sum}' marks.txt
# sum second column
```

Mini real pipeline:

```bash
grep "ERROR" app.log \
  | awk '{print $1, $2}' \
  | sort \
  | uniq -c \
  | sort -rn
# Count errors by date/time fields
```

---

## 8. Export, environment variables, `.env`

Shell variables stay in current shell unless exported.

```bash
API_KEY="abc123"
python app.py
# app.py may not receive API_KEY

export API_KEY="abc123"
python app.py
# app.py can read API_KEY from environment
```

Set variable for one command only:

```bash
API_KEY="abc123" python app.py
# API_KEY exists only for this command
```

View variables:

```bash
echo "$PATH"

env | grep API

printenv HOME
```

`.env` file:

```bash
cat > .env <<'EOF'
API_KEY=replace_me
DATABASE_URL=postgres://user:pass@localhost:5432/db
DEBUG=true
EOF
```

Load `.env` into shell:

```bash
set -a
source .env
set +a
```

Safe project habit:

```bash
echo ".env" >> .gitignore

cat > .env.example <<'EOF'
API_KEY=your_api_key_here
DATABASE_URL=postgres://user:pass@host:5432/db
DEBUG=true
EOF
```

Never commit real secrets to Git. Commit `.env.example` with placeholder values so others know what's needed.

---

## 9. Cron jobs

Cron schedules scripts.

Open cron editor:

```bash
crontab -e
```

List jobs:

```bash
crontab -l
```

Cron format:

```bash
# minute hour day-of-month month day-of-week command
# m      h    dom          mon   dow         command
```

Examples:

```bash
0 9 * * * /home/me/scripts/daily.sh
# Run every day at 09:00

*/5 * * * * /home/me/scripts/heartbeat.sh
# Run every 5 minutes

0 0 * * 0 /home/me/scripts/weekly-backup.sh
# Run every Sunday at midnight
```

Good cron style:

```bash
0 9 * * * cd /home/me/project && /usr/bin/env bash ./run.sh >> /home/me/project/cron.log 2>&1
```

Why this style?

```bash
cd /home/me/project
# Cron may start from a different directory

/usr/bin/env bash ./run.sh
# Use clear command path

>> cron.log 2>&1
# Save stdout and stderr for debugging
```

Cron has a smaller environment than your terminal, so do not assume your normal aliases, PATH, or activated virtual environment exists.

---

## 10. One complete beginner-friendly practical script

Goal: create a script that reads a log file, counts errors, extracts JSON status, supports options, and writes logs.

Create sample files:

```bash
cat > app.log <<'EOF'
2026-06-15 INFO app started
2026-06-15 ERROR database failed
2026-06-15 DEBUG retrying
2026-06-15 ERROR timeout
EOF

cat > response.json <<'EOF'
{
  "service": "api",
  "status": "ok",
  "latency_ms": 123.45
}
EOF
```

Create script:

```bash
nano report.sh
```

Paste:

```bash
#!/usr/bin/env bash
set -euo pipefail

log_file="app.log"
json_file="response.json"
dry_run=false
out_file="report.txt"

usage() {
  echo "Usage: $0 [--log FILE] [--json FILE] [--out FILE] [--dry-run]"
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --log)
      log_file="${2:?Missing log file}"
      shift 2
      ;;
    --json)
      json_file="${2:?Missing json file}"
      shift 2
      ;;
    --out)
      out_file="${2:?Missing output file}"
      shift 2
      ;;
    --dry-run)
      dry_run=true
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      ;;
  esac
done

[[ -f "$log_file" ]] || { echo "Missing log file: $log_file" >&2; exit 1; }
[[ -f "$json_file" ]] || { echo "Missing JSON file: $json_file" >&2; exit 1; }

error_count="$(grep -c "ERROR" "$log_file" || true)"
service="$(jq -r '.service' "$json_file")"
status="$(jq -r '.status' "$json_file")"
latency="$(jq -r '.latency_ms' "$json_file")"
latency_sec="$(echo "scale=3; $latency / 1000" | bc)"

if [[ "$dry_run" == true ]]; then
  echo "Would write report to $out_file"
  exit 0
fi

{
  echo "Report generated at: $(date -Iseconds)"
  echo "Log file: $log_file"
  echo "JSON file: $json_file"
  echo "Error count: $error_count"
  echo "Service: $service"
  echo "Status: $status"
  echo "Latency seconds: $latency_sec"
} > "$out_file"

echo "Report written to $out_file"
```

Run:

```bash
chmod +x report.sh

./report.sh
cat report.txt

./report.sh --dry-run

./report.sh --log app.log --json response.json --out final-report.txt
cat final-report.txt
```

This one script uses: shebang, strict mode, variables, arguments, options, if checks, grep, jq, bc, redirection, and safe error handling.

---

## 11. Practical safety habits

Use these almost always:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

Quote variables:

```bash
rm "$file"
# Good

rm $file
# Risky if file has spaces or is empty
```

Check dangerous variables before deleting:

```bash
dir="${1:?Directory required}"

[[ "$dir" == "/" ]] && { echo "Refusing to delete /"; exit 1; }

rm -rf "$dir"
```

Prefer logs in automation:

```bash
./script.sh >> script.log 2>&1
```

Use ShellCheck to catch bugs before they cause damage:

```bash
# Install
sudo apt install shellcheck

# Check a script
shellcheck script.sh
```

ShellCheck finds things like unquoted variables, wrong test syntax (`[ ]` vs `[[ ]]`), and missing semicolons. Run it before deploying any script.

---

## 12. Small practice path

Do these in order:

```bash
# 1. Create hello.sh with one argument and default value

# 2. Create check-path.sh that says file, directory, or missing

# 3. Create count-errors.sh that accepts a log file and counts ERROR lines

# 4. Create json-name.sh that extracts one field from a JSON file using jq

# 5. Create report.sh that combines grep + jq + bc and writes report.txt

# 6. Add --dry-run and --out options

# 7. Schedule report.sh in cron and write output to cron.log
```

The core Bash skill is not memorizing everything. It is knowing this flow:

```text
input files / APIs
      ↓
small shell commands
      ↓
pipes and filters
      ↓
variables and conditions
      ↓
script with arguments
      ↓
logs and cron automation
```

Keep scripts small. When logic becomes too complex, move the heavy work to Python and use Bash to run, connect, schedule, and monitor it.

## Important Q&A

**Q: Why do I need `set -euo pipefail`?**
A: By default, Bash continues running even if commands fail, and pipes hide errors from earlier commands. `set -euo pipefail` makes your scripts stop immediately when errors or undefined variables occur, preventing dangerous mistakes (like deleting the wrong directory).

**Q: Should I use `cat file.txt | grep "text"`?**
A: No, this is called "Useless Use of Cat". `grep` and many other tools can read files directly. It is better and faster to write `grep "text" file.txt`.

**Q: Why must I quote my variables like `"$name"`?**
A: Without quotes, Bash performs "word splitting" on the variable's contents, breaking spaces into separate arguments. Quoting variables preserves them exactly as one string, preventing unexpected command arguments.

## Final revision checklist

```text
[ ] I know how to make a script executable with `chmod +x`.
[ ] I always start scripts with `#!/usr/bin/env bash` and `set -euo pipefail`.
[ ] I understand the difference between `>`, `>>`, and `2>&1` for redirects.
[ ] I can use `jq` to parse and extract data from JSON files.
[ ] I quote my variables to prevent word splitting.
[ ] I test my scripts manually before adding them to `cron`.
```
