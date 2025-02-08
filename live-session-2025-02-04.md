# Live Session: 04 Feb 2025

[![2025-02-04 Week 4 - Session 1 - TDS Jan 25](https://i.ytimg.com/vi_webp/8A7Z_PN_PzQ/sddefault.webp)](https://youtu.be/8A7Z_PN_PzQ)

**Q1: I'm having trouble with question 7 of the GA3 assignment. I'm trying to send a POST request, but it keeps showing "method not allowed".**

**A1:** When you access a URL from a browser, it sends a GET request. To send a POST request, you need an extension like Thunder Client or Postman. Thunder Client doesn't require a login, but Postman does. However, Thunder Client is now a paid service.

**Q2: Previously, I was seeing some things, but now I'm getting the "method not allowed" error. I don't know why.**

**A2:** Let's troubleshoot this. We'll use Thunder Client.

**Q3: After changing my method to POST, what do I do next?**

**A3:** Go to the "Body" section in Thunder Client. Create a JSON object using curly braces `{}`. Then, refer to question 7 for the JSON object to copy and paste. Remove the three dots (...) from the copied JSON. Click the "Send" button.

**Q4: I'm getting an error: "API key client option must be set either by passing API key to the client or by setting the OPENAI_API_KEY environment variable." Am I trying to access an OpenAI key?**

**A4:** Yes, you are. Since you don't have a `.env` file, you need to create one. For now, comment out the code after line 172 and replace it with `return "hello"` to test. Restart the server.

**Q5: Thunder Client is not showing any paywall.**

**A5:** Thunder Client has a free version with limitations (e.g., 15 collections and 15 requests).

**Q6: Earlier, Thunder Client was free. When did it change?**

**A6:** Recently.

**Q7: I'm still stuck. Can you spell "Thunder Client"?**

**A7:** T-H-U-N-D-E-R-C-L-I-E-N-T

**Q8: I'm still getting errors. What's wrong?**

**A8:** Let's review your code. You're trying to send a request using the OpenAI module, which won't work. You need to send the request through an API proxy.

**Q9: I tried using an API proxy, but I still got errors.**

**A9:** Let's focus on getting the basic functionality working. We'll create a simple application and send a POST request using Thunder Client.

**Q10: In the code, what goes in the brackets on lines 19, 20, 21, and 23?**

**A10:** Those lines are for allowing requests from external servers. You can list the servers you want to allow. If you use `*`, anyone can access the application. It's better to restrict access by listing specific servers. For example, if you only want to allow access from `server1` and `server2`, you would list them. You only need to mention the domain name.

**Q11: I'm stuck on the Docker part of the assignment.**

**A11:** Let's review the Docker process. You need to create a Docker image and push it. The deliverables are the Git repo and the Docker image. It should be a public repository.

**Q12: I'm having trouble with the FastAPI part of the assignment. I'm trying to send a POST request to a specific endpoint, but it's not working.**

**A12:** Let's review the code. You'll need to automate the process using an LLM. The LLM will generate the code, which you'll then execute using the subprocess module in Python.

**Q13: Why do we need to use the subprocess module?**

**A13:** In this project, you'll receive tasks in different languages (English, Hindi, Urdu). The LLM will generate the code to handle these tasks. The subprocess module allows you to execute the generated code on your local machine.

**Q14: I have a question about the Base64 encoding in GA3, question 6. I converted an image to Base64 using Python, but the UI said it was wrong. I found another method, but how do I know which Base64 encoding is correct?**

**A14:** If you paste the Base64 encoding into a decoder, you can visually compare the resulting image to the original. The size and resolution should be the same.

**Q15: Some of my answers from previous assignments disappeared after logging out of the website. Why?**

**A15:** That's a known issue. Some answers persist, but others are lost.

**Q16: Can I still check the answers to previous assignments, even though the deadline has passed?**

**A16:** Officially, no. However, if you can check the answers, you can learn from your mistakes.

**Q17: I got stuck on the Docker part of the assignment. Can you elaborate?**

**A17:** It sounds like you may have had issues with Docker push and tagging. Let's review your process.

**Q18: I only gave myself 5 hours for this assignment, which wasn't enough. GA2 took a lot of time, especially the last question (running a local server on a different API).**

**A18:** Five hours is often insufficient for these assignments. GA2, in particular, can be time-consuming.

**Q19: For question 9, I'm trying to write a string that will make the AI say "yes," but it's not working. Can you give me some hints?**

**A19:** That's something you'll have to figure out on your own. Try different prompts. You can also look at previous Discourse posts for ideas.

**Q20: Can I do this using the command prompt, or is there a way to do it from the website?**

**A20:** You can use the website, but you may need to use the command prompt for some tasks.

**Q21: I used Docker Desktop, but I don't remember exactly what I did.**

**A21:** That's okay. Let's focus on the current assignment.

**Q22: What will be the description for the FastAPI part of the assignment?**

**A22:** The description will include the three lines of code you've already seen. These will be part of the request parameters.

**Q23: Why can't I just pass an ID instead of the whole string?**

**A23:** There might be other tasks that require different inputs.

**Q24: How are we restricting access to data from other servers?**

**A24:** We use the `Allow-Origin` header to specify which servers are allowed to access the data. The header contains information about where the request is coming from and the type of request (GET, POST, etc.). If you use `*`, any server can access it. Restricting access is a security measure.

**Q25: What is the trigger point for this assignment?**

**A25:** The trigger point is the same as before: a REST API POST call.

**Q26: For the fetch data from API and save it task, what is the URL?**

**A26:** It can be any URL. The assignment is about comparing your code, not fetching data from a specific URL.

**Q27: What is the purpose of the subprocess module?**

**A27:** The subprocess module allows you to execute commands from within your Python script. This is useful for executing code generated by the LLM.

**Q28: For task 3, what is the expected output?**

**A28:** The task can be described in different ways (e.g., English, Hindi). The LLM will generate the code to handle the task. You'll need to execute that code using the subprocess module.

**Q29: Is there a time frame for completing the project?**

**A29:** We'll prioritize project 1. We'll discuss the timeline for project 4 later.

**Q30: I have a question about the Base64 encoding in GA3, question 6. I converted an image to Base64 using Python, but the UI said it was wrong. I found another method, but how do I know which Base64 encoding is correct?**

**A30:** You can compare the decoded image from both methods visually. The size and resolution should be the same. If the encoding is correct, the decoded image will match the original. You can also encode the image using an encoder to verify.

**Q31: In previous assignments, some answers disappeared after logging out. Can we still check the answers to previous assignments, even though the deadline has passed?**

**A31:** Officially, no. However, reviewing your answers can still be beneficial for learning.

**Q32: Can you give me some hints on how to write a prompt to make the AI in question 9 say "yes"?**

**A32:** That's something you'll need to figure out on your own. Try different prompts. You can also look at previous Discourse posts for ideas.
