# LLM Grounding & Citations

> An answer without a source is just an opinion. Ground your LLM to the documents it retrieved.

---

## What Is Grounding?

Grounding means forcing the LLM to:
1. **Only use retrieved context** — no hallucinated facts
2. **Cite every claim** — map each sentence to a source chunk
3. **Admit uncertainty** — say "I don't know" when context is insufficient

---

## System Prompt for Grounded Answers

The simplest form of grounding is a strict system prompt:

```python
GROUNDED_SYSTEM_PROMPT = """
You are a precise research assistant. You MUST follow these rules:
1. Answer ONLY using the provided context chunks.
2. If the answer is not in the context, say: "I don't have enough information to answer this."
3. Cite your sources using [CHUNK_N] notation after every factual claim.
4. Do not combine information from different chunks into a single claim without citing both.
5. Do not add background knowledge not present in the context.
"""

def grounded_answer(query: str, context_chunks: list[str]) -> str:
    from openai import OpenAI
    client = OpenAI()
    
    # Format context with chunk IDs
    formatted_context = "\n\n".join(
        f"[CHUNK_{i+1}]: {chunk}"
        for i, chunk in enumerate(context_chunks)
    )
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": GROUNDED_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Context:\n{formatted_context}\n\nQuestion: {query}"
            }
        ],
        temperature=0,
    )
    
    return response.choices[0].message.content

# Example
chunks = [
    "FAISS was developed by Facebook AI Research in 2017.",
    "FAISS supports both CPU and GPU index types.",
    "The HNSW algorithm provides approximate nearest-neighbor search.",
]

answer = grounded_answer("Who made FAISS and does it support GPU?", chunks)
print(answer)
# "FAISS was developed by Facebook AI Research [CHUNK_1]. It supports both CPU and GPU [CHUNK_2]."
```

---

## Structured Citations with Pydantic

Return structured answers where every claim has a source:

```python
from pydantic import BaseModel
from openai import OpenAI
import json

client = OpenAI()

class Citation(BaseModel):
    chunk_id: int
    quote: str  # relevant excerpt from the chunk

class GroundedAnswer(BaseModel):
    answer: str
    citations: list[Citation]
    confidence: float  # 0-1, how confident the model is

def structured_grounded_answer(query: str, chunks: list[str]) -> GroundedAnswer:
    formatted = "\n".join(f"[{i+1}] {c}" for i, c in enumerate(chunks))
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Answer the question using the numbered context chunks. "
                    "Return JSON with fields: answer (string), "
                    "citations (list of {chunk_id, quote}), confidence (0-1)."
                )
            },
            {"role": "user", "content": f"Context:\n{formatted}\n\nQuestion: {query}"}
        ],
        response_format={"type": "json_object"},
        temperature=0,
    )
    
    data = json.loads(response.choices[0].message.content)
    return GroundedAnswer(**data)

result = structured_grounded_answer(
    "What does FAISS support?",
    ["FAISS supports GPU acceleration.", "FAISS handles billion-scale vector search."]
)
print(f"Answer: {result.answer}")
print(f"Confidence: {result.confidence}")
for c in result.citations:
    print(f"  [Chunk {c.chunk_id}]: {c.quote}")
```

---

## Self-Verification Prompt

Ask the LLM to verify its own answer against the context:

```python
def self_verify(query: str, answer: str, context_chunks: list[str]) -> dict:
    """Ask the LLM to check if its answer is supported by the context."""
    context = "\n\n".join(context_chunks)
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a fact-checker. Given a question, an answer, and context chunks, "
                    "determine if every claim in the answer is supported by the context. "
                    "Return JSON: {supported: bool, unsupported_claims: list[str], explanation: str}"
                )
            },
            {
                "role": "user",
                "content": (
                    f"Question: {query}\n\n"
                    f"Answer: {answer}\n\n"
                    f"Context:\n{context}"
                )
            }
        ],
        response_format={"type": "json_object"},
        temperature=0,
    )
    
    return json.loads(response.choices[0].message.content)
```

---

## Further Reading

- [Anthropic's Constitutional AI](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback)
- [LlamaIndex Citation Engine](https://docs.llamaindex.ai/en/stable/examples/query_engine/citation_query_engine/)

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

