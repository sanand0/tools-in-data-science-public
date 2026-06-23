# Session 5: Week 1 clinic

<div class="live-session-note" data-deck-id="week-1-session-5-week-1-clinic" data-week="Week 1" data-session="Session 5" data-title="Week 1 clinic" data-video="https://youtu.be/1a2x_oDwHlk" data-faq="live-sessions/20250517-1a2x_oDwHlk.md">
<textarea data-live-session-slides>
# Week 1 clinic
## Live session 5

- Connect the tools
- Practice diagnosis
- Prepare for graded work
---
## The Week 1 map

```text
editor -> terminal -> project -> git -> GitHub -> published output
```

Every link should be testable.
---
## Clinic pattern

For each question:

1. Reproduce the issue
2. Identify the failing layer
3. Make the smallest fix
4. Verify with a command
5. Record what changed
---
## A complete answer

- States the command
- Shows the output
- Explains the result
- Links to code or page
- Mentions limitations
---
## Practice scenario

```bash
uv init week1-check
cd week1-check
uv add rich
uv run python -c "from rich import print; print('[green]ok[/green]')"
git status
```
---
## Peer review checklist

| Check | Evidence |
| --- | --- |
| runs locally | command output |
| versioned | git status clean |
| documented | README |
| shareable | GitHub link |
---
## Annotation exercise

- Put a check beside each completed layer
- Highlight missing evidence
- Write one next action for the student
---
## End state

You are ready for Week 2 if you can build a tiny project, version it, and explain every moving piece.
</textarea>
</div>
