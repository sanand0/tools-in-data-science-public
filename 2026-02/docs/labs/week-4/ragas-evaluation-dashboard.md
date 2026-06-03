import Details from '@theme/Details';

# Lab: RAGAS Evaluation Dashboard

**Goal:** Build an interactive Streamlit dashboard that runs RAGAS evaluation across three retrieval strategies side-by-side.

**What you'll build:**

```
📊 RAG Evaluation Dashboard
├── Strategy 1: Naive RAG (dense only)
├── Strategy 2: Hybrid RAG (dense + BM25 + RRF)
├── Strategy 3: Contextual RAG (Anthropic's chunk context injection)
└── RAGAS Scores: Faithfulness | Context Recall | Factual Correctness
```

**Time:** 3–5 hours  
**Difficulty:** Intermediate

---

## Prerequisites

- Week 4 topics: Chunking, Vector DBs, Hybrid Search, RAGAS Evaluation, Contextual Retrieval
- OpenAI API key + Anthropic API key
- Python 3.11+

---

## Project Structure

```
week4-rag-lab/
├── .env
├── data/
│   └── sample_docs.txt        # Test documents
├── src/
│   ├── naive_rag.py
│   ├── hybrid_rag.py
│   ├── contextual_rag.py
│   ├── evaluator.py
│   └── utils.py
├── dashboard.py               # Streamlit app
└── pyproject.toml
```

---

## Step-by-Step Instructions

<Details summary="Step 1 — Project Setup">

```bash
# Create project
uv init week4-rag-lab
cd week4-rag-lab

# Install dependencies
uv add openai anthropic langchain langchain-openai chromadb \
  rank_bm25 sentence-transformers ragas streamlit \
  pandas matplotlib python-dotenv

# Create folders
mkdir -p data src
```

Create `.env`:
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

Create `data/sample_docs.txt` — paste any technical document you want to test with. For this lab, you can use course content, Wikipedia articles about AI, or any domain-specific text. The file should be at least 2000 words for meaningful chunking.

```python
# data/sample_docs.txt (example excerpt)
"""
Retrieval-Augmented Generation (RAG) Overview
...
"""
```

</Details>

<Details summary="Step 2 — Utility Functions (src/utils.py)">

```python
# src/utils.py
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

def load_documents(filepath: str) -> list[str]:
    """Load documents from a text file, split by double newlines."""
    with open(filepath) as f:
        content = f.read()
    
    # Split on double newline (paragraph boundaries)
    docs = [p.strip() for p in content.split("\n\n") if p.strip()]
    print(f"Loaded {len(docs)} document paragraphs")
    return docs

def generate_rag_answer(query: str, context_chunks: list[str]) -> str:
    """Standard RAG answer generation."""
    context = "\n\n".join(
        f"[{i+1}] {chunk}" for i, chunk in enumerate(context_chunks)
    )
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Answer the question using ONLY the provided context. "
                    "If the answer isn't in the context, say 'I don't know.' "
                    "Be concise and accurate."
                )
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {query}"
            }
        ],
        temperature=0,
        max_tokens=300,
    )
    
    return response.choices[0].message.content

def create_test_questions(documents: list[str]) -> list[dict]:
    """
    Generate test Q&A pairs from your documents using GPT.
    In production: create these manually for your domain.
    """
    combined = "\n\n".join(documents[:5])  # Use first 5 paragraphs
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Given the following documents, create 5 question-answer pairs "
                    "where the answer is explicitly stated in the text. "
                    "Return JSON: [{\"query\": str, \"ground_truth\": str}]. "
                    "Make questions specific and answerable from the text."
                )
            },
            {"role": "user", "content": combined}
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    
    import json
    data = json.loads(response.choices[0].message.content)
    
    # Handle both {"questions": [...]} and direct list
    if isinstance(data, list):
        return data
    return data.get("questions", data.get("pairs", list(data.values())[0]))
```

</Details>

<Details summary="Step 3 — Naive RAG (src/naive_rag.py)">

