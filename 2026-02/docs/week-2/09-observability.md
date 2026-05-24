id: observability

# Observability

**Observability** = knowing what your system is doing from the outside, without guessing. It has three pillars:

| Pillar | Tool | Answers |
|--------|------|---------|
| **Metrics** | Prometheus | "How many requests/sec? What's p99 latency? Error rate?" |
| **Traces** | OpenTelemetry | "Why did this request take 500ms? Which step was slow?" |
| **Logs** | Loki + structlog | "What happened exactly at 3:47pm?" |

---

## Prometheus Metrics

Prometheus **scrapes** your app every 15 seconds, pulling metrics from a `/metrics` endpoint. You define what to measure.

```bash
uv add prometheus-fastapi-instrumentator
```

### Auto-Instrument FastAPI

```python title="main.py"
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

# Auto-add metrics for all routes: request count, duration, response size
Instrumentator().instrument(app).expose(app)
```

This adds `/metrics` endpoint with:
- `http_requests_total` — requests by method, path, status code
- `http_request_duration_seconds` — histogram of response times
- `http_request_size_bytes` — request payload sizes
- `http_response_size_bytes` — response sizes

### Custom Metrics

```python
from prometheus_client import Counter, Histogram, Gauge
import time

# Count specific events
llm_calls = Counter(
    "llm_api_calls_total",
    "Total LLM API calls",
    ["model", "status"],    # labels for filtering
)

# Measure durations
llm_duration = Histogram(
    "llm_response_duration_seconds",
    "LLM response time",
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, float("inf")],
)

# Track current state
active_users = Gauge("active_users_total", "Currently active users")

@app.post("/generate")
async def generate(prompt: str):
    start = time.time()
    try:
        result = await call_openai(prompt)
        llm_calls.labels(model="gpt-4o", status="success").inc()
        return {"result": result}
    except Exception as e:
        llm_calls.labels(model="gpt-4o", status="error").inc()
        raise
    finally:
        llm_duration.observe(time.time() - start)
```

---

## OpenTelemetry Traces

Traces show the **journey of a single request** through your system — which functions were called, how long each took, what errors occurred.

```bash
uv add opentelemetry-api opentelemetry-sdk \
       opentelemetry-instrumentation-fastapi \
       opentelemetry-exporter-otlp-proto-grpc
```

```python title="telemetry.py"
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

def setup_telemetry(app, service_name: str = "tds-api"):
    # Create tracer provider
    provider = TracerProvider()

    # Export to Jaeger or any OTLP receiver
    exporter = OTLPSpanExporter(endpoint="http://localhost:4317")
    provider.add_span_processor(BatchSpanProcessor(exporter))

    trace.set_tracer_provider(provider)

    # Auto-instrument FastAPI (adds spans for all requests)
    FastAPIInstrumentor.instrument_app(app)

    return trace.get_tracer(service_name)
```

```python title="main.py"
from telemetry import setup_telemetry
from opentelemetry import trace

app = FastAPI()
tracer = setup_telemetry(app)

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    with tracer.start_as_current_span("fetch-user") as span:
        span.set_attribute("user.id", user_id)

        with tracer.start_as_current_span("db-query"):
            user = await db.get_user(user_id)   # sub-span for DB

        if not user:
            span.set_attribute("error", True)
            raise HTTPException(404, "Not found")

        with tracer.start_as_current_span("cache-set"):
            await cache.set(f"user:{user_id}", user)  # sub-span for cache

        return user
```

The trace shows: `fetch-user (45ms) → db-query (40ms) + cache-set (5ms)`

---

## Docker Compose Stack

The full observability stack in Compose:

```yaml title="docker-compose.yml"
version: "3.9"

services:
  # Your FastAPI app
  api:
    build: .
    ports: ["8000:8000"]
    environment:
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317

  # Collects and routes telemetry
  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    ports:
      - "4317:4317"     # OTLP gRPC
      - "4318:4318"     # OTLP HTTP
    volumes:
      - ./otel-config.yaml:/etc/otelcol-contrib/config.yaml

  # Metrics storage
  prometheus:
    image: prom/prometheus:latest
    ports: ["9090:9090"]
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  # Visualization
  grafana:
    image: grafana/grafana:latest
    ports: ["3000:3000"]
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources

  # Trace storage (Jaeger)
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"   # Jaeger UI

volumes:
  prometheus_data:
  grafana_data:
```

```yaml title="prometheus.yml"
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "fastapi"
    static_configs:
      - targets: ["api:8000"]
    metrics_path: "/metrics"
```

---

## Grafana Dashboard Setup

1. Open `http://localhost:3000` (admin/admin)
2. Add Prometheus data source: `http://prometheus:9090`
3. Create a new dashboard with these panels:

**Request Rate (PromQL):**
```promql
rate(http_requests_total[5m])
```

**Error Rate (PromQL):**
```promql
rate(http_requests_total{status=~"5.."}[5m])
/ rate(http_requests_total[5m]) * 100
```

**P99 Latency (PromQL):**
```promql
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))
```

**Active Requests:**
```promql
http_requests_active
```

---

## Alert Rules

```yaml title="prometheus-rules.yml"
groups:
  - name: api-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.path }}"

      - alert: SlowResponses
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 1.0
        for: 5m
        annotations:
          summary: "P99 latency above 1 second"
```

---

## Video Reference

[![Prometheus and Grafana Tutorial](https://img.youtube.com/vi/h4Sl21AKiDg/0.jpg)](https://youtu.be/h4Sl21AKiDg "Prometheus and Grafana Tutorial")

---

## Summary

```
Your API ──→ /metrics endpoint ←── Prometheus (scrapes every 15s)
         ──→ OTLP traces      ──→ Jaeger (trace visualization)
                                      ↓
                                  Grafana (dashboards + alerts)
```

| Tool | What It Does |
|------|-------------|
| `prometheus-fastapi-instrumentator` | Auto-add metrics to all routes |
| `prometheus_client` | Define custom counters/histograms/gauges |
| `opentelemetry` | Trace individual request journeys |
| Prometheus | Scrape and store time-series metrics |
| Grafana | Visualize metrics, set up alerts |
| Jaeger | Visualize traces (waterfall view) |