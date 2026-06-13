"""
We need scoring that is fair, easy to explain, and robust to uneven match counts.
Below are four complementary mechanisms grounded in common education/assessment practices
(simple points, normalized rates, and difficulty-adjusted credit).

## 1) Simple Win Points (baseline, “1 point per win”)
- Each duel yields exactly one point: if the attack reveals the code, the attacker earns 1; otherwise the defender earns 1.
- Student score = `attack_wins + defense_wins`.
- Rationale: transparent, aligns with basic right/wrong counting, widely used for low-stakes grading. Caveat: favors students with more duels.

## 2) Role-Balanced Win Rate (normalization for exposure)
- Compute attack win rate = `attack_wins / attack_attempts`.
- Compute defense win rate = `defense_wins / defense_attempts`.
- Score = average of the two rates.
- Rationale: normalizes for attempt volume (avoids penalizing/benefiting from caching). Mirrors mastery-based grading that uses proportions rather than raw totals.

## 3) Difficulty-Weighted Success (value hard wins more)
- Baselines: for each system prompt, global leak rate across all attackers (`system_base_leak`); for each user prompt, global leak rate across all defenders (`user_base_leak`).
- Per duel weights:
  - Attack success weight = `(1 - system_base_leak)` (harder to crack a low-leak system).
  - Defense success weight = `user_base_leak` (harder to block a high-leak attack prompt).
- Score = average weighted success per duel: `(sum weighted_attack_success + sum weighted_defense_success) / total_duels`.
- Rationale: common in assessments to weight harder items more; still easy to explain (“beating tougher opponents is worth more”).

## 4) Over-Expected Performance (beat-the-benchmark)
- Compare each student to baselines above:
  - Attack over-performance per duel = `revealed - system_base_leak`.
  - Defense over-performance per duel = `(1 - revealed) - (1 - user_base_leak)`.
- Score = average of per-role means: `0.5 * (mean_attack_over + mean_defense_over)`.
- Interpretation: positive means you outperformed what the average participant achieved against the same prompts; negative means underperformed. This mirrors IRT-style “better than expected” reasoning in testing.
"""

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd


def load_matrix(json_path: Path) -> tuple[list[str], list[str], list[list[int]]]:
    data = json.loads(json_path.read_text(encoding="utf-8"))
    return data["systems"], data["users"], data["wins"]


def map_prompt_owners(responses_path: Path, prompt_column: str) -> dict[str, set[str]]:
    """Map prompt text to all emails that submitted it."""
    resp = pd.read_csv(responses_path)
    resp.columns = [
        "timestamp",
        "email",
        "secret",
        "system",
        "user",
        "api",
        "github",
    ]
    column = "system" if prompt_column == "system" else "user"
    owners: dict[str, set[str]] = {}
    for _, row in resp.iterrows():
        owners.setdefault(row[column], set()).add(row["email"])
    return owners


