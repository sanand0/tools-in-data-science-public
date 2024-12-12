# Project 2

**WARNING**: This is **work-in-progress** evaluation code for [Project 2](../project-2-automated-analysis.md).

## Usage

To evaluate your own submission on the Windows Command Prompt:

```bat
set AIPROXY_TOKEN=...
set SUBMISSION=https://raw.githubusercontent.com/[YOUR-ID]/[YOUR-PROJECT]/main/autolysis.py
set EVALUATOR=https://raw.githubusercontent.com/sanand0/tools-in-data-science-public/tds-2024-t3-project2-wip/project2/evaluate.py
uv run "%EVALUATOR%" "%SUBMISSION%"
```

To evaluate your own submission on Linux/MacOS:

```bash
export AIPROXY_TOKEN="..."
export SUBMISSION="https://raw.githubusercontent.com/[YOUR-ID]/[YOUR-PROJECT]/main/autolysis.py"
export EVALUATOR="https://raw.githubusercontent.com/sanand0/tools-in-data-science-public/tds-2024-t3-project2-wip/project2/evaluate.py"
uv run "$EVALUATOR" "$SUBMISSION"
```

## Faculty usage

Create a `.env` in this folder with:

```ini
SUBMISSION_URL="URL of the Google Sheet with Project 2 submissions"
AIPROXY_TOKEN="..."  # A faculty's AI Proxy API key will be used for evaluation
MODEL="gpt-4o-mini"  # We will LIKELY use this model for evaluation, but that's not guaranteed
```

From this folder, create a Docker container:

```bash
docker run --name tds-sep-2024-project-2 -v .:/project2 -it ubuntu:24.04
```

... or attach to an existing container:

```bash
docker start tds-sep-2024-project-2 && docker attach tds-sep-2024-project-2
```

In the container, run:

```bash
apt update && apt install -y curl git
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env
uv run /project2/evaluate.py
```
