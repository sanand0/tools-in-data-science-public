# Large Language Models

This module covers the practical usage of large language models (LLMs).

**LLMs incur a cost.** For the May 2025 batch, use [aipipe.org](https://aipipe.org/) as a proxy.
Emails with `@ds.study.iitm.ac.in` get a **$1 per calendar month** allowance. (Don't exceed that.)

Read the [AI Pipe documentation](https://github.com/sanand0/aipipe) to learn how to use it. But in short:

1. Replace `OPENAI_BASE_URL`, i.e. `https://api.openai.com/v1` with `https://aipipe.org/openrouter/v1...` or `https://aipipe.org/openai/v1...`
2. Replace `OPENAI_API_KEY` with the [`AIPIPE_TOKEN`](https://aipipe.org/login)
3. Replace model names, e.g. `gpt-4.1-nano`, with `openai/gpt-4.1-nano`

For example, let's use [Gemini 2.0 Flash Lite](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash-lite) via [OpenRouter](https://openrouter.ai/google/gemini-2.0-flash-lite-001) for chat completions and [Text Embedding 3 Small](https://platform.openai.com/docs/models/text-embedding-3-small) via [OpenAI](https://platform.openai.com/docs/) for embeddings:

```bash
curl https://aipipe.org/openrouter/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AIPIPE_TOKEN" \
  -d '{
    "model": "google/gemini-2.0-flash-lite-001",
    "messages": [{ "role": "user", "content": "What is 2 + 2?"} }]
  }'

curl https://aipipe.org/openai/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AIPIPE_TOKEN" \
  -d '{ "model": "text-embedding-3-small", "input": "What is 2 + 2?" }'
```

Or using [`llm`](https://llm.datasette.io/):

```bash
llm keys set openai --value $AIPIPE_TOKEN

export OPENAI_BASE_URL=https://aipipe.org/openrouter/v1
llm 'What is 2 + 2?' -m openrouter/google/gemini-2.0-flash-lite-001

export OPENAI_BASE_URL=https://aipipe.org/openai/v1
llm embed -c 'What is 2 + 2' -m 3-small
```

**For a 50% discount** (but slower speed), use [Flex processing](https://platform.openai.com/docs/guides/flex-processing) by adding `service_tier: "flex"` to your JSON request.


## Gemini API (OpenAI-Compatible)

Gemini models are accessible using the OpenAI Python library along with the REST API. You can switch from OpenAI to Gemini by updating **three lines of code**, including your **Gemini API key**.

Python Example

```python
from openai import OpenAI

client = OpenAI(
    api_key="GEMINI_API_KEY",
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"

response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain to me how AI works"}
    ])

print(response.choices[0].message)
```
What changed? Just three lines!

1. api_key="GEMINI_API_KEY" Replace with your actual Gemini API key from .[Google AI Studio](https://aistudio.google.com)..

2. base_url="https://generativelanguage.googleapis.com/v1beta/openai/": Directs the OpenAI library to the Gemini API endpoint instead of the default OpenAI URL.

3. model="gemini-2.5-flash": Choose a compatible Gemini model.

Full documentation: [Gemini API OpenAI Docs](https://ai.google.dev/gemini-api/docs/openai#python).



## AI Pipe

Anyone with a `study.iitm.ac.in` email can get a free API key from [aipipe.org](https://aipipe.org/) and use up to **$2 per calendar month** for this course. Don't exceed that.

To use it, [read the documentation](https://github.com/sanand0/aipipe). Specifically:

1. Use `https://aipipe.org/openai/v1/...` instead of `https://api.openai.com/v1/...` as the `OPENAI_BASE_URL`
2. Use the token from <https://aipipe.org/login> as the `OPENAI_API_KEY`
