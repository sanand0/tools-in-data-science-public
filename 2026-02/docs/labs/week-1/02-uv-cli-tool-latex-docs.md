# Lab 1.2 — UV CLI Tool + LaTeX Docs PDF on GitHub Pages

?> **What you'll build**
?> A command-line tool published via **UV** that anyone can run with `uvx your-tool`, plus a professional PDF documentation file generated with **LaTeX + pandoc**, deployed to **GitHub Pages** along with a Docusaurus-style HTML site.

**Time:** 60–90 minutes.
**Difficulty:** ⭐⭐⭐☆☆.
**Ship:** a live GitHub Pages URL with your docs + downloadable PDF.

## What the Finished Thing Looks Like

By the end:

```bash
uvx tds-csv-YOURNAME sample.csv --top 5
# ┌──────┬────────┐
# │ City │ Count  │
# ├──────┼────────┤
# │ ...  │ ...    │
# └──────┴────────┘
```

And `https://<username>.github.io/tds-csv-YOURNAME/` shows your documentation site with a **Download PDF** button.

## Prerequisites

- Completed [Lab 1.1](./publish-python-library-pypi-uv) (at least through Step 6) — you understand UV + pyproject.toml.
- LaTeX + pandoc available locally ([see latex.mdx](../../week-1/latex)). GitHub Actions has both preinstalled — so local is optional.
- GitHub Pages enabled on your account.

---

## The Steps

<details>
<summary><b>Step 1 — Plan the CLI</b></summary>

Our CLI will be `tds-csv-YOURNAME`. Features:

- Takes a CSV file path.
- Optionally filters to the top N rows by a given column.
- Pretty-prints as a table using `rich`.

```
Usage: tds-csv [OPTIONS] FILE

  Quickly explore a CSV file.

Options:
  --top INTEGER           Show top N rows [default: 10]
  --by TEXT               Sort by column (default: first column)
  --help                  Show this message and exit.
```

</details>

<details>
<summary><b>Step 2 — Scaffold the project</b></summary>

```bash
uv init --app --python 3.13 tds-csv-YOURNAME
cd tds-csv-YOURNAME
```

We use `--app` (not `--lib`) because this is a CLI app. UV creates a single-module layout:

```
tds-csv-YOURNAME/
├── .gitignore
├── .python-version
├── README.md
├── main.py
└── pyproject.toml
```

Add dependencies:

```bash
uv add typer "rich>=13" pandas
uv add --dev pytest
```

</details>

<details>
<summary><b>Step 3 — Write the CLI</b></summary>

Rename `main.py` to `cli.py` and replace its contents:

```python title="cli.py"
"""tds-csv — quickly explore a CSV file."""

from pathlib import Path
from importlib.metadata import version as _v

import pandas as pd
import typer
from rich.console import Console
from rich.table import Table

__version__ = _v("tds-csv-YOURNAME")

app = typer.Typer(
    name="tds-csv",
    help="Quickly explore a CSV file.",
    add_completion=False,
)
console = Console()

def _render(df: pd.DataFrame, title: str) -> None:
    table = Table(title=title, show_lines=True)
    for col in df.columns:
        table.add_column(str(col), style="cyan")
    for _, row in df.iterrows():
        table.add_row(*[str(v) for v in row])
    console.print(table)

@app.command()
def main(
    file: Path = typer.Argument(..., exists=True, readable=True, help="CSV file to read."),
    top: int = typer.Option(10, help="Show top N rows."),
    by: str | None = typer.Option(None, help="Sort by column (default: first column)."),
    version: bool = typer.Option(False, "--version", help="Show version and exit."),
) -> None:
    """Render a CSV file as a pretty table."""
    if version:
        console.print(f"tds-csv v{__version__}")
        raise typer.Exit()

    df = pd.read_csv(file)
    sort_col = by or df.columns[0]
    if sort_col not in df.columns:
        console.print(f"[red]Column '{sort_col}' not in CSV[/red]")
        raise typer.Exit(code=1)
    df = df.sort_values(by=sort_col, ascending=False).head(top)
    _render(df, f"{file.name} — top {top} by {sort_col}")

if __name__ == "__main__":
    app()
```

