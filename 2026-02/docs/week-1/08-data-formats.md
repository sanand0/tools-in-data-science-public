# 08 · Data Formats

?> **TL;DR**
?> Different problems need different formats. **JSON** for APIs. **TOML** for Python configs. **YAML** for CI/infra. **Markdown** for prose. **Base64** for binary-in-text. **Unicode/UTF-8** underlies all of them.

## Unicode and UTF-8 — The Foundation

All text on the internet is **Unicode**. Unicode assigns a unique number ("code point") to every character in every human language. For example:

- `A` → `U+0041` (code point 65)
- `अ` → `U+0905` (code point 2309)
- `🙏` → `U+1F64F` (code point 128591)

**UTF-8** is how we encode those code points into bytes. ASCII characters (`A–Z`, `0–9`, punctuation) take 1 byte. Indian/European characters take 2. CJK characters 3. Emoji 4.

```python
>>> "नमस्ते 🙏".encode("utf-8")
b'\xe0\xa4\xa8\xe0\xa4\xae\xe0\xa4\xb8\xe0\xa5\x8d\xe0\xa4\xa4\xe0\xa5\x87 \xf0\x9f\x99\x8f'

>>> len("नमस्ते 🙏")              # 7 code points
7
>>> len("नमस्ते 🙏".encode("utf-8"))  # 21 bytes
21
```

**Rule of thumb: always use UTF-8.** Every modern API, database, and tool expects it by default.

```python
# When reading files:
open("file.txt", encoding="utf-8")   # be explicit on Windows

# In HTTP:
Content-Type: application/json; charset=utf-8
```

