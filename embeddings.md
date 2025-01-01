## Embeddings

[MTEB](https://huggingface.co/spaces/mteb/leaderboard)

```bash
uv run --python 3.12 --with sentence_transformers python
```

```python
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim

model = SentenceTransformer('BAAI/bge-base-en-v1.5')
sentences = ['This is a test sentence', 'This is another test sentence']
embeddings = model.encode(sentences)
print(cos_sim(embeddings[0], embeddings[1]))
```
