## Model hosting: HuggingFace

[HuggingFace](https://huggingface.co/) is the go-to platform for sharing and deploying machine learning models, particularly in natural language processing and computer vision.

Key Features:

- Model Hub with thousands of pre-trained models
- Datasets repository for ML training
- Inference API for quick deployments
- Model versioning and collaboration
- Spaces for interactive demos

Common Operations:

```python
from transformers import pipeline

# Load model from Hub
classifier = pipeline("sentiment-analysis")

# Run inference
result = classifier("I love this course!")

# Push model to Hub
model.push_to_hub("username/model-name")

# Load dataset
from datasets import load_dataset
dataset = load_dataset("username/dataset-name")

# Create Space
from huggingface_hub import create_repo
create_repo("username/space-name", repo_type="space")
```

Best Practices:

1. **Model Management**

   ```python
   from transformers import AutoModel, AutoTokenizer

   def load_model(model_id: str):
       """Load model and tokenizer from HuggingFace Hub.

       Args:
           model_id: HuggingFace model identifier

       Returns:
           Tuple of (model, tokenizer)
       """
       tokenizer = AutoTokenizer.from_pretrained(model_id)
       model = AutoModel.from_pretrained(model_id)
       return model, tokenizer
   ```

2. **Efficient Inference**

   ```python
   # Use batching for multiple inputs
   texts = ["First text", "Second text", "Third text"]
   outputs = classifier(texts, batch_size=8)

   # Enable GPU acceleration
   classifier.to("cuda")
   ```

3. **Model Cards**

   ```markdown
   # Model Card

   ## Model Details

   - Developer: [Your Name]
   - Model Type: BERT
   - Language: English
   - License: MIT

   ## Intended Use

   - Primary intended uses
   - Out-of-scope use cases

   ## Training Data

   - Dataset description
   - Preprocessing steps
   ```

Tools:

- [Transformers](https://huggingface.co/transformers/): Main library
- [Datasets](https://huggingface.co/docs/datasets/): Data loading
- [Gradio](https://gradio.app/): Demo creation
- [Hub Client](https://huggingface.co/docs/huggingface_hub/): API client

[![HuggingFace Model Hub Tutorial](https://i.ytimg.com/vi_webp/XvSGPZFEjDY/sddefault.webp)](https://youtu.be/XvSGPZFEjDY)

- [Navigating the Model Hub](https://youtu.be/XvSGPZFEjDY)
- [Loading a custom dataset](https://youtu.be/HyQgpJTkRdE)
- [Slide and dice a dataset](https://youtu.be/tqfSFcPMgOI)
- [Datasets + DataFrames = ❤️](https://youtu.be/tfcY1067A5Q)
- [Text embeddings & semantic search](https://youtu.be/OATCgQtNX2o)
