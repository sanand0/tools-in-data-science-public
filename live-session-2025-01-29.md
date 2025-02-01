# Live Session: 29 Jan 2025

[![2025-01-29 Week 3 - Session 2 - TDS Jan 25](https://i.ytimg.com/vi_webp/EPiVIP97fzI/sddefault.webp)](https://youtu.be/EPiVIP97fzI)

**Q1: I am a student, and I joined the session without using my IITM ID. How do I rejoin with my IITM ID?**

**A1:** You need to rejoin the session using your IITM ID. We don't allow anyone to join without their IITM ID.

**Q2: Today's session is mostly about doubt clearing. I haven't seen the GAs yet. Can I come tomorrow after I've solved them?**

**A2:** Tomorrow and the day after, we will mostly be covering content, so there won't be much scope for doubt clearing. We can address doubts towards the end of the session or while discussing a specific topic if the doubt relates to that topic.

**Q3: Will the sessions cover content relevant to GA2?**

**A3:** No, the content will be relevant to GA3. The deadline for GA3 has been pushed to Wednesday.

**Q4: GA2 content looks straightforward. If I have any doubts after the sessions, I'll ask then.**

**A4:** That would be great.

**Q5: I was confused about the image compression in [unclear]. I tried to copy the code and run it in Colab, but it asked for third-party authentication. I wasn't sure what it was asking, so I pulled back.**

**A5:** I haven't used the code for solving that particular image compression question; I only used the provided website. I tried using the code, but it gave me an error about dimensions not matching the original file's dimensions. That's why I used the web application. There is a specific use case for this. Should we copy all the things like that and then change the parameters? For example, the path will be related to some website URL. It will be used in future classes. We probably won't spend much time on image compression, but it is important from a web perspective. In a particular video, they talked about how 50-51% of information on web pages is in image format, so reducing image size is important. From a project perspective, it won't be that relevant in future weeks.

**Q6: I tried to do Git commits from my CLI, but based on the given ID, a new repository was created. I want to use the one I created for GA1. How can I make sure that whatever changes I'm making get committed to the repository I signed up for?**

**A6:** Please share your screen. (The instructor then appears to have difficulty understanding the question.)

**Q7: I have a doubt in question 4. Actually, I've done the Vercel file for question 6 (What is the Vercel URL?). I'm uploading that URL, but it's not showing that it's up. Can I share my screen?**

**A7:** Yes, please share your screen. (The instructor then guides the student through troubleshooting steps, including checking the code, going to the Vercel dashboard, and appending `/api` to the URL. The issue is that the Flask module is not installed on Vercel. The instructor suggests using a capital 'F' in `Flask` in the requirements.txt file. The instructor also suggests using GitHub, where a requirements.txt file is not needed.)

**Q8: In the FastAPI question, I'm pushing the website, but it's not taking the conditions (API class equals 1A or class equals 1B) mentioned in the question. It's also giving the whole JSON file. What should I do?**

**A8:** Regarding the Vercel question, you can mention a capital 'F' for Flask, but I think it won't install because... I've just checked, and on the GitHub page, I don't have a requirements file. If you push it to GitHub and it's connected to GitHub, you don't need the requirements file. Something else is the issue. It's not able to pull the Flask module. You should not have to install it separately while running the file. I used `http.server`. There's example code given in GA2 itself for question 6. There's sample code there that uses `http.server`. I just modified that bit and put my function in there, and it works without any issues. The only difference is that I modified that and put the function inside that piece of code that handles the request. You don't need a separate `requirements.txt` file; Vercel can run the program without that. You still need to verify that your function actually runs. That's one thing you'll have to check. Regarding the FastAPI question, there's a logic error in your code. It shouldn't fetch all of it. Your query actually says `class` (CLASSS) without an underscore. If you put an underscore there, it will probably give you the correct response.

**Q9: I'm getting an error in question 10 of GA2. (Student shares screen.)**

**A9:** Please close the picture-in-picture; it won't disconnect the session. (The instructor then guides the student through troubleshooting steps, including copying the error and posting it on Discourse and tagging Anand. The instructor suggests using the ngrok URL (the one in front of forwarding in the terminal). The error is a Cloudflare error. The instructor suggests copying the error and sending it on Discourse and tagging Anand.)

**Q10: I wanted to say that while installing ngrok with the terminal, I wasn't able to do that, so I installed it in a different directory using the app. Is it doing anything? When I run it from here...**

**A10:** It shouldn't matter because we are able to access it through the browser. It was still able to access it, and you can see a 200 OK on there. That means the site is running okay; your model is running okay. Why you're getting a Cloudflare error, I'm not entirely sure. That's normally to do with the CDN service that is giving some sort of response out there. We'll have to check with Anand what the issue is.

**Q11: Is my screen visible? In the Vercel question, sometimes it shows correctly, and now it's showing an error. It's showing correctly again. I don't know why this happens. The score also...**

**A11:** There was a slight bug; we discussed it this morning with Anand. There was a slight bug in the random generator for the file that you use. I believe it's been fixed now. That's why you're not getting an error at the moment. If you come across this problem again, notify us on Discourse. It shouldn't give you a problem anymore.

**Q12: One more thing: in the FastAPI question, I'm pushing the website, but it's not taking the conditions (API class equals 1A or class equals 1B) mentioned in the question. It's also giving the whole JSON file. What should I do?**

**A12:** The issue is likely in your code's logic. You should try to fix the code. The word `class` itself is a keyword in Python, so you'll have to find a workaround that enables you to use a query called `class` (CLASSS) without the underscore.

**Q13: One more question: in question 9 (FastAPI), I'm giving the URL, but when I run the file, it shows the whole data. When I add conditions, it also shows the whole data. I'll show you that. Should I run this first?**

**A13:** Before we do that, let's see what error comes out. You haven't put the actual correct URL, right? Just add `/api`. It's because this particular Flask module is not installed on Vercel. You should use the `requests` module instead of the `curl` command. You just use the requests and send the inputs to it. Because the proxy has its own method of doing some of these functions that don't match OpenAI's. It might have been a coincidence that it worked for 3.5. If you use the documentation that Anand has provided, then that might help. If you go back to where you get the token... You'll have to provide the documentation in this form. You'll use the requests instead of using the curl command. You just use the requests and send the inputs to it.

**Q14: In question 5, I've enabled it, but I'm getting an "unexpected end of JSON input" error. I'm not sure why. I've tried different structures for the JSON.**

**A14:** Copy this JSON to VS Code and save it as a JSON file. VS Code will parse it so you can see it better. At the bottom, you have an extra required address and additional properties that are not necessary. That shouldn't cause it to be invalid JSON. Try without that. Just remove that extra bit and try without it.

**Q15: One more thing: in FastAPI question 9, I'm giving the URL, but it's giving me the whole data. Even when I add conditions, it shows the whole data. I'll show you. Should I run this first?**

**A15:** Add `/api` at the end of that. That's some logic error in your code. It should not fetch all of it. There's some logic error. You're getting a Cloudflare error. That's something to do with the CDN service giving some sort of response. We'll have to check with Anand.

**Q16: Is my screen visible? In this Vercel question, what happened is that sometimes it was showing correctly earlier, and now it's showing an error. And look, it's showing correctly again. I don't know why this happens. The score also...**

**A16:** At the moment, it's working, right? There was a slight bug; we discussed it this morning with Anand. There was a slight bug in the random generator for the file that you use. I believe it's been fixed now. That's why you're not getting an error at the moment. If you come across this problem again, notify us on Discourse.

**Q17: I'm getting an error from this. I don't know how...**

**A17:** In the ninth question, you're getting an error. Earlier, it was working fine. You'll need to... this is the Vercel one, right? No, this is the FastAPI one. You'll have to run the server for that. You should post this on Discourse. Just copy that whole error message itself and put it in a notepad or something, and then post on Discourse.

**Q18: One more thing I wanted to say: actually, I'm not... while installing ngrok with this terminal, I wasn't able to do that, so I installed it in a different directory using the app. Is it doing anything? When I run it from here...**

**A18:** It shouldn't matter because we are able to access it through the browser. It was still able to access it, and you can see a 200 OK on there. That means the site is running okay; your model is running okay. Why you're getting a Cloudflare error, I'm not entirely sure. That's normally to do with the CDN service that is giving some sort of response out there. We'll have to check with Anand what the issue is.

**Q19: Is my screen visible? In this Vercel question, what happened is that sometimes it was showing correctly, and now it's showing an error. And look, it's showing correctly again. I don't know why this happens. The score also...**

**A19:** It looks like a Cloudflare error. I've noted this error. It is from Cloudflare. You could just try again. When did you try this, apart from just now? You got the same error yesterday as well? Yeah, so that's some logic error in your code. It should not fetch all of it. There is some logic error.

**Q20: Should I install it separately?**

**A20:** No, you won't require requirements for it. Vercel is able to run the program without that.

**Q21: For Vercel, I will take the example code and try to run it. One more question: in question 9 (FastAPI), I'm giving the URL, but when I run the file, it shows the whole data. When I add conditions, it also shows the whole data. I'll show you that.**

**A21:** You should use the requests module and send a request using headers and all those informations. What you are using is actually OpenAI's own library, and that will not work. You will have to use the requests module and send the request just like the examples shown. There will be a URL, a header, and a payload. If you use their own library, it will not construct it correctly. Because the proxy has its own method of doing some of these functions that don't match OpenAI's. For 3.5, it worked, but that was more of a coincidence. If you use the documentation that is there on the AI proxy that Anand has provided, there's documentation there. If you use that documentation, then that might help. If you go back to where you get the token... You'll have to provide the documentation in this form. You'll use the requests instead of using the curl command. You just use the requests and send the inputs to it.

**Q22: This was in ROE last term. I'm getting an error. How?**

**A22:** This was a really fascinating question. There is a way, in fact many ways, to get it to say yes. You just have to trick it into saying yes. Just look up previous Discourse posts; you will probably find suggestions on there as well.

**Q23: Can I get the code for this?**

**A23:** He will... didn't he provide that in a Discourse post? Someone has pasted it on Discourse. If not, we can always ask him to provide it.

**Q24: I've taken one more course, something on business BA or something like that. There is no GA at all for this. There is a GA, but you don't submit here. These two courses are somewhat different.**

**A24:** Right, right.

**Q25: When I joined (late), an ngrok error was being shown by someone. I'm also getting a very similar error. I couldn't follow the discussion at all. I joined towards the end. Shall I share my screen?**

**A25:** Just before you share your screen, was it giving you a Cloudflare error? (The student describes the error.) You can share your screen. I think your problem is slightly different. (The instructor then guides the student through troubleshooting steps, including checking the ngrok URL and restarting the Lama server. The issue is that ngrok is running outside of the Ubuntu environment, and the Lama server is running inside the Ubuntu environment. The instructor suggests installing ngrok in the Windows machine and then creating a tunnel from there. The student tries this, but it's still giving an error. The instructor then suggests using the directly executable file for ngrok.)

**Q26: I tried all this, same issue. I'm getting an error. I think I've tried all this, same issue.**

**A26:** The account is limited to one simultaneous session. You've got another session running somewhere. I think that is inside VS WSL. You'll have to stop that. You'll have to check for that. The output that your code is generating is wrong. It's generating null, null, which is wrong. Just try to check for... can you go back to the question once? It is sending some URL-encoded parameter. There might be a mistake while reading those parameters. Just changing that code will help. There's a problem with my code where it's fetching null for all the data, which it should not. You can either ask on Discourse or try to fix it yourself.
