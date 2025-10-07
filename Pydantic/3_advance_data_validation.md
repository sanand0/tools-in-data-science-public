
# Pydantic Advance Data Validation

---

## 🧩 1. **Field Validator**

### 💡 **Need**

Used to validate or transform **individual fields** before the model is created.
For example, ensuring an email has `@`, or a username has no spaces.

Use `@field_validator('<field_name>')` to perform checks or preprocessing.

### 🧰 **Example**

```python
from pydantic import BaseModel, field_validator, ValidationError

class User(BaseModel):
    username: str
    email1: str
    email2: str

    @field_validator("email1", "email2", mode='after')  # default mode is 'after'
    @classmethod
    def validate_email(cls, v):
        if "@" not in v:
            raise ValueError("Invalid email format")
        return v.lower()

try:
    user = User(username="Hritik", email1="hr@example.com", email2="hrmail.com")
except ValidationError as e:
    print(e)
```

**✅ Output**

```text
1 validation error for User
email2
  Value error, Invalid email format [type=value_error, input_value='hrmail.com', input_type=str]
    For further information visit https://errors.pydantic.dev/2.12/v/value_error
```

### 🧾 **Explanation**

* `field_validator("email1", "email2")` runs validation on both fields.
* Ensures all emails contain “@”.
* Automatically normalizes (converts) them to lowercase.

---

## 🧩 2. **Model Validator**

### 💡 **Need**

Sometimes validation depends on **multiple fields together** (e.g., start date < end date).
That’s where `@model_validator` helps.

Use `@model_validator(mode="after")` to validate after all fields are parsed.

### 🧰 **Example**

```python
from datetime import date
from pydantic import BaseModel, model_validator, ValidationError

class Event(BaseModel):
    name: str
    start_date: date
    end_date: date

    @model_validator(mode="after")
    def check_dates(self):
        if self.start_date > self.end_date:
            raise ValueError("Start date must be before end date")
        return self

try:
    e = Event(name="Hackathon", start_date="2025-10-10", end_date="2025-10-05")
except ValidationError as err:
    print(err)
```

**✅ Output**

```text
1 validation error for Event
  Start date must be before end date (type=value_error)
```

### 🧾 **Explanation**

* Validates **relationships between fields**.
* `mode="after"` runs **after** parsing all field values.
* Perfect for enforcing logical constraints between attributes.

---

## 🧩 3. **Computed Fields**

### 💡 **Need**

You may want a value that’s **calculated automatically**, not stored directly.
For example, `full_name` from `first_name` + `last_name`.

Use the `@computed_field` decorator.

### 🧰 **Example**

```python
from pydantic import BaseModel, computed_field

class Person(BaseModel):
    first_name: str
    last_name: str

    @computed_field
    def full_name(self) -> str:
        print("run")
        return f"{self.first_name} {self.last_name}"

p = Person(first_name="Hritik", last_name="Maurya")
print(p.full_name)
print(p.full_name)
```

**✅ Output**

```text
run
Hritik Maurya
run
Hritik Maurya
```

### 🧾 **Explanation**

* Computed fields are **derived attributes**.
* They appear in output and serialization but don’t need input.
* Ideal for dynamic, human-readable, or combined values.

---

## 🧩 4. **Nested Models**

### 💡 **Need**

In real-world data, you often have **nested JSON objects** (e.g., user → address → city).
Pydantic can model and validate this structure easily.

Define one model inside another — Pydantic automatically validates the nested structure.

### 🧰 **Example**

```python
from pydantic import BaseModel

class Address(BaseModel):
    city: str
    pincode: int

class User(BaseModel):
    name: str
    address: Address

u = User(name="Hritik", address={"city": "Banaras", "pincode": 221001})
print(u.address.city)
print(u.model_dump())
```

**✅ Output**

```text
Banaras
{'name': 'Hritik', 'address': {'city': 'Banaras', 'pincode': 221001}}
```

### 🧾 **Explanation**

* Pydantic automatically constructs and validates nested objects.
* If a nested field is invalid, you get detailed error paths (e.g., `address.pincode`).

---

## 🧩 5. **Serialization**

### 💡 **Need**

After validation, you may need to convert models into **JSON or dictionaries** for APIs, databases, or files.

Use `.model_dump()` or `.model_dump_json()` to serialize models.

### 🧰 **Example**

```python
from pydantic import BaseModel

class Product(BaseModel):
    id: int
    name: str
    price: float

p = Product(id=1, name="Mixer", price=2499.99)

# Convert to dictionary
print(p.model_dump())

# Convert to JSON string
print(p.model_dump_json(indent=2))
```

**✅ Output**

```text
{'id': 1, 'name': 'Mixer', 'price': 2499.99}

{
  "id": 1,
  "name": "Mixer",
  "price": 2499.99
}
```

### 🧾 **Explanation**

* `.model_dump()` → returns a **Python dictionary** for further processing.
* `.model_dump_json()` → returns a **JSON string** for APIs or files.
* Works seamlessly with nested and computed fields.

---

## 🏁 **Summary Table**

| Concept             | Decorator / Method                     | Purpose                               | Example Use          |
| ------------------- | -------------------------------------- | ------------------------------------- | -------------------- |
| **Field Validator** | `@field_validator` `@classmethod`                     | Validate a single field               | Check email format   |
| **Model Validator** | `@model_validator`                     | Validate relationships between fields | Check start/end date |
| **Computed Fields** | `@computed_field`                      | Derive fields automatically           | Create full_name     |
| **Nested Models**   | —                                      | Structure complex data                | User with Address    |
| **Serialization**   | `.model_dump()` / `.model_dump_json()` | Convert to dict or JSON               | Prepare API output   |

---
