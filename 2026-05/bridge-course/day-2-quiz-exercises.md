# Day 2 Quiz & Exercises
## TDS Bridge Bootcamp — Linux & Shell Essentials

> **Instructions:** Attempt the MCQs without help first. Then do the terminal exercises. The exercises build on each other — do them in order.

---

## Part A — 20 Multiple Choice Questions

**Q1.** You type `python` in the terminal and get "command not found". Your friend on the same machine has no problem. What is the most likely cause?

- [ ] A) Python is not installed on the system
- [ ] B) Python is installed but its folder is not in your PATH
- [ ] C) You need to use `sudo python`
- [ ] D) Your terminal is the wrong type


<details>
<summary>Answer</summary>

**B** — Your PATH doesn't include Python's folder

</details>


---

**Q2.** You run `echo $?` after a command and see `0`. What does this mean?

- [ ] A) The command produced no output
- [ ] B) The command ran successfully
- [ ] C) The command is still running
- [ ] D) There was an error

<details>
<summary>Answer</summary>

**B** — Exit code 0 = success

</details>


---

**Q3.** What does `tail -f server.log` do?

- [ ] A) Deletes the last line of the file
- [ ] B) Shows the last 10 lines and then exits
- [ ] C) Continuously shows new lines as they are added to the file
- [ ] D) Filters the file for lines containing "tail"

<details>
<summary>Answer</summary>

**C** — `-f` follows the file live; useful for server logs

</details>


---

**Q4.** You want to count the number of lines in a file called `data.csv`. Which command is correct?

- [ ] A) `count data.csv`
- [ ] B) `wc -w data.csv`
- [ ] C) `wc -l data.csv`
- [ ] D) `len data.csv`

<details>
<summary>Answer</summary>

**C** — `-l` counts lines; `-w` counts words

</details>


---

**Q5.** Which `grep` flag makes the search case-insensitive?

- [ ] A) `-c`
- [ ] B) `-n`
- [ ] C) `-v`
- [ ] D) `-i`

<details>
<summary>Answer</summary>

**D** — `-i` = case-insensitive

</details>


---

**Q6.** You run `grep -v "ERROR" app.log`. What does this return?

- [ ] A) Only lines containing "ERROR"
- [ ] B) A count of lines containing "ERROR"
- [ ] C) All lines that do NOT contain "ERROR"
- [ ] D) An error because `-v` is invalid

<details>
<summary>Answer</summary>

**C** — `-v` inverts the match — returns non-matching lines

</details>


---

**Q7.** What is the difference between these two commands?

```bash
grep "WARN" app.log > warnings.txt
grep "WARN" app.log >> warnings.txt
```

- [ ] A) No difference — both do the same thing
- [ ] B) The first overwrites `warnings.txt`; the second appends to it
- [ ] C) The first appends; the second overwrites
- [ ] D) The second command will fail if the file already exists

<details>
<summary>Answer</summary>

**B** — `>` overwrites; `>>` appends

</details>


---

**Q8.** You want to see error messages from a Python script separately from its normal output. Which command does this?

- [ ] A) `python script.py > all.txt`
- [ ] B) `python script.py 2> errors.txt`
- [ ] C) `python script.py | errors.txt`
- [ ] D) `python script.py >> errors.txt`

<details>
<summary>Answer</summary>

**B** — `2>` redirects stderr (error stream)

</details>


---

**Q9.** What does the pipe `|` do?

- [ ] A) Saves the output of a command to a file
- [ ] B) Runs two commands at the same time in parallel
- [ ] C) Sends the output of one command as input to the next
- [ ] D) Compares the output of two commands

<details>
<summary>Answer</summary>

**C** — Pipe feeds stdout of left command into stdin of right

</details>


---

**Q10.** You run:
```bash
cat words.txt | sort | uniq -c | sort -rn | head -10
```
What does this pipeline produce?

