# Live Session: 06 Feb 2025

[![2025-02-06 Week 4 - Session 3 - TDS Jan 25](https://i.ytimg.com/vi_webp/u5RFmePd7NQ/sddefault.webp)](https://youtu.be/u5RFmePd7NQ)

**Q1: In this GA4 session, what's new compared to previous GAs?**

**A1:** The trajectory has moved from hard to easy. This GA is much easier and lighter than previous ones.

**Q2: How do I extract a table from HTML using Google Sheets?**

**A2:** This functionality is available in Google Sheets but not in Excel (unless you use plugins). The `IMPORTHTML` function will give you a #NAME? error in Excel.

**Q3: How can I extract data from the ODI Batsman Stats webpage?**

**A3:** I'll show you how to extract data from a different webpage, but you can find a similar example in my previous live session on YouTube.

**Q4: What do the parameters in the `IMPORTHTML` function mean?**

**A4:** The four parameters are: URL, query (either "list" or "table"), index (table number), and locale. The index is zero-based (like Python).

**Q5: How does the `IMPORTHTML` function automatically find the table?**

**A5:** It finds the table based on the index you provide. If there are multiple tables, you'll need to adjust the index accordingly.

**Q6: How can I extract data from a webpage that doesn't use a JSON object?**

**A6:** There are three ways:

- **Method 1:** If the webpage uses a JSON object, you can extract it directly.
- **Method 2:** Use query selectors in the browser's console to extract the data. This involves finding a common element (class) in the HTML and using JavaScript to extract the data. The `$$` operator establishes a connection between the console and the elements tab. The `.` prefix selects elements by class, and `#` selects by ID.
- **Method 3:** Sometimes, the data is embedded in JavaScript code within the webpage itself. You can find this in the browser's "Sources" tab. You can then use this JavaScript object to extract the data.

**Q7: What's the difference between `innerText` and `innerHTML`?**

**A7:** `innerText` returns only the text content of an element, while `innerHTML` returns the entire HTML code within that element.

**Q8: I'm having trouble using the FastAPI in Chrome. I've posted on Discourse multiple times, but it's still not working. The error is "Method Not Allowed".**

**A8:** When using POST requests with FastAPI, you need to specify the method in the request. I'll look into your Discourse post and get back to you. We can also schedule a separate meeting to discuss this further. The issue might be related to how your system interacts with the host (it might be localhost).

**Q9: Regarding the project, the scope seems too broad. Can we narrow it down? Also, what tools are required? Is there a sandbox environment for testing?**

**A9:** The scope is indeed broad. The project's requirements are defined by Anand, who is also the CEO of a company. He's busy, but you can contact him through Discourse. We can discuss the scope and tools further in a meeting. There is no sandbox environment for testing. The goal is to extract data, but the method is not specified. You can enhance the goal by using other tools (Autodesk, Blender, etc.), but the scope should be restricted by the QA team. We can discuss this further in a meeting.