def compute_scores(
    systems: list[str],
    users: list[str],
    wins: list[list[int]],
    system_owners: dict[str, set[str]],
    user_owners: dict[str, set[str]],
) -> pd.DataFrame:
    """Return per-student scores using the compact JSON matrix."""
    systems_series = pd.Series(systems)
    users_series = pd.Series(users)
    wins_df = pd.DataFrame(wins, index=systems_series, columns=users_series)

    leak_df = 1 - wins_df  # 1 = user wins (reveal)
    system_base = leak_df.mean(axis=1)
    user_base = leak_df.mean(axis=0)
    global_mean = leak_df.values.mean()

    attack_records = []
    defense_records = []

    for sys_prompt, row in wins_df.iterrows():
        for user_prompt, system_win in row.items():
            attack_win = 1 - system_win
            defense_win = system_win
            sys_base = system_base.get(sys_prompt, global_mean)
            user_base_val = user_base.get(user_prompt, global_mean)
            attack_weighted = attack_win * (1 - sys_base)
            defense_weighted = defense_win * user_base_val
            attack_over = attack_win - sys_base
            defense_over = defense_win - (1 - user_base_val)

            for attacker in user_owners.get(user_prompt, {user_prompt}):
                attack_records.append(
                    (
                        attacker,
                        attack_win,
                        attack_weighted,
                        attack_over,
                    )
                )
            for defender in system_owners.get(sys_prompt, {sys_prompt}):
                defense_records.append(
                    (
                        defender,
                        defense_win,
                        defense_weighted,
                        defense_over,
                    )
                )

    att_df = pd.DataFrame(
        attack_records,
        columns=["email", "attack_win", "attack_weighted", "attack_over"],
    )
    def_df = pd.DataFrame(
        defense_records,
        columns=["email", "defense_win", "defense_weighted", "defense_over"],
    )

    att = (
        att_df.groupby("email")
        .agg(
            attack_attempts=("attack_win", "size"),
            attack_wins=("attack_win", "sum"),
            attack_weighted_sum=("attack_weighted", "sum"),
            attack_over_mean=("attack_over", "mean"),
        )
        .reset_index()
    )

    defn = (
        def_df.groupby("email")
        .agg(
            defense_attempts=("defense_win", "size"),
            defense_wins=("defense_win", "sum"),
            defense_weighted_sum=("defense_weighted", "sum"),
            defense_over_mean=("defense_over", "mean"),
        )
        .reset_index()
    )

    students = pd.merge(att, defn, on="email", how="outer").fillna(0)
    students["total_duels"] = students["attack_attempts"] + students["defense_attempts"]

    students["attack_win_rate"] = np.where(
        students["attack_attempts"] > 0,
        students["attack_wins"] / students["attack_attempts"],
        0,
    )
    students["defense_win_rate"] = np.where(
        students["defense_attempts"] > 0,
        students["defense_wins"] / students["defense_attempts"],
        0,
    )

    students["simple_points"] = students["attack_wins"] + students["defense_wins"]
    students["avg_win_rate"] = (
        students["attack_win_rate"] + students["defense_win_rate"]
    ) / 2
    students["weighted_success"] = np.where(
        students["total_duels"] > 0,
        (students["attack_weighted_sum"] + students["defense_weighted_sum"])
        / students["total_duels"],
        0,
    )
    students["over_expected"] = 0.5 * (
        students["attack_over_mean"] + students["defense_over_mean"]
    )

    cols = [
        "email",
        "attack_attempts",
        "attack_wins",
        "attack_win_rate",
        "defense_attempts",
        "defense_wins",
        "defense_win_rate",
        "simple_points",
        "avg_win_rate",
        "weighted_success",
        "over_expected",
    ]

    return students[cols].sort_values(
        ["simple_points", "avg_win_rate"], ascending=False
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Compute student scores from promptfight logs."
    )
    parser.add_argument(
        "--log",
        default="promptfight_log.json",
        help="Path to promptfight_log.json (matrix format)",
    )
    parser.add_argument(
        "--responses",
        default="responses.csv",
        help="Path to responses.csv for mapping prompts to student emails.",
    )
    parser.add_argument("--out", default="evaluation.csv", help="Output path")
    args = parser.parse_args()

    log_path = Path(args.log)
    out_path = Path(args.out)
    responses_path = Path(args.responses)
    if not log_path.exists():
        raise SystemExit(f"Log file not found: {log_path}")
    if not responses_path.exists():
        raise SystemExit(f"Responses file not found: {responses_path}")

    systems, users, wins = load_matrix(log_path)
    system_owners = map_prompt_owners(responses_path, "system")
    user_owners = map_prompt_owners(responses_path, "user")
    scores = compute_scores(systems, users, wins, system_owners, user_owners)
    scores.to_csv(out_path, index=False)
    print(f"Wrote {len(scores)} rows to {out_path}")


if __name__ == "__main__":
    main()
