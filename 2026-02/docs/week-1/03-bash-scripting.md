# 03 · Bash Scripting

?> **TL;DR**
?> Bash is the most common shell on Linux and macOS. Learning to pipe commands, manipulate text, and schedule jobs will 10× your productivity on every server you ever touch.

## Why Bash?

Every Linux server, every Docker container, every CI runner has a shell. Your Python scripts can do anything — but to **glue** them together (download a file, run a script, upload results, email you when done), Bash is usually the easiest tool. Bash is everywhere, it's already installed, and it doesn't require a virtual environment.

[![Bash Scripting Full Course in 3 Hours](https://img.youtube.com/vi/I4EWvMFj37g/0.jpg)](https://youtu.be/I4EWvMFj37g "Bash Scripting Full Course in 3 Hours")

## The Shebang and the Basics

Every script starts with a **shebang**:

```bash title="hello.sh"
#!/usr/bin/env bash
set -euo pipefail             # strict mode — fail early

name="${1:-world}"            # first arg, or 'world' if not given
echo "Hello, ${name}!"
```

Make it executable and run:

```bash
chmod +x hello.sh
./hello.sh                    # Hello, world!
./hello.sh TDS                # Hello, TDS!
```

?> **The strict mode line**
?> `set -euo pipefail` is non-negotiable:
?> - `-e` — exit immediately on any error
?> - `-u` — error on undefined variable
?> - `-o pipefail` — fail if any command in a pipe fails
?> Without these, silent failures will bite you.

## Pipes and Redirects — The Unix Philosophy

A pipe (`|`) sends the output of one command to the input of the next. Chain small tools to do big things.

```bash
# Three tools, one line
cat access.log | grep "ERROR" | wc -l
#  read file  |   keep errors  | count lines
```

| Operator | Meaning |
|----------|---------|
| `cmd1 \| cmd2` | Stdout of `cmd1` → stdin of `cmd2` |
| `cmd > file` | Redirect stdout to file (overwrite) |
| `cmd >> file` | Redirect stdout to file (append) |
| `cmd < file` | Read file into stdin |
| `cmd 2> err.log` | Redirect stderr |
| `cmd &> all.log` | Redirect both stdout + stderr |
| `cmd > file 2>&1` | Older syntax, same effect |
| `cmd1 && cmd2` | Run `cmd2` only if `cmd1` succeeds |
| `cmd1 \|\| cmd2` | Run `cmd2` only if `cmd1` fails |

## Variables, Quoting, and Substitution

```bash
name="Alice"
files=$(ls *.txt)             # command substitution
count=$(( 3 + 4 ))            # arithmetic

echo "Hello, $name"           # Hello, Alice
echo 'Hello, $name'           # Hello, $name (no expansion in single quotes!)
echo "Files: ${files}"
echo "Total: ${count}"
```

| Syntax | Purpose |
|--------|---------|
| `"$var"` | Always quote variables to handle spaces |
| `${var:-default}` | Use `default` if `var` is unset |
| `${var:=default}` | Set `var` to `default` if unset |
| `${var:?err message}` | Exit with error if unset |
| `${#var}` | String length |
| `${var/old/new}` | Replace first match |

## Control Flow

```bash title="example.sh"
#!/usr/bin/env bash
set -euo pipefail

# if / else
if [[ -f "config.yml" ]]; then
  echo "found config"
elif [[ -d "config/" ]]; then
  echo "found config dir"
else
  echo "no config" >&2
  exit 1
fi

# for loop over files
for f in *.csv; do
  echo "Processing $f..."
  python process.py "$f"
done

# while loop
while IFS= read -r line; do
  echo "Line: $line"
done < input.txt

# case
case "$1" in
  start) echo "starting..." ;;
  stop)  echo "stopping..." ;;
  *)     echo "unknown" ;;
esac
```

Common test conditions inside `[[ ... ]]`:

| Test | Meaning |
|------|---------|
| `-f path` | File exists |
| `-d path` | Directory exists |
| `-z "$s"` | String is empty |
| `-n "$s"` | String is non-empty |
| `"$a" == "$b"` | String equal |
| `"$a" == pattern*` | Glob match |
| `$a -eq $b` | Numeric equal (`-lt`, `-gt`, `-le`, `-ge`) |

## The Text-Processing Trio: `grep`, `sed`, `awk`

### `grep` — Find lines matching a pattern

```bash
grep "ERROR" app.log                  # lines containing ERROR
grep -i "error" app.log                # case-insensitive
grep -v "DEBUG" app.log                # lines NOT matching
grep -n "TODO" *.py                    # with line numbers, across files
grep -r "api_key" src/                 # recursive
grep -E "^user_(\d+)$" data.txt        # extended regex
```

### `sed` — Stream editor (find and replace)

```bash
sed 's/foo/bar/' file.txt              # replace first occurrence per line
sed 's/foo/bar/g' file.txt             # replace all occurrences
sed -i 's/foo/bar/g' file.txt          # edit file in place (macOS: sed -i '' ...)
sed -n '10,20p' file.txt               # print lines 10-20
sed '/^$/d' file.txt                   # delete empty lines
```

### `awk` — Column-oriented processing

```bash
awk '{print $1}' data.txt              # first column
awk -F',' '{print $2}' data.csv        # 2nd col, comma delimiter
awk '$3 > 100' data.txt                # rows where col 3 > 100
awk '{sum += $2} END {print sum}' data.txt   # sum col 2
```

## `jq` — The JSON Swiss Army Knife

Install: `brew install jq` / `sudo apt install jq`.

```bash
# GitHub API → pretty-print
curl -s https://api.github.com/users/octocat | jq .

# Extract one field
curl -s https://api.github.com/users/octocat | jq -r .name

# Filter an array
jq '.[] | select(.active == true)' users.json

# Transform an object shape
jq '{id, title: .name, when: .created_at}' repos.json

# Output as CSV
jq -r '.[] | [.id, .name] | @csv' users.json
```

?> **jq is the most underrated CLI tool**
?> Every API in the world returns JSON. `jq` lets you slice it from the shell without writing Python. Bookmark [jqplay.org](https://jqplay.org/) as a playground.

## Environment Variables

```bash
# Set for the current shell
export API_KEY="sk-..."

# Set for one command only
API_KEY="sk-..." python run.py

# Load from .env file
set -a; source .env; set +a

# Show all
env | grep API
```

`.env` file format (used by UV, Docker, `python-dotenv`, and most tools):

```bash title=".env"
API_KEY=sk-...
DATABASE_URL=postgres://...
DEBUG=true
```

!> **Never commit secrets**
!> Add `.env` to `.gitignore`. Commit `.env.example` (with fake values) so teammates know what's expected.

## `cron` — Schedule Recurring Jobs

Every Linux server has `cron`. Each line in your "crontab" is one scheduled job:

```
# m  h  dom  mon  dow  command
  0  9  *    *    *    /home/me/bin/daily-summary.sh
  */5 *  *    *    *   /home/me/bin/heartbeat.sh
  0  0  *    *    0    /home/me/bin/weekly-backup.sh
```

| Field | Values |
|-------|--------|
| m | minute (0–59) |
| h | hour (0–23) |
| dom | day of month (1–31) |
| mon | month (1–12) |
| dow | day of week (0–7, 0 and 7 are Sunday) |

Edit your crontab:

```bash
crontab -e          # open in $EDITOR
crontab -l          # list current jobs
crontab -r          # remove all (careful!)
```

?> **Debugging cron**
?> Cron runs in a stripped environment. Always use full paths (`/usr/bin/python3`, not `python3`), redirect both streams to a log file, and `cd` to your project directory first:
?> ```bash
?> 0 9 * * * cd /home/me/project && /usr/bin/env bash ./run.sh >> /var/log/myjob.log 2>&1
?> ```

## Functions, Arguments, and Exit Codes

```bash title="deploy.sh"
#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Usage: $0 <env> [--dry-run]
  env      target environment (staging|prod)
  --dry-run  print commands without running
EOF
  exit 1
}

log() { echo "[$(date +%H:%M:%S)] $*"; }

deploy() {
  local env="$1"
  local dry="${2:-false}"
  log "Deploying to $env (dry=$dry)"
  # ...
}

[[ $# -lt 1 ]] && usage
env="$1"
dry_run="false"
[[ "${2:-}" == "--dry-run" ]] && dry_run="true"

deploy "$env" "$dry_run"
```

## Writing Safe Scripts — ShellCheck

[ShellCheck](https://www.shellcheck.net/) catches the non-obvious bugs Bash lets you write. Install + run:

```bash
brew install shellcheck     # or apt install shellcheck
shellcheck deploy.sh
```

It'll warn on unquoted variables, wrong test syntax, subshell mistakes, and more. Wire it into your editor or CI.

## 5-Minute Exercise

Write a script `top-files.sh` that:

1. Accepts a directory as first arg (default: current dir).
2. Finds the 5 largest files inside it.
3. Prints them as `<size>  <path>`.
4. Writes a log line to `~/top-files.log` with date + command.

<details>
<summary>Solution</summary>

```bash title="top-files.sh"
#!/usr/bin/env bash
set -euo pipefail

dir="${1:-.}"
log="$HOME/top-files.log"

echo "$(date -Iseconds)  top-files.sh $dir" >> "$log"

find "$dir" -type f -printf "%s  %p\n" 2>/dev/null \
  | sort -rn \
  | head -5 \
  | awk '{ printf "%10d  %s\n", $1, $2 }'
```

(On macOS `find` doesn't support `-printf`; use `find ... -exec stat -f '%z %N' {} \;` instead.)
</details>

## Further Reading

- [Bash Reference Manual (GNU)](https://www.gnu.org/software/bash/manual/)
- [ShellCheck wiki](https://www.shellcheck.net/wiki/)
- [jq manual](https://jqlang.github.io/jq/manual/)
- [Unix Shell / Bash cheatsheet](https://devhints.io/bash)
- [Explainshell](https://explainshell.com/) — paste any shell command, get a breakdown