[![Unicode, UTF-8, and the Web — Computerphile](https://img.youtube.com/vi/MijmeoH9LT4/0.jpg)](https://youtu.be/MijmeoH9LT4 "Unicode, UTF-8, and the Web — Computerphile")

## JSON — The Universal API Format

JSON (JavaScript Object Notation) is the format every REST API returns. Simple, strict, machine-parseable.

```json
{
  "name": "Alice",
  "age": 30,
  "is_admin": true,
  "roles": ["editor", "reviewer"],
  "address": {
    "city": "Chennai",
    "pin": "600113"
  },
  "deleted_at": null
}
```

### Data types

| JSON type | Python type |
|-----------|-------------|
| `string` | `str` |
| `number` | `int` or `float` |
| `true` / `false` | `bool` |
| `null` | `None` |
| `object` | `dict` |
| `array` | `list` |

Notably missing: dates, binary blobs, comments, trailing commas. Dates are usually stored as ISO 8601 strings (`"2026-05-10T14:30:00Z"`); binary as Base64 strings.

### Working with JSON

```python
import json

# Serialize
data = {"name": "Alice", "scores": [1, 2, 3]}
s = json.dumps(data, indent=2, ensure_ascii=False)
# ensure_ascii=False keeps Unicode characters readable

# Parse
data = json.loads(s)

# Files
json.dump(data, open("out.json", "w"))
data = json.load(open("out.json"))
```

### JSON at the command line

```bash
# Pretty-print
cat data.json | jq .

# Validate
jq empty < data.json      # exits non-zero on bad JSON

# Edit a field
jq '.name = "Bob"' data.json > new.json
```

?> **JSON vs JSON5 vs JSONC**
?> Strict JSON has no comments. **JSONC** (JSON with Comments) and **JSON5** are loose variants used in config files (VS Code `settings.json` is JSONC). For machine-readable data interchange, stick to strict JSON.

## YAML — Human-Readable Config

YAML is JSON with indentation instead of braces. It's used in GitHub Actions, Docker Compose, Kubernetes, Ansible, and countless CI configs.

```yaml
name: Deploy
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      API_KEY: ${{ secrets.API_KEY }}
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: |
          uv sync
          uv run pytest
```

### Key YAML quirks

```yaml
# All three are equivalent strings:
- foo
- "foo"
- 'foo'

# But these are DIFFERENT:
- true          # boolean true
- "true"        # string "true"
- yes           # boolean true (!!!)
- on            # boolean true (!!!)

# Anchors and aliases let you reuse values
defaults: &defaults
  timeout: 30
  retries: 3

prod:
  <<: *defaults
  url: https://prod

staging:
  <<: *defaults
  url: https://staging
```

!> **The Norway bug**
!> YAML 1.1 treats `no`, `yes`, `on`, `off` as booleans. A country list `[no, is, se, de, fi]` silently becomes `[False, "is", "se", "de", "fi"]`. Use YAML 1.2 libraries (`ruamel.yaml`) and quote strings that look like booleans.

### Python YAML

```python
# Library: PyYAML (install: `uv add pyyaml`)
import yaml

data = yaml.safe_load(open("config.yml"))   # ← always safe_load, not load
yaml.safe_dump(data, open("out.yml", "w"), sort_keys=False)
```

## TOML — Config for Python Projects

TOML (Tom's Obvious, Minimal Language) is the official format for `pyproject.toml`. Stricter than YAML, kinder to humans than JSON.

```toml title="pyproject.toml"
[project]
name = "my-package"
version = "0.1.0"
description = "A sample package."
readme = "README.md"
requires-python = ">=3.11"
license = "MIT"
dependencies = [
    "requests>=2.31",
    "pydantic>=2",
]

[project.optional-dependencies]
dev = ["pytest", "ruff"]

[project.scripts]
my-cli = "my_package.cli:main"

[tool.ruff]
line-length = 100
```

### TOML data types

```toml
# Strings
name = "Alice"
multiline = """
First line.
Second line.
"""

# Numbers
age = 30
pi = 3.14
hex = 0xdeadbeef

# Booleans
debug = true

# Arrays
tags = ["python", "rust", "fast"]

# Tables (= maps / objects / dicts)
[database]
host = "localhost"
port = 5432

# Array of tables
[[users]]
name = "Alice"
[[users]]
name = "Bob"

# Dates
start = 2026-05-10
birthday = 1993-06-15T08:30:00Z
```

### Python TOML

```python
# Python 3.11+ has built-in tomllib (read only):
import tomllib
with open("pyproject.toml", "rb") as f:     # binary mode required!
    data = tomllib.load(f)

# To write, use `tomli-w` (uv add tomli-w):
import tomli_w
tomli_w.dumps(data)
```

## Markdown — Text with Structure

Markdown is a lightweight markup for prose. This entire document is written in Markdown (more precisely, MDX — Markdown + React).

```markdown
# Heading 1
## Heading 2

**Bold** and *italic* and `inline code`.

- bullet list
- item two

1. numbered list
2. item two

[Link text](https://example.com)
![Alt text](./image.png)

> A blockquote.

| Column A | Column B |
|----------|----------|
| cell 1   | cell 2   |

\`\`\`python
# Code block with syntax highlighting
print("hello")
\`\`\`
```

### GitHub Flavored Markdown (GFM) extras

- **Task lists**: `- [ ] todo`, `- [x] done`
- **Strikethrough**: `~~old~~`
- **Autolink**: `https://example.com` becomes a link
- **Tables** (shown above)
- **Mentions**: `@username`, `#issue-number`

## Base64 — Encoding Binary as Text

Base64 turns arbitrary bytes into a text string using `A-Z`, `a-z`, `0-9`, `+`, `/`, `=`. Use it when you need to embed binary inside JSON, HTTP headers, or data URIs.

```python
import base64

encoded = base64.b64encode(b"hello").decode("ascii")
# 'aGVsbG8='

decoded = base64.b64decode(encoded)
# b'hello'
```

Common real-world uses:

- **Data URIs for images**: `data:image/png;base64,iVBORw0K...`
- **Basic Auth headers**: `Authorization: Basic dXNlcjpwYXNz`
- **JWT tokens**: three base64url-encoded parts separated by `.`
- **API payloads with binary**: images/PDFs inside JSON

!> **Not encryption**
!> Base64 is **encoding**, not encryption. Anyone can decode it. Don't put secrets there.

### Command line

```bash
echo -n "hello" | base64              # aGVsbG8=
echo -n "aGVsbG8=" | base64 -d         # hello

# Binary file → base64 text
base64 < photo.png > photo.b64
base64 -d < photo.b64 > copy.png
```

## MessagePack — Compact Binary JSON

MessagePack encodes the same data model as JSON but in binary — smaller and faster. Used internally by Redis, some gRPC alternatives, and high-throughput pipelines.

```python
# uv add msgpack
import msgpack
data = {"name": "Alice", "scores": [1, 2, 3]}

packed = msgpack.packb(data)     # bytes, ~3x smaller than JSON
msgpack.unpackb(packed)           # round-trip
```

Use JSON for APIs; use MessagePack when you're storing or shuttling data between machines you control.

## Format Decision Table

| Situation | Use |
|-----------|-----|
| REST API request/response | JSON |
| Python project config | TOML (pyproject.toml) |
| CI/infra config, Kubernetes | YAML |
| Documentation, README, blog post | Markdown |
| Binary inside HTTP/JSON | Base64 |
| Internal high-performance serialization | MessagePack / Protobuf |
| Text in any human language | UTF-8 (always) |

## 5-Minute Exercise

Convert this data between all four formats:

```json
{
  "project": "tds-2026",
  "semester": 2,
  "instructors": ["Anand", "Priyanshu"],
  "grading": {"ga": 0.4, "projects": 0.4, "roe": 0.2}
}
```

<details>
<summary>YAML</summary>

```yaml
project: tds-2026
semester: 2
instructors:
  - Anand
  - Priyanshu
grading:
  ga: 0.4
  projects: 0.4
  roe: 0.2
```
</details>

<details>
<summary>TOML</summary>

```toml
project = "tds-2026"
semester = 2
instructors = ["Anand", "Priyanshu"]

[grading]
ga = 0.4
projects = 0.4
roe = 0.2
```
</details>

<details>
<summary>Base64 of the JSON string</summary>

```bash
echo -n '{"project":"tds-2026","semester":2,"instructors":["Anand","Priyanshu"],"grading":{"ga":0.4,"projects":0.4,"roe":0.2}}' | base64
```
</details>

## Further Reading

- [The Absolute Minimum About Unicode — Joel Spolsky](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)
- [JSON spec](https://www.json.org/)
- [TOML spec](https://toml.io/en/)
- [YAML 1.2 spec](https://yaml.org/spec/1.2.2/)
- [CommonMark (strict Markdown)](https://commonmark.org/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

---

