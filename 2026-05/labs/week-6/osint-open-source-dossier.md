# Lab — Open-Source Organisation Dossier

> Assemble a fully-cited profile of an organisation's public footprint, where every single claim carries its source, timestamp, and confidence level.

⏱ ~3–4 hours
🔗 needs: [OSINT — Infrastructure & Records](/2026-05/week-6/osint/) · [Google Dorking](/2026-05/week-6/google-dork/) · [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/)

The skill being graded is **not** collection — anyone can paste tool output. It's **verification**: knowing what your evidence actually supports, and saying so honestly.

> ⚖️ **Scope rules — a submission that breaks any of these scores zero.**
>
> - Target an **organisation**, never a private individual. Pick a large company, a public institution, a government body, or your own project.
> - **Passive collection only.** Public records, DNS, certificate logs, archives, published documents. **No port scanning, no vulnerability probing, no logging in, no access attempts of any kind.**
> - Named individuals appear only in their **official public capacity** (a CEO named in an annual report). No personal addresses, no personal contact details, no family, no private social accounts.
> - You are producing a *research artifact*, not a target package. If a section would only be useful to an attacker, cut it.

## Requirements

**1. Pick a target and write the question.** One sentence, e.g. *"What public technical and corporate footprint does <org> have, and how has it changed over five years?"* A dossier without a question is just a pile.

**2. Collect across at least four independent source categories:**

| Category | Examples |
|---|---|
| Domain & DNS | RDAP/WHOIS, `dig`, MX/TXT records |
| Certificates | [crt.sh](https://crt.sh/) — hostnames over time |
| Web history | [Wayback](/2026-05/week-6/wayback-commoncrawl/) — how the site changed |
| Public records | Corporate filings, OpenCorporates, government open data |
| Published documents | `site:` + `filetype:pdf` dorks; annual reports |
| Public code | GitHub org repos, published packages |

**3. Cite every claim.** Each row in your findings table carries:

```
claim | source URL or exact command | retrieved (UTC) | confidence | corroborating source
```

**4. Corroborate the material claims.** At least **five** claims confirmed by two *independent* sources that don't merely mirror each other. State explicitly what raises or lowers your confidence.

**5. Separate observation from interpretation.** Two clearly-labelled sections:
- *Observed*: "MX records point to `<provider>` as of 2026-08-07 14:02 UTC."
- *Inferred*: "This suggests they use `<provider>` for email — medium confidence; MX can be stale or third-party managed."

**6. Write a limitations section.** What you couldn't determine, what might be wrong, what's likely out of date. **This section is worth more marks than a longer findings list.**

**7. Automate one part.** One reproducible script — e.g. the [CT-log enumerator](/2026-05/week-6/osint/) or a [Wayback timeline](/2026-05/week-6/wayback-commoncrawl/) — committed and runnable.

## Deliverables

| # | Item |
|---|---|
| 1 | `DOSSIER.md` — question, methodology, observed, inferred, limitations |
| 2 | Findings table with a citation on **every** row |
| 3 | One runnable collection script |
| 4 | Raw artifacts (JSON/command output) in an `evidence/` folder |
| 5 | A short ethics statement: scope, what you deliberately didn't collect, and why |

## Grading

| Weight | Criterion |
|---|---|
| 30% | **Verification** — corroboration, honest confidence levels, provenance on every claim |
| 20% | **Limitations** — knowing and stating what your evidence *doesn't* support |
| 20% | **Method** — reproducible, automated where sensible, clearly documented |
| 15% | **Breadth** — four or more genuinely independent source categories |
| 15% | **Ethics** — scope respected, data minimised, no target package |

Note the weighting: **half the marks are for epistemic honesty**, not for how much you found. A short dossier with impeccable sourcing beats an exhaustive one full of unverified assertions.

## Automatic-zero conditions

- Any active scanning, probing, or authentication attempt.
- A private individual as the subject.
- Personal contact details, home addresses, or private accounts.
- Uncited claims presented as fact.

## Stretch goals

- Build a five-year timeline of the org's infrastructure from CT logs plus Wayback snapshots.
- Do it for **your own** project/domain and write the remediation list → [Dorking for Recon](/2026-05/week-7/dorking-recon/).
- Write a short note on which single source proved *least* reliable, with evidence.
