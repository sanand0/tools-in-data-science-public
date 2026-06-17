# Lab 1.1 — Publish a Python Library to PyPI using UV

?> **What you'll build**
?> A real Python package, installable by the world via `pip install your-package-name`, published to PyPI from GitHub Actions using **Trusted Publishing** (no API tokens, no secrets in your repo). We'll use **UV** for every step.

**Time:** 60–90 minutes.
**Difficulty:** ⭐⭐☆☆☆.
**Ship:** your name on [pypi.org](https://pypi.org).

## What the Finished Thing Looks Like

By the end:

```bash
pip install tds-hello-<yourname>
python -c "from tds_hello import greet; print(greet('World'))"
# Hello, World! — from tds-hello v0.1.0
```

And every `git tag v*` push auto-publishes a new version.

## Prerequisites

- UV installed ([see uv.mdx](../../week-1/uv))
- GitHub account + `gh` CLI authenticated
- [PyPI account](https://pypi.org/account/register/) with **2FA enabled** (required)
- [TestPyPI account](https://test.pypi.org/account/register/) (separate) with 2FA
- Python 3.11+ via `uv python install 3.13`

---

## The Steps

Each step below is collapsed by default. Click to expand, run the commands, then move to the next step.

<details>
<summary><b>Step 1 — Pick a unique package name</b></summary>

Your package name must be **globally unique on PyPI** and on TestPyPI. Use a prefix like `tds-hello-<yourname>` to guarantee uniqueness.

Check availability:

```bash
# If this returns 404, the name is free.
curl -s -o /dev/null -w "%{http_code}\n" https://pypi.org/project/tds-hello-yourname/
```

Pick a name that:

- Lowercase letters, numbers, hyphens only
- Starts with a letter
- Isn't confusingly similar to a famous project

For the rest of this lab, I'll use `tds-hello-YOURNAME`. **Substitute your actual name every time you see it.**

</details>

<details>
<summary><b>Step 2 — Scaffold the project with UV</b></summary>

```bash
# Pick a Python version and scaffold a library (src layout)
uv init --lib --python 3.13 tds-hello-YOURNAME
cd tds-hello-YOURNAME
```

Inspect what UV created:

```bash
tree -a -I '.git|.venv'
```

You should see:

```
tds-hello-YOURNAME/
├── .git/
├── .gitignore
├── .python-version
├── README.md
├── pyproject.toml
└── src/
    └── tds_hello_YOURNAME/
        ├── __init__.py
        └── py.typed
```

?> **src-layout matters**
?> `--lib` gives you a `src/` layout. This is best practice because it forces tests to run against the *installed* version, not the source directory. You'll avoid a whole class of import bugs.

</details>

<details>
<summary><b>Step 3 — Write the library code</b></summary>

Open `src/tds_hello_YOURNAME/__init__.py` and replace the contents:

```python title="src/tds_hello_YOURNAME/__init__.py"
"""tds-hello — a tiny greeter from the TDS 2026 course."""

from importlib.metadata import version as _v

__version__ = _v("tds-hello-YOURNAME")

def greet(name: str = "world") -> str:
    """Return a friendly greeting with the package version."""
    if not isinstance(name, str):
        raise TypeError("name must be a str")
    return f"Hello, {name}! — from tds-hello v{__version__}"
```

Quick sanity-check:

```bash
uv run python -c "from tds_hello_YOURNAME import greet; print(greet('TDS'))"
# Hello, TDS! — from tds-hello v0.1.0
```

</details>

<details>
<summary><b>Step 4 — Add a test</b></summary>

```bash
uv add --dev pytest
```

Create `tests/test_greet.py`:

```python title="tests/test_greet.py"
import pytest
from tds_hello_YOURNAME import greet

def test_default():
    assert greet() == "Hello, world! — from tds-hello v0.1.0"

def test_custom_name():
    assert "Alice" in greet("Alice")

def test_invalid_type():
    with pytest.raises(TypeError):
        greet(42)  # type: ignore[arg-type]
```

Run:

```bash
uv run pytest -v
```

All three tests should pass.

</details>

<details>
<summary><b>Step 5 — Polish the <code>pyproject.toml</code></b></summary>

Open `pyproject.toml` and fill in the metadata:

```toml title="pyproject.toml"
[project]
name = "tds-hello-YOURNAME"
version = "0.1.0"
description = "A tiny greeter library from TDS 2026 at IIT Madras."
readme = "README.md"
license = "MIT"
requires-python = ">=3.11"
authors = [
    { name = "Your Name", email = "you@example.com" }
]
keywords = ["tds", "iit-madras", "greeter"]
classifiers = [
    "Development Status :: 3 - Alpha",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3 :: Only",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Programming Language :: Python :: 3.13",
    "Topic :: Education",
]
dependencies = []

[project.urls]
Homepage = "https://github.com/YOUR-USERNAME/tds-hello-YOURNAME"
Issues   = "https://github.com/YOUR-USERNAME/tds-hello-YOURNAME/issues"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[dependency-groups]
dev = ["pytest>=8"]
```

?> **Why `hatchling`?**
?> UV uses `hatchling` as the default build backend — it's PyPA-maintained, fast, and configuration-free for most projects. Leave this section alone unless you know what you're doing.

Write a proper README:

```markdown title="README.md"
# tds-hello-YOURNAME

A tiny Python greeter, published as part of **Tools in Data Science** at IIT Madras (May 2026).

## Install

```bash
pip install tds-hello-YOURNAME
```

## Usage

```python
from tds_hello_YOURNAME import greet
print(greet("TDS"))   # Hello, TDS! — from tds-hello v0.1.0
```

## License

MIT
```

Add a LICENSE file:

```bash
curl -s https://api.github.com/licenses/mit | uv run python -c "import json, sys; print(json.load(sys.stdin)['body'].replace('[year]', '2026').replace('[fullname]', 'Your Name'))" > LICENSE
```

</details>

<details>
<summary><b>Step 6 — Build locally and inspect the artifact</b></summary>

```bash
uv build
ls -la dist/
```

You should see two files:

- `tds_hello_YOURNAME-0.1.0-py3-none-any.whl` — the wheel (binary installable)
- `tds_hello_YOURNAME-0.1.0.tar.gz` — the source distribution (sdist)

Peek inside the wheel:

```bash
unzip -l dist/*.whl
```

Verify it installs correctly in an isolated env:

```bash
uv run --isolated --no-project --with dist/*.whl python -c "from tds_hello_YOURNAME import greet; print(greet())"
```

If this prints the greeting, your wheel is good.

</details>

<details>
<summary><b>Step 7 — Push to GitHub</b></summary>

```bash
git add .
git commit -m "feat: initial release v0.1.0"

# Create a GitHub repo and push
gh repo create tds-hello-YOURNAME --public --source=. --remote=origin --push
```

Go to the repo in your browser — you should see all your files.

</details>

<details>
<summary><b>Step 8 — Reserve the name on TestPyPI (first-publish-only step)</b></summary>

Before trusted publishing can work, you need to tell PyPI/TestPyPI what GitHub workflow is allowed to publish.

**First, do a one-time manual upload to TestPyPI to claim the name.**

Create a TestPyPI API token:

1. Go to [test.pypi.org/manage/account/](https://test.pypi.org/manage/account/) → **API tokens**.
2. Create a new token, scope: "Entire account" (we'll delete it after first upload).
3. Copy the `pypi-Ag...` token.

Upload to TestPyPI:

```bash
# Configure UV to know about TestPyPI
export UV_PUBLISH_URL=https://test.pypi.org/legacy/
export UV_PUBLISH_TOKEN=pypi-Ag...   # paste the token
uv publish dist/*
```

Visit `https://test.pypi.org/project/tds-hello-YOURNAME/` — you should see your package.

?> **Did it fail?**
?> Common errors:
?> - `403 Forbidden` — name is already taken; change it.
?> - `400 Bad metadata` — fix `pyproject.toml` and rerun `uv build`.
?> - `The user YOURNAME isn't allowed to upload to project ...` — token scope wrong.

Now **delete** that token from TestPyPI (we'll use Trusted Publishing from now on).

</details>

<details>
<summary><b>Step 9 — Configure Trusted Publishing on TestPyPI</b></summary>

1. Go to your TestPyPI project → `Manage` → `Publishing`.
2. Under **Add a new trusted publisher → GitHub**, enter:
   - **PyPI Project Name**: `tds-hello-YOURNAME`
   - **Owner**: your GitHub username
   - **Repository name**: `tds-hello-YOURNAME`
   - **Workflow name**: `release.yml`
   - **Environment name**: `testpypi`
3. Click **Add**.

Now repeat the same on the real [PyPI](https://pypi.org/manage/account/publishing/) — except you use the **pending publisher** flow (since you haven't uploaded to PyPI yet):

1. Go to [pypi.org/manage/account/publishing/](https://pypi.org/manage/account/publishing/) → **Add a new pending publisher**.
2. Fill in the same details, with **Environment name**: `pypi`.
3. Save.

?> **What is Trusted Publishing?**
?> Trusted Publishing (a.k.a. OIDC publishing) lets PyPI verify that a publish request came from a specific GitHub Actions workflow using short-lived OIDC tokens — no long-lived secrets to manage or leak. This is now the recommended way to publish.

</details>

<details>
<summary><b>Step 10 — Create GitHub environments</b></summary>

On GitHub → your repo → **Settings → Environments**:

1. Create environment `testpypi`. Optionally add **Required reviewers** for extra safety.
2. Create environment `pypi`. Definitely add Required reviewers (yourself) — this means every prod release requires a manual click.

</details>

<details>
<summary><b>Step 11 — Write the publish workflow</b></summary>

Create `.github/workflows/release.yml`:

```yaml title=".github/workflows/release.yml"
name: Release

on:
  push:
    tags:
      - 'v*'       # v0.1.0, v1.2.3, ...

jobs:
  build:
    name: Build distribution
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v7
        with:
          enable-cache: true

      - name: Set up Python
        run: uv python install 3.13

      - name: Build
        run: uv build

      - name: Smoke test (wheel)
        run: uv run --isolated --no-project --with dist/*.whl python -c "from tds_hello_YOURNAME import greet; print(greet('ci'))"

      - name: Upload dist/
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  publish-testpypi:
    name: Publish to TestPyPI
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: testpypi
      url: https://test.pypi.org/project/tds-hello-YOURNAME/
    permissions:
      id-token: write
    steps:
      - name: Download dist/
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Install uv
        uses: astral-sh/setup-uv@v7

      - name: Publish
        run: uv publish --index testpypi dist/*
        env:
          UV_PUBLISH_URL: https://test.pypi.org/legacy/

  publish-pypi:
    name: Publish to PyPI
    needs: publish-testpypi
    runs-on: ubuntu-latest
    environment:
      name: pypi
      url: https://pypi.org/project/tds-hello-YOURNAME/
    permissions:
      id-token: write
    steps:
      - name: Download dist/
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Install uv
        uses: astral-sh/setup-uv@v7

      - name: Publish
        run: uv publish dist/*
```

?> **Why two stages?**
?> TestPyPI is your staging environment — catch bad metadata or missing files before they hit the real PyPI (which you cannot re-upload to with the same version number).

</details>

<details>
<summary><b>Step 12 — Also add a CI workflow for tests</b></summary>

`.github/workflows/ci.yml`:

```yaml title=".github/workflows/ci.yml"
name: CI

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.11', '3.12', '3.13']
    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v7
        with:
          enable-cache: true

      - name: Install Python
        run: uv python install ${{ matrix.python-version }}

      - name: Install dependencies
        run: uv sync --all-groups

      - name: Run tests
        run: uv run pytest -v
```

Commit and push:

```bash
git add .github/
git commit -m "ci: add release and test workflows"
git push
```

Go to **Actions** tab on GitHub — the CI workflow should run and pass.

</details>

<details>
<summary><b>Step 13 — Tag and release</b></summary>

```bash
# Make sure everything is committed and pushed
git status
git push

# Create an annotated tag
git tag -a v0.1.0 -m "v0.1.0 — first release"
git push origin v0.1.0
```

Go to **Actions** tab. You'll see the **Release** workflow running. It will:

1. Build + smoke-test
2. Publish to TestPyPI
3. **Pause** waiting for your approval on the `pypi` environment
4. After you click Review → Approve, publish to the real PyPI

Watch the jobs run. When `publish-pypi` goes green, visit `https://pypi.org/project/tds-hello-YOURNAME/`.

**Your package is live on PyPI!**

</details>

<details>
<summary><b>Step 14 — Install your own package from PyPI</b></summary>

```bash
# In a fresh directory:
mkdir /tmp/install-test && cd /tmp/install-test
uvx --from tds-hello-YOURNAME python -c "from tds_hello_YOURNAME import greet; print(greet())"
```

If that prints your greeting — **you have shipped a Python library to the world**.

</details>

<details>
<summary><b>Step 15 — Ship a v0.2.0 to confirm the workflow</b></summary>

1. Edit `src/tds_hello_YOURNAME/__init__.py`, add a `shout()` function:
   ```python
   def shout(name: str = "world") -> str:
       return greet(name).upper()
   ```
2. Update the test.
3. Bump version in `pyproject.toml` from `0.1.0` to `0.2.0`.
4. Commit:
   ```bash
   git add -A
   git commit -m "feat: add shout()"
   git push
   git tag -a v0.2.0 -m "v0.2.0 — add shout()"
   git push origin v0.2.0
   ```
5. Watch the release workflow run again. Approve. Installed users can now `pip install --upgrade tds-hello-YOURNAME`.

</details>

---

## Troubleshooting

<details>
<summary><b>"403 Forbidden" on <code>uv publish</code></b></summary>

- The package name on PyPI is already taken. Choose a different name (you'll need to update `pyproject.toml`, the GitHub environments, and the trusted-publisher config on PyPI).
- Your GitHub environment name doesn't match what you entered on PyPI. Fix the mismatch.
- You forgot `permissions: id-token: write` in the workflow.

</details>

<details>
<summary><b>"Trusted publishing exchange failure"</b></summary>

This is almost always a config mismatch between GitHub and PyPI. Double-check:
- **Owner** matches your GitHub username/org exactly (case-sensitive).
- **Repository name** matches exactly.
- **Workflow filename** is just `release.yml`, not `.github/workflows/release.yml`.
- **Environment name** matches the one in your workflow.

</details>

<details>
<summary><b>"The name X is already in use."</b></summary>

Someone else already claimed this name. Rename your package.

</details>

<details>
<summary><b>Version conflict: "File already exists"</b></summary>

PyPI does not allow re-uploading the same version. Bump the version in `pyproject.toml`, commit, and tag again.

</details>

---

## Knowledge Check

**Q1.** Why do we use a `src/` layout when building a Python library?
- [ ] A) It is required by PyPI for all new packages
- [ ] B) It forces tests to run against the installed version of the package, preventing import bugs
- [ ] C) It makes the package download size smaller
- [ ] D) It is a requirement for using the UV package manager

<details>
<summary>Answer</summary>

**B** — The `src/` layout ensures that your code is not importable directly from the project root. This forces `pytest` to use the installed package (just like your users will), catching issues where files are missing from the build.
</details>

**Q2.** What is the primary benefit of PyPI Trusted Publishing (OIDC) over traditional API tokens?
- [ ] A) It allows publishing directly from your local terminal without a password
- [ ] B) It eliminates the need to manage and store long-lived secrets in GitHub Actions
- [ ] C) It makes the upload speed to PyPI significantly faster
- [ ] D) It bypasses the need to have a PyPI account

<details>
<summary>Answer</summary>

**B** — Trusted Publishing uses short-lived tokens generated on the fly. You don't need to save a PyPI password or token in GitHub Secrets, eliminating the risk of a leaked token.
</details>

**Q3.** Why should you always test your release on TestPyPI before the real PyPI?
- [ ] A) TestPyPI automatically fixes broken Python code
- [ ] B) TestPyPI is required by GitHub Actions before deploying to PyPI
- [ ] C) PyPI does not allow you to re-upload or reuse a version number if you make a mistake
- [ ] D) TestPyPI gives you free compute resources to run your unit tests

