Here's an FAQ based on the provided transcript of the TDS tutorial:

**Q1: I have an ROE score discrepancy. My highest official score is 5, but after a server stop and computer reload, my most recent score became 4. Can my highest score be considered?**

**A1:** That's an administrative decision, and I don't handle it directly. Please post your question on the discourse forum, and the relevant personnel will address it.

**Q2: For Project 2, the sample inputs are limited to two sources (HTML Wikipedia and DuckDB). What is the scope of the project, and will we receive more test cases?**

**A2:** The project's scope is broad, encompassing almost anything programmatically achievable. Yes, I will provide more examples. The core idea is to replace a data analyst, meaning the system should handle arbitrary tasks a manager would give a data analyst. This involves asking the LLM to write code to solve problems, rather than you creating specific tools for various situations.

**Q3: My previous project struggled with image questions. Will Project 2 involve image questions?**

**A3:** There's a good chance image processing will be part of the project. There's an even higher, almost certain, chance that image generation in some form will be included because data analysts frequently create charts. So, probably.

**Q4: LLMs are prone to hallucinations. I've tried AST manipulation, but the results are inconsistent. Do you have any suggestions to combat this?**

**A4:** I've found three main approaches to be reasonably robust:

1. **LLM Verification:** Have one LLM verify the output of another. This effectively doubles your cost but significantly improves accuracy. For example, in a classification task, having two LLMs cross-check each other reduced the error rate from 14% to 3.7%, and triple-checking brought it down to 2.2%.
2. **Code Execution and Validation:** If the code provided by an LLM runs, it's likely correct. You can verify the code itself, or simply run the code and check if the output seems reasonable.
3. **Systematic Prompt Improvement through Evaluation:** Instead of relying on prompt engineering (which is often more art than science), create a prompt, test it with sample questions, see how often it fails, modify it, and re-test until it reliably executes. Then, introduce more diverse examples.

**Q5: Will you be teaching us to use Perplexity AI Pro and Google's API in this course?**

**A5:** Good idea, next up!

**Q6: I've noticed an error in the sample response for movies grossing over $2 billion before 2020. The response lists only one movie instead of five. Is this a misinterpretation?**

**A6:** You're right, my mistake! I misread 2020 as 2000. I will correct this immediately. Thank you for pointing it out.

**Q7: What exactly are we going to do in Project 2? Are we training a model on a dataset, and then the LLM generates code for tasks like making charts, or will the LLM scrape websites and code in real-time based on a query?**

**A7:** It's the latter. There's no training or prior dataset. You'll be given a question, and the LLM should write code—one or multiple times—to solve the problem until it's done. I won't give you exact instructions because I want you to discover the best approach, and I'm hoping to learn from your responses.

**Q8: What is the best approach to enhancing and refining the project? I often get stuck on how to improve the quality to meet evaluation criteria. Should I just find tools and stick to them?**

**A8:** I'm not sure there's one "best" approach, but here are some thoughts:

1. **Keep it Simple:** Avoid over-specializing or optimizing for specific scenarios, as this can lead to worse overall results. If your solution becomes too complex to understand, simplify it, even if it means sacrificing some accuracy. Keep the solution at the level of your understanding.
2. **Work in a Group:** Others might spot issues or solutions you've missed.
3. **Use an LLM as an Advisor:** Pass your code to LLMs like CodeX, Claude Code, Cursor, or ChatGPT. Ask them specific questions on how to improve your code. If you don't know what to ask, ask them what questions you _should_ be asking.

**Q9: In my ML project, I'm stuck at 72% accuracy, while the maximum is around 78%. I've tried extensive feature engineering and increasing estimators, but it seems to be overfitting. What can I do?**

**A9:** Don't overfit, and check with your ML instructor.

**Q10: For the official evaluation, we have a 3-minute response window, but sometimes we get 429 or other server-side errors. Can we return the error code, or is there a specific protocol?**

**A10:** If you encounter such errors, you can try to minimize the issue by caching. If you face an error, try again with progressive delays. While one or two people might face this, we'll ensure it doesn't happen at scale. If it does, raise it, and we'll do a re-evaluation. Since evaluation is triggered from your end, and instructors won't trigger all at once, you can always retry the request.

