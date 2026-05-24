# Lab — Scheduled Scraper with GitHub Actions

## Objective
Set up an automated scraping job that runs daily without manual intervention.

## Requirements
1. Write a Python script that fetches the top 10 articles from Hacker News API.
2. Save the data to a Parquet file.
3. Configure a GitHub Actions workflow (`.github/workflows/scrape.yml`) with a `cron` trigger to run daily.
4. The workflow must commit the updated Parquet file back to the repository.
5. Provide a separate script using DuckDB to query the Parquet file and print the most common words in titles.

## Deliverables
- Link to your GitHub repository showing the successful Action runs.