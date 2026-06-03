# Lab 1.3 — Bash Automation: Daily Project Summary

?> **What you'll build**
?> A `bash` script that runs every day (via `cron` locally, or on a schedule via GitHub Actions), computes a summary of the last 24 hours of Git activity across one or more repositories, renders it as a nicely formatted Markdown file, and auto-commits it to a "dashboard" repo.

**Time:** 45–60 minutes.
**Difficulty:** ⭐⭐☆☆☆.
**Ship:** a `daily-summaries/` folder in a GitHub repo that grows with a new dated Markdown file every morning — fully automated.

## What the Finished Thing Looks Like

Every morning at 9:00 AM local time, a new file appears in your repo:

```
daily-summaries/
├── 2026-05-10.md
├── 2026-05-11.md
├── 2026-05-12.md     ← just created by the script
└── ...
```

With contents like:

```markdown
# Daily Summary — 2026-05-12

## Commits (last 24h): 4

- abc1234 · feat: add rate limiter (Alice)
- def5678 · fix: typo in README (Bob)
- ...

## Lines changed
- +142 / -28

## Active branches
- main, feature/auth

## Top authors
- Alice (3)
- Bob (1)
```

## Prerequisites

- Bash 4+ and `git` installed (verify: `bash --version`, `git --version`).
- A GitHub account + `gh` CLI authenticated.
- A repo you can write to (can be a dummy repo you create just for this lab).

---

## The Steps

<details>
<summary><b>Step 1 — Set up the dashboard repo</b></summary>

```bash
mkdir tds-daily-YOURNAME && cd tds-daily-YOURNAME
git init
echo "# Daily summaries" > README.md
mkdir daily-summaries bin
gh repo create tds-daily-YOURNAME --public --source=. --remote=origin --push
```

Create a `.gitignore`:

```gitignore title=".gitignore"
*.log
*.tmp
.DS_Store
```

</details>

<details>
<summary><b>Step 2 — Write the summary script (core logic)</b></summary>

Create `bin/daily-summary.sh` — make it executable:

```bash title="bin/daily-summary.sh"
#!/usr/bin/env bash
#
# daily-summary.sh — Generate a Markdown summary of recent Git activity.
#
# Usage: daily-summary.sh [--repo /path/to/repo] [--out /path/to/output/dir]
#

set -euo pipefail

# ----- Defaults -----
REPO_DIR="${REPO_DIR:-$(pwd)}"
OUT_DIR="${OUT_DIR:-./daily-summaries}"
SINCE="24 hours ago"

# ----- Parse args -----
while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)  REPO_DIR="$2";  shift 2 ;;
    --out)   OUT_DIR="$2";   shift 2 ;;
    --since) SINCE="$2";     shift 2 ;;
    *)       echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

mkdir -p "$OUT_DIR"
TODAY="$(date +%Y-%m-%d)"
OUT_FILE="$OUT_DIR/$TODAY.md"

# ----- Gather stats -----
cd "$REPO_DIR"

# Make sure we have latest info from origin (don't fail the script if offline)
git fetch --all --quiet || true

COMMITS=$(git log --since="$SINCE" --oneline --all | wc -l | tr -d ' ')

AUTHORS=$(
  git log --since="$SINCE" --all --pretty=format:'%an' \
    | sort | uniq -c | sort -rn \
    | awk '{count=$1; $1=""; sub(/^ /, ""); printf "- %s (%d)\n", $0, count}'
)

RECENT_COMMITS=$(
  git log --since="$SINCE" --all --pretty=format:'- `%h` · %s (%an)' \
    | head -20
)

# Lines changed (single shortstat line): "X files changed, Y insertions(+), Z deletions(-)"
STATS=$(git log --since="$SINCE" --all --shortstat --pretty=format:'' \
  | awk '
    /files? changed/ {
      for (i=1; i<=NF; i++) {
        if ($i ~ /insertion/) ins += $(i-1)
        if ($i ~ /deletion/)  del += $(i-1)
      }
    }
    END { printf "+%d / -%d\n", ins+0, del+0 }'
)

BRANCHES=$(git branch -a --sort=-committerdate \
  | grep -v HEAD \
  | head -5 \
  | sed 's/^[* ] //' \
  | paste -sd "," - \
  | sed 's/,/, /g'
)

# ----- Write output -----
cat > "$OUT_FILE" <<EOF
# Daily Summary — $TODAY

Repository: \`$(basename "$REPO_DIR")\`  
Period: last $SINCE  
Generated: $(date -Iseconds)

## Commits (last $SINCE): $COMMITS

${RECENT_COMMITS:-_No commits in this window._}

## Lines changed
- $STATS

## Active branches
- $BRANCHES

## Top authors
${AUTHORS:-_No authors in this window._}
EOF

echo "Wrote $OUT_FILE"
```

