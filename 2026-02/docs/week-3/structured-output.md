# Pydantic & Structured Output

LLMs return free-form text. Your application needs typed, validated data. **Instructor** is the bridge — it wraps any LLM client and guarantees structured, validated Pydantic output with automatic retry on failure.

?> **Why this matters**
?> Without structured output, you write brittle regex parsers that break on every model update. With Instructor + Pydantic, you define a schema once and the LLM fills it.

---

## Installation

```bash
uv add instructor anthropic openai pydantic
```

---

## The Core Pattern

```python
import instructor
import anthropic
from pydantic import BaseModel

# 1. Define your schema
class Movie(BaseModel):
    title: str
    year: int
    director: str
    genre: str
    rating: float  # 0.0 - 10.0

# 2. Patch the client with instructor
client = instructor.from_anthropic(anthropic.Anthropic())

# 3. Call with response_model — get typed output back
movie = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=256,
    messages=[{
        "role": "user",
        "content": "Extract movie info: Interstellar (2014) directed by Christopher Nolan, sci-fi, rated 8.6"
    }],
    response_model=Movie,  # ← the magic
)

print(movie.title)     # "Interstellar"
print(movie.year)      # 2014  (int, not string!)
print(movie.rating)    # 8.6   (float, not string!)
print(type(movie))     # <class 'Movie'>
```

No JSON parsing. No regex. No `int(response.split("year:")[1])`. Just typed Python objects.

---

## Multi-Provider Support

```python
import instructor
import anthropic
import openai
from openai import OpenAI

# Anthropic
client_claude = instructor.from_anthropic(anthropic.Anthropic())

# OpenAI
client_gpt = instructor.from_openai(OpenAI())

# Ollama (local, free)
client_ollama = instructor.from_openai(
    OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
)

# Gemini via OpenAI-compatible endpoint
client_gemini = instructor.from_openai(
    OpenAI(
        api_key="your-gemini-key",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
)

# All use the SAME code pattern:
def extract(client, text: str, model_name: str) -> Movie:
    return client.messages.create(  # or chat.completions.create for OpenAI
        model=model_name,
        max_tokens=256,
        messages=[{"role": "user", "content": f"Extract: {text}"}],
        response_model=Movie,
    )
```

---

## Pydantic Validators for Extraction

Add validation rules that automatically trigger LLM retries when violated:

```python
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional
import re

class StudentInfo(BaseModel):
    name: str = Field(description="Full name of the student")
    roll_number: str = Field(description="Roll number in format: XX00X0000 e.g. CS21B1001")
    cgpa: float = Field(ge=0.0, le=10.0, description="CGPA between 0 and 10")
    email: str = Field(description="Must be an IITM email")
    year: int = Field(ge=1, le=4)
    courses: list[str] = Field(min_length=1, max_length=8)

    @field_validator("roll_number")
    @classmethod
    def validate_roll_number(cls, v: str) -> str:
        pattern = r"^[A-Z]{2}\d{2}[A-Z]\d{4}$"
        if not re.match(pattern, v):
            raise ValueError(f"Invalid roll number: {v}. Must match CS21B1001 format.")
        return v.upper()

    @field_validator("email")
    @classmethod
    def validate_iitm_email(cls, v: str) -> str:
        if not v.endswith("@ds.study.iitm.ac.in"):
            raise ValueError(f"Email must be @ds.study.iitm.ac.in, got {v}")
        return v.lower()

    @model_validator(mode="after")
    def validate_year_matches_roll(self) -> "StudentInfo":
        # Roll number encodes year: CS21B1001 → joined 2021
        year_digit = int(self.roll_number[2:4])
        # Current year 2026, so first year = 2025 batch → year_digit=25
        expected_year = 2026 - (year_digit - 21) - 3  # rough check
        return self

# Instructor retries automatically when validators fail!
client = instructor.from_anthropic(anthropic.Anthropic())

student = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=512,
    messages=[{
        "role": "user",
        "content": "Extract student info: Arjun Sharma, roll CS21B1047, CGPA 8.7, studying in 3rd year, email arjun@ds.study.iitm.ac.in, taking TDS and MLP courses."
    }],
    response_model=StudentInfo,
    max_retries=3,   # retry up to 3 times on validation failure
)
print(student.model_dump())
```

---

## Complex Nested Models

```python
from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import date

class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    MIXED = "mixed"

class Entity(BaseModel):
    name: str
    type: str  # person, organization, location, product
    mentions: int

class ReviewAnalysis(BaseModel):
    overall_sentiment: Sentiment
    score: float = Field(ge=1.0, le=5.0, description="Star rating 1-5")
    summary: str = Field(max_length=200)
    pros: list[str] = Field(min_length=0, max_length=5)
    cons: list[str] = Field(min_length=0, max_length=5)
    entities: list[Entity]
    would_recommend: bool
    response_needed: bool = Field(
        description="True if the review requires a response from the business"
    )

client = instructor.from_anthropic(anthropic.Anthropic())

review_text = """
Ordered from this restaurant last Tuesday. The butter chicken was phenomenal —
probably the best I've had in Chennai. Delivery was fast (under 30 mins).
However, the naan was cold and the packaging leaked a bit.
Overall great experience, would order again. The app is easy to use too.
"""

analysis = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": f"Analyze this restaurant review:\n\n{review_text}"
    }],
    response_model=ReviewAnalysis,
)

print(f"Sentiment: {analysis.overall_sentiment.value}")  # "mixed"
print(f"Score: {analysis.score}")                        # 4.0
print(f"Pros: {analysis.pros}")
print(f"Cons: {analysis.cons}")
print(f"Recommend: {analysis.would_recommend}")          # True
print(f"Response needed: {analysis.response_needed}")   # True (cold naan issue)
```

