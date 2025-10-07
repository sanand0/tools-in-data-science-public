
# Pydantic Data Validation

---

## 🧩 **BaseModel**

### 💡 **Need**

`BaseModel` is the **core building block** of Pydantic.
It allows you to define data structures with **type hints** and **automatic validation**.
When you create an instance of a model, Pydantic validates and converts the data.

---

### 🧰 **Example**

```python
from pydantic import BaseModel, Field

class Person(BaseModel):
    name: str | None = "person"          # Default value 'person'
    age: int = Field(..., gt=0)          # Required field, must be > 0
    work: str = Field(None)              # Optional field

my_dict1 = {"name": "hrm", "age": "42", "work": "ai engineer"}
my_dict2 = {"age": "42"}  # Missing 'name' and 'work', defaults will apply

# ✅ Data validation happens here
person = Person(**my_dict2)

def fun(person: Person) -> str:  # ⚠️ No validation occurs here
    print(person)

fun(person)     # Works fine, since 'person' is already validated
fun(my_dict2)   # ⚠️ Works, but no validation! Dangerous
```

---

### ✅ **Output**

```text
name='person' age=42 work=None
{'age': '42'}
```

---

### 🧠 **Explanation**

1. **Validation happens only** when you create a Pydantic model instance:

   ```python
   person = Person(**my_dict2)
   ```

   * Converts `"42"` → `42`
   * Adds missing defaults (`name='person'`, `work=None`)

2. When you pass a plain dictionary like `fun(my_dict2)`,
   **no validation occurs** — it’s treated as a normal Python dict.

3. Always type your function arguments with **Pydantic models** (not plain dicts) to ensure data integrity.

---

### ⚠️ **Point to Note**

```text
fun(my_dict2) is not giving error.
So always pass Pydantic models (validated objects) to your functions.
```

✅ **Correct way:**

```python
fun(Person(**my_dict2))
```

---

## 🧩 **Pydantic Data Validation Tools**

Pydantic provides many built-in **validators and field options** for strict, safe data modeling.

| Type / Feature                  | Example                                                   | Description                                                       |
| ------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| **`EmailStr`**                  | `email: EmailStr`                                         | Validates proper email format                                     |
| **`AnyUrl`**                    | `url: AnyUrl`                                             | Ensures valid HTTP/HTTPS/FTP URL                                  |
| **`Field(..., gt=0, le=10)`**   | `score: int = Field(..., gt=0, le=10)`                    | Sets numeric limits (greater than 0, less than or equal to 10)    |
| **`strict=True`**               | `Field(..., strict=True)`                                 | Disables automatic type coercion (e.g., `"42"` won’t become `42`) |
| **`max_length`, `description`** | `Field('default', max_length=50, description='metadata')` | Adds constraints and documentation metadata                       |

---

### 💬 **Example**

```python
from pydantic import BaseModel, Field, EmailStr, AnyUrl

class User(BaseModel):
    email: EmailStr
    website: AnyUrl
    age: int = Field(..., gt=0, le=100, description="User age between 1-100")
    name: str = Field("Anonymous", max_length=50)

# Note: age is compulosry, name is optinal and name default value is string Anonymous
# Note: Field(..., strict=True) will not do type-coherce

u = User(email="hrm@xyz.com", website="https://hrmiitm.github.io", age="23")
print(u.model_dump())
```

**✅ Output**

```text
{'email': 'hrm@xyz.com', 'website': AnyUrl('https://hrmiitm.github.io/'), 'age': 23, 'name': 'Anonymous'}
```

---

### 🏁 **Key Takeaways**

* ✅ Always use **Pydantic models** (`BaseModel`) for structured, validated data.
* ⚙️ Use `Field()` to define constraints like range, defaults, and metadata.
* 🚫 Avoid passing raw dictionaries to functions expecting validated data.
* 📧 Use built-in validators like `EmailStr`, `AnyUrl` for instant reliability.
* 💪 Combine with **type hints** to make your code self-documenting and robust.

---
