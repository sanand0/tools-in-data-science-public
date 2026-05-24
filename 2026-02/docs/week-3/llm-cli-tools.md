# LLM CLI Tools

CLI tools for LLMs bring AI into your existing shell workflows. Pipe text in, get structured answers out. No Python script needed for quick tasks.

---

## Simon Willison's `llm` CLI

`llm` is the most popular CLI for querying language models from the terminal. It supports 50+ models via plugins and works seamlessly with Unix pipes.

### Installation

```bash
# Install with UV (recommended)
uv tool install llm

# Or with pip
pip install llm

# Verify
llm --version
```

### Setting Up API Keys

```bash
# OpenAI (default model)
llm keys set openai
# → Paste your sk-... key

# Anthropic
llm install llm-anthropic
llm keys set anthropic
# → Paste your sk-ant-... key

# Google Gemini
llm install llm-gemini
llm keys set gemini
# → Paste your AIza... key

# Ollama (local — no key needed)
llm install llm-ollama
# Ollama must be running: ollama serve
```

### Basic Usage

```bash
# Simple query (uses default model)
llm "What is the difference between TCP and UDP?"

# Specify a model
llm -m claude-sonnet-4-6 "Explain Docker in one sentence."
llm -m gpt-4o-mini "Summarize this: $(cat readme.md)"
llm -m gemini-2.0-flash "What is 847 × 293?"

# Ollama (local, free)
llm -m ollama/llama3.2 "Write a haiku about Python."

# List all available models
llm models list
```

### The Power: Unix Pipes

```bash
# Summarize a file
cat long_document.txt | llm "Summarize this in 5 bullet points"

# Explain code
cat main.py | llm "Explain what this code does and find any bugs"

# Fix a Python error
python script.py 2>&1 | llm "This is a Python error. What is the fix?"

# Translate a file
cat README.md | llm "Translate this to Hindi"

# Generate commit messages
git diff --staged | llm "Write a concise git commit message for these changes"

# Review PR diffs
gh pr diff 42 | llm -m claude-sonnet-4-6 "Review this PR. Focus on bugs and security issues."

# Summarize logs
tail -n 100 /var/log/app.log | llm "Summarize these logs. Flag any errors or anomalies."

# Convert formats
cat data.csv | llm "Convert this CSV to a Markdown table"

# Extract structured data
cat invoice.txt | llm "Extract: vendor name, amount, date. Output as JSON."
```

### System Prompts and Templates

```bash
# Use a system prompt
llm -s "You are a senior Python code reviewer. Be direct and critical." \
    "$(cat main.py)"

# Save a template
llm templates edit code-reviewer
```

```yaml
# Template format (YAML in your editor)
system: |
  You are an expert code reviewer. For each issue you find, provide:
  1. The line number
  2. The problem
  3. The fix
model: claude-sonnet-4-6
```

```bash
# Use the template
cat main.py | llm -t code-reviewer

# Create a "commit message" template
llm templates edit commit-msg
# system: "Write a concise, imperative git commit message. Max 72 chars for subject line."
```

### Conversations

```bash
# Start a conversation (maintains history in session)
llm chat -m claude-sonnet-4-6

# Or continue the last conversation
llm -c "What was the last thing I asked about?"

# Named conversation
llm -s "You are a Python tutor" --conversation my-python-session "What is a generator?"
llm -c --conversation my-python-session "Give me an example."
```

### Logging and History

```bash
# All queries are logged by default
llm logs                # show recent queries
llm logs -n 20          # last 20
llm logs --json         # as JSON
llm logs --json | jq '.[] | {prompt, response}'  # pipe to jq

# The logs database is at:
# ~/.config/io.datasette.llm/logs.db

# Query it with datasette
datasette ~/.config/io.datasette.llm/logs.db
```

---

## aichat

`aichat` is a feature-rich terminal AI client with a built-in shell integration mode.

### Installation

```bash
# macOS
brew install aichat

# Linux / Windows — download from releases
# https://github.com/sigoden/aichat/releases

# Or cargo (Rust)
cargo install aichat
```

### Configuration

```yaml title="~/.config/aichat/config.yaml"
model: claude:claude-sonnet-4-6
# or: openai:gpt-4o-mini
# or: ollama:llama3.2

clients:
  - type: claude
    api_key: sk-ant-...
  - type: openai
    api_key: sk-...
  - type: ollama
    api_base: http://localhost:11434
```

### Usage

