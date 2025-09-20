# TA session 20 June : Week 2 concepts ,API, JSON, PDF scraping and GA discussion

[![TA session 20 June : Week 2 concepts ,API, JSON, PDF scraping and GA discussion](https://i.ytimg.com/vi_webp/uKvonP6TKzk/sddefault.webp)](https://youtu.be/uKvonP6TKzk)

Duration: 2h 32m

Here's an FAQ summary of the live tutorial:

**Q1: I'm trying to scrape Amazon product pages, but I can only extract data from the first page. How can I navigate to the second page and extract products from there too?** (0:00)

**A1:** You'll typically find a query parameter (like "page=" or "page_number=") in the URL at the top of the page. You can then craft a new URL by incrementing this parameter to browse to subsequent pages. This advanced scraping topic, including handling cookies and more complex capabilities, will be covered in detail in a future session, specifically next Sunday. I'll also clarify if there's a specific notebook example for this pagination technique in that session. (0:16)

**Q2: The content for Week 3 of the course seemed very challenging, almost a "shocker." I don't want to drop the course, but how will you help us get through it, especially the difficult parts?** (3:18)

**A2:** I understand Week 3 introduces new concepts that can be intimidating – even we, as TAs, find some of them challenging! The main difficulty in the graded assignment for Week 3 involves using Linux system commands for data editing and cleanup. While this is an important skill, many of these tasks can also be achieved using alternative Python methods, which I plan to teach.

Don't worry too much about the Return on Investment (ROE) exam or Projects 1 and 2, as system command-type questions are generally not featured there. They might appear in the final exam, but it won't be overly complex; you'd mostly be expected to know what certain commands _do_. My approach for Week 3 will focus on showing you these alternative, universally applicable Python skills (like data manipulation/cleaning using libraries) that are valuable for web scraping and your future career, not just this specific course. (3:18)

**Q3: I’m considering dropping the TDS course because I find it difficult/intimidating. Can I discuss my concerns privately?** (4:26)

**A3:** Yes, absolutely. I’ve set up a private breakout room where Amit (another instructor) will be available shortly. You can discuss your specific concerns regarding the course, whether to keep it or drop it, and the challenges you're facing, one-on-one with him. This will be a confidential, unrecorded counseling session. (4:26)

**Q4: I encountered an issue while trying to scrape data from the BBC website (from Week 2's content). I got stuck even after following the lecture. Can I share my screen for help?** (8:40)

**A4:** Yes, we can definitely look at that. I'll be going through other Week 2 topics first, but when we get to the BBC scraping section, you can share your screen, and we'll address your issue. (8:46)

**Q5: I had trouble with the Pokemon API question in Graded Assignment 2. Even using ChatGPT, I found it difficult to navigate the API site.** (13:02)

**A5:** This is a common challenge, and it’s a great example of a real-world data science skill: researching unfamiliar data. I'll demonstrate how to handle the Pokemon API. I'll also explain why the `count` method you mentioned might not be working. (13:24)

**Q6: What exactly is an API Get Request?** (14:23)

**A6:** An API (Application Programming Interface) acts as a connecting link between you and a website's data. A "Get Request" is how you ask the API to retrieve specific data. (14:40)

**Q7: Can you walk us through the process of making an API call in VS Code or Colab, especially for the Pokemon API?** (14:49)

**A7:** Yes, let's go step-by-step.

1.  **Environment Setup:** If using VS Code, create a virtual environment (`control+shift+p` on Windows, then select "Create: Python Environment"). This isn't needed in Google Colab, as it's pre-configured.
2.  **Install Libraries:** Install the `requests` library (e.g., by typing `!pip install requests` in a notebook cell, which runs it as a shell command).
3.  **Make the API Call:** Use `requests.get()` and provide the API URL (e.g., `https://pokeapi.co/api/v2/pokemon/geodude`). The specific Pokemon name ("geodude" in this example) will be part of the URL from your assignment.
4.  **Convert to JSON:** The response will be in a raw format. Convert it to a JSON object using `.json()` method (e.g., `response.json()`).
5.  **Explore Data (pprint):** Use the `pprint` (pretty print) library to view the JSON object in a human-readable, structured format. This helps you understand the data's keys and nested dictionaries/lists.
6.  **Extract Data:** Navigate the JSON structure like a dictionary or list, using keys (e.g., `data['moves']`) and list indices, possibly combined with conditional filtering, to extract the specific information you need. (14:49)

**Q8: I'm stuck on question 9, which requires using advanced CSS selectors to extract specific data from an HTML page. How do these selectors work, especially `nth-child`?** (25:23)

**A8:** CSS selectors are powerful tools for precisely targeting elements within an HTML structure, which is crucial for web scraping.

Here's how some key selectors work:

- `.classname`: Selects all elements with that specific class. (e.g., `.main-menu`)
- `tagname`: Selects all elements of that tag type. (e.g., `ul` for unordered lists)
- `tagname.classname`: Selects specific tags with a specific class. (e.g., `ul.main-menu`)
- `parent > child`: Selects _direct children_ of an element.
- `parent descendant`: Selects _any descendant_ (direct or indirect) of an element.
- `tagname:nth-child(n)`: Selects the nth child of its parent (e.g., `li:nth-child(3)`).
- `tagname:nth-child(odd/even)`: Selects odd or even children.
- `tagname:nth-child(3n-1)`: Selects elements based on a mathematical pattern (e.g., 2nd, 5th, 8th, etc., child).
- `tagname:last-child`: Selects the last child of its parent.

For question 9, you need to combine these to pinpoint the specific list item based on its position within the navigation menu. Practice using these selectors by inspecting elements on various web pages. (25:23)

**Q9: The PDF parsing question from Week 2 (question 5) was tricky. How can I extract data from a PDF file efficiently, especially if it has multiple pages?** (26:45)

**A9:** You can use the `tabula-py` library to extract tables from PDFs. Here's a recommended approach:

1.  **Import Libraries:** Import `tabula` and `pandas`.
2.  **Read PDF (Page-by-Page - _Inefficient_):** While you _can_ loop through each page of the PDF, read it individually using `tabula.read_pdf()`, store each page's table (which `tabula` automatically puts into a Pandas DataFrame) into a list of DataFrames, and then use `pd.concat()` to combine them into one large DataFrame. This method is computationally intensive but ensures clean headers.
3.  **Read PDF (All Pages/Range - _Efficient_):** The most efficient way is to use `tabula.read_pdf()` with the `pages='all'` (or a specific range like `pages='33-69'`) argument. This reads all specified pages in one go, directly creating a list of DataFrames.
4.  **Concatenate DataFrames:** Use `pd.concat(list_of_dataframes, ignore_index=True)` to combine all the individual page DataFrames into a single, unified DataFrame. The `ignore_index=True` argument ensures a clean, continuous index across all pages, preventing duplicate indices from individual pages. This will give you a clean dataset for further processing. (26:45)

**Q10: In the PDF data, some columns (like "English") have non-numeric values (e.g., "Maths," "Biology") mixed with numbers. How can I clean this data to sum only the numerical English marks?** (27:16)

**A10:** You can use Pandas' `pd.to_numeric()` function for this.

1.  **Identify Non-Numeric Values:** The issue is that columns might contain text like "Maths" or "Biology" instead of just numbers.
2.  **Use `pd.to_numeric()` with `errors='coerce'`:** Apply `pd.to_numeric()` to the problematic column (e.g., `df['English'] = pd.to_numeric(df['English'], errors='coerce')`). The `errors='coerce'` argument is key here: it tells Pandas to convert any non-numeric values it encounters into `NaN` (Not a Number).
3.  **Filter/Sum:** Once non-numeric values are `NaN`, Pandas' aggregation functions (like `.sum()`) will automatically ignore them, allowing you to correctly calculate the sum of only the numerical English marks.

For question 8, you would first filter for students who scored more than 58 in Economics (using boolean indexing), then convert the "English" column of _that filtered DataFrame_ to numeric (coercing errors), and finally calculate the sum of the "English" column. (27:16)

**Q11: I need to use complex CSS selectors to extract data based on multiple conditions, like finding elements that are direct children, or specific `nth-child` elements. How can I approach this systematically?** (28:43)

**A11:** This is a core skill for web scraping. Here’s how you can combine selectors and systematically approach it:

1.  **Understand the HTML Structure:** The most important step is to inspect the HTML and visualize the parent-child relationships between elements.
2.  **Use `pprint` for JSON/HTML:** If you have JSON or parsed HTML, use `pprint` to get a well-formatted, readable output.
3.  **Start Broad, Then Refine:** Begin with a broader selector and progressively add more specific conditions to narrow down your target.
4.  **Key Selector Combinations:**
    - `.classname`: Selects elements by class.
    - `tagname`: Selects elements by tag.
    - `tagname.classname`: Selects specific tags with a class.
    - `parent > child`: Selects _direct children_.
    - `parent descendant`: Selects _any descendant_ (direct or indirect).
    - `#id`: Selects an element by its ID.
    - `[attribute='value']`: Selects elements with a specific attribute and value.
5.  **`nth-child` for Position:**
    - `tag:nth-child(n)`: Selects the nth child (e.g., `li:nth-child(2)`).
    - `tag:nth-child(odd/even)`: Selects children by parity.
    - `tag:nth-child(an+b)`: Selects based on mathematical patterns.
6.  **Systematic Approach:**
    - **Identify the top-level parent:** Find the unique element that contains your desired data.
    - **Navigate down the hierarchy:** Use `>` for direct children and spaces for any descendants, combined with tags or classes.
    - **Pinpoint the target:** Once you're close, use `nth-child` or other specific selectors to isolate the exact element.
    - **Python Implementation:** Once you have the correct CSS selector string, you can use Beautiful Soup (or similar libraries) in Python to find the elements.
7.  **Practice:** The best way to master this is to practice regularly. Use tools like your browser's Developer Console (Inspect Element) to test selectors on various websites. (28:43)

**Q12: How does the `concat` function work in Pandas, and why is `ignore_index=True` important?** (118:11)

**A12:** When you read multiple pages of a PDF individually, each page’s data is stored in its own DataFrame. Each of these individual DataFrames has its own index (e.g., from 0 to 29 for a page with 30 rows). If you simply concatenate these DataFrames without `ignore_index=True`, you'll end up with many rows all having the index `0`, `1`, `2`, etc., making it hard to uniquely identify rows across the entire combined dataset.

The `pd.concat()` function is used to join DataFrames. By setting `ignore_index=True`, you're telling Pandas to:

1.  Take a list of DataFrames.
2.  Combine all their data.
3.  Create a _new, continuous_ index for the resulting large DataFrame, starting from 0 and going all the way to the last row, ignoring the original indices of the individual DataFrames.

This results in a single, clean DataFrame with a unique index for every row, which is crucial for reliable data processing. (118:11)

**Q13: Why did you use `pd.to_numeric()` with `errors='coerce'` in the PDF cleaning, and what does `errors='coerce'` do?** (143:00)

**A13:** I used `pd.to_numeric()` with `errors='coerce'` because the original PDF data (when read by `tabula`) contained non-numeric values (like text headers) mixed in columns that should have been purely numerical (like "English" marks).

`errors='coerce'` is a powerful parameter: when `pd.to_numeric()` tries to convert a value to a number and encounters something it can't convert (e.g., "English Marks"), instead of throwing an error and stopping the process, it "coerces" that non-convertible value into `NaN` (Not a Number). This allows the conversion to complete for the rest of the valid numbers in the column, and `NaN` values are then easily handled (e.g., ignored by `.sum()` or dropped) in subsequent analysis steps. (143:00)

**Q14: What is the purpose of `ignore_index=True` in `pd.concat()`?** (133:10)

**A14:** `ignore_index=True` in `pd.concat()` tells Pandas to disregard the original indices of the DataFrames being combined and instead create a new, sequential index (starting from 0) for the resulting concatenated DataFrame. This is crucial when combining DataFrames that might have overlapping indices (e.g., multiple pages from a PDF, each starting its index from 0), as it prevents duplicate indices and ensures each row in the final DataFrame has a unique identifier. (133:10)

**Q15: Why is it important to learn CSS selectors for data science, and how can I practice them?** (147:00)

**A15:** Learning CSS selectors is vital for web scraping and data science because they allow you to precisely locate and extract specific elements from HTML documents. This is a fundamental skill for getting the exact data you need from websites.

To practice, you can:

1.  **Use Browser Developer Tools:** Open your browser's Developer Console (usually by pressing F12 or right-clicking "Inspect Element"). You can then test different selectors to see what elements they highlight.
2.  **Online Resources:** Websites like W3Schools provide excellent tutorials and interactive exercises for CSS selectors.
3.  **Practice on Any Website:** Go to any website, inspect its elements, and try to write selectors that target specific pieces of information. This hands-on experience is invaluable.

The power of selectors lies in their ability to pinpoint exactly what you need, even in complex HTML structures, making your scraping much more efficient and accurate. (147:00)