<details>
<summary>Answer</summary>

**C** — PyPI's strict immutability means if you upload a broken `v0.1.0`, you can never upload a fixed `v0.1.0`. TestPyPI lets you catch packaging errors before you burn a version number on the real index.
</details>

---

## What You've Learned

- Scaffolding a proper Python library with `src/` layout using UV.
- Writing `pyproject.toml` metadata the PyPA way.
- Building sdist + wheel with `uv build`.
- Publishing with `uv publish` — locally with tokens, then from CI with **Trusted Publishing**.
- A proper two-stage (TestPyPI → PyPI) release workflow with manual approval.
- Matrix CI testing across Python versions.

## Write a Blog Post

Publish a Discourse blog post covering:

- What "Trusted Publishing" is and why it's more secure than API tokens.
- The two-stage release workflow pattern.
- One gotcha you hit and how you solved it.

## Next Lab

[**Lab 1.2 — Web Traffic Debugging with Burp Suite**](./02-burpsuite-traffic-debugging.md)

---

## Video Resources

Watch this video to learn about Python package and project management with uv, including package building and publishing:

[![uv - Python package and project management | Inline Script Metadata](https://i.ytimg.com/vi_webp/igWlYl3asKw/sddefault.webp)](https://youtu.be/igWlYl3asKw?t=1240)

---

## References

- [UV publishing guide](https://docs.astral.sh/uv/guides/publish/)
- [UV in GitHub Actions](https://docs.astral.sh/uv/guides/integration/github/)
- [PyPI Trusted Publishing](https://docs.pypi.org/trusted-publishers/)
- [Sample repo: astral-sh/trusted-publishing-examples](https://github.com/astral-sh/trusted-publishing-examples)

---

