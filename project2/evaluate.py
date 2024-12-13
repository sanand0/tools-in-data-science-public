# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "httpx",
#     "pandas",
#     "platformdirs",
#     "python-dotenv",
#     "rich",
# ]
# ///

import argparse
import base64
import dotenv
import glob
import httpx
import json
import os
import pandas as pd
import random
import shutil
import sys
import time
from datetime import datetime, timedelta, timezone
from collections import namedtuple, Counter
from platformdirs import user_data_dir
from rich.console import Console
from subprocess import run, PIPE

# Deadline for repo is 12 Dec 2024 EOD AOE. If you're hacking dates, remember:
# 1. Change your commit time to before the deadline
# 2. We'll clone at some unknown time after this deadline. Time it before that.
deadline = datetime(2024, 12, 12, 23, 59, 59, tzinfo=timezone(timedelta(hours=-12)))

console = Console()
root = user_data_dir("tds-sep-24-project-2", "tds")
HEAD = namedtuple("HEAD", ["owner", "repo", "branch"])
Eval = namedtuple("Eval", ["marks", "total", "test", "reason"])
Qual = namedtuple("Qual", ["group", "name", "description"])
OutputFiles = namedtuple("OutputFiles", ["readme", "images", "error"])

# Faculty evaluation of code and output will use LLM Foundry. Student evaluation will use AIProxy.
dotenv.load_dotenv()
if "LLMFOUNDRY_TOKEN" in os.environ:
    headers = {"Authorization": f"Bearer {os.environ['LLMFOUNDRY_TOKEN']}:tds-sep-2024-project-2"}
    openai_api_base = "https://llmfoundry.straive.com/openai/v1"
elif "AIPROXY_TOKEN" in os.environ:
    headers = {"Authorization": f"Bearer {os.environ['AIPROXY_TOKEN']}"}
    openai_api_base = "https://aiproxy.sanand.workers.dev/openai/v1"
else:
    raise ValueError("Missing AIPROXY_TOKEN")


# Sample datasets from https://drive.google.com/drive/folders/1KNGfcgA1l2uTnqaldaX6LFr9G1RJQNK3
sample_datasets = {
    "goodreads.csv": "1oYI_Vdo-Xmelq7FQVCweTQgs_Ii3gEL6",
    "happiness.csv": "15nasMs0VKVB4Tm7-2EKYNpDzPdkiRW1q",
    "media.csv": "10LcR2p6SjD3pWASVp5M4k94zjMZD6x5W",
}
# Test datasets from a secret environment variable
test_datasets = json.loads(os.getenv("DATASETS", "{}"))


def log(msg: str, last=False):
    """Log a message to the console."""
    console.print(" " * 200, end="\r")
    console.print(msg, **({} if last else {"end": "\r"}))


def open_encoded(path: str):
    """Open a file with fallback encodings."""
    for encoding in ("utf-8", "utf-16", "utf-32", "cp1252"):
        try:
            with open(path, "r", encoding=encoding) as f:
                return f.read()
        except Exception:
            continue
    raise ValueError(f"{path}: Unknown encoding")


def download_datasets():
    """Download the datasets from Google Drive."""
    datasets_dir = os.path.join(root, "datasets")
    os.makedirs(datasets_dir, exist_ok=True)
    for name, id in (*sample_datasets.items(), *test_datasets.items()):
        target = os.path.join(datasets_dir, name)
        if not os.path.exists(target) or os.path.getsize(target) == 0:
            url = f"https://drive.usercontent.google.com/download?id={id}"
            log(f"[yellow]DOWNLOAD[/yellow] {name}...")
            result = httpx.get(url, timeout=30)
            result.raise_for_status()
            with open(target, "wb") as f:
                f.write(result.content)


def parse_github_url(raw_url: str) -> HEAD:
    """Parse the raw GitHub URL into an owner, repository, and branch."""
    parts = raw_url.split("/")
    # https://raw.githubusercontent.com/owner/repo/refs/heads/branch/autolysis.py
    if parts[5] == "refs" and parts[6] == "heads":
        return HEAD(parts[3], parts[4], parts[7])
    # https://raw.githubusercontent.com/owner/repo/branch/autolysis.py
    else:
        return HEAD(parts[3], parts[4], parts[5])


