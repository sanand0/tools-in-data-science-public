## LLM Evaluations with PromptFoo

Test-drive your prompts and models with automated, reliable evaluations.

[![🚀 Test Driven Prompt Engineering with PromptFoo (12 min)](https://i.ytimg.com/vi_webp/KhINc5XwhKs/sddefault.webp)](https://youtu.be/KhINc5XwhKs)

PromptFoo is a test-driven development framework for LLMs:

- **Developer-first**: Fast CLI with live reload & caching ([promptfoo.dev](https://promptfoo.dev))
- **Multi-provider**: Works with OpenAI, Anthropic, HuggingFace, Ollama & more ([GitHub](https://github.com/promptfoo/promptfoo))
- **Assertions**: Built‑in (`contains`, `equals`) & model‑graded (`llm-rubric`) ([docs](https://www.promptfoo.dev/docs/configuration/expected-outputs/))
- **CI/CD**: Integrate evals into pipelines for regression safety ([CI/CD guide](https://www.promptfoo.dev/docs/integrations/ci-cd/))

To run PromptFoo:

1. Install Node.js & npm ([nodejs.org](https://nodejs.org/))
2. Set up your [`OPENAI_API_KEY`](https://platform.openai.com/api-keys) environment variable
3. Configure `promptfooconfig.yaml`. Below is an example:

```yaml
prompts:
  - |
    Summarize this text: "{{text}}"
  - |
    Please write a concise summary of: "{{text}}"

providers:
  - openai:gpt-3.5-turbo
  - openai:gpt-4

tests:
  - name: summary_test
    vars:
      text: "PromptFoo is an open-source CLI and library for evaluating and testing LLMs with assertions, caching, and matrices."
    assertions:
      - contains-all:
          values:
            - "open-source"
            - "LLMs"
      - llm-rubric:
          instruction: |
            Score the summary from 1 to 5 for:
            - relevance: captures the main info?
            - clarity: wording is clear and concise?
          schema:
            type: object
            properties:
              relevance:
                type: number
                minimum: 1
                maximum: 5
              clarity:
                type: number
                minimum: 1
                maximum: 5
            required: [relevance, clarity]
            additionalProperties: false

commandLineOptions:
  cache: true
```

Now, you can run the evaluations and see the results.

```bash
# Execute all tests
npx -y promptfoo eval -c promptfooconfig.yaml

# List past evaluations
npx -y promptfoo list evals

# Launch interactive results viewer on port 8080
npx -y promptfoo view -p 8080
```

PromptFoo caches API responses by default (TTL 14 days). You can disable it with `--no-cache` or clear it.

```bash
# Disable cache for this run
echo y | promptfoo eval --no-cache -c promptfooconfig.yaml

# Clear all cache
echo y | promptfoo cache clear
```
