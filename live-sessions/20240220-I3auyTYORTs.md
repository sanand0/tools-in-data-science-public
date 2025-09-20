# 02 - Fundamentals of web scraping with urllib and BeautifulSoup

[![02 - Fundamentals of web scraping with urllib and BeautifulSoup](https://i.ytimg.com/vi_webp/I3auyTYORTs/sddefault.webp)](https://youtu.be/I3auyTYORTs)

Duration: 1h 37m

Here's an FAQ based on the live tutorial, incorporating student questions and succinct answers:

**Q1: What tools do I need for web scraping and how do I set up my Python environment?**

**A1:** You'll need a web browser (any browser works, but I often use Wikipedia as a reference) and a Python environment. While Jupyter Notebook is an option, I recommend using **Google Colab**. It's an online Python notebook that processes everything on Google's servers, so it doesn't burden your local computer's CPU.

To start with Colab:

1.  Search for "Colab" and click the first link.
2.  Open a new notebook.
3.  Give your notebook a name (e.g., "demo scraping" or "scraping fundamentals").
4.  You'll need to log in, typically with a Google ID.

**Q2: How does web scraping work, and what is a URL's role in it?**

**A2:** When you enter a URL (Uniform Resource Locator, which is a web page's specific address) into your browser, that request goes to a web server. The server doesn't send back the visually formatted page you see; instead, it sends raw code, primarily HTML (and often CSS/JavaScript). Your browser's job is then to convert this raw code into the visual representation you experience. Web scraping bypasses the visual rendering and directly retrieves this raw HTML data from the server.

**Q3: How do I get the raw HTML of a webpage using Python?**

**A3:** You'll use Python's built-in `urllib.request` library.

1.  Import `urlopen` from it: `from urllib.request import urlopen`.
2.  Define the URL of the webpage you want to scrape as a string (e.g., `url = "https://en.wikipedia.org/wiki/Wildfire"`).
3.  Open the URL and read its content: `x = urlopen(url).read()`.
    The variable `x` (or whatever you name it) will then hold the raw HTML content of that webpage as a single, long string.

**Q4: The raw HTML output from `x.read()` is very hard to read because it's a single long string. How can I make it more structured and readable?**

**A4:** The `BeautifulSoup` library is perfect for this.

1.  Import it: `from bs4 import BeautifulSoup`.
2.  Create a `BeautifulSoup` object, passing your raw HTML and specifying an HTML parser: `soup = BeautifulSoup(x, 'html.parser')`.
    `BeautifulSoup` will then parse the HTML and format it neatly, with proper indentations, making it much easier to understand. You can then just call `soup` to see the formatted output.

**Q5: Can I scrape a local HTML file instead of a web URL?**

**A5:** Yes, you can. First, you need to upload your local HTML file to your Google Colab environment (use the "File" icon in the left sidebar to upload). Then, you would typically use `urlopen()` with the local file's path. However, during the live demo, this particular functionality encountered an "unknown URL type" error, which would need further debugging.

**Q6: What is the difference between `soup.find()` and `soup.find_all()` when searching for HTML tags?**

**A6:**

- `soup.find('tag_name')` (or `soup.a`) will return only the _first occurrence_ of that specific HTML tag it finds in the document.
- `soup.find_all('tag_name')` will return a _list_ of all occurrences of that tag found in the document.

**Q7: If `find_all` returns a list of tags, how do I access a specific one, like the 5th image on the page?**

**A7:** Since `find_all` returns a Python list, you can use standard list indexing. To get the 5th image, you would use `soup.find_all('img')[4]` (because lists are 0-indexed in Python).

**Q8: How can I find specific HTML tags based on their attributes (like `class`, `id`, `width`, or `height`)?**

**A8:** You can pass a dictionary of attributes to `find_all` (or `find`).

- **By `class`:** `soup.find_all(class_='your_class_name')`. You can also pass a list of class names to `class_` (e.g., `class_=['classA', 'classB']`) to find elements that have _either_ of those classes.
- **By `id`:** `soup.find_all(id='your_id_name')`.
- **By other attributes (e.g., `width`, `height` for images):** `soup.find_all('img', {'width': '220', 'height': '396'})`.
- **By combination (e.g., `img` tag with specific `width` AND `height`):** `soup.find_all('img', {'width': '220', 'height': '396'})`.

**Q9: How do I find specific text content within the HTML, not just tags?**

**A9:** You can use the `text` argument within `find_all` (or `find`). For example: `soup.find_all(text='your specific text')`. The `.get_text()` method can also be called on a tag object to extract only its textual content, stripping HTML tags. Using `strip=True` with `get_text()` removes leading/trailing whitespace.

**Q10: How do I find an element that's nested inside another, like a `<td>` (table data) tag within a `<tr>` (table row) inside a `<table>`?**

**A10:** You can chain `find_all` calls. First, find the parent element, then call `find_all` on the _result_ of that parent search. For example, to find all `<td>` tags within the first `<tr>` of the first `<table>`:
`soup.find_all('table')[0].find_all('tr')[0].find_all('td')`. This goes step-by-step down the HTML hierarchy.

**Q11: Once I have a tag object, how do I get its text content or the value of one of its attributes (like `href` from an anchor tag or `src` from an image tag)?**

**A11:**

- To get just the text content, use the `.get_text()` method on the tag object (e.g., `a_tag_object.get_text()`).
- To get an attribute's value, treat the tag object like a Python dictionary: `tag_object['attribute_name']` (e.g., `a_tag_object['href']` or `img_tag_object['src']`).

**Q12: What exactly is a "class" in the context of HTML and web scraping, and why is it useful?**

**A12:** In HTML, a `class` is an attribute assigned to elements, primarily used to apply common styles (via CSS) or behavior (via JavaScript). For web scraping, it's incredibly useful because `id` attributes are _supposed_ to be unique on a page, but `class` attributes can be reused across many elements. This allows you to target specific groups of elements that share a common design or function on a page.

**Q13: What are "cookies" in web scraping?**

**A13:** This topic is scheduled to be covered in the next session.

**Q14: How can I extract all URLs or image sources from a webpage?**

**A14:**

- **For URLs:** Find all anchor tags (`<a>`) using `soup.find_all('a')`. Then, loop through this list and extract the `href` attribute from each tag using `a_tag['href']`.
- **For image sources:** Find all image tags (`<img>`) using `soup.find_all('img')`. Then, loop through this list and extract the `src` attribute from each tag using `img_tag['src']`.

**Q15: How can I find a specific image based on its dimensions (width and height)?**

**A15:** You can use `find_all('img', {'width': 'your_width', 'height': 'your_height'})`. For example, `soup.find_all('img', {'width': '220', 'height': '396'})` would find images matching those pixel dimensions.

**Q16: How can I find a specific image based on its position within the HTML (e.g., the 3rd `img` tag)?**

**A16:** After using `soup.find_all('img')` to get a list of all image tags, you can use Python's list indexing to get a specific one (e.g., `soup.find_all('img')[2]` for the 3rd image).

**Q17: Is it possible to find HTML elements that have _either_ one attribute _or_ another (e.g., elements with class A OR class B)?**

**A17:** Yes, you can pass a list of attribute values to `find_all`. For example, `soup.find_all(class_=['classA', 'classB'])` would return elements that have either `classA` or `classB`.

**Q18: What if I want to find elements that have a specific attribute (like `width` or `height`) but _don't_ have another attribute (like `class`)?**

**A18:** You can specify `attribute_name=False` in your `find_all` (or `find`) call. For example, `soup.find_all('p', class_=False)` would find all paragraph tags that do _not_ have a `class` attribute.

**Q19: What if I want to find _any_ tag that has a specific class, regardless of the tag type (e.g., find all elements with `class="example"`, whether they are `div`s, `p`s, etc.)?**

**A19:** You can omit the tag name in `find_all` and just provide the class attribute: `soup.find_all(class_='example')`. This will return a list of all elements (regardless of tag) that have that specific class.

**Q20: What are some best practices for coding web scraping scripts?**

**A20:**

- Always inspect the webpage's HTML first to understand its structure and identify what you need.
- Use `BeautifulSoup` to parse and format the raw HTML for readability.
- Break down your scraping task into smaller steps: first identify broad sections, then narrow down to specific elements.
- Give meaningful variable names.
- Use `find_all` to get lists of elements and then use Python indexing or loops to process them.
- Be aware of different HTML parsers (`html.parser`, `lxml`, `html5lib`); their core functionality is similar, but formatting might differ slightly.
- While I cannot share my exact Colab notebook during the session, you are encouraged to write your own code and experiment. If you face problems, you can always ask for help.
