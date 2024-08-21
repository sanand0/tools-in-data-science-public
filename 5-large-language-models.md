# Large language models

This module covers the practical usage of large language models (LLMs) -- a relatively a new area.

**This module is experimental**. Things may break when trying these notebooks or during your GA. Try again, gently.

**LLMs incur a cost.** We have created API keys for everyone to use gpt-3.5-turbo and text-embedding-small. Your usage is limited to **50 cents** for this course. Don't exceed that.

**Use [AI Proxy](https://github.com/sanand0/aiproxy)** instead of OpenAI. Specifically:

1. Replace your API to `https://api.openai.com/...` with `https://aiproxy.sanand.workers.dev/openai/...`
2. Replace the `OPENAI_API_KEY` with the `AIPROXY_TOKEN` that someone will give you.

## LLM Sentiment analysis

[![LLM Sentiment Analysis](https://i.ytimg.com/vi_webp/_D46QrX-2iU/sddefault.webp)](https://youtu.be/_D46QrX-2iU)

You'll learn how to use large language models (LLMs) for sentiment analysis and classification, covering:

- **Sentiment Analysis**: Use OpenAI API to identify the sentiment of movie reviews as positive or negative.
- **Prompt Engineering**: Learn how to craft effective prompts to get desired results from LLMs.
- **LLM Training**: Understand how to train LLMs by providing examples and feedback.
- **OpenAI API Integration**: Integrate OpenAI API into Python code to perform sentiment analysis.
- **Tokenization**: Learn about tokenization and its impact on LLM input and cost.
- **Zero-Shot, One-Shot, and Multi-Shot Learning**: Understand different approaches to using LLMs for learning.

Here are the links used in the video:

- [Jupyter Notebook](https://colab.research.google.com/drive/1tVZBD9PKto1kPmVJFNUt0tdzT5EmLLWs)
- [Movie reviews dataset](https://drive.google.com/file/d/1X33ao8_PE17c3htkQ-1p2dmW2xKmOq8Q/view)
- [OpenAI Playground](https://platform.openai.com/playground/chat)
- [OpenAI Pricing](https://openai.com/api/pricing/)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/)
- [OpenAI Docs](https://platform.openai.com/docs/overview)

## LLM Extraction

[![LLM Extraction](https://i.ytimg.com/vi_webp/72514uGffPE/sddefault.webp)](https://youtu.be/72514uGffPE)

You'll learn how to use LLMs to extract structure from unstructured data, covering:

- **LLM for Data Extraction**: Use OpenAI's API to extract structured information from unstructured data like addresses.
- **JSON Schema**: Define a JSON schema to ensure consistent and structured output from the LLM.
- **Prompt Engineering**: Craft effective prompts to guide the LLM's response and improve accuracy.
- **Data Cleaning**: Use string functions and OpenAI's API to clean and standardize data.
- **Data Analysis**: Analyze extracted data using Pandas to gain insights.
- **LLM Limitations**: Understand the limitations of LLMs, including potential errors and inconsistencies in output.
- **Production Use Cases**: Explore real-world applications of LLMs for data extraction, such as customer service email analysis.

Here are the links used in the video:

- [Jupyter Notebook](https://colab.research.google.com/drive/1Z8mG-RPTSYY4qwkoNdzRTc4StbnwOXeE)
- [JSON Schema](https://json-schema.org/)
- [Function calling](https://platform.openai.com/docs/guides/function-calling)

## LLM Topic modeling

[![LLM Topic Modeling](https://i.ytimg.com/vi_webp/eQUNhq91DlI/sddefault.webp)](https://youtu.be/eQUNhq91DlI)

You'll learn to use text embeddings to find text similarity and use that to create topics automatically from text, covering:

- **Embeddings**: How large language models convert text into numerical representations.
- **Similarity Measurement**: Understanding how similar embeddings indicate similar meanings.
- **Embedding Visualization**: Using tools like Tensorflow Projector to visualize embedding spaces.
- **Embedding Applications**: Using embeddings for tasks like classification and clustering.
- **OpenAI Embeddings**: Using OpenAI's API to generate embeddings for text.
- **Model Comparison**: Exploring different embedding models and their strengths and weaknesses.
- **Cosine Similarity**: Calculating cosine similarity between embeddings for more reliable similarity measures.
- **Embedding Cost**: Understanding the cost of generating embeddings using OpenAI's API.
- **Embedding Range**: Understanding the range of values in embeddings and their significance.

Here are the links used in the video:

- [Jupyter Notebook](https://colab.research.google.com/drive/15L075RLrwXkxa29EGT-1sNm_dqJRBTe_)
- [Tensorflow projector](https://projector.tensorflow.org/)
- [Embeddings guide](https://platform.openai.com/docs/guides/embeddings)
- [Embeddings reference](https://platform.openai.com/docs/api-reference/embeddings)
- [Clustering on scikit-learn](https://scikit-learn.org/stable/modules/clustering.html)
- [Massive text embedding leaderboard (MTEB)](https://huggingface.co/spaces/mteb/leaderboard)
- [`gte-large-en-v1.5` embedding model](https://huggingface.co/Alibaba-NLP/gte-large-en-v1.5)
- [Embeddings similarity threshold](https://www.s-anand.net/blog/embeddings-similarity-threshold/)

## Retrieval Augmented Generation

The video is not available yet. Please review the notebook, which is self-explanatory. #TODO

You will learn to implement Retrieval Augmented Generation (RAG) to enhance language models' responses by incorporating relevant context, covering:

- **LLM Context Limitations**: Understanding the constraints of context windows in large language models.
- **Retrieval Augmented Generation**: The technique of retrieving and using relevant documents to enhance model responses.
- **Embeddings**: How to convert text into numerical representations that are used for similarity calculations.
- **Similarity Search**: Finding the most relevant documents by calculating cosine similarity between embeddings.
- **OpenAI API Integration**: Using the OpenAI API to generate responses based on the most relevant documents.
- **Tourist Recommendation Bot**: Building a bot that recommends tourist attractions based on user interests using embeddings.
- **Next Steps for Implementation**: Insights into scaling the solution with a vector database, re-rankers, and improved prompts for better accuracy and efficiency.

Here are the links used in the video:

- [Jupyter Notebook](https://colab.research.google.com/drive/1x-g0kjktFkBcujJssKrx1xhZarsQA0ya)
- [`gte-large-en-v1.5` embedding model](https://huggingface.co/Alibaba-NLP/gte-large-en-v1.5)
- [Awesome vector database](https://github.com/mileszim/awesome-vector-database)
