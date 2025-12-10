# LLM Analysis Quiz – Project Guide

Students submitted system/user prompts for a prompt-security exercise. We pit every system prompt against every user prompt with a small LLM, log whether the secret leaks, cluster prompts into topics, and score students with multiple schemes.

## Repo Layout
- Data: `responses.csv` (raw form results), `system-prompts.txt`, `user-prompts.txt`, `system-prompts-similarity.csv`, `user-prompts-similarity.csv`.
- Logs: `promptfight_log.csv` (raw duel log from `promptfight.py`), `promptfight_log.json` (compact matrix from `compress.py`).
- Code: `promptfight.py` (runs duels, writes CSV log), `compress.py` (CSV → JSON matrix), `evaluation.py` (scores students from JSON + responses), `evaluate_submissions.py` (helper for course staff).
- Analyses: `analysis_report.md`, `evaluation.md`.

## Quickstart
Requirements: Python 3.12+, `pip` (or `uv`), `OPENAI_API_KEY` to rerun promptfights.

```bash
# 1) Install basics
python -m venv .venv
source .venv/bin/activate
pip install pandas numpy

# 2) (Optional) Run all prompt duels (costs API)
export OPENAI_API_KEY=sk-...
python promptfight.py            # writes/extends promptfight_log.csv

# 3) Compress the log to JSON
python compress.py               # writes promptfight_log.json

# 4) Score students from JSON + responses.csv
python evaluation.py --log promptfight_log.json --responses responses.csv --out evaluation.csv
```

## JSON Format (from `compress.py`)
```json
{
  "systems": ["system prompt A", "..."],
  "users": ["user prompt X", "..."],
  "wins": [[1,0, ...], ...]   // wins[i][j] = 1 if system i defends vs user j, else 0
}
```

## Scoring
- Schemes documented in `evaluation.md` (simple points, win rates, difficulty-weighted, over-expected).
- `evaluation.py` reads `promptfight_log.json` plus `responses.csv` to map prompts back to student emails (duplicates share outcomes) and writes `evaluation.csv`.

## Analyses
- `analysis_report.md` summarises leak patterns, topic effects, copying behaviour, and segmentation (length, language, structure).
```
