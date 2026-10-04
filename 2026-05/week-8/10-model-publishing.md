# Model Publishing & Model Cards

> **Uploading weights is not publishing a model. Publishing means another person can discover what it is, load the correct artefact, understand what it was tested for, avoid known harms, and decide whether they are allowed to use it. The model card is the interface for that decision.**

⏱ ~12 min read · ~30 min hands-on
🔗 needs: [Hugging Face Ecosystem](/2026-05/week-8/05-huggingface-ecosystem/) · [Gemma 4 Fine-Tuning](/2026-05/week-8/08-gemma4-finetuning/) · [MLflow](/2026-05/week-8/03-mlflow/)

## Publish an artefact, not a surprise

A release answers five questions before someone downloads it:

```text
What is it?     → model type, base model, version, format
What is it for? → intended use and non-goals
How was it made?→ permitted data summary, method, configuration
Does it work?   → evaluation task, metrics, examples, limitations
Can I use it?   → licence, access level, safety/privacy constraints
```

The [Hugging Face Hub](https://huggingface.co/) is a convenient place to publish because a model repo has commits, large-file handling, access controls, and a rendered `README.md` model card. The same release discipline applies to an internal registry, S3/GCS bucket, or GitHub release.

## Decide what you are releasing

For the beginner Gemma exercise, release a **LoRA adapter** by default, not a merged/full copy of the base model.

| Artefact | Usually contains | Why/when to publish | Critical documentation |
|---|---|---|---|
| LoRA adapter | adapter weights + `adapter_config.json` | small and respects separation from base weights | exact base model/revision and chat template |
| Merged model | base + adapter weights | convenient one-file deployment when redistribution is permitted | base licence/terms, merge procedure, tested loader |
| Quantized model | weights for a specific runtime/bit-width | local inference on target hardware | quantization method, runtime, tested context, quality comparison |
| Dataset | permitted training/eval data | reproducible research or a useful public asset | licence/consent, PII review, provenance, splits |
| Demo / Space | app code and a user interface | safe, bounded trial | input limits, abuse handling, privacy statement |

> ⚖️ Never upload raw customer data, API keys, tokens, private prompts, evaluation inputs containing personal data, or an artefact whose base licence/terms do not allow the intended redistribution. Start with a **private** repo. “It ran in my notebook” is not publishing approval.

## The release folder

Make a clean folder that contains only what a user needs. Do not upload cache directories, checkpoints you did not select, or the complete training dataset by accident.

```text
gemma4-ticket-triage-lora/
├── adapter_model.safetensors       # produced by the training tool
├── adapter_config.json
├── README.md                       # the model card below
├── training_config.json            # hyperparameters + tool version
├── eval-results.json               # aggregate scores, not private test records
├── requirements.txt or uv.lock
└── examples/
    └── smoke-test.md               # non-sensitive input/output examples
```

Add a `data-manifest.md` **only if it contains no sensitive rows**. It should describe the data source, permission/licence, period, review process, number of examples, split strategy, and deletion/contact process—not copy the data itself.

## A model card you can start from

Save this as `README.md` in the release folder. Replace every `TODO`; remove sections you genuinely cannot support rather than inventing claims.

```markdown
---
base_model: TODO-exact-base-model-and-revision
library_name: peft
tags:
- lora
- text-generation
- ticket-triage
license: TODO-confirm-compatible-licence
language:
- en
---

# Gemma 4 Ticket Triage LoRA — v0.1

## Model description

This is a LoRA adapter for `TODO-exact-base-model-and-revision`.
It converts a short support ticket into JSON with `priority`, `category`, and
`next_question`. It was trained for a course demonstration, not production use.

## Intended use

- Educational demonstration of supervised fine-tuning and adapter loading.
- Draft ticket triage with a human reviewer.

## Out of scope

- It must not make account, payment, medical, legal, employment, or safety
  decisions.
- It does not look up live account facts and must not be trusted to invent them.

## Training data

- `TODO-number` reviewed, synthetic/permitted ticket-to-JSON examples.
- Data version: `TODO-private-manifest-ID-or-commit`.
- Personal data and secrets were excluded.
- Train/validation/final-eval were split by `TODO-source-or-time-rule`.

## Training procedure

- Method: 4-bit QLoRA / LoRA using `TODO-tool-and-version`.
- Base model revision: `TODO-revision`.
- Rank: `TODO`; epochs: `TODO`; max sequence length: `TODO`.
- Chat template: `TODO-exact-template`.

## Evaluation

Final evaluation used `TODO-number` held-out, non-sensitive examples.

| Metric | Base model | Adapter |
|---|---:|---:|
| JSON-valid rate | TODO | TODO |
| Category accuracy | TODO | TODO |
| Unsupported-fact rate | TODO | TODO |

The adapter was not evaluated for real customer traffic, non-English tickets,
adversarial inputs, or high-stakes uses.

## Limitations and risks

- May emit invalid JSON or classify a ticket incorrectly.
- May hallucinate facts; a calling application must validate output and fetch
  account facts through authorised tools.
- Training examples cannot cover every product, dialect, or abuse case.

## How to use

Load this adapter on the exact base model above, apply its matching chat template,
and validate the JSON before use. See `examples/smoke-test.md`.

## Version history

- **v0.1** — initial course demonstration; not production ready.
```

The YAML block makes the Hub page easier to discover. The prose supplies the context a tag cannot: what the model should *not* be used for, data provenance, and evaluation boundaries.

## Try it — publish a private draft on the Hub

### 1. Perform a release review first

Before any upload, answer yes to every item:

- [ ] I know the exact base model/revision and its redistribution terms.
- [ ] Every file in `release/` is safe to share at the selected visibility.
- [ ] The model card names intended use, non-goals, data provenance, method, metrics, and limitations.
- [ ] I ran a smoke test from a clean environment or fresh notebook session.
- [ ] I saved aggregate eval results and config, but not secret/private examples.

If any answer is no, keep the release local/private and fix the gap.

### 2. Create a private model repository

Create a Hugging Face account, then open [New model repository](https://huggingface.co/new). Choose a clear name such as:

```text
YOUR_USERNAME/gemma4-ticket-triage-lora
```

Set visibility to **Private** for the first upload. Create the repo, add the model-card template, and inspect the rendered page before adding weights.

### 3. Upload the release folder

The web interface is fine for a tiny adapter. For a repeatable command-line upload, install the Hub client, authenticate interactively (never put a token in source code), then upload.

```bash
cd gemma4-ticket-triage-lora
uv add huggingface_hub
uv run hf auth login

export HF_REPO="YOUR_USERNAME/gemma4-ticket-triage-lora"
uv run hf upload "$HF_REPO" ./release \
  --repo-type model \
  --commit-message "Release adapter v0.1 with model card and eval summary"
```

The `hf` CLI handles large model files. Use an access token with the minimum necessary scope, revoke it if exposed, and never store it in the repo, notebook output, or model card.

### 4. Smoke-test the published release

From a clean directory or a different notebook session:

1. Download/clone the model repo.
2. Read the card and install exactly the documented dependencies.
3. Load the adapter on the stated base model and use the documented chat template.
4. Run a non-sensitive example from `examples/smoke-test.md`.
5. Check that output parses as JSON and that its result matches the published example.

If a stranger cannot perform these steps from your card, the release is incomplete. Fix the documentation or package—do not tell them to “use the same environment I used.”

## Private, public, or gated?

| Visibility | Use it when | Still required |
|---|---|---|
| Private | student work, internal prototype, data/model awaiting review | card, access review, deletion plan |
| Gated / approved users | redistribution needs terms or user acknowledgement | clear terms and a process for granting/revoking access |
| Public | artefact, base terms, evaluation, and risk review support open sharing | complete card, licence, reproducible loading, issue/contact path |

Public visibility is not the default reward for finishing a fine-tuning run. A private, well-documented artefact is a better result than a public one that leaks data or cannot be used safely.

## Version deliberately

Treat a release as immutable. `v0.2` should state exactly what changed: data version, base revision, adapter configuration, quantization, eval, intended use, or known limitation.

| Change | New version needed? | Example |
|---|---|---|
| New adapter trained on more/different data | Yes | `v0.2` with source/manifests and new eval results |
| Same weights, fixed typo in card | Usually no model version; make a documented commit | “Clarify context limit” |
| Converted to a different quantization/runtime | Yes | separate `-gguf-q4` artefact/repo or unambiguous release name |
| Security/privacy issue found | Yes—restrict/remove access and publish a clear notice | revoke `v0.1`, document remediation |

Use the Hub commit history and tags/releases, plus [MLflow](/2026-05/week-8/03-mlflow/) run links, to connect the published file to its evidence.

## When it fails

| Symptom | Likely cause | Fix |
|---|---|---|
| Adapter cannot load | wrong base model/revision, template, or incompatible PEFT version | pin/document exact dependencies and smoke-test from a clean environment. |
| Repo has weights but no useful explanation | card is generic or unfinished | fill in data, method, eval, limitations, and intended use before sharing. |
| Accidentally uploaded sensitive data/token | repo history can preserve it | make repo private immediately, revoke exposed credentials, follow your organisation's incident process, and contact platform support if needed. |
| User assumes model knows live account facts | card/application has no boundary | state non-goals; integrate authorised retrieval/tools and validate output. |
| Large upload fails | interrupted network or wrong upload method | use `hf upload`; retry after checking repo visibility/token scope. |

## Your turn (≈30 min)

1. Put only your adapter, config, aggregate eval results, and non-sensitive smoke test in a `release/` folder.
2. Complete the model card template with no `TODO` values and no invented metric.
3. Create a private Hub model repo and upload the card first. Ask someone to identify your model's use, limitation, base model, and licence from it.
4. Upload the adapter and run a clean-environment smoke test from the published repo.
5. Decide with evidence whether it can remain private, be shared with a small group, or be made public. Record that decision in the card.

## Checklist

- [ ] I can distinguish an adapter, merged model, quantized model, dataset, and demo.
- [ ] I know the base model revision and redistribution terms.
- [ ] I publish a private draft before considering public access.
- [ ] My card includes intended use, non-goals, data provenance, method, eval, and limitations.
- [ ] I do not publish private rows, secrets, tokens, or sensitive eval outputs.
- [ ] Someone can reproduce a smoke test using the card alone.
- [ ] New weights/quantization get a clear new version and evaluation.

## Go deeper

- [Hugging Face Model Cards](https://huggingface.co/docs/hub/model-cards) — metadata and complete card guidance.
- [Uploading models to the Hub](https://huggingface.co/docs/hub/models-uploading) — UI, library, and Git upload paths.
- [Hub repository guide](https://huggingface.co/docs/hub/repositories-getting-started) — private repos, commits, and CLI uploads.
- [Model publishing in MLflow](/2026-05/week-8/03-mlflow/) — retain the experiment evidence behind a release.

<!-- SOURCES: https://huggingface.co/docs/hub/model-cards , https://huggingface.co/docs/hub/models-uploading , https://huggingface.co/docs/hub/repositories-getting-started -->
