# Module 1: Linux setup & CLI

**You will:**

- Build `~/bridge-lab`, your workspace for all four modules.
- Read, copy and move files.
- Write and run a Bash script.

**New to terminals?** Complete [1.1: Setup](#setup) first, then return to the game.

<style>
.markdown #game {
  margin: 1.5rem 0;
  border-inline-start: 4px solid var(--color-link);
  border-radius: 0.5rem;
  background: var(--gray-100);
}
.markdown #game > summary { color: var(--color-link); line-height: 1.4; }
.markdown #game > summary strong { font-size: 1.125rem; }
.markdown #game > summary span {
  display: block;
  margin-top: 0.35rem;
  color: var(--body-font-color);
  font-size: 0.875rem;
  font-weight: normal;
}
.markdown #game > summary:focus-visible { outline: 2px solid var(--color-link); outline-offset: 3px; }
.markdown #game details > summary::before { transform: rotate(0deg); }
.markdown #game details[open] > summary::before { transform: rotate(90deg); }
</style>

<details class="bridge-game" id="game">
<summary><strong>Game mission: Bandit</strong><span>Read a file. Unlock the next level. | 3 challenges</span></summary>

## Start here

- **Game:** [Bandit](https://overthewire.org/wargames/bandit/) gives you a remote Linux computer.
- **Flow:** each password unlocks the next account.
- **Goal:** reach `bandit3`.

1. Open your Ubuntu/WSL or macOS terminal. Check `ssh -V`.
2. Connect to the official game host:

   ```bash
   ssh -p 2220 bandit0@bandit.labs.overthewire.org
   ```

3. On a first connection, check the hostname before accepting SSH's host-key prompt.
4. Enter the published starter password: `bandit0`. Password input is invisible.
5. Check the prompt: `bandit0` means you are on the **remote** computer.
6. After `exit`, you are back on **your** computer.

### Challenge 1: Read the ordinary file (0 to 1)

1. Run `ls`.
2. Choose a filename that looks useful.
3. Try reading it before opening the walkthrough.

<details>
<summary>Walkthrough: list, read, reconnect</summary>

On **Bandit**, run these separately:

```bash
ls
cat readme
```

1. Copy the printed password into private notes **outside `bridge-lab`**.
2. Exit and reconnect:

```bash
exit
ssh -p 2220 bandit1@bandit.labs.overthewire.org
```

3. Enter the password you found, not `bandit1`.
4. **Check:** your new prompt names `bandit1`.

</details>

### Challenge 2: Read a file called `-` (1 to 2)

1. Run `ls` and find the file named `-`.
2. Predict how to identify that file explicitly.
3. If `cat -` waits for keyboard input, press Ctrl+C.

<details>
<summary>Walkthrough: give cat a path</summary>

1. Run `cat ./-` below and save the password **before** exiting.
2. Run the remaining commands one at a time.

```bash
cat ./-
exit
ssh -p 2220 bandit2@bandit.labs.overthewire.org
```

3. Use the saved password at the next login.
4. **Check:** your prompt names `bandit2`.

- **Why `./-`?** It explicitly identifies the file named `-` in this directory.

</details>

### Challenge 3: Read a name containing spaces (2 to 3)

1. Run `ls`.
2. Copy the filename exactly, including its spaces.

<details>
<summary>Walkthrough: quote the whole path</summary>

1. Run the first command and save the password.
2. Exit and reconnect with the remaining commands.

```bash
cat "./--spaces in this filename--"
exit
ssh -p 2220 bandit3@bandit.labs.overthewire.org
```

3. Enter the newly found password.
4. **Check:** your prompt names `bandit3`.
5. Run `exit` to return home.

- **Quotes:** keep the filename's spaces together.
- **`./`:** handles the leading dash.

</details>

**Stuck?**

- Check the account number, password and port `2220`.
- Filename differs? Use `ls` and the [official level instructions](https://overthewire.org/wargames/bandit/bandit3.html).
- Connection times out? Your network may block that port.

**Keep the skill:**

1. Record what `ls`, `cat`, `./` and quotes did in `notes/shell.txt`.
2. Keep passwords out of that file.
3. Try the next level using `ls -la` before looking up a solution.

</details>

## Your lab

1. Open the sections in order.
2. Predict, then run commands one at a time.
3. Change one thing and compare the result.

<details name="module-1" id="setup">
<summary><strong>1.1 · Open a terminal and install tools</strong></summary>

- **Terminal:** the window where you enter commands.
- **Shell:** the program that interprets them.
- **Ubuntu:** usually uses Bash.
- **macOS:** usually uses zsh; these navigation commands work in both shells.

### Choose your system

**Windows**

1. If Ubuntu/WSL is already installed, open it; skip installation.
2. Otherwise, open PowerShell as Administrator and run `wsl --install -d Ubuntu`.
3. Restart if prompted, then open **Ubuntu** from Start.
4. Create a Linux username and password; password input is invisible.
5. In PowerShell, run `wsl --list --verbose` and check Ubuntu uses version `2`.
6. Use the Ubuntu terminal for the remaining labs. [WSL help](https://learn.microsoft.com/en-us/windows/wsl/install).

**Ubuntu**

- Open Terminal with Ctrl+Alt+T on the standard desktop.

**macOS**

1. Press Cmd+Space and search for **Terminal**.
2. Open it; you do not need WSL.

**Paste shortcuts**

- Ubuntu/Windows Terminal: Ctrl+Shift+V.
- macOS: Cmd+V.

```bash
whoami
pwd
uname -s
```

**Check:**

- `whoami` prints your username.
- `pwd` prints your current directory.
- `uname -s` prints `Linux` (Ubuntu/WSL) or `Darwin` (macOS).

**Useful keys:**

- Up: recall a command.
- Tab: complete a name.
- Ctrl+L: clear the view.

### Install in Ubuntu/WSL

```bash
sudo apt update
sudo apt install curl git nano openssh-client python3 python3-venv podman
```

- **`sudo`:** requests administrator privileges.
- **`apt update`:** refreshes the package catalogue.
- **`apt install`:** installs packages after confirmation.

| Tool | You will use it to |
| --- | --- |
| `curl`, `openssh-client` | Send web requests; connect with SSH |
| `git`, `nano` | Record versions; edit text |
| `python3`, `python3-venv` | Run Python; create isolated environments |
| `podman` | Run containers later; check installation here |

### Install on macOS

Run these version checks:

1. `curl --version`
2. `git --version`
3. `nano --version`
4. `ssh -V`
5. `python3 --version`

- Git missing? Run `xcode-select --install` and complete Apple's installer.
- Python missing? Use the [official installer](https://www.python.org/downloads/macos/); it includes `venv`.
- nano missing? Use a plain-text editor for the named files.
- Podman is optional here; see its [macOS installation guide](https://podman.io/docs/installation). Do not run `apt` on macOS.

### Install uv on either system

Use the [official uv installer](https://docs.astral.sh/uv/getting-started/installation/):

1. Download it with `curl`.
2. Inspect it with `less`; press `q` to exit.
3. Run it with `sh`.

```bash
curl -LsSf https://astral.sh/uv/install.sh -o /tmp/tds-uv-install.sh
less /tmp/tds-uv-install.sh
sh /tmp/tds-uv-install.sh
```

**curl options:**

- `-L`: follow redirects.
- `-sS`: hide progress but show errors.
- `-f`: fail on HTTP errors.
- `-o`: choose the output file.

1. Reopen Terminal.
2. Check `uv --version` works.
3. On Ubuntu, also check `podman --version`.
4. If uv is missing, follow the installer's PATH instruction; try `$HOME/.local/bin/uv --version` to locate it.

</details>

<details name="module-1">
<summary><strong>1.2 · Build and navigate your workspace</strong></summary>

- **Path:** a file's address.
- **Absolute path:** starts with `/`, the filesystem root.
- **Relative path:** starts from your current directory.
- **`~`:** your home directory.
- **`.` / `..`:** the current directory / its parent.

Use a fresh folder name if `bridge-lab` already contains your work, and substitute it throughout these modules.

```bash
cd ~
mkdir -p bridge-lab/notes bridge-lab/scripts
cd ~/bridge-lab
pwd
ls
printf 'I can navigate.\n' > notes/navigation.txt
cat notes/navigation.txt
cp notes/navigation.txt notes/practice-copy.txt
mv notes/practice-copy.txt notes/renamed-copy.txt
ls -la notes
```

| Command | Effect |
| --- | --- |
| `cd`, `pwd` | Change directory; show where you are |
| `mkdir -p` | Create directories, including missing parents |
| `ls -la` | List details, including hidden names |
| `printf`, `cat` | Produce text; display file contents |
| `>` / `>>` | Replace a file's contents / append |
| `cp`, `mv` | Copy; move or rename |
| `touch file` | Create an empty file if absent; otherwise update its timestamp |

1. Check both files contain the same sentence.
2. Run `cd notes`, then `cd ../scripts`.
3. Predict where you are; verify with `pwd`.

- **`cd`:** changes directories; it does not create them.
- **Spaces:** quote names, as in `cd "class notes"`.
- **Case:** match the filename's spelling and case.
- **Home:** typically `/home/NAME` on Ubuntu or `/Users/NAME` on macOS.
- **WSL:** `/mnt/c` exposes the Windows C: drive; keep this lab in `~`.

### Delete only your copy

1. Return with `cd ~/bridge-lab`.
2. Run `rm -i notes/renamed-copy.txt`.
3. Confirm the disposable filename before typing `y`.
4. Check `notes/navigation.txt` remains.

- Terminal deletion usually bypasses the desktop trash.

**Your turn:**

1. Create `notes/shell.txt`.
2. Append a sentence with `>>`, then read the file.
3. Explain why repeating `>` would lose the earlier sentence.

</details>

<details name="module-1">
<summary><strong>1.3 · Give a script permission to run</strong></summary>

```bash
cd ~/bridge-lab
ls -l notes/navigation.txt
ls -ld scripts
nano scripts/hello.sh
```

- **Example:** `-rw-r--r--` splits into `- | rw- | r-- | r--`.
- **Groups:** file type, owner, group, others.
- **Type:** `d` means directory; `-` means regular file.
- **Permissions:** `r/w/x` mean read/write/execute.
- **Directories:** `x` permits traversal; your permission values may differ.

Paste this into nano:

```bash
#!/usr/bin/env bash
learner="Explorer"
printf 'Hello, %s!\n' "$learner"
pwd
```

1. Save with **Ctrl+O**, then **Enter**.
2. Exit with **Ctrl+X**.

- The first line selects Bash for direct execution.
- `learner="Explorer"` stores text; `"$learner"` reads it.
- `%s` inserts that text; `\n` ends the line.

```bash
bash scripts/hello.sh
chmod u+x scripts/hello.sh
./scripts/hello.sh
```

**Check:**

- Both runs print `Hello, Explorer!` and your current directory.
- `bash file` asks Bash to read the script.
- `./file` executes it directly and needs execute permission.
- `chmod u+x` adds execute permission for the owner only.

**Your turn:**

1. Change the name and run again.
2. Move into `notes` and run `../scripts/hello.sh`.
3. Explain whether `pwd` reports the caller's directory or the script's directory.

<details>
<summary>Check your answer and common errors</summary>

- **`pwd`:** reports the caller's directory.
- **`PATH`:** lists where the shell searches for bare command names.
- **`./`:** explicitly identifies a local file.

- **No such file:** check `pwd` and `ls`; paths depend on where you start.
- **Permission denied:** inspect `ls -l` and add owner execute permission.
- **Bad interpreter / ^M:** save with Unix/LF line endings, or recreate the file in nano inside Ubuntu.

</details>

</details>

## Finish without copying

1. Open a new terminal and find your lab.
2. Append a note and run the script.
3. Explain why `cd ../scripts` differs from `cd /scripts`.

- [ ] I reached `bandit3` and can explain each file-reading command.
- [ ] curl, git, python3 and uv report versions in my learning terminal.
- [ ] My Bash script prints my name; I can explain `chmod u+x`.
- [ ] My notes contain one solved error and one command worth remembering.

**Explore:**

1. Open `man ls`; press `q` to exit.
2. Find an option and test it on your lab.
3. If asking AI for help, share the command/error and request a hint.
4. Verify the result yourself.

---

**Next:** [Module 2: Python & uv →](../02-python-and-uv/)