def clone_latest_branch(id: str, head: HEAD, deadline: datetime, evals: list[Eval]):
    """Ensure the latest commit on the branch is before the deadline."""
    repo_path = os.path.join(root, id)

    # Clean up the repo if it exists to avoid problems with forced pushes.
    if os.path.exists(repo_path):
        if os.getenv("SKIP_CLONE") == "Y":
            return evals.append(Eval(0.5, 0.5, "public_repo", "exists"))
        shutil.rmtree(repo_path)

    # Clone the repo
    try:
        repo_url = f"https://github.com/{head.owner}/{head.repo}.git"
        cmd = ["git", "clone", "-q", "--single-branch", "-b", head.branch, repo_url, repo_path]
        log(f"[blue]{id}[/blue] [yellow]CLONE[/yellow] {repo_url}")
        env = {**os.environ, "GIT_TERMINAL_PROMPT": "0"}
        run(cmd, check=True, capture_output=True, text=True, env=env)

        # Get the latest commit before the deadline
        log_cmd = ["git", "-C", repo_path, "log", "-q", head.branch]
        log_cmd.extend(["--before", deadline.isoformat(), "--format=%H", "-n", "1", "--"])
        log(f"[blue]{id}[/blue] [yellow]LOG[/yellow] {repo_url}")
        commit = run(log_cmd, stdout=PIPE, text=True, check=True).stdout.strip()

        # Checkout the commit
        if commit:
            log(f"[blue]{id}[/blue] [yellow]CHECKOUT[/yellow] {commit}")
            run(["git", "-C", repo_path, "checkout", "--quiet", commit], check=True)
        else:
            raise ValueError(f"No commits on branch {head.branch} before {deadline}")
        evals.append(Eval(0.5, 0.5, "public_repo", "exists"))
    except Exception as e:
        evals.append(Eval(0.0, 0.5, "public_repo", str(e)))


def has_mit_license(id: str, evals: list[Eval]) -> bool:
    """Check if root/{id}/LICENSE is an MIT license."""
    license_file = os.path.join(root, id, "LICENSE")
    if not os.path.exists(license_file):
        return evals.append(Eval(0.0, 0.5, "mit_license", "missing"))
    license = open_encoded(license_file)
    marks = 0.5 if "permission is hereby granted, free of charge" in license.lower() else 0.0
    return evals.append(Eval(marks, 0.5, "mit_license", "present" if marks else "incorrect"))


def has_required_files(id: str, evals: list[Eval]):
    """Check if root/{id} has the required files."""
    required_files = {
        "autolysis.py": 0.4,
        "goodreads/README.md": 0.1,
        "goodreads/*.png": 0.1,
        "happiness/README.md": 0.1,
        "happiness/*.png": 0.1,
        "media/README.md": 0.1,
        "media/*.png": 0.1,
    }
    for index, (pattern, total) in enumerate(required_files.items()):
        marks = total if glob.glob(os.path.join(root, id, pattern)) else 0.0
        evals.append(Eval(marks, total, pattern, "present" if marks else "missing"))


def run_on_dataset(id: str, dataset: str, evals: list[Eval], total: float):
    msg = f"[blue]{id}[/blue] [yellow]uv run autolysis[/yellow] {dataset}"
    cwd = os.path.join(root, id, "eval", dataset)
    os.makedirs(cwd, exist_ok=True)
    script = os.path.join(root, id, "autolysis.py")
    if not os.path.exists(script):
        evals.append(Eval(0.0, total, f"uv run autolysis {dataset}", "missing"))
        return False
    cmd = ["uv", "run", script, os.path.join(root, "datasets", dataset)]
    error = get_output_files(id, os.path.join("eval", dataset)).error
    if error or os.getenv("SKIP_RERUN") != "Y":
        log(msg)
        stderr = ""
        try:
            result = run(cmd, check=False, capture_output=True, text=True, cwd=cwd, timeout=180)
        except Exception as e:
            stderr = str(e)
        if stderr or result.returncode != 0:
            err_msg = stderr or result.stderr
            evals.append(Eval(0.0, total, f"uv run autolysis {dataset}", err_msg))
            log(f"{msg} [red]FAIL[/red]: {err_msg}", last=True)
            return False
    error = get_output_files(id, os.path.join("eval", dataset)).error
    if error:
        evals.append(Eval(0.0, total, f"uv run autolysis {dataset}", error))
        return False
    evals.append(Eval(total, total, f"uv run autolysis {dataset}", "ran"))
    return True


