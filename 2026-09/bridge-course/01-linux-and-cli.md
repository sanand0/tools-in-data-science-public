# Module 1: Linux setup & CLI

A terminal is a window for giving your computer written instructions. You will create a safe practice space, install a few tools, and automate a tiny task.

> **Outcome:** navigate your own folders, install the essentials, and run a Bash script.

## Quick game: OverTheWire Bandit

After installing `ssh`, complete these three tiny command-line levels. Get the initial password from [Bandit Level 0](https://overthewire.org/wargames/bandit/bandit0.html); password input is invisible.

1. **Log in as `bandit0`:** `ssh -p 2220 bandit0@bandit.labs.overthewire.org`
2. **Level 0 → 1:** run `cat readme`, copy its output, then `exit` and log in as `bandit1` with that output as the password.
3. **Level 1 → 2:** run `cat ./-`, copy its output, then `exit` and log in as `bandit2`.
4. **Level 2 → 3:** run `cat "./--spaces in this filename--"`, copy its output, then `exit` and log in as `bandit3`.

`./` makes a filename explicit, including one beginning with `-`. Quotes preserve the spaces. Keep passwords in private notes; use this game only on the intended OverTheWire host. [All Bandit levels](https://overthewire.org/wargames/bandit/)

## Learning path

Open a section to begin. Work in order, try the commands, and reveal answers only after choosing your own.

<details name="module-1">
<summary><strong>1.1 · Open your terminal</strong></summary>

## Learn

- **Terminal:** the window where you enter commands.
- **Shell:** the program interpreting those commands.
- **Ubuntu:** normally uses Bash.
- **macOS:** normally uses zsh. Navigation commands here work in both shells; we run our script explicitly with Bash.

### Windows: install Ubuntu through WSL

WSL runs a Linux environment alongside Windows. In **PowerShell as Administrator**, run:

```powershell
wsl --install -d Ubuntu
```

1. Restart if prompted.
2. Open **Ubuntu** from Start.
3. Create a Linux username and password. The password does not appear as you type; this is normal.
4. Back in PowerShell, run `wsl --list --verbose`. Ubuntu should show version `2`.

**Already installed?** Open the existing Ubuntu installation instead of reinstalling. See [Microsoft’s setup and troubleshooting guide](https://learn.microsoft.com/en-us/windows/wsl/install).

Use the Ubuntu profile in Windows Terminal for all remaining lessons. Ctrl+Shift+V pastes there. Keep practice files in your Linux home folder, rather than starting in `/mnt/c/Windows`.

### macOS: use the terminal you already have

Press **Cmd+Space**, type **Terminal**, and press Enter. Paste with Cmd+V. You do not need WSL or an Ubuntu installation. macOS is not Linux, but it supports the shell basics used here.

### Ubuntu: use the terminal you already have

Press **Ctrl+Alt+T** on the standard Ubuntu desktop. Paste with Ctrl+Shift+V. No extra operating-system setup is needed.

### Try on your machine

```bash
whoami
pwd
uname -s
```

## Check

- [ ] `whoami` shows my username; `pwd` shows my current folder.
- [ ] `uname -s` shows `Linux` on Ubuntu/WSL or `Darwin` on macOS.

| Shortcut | What it does |
| --- | --- |
| Up | Recall a previous command |
| Tab | Complete a partly typed name |
| Ctrl+L | Clear the view without deleting files |

**If WSL fails:** follow Microsoft’s guide for your exact error and ask for help if virtualisation or administrator access is blocked. Continue with the path-reading section while setup is resolved.

</details>

<details name="module-1">
<summary><strong>1.2 · Read a path</strong></summary>

## Learn

A directory is a folder. A path is an address. Unix-style filesystems start at `/`, called the root directory. This is different from the administrator account named `root`.

| Address | What it means |
| --- | --- |
| `/` | Top of the filesystem |
| `/home/asha` | A typical Ubuntu user’s home |
| `/Users/asha` | A typical macOS user’s home |
| `~` | Your own home directory, on either system |
| `/etc` | System configuration; look, do not edit for this course |
| `/usr/bin` | Many installed commands |
| `/tmp` | Temporary files; not a reliable home for important work |
| `/mnt/c` | Windows C: drive as seen from WSL |

### Absolute or relative?

- **Absolute path:** starts at `/`, such as `/home/asha/bridge-lab/notes`.
- **Relative path:** starts from your current directory, such as `notes`.
- **`.`:** the current directory.
- **`..`:** the parent directory.
- **`~`:** expanded by the shell to your home path.

Imagine you are at `/home/asha/bridge-lab`:

| You type | Destination |
| --- | --- |
| `cd notes` | `/home/asha/bridge-lab/notes` |
| `cd ..` | `/home/asha` |
| `cd ~/bridge-lab` | Your home’s `bridge-lab` directory |

`cd` changes directory; it does not create one. Quote names containing spaces: `cd "class notes"`. Linux names are case-sensitive: `Notes` and `notes` differ. Common macOS filesystems may ignore case, so use the exact spelling everywhere.

### Pause and explain

**Why can `cd notes` mean a different destination for two people?**

<details>
<summary>Check your explanation</summary>

`notes` is a relative path, so the shell starts from each person's current directory. An absolute path, such as `/home/asha/bridge-lab/notes`, has the same destination regardless of where the command begins.

</details>

## Predict

From `/home/asha/bridge-lab/notes`, where does `cd ../scripts` go?

<details>
<summary>Check your prediction</summary>

`/home/asha/bridge-lab/scripts`. First move up to `bridge-lab`, then down into `scripts`. The destination must already exist.

</details>

</details>

<details name="module-1">
<summary><strong>1.3 · Build your workspace</strong></summary>

## Practice

Run these one line at a time. If `bridge-lab` already contains your own work, choose a fresh name and use it consistently throughout the course.

```bash
cd ~
mkdir -p bridge-lab/notes bridge-lab/scripts
cd ~/bridge-lab
pwd
ls
touch notes/navigation.txt
printf 'I can navigate my workspace.\n' > notes/navigation.txt
cat notes/navigation.txt
cp notes/navigation.txt notes/practice-copy.txt
mv notes/practice-copy.txt notes/renamed-copy.txt
ls -la notes
```

| Command | Meaning |
| --- | --- |
| `mkdir -p` | Create directories and missing parents |
| `ls` / `ls -la` | List names / show details and hidden names |
| `touch` | Create an empty file if absent; otherwise update its timestamp |
| `printf` | Print formatted text; `\n` ends a line |
| `>` / `>>` | Write a file, replacing contents / append to it |
| `cat` | Display a file’s contents |
| `cp` / `mv` | Copy / move or rename |

## Check

- [ ] `ls notes` lists two files containing the same sentence.
- [ ] After `cd notes` and `cd ..`, `pwd` ends in `bridge-lab`.

### Remove only the disposable copy

1. Run `rm -i notes/renamed-copy.txt`.
2. Check the filename in the confirmation prompt.
3. Enter `y` only for this disposable copy.
4. Run `ls notes` and confirm the original `navigation.txt` remains.

> **Careful:** `rm` removes files; `-i` asks for confirmation. Terminal deletion usually bypasses the desktop trash.

## Try it yourself

Create `notes/shell.txt`, append one sentence using `>>`, and read it. Keep these files for your Git exercise.

</details>

<details name="module-1">
<summary><strong>1.4 · Navigation checkpoint</strong></summary>

## Self-check

Try before revealing the explanations.

### 1. You are in ~/bridge-lab/notes. How do you reach ~/bridge-lab/scripts?

- **A.** `cd /scripts`
- **B.** `cd ../scripts`
- **C.** `mkdir scripts`

<details>
<summary>Answer and why</summary>

B. `..` moves to the parent. `/scripts` starts at the filesystem root; `mkdir` creates a folder rather than moving you.

</details>


### 2. Which operator adds a line without replacing existing notes?

- **A.** `>>`
- **B.** `>`
- **C.** `cd`

<details>
<summary>Answer and why</summary>

A. `>>` appends. `>` replaces the target file’s contents, so check the filename before using it.

</details>


## Before you continue

- [ ] I can open my terminal and identify my home directory.
- [ ] I can find navigation.txt starting from another directory.
- [ ] I created, copied, renamed, and removed only my practice copy.


**Pause point:** take a break before permissions if you need one. If the path question was hard, draw three nested folders and trace `..` with your finger before continuing.

</details>

<details name="module-1">
<summary><strong>1.5 · Understand permissions</strong></summary>

## Learn + try

Inspect a file with:

```bash
cd ~/bridge-lab
ls -l notes/navigation.txt
```

A typical first field is `-rw-r--r--`. Read it as `- | rw- | r-- | r--`: file type, owner permissions, group permissions, everyone else’s permissions. Actual values can differ on your machine.

| Symbol | For a regular file | For a directory |
| --- | --- | --- |
| `r` | Read contents | List names |
| `w` | Change contents | Add/remove entries, usually together with `x` |
| `x` | Execute as a program | Traverse/access entries |
| `-` | That permission is absent | That permission is absent |

The first character is `d` for a directory and `-` for a regular file. `ls -ld notes` shows the directory itself.

`chmod u+x scripts/hello.sh` will add execute permission (`+x`) for the owner (`u`) once we create that script. It does not change what is inside the file. You do not need to make every file executable or use `chmod 777`.

## Predict

Can the owner edit a file whose permissions are `-r--r--r--`?

<details>
<summary>Check your prediction</summary>

Not through the normal file write permission: the owner has `r--`, without `w`. Directory permissions and administrator privileges are separate issues.

</details>

### Pause and explain

**Why must you type `./hello.sh` instead of just `hello.sh` for a script in the current directory?**

<details>
<summary>Check your explanation</summary>

A shell searches the configured program directories in `PATH` for a bare command such as `ls`. `./hello.sh` explicitly names a file in the current directory. Keeping the current directory out of `PATH` also helps prevent an unexpected local file from running merely because it has the same name as a command.

</details>

</details>

<details name="module-1">
<summary><strong>1.6 · Install your tools</strong></summary>

## Practice

Install in your chosen terminal. A package manager downloads software and its supporting libraries. `sudo` requests administrator privileges; a password prompt may not echo characters.

### Ubuntu / WSL Ubuntu

```bash
sudo apt update
sudo apt install curl git nano openssh-client python3 python3-venv podman
```

- **`apt update`:** refresh the package catalogue; it does not upgrade all installed software.
- **`apt install`:** install the named packages and ask you to confirm.

| Package | Purpose |
| --- | --- |
| `curl` | Send web requests |
| `git` | Record versions |
| `nano` | Edit text |
| `openssh-client` | Connect to Bandit and GitHub using SSH |
| `python3` | Run Python |
| `python3-venv` | Enable Python’s built-in environment creation |
| `podman` | Run containers (packaged applications); here you only install and verify it |

See [Podman’s Ubuntu instructions](https://podman.io/docs/installation) for the supported package route.

### macOS

No Linux installation is needed.

1. Check the tools: `curl --version`, `git --version`, `nano --version`, `ssh -V`, and `python3 --version`.
2. **Git missing?** Accept Apple’s command-line tools installer if prompted, or run `xcode-select --install`.
3. **Python missing?** Use the [official macOS installer](https://www.python.org/downloads/macos/) and reopen Terminal. It includes `venv`; do not run `apt` on macOS.
4. **nano missing?** Use your existing plain-text editor to create the named files.

Podman is optional on this route: use the [official macOS installer](https://podman.io/docs/installation) if you want it. Running Linux containers on macOS additionally needs a Podman machine; that is beyond this bridge’s completion requirements.

### Install uv: Ubuntu and macOS

```bash
curl -LsSf https://astral.sh/uv/install.sh -o /tmp/tds-uv-install.sh
less /tmp/tds-uv-install.sh
sh /tmp/tds-uv-install.sh
```

### Understand the installer commands

1. **Download** the official installer using `curl`.
2. **Inspect** it using `less`; press `q` to leave the viewer.
3. **Run** it using `sh` after reviewing it.

| curl option | Meaning |
| --- | --- |
| `-L` | Follow redirects |
| `-s` | Hide the progress meter |
| `-S` | Show errors |
| `-f` | Fail on HTTP errors |
| `-o` | Select an output file |

Use [Astral’s installer source](https://docs.astral.sh/uv/getting-started/installation/), not a script from an unknown message.

Reopen the terminal, then check `uv --version`. On Ubuntu also check `podman --version`. If uv is not found, follow the installer’s PATH instruction; `$HOME/.local/bin/uv --version` can help confirm that the binary exists.

</details>

<details name="module-1">
<summary><strong>1.7 · Run a Bash script</strong></summary>

## Practice

A script saves a sequence of commands so you can run them again. Create a file:

```bash
cd ~/bridge-lab
nano scripts/hello.sh
```

Paste **only** this content into the editor:

```bash
#!/usr/bin/env bash
learner="Explorer"
printf 'Hello, %s!\n' "$learner"
printf 'Your current directory is:\n'
pwd
```

1. Save with **Ctrl+O**, then **Enter**.
2. Exit with **Ctrl+X**.

### Read your script

| Part | Meaning |
| --- | --- |
| `#!/usr/bin/env bash` | Select Bash when running the script directly |
| `learner="Explorer"` | Store text; no spaces around `=` |
| `"$learner"` | Read the variable’s value |
| `%s` | Insert text into the greeting |
| `pwd` | Print the current working directory |

Now run both ways:

```bash
bash scripts/hello.sh
chmod u+x scripts/hello.sh
./scripts/hello.sh
```

`bash file` asks Bash to read the file. `./file` executes it directly using the first line and needs execute permission. Both should print `Hello, Explorer!` and a path ending in `/bridge-lab`.

### Pause and explain

**Why can `bash scripts/hello.sh` work before `chmod u+x scripts/hello.sh`, while `./scripts/hello.sh` cannot?**

<details>
<summary>Check your explanation</summary>

In the first command, you run the already-executable Bash program and give it the script as input. In the second, the operating system is asked to execute the script file itself, so that file needs its execute permission and a usable first line identifying Bash.

</details>

### Change something

1. Replace `Explorer` with your name and run the script again.
2. Move into the `notes` directory.
3. Run `../scripts/hello.sh`.
4. Compare the printed path with the earlier output.

**Notice:** `pwd` reports the caller’s working directory, not automatically the script’s folder.

<details>
<summary>Stuck? Check these three things</summary>

- **No such file:** run `pwd` and `ls scripts` from your project root.
- **Permission denied:** inspect `ls -l scripts/hello.sh` and add only owner execute permission.
- **Bad interpreter with ^M:** save the script with Unix/LF line endings in your editor, or recreate it using nano inside Ubuntu.

</details>

</details>

## Check your understanding

Close and reopen your terminal, find the project, and run your script without copying the navigation commands above.

### 3. What does chmod u+x scripts/hello.sh do?

- **A.** Runs the script as administrator
- **B.** Gives everybody every permission
- **C.** Adds execute permission for the file owner

**Answer and why:** C. `chmod` changes permissions. It neither runs the script nor makes it an administrator program.

### 4. What does sudo apt update do on Ubuntu?

- **A.** Runs on macOS and Ubuntu identically
- **B.** Refreshes the available-package catalogue
- **C.** Uploads your project to GitHub

**Answer and why:** B. Refreshing package information and installing packages are different actions. macOS does not use Ubuntu’s apt package manager.

## Before you continue

- [ ] curl, git, python3, and uv report versions in my learning terminal.
- [ ] On Ubuntu, podman reports a version; on macOS I understand the optional route.
- [ ] My script prints my name, and I can explain chmod u+x.

Write one useful command and one solved error in `notes/shell.txt`. If setup is incomplete, finish it before the Python practice.

## Explore yourself

Return to the **OverTheWire Bandit** quick game above after setup. Complete the three file-reading levels and write down the command each one taught you.


---

**Next:** [Module 2: Python & uv →](../02-python-and-uv/)