```python
# src/naive_rag.py
"""
Naive RAG: Simple dense vector search with no augmentation.
This is the baseline all other strategies are compared against.
"""

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
from src.utils import generate_rag_answer

def build_naive_vectorstore(
    documents: list[str],
    chunk_size: int = 500,
    chunk_overlap: int = 50,
    collection_name: str = "naive_rag",
) -> Chroma:
    """Build a standard Chroma vectorstore from documents."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
    )
    
    all_chunks = []
    for doc_idx, doc in enumerate(documents):
        chunks = splitter.split_text(doc)
        for chunk_idx, chunk in enumerate(chunks):
            all_chunks.append(Document(
                page_content=chunk,
                metadata={"doc_idx": doc_idx, "chunk_idx": chunk_idx}
            ))
    
    print(f"Naive RAG: {len(all_chunks)} chunks indexed")
    
    return Chroma.from_documents(
        documents=all_chunks,
        embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
        collection_name=collection_name,
    )

class NaiveRAG:
    def __init__(self, documents: list[str]):
        self.vectorstore = build_naive_vectorstore(documents)
    
    def retrieve(self, query: str, k: int = 5) -> list[str]:
        results = self.vectorstore.similarity_search(query, k=k)
        return [r.page_content for r in results]
    
    def answer(self, query: str, k: int = 5) -> dict:
        contexts = self.retrieve(query, k=k)
        answer = generate_rag_answer(query, contexts)
        return {"answer": answer, "contexts": contexts}
```

</Details>

<Details summary="Step 4 — Hybrid RAG (src/hybrid_rag.py)">

```python
# src/hybrid_rag.py
"""
Hybrid RAG: Dense (vector) + Sparse (BM25) retrieval fused with RRF.
Outperforms naive RAG on most benchmarks.
"""

from rank_bm25 import BM25Okapi
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
from src.utils import generate_rag_answer

def reciprocal_rank_fusion(
    ranked_lists: list[list[str]],
    k: int = 60
) -> list[tuple[str, float]]:
    """Fuse multiple ranked lists with RRF."""
    scores: dict[str, float] = {}
    for ranked_list in ranked_lists:
        for rank, doc_id in enumerate(ranked_list, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)

class HybridRAG:
    def __init__(self, documents: list[str], chunk_size: int = 500):
        self._build_index(documents, chunk_size)
    
    def _build_index(self, documents: list[str], chunk_size: int):
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=50
        )
        
        self.chunks: list[str] = []
        self.chunk_ids: list[str] = []
        all_docs: list[Document] = []
        
        for doc_idx, doc in enumerate(documents):
            text_chunks = splitter.split_text(doc)
            for chunk_idx, chunk in enumerate(text_chunks):
                chunk_id = f"doc{doc_idx}_chunk{chunk_idx}"
                self.chunks.append(chunk)
                self.chunk_ids.append(chunk_id)
                all_docs.append(Document(
                    page_content=chunk,
                    metadata={"id": chunk_id}
                ))
        
        # Dense index
        self.vectorstore = Chroma.from_documents(
            documents=all_docs,
            embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
            collection_name="hybrid_rag",
        )
        
        # Sparse index (BM25)
        tokenized = [c.lower().split() for c in self.chunks]
        self.bm25 = BM25Okapi(tokenized)
        self.id_to_chunk = dict(zip(self.chunk_ids, self.chunks))
        
        print(f"Hybrid RAG: {len(self.chunks)} chunks indexed (dense + BM25)")
    
    def retrieve(self, query: str, k: int = 5) -> list[str]:
        fetch_k = min(k * 4, len(self.chunks))
        
        # Dense retrieval
        dense_results = self.vectorstore.similarity_search(query, k=fetch_k)
        dense_ranking = [r.metadata["id"] for r in dense_results]
        
        # Sparse retrieval (BM25)
        bm25_scores = self.bm25.get_scores(query.lower().split())
        sparse_ranked_indices = sorted(
            range(len(bm25_scores)),
            key=lambda i: bm25_scores[i],
            reverse=True
        )[:fetch_k]
        sparse_ranking = [self.chunk_ids[i] for i in sparse_ranked_indices]
        
        # RRF fusion
        fused = reciprocal_rank_fusion([dense_ranking, sparse_ranking])
        
        # Return top-k chunk texts
        top_ids = [doc_id for doc_id, _ in fused[:k]]
        return [self.id_to_chunk[did] for did in top_ids if did in self.id_to_chunk]
    
    def answer(self, query: str, k: int = 5) -> dict:
        contexts = self.retrieve(query, k=k)
        answer = generate_rag_answer(query, contexts)
        return {"answer": answer, "contexts": contexts}
```