def convert_to_qual(text: str) -> list[Qual]:
    """Convert a text to a list of Qual attributes."""
    quals = []
    for line in text.split("\n"):
        if not line.strip() or line.startswith("#"):
            continue
        group, name, description = line.split("|", 2)
        quals.append(Qual(group, name, description))
    return quals


def get_schema(quals: list[Qual]) -> dict:
    """Get the schema given qualities"""
    properties = {}
    for qual in quals:
        properties[qual.name] = {
            "type": "object",
            "description": qual.description,
            "properties": {"reasoning": {"type": "string"}, "answer": {"type": "boolean"}},
            "required": ["reasoning", "answer"],
            "additionalProperties": False,
        }
    schema = {
        "type": "object",
        "properties": properties,
        "required": list(properties.keys()),
        "additionalProperties": False,
    }
    return schema


# Define the code quality evaluation attributes. WARNING: This is work in progress.
code_system = """
You are an expert Python programmer. Evaluate the quality of this Python code. Respond as JSON.
For each code quality attribute:
- FIRST explain your reasoning, citing code blocks that provide evidence for and against the attribute.
- THEN answer as a boolean. Use your judgement critically using your reasoning. Prefer false if unsure.
"""

# The criteria are mentioned in the project description. But the exact prompts are a secret.
# But here are a few examples:
code_quality = convert_to_qual(
    os.getenv(
        "CODE_QUALITY",
        """
# THIS IS NOT THE EXACT WORDING. But they give you an idea of what we're looking for.
1|well_structured|Is the code well structured, logically organized, with appropriate use of functions, clear separation of concerns, consistent coding style, meaningful variable names, proper indentation, and sufficient commenting for understandability?
2|analysis|Does the code use robust analytical techniques? Statistical methods, comprehensiveness of analysis, innovative analytical techniques, and dynamic analysis based on data exploration?
3|visualization|Does the code use appropriate visualization types, enhances charts with titles, axis labels, legends, and annotations, and uses colors effectively?
4|narrative|Does the code craft clear, context-rich prompts to guide the LLM on the narrative, includes relevant results, ensures proper Markdown formatting, logically sequences the narratives (data description, analysis, insights, implications), integrates visualizations at the right places, and prompts the LLM to emphasie significant findings and implications?
5|efficient|Does the code make use LLMs efficiently, minimizing token usage by avoiding sending large data and using concise prompts?
6|dynamic|Does the code use dynamic prompts and function calling?
7|vision_agentic|Does the code use vision capabilities and multiple calls to LLMs (agentic workflows)?
""",
    )
)

# Attributes belong to one of 7 groups (as defined in the project description). Count them.
code_quality_group_counts = Counter(attribute.group for attribute in code_quality)

# Define the JSON schema for the code quality evaluation. {attribute.name: {reasoning, answer}}
code_quality_schema = {"name": "quality", "strict": True, "schema": get_schema(code_quality)}


def evaluate_code_quality(id: str, evals: list[Eval]):
    if os.getenv("SKIP_CODE_QUALITY") == "Y":
        return

    # Read the code with fallback encodings
    script = os.path.join(root, id, "autolysis.py")
    if not os.path.exists(script):
        return
    code = open_encoded(script)

    # Evaluate the code quality
    log(f"[blue]{id}[/blue] [yellow]CODE QUALITY[/yellow]")
    response = httpx.post(
        f"{openai_api_base}/chat/completions",
        headers=headers,
        json={
            "model": os.getenv("MODEL", "gpt-4o-mini"),
            "messages": [
                {"role": "system", "content": code_system},
                {"role": "user", "content": code},
            ],
            "response_format": {"type": "json_schema", "json_schema": code_quality_schema},
        },
        timeout=180,
    )
    result = response.json()
    content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
    if not content:
        log(f"[blue]{id}[/blue] [red]OpenAI error[/red] {result}", last=True)
        return
    answers = json.loads(content)
    for attribute in code_quality:
        total = 1.0 / code_quality_group_counts[attribute.group]
        ans = answers[attribute.name]
        attr = f"code: {attribute.name}"
        evals.append(Eval(total if ans["answer"] else 0, total, attr, ans["reasoning"]))


