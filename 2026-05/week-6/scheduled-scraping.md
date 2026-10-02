# Scheduled Scraping

> **Data is only useful if it's fresh. Put your scraper on a free cron, make it idempotent, and let it build a time-series while you sleep.**

⏱ ~8 min read · ~15 min hands-on
🔗 needs: [Change Detection & Dedup](/2026-05/week-6/change-detection-dedup/) · [GitHub Actions](/2026-05/week-1/04-git-github/)

A one-off scrape is a snapshot. A *scheduled* scrape is a dataset that gets more valuable every day — and GitHub Actions will run it for free.

## Try it in 5 minutes — a cron in a YAML file

Commit this as `.github/workflows/scrape.yml`:

```yaml
name: Daily scrape

on:
  schedule:
    - cron: "0 2 * * *"     # 02:00 UTC daily — always UTC, never your timezone
  workflow_dispatch:         # lets you click "Run workflow" to test immediately

permissions:
  contents: write            # required to commit results back

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v5
      - run: uv run scraper.py          # PEP 723 deps install automatically
      - name: Commit data if it changed
        run: |
          git config user.name  "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A data/
          git diff --staged --quiet || git commit -m "data: $(date -u +%F)"
          git push
```

✅ `git diff --staged --quiet ||` is the whole trick — it commits **only when something changed**, so your history is a log of real changes, not 365 identical commits.

## Make it safe to run twice

A scheduled job *will* run twice eventually — a retry, a manual trigger, an overlapping run. Design for it:

- **Idempotent writes.** Re-running must not duplicate rows → the `UPSERT` pattern in [Change Detection & Dedup](/2026-05/week-6/change-detection-dedup/).
- **Append, don't overwrite.** Write dated files (`data/date=2026-08-07/part.parquet`) so history accumulates and [DuckDB globs them](/2026-05/week-6/duckdb-parquet/).
- **Fail loudly.** A scraper that silently writes zero rows for a month is worse than one that crashes on day one.

```python
# Guard: refuse to overwrite good data with an empty result.
if len(rows) < EXPECTED_MINIMUM:
    raise SystemExit(f"Only {len(rows)} rows — refusing to write. Site layout may have changed.")
```

## Where to run it

| Option | Good for | Watch out |
|---|---|---|
| **GitHub Actions** | Free, versioned, data commits back to the repo | Scheduled jobs can be delayed at peak; disabled after ~60 days of repo inactivity |
| **Cloud scheduler + serverless** | Reliable timing, real infrastructure | Costs money → [Week 7](/2026-05/week-7/07-serverless-functions/) |
| **A VM with `cron`** | Full control, long jobs | You maintain it → [Week 7](/2026-05/week-7/06-vms-ssh/) |

Start with Actions. Graduate when you need guaranteed timing or runs longer than the job limit.

## Keep secrets out of the repo

API keys go in **Settings → Secrets and variables → Actions**, never in the YAML:

```yaml
      - run: uv run scraper.py
        env:
          BRAVE_API_KEY: ${{ secrets.BRAVE_API_KEY }}
```

> ⚖️ A schedule multiplies your footprint: one polite request becomes 365 a year, and a bug becomes thousands. Re-check `robots.txt` and rate limits before automating — [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/) and [Rate Limits](/2026-05/week-6/rate-limits-retries-caching/).

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| Workflow never fires | Cron only runs on the **default branch** | Merge to `main`; test with `workflow_dispatch` |
| Runs late | Actions' scheduler is best-effort under load | Don't depend on exact minutes |
| Silently stopped | Actions disables cron after ~60 days of inactivity | Push occasionally, or re-enable |
| `Permission denied` on push | Missing `contents: write` | Add the `permissions` block |
| A commit every single day | Committing unconditionally | Use the `git diff --staged --quiet ||` guard |
| Works locally, 403 on CI | Datacenter IP, no cookies | [Anti-bot Patterns](/2026-05/week-6/anti-bot-patterns/) |

## Your turn (≈15 min)

1. Create a repo with a `scraper.py` that fetches the [Hacker News top stories API](https://github.com/HackerNews/API) and writes dated Parquet.
2. Add the workflow above; trigger it with **Run workflow** and confirm the commit.
3. Run it twice without changing data — confirm the second run creates **no** commit.
4. Add the minimum-rows guard and prove it fails loudly when you set the threshold absurdly high.

## Checklist

- [ ] I can schedule a job with `cron` in GitHub Actions and trigger it manually.
- [ ] I know cron in Actions is UTC and only runs on the default branch.
- [ ] My scraper is idempotent — running twice doesn't duplicate data.
- [ ] I commit only when the data actually changed.
- [ ] I fail loudly on suspiciously empty results, and keep secrets in Actions secrets.

## Go deeper

- [Events that trigger workflows — `schedule`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule) — the official cron semantics and caveats.
- [Git scraping — Simon Willison](https://simonwillison.net/2020/Oct/9/git-scraping/) — the "commit data to a repo on a schedule" technique that popularised this.
- [crontab.guru](https://crontab.guru/) — sanity-check any cron expression.

<!-- SOURCES: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule , https://simonwillison.net/2020/Oct/9/git-scraping/ , https://crontab.guru/ , https://github.com/HackerNews/API -->
