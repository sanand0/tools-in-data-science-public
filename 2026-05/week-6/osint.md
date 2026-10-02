# OSINT — Infrastructure & Public Records

> **Build a picture of an organisation's public footprint — domains, certificates, code, filings — from open sources, and know exactly how far a single source can be trusted.**

⏱ ~10 min read · ~15 min hands-on
🔗 needs: [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/) · [Wayback & Common Crawl](/2026-05/week-6/wayback-commoncrawl/)

Open-source intelligence (OSINT) is assembling a verified picture from public sources. This page scopes to **infrastructure and public records** — the material that matters for data science and security analysis. Profiling people is a different discipline with a much heavier duty of care; that lives in [Week 7 → Person & Social OSINT](/2026-05/week-7/person-social-osint/).

> ⚖️ **Consent and authorisation come first.** Practise on assets you own, a target you have written permission to study, or genuinely public infrastructure — and even then, collect only what answers a defined question. "Publicly reachable" is not "fair game for intensive collection." No harassment, no doxxing, no people-finding as sport. See [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/).

## Try it in 5 minutes — read the certificate logs

Every TLS certificate a public CA issues is logged to **Certificate Transparency** logs — public, append-only, and searchable at `crt.sh`. That means you can enumerate a domain's historical hostnames **without ever touching the target's servers**:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["httpx>=0.28"]
# ///
"""List hostnames from public Certificate Transparency logs (passive OSINT).

Run:  uv run ct_subdomains.py wikipedia.org
"""

import sys
import httpx

domain = sys.argv[1] if len(sys.argv) > 1 else "wikipedia.org"

r = httpx.get("https://crt.sh/", params={"q": f"%.{domain}", "output": "json"}, timeout=30)
r.raise_for_status()

names = {
    name.strip().lower()
    for row in r.json()
    for name in row["name_value"].splitlines()
}
for name in sorted(names):
    print(name)
```

✅ A list of subdomains, harvested from public logs — the target never saw a request from you. (Use a domain you own or a public one you're authorised to study. `crt.sh` sometimes returns 503 under load; just retry.)

## What public sources reveal

| Source | What it gives you | Where |
|---|---|---|
| **RDAP / WHOIS** | Domain registrar, dates, status (often privacy-redacted now) | [lookup.icann.org](https://lookup.icann.org/) |
| **DNS (`dig`)** | A/AAAA, MX, NS, TXT records — the live infrastructure | `dig example.com ANY` |
| **Certificate Transparency** | Historical hostnames from issued certs | [crt.sh](https://crt.sh/) |
| **Subdomain enumeration** | Attack-surface discovery from many passive sources | [amass](https://github.com/owasp-amass/amass) · [subfinder](https://github.com/projectdiscovery/subfinder) · [theHarvester](https://github.com/laramies/theHarvester) |
| **Internet-wide scans** | Open services, banners, product fingerprints | [Shodan](https://www.shodan.io/) · [Censys](https://search.censys.io/) |
| **Public code** | Config, endpoints, infra clues in open repos | [GitHub code search](https://docs.github.com/en/search-github/searching-on-github/searching-code) |
| **Company records** | Legal entities across jurisdictions | [OpenCorporates](https://opencorporates.com/) |
| **Web history** | How a site/infra changed over time | [Wayback & Common Crawl](/2026-05/week-6/wayback-commoncrawl/) |
| **File metadata** | EXIF/IPTC/XMP on documents & media | [ExifTool](https://exiftool.org/) |

## Corroboration is the whole job

Anyone can *collect*. The skill — and the part a data-science course actually grades — is **verification**:

- **A single source is a lead, not a finding.** Confirm every material fact across **two or more independent sources** that don't just mirror each other: DNS resolution *and* a CT-log entry *and* a live TLS handshake; a registry status *and* a contemporaneous filing.
- **Record provenance** for each claim: the exact query, the time in UTC, and the raw artifact (JSON export, `dig` output, screenshot). Separate **observation** ("A record points to `203.0.113.10` at 14:02 UTC") from **interpretation** ("this is the production API").
- **Assign a confidence level** (low / medium / high) based on source independence, recency, and how easily the record could be spoofed or stale. Prefer "consistent with X" over "proves X."

## When it fails

| Trap | Why | What to do instead |
|---|---|---|
| Treating a hit as current | CT logs, Wayback, and Shodan show what was true *at some time* | Re-resolve DNS now; check timestamps |
| Reading a name off WHOIS | Post-GDPR registration data is usually redacted/proxied | Use RDAP; corroborate with certs + registries, don't assume identity |
| Trusting an aggregator's list | Amass/subfinder/GitHub hits include typosquats, CDNs, false positives | Verify each host independently; prefer documented APIs + rate limits |

## Your turn (≈15 min)

Build a one-page **infrastructure profile** of a domain you own (or your institution's, with care):

1. Run `ct_subdomains.py` on the domain.
2. Pick two interesting hostnames. For each, run `dig` and note the live records.
3. Cross-check one fact against a second source (a CT entry vs a live TLS cert, say).
4. Write each finding with its **provenance** and a **confidence** level. Mark anything you could only find in one place as *low confidence*.

## Checklist

- [ ] I can enumerate hostnames passively from Certificate Transparency logs.
- [ ] I know RDAP has largely replaced readable WHOIS, and why.
- [ ] I confirm material facts across two independent sources before stating them.
- [ ] I record provenance (query, time, artifact) and a confidence level for each claim.
- [ ] I scope collection to authorised targets and minimise what I keep.

## Go deeper

- [crt.sh](https://crt.sh/) — Certificate Transparency search.
- [ICANN Lookup (RDAP)](https://lookup.icann.org/) — the modern WHOIS.
- [OWASP Amass](https://github.com/owasp-amass/amass) · [subfinder](https://github.com/projectdiscovery/subfinder) · [theHarvester](https://github.com/laramies/theHarvester) — passive discovery.
- [Shodan](https://www.shodan.io/) · [Censys](https://search.censys.io/) — Internet-wide service maps.
- [Person & Social OSINT (Week 7)](/2026-05/week-7/person-social-osint/) — the people-focused side, with its heavier ethics.

<!-- SOURCES: https://crt.sh/ , https://lookup.icann.org/ , https://github.com/owasp-amass/amass , https://github.com/projectdiscovery/subfinder , https://github.com/laramies/theHarvester , https://www.shodan.io/ , https://search.censys.io/ , https://docs.github.com/en/search-github/searching-on-github/searching-code , https://opencorporates.com/ , https://exiftool.org/ . VIDEO OMITTED: grok-suggested "Cyber With Nelia" video unverifiable. -->
