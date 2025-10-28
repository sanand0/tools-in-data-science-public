# LLM Website Scraping

LLM-powered website scraping represents a paradigm shift from traditional web scraping. Instead of writing explicit code to navigate DOM structures and CSS selectors, you describe what data you want and let the LLM figure out how to extract it.

This approach works for both simple public pages and complex scenarios requiring authentication, JavaScript rendering, and dynamic interactions. LLMs can write scraping code, control browsers, adapt to layout changes, and even handle captchas through browser automation.

Watch these demonstrations of LLM-powered scraping:

[![Vibe Coding Workshop - Browser Automation](https://i.ytimg.com/vi_webp/xZpdwLHW40o/sddefault.webp)](https://drive.google.com/file/d/1NmuSHWAotDHo5uDvi8s5V8sUJHWRDhvo/view?usp=sharing)

In this module, you'll learn:

- **Chrome Remote Debugging**: Control browsers programmatically for authenticated scraping
- **Agentic scraping**: Let LLMs write and execute scraping code autonomously
- **Vibe scraping workflow**: Describe desired data instead of writing selectors
- **Handling dynamic content**: Login walls, JavaScript rendering, hover elements
- **Multi-strategy approaches**: HTML, APIs, browser automation, and hybrid methods

## Why LLMs for web scraping?

Traditional web scraping is brittle and time-consuming:

- **Selectors break** when websites change layout
- **Authentication** requires complex session management
- **Dynamic content** needs headless browsers and wait strategies
- **Maintenance** consumes developer time as sites evolve

LLMs solve these problems by:

- **Adapting to changes**: Describe data semantically, not structurally
- **Handling complexity**: Write browser automation code on the fly
- **Multiple strategies**: Try HTML parsing, then APIs, then browser control
- **Self-healing**: Debug and fix scraping errors autonomously

> **Key insight**: Don't write scraping code—describe the data you want and let the LLM choose the best extraction strategy.

## Vibe scraping workflow

The core principle: **outcomes over implementation**.

### Traditional scraping

```python
# You write this explicitly
from bs4 import BeautifulSoup
import requests

response = requests.get("https://example.com/products")
soup = BeautifulSoup(response.content, 'html.parser')
products = soup.find_all('div', class_='product-card')

data = []
for product in products:
    title = product.find('h2', class_='title').text
    price = product.find('span', class_='price').text
    data.append({'title': title, 'price': price})
```

### Vibe scraping

```
Search for "AI website traffic" and scrape the content.
Convert into usable data that I can visualize.
```

The LLM decides:

- Whether to use `requests` + BeautifulSoup, Playwright, or Chrome debugging
- Which selectors to target
- How to structure output (CSV, JSON, database)
- Error handling and retries

## Chrome Remote Debugging setup

Chrome Remote Debugging allows programmatic control of Chrome, enabling authenticated scraping without explicit credential handling.

### Step 1: Launch Chrome in debug mode

**Windows:**
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\chrome-debug-profile"
```

**Mac:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-debug-profile"
```

**Linux:**
```bash
google-chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-debug-profile"
```

This opens a new Chrome window with remote control enabled.

### Step 2: Verify debugging works

Open `http://localhost:9222` in the debug Chrome window. You should see a JSON list of open tabs.

### Step 3: Give context to your coding agent

In [Codex](https://chatgpt.com/codex), [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview), or [Cursor](https://cursor.com/), provide this context:

```
I have Chrome remote debugging running on localhost:9222.
The browser is already logged into [website name].

[Your scraping task here]
```

The agent will:
- Connect to Chrome via the Chrome DevTools Protocol
- Navigate to pages
- Extract data
- Handle JavaScript rendering automatically

## Authenticated website scraping

One of the most powerful LLM scraping use cases: extracting data from sites behind login walls.

### Example: LinkedIn invites analysis

```
I have Chrome remote debugging running on localhost:9222.
The browser is already logged into LinkedIn.

Go to my LinkedIn invites page. Of the 30 most recent invites,
how many people are from the IT industry vs outside it?

Save the details in invites.md with:
- Name
- Title
- Company
- Industry classification
```

The LLM will:

1. Navigate to the invites page
2. Identify invite cards in the DOM
3. Extract text content
4. Classify industries (using its world knowledge)
5. Structure data and save to markdown

**Result**: In ~2 minutes, you get analysis that would take 30+ minutes manually.

### Example: Salesforce data extraction

```
I have Chrome remote debugging running on localhost:9222.
The browser is logged into Salesforce.

Navigate to [specific Salesforce URL].
Extract all data for profile ID: [ID].
Include any hover-over tooltips or hidden content.

Save as salesforce_data.json.
```

The LLM can:
- Trigger hovers to reveal tooltips
- Wait for lazy-loaded content
- Handle dynamic JavaScript rendering
- Export structured JSON

### Security considerations

**Pros:**
- No credential storage in code
- Browser maintains session state
- Full control over what's accessed
- Can review actions in real-time

**Cons:**
- Agent can access anything you're logged into
- Potential for unintended actions
- May violate site terms of service

**Best practices:**

1. **Use dedicated Chrome profiles** for scraping (don't mix with personal browsing)
2. **Review prompts carefully** before execution in sensitive environments
3. **Start with read-only operations** before allowing writes
4. **Check site terms of service**—some sites explicitly ban automated access
5. **Prefer official APIs** when available to avoid account bans

## Handling dynamic content

Modern websites use JavaScript heavily. LLMs can handle this through browser automation.

### Scenario 1: Hover-triggered content

```
On this page, some data appears only when hovering over elements.
Scrape all visible data AND all hover-revealed content.
```

The LLM will:
- Identify hoverable elements
- Trigger hover events via JavaScript
- Wait for content to appear
- Extract revealed data

### Scenario 2: Infinite scroll

```
This page uses infinite scroll. Scrape all items, not just
the initially visible ones. Keep scrolling until no new items appear.
```

The LLM generates code like:

```python
previous_height = 0
while True:
    # Scroll to bottom
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(2)  # Wait for load

    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == previous_height:
        break
    previous_height = new_height

# Now extract all items
```

### Scenario 3: Lazy-loaded images

```
This page lazy-loads images as you scroll. Scrape all product
images, ensuring they're fully loaded before extraction.
```

The LLM handles:
- Scrolling to trigger lazy load
- Waiting for `src` attributes to populate
- Distinguishing placeholder vs actual images

## Multi-strategy scraping

LLMs excel at trying multiple approaches when one fails.

### Strategy 1: HTML parsing (fastest)

```python
import requests
from bs4 import BeautifulSoup

response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')
```

**Pros**: Fast, no browser overhead
**Cons**: Fails with JavaScript-rendered content

### Strategy 2: API discovery (most reliable)

LLMs can analyze Network tab requests and find hidden APIs:

```
Open DevTools Network tab and navigate the site.
Find the API endpoint that loads this data.
Use that API directly instead of scraping HTML.
```

**Pros**: Stable, structured data, faster than HTML
**Cons**: APIs may be authenticated or undocumented

### Strategy 3: Browser automation (most powerful)

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto(url)
    # Extract data
```

**Pros**: Handles JavaScript, authentication, complex interactions
**Cons**: Slower, resource-intensive

### Let the LLM choose

Instead of specifying the strategy upfront:

```
Scrape product prices from [website].
Try the fastest method first. If that fails, try progressively
more complex approaches. Report which method succeeded.
```

The LLM will:
1. Attempt `requests` + BeautifulSoup
2. If JavaScript-rendered, switch to Playwright
3. If API exists, use that instead
4. Document the successful approach for future runs

## Extracting structured data

LLMs understand semantic structure, not just HTML structure.

### Example: Product listings

**Traditional scraping:**
```python
products = soup.find_all('div', class_='product-grid-item')
```

**Vibe scraping:**
```
Extract all products on this page. For each, include:
- Product name
- Price (convert to USD if needed)
- Rating (as decimal, e.g., 4.5)
- Number of reviews
- Availability status

Output as products.json with this schema:
{
  "products": [
    {"name": "...", "price_usd": 0.00, "rating": 0.0, "reviews": 0, "available": true}
  ]
}
```

The LLM:
- Identifies products semantically (not by class name)
- Normalizes currencies
- Extracts nested data (ratings from star images)
- Validates schema compliance

### Example: Tables with merged cells

```
This page has a complex table with merged cells and nested headers.
Convert it to a flat CSV where each row is fully denormalized.
```

The LLM handles:
- Interpreting rowspan/colspan
- Carrying forward merged cell values
- Creating proper hierarchical headers

## Making scraping repeatable

Once a scraping session succeeds, convert it into reusable code.

### Step 1: Successful scrape

```
Scrape all job listings from this page, including:
- Job title
- Company
- Location
- Salary range
- Posted date
```

### Step 2: Extract as script

```
Great! Now create a standalone Python script scrape_jobs.py
that reproduces this scraping with:

- Proper error handling
- Retry logic with exponential backoff
- Logging to scrape.log
- Output to jobs.csv
- Command-line argument for URL

Include a README.md with usage instructions.
```

### Step 3: Schedule execution

```
Create a GitHub Actions workflow that:
- Runs this scraper daily at 9 AM UTC
- Commits new jobs to the repo
- Sends email if scraping fails
```

**Result**: One-time vibe scraping becomes a production data pipeline.

## Error handling and debugging

LLMs can debug scraping failures autonomously.

### Scenario: Selector not found

**Error:**
```
Element not found: .product-card
```

**Prompt:**
```
The scraper failed with "Element not found: .product-card".
Inspect the page HTML and find the correct selector.
Update the scraper and try again.
```

The LLM:
- Fetches current page HTML
- Identifies product elements by semantic meaning
- Updates selectors
- Re-runs scraper

### Scenario: Rate limiting

**Error:**
```
HTTP 429 Too Many Requests
```

**Prompt:**
```
Scraping failed due to rate limiting. Modify the scraper to:
- Add delays between requests (2-5 seconds)
- Rotate user agents
- Implement exponential backoff
- Resume from last successful page
```

The LLM adds resilience without you writing retry logic.

### Scenario: CAPTCHA

```
This site has CAPTCHAs. Since we're using Chrome remote debugging
with a logged-in session, navigate to a logged-in URL that bypasses
the CAPTCHA, then proceed with scraping.
```

LLMs can find workarounds (authenticated endpoints, API access) rather than attempting CAPTCHA solving.

## Comparing data across pages

LLMs excel at comparative scraping.

### Example: Price comparison

```
Scrape product prices for "wireless headphones" from:
- Amazon
- Best Buy
- Walmart

Create a comparison table with:
- Product name (normalized across sites)
- Price at each retailer
- Prime/shipping info
- Rating average

Highlight best deals (>20% cheaper than alternatives).
```

The LLM:
- Writes three separate scrapers
- Normalizes product names (e.g., "Sony WH-1000XM5" variations)
- Calculates savings
- Formats comparative output

## Monitoring and change detection

Set up scrapers that alert you to changes.

### Example: Competitor pricing

```
Create a scraper that:
1. Scrapes competitor prices daily
2. Compares to yesterday's prices
3. If any price drops >10%, send email alert
4. Maintains historical pricing in prices.db
```

The LLM generates:
- Scraper script
- SQLite database schema
- Email notification code
- GitHub Actions workflow for scheduling

## Legal and ethical considerations

LLM scraping is powerful but comes with responsibilities.

### When scraping is appropriate

- ✅ **Public data** for analysis, research, or journalism
- ✅ **Your own data** on third-party platforms (e.g., exporting your LinkedIn connections)
- ✅ **Permitted under ToS** or with explicit permission
- ✅ **API alternatives don't exist** or are prohibitively expensive

### When to avoid scraping

- ❌ **Explicit ToS prohibition** (e.g., LinkedIn, Facebook prohibit automated access)
- ❌ **Personal data** without consent
- ❌ **Bypassing paywalls** for commercial advantage
- ❌ **Overloading servers** with aggressive requests

### Best practices

1. **Read the ToS** before scraping any site
2. **Respect robots.txt** even if not legally binding
3. **Rate limit requests** (1-2 per second maximum, ideally slower)
4. **Identify your bot** with a custom User-Agent
5. **Provide contact info** in User-Agent for site owners to reach you
6. **Consider API alternatives** first—they're designed for access
7. **Don't scrape personal data** without explicit consent
8. **Monitor for bans** and stop immediately if blocked

Example respectful User-Agent:

```python
headers = {
    'User-Agent': 'ResearchBot/1.0 (+https://yoursite.com/bot; contact@yoursite.com)'
}
```

## Tools and platforms

### Coding agents for scraping

- **[Codex](https://chatgpt.com/codex)**: Voice prompting, repository integration
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)**: Strong at autonomous debugging
- **[Cursor](https://cursor.com/)**: Desktop IDE with inline scraping generation
- **[Jules](https://jules.google.com/)**: Web-based, good for quick experiments

### Supporting libraries

Python scraping ecosystem (LLMs know these well):

```python
# HTML parsing
import requests
from bs4 import BeautifulSoup

# Browser automation
from playwright.sync_api import sync_playwright
from selenium import webdriver

# Chrome debugging protocol
import asyncio
from pyppeteer import connect

# Data extraction
import pandas as pd
import json
```

### Debugging tools

- **Chrome DevTools**: Inspect Network tab for API endpoints
- **[Postman](https://www.postman.com/)**: Test API requests before coding
- **[Insomnia](https://insomnia.rest/)**: Alternative REST client

## Complete example: Job listing aggregator

Full workflow from vibe scraping to deployed pipeline.

### Initial prompt

```
I want to track data science job postings daily. Scrape:
- Indeed
- LinkedIn (if I'm logged in via Chrome debugging)
- Glassdoor

For each job, extract:
- Title
- Company
- Location (remote vs office)
- Salary range (normalize to yearly USD)
- Required skills (extract from description)
- Posted date

Output as jobs.csv with columns:
source, title, company, location, salary_min, salary_max, skills, posted_date

Handle pagination—get first 100 jobs from each site.
```

### Refinement prompt

```
Good start! Now enhance this scraper to:

1. Deduplicate across sources (same job, multiple sites)
2. Categorize location: Remote, Hybrid, On-site
3. Extract seniority level: Entry, Mid, Senior, Lead
4. Score "hotness" based on recency and salary
5. Save to SQLite database jobs.db
6. Generate a daily report: top_jobs.md showing 10 hottest jobs

Create scraper.py that does all of this.
```

### Production prompt

```
Now create a production-ready deployment:

1. Add comprehensive error handling and logging
2. Create config.yaml for URLs, selectors, etc.
3. Add retry logic with exponential backoff
4. Implement --test-mode that runs on sample data
5. Generate GitHub Actions workflow:
   - Runs daily at 9 AM UTC
   - Commits new jobs to repo
   - Posts top 5 jobs to Slack webhook (provide env var)
6. Write DEPLOYMENT.md with setup instructions

Organize as:
scraper/
  __init__.py
  scrape.py
  database.py
  config.yaml
tests/
  test_scraper.py
.github/workflows/daily_scrape.yml
README.md
DEPLOYMENT.md
```

**Result**: A fully automated job tracking system built entirely through natural language prompting.

## Best practices summary

1. **Start with Chrome remote debugging** for authenticated sites
2. **Use vibe prompts** describing desired data, not implementation
3. **Let LLMs choose strategies** (HTML → API → browser automation)
4. **Make scrapers repeatable** by extracting standalone scripts
5. **Handle errors proactively** with retry logic and logging
6. **Respect site ToS** and rate limits
7. **Extract first, structure later**—get data, then ask for formatting
8. **Version control prompts**—they're your source code now
9. **Monitor for changes**—scraper breakage is inevitable
10. **Consider APIs first**—they're more reliable than scraping

## Real-world use cases

### Data journalism

```
Scrape all city council meeting minutes from [city website]
for the past year. Extract:
- Meeting date
- Agenda items
- Vote results (by council member)
- Attendance

Identify patterns: most contested topics, attendance rates,
voting blocs.
```

### Competitive intelligence

```
Monitor competitor pricing for our top 50 products daily.
Alert if:
- Any competitor drops price >5%
- New competitor enters market
- Product goes out of stock

Maintain historical pricing in Postgres.
```

### Real estate analysis

```
Scrape property listings in [city] with:
- Price, bedrooms, bathrooms, sqft
- Days on market
- Price history
- Neighborhood

Calculate median price per sqft by neighborhood.
Identify underpriced properties (>20% below neighborhood median).
```

### Academic research

```
Scrape publications from [academic database] for keyword
"climate change adaptation" from 2020-2024.

Extract:
- Title, authors, abstract, year
- Citation count
- Keywords

Analyze trending topics over time.
```

## Troubleshooting common issues

### Issue 1: "Element not found"

**Cause**: JavaScript-rendered content not loaded yet

**Solution:**
```
Add wait logic. After navigating to page, wait for
element with selector .product-card to appear before scraping.
```

### Issue 2: "403 Forbidden"

**Cause**: Site blocks bots via User-Agent

**Solution:**
```
Use realistic headers:
User-Agent: Mozilla/5.0...
Accept-Language: en-US,en;q=0.9
Referer: [previous page URL]
```

### Issue 3: Scraped data is incomplete

**Cause**: Data loads via AJAX after initial render

**Solution:**
```
Instead of scraping HTML, find the AJAX endpoint
in Network tab that loads this data. Call that API directly.
```

### Issue 4: Scraper works once, then fails

**Cause**: Site changes layout or implements anti-bot measures

**Solution:**
```
Modify scraper to:
1. Take screenshots on failure for debugging
2. Extract data semantically, not by class names
3. Implement fallback selectors
4. Add monitoring that alerts on failure
```

## Further resources

- [Web Scraping with JavaScript tutorial](scraping-imdb-with-javascript.md)
- [Chrome DevTools guide](devtools.md)
- [Scheduled scraping with GitHub Actions](scheduled-scraping-with-github-actions.md)
- [Beautiful Soup documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Playwright documentation](https://playwright.dev/)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)

---

LLM website scraping transforms a brittle, code-intensive process into a flexible, natural-language-driven workflow. By describing desired data rather than extraction mechanics, you gain resilience to site changes and can tackle complex scenarios (authentication, JavaScript, dynamic content) that previously required significant engineering effort.

The key mindset shift: **you're not a coder writing scrapers—you're a data curator directing an AI to extract information however it sees fit.**
