# Fine-Tuning Techniques

[![Fine-Tuning vs. RAG Explained](https://img.youtube.com/vi/L7PfLk4a2oY/0.jpg)](https://www.youtube.com/watch?v=L7PfLk4a2oY)

> **The important question is not “which fine-tuning buzzword should I use?” It is “what minimum change to the model, with what evidence, improves my held-out task?” Start with an adapter. Earn the right to do anything more expensive.**

⏱ ~14 min read · ~35 min hands-on
🔗 needs: [Fine-Tuning Strategy](/2026-05/week-8/04-finetuning-strategy/) · [Hugging Face Ecosystem](/2026-05/week-8/05-huggingface-ecosystem/) · [Quantization](/2026-05/week-8/07-quantization/)

## The techniques, from least to most invasive

| Technique | What changes | Best first use | Main risk |
|---|---|---|---|
| Prompt / few-shot | no weights | establish a baseline | prompt becomes long/fragile |
| **SFT** (supervised fine-tuning) | weights learn input → desired output examples | stable formatting, classification, extraction, task behaviour | copies mistakes in labels |
| **LoRA** | trains small low-rank adapter matrices; base model stays frozen | almost every first open-model adaptation | wrong base model/template still fails |
| **QLoRA** | LoRA while the frozen base model is loaded in 4-bit | GPU/RAM-constrained first run | hardware/software compatibility and quality trade-off |
| Preference tuning (DPO etc.) | learns chosen output over rejected output | you can rank alternatives more easily than write a perfect one | unclear/inconsistent preferences |
| Full fine-tuning | updates all/most base weights | specialised, well-funded work with strong data/evals | cost, catastrophic forgetting, hard rollback |
| Continued pretraining | learns from raw domain text before task tuning | a large, licensed domain corpus materially differs from base knowledge | costly; raw text is often a bad substitute for RAG |

For this course, the practical default is **instruction-tuned base model + supervised fine-tuning + LoRA**, usually with 4-bit QLoRA. It is cheap enough to learn, produces a small adapter to share, and is reversible: remove the adapter to return to the base model.

## SFT: teach the output you want to see

Supervised fine-tuning demonstrates a repeated mapping:

```text
input:  a messy support request
output: a strict JSON triage record with no invented facts
```

The model is rewarded for the target response tokens. Therefore, the answer column is your most important code. If examples contain unsupported claims, overly long explanations, or inconsistent formatting, you are explicitly training those behaviours.

### A small custom task: support-ticket triage

Use one narrow task rather than “make the model know our company.” Here the model must label a ticket and ask one safe next question.

```jsonl
{"messages":[{"role":"system","content":"Classify the support ticket. Return JSON only with keys priority, category, and next_question. Never invent account details."},{"role":"user","content":"I was charged twice for order 2918 and need help today."},{"role":"assistant","content":"{\"priority\":\"high\",\"category\":\"billing\",\"next_question\":\"What is the email address used for order 2918?\"}"}]}
{"messages":[{"role":"system","content":"Classify the support ticket. Return JSON only with keys priority, category, and next_question. Never invent account details."},{"role":"user","content":"The dashboard font is difficult to read on my phone."},{"role":"assistant","content":"{\"priority\":\"low\",\"category\":\"usability\",\"next_question\":\"Which phone model, browser, and dashboard page are you using?\"}"}]}
{"messages":[{"role":"system","content":"Classify the support ticket. Return JSON only with keys priority, category, and next_question. Never invent account details."},{"role":"user","content":"I cannot log in after changing my password."},{"role":"assistant","content":"{\"priority\":\"medium\",\"category\":\"authentication\",\"next_question\":\"What error message appears after you submit the new password?\"}"}]}
```

This is a **format specimen**, not enough training data. Make at least dozens of original, reviewed examples before expecting an adapter to generalise; guided-tool documentation often suggests 100+ for a meaningful first run. Include normal cases, messy wording, missing facts, and cases where the correct answer is to escalate rather than guess.

## LoRA without the algebra headache

Large transformers have huge learned weight matrices. LoRA leaves those base matrices frozen and learns a small update that is added during inference:

```text
original weight W (frozen)
          + low-rank update A × B (trained)
          = adapted behaviour
```

The **rank** (`r`) is the size/capacity of that update. Larger ranks can capture more change but consume more memory and make overfitting easier. `lora_alpha` scales the update; dropout is a small regulariser. Do not tune all three randomly before you have a baseline.

Useful first-run defaults are intentionally boring:

| Setting | Beginner starting point | Change it when… |
|---|---|---|
| Base model | small, instruction-tuned model you can run | your task/eval proves it is too weak |
| Method | LoRA / QLoRA | you have evidence an adapter cannot meet the goal |
| Rank `r` | 8 or 16 | quality plateaus with clean, sufficient data |
| Epochs | 1–2 | validation improves without divergence |
| Learning rate | tool's conservative default | you understand loss/validation behaviour |
| Sequence length | just above the longest useful example | inputs are being truncated |
| Evaluation | held-out set + task rubric | never omit it to save time |

The exact option names vary between Unsloth, TRL, PEFT, and hosted providers. Record the actual values in [MLflow](/2026-05/week-8/03-mlflow/) rather than relying on memory.

## QLoRA: use a quantized base, train an adapter

QLoRA loads the frozen base model at 4-bit precision and trains LoRA adapters in higher precision. This dramatically lowers memory pressure compared with changing every base weight. It does **not** mean “train a model using only four bits”; the adapter and computation still need memory.

```text
4-bit frozen base model + trainable LoRA adapter → QLoRA adapter
```

Read [Quantization](/2026-05/week-8/07-quantization/) before using this as a magic “make any model fit” switch. It changes resource needs and can affect quality; it does not fix a bad dataset.

## The response-only rule

For chat SFT, the usual goal is to train on the **assistant response**, not to train the model to repeat the system prompt and user message. Make sure your trainer's “train on responses only” / label-masking setting matches your chat template.

Check an actual formatted example before a long run:

```text
<system> Classify the support ticket…
<user> I was charged twice…
<assistant> {"priority":"high", ...}
                         ^ these response tokens should be the training target
```

If a tuned model parrots the prompt, answers as the user, or writes role labels, suspect template/label masking before changing epochs or rank.

## A beginner experiment plan

Use the custom ticket task above. The [Gemma 4 lesson](/2026-05/week-8/08-gemma4-finetuning/) gives the click-by-click Unsloth route; here is the experimental plan that makes any tool useful.

1. Write 100+ permitted, reviewed ticket → JSON examples. Use one schema and one policy.
2. Reserve 20% by **ticket source/time**, not random duplicates, as validation. Keep a final 10–20 case eval unseen.
3. Test the base model with the exact system prompt. Save outputs and score JSON validity, correct category, safety, cost, and latency.
4. Fine-tune one LoRA/QLoRA adapter with conservative defaults; train for one epoch first.
5. Run the adapter on the same final eval. Compare outputs side by side with the base model.
6. Improve one thing at a time: first labels/coverage, then prompt/template, then data size; only then a hyperparameter.
7. Keep the best adapter only if it improves the chosen release metric without creating new safety failures.

## Improvement levers in the right order

| If you observe… | Improve this first | Do not jump straight to… |
|---|---|---|
| Invalid JSON | prompt/schema examples; include malformed-input cases | more epochs |
| Wrong category on slang/typos | data coverage and labels | larger base model |
| Made-up account/order facts | explicit unknown/escalation examples; tool/RAG design | tuning more aggressively |
| Good train results, bad unseen results | deduplicate and diversify data; lower epochs | higher LoRA rank |
| Long inputs are cut off | sample/sequence length and input design | blindly increasing GPU size |
| No meaningful gain over base prompt | stop; revisit the task decision | full fine-tuning |

> Do not collect or train on private reasoning traces merely to make an answer look intelligent. Train verifiable outputs, concise explanations when needed, and task-specific checks. Evaluate the result, not hidden thought text.

## When it fails

| Symptom | Likely cause | Fix |
|---|---|---|
| Loss falls but quality does not improve | Objective/data does not match the real task | Use task evals and inspect examples, not loss alone. |
| Validation quality drops after an epoch | Overfitting | Stop early; improve/diversify data; lower epochs. |
| Adapter makes outputs worse | Wrong chat template, base model, or label masking | Verify one formatted example and test base/adapted model with the same prompt. |
| CUDA out-of-memory | Base model/context/batch is too large | reduce batch/sequence length, use gradient accumulation, QLoRA, or a smaller model. |
| Model is fluent but unsafe | Training/eval set lacks refusals, uncertainty, or abuse cases | add reviewed negative/edge cases and system safeguards. |

## Your turn (≈35 min)

1. Pick one narrow task and define one machine-checkable property of success (for example, valid JSON with exactly three keys).
2. Create 20 original examples in the message format. Mark each with a reviewer and source/permission note.
3. Write five held-out evaluation cases: a normal case, typo/slang, missing information, ambiguous case, and unsafe/escalation case.
4. Run your base-model prompt on the five cases and save the outputs.
5. Decide whether LoRA/QLoRA is justified. If yes, follow the next Gemma/Unsloth lesson; if no, improve the prompt/RAG/tool design instead.

## Checklist

- [ ] I can distinguish SFT, LoRA, QLoRA, preference tuning, and full fine-tuning.
- [ ] I know why LoRA is the first adaptation method to try.
- [ ] My custom examples demonstrate the exact behaviour I need.
- [ ] I have response-only training and the right chat template.
- [ ] I use held-out task evaluation, not training loss alone.
- [ ] I improve data and task design before hyperparameter hunting.

## Go deeper

- [Unsloth fine-tuning guide](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide) — beginner-first notebook workflow.
- [Unsloth datasets guide](https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/datasets-guide) — instruction, conversation, and raw-text formats.
- [Hugging Face PEFT](https://huggingface.co/docs/peft/index) — LoRA and related adapter methods.
- [Fine-Tuning Strategy](/2026-05/week-8/04-finetuning-strategy/) — data/eval before training.

<!-- SOURCES: https://unsloth.ai/docs/get-started/fine-tuning-llms-guide , https://unsloth.ai/docs/get-started/fine-tuning-llms-guide/datasets-guide , https://huggingface.co/docs/peft/index -->