</Details>

<Details summary="Step 5 — Contextual RAG (src/contextual_rag.py)">

```python
# src/contextual_rag.py
"""
Contextual RAG: Anthropic's technique — inject context before embedding.
Each chunk is prefixed with a LLM-generated context sentence.
Uses prompt caching for cost efficiency.
"""

import anthropic
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
from src.utils import generate_rag_answer

_anthropic_client = anthropic.Anthropic()

def generate_chunk_context(full_document: str, chunk: str) -> str:
    """
    Generate a context sentence for a chunk given the full document.
    Uses Claude Haiku with prompt caching for efficiency.
    """
    try:
        response = _anthropic_client.beta.messages.create(
            model="claude-haiku-4-5",
            max_tokens=150,
            system="You are a document analyzer. Write 1-2 sentences of context "
                   "for the given chunk, explaining what it's about and where it "
                   "fits in the document. Return ONLY the context sentences.",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"<document>\n{full_document[:4000]}\n</document>",
                            "cache_control": {"type": "ephemeral"},
                        },
                        {
                            "type": "text",
                            "text": f"<chunk>\n{chunk}\n</chunk>\n\nWrite context:",
                        },
                    ],
                }
            ],
            betas=["prompt-caching-2024-07-31"],
        )
        return response.content[0].text.strip()
    except Exception as e:
        print(f"Warning: Context generation failed ({e}), using fallback")
        return f"This chunk is from a technical document about {chunk[:50]}..."

class ContextualRAG:
    def __init__(self, documents: list[str], chunk_size: int = 500):
        self._build_index(documents, chunk_size)
    
    def _build_index(self, documents: list[str], chunk_size: int):
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=50
        )
        
        all_docs: list[Document] = []
        
        for doc_idx, document in enumerate(documents):
            chunks = splitter.split_text(document)
            print(f"Document {doc_idx + 1}: generating context for {len(chunks)} chunks...")
            
            for chunk_idx, chunk in enumerate(chunks):
                context = generate_chunk_context(document, chunk)
                contextualized = f"{context}\n\n{chunk}"
                
                all_docs.append(Document(
                    page_content=contextualized,
                    metadata={
                        "doc_idx": doc_idx,
                        "chunk_idx": chunk_idx,
                        "original_chunk": chunk,
                    }
                ))
        
        self.vectorstore = Chroma.from_documents(
            documents=all_docs,
            embedding=OpenAIEmbeddings(model="text-embedding-3-small"),
            collection_name="contextual_rag",
        )
        
        print(f"Contextual RAG: {len(all_docs)} contextualized chunks indexed")
    
    def retrieve(self, query: str, k: int = 5) -> list[str]:
        results = self.vectorstore.similarity_search(query, k=k)
        # Return original chunks (not the contextualized version) for the LLM
        return [r.metadata.get("original_chunk", r.page_content) for r in results]
    
    def answer(self, query: str, k: int = 5) -> dict:
        contexts = self.retrieve(query, k=k)
        answer = generate_rag_answer(query, contexts)
        return {"answer": answer, "contexts": contexts}
```

</Details>

<Details summary="Step 6 — RAGAS Evaluator (src/evaluator.py)">

