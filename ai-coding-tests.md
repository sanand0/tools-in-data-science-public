# AI Coding Tests

Testing AI-generated code is about establishing fast, trustworthy feedback loops before the code lands in main. The goal is not perfect certainty—it is a reliable signal that the patch does what it should, fails when it must, and keeps shipping velocity high.

In this module, you'll learn:

- **Scorecard-driven evaluation loops**: Track AI agent success with automated suites and selectors
- **Premortem test-first flows**: Lock in failing tests before asking an agent to code
- **Python-first fuzzing and mutation**: Catch almost-right code with Hypothesis and mutmut
- **Agent-powered smoke tests**: Let Playwright bots guard critical user journeys

## Build evaluation loops

Benchmarks stop vibe-coded fixes from quietly regressing. Start with a thin scorecard that runs on every candidate patch, then expand.

- **Curate a regression suite**: Keep a lightweight folder such as `tests/scorecards/` that encodes the acceptance criteria for each automation task. Track pass rate over time and graph it. [OpenAI evals](https://github.com/openai/evals) and [Anthropic evals](https://github.com/anthropics/evals) are reference architectures for scorecard runners.
- **Automate the selector harness**: When using Mixture-of-Agents or multiple drafts, promote the version that clears the scorecard. A simple shell script works:

  ```bash
  uv run pytest tests/scorecards -q --maxfail=1
  jq -s '{winner: max_by(.score)}' variations/*/result.json
  ```

- **Keep evaluation in-the-loop**: Wire the scorecard into CI so every agent commit runs `uv run pytest` (for code) plus any task-specific checks (`uvx mypy`, `npm test`, etc.) before merge. Reject green builds unless the evaluation job also passes.

## Premortem tests first

Write the tests you want to see fail before you let the model touch the repo.

1. Describe the desired behavior in a docstring or issue comment.
2. Ask the agent (or write manually) for precise unit/property tests that encode that behavior.
3. Run the tests and verify they fail.
4. Only then let the agent implement code until the suite is green.

```python
# tests/test_csv_loader.py
"""CSV loader must ignore BOMs and normalise header case."""

from pathlib import Path

import pytest

TEST_DATA = Path("tests/fixtures/csv/bom_users.csv")


def test_reads_bom_file(tmp_path: Path) -> None:
    rows = load_users(TEST_DATA)
    assert rows[0]["email"] == "person@example.com"


def test_rejects_missing_email(tmp_path: Path) -> None:
    with pytest.raises(ValueError):
        load_users(TEST_DATA.with_suffix(".bad"))
```

Premortem TDD makes the happy path obvious and stops the agent from rewriting tests to match its output. Treat these red tests as the contract; the agent must satisfy them without edits unless you explicitly amend requirements.

## Property-based fuzzing for AI patches

AI-produced code often fails on weird but realistic inputs. Property-based tests generate thousands of them for you.

- **Lean on Hypothesis for Python**: Install once (`uv add hypothesis`) and import strategies to generate realistic data. The [Hypothesis quickstart](https://hypothesis.readthedocs.io/en/latest/quickstart.html) illustrates the core API.
- **Codify invariants**: Instead of hard-coding outputs, assert algebraic laws, ordering guarantees, or round-trip behavior. This keeps tests resilient across alternative implementations the agent might generate.
- **Seed fixtures**: Hypothesis replays failing inputs via the example database, so regression tests stay deterministic in CI.

```python
# tests/test_slugify_props.py
"""Slug helpers must be lowercase, ASCII, and idempotent."""

from hypothesis import given, strategies as st

@given(st.text(min_size=1))
def test_slugify_is_idempotent(text: str) -> None:
    slug = slugify(text)
    assert slug == slugify(slug)
    assert slug == slug.lower()
    assert slug.encode("ascii", errors="ignore").decode() == slug
```

Run it fast:

```bash
uv run pytest tests/test_slugify_props.py -q
```

[![Property-Based Testing In Python: Hypothesis is AWESOME](https://i.ytimg.com/vi_webp/mkgd9iOiICc/sddefault.webp)](https://www.youtube.com/watch?v=mkgd9iOiICc)

## Coverage and mutation guardrails

Passing tests mean little if they never execute the risky code paths. Couple coverage metrics with mutation testing to be sure the suite bites back.

- **Measure the baseline**: `uv run coverage run -m pytest && uv run coverage report -m` verifies new AI patches widen coverage rather than shrinking it. [Coverage.py](https://coverage.readthedocs.io/en/7.6.1/) surfaces untouched branches.
- **Mutate to validate**: [mutmut](https://mutmut.readthedocs.io/en/latest/) flips operators and literals. Surviving mutants expose brittle or missing assertions.

```bash
uv run mutmut run --paths-to-mutate package/ --tests-dir tests/
uv run mutmut results
```

- **Script nightly guardrails**: Run mutation testing asynchronously (nightly or on beefy agents) and file issues for mutants that survive multiple spins.

[![Fear the Mutants. Love the Mutants. Use Mutation Testing to Improve Your Software Engineering Skills](https://i.ytimg.com/vi_webp/7pfvsLLQDow/sddefault.webp)](https://www.youtube.com/watch?v=7pfvsLLQDow)

## Hidden adversarial checks

Agent-generated code tends to overfit visible tests. Keep a small stash of unseen cases that run in CI but stay out of the prompt history.

- **Hide tricky fixtures**: Store adversarial fixtures (rounded floats, locale surprises, sample vs population stats) under `tests/hidden/` and skip them locally with an env flag.
- **Property + example pairing**: Combine Hypothesis strategies with hand-crafted edge fixtures using `@pytest.mark.parametrize` to guarantee known-bad paths stay covered.
- **Test data packs**: Maintain tiny, versioned fixture bundles for critical domains (currencies, encodings, timezone transitions). Publish them as `tests/fixtures/<feature>` so agents can read structure but not exact values.

## End-to-end smoke bots

Keep at least one high-value flow green to catch integration bugs even when unit tests pass.

- **Script minimal Playwright runs**: Use [Playwright for Python](https://playwright.dev/python/docs/intro) or platform agents to drive the UI the AI just modified.
- **Sandbox for determinism**: Launch against seeded datasets or mock services so AI patches do not flake the smoke tests.
- **Automate from the CLI**:

  ```bash
  uv run playwright install chromium
  uv run playwright test tests/e2e/smoke.spec.ts --headed=false --repeat-each=2
  ```

- **Agent-in-the-loop**: Some coders run Playwright via MCP or Codex sandbox tasks so the AI can verify its own output. Require human review of logs before merge.

## LLM-assisted grading (with guardrails)

Treat LLM judges as advisory signals layered on top of runnable tests.

- **Prompt from diffs**: Provide the patch, the failing test names, and the domain rubric. Ask for a risk score, not approval.
- **Never skip executables**: Only auto-merge if both runnable tests and LLM checks agree.
- **Log everything**: Archive judge prompts/responses for audit; rotate prompts to reduce prompt overfitting.

## Operational checklist

- Start every new AI ticket by drafting a failing unit/property test (premortem).
- Keep scorecards fast enough to run on every agent iteration (<1 minute ideal).
- Enrich suites weekly with at least one new hidden/adversarial case per bug found.
- Track coverage deltas and mutation survivors; fix the tests, not the tool.
- Document how to run smoke bots locally so humans can verify before merge.

<!-- Dropped: Hidden/robust checks (merged into Hidden adversarial checks); Unit + property tests (covered in Premortem and Property sections) -->