```bash
chmod +x bin/daily-summary.sh
```

</details>

<details>
<summary><b>Step 3 — Test the script locally</b></summary>

Point the script at any Git repo you have (can be the dashboard repo itself after you make a few commits, or point it at your Lab 1.1 / 1.2 repo):

```bash
# For the dashboard repo itself:
./bin/daily-summary.sh --repo "$(pwd)" --out "$(pwd)/daily-summaries"

# Or point at another repo:
./bin/daily-summary.sh --repo ~/projects/tds-hello-YOURNAME --out "$(pwd)/daily-summaries"
```

Check the output:

```bash
cat daily-summaries/$(date +%Y-%m-%d).md
```

If the file has the four sections (Commits, Lines changed, Active branches, Top authors) with real content — the core works.

</details>

<details>
<summary><b>Step 4 — Add an auto-commit wrapper</b></summary>

The summary is useless if it only lives on your laptop. Wrap the script so it commits and pushes:

```bash title="bin/run-and-push.sh"
#!/usr/bin/env bash
set -euo pipefail

# Go to the dashboard repo root (the one this script lives in).
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$REPO_ROOT"

# Optional: pull first so we don't race with a teammate.
git pull --ff-only --quiet || true

# Generate the summary for a specific target repo (pass --repo env or flag).
TARGET_REPO="${TARGET_REPO:-$REPO_ROOT}"

./bin/daily-summary.sh --repo "$TARGET_REPO" --out "$REPO_ROOT/daily-summaries"

# Commit only if something changed.
if git diff --quiet daily-summaries; then
  echo "No changes — not committing."
  exit 0
fi

TODAY="$(date +%Y-%m-%d)"
git add daily-summaries
git -c user.name="TDS Bot" \
    -c user.email="tds-bot@users.noreply.github.com" \
    commit -m "chore: daily summary for $TODAY"
git push
echo "Committed and pushed summary for $TODAY."
```

```bash
chmod +x bin/run-and-push.sh
```

Test it:

```bash
./bin/run-and-push.sh
```

You should see a commit appear on GitHub with your new summary.

</details>

<details>
<summary><b>Step 5 — Schedule locally with cron</b></summary>

Open your crontab:

```bash
crontab -e
```

Add a line — this runs the script every morning at 9:00:

```
0 9 * * *  /bin/bash -lc 'cd ~/tds-daily-YOURNAME && ./bin/run-and-push.sh >> /tmp/daily-summary.log 2>&1'
```

Explanation:

- `0 9 * * *` — minute 0, hour 9, every day, every month, any weekday.
- `/bin/bash -lc` — use bash as a login shell (loads your `PATH`, so `git` is found).
- `>> /tmp/daily-summary.log 2>&1` — append both stdout and stderr to a log.

!> **Cron doesn't run on a sleeping laptop**
!> If your laptop is asleep at 9:00, the job misses. For always-on execution, either use a small VM (Week 7 covers GCP VMs), or use GitHub Actions (Step 6).

Verify the cron entry:

```bash
crontab -l
```

To test manually without waiting 24 hours:

```bash
# Simulate a run right now
/bin/bash -lc 'cd ~/tds-daily-YOURNAME && ./bin/run-and-push.sh'

# Check the log if scheduled run has happened
tail -f /tmp/daily-summary.log
```

</details>

<details>
<summary><b>Step 6 — Schedule in GitHub Actions (cloud cron)</b></summary>

For a cron that works even if your laptop is off, use GitHub Actions. The Action runs in a cloud VM on schedule, checks out the repo, runs your script, and pushes a commit back.

Create `.github/workflows/daily-summary.yml`:

