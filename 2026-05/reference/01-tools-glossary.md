# Tools Glossary

> Every tool and term used across the course, with one line on what it's for and where it's taught.

Use `Ctrl+F`. Terms are grouped by what you're trying to do, not alphabetically — you usually know the *job*, not the name.

## Getting data off the web

| Term | What it is |
|---|---|
| **Hidden / internal API** | The JSON endpoint a page's own JavaScript calls. Almost always better than parsing HTML → [Hidden JSON APIs](/2026-05/week-6/hidden-json-apis/) |
| **httpx** | Modern Python HTTP client; sync + async, HTTP/2, connection reuse |
| **selectolax** | Very fast HTML parser; CSS selectors (a lighter alternative to BeautifulSoup) |
| **Playwright** | Browser automation that renders JavaScript; auto-waits for elements |
| **Selenium** | The older browser-automation standard; manual waits |
| **Patchright** | Drop-in Playwright fork patched to hide automation signals |
| **Camoufox** | Anti-detect Firefox build with fingerprint spoofing |
| **curl_cffi** | HTTP client that impersonates a browser's TLS/JA3 and HTTP/2 fingerprint |
| **CDX API** | Internet Archive's index API — lists every snapshot of a URL |
| **WARC** | Web ARChive format; raw request/response records used by Common Crawl |
| **JSON-LD** | Structured data (schema.org) embedded in a page for search engines |
| **Sitemap index** | A sitemap listing other sitemaps; needs one extra level of parsing |
| **robots.txt** | A site's machine-readable crawling preferences. Not a law; strong evidence → [Legal & Ethical](/2026-05/week-6/legal-ethical-scraping/) |
| **Crawl-delay** | A `robots.txt` directive asking for a minimum gap between requests |

## Being blocked (and not being blocked)

| Term | What it is |
|---|---|
| **JA3 / JA4** | Fingerprints of a TLS handshake; identifies your client before any header is read |
| **HTTP/2 fingerprint** | Identification from SETTINGS frames and header ordering |
| **Turnstile** | Cloudflare's CAPTCHA replacement; usually invisible |
| **Bot score** | Cloudflare's 1–99 automation likelihood; 1 = certainly bot |
| **`cf_clearance`** | Cookie proving a challenge was passed; bound to IP + User-Agent |
| **WAF** | Web Application Firewall — rule-based request filtering |
| **Verified bot** | A known-good crawler (Googlebot, uptime monitors) that rules should exempt |
| **Exponential backoff** | Doubling the wait after each failure |
| **Jitter** | Randomness added to backoff so clients don't retry in lockstep |
| **`Retry-After`** | Header telling you exactly how long to wait after a 429 |
| **Idempotent** | Safe to run twice — the second run changes nothing |

## Storing and querying

| Term | What it is |
|---|---|
| **SQLite** | In-process OLTP database; ideal for scraper state |
| **DuckDB** | In-process OLAP database; SQL over Parquet/CSV/JSON files |
| **Parquet** | Columnar, compressed file format; 5–10× smaller than CSV |
| **OLTP / OLAP** | Many small transactions vs few large analytical scans |
| **Content hash** | Hash of meaningful fields, used to detect changes |
| **Stable ID** | An identifier for a record that survives re-runs |
| **polars** | Fast DataFrame library; a Pandas alternative |
| **Dead-letter queue** | Where messages go after repeated processing failures |

## Documents, images, audio, video

| Term | What it is |
|---|---|
| **trafilatura** | Extracts the main article content from a page (drops boilerplate) |
| **markdownify** | Converts HTML to Markdown verbatim |
| **MarkItDown** | Microsoft converter: PDF/DOCX/PPTX/XLSX → Markdown |
| **Jina Reader** | Hosted `r.jina.ai/<url>` → clean Markdown |
| **PyMuPDF** | Fast PDF text and table extraction |
| **Docling** | Layout-aware document → structured Markdown |
| **Surya** | Open multilingual OCR and layout analysis |
| **OCR** | Optical Character Recognition — text from images |
| **EXIF** | Image metadata; can include GPS coordinates |
| **VLM** | Vision-Language Model — reads images and answers in text |
| **Qwen3-VL** | Leading open-weight vision-language family (2026) |
| **Whisper / faster-whisper** | Speech-to-text; `faster-whisper` is the quicker runtime |
| **Parakeet** | NVIDIA STT; fastest self-hosted English throughput |
| **WhisperX** | Whisper plus word-level alignment and speaker diarization |
| **Diarization** | Working out *who* spoke *when* |
| **WER** | Word Error Rate — the standard STT accuracy metric |
| **ffmpeg / ffprobe** | Convert/extract media; inspect media metadata |

## Recon and OSINT

| Term | What it is |
|---|---|
| **OSINT** | Open-Source Intelligence — findings assembled from public sources |
| **Dorking** | Using advanced search operators to find specific content |
| **GHDB** | Google Hacking Database — catalogue of exposure patterns |
| **Certificate Transparency** | Public append-only logs of issued TLS certificates |
| **crt.sh** | Search interface over CT logs |
| **RDAP** | The modern, structured replacement for WHOIS |
| **Subdomain enumeration** | Discovering hostnames for a domain (amass, subfinder) |
| **Shodan / Censys** | Search engines for internet-facing services |
| **Corroboration** | Confirming a claim across independent sources before asserting it |
| **Provenance** | The record of where a claim came from and when |
| **Aggregation harm** | Individually-public facts becoming harmful once combined |
| **Gitleaks / TruffleHog** | Secret scanners for git history |

## Security, cloud, CI/CD

| Term | What it is |
|---|---|
| **Prompt injection** | Untrusted text being treated as instructions by a model |
| **Indirect injection** | Injection delivered through content the model *reads* |
| **OWASP LLM Top 10** | The reference list of LLM application risks |
| **Least privilege** | Granting only the permissions strictly required |
| **Multi-stage build** | A Dockerfile pattern keeping build tools out of the final image |
| **Layer cache** | Docker's reuse of unchanged build steps |
| **Cold start** | First-request latency after scaling to zero |
| **Scale to zero** | Running no instances (and paying nothing) when idle |
| **IaC** | Infrastructure as Code — declared in version-controlled files |
| **Terraform state** | Terraform's record of what actually exists; never commit it |
| **Drift** | Real infrastructure diverging from the declared config |
| **WIF** | Workload Identity Federation — cloud auth without long-lived keys |
| **At-least-once delivery** | A message may arrive more than once; consumers must be idempotent |
| **Pub/Sub** | Publish–subscribe messaging; decouples producers from consumers |

## Course-wide

| Term | What it is |
|---|---|
| **uv** | Fast Python package/project manager used throughout |
| **PEP 723** | Inline script metadata — dependencies declared in the file itself |
| **RAG** | Retrieval-Augmented Generation |
| **MCP** | Model Context Protocol |
| **OIDC** | OpenID Connect |
| **Structured output** | Forcing a model to return schema-valid JSON |
