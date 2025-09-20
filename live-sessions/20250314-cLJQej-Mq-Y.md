# 2025-03-11 Week 9 - Session 1 - TDS Jan 25

[![2025-03-11 Week 9 - Session 1 - TDS Jan 25](https://i.ytimg.com/vi_webp/cLJQej-Mq-Y/sddefault.webp)](https://youtu.be/cLJQej-Mq-Y)

Duration: 2h 11m

Here's an FAQ based on the provided TDS tutorial transcript:

---

### Tools in Data Science (TDS) Tutorial FAQ

**Q1: What will this session cover?**
**A1:** This session will clarify expectations around Project 2, specifically regarding the use of function calling and other related concepts. We'll introduce you to the agentic coding workflow.

**Q2: Can I hardcode my solutions for Project 2?**
**A2:** Yes, you can hardcode everything, and there are no issues with that. However, be aware that the files sent to you via the API call and some parameters might change, so your hardcoded solutions should account for that.

**Q3: What is the main idea behind Project 2?**
**A3:** The idea behind Project 2 is that it's too large for one person to handle. The goal is for participants to collaborate and work on different sections of the project. The agentic coding workflow, which we'll demonstrate, will make this collaboration trivial.

**Q4: Will the session be streamed on YouTube?**
**A4:** The YouTube stream for today's session hasn't been set up due to issues encountered last week. However, the session is being recorded. Future sessions might be streamed.

**Q5: What is the NetworkX library used for?**
**A5:** The NetworkX library is primarily used for dealing with graphs. Graphs are a type of data structure with multiple elements (nodes) and connections between them (edges). NetworkX helps you create these graphs and perform various functions on them to extract information.

**Q6: Can you clarify what nodes and edges are in a graph?**
**A6:** In a graph, "nodes" are the individual elements or points, and "edges" are the connections between these nodes. Edges can also have "weights" representing a cost or distance between connected nodes.

**Q7: How do I install and initialize the NetworkX library?**
**A7:** You can install it using `pip install networkx`. To initialize a graph instance, you typically use `nx.Graph()` (assuming `nx` is an alias for NetworkX).

**Q8: How do I add nodes and edges to a graph in NetworkX?**
**A8:** You can add nodes using methods like `g.add_nodes_from()`, passing a list of node identifiers. To add edges, you can use `g.add_edge()`, specifying the two connected nodes and optionally their weight. You can iterate through a list of tuples representing edges (e.g., `(node_a, node_b, weight)`) to add them efficiently.

**Q9: What is the `shortest_path` function, and how can I use it?**
**A9:** The `shortest_path` function finds the shortest path between two specified nodes in a graph. You provide the starting node, the ending node, and optionally a `weight` parameter to consider edge weights in the path calculation. The function returns a list of nodes that constitute the shortest path.

**Q10: What are the practical applications of graph libraries like NetworkX?**
**A10:** Graphs are very versatile. For example, you can model a map of cities as a graph, where cities are nodes and distances between them are edge weights. NetworkX can then find the shortest route between two cities. It's useful in many problems involving interconnected data, such as routing, social networks, and dependency mapping.

**Q11: Can nodes and edges in NetworkX use non-numerical values?**
**A11:** Yes, you're not limited to numerical values. You can use textual values (strings) for your nodes as well, like city names ("Delhi", "Mumbai"). The library will handle them correctly.

**Q12: What is VS Code Insiders, and why do I need it?**
**A12:** VS Code Insiders is a version of VS Code designed for developers, offering the latest features and updates. For this particular workflow, it's recommended to install it.

**Q13: What is the "Open with Code" option in the Windows Explorer context menu, and how do I enable it?**
**A13:** This option allows you to quickly open a file or folder in VS Code (or VS Code Insiders) directly from the right-click context menu in Windows Explorer. To enable it during installation, make sure to check the box that says "Add 'Open with Code' Insiders action to Windows Explorer file context menu."

**Q14: What is the core difference between VS Code and VS Code Insiders?**
**A14:** VS Code Insiders receives daily updates and contains the latest experimental features. Regular VS Code gets less frequent, more stable updates. Insiders may have some features not yet present in the stable build.

**Q15: What is the purpose of the provided code snippet related to Project 2 and GitHub?**
**A15:** The presenter demonstrated a script that automates tasks for Project 2. This script can take a question and a file as input, solve the question (potentially using AI like GPT), and then create a GitHub repository, commit the solved file, and manage other GitHub interactions automatically.

**Q16: Can the script solve Project 2 completely, or is it more of a helper?**
**A16:** The script doesn't solve Project 2 entirely on its own, but it can automate significant portions, especially those involving repetitive tasks like creating repositories or committing solutions. It's designed to streamline the workflow for specific question types, such as finding the shortest path between cities.

**Q17: How does the script know which question it's dealing with?**
**A17:** The script is designed to identify specific keywords or patterns within the question. If it detects certain keywords, it knows which corresponding function or logic to execute to solve that particular type of problem.

**Q18: What is the significance of "NetworkX" or "Jupyter" in the context of the script's functionality?**
**A18:** The script uses `NetworkX` for graph-related problems (like shortest path), and `Jupyter` is the environment where the Python code, including the script, would be run and demonstrated.

**Q19: Can you clarify the parameters expected by the GitHub API for creating a repository?**
**A19:** When creating a repository via the GitHub API, parameters like `name`, `description`, `private` (true/false), and `auto_init` (to initialize with a README) are commonly used. The `token` is essential for authentication.

**Q20: How do I handle file attachments in GitHub API requests for the script?**
**A20:** The GitHub API allows attaching files as part of a POST request, for example, when committing a solution. You would typically specify the `file_path` and `file_content` as parameters in your request body. The script can dynamically fetch the file content from your local system.

**Q21: Can I directly test my application by pushing files to GitHub Pages instead of Versel?**
**A21:** GitHub Pages is designed for hosting static files (like HTML, CSS, JavaScript). It's not a server environment that can process dynamic requests from a backend application. Therefore, you cannot directly test your application logic by pushing files to GitHub Pages in the same way you would with a dynamic server like Versel.

**Q22: How can I confirm that my application works with Versel if the project code needs to be running continuously?**
**A22:** The application needs to be hosted on a server that runs continuously to handle requests. This usually involves deploying the application, which means the server instance is always active, ready to receive and process requests from clients (e.g., your local machine sending a `curl` command).

**Q23: Is it possible to initiate another Versel server from my local machine to handle the requests for the application?**
**A23:** You can deploy your backend application on a Versel server. Once deployed, you can send requests (e.g., using `curl`) to that server's endpoint. The Versel server will then process the requests and return a response. This allows for testing and interaction with your deployed application.

**Q24: For the GitHub API, is it possible to use a global repository (collaborative repo) for all users to push their solutions?**
**A24:** While theoretically possible, using a single global repository for all solutions might lead to merge conflicts and management complexities. It's generally better for each student to have their own repository (or a designated repository for their team) for clearer version control.

**Q25: For questions that involve external URLs (e.g., fetching data from another server), how should I handle them within the script?**
**A25:** If a question requires fetching data from an external URL, your script would typically use a library like `requests` (in Python) to send a GET or POST request to that URL. The response from the external URL would then be processed within your script.

**Q26: For questions that have image URLs, how will the script handle them?**
**A26:** If the question involves an image URL, the script can download the image data using the `requests` library. The image data itself would then be part of the request payload when interacting with the GitHub API (e.g., committing the image file to a repository).

**Q27: How can I verify if the script successfully created a GitHub repository or committed a file?**
**A27:** After sending a request to the GitHub API, the API typically returns a JSON response indicating the status of the operation. Your script can parse this JSON response to check for success messages, new repository URLs, or other relevant information. If there's an error, the response will often include error details.

**Q28: Is there a way to dynamically retrieve the GitHub token instead of hardcoding it in the script?**
**A28:** Yes, it's highly recommended not to hardcode sensitive information like GitHub tokens directly in your script. Instead, you can use environment variables (e.g., `os.environ.get('GITHUB_TOKEN')` in Python) to store and retrieve your token securely.

**Q29: What should I do if a question requires a specific file format (e.g., CSV, JSON, PDF)?**
**A29:** The script would need to parse and handle these file formats appropriately. For CSV or JSON, Python libraries like `csv` or `json` can be used. For other formats like PDF, specialized libraries might be needed to extract content or interact with the file.

**Q30: For the grading process, will the solution files be checked based on exact content or functionality?**
**A30:** The grading process typically focuses on functionality and correctness. While the content of the file will be evaluated, minor formatting differences might be overlooked as long as the core logic and output are correct. The script helps ensure that the output matches expectations.

**Q31: What is the purpose of the `main.o` file mentioned in the transcript?**
**A31:** The `main.o` file likely refers to an object file in a compiled language (e.g., C/C++), which is an intermediate file generated during the compilation process before linking to create an executable. If the project involves compiled code, this would be part of the build pipeline.

---