# Define the output quality evaluation attributes. WARNING: This is work in progress.
output_system = """
You are an expert data analyst. You are analyzing a student analysis of a dataset.
Evaluate the quality of this analysis. Respond as JSON.
For each output quality attribute:
- FIRST, list reasons for and against the attribute, with verbatim citations as evidence.
- THEN answer as a boolean. Use your judgement critically using the listed reasons. Prefer false if unsure.
"""

# The criteria are mentioned in the project description
output_quality = convert_to_qual(
    os.getenv(
        "OUTPUT_QUALITY",
        """
# THIS IS NOT THE EXACT WORDING. But they give you an idea of what we're looking for.
1|well_structured|Is `README.md` well-structured, using headers, lists, and emphasis appropriately? Does the narrative clearly describe the data, analysis performed, insights gained, and implications?
2|analysis|Does the analysis demonstrate a deep understanding of the data, utilizing appropriate statistical methods and uncovering meaningful insights?
3|visualization|Are the PNG images relevant, well-designed, and enhance the narrative by effectively illustrating key findings?
""",
    )
)
output_quality_group_counts = Counter(attribute.group for attribute in output_quality)
output_quality_schema = {"name": "quality", "strict": True, "schema": get_schema(output_quality)}


def get_output_files(id: str, path: str) -> OutputFiles:
    """Get the output files from the submission."""
    target = os.path.join(root, id, path)
    readme_pattern = os.path.join(target, "**", "README.md")
    readme_files = glob.glob(readme_pattern, recursive=True) or [""]
    image_pattern = os.path.join(target, "**", "*.png")
    image_files = glob.glob(image_pattern, recursive=True)[:5]
    error = ""
    if not readme_files[0]:
        error = f"no README.md in {target}"
    elif not image_files:
        error = f"no *.png in {target}"
    return OutputFiles(readme_files[0], image_files, error)