**Q11: Will the course team share a quality solution after Project 2 is done?**

**A11:** Sure, why not? We can share a sample solution. It won't be the highest-scoring solution, but it will be the simplest one that achieves a decent score.

**Q12: I'm concerned about inference time and large HTML scraping without semantic operations on questions. How will the project handle extensive, complicated HTML scraping?**

**A12:** The project will likely involve scraping complex, large pages. It's possible to scrape them robustly without consuming too much context. Instead of passing the entire HTML to the LLM, ask the LLM to generate code that samples the HTML to produce a minimal structure, then use that minimal structure to write the scraper. This approach is more reliable and token-efficient.

**Q13: Given the potential for complex scraping, should we expect to implement specific tools like Playwright, or will the project's scope limit the need for such external libraries?**

**A13:** Playwright can indeed overcome difficulties in simulating a browser and executing JavaScript. While I haven't finalized the exact problem, it will be a real-world problem, reflecting what a data analyst faces. These often involve tools like Playwright. I encourage you to discover and share new tools. I won't limit you to a predefined list because part of this project is mutual learning.

**Q14: Will there be a problem requiring OCR, or will image processing questions focus more on image generation?**

**A14:** OCR is possible, but it's less frequent than image generation (specifically chart generation), which happens in about 90% of cases compared to OCR's 10%. If you have an analyst background, you'd know this intuitively. The goal is not for you to be an expert, but to use LLMs as a resource for expert advice. You can also consult other analysts in the community to prioritize tools.

**Q15: What is the estimated size of the codebase for a sample solution to Project 2?**

**A15:** A sample solution can be done in about 200 lines of code.

**Q16: Will you accept questions in text format, or do we have to ask them verbally?**

**A16:** Yes, you can ask questions in text format.

**Q17: Will Project 2 require downloading or installing specific software like Playwright or Tesseract?**

**A17:** You should be able to handle external dependencies like Playwright if needed. For tools like Tesseract, we expect you to handle it. You'll need to create a way around potential barriers, such as Cloudflare's crawler changes, by implementing simple solutions like using cURL to fetch requests.

**Q18: I'm curious about the LLM Psychologist role you mentioned on LinkedIn. How does one become an LLM Psychologist?**

**A18:** I just decided to call myself an LLM Psychologist. When I checked with our HR team, they said as long as it's unofficial, I can call myself whatever I want. You can put anything you want on your LinkedIn profile; no one's stopping you.

**Q19: How can we ensure our answers match yours, given that LLMs can provide multiple responses for the same question?**

**A19:** I don't know, and I'm not going to specify an exact answer. What I can say is that the LLM evaluating your answer will use a rubric. It will evaluate based on criteria like logical consistency, adherence to business recommendations, and correct chart generation. Some parts will be programmatically checked. So, there will be a degree of flexibility, but you'll be evaluated against objective and intelligent LLM-based criteria.

**Q20: Can we use libraries like LangChain?**

**A20:** Yes, you can do whatever you want.

**Q21: You mentioned using Playwright earlier. Does this imply we might need to handle specific niche output serializations that LLMs are usually unfamiliar with, like KDL or ROS Object Notation?**

**A21:** Absolutely not. We will use very popular, standard formats. My aim is to give you something representative of a real data analyst's work, and these niche serializations don't often appear there.

**Q22: Is three minutes a very limited time to answer a set of questions that may require scraping or data processing?**

**A22:** If done well, scraping, processing, and LLM thinking can comfortably fit within three minutes. However, if done inefficiently, it will be impossible. A big part of this project is learning to be efficient at every stage.

**Q23: Since we might need to scrape multiple pages, won't that exhaust the prompt context window and confuse the LLM?**

**A23:** Yes, if you send all pages to the LLM, it will absolutely exhaust the context window and confuse it. I will make sure that if you attempt that, it _will_ fail. You need to use an alternate approach. Refer to the video recording from earlier, where I discussed a strategy for scraping without sending all content to the LLM.

**Q24: Why were ROEs so hard this term, with many questions taking too much time?**

