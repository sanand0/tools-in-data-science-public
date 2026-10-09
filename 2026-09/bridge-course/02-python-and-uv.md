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
.markdown .bridge-roadmap {
  margin: 1.5rem 0;
  padding: clamp(1rem, 3vw, 2rem);
  border: 1px solid var(--roadmap-track);
  border-radius: 1.25rem;
  background: linear-gradient(145deg, #fff, var(--roadmap-soft));
  color: #243746;
}
.markdown .bridge-roadmap .roadmap-eyebrow {
  margin: 0 0 0.5rem;
  color: var(--roadmap-accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.markdown .bridge-roadmap .roadmap-intro { margin: 0; line-height: 1.65; }
.markdown .bridge-roadmap svg { display: block; width: 100%; height: auto; margin: 1rem 0; }
.markdown .bridge-roadmap .roadmap-stops {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.markdown .bridge-roadmap .roadmap-stops > li {
  min-width: 0;
  margin: 0;
  padding: 1.1rem;
  border: 1px solid var(--roadmap-track);
  border-radius: 0.85rem;
  background: #fff;
}
.markdown .bridge-roadmap .roadmap-stops > .roadmap-stretch { border-color: #e7c1a6; background: #fffaf5; }
.markdown .bridge-roadmap .roadmap-step { display: flex; align-items: center; gap: 0.65rem; }
.markdown .bridge-roadmap .roadmap-number {
  display: grid;
  place-items: center;
  flex: 0 0 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--roadmap-soft);
  color: var(--roadmap-accent);
  font-size: 0.8rem;
  font-weight: 700;
}
.markdown .bridge-roadmap .roadmap-level { color: var(--roadmap-accent); font-size: 0.8rem; font-weight: 700; }
.markdown .bridge-roadmap .roadmap-stretch .roadmap-number { background: #fbe9d9; color: #934321; }
.markdown .bridge-roadmap .roadmap-stretch .roadmap-level { color: #934321; }
.markdown .bridge-roadmap h3 { margin: 0.8rem 0 0.35rem; font-size: 1.1rem; line-height: 1.4; }
.markdown .bridge-roadmap a { color: var(--roadmap-accent); text-decoration: underline; text-underline-offset: 0.2em; }
.markdown .bridge-roadmap a:hover { color: #934321; }
.markdown .bridge-roadmap a:focus-visible { outline: 2px solid var(--roadmap-accent); outline-offset: 4px; border-radius: 2px; }
.markdown .bridge-roadmap code { padding: 0.1em 0.25em; border-radius: 0.2rem; background: var(--roadmap-soft); color: #243746; overflow-wrap: anywhere; }
.markdown .bridge-roadmap li p { margin: 0.65rem 0 0; font-size: 0.9rem; line-height: 1.6; }
.markdown .bridge-roadmap li .roadmap-access { margin: 0; color: #526373; font-size: 0.75rem; }
.markdown .bridge-roadmap li .roadmap-checkpoint { padding-top: 0.65rem; border-top: 1px solid #dce3e8; }
.markdown .bridge-roadmap .roadmap-note { margin: 1rem 0 0; font-size: 0.85rem; line-height: 1.6; }
@media (max-width: 600px) {
  .markdown .bridge-roadmap .roadmap-stops { grid-template-columns: 1fr; }
  .markdown .bridge-roadmap .roadmap-svg-label { display: none; }
}
@media (prefers-reduced-motion: no-preference) {
  .markdown .bridge-roadmap .roadmap-stops > li { transition: box-shadow 160ms ease; }
  .markdown .bridge-roadmap .roadmap-stops > li:hover { box-shadow: 0 4px 16px #24374612; }
}
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

## Practice roadmap

<section class="bridge-roadmap" aria-label="Four levels of Python and uv practice" style="--roadmap-accent: #2457a7; --roadmap-soft: #edf3fd; --roadmap-track: #c9d9ef;">
<p class="roadmap-eyebrow">Start where you are · Choose your target</p>
<p class="roadmap-intro">Start with data handling at 01, solve harder problems at 02, test and refactor at 03, or make your projects reproducible with uv at 04. Every roadmap stop is free; enter where your current skills fit.</p>
<svg viewBox="0 0 880 216" role="img" aria-labelledby="python-roadmap-title python-roadmap-desc" xmlns="http://www.w3.org/2000/svg">
  <title id="python-roadmap-title">Your Python and uv practice roadmap</title>
  <desc id="python-roadmap-desc">Four free stops progress from processing data on Genepy, through ranked Codewars problems and tested Exercism programs, to reproducible Python scripts and projects with uv.</desc>
  <path d="M90 140C185 140 205 66 320 66S430 140 550 140S670 66 780 66S830 66 850 66" fill="none" stroke="#c9d9ef" stroke-width="16" stroke-linecap="round"/>
  <path d="M90 140C185 140 205 66 320 66S430 140 550 140S670 66 780 66S830 66 850 66" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="7 10"/>
  <g text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="700">
    <circle cx="90" cy="140" r="31" fill="#2457a7"/>
    <text x="90" y="150" fill="#fff">01</text>
    <circle cx="320" cy="66" r="31" fill="#fff" stroke="#2457a7" stroke-width="3"/>
    <text x="320" y="76" fill="#2457a7">02</text>
    <circle cx="550" cy="140" r="31" fill="#fff" stroke="#2457a7" stroke-width="3"/>
    <text x="550" y="150" fill="#2457a7">03</text>
    <circle cx="780" cy="66" r="31" fill="#fff0e3" stroke="#934321" stroke-width="3"/>
    <text x="780" y="76" fill="#934321">04</text>
  </g>
  <g class="roadmap-svg-label" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#243746">
    <text x="90" y="195">Process</text>
    <text x="320" y="121">Solve</text>
    <text x="550" y="195">Test</text>
    <text x="780" y="121" fill="#934321">Reproduce</text>
  </g>
  <path d="M850 66V24" stroke="#243746" stroke-width="3"/>
  <path d="M852 24H876L868 34L876 44H852Z" fill="#934321"/>
  <circle cx="185" cy="44" r="6" fill="#c9d9ef"/>
  <circle cx="437" cy="184" r="5" fill="#edbf8d"/>
  <path d="M639 190L656 163L674 190Z" fill="#edf3fd"/>
</svg>
<ol class="roadmap-stops">
  <li>
    <div class="roadmap-step"><span class="roadmap-number">01</span><span class="roadmap-level">Foundation · Process</span></div>
    <h3><a href="https://genepy.org/exercises/" target="_blank" rel="noopener">Genepy · practical Python ↗</a></h3>
    <p class="roadmap-access">Free · Browser corrector · Account for shared solutions</p>
    <p>Solve <a href="https://genepy.org/exercises/sort-students" target="_blank" rel="noopener">Sort students ↗</a>, then <a href="https://genepy.org/exercises/csv-and-python" target="_blank" rel="noopener">CSV and Python ↗</a>. Sort records without changing the input; write quoted CSV and parse dates and marks into typed values. New to functions and loops? Use the site's Basics exercises first.</p>
    <p class="roadmap-checkpoint"><strong>Move on when:</strong> both exercises pass and you can explain sorting keys, CSV quoting and type conversion.</p>
  </li>
  <li>
    <div class="roadmap-step"><span class="roadmap-number">02</span><span class="roadmap-level">Intermediate · Solve</span></div>
    <h3><a href="https://www.codewars.com/kata/54da5a58ea159efa38000836/python" target="_blank" rel="noopener">Codewars · ranked kata ↗</a></h3>
    <p class="roadmap-access">Free account · Python browser editor</p>
    <p>Start with <strong>Find the odd int (6 kyu)</strong> to reason about frequencies. Implement <a href="https://www.codewars.com/kata/515bb423de843ea99400000a/python" target="_blank" rel="noopener">PaginationHelper (5 kyu) ↗</a> with correct page boundaries. When confident, try <a href="https://www.codewars.com/kata/51ba717bb08c1cd60f00002f/python" target="_blank" rel="noopener">Range Extraction (4 kyu) ↗</a> to compress consecutive values. Lower kyu numbers mean harder problems.</p>
    <p class="roadmap-checkpoint"><strong>Move on when:</strong> full tests pass at 6 and 5 kyu and you can explain your strategy for duplicates, empty collections and invalid indexes.</p>
  </li>
  <li>
    <div class="roadmap-step"><span class="roadmap-number">03</span><span class="roadmap-level">Applied · Test</span></div>
    <h3><a href="https://exercism.org/tracks/python" target="_blank" rel="noopener">Exercism · test and refactor ↗</a></h3>
    <p class="roadmap-access">Free account · Browser editor or local Python · Free exercises and mentoring</p>
    <p>Implement <a href="https://exercism.org/tracks/python/exercises/bank-account" target="_blank" rel="noopener">Bank Account ↗</a> with correct balances, account states and validation errors. Then refactor <a href="https://exercism.org/tracks/python/exercises/ledger" target="_blank" rel="noopener">Ledger ↗</a> in small steps while preserving its locale and currency formatting. Add a regression test and record the changes that improve readability.</p>
    <p class="roadmap-checkpoint"><strong>Move on when:</strong> both suites pass, invalid account operations raise the expected errors, and your refactoring preserves Ledger's output.</p>
  </li>
  <li class="roadmap-stretch">
    <div class="roadmap-step"><span class="roadmap-number">04</span><span class="roadmap-level">Project workflow · Reproduce</span></div>
    <h3><a href="https://docs.astral.sh/uv/guides/projects/" target="_blank" rel="noopener">uv · scripts and projects ↗</a></h3>
    <p class="roadmap-access">Free tool and guides · Terminal with Python and uv</p>
    <p>Put a tested solution in a new folder using <code>uv init --vcs none</code>. Declare its dependencies and add pytest with <code>uv add --dev pytest</code>. Compare the project with the <a href="https://docs.astral.sh/uv/guides/scripts/" target="_blank" rel="noopener">single-file script workflow ↗</a>, then copy only source, tests, <code>pyproject.toml</code> and <code>uv.lock</code> into a fresh folder.</p>
    <p class="roadmap-checkpoint"><strong>Target:</strong> <code>uv sync --locked</code> and <code>uv run --locked pytest</code> pass in the fresh folder. Explain declared dependencies, locked versions and the recreated <code>.venv</code>.</p>
  </li>
</ol>
<p class="roadmap-note">Use the lab below to compare the four environment workflows. Keep practice projects in separate folders, store source files outside <code>.venv</code>, and use the free Codewars and Exercism accounts to save your exercise progress.</p>
</section>

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
