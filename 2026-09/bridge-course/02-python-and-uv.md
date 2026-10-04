# Module 2: Python & uv

**You will:**

- Run a small NumPy program.
- Compare Python's venv with uv's venv.
- Manage dependencies inside one script or a project's `pyproject.toml`.

**Bring:**

- Module 1's `~/bridge-lab`.
- Python and uv.
- Source files stored outside `.venv`.

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
<summary><strong>Game mission: CodeCombat</strong><span>Write the route. Watch your code move. | 3 challenges</span></summary>

## Start here

1. Open [Kithgard Dungeon](https://codecombat.com/play/dungeon).
2. Choose individual play if asked, **Python**, and the default hero.
3. Keep the starter equipment; create a free account if needed to save progress.
4. Open **Dungeons of Kithgard** and read its goals.
5. Type one instruction per line.
6. Before running, point to the square each instruction should reach.

**Know the screen:**

- **Map:** shows your hero and the route.
- **Editor:** holds your instructions.
- **Run:** executes the instructions from the start.

**Know the syntax:**

- `hero.moveRight()` is case-sensitive and needs the dot and parentheses.
- Lines beginning with `#` are comments.

### Challenge 1: Dungeons of Kithgard

1. Plan a route to the gem that avoids spikes.
2. Start with `hero.moveRight()`.
3. Predict the next two moves.

<details>
<summary>Walkthrough: three moves</summary>

Keep one copy of the first move, then add the other two:

```python
hero.moveRight()
hero.moveDown()
hero.moveRight()
```

1. Click **Run**.
2. Check the hero collects the gem and the level reports completion.
3. Continue to the next level.

</details>

### Challenge 2: Gems in the Deep

1. Trace a route that collects every gem.
2. Include two upward moves to reach the upper gem.
3. Type your route before opening the walkthrough.

<details>
<summary>Walkthrough: follow the route</summary>

```python
hero.moveRight()
hero.moveDown()
hero.moveUp()
hero.moveUp()
hero.moveRight()
```

1. Run the code and check every goal.
2. Replace the two upward lines with `hero.moveUp(2)`.
3. Predict whether the route changes, then rerun.

- **Argument:** the number `2` tells this function call how far to move.

</details>

### Challenge 3: Shadow Guard

- **Goal:** collect the gems and reach the exit.
- **Constraint:** stay out of the guard's sight.
- **Clue:** the statue provides cover.

<details>
<summary>Walkthrough: take cover above the statue</summary>

```python
hero.moveRight()
hero.moveUp()
hero.moveRight()
hero.moveDown()
hero.moveRight()
```

1. Run the code.
2. Check the gem, survival and exit goals pass.
3. Explain why moving up before crossing helps.

</details>

**Stuck?**

- Check spelling and `()`.
- Find the first move where the hero leaves your planned route.
- Read the game's hint before changing several lines.
- Level order/access can vary; use the named levels if available.
- At a subscription screen, stop and practise sequence/arguments in the local lab below.

**Keep the skill:**

1. Complete at least two available levels; aim for all three.
2. Change one move deliberately.
3. Explain the changed result.

- `hero` is supplied by CodeCombat; it does not exist in a normal Python file.
- [Official level guide](https://blog.codecombat.com/2021-hour-of-code-activities-that-engage-students-and-celebrate-dei/).

</details>

## Your lab

### One program, four workflows

1. Inside `~/bridge-lab`, create four folders: `venv-practice`, `uv-practice`, `script-practice` and `uv-project`.
2. Save this code as `app.py` in **each** folder, outside `.venv`:

```python
import numpy as np

scores = np.array([10, 20, 30])
print(scores.mean())
```

- **`import numpy as np`:** loads NumPy, a package for numerical work, with the short name `np`.
- **`np.array(...)`:** creates an array of numbers.
- **`.mean()`:** calculates their average; expect `20.0`.

<details name="module-2">
<summary><strong>2.1 · Traditional Python: venv + pip</strong></summary>

```bash
cd ~/bridge-lab/venv-practice
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install numpy
python3 app.py
```

1. **Create:** `python3 -m venv .venv` makes an isolated environment in `.venv`; `-m` means run a Python module, here `venv`.
2. **Activate:** `source .venv/bin/activate` puts `.venv/bin` first in this shell's **PATH**, where it looks for commands. `python3` now selects the environment's Python.
3. **Install:** `python3 -m pip install numpy` uses that Python's pip to install NumPy into the environment.
4. **Run:** `python3 app.py` executes your file with that Python and its installed NumPy.

- **Check:** the output is `20.0`.
- **Before continuing:** run `deactivate` to restore the earlier PATH; the environment remains.
- **New terminal:** activate again before using this environment.

</details>

<details name="module-2">
<summary><strong>2.2 · Same workflow, faster setup: uv venv</strong></summary>

```bash
cd ~/bridge-lab/uv-practice
uv venv
source .venv/bin/activate
uv pip install numpy
python3 app.py
```

1. **Create:** `uv venv` makes `.venv`; notice how quickly it finishes compared with the previous workflow.
2. **Activate:** the same `source` command updates PATH to select this environment's Python.
3. **Install:** `uv pip install numpy` installs NumPy into the environment; pip itself need not be installed there.
4. **Run:** `python3 app.py` runs the same program; expect `20.0`.

- **Same idea:** create → activate → install → run; uv handles creation and installation.
- **Before continuing:** run `deactivate`.

</details>

<details name="module-2">
<summary><strong>2.3 · Modern single file: dependencies travel with the script</strong></summary>

```bash
cd ~/bridge-lab/script-practice
uv add --script app.py numpy
uv run app.py
```

1. **Declare:** `uv add --script app.py numpy` adds dependency metadata at the top of the existing file. Look for `numpy` in its `dependencies` list.
2. **Run:** `uv run app.py` prepares an isolated environment with NumPy and executes the script; no manual activation is needed.

- **Check:** the output is still `20.0`; your program below the metadata is unchanged.
- **Share:** send `app.py`, including its metadata; someone with uv can run it.
- **Keep for Module 4:** copy this version to `~/bridge-lab/scripts/check-in.py`.

</details>

<details name="module-2">
<summary><strong>2.4 · Modern project: dependencies in pyproject.toml</strong></summary>

```bash
cd ~/bridge-lab/uv-project
uv init --vcs none
uv add numpy
uv run app.py
```

1. **Initialise:** `uv init` creates a Python project; `--vcs none` leaves Git setup for Module 4.
2. **Declare and install:** `uv add numpy` records NumPy in `pyproject.toml` and prepares the project's environment.
3. **Run:** `uv run app.py` selects that environment and executes your file; expect `20.0`.

| Item | Meaning |
| --- | --- |
| `pyproject.toml` | Project settings and declared dependencies |
| `uv.lock` | Exact resolved dependency versions |
| `.venv/` | Local environment uv manages |

- **Check:** find `numpy` under `dependencies` in `pyproject.toml`.
- **Share:** commit source files, `pyproject.toml` and `uv.lock`; recreate `.venv` locally.
- **Choose a project:** when several files share dependencies.

</details>

## Finish without copying

1. Change the numbers in each `app.py` to `[10, 20, 60]`.
2. Predict the average, then rerun using each workflow.
3. In `notes/python.txt`, explain what selects Python and where dependencies are declared.

| Workflow | Select the environment | Dependencies |
| --- | --- | --- |
| Python venv + pip | Activate, then `python3 app.py` | Install manually with pip |
| uv venv | Activate, then `python3 app.py` | Install manually with `uv pip` |
| uv single file | `uv run app.py` | Metadata inside `app.py` |
| uv project | `uv run app.py` | `pyproject.toml` + `uv.lock` |

- [ ] I completed two or three game levels.
- [ ] I can explain `-m`, activation and PATH.
- [ ] I ran the same NumPy program in all four workflows.
- [ ] I can choose between a standalone script and a project.

**Stuck?**

- **`ModuleNotFoundError`:** NumPy must be installed in the environment that runs your file. Check activation, or use the matching uv workflow.
- **venv missing on Ubuntu/WSL:** revisit Module 1's `python3-venv` installation.

**Explore:** change `.mean()` to `.sum()`, predict the result and verify it.

**References:** [Python venv](https://docs.python.org/3/library/venv.html) · [uv environments](https://docs.astral.sh/uv/pip/environments/) · [uv scripts](https://docs.astral.sh/uv/guides/scripts/) · [uv projects](https://docs.astral.sh/uv/guides/projects/).

---

**Next:** [Module 3: HTTP & Chrome DevTools →](../03-http-and-devtools/)
