# Live Session: 17 Jan 2025

[![2025-01-17 Week1 - Session 2 - TDS Jan 25](https://i.ytimg.com/vi_webp/hG5WqtbpfkI/sddefault.webp)](https://youtu.be/hG5WqtbpfkI)

**Q1: How to solve question number 7 (counting Wednesdays between two dates)?**

**A1:** Use Excel. Input the two dates into two cells. Use a command to find the difference in days, then divide by 7 to get the number of weeks. Since there's one Wednesday per week, that's the number of Wednesdays. If the start date isn't a Wednesday, a different approach is needed.

**Q2: How to handle dates that don't start on a Wednesday?**

**A2:** Instead of starting from the given date, start from the next day (e.g., if it starts on Tuesday, start on Wednesday). Calculate the difference in days and divide by 7. The method of simply dividing by 7 might not always give the correct answer, so the logic needs to be adjusted based on the starting day. Another approach is to start from the nearest Wednesday and iterate using a while loop, but this is less efficient.

**Q3: How to extract a CSV file from a zip file?**

**A3:** This is considered a basic task. Use a file explorer or command-line tools. The instructor skips this question.

**Q4: What is JSON and how is it used?**

**A4:** JSON (JavaScript Object Notation) is a way to store data, like names and ages of students or employees. It uses key-value pairs. The instructor demonstrates creating a JSON object in Python, showing how to access elements using indexing and nested structures. JSON can also be used in JavaScript and browser consoles.

**Q5: How can I access data from a JSON object?**

**A5:** The instructor shows how to access elements within a JSON object using indexing in Python. For example, to access the name of the third student in a list, you would use `students[2][name]`. JSON allows hierarchical data storage, making it easy to retrieve specific values.

**Q6: How does JSON get loaded on a website (e.g., Discourse)?**

**A6:** Websites often fetch JSON data from backend servers. The instructor shows an example on the Discourse website, where different data (weekly, yearly) is loaded based on the request parameters in the URL. Multiple filters can be added to the URL to refine the data fetched.

**Q7: How can I use Python to access JSON data from a URL?**

**A7:** The instructor demonstrates using the `requests` library in Python to fetch JSON data from a URL. The response status code (e.g., 200 for success) indicates whether the request was successful. The JSON data is then accessible as a Python dictionary. The instructor uses Postman to show how to send API requests and view the JSON response.

**Q8: What is Postman and how does it work?**

**A8:** Postman is a tool that acts as an intermediary between you and an API. It sends API calls and retrieves the data. Alternatively, the Thunder Client extension in VS Code can be used for the same purpose.

**Q9: What are CSS selectors and combinators?**

**A9:** The instructor explains CSS selectors and combinators, focusing on basic selectors and the direct child combinator (`>`) which selects only direct children of an element. More advanced combinators are mentioned but not covered in detail.

**Q10: How to handle large JSON objects or datasets?**

**A10:** For large datasets, copying and pasting is impractical. Instead, use Python and API calls to fetch and process the data programmatically. This avoids overwhelming the browser and allows for automation.

**Q11: How to handle encoding issues when opening CSV files?**

**A11:** When opening CSV files, especially those with unusual characters, specify the correct encoding (e.g., using the `encoding` parameter in pandas). The instructor shows how to detect the encoding of a file using Python and then uses pandas to open the file with the detected encoding.

**Q12: How to use Git and GitHub?**

**A12:** The instructor suggests covering Git and GitHub in a separate session due to the complexity and time required for a thorough explanation.

**Q13: How to use WSL (Windows Subsystem for Linux) in VS Code?**

**A13:** The instructor explains how to use the WSL extension in VS Code to access a Linux terminal within VS Code. This is useful for running bash commands. The instructor notes that the default terminal in a Mac might not support all commands, so WSL is an alternative.

**Q14: Why does the course feel overwhelming?**

**A14:** The instructor acknowledges that the course challenges students' logical thinking by introducing concepts and tools not previously taught. The instructor encourages students to use ChatGPT to help bridge knowledge gaps and emphasizes that the course aims to build a strong foundation and encourage exploration beyond the curriculum. The instructor also points out that the course materials are available in the course portal, including content for weeks beyond the current one. A feedback form is provided for students to report challenges and suggest improvements.
