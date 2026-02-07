# 2025 10 10 Week 4 - Session 2 TDS Sep 2025

[![2025 10 10 Week 4 - Session 2 TDS Sep 2025](https://i.ytimg.com/vi_webp/uCvUrIX7wuw/sddefault.webp)](https://youtu.be/uCvUrIX7wuw)

Duration: 2h 59m

Here's an FAQ summary of the live tutorial:

**Q1: What are the initial steps for submitting my project?**
**A1:** You'll submit a Google Form including your API endpoint, GitHub repository URL, and a secret key. Our server will then make an initial JSON request to your deployed application (this marks the start of Round 1).

**Q2: What are the main tasks I need to complete for Round 1?**
**A2:** You need to:

1. Create a _new_ GitHub repository.
2. Add specific files (the content for these files will be provided in a JSON request).
3. Enable GitHub Pages for this repository.
   Before these tasks, your app should immediately send a JSON response acknowledging receipt of the task (an "OK" status).

**Q3: What happens after my Round 1 task is complete?**
**A3:** Once your task is done, your application must automatically send a JSON request to an evaluation URL that we will provide. This JSON request should include your email, task ID, round number, the URL of the _newly created_ repository, the commit SHA, and the page URL. This marks the completion of Round 1.

**Q4: How does Round 2 differ from Round 1?**
**A4:** In Round 2, you'll also receive a JSON request and should immediately send an "OK" response. However, you _do not_ create a new repository. Instead, you will _update_ files within the repository you created in Round 1. GitHub Pages should already be enabled.

**Q5: How will my application know which specific files and repository to update in Round 2?**
**A5:** The JSON request you receive will provide a unique task ID, which identifies the specific task and associated repository. Details about what updates to make (e.g., file content changes) will be included in the "brief" and "checks" fields of the JSON.

**Q6: Why is it mandatory to create a _new_ repository for every Round 1 task, and can't I just use folders within an existing repository?**
**A6:** You _must_ create a new repository for every Round 1 task because we need to verify your code's ability to programmatically create and enable repositories during the evaluation. If you reuse a repo, you could pre-configure it, which would bypass this core testing requirement. We verify this by checking commit IDs and creation dates on GitHub. Using separate repositories also ensures proper deployment of individual applications.

**Q7: Will I get a demo of the project?**
**A7:** A full project demo with live code isn't possible in _this_ session due to time constraints and some internal issues with showing code. However, we will have more dedicated sessions on the project where full demos and input/output examples will be covered. Today, the focus is on the core technical implementation: how to get structured outputs, manage file attachments, and perform tool calling.

**Q8: Am I restricted to using AI Pipe for token generation, or can I use other LLMs like OpenAI's API?**
**A8:** You are _not_ restricted to AI Pipe; you can use any LLM service or tools (e.g., OpenAI, local Olama server). However, please note that if you choose a third-party service, and it experiences downtime or issues during evaluation, we cannot be held responsible for your submission. If our AI Pipe has issues, we _will_ be responsible.

**Q9: What is the overall agenda being covered in this session?**
**A9:** The session focuses on demonstrating:

1. How to get _structured output_ from your LLM.
2. How to manage _attachments_ (e.g., GitHub files, base64 encoded data).
3. How to perform _tool calling_ (integrating web search, mathematical calculations, etc.).

**Q10: Can you briefly summarize the deployment process on Hugging Face Spaces?**
**A10:**

1. **Generate SSH Key:** Use `ssh-keygen` in your terminal to create an SSH key pair.
2. **Add SSH Key to Hugging Face:** Copy the public SSH key (`id_rsa.pub` content) and paste it into your Hugging Face settings under "SSH Keys," giving it a recognizable name.
3. **Create a New Space:** In Hugging Face, create a new Space for your project (e.g., `tic-tac-toe`). Select "Docker" as the template, keep it public, and ensure "Enable Docker" and "Add SSH Key" are selected.
4. **Clone the Repository:** Clone the newly created Space repository to your local machine using SSH.
5. **Set up Project Structure:** Inside the cloned repository, create an `src` folder. Inside `src`, create an empty `__init__.py` file (to mark `src` as a Python package) and place your main application code (e.g., `main.py`) there. The `README.md` file (automatically generated) is important for Docker deployment, so don't remove it.
6. **Install Dependencies:** Activate your virtual environment and install your project's Python dependencies (`pip install fastapi uvicorn pydantic`). Then, generate a `requirements.txt` file (`pip freeze > requirements.txt`).
7. **Create Dockerfile:** Add a `Dockerfile` (we'll provide a template) to your project root. This file instructs Docker on how to build your application's image.
8. **Configure Secrets:** Add environment variables (like your LLM API key and model name) to your Hugging Face Space's secrets. This allows your app to access sensitive information without hardcoding it.
9. **Push to GitHub:** Commit all your changes (`git add .`, `git commit -m "Initial setup"`) and push them to your Hugging Face Space repository (`git push`). Hugging Face will then automatically build and deploy your Docker application.

**Q11: My speaker's audio was breaking up earlier. Is it fixed now?**
**A11:** Yes, I've restarted my computer and network, and the audio should be clear now.

**Q12: How is the AI agent integrated into my code for tool calling and structured output?**
**A12:**

1. **Define Structured Output:** You define Python classes (using Pydantic `BaseModel`) that represent the expected structure of your AI's outputs (e.g., a `FileContent` class with `file_name` and `file_content` attributes, or an `AIMove` class with an integer `chosen_move`).
2. **Define Tools:** You create Python functions that perform specific tasks (like web search, file operations, or calculations). You use a `@tool_plane` decorator (from `ai-agent`) above these functions. This registers them as tools that your LLM can use.
3. **Create the AI Agent:** You instantiate a `SearchAgent` (or `MathAgent`) from the `ai-agent` library, providing your LLM model (e.g., `openai-gpt3.5-turbo`) and a system prompt (instructions for the agent).
4. **Agent Invocation:** In your main application code, you call your agent's `run()` method, passing the user's prompt (e.g., "How is the weather today?") and any other necessary context.
5. **LLM and Tool Interaction:** The LLM receives the prompt. If it determines a tool is needed (e.g., web search for weather), it generates code to call that tool. The `ai-agent` handles executing this tool code.
6. **Structured Output Processing:** The tool (e.g., `duckduckgo_search_tool`) executes, gets data, and returns it. This output is automatically cast into the structured Pydantic class you defined.
7. **Response Generation:** The LLM then uses this structured data from the tool to formulate its final, human-readable response, which is then returned to your application.
8. **Output Validation and Retry:** For robust error handling, you can add validators (e.g., `Field` constraints for Pydantic models) to your structured output classes. If the LLM generates an invalid output (e.g., a number outside the allowed range), the agent automatically retries the LLM call, providing feedback on the error, until a valid response is received (or the retry limit is reached).

**Q13: What specific structure does the output of file generation look like?**
**A13:** The agent outputs a list of file objects. Each file object is a dictionary-like structure containing two keys:

- `file_name`: (e.g., `index.html`)
- `file_content`: (e.g., `<h1>Hello World</h1>`)
  This structured output makes it easy for your code to directly process and use the generated files, such as pushing them to GitHub.

**Q14: How does the "model retry" feature work for invalid outputs?**
**A14:** When your LLM generates an output that doesn't conform to the Pydantic model's validation rules (e.g., a number outside a specified range), the `ai-agent` automatically catches this validation error. It then constructs a new prompt that includes the original request, the LLM's previous (invalid) response, and a clear message explaining _why_ the response was invalid (e.g., "choose a number greater than 10"). It then retries the LLM call. This process repeats for a configurable number of retries (`max_retries`) until a valid output is received or the retry limit is exceeded, at which point an error is thrown. This ensures robustness in handling LLM generation failures.

**Q15: How can I optimize the LLM processing time, perhaps using parallel processing?**
**A15:** The `ai-agent` is designed to handle parallel tool calls where appropriate. If your LLM generates multiple tool calls that can run independently, the system will execute them in parallel. For example, if a task involves two independent web searches, both search tools can be invoked simultaneously. The overall performance also depends on optimizing your system prompt (through prompt engineering) to guide the LLM more efficiently. You can also explore different LLM tiers (e.g., "priority" vs. "standard" APIs) for faster processing, though this typically comes with increased cost.

**Q16: Why is the `Dockerfile` important for deployment?**
**A16:** The `Dockerfile` provides instructions for Docker to build a container image of your application. This image encapsulates all your code, dependencies, and environment configurations, ensuring that your application runs consistently across different environments, including Hugging Face Spaces. It specifies the base Python image, copies your project files, installs requirements, and defines how to run your application within the container.

**Q17: How does `ai-agent` handle file attachments from the user prompt for tasks like updating existing code?**
**A17:** When you prompt the agent with a task that requires modifying existing files (like adding a feature to a Tetris game), you can attach the existing file content directly in your prompt. The agent's tools can be designed to parse this attached content, make the necessary modifications, and then provide the updated file content in the structured output. This allows the LLM to understand the current state of the files and generate relevant changes. The agent's output type is a list of file contents, making it easy for you to push directly to GitHub.

**Q18: What is the purpose of the `__init__.py` file in the `src` directory?**
**A18:** The `__init__.py` file is an empty Python file that signals to Python that the `src` directory should be treated as a Python package. This allows you to import modules (like `main.py`) from within the `src` directory as if they were part of a larger package structure, which is standard practice in Python project organization.

**Q19: Can you explain what a "decorator" is in Python and how it's used here with the tool functions?**
**A19:** A decorator in Python is a special type of function that allows you to modify or extend the behavior of other functions or methods without directly changing their source code. Here, the `@tool_plane` decorator is used to register a function (like `duckduckgo_search_tool`) as an available tool for the LLM agent. When the agent needs to perform a specific task, it knows which decorated functions (tools) it can call. The decorator effectively makes that function accessible to the agent's internal reasoning process, and its output is automatically handled by the `ai-agent` framework.

**Q20: What is the purpose of the `output_validator` and how does it prevent incorrect LLM responses?**
**A20:** The `output_validator` (which uses Pydantic's `Field` with constraints) ensures that the output generated by the LLM strictly adheres to predefined rules. For example, for a `chosen_move` that should be between 0 and 8, the validator checks if the LLM's response falls within this range. If the response is outside these bounds, the validator fails, triggering an automatic retry by the agent. This prevents the system from accepting and acting upon erroneous or out-of-bounds outputs from the LLM, making the application more robust and reliable.

**Q21: You mentioned virtual environments and protecting PCs. What's the best practice for running open-source code?**
**A21:** The best practice for running open-source code, especially when you're taking code from various sources, is to use a virtual environment (like `venv` in Python). This isolates the project's dependencies from your main system. For an even higher level of security, it's recommended to run such code within a separate _virtual machine_. This provides an isolated operating system environment, ensuring that any malicious code cannot directly affect your host PC. So, first create a project folder, then a virtual environment inside it, and then run your code.

**Q22: Who is calling the `fastAPI` application, and who is invoking the `get_AI_move` function within it?**
**A22:**

1. **FastAPI Application:** Your FastAPI application (`main.py`) is running locally using `uvicorn`. It's exposed via an API endpoint. This application is called by _our server_ during the evaluation process.
2. **`get_AI_move` function:** The `get_AI_move` function (within your FastAPI app) is _not_ directly called by an external entity. Instead, it's invoked internally when a user request comes into your FastAPI application. It's within this function that you use the `ai-agent` to get an LLM-generated move.

**Q23: How do I handle potential conflicts or dependencies when running multiple agents or tools in parallel?**
**A23:** The `ai-agent` framework is designed to manage parallel tool calls. If your LLM decides to invoke multiple tools simultaneously (e.g., for independent web searches), the framework handles their execution in parallel. The system prompt is crucial here; it guides the LLM on how to break down complex tasks into independent steps that can be processed concurrently. For dependencies, if one tool's output is required for another's input, the LLM will sequence the calls accordingly, ensuring that dependencies are respected before parallel execution.

**Q24: What is the difference between `tool_plane` and `tool` in terms of decorators for functions?**
**A24:** The difference typically lies in how the tool's context or configuration is managed. `tool_plane` (as used here) is often a simpler decorator for basic tool registration. A more advanced `tool` decorator might allow for injecting additional _context_ (like authentication tokens or specific user information) into the tool's execution, which `tool_plane` might not handle directly.

**Q25: What is a "context" in the context of `tool_plane`?**
**A25:** A "context" (or `ctx`) refers to additional information that can be passed to a tool function during its invocation. This could include session data, user preferences, API keys, or any other relevant details that the tool might need to execute successfully. For example, if a tool needs to interact with a specific user's database, the `ctx` object might contain the user ID or database credentials.

**Q26: Is there a way to limit the number of retries the model attempts before giving up?**
**A26:** Yes, the `model_retry` decorator allows you to set a `max_retries` parameter. This defines how many times the agent will attempt to get a valid response from the LLM after an initial failure. For example, `max_retries=3` means the LLM will be called up to 4 times (1 initial attempt + 3 retries) before giving up and throwing an error.

**Q27: How can I customize the model's system prompt to influence its behavior and responses?**
**A27:** You define a `system_prompt` string when creating your agent. This string acts as initial instructions for the LLM, guiding its role, tone, and specific constraints for generating responses. For instance, you can tell it, "You are an expert in the Tic-Tac-Toe game; you will try to win the game." You can also make the prompt dynamic, incorporating elements like the current game state or specific error messages to guide subsequent retries.
