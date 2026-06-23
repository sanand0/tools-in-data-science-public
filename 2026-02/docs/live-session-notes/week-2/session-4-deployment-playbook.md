# Session 4: Deployment playbook

<div class="live-session-note" data-deck-id="week-2-session-4-deployment-playbook" data-week="Week 2" data-session="Session 4" data-title="Deployment playbook">
<textarea data-live-session-slides>
# Deployment playbook
## Week 2 session 4

- Choose the right hosting surface
- Prepare production config
- Verify the public endpoint
---
## Deployment surfaces

| Surface | Good for |
| --- | --- |
| GitHub Pages | static sites |
| Vercel | frontend and serverless |
| Render/Fly.io | long-running APIs |
| Cloud Run | containerized services |
| Hugging Face Spaces | demos and ML apps |
---
## Before deploy

- App has a health endpoint
- Port comes from the platform
- Secrets are in platform settings
- README says how to run locally
- Build command is documented
---
## Production config

```bash
PORT=8000
LOG_LEVEL=info
API_BASE_URL=https://api.example.com
```

Production should not depend on your laptop paths.
---
## Deployment smoke test

```bash
curl -i https://your-app.example.com/health
curl -i https://your-app.example.com/openapi.json
```

Save both outputs when submitting evidence.
---
## Observability basics

- Startup logs
- Request logs
- Error stack traces
- Deployment history
- Health check result
---
## Rollback thinking

Before changing production:

1. What version is live?
2. What changed?
3. How do I revert?
4. How will I know it recovered?
---
## Annotation exercise

- Circle the platform that matches the app
- Mark where secrets should live
- Add the first smoke-test URL
---
## End state

You can deploy a small service and prove that the public URL is running the expected version.
</textarea>
</div>
