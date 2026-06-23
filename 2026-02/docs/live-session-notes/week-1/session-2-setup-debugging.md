# Session 2: Setup and debugging

<div class="live-session-note" data-deck-id="week-1-session-2-setup-debugging" data-week="Week 1" data-session="Session 2" data-title="Setup and debugging" data-video="https://youtu.be/TiqtXjmmKFA" data-faq="live-sessions/20250515-TiqtXjmmKFA.md">
<textarea data-live-session-slides>
# Setup and debugging
## Live session 2

- Make your machine predictable
- Learn where commands run
- Diagnose errors from the outside in
---
## The setup stack

- Browser for docs and web apps
- VS Code for editing
- Terminal for commands
- Python through uv
- Git and GitHub for history
---
## First checks

```bash
pwd
ls
python --version
uv --version
git --version
code --version
```

If one check fails, isolate that tool before moving ahead.
---
## Debugging order

1. What command did I run?
2. Which folder was I in?
3. What exact error did I get?
4. What changed since it worked?
5. Can I reproduce it in a tiny folder?
---
## Reading errors

Good debugging starts with nouns:

- File path
- Module name
- Port number
- Permission
- Environment variable
- Line number
---
## Common setup traps

| Symptom | Likely cause |
| --- | --- |
| command not found | PATH or missing install |
| module not found | wrong environment |
| permission denied | file mode or protected path |
| port in use | old server still running |
---
## Minimal reproduction

```bash
mkdir debug-lab
cd debug-lab
uv init
uv add requests
uv run python -c "import requests; print(requests.get('https://example.com').status_code)"
```
---
## Annotation exercise

- Underline the error noun
- Box the folder path
- Mark the command that should be rerun
- Write one hypothesis on the slide
---
## End state

You can explain:

- Which tool is failing
- Where it is failing
- What evidence proves the fix
</textarea>
</div>
