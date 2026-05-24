# Firestore Database

Firestore is Google's serverless NoSQL document database.

## Why use it for scraping?
- Flexible schema (scraped data formats change often).
- Real-time updates (build dashboards that update instantly when the scraper runs).
- Generous free tier.

## Example
```python
from google.cloud import firestore

db = firestore.Client()
doc_ref = db.collection("job_postings").document("job_123")
doc_ref.set({
    "title": "Data Scientist",
    "company": "Google",
    "scraped_at": firestore.SERVER_TIMESTAMP
})
```