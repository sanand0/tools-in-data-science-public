# Capstone — BS Degree Chatbot

## Objective
Build a production-grade RAG chatbot that answers user questions about the IIT Madras BS Data Science programme using official documentation.

## Requirements
1. Scrape academics, courses, and qualifier pages from the official IIT Madras BS program site.
2. Build an ingestion pipeline using a vector database (e.g., Qdrant) with contextual chunking.
3. Implement a hybrid retrieval strategy combining dense vector embeddings and BM25 sparse index, merged via RRF and an optional reranker.
4. Build a FastAPI backend with a `/chat` endpoint and a Streamlit-based UI.
5. Setup a RAGAS evaluation suite to measure retrieval and generation accuracy across different retrieval strategies.

## Deliverables
- Source code.
- Link to the live Streamlit chatbot application.
- RAGAS evaluation report comparing Naive, Hybrid, and Contextual RAG.

---
