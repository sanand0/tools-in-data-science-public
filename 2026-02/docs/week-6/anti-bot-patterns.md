# Anti-bot Patterns

Websites actively try to block scrapers. You must learn to blend in.

## Common Defenses
1. **IP Blocking:** Solved via Proxy Rotation (Residential or Datacenter).
2. **User-Agent Filtering:** Solved by sending legitimate headers.
3. **Browser Fingerprinting:** Sites check for headless Chrome variables. Solved using `playwright-stealth`.
4. **CAPTCHAs:** ReCaptcha, Cloudflare Turnstile. Solved via CAPTCHA solving services (e.g., 2Captcha) or avoiding triggers altogether.

## Best Practices
- Add randomized delays between requests.
- Don't scrape faster than a human could read.
- Honor `robots.txt` unless you have a specific reason not to.