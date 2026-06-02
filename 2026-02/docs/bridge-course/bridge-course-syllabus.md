# TDS Bridge Bootcamp — Combined Checklist/Syllabus

---

# Day 1 Post-Session Checklist
## Setup Day

- [ ] I can open a Linux terminal and recognize the shell prompt (`user@machine:~$`)
- [ ] I can run `python --version`, `git --version`, and `uv --version` without errors
- [ ] I can open VS Code connected to WSL/Linux using `code .`
- [ ] I know what `~` means and can navigate to my home directory using `cd ~`
- [ ] I can create folders and files using `mkdir` and `touch`, and list them with `ls`
- [ ] I know the difference between `.xyz`, `./xyz`, and `../xyz`
- [ ] I know that in Linux, everything is a file
- [ ] I can navigate to the C and D drives within WSL
- [ ] I understand the difference between `>` (overwrite) and `>>` (append)
- [ ] I have a GitHub account and have created the `tds-bootcamp` repository

---

# Day 2 Post-Session Checklist
## Linux & Shell Essentials

- [ ] I understand what `PATH` is and why commands like `python` work without full paths
- [ ] I can navigate the filesystem without clicking — using `cd`, `ls`, and `pwd` only
- [ ] I can read, search, and inspect files using `cat`, `head`, `tail`, `grep`, and `wc`
- [ ] I can edit a file using `nano` (open, edit, save, exit)
- [ ] I understand pipes (`|`) and redirection (`>`, `>>`, `2>`) and can chain commands
- [ ] I can set an environment variable in `.bashrc` and apply it with `source ~/.bashrc`
- [ ] I know the difference between `export VAR=value` (available to child processes) and just `VAR=value` (shell-local)

---

# Day 3 Post-Session Checklist
## VS Code + Python Projects with uv

- [ ] I can run a Python script using `uv run script.py` without setting up a local virtual environment
- [ ] I know where the temporary virtual environment is created when running the `uv add --script script.py pandas` command followed by `uv run script.py`
- [ ] I can create a new Python project using `uv init` and understand what `pyproject.toml` is used for
- [ ] I can add a dependency (e.g., `requests`) using `uv add` and see it reflected in the lockfile
- [ ] I can create a traditional virtual environment using `uv venv` and know when to use it
- [ ] I understand why installing packages globally with `pip install` is a bad habit
- [ ] I can open a project in VS Code, select the correct Python interpreter, and run code from the integrated terminal
- [ ] I know the difference between a `.py` script and a `.ipynb` notebook, and when to use each

---

# Day 4 Post-Session Checklist
## HTTP, APIs & Chrome DevTools

- [ ] I know the 5 core HTTP methods (GET, POST, PUT, PATCH, DELETE) and what each is used for
- [ ] I can read a status code and know what went wrong — e.g., 401 vs. 403 vs. 404 vs. 500
- [ ] I can open Chrome DevTools Network tab, find a request, and inspect its headers, payload, and response
- [ ] I can copy a browser request as a cURL command and run it in the terminal
- [ ] I can change the `User-Agent` in the browser and see the change in the Network tab
- [ ] I can use `curl` to make a GET request with query parameters and a POST request with a JSON body
- [ ] I have a running FastAPI app with at least two endpoints (`GET /health` and `POST /echo`)
- [ ] I can test my API using the Swagger UI at `/docs` and via `curl` from the terminal

---

# Day 5 Post-Session Checklist
## Git & GitHub Workflow

- [ ] I have set up the basic Git configuration using `git config --global user.name "Your Name"`, `git config --global user.email "your.email@example.com"`, and set the default branch as main using `git config --global init.defaultBranch main`
- [ ] I know GitHub allows only one user account per person, so I have merged my accounts (IITM and personal) into a single unified account
- [ ] I understand the three states of a file in Git: working tree → staging → committed
- [ ] I can run the daily workflow commands `git status`, `git diff`, and `git log` and know what each shows
- [ ] I know how `.gitignore` works and how to use it to ignore files and folders that should not be pushed to the remote repository (e.g., `venv`, `__pycache__`, `.env`)
- [ ] I can make a commit: `git add` → `git commit -m "message"` → `git push`
- [ ] I know what `origin` and `main` are and can explain them in one sentence each
- [ ] I can set up SSH key authentication and push to GitHub without entering a password
- [ ] I can create an annotated tag (`git tag -a v0.1.0`) and push it to GitHub
- [ ] I can write a meaningful commit message (not "fixed stuff" or "final.py")

---

