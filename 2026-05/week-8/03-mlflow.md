# MLflow

[![MLflow Python Tutorial — ML Model Experiment Tracking](https://img.youtube.com/vi/kn51WgTTjCw/0.jpg)](https://www.youtube.com/watch?v=kn51WgTTjCw)

> **“Best model” means nothing if nobody can answer: best compared with which run, trained on which data, with which parameters, and where is the model file? MLflow turns that scavenger hunt into an experiment record.**

⏱ ~12 min read · ~25 min hands-on
🔗 needs: Python + `uv` · [Logging & Testing](/2026-05/week-2/08-logging-testing/) · [Cloud Storage for ML](/2026-05/week-8/01-cloud-storage-ml/)

## The mental model

MLflow is an open-source platform for the ML lifecycle. Start with **Tracking**: a local API and web UI that record what happened in each training attempt.

```text
experiment: "wine-baseline"
├── run: depth-2
│   ├── parameters: n_estimators=100, max_depth=2
│   ├── metrics: accuracy=0.91
│   └── artifacts: trained model, plots, data summary
└── run: depth-5
    ├── parameters: n_estimators=100, max_depth=5
    ├── metrics: accuracy=0.94
    └── artifacts: trained model, plots, data summary
```

| Word | Meaning | Think of it as |
|---|---|---|
| **Experiment** | a named collection of related attempts | project folder |
| **Run** | one execution of training code | one lab attempt |
| **Parameter** | a chosen setting, e.g. learning rate | recipe setting |
| **Metric** | a measured number, e.g. F1 score | report-card result |
| **Artifact** | output file: model, plot, CSV, JSON | evidence attached to the run |

MLflow records evidence; it does not choose the right label, prevent data leakage, or make a poor model good. Treat it as the lab notebook for machine learning.

## Try it — compare three classifiers locally

This first experiment runs entirely on your machine. It uses scikit-learn's built-in Wine dataset so you can focus on tracking, not data download. Create an empty folder and use two terminals.

### 1. Install the tools and start the UI

```bash
mkdir -p mlflow-wine && cd mlflow-wine
uv init
uv add mlflow scikit-learn

# Terminal 1: leave this running
uv run mlflow server --host 127.0.0.1 --port 5000
```

Open <http://127.0.0.1:5000>. The page may be empty until you run the training script. Binding to `127.0.0.1` keeps this development UI private to your computer.

### 2. Create `train.py`

This makes three runs. Every run logs the same dataset description and code purpose, but varies `max_depth`. That makes comparison fair.

```python
import mlflow
import mlflow.sklearn
from sklearn.datasets import load_wine
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import train_test_split


# One experiment groups comparable attempts.
mlflow.set_tracking_uri("http://127.0.0.1:5000")
mlflow.set_experiment("wine-baseline")

wine = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    wine.data, wine.target, test_size=0.25, random_state=42, stratify=wine.target
)

for max_depth in [2, 4, 8]:
    with mlflow.start_run(run_name=f"depth-{max_depth}"):
        params = {
            "n_estimators": 100,
            "max_depth": max_depth,
            "random_state": 42,
        }
        model = RandomForestClassifier(**params)
        model.fit(X_train, y_train)

        predictions = model.predict(X_test)
        metrics = {
            "accuracy": accuracy_score(y_test, predictions),
            "f1_weighted": f1_score(y_test, predictions, average="weighted"),
        }

        mlflow.log_params(params)
        mlflow.log_metrics(metrics)
        mlflow.set_tags({
            "dataset": "scikit-learn wine",
            "purpose": "first MLflow tracking exercise",
        })
        model_info = mlflow.sklearn.log_model(
            sk_model=model,
            name="model",
            input_example=X_test[:3],
        )

        print(
            f"depth={max_depth}: accuracy={metrics['accuracy']:.3f} "
            f"model={model_info.model_uri}"
        )
```

### 3. Train and compare

In **Terminal 2**, with the same folder still open:

```bash
uv run train.py
```

Refresh the UI. Open `wine-baseline` and compare the three runs by accuracy/F1, parameters, tags, and artifacts. The goal is not to get an impressive score—this tiny dataset will often make multiple settings look similar. The goal is to make every result explainable.

### 4. Load a logged model back

Add this to the end of `train.py` if you want to prove the artifact is usable:

```python
loaded_model = mlflow.sklearn.load_model(model_info.model_uri)
print("first three predictions:", loaded_model.predict(X_test[:3]))
```

`model_info` belongs to the last run in the loop. In a real project, select a run deliberately using a metric and validation policy—never merely “whichever ran last.”

## Logging manually vs. automatically

The example uses explicit logging because it teaches what evidence matters. For common frameworks, MLflow can log much of this automatically.

```python
import mlflow
import mlflow.sklearn

mlflow.set_tracking_uri("http://127.0.0.1:5000")
mlflow.set_experiment("wine-autolog")
mlflow.sklearn.autolog()

# model.fit(X_train, y_train) now logs parameters, metrics, and a model.
```

Autologging is a useful start, not a substitute for context. Add a data version/URI, a Git commit, an owner, and a clear run name. Log the evaluation metric that governs the real decision.

## Local first; shared later

| Stage | Tracking setup | Good for |
|---|---|---|
| Learning / solo experiment | MLflow server + local files | fast iteration on one computer |
| Small team | shared tracking server + database + shared artifact storage | comparison and collaboration |
| Production | authenticated server, durable metadata DB, private object storage, backups | auditable, reliable operations |

When you move beyond local work, a common design is: MLflow metadata in a database and large artifacts in [cloud storage](/2026-05/week-8/01-cloud-storage-ml/). Do not expose a tracking server publicly with no authentication, and do not commit API tokens to the project.

## What to record in every serious run

| Record | Why it matters |
|---|---|
| Dataset name, version, and `gs://` URI/checksum | You can reproduce the input rather than guessing from a filename. |
| Code Git commit and dependency lockfile | A model may change even when hyperparameters do not. |
| Parameters | You can compare recipe choices. |
| Metrics on a held-out set | You can select with evidence, not memory. |
| Artifacts: model, plots, confusion matrix, predictions | You can inspect what the number hides. |
| Tags: owner, environment, purpose | Teammates can find the run later. |

> ⚖️ **Do not log raw customer data, API keys, access tokens, or personally identifying information.** Metrics and samples can leak too. Decide what is safe before an experiment uploads it.

## When it fails

| Symptom | Likely cause | Fix |
|---|---|---|
| Browser cannot open the UI | Server is not running, wrong port, or you are in Colab/remote machine | Start `uv run mlflow server --port 5000`; use port forwarding or a hosted service for remote environments. |
| Runs do not appear in the UI | Script and UI point at different tracking URIs | Set `mlflow.set_tracking_uri(...)` explicitly and keep one URL in config/environment. |
| A model artifact is missing | Training crashed before `log_model`, or the artifact path is ephemeral | Log after successful training; use durable artifact storage for shared/production work. |
| “Best” run cannot be reproduced | Data/code versions were never logged | Record data URI/checksum, Git commit, package versions, seed, and split. |
| UI is reachable from the internet | Bound to all interfaces or deployed without auth | Bind locally while learning; add authentication and network controls before sharing. |

## Your turn (≈25 min)

1. Run the three-depth experiment and find the highest F1 score in the UI.
2. Change `n_estimators` to `20`, rerun it, and compare speed and metrics—not just one number.
3. Add a tag containing your Git commit (`git rev-parse --short HEAD`) and a parameter that names the data split.
4. Log one extra artifact such as a JSON file describing the features.
5. In one sentence: explain why the run with the highest validation metric may still be the wrong model to deploy.

## Checklist

- [ ] I can explain experiment, run, parameter, metric, and artifact.
- [ ] I can start a local tracking UI and connect code to it.
- [ ] I compare runs with the same evaluation split and metric.
- [ ] I log enough data/code context to reproduce a run.
- [ ] I know not to expose a local tracking server or log secrets/PII.

## Go deeper

- [MLflow Tracking Quickstart](https://mlflow.org/docs/latest/ml/getting-started/quickstart/) — the official first model tutorial.
- [MLflow Tracking concepts](https://mlflow.org/docs/latest/ml/tracking/) — runs, experiments, and artifact stores.
- [MLflow scikit-learn integration](https://mlflow.org/docs/latest/ml/traditional-ml/sklearn) — autologging and model logging.
- [Remote MLflow Tracking Server](https://mlflow.org/docs/latest/ml/tracking/tutorials/remote-server/) — the next step for collaboration.

<!-- SOURCES: https://mlflow.org/docs/latest/ml/getting-started/quickstart/ , https://mlflow.org/docs/latest/ml/tracking/ , https://mlflow.org/docs/latest/ml/traditional-ml/sklearn , https://mlflow.org/docs/latest/ml/tracking/tutorials/remote-server/ -->