def evaluate_output_quality(id: str, path: str, evals: list[Eval]):
    readme_file, image_files, error = get_output_files(id, os.path.join("eval", path))
    if error:
        evals.append(Eval(0.0, 0.0, f"output: {path}", error))
        return
    readme = open_encoded(readme_file)

    # Take the first 5 images in the submission
    images = []
    for image_file in image_files:
        with open(image_file, "rb") as f:
            image = base64.b64encode(f.read()).decode("utf-8")
            images.append(
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{image}", "detail": "low"},
                }
            )

    # Evaluate the output quality
    log(f"[blue]{id}[/blue] [yellow]OUTPUT QUALITY[/yellow] {path}")
    response = httpx.post(
        f"{openai_api_base}/chat/completions",
        headers=headers,
        json={
            "model": os.getenv("MODEL", "gpt-4o-mini"),
            "messages": [
                {"role": "system", "content": output_system},
                {"role": "user", "content": [readme, *images]},
            ],
            "response_format": {"type": "json_schema", "json_schema": output_quality_schema},
        },
        timeout=180,
    )
    result = response.json()
    content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
    if not content:
        log(f"[blue]{id}[/blue] [red]OpenAI error[/red] {result}", last=True)
        return
    answers = json.loads(content)
    for attribute in output_quality:
        total = 1.0 / output_quality_group_counts[attribute.group]
        ans = answers[attribute.name]
        attr = f"{path}: {attribute.name}"
        evals.append(Eval(total if ans["answer"] else 0, total, attr, ans["reasoning"]))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate student project submissions")
    parser.add_argument("url", nargs="*", help="GitHub raw URL for submission(s)")
    args = parser.parse_args()

    if os.getenv("SUBMISSION_URL"):
        submissions_form = pd.read_csv(os.environ["SUBMISSION_URL"])

    # If URLs or student IDs are passed, get submissions from that
    requested_ids = set()
    if len(args.url):
        submissions = []
        for url in args.url:
            if url.startswith("https://"):
                head = parse_github_url(url)
                submissions.append([None, f"{head.owner}-{head.repo}", url])
            else:
                email_col = submissions_form.columns[1]
                match = submissions_form[submissions_form[email_col].str.contains(url)].iloc[0]
                submissions.append(match.to_list()[:3])
        submissions = pd.DataFrame(submissions)
        requested_ids = set(submissions[submissions.columns[1]].str.split("@").str[0])
    # Else, the faculty will get all submissions from the Google Sheet and evaluate
    elif os.getenv("SUBMISSION_URL"):
        submissions = submissions_form
    # Else, raise an error
    else:
        error = "[red]Missing URL[/red]: Usage `uv run project2.py https://raw.githubusercontent.com/...`"
        log(error, last=True)
        sys.exit(1)

    submissions["id"] = submissions[submissions.columns[1]].str.split("@").str[0]
    submissions["head"] = submissions[submissions.columns[2]].apply(parse_github_url)

    # Pick a random sample of submissions to evaluate
    if os.getenv("SAMPLE_SUBMISSIONS"):
        size = int(os.getenv("SAMPLE_SUBMISSIONS"))
        if size < len(submissions):
            submissions = submissions.sample(size)

    # If we're continuing from where we left off, read the results
    results = []
    if os.getenv("CONTINUE") == "Y":
        result = pd.read_csv(os.path.join(root, "results.csv"))
        # Remove results for explicitly requested submissions
        results = [result[~result.id.isin(requested_ids)]]
        ids = results[0].id.unique()
        # Skip submissions that we've already evaluated
        skip = submissions.id.isin(ids)
        submissions = submissions[~skip]
        log(f"[green]Skipped[/green] {sum(skip)} submissions", last=True)

    # Now, evalute each submission
    for _, row in submissions.iterrows():
        evals = []
        try:
            start = time.time()

            # Make sure other submmissions haven't overwritten the dataset
            download_datasets()

            # Clone the repo and check for the MIT license and required files
            clone_latest_branch(row.id, row["head"], deadline, evals)
            has_mit_license(row.id, evals)
            has_required_files(row.id, evals)

            # Code evaluation
            evaluate_code_quality(row.id, evals)

            # Submission: Run evaluation for each sample dataset
            success = {}
            datasets = list(sample_datasets.keys())
            datasets = datasets[:int(os.getenv("LIMIT_SAMPLE_DATASETS_RUN", len(sample_datasets)))]
            if len(datasets):
                for dataset in datasets:
                    success[dataset] = run_on_dataset(row.id, dataset, evals, 0.5)
                all_ran = 0.5 if all(success.values()) else 0.0
                msg = "ran" if all_ran else "did not run all"
                evals.append(Eval(all_ran, 0.5, "uv run autolysis *", msg))

            # Evaluate one random output from successful runs of sample datasets
            samples_ran = []
            for dataset in sample_datasets:
                if not get_output_files(row.id, os.path.join("eval", dataset)).error:
                    samples_ran.append(dataset)
            if len(samples_ran) and os.getenv("SKIP_SAMPLE_DATASETS_EVAL") != "Y":
                random.seed(row.id + os.getenv("AIPROXY_TOKEN", ""), version=2)
                evaluate_output_quality(row.id, random.choice(samples_ran), evals)

            # Evaluate test datasets
            if os.getenv("SKIP_TEST_DATASETS") != "Y":
                for dataset, id in test_datasets.items():
                    run_on_dataset(row.id, dataset, evals, 0.0)
                    evaluate_output_quality(row.id, dataset, evals)

            result = pd.DataFrame(evals)
            result["id"] = row.id
            results.append(result)
            score, total = round(result.marks.sum(), 2), round(result.total.sum(), 2)
            duration = time.time() - start
            msg = f"[blue]{row.id}[/blue] [yellow]{duration:.0f}s[/yellow]"
            log(f"{msg} [green]SCORE[/green] {score} / {total}", last=True)
        except Exception as e:
            log(f"{msg} [red]UNEXPECTED FAILURE[/red] {e}", last=True)
            continue

        if len(results):
            # Print only the last result if there's only one submission (plus history)
            if len(results) <= 2:
                print(pd.DataFrame(results[-1]))

            # Save the results to a CSV file on each iteration
            out = pd.concat(results)
            out["correct"] = out.apply(lambda row: row.marks == row.total, axis=1).astype(int)
            out["reason"] = out.apply(lambda row: row.reason.replace("\n", " "), axis=1)
            out.to_csv(os.path.join(root, "results.csv"), index=False)

    log(f"[green]Results[/green]: {os.path.join(root, 'results.csv')}", last=True)