```bash
# Basic query
aichat "Explain async/await in Python"

# Pipe input
cat script.py | aichat "Review this code"

# Shell integration — generates and executes shell commands
aichat --execute "list all Python files modified in the last 7 days"
# → finds ls/find command, shows it, asks before running

# RAG mode — chat with files
aichat --file report.pdf "What are the key findings?"
aichat --file *.py "Which file has the most functions?"

# Role
aichat --role code-reviewer "$(cat main.py)"
```

### Shell Integration (The Killer Feature)

```bash
# Add to ~/.bashrc or ~/.zshrc
# Press Alt+E on any command to get aichat to explain it
# Press Alt+R to get a command suggestion

# Or use the ask function
ask() {
    aichat --execute "$@"
}

# Now you can:
ask "compress all png files in current directory to 80% quality"
# → shows: find . -name "*.png" | xargs mogrify -quality 80
# → asks: Execute? [y/N]
```

---

## Shell Pipelines and Automation

Combine `llm` with standard Unix tools for powerful automation:

### Daily Changelog Generator

```bash
#!/usr/bin/env bash
# daily-summary.sh — run with cron

DATE=$(date +%Y-%m-%d)

# Get git activity
GIT_LOG=$(git log --since=yesterday --oneline 2>/dev/null || echo "No git repo")

# Get system metrics
DISK=$(df -h / | tail -1)
MEMORY=$(free -h | grep Mem)

# Generate summary with LLM
SUMMARY=$(echo "
Date: $DATE
Git commits since yesterday:
$GIT_LOG

System metrics:
Disk: $DISK
Memory: $MEMORY
" | llm -s "Generate a brief daily technical summary from this data. Be concise." \
    -m claude-haiku-4-5-20251001)

# Save and commit
echo "$SUMMARY" > "summaries/$DATE.md"
git add "summaries/$DATE.md"
git commit -m "daily summary: $DATE"
echo "Summary saved and committed."
```

### Code Review Pipeline

```bash
#!/usr/bin/env bash
# review-pr.sh PULL_REQUEST_NUMBER

PR_NUMBER=$1
if [ -z "$PR_NUMBER" ]; then
    echo "Usage: $0 <pr-number>"
    exit 1
fi

echo "Fetching PR #$PR_NUMBER..."
PR_DIFF=$(gh pr diff "$PR_NUMBER")
PR_DESC=$(gh pr view "$PR_NUMBER" --json body -q '.body')

echo "Reviewing with Claude..."
REVIEW=$(echo "
PR Description:
$PR_DESC

Changes:
$PR_DIFF
" | llm -m claude-sonnet-4-6 \
    -s "You are a senior engineer reviewing a pull request. Be specific and constructive.
Format your review as:
## Summary
## Issues Found
## Suggestions
## Verdict (Approve / Request Changes / Needs Discussion)")

echo "$REVIEW"

# Optionally post the review
read -p "Post this review to GitHub? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    gh pr review "$PR_NUMBER" --comment --body "$REVIEW"
fi
```

### Batch Document Processing

```bash
#!/usr/bin/env bash
# extract-from-pdfs.sh — extract structured data from many PDFs

mkdir -p output

for pdf in docs/*.pdf; do
    base=$(basename "$pdf" .pdf)
    echo "Processing: $pdf"

    # Extract text with pdftotext, then process with LLM
    pdftotext "$pdf" - | \
        llm -m claude-haiku-4-5-20251001 \
        "Extract this information as JSON:
        {
          \"title\": \"document title\",
          \"date\": \"YYYY-MM-DD or null\",
          \"authors\": [\"list of authors\"],
          \"key_points\": [\"3-5 bullet points\"],
          \"category\": \"technical|legal|financial|other\"
        }
        Output ONLY valid JSON, no other text." \
        > "output/${base}.json"

    echo "  → output/${base}.json"
done

# Combine all JSON files
jq -s '.' output/*.json > output/combined.json
echo "Combined $(ls output/*.json | wc -l) documents into output/combined.json"
```

---

## Choosing the Right Tool

| Task | Best Tool |
|------|-----------|
| Quick one-off queries | `llm "..."` |
| Piping command output | `cmd | llm "..."` |
| Reusable templates | `llm -t template-name` |
| Shell command generation | `aichat --execute "..."` |
| Multi-file chat | `aichat --file` |
| Long conversations | `llm chat` or `aichat` interactive |
| Automation scripts | `llm` in bash scripts |

---

## Summary

```bash
# Most important commands to remember:
llm keys set anthropic                          # configure API key
llm "your question"                             # basic query
cat file.txt | llm "instruction"               # pipe text
git diff | llm "write commit message"          # pipe git output
llm -m claude-sonnet-4-6 "..."                 # specific model
llm chat                                       # conversation mode
llm logs                                       # query history
aichat --execute "do this in shell"            # shell command generation
```