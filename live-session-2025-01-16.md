# Live Session: 16 Jan 2025

[![2025-01-16 Week 1 - Session 1 - TDS Jan 25](https://i.ytimg.com/vi_webp/1H5Aq7HjqwQ/sddefault.webp)](https://youtu.be/1H5Aq7HjqwQ)

**Q1: About the Week 1 Graded Assignment and the use of VS Code**

**Student:** The first question in the Week 1 graded assignment involves installing VS Code. There's information on installing it and adding code, but it's not very technical. Will the exact solution be discussed?

**Instructor:** No, the exact solution won't be provided, but guidance on how to reach the solution will be given. The focus is on installing VS Code and running a specific command in the terminal, then pasting the output into the input box.

**Q2: About Shifting the TDS Session**

**Student:** Is there a possibility to shift this week's session to a different time? Both sessions are technically heavy, and I'm not good with technical things.

**Instructor:** I will check if a shift is possible. If not, the recording will be uploaded to YouTube.

**Q3: About the UV Command-Line Tool**

**Student:** The tutorial mentions a command-line tool called UV. How does UV get integrated back into VS Code? Do they work in compliance?

**Instructor:** UV doesn't integrate with VS Code in the way that, say, pip does with Python. You can use UV in your command prompt, much like pip for Python or npm for JavaScript/Node.js. UV is a replacement for those tools.

**Q4: About UV Use Cases and Examples**

**Student:** Are there examples demonstrating how to use UV and integrate it with VS Code?

**Instructor:** There's no integration with VS Code. UV is useful for deployability. Last term, in Project 2, UV was used to automate running 687 student Python submissions, each with unique requirements and dependencies. Students only needed to add a small block of code at the top specifying the Python version and required libraries. UV dynamically generated the runtime environment for each submission, then disposed of it. This avoided recreating setups for each script.

**Q5: About the Week 1 Graded Assignment Scoring**

**Student:** The first assignment mentions two conditions for an A or S grade: completing it within two hours and getting a score above 8. What does this mean?

**Instructor:** The two-hour time limit is not strictly enforced. The deadline for the assignment is the 26th. A good grade is possible even if it takes longer than two hours.

**Q6: About the R\&OE Exam Format**

**Student:** The R\&OE exam is 45 minutes. Will the question paper pattern be similar to the assignment format?

**Instructor:** The format will be similar: questions and answer boxes. You can use any tools you want; it's a non-proctored exam. It will cover concepts taught in the course, including new material.

**Q7: About the UV Learning Curve**

**Student:** The UV portion of the tutorial is only a 7-minute video. Do we need to learn UV fully in Week 1, or will it be covered in later weeks?

**Instructor:** UV is introduced in Week 1, but the most useful aspect is using inline metadata in your script to avoid creating virtual environments.

**Q8: About Starting the Project**

**Student:** How do we start the project?

**Instructor:** There will be separate guidance sessions for the project.

**Q9: About DevTools (Elements Tab)**

**Student:** Can you explain the Elements tab in DevTools?

**Instructor:** Right-clicking on a webpage and selecting "Inspect" opens DevTools. The Elements tab shows the HTML, JavaScript, and CSS of the webpage. You can use the arrow tool to select an element and see its code. You can even change the code, but these changes are only local to your browser.

**Q10: About DevTools (Console Tab)**

**Instructor:** The Console tab allows you to run JavaScript code. This will be discussed later in the tutorial, in the context of CSS selectors.

**Q11: About DevTools (Network Tab)**

**Instructor:** The Network tab shows all external information the browser is fetching. For TDS, the Fetch tab is most useful, showing the APIs and JSON objects, CSS files, etc., that the webpage is using. You cannot modify the content in the Network tab.

**Q12: About CSS Selectors and Classes**

**Student:** Can you explain CSS selectors and classes? Are classes just a type of formatting?

**Instructor:** Classes allow you to add CSS to your code. They are represented with a dot (.). IDs are unique to a specific element and are represented with a hash (#). Classes can be applied to multiple elements. You can use classes to apply formatting to multiple elements at once.

**Q13: About JavaScript and CSS Selector Usage**

**Student:** How are HTML and CSS connected? Do we need to write JavaScript to extract anything?

**Instructor:** JavaScript is used to extract information from HTML code using CSS selectors. CSS selectors target elements using classes or IDs.

**Q14: About Limiting JavaScript Code to a Specific Area**

**Student:** If we write a JavaScript program to filter data, can we limit it to a specific chunk of HTML data, or will it work on everything in the Elements section?

**Instructor:** The JavaScript will work on everything on the screen because of the DOM structure. The DOM is a tree structure, and each element can be uniquely identified using selectors.

**Q15: About the InnerText and InnerHTML Attributes**

**Student:** What is the difference between `innerText` and `innerHTML`?

**Instructor:** `innerText` gives you the text content of an element. `innerHTML` gives you the entire HTML code of an element. Use `innerText` when you only need the text.

**Q16: About a Practical Exercise**

**Instructor:** As a practical exercise, extract the names of all the people in this meeting using DevTools (Elements and Console tabs).

**Q17: About DevTools Compatibility**

**Student:** Do DevTools only work on Chrome?

**Instructor:** DevTools work on Chrome, Edge, and other browsers. In Safari or Mozilla, right-click anywhere on the webpage and look for the "Inspect" option.

**Q18: About the Network Tab and Lazy Loading**

**Student:** Why are videos often chunked in the Network tab?

**Instructor:** This is due to lazy loading. The video is broken into parts, so you can't download the entire video from the Network tab.

**Q19: About Class Names in a Specific Example**

**Student:** The classes in the example are in brackets, like `span class="zwgib"`. Is this a class?

**Instructor:** If it's a class, it should be marked with a dot (.). In this case, the `<span>` is the element, and the class is specified with `class="zwgib"`.

**Q20: About Using IDs in CSS Selectors**

**Student:** If it's a class, we use a dot. What if it's an ID?

**Instructor:** If it's an ID, use a hash (#). IDs are unique to a specific element, while classes can be applied to multiple elements. Think of classes like department names and IDs like employee IDs.

**Q21: About a Specific Exercise and Random Name Selection**

**Instructor:** Another exercise: extract the names of the people in this meeting using DevTools and a Python script to randomize the list and select a person to answer a question. This simulates a classroom scenario where students are less likely to respond.

**Q22: About the Syntax of the JavaScript Code**

**Student:** Can you go back to the syntax used to extract the names?

**Instructor:** The syntax is `$$(".ipc-title-text")`. `$$` selects all elements with the class "ipc-title-text". The `map` function iterates through the list and extracts the `innerText` of each element. If `innerText` doesn't work, use `innerHTML`.

**Q23: About the Use of the Same Class for Different Elements**

**Student:** Why are the same classes used for movie names and links?

**Instructor:** It's not ideal to use the same class for different elements. In this case, the movie names are links, so the same class is used. However, it's better practice to use different classes for different elements.

**Q24: About Further Study**

**Student:** What should we study before the next meeting?

**Instructor:** Review the Elements and Console tabs in DevTools. Explore the Network tab if you're curious. Experiment with changing elements on websites. This will help you understand how CSS selectors work.
