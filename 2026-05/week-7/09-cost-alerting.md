# Cost Alerting & Budgets

> **The cloud bill nobody checks is the one that ruins a month. Cap what you can, alert on the rest, and never let an agent loop spend money unattended.**

⏱ ~8 min read · ~20 min hands-on
🔗 needs: [Serverless Functions](/2026-05/week-7/07-serverless-functions/) · [Loop Engineering](/2026-05/week-5/loop-engineering/)

Students in this course run LLM APIs, autoscaling services, and agent loops — three of the best ways ever invented to spend money by accident. A retry loop against a paid API can burn a semester's budget overnight.

## Try it in 5 minutes — cap spend in your own code

Cloud budgets alert *after* the fact, often hours later. The only limit that stops the bleeding immediately is one **inside your program**:

```python
# /// script
# requires-python = ">=3.12"
# ///
"""A hard spend ceiling for LLM calls. Refuses to continue past the budget.

Run:  uv run budget.py
"""


class BudgetExceeded(RuntimeError):
    pass


class Budget:
    """Track spend and refuse to exceed a hard ceiling."""

    # Illustrative rates — always check current provider pricing.
    def __init__(self, limit_usd: float, in_per_mtok: float, out_per_mtok: float):
        self.limit, self.spent = limit_usd, 0.0
        self.in_rate, self.out_rate = in_per_mtok, out_per_mtok

    def charge(self, in_tok: int, out_tok: int) -> float:
        cost = (in_tok * self.in_rate + out_tok * self.out_rate) / 1_000_000
        if self.spent + cost > self.limit:
            raise BudgetExceeded(
                f"Refusing call: ${self.spent:.4f} + ${cost:.4f} > ${self.limit:.2f}"
            )
        self.spent += cost
        return cost


budget = Budget(limit_usd=0.50, in_per_mtok=3.00, out_per_mtok=15.00)

try:
    for i in range(1, 1000):                      # a runaway agent loop
        budget.charge(in_tok=8_000, out_tok=2_000)
        if i % 5 == 0:
            print(f"  call {i:3}  spent ${budget.spent:.4f}")
except BudgetExceeded as e:
    print(f"\nSTOPPED after {i - 1} calls — {e}")
```

✅ The loop halts itself. Notice it stops in **single-digit calls** at a 50-cent ceiling — that's how fast a real agent loop moves.

## Defence in depth for money

| Layer | Stops | Latency |
|---|---|---|
| **In-code budget** | The runaway loop, immediately | Instant |
| **Provider spend cap / quota** | Further API calls | Minutes |
| **`--max-instances`, quotas** | Autoscaling blowouts | Instant |
| **Cloud budget alert** | Nothing — it *tells* you | Hours |
| **Billing export + dashboard** | Nothing — it explains later | A day |

Only the first three actually *stop* spending. Alerts are for the slow leaks you'd otherwise miss.

```bash
# GCP: alert at 50/90/100% of a monthly budget
gcloud billing budgets create \
  --billing-account=XXXXXX-XXXXXX-XXXXXX \
  --display-name="tds-course" \
  --budget-amount=20USD \
  --threshold-rule=percent=0.5 --threshold-rule=percent=0.9 --threshold-rule=percent=1.0
```

## Where student money actually goes

| Trap | Why it hurts | Prevention |
|---|---|---|
| Agent retry loop on a paid model | Each retry is a full-context call | Attempt caps + in-code budget ([Loop Engineering](/2026-05/week-5/loop-engineering/)) |
| Long context re-sent every turn | Cost scales with conversation length | Trim history; [prompt caching](/2026-05/week-3/prompt-caching/) |
| Idle GPU / VM left running | Bills per hour whether used or not | Stop it; scale-to-zero; a calendar reminder |
| Autoscaling with no cap | A traffic spike scales to hundreds | `--max-instances` |
| Egress and cross-region traffic | Data *out* is the charge people forget | Keep compute and storage in one region |
| Free trial expires quietly | Silent switch to paid | Diarise the end date |

> ⚖️ **Set the budget before the experiment, not after.** And never hand an autonomous agent a payment method without a hard ceiling — an agent with a credit card and a loop is a genuinely bad combination.

## Attribute the cost

You can't fix what you can't attribute. **Label everything** (`project=tds`, `env=dev`, `owner=you`), and per-request, log tokens and estimated cost with a request ID — that's [observability](/2026-05/week-2/09-observability/) applied to money. Then "which feature costs the most?" is a query, not a guess.

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| Alert arrived after the money was gone | Budgets notify, they don't block | In-code caps + quotas |
| Can't tell what caused a spike | No labels or per-request logging | Label resources; log token usage |
| Bill continues after "deleting" everything | Orphaned disks, IPs, snapshots | `terraform destroy`; audit the console |
| Cost per call rose without a code change | Larger context, or a model default changed | Log tokens per call; pin model versions |

## Your turn (≈20 min)

1. Run `budget.py`; adjust the ceiling and note how few calls fit.
2. Add it to a real LLM call path so every call charges the budget before firing.
3. Create a cloud budget with 50/90/100% alerts on the account you use for this course.
4. Set `--max-instances` on your Cloud Run service.
5. List every resource you've created this term and delete what you don't need. Write down the monthly total you just avoided.

## Checklist

- [ ] I have an in-code spend ceiling around LLM calls.
- [ ] I know alerts notify but don't block; quotas and caps block.
- [ ] Every autoscaling service has a max-instance cap.
- [ ] I label resources and log tokens/cost per request.
- [ ] I delete course resources when I'm done with them.

## Go deeper

- [GCP budgets & alerts](https://cloud.google.com/billing/docs/how-to/budgets) — thresholds and notifications.
- [AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) — the AWS equivalent.
- [Prompt Caching (Week 3)](/2026-05/week-3/prompt-caching/) — the biggest single lever on LLM cost.

<!-- SOURCES: https://cloud.google.com/billing/docs/how-to/budgets , https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html -->
