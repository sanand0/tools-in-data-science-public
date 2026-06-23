# Session 3: Shell and Git foundations

<div class="live-session-note" data-deck-id="week-1-session-3-shell-git-foundations" data-week="Week 1" data-session="Session 3" data-title="Shell and Git foundations" data-video="https://youtu.be/BCF4oFqE8Tw" data-faq="live-sessions/20250517-BCF4oFqE8Tw.md">
<textarea data-live-session-slides>
# Shell and Git foundations
## Live session 3

- Move through folders confidently
- Build tiny repeatable scripts
- Track changes with Git
---
## Shell mental model

The shell always has:

- A current folder
- Environment variables
- Files and folders it can read
- Programs it can execute
- Standard input and output
---
## Navigation essentials

```bash
pwd
ls -la
cd ..
mkdir practice
touch notes.md
cp notes.md backup.md
mv backup.md archive.md
```
---
## Pipelines

```bash
cat data.csv | head
cat data.csv | wc -l
cat data.csv | cut -d, -f1 | sort | uniq -c
```

Each command should do one job cleanly.
---
## Git lifecycle

```bash
git status
git add notes.md
git commit -m "Add shell practice notes"
git log --oneline
```

Status before and after every meaningful step.
---
## What Git is protecting

- Your current working tree
- The staging area
- Commit history
- Branches for separate lines of work
---
## The safest habit

```bash
git status
git diff
git diff --staged
```

Read before changing direction.
---
## Annotation exercise

- Highlight the staging command
- Circle the command that shows uncommitted work
- Add a note where a pipeline could fail
---
## End state

You can create files, inspect data, make a commit, and explain what changed.
</textarea>
</div>
