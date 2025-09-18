# Project: LLM Code Deployment

<!-- https://chatgpt.com/c/68cb90cb-7a64-8331-bfbf-aa222df475de -->

> [!WARNING]
> This project is **work in progress**. _Anything_ may change.

**Goal**: A student receives a **signed request** from faculty, verifies it, uses an **LLM-assisted scaffold** to build an app, creates and pushes a **GitHub repo**, auto‑enables **GitHub Pages**, then **pings an evaluation API**. Faculty run automated **static, dynamic (Playwright), and LLM** checks; results are stored and published **after the deadline**. Faculty then send a **second signed request** tailored to the student’s codebase; student updates the app and triggers the second evaluation.

This spec consolidates best practices from earlier projects (clear pre‑req gates, deterministic APIs, env‑var secrets, public repos with MIT license, promptfoo/Playwright‑friendly evaluations, public tests vs private scoring) while keeping tooling **minimal, CLI‑first, declarative**.

## 0. Timeline & Support

- **Deadline**: _TBD (EoD IST)_ · Results announced by _TBD_
- **Discussion**: _TBD Discourse thread_

## 1. Actors & End‑to‑End Flow

**Actors**: Student Agent (you), Faculty Issuer, Faculty Evaluator, Evaluation Store.

**Round 1 (Bootstrap)**

1. Faculty issues a **Signed Request Envelope (SRE)** containing:
   - task brief (natural language), data payloads (e.g., CSV), rubric hints, **evaluation endpoint URL**, and **round=1**
   - JOSE‑style **signature** over the envelope
2. Student **verifies signature** using the published faculty public key; reject if invalid/expired.
3. Student uses an **LLM‑assisted generator** to:
   - scaffold the app
   - **create a GitHub repo** (via API) and push
   - **enable GitHub Pages** (via Actions or API)
4. Student **pings** the evaluation endpoint with repo metadata (repo URL, commit SHA, Pages URL, round=1, nonce).
5. Faculty pipeline runs automated checks; **stores scores** per criterion.

**Round 2 (Adaptive change request)**

6. Faculty sends a **second SRE (round=2)** tailored to this student’s existing repo and the targeted learning concepts.
7. Student verifies signature, **modifies code**, re‑deploys Pages, and **pings** evaluation again with updated metadata.
8. Faculty re‑runs checks; scores are **stored** and **published after the deadline**.

## 2. Signed Request Envelope (SRE)

A compact, language‑agnostic, signed JSON bundle.

### 2.1 Transport

- Sent as **JSON** over HTTPS (or downloadable JSON file).
- Attachments are included as entries in `attachments[]` where each entry is either:
  - `{ "name": "data.csv", "mediaType": "text/csv", "encoding": "base64", "content": "..." }`
  - or `{ "name": "assets.zip", "mediaType": "application/zip", "encoding": "base64", "content": "..." }`

### 2.2 Canonical JSON (before signing)

```json
{
  "issuer": "tds-faculty",
  "kid": "tds-ed25519-2025q1",
  "issued_at": "2025-02-01T09:00:00Z",
  "expires_at": "2025-03-31T18:30:00Z",
  "round": 1,
  "assignment_id": "srba-2025q1",
  "student": { "email": "student@example.com" },
  "task": {
    "title": "Build & deploy an app from signed brief",
    "brief": "Create an interactive single-page app from the attached CSV that …",
    "hints": ["Use DuckDB WASM or SQLite WASM for client-side queries", "Keep bundle < 2MB"],
    "expected_outputs": ["GitHub Pages site", "/api/status endpoint returning JSON", "README with usage"],
    "constraints": { "language": ["py", "js"], "runtime": ["browser", "serverless"], "time_limit_s": 300 }
  },
  "rubric": {
    "static": ["license_mit", "readme_quality", "no_secrets", "tests_present"],
    "dynamic": ["page_load_ok", "core_feature_ok", "a11y_checks"],
    "llm": ["doc_quality", "code_clarity"],
    "weights": { "static": 0.3, "dynamic": 0.5, "llm": 0.2 }
  },
  "evaluation": {
    "notify_url": "https://eval.example.edu/notify",
    "callback_fields": ["repo_url", "commit_sha", "pages_url", "round", "nonce"],
    "public_tests": true
  },
  "attachments": [{ "name": "seed.csv", "mediaType": "text/csv", "encoding": "base64", "content": "..." }],
  "nonce": "c6b3a7a7-...",
  "signature": {
    "alg": "Ed25519",
    "sig_base64": "<filled by signer>",
    "payload_hash": "SHA256:<hex>",
    "canonical": true
  }
}
```