```yaml title=".github/workflows/daily-summary.yml"
name: Daily Summary

on:
  schedule:
    - cron: '0 3 * * *'      # 03:00 UTC = 08:30 IST
  workflow_dispatch:          # also allow manual trigger

permissions:
  contents: write             # needed to push back to main

jobs:
  summarize:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout dashboard repo
        uses: actions/checkout@v4
        with:
          fetch-depth: 0      # full history so commits appear in git log

      - name: Run summary script
        env:
          TARGET_REPO: ${{ github.workspace }}
        run: |
          chmod +x ./bin/*.sh
          ./bin/daily-summary.sh --repo "$TARGET_REPO" --out "$GITHUB_WORKSPACE/daily-summaries"

      - name: Commit and push if changed
        run: |
          if git diff --quiet daily-summaries; then
            echo "No changes."
            exit 0
          fi
          git config user.name  "tds-bot"
          git config user.email "tds-bot@users.noreply.github.com"
          git add daily-summaries
          git commit -m "chore: daily summary for $(date -u +%Y-%m-%d)"
          git push
```

Commit and push:

```bash
git add .github/
git commit -m "ci: schedule daily summary workflow"
git push
```

Trigger it manually **once** to confirm it works: **Actions → Daily Summary → Run workflow**.

After ~30 seconds a new commit should appear on your repo. On the next scheduled run (next morning), it happens automatically.

?> **GitHub cron is in UTC**
?> Use `0 3 * * *` for ~08:30 IST, or `30 3 * * *` for 09:00 IST. Test `crontab.guru` for readable cron expressions.

</details>

<details>
<summary><b>Step 7 — Summarize multiple repos</b></summary>

Extend the script to aggregate multiple projects. Create `bin/multi-summary.sh`:

```bash title="bin/multi-summary.sh"
#!/usr/bin/env bash
set -euo pipefail

# List of repos to summarize, one per line.
# Each line: "<git-url> <display-name>"
REPOS=(
  "https://github.com/YOUR-USERNAME/tds-hello-YOURNAME  tds-hello"
  "https://github.com/YOUR-USERNAME/tds-csv-YOURNAME    tds-csv"
)

OUT_DIR="${OUT_DIR:-./daily-summaries}"
TODAY="$(date +%Y-%m-%d)"
TMP=$(mktemp -d)

mkdir -p "$OUT_DIR"
# Make OUT_DIR absolute so subshells can find it
OUT_DIR="$(cd "$OUT_DIR" && pwd)"
OUT_FILE="$OUT_DIR/$TODAY-all.md"

{
  echo "# Daily Summary (All Repos) — $TODAY"
  echo ""
  echo "Generated: $(date -Iseconds)"
  echo ""
} > "$OUT_FILE"

for entry in "${REPOS[@]}"; do
  read -r url name <<< "$entry"
  echo "## $name" >> "$OUT_FILE"
  (
    cd "$TMP"
    git clone --quiet --depth 200 "$url" "$name" 2>/dev/null || true
    cd "$name"
    COUNT=$(git log --since="24 hours ago" --oneline | wc -l | tr -d ' ')
    echo "Commits: $COUNT" >> "$OUT_FILE"
    echo "" >> "$OUT_FILE"
    git log --since="24 hours ago" --pretty=format:'- `%h` · %s (%an)' >> "$OUT_FILE" || true
    echo "" >> "$OUT_FILE"
  )
  echo "" >> "$OUT_FILE"
done

rm -rf "$TMP"
echo "Wrote $OUT_FILE"
```

```bash
chmod +x bin/multi-summary.sh
./bin/multi-summary.sh
```

Add a new workflow or extend the existing one to call this too.

</details>

<details>
<summary><b>Step 8 — Lint your scripts with ShellCheck</b></summary>

```bash
# Install ShellCheck
brew install shellcheck   # macOS
# or
sudo apt install shellcheck   # Linux

shellcheck bin/*.sh
```

Fix any warnings. ShellCheck catches real bugs (unquoted variables, subshell gotchas, wrong test syntax) that are easy to miss.

Optional: add ShellCheck to CI:

```yaml
# .github/workflows/shellcheck.yml
name: ShellCheck
on: [push, pull_request]
jobs:
  sh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ludeeus/action-shellcheck@master
        with:
          scandir: './bin'
```

</details>

---

## Troubleshooting

<details>
<summary><b>The cron job doesn't run</b></summary>

