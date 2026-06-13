# Contributing

Use this repository as a term-based course content repo.

## Where Content Goes

- Current term content goes under `2026-05/docs/`.
- Term landing pages and sidebars live at `YYYY-MM/README.md` and `YYYY-MM/_sidebar.md`.
- Module pages go under `YYYY-MM/docs/modules/`.
- Assessment pages go under `YYYY-MM/docs/assessments/`.
- Project specifications go under `YYYY-MM/docs/projects/`.
- Reusable current-term reference pages go under `YYYY-MM/docs/reference/`.
- Term-specific live-session indexes go under `YYYY-MM/docs/live-sessions/`.
- Term-specific images and downloads go under `YYYY-MM/assets/`.
- Historical top-level lesson pages live under `legacy/2025-content/`.

Do not add new lesson pages at the repository root. Root files should be limited to project-level entry points and publishing configuration.

## Current Term Structure

```text
2026-05/
├── README.md
├── _sidebar.md
├── assets/
└── docs/
    ├── README.md
    ├── modules/
    ├── assessments/
    ├── projects/
    ├── reference/
    └── live-sessions/
```

The May 2026 content is expected to change substantially. Replace the scaffold page contents as the term is finalized, but keep the folder boundaries stable.

## Links

Prefer relative links inside a term:

```markdown
[Project 1](docs/projects/project-1.md)
[Next module](modules/02-deployment-tools.md)
```

Use root-relative links for shared assets:

```markdown
![Portal Inbox](/images/portal_notifications.webp)
```

## Validation

Run local link checks before publishing:

```bash
npm run check:links
```

Production publishing is handled by:

```bash
./setup.sh
```

`setup.sh` builds a temporary Hugo site, republishes legacy pages at their old URLs, and writes the final static site to `public/`.