### 2.3 Algorithm & Keys

- **Alg**: `Ed25519` (libsodium/NaCl), minimal and fast. Public key is published at a **Well‑Known URL** and embedded in the course page. Key rotation is via new `kid`.
- Faculty signs the SHA‑256 of the **canonical JSON without the `signature` object**.
- Students must:
  1. fetch the correct public key for `kid`
  2. recompute `payload_hash`
  3. verify `sig_base64`
  4. check `issued_at/expires_at`, `round` and `assignment_id`
  5. validate `nonce` is unseen (prevents replay)

### 2.4 Minimal Verification Snippets

**Python (pynacl)**

```python
import json, base64, hashlib
from nacl.signing import VerifyKey

pubkey_b64 = "<faculty_ed25519_pubkey_base64>"
verify_key = VerifyKey(base64.b64decode(pubkey_b64))

def verify(sre):
    sig = base64.b64decode(sre["signature"]["sig_base64"])
    payload = dict(sre); payload.pop("signature", None)
    canon = json.dumps(payload, separators=(",",":"), ensure_ascii=False).encode()
    verify_key.verify(canon, sig)  # raises if invalid
    assert sre["signature"]["payload_hash"].startswith("SHA256:")
    assert hashlib.sha256(canon).hexdigest() == sre["signature"]["payload_hash"][7:]
```

**Node (tweetnacl)**

```js
import nacl from "tweetnacl";
function verify(sre, pubkeyBase64) {
  const sig = Buffer.from(sre.signature.sig_base64, "base64");
  const payload = { ...sre };
  delete payload.signature;
  const canon = Buffer.from(JSON.stringify(payload));
  const pk = Buffer.from(pubkeyBase64, "base64");
  if (!nacl.sign.detached.verify(new Uint8Array(canon), new Uint8Array(sig), new Uint8Array(pk)))
    throw new Error("bad sig");
}
```

### 2.5 Dev‑mode SRE Generator (for local testing)

Provide a tiny CLI (Python) to **sign** any JSON and emit a full SRE with a **dev private key** (for students to simulate faculty inputs). Include:

- `dev-keys/dev.ed25519.pub` and `dev-keys/dev.ed25519.secret` (obviously **not used** by real faculty)
- `scripts/sre-sign.py` (reads `payload.json`, adds `signature`) and `scripts/sre-verify.py`

## 3. Student Agent: Responsibilities

Students build a small, deterministic **CLI** (with optional web UI) that:

1. **Accepts SRE** (JSON file path or URL)
   - `agent accept --sre path/to/sre.json`
   - Verifies signature, stashes attachments under `./input/`, logs a green **Faculty Verified ✓** banner.
2. **LLM‑Assisted Scaffolding**
   - Parse `task.brief` and attachments; generate minimal app.
   - Prefer **small OSS** libs; keep prompts concise; honor `constraints`.
   - Pluggable LLM provider via env: `OPENAI_API_KEY` **or** `AIPROXY_TOKEN`. Allow `--provider openai|proxy|none`.
3. **Create Repo & Push**
   - Use `GITHUB_TOKEN` (fine‑grained PAT). Never commit secrets.
   - Repo name suggestion: `srba-<assignment_id>-<rollno>`.
   - Initialize with `README.md`, `LICENSE` (MIT), `.gitignore`, minimal tests.
4. **Enable GitHub Pages** (pick **one**):
   - **GitHub Actions**: `pages` workflow building `/` to Pages
   - **Direct Settings API**: set `pages` source to `gh-pages` (if using static export)
5. **Notify Evaluation**

   - POST `evaluation.notify_url` with JSON:

   ```json
   {
     "repo_url": "https://github.com/user/srba-...",
     "commit_sha": "abc123",
     "pages_url": "https://user.github.io/srba-.../",
     "round": 1,
     "nonce": "<echo from SRE>",
     "student": { "email": "..." }
   }
   ```

   - Receive `{ "ok": true, "test_id": "..." }`.

6. **Round 2**
   - Accept second SRE (round=2) that references the student’s repo/files (e.g., “refactor data layer to use Web Worker; add filter UI; keep URL hash state”).
   - Modify code accordingly; redeploy Pages; **notify** again with `round=2`.