```python
# src/evaluator.py
"""
Run RAGAS evaluation across all three RAG strategies and return scores.
"""

from ragas import evaluate, EvaluationDataset
from ragas.metrics import LLMContextRecall, Faithfulness, FactualCorrectness, ResponseRelevancy
from ragas.llms import LangchainLLMWrapper
from langchain_openai import ChatOpenAI

def build_eval_dataset(
    rag_system,
    questions: list[dict],
    strategy_name: str,
) -> list[dict]:
    """
    Run questions through a RAG system and collect results for RAGAS.
    
    questions: [{"query": str, "ground_truth": str}, ...]
    """
    eval_data = []
    
    for i, item in enumerate(questions):
        print(f"  [{strategy_name}] Running question {i+1}/{len(questions)}...")
        result = rag_system.answer(item["query"], k=5)
        
        eval_data.append({
            "user_input": item["query"],
            "retrieved_contexts": result["contexts"],
            "response": result["answer"],
            "reference": item["ground_truth"],
        })
    
    return eval_data

def evaluate_strategy(
    rag_system,
    questions: list[dict],
    strategy_name: str,
    evaluator_llm=None,
) -> dict:
    """Run RAGAS evaluation for one RAG strategy."""
    if evaluator_llm is None:
        evaluator_llm = LangchainLLMWrapper(
            ChatOpenAI(model="gpt-4o-mini", temperature=0)
        )
    
    print(f"\n{'='*50}")
    print(f"Evaluating: {strategy_name}")
    print(f"{'='*50}")
    
    eval_data = build_eval_dataset(rag_system, questions, strategy_name)
    dataset = EvaluationDataset.from_list(eval_data)
    
    metrics = [
        Faithfulness(llm=evaluator_llm),
        LLMContextRecall(llm=evaluator_llm),
        FactualCorrectness(llm=evaluator_llm),
        ResponseRelevancy(llm=evaluator_llm),
    ]
    
    result = evaluate(dataset=dataset, metrics=metrics, llm=evaluator_llm)
    scores = dict(result)
    
    print(f"Results for {strategy_name}:")
    for metric, score in scores.items():
        print(f"  {metric}: {score:.4f}")
    
    return {
        "strategy": strategy_name,
        "scores": scores,
        "eval_data": eval_data,
    }

def compare_strategies(
    strategies: dict,  # {"Strategy Name": rag_system_instance}
    questions: list[dict],
) -> list[dict]:
    """Compare all strategies and return results."""
    evaluator_llm = LangchainLLMWrapper(
        ChatOpenAI(model="gpt-4o-mini", temperature=0)
    )
    
    results = []
    for name, system in strategies.items():
        result = evaluate_strategy(system, questions, name, evaluator_llm)
        results.append(result)
    
    return results
```

</Details>

<Details summary="Step 7 — Streamlit Dashboard (dashboard.py)">

