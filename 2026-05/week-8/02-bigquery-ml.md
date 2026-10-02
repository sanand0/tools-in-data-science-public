# BigQuery ML

[![BigQuery ML: Machine Learning with Standard SQL](https://img.youtube.com/vi/6Kska20zQO4/0.jpg)](https://www.youtube.com/watch?v=6Kska20zQO4)

> **If your data is already in a warehouse, copying it into a notebook just to train a baseline is often the slowest and riskiest part of the job. BigQuery ML lets SQL create the first model where the table already lives.**

⏱ ~12 min read · ~30 min hands-on
🔗 needs: SQL basics · [Cloud Storage for ML](/2026-05/week-8/01-cloud-storage-ml/) · [Cost Alerting & Budgets](/2026-05/week-7/09-cost-alerting/)

## What BigQuery ML is—and is not

BigQuery ML (BQML) trains and runs several kinds of machine-learning model with SQL. `CREATE MODEL` is like `CREATE TABLE`, except the result is a trained model stored in your BigQuery dataset.

```text
table / SQL query → CREATE MODEL → ML.EVALUATE → ML.PREDICT → table or dashboard
```

It is ideal when the data is structured and already queryable in BigQuery: churn, demand, fraud flags, customer segmentation, forecasting, and a strong baseline before a custom Python workflow.

It is not a replacement for every ML tool. Use Python/Vertex AI/etc. when you need custom feature engineering code, specialised deep learning, GPU training, or an interactive online prediction service. BQML is powerful because the **data stays in BigQuery**, not because SQL makes modelling magical.

## Four words to keep straight

| Term | Meaning | In the example |
|---|---|---|
| **Feature** | input that the model may use | `body_mass_g`, `island` |
| **Label** | answer the model should learn to predict | `species` |
| **Train set** | rows used to fit model parameters | about 80% of rows |
| **Test set** | held-out rows used to judge the model | remaining rows |

Never evaluate on the same rows you used to train. A model can memorise a training set and still fail on new data.

## Try it — predict penguin species with SQL

This uses the public Palmer Penguins table, so there is no file upload. It trains a multiclass logistic-regression model from a few physical measurements. The result is intentionally small: learn the workflow before reaching for a complex model.

### 1. Create a dataset for your model

Open the [BigQuery SQL workspace](https://console.cloud.google.com/bigquery), replace `YOUR_PROJECT` everywhere below, and run this first query. The public table is in the US multi-region, so the dataset must also be `US`.

```sql
CREATE SCHEMA IF NOT EXISTS `YOUR_PROJECT.tds_ml`
OPTIONS(location = "US");
```

> 💸 **BigQuery is not automatically free.** Queries and BQML training can be billable. Before running a new query, look at BigQuery's “This query will process…” estimate. Use a project budget and avoid `SELECT *` on large tables.

### 2. Inspect the data instead of guessing

```sql
SELECT
  species,
  island,
  culmen_length_mm,
  culmen_depth_mm,
  flipper_length_mm,
  body_mass_g,
  sex
FROM `bigquery-public-data.ml_datasets.penguins`
WHERE species IS NOT NULL
LIMIT 10;
```

Notice the rows and missing values. The training query filters rows that lack a label or a feature. That is a simple choice for a first model—not a universal missing-data strategy.

### 3. Train on one split

`FARM_FINGERPRINT` gives a deterministic pseudo-random split: the same input data produces the same train/test division. The test-selection expression is **not** included in `SELECT`, so it cannot leak into the model as a feature.

```sql
CREATE OR REPLACE MODEL `YOUR_PROJECT.tds_ml.penguin_species_model`
OPTIONS(
  model_type = 'LOGISTIC_REG',
  input_label_cols = ['species'],
  auto_class_weights = TRUE
) AS
SELECT
  species,
  island,
  culmen_length_mm,
  culmen_depth_mm,
  flipper_length_mm,
  body_mass_g,
  sex
FROM `bigquery-public-data.ml_datasets.penguins`
WHERE species IS NOT NULL
  AND island IS NOT NULL
  AND culmen_length_mm IS NOT NULL
  AND culmen_depth_mm IS NOT NULL
  AND flipper_length_mm IS NOT NULL
  AND body_mass_g IS NOT NULL
  AND sex IS NOT NULL
  AND MOD(ABS(FARM_FINGERPRINT(CONCAT(
    CAST(culmen_length_mm AS STRING), '|',
    CAST(culmen_depth_mm AS STRING), '|',
    CAST(flipper_length_mm AS STRING), '|',
    CAST(body_mass_g AS STRING), '|', island, '|', sex
  ))), 10) < 8;
```

BigQuery ML treats numeric columns as numeric features and string columns as categorical features. `input_label_cols` tells it not to use `species` as an input—it is the answer to learn.

### 4. Evaluate on held-out rows

Run the same cleaning and split logic, but choose the other 20%. Start with the metrics; do not declare a model “good” merely because `CREATE MODEL` succeeded.

```sql
SELECT *
FROM ML.EVALUATE(
  MODEL `YOUR_PROJECT.tds_ml.penguin_species_model`,
  (
    SELECT
      species,
      island,
      culmen_length_mm,
      culmen_depth_mm,
      flipper_length_mm,
      body_mass_g,
      sex
    FROM `bigquery-public-data.ml_datasets.penguins`
    WHERE species IS NOT NULL
      AND island IS NOT NULL
      AND culmen_length_mm IS NOT NULL
      AND culmen_depth_mm IS NOT NULL
      AND flipper_length_mm IS NOT NULL
      AND body_mass_g IS NOT NULL
      AND sex IS NOT NULL
      AND MOD(ABS(FARM_FINGERPRINT(CONCAT(
        CAST(culmen_length_mm AS STRING), '|',
        CAST(culmen_depth_mm AS STRING), '|',
        CAST(flipper_length_mm AS STRING), '|',
        CAST(body_mass_g AS STRING), '|', island, '|', sex
      ))), 10) >= 8
  )
);
```

For classification, look at `accuracy`, `precision`, `recall`, `f1_score`, and `roc_auc` where applicable. Which matters most depends on the error cost: a fraud detector and a marketing classifier should not be judged by the same metric.

### 5. Predict new rows

The input to `ML.PREDICT` has every **feature** but no `species` label. `predicted_species` is the model's output; the probability array helps you see confidence.

```sql
SELECT
  predicted_species,
  predicted_species_probs,
  island,
  culmen_length_mm,
  culmen_depth_mm,
  flipper_length_mm,
  body_mass_g,
  sex
FROM ML.PREDICT(
  MODEL `YOUR_PROJECT.tds_ml.penguin_species_model`,
  (
    SELECT
      'Biscoe' AS island,
      46.0 AS culmen_length_mm,
      18.0 AS culmen_depth_mm,
      190.0 AS flipper_length_mm,
      3800.0 AS body_mass_g,
      'FEMALE' AS sex
  )
);
```

In a real pipeline, replace the one-row `SELECT` with a clean feature table. Write predictions to a table only when you know who will use them and how long they must be retained.

## From query to useful model

| Step | Question to ask |
|---|---|
| Define the label | What decision/quantity will this predict, and when is the true answer known? |
| Build features | What information exists at prediction time? Exclude future information and IDs that let the model cheat. |
| Split data | Does the split mimic reality? For time data, test on later dates—not random future rows. |
| Evaluate | Which mistakes are costly? Compare against a naive baseline. |
| Predict | Can the downstream system use the output safely, with a threshold and human review if needed? |
| Monitor | Has the data distribution or prediction quality changed after deployment? |

### Leakage: the beginner trap that produces “great” models

If you predict whether an order will be refunded, a column filled in *after* refund approval is forbidden—even if it gives 99% accuracy. The same applies to a label hidden inside an ID or a feature computed using the full dataset before splitting. The question is not “is this column available in the table?” but **“would I know it at the moment I make the prediction?”**

## When it fails

| Symptom | Likely cause | Fix |
|---|---|---|
| `Not found: Dataset` or location error | The model dataset and source table are in incompatible locations | Create the dataset in the source table's region; this lesson uses `US`. |
| Training query succeeds but metrics disappoint | Features have little predictive signal, split is realistic, or baseline is already strong | Inspect labels/features, compare a simple baseline, then improve data before adding complexity. |
| Suspiciously excellent score | Leakage or evaluation on training rows | Revisit every feature and make a held-out/time-based test set. |
| Query costs grow | Scanning too many bytes, repeated `SELECT *`, or accidental reruns | Select needed columns, partition/filter tables, set a bytes-billed limit and budget. |
| Prediction query errors | Feature names/types differ from training | Keep feature SQL in a view or shared query; test one row first. |

## Your turn (≈30 min)

1. Create your `tds_ml` dataset and inspect 10 public penguin rows.
2. Train the model and record the evaluation metrics in a note or experiment tracker.
3. Make three predictions, including one row that is close to the boundary between two species.
4. Remove one feature, retrain under a new model name, and compare metrics. Did the simpler model really become worse?
5. Write one sentence identifying a feature that would be leakage in a prediction problem you care about.

## Checklist

- [ ] I can identify features, label, train set, and test set.
- [ ] I can use `CREATE MODEL`, `ML.EVALUATE`, and `ML.PREDICT`.
- [ ] I inspected the query-cost estimate before running it.
- [ ] My test rows are separate from my training rows.
- [ ] I can explain why a high metric does not prove a useful model.

## Go deeper

- [Create a model in BigQuery ML with SQL](https://cloud.google.com/bigquery/docs/create-machine-learning-model) — official end-to-end logistic-regression tutorial.
- [`CREATE MODEL` reference](https://cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create) — supported model types and options.
- [BigQuery ML pricing](https://cloud.google.com/bigquery/pricing#bqml) — check before scaling this up.
- [BigQuery ML codelab](https://codelabs.developers.google.com/codelabs/bqml-intro) — a browser-based follow-along.

<!-- SOURCES: https://cloud.google.com/bigquery/docs/create-machine-learning-model , https://cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-create , https://cloud.google.com/bigquery/pricing#bqml , https://codelabs.developers.google.com/codelabs/bqml-intro -->