- [ ] A) The 10 shortest lines in the file
- [ ] B) The 10 most frequently occurring lines/words, sorted by count
- [ ] C) 10 random lines from the file
- [ ] D) The alphabetically first 10 unique lines

<details>
<summary>Answer</summary>

**B** — `uniq -c` counts; `sort -rn` sorts by count descending

</details>


---

**Q11.** Which nano shortcut saves a file?

- [ ] A) `Ctrl+S`
- [ ] B) `Ctrl+O` then Enter
- [ ] C) `Ctrl+X` then Enter
- [ ] D) `Esc + :w`

<details>
<summary>Answer</summary>

**B** — `Ctrl+O` writes (saves); `Ctrl+X` exits

</details>


---

**Q12.** You accidentally open a file in `vim`. You haven't changed anything. How do you exit?

- [ ] A) `Ctrl+C`
- [ ] B) `Ctrl+Z`
- [ ] C) Press `Esc`, then type `:q!` and press Enter
- [ ] D) Close the terminal window

<details>
<summary>Answer</summary>

**C** — `:q!` force-quits vim without saving

</details>


---

**Q13.** What is the correct way to copy a folder called `project/` (and all its contents) to `backup/`?

- [ ] A) `cp project/ backup/`
- [ ] B) `cp -r project/ backup/`
- [ ] C) `mv project/ backup/`
- [ ] D) `copy -all project/ backup/`

<details>
<summary>Answer</summary>

**B** — `-r` is required to copy directories recursively

</details>


---

**Q14.** You run `rm -r myfolder/`. What happens?

- [ ] A) The folder is moved to the Recycle Bin
- [ ] B) Only empty folders inside are removed
- [ ] C) The folder and all its contents are permanently deleted
- [ ] D) You'll be asked to confirm each file before deletion

<details>
<summary>Answer</summary>

**C** — `rm -r` is permanent — no recycle bin

</details>


---

**Q15.** You add this line to `.bashrc`:

```bash
MY_KEY="abc123"
```

Then open a new terminal and run `echo $MY_KEY`. What do you see?

- [ ] A) `abc123` — the variable is available
- [ ] B) Nothing — you forgot `export`
- [ ] C) An error — variables cannot be stored in `.bashrc`
- [ ] D) `MY_KEY` — the name is printed, not the value

<details>
<summary>Answer</summary>

**B** — Without `export`, the variable isn't inherited by child processes or new shells

</details>


---

**Q16.** What is the correct command to apply changes you just made to `.bashrc` without closing the terminal?

- [ ] A) `reload ~/.bashrc`
- [ ] B) `bash ~/.bashrc`
- [ ] C) `source ~/.bashrc`
- [ ] D) `apply ~/.bashrc`

<details>
<summary>Answer</summary>

**C** — `source` re-executes the file in the current shell

</details>


---

**Q17.** What is the difference between these two lines?

```bash
MY_VAR="hello"
export MY_VAR="hello"
```

- [ ] A) No difference
- [ ] B) The first sets the variable only for the current shell; `export` also makes it available to programs launched from this shell
- [ ] C) `export` saves the variable permanently; the first only lasts for this command
- [ ] D) The first works in Bash; `export` only works in zsh

<details>
<summary>Answer</summary>

**B** — `export` shares the variable with child processes

</details>


---

**Q18.** In Python, you want to read an API key stored as an environment variable called `API_KEY`. Which code is correct?

- [ ] A) `api_key = "API_KEY"`
- [ ] B) `api_key = env.get("API_KEY")`
- [ ] C) `api_key = os.environ["API_KEY"]`
- [ ] D) `api_key = os.getenv.API_KEY`

<details>
<summary>Answer</summary>

**C** — `os.environ["KEY"]` is the standard way

</details>


---

**Q19.** You run `ls -la` and see a file called `.env`. What is true about this file?

- [ ] A) It is a system file you should never touch
- [ ] B) It is hidden because its name starts with `.`
- [ ] C) It is an error — filenames can't start with `.`
- [ ] D) It will not appear with `ls -la`