```python
# dashboard.py
"""
Streamlit dashboard for comparing RAG strategies with RAGAS evaluation.
Run with: streamlit run dashboard.py
"""

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use("Agg")
import json
import os
from dotenv import load_dotenv

load_dotenv()

# ---- Page Config ----
st.set_page_config(
    page_title="RAG Evaluation Dashboard",
    page_icon="📊",
    layout="wide",
)

st.title("📊 RAG Strategy Evaluation Dashboard")
st.caption("Comparing Naive RAG · Hybrid RAG · Contextual RAG using RAGAS metrics")

# ---- Sidebar: Configuration ----
st.sidebar.header("⚙️ Configuration")

doc_file = st.sidebar.file_uploader(
    "Upload Document(s) for RAG",
    type=["txt"],
    help="Upload a .txt file. Multiple paragraphs separated by blank lines."
)

n_questions = st.sidebar.slider("Number of Test Questions", 3, 10, 5)
k_retrieved = st.sidebar.slider("Chunks to Retrieve (k)", 3, 10, 5)
chunk_size = st.sidebar.slider("Chunk Size (chars)", 200, 1000, 500)

strategies_to_run = st.sidebar.multiselect(
    "Strategies to Evaluate",
    ["Naive RAG", "Hybrid RAG", "Contextual RAG"],
    default=["Naive RAG", "Hybrid RAG"],
)

run_button = st.sidebar.button("🚀 Run Evaluation", type="primary")

# ---- Main Content ----
if not doc_file:
    st.info("👈 Upload a document and click 'Run Evaluation' to start.")
    
    # Show example layout
    st.subheader("What this dashboard shows")
    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Faithfulness", "—", help="Are claims supported by context?")
    col2.metric("Context Recall", "—", help="Was all needed info retrieved?")
    col3.metric("Factual Correctness", "—", help="Is the answer factually right?")
    col4.metric("Answer Relevancy", "—", help="Does the answer address the question?")
    st.stop()

if run_button:
    # ---- Load Documents ----
    with st.spinner("Loading documents..."):
        content = doc_file.read().decode("utf-8")
        documents = [p.strip() for p in content.split("\n\n") if len(p.strip()) > 100]
        
        if len(documents) < 3:
            st.error("Please upload a document with at least 3 paragraphs (separated by blank lines).")
            st.stop()
        
        st.success(f"✅ Loaded {len(documents)} document paragraphs")
    
    # ---- Generate Test Questions ----
    with st.spinner("Generating test questions with GPT-4o-mini..."):
        from src.utils import create_test_questions
        questions = create_test_questions(documents)
        questions = questions[:n_questions]
        
        st.subheader("📝 Test Questions")
        for i, q in enumerate(questions, 1):
            with st.expander(f"Q{i}: {q['query'][:80]}..."):
                st.write(f"**Query:** {q['query']}")
                st.write(f"**Ground Truth:** {q['ground_truth']}")
    
    # ---- Initialize RAG Systems ----
    from src.naive_rag import NaiveRAG
    from src.hybrid_rag import HybridRAG
    from src.contextual_rag import ContextualRAG
    
    rag_systems = {}
    
    if "Naive RAG" in strategies_to_run:
        with st.spinner("Building Naive RAG index..."):
            rag_systems["Naive RAG"] = NaiveRAG(documents)
            st.write("✅ Naive RAG ready")
    
    if "Hybrid RAG" in strategies_to_run:
        with st.spinner("Building Hybrid RAG index (dense + BM25)..."):
            rag_systems["Hybrid RAG"] = HybridRAG(documents, chunk_size=chunk_size)
            st.write("✅ Hybrid RAG ready")
    
    if "Contextual RAG" in strategies_to_run:
        with st.spinner("Building Contextual RAG index (this calls Claude for each chunk)..."):
            rag_systems["Contextual RAG"] = ContextualRAG(documents, chunk_size=chunk_size)
            st.write("✅ Contextual RAG ready")
    
    # ---- Run RAGAS Evaluation ----
    st.subheader("🔬 Running RAGAS Evaluation...")
    progress = st.progress(0)
    
    from src.evaluator import compare_strategies
    
    results = compare_strategies(rag_systems, questions)
    progress.progress(100)
    
    # ---- Display Results ----
    st.header("📈 Evaluation Results")
    
    # Metric cards for best strategy
    metric_names = ["faithfulness", "llm_context_recall", "factual_correctness", "response_relevancy"]
    metric_display = ["Faithfulness", "Context Recall", "Factual Correctness", "Answer Relevancy"]
    
    # Summary table
    summary_data = []
    for r in results:
        row = {"Strategy": r["strategy"]}
        for m in metric_names:
            row[m.replace("_", " ").title()] = f"{r['scores'].get(m, 0):.3f}"
        summary_data.append(row)
    
    df = pd.DataFrame(summary_data)
    st.dataframe(df, use_container_width=True)
    
    # Bar chart comparison
    st.subheader("Strategy Comparison Chart")
    fig, axes = plt.subplots(1, len(metric_names), figsize=(14, 5))
    
    colors = ["#4C72B0", "#DD8452", "#55A868"]
    
    for ax_idx, (metric, display) in enumerate(zip(metric_names, metric_display)):
        ax = axes[ax_idx]
        strategy_names = [r["strategy"] for r in results]
        scores = [r["scores"].get(metric, 0) for r in results]
        
        bars = ax.bar(strategy_names, scores, color=colors[:len(results)], alpha=0.85)
        ax.set_title(display, fontsize=11, fontweight="bold")
        ax.set_ylim(0, 1.1)
        ax.set_ylabel("Score")
        ax.tick_params(axis="x", rotation=15)
        
        for bar, score in zip(bars, scores):
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + 0.02,
                f"{score:.3f}",
                ha="center", va="bottom", fontsize=9
            )
    
    plt.tight_layout()
    st.pyplot(fig)
    
    # Per-question breakdown
    st.subheader("Per-Question Breakdown")
    for r in results:
        with st.expander(f"📋 {r['strategy']} — Detailed Results"):
            for i, item in enumerate(r["eval_data"], 1):
                st.markdown(f"**Q{i}: {item['user_input']}**")
                st.write(f"**Answer:** {item['response']}")
                st.write(f"**Retrieved Contexts ({len(item['retrieved_contexts'])}):**")
                for j, ctx in enumerate(item["retrieved_contexts"], 1):
                    st.text_area(f"Context {j}", ctx[:300], height=80, key=f"{r['strategy']}_q{i}_ctx{j}")
                st.divider()
    
    # Download results
    st.subheader("💾 Download Results")
    results_json = json.dumps(
        [{"strategy": r["strategy"], "scores": r["scores"]} for r in results],
        indent=2
    )
    st.download_button(
        "Download Results JSON",
        data=results_json,
        file_name="rag_evaluation_results.json",
        mime="application/json",
    )
```

