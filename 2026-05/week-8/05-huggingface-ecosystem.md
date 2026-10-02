# Hugging Face Ecosystem

[![Hands-On Hugging Face Tutorial](https://img.youtube.com/vi/aeiUTRvh6yE/0.jpg)](https://www.youtube.com/watch?v=aeiUTRvh6yE)

> **Hugging Face is not “a website to download models.” It is an ecosystem for finding, running, evaluating, adapting, documenting, and sharing ML artefacts. The model page is part of the model. Read it before you run it.**

⏱ ~12 min read · ~30 min hands-on
🔗 needs: Python + `uv` · [Fine-Tuning Strategy](/2026-05/week-8/04-finetuning-strategy/) · [MLflow](/2026-05/week-8/03-mlflow/)

## The map of the ecosystem

```text
Hub ── stores/version-controls ── models, datasets, Spaces
 │
 ├── Transformers ── load models, tokenize, infer, train
 ├── Datasets ── load, clean, split, stream datasets
 ├── Evaluate ── calculate and share metrics
 ├── PEFT ── train small adapters such as LoRA
 ├── TRL ── supervised / preference / RL training helpers
 ├── Accelerate ── place training across available hardware
 └── Gradio / Spaces ── make a shareable demo
```

You do not need every library for a first project. A beginner path is:

```text
Hub model card → Transformers inference → Datasets for your JSONL →
Unsloth/PEFT fine-tuning → evaluate → Hub repo + model card
```

## The Hub: Git-like repositories for ML

The [Hugging Face Hub](https://huggingface.co/) hosts three main repo types:

| Repo type | Contains | Example use |
|---|---|---|
| **Model** | weights/adapters, tokenizer, config, `README.md` model card | publish a LoRA adapter |
| **Dataset** | JSONL/CSV/Parquet data and a dataset card | version a permitted training set |
| **Space** | app code and a small demo | let someone try a model safely |

Each repo has commits, branches, access controls, file history, and a URL. Large model files are handled by the Hub's large-file storage; do not paste weights into a normal Git repository.

### Read a model page like an engineer

Before downloading a model, answer these questions from its model card:

1. **What task is it for?** A base model and an instruction-tuned/chat model behave differently.
2. **What size and modality?** Parameter count, text/vision/audio capability, context window, and expected memory all matter.
3. **What licence and terms apply?** “Open weights” does not mean unrestricted use or redistribution.
4. **How was it trained and evaluated?** A leaderboard score is not evidence for your task.
5. **What are its limitations and risks?** If the author does not say, that is useful information too.
6. **Does it require custom code?** Treat `trust_remote_code=True` as executing third-party code: inspect it, pin a revision, and use a trusted environment.

> ⚖️ A public model or dataset can still have an unsuitable licence, unsafe content, unreviewed training data, or code you should not execute. “Popular on the Hub” is not a security review.

## Your first local inference

`pipeline()` is the smallest useful Transformers API. It downloads a model the first time, then runs inference locally. This sentiment model is deliberately tiny; it proves your setup without needing a GPU.

```bash
mkdir hf-first-steps && cd hf-first-steps
uv init
uv add transformers torch
```

```python
# save as sentiment.py
from transformers import pipeline

classifier = pipeline(
    task="sentiment-analysis",
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english",
)

reviews = [
    "The documentation made this project much easier.",
    "The setup was confusing and the result was not useful.",
]

for review, result in zip(reviews, classifier(reviews), strict=True):
    print(f"{result['label']:8} {result['score']:.3f}  {review}")
```

```bash
uv run sentiment.py
```

The label is the model's learned prediction—not an objective fact. Read the model card to see what `POSITIVE` and `NEGATIVE` mean, how it was evaluated, and why it may not work for your own domain.

## Datasets: version the examples, not just the code

The `datasets` library can read Hub datasets and local JSON/CSV/Parquet. For a fine-tuning project, keep raw, reviewed, and split data distinct.

```text
project/
├── data/
│   ├── raw/              # source; private/ignored if necessary
│   ├── reviewed.jsonl    # approved examples before splitting
│   ├── train.jsonl       # only for training
│   └── validation.jsonl  # only for development choices
├── evals/
│   └── final.jsonl       # untouched release gate
├── train.py
└── README.md
```

Load and inspect a local JSONL file before training. This works with the message-style data from [Fine-Tuning Strategy](/2026-05/week-8/04-finetuning-strategy/).

```bash
uv add datasets
```

```python
from datasets import load_dataset

dataset = load_dataset("json", data_files="data/train.jsonl", split="train")
print(dataset)
print(dataset[0]["messages"])

# Count examples before you trust an upload or a split.
print("training examples:", len(dataset))
```

Use `Dataset.train_test_split()` only when an ordinary random split is appropriate. For customer conversations, reports, code repositories, or time-series-like data, split by the **source group or time**, not by individual message—near duplicates cause leakage.

## Chat templates are part of the model contract

Chat models do not consume a generic list of messages directly. Their tokenizer turns roles and text into the special token sequence expected by that particular model. That conversion is the **chat template**.

```python
messages = [
    {"role": "user", "content": "Summarise this note in one sentence."},
]

# tokenizer comes from the SAME base model you will train/serve.
text = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
)
```

Do not train one model's template and infer with another's. Symptoms include repeated role labels, the model answering as the user, or outputs that never stop. Tools such as Unsloth can apply templates for you, but you still need to know which template and model they are using.

## What the main libraries do in a real project

| Library | Use it when | First thing to learn |
|---|---|---|
| `transformers` | loading/tokenizing/inference/training standard models | `pipeline`, `AutoTokenizer`, `from_pretrained` |
| `datasets` | loading, filtering, mapping, and splitting data | `load_dataset`, inspect rows, deterministic splits |
| `peft` | adapting an open model with a small LoRA adapter | base weights stay frozen; adapter is a separate artefact |
| `trl` | supervised fine-tuning or preference optimisation | train on responses and evaluate held-out tasks |
| `accelerate` | device placement/mixed precision/distributed work | let the framework manage available hardware |
| `huggingface_hub` / `hf` | authentication and upload/download | private draft repo, commit messages, model card |
| `evaluate` | standard metrics | metrics only help if they match the task |

You will use a guided **Unsloth** notebook for the first actual adapter in the later lessons. It sits on top of this ecosystem: the model, tokenizer, dataset format, adapter, and final upload are still Hugging Face artefacts.

## A safe custom-data workflow

1. Keep source data private and record its permission/licence.
2. Make reviewed examples for one narrow task—do not dump every document into training.
3. Create train, validation, and final-eval splits before tuning.
4. Test a base model and prompt on the final-eval **only once** at the release gate.
5. Put only permitted, non-sensitive material in a Hub dataset repo; make it private by default.
6. Version the dataset and record its commit/hash in MLflow and the model card.

The goal is reproducibility, not public exposure. A private dataset repo plus a public model card that describes the data at a high level is often the right balance.

## When it fails

| Symptom | Likely cause | Fix |
|---|---|---|
| Download fails or access is denied | Gated model, missing login, licence not accepted, or wrong token scope | Read the model page, accept terms only if appropriate, then authenticate with the minimum required token. |
| Output contains strange role tokens | Wrong/missing chat template | Load the paired tokenizer and apply its template consistently in training and inference. |
| Laptop runs out of memory | Model is too large or loaded at too high a precision | Start with a small model, then use [quantization](/2026-05/week-8/07-quantization/) or a cloud notebook. |
| Fine-tune looks good but fails on new inputs | Leaked/duplicated examples or poor task coverage | Split by source, deduplicate, add realistic held-out cases. |
| Cannot explain a downloaded model | No model card, unclear data/licence, or no evaluation | Do not use/publish it as a dependency without documenting these gaps. |

## Your turn (≈30 min)

1. Run the sentiment example and inspect its model card before interpreting the two labels.
2. Find one text-generation model and one embedding model on the Hub. For each, record task, size, licence, and one stated limitation.
3. Create a local `train.jsonl` with five original examples for one narrow task, then load and print it with `datasets`.
4. Add an unseen `evals/final.jsonl` with two edge cases. Do not put it in the training folder.
5. Choose whether the future dataset repo should be private or public, and write the reason in its README.

## Checklist

- [ ] I know the difference between a Hub model, dataset, and Space.
- [ ] I read the model card, licence, and limitations before downloading a model.
- [ ] I can run a small `pipeline()` locally.
- [ ] I keep my custom data versioned and split before training.
- [ ] I use the base model's own chat template.
- [ ] I know a model repo needs documentation, not just weight files.

## Go deeper

- [Transformers quickstart](https://huggingface.co/docs/transformers/quicktour) — load, infer, and train.
- [Pipelines](https://huggingface.co/docs/transformers/pipeline_tutorial) — the simplest inference entry point.
- [Hugging Face datasets](https://huggingface.co/docs/hub/datasets) — explore and publish datasets.
- [Unsloth dataset guide](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/datasets-guide) — chat formats and data preparation.

<!-- SOURCES: https://huggingface.co/docs/transformers/quicktour , https://huggingface.co/docs/transformers/pipeline_tutorial , https://huggingface.co/docs/hub/datasets , https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/datasets-guide -->
