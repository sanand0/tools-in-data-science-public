# Lab — Scheduled Scraper with GitHub Actions

> Get a scraper running on a free daily cron that commits its own data — the foundation every other Week 6 lab builds on.

⏱ ~2 hours
🔗 needs: [Scheduled Scraping](/2026-05/week-6/scheduled-scraping/) · [DuckDB + Parquet](/2026-05/week-6/duckdb-parquet/)

A small, complete pipeline: fetch → store → schedule → query. Deliberately uses a **public, documented API** so nothing here is ethically ambiguous.

## Objective

Collect Hacker News top stories daily, accumulate them as Parquet, and query the result with DuckDB.

## Requirements

**1. The scraper.** Fetch the top 30 stories from the [Hacker News API](https://github.com/HackerNews/API) (public, documented, no key). Write `data/date=YYYY-MM-DD/stories.parquet` with at least: `id`, `title`, `by`, `score`, `descendants`, `url`, `fetched_at`.

Start from this skeleton and finish it:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28", "polars>=1.0"]
# ///
"""Fetch Hacker News top stories to a dated Parquet file."""

import datetime as dt
import pathlib

import httpx
import polars as pl

BASE = "https://hacker-news.firebaseio.com/v0"
MIN_EXPECTED = 20  # fail loudly rather than write near-empty data


def fetch_top(n: int = 30) -> list[dict]:
    with httpx.Client(timeout=15) as client:
        ids = client.get(f"{BASE}/topstories.json").raise_for_status().json()[:n]
        # TODO: fetch each item; be polite; skip items missing required fields
        return []


if __name__ == "__main__":
    rows = fetch_top()
    if len(rows) < MIN_EXPECTED:
        raise SystemExit(f"Only {len(rows)} stories — refusing to write.")
    day = dt.date.today().isoformat()
    out = pathlib.Path(f"data/date={day}")
    out.mkdir(parents=True, exist_ok=True)
    pl.DataFrame(rows).write_parquet(out / "stories.parquet")
    print(f"Wrote {len(rows)} stories to {out}")
```

**2. The workflow.** `.github/workflows/scrape.yml` that runs daily on `cron`, supports `workflow_dispatch`, and **commits only when the data changed**.

**3. The analysis.** A `query.py` (or a documented `duckdb -c` command) that reads *all* dated Parquet files with a glob and reports:
- The 10 most common words in titles across your whole collection
- Average score per day
- Any story appearing in the top 30 on more than one day

**4. Prove it's idempotent.** Running the scraper twice on the same day must not corrupt or duplicate the day's file. Say in your README how you handled it.

## Deliverables

| # | Item |
|---|---|
| 1 | Public repo link |
| 2 | Actions history showing ≥3 successful runs (mix of scheduled and manual) |
| 3 | At least 3 dated Parquet directories committed |
| 4 | `query.py` plus its output pasted into the README |
| 5 | Two or three sentences on what the data showed |

## Grading

| Weight | Criterion |
|---|---|
| 25% | Scraper works, handles errors, refuses to write near-empty data |
| 25% | Workflow runs on schedule and commits only on change |
| 25% | DuckDB analysis globs all dated files and answers all three questions |
| 15% | Idempotency handled and explained |
| 10% | README a stranger can follow |

## Common failure modes

| Symptom | Fix |
|---|---|
| Cron never fires | It only runs on the **default branch** — merge to `main`, test via `workflow_dispatch` |
| `Permission denied` on push | Add `permissions: contents: write` |
| A commit every run despite no change | Use `git diff --staged --quiet \|\| git commit …` |
| Rate-limited by the API | Add a small delay between item fetches |
| Empty Parquet after a site change | That's what `MIN_EXPECTED` is for — make it fail |

## Stretch goals

- Add [change detection](/2026-05/week-6/change-detection-dedup/): track how a story's score evolves across days.
- Publish the DuckDB output to GitHub Pages as a small chart.
- Add a second source (Lobsters, Reddit's public JSON) and compare front pages.
