# Large Language Models

This module covers the practical usage of large language models (LLMs) -- a relatively a new area.

**LLMs incur a cost.** Use [aipipe.org](https://aipipe.org/) with your `@ds.study.iitm.ac.in` email ID
for a **$1 per calendar month** usage. Don't exceed that.

Read the [AI Pipe documentation](https://github.com/sanand0/aipipe) to learn how to use it. But in short:

1. Replace your OpenAI API base`https://api.openai.com/...` with `https://aipipe.org/openrouter/...`
2. Replace the `OPENAI_API_KEY` with the [`AIPIPE_TOKEN`](https://aipipe.org/login)
3. Replace OpenAI models (e.g. `gpt-4.1-nano`) with `openai/gpt-4.1-nano`

## AI Proxy - Jan 2025

For the Jan 2025 batch, we had created API keys for everyone with an `iitm.ac.in` email to use `gpt-4o-mini` and `text-embedding-3-small`. Your usage is limited to **$1 per calendar month** for this course. Don't exceed that.

**Use [AI Proxy](https://github.com/sanand0/aiproxy)** instead of OpenAI. Specifically:

1. Replace your API to `https://api.openai.com/...` with `https://aiproxy.sanand.workers.dev/openai/...`
2. Replace the `OPENAI_API_KEY` with the `AIPROXY_TOKEN` that someone will give you.
