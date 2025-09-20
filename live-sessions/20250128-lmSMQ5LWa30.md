# Live Session: 28 Jan 2025

[![2025-01-28 Week 3 - Session 1 - TDS Jan 25](https://i.ytimg.com/vi_webp/lmSMQ5LWa30/sddefault.webp)](https://youtu.be/lmSMQ5LWa30)

**Q1: Can I ask a question about the graded assignment for week one?**

**A1:** I'll try to answer it at the end of the session if there's time. We'll also have extra sessions this week, and we're hoping to release video solutions showing how to solve some of the assignments. But for now, let's focus on today's session.

**Q2: I posted a question on the Discourse forum about the assignment. Should I ask it again now?**

**A2:** No need to ask it again. I'll look at the forum later.

**Q3: DeepSeek is in the news. Does that affect the course?**

**A3:** Not really. The core concept remains the same: using LLMs as agents. The workflow is similar whether you use OpenAI, Anthropic, Copilot, or other AI tools.

**Q4: What is the concept behind Project One?**

**A4:** Project One involves creating an automated continuous integration pipeline. Data comes into a server, and various tasks are performed, many of which are repetitive. The goal is to automate some of this process to reduce errors and produce structured output. Your job is to build an API that handles these tasks using an LLM.

**Q5: What kind of tasks can I expect?**

**A5:** There are roughly 10 tasks in Phase A, which should be straightforward. In Phase B, the tasks are less well-defined, testing your system's ability to handle unexpected requests. The API should have two endpoints: "run" and "read". The "run" endpoint receives a task description (in plain English), processes it, and creates output files. The "read" endpoint retrieves the contents of a specified file.

**Q6: In GA1, the videos and questions aren't showing after the submission deadline. Can they be shown?**

**A6:** I'll inform Anand. The videos should still be available on the Tools in Data Science portal. They're from this section.

**Q7: Why are the videos and questions integrated into the GA itself?**

**A7:** Based on past data, students often go straight to the assignments without reviewing the content. Integrating the content into the GA is a better way to ensure they see it.

**Q8: I'm struggling with the project. The concepts are confusing. Could you present a model project and explain things step-by-step?**

**A8:** Yes, we'll do that in future sessions. We'll work through a working prototype of the project to illustrate each step. The project only uses material from the first three weeks of the course. If you're thorough with that material, you should be able to complete the project. It seems there's a knowledge gap, but I have full faith you can handle it. We'll address that gap in future sessions, starting with the basics.

**Q9: I'm having trouble with Git and GitHub. Is there support available?**

**A9:** Yes, we'll provide as much support as possible. We'll also go through a working prototype in future sessions. If you're struggling with Git, you won't be able to do the project, as it's a prerequisite. We'll create a repository during a future session so you can see how it's done.

**Q10: What's required for grading?**

**A10:** Your repository must meet these criteria:

- It must exist and be publicly accessible.
- It must have a license file (MIT license).
- It must have a valid Dockerfile.
- The Docker image must be publicly accessible and run via the specified command.
- The Docker image must use the same Dockerfile as your GitHub repository.

It doesn't have to be publicly accessible while you're developing it. Just make sure it's public when you submit. These are absolute prerequisites; if any fail, your project won't be evaluated.

**Q11: What is the grading scheme?**

**A11:** Phase A is worth 10 marks, and Phase B is worth 10 marks. You get one mark for each task completed in Phase A and one for each task in Phase B. There are also bonus marks for additional tasks and code diversity. Last term, there were 12 bonus marks, and the highest score was 7 or 8 out of 12.

**Q12: We give bonuses for code diversity. Does that mean we penalize copying?**

**A12:** No, we don't penalize copying. We want you to learn. We encourage you to learn from each other, but we'll reward unique code.

**Q13: How do I use the OpenAI LLM?**

**A13:** You'll use it through a proxy. You'll get a $1 limit per month, renewed at the beginning of each month. Avoid exceeding this limit by carefully constructing your queries. We'll show you how to use environment variables to avoid putting your token directly in your code.

**Q14: How do I get access to Perplexity AI?**

**A14:** All IITM students (including BS students) have free access to the Pro version of Perplexity AI for one year. Use your IITM email address to register.

**Q15: In the LLM section, the prompt engineering section mentions using the API a certain number of times. I haven't used it even once. The key was generated, but I didn't use it. What should I do?**

**A15:** We'll cover this in a later session.

**Q16: The textbox in question 3 doesn't appear. I think there's a CSS issue. I generated the JSON, but it's not being accepted. Should I refresh?**

**A16:** We'll cover this in a later session.

**Q17: There was mention of a debrief session on the project. I couldn't find the video. Is there one?**

**A17:** Yes, at the beginning of this session, we discussed the requirements for Project One. We'll upload this video in a few hours or early tomorrow.

**Q18: Will there be support for those not well-versed in Git and GitHub?**

**A18:** Yes, we'll provide support. We'll also go through a working prototype in future sessions.

**Q19: Is the week two content completely covered in the sessions?**

**A19:** Yes, but the way we covered it is a bit different. We went through the important parts. Referencing past sessions will give you a concise idea of the important parts.

**Q20: I have a question about GA1, questions 10 and 11. I posted them on Discourse, but haven't received a reply. In question 10, the hash button is showing an error. In question 11, I don't understand the statement about the class in the hidden element below. What does this line mean?**

**A20:** Regarding question 10, you have to use inverted double quotes for the key and value in the JSON file. Regarding question 11, you need to right-click and inspect the element to find the class name. The data value should be 35.

**Q21: So, for this one, I don't get anything. Did I do it correctly? Should I submit anything else?**

**A21:** You just say "yes" here, and then submit to the URL. It will only pick up the API itself. Remove the question mark.

**Q22: Why isn't it reflecting?**

**A22:** It may be because you haven't pushed to GitHub yet.

**Q23: I have a question about prompt engineering. It mentions using the API a certain number of times. I haven't used it, but it generated a key. Can I proceed?**

**A23:** No, you don't need to use the API multiple times. The free OpenAI API access is only through the proxy. A normal OpenAI account is a subscription service and doesn't give you API access. You have to buy tokens to use the API.

**Q24: I've used a normal OpenAI account before. I was hoping to use those model IDs. Why can't I?**

**A24:** The free OpenAI account doesn't give you API access. You can only use their web-based service. To use the API, you have to buy tokens.

**Q25: Can you show me how to do that? Can I share my screen?**

**A25:** No need to share your screen. I'll show you how to access the API via the proxy. That's how your project will have to work.

**Q26: The ninth question in the prompt engineering section mentions paying money. Do I have to pay?**

**A26:** No, you don't have to pay.

**Q27: I have a few more questions. Will we have more sessions before GA3 is due?**

**A27:** Yes, we'll have at least three more sessions before GA3 is due.

**Q28: I thought GA3 was due this weekend. Is that wrong?**

**A28:** Yes, it's due this weekend, but we'll have three more sessions before then.

**Q29: I have another question. Is it okay to ask now?**

**A29:** Sure.

**Q30: I submitted my answers, but I don't know if I did it correctly. There's nothing to submit here. I just say "yes"?**

**A30:** You just say "yes" and submit to the URL. It will pick up the API itself.

**Q31: Why isn't it reflecting?**

**A31:** It may be because you haven't pushed to GitHub yet.

**Q32: I have a question about GA1, questions 10 and 11. I posted them on Discourse, but haven't received a reply. In question 10, the hash button is showing an error. In question 11, I don't understand the statement about the class in the hidden element below. What does this line mean?**

**A32:** For question 10, you need to use inverted double quotes for the key and value in the JSON file. For question 11, you need to right-click and inspect the element to find the class name. The data value should be 35.

**Q33: What are some other core concepts that are important to understand?**

**A33:** Before I talk about those, let's start with a simple example of how to make an API call to an LLM. API calls are powerful because you can use them in your programs.

**Q34: How do I get my API key?**

**A34:** You can find the link to get your proxy token on the GitHub page. I'll demonstrate using this proxy, but you can use something similar for other LLMs.

**Q35: What is a proxy?**

**A35:** OpenAI provides the service, but you don't interact with them directly. Anand has purchased tokens from OpenAI and provides access via a proxy. The proxy acts as a middleman between you and OpenAI.

**Q36: How many tokens does a prompt take?**

**A36:** The prompt we used took 32 tokens. The response ("negative") took two tokens. The total was 34 tokens. This cost us 1/10,000 of a dollar. Keep track of your token usage.

**Q37: How can I keep track of token usage?**

**A37:** Keep track of the prompt and the cost in a file. This will help you be efficient.

**Q38: How are API calls made?**

**A38:** You'll need a URL, headers (including authorization), and a JSON payload. The payload includes the model, messages, and response format. The response format should be strictly defined to avoid unexpected output.

**Q39: Can you share the notebook file?**

**A39:** No, we don't typically share the notebook file itself, as it prevents you from fully grasping the concepts. However, a sample file is available.

**Q40: What about function calling?**

**A40:** We'll cover function calling in a later session. It's a key part of the project. Function calling allows your LLM to decide which function to call based on the prompt. We'll use last term's Project Two to demonstrate.

**Q41: What about embeddings?**

**A41:** Embeddings are another important topic. They reduce the cost of using tokens by an order of magnitude. You can download embeddings from Hugging Face. We'll demonstrate this in a future session.

**Q42: What about text extraction?**

**A42:** We'll cover this in a future session.

**Q43: What about Base64 encoding?**

**A43:** We'll cover this in a future session. It's how you send images to the API.

**Q44: I've seen students use the LLM to get answers to Quiz One. Can I do that?**

**A44:** Yes, you can upload a screenshot of the question and ask the LLM for the answer and explanation. You would send it as a Base64 encoded URI. We'll cover this in a future session.

**Q45: Can we simply go through the topics mentioned (prompt engineering, TDS, TA instructions, LLM sentiment analysis) during self-study?**

**A45:** Yes, but this content is simplified. Reading through documentation is difficult, so we've put this together for you. We'll also demonstrate and do working examples.

**Q46: Can we change the time of the sessions? My other classes are clashing. I've already told the TA, but haven't received a response.**

**A46:** The Wednesday session cannot be moved. The Thursday session might be possible, but the sessions are generally kept in the evening because many students work during the day. We record all sessions, so you can view them later. We can try to schedule an earlier doubt-clearing session, perhaps on Friday, but I'll have to discuss it with the team. What time on Friday works for you?
