# Project 1 Evaluation

This folder has the evaluation script for the [Project 1 - TDS 2025 Jan](../project-1.md).

Here's how we will evaluate your project:

1. Download responses from the [TDS Jan 2025 - Project 1 Submission Google Form](https://docs.google.com/forms/d/e/1FAIpQLSdOaljgV-INdbKrPotV9OMUKV01QVaFEfcnr5dAxBZqM4x37g/viewform?usp=dialog) as `submissions.csv`
   - We will parse image names submitted as `user-name/repo-name` or `https://hub.docker.com/r/user-name/repo-name`.
2. For each `$IMAGE_NAME` in `submissions.csv`, run `podman run --rm -p 8000:8000 -e AIPROXY_TOKEN=$AIPROXY_TOKEN $IMAGE_NAME`
3. Ensure local dependencies (currently only `npx`) are on the PATH
4. Set the environment variables `OPENAI_API_KEY` to the [AI Proxy token](https://aiproxy.sanand.workers.dev/)
5. Run [`evaluate.py`](evaluate.py) to calculate the score.

Here's how you can try it out. Run your Docker image exposing port 8000 and run this command (replacing `$AIPROXY_TOKEN` with your AI Proxy token):

```bash
OPENAI_API_KEY=$AIPROXY_TOKEN uv run https://raw.githubusercontent.com/sanand0/tools-in-data-science-public/tds-2025-01/project-1/evaluate.py
```

This [`evaluate.py`](evaluate.py) script currently work-in-progress and will be updated based on teacher & student feedback.

You're welcome to try it and share feedback on this [Project 1 Discourse Thread](https://discourse.onlinedegree.iitm.ac.in/t/project-1-llm-based-automation-agent-discussion-thread-tds-jan-2025/164277/17).

Additionally, [`similarity.py`](similarity.py) evaluates the similarity of Python code between 2 repos. This is used to award bonus marks for code diversity.
