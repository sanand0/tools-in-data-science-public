# Lab — Context-Based Extraction Tool

## Objective
Build a unified tool that an agent can call to extract text from any source URL (PDF, Website, or YouTube Video).

## Instructions
Create a Python module exposing a single `extract_context(url: str)` function.

1. **If URL is a PDF:** Use `PyMuPDF` to download and extract the text.
2. **If URL is a Website:** Use `Playwright` to render JavaScript and extract the main article text via `BeautifulSoup`.
3. **If URL is a YouTube Video:** Use `yt-dlp` to download the auto-generated VTT subtitles and parse them into raw text.

## Testing
Provide a script that calls your function with three different URLs and prints the first 500 characters of each.