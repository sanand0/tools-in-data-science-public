# Command Cheatsheet

> The commands you'll actually retype. Copy, adapt, move on.

## uv — Python, without the ceremony

```bash
uv run script.py                  # run a PEP 723 script; deps install automatically
uv run --with httpx script.py     # add a one-off dependency
uvx ruff check .                  # run a tool without installing it
uvx duckdb -c "SELECT 42"         # same, for DuckDB
uv init myproject && cd myproject # new project
uv add httpx polars duckdb        # add dependencies
uv sync --frozen                  # install exactly the lockfile (use in CI)
uv python install 3.13            # install a Python version
```

The PEP 723 header that makes a single file runnable anywhere:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28"]
# ///
```

## Inspecting a site before scraping

```bash
curl -s https://SITE/robots.txt | grep -i sitemap    # find the sitemap
curl -s https://SITE/sitemap.xml | head -20          # peek at it
curl -sI https://SITE                                # headers only
curl -s -o /dev/null -w "%{http_code}\n" https://SITE  # just the status code
curl -s https://SITE | grep -o 'application/ld+json' # any JSON-LD?
```

Replaying a request found in DevTools (**Copy as cURL**), then trimming headers until it breaks, is the fastest way to learn what a server actually checks.

## Archives

```bash
# Every snapshot of a URL (first row = headers)
curl -s 'https://web.archive.org/cdx/search/cdx?url=example.com&output=json&limit=10'

# Closest snapshot to a date
curl -s 'https://archive.org/wayback/available?url=example.com&timestamp=20200101'

# Common Crawl index (collection list: index.commoncrawl.org/collinfo.json)
curl -s 'https://index.commoncrawl.org/CC-MAIN-2026-30-index?url=example.com/*&output=json'
```

## DuckDB

```bash
uvx duckdb -c "SELECT * FROM 'data.parquet' LIMIT 5"
uvx duckdb -c "SELECT count(*) FROM 'data/*.parquet'"          # glob many files
uvx duckdb -c "COPY (SELECT * FROM 'in.csv') TO 'out.parquet' (FORMAT parquet)"
uvx duckdb -c "DESCRIBE SELECT * FROM 'data.parquet'"          # inspect schema
uvx duckdb -c "SELECT * FROM read_json_auto('data.json')"
```

## SQLite

```bash
sqlite3 state.db ".tables"
sqlite3 state.db ".schema quotes"
sqlite3 state.db "SELECT count(*) FROM quotes"
sqlite3 state.db ".mode csv" ".once out.csv" "SELECT * FROM quotes"
```

## Playwright

```bash
uv run --with playwright playwright install chromium   # fetch the browser
uv run --with playwright playwright codegen URL        # record actions as code
uv run --with playwright playwright show-trace trace.zip
```

## Documents, images, media

```bash
uvx markitdown file.pdf > file.md          # PDF/DOCX/PPTX -> Markdown
exiftool photo.jpg                         # read metadata
exiftool -gps:all= photo.jpg               # strip GPS
ffmpeg -i in.mp4 -vf fps=1 frame_%04d.jpg  # 1 frame per second
ffmpeg -i in.mp4 -vn -acodec libmp3lame audio.mp3   # extract audio
ffprobe -v quiet -print_format json -show_format -show_streams in.mp4
```

## OSINT (passive, authorised targets only)

```bash
dig example.com ANY +noall +answer
dig example.com MX +short
curl -s 'https://crt.sh/?q=%25.example.com&output=json' | head -c 500   # CT logs
whois example.com            # prefer RDAP: https://lookup.icann.org/
```

## Secret scanning

```bash
uvx trufflehog git file://. --results=verified   # verify creds are live
uvx gitleaks detect --source . --verbose         # fast history scan
```

## Docker

```bash
docker build -t app .
docker run --rm -p 8000:8000 -e PORT=8000 app
docker build --secret id=token,env=TOKEN .       # build secret, not a layer
docker history app                               # what's actually in the image
docker scout cves app                            # vulnerability scan
docker buildx build --platform linux/amd64 -t app .   # cross-architecture
docker system prune -af                          # reclaim disk
```

## Git

```bash
git status
git switch -c feature-branch
git add -A && git commit -m "message"
git diff --staged --quiet || git commit -m "data: $(date -u +%F)"   # commit only if changed
git log --oneline -10
git restore --staged FILE        # unstage
```

## GitHub CLI & Actions

```bash
gh repo create myrepo --public --source=. --push
gh run list --limit 5
gh run watch                     # follow the current run
gh run view --log-failed         # only the failing step's logs
gh secret set BRAVE_API_KEY      # store a secret (never commit one)
```

Cron reminders: Actions cron is **UTC**, runs only on the **default branch**, and is best-effort on timing.

```yaml
on:
  schedule:
    - cron: "0 2 * * *"     # 02:00 UTC daily
  workflow_dispatch:         # manual trigger for testing
```

## Cloud Run

```bash
gcloud run deploy my-api --source . --region asia-south1 --allow-unauthenticated
gcloud run services list
gcloud run services update my-api --max-instances 10      # cap the bill
gcloud run revisions list --service my-api
gcloud run services update-traffic my-api --to-revisions=PREV=100   # roll back
gcloud logging read "resource.type=cloud_run_revision" --limit 20
```

## Terraform

```bash
terraform init
terraform plan       # ALWAYS read this before applying
terraform apply
terraform destroy    # stop paying for course resources
terraform fmt -recursive
terraform import ADDRESS ID     # adopt a resource created by hand
```

## SSH

```bash
ssh-keygen -t ed25519 -C "you@example.com"
ssh-copy-id user@HOST
ssh -L 8080:localhost:8000 HOST      # local port-forward to a private service
rsync -avz --progress ./data/ HOST:~/data/
tmux new -s work     # Ctrl-B D to detach, `tmux attach -t work` to return
journalctl -u myservice -f
```

## Quick diagnostics

```bash
df -h                    # disk full? (a classic mid-scrape failure)
du -sh ./* | sort -h     # what's eating the disk
TZ=Asia/Kolkata date -Is # local time, ISO format
python -c "import sys; print(sys.version)"
```