</details>

<details>
<summary><b>Step 4 — Wire it up as a CLI entry point</b></summary>

Edit `pyproject.toml` to expose `tds-csv` as an entry point:

```toml title="pyproject.toml (add this section)"
[project.scripts]
tds-csv = "cli:app"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

Full file should look like:

```toml title="pyproject.toml"
[project]
name = "tds-csv-YOURNAME"
version = "0.1.0"
description = "Quickly explore a CSV file from the command line."
readme = "README.md"
license = "MIT"
requires-python = ">=3.11"
authors = [{ name = "Your Name", email = "you@example.com" }]
dependencies = [
    "typer",
    "rich>=13",
    "pandas",
]

[project.scripts]
tds-csv = "cli:app"

[project.urls]
Homepage = "https://github.com/YOUR-USERNAME/tds-csv-YOURNAME"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[dependency-groups]
dev = ["pytest>=8"]

[tool.hatch.build.targets.wheel]
packages = ["."]
include = ["cli.py"]
```

Test it locally:

```bash
uv sync
uv run tds-csv --help
```

You should see the Typer help output.

</details>

<details>
<summary><b>Step 5 — Create a sample CSV and try it</b></summary>

```bash
cat > sample.csv <<'EOF'
city,population,state
Chennai,7088000,Tamil Nadu
Mumbai,20411000,Maharashtra
Bangalore,8443000,Karnataka
Hyderabad,6809000,Telangana
Pune,3124000,Maharashtra
Kolkata,14850000,West Bengal
Delhi,28514000,Delhi
EOF

uv run tds-csv sample.csv --top 5 --by population
```

You should see a nicely formatted table sorted by population.

</details>

<details>
<summary><b>Step 6 — Try it as a one-shot tool (uvx)</b></summary>

Build the wheel and run it from an ephemeral env:

```bash
uv build

