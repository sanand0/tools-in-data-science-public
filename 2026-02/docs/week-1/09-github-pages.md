# 09 · GitHub Pages

?> **TL;DR**
?> GitHub Pages hosts static websites straight out of a GitHub repository — for free, with HTTPS, and with your own domain if you want. Every IIT Madras student gets a free `.github.io` subdomain. This is where you'll host course labs, portfolios, and project demos for the rest of this course.

## What Can You Host?

Anything that's **static** — meaning the output is plain HTML/CSS/JS files (no database, no server-side code).

Perfect fit:

- Documentation sites (like this one — Docusaurus)
- Portfolio / résumé pages
- Landing pages
- React/Vue/Svelte single-page apps (built + deployed)
- Blogs (Jekyll, Hugo, Astro)
- Project demos (after Week 2 you'll deploy dynamic apps elsewhere)

**Not a fit:** anything requiring a backend, database, or secret API key on the server. For those we'll use Cloud Run (Week 7) or HuggingFace Spaces (Week 2).

[![How to Deploy a Website to GitHub Pages](https://img.youtube.com/vi/4xa90GTTq6Y/0.jpg)](https://youtu.be/4xa90GTTq6Y "How to Deploy a Website to GitHub Pages")

## The Two Kinds of Sites

| Type | URL | Repo name |
|------|-----|-----------|
| **User/Org site** | `https://<username>.github.io` | Must be named `<username>.github.io` |
| **Project site** | `https://<username>.github.io/<repo>` | Any repo name |

You get **one** user site per account. You get **unlimited** project sites.

## The Simplest Possible Deploy — 3 Minutes

### Step 1 — Create a repo

```bash
mkdir my-site && cd my-site
git init
echo "# My Site" > README.md
```

Create `index.html`:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello, GitHub Pages</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 42rem;
      margin: 4rem auto;
      padding: 0 1rem;
      line-height: 1.6;
    }
    h1 { color: #4f46e5; }
  </style>
</head>
<body>
  <h1>Hello, GitHub Pages 🎉</h1>
  <p>If you're reading this, my site is live.</p>
</body>
</html>
```

### Step 2 — Push to GitHub

```bash
gh repo create my-site --public --source=. --push
```

### Step 3 — Enable Pages

On GitHub: **Settings → Pages**:

- **Source**: Deploy from a branch
- **Branch**: `main`, folder `/ (root)`
- **Save**

Wait ~30 seconds. Your site is live at `https://<username>.github.io/my-site/`.

## Deploy with GitHub Actions (Recommended)

For any real project — especially if you're building a static site from source (React, Docusaurus, Hugo) — use GitHub Actions. This is how the TDS course site itself deploys.

```yaml title=".github/workflows/deploy.yml"
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install deps
        run: npm ci

      - name: Build
        run: npm run build
        env:
          SITE_URL: https://${{ github.repository_owner }}.github.io
          BASE_URL: /${{ github.event.repository.name }}/

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./build     # or ./dist, ./public, etc.

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then in **Settings → Pages → Source**: pick **GitHub Actions**.

Every push to `main` now triggers a build + deploy. You get a link to the deployment in the Actions tab.

## Jekyll — The Built-In Blogging Engine

If you commit a folder that looks like a Jekyll site (with a `_config.yml`), GitHub Pages will build it for you — no Action needed.

```yaml title="_config.yml"
title: My Blog
description: Notes about things.
theme: minima
```

```markdown title="_posts/2026-05-10-hello.md"
---
layout: post
title: "Hello, world"
date: 2026-05-10
---

This is my first post.
```

Push → GitHub Pages renders posts into HTML automatically. Zero build config.

For richer sites, switch to a more modern static generator (Hugo, Astro, Docusaurus, Next.js static export).

## Custom Domain

Own `example.com`? Point it at your GitHub Pages site:

1. On GitHub: **Settings → Pages → Custom domain**: enter `example.com`.
2. At your DNS provider, add:
   - For apex (`example.com`): 4 A records pointing to GitHub's IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - For subdomain (`docs.example.com`): a CNAME → `<username>.github.io.`
3. Wait ~1 hour for DNS to propagate.
4. Tick **Enforce HTTPS**.

GitHub provisions a TLS certificate automatically via Let's Encrypt.

## `.nojekyll` — Bypass Jekyll Processing

If your build output contains files or folders starting with `_` (like `_next/` from Next.js), Jekyll's default processing will ignore them. To tell Pages "don't touch my files":

```bash
touch build/.nojekyll       # or wherever your output lives
```

Then include this file in the deploy.

## Environment Variables for the Base URL

Project sites live at a **subpath** (`/my-site/`), which means `<link href="/style.css">` will try `/style.css` (wrong) instead of `/my-site/style.css`. Every framework has a config for this:

| Framework | Config |
|-----------|--------|
| **Docusaurus** | `baseUrl: '/my-site/'` in `docusaurus.config.ts` |
| **Vite / React Router** | `base: '/my-site/'` in `vite.config.ts` |
| **Next.js** | `basePath: '/my-site'` in `next.config.js` |
| **Astro** | `base: '/my-site'` in `astro.config.mjs` |
| **Hugo** | `baseURL = 'https://user.github.io/my-site/'` in `config.toml` |

Set this via an environment variable in your Action so the same codebase works on Pages *and* locally.

## Limits and Considerations

| Limit | Value |
|-------|-------|
| Repo size | 1 GB |
| File size | 100 MB |
| Bandwidth | 100 GB/month "soft" limit |
| Builds | 10 per hour |
| Best for | Low-to-medium traffic static sites |

For anything beyond these limits, use Cloudflare Pages or Vercel — both free tiers are more generous and deploy the same folder.

## The TDS Course Site Itself

The site you're reading now is built with **Docusaurus 3 + TypeScript + Tailwind**, and deployed via a GitHub Actions workflow just like the one above, to `iit-madras.github.io/tds-course`. Explore the repo to see a production-grade Docusaurus setup.

## 5-Minute Exercise

1. Create a new repo `<your-username>.github.io` (note: the repo name must match your username exactly for a user site).
2. Add an `index.html` and optionally a `style.css`.
3. Push to `main`.
4. Enable Pages → Source: `main` branch.
5. Within 30 seconds, your site is live at `https://<your-username>.github.io`. Share the link!

## Further Reading

- [GitHub Pages docs](https://docs.github.com/en/pages)
- [Configuring a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Jekyll](https://jekyllrb.com/)
- [Docusaurus on Pages guide](https://docusaurus.io/docs/deployment#deploying-to-github-pages)
- [actions/deploy-pages](https://github.com/actions/deploy-pages) — the canonical deployment action

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