- **Check it's scheduled:** `crontab -l`
- **Check the log:** `tail /tmp/daily-summary.log`
- **Check cron is running:** `sudo systemctl status cron` (Linux) or `sudo launchctl list | grep cron` (macOS — cron needs Full Disk Access on recent macOS).
- **Check PATH:** Cron runs with a minimal PATH. Always use `/bin/bash -lc '...'` or full paths (`/usr/bin/git`).

</details>

<details>
<summary><b>Permission denied when pushing from Actions</b></summary>

You need `permissions: contents: write` at the job level. See Step 6.

</details>

<details>
<summary><b>Git "detected dubious ownership" error</b></summary>

On GitHub Actions the repo is owned by `runner`, but Git sometimes complains. Fix:

```bash
git config --global --add safe.directory "$GITHUB_WORKSPACE"
```

</details>

<details>
<summary><b>macOS <code>sed -i</code> behaves differently</b></summary>

BSD `sed` (macOS) needs `sed -i '' 's/.../.../' file`. GNU `sed` (Linux) uses `sed -i 's/.../.../' file`. If you need cross-platform, use `sed -i.bak` and delete the `.bak` after.

</details>

---

## Knowledge Check

**Q1.** In Bash, what does `set -euo pipefail` do?
- [ ] A) It forces the script to run with root privileges
- [ ] B) It automatically formats the output as Markdown
- [ ] C) It makes the script exit immediately on errors, unset variables, and pipeline failures
- [ ] D) It redirects all errors to a log file instead of the console

<details>
<summary>Answer</summary>

**C** — `set -e` stops on errors, `-u` stops on uninitialized variables, and `-o pipefail` ensures that an error in the middle of a pipeline (e.g., `command_fails | grep foo`) causes the entire command to fail. It makes scripts much safer.
</details>

**Q2.** Which cron expression runs a job every day at exactly 9:00 AM?
- [ ] A) `* 9 * * *`
- [ ] B) `0 9 * * *`
- [ ] C) `9 0 * * *`
- [ ] D) `0 0 9 * *`

<details>
<summary>Answer</summary>

**B** — The cron format is `minute hour day month weekday`. `0 9 * * *` means the 0th minute of the 9th hour, every day.
</details>

**Q3.** Why might you use `git clone --depth 200` instead of a regular `git clone` in an automated script?
- [ ] A) It prevents the repository from being modified
- [ ] B) It forces Git to use SSH instead of HTTPS
- [ ] C) It clones only the 200 most recent commits, saving time and disk space for large repositories
- [ ] D) It downloads exactly 200 repositories simultaneously

<details>
<summary>Answer</summary>

**C** — A "shallow clone" (`--depth N`) fetches only the recent history. For a daily summary script that only looks at the last 24 hours, downloading the entire history of a 10-year-old repository would be a massive waste of resources.
</details>

---

## What You've Learned

- Writing a defensive Bash script with `set -euo pipefail`.
- Gathering project stats from `git log` with pretty-format and shortstat.
- Using AWK to aggregate lines.
- Scheduling locally via `cron` and in the cloud via **GitHub Actions scheduled workflows**.
- Auto-committing results back to the repo from a workflow.
- Validating shell scripts with ShellCheck.

## Write a Blog Post

- Compare `cron` vs GitHub Actions schedules for side projects — what are the trade-offs?
- Share the hardest bug you hit and how you debugged it.
- Post a link to your dashboard repo so others can see daily entries growing.

## Week 1 Done 🎉

You've finished all three Week 1 labs! You now have:

- A Python library live on [PyPI](https://pypi.org) ([Lab 1.1](./publish-python-library-pypi-uv)).
- A documented CLI with a PDF manual on [GitHub Pages](./uv-cli-tool-latex-docs) ([Lab 1.2](./uv-cli-tool-latex-docs)).
- A self-updating dashboard repo ([Lab 1.3](./bash-daily-project-summary)).

Next up: **Week 2 — Deployment & API Engineering**.

## References

- [Bash Reference Manual](https://www.gnu.org/software/bash/manual/)
- [crontab.guru](https://crontab.guru/) — visual cron expression builder
- [GitHub Actions `on.schedule`](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule)
- [ShellCheck](https://www.shellcheck.net/)
- [Pro Git — log formatting](https://git-scm.com/docs/pretty-formats)

---

