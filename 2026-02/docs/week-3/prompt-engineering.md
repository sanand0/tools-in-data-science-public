# Prompt Engineering

Prompt engineering is the practice of crafting inputs that reliably get the output you need from a language model. It is not about "magic words" — it is about understanding how LLMs process text and designing prompts that make the task unambiguous.

?> **One key insight**
?> LLMs are **next-token predictors**. The best prompt is the one that makes your desired output the most statistically likely continuation of the input.

---

## Why Prompting Matters (with Numbers)

Same task, different prompts, wildly different accuracy on GSM8K (grade-school math):

| Technique | Accuracy |
|-----------|---------|
| No prompt engineering | 17% |
| Few-shot (5 examples) | 57% |
| Chain-of-Thought (CoT) | 78% |
| Self-Consistency (CoT × 40 samples) | 95% |

The model weights did not change. Only the prompt did.

---

## 1. Zero-Shot Prompting

Just ask, no examples. Works for simple, well-defined tasks with capable models.

```python
import anthropic

client = anthropic.Anthropic()

def zero_shot(task: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=256,
        messages=[{"role": "user", "content": task}],
    )
    return response.content[0].text

# Works great for capable models on clear tasks
print(zero_shot("Translate 'Hello, how are you?' to Tamil."))
print(zero_shot("What is the capital of Karnataka?"))

# Struggles on nuanced tasks
print(zero_shot("Is this sarcastic? 'Yeah, totally, another Monday morning meeting.'"))
```

**When to use:** Simple transformations, factual lookups, summarization of short text.

---

## 2. Few-Shot Prompting

Provide 2–8 examples of input → output before your actual query. The model learns the pattern from the examples.

```python
def few_shot_sentiment(text: str) -> str:
    examples = """
Classify the sentiment as POSITIVE, NEGATIVE, or NEUTRAL.

Input: "The food was amazing, best I've had in years!"
Output: POSITIVE

Input: "Delivery took 2 hours and the pizza was cold."
Output: NEGATIVE

Input: "The package arrived on Tuesday."
Output: NEUTRAL

Input: "I waited forever but at least they apologized."
Output: NEGATIVE

Input: "{text}"
Output:""".format(text=text)

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=10,
        messages=[{"role": "user", "content": examples}],
    )
    return response.content[0].text.strip()

print(few_shot_sentiment("Surprisingly decent for a budget hotel."))
# → POSITIVE
```

### Few-Shot Best Practices

```python
# ✅ Good: diverse, representative examples
examples = [
    ("The CEO resigned amid controversy.", "NEGATIVE"),
    ("Q3 profits up 23% year-over-year.", "POSITIVE"),
    ("The meeting is rescheduled to 3pm.", "NEUTRAL"),
    ("Despite delays, they delivered on time.", "POSITIVE"),  # teaches nuance
]

# ❌ Bad: all similar examples — model doesn't learn edge cases
examples = [
    ("Great!", "POSITIVE"),
    ("Wonderful!", "POSITIVE"),
    ("Excellent!", "POSITIVE"),
]
```

**Ordering matters:** Put harder examples closer to the query. The model pays more attention to recent context.

---

## 3. Chain-of-Thought (CoT)

For reasoning tasks, ask the model to show its work **before** giving the answer. This dramatically improves accuracy on math, logic, multi-step analysis.

```python
def solve_with_cot(problem: str) -> str:
    prompt = f"""Solve the following problem step by step.
Think through each step carefully before giving the final answer.

Problem: {problem}

Let me work through this step by step:"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text

result = solve_with_cot(
    "A train leaves Mumbai at 9am going 80 km/h. "
    "Another train leaves Pune (150km away) at 10am going 100 km/h. "
    "When do they meet?"
)
print(result)
```

### Zero-Shot CoT: Just Add "Think Step by Step"

```python
# Appending this phrase alone triggers CoT behavior in capable models
prompt = f"""
{problem}

Think step by step.
"""

# Or even more explicit:
prompt = f"""
{problem}

Let's approach this systematically:
1. First, identify what we know.
2. Then, work out the intermediate steps.
3. Finally, give the answer.
"""
```

### CoT with Structured Output

```python
def analyze_with_cot(question: str, context: str) -> dict:
    prompt = f"""
<context>
{context}
</context>

<question>
{question}
</question>

Analyze the question using the context. Think step by step, then give your answer.

<thinking>
[Work through your reasoning here]
</thinking>

<answer>
[Your final answer]
</answer>

<confidence>
[High / Medium / Low — and why]
</confidence>
"""
    # Parse the XML-like tags from the response
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    text = response.content[0].text
    return {
        "thinking": extract_tag(text, "thinking"),
        "answer": extract_tag(text, "answer"),
        "confidence": extract_tag(text, "confidence"),
    }

def extract_tag(text: str, tag: str) -> str:
    import re
    match = re.search(f"<{tag}>(.*?)</{tag}>", text, re.DOTALL)
    return match.group(1).strip() if match else ""
```

---

## 4. Self-Consistency

Run the **same CoT prompt N times** with non-zero temperature, then take the **majority vote**. Massively improves reliability on tasks with a definitive right answer.

