# Live Session: 21 Jan 2025

[![2025-01-21 Week 2 - Session 2 - TDS Jan 25](https://i.ytimg.com/vi_webp/0e0RhXREnxU/sddefault.webp)](https://youtu.be/0e0RhXREnxU)

**Q1: How much depth of knowledge is needed for the tools in the TDS course, specifically for GA1 and GA2?**

**A1:** The goal is to give you sufficient proficiency to execute the purpose of the tools, not to make you an expert. The focus is on GA1 and GA2 because of the approaching deadline. Basic knowledge will suffice; how deep you go is up to you. The biggest challenge is usually reading and understanding documentation. These sessions are designed to help you overcome that hurdle.

**Q2: What is the tool to create the API?**

**A2:** FastAPI. It will be demonstrated in this session.

**Q3: Will there be a review of the previous sessions?**

**A3:** Recordings are available on the YouTube playlist. Summaries are also available on the Tools in Data Science website (the last item on the page). The summaries were generated using AI, and the process is explained. An overarching summary may be added later, but not today.

**Q4: In the week 2 GA assignment, when using FastAPI, question 9 asks for an authentication tool from NGrok. After three uses, it says the limitation has expired. What can we do?**

**A4:** NGrok will be discussed in this session. The limitation is that you can only run one server or one tunnel at a time.

**Q5: In the GitHub Actions section, question 7 asks about creating a FastAPI webpage using GitHub. It seems to require a premium version. Is there a workaround?**

**A5:** You can do it without a premium version. The only time you might have an issue is if you're using Codespaces and run out of the 125-hour limitation. Students have free access to GitHub.

**Q6: What is the tool to create the API?**

**A6:** FastAPI.

**Q7: Are the scores from the initial check (9/10 or 10/10) final, or will they be evaluated after submission?**

**A7:** Whatever you last submitted is your final score.

**Q8: In GA1, question 2 says to submit only the JSON body, not the headers. But if I don't submit headers, it shows an error. What should I do?**

**A8:** This will be addressed toward the end of the session.

**Q9: When running UVicorn on WSL, there are no issues. But on Windows, it seems there's an issue with anti-something, some shielders, or something on my computer, flagging it and preventing it from running. What should I do?**

**A9:** Most web infrastructure runs on Linux servers (maybe 80%). These tools are designed with Linux in mind, and later ported to Windows. There will be some issues running them on Windows. You can get Linux in Windows now using the Windows Subsystem for Linux (WSL). You need at least 8 GB of RAM to run it with reasonable performance. Anything less won't work or will work poorly. If you can, install WSL; it's worth it. Then these tools will work out of the box.

**Q10: What is CI/CD?**

**A10:** Continuous Integration/Continuous Deployment. It automates tasks such as compiling, running, and sending code to devices. It reduces the time lag between finding a bug, fixing it, and pushing the fix to the devices that need it. This is useful in data science when pulling data from various places and quickly integrating findings into a workflow.

**Q11: What is Vercel?**

**A11:** Vercel is a platform to deploy applications. You can deploy quickly and easily, and it automatically rebuilds when you push an update. You can deploy directly from your GitHub repo.

**Q12: What is the difference between Docker run and Docker compose?**

**A12:** Docker compose is for local testing. You can create a local network, give it a name, and test with four or five containers. For larger deployments, use Swarm (provided by Docker), Kubernetes, or Mesos.

**Q13: Can we wrap our MAD1 and MAD2 projects using Docker?**

**A13:** Yes, that's possible.

**Q14: Is there a demo where all the tools are used in a single project?**

**A14:** There will be a separate session for the project, towards the end of this week or the beginning of next week. This session will show how all the tools fit together.

**Q15: If someone goes through CSS, JavaScript, GitHub, and REST API, will that cover 50% of the course?**

**A15:** Yes, roughly. The core technologies (REST APIs, JavaScript, HTML, CSS) haven't changed much in 30 years. Learning these will give you a foundation to learn other tools more easily. The course will also spend significant time on LLMs and how they fit into the workflow.
