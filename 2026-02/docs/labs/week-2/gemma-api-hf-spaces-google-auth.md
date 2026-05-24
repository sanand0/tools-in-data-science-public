# Lab — Publish a Gemma model API on HuggingFace Spaces with Google Auth

## Objective
Deploy a text generation API using a local LLM framework (like Ollama or transformers) to Hugging Face Spaces, and protect the endpoint using Google OAuth.

## Requirements
1. Create a FastAPI application that serves a generation endpoint (e.g., `/generate`).
2. Integrate Google OAuth 2.0 so that only authenticated users can access the endpoint.
3. Containerize the application using Docker.
4. Deploy the Docker container to a Hugging Face Space.

## Deliverables
- Link to your Hugging Face Space.
- The `Dockerfile` and `main.py` code.
- A brief explanation of how you configured the OAuth credentials.