7. **Operational Constraints**
   - **Never** leak tokens in the repo/Pages.
   - Avoid network calls outside allowed domains if specified.
   - All CLI commands **must complete within 5 minutes** per round.
   - Keep reproducible scripts: `Makefile` targets: `accept`, `scaffold`, `push`, `pages`, `notify`.

## 4. Faculty Evaluation Pipeline (Reference)

The faculty system (for transparency) will:

### 4.1 Pre‑requisite Gates (hard fail)

- Repo is public & unique
- `LICENSE` = MIT at repo root
- Pages is enabled and reachable (200 OK)

### 4.2 Static Checks (examples)

- No secrets in git history (trufflehog, gitleaks)
- `README.md` completeness (install/run/scope screenshots)
- Source tree sanity (src/, tests/, data/, ci/)

### 4.3 Dynamic Checks (Playwright)

- Load Pages URL, assert core UI features (selectors/text)
- Lighthouse basic performance/a11y caps (budgeted)
- Optional API endpoint probes if present

### 4.4 LLM Checks

- Rubric‑scored doc clarity, code comments, UX microcopy (promptfoo `llm-rubric`)

### 4.5 Scoring (illustrative)

- **Static** 30% (pass/fail sub‑items, partials)
- **Dynamic** 50% (Playwright tasks, 0/1/partial)
- **LLM** 20% (rubric booleans)
- Bonus: unique approach, extra tests, dataset storytelling

Results are stored in a DB keyed by `assignment_id, student.email`. **Published post‑deadline** only.

## 5. Student Local Testing: Scaffolds

To help students **simulate inputs and end‑to‑end**:

### 5.1 Dev SRE Bundle

- `dev-keys/` (Ed25519 keypair) — for local only
- `samples/round1.sre.json` (signed with dev key; includes a small CSV)
- `samples/round2.sre.json` (signed with dev key; mutation brief referencing a file path from round1)
- `scripts/sre-sign.py`, `scripts/sre-verify.py` (tiny, dependency‑light)

### 5.2 Mock Evaluation Server

A minimal HTTP server students can run locally to see what payloads look like.

- `eval-mock/server.py`:
  - `POST /notify` echoes `{ok:true, test_id:"local-<ts>"}` and logs body
  - Provides `/public-tests.json` containing Playwright selectors & steps for self‑checks

### 5.3 Public Test Artifacts

- `public-tests/playwright.spec.ts` (opens `pages_url`, checks 2‑3 selectors)
- `public-tests/promptfoo.yaml` (LLM rubric on README clarity, time‑boxed)
- `public-tests/static.yaml` (no‑secrets, license present)

### 5.4 Convenience Makefile (student repo)

```make
accept:   python scripts/agent.py accept --sre input/round1.sre.json
scaffold: python scripts/agent.py scaffold
push:     python scripts/agent.py push
pages:    python scripts/agent.py pages
notify:   python scripts/agent.py notify --round 1 --url https://localhost:8000/notify
```

## 6. Deliverables

- Public **GitHub repository** with:
  - `LICENSE` (MIT)
  - `README.md` (what it does, how to run, link to Pages, screenshots/gif)
  - `Makefile` (or simple shell scripts)
  - Minimal tests (`public-tests/` prepared for Playwright)
  - (Optional) `Dockerfile` if you prefer containerized build
- **GitHub Pages** URL
- **Submission form** fields (TBD): repo URL, Pages URL, primary commit SHA

## 7. Evaluation & Scoring (Student‑visible)

- **Eligibility** (hard gate): repo public, MIT license, Pages reachable
- **Round 1**: 50 points
  - Repo+Pages automation: 10
  - Static checks: 10
  - Dynamic checks: 20
  - LLM rubric: 10
- **Round 2**: 50 points
  - Correctness of change: 25
  - Regression safety (core flow still passes): 15
  - Documentation update/commit hygiene: 10
- **Bonus**: up to +10 (creative features, perf, a11y)
- **No normalization**. What you get is what you get.

**Retries & Timeouts**

- Evaluation attempts per round: up to 3 on faculty side
- Student operations per command should finish within **5 minutes**

**Results publication**

- Scores released **after** deadline; no intermediate leaderboard

## 8. Security & Ethics

