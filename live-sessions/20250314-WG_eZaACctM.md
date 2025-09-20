# 2025-03-12 Week 9 - Session 2 - TDS Jan 25

[![2025-03-12 Week 9 - Session 2 - TDS Jan 25](https://i.ytimg.com/vi_webp/WG_eZaACctM/sddefault.webp)](https://youtu.be/WG_eZaACctM)

Duration: 1h 14m

Here's an FAQ based on the live tutorial:

---

**Q1: I'm currently working on Project 2. My progress is going well, but I'm stuck on some parts in Week 6. What specifically are these parts?**

**A1:** That's great to hear your progress! Regarding Week 6, you mentioned being stuck. Could you please check your notes and let me know the specific areas you're facing issues with?

**Q2: My scores haven't updated yet. They didn't increase after you mentioned they'd be pushed today.**

**A2:** I understand. I've already discussed the scores with Ananth, and they were supposed to be pushed today. I will send a quick note to JK to ensure this is looked into. In the meantime, please check your dashboard again.

**Q3: In Project 2, I'm encountering issues with file handling, especially when trying to deploy on Vercel. JSON-based questions work, but I'm unable to upload or process binary files (like zips) directly. I tried calling a local file with a POST request, but it resulted in an internal error.**

**A3:** When you say "handling files," do you mean sending a file into an endpoint?
The issue with files, especially larger ones or binary uploads, stems from the serverless nature of platforms like Vercel. They might not be designed for direct file transfers via API calls. Instead, the typical approach is for your endpoint to receive a _link_ (e.g., from a GitHub repository or blob storage) to the file, and then your application fetches the file from that link for processing. For processing, your local hash might not match because there could be a different internal logic or a key used in `encrypt.js` to generate the hash. I've noted this down to clarify with Ananth, especially regarding GA 1.8.

**Q4: For file handling, if a link to a GitHub repository is sent, that's fine for fetching. But if I need to perform operations like extracting a zip file or generating a hashmap, I'd need to process the file directly on the backend, not just fetch it. This is where I'm stuck.**

**A4:** Yes, you'd need some infrastructure (infra) on the backend to actually process the file content, not just store or fetch it. Vercel itself, being serverless, acts more as a reactive endpoint. It takes the request, potentially sends it to a separate processing server, gets the result, and then sends it back to you. The key is that the actual heavy-duty processing doesn't necessarily happen _on_ the Vercel function itself.

**Q5: I've tried question GA 1.8 (file handling) and managed to get the answer locally, but I couldn't host it on Vercel because the application size exceeded 250 MB. Also, I tried uploading zip files to my Vercel application directly, and it seemed to work for other questions.**

**A6:** It's good that it worked locally. However, Vercel generally isn't meant to host entire applications or handle very large files for direct processing, as it has size limits and its serverless nature is optimized for quick, stateless responses. If your application grows, you might need a dedicated server for the heavy lifting. The evaluation for Project 2 does _not_ explicitly require hosting on Vercel; it just needs a public API endpoint.

**Q7: If I'm not hosting on Vercel, how will my local endpoint run 24/7 for evaluation? Can I use AWS or give an IP address instead of a domain name?**

**A7:** Yes, you can host your application anywhere, including AWS, Azure, or even a low-power device like a Raspberry Pi. There are no restrictions on where the API endpoint is hosted, as long as it's publicly accessible. You can definitely use an IP address instead of a domain name if that's easier. Using a platform like AWS (which offers 3 months free) for hosting would resolve many of the hosting and processing issues you're facing.

**Q8: What exactly is a Raspberry Pi?**

**A8:** A Raspberry Pi is a tiny, fully functional, and very affordable computer. It's roughly the size of a credit card, costs around ₹2000 for a new one (or even less for used models), and consumes very little power (about 5 watts, less than a light bulb). It can run Linux and is incredibly versatile for various tasks like IoT projects, education, or hosting small servers. It can even run on a battery. It's a great option for hosting your Project 2 endpoint if you face deployment challenges with serverless platforms, providing a persistent, low-cost solution.

**Q9: For HTML handling (GA 1.11), how can I access the HTML content from the webpage? I'm getting a 200 status code but not the actual HTML structure.**

**A9:** When you make a request to that URL with the necessary authentication cookie, your endpoint _will_ receive the entire HTML page content (the DOM structure) as a response. You can then use a library like BeautifulSoup in Python to parse this HTML and extract specific elements (like `div` tags) as required by the question.

**Q10: For the hashing question (GA 1.10), if it uses JavaScript to generate the hash, and my local hash doesn't match the expected output, how do I solve it?**

**A10:** For questions involving specific hashing algorithms (like SHA256 in GA 1.10) that rely on client-side JavaScript or a predefined key, your local implementation needs to replicate that exact logic. I saw that `encrypt.js` file, which likely contains a specific key or preamble used to generate the hash. You'll need to understand and incorporate that same hashing logic into your function. You could try running that JavaScript code in a Node.js environment on your desktop to see if you get the expected output. If you're still stuck, please post on Discord.

**Q11: Can we get a list of all parameterized variables for each question? It's really difficult to understand what will be dynamic.**

**A11:** I understand your concern about identifying dynamic parameters. For questions where the task involves specific calculations or parsing based on parameters (like keywords for search, or numerical values), the evaluation will use varied inputs. For GA 1.11, the topic (e.g., Hacker, Linux, Python) and the number of points (e.g., 52) are parameterized. You can use an LLM or regular expressions to extract these parameters precisely from the input query. For example, if a question asks for content "in the country [PARAMETER] on", your regex can extract the word between "country" and "on".

**Q12: How will you evaluate our Project 2? How exactly will the requests be sent?**

**A12:** We will evaluate Project 2 by sending `curl` requests to your public API endpoint. Each request will include the question and, if required, a file (for file-handling questions). Your endpoint should then respond with a JSON body containing the answer. If the answer in your JSON matches our expected output, you pass the test case. We'll send several such requests with random inputs.

**Q13: For image processing questions, if the answer is an image, should we send it as a Base64 encoded string?**

**A13:** Yes, for any questions requiring an image as an answer, you should send it back as a Base64 encoded string within your JSON response.

**Q14: For questions related to Google Sheets (GA 1.14), do we need to use the Google Sheets API?**

**A14:** No, you do not need to use the Google Sheets API. For questions involving spreadsheet-like calculations, you can use Python formulas and libraries like NumPy or Pandas to derive the answer. We are only interested in the calculated result.

**Q15: What is the deadline for Project 2? I received an email mentioning a different date.**

**A15:** The deadline for Project 2 is March 31st. I apologize for any confusion caused by earlier reminder emails; those were sent by admin based on an outdated schedule. Please ignore those reminders and follow the official deadline.

**Q16: Some questions are very complex with long paragraphs. It's difficult to understand what the exact question being asked is, especially with all the context.**

**A16:** I understand. For complex questions with extensive context, the actual question usually starts after phrases like "Your task:" or a similar clear indicator. Focus on that specific instruction, and the preceding text provides the necessary context. The core task will be to produce an answer (often a numerical result or specific data point) based on the input.

**Q17: Is it possible to get a list of all parameters for all questions? It's really hard to prepare without knowing what's dynamic.**

**A17:** While a comprehensive list of all dynamic parameters might not be readily provided, the structure of the questions is generally static. For instance, GA 1.11 (HTML handling) will always have parameterized keywords like "Hacker," "Linux," "Python," and a number of points. You can use techniques like regular expressions or even an LLM to dynamically extract these parameter values from the incoming request.

**Q18: Is it allowed to use LLMs to solve all parts of Project 2, including generating Python functions?**

**A18:** Yes, you can use LLMs to solve parts of Project 2. My advice is to collaborate with others: divide the tasks, and if certain questions are tricky, use an LLM. If you want to hardcore answers for testing, that's fine. The project is designed to encourage collaboration and problem-solving.

**Q19: For questions like GA 1.6, which had issues with options and finding the highest correlation, is it resolved?**

**A19:** Yes, for GA 1.6, the issue with options and finding the highest correlation has been resolved. The correct approach is to find the value with the absolute highest correlation (highest magnitude, irrespective of its sign). So, if you have values like -0.12 and 0.03, -0.12 has a higher absolute correlation than 0.03. The answer should be a single value representing that.

**Q20: Can we get the question list beforehand?**

**A20:** The GA list (Tools in Data Science Generic Assessment) contains the questions for Project 2. This is the fixed list of questions.

**Q21: Will the questions be static, or will parameters change dynamically?**

**A21:** The questions themselves will be static. However, the _values_ of the parameters within those questions will be dynamic. For example, the query for "Hacker" and "52 points" might change to "Linux" and "70 points." Your function should be able to handle these varying parameter values.

**Q22: I had issues with GA 1.4 and 1.10. For 1.10, an LLM gave me a direct answer, but I'm unsure if it's correct.**

**A22:** Please post your specific issues regarding GA 1.4 and 1.10 on Discord. That way, if anyone else has faced the same challenges or found a solution, they can help, or I can provide clarity there. For 1.10, if an LLM gave you a direct answer, it might be correct, as LLMs are quite capable of solving such problems, even running Python code in the background.

**Q23: Is the approach of using an LLM to extract parameters, and then having a Python function to solve the question, viable?**

**A23:** Yes, that's a viable approach. LLMs are very good at extracting specific parameter values from complex text. So, you can use an LLM to parse the question, extract the necessary inputs (like keywords, numerical values, or tags), and then feed those extracted parameters into your dedicated Python function to solve the core logic of the problem. This breaks down the problem effectively.

**Q24: I don't see Arjuna on the call, but I had a question.**

**A24:** Arjuna is not on the call currently. If you have any further questions, please post them on Discord. We will continue working through examples tomorrow.

---