# Run without installing globally
uv tool run --from "./dist/tds_csv_YOURNAME-0.1.0-py3-none-any.whl" tds-csv sample.csv --top 3
# or the short form:
uvx --from ./dist/*.whl tds-csv sample.csv --top 3
```

Later (after publishing to PyPI), anyone can `uvx tds-csv-YOURNAME sample.csv`.

</details>

<details>
<summary><b>Step 7 — Write Markdown documentation</b></summary>

Create a `docs/` folder and put your documentation in Markdown:

```bash
mkdir docs
```

```markdown title="docs/index.md"
---
title: tds-csv — User Guide
author: Your Name
date: 2026-05-10
---

# tds-csv

**tds-csv** is a tiny CLI for quickly exploring CSV files. Built for the
*Tools in Data Science* course at IIT Madras, May 2026.

## Installation

```bash
uvx tds-csv-YOURNAME --help
```

Or install globally:

```bash
uv tool install tds-csv-YOURNAME
tds-csv --help
```

## Usage

### Show the top 10 rows

```bash
tds-csv sample.csv
```

### Sort by a specific column

```bash
tds-csv sample.csv --by population --top 5
```

## How It Works

The tool:

1. Reads the CSV with `pandas.read_csv`.
2. Sorts by the chosen column (defaulting to the first column).
3. Takes the top *N* rows.
4. Renders them with `rich` as a Unicode table.

## Architecture

The formula for text-to-digital transformation in our case is:

```
output = Render(SortBy_col(Read(csv))[:N])
```

## License

MIT — see the [LICENSE](https://github.com/YOUR-USERNAME/tds-csv-YOURNAME/blob/main/LICENSE) file.
```

</details>

<details>
<summary><b>Step 8 — Build the PDF with pandoc + LaTeX</b></summary>

Create a pandoc template for nicer PDF output:

```latex title="docs/template.tex"
\documentclass[11pt,a4paper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}
\usepackage{graphicx}
\usepackage{fancyhdr}
\usepackage{amsmath}
\usepackage{xcolor}

\definecolor{tdsblue}{RGB}{79,70,229}
\hypersetup{
  colorlinks=true,
  linkcolor=tdsblue,
  urlcolor=tdsblue
}

\pagestyle{fancy}
\fancyhf{}
\lhead{$title$}
\rhead{$date$}
\cfoot{\thepage}

\title{\textcolor{tdsblue}{$title$}}
\author{$author$}
\date{$date$}

\begin{document}
\maketitle
\tableofcontents
\newpage

$body$

\end{document}
```

Locally test:

```bash
pandoc docs/index.md -o docs/tds-csv.pdf \
  --template=docs/template.tex \
  --pdf-engine=xelatex \
  --toc \
  --number-sections \
  --highlight-style=tango
```

Open `docs/tds-csv.pdf` — you should have a beautifully typeset document with a cover page, TOC, and code highlighting.

?> **If pandoc isn't installed locally**
?> Skip this local build and let GitHub Actions do it (Step 11). The Action's Ubuntu runner has `pandoc` + `texlive` pre-installable.

</details>

<details>
<summary><b>Step 9 — Build a Docusaurus site for the HTML docs</b></summary>

You have two choices:

- **Option A (quick)** — use plain HTML or mdBook. Small output, minutes to set up.
- **Option B (professional)** — use Docusaurus like the TDS course itself. Takes 10 minutes but matches the course pattern.

We'll go with **Option B — Docusaurus**. Initialize:

```bash
# in the repo root
npx create-docusaurus@latest site classic --typescript
```

This creates a `site/` folder. Move your documentation in and delete the default content:

```bash
rm -rf site/docs/* site/blog
cp docs/index.md site/docs/intro.md
```

Edit `site/docusaurus.config.ts` — set `url`, `baseUrl`, `organizationName`, `projectName`:

```ts title="site/docusaurus.config.ts"
const SITE_URL = process.env.SITE_URL ?? 'https://YOUR-USERNAME.github.io';
const BASE_URL = process.env.BASE_URL ?? '/tds-csv-YOURNAME/';

const config = {
  title: 'tds-csv',
  tagline: 'Quickly explore any CSV',
  url: SITE_URL,
  baseUrl: BASE_URL,
  organizationName: 'YOUR-USERNAME',
  projectName: 'tds-csv-YOURNAME',
  // ... (rest of defaults)
};
```

Test the dev server:

```bash
cd site
npm install
npm run start        # opens http://localhost:3000
```

Stop the dev server (<kbd>Ctrl</kbd>+<kbd>C</kbd>) and do a production build:

```bash
npm run build        # outputs to site/build
```

</details>

<details>
<summary><b>Step 10 — Link the PDF from the site</b></summary>

Docusaurus serves anything under `site/static/` as a top-level file. Copy the PDF there:

```bash
mkdir -p site/static/downloads
cp docs/tds-csv.pdf site/static/downloads/
```

Reference it in `site/docs/intro.md`:

```markdown
[📄 Download the full PDF manual](/downloads/tds-csv.pdf)
```

</details>

<details>
<summary><b>Step 11 — Write the GitHub Actions deploy workflow</b></summary>

This workflow **rebuilds the PDF** on every push and **deploys the site** to GitHub Pages.

```yaml title=".github/workflows/deploy.yml"
name: Deploy Docs

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

      # --- PDF step ---
      - name: Install pandoc + texlive
        run: |
          sudo apt-get update
          sudo apt-get install -y pandoc texlive-xetex texlive-fonts-recommended texlive-latex-extra

      - name: Build PDF
        run: |
          mkdir -p site/static/downloads
          pandoc docs/index.md -o site/static/downloads/tds-csv.pdf \
            --template=docs/template.tex \
            --pdf-engine=xelatex \
            --toc \
            --number-sections \
            --highlight-style=tango

      # --- Site step ---
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
          cache-dependency-path: site/package-lock.json

      - name: Install site deps
        working-directory: site
        run: npm ci

      - name: Build site
        working-directory: site
        env:
          SITE_URL: https://${{ github.repository_owner }}.github.io
          BASE_URL: /${{ github.event.repository.name }}/
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: site/build

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

</details>

<details>
<summary><b>Step 12 — Commit and deploy</b></summary>

Enable Pages on the repo: **Settings → Pages → Source: GitHub Actions**.

```bash
git add .
git commit -m "feat: initial site + PDF docs pipeline"
git push
```

Watch the **Actions** tab. The job takes ~3 minutes (pandoc + texlive install is the slow part). When it finishes green, open the URL shown in the `deploy` step.

You should see:

- A Docusaurus HTML site at `https://<username>.github.io/tds-csv-YOURNAME/`
- A **Download PDF** link inside it that serves your rendered PDF

</details>

<details>
<summary><b>Step 13 — Speed up the Action by caching texlive (optional but nice)</b></summary>

Installing TeX Live takes ~90 seconds. You can cache it:

```yaml
- name: Cache pandoc + texlive
  uses: actions/cache@v4
  id: cache-tex
  with:
    path: /usr/share/texlive
    key: texlive-${{ runner.os }}-v1

- name: Install pandoc + texlive
  if: steps.cache-tex.outputs.cache-hit != 'true'
  run: |
    sudo apt-get update
    sudo apt-get install -y pandoc texlive-xetex ...
```

This only helps on re-runs — first build is unchanged.

</details>

<details>
<summary><b>Step 14 — Publish the CLI to PyPI too</b></summary>

Same process as Lab 1.1: add a `.github/workflows/release.yml` that triggers on `v*` tags, publishes via Trusted Publishing. Once done, anyone in the world can `uvx tds-csv-YOURNAME my.csv`.

</details>

---

## Troubleshooting

<details>
<summary><b>pandoc "File not found" for template.tex</b></summary>

Your working directory in the Action matters. The `Build PDF` step runs from the repo root, so `docs/template.tex` is correct. If you moved things, update the path.

</details>

<details>
<summary><b>LaTeX error about missing packages</b></summary>

The `texlive-fonts-recommended texlive-latex-extra` packages cover most needs. If your template uses something exotic, add more packages:

```bash
sudo apt-get install -y texlive-science texlive-pictures
```

</details>

<details>
<summary><b>Docusaurus build fails with "broken link"</b></summary>

Docusaurus is strict about broken links. Either fix the link or set `onBrokenLinks: 'warn'` in `docusaurus.config.ts`.

</details>

<details>
<summary><b>Site renders at wrong URL (404s on CSS)</b></summary>

Your `baseUrl` is wrong. For a project site at `user.github.io/repo/`, baseUrl **must** be `'/repo/'` — with the trailing slash.

</details>

---

## What You've Learned

- Turning UV-managed code into an installable CLI via `[project.scripts]`.
- Using `uvx` to run tools in ephemeral environments.
- Authoring documentation in Markdown and rendering it to a professional PDF with pandoc + custom LaTeX template.
- Hosting a Docusaurus site on GitHub Pages with Actions.
- Combining two build outputs (site + PDF) in a single deploy pipeline.

## Write a Blog Post

- Compare pandoc with just writing `.tex` by hand — pros and cons.
- Explain the Docusaurus `baseUrl` gotcha.
- Show off your deployed URL!

## Next Lab

[**Lab 1.3 — Bash automation: daily project summary**](./bash-daily-project-summary)

## References

- [pandoc User's Guide](https://pandoc.org/MANUAL.html)
- [Docusaurus deployment guide](https://docusaurus.io/docs/deployment)
- [Typer docs](https://typer.tiangolo.com/)
- [Rich docs](https://rich.readthedocs.io/)

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

