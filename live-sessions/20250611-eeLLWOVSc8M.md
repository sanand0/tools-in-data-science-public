# 2025 06 10 Project 1 Session 1 - TDS May 2025

[![2025 06 10 Project 1 Session 1 - TDS May 2025](https://i.ytimg.com/vi_webp/eeLLWOVSc8M/sddefault.webp)](https://youtu.be/eeLLWOVSc8M)

Here is an FAQ-style transcription of the TDS live tutorial:

---

**Q1: Where can I find the poll you mentioned for the project focus areas?**

**A1:** You can find the poll in the bottom right corner of your screen, under the "meeting tools" icon. Please participate, as it helps us understand where you need more focus.

**Q2: Will we be tested on questions outside the specified date range for Discourse content, or questions the GPT might not be able to answer given its resources?**

**A2:** For now, it's safe to assume we will _not_ ask questions outside the specified content date range (Jan 25 to April 14). However, we still need to clarify if a standard response (like "I don't know") is expected if the model cannot answer a question based on the provided context. We are exploring different testing approaches for this, but currently, you won't be penalized for content outside the specified range.

**Q3: Are both course content and Discourse content required for the project?**

**A3:** Yes, both the Jan 2025 course content and Discourse content (from Jan 25 to Apr 14, 2025) are required for your project.

**Q4: Do I need to create a fancy front-end for my application?**

**A4:** No, you don't need a fancy front-end. All we require is that your application can receive a cURL command (potentially with an attached image) and respond with a JSON object. You can use frameworks like Fast API or Flask for this.

**Q5: Is TypeSense useful or needed for this project, and are there resources to learn it?**

**A5:** TypeSense is _not needed_ for this project. Since this is a relatively small project, you can achieve good performance without it. While there are existing resources, we won't be discussing TypeSense for this project in the tutorials.

**Q6: My application returns "I don't know" for out-of-range questions, but the provided Promptfoo evaluation table expects an answer. Is this an error?**

**A6:** The Promptfoo YAML file we provide is just a _sample_ or a "public test case." You will not be tested on those specific questions, especially the out-of-range ones. The purpose of this sample is to help you check if your code is generally working as expected. You are encouraged to create your own Promptfoo YAML files with your own test questions and assertions. The grading will be based on whether your endpoint passes the assertions you define in your own Promptfoo file.

**Q7: What files should I upload to GitHub for my project submission?**

**A7:** You need to upload your _entire project codebase_ to GitHub. This includes your application code, how it was created, and your embedding space. We should be able to clone your repository and run your project successfully. If our attempt to run your project from GitHub fails, it indicates a problem on your end.

**Q8: My embedding database is currently over 500MB. Is this acceptable?**

**A8:** No, your embedding data should _not_ be that large. (🔥 **Hot Tip 5**) We have tested a complete solution, and it's possible to store _all_ the RAG content and vectors within approximately 15MB (or a maximum of 20MB). If your data is significantly larger, it indicates an inefficiency in your process. The upcoming sessions will demonstrate how to achieve this level of efficiency.

**Q9: Will you cover the entire project creation from scratch in the upcoming sessions?**

**A9:** No, we won't build the _entire project from scratch_. However, we will demonstrate how to implement the _individual technological components_ required. For example, we'll show you how to scrape data, get data from different sources, handle authentication, and create embeddings using different datasets. Our goal is to teach you _how to fish_, not to give you the fish (the complete project solution). You should then be able to integrate these components and replicate the project workflow.

**Q10: The project deadline will be passed by the time the next three classes are finished. How should I manage my time?**

**A10:** If you closely watch the upcoming sessions, you should be able to finish the project within approximately one day. If you've been following along and trying things out, you should already be halfway done. This one-day estimate is for someone starting completely from scratch.

**Q11: How do I get the course content without scraping the website?**

**A11:** (🔥 **Hot Tip 1**) You don't need to scrape the course content. Our instructor, Anand, has a public GitHub repository that contains all the Jan 2025 course content already in Markdown files. Simply clone that repository, and you'll have all the necessary content. This is a good practice: always check for publicly available resources (like a project lead's repos) before attempting complex scraping.

**Q12: How do I get the Discourse posts without scraping the website, especially since Discourse requires authentication?**

**A12:** We will use a technique involving direct API calls instead of traditional scraping. (🔥 **Hot Tip 1 continued**) When your browser loads a webpage (like the BBC weather app or Discourse), it often makes hidden API calls to retrieve structured data (e.g., JSON) from other servers. This JSON contains only the relevant information, not the messy HTML. If you can identify and use these "secret API calls," you can get the data directly.

To find these:

1.  Open your browser's developer tools (usually by right-clicking and selecting "Inspect").
2.  Go to the "Network" tab.
3.  As you interact with the webpage (e.g., type in a search box, scroll down to load more posts), observe the requests being made in the Network tab.
4.  Look for requests that return structured data like JSON. These often contain the parameters (like date ranges or search terms) directly in their URL or payload.
5.  Once you identify the correct API URL, you can reconstruct it in your code, providing the necessary parameters (including authentication details like cookies for Discourse) to directly fetch the JSON data, thus avoiding HTML scraping.

**Q13: My application doesn't use authentication, but Discourse does. How do I handle this when making API calls for Discourse content?**

**A13:** (🔥 **Hot Tip 6**) Discourse requires authentication, often managed via cookies. When you log in, Discourse sends a cookie back to your browser, which is then sent with subsequent requests to maintain your session. To handle this programmatically:

1.  When you make your initial login request to Discourse, capture the cookie (or cookies) that the server sends back in its response.
2.  Store this cookie data.
3.  For all subsequent API requests to Discourse, include this stored cookie in your request headers.
4.  Discourse might issue a new cookie in a response (e.g., after a certain number of requests or a time-out). Always update your stored cookie with the latest one received.

This ensures your session remains active. The instructor's evaluation system will also handle this by providing its own authentication mechanisms.

**Q14: For the Promptfoo evaluation, will we be tested on the specific sample YAML file you provide, or are we expected to create our own?**

**A14:** The Promptfoo YAML file we provide is just a _sample_ (a public test case). You are expected to _configure it yourself_ and even create your own Promptfoo YAML files with your own custom test questions and assertions. The grading will be based on whether your endpoint passes the assertions you define in your own configured Promptfoo file. The Week 3 Promptfoo video and documentation provide resources on how to configure these files.

**Q15: What is an LLM rubric in the context of Promptfoo testing?**

**A15:** An LLM rubric is a specific type of test used in Promptfoo. It's a set of subjective criteria that an LLM (not a human) uses to evaluate the quality and correctness of your project's responses. For example, a rubric might check if your model's response:

- Clarifies the user's intent.
- Mentions specific keywords (like "dashboard showing 110").
- Adheres to a certain word count (e.g., "uses 100 words to respond").

This allows for automated, subjective evaluation, assessing if your LLM's response meets predefined quality standards beyond simple factual correctness. It helps ensure your model's outputs are well-structured and consistent. (🔥 **Hot Tip 4 revisited**) The Promptfoo video is invaluable for understanding this.

**Q16: Is there a recommended number of "chunks" of context to return to the LLM for a query?**

**A16:** We recommend returning around _5 or 6_ chunks of context to the LLM.

**Q17: When creating embeddings, do I need to perform pre-processing on the scraped data? What format should the data be in?**

**A17:** Yes, pre-processing of the data is required before creating embeddings. The specific details and required format for this will be covered in the next session.

**Q18: Do I need to create a separate database (like a vector database) to store the embeddings for the project?**

**A18:** No, you don't necessarily need a separate vector database. You can use an efficient method like an _NPZ archive_ to store all your embeddings. (🔥 **Hot Tip 5 revisited**) We've shown that even a large amount of Discourse data (around 5000 posts) can have its embeddings stored within ~15MB using this method.

**Q19: Should I use the same embedding model for both my RAG content and the user's query?**

**A19:** Yes, it is _absolutely critical_ that you use the _same embedding model_ for both your RAG content (the data you've prepared) and the user's query. If you use different models, their respective vector spaces will be different, making it impossible to accurately compare vectors (e.g., using a dot product) and find relevant information. This will lead to incorrect similarity scores and poor retrieval.

**Q20: How does "Prompt Engineering" relate to creating embeddings and interacting with the LLM?**

**A20:** Prompt engineering is crucial for getting consistent and high-quality responses from the LLM, complementing the embeddings. While RAG (Retrieval Augmented Generation) provides the relevant context, prompt engineering tells the LLM _how to use that context_ and _how to structure its final answer_. It involves crafting detailed system instructions that guide the LLM's behavior. A well-engineered prompt can significantly reduce variability in LLM responses. It's a big part of achieving repeatable and high-quality outputs from your project.

**Q21: What is the recommended way to handle my OpenAI API key in the deployed application without hardcoding it or exposing it on GitHub?**

**A21:** (🔥 **Hot Tip 7**) You should _never hardcode_ your API key directly in your code, especially when deploying to GitHub. Instead, your application should be designed to fetch the API key from an _environment variable_.

1.  **Define a variable:** In your code, specify a variable name (e.g., `OPENAI_API_KEY`) that your application will look for.
2.  **Fetch from environment:** Use a method (like `os.environ.get('OPENAI_API_KEY')` in Python) to retrieve the key's value from the environment.
3.  **Deployment:** When you deploy your application (e.g., to Versel), you will configure the `OPENAI_API_KEY` environment variable directly on the server. Your code will then automatically pick it up.

This approach ensures your key is never visible in your code repository, making it secure. We will demonstrate how to implement this for cloud deployments like Versel.

---
