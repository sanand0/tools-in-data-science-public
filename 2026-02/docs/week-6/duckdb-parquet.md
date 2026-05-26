# DuckDB + Parquet

SQLite is great for OLTP. DuckDB is great for OLAP (analytical queries over millions of rows).

## Parquet
A columnar storage format. Highly compressed and very fast to read. Always save large scraped datasets as Parquet, not CSV.

## DuckDB
DuckDB runs in-process (like SQLite) but can execute SQL directly over Parquet files, even if they are hosted on AWS S3.

```python
import duckdb

# Query a remote parquet file directly
duckdb.sql("""
    SELECT category, count(*) 
    FROM 's3://my-bucket/scraped_data.parquet'
    GROUP BY category
""").show()
```

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

