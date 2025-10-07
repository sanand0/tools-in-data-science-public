
# Pydantic

---

### The Core Issue of Python

**Python** is **dynamic-typed** langauge, pydantic brings **static-typing** features. 

- Python has **type-hinting**, but not raise type-errors.

### Install [Pydantic](https://docs.pydantic.dev/latest/install/){target="_blank"}

```bash
pip install pydantic
# or
uv add pydantic
# or
uv pip install pydantic
```

### 🧩 **What is Pydantic**

**Pydantic** is a **Python library for data validation and settings management** using Python type hints.
It ensures that data (e.g., from APIs, user input, databases, etc.) matches expected types and structures and raise error if data type not matched.

**Example:**

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
    email: str

user = User(name="Hritik", age="22", email="test@mail.com")
print(user.age)  # ✅ 22 — Pydantic automatically converts "22" → int
# If not able to convert/get the desired data type, then it will raise error.
```

So Pydantic is like a **smart validator + parser** built on top of type hints.

---

### 💡 **Why Pydantic**

Pydantic is popular because it:

1. ✅ **Validates data automatically** (e.g., converts `"22"` → `22`).
2. 🚀 **Is fast** — implemented in Rust (v2+).
3. 🧠 **Leverages type hints** — no extra syntax.
4. 🧱 **Used in frameworks** like **FastAPI**, **Django Ninja**, **LangChain**, **PydanticAI** etc.
5. ⚙️ **Manages app settings** via environment variables.
6. 🧾 **Generates clear error messages** and **JSON schemas** easily.

---


### ⚡ **Where Pydantic Rocks**

1. 🏗 **APIs** — especially with **FastAPI** (input/output validation done automatically).
2. 🧩 **Data pipelines** — validating messy external data before processing.
3. 🔒 **Configuration management** — loading settings from `.env`, JSON, or system environment.
4. 🤖 **Machine learning / AI projects** — defining structured model inputs/outputs.
5. 🧠 **LLM and agent frameworks** — e.g., LangChain and PydanticAI use it for structured responses.

---

### 💬 **In short**

> **Pydantic = Type hints + automatic validation + conversion + speed + clarity.**
> If validation fails, It will raise an error along with the reason.

---


## Some Terminologies

---

### 🧩 1. **Type Hint (Static Type Hinting)**

🧠 **What it is:**
A *type hint* tells Python (and tools like VSCode, MyPy, Pyright) what type a variable or function parameter *should be*.
But — **Python itself doesn’t enforce it at runtime**.

```python
def add(a: int, b: int) -> int:
    return a + b

add("3", 5)  # ❌ logically wrong, but ✅ Python won't stop you
```

💡 **Purpose:** For static analysis, editor autocompletion, and code clarity — **not validation**.

---

### 🛡️ 2. **Data Validation (Runtime Validation)**

🧠 **What it is:**
Actual checking of data **at runtime** to ensure it’s valid —
for example, verifying if age > 0 or email is valid.

```python
from pydantic import BaseModel, Field, EmailStr

class User(BaseModel):
    name: str
    age: int = Field(..., gt=0)
    email: EmailStr

User(name="Hritik", age=-1, email="abc")  
# ❌ ValidationError: age must be > 0 and email must be valid
```

💡 **Purpose:** Ensures correctness **when the program runs**, not just at design time.

---

### ⚙️ 3. **Type Validation (Runtime Type Checking)**

🧠 **What it is:**
A specific kind of data validation that checks **if the value’s type matches** what’s declared.

```python
class User(BaseModel):
    age: int

User(age="30")  # ✅ works — because of type coercion (see next)
```

Here, `"30"` (string) is automatically converted to `30` (int).

If you disable coercion:

```python
class User(BaseModel):
    age: int = Field(..., strict=True)

User(age="30")  # ❌ ValidationError — expects int, not str
```

💡 **Purpose:** To enforce type correctness, optionally strict.

---

### 🔄 4. **Type Coercion (Type Conversion)**

🧠 **What it is:**
Automatic conversion of compatible types during validation.
Pydantic tries to make your data fit the model if possible.

```python
class Example(BaseModel):
    number: int
    active: bool

Example(number="42", active="true")
# ✅ number -> 42 (int), active -> True (bool)
```

💡 **Purpose:** Makes APIs forgiving — converts strings, numbers, booleans automatically.

---

### ⚖️ Summary Table

| Concept             | Enforced at          | Example                   | Purpose                        |
| ------------------- | -------------------- | ------------------------- | ------------------------------ |
| **Type Hint**       | Design time (static) | `a: int`                  | For readability and IDE checks |
| **Data Validation** | Runtime              | `Field(..., gt=0)`        | Ensures correctness of values  |
| **Type Validation** | Runtime              | `Field(..., strict=True)` | Ensures correct *types*        |
| **Type Coercion**   | Runtime              | `"42"` → `42`             | Converts types automatically   |

---





