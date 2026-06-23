# Session 4: Environment variables and GitHub

<div class="live-session-note" data-deck-id="week-1-session-4-env-github" data-week="Week 1" data-session="Session 4" data-title="Environment variables and GitHub" data-video="https://youtu.be/c0GXO3dh_sM" data-faq="live-sessions/20250517-c0GXO3dh_sM.md">
<textarea data-live-session-slides>
# Environment variables and GitHub
## Live session 4

- Keep secrets out of code
- Use GitHub as the shared source of truth
- Publish small artifacts safely
---
## Environment variables

Variables configure behavior without editing code.

```bash
export API_BASE_URL="https://example.com"
export API_KEY="not-for-git"
echo "$API_BASE_URL"
```
---
## Secrets rule

Never commit:

- API keys
- tokens
- passwords
- cookies
- private certificates
- personal data dumps
---
## GitHub basics

```bash
git remote -v
git branch
git push origin main
git pull --ff-only
```

Use GitHub to share commits, not random zip files.
---
## Good repository hygiene

- README explains how to run
- `.gitignore` keeps generated files out
- Small commits with specific messages
- Issues or notes record unresolved work
---
## GitHub Pages

Static publishing works well for:

- docs
- charts
- simple dashboards
- generated reports
- live-session slide notes
---
## Common failure modes

| Problem | Check |
| --- | --- |
| push rejected | pull first |
| secret leaked | rotate key |
| page 404 | branch and path |
| wrong file online | build output |
---
## Annotation exercise

- Mark the line that must never be committed
- Circle the command that pushes work
- Note which files belong in `.gitignore`
---
## End state

You can connect a local repo to GitHub, protect secrets, and publish a static artifact.
</textarea>
</div>
