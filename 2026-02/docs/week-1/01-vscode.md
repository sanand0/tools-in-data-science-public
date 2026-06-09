# 01 · VS Code

<askai showopenin="true" preset="true" provider="claude"></askai>


?> **TL;DR**
?> Visual Studio Code is a free, extensible code editor from Microsoft. It has ~75% developer market share in 2026 and runs locally, over SSH, inside Docker, and in the browser. It is your home base for the entire course.

## Why VS Code?

There are fancier editors (JetBrains PyCharm, Neovim), but VS Code wins because:

1. **It's free and open source** — no subscription, no vendor lock-in.  <askai showopenin="false" questions='[{"prompt":"Explain as beginner","label":"Explain as beginner"}, {"prompt":"Explain as expert","label":"Explain as expert"}]'></askai>
2. **Extension ecosystem** — tens of thousands of extensions. Python + Jupyter + Docker + Remote-SSH all work together. <askai showopenin="false" questions='[{"prompt":"Explain as beginner","label":"Explain as beginner"}, {"prompt":"Explain as expert","label":"Explain as expert"}]'></askai>
3. **Runs anywhere** — local, over SSH to a GPU server, inside a Docker container, inside WSL, in a browser via code-server. <askai showopenin="false" questions='[{"prompt":"Explain as beginner","label":"Explain as beginner"}, {"prompt":"Explain as expert","label":"Explain as expert"}]'></askai>
4. **Native AI assistance** — GitHub Copilot, Claude, Gemini all have first-class VS Code integrations. <askai showopenin="false" questions='[{"prompt":"Explain as beginner","label":"Explain as beginner"}, {"prompt":"Explain as expert","label":"Explain as expert"}]'></askai>
5. **You'll see it in every job** — it's the editor of the industry. <askai showopenin="false" questions='[{"prompt":"Explain as beginner","label":"Explain as beginner"}, {"prompt":"Explain as expert","label":"Explain as expert"}]'></askai>

