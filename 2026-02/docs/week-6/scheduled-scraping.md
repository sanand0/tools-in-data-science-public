# Scheduled Scraping

Data is only useful if it's fresh.

## GitHub Actions Cron
You can run scrapers for free on a schedule using GitHub Actions.
```yaml
name: Daily Scraper
on:
  schedule:
    - cron: '0 0 * * *' # Every day at midnight

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: python scraper.py
      # Commit changes back to repo or push to DB
```

## Deduplication
When running daily, don't save the same data twice.
- Hash the content or use a unique ID (like an article URL).
- Check against your database before inserting.

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

