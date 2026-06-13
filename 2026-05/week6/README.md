# Week 6: Web, Documents & Multimodal AI

Status: Draft scaffold.

Collect, parse, generate, clean, and track provenance for web pages, PDFs, images, audio, and video.

## Topics

- [Responsible Scraping](responsible-scraping.md)
- [BeautifulSoup](beautifulsoup.md)
- [Playwright & Selenium](playwright-selenium.md)
- [Crawl4AI / Firecrawl Overview](crawl4ai-firecrawl.md)
- [GitHub Actions Cron Basics](github-actions-cron.md)
- [Document Parsing](document-parsing.md)
- [DuckDB + Parquet](duckdb-parquet.md)
- [Vision Models for Extraction](vision-models-extraction.md)
- [Image Generation & Editing](image-generation-editing.md)
- [Image Processing Basics](image-processing-basics.md)
- [Audio AI](audio-ai.md)
- [Video AI](video-ai.md)
- [Multimodal Prompting](multimodal-prompting.md)
- [Data Provenance](data-provenance.md)
- [Data Quality Checks](data-quality-checks.md)

## Labs & Capstones

- `CAPSTONE` Job Posting Scraper & Tracker - public pages -> structured JSON -> DuckDB/SQLite -> dashboard
- `CAPSTONE` Document Extraction Assistant - PDFs/images -> extracted fields -> validation report
- `CAPSTONE` Live Multilingual Travel Translator - Whisper STT -> LLM -> ElevenLabs TTS -> FastAPI
- Lab: Context-based extraction tool - PyMuPDF for PDF, BeautifulSoup/Playwright for web, yt-dlp for video
- Lab: Scheduled scraper with GitHub Actions cron - scrape, deduplicate, store in DuckDB + Parquet
- Lab: Multimodal generation lab - image, audio, or short video with prompt log, cost, license, safety review
- Lab: Build a provenance table for every scraped/extracted row