---

## Streaming Structured Output

For UX that shows partial results as they arrive:

```python
from instructor import Partial
from pydantic import BaseModel

class ResearchReport(BaseModel):
    title: str
    executive_summary: str
    key_findings: list[str]
    recommendations: list[str]
    conclusion: str

client = instructor.from_anthropic(anthropic.Anthropic())

# Stream partial results as they're generated
for partial_report in client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    messages=[{
        "role": "user",
        "content": "Write a research report on the impact of AI on software development jobs in India."
    }],
    response_model=Partial[ResearchReport],
):
    # Print fields as they become available
    if partial_report.title:
        print(f"\rTitle: {partial_report.title}", end="", flush=True)
    if partial_report.key_findings:
        print(f"\nFindings so far: {len(partial_report.key_findings)}", end="", flush=True)

print("\nDone!")
```

---

## Batch Extraction

Process many documents efficiently:

```python
import asyncio
import instructor
import anthropic
from pydantic import BaseModel

class InvoiceData(BaseModel):
    vendor: str
    invoice_number: str
    amount: float
    currency: str = "INR"
    date: str
    line_items: list[dict]

async_client = instructor.from_anthropic(
    anthropic.AsyncAnthropic(),
    mode=instructor.Mode.ANTHROPIC_TOOLS,
)

async def extract_invoice(text: str) -> InvoiceData:
    return await async_client.messages.create(
        model="claude-haiku-4-5-20251001",  # fast + cheap for batch work
        max_tokens=512,
        messages=[{"role": "user", "content": f"Extract invoice data:\n{text}"}],
        response_model=InvoiceData,
    )

async def process_batch(invoice_texts: list[str]) -> list[InvoiceData]:
    # Process up to 5 concurrently
    semaphore = asyncio.Semaphore(5)

    async def limited_extract(text: str) -> InvoiceData:
        async with semaphore:
            return await extract_invoice(text)

    return await asyncio.gather(*[limited_extract(t) for t in invoice_texts])

# Run
invoices = asyncio.run(process_batch(invoice_texts))
total = sum(inv.amount for inv in invoices)
print(f"Processed {len(invoices)} invoices. Total: ₹{total:,.2f}")
```

---

## JSON Mode vs Function Calling vs Instructor

| Method | How it works | Reliability | Use When |
|--------|-------------|-------------|---------|
| Prompt + parse | Ask for JSON in prompt | Low | Quick experiments |
| `response_format={"type": "json_object"}` | OpenAI JSON mode | Medium | OpenAI only, simple schemas |
| Function/tool calling | LLM fills a function schema | High | Native multi-provider |
| **Instructor** | Wraps tool calling + validates + retries | **Highest** | **Production use** |

---

## Real-World Example: Resume Parser

```python
from pydantic import BaseModel, Field
from typing import Optional
import instructor, anthropic

class Experience(BaseModel):
    company: str
    role: str
    start_date: str   # "Jan 2022"
    end_date: str     # "Present" or "Jun 2024"
    highlights: list[str] = Field(max_length=5)

class Resume(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    skills: list[str]
    experience: list[Experience]
    education: list[dict]
    total_years_experience: float = Field(
        description="Total years of professional experience, computed from all roles"
    )

client = instructor.from_anthropic(anthropic.Anthropic())

def parse_resume(resume_text: str) -> Resume:
    return client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system="You are a precise resume parser. Extract all information accurately.",
        messages=[{
            "role": "user",
            "content": f"Parse this resume:\n\n{resume_text}"
        }],
        response_model=Resume,
        max_retries=2,
    )
```

---

## Video Reference

[![Structured Outputs with Instructor](https://img.youtube.com/vi/yj-wSRJwrrc/0.jpg)](https://youtu.be/yj-wSRJwrrc "Structured Outputs with Instructor")

---

## Summary

```python
# The five-line Instructor pattern:
import instructor, anthropic
from pydantic import BaseModel

client = instructor.from_anthropic(anthropic.Anthropic())  # patch client

class MyModel(BaseModel):                                   # define schema
    field: str

result = client.messages.create(                           # call with model
    model="claude-sonnet-4-6",
    max_tokens=256,
    messages=[{"role": "user", "content": "..."}],
    response_model=MyModel,                                # get typed output
)
# result is a MyModel instance — fully typed, validated, no parsing needed
```

---