```python
from collections import Counter

def self_consistency(problem: str, n: int = 7, temperature: float = 0.8) -> str:
    """Run N independent CoT samples and vote on the answer."""
    answers = []

    for i in range(n):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=512,
            temperature=temperature,
            messages=[{
                "role": "user",
                "content": f"{problem}\n\nThink step by step, then give ONLY the final answer on the last line starting with 'Answer:'",
            }],
        )
        text = response.content[0].text
        # Extract the answer line
        for line in reversed(text.split('\n')):
            if line.strip().startswith("Answer:"):
                answers.append(line.replace("Answer:", "").strip())
                break

    # Majority vote
    if not answers:
        return "No consensus"
    vote = Counter(answers).most_common(1)[0]
    return f"{vote[0]} (confidence: {vote[1]}/{n})"

result = self_consistency(
    "If a shirt costs $45 after a 25% discount, what was the original price?",
    n=7,
)
print(result)  # → $60.00 (confidence: 6/7)
```

**When to use:** Math problems, logical reasoning, classification where answers are discrete. Too expensive for free-form generation.

---

## 5. Tree-of-Thought (ToT)

Instead of one chain of reasoning, explore **multiple reasoning paths** and evaluate them. Think of it as beam search for reasoning.

```python
def tree_of_thought(problem: str) -> str:
    # Step 1: Generate 3 different approaches
    approaches_prompt = f"""
Problem: {problem}

Generate 3 DIFFERENT high-level approaches to solve this problem.
Format each as:
Approach 1: [name] — [one-line description]
Approach 2: [name] — [one-line description]  
Approach 3: [name] — [one-line description]
"""
    approaches_resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=256,
        messages=[{"role": "user", "content": approaches_prompt}],
    )
    approaches = approaches_resp.content[0].text

    # Step 2: Evaluate and solve with best approach
    solve_prompt = f"""
Problem: {problem}

Possible approaches:
{approaches}

Evaluate which approach is most promising and why (2-3 sentences).
Then solve the problem fully using that approach.

Best approach and why:

Full solution:
"""
    final_resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": solve_prompt}],
    )
    return final_resp.content[0].text

result = tree_of_thought(
    "Design a system to detect plagiarism in student code submissions."
)
print(result)
```

**When to use:** Open-ended design problems, creative tasks, planning. Overkill for factual Q&A.

---

## 6. Role Prompting

Assign the model a specific role or persona. This activates relevant knowledge and sets the appropriate tone and depth.

```python
def with_role(role: str, task: str, context: str = "") -> str:
    system = f"You are {role}."
    if context:
        system += f" {context}"

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        system=system,
        messages=[{"role": "user", "content": task}],
    )
    return response.content[0].text

# Medical role
result = with_role(
    role="a board-certified cardiologist explaining to a medical student",
    task="Explain the pathophysiology of atrial fibrillation.",
)

# Code review role
result = with_role(
    role="a senior Python engineer focused on production reliability",
    context="Your job is to find bugs, security issues, and performance problems. Be direct and specific.",
    task="Review this code:\n```python\ndef get_user(id):\n    return db.execute(f'SELECT * FROM users WHERE id={id}')\n```",
)

# Adversarial role (stress testing)
result = with_role(
    role="a skeptical venture capitalist who has seen many failed AI startups",
    task="Here is our pitch: We use AI to optimize supply chains. What's your biggest concern?",
)
```

---

## Combining Techniques

The real power comes from combining:

```python
def production_classifier(text: str, categories: list[str]) -> dict:
    """
    Combines: role prompting + few-shot + CoT + structured output
    """
    cats = ", ".join(categories)
    examples = "\n".join([
        f'Text: "Urgent: production server is down!"\nCategory: INCIDENT\nReasoning: Contains urgency + infrastructure issue\n',
        f'Text: "Can we discuss the roadmap next sprint?"\nCategory: PLANNING\nReasoning: Forward-looking, collaborative language\n',
        f'Text: "The deploy failed with exit code 1"\nCategory: INCIDENT\nReasoning: Active failure with technical detail\n',
    ])

    prompt = f"""You are a support ticket classifier for a software company.
Classify tickets into exactly one of: {cats}

Examples:
{examples}
---
Text: "{text}"

Think step by step, then output:
Category: [one of {cats}]
Reasoning: [1-2 sentences]
Confidence: [0.0-1.0]"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}],
    )

    text_out = response.content[0].text
    lines = {l.split(":")[0].strip(): ":".join(l.split(":")[1:]).strip()
             for l in text_out.split("\n") if ":" in l}
    return {
        "category": lines.get("Category", "UNKNOWN"),
        "reasoning": lines.get("Reasoning", ""),
        "confidence": float(lines.get("Confidence", "0.5")),
    }
```

---

## Technique Selection Guide

| Task Type | Best Technique |
|-----------|---------------|
| Simple translation / lookup | Zero-shot |
| Output format learning | Few-shot (3–5 examples) |
| Math, logic, multi-step | Chain-of-Thought |
| High-stakes factual answers | Self-Consistency (N=7–11) |
| Open-ended design / planning | Tree-of-Thought |
| Domain expertise required | Role prompting |
| Everything above is still failing | All combined + better examples |

---

## Video Reference

[![Prompt Engineering Guide](https://img.youtube.com/vi/dOxUroR57xs/0.jpg)](https://youtu.be/dOxUroR57xs "Prompt Engineering Guide")

---

## Quick Reference Cheat Sheet

```python
# Zero-shot
"Classify: {text}"

# Few-shot
"Examples:\n{examples}\n\nNow classify: {text}"

# CoT trigger
"Think step by step.\n\n{problem}"

# Self-consistency
# Run 5-11x, majority vote on answer

# ToT trigger
"Generate 3 approaches. Evaluate each. Solve with the best."

# Role
system="You are a {expert} focused on {goal}."

# XML output structure (Claude loves this)
"Output your answer as:\n<thinking>...</thinking>\n<answer>...</answer>"
```

---