<details>
<summary>Answer</summary>

**B** — Dot-prefixed files are hidden; `ls -la` reveals them

</details>


---

**Q20.** You want to search all `.py` files in `~/tds/` for the word `import`. Which command works?

- [ ] A) `grep "import" ~/tds/`
- [ ] B) `grep -r "import" ~/tds/`
- [ ] C) `find "import" ~/tds/*.py`
- [ ] D) `cat ~/tds/**/*.py | grep "import"`

<details>
<summary>Answer</summary>

**B** — `-r` searches recursively through directories

</details>


---



**Q21.** Which command shows the current user logged into the terminal?

- [ ] A) `whoami`
- [ ] B) `user`
- [ ] C) `name`
- [ ] D) `id -u`

<details>
<summary>Answer</summary>

**A** — `whoami` prints the current user.

</details>

---

**Q22.** What does `chmod +x script.sh` do?

- [ ] A) Deletes the script
- [ ] B) Makes the script executable
- [ ] C) Hides the script
- [ ] D) Copies the script

<details>
<summary>Answer</summary>

**B** — `+x` adds execute permission.

</details>

---

**Q23.** How do you view the manual/help page for the `ls` command?

- [ ] A) `ls --help` or `man ls`
- [ ] B) `help ls`
- [ ] C) `info ls`
- [ ] D) All of the above

<details>
<summary>Answer</summary>

**A** — `man ls` or `ls --help` are the standard ways.

</details>

---

**Q24.** You want to clear the terminal screen. What command or shortcut works?

- [ ] A) `clear` or Ctrl+L
- [ ] B) `clean`
- [ ] C) `cls`
- [ ] D) `reset`

<details>
<summary>Answer</summary>

**A** — `clear` or Ctrl+L clears the screen.

</details>

---

**Q25.** What is the purpose of the `sudo` command?

- [ ] A) To switch users
- [ ] B) To run a command with superuser (administrator) privileges
- [ ] C) To install software
- [ ] D) To shutdown the system

<details>
<summary>Answer</summary>

**B** — `sudo` executes a command as root/superuser.

</details>

---

**Q26.** What does `df -h` show?

- [ ] A) Disk space usage in human-readable format
- [ ] B) Memory usage
- [ ] C) Network interfaces
- [ ] D) Directory files

<details>
<summary>Answer</summary>

**A** — `df` shows disk free space, `-h` makes it readable.

</details>

---

**Q27.** You want to find where the `python` executable is located. Which command do you use?

- [ ] A) `locate python`
- [ ] B) `which python`
- [ ] C) `find python`
- [ ] D) `search python`

<details>
<summary>Answer</summary>

**B** — `which` locates a command in the PATH.

</details>

---

**Q28.** What does `history` do in the terminal?

- [ ] A) Shows recently modified files
- [ ] B) Prints a list of previously executed commands
- [ ] C) Re-runs the last command
- [ ] D) Clears old commands

<details>
<summary>Answer</summary>

**B** — `history` displays the command history.

</details>

---

**Q29.** How can you re-run the exact command you ran 3 steps ago without retyping it?

- [ ] A) Press the UP arrow key 3 times
- [ ] B) Run `repeat 3`
- [ ] C) Run `undo 3`
- [ ] D) It is impossible

<details>
<summary>Answer</summary>

**A** — The UP arrow cycles through history.

</details>

---

**Q30.** What does `mkdir -p a/b/c` do?

- [ ] A) Creates a directory `c` inside `b` inside `a`, creating `a` and `b` if they don't exist
- [ ] B) Fails if `a` and `b` do not exist
- [ ] C) Creates three separate directories: `a`, `b`, and `c`
- [ ] D) Prints the path `a/b/c`

<details>
<summary>Answer</summary>

**A** — `-p` creates parent directories as needed.

</details>

---

<details>
<summary>Full Answer Key (spoilers)</summary>

