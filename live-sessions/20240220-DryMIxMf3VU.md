# 03 - Intermediate web scraping use of cookies

[![03 - Intermediate web scraping use of cookies](https://i.ytimg.com/vi_webp/DryMIxMf3VU/sddefault.webp)](https://youtu.be/DryMIxMf3VU)

Duration: 2h 19m

This is a summary of the Q&A from a web scraping tutorial on Tools in Data Science (TDS).

**Q1: Why are we wasting so much time on web scraping when we can just find information manually with our eyes?**

**A1:** Web scraping is useful for several reasons:

1.  **Dynamic Data:** Websites with constantly changing data (like stock market prices or real-time world population) can be scraped to get up-to-date information efficiently.
2.  **Large Datasets:** When dealing with huge amounts of data (thousands or millions of rows daily, as in research data or large tables), manual entry is impractical and time-consuming. A script can gather this data in minutes, saving hours of effort.
3.  **Automation:** Once a script is written, it can be run daily to collect new data without manual intervention, saving repetitive work.
4.  **Data Structuring:** Scraping allows you to extract data and organize it into structured formats (like tables or CSV files) for further analysis, which is difficult to do manually from web pages.

**Q2: In real-world practical applications, do we open the inspect page, identify tags, and then write Python code accordingly?**

**A2:** Yes, that's exactly right. There isn't a single "set formula" for web scraping. You typically inspect the website's HTML, identify the relevant tags and attributes, and then write custom Python code using methods like those discussed in the tutorial.

**Q3: Is the scraping code specific to each website, and what happens if the website's code changes?**

**A3:** Yes, the scraping code is usually specific to the website's structure. If the website developer makes changes to the HTML structure (e.g., changes tag names, classes, or IDs), your existing scraping script will break and you'll need to modify or rewrite it.

**Q4: What is today's task?**

**A4:** Your task is to scrape data from the provided World Population website. You need to extract:

1.  A list of all countries (around 250 entries).
2.  A list of their respective populations.
3.  If possible, organize this data into two columns (country name and population) and save it as a CSV file.
    The website has clean HTML code, so it should be manageable.

**Q5: How much time should I allocate for this task?**

**A5:** Let's aim for 15 minutes.

**Q6: Should I create two separate lists or one combined list?**

**A6:** At least create a list, or even a single list. Just show me you can do it.

**Q7: Can you share the website link in the chat?**

**A7:** Yes, the link has been shared in the chat.

**Q8: Should you (the instructor) also code along with us?**

**A8:** Yes, I'll code along, but please no cheating! I'll go fast, but you should try it yourself. My code is mainly for reference if you get stuck.

**Q9: I'm having trouble importing the URL; it's showing an error. What should I do?**

**A9:** Make sure you're using `requests` library instead of `url.parse`. Check your spelling carefully; sometimes a typo (like "parser" instead of "requests") can cause issues. I've pasted the correct code snippet in the chat for the first cell, verify your code against it.

**Q10: I'm getting a "couldn't build tree builder" error.**

**A10:** This error usually indicates a spelling mistake in the parser name. Double-check that you've correctly spelled `html.parser` in your `BeautifulSoup` constructor.

**Q11: Do we need to use `soup.text`?**

**A11:** Not necessarily. `soup.text` is useful for quickly viewing all the visible text content of a page to ensure your scraping is capturing the desired data. Whether you use it or directly extract elements depends on your specific needs and preference.

**Q12: I'm getting a `length` of 4 for the table data.**

**A12:** That's interesting. Try accessing different table indices (e.g., `table[1]`, `table[2]`, etc.) to see if your desired data is in another table.

**Q13: My code is working, but it's printing every element line by line. I want only the country names in a single column.**

**A13:** Your code is good for general data extraction. To get only country names, you need to be more specific in your selection. You can target the exact HTML elements that contain the country names. For instance, if countries are in a list, you might iterate through list items.

**Q14: How do I get country names and populations to appear side-by-side in the same line?**

**A14:** You can use Python's `print()` function with the `end` or `sep` arguments to control output formatting. For example, `print(country, population, sep=' ')` would print them on the same line with a space in between. To create a proper table-like structure, you'd typically use a library like Pandas to build a DataFrame and then export it to CSV.

**Q15: What is the `th` element you used in your code?**

**A15:** `th` stands for "table header." It's used in HTML tables to define a header cell in a table row. In the context of the World Population website, the first row of the table likely contains `th` tags for columns like "Country," "Population," "Area," etc.

**Q16: I'm still facing an issue where `len(soup.find_all('table')[0])` is returning 4, even though there are many rows.**

**A16:** The `len()` function on `soup.find_all('table')[0]` will give you the number of _direct children_ of that table (e.g., `<thead>`, `<tbody>`, `<tfoot>`, or `<tr>` tags immediately inside). It won't give you the total number of data rows in the table. To get the number of data rows, you need to target the `<tr>` elements within the `<tbody>` tag and then find their length. I'll explain how to find the total length of the desired data soon.

**Q17: Why use `ID` in the scraping code, as shown in Kevin's example?**

**A17:** Using an `ID` attribute is a clever trick for pinpointing specific elements. On complex web pages, there might be many `<table>` tags. Instead of iterating through `table[0]`, `table[1]`, etc., if a specific table has a unique `ID` (e.g., `id="main_table"`), you can directly target it using `soup.find('table', id='main_table')`. This makes your code more robust and less prone to breaking if other tables are added or removed from the page. It's like having a unique address for a specific element.

**Q18: Is there an easy way to convert the scraped list into a DataFrame?**

**A18:** Yes, Pandas is excellent for this. You can easily create a DataFrame from your lists of countries and populations.

**Q19: I keep getting an error like "list index out of range" when trying to iterate through table rows.**

**A19:** This often happens when the loop's range is incorrect. You might be trying to access an index that doesn't exist. For instance, if you're looping from 0 to 250, but the list only has 240 items, you'll get this error. You can use `len(your_list_of_rows)` to dynamically get the correct upper bound for your loop, or specifically adjust the starting index if the first row is a header.

**Q20: Can you show me how to retrieve only the country names without other information using code?**

**A20:** Yes, once you have the content of the relevant table rows, you'll need to navigate into those rows to find the specific element (often a `<td>` tag) that contains the country name. You can use methods like `find()` or `find_all()` again on each `<tr>` element to extract just the country name.

**Q21: You're using `requests` library instead of `urllib` for web scraping. Is there a specific reason?**

**A21:** Yes, `requests` is generally preferred because it's a more user-friendly and powerful library for making HTTP requests. It simplifies many common tasks compared to `urllib`, especially when dealing with advanced features like handling cookies, sessions, and authentication. For this tutorial, `requests` is particularly useful for cookie handling.

**Q22: My code gives a `response 200` status. What does that mean?**

**A22:** A `response 200` status code means your request was successful, and the server successfully returned the content. It indicates that the page you requested exists and was retrieved without any issues.

**Q23: I'm seeing "response 200" but also a lot of unusual characters and very little human-readable text when I try to print the response text. It seems like mostly tags and symbols.**

**A23:** This is because the initial `response.text` gives you the raw HTML content, which can be difficult to read directly. You need to parse this HTML using `BeautifulSoup` to make it structured and navigable.

**Q24: After using `BeautifulSoup` and converting the content to JSON, my code is still not showing clear text. It's mostly tags and non-human readable characters.**

**A24:** You're trying to convert the raw HTML (which is text-based but contains tags) directly into JSON. HTML isn't inherently JSON, so this step might not be giving you what you expect. You should first parse the HTML with `BeautifulSoup` to extract the _specific data_ you want, and _then_ you can optionally structure that extracted data into a dictionary and convert it to JSON if needed.

**Q25: Can you explain how to work with Cookies for web scraping?**

**A25:** Cookies are small pieces of data that websites store in your browser. They contain information about your session, like login status, user preferences, and activity. This is why when you log into a website (e.g., YouTube, Facebook), your personalized homepage appears, different from someone else's.

Here's how cookies work in scraping:

1.  **Sending Requests:** When your browser sends a request to a website, it often includes specific cookies. The server uses these cookies to identify you and tailor the response.
2.  **Scraping Secured Websites:** To scrape websites that require login (like movie database websites that only show recommendations after login), your scraping script needs to include the appropriate cookie information in its requests. This tells the server that your script is an authenticated user.
3.  **Finding Cookies:** You can find cookies by inspecting elements in your browser: Right-click -> Inspect -> Network tab. Refresh the page, click on the first network request (usually your homepage), and scroll down to the "Request Headers" section. You'll find a "Cookie" header with key-value pairs (e.g., `ML4_session=...`). This is your session cookie.
4.  **Using Cookies in Python:** With the `requests` library, you can pass this cookie information as a dictionary in your GET or POST requests.

**Q26: My session cookie value for the movie website is `E3C1...8AB`. Are all cookies the same, or is everyone's different?**

**A26:** Every user's session cookie is different. This is how websites maintain your personalized session and differentiate you from other users. If you log out and log back in, or if your session expires, the cookie value will change.

**Q27: What is the lifespan of a cookie?**

**A27:** The lifespan of a cookie varies. Some cookies are session-based and expire when you close your browser. Others have an expiration date set by the website. For sensitive operations like online banking, sessions are often set to expire quickly (e.g., 15 minutes) to enhance security. Less sensitive sites might keep cookies for longer. The developer determines the cookie's lifespan.

**Q28: If I provide my cookie information to a malicious actor, what can they do?**

**A28:** If a malicious actor gets hold of your session cookie, they can impersonate you on that website without needing your username or password. They can effectively "log in" as you and access your personal information, perform actions, or view your data. This is why you should never share your cookies. This concept is the basis of session hijacking and is a real security threat.

**Q29: Can you show me how to access the movie website using my cookie?**

**A29:** Yes, we'll use the `requests` library for this, as it's better for cookie handling than `urllib`.

1.  **Import Libraries:** Import `requests` and `BeautifulSoup`.
2.  **Define Cookies:** Create a Python dictionary with your session cookie (e.g., `cookies = {'ML4_session': 'your_cookie_value'}`).
3.  **Make Request:** Use `requests.get(URL, cookies=cookies)` to send a request including your cookie.
4.  **Parse Response:** Use `BeautifulSoup` to parse the `response.text`.

This will allow you to access the logged-in version of the website.

**Q30: I'm seeing a "response 202" status code. What does that mean?**

**A30:** A `response 202` status code means your request was accepted for processing, but the processing is not yet complete. This is different from `200 OK` (which means immediate success) and often occurs with asynchronous operations. For web scraping, it usually means your request was valid, and the server is working on it.

**Q31: I see "response 202," but the text is still not showing the movie names. It's very generic HTML.**

**A31:** The initial URL you're using (e.g., the homepage after login) might still not be the direct source of the movie list. Websites often load dynamic content or use AJAX calls after the main page loads. You need to find the specific API endpoint or a different URL that directly provides the movie data. By inspecting the "Network" tab again after the main page loads, look for specific requests that fetch the movie data. In this case, the `front_page` API endpoint is what you need.

**Q32: I've found the `front_page` API endpoint. What should I do with it?**

**A32:** This is the key! The `front_page` API endpoint directly provides the movie data you need in a structured format (likely JSON). You should use this URL instead of the main website URL in your `requests.get()` call. This will give you the raw data directly.

**Q33: How do I access the movie titles from the JSON data received from the API?**

**A33:** Since the API returns JSON, you'll first parse it using `json.loads(response.text)`. This will convert the JSON string into a Python dictionary or list. Then, you can navigate through the dictionary/list structure to extract the movie titles. For example, if the movies are under a "results" key, and each movie has a "title" key, you'd access it like `data['results'][0]['title']`.

**Q34: How can I display all the movie titles as a list?**

**A34:** After parsing the JSON response into a Python dictionary, you need to iterate through the relevant part of the data that contains the movie information (e.g., `data['results']`). For each movie entry in that list, extract the "title" and append it to a new Python list. Finally, print that list.

**Q35: Is it possible to share the code for finding all the movie titles?**

**A35:** No, I won't share the code directly. You're encouraged to try it yourself. If you get stuck, you can ask specific questions.

**Q36: After running the code, I'm getting a "Response 200" message, but I'm not seeing any movie titles, only basic HTML.**

**A36:** This indicates that you're successfully making the request, but you're probably still getting the generic HTML of the homepage or another non-data-rich page. Make sure you're using the correct API endpoint URL that returns the actual movie data (like the `front_page` API URL we found). Once you use the correct API endpoint, the response should be in JSON format, which you then need to parse.

**Q37: My code is giving an "attribute error" for dictionary objects related to content.**

**A37:** This error usually means you're trying to access a `.content` or `.text` attribute on an object that's already a Python dictionary or list (after parsing JSON). The `.content` or `.text` attributes are used on the raw `response` object _before_ it's parsed as JSON. Once you use `json.loads()`, you're working with standard Python data structures.

**Q38: Why is the response giving "response 202" then not showing the movie list?**

**A38:** The "response 202" indicates the request was accepted, but the actual data might be fetched by another subsequent request or loaded dynamically. Your script is likely only capturing the initial acceptance. You need to identify the exact API endpoint that delivers the movie list itself. Look for URLs in the Network tab that have "API" or "data" in their path and seem to return a JSON response.

**Q39: I'm getting a "response 200" but still only seeing basic HTML, not the movie titles.**

**A39:** You're successfully accessing a page, but it's not the correct data source. You need to use the specific API endpoint (like `api/user/me/front_page`) that returns the movie data as JSON. The generic HTML page won't contain the movie list directly in an easy-to-parse format.

**Q40: I'm having trouble seeing the actual movie titles. What am I missing in the JSON parsing?**

**A40:** After converting the JSON response into a Python object (likely a dictionary), you need to navigate through its keys to reach the list of movies and then extract the "title" from each movie entry. For instance, if your JSON looks like `{'results': [{'title': 'Movie A'}, {'title': 'Movie B'}]}`, you'd need to access `data['results']` and then iterate through that list to get each movie's `['title']`.

**Q41: Can you show me the correct path in the JSON to access the movie titles?**

**A41:** Based on the common structure of this API, the path to the movie titles is usually `data['results'][i]['title']`, where `i` is the index of the movie in the list. So, you'd iterate through `data['results']` and extract the title from each item.

**Q42: What does `x.text` give me after parsing the JSON?**

**A42:** After parsing the JSON with `json.loads(response.text)`, `x` becomes a Python dictionary (or list). It no longer has a `.text` attribute, as `.text` is a property of the original `requests.Response` object. If you try to use `x.text` after `json.loads()`, you'll get an `AttributeError`.

**Q43: What's the point of doing all this if we can't get the password?**

**A43:** The goal isn't always to get passwords. The point is to demonstrate how cookies and sessions work and how a scraper can impersonate an authenticated user. This knowledge is crucial for ethical hacking (penetration testing), understanding web security vulnerabilities, and building powerful data collection tools that interact with complex websites. It also shows you what kind of information can be accessed with just a session cookie.

**Q44: Can you share the code for the cookie and the API URL in the chat?**

**A44:** No, I won't share the code or the cookie directly. The exercise is for you to find and implement it.

**Q45: If you can access my profile, does that mean you can change my password or access my banking details?**

**A45:** If I have your cookie, I can access your profile _as you_. This means I can view any information that you (the authenticated user) can see. However, changing passwords or accessing sensitive financial details usually requires additional authentication steps (like entering your current password, OTP, or security questions), which a simple session cookie alone won't bypass. Websites implement these extra layers of security precisely to prevent such actions.

**Q46: Is this web scraping method also applicable to highly protected websites like banking websites?**

**A46:** While the principles of using cookies for authentication apply, highly protected websites like banking sites have much stronger security measures. They often employ:

1.  **Strict Anti-Bot Measures:** Advanced CAPTCHAs, bot detection systems, and IP blocking.
2.  **Frequent Session Expiration:** Sessions expire very quickly.
3.  **Multi-Factor Authentication (MFA):** OTPs, security tokens, etc., which cookies alone cannot bypass.
4.  **Complex JavaScript:** Dynamic content loading and obfuscated JavaScript that makes scraping much harder.
    So, while theoretically possible to interact with them, successfully scraping data from banking websites is extremely difficult and usually not feasible with basic web scraping techniques, especially for bypassing security features.

**Q47: Is there any way to know if a website has security measures to detect and block scraping bots?**

**A47:** Yes, you can check for several signs:

1.  **`robots.txt` file:** This file (e.g., `www.example.com/robots.txt`) tells bots which parts of the site they're allowed or disallowed to crawl. Respecting this file is good practice.
2.  **CAPTCHAs:** Websites often use CAPTCHAs (like reCAPTCHA) to verify if the user is human, especially after repetitive requests.
3.  **IP Blocking:** If you send too many requests too quickly, the website might block your IP address.
4.  **Dynamic Content:** Websites heavily reliant on JavaScript to load content (like many modern single-page applications) are harder to scrape with basic tools because the HTML source might not contain the data until JavaScript executes.
5.  **User-Agent Blocking:** Some sites block requests from known bot user-agents. You can try to mimic a real browser's user-agent in your request headers.
6.  **Complex Authentication:** Websites requiring intricate login flows (MFA, session tokens, etc.) are generally harder to scrape programmatically.
