# Lab — Add full observability to a FastAPI service

## Objective
Instrument a FastAPI application to export metrics and traces, and build a Grafana dashboard to monitor it.

## Requirements
1. Instrument an existing FastAPI app using the OpenTelemetry Python SDK.
2. Export metrics (request count, latency) to Prometheus.
3. Export traces to Jaeger or a similar tracing backend.
4. Run FastAPI, Prometheus, and Grafana locally using Docker Compose.
5. Create a Grafana dashboard visualizing API request rates and P99 latency.

## Deliverables
- The `docker-compose.yml` file.
- A screenshot of your Grafana dashboard under load (use a tool like `ab` or `locust` to generate traffic).