| Q | Answer |
|---|--------|
| 1 | B |
| 2 | B |
| 3 | C |
| 4 | C |
| 5 | D |
| 6 | C |
| 7 | B |
| 8 | B |
| 9 | C |
| 10 | B |
| 11 | B |
| 12 | C |
| 13 | B |
| 14 | C |
| 15 | B |
| 16 | C |
| 17 | B |
| 18 | C |
| 19 | B |
| 20 | B |
| 21 | A |
| 22 | B |
| 23 | A |
| 24 | A |
| 25 | B |
| 26 | A |
| 27 | B |
| 28 | B |
| 29 | A |
| 30 | A |

</details>

---

## Part B — Terminal Exercises

> Do these in order. Each builds on the previous one.

---

### Exercise 1 — Navigate and inspect

```bash
# 1. Go to your home directory
cd ~

# 2. List all files including hidden ones
ls -la

# 3. How many items do you see? Count with:
ls -la | wc -l

# 4. Go into your tds/bootcamp folder
cd ~/tds/bootcamp
```

**Write down:** What hidden files did you spot in your home directory?

---

### Exercise 2 — Create and populate a file

```bash
cd ~/tds/bootcamp

# Create a log file with some sample content
echo "INFO: server started on port 8000" > app.log
echo "INFO: connected to database" >> app.log
echo "WARN: disk usage at 80%" >> app.log
echo "ERROR: failed to read config.json" >> app.log
echo "INFO: request received from 127.0.0.1" >> app.log
echo "ERROR: database connection lost" >> app.log
echo "WARN: retrying connection..." >> app.log
echo "INFO: connection restored" >> app.log
```

Now answer these using only terminal commands (no opening the file in an editor):

1. How many lines does `app.log` have?
2. What are the last 3 lines?
3. How many lines contain `ERROR`?
4. Show only the `WARN` lines.

---

### Exercise 3 — Pipes in action

Using the `app.log` file from Exercise 2:

```bash
# Save all ERROR lines to a separate file
grep "ERROR" app.log > errors.txt

# Confirm it worked
cat errors.txt

# Count errors and warnings separately
echo "Errors:" && grep -c "ERROR" app.log
echo "Warnings:" && grep -c "WARN" app.log
```

Now try this pipeline — predict what it does before running it:

```bash
cat app.log | grep -v "INFO" | wc -l
```

**Question:** What did it count? Why?

---

### Exercise 4 — Edit with nano

```bash
nano ~/tds/bootcamp/app.log
```

Inside nano:
1. Add a new line at the very top: `# Log file for my TDS project`
2. Save with `Ctrl+O` then Enter
3. Exit with `Ctrl+X`
4. Verify the change: `head -1 app.log`

---

### Exercise 5 — Environment variables

```bash
# 1. Set a variable for this session
export MY_LOG_FILE="$HOME/tds/bootcamp/app.log"

# 2. Use it
cat $MY_LOG_FILE

# 3. Count errors using the variable
grep -c "ERROR" $MY_LOG_FILE

# 4. Now make it permanent — open .bashrc
nano ~/.bashrc
```

At the bottom of `.bashrc`, add:

```bash
export MY_LOG_FILE="$HOME/tds/bootcamp/app.log"
export MY_NAME="your-name-here"
```

Save, exit, then:

```bash
source ~/.bashrc
echo $MY_NAME
```

**Confirm:** Does `echo $MY_NAME` print your name?

---

### Bonus Exercise — One pipeline challenge

Using only terminal commands (no Python, no editor), find the **most frequent word** in your `app.log` file.

Hint: you'll need `cat`, `tr`, `sort`, `uniq -c`, `sort -rn`, and `head`.

Write your pipeline in `day2.md` under a "My Pipeline" section.

---

*End of Day 2 Quiz & Exercises*
### Exercise 6 — Additional Practice

1. Run `whoami` and note the output.
2. Run `history | tail -5` to see your last 5 commands.
3. Try `which python` to see where your Python is installed.

**Question to answer:** Why is the output of `which python` important when working with virtual environments?

---
