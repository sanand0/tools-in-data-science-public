# 2025 09 24 week 1 - Session 5 TDS Sep 2025

[![2025 09 24 week 1 - Session 5 TDS Sep 2025](https://i.ytimg.com/vi_webp/vBqJUhbZU3c/sddefault.webp)](https://youtu.be/vBqJUhbZU3c)

Duration: 1h 41m

Here's an FAQ based on the provided transcript, covering all questions and answers:

---

**Q1: Can I complete Graded Assignment 1 (GA1) without watching the videos?**

**A1:** Yes, you can complete most of the assignment just by following the instructions provided.

**Q2: How difficult is the course, and does the teaching approach accommodate different learning paces and backgrounds?**

**A2:** The course's difficulty often depends on how it's taught. Since it's a practical course, it's beneficial to go slowly and ensure all learners, regardless of their coding background, can keep up. Some learners may find it easier due to prior coding experience, while others will need more time. A balanced pace is important.

**Q3: Should the learning path be clearly defined, indicating what comes before and after each module or topic?**

**A3:** Yes, it's helpful for the learning path to be clearly defined, explaining what topics are prerequisites and what will follow. This helps learners understand the flow and context.

**Q4: Will I need to memorize many commands? How can I understand the theoretical relation between different tools and steps, rather than just copying?**

**A4:** While you will use various commands, you're not expected to just memorize them. The goal is to understand how these tools and steps connect theoretically. Early in the course, some tools might seem unrelated, but as you progress through projects and later weeks, you'll see how they integrate and why they are used. The instructor will also try to explain the theoretical context as we proceed.

**Q5: What are the main tools and their purposes being introduced in the course, like UV, LLM, Docker, etc.?**

**A5:**
*   **Git/GitHub (Version Control):** Used for managing code repositories, tracking changes, and collaborating with others on projects.
*   **Command-line Tools (e.g., bash, awk, grep, sed):** These are small but powerful commands that perform various tasks efficiently.
*   **Python:** A programming language frequently used in data science, with multiple packages relevant to the course.
*   **Databases:** For storing and querying data.
*   **Docker:** Used for deploying applications and containerizing them, ensuring they run consistently across different environments. (More on Docker will be covered in Week 2).
*   **LLM (CLI):** A command-line interface tool that allows you to interact with large language models, similar to how you might use a web interface, but via text commands.
*   **UV:** Used for running Python scripts and installing packages.

**Q6: What has been discussed so far today? (Asked by a late joiner)**

**A6:** Not much has been covered yet. We were primarily asking ChatGPT whether the graded assignments could be completed without watching the tutorial videos. We're about to start the GitHub setup.

**Q7: I've already installed Germany and OpenAI. What should I install next, as per the previous session?**

**A7:** Those installations (Germany and OpenAI) are related to the LLM CLI (Command Line Interface). Today, the focus is on GitHub setup.

**Q8: When setting up Git, should I use my official school email or a personal one? Is there a recommendation?**

**A8:** Any account works—your official student email or a personal email. There's no specific recommendation. You can choose whichever you prefer.

**Q9: Do I need to install Homebrew on Windows or is it primarily for MacOS/Linux?**

**A9:** No, you do not need to install Homebrew on Windows. It's primarily used for MacOS. For Linux, you would typically use its native package manager like `apt` or `pacman`.

**Q10: Should I use VirtualBox or WSL for this course, since I have both? Which is better?**

**A10:** For this course, WSL (Windows Subsystem for Linux) is sufficient and works well. VirtualBox, while providing a full Linux operating system, can sometimes slow down your system. However, if you already have VirtualBox set up with enough RAM and SSD support and aren't experiencing performance issues, you can continue to use it. If you have admin privileges to install things, it should be fine.

**Q11: Where should I download/install Git for Windows, e.g., in the C: drive or anywhere else?**

**A11:** Git for Windows is typically an `.exe` file, and you can install it anywhere on your system, just like any other `.exe` application.

**Q12: How can I check if Git has been installed correctly on my machine?**

**A12:** You can open your terminal or command prompt and type `git --version`. If Git is installed, it will display the version number. If not, it will indicate that the command is not recognized.

**Q13: If I install Git inside VS Code, will it work for my entire WSL environment or is it specific to that VS Code instance/project?**

**A13:** Git installations are environment-specific and isolated. If you install Git for Windows, it works in your Windows environment. If you install it within your WSL environment, it works for WSL. They don't directly interfere with each other. For example, if you open VS Code through PowerShell (Windows) it will use the Windows Git, but if you open it from WSL terminal it will use the WSL Git.

**Q14: Is it mandatory to create a GitHub repository first, or can I create a local repository and push changes later?**

**A14:** Yes, you will need a GitHub repository. You can either create it on GitHub first and then clone it, or create a local repository on your machine and then push those changes to a new GitHub repository later.

**Q15: When I created my GitHub repository, the layout (Overview, Repositories, Projects) is different from what you're showing. Why?**

**A15:** You might be on a different page. The instructor's demo shows the view *after* a repository has been created. If you click on "Projects" within your repository, you should see options for creating files, similar to the demo.

**Q16: I encountered an error "SSH key is not..." or "Could not establish connection" when trying to clone the repository via SSH. What does this mean, and how do I fix it?**

**A16:** This error means your local machine is not properly authenticated with GitHub via SSH. To fix this, you need to set up SSH keys. The process involves generating a public/private key pair on your local machine and then uploading your public key to your GitHub account settings. This allows GitHub to recognize your machine for secure access.

**Q17: Is it possible to use a different Python version for my local project than my global Python installation?**

**A17:** Yes, you can use a different Python version for your local project. Tools like `uv venv` or `pyenv` allow you to create isolated virtual environments, each with its own Python version and packages, without affecting your global installation.

**Q18: What is GitHub Copilot, and how can it be used in this course?**

**A18:** GitHub Copilot is an AI code-generating tool that can assist you in writing code. You can prompt it with descriptions or partial code, and it will suggest completions or entire code snippets. This can be useful for quickly generating boilerplate code, exploring ideas, or understanding how different parts of an application can be implemented. (It was shown generating a `pydantic` server structure based on a text prompt).

**Q19: Can you share the chat log you're using for reference?**

**A19:** Yes, the chat log will be shared so you can refer to the commands and explanations provided.

**Q20: For creating a new module with specific content, like for the Pydantic AI framework, can GitHub Copilot generate content, including video links and code snippets?**

**A20:** Yes, GitHub Copilot can generate content, including code snippets and even attempt to find relevant video links (though its success with video links can vary, depending on the specificity of the prompt and its training data). You can provide a detailed prompt asking for content in a specific format, including links, and it will try to produce it. This generated content can then be reviewed and validated before adding it to the course.

**Q21: How do you push changes from your local machine to a remote GitHub repository?**

**A21:** Once you've made changes and committed them locally (using `git add` and `git commit`), you can push them to your remote GitHub repository using the `git push` command. This will synchronize your local changes with the remote version. If it's a new repository, you might need to set the upstream branch first.

**Q22: If I have a local folder with files, can I clone it to a GitHub repository?**

**A22:** Yes, you can. You would typically initialize a Git repository in your local folder (`git init`), add your files (`git add .`), commit them (`git commit -m "Initial commit"`), and then link your local repository to a newly created empty remote GitHub repository (`git remote add origin <repo_url>`) before pushing your changes (`git push -u origin main`).

**Q23: How do you manage different versions or features of your code within Git?**

**A23:** Git uses branches for this purpose. You can create different branches (e.g., `main`, `development`, `feature-X`) to work on separate features or versions of your code without affecting the main codebase. You can then switch between branches, merge changes, and keep your development organized. By default, most repositories start with a `main` branch.

**Q24: I'm facing an issue where my Git credentials are not being recognized on Windows, even after setting up SSH keys. It's asking for authentication constantly.**

**A24:** This could be related to how Windows handles credentials, or it might be trying to use credentials from a different account. You can check your Windows Credential Manager (type "Credential Manager" in the Start menu search) to see if there are any stored Git credentials that might be conflicting. Sometimes, a different account might be linked. Also, ensure your SSH setup (generating keys and adding the public key to GitHub) is complete and correct for your WSL/Git Bash environment. If the issue persists, restarting VS Code or your terminal after setting up SSH correctly can sometimes help.

---
