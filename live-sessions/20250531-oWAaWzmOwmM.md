# 2025 05 25 Week 3 Session 2 - TDS May 2025

[![2025 05 25 Week 3 Session 2 - TDS May 2025](https://i.ytimg.com/vi_webp/oWAaWzmOwmM/sddefault.webp)](https://youtu.be/oWAaWzmOwmM)

Duration: 5899.0Here's an FAQ summary of the tutorial:

**Q1: What topics will be covered in this session and why are they important?**

**A1:** This session covers key topics from Module 3, which are crucial for Project 1. We'll delve into embeddings (and multimodal embeddings), vector databases, RAG (Retrieval Augmented Generation) and hybrid RAG, and function calling. The session is mostly code-based, so I encourage you to follow along and replicate the results.

**Q2: What are embeddings and what are their primary use cases?**

**A2:** Embeddings are numerical representations (vectors) of data, such as text or images, in a multi-dimensional "probability space." Their primary use is to identify similarity between different objects or pieces of information. For example, sentence transformers can create 364-dimensional vector embeddings, which we previously discussed in MLP for text and images. They are also generally more cost-effective than direct chat completions.

**Q3: How are embeddings created in the demonstrations?**

**A3:** For our demonstrations, I'll be using Open AI's embedding service, consuming them directly rather than downloading models locally.

**Q4: Can I follow along in Colab, or must I use VS Code?**

**A4:** I'll be demonstrating the code in VS Code, but you can certainly follow along and run it in Colab as well.

**Q5: How do you compare the similarity between two embeddings (vectors)?**

**A5:** We calculate similarity using cosine similarity. This involves performing a dot product between the two vectors and then normalizing the result. Normalization ensures the similarity score is between 0 and 1. This score effectively represents how similar two pieces of content (e.g., two sentences, an image and a text description) are.

**Q6: I'm having trouble with API keys and errors like "no code display found" when using Versel or similar platforms. What could be the issue?**

**A6:** The most common issues are:

- **Incorrect URL:** You might be using the wrong API endpoint URL. Always double-check the documentation (e.g., AI Pipe's API documentation for the correct embedding URL).
- **API Key Not Accessible:** Ensure your Open AI API key is correctly exported to your environment. You can do this temporarily in your terminal using `export OPENAI_API_KEY='your_key_here'` or make it persistent by adding it to your `.bashrc` file (refer to the Week 1 session on Linux basics for more on environment variables and persistence). I did this off-screen during the demo.
- **Platform-Specific Issues:** For platforms like Versel, ensure your repository/application is publicly accessible and that you're using the correct public domain name. Sometimes, specific project questions (e.g., those requiring a live server or an active authentication token) might fail if the server isn't running or the token has expired. It's best to handle such time-sensitive questions last. If possible, ask someone else to test your application's public endpoint from their own machine to help diagnose access issues.

**Q7: What are multimodal embeddings?**

**A7:** Multimodal embeddings map different types of data, such as text and images, into the _same_ vector space. This allows you to directly compare the similarity between, for example, an image of a cat and the text "a cute cat" because they will both have similar numerical representations (same dimensional vectors).

**Q8: Why is "chunking" necessary when dealing with documents for embeddings?**

**A8:** Chunking is necessary because embedding APIs often have limits on the number of tokens (characters) they can process in a single request. If a document is too long, it needs to be split into smaller, manageable chunks. We then generate embeddings for each chunk, ensuring no part of the document exceeds the API's token limit. This allows you to process very large files effectively. This is crucial even if the current dataset's files might not be large enough to _require_ splitting.

**Q9: Why does my code run slowly when generating embeddings for many documents?**

**A9:** Generating embeddings for a large number of documents can be time-consuming. To speed this up, you can implement asynchronous (async) processing using libraries like `asyncio` in Python with `httpx` for making API calls concurrently. This allows multiple embedding requests to be sent and processed simultaneously, significantly reducing the total time required.

**Q10: What is the purpose of RAG (Retrieval Augmented Generation) applications?**

**A10:** RAG applications enhance large language models by allowing them to retrieve relevant information from an external knowledge base (often stored in a vector database) before generating a response. Instead of solely relying on the LLM's pre-trained knowledge, RAG finds specific, pertinent documents related to a user's query. This information is then provided to the LLM as context, enabling it to generate more accurate, relevant, and up-to-date answers, especially for domain-specific or constantly changing information.

**Q11: How do we interpret the similarity scores for multimodal embeddings?**

**A11:** The similarity scores are normalized to be between 0 and 1. A score closer to 1 indicates higher similarity, while a score closer to 0 indicates lower similarity. For example, comparing an image of a cat with the text "a cute cat" would yield a high similarity score, whereas comparing the cat image with "a cardboard box" would result in a low similarity score. When answering questions with RAG, we typically sort the retrieved chunks by similarity and focus on the highest-scoring (most relevant) ones.