</Details>

<Details summary="Step 8 — Run the Dashboard">

```bash
# Make sure you're in the project root with .env filled in
streamlit run dashboard.py
```

The dashboard will open at `http://localhost:8501`.

**Testing workflow:**
1. Upload a `.txt` document (try using a Wikipedia article or course notes)
2. Select strategies (start with Naive RAG + Hybrid RAG)
3. Click "Run Evaluation"
4. Wait ~3–5 minutes for indexing + evaluation
5. Compare the RAGAS scores

**Expected behavior:**
- Naive RAG: baseline scores
- Hybrid RAG: typically +5–15% on Context Recall vs Naive
- Contextual RAG: typically +10–20% on Faithfulness vs Naive

</Details>

<Details summary="Step 9 — Stretch Goals">

Once the basic dashboard works, try these extensions:

**A. Add Reranking to Hybrid RAG**

```python
# In src/hybrid_rag.py, add to retrieve():
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# After RRF fusion:
candidate_chunks = [self.id_to_chunk[did] for did in top_rrf_ids]
pairs = [(query, chunk) for chunk in candidate_chunks]
rerank_scores = reranker.predict(pairs)
reranked = sorted(zip(candidate_chunks, rerank_scores), key=lambda x: x[1], reverse=True)
return [chunk for chunk, _ in reranked[:k]]
```

**B. Add a Query Interface**

Add a sidebar text input that lets you ask free-form questions against all strategies and see different answers:

```python
st.sidebar.text_input("Ask a question:", key="user_query")
if st.session_state.user_query:
    for name, system in rag_systems.items():
        result = system.answer(st.session_state.user_query)
        st.subheader(name)
        st.write(result["answer"])
```

**C. Export a Report**

Generate a Markdown/PDF report summarizing the evaluation with `reportlab` or `fpdf2`.

</Details>

---

## What to Submit

1. Your `dashboard.py` and `src/` folder
2. A screenshot of your dashboard showing all 3 strategies compared
3. A brief Discourse blog post explaining which strategy performed best on your document, and why

---

## Common Issues

| Issue | Fix |
|-------|-----|
| `OPENAI_API_KEY not set` | Check your `.env` file and that `load_dotenv()` is called |
| Chroma collection name collision | Delete `./chroma_db/` folder and re-run |
| RAGAS evaluation slow | Normal — each metric calls GPT; ~2-3 min for 5 questions |
| Contextual RAG fails | Check `ANTHROPIC_API_KEY` is set |
| `No module named 'src'` | Run from project root: `streamlit run dashboard.py` |

---

