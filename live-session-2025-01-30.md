# Live Session: 30 Jan 2025

[![2025-01-30 Week 3 - Session 3 - TDS Jan 25](https://i.ytimg.com/vi_webp/6VfrL5b8lLc/sddefault.webp)](https://youtu.be/6VfrL5b8lLc)

**Q1: My screen is visible?**

**A1:** Yes, your screen is visible.

**Q2: I posted on Discourse and emailed you about a problem deploying a Flask application on Vercel. The Flask module is not getting downloaded. Can you show the vercel.json configuration file?**

**A2:** The error likely stems from your `requirements.txt` file. Did you create a new virtual environment for this project, or did you install Flask on your global environment? When deploying Flask applications on Vercel, you need to keep a few things in mind. I'll show you how to create a `requirements.txt` file without manually typing it.

**Q3: I added a requirements.txt file with Flask and Flask-Cors, but Kartal sir said I could use the example in the question. Should I remove the requirements.txt file and rewrite the code? The code is working, but I'm getting a null output instead of a list of integers as requested.**

**A3:** Let's see your screen. The Flask application might be running fine as intended, but you might not be seeing the output. Sharing your screen would help me understand what's happening. You are getting a null output because you are not using a virtual environment. Let's create one.

**Q4: When writing tools needed in requirements.txt, do we need to specify the version?**

**A4:** Yes, you have to specify the version. But you don't have to manually type the `requirements.txt` file. You can use a single-line command in Python: `pip freeze > requirements.txt`. This will create the file with all the libraries and their versions in your virtual environment (or global environment if you don't have a virtual environment).

**Q5: I tried to create a virtual environment, but it showed an error. I'm using Vercel CLI.**

**A5:** Let's try `python -m venv venv` in PowerShell. If you are using a virtual environment, it will only return the libraries specifically present in that environment. Since you are currently using a global environment, it returns every library.

**Q6: Have you tried the optional exercise I gave you for the Flask API (Zodiac sign one)?**

**A6:** No one has tried it yet. The assignment was to ask for a person's month of birth and return their zodiac sign.

**Q7: The main problem is that I'm spending almost 2-3 days on the TDS assignments. The GAs have 10-18 questions on average.**

**A7:** I understand. The GAs are time-consuming. If you get some time and are in the mood, you can work on the optional mini-project. You can have many more types of ideas and execute them using Flask API.

**Q8: Currently, I'm not in the directory that contains the Vercel file (vercel.json).**

**A8:** I'm just demonstrating how to create the `requirements.txt` file.

**Q9: If I'm running a virtual environment with `uv`, will it only copy out the tools that are in the virtual environment?**

**A9:** Exactly. That's a downside of `uv`. When using `uv`, you are not installing those libraries. If they are not installed, they won't be present in your virtual environment, and therefore won't be in your `requirements.txt` file. For minor projects that you don't need to deploy, `uv` is fine. Otherwise, create a virtual environment and install the libraries there.

**Q10: Now it's showing nothing. I don't know why.**

**A10:** Your server is not running. Run `vercel deploy --prod` again. I'm not a big fan of Vercel CLI; I usually push to GitHub and then establish a connection between Vercel and GitHub. Let's open the dev tools (right-click, inspect), go to the console, and reload. Show me your code.

**Q11: I'm using httpx.**

**A11:** Yesterday, I told you that you can use the example file from the question. That's why you rewrote the code. Otherwise, you would have created the `requirements.txt` file and deployed both. This was working yesterday; now it's showing blank. Can you show me the code?

**Q12: It was working perfectly yesterday. Now it's showing blank. An error page is showing. Sir told me to add `/api` to the URL, and it would show some data. When I entered that link in the assignment, it gave me a null list.**

**A12:** That's what happens when nothing is showing. Can you scroll down? You're using CORS. You've used a lot of complexity; you've made it a lot more complex. You took help from ChatGPT. That explains the comments. It's not directing you somewhere. The JSON file is not present in the API folder. Let's go to line 5 of your code. Add `../` before `q` to include the parent directory. Save and redeploy.

**Q13: Should I remove the `.vercel` folder and redeploy?**

**A13:** No, that won't work. Vercel CLI created that folder; it contains build instructions.

**Q14: Are the vercel.json and everything inside the API file?**

**A14:** No, they are in the `vercel-python/api` directory.

**Q15: I don't know how to use `class` as a variable name in question 9.**

**A15:** `class` is a keyword in Python. You can't use it as a variable name. I'll explain how to handle this. You need a different variable name. I used an alias. I'll explain what that means.

**Q16: When passing multiple parameters with the same name, how do I handle it?**

**A16:** You need to use lists. Import `List` from the `typing` library. I got this from ChatGPT. Always learn from ChatGPT, but also learn from the process. The query will take all the strings and put them into one list. The default value is used if no parameter is passed. An alias is another name for a variable. The variable name is `className`, but we can use the `class` parameter using this alias.

**Q17: My code was working correctly except for the name. I don't know how to write it.**

**A17:** You are using `httpx`. You're also using `index.py`. This is not Flask-based; it's more like an HTTP server.

**Q18: I'll try to do it again according to the requirements and add the requirements.txt file. After that, I'll share my screen.**

**A18:** Okay, you can do that. The Flask-based code is not needed here.

**Q19: I'm confused because it was working perfectly (or at least working) yesterday.**

**A19:** Can you open Vercel again? Yesterday, was this particular box showing "Not Found"? When you added `/api` to the URL, it showed a dictionary. It was returning a JSON object. Show me your folder structure.

**Q20: I created the directory, then another folder `api`, and then `index.py` inside `api`.**

**A20:** Should I remove the `.vercel` folder and redeploy? No, that won't work. Vercel CLI created that folder; it contains build instructions.

**Q21: Show your folder structure.**

**A21:** I created the directory, then another folder `api`, and then `index.py` inside `api`.

**Q22: If I use `uv`, will it only copy the tools in the virtual environment?**

**A22:** Yes.

**Q23: What is more convenient? Directly integrating GitHub and creating files there, saving space on my local system?**

**A23:** I don't think that will save space on your local system because you have to create files locally before pushing them to Git.

**Q24: Can we use the query function?**

**A24:** Yes, absolutely. It's working like this. I'll comment it out, duplicate it, and comment it out once. Then we can run this. The query function is working. We have got the entire row where the city was. We can extract the population using this. It's working perfectly fine. It returned the population of Delhi.

**Q25: Do we need to mention values [square bracket] zero, values zero, if we are mentioning population only?**

**A25:** That's a very good question. If you use this, it will return a series (a Pandas term). It's just a column; it won't give you the exact value. We have to extract the zeroth value. We have to extract the values. `values` will return this.

**Q26: Question 9: I don't know how to use `class` as a variable name.**

**A26:** `class` is a keyword. You can't use it as a variable name. Create a different variable name. I used an alias.

**Q27: Question 6: Can you take the last of the class now, or should I wait?**

**A27:** Let's arrange a separate meeting to discuss this. I'll also look into your file. You can share it on Discourse or email it to me.

**Q28: Can we use `httpie` instead of `requests`?**

**A28:** Yes, you can change it to `httpx`. `httpie` is a command-line tool, not a Python module. I'm not sure about `httpie`.

**Q29: Can we get the names of the words and their embeddings separately in the JSON?**

**A29:** No, it won't get you the name of the embedding. It will store embeddings for each word. You can pass three different values. You can calculate three embeddings. Then you can compute the cosine similarity between them. The first index would get the embedding for bicycle, the second for cycle, and the third for `biycle`.

**Q30: Can we get a 3x1,1056 dimensional array?**

**A30:** You won't get it directly, but you can store it in whatever format you want. You can store it in an array. I don't know how to convert JSON to an array.

**Q31: One more thing about embeddings. Can we go back to the writer pad?**

**A31:** Sure. Let's say I'm using a certain model for creating embeddings. Let's say that model contains a billion words. It will check the similarity of a word (like "kitten") with all those billion words. It will check the rate of similarity between this particular word and that word. These models vary in the number of words they carry. A small model has about a billion; a medium-sized model has around 50 billion; a large model has several more. These numbers might be a bit wrong, but that's the distinction. The larger the model, the better the embeddings. Here, we have 1,056. That means it's checking the similarity of a word with 1,056 words in its database. That's how embeddings work. For creating embeddings, there's a library in NLP, actually ML, with a module called `word2vec`. It's deployed on Hugging Face.

**Q32: Is Hugging Face part of the TDS course?**

**A32:** I think it's been removed. It would be too heavy for TDS.

**Q33: Can we create LLM applications on Google Colab?**

**A33:** Not exactly, but we can make API calls and get embeddings for words. For example, let's say we have the word "Anand".

**Q34: Sorry for interrupting, but is Hugging Face part of the TDS course?**

**A34:** I think it's been removed, probably because it's too heavy for the course.

**Q35: My next question is why are these vectors (embeddings) so long? It's just a word. For a paragraph, it must be thousands of variables.**

**A35:** It won't be. We're getting embeddings from OpenAI. We'll always get embeddings of the same length. It uses 1,536 numbers to represent a word. These are different features of the word. It might involve the shape of a bicycle. Does it involve SVD? It must be doing SVD.

**Q36: Can we use wrongly spelled words and get embeddings for them?**

**A36:** You can try. It should work. Anything similar to "bicycle" should work.

**Q37: My last question is how can we pass multiple words at the same time and get their embeddings separately?**

**A37:** I think this is the way you can pass multiple words. This should get us two different vectors. It's a list. The first embedding is for bicycle, and the second is for cycle.

**Q38: Can we get the names of the words and their embeddings separately in the JSON?**

**A38:** No, it won't get you the name of the embedding. It will store embeddings for each word. You can pass three different values. You can calculate three embeddings. Then you can compute the cosine similarity between them. The first index would get the embedding for bicycle, the second for cycle, and the third for `biycle`.

**Q39: Can we have a session on Hugging Face?**

**A39:** We can have a session during the last week of the course. The last week should be a bit lighter. Hugging Face is totally open source, so it would be very helpful during the NLP part of the course. But Hugging Face won't be of much context when it comes to TDS. It would be for learning only.

**Q40: My first doubt is, can we use `httpie` instead of `requests`?**

**A40:** Yes, you can change it to `httpx`. I'm not sure about `httpie`. It's a command-line tool. I've never used it. I think even if it does, it shouldn't matter much because it's just a different library that allows you to make requests. I wanted to shift to another question. I don't know how to use this particular thing. Maybe it's possible to use it in Python, but I don't know. `requests` is better. If it's complicated, it's not a good tool. At the end, it's also using the `requests` module.

**Q41: My next question is why are the vectors (embeddings) so long?**

**A41:** That's the dimension it uses to represent a word. A higher dimension means better representation, but it requires more storage. You can think of them as a vector space, like a 3D space. Instead of representing a word in 3D, we're representing it in 1,536 dimensions. These are different features of the word. One might represent shape.

**Q42: Does it involve SVD?**

**A42:** I don't know the exact algorithm OpenAI uses to calculate embeddings. You can search on Google or ask ChatGPT. You can also ask ChatGPT for code completion.

**Q43: Question 9: Three different documents. For example, these are three different documents. You can think of them as paragraphs or words. The purpose is to figure out which word is related to the query word. One could be cat, one could be dog, and the other could be elephant. The query word could be kitten. You have to figure out which word relates more to it. The way to do it is using embeddings.**

**A43:** You would have to figure out the embedding for each one of them. The way to compare two words is to compute the dot product. Cosine similarity is the dot product divided by the norm of each vector. OpenAI returns normalized vectors. The cosine similarity between "bicycle" and "cycle" would be higher than between "bicycle" and "apple". That's how computers store this information.
