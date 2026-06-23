# Session 5: Local LLMs and tunnels

<div class="live-session-note" data-deck-id="week-2-session-5-local-llms-tunnels" data-week="Week 2" data-session="Session 5" data-title="Local LLMs and tunnels">
<textarea data-live-session-slides>
# Local LLMs and tunnels
## Week 2 session 5

- Run models close to your machine
- Expose local services temporarily
- Understand security tradeoffs
---
## Local LLM options

- Ollama for quick local serving
- LM Studio for a desktop workflow
- llama.cpp for low-level control
- vLLM for high-throughput serving
---
## Local server shape

```bash
ollama serve
ollama run llama3.2
```

Then connect your app to the local endpoint.
---
## Tunnel mental model

```text
internet client -> tunnel provider -> your local machine -> local app
```

A tunnel makes local work reachable from outside.
---
## ngrok-style workflow

```bash
uv run uvicorn main:app --port 8000
ngrok http 8000
```

Use only for temporary demos unless you understand the access controls.
---
## Security checklist

- Do not expose admin routes
- Use temporary tokens
- Turn off the tunnel after the session
- Avoid sending private data to public URLs
- Keep logs for debugging
---
## When to use this

- Live demos
- Webhook testing
- Sharing a prototype
- Comparing local and hosted behavior
- Debugging browser/API integration
---
## Annotation exercise

- Draw the tunnel path
- Mark the local boundary
- Highlight the security control you would add first
---
## End state

You can run a local model-backed service and expose it briefly for testing without confusing it with production deployment.
</textarea>
</div>