[![VS Code Tutorial for Beginners](https://img.youtube.com/vi/KMxo3T_MTvY/0.jpg)](https://youtu.be/KMxo3T_MTvY "VS Code Tutorial for Beginners")

## Install VS Code

<details>
<summary><b>macOS</b></summary>

```bash
brew install --cask visual-studio-code
```

Or download the `.dmg` from [code.visualstudio.com](https://code.visualstudio.com/).
</details>

<details>
<summary><b>Linux (Ubuntu / Debian)</b></summary>

```bash
sudo snap install --classic code
# Or with apt:
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -D -o root -g root -m 644 packages.microsoft.gpg /etc/apt/keyrings/packages.microsoft.gpg
echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update && sudo apt install code
```
</details>

<details>
<summary><b>Windows</b></summary>

```powershell
winget install -e --id Microsoft.VisualStudioCode
```

Or download the installer from [code.visualstudio.com](https://code.visualstudio.com/).
</details>

After install, add the `code` command to your shell PATH (macOS/Linux already do this when installed via the methods above; on macOS with a `.dmg`, open VS Code and run **Shell Command: Install 'code' command in PATH** from the Command Palette).

## The Command Palette — Your Superpower

Press <kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>. This opens the Command Palette. **Every feature in VS Code is reachable from here.** When in doubt, search.

Common starting points:

| Command | What it does |
|---------|--------------|
| `Python: Select Interpreter` | Pick which Python / `.venv` to use |
| `Remote-SSH: Connect to Host...` | Open a remote server's files inside local VS Code |
| `Dev Containers: Reopen in Container` | Develop inside a Docker container |
| `Jupyter: Create New Notebook` | Start a `.ipynb` file |
| `Git: Clone` | Clone a repo with a GUI prompt |

## Must-Install Extensions for This Course

Install these by pressing <kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd> to open Extensions and searching:

| Extension | Publisher | Why |
|-----------|-----------|-----|
| **Python** | Microsoft | Language support + Pylance + debugger |
| **Jupyter** | Microsoft | `.ipynb` notebooks inside VS Code |
| **Ruff** | Astral Software | Fast Python linter + formatter (replaces Black + Flake8) |
| **Even Better TOML** | tamasfe | `pyproject.toml` syntax highlighting |
| **GitLens** | GitKraken | Annotate every line with `git blame` info |
| **Docker** | Microsoft | Manage containers + Dockerfile linting |
| **Remote - SSH** | Microsoft | Edit files on a remote server as if local |
| **Dev Containers** | Microsoft | Containerized dev environments |
| **GitHub Copilot** | GitHub | AI autocomplete + agent mode (free tier available) |
| **Mermaid Markdown Preview** | bierner | Render Mermaid diagrams in markdown |

?> **Install them all at once**
?> Open the terminal and run:
?> ```bash
?> code --install-extension ms-python.python \
?>      --install-extension ms-toolsai.jupyter \
?>      --install-extension charliermarsh.ruff \
?>      --install-extension tamasfe.even-better-toml \
?>      --install-extension eamodio.gitlens \
?>      --install-extension ms-azuretools.vscode-docker \
?>      --install-extension ms-vscode-remote.remote-ssh \
?>      --install-extension ms-vscode-remote.remote-containers \
?>      --install-extension github.copilot \
?>      --install-extension bierner.markdown-mermaid
?> ```

## Settings Sync

Press <kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> → `Settings Sync: Turn On`. Sign in with GitHub. Now your extensions, keybindings, and settings follow you to any machine.

## Essential Settings for Python

Open `settings.json` (Command Palette → **Preferences: Open User Settings (JSON)**) and paste:

```json title="settings.json"
{
  // Editor
  "editor.formatOnSave": true,
  "editor.rulers": [88, 120],
  "editor.bracketPairColorization.enabled": true,
  "editor.minimap.enabled": false,

  // Python + Ruff
  "python.analysis.typeCheckingMode": "basic",
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.codeActionsOnSave": {
      "source.organizeImports.ruff": "explicit",
      "source.fixAll.ruff": "explicit"
    }
  },

  // Terminal
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.fontSize": 13,

  // Files
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.exclude": {
    "**/__pycache__": true,
    "**/.pytest_cache": true,
    "**/.ruff_cache": true
  }
}
```

## Remote Development — The Killer Feature

You can edit files on a remote machine (GPU server, cloud VM, Raspberry Pi) with VS Code running on your laptop. The editor is local, but the language servers, terminal, extensions, and debugger all run on the remote.

```bash
# Ensure your ~/.ssh/config has:
# Host gpu-box
#   HostName 1.2.3.4
#   User ubuntu
#   IdentityFile ~/.ssh/id_ed25519

# Then in VS Code: Cmd+Shift+P → Remote-SSH: Connect to Host → gpu-box
```

The first connect installs a small `vscode-server` on the remote. Subsequent connects are near-instant.

## Jupyter Inside VS Code

1. Create a file `analysis.ipynb` — VS Code opens it as a notebook.
2. Click **Select Kernel** → choose your Python from `.venv` or your UV-managed env.
3. Run cells with <kbd>Shift</kbd>+<kbd>Enter</kbd>.

You get variable inspection, plot inline, Copilot completions per cell, and you can convert notebook ↔ `.py` with one command.

?> **No more lost kernels**
?> Before VS Code, notebooks meant either Classic Jupyter (separate browser) or JupyterLab. Today most data scientists run notebooks directly in VS Code because they can jump between `.py` files and `.ipynb` in the same window. Classic Jupyter is still great for quick one-off experiments on a remote server via browser.

## AI Assistance — Copilot and Beyond

In April 2026, VS Code's AI features include:

- **Inline suggestions** — ghost-text completions as you type.
- **Inline chat** (<kbd>Cmd/Ctrl</kbd>+<kbd>I</kbd>) — edit-in-place with natural language.
- **Chat view** (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd> / <kbd>Ctrl</kbd>+<kbd>Cmd</kbd>+<kbd>I</kbd>) — conversation with context from your workspace.
- **Agents** — autonomous mode that reads files, edits across multiple files, runs commands, and self-corrects. In 2026, VS Code supports an **Autopilot** preview where agents approve their own actions.

Free tier: monthly inline suggestion and chat quota. Pro: $10/month unlimited.

?> **Custom instructions**
?> Create `.github/copilot-instructions.md` in your repo to give the AI project-wide conventions. Example:
?> ```markdown
?> - This is a Python 3.13 project using FastAPI and SQLModel.
?> - All new code must include type hints and a pytest test.
?> - Use Ruff rules; never use `black` or `isort`.
?> ```

## Keyboard Shortcuts You Must Memorize

On macOS use <kbd>Cmd</kbd>; on Linux/Windows use <kbd>Ctrl</kbd>.

| Shortcut | Action |
|----------|--------|
| <kbd>Cmd</kbd>+<kbd>P</kbd> | Quick open any file by name |
| <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> | Command Palette |
| <kbd>Cmd</kbd>+<kbd>B</kbd> | Toggle sidebar |
| <kbd>Cmd</kbd>+<kbd>`</kbd> | Toggle terminal |
| <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd> | Search across all files |
| <kbd>Cmd</kbd>+<kbd>D</kbd> | Select next occurrence (multi-cursor!) |
| <kbd>Alt</kbd>+<kbd>Click</kbd> | Add another cursor |
| <kbd>F2</kbd> | Rename symbol (safe across files) |
| <kbd>F12</kbd> | Go to definition |
| <kbd>Alt</kbd>+<kbd>F12</kbd> | Peek definition |

## 5-Minute Exercise

1. Install VS Code + the Python extension.
2. Create a folder `hello-tds`, open it in VS Code.
3. Create `hello.py` with `print("Hello, TDS!")`.
4. Open the integrated terminal (<kbd>Cmd/Ctrl</kbd>+<kbd>backtick</kbd>) and run `python hello.py`.
5. Install the Ruff extension. Save the file — confirm it formats.
6. Commit to Git using the Source Control panel (no terminal needed).

If all six steps work, you're ready for [UV](./uv).

## Further Reading

- [VS Code official docs](https://code.visualstudio.com/docs)
- [Python in VS Code guide](https://code.visualstudio.com/docs/python/python-tutorial)
- [GitHub Copilot cheat sheet](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)
- [Remote Development overview](https://code.visualstudio.com/docs/remote/remote-overview)

---

