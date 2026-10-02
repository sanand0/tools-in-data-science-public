# Gemma 4 Fine-Tuning

[![How to Fine-Tune Gemma 4 on Your Own Dataset with Unsloth](https://img.youtube.com/vi/QZSbRMIJlRw/0.jpg)](https://www.youtube.com/watch?v=QZSbRMIJlRw)

> **Your first successful fine-tune should be small, boring, and measurable: a small instruction model, a narrow custom task, a LoRA adapter, and a held-out comparison. A giant model and a spectacular demo are not the same as evidence.**

⏱ ~15 min read · ~45 min hands-on
🔗 needs: [Fine-Tuning Strategy](/2026-05/week-8/04-finetuning-strategy/) · [Fine-Tuning Techniques](/2026-05/week-8/06-finetuning-techniques/) · [Quantization](/2026-05/week-8/07-quantization/)

## Why Gemma 4 + Unsloth is a good first lab

Gemma 4 is a family of Google open-weight models with instruction-tuned variants. **Unsloth** provides guided notebooks and Studio workflows for loading compatible models, applying a chat template, performing LoRA/QLoRA fine-tuning, testing, and exporting an adapter.

This combination is useful for learning because it reduces installation and GPU configuration work. It does not remove the hard parts: choosing a permissible dataset, defining success, inspecting formatting, evaluating honestly, and documenting limits.

| Choose this route when | Do not choose it when |
|---|---|
| You have a narrow text task and a reviewed custom dataset | You only need current facts—use RAG/tool calls first |
| You can compare a base model against an adapter | You have no held-out evaluation or no permission to use the data |
| You want a small, shareable adapter rather than a new base model | You need a guaranteed correct/high-stakes decision system |
| You can use a supported local GPU or temporary cloud notebook | You need to tune enormous models on an unbounded budget |

> ⚖️ Before downloading or publishing, read the current Gemma terms/licence and any gated-model conditions on the model page. Use only data that you are authorised to upload to the tool/provider. Do not put secrets, customer tickets, medical records, private chat histories, or proprietary documents into a “practice” notebook.

## The project we will build

We will adapt a small Gemma 4 **instruction** model to turn a support ticket into one strict JSON triage record:

```text
ticket → {"priority": ..., "category": ..., "next_question": ...}
```

This is deliberately modest. You can check valid JSON automatically and inspect whether the classification/next question is grounded. Reuse your own permitted examples only after the fictional version works.

```text
base Gemma 4 instruct model
     + 100+ reviewed ticket → JSON examples
     + 4-bit QLoRA / LoRA adapter
     → custom triage adapter
     → compare with untouched final-eval tickets
```

## Before opening a notebook: prepare evidence

### 1. Make your data

Create `train.jsonl`, `validation.jsonl`, and `final_eval.jsonl`. Use the message format from [Fine-Tuning Techniques](/2026-05/week-8/06-finetuning-techniques/). Here are two more fictional training rows:

```jsonl
{"messages":[{"role":"system","content":"Classify the support ticket. Return JSON only with keys priority, category, and next_question. Never invent account details."},{"role":"user","content":"My export has been running for six hours and I need the report before the board meeting."},{"role":"assistant","content":"{\"priority\":\"high\",\"category\":\"data_export\",\"next_question\":\"What is the export job ID and which report format did you request?\"}"}]}
{"messages":[{"role":"system","content":"Classify the support ticket. Return JSON only with keys priority, category, and next_question. Never invent account details."},{"role":"user","content":"Can I change the avatar in my profile?"},{"role":"assistant","content":"{\"priority\":\"low\",\"category\":\"account_settings\",\"next_question\":\"Are you seeing an error when you select a new avatar?\"}"}]}
```

Minimum quality rules:

- Keep the **same exact system instruction and JSON schema** across examples.
- Include typos, vague requests, missing information, and tickets that should be escalated.
- Do not include the final-eval tickets anywhere in train/validation.
- Manually review every assistant answer. Synthetic examples are drafts, not ground truth.
- Record source/permission and reviewer in a private manifest; never add that private metadata to a public training row.

### 2. Establish a base-model baseline

Choose 10–20 unseen final-eval tickets. Run the base model with the same system instruction and save its output. Score each result:

| Metric | Example pass condition |
|---|---|
| JSON validity | parses successfully and has exactly three expected keys |
| Classification | priority/category match your reviewed reference |
| Grounding | no made-up account/order/customer fact |
| Useful question | asks for missing information that could resolve the ticket |
| Cost and latency | meets your intended use constraint |

If the base model passes already, this is a success: keep the base model and do not tune merely to complete a lab.

## Recommended beginner path: Unsloth Studio or a guided notebook

Use the current [Unsloth Gemma 4 guide](https://unsloth.ai/docs/models/gemma-4/train) and select its supported Gemma 4 text fine-tuning notebook/Studio option. Tool screens and exact model identifiers change, so use the current guide rather than a copied old Colab link.

### 1. Start in the smallest safe configuration

In Studio/notebook, choose:

| Setting | First run | Why |
|---|---|---|
| Model | smallest available **Gemma 4 instruction text** checkpoint | it is cheaper/faster to debug a 4B-class model than a large one |
| Task | supervised fine-tuning / chat | your JSONL demonstrates desired answers |
| Dataset | private `train.jsonl` + `validation.jsonl` | do not turn on public sharing for course data by accident |
| Chat template | Gemma 4's matching template / tool default | roles must match the checkpoint |
| Training target | assistant responses only | the assistant answer—not the prompt—is the target behaviour |
| Method | 4-bit QLoRA / LoRA | fits more modest GPU memory and produces a small adapter |
| LoRA rank | 8 or 16 | a conservative initial capacity |
| Epochs | 1 | cheapest way to catch data/template mistakes |
| Sequence length | 1024, unless your examples need more | keeps memory predictable; inspect truncation |

Leave advanced optimizer, scheduler, target-layer, and packing choices at the tool's documented defaults on the first run. Change one setting only after an evaluation tells you why.

### 2. Inspect one formatted example

Before pressing Train, use the notebook/Studio preview if available. You should be able to recognise the system, user, and assistant messages in the tokenized/formatted text. Confirm:

```text
[system instruction]
[user ticket]
[assistant JSON answer]  ← this is what the model should learn to produce
```

Stop if role markers look duplicated, the answer is missing, or the model's template does not match the dataset. A wrong template can waste a GPU session while producing a model that answers as the user.

### 3. Run one short adapter experiment

Start the one-epoch run, save the training configuration, and watch three things:

- Does training/validation loss become `NaN` or explode? Stop and inspect data/hardware settings.
- Does validation trend improve then worsen? Do not add epochs blindly; that can be overfitting.
- Are examples being truncated? Increase sequence length only if the useful answer/input is cut.

Save the result as an adapter version such as `triage-lora-v0`. It is an experiment, not a release.

### 4. Test it fairly

Load the adapter on the exact compatible base model, use the original system prompt, set deterministic generation for the first comparison (for example, temperature 0), and run the **same** final-eval tickets used for the baseline.

Make a table rather than relying on a nice single response:

| Case | Base JSON valid | Adapter JSON valid | Base correct | Adapter correct | New failure? |
|---|---:|---:|---:|---:|---|
| duplicate payment | ✓ | ✓ | ✗ | ✓ | no |
| vague login error | ✓ | ✓ | ✓ | ✓ | no |
| missing account detail | ✓ | ✗ | ✓ | ✗ | invented a customer ID |

The adapter is not ready if it gains a point of accuracy but starts inventing sensitive facts. Add/repair examples for the exact failure, then repeat with a new adapter version.

## Local route: use it only when your hardware is supported

Unsloth supports local and cloud workflows, but local training still depends on your OS, Python, GPU, driver, and VRAM. Start from its current installation/requirements documentation and run the supplied Gemma notebook unchanged once before customising it.

```text
1. Prove the official example works.
2. Copy the notebook into your own repository.
3. Replace only the model choice and dataset path.
4. Run one short training/evaluation.
5. Commit the notebook, requirements, data manifest (not private data), and results.
```

Do not paste a random `pip install` command from a video into a complex local environment. If setup consumes more time than the experiment, use the official cloud notebook or pick a smaller supported model; environment debugging is not model quality.

## Improve the result in this order

| Observation | Improvement |
|---|---|
| Invalid/unwanted text around JSON | strengthen examples and output schema; inspect chat template and response-only training |
| Wrong label for one common ticket type | add reviewed, varied examples of that type |
| Hallucinates account details | add “unknown/escalate” examples; use authenticated tools for account facts |
| Good on train, weak on final eval | remove duplicates, diversify data, reduce epochs/rank |
| Inputs are truncated | shorten source text, extract relevant fields, or carefully raise sequence length |
| No gain over the baseline | stop tuning; improve prompt, RAG, or tool workflow |

Do not try a bigger Gemma checkpoint, more epochs, more rank, and more synthetic rows at once. You will not know what changed the outcome—and may only make the bill larger.

## Export: adapter first, not a mystery model

Keep the following together:

```text
release/
├── adapter_model.safetensors / adapter_config.json
├── tokenizer or reference to exact base tokenizer
├── training_config.json
├── eval-results.json
├── requirements.txt or lockfile
└── README.md (the model card)
```

The next [Model Publishing & Cards](/2026-05/week-8/10-model-publishing/) lesson shows how to publish this safely. Do not upload a full merged model unless you understand the base model's redistribution terms and have tested that merged artifact independently.

## When it fails

| Symptom | Likely cause | Fix |
|---|---|---|
| Notebook cannot load Gemma | access terms/login/model identifier changed | follow the current official model/Unsloth guide; accept terms only if appropriate. |
| Training crashes or OOMs | model/context/batch too large for session | start with the smallest model, 4-bit QLoRA, short sequence, and default batch. |
| Model copies prompts/role labels | wrong chat template or response masking | inspect formatted example and use Gemma's matching template. |
| Adapter makes plausible but wrong JSON | label quality/coverage is weak | improve examples and held-out rubric before tuning settings. |
| Result cannot be reproduced | configuration, base revision, or data split was not recorded | save the exact config, dataset version/manifest, base model revision, and eval results. |

## Your turn (≈45 min)

1. Prepare 100+ permitted, reviewed examples for one narrow task plus validation and final-eval splits.
2. Score the untouched final eval with a small Gemma 4 instruction model and record the baseline.
3. In Unsloth Studio/notebook, train a one-epoch 4-bit LoRA adapter using the safe starter settings.
4. Compare base and adapter outputs case by case. Include one ambiguous and one missing-information ticket.
5. Save adapter `v0`, config, and eval report. Publish nothing yet.
6. Make one evidence-led improvement and train `v1`; document whether it actually helped.

## Checklist

- [ ] I use an instruction checkpoint and its matching chat template.
- [ ] My dataset is permitted, reviewed, split, and private by default.
- [ ] I establish a base-model baseline before training.
- [ ] I use a small 4-bit LoRA/QLoRA experiment first.
- [ ] I evaluate the same held-out cases before and after tuning.
- [ ] I save an adapter, config, base revision, and results—not just a screenshot.
- [ ] I know the tuned model still needs RAG/tools and system-level safeguards where appropriate.

## Go deeper

- [Unsloth Gemma 4 fine-tuning guide](https://unsloth.ai/docs/models/gemma-4/train) — current supported notebooks/Studio flow.
- [Unsloth fine-tuning guide](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide) — requirements and hyperparameters.
- [Unsloth datasets guide](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/datasets-guide) — formatting and quality guidance.
- [Hugging Face PEFT](https://huggingface.co/docs/peft/index) — adapter concepts behind the UI.

<!-- SOURCES: https://unsloth.ai/docs/models/gemma-4/train , https://unsloth.ai/docs/get-started/fine-tuning-llms-guide , https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/datasets-guide , https://huggingface.co/docs/peft/index -->