- Do **not** commit tokens; use env vars (`GITHUB_TOKEN`, `OPENAI_API_KEY`/`AIPROXY_TOKEN`).
- Respect attachment licenses; do not exfiltrate beyond assignment scope.
- If the brief includes scraping, honor robots.txt and rate limits.

## 9. Reference Snippets

### 9.1 GitHub: Create Repo (REST)

- Endpoint: `POST /user/repos` with `{ name, private:false, has_issues:true }`
- Headers: `Authorization: token <GITHUB_TOKEN>`

### 9.2 Enable Pages via Actions (static site)

Minimal `/.github/workflows/pages.yml`:

```yaml
name: Pages
on: { push: { branches: [main] } }
permissions: { contents: write, pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: mkdir -p dist && cp -r public/* dist/
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions: { pages: write, id-token: write }
    steps:
      - uses: actions/deploy-pages@v4
```

### 9.3 Playwright Sample (public test)

```ts
import { test, expect } from "@playwright/test";
test("pages loads", async ({ page }) => {
  await page.goto(process.env.PAGES_URL!);
  await expect(page.getByRole("heading", { name: /Dashboard/i })).toBeVisible();
});
```

### 9.4 promptfoo LLM Rubric (README clarity)

```yaml
providers:
  - id: openai:gpt-4.1-mini
    config: { apiKeyEnvVar: OPENAI_API_KEY }
assert:
  - type: llm-rubric
    weight: 10
    rubricPrompt: |
      Grade README clarity (install steps, usage, link to Pages, screenshot). Return {score:0..10}.
    threshold: 0.6
```

## 10. Round 2 — Adaptive Change Requests (Examples)

- **Refactor**: Move heavy compute to a Web Worker; keep UI responsive; maintain feature parity
- **Data model**: Parameterize CSV schema; add schema validation and error reporting
- **UX**: Add filter + permalink via URL hash; update README screenshots
- **Perf**: Reduce bundlesize < 300KB; lazy‑load charting lib

Each adaptive brief will reference **your repo structure** (e.g., `src/worker.ts`, `public/index.html`), ensuring the agent must reason about **your** code.

## 11. Student Checklist (Quick)

- [ ] Verify SRE (sig, expiry, nonce)
- [ ] Scaffold app via LLM (minimal, deterministic)
- [ ] Create repo (public), push, MIT license
- [ ] Enable Pages and confirm 200 OK
- [ ] Notify eval (round=1)
- [ ] Accept round 2; update app; Pages OK
- [ ] Notify eval (round=2)
- [ ] Keep logs and makefile targets tidy

## 12. Submission (TBD)

- Form fields: Repo URL, Pages URL, Primary email, Commit SHA
- Optional: link to demo video/gif (<60s)

## 13. Appendix: JSON Schemas (abridged)

### SRE Envelope

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": [
    "issuer",
    "kid",
    "issued_at",
    "expires_at",
    "round",
    "assignment_id",
    "task",
    "evaluation",
    "nonce",
    "signature"
  ],
  "properties": {
    "issuer": { "type": "string" },
    "kid": { "type": "string" },
    "issued_at": { "type": "string", "format": "date-time" },
    "expires_at": { "type": "string", "format": "date-time" },
    "round": { "type": "integer", "enum": [1, 2] },
    "assignment_id": { "type": "string" },
    "student": { "type": "object", "properties": { "email": { "type": "string", "format": "email" } } },
    "task": { "type": "object" },
    "rubric": { "type": "object" },
    "evaluation": {
      "type": "object",
      "properties": {
        "notify_url": { "type": "string", "format": "uri" },
        "callback_fields": { "type": "array", "items": { "type": "string" } },
        "public_tests": { "type": "boolean" }
      }
    },
    "attachments": { "type": "array", "items": { "type": "object" } },
    "nonce": { "type": "string" },
    "signature": {
      "type": "object",
      "required": ["alg", "sig_base64", "payload_hash"],
      "properties": {
        "alg": { "type": "string" },
        "sig_base64": { "type": "string" },
        "payload_hash": { "type": "string" },
        "canonical": { "type": "boolean" }
      }
    }
  }
}
```

### Notes & Rationale

- **Ed25519** keeps verification trivial across Python/Node, matches minimalism.
- **Pages‑first** reduces infra; dynamic bits can be emulated client‑side.
- **Public tests** empower students to self‑validate; **private cases** preserve evaluation integrity.
- **Two‑round** structure tests _adaptive reasoning on their own codebase_, not just greenfield scaffolding.
