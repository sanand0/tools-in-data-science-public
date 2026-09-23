# Cloud Storage for ML

[![Create and use a Cloud Storage bucket](https://img.youtube.com/vi/F4XFrHhhLow/0.jpg)](https://www.youtube.com/watch?v=F4XFrHhhLow)

> **A model is not a single file. It is a chain of data, code, weights, metrics, and predictions. Cloud storage gives that chain a home that is not your laptop.**

⏱ ~10 min read · ~25 min hands-on
🔗 needs: [Config Management](/2026-05/week-2/05-config-management/) · [Cost Alerting & Budgets](/2026-05/week-7/09-cost-alerting/)

## The mental model

Google Cloud Storage (GCS) is **object storage**. A **bucket** is a globally named container; an **object** is a file inside it. `gs://` is GCS's equivalent of a filesystem path:

```text
gs://tds-your-name-2026/
├── data/
│   ├── raw/          # immutable source files
│   └── processed/    # reproducible derived files
├── models/           # trained weights / model packages
├── runs/             # charts, predictions, evaluation reports
└── README.md         # what lives here, who owns it, when to delete it
```

Folders above are a convenient **name prefix**, not real directories. GCS stores the object named `data/raw/train.csv`; it does not create a folder first.

| Store it in | Good for | Not good for |
|---|---|---|
| Git | code, small configs, model cards | large data, weights, secrets |
| GCS | datasets, images, model artifacts, batch outputs | querying rows with SQL |
| BigQuery | structured, queryable tables and features | arbitrary model files |
| a database | app state and frequent small reads/writes | a multi-GB training dataset |

**Rule of thumb:** Git records *how* to make an artifact; GCS stores the artifact itself. Put the GCS URI, data version, and preprocessing code in Git.

## Why ML projects need it

Local paths such as `/Users/me/Downloads/final_final.csv` make a project impossible to reproduce. A shared object URI lets a notebook, a training job, and a deployed service use the same input or model artifact.

GCS also fits the common ML hand-off:

```text
collect data → gs://.../data/raw/ → clean/train → gs://.../models/ → serve or batch-score
```

It does **not** make data correct or safe. A bucket happily preserves the wrong CSV, an accidentally public file, or a model with no explanation. Naming, access control, and lifecycle rules are your job.

## Try it — make a small ML artifact store

### 1. Set a project and create a bucket

Install and sign in to the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install), then choose a GCP project that has billing enabled. Bucket names are global across GCS, so include a unique suffix.

```bash
export PROJECT_ID="your-gcp-project-id"
export BUCKET="tds-${USER,,}-ml-2026-unique-suffix"

gcloud config set project "$PROJECT_ID"
gcloud storage buckets create "gs://$BUCKET" \
  --location=asia-south1 \
  --uniform-bucket-level-access
```

Use a region near your compute. Keeping a training job and its bucket in the same region reduces latency and can avoid unnecessary network charges. `--uniform-bucket-level-access` means access is granted with IAM roles on the bucket, rather than ad-hoc permissions on individual files.

> ⚠️ **Never train on or upload personal/sensitive data to a course bucket without permission.** Do not make a bucket public just to fix an `AccessDenied` error. Grant the smallest needed IAM role to the person or service account that needs it.

### 2. Upload a tiny, versioned dataset

Make two small files locally. In a real project these may be images, Parquet files, JSONL prompts, or a model checkpoint.

```bash
mkdir -p data/raw data/processed models
printf 'hours_studied,passed\n2,0\n6,1\n' > data/raw/train.csv
printf 'hours_studied,passed\n4,1\n' > data/raw/test.csv

# Keep a release/date in the path. Do not overwrite raw data silently.
gcloud storage cp --recursive data/raw "gs://$BUCKET/data/raw/v1/"
gcloud storage ls --recursive "gs://$BUCKET/data/"
```

You should see two `gs://.../data/raw/v1/...` objects. Downloading is symmetric:

```bash
gcloud storage cp "gs://$BUCKET/data/raw/v1/train.csv" ./data/raw/train-copy.csv
```

### 3. Upload the model *and* its evidence

An artifact without context is usually useless six weeks later. Store a model alongside a short metrics file and the exact data URI that produced it.

```bash
printf 'pretend model bytes\n' > models/baseline-v1.joblib
printf '%s\n' \
  "data: gs://$BUCKET/data/raw/v1/" \
  'metric: accuracy=0.83' \
  'code_commit: paste-a-git-commit-here' > models/baseline-v1.metrics.txt

gcloud storage cp models/baseline-v1.joblib "gs://$BUCKET/models/baseline/v1/"
gcloud storage cp models/baseline-v1.metrics.txt "gs://$BUCKET/models/baseline/v1/"
```

Later, [MLflow](/2026-05/week-8/03-mlflow/) can record this metadata automatically; the principle stays the same.

## Read and write from Python

The CLI is excellent for setup and debugging. Application code usually uses a client library and authenticates as its runtime service account, not with a downloaded key file.

```bash
uv add google-cloud-storage
```

```python
from google.cloud import storage

bucket_name = "tds-your-name-ml-2026-unique-suffix"
source_path = "models/baseline-v1.joblib"
object_name = "models/baseline/v1/baseline-v1.joblib"

client = storage.Client()
bucket = client.bucket(bucket_name)

# Upload
blob = bucket.blob(object_name)
blob.upload_from_filename(source_path)
print(f"uploaded: gs://{bucket_name}/{object_name}")

# Download to a different local path
blob.download_to_filename("models/downloaded-baseline-v1.joblib")
```

Run this after `gcloud auth application-default login` on your own computer. In Cloud Run, Vertex AI, or another GCP service, use a service account with a narrowly scoped Storage IAM role instead of local user credentials.

## Make storage reproducible, safe, and cheap

| Need | Practical habit |
|---|---|
| Reproduce a training run | Write immutable data under `data/raw/v1/`, `v2/`, … and record the full `gs://` URI in the run metadata. |
| Recover from an overwrite/delete | Enable [Object Versioning](https://cloud.google.com/storage/docs/object-versioning) on important buckets. It protects you, but old versions still cost money. |
| Share a model | Grant `Storage Object Viewer` to a specific service account or group—not `allUsers`. |
| Avoid surprise bills | Add a lifecycle rule that deletes temporary exports/checkpoints; set a project budget first. |
| Keep data understandable | Put a `README.md` or `manifest.json` beside each dataset version: source, schema, licence, date, owner, and PII status. |

Avoid overwriting `data/raw/latest.csv`. A `latest` pointer is fine for convenience, but the experiment must record an immutable version such as `data/raw/2026-08-26/` or an object generation number.

## When it fails

| Symptom | Likely cause | Fix |
|---|---|---|
| `AccessDeniedException` | Your user/service account lacks a Storage IAM role | Check the active account with `gcloud auth list`; grant the minimum bucket-level role. Do not make the bucket public. |
| Bucket creation says the name exists | Bucket names are global | Change the suffix; use lowercase names. |
| Training cannot find a file | Local path was used instead of a `gs://` URI, or the prefix is wrong | List the exact object with `gcloud storage ls --recursive gs://BUCKET/PREFIX`. |
| A run cannot be reproduced | Source data was overwritten or untracked | Use versioned prefixes and record URI, code commit, and preprocessing version. |
| Bill is larger than expected | Old checkpoints/versions, cross-region transfer, or abandoned data | Inspect prefixes, add lifecycle rules, and keep storage and compute in one region. |

## Your turn (≈25 min)

1. Create a bucket with uniform bucket-level access.
2. Upload one raw dataset under a versioned path and list it from the CLI.
3. Upload a model artifact plus a one-file manifest containing its input URI and one metric.
4. Download the artifact to a different path and compare its checksum with the original (`sha256sum`).
5. Before leaving the project, set a lifecycle rule or delete the test bucket and its objects. Do not leave unnamed course experiments accumulating.

## Checklist

- [ ] I can explain a bucket, object, and `gs://` URI.
- [ ] Raw data, derived data, and models have different prefixes.
- [ ] My training run records an immutable data URI and code version.
- [ ] My bucket is private and uses IAM, not public object URLs.
- [ ] I know what will delete temporary files and when.

## Go deeper

- [Cloud Storage overview](https://cloud.google.com/storage/docs/introduction) — buckets, objects, and storage classes.
- [`gcloud storage` command reference](https://cloud.google.com/sdk/gcloud/reference/storage) — the modern CLI used above.
- [Object Versioning](https://cloud.google.com/storage/docs/object-versioning) — recovery from accidental replacement/deletion.
- [Cloud Storage IAM](https://cloud.google.com/storage/docs/access-control/iam) — least-privilege roles.

<!-- SOURCES: https://cloud.google.com/storage/docs/introduction , https://cloud.google.com/sdk/gcloud/reference/storage , https://cloud.google.com/storage/docs/object-versioning , https://cloud.google.com/storage/docs/access-control/iam -->
