# Tools in Data Science

Course content for [Tools in Data Science](https://study.iitm.ac.in/ds/course_pages/BSSE2002.html), a diploma level course at IIT Madras.

**Read the course at [tds.s-anand.net](https://tds.s-anand.net/).** The site home page always shows the current term.

## Terms

| Term     | Content                        |
| -------- | ------------------------------ |
| Sep 2026 | [2026-09/](2026-09/) (current) |
| May 2026 | [2026-05/](2026-05/)           |
| Jan 2026 | No content                     |
| Sep 2025 | [2025-09/](2025-09/)           |
| May 2025 | [2025-05/](2025-05/)           |
| Jan 2025 | [2025-01/](2025-01/)           |

## Repository layout

| Path                          | What it holds                                                                       |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `20YY-MM/`                    | One folder per term. `README.md` is the term home page, `_sidebar.md` its navigation. |
| `topics/`                     | Shared topic pages used by the 2025 terms. Published at the site root (`/bash/`).  |
| `live-sessions/`              | FAQ summaries of recorded live sessions.                                            |
| `images/`                     | Images shared across terms.                                                         |
| `prompts/`                    | Prompts used to generate or review content.                                         |
| `terms.yml`                   | List of terms. `current` is the term shown at the site root.                        |
| `hugo/`, `setup.sh`           | Hugo scaffold and the build script.                                                 |

`topics/*.md` files are imported by the [exam](https://github.com/sanand0/exam) repository via a git submodule. Moving or renaming them breaks its build.

## Build

Requires Go and Hugo Extended v0.163.3.

```bash
mise x go hugo-extended@0.163.3 -- ./setup.sh
```

The static site is written to `public/`. Pushes to `main` deploy to GitHub Pages via `.github/workflows/`.

## Start a new term

1. Create a `20YY-MM/` folder with `README.md` and `_sidebar.md` (copy the structure of the latest term).
2. Add the term to `terms.yml` and set `current` to it.
3. Add it to the table above.
