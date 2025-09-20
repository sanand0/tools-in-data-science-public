# Live Session: 23 Jan 2025

[![2025-01-23 Week 3 - Session 4 - TDS Jan 25](https://i.ytimg.com/vi_webp/TxGY540ru3A/sddefault.webp)](https://youtu.be/TxGY540ru3A)

**Q1: How can I compare two files using the command line?**

**A1:** You can use the `diff` command in bash, or the `git diff` command if you've initialized a git repository. The `diff` command shows the differences between two files directly. `git diff` compares commits in a git repository.

**Q2: I'm having trouble viewing my GA1. It's showing zero ones. Can you help?**

**A2:** Let's look at your screen. It appears there are different timestamps. I'll help you troubleshoot.

**Q3: How can I move files from multiple subfolders into a single folder using the command line?**

**A3:** I used a bash script that combines the `find` command (to locate files of a specific type, like `.txt` files) and the `mv` command (to move them). The `find` command searches the current directory (`./`) for files (`-type f`) and the `-exec` option executes the `mv` command on each file found. The curly braces `{}` are placeholders for the filenames.

**Q4: Will knowing only six SQL commands (SELECT, FROM, GROUP BY, etc.) be enough to complete this course?**

**A4:** You'll only need basic SQL for this course, mainly for extracting data. We're not covering a full DBMS course. A good resource to learn more is SQLZoo. While you might not need more than six commands for this course, ChatGPT can help if you encounter more complex SQL queries.

**Q5: How can I deploy a Flask application to Vercel?**

**A5:** First, set up a git repository and connect it to your GitHub account. Then, create a virtual environment for your Python project using `python -m venv <env_name>`. Activate it using the appropriate script (e.g., `.\env\Scripts\activate`). Install Flask using `pip install flask`. Create a `.gitignore` file to exclude the virtual environment folder. Then, create a `vercel.json` file with build instructions for Vercel. Commit and push your code to GitHub. Finally, add your project to Vercel, selecting the correct repository and build settings (Python, not Node). Vercel will automatically redeploy your application whenever you push changes to GitHub. This is called CI/CD (Continuous Integration/Continuous Deployment).

**Q6: What does the port number matter when deploying to Vercel?**

**A6:** When deploying to Vercel, the port number you use locally doesn't matter because Vercel will assign your application its own domain. You should remove `debug=True` from your Flask application before deploying to production.

**Q7: Why do I need administrator permissions to use ngrok?**

**A7:** ngrok is a command-line tool that forwards requests to your local host. It doesn't need to be installed in your virtual environment. However, you might need administrator privileges to forward requests through a port. If you encounter permission issues, try running PowerShell as administrator.

**Q8: What is ngrok and how does it work?**

**A8:** ngrok creates a public URL that forwards requests to your locally running application. This allows anyone on the internet to access your application, even though it's running on your local machine. Your computer acts as a server. Note that ngrok only works while your local server is running. For a permanent solution, deploy to a platform like Vercel or Netlify.

**Q9: What is a virtual environment and why is it useful?**

**A9:** A virtual environment creates a separate, isolated environment for your project. This prevents conflicts between different project dependencies. Think of it like creating a separate section in a swimming pool for a child, where the depth is less than the main pool. You can install libraries (like Flask and Pandas) within the virtual environment without affecting your global Python packages.

**Q10: What is the assignment?**

**A10:** Create a Flask application that takes a user's birth month as input and returns their zodiac sign. This is a fun exercise to improve your Flask skills. You can deploy it to Vercel or Netlify and share the link. Remember to create a `.gitignore` file to exclude the virtual environment folder.
