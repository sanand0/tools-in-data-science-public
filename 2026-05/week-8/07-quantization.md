# Quantization

[![QLoRA in Action: a Fine-Tuning Tutorial](https://img.youtube.com/vi/6TF_00jiivk/0.jpg)](https://www.youtube.com/watch?v=6TF_00jiivk)

> **Quantization is a compression trade-off: use fewer bits to store model numbers so the model fits on available hardware. It makes a model cheaper to load; it does not make the model smaller in judgement, safer, or better at your task.**

⏱ ~12 min read · ~25 min hands-on
🔗 needs: [Fine-Tuning Techniques](/2026-05/week-8/06-finetuning-techniques/) · basic Python

## From precision to practical memory

Model weights are large arrays of numbers. Full precision uses many bits for each number; quantization represents them with fewer bits plus scales/metadata that approximately reconstruct the original values.

```text
FP32  → 32 bits per weight  → high precision, large memory
FP16/BF16 → 16 bits         → common training/inference precision
INT8  → 8 bits              → roughly half the weight memory of FP16
4-bit → 4 bits              → roughly quarter the weight memory of FP16
```

The word **roughly** matters. The model weights are only one part of memory usage. Tokenizer, framework overhead, temporary tensors, attention KV cache, batch size, and context length all consume RAM/VRAM too.

| Goal | First choice | Why |
|---|---|---|
| Train a model from scratch | BF16/FP16 on suitable accelerators | gradients/optimizer state need precision and lots of memory |
| Run a model locally | a trusted pre-quantized 8-bit/4-bit release | makes inference fit on smaller hardware |
| Adapt an LLM on one modest GPU | **QLoRA** | 4-bit frozen base + small trainable adapter |
| Need best possible benchmark quality | evaluate FP16/BF16 vs quantized candidates | compression can change quality |
| Need a phone/CPU runtime | a runtime-specific format such as GGUF/ONNX, tested on target | the serving engine matters as much as bit-width |

## The calculation you should do before downloading

This estimates **weight storage only**. It is a useful reality check, not a hardware promise.

```python
# save as estimate_memory.py
def weight_memory_gib(parameters_billions: float, bits_per_weight: int) -> float:
    bytes_used = parameters_billions * 1_000_000_000 * bits_per_weight / 8
    return bytes_used / 1024**3


for params in [1, 4, 8, 27]:
    print(f"\n{params}B-parameter model (weights only)")
    for bits in [32, 16, 8, 4]:
        print(f"  {bits:>2}-bit: ~{weight_memory_gib(params, bits):5.1f} GiB")
```

```bash
uv run estimate_memory.py
```

An 8B model at 4-bit has roughly 3.7 GiB of raw weight data. It may still fail on a 4 GiB GPU once runtime overhead and a useful context window are included. Start with a much smaller model than the maximum your device might theoretically hold.

## Four related terms, not one thing

| Term | Meaning | Common beginner confusion |
|---|---|---|
| **Quantization** | represent numbers with fewer bits | not the same as training fewer parameters |
| **8-bit / 4-bit inference** | load weights compactly to generate text | can be a pre-quantized release or dynamic load option |
| **LoRA** | train a small adapter while base weights are frozen | does not require 4-bit by itself |
| **QLoRA** | load frozen base in 4-bit and train LoRA adapter | adapter is still trained in a usable compute precision |

With QLoRA, save and publish the **adapter** separately from the base model unless you have explicit rights and a reason to merge. Anyone using it needs the exact compatible base model and chat template.

## Try it — load a small model in 4-bit *only if you have a compatible GPU*

This is an optional local experiment for NVIDIA/Intel-compatible hardware. Check the current [bitsandbytes hardware requirements](https://huggingface.co/docs/transformers/quantization/bitsandbytes) first. If it does not match your machine, use the guided cloud notebook in the next lesson; do not spend hours fighting drivers.

```bash
mkdir quantization-demo && cd quantization-demo
uv init
uv add transformers accelerate bitsandbytes torch
```

```python
# save as load_4bit.py
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

# Substitute a model you have permission to access and that fits your hardware.
model_id = "Qwen/Qwen2.5-0.5B-Instruct"

quantization = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    quantization_config=quantization,
)

messages = [{"role": "user", "content": "Reply with exactly three colours."}]
inputs = tokenizer.apply_chat_template(
    messages, add_generation_prompt=True, return_tensors="pt"
).to(model.device)
output = model.generate(inputs, max_new_tokens=20, do_sample=False)
print(tokenizer.decode(output[0][inputs.shape[-1]:], skip_special_tokens=True))
```

```bash
uv run load_4bit.py
```

`nf4` is a 4-bit representation commonly used for QLoRA-style training. `bfloat16` is the compute dtype where supported. If the script errors, **do not** “fix” it by randomly changing dtypes: read the error, verify GPU/driver/library compatibility, or use a notebook that configures the environment for you.

## Compare quality, not just whether it starts

Quantization is successful only if it meets your use case. For the same prompt set, record:

| Check | Why it matters |
|---|---|
| Task score / human rubric | Does it still make the right decision/output? |
| JSON/schema validity | Small errors can break application integration. |
| Latency and tokens/second | Smaller weights do not always mean faster generation on every device. |
| Peak RAM/VRAM | Determines whether it is deployable. |
| Safety and edge cases | Compression can change borderline behaviour. |

For a custom support-triage adapter, test the same held-out tickets against base FP16/BF16 (if available), 8-bit, and 4-bit/QLoRA. Keep the smallest version that passes the release threshold; do not choose from one impressive prompt.

## Quantization choices in practice

| Option | Use for | Advantages | Watch for |
|---|---|---|---|
| FP16/BF16 | baseline or well-resourced serving | strong default quality/compatibility | high VRAM/RAM |
| 8-bit | quality-sensitive constrained inference | smaller memory impact, usually easier quality trade-off | still may not fit small devices |
| 4-bit NF4 + LoRA | beginner adapter training | enables QLoRA on modest GPUs | depends on runtime/hardware; test quality |
| GGUF/GPTQ/AWQ etc. | specific local inference runtime | practical distribution for target engine | formats are not interchangeable; document exact runtime/quantization |

Never say merely “4-bit model.” Include model revision, base model, quantization method, runtime, context length tested, and evaluation result. Those details decide whether another person can reproduce the result.

## When it fails

| Symptom | Likely cause | Fix |
|---|---|---|
| `CUDA out of memory` even with 4-bit | context/KV cache or temporary tensors exceed VRAM | reduce context, batch, and model size; monitor peak memory. |
| `bitsandbytes` import/backend error | incompatible OS, GPU, CUDA/driver, or package build | check the current compatibility table; use a supported notebook/runner instead of guessing. |
| Output quality falls sharply | bit-width/method is too aggressive for task/model | compare 8-bit or BF16; validate with held-out evals. |
| Adapter will not load | base revision, tokenizer/template, or PEFT config differs | pin and document every dependency; load the exact base model. |
| Model runs but is painfully slow | CPU offloading or unsupported kernels | use a smaller model/shorter context or a runtime designed for your hardware. |

## Your turn (≈25 min)

1. Run `estimate_memory.py` for the smallest and largest model you are considering.
2. Write down your actual available RAM/VRAM and choose a conservative model size.
3. If your machine is supported, run the optional 4-bit loading example. Otherwise open the next lesson's Unsloth notebook route.
4. Create five fixed prompts for your custom task and a scorecard: correctness, format validity, latency, and one safety check.
5. State the exact quantization/runtime you would publish—not just “quantized.”

## Checklist

- [ ] I know weight-memory estimates exclude context, cache, and runtime overhead.
- [ ] I can distinguish quantization, LoRA, and QLoRA.
- [ ] I know QLoRA trains an adapter on a frozen 4-bit base model.
- [ ] I verify hardware compatibility before debugging an installation.
- [ ] I select bit-width using held-out task quality as well as memory.
- [ ] I document the base model, revision, method, runtime, and tested context.

## Go deeper

- [Hugging Face bitsandbytes quantization](https://huggingface.co/docs/transformers/quantization/bitsandbytes) — current installation and 4-bit options.
- [PEFT quantization guide](https://huggingface.co/docs/peft/developer_guides/quantization) — QLoRA and adapter preparation.
- [Selecting a quantization method](https://huggingface.co/docs/transformers/main/quantization/selecting) — methods and trade-offs.
- [Fine-Tuning Techniques](/2026-05/week-8/06-finetuning-techniques/) — why QLoRA follows a data/eval strategy.

<!-- SOURCES: https://huggingface.co/docs/transformers/quantization/bitsandbytes , https://huggingface.co/docs/peft/developer_guides/quantization , https://huggingface.co/docs/transformers/main/quantization/selecting -->