**A24:** ROEs are always designed to be challenging. They test your intuitive understanding of a concept, not just your ability to solve a problem. Projects, on the other hand, focus on how well you've learned and can apply concepts given enough time. They are complementary assessments.

**Q25: Can we use the paid OpenAI or any other APIs?**

**A25:** Yes, absolutely. You can use whatever API you prefer. It's your API, your execution.

**Q26: Do we have to be concerned about niche output serializations that LLMs are unfamiliar with, like KDL or ROS Object Notation?**

**A26:** No, absolutely not. We will use very popular, standard formats. My aim is to give you something that is representative of a real data analyst's work, and these niche output serializations don't often occur in such scenarios.

**Q27: Will there be an instructor-led session for Project 2?**

**A27:** Yes, there will be a session. I believe it will be a series of sessions.

**Q28: Is it possible for me to create an application and add a Google login so users can use their Gemini credits to run my application on their behalf?**

**A28:** Yes, you can ask them to enter their Gemini API key, and that will work for them. This is a common strategy, and it will be covered in the course.

**Q29: What is the best platform to deploy the project, as most free versions have limitations?**

**A29:** We've found that Vercel is good for immediate responsiveness. Hugging Face is also excellent for deploying an entire application, offering a powerful free backend. It requires a bit more setup, though, as you need to dockerize your application.

**Q30: How will the evaluation be done for Project 2? Will it be one question by one question, or all questions at once?**

**A30:** All questions will be given at once. You'll receive one input that says, "Get all of this done," and you'll have three minutes to answer all of them.

**Q31: What would be a good way to check the LLM output using another LLM?**

**A31:** The easiest approach is often quite effective. Simply take the output from the first LLM and present it to a second LLM with a prompt like, "This is the question, and this LLM gave me this answer. Find all the mistakes in this, and give me the corrected code." LLMs are generally good at critiquing each other.

**Q32: Will the questions for Project 2 be based on one source, or will there be multiple sub-questions from different sources?**

**A32:** Different people may receive different questions, so the sources could also vary. We won't have too wide a variety of sources, but there will likely be at least different filters on the sources, and possibly a few entirely different sources.

**Q33: How effective can this project be in making data analysts obsolete?**

**A33:** Yes, it can make data analysts obsolete, and fairly soon, if we define a data analyst as "the person who does the set of things a data analyst does today." The role itself will likely remain, but what a data analyst _does_ will change significantly, involving more use of LLMs and performing more advanced tasks.

**Q34: Is the exam portal intentionally kept in its current state so that those who know what to look for can access things that aren't normally visible?**

**A34:** Yes, that's correct. I want to see how many people can make use of this. It's a blend of deliberate design and a bit of laziness.

**Q35: Some people submitted their ROE and got 10/10 without filling anything in the input blocks. Is that really the purpose of the ROE, and is that even legal?**

**A35:** It is partly the purpose of the ROE, and yes, it is legal. In this course, I get to decide if we can allow it, and I've decided that "hacking" (as you put it) is permissible. If you knew how to do that and chose not to, that's great because you're pushing yourself in a certain way. If you didn't, that's fine too; I'll make sure you learn.

**Q36: What is "jugaad" and how does it relate to the course?**

**A36:** For those who don't know what "jugaad" means, please search online. It's about finding unconventional, innovative solutions with limited resources to get the job done. I'm hoping you'll learn a little bit of "jugaad" in TDS.

**Q37: My friend told me they can connect to my AI proxy and use it with unlimited credits. Is this possible?**

**A37:** I've just been informed about this. I'll make sure that AI proxy is shut down. Thank you for bringing it to my attention. The overall expense on AI proxy hasn't been worryingly high, so all your usage put together has been very reasonable. Well done!

**Q38: You mentioned earlier that we could debug the issue with AI proxy. I'm available to discuss this now. Can I share my screen?**

**A38:** Unfortunately, we're out of time for this session. Perhaps in tomorrow's session, or you can reach out to me via email. It might be instructive for others as well to understand how hacking works.

**Q39: Will we have access to the recording of this session?**

**A39:** Yes, the recording of this call will appear on the YouTube video playlists sometime after the call is finished.
