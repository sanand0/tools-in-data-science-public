## Python tools: uv

[Install uv](https://docs.astral.sh/uv/getting-started/installation/).

[`uv`](https://docs.astral.sh/uv/) is a fast Python package and project manager that's becoming the standard for running Python scripts. It replaces tools like pip, conda, pipx, poetry, pyenv, twine, and virtualenv into one, enabling:

- **Python Version Management**: uv installs and manages _multiple_ Python versions, allowing developers to specify and switch between versions seamlessly.
- **Virtual Environment Handling**: It automates the creation and management of virtual environments, ensuring isolated and consistent development spaces for different projects.
- **Dependency Management**: With support for the pyproject.toml format, uv enables precise specification of project dependencies. It maintains a universal lockfile, uv.lock, to ensure reproducible installations across different systems.
- **Project Execution**: The `uv run` command allows for the execution of scripts and applications within the managed environment, streamlining development workflows.

Here are some commonly used commands:

```bash
# Replace python with uv. This automatically installs Python and dependencies.
uv run script.py

# Run a Python script directly from the Internet
uv run https://example.com/script.py

# Run a Python script without installing
uvx ruff

# Use a specific Python version
uv run --python 3.11 script.py

# Add dependencies to your script
uv add httpx --script script.py

# Create a virtual environment at .venv
uv venv

# Install packages to your virtual environment
uv pip install httpx
```

Here are some useful tools you can run with `uvx` without installation:

```bash
uvx --from jupyterlab jupyter-lab   # Jupyter notebook
uvx marimo      # Interactive notebook
uvx llm         # Chat with LLMs from the command line
uvx openwebui   # Chat with LLMs via the browser
uvx httpie      # Make HTTP requests
uvx datasette   # Browse SQLite databases
uvx markitdown  # Convert PDF to Markdown
uvx yt-dlp      # Download YouTube videos
uvx asciinema   # Record your terminal and play it
```

uv uses [inline script metadata](https://packaging.python.org/en/latest/specifications/inline-script-metadata/#inline-script-metadata) for dependencies.
The eliminates the need for `requirements.txt` or virtual environments. For example:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "httpx",
#   "pandas",
# ]
# ///
```

[![uv - Python package and project management | Inline Script Metadata (28 min)](https://i.ytimg.com/vi_webp/igWlYl3asKw/sddefault.webp)](https://youtu.be/igWlYl3asKw?t=1240)

<!-- Assessment: Share output of `uv run --with httpie -- https https://httpbin.org/get?email={email}` -->
<!-- Assessment: Share output of `uvx markitdown {email}.pdf` -->
<!-- Assessment: Share output of `uv ruff format script.py` -->
