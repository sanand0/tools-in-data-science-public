# Data Sourcing

[<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-broadcast-pin" viewBox="0 0 16 16">
<path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM6 8a2 2 0 1 1 2.5 1.937V15.5a.5.5 0 0 1-1 0V9.937A2 2 0 0 1 6 8"/>
</svg> <span style="font-size: 24px; margin: 0 6px; vertical-align: bottom">Data Sourcing: Introduction Podcast</span>](https://drive.google.com/file/d/1_mtDu_iXBHo_3uiDSrpdmVbWWbp_09hH/view) by [NotebookLM](https://notebooklm.google.com/)

Before you do any kind of data science, you obviously have to get the data to be able to analyze it, visualize it, narrate it, and deploy it.
And what we are going to cover in this module is how you get the data.

There are three ways you can get the data.

1. The first is you can **download** the data. Either somebody gives you the data and says download it from here, or you are asked to download it from the internet because it's a public data source. But that's the first way—you download the data.
2. The second way is you can **query it** from somewhere. It may be on a database. It may be available through an API. It may be available through a library. But these are ways in which you can selectively query parts of the data and stitch it together.
3. The third way is you have to **scrape it**. It's not directly available in a convenient form that you can query or download. But it is, in fact, on a web page. It's available on a PDF file. It's available in a Word document. It's available on an Excel file. It's kind of structured, but you will have to figure out that structure and extract it from there.

In this module, we will be looking at the tools that will help you either download from a data source or query from an API or from a database or from a library. And finally, how you can scrape from different sources.

[![Data Sourcing - Introduction](https://i.ytimg.com/vi_webp/1LyblMkJzOo/sddefault.webp)](https://youtu.be/1LyblMkJzOo)

Here are links used in the video:

- [The Movies Dataset](https://www.kaggle.com/rounakbanik/the-movies-dataset)
- [IMDb Datasets](https://imdb.com/interfaces/)
- [Download the IMDb Datasets](https://datasets.imdbws.com/)
- [Explore the Internet Movie Database](https://gramener.com/imdb/)
- [What does the world search for?](https://gramener.com/search/)
- [HowStat - Cricket statistics](http://howstat.com/cricket/home.asp)
- [Cricket Strike Rates](https://gramener.com/cricket/)

## Scraping with Excel

[![Weather Scraping with Excel: Get the Data](https://i.ytimg.com/vi_webp/OCl6UdpmzRQ/sddefault.webp)](https://youtu.be/OCl6UdpmzRQ)

You'll learn how to [import tables on the web using Excel](https://support.microsoft.com/en-au/office/import-data-from-the-web-b13eed81-33fe-410d-9247-1747269c28e4), covering:

- **Data Import from Web**: Use the query feature in Excel to scrape data from websites.
- **Establishing Web Connections**: Connect Excel to a web page using a URL.
- **Using Query Editor**: Navigate the query editor to view and manage web data tables.
- **Loading Data**: Load data from the web into Excel for further manipulation.
- **Data Transformation**: Remove unnecessary columns and transform data as needed.
- **Applying Transformations**: Track applied steps in the sequence for reproducibility.
- **Refreshing Data**: Refresh the imported data to get the latest updates from the web.

Here are links used in the video:

- [Chennai Weather Forecast](https://www.timeanddate.com/weather/india/chennai/ext)
- [Excel Scraping Workbook](https://docs.google.com/spreadsheets/d/1a12ApZMD6CTiKRyO4RuauOO8IdYgACRL/view)

If you use Excel on Mac, the process is a bit different. See [Importing External Data Into Excel on Mac](https://youtu.be/PuqVoVNWF20).

## Scraping with Google Sheets

[![Scraping with Google Sheets](https://i.ytimg.com/vi_webp/eYQEk7XJM7s/sddefault.webp)](https://youtu.be/eYQEk7XJM7s)

You'll learn how to [import tables on the web using Google Sheets's `=IMPORTHTML()` formula](https://support.google.com/docs/answer/3093339?hl=en), covering:

- **Import HTML Formula**: Use =IMPORTHTML(URL, "query", index) to fetch tables or lists from a web page.
- **Granting Access**: Allow access for formulas to fetch data from external sources.
- **Checking Imported Data**: Verify if the imported table matches the data on the web page.
- **Handling Errors**: Understand common issues and how to resolve them.
- **Sorting Data**: Copy imported data as values and sort it within Google Sheets.
- **Freezing Rows**: Use frozen rows to maintain headers while sorting.
- **Live Formulas**: Learn how web data updates automatically when the source changes.
- **Other Import Functions**: IMPORTXML, IMPORTFEED, IMPORTRANGE, and IMPORTDATA for advanced data fetching options.

Here are links used in the video:

- [Google sheet used in the video](https://docs.google.com/spreadsheets/d/1Qp_YTh1-hJHxjMWE_GofkvLIKgEdKxb6NFImpId3z9o/view)
- [`IMPORTHTML()`](https://support.google.com/docs/answer/3093339)
- [`IMPORTXML()`](https://support.google.com/docs/answer/3093342)
- [Demographics of India](https://en.wikipedia.org/wiki/Demographics_of_India)
- [List of highest grossing Indian films](https://en.wikipedia.org/wiki/List_of_highest-grossing_Indian_films)

## BBC Weather location ID with Python

[![BBC Weather location API with Python](https://i.ytimg.com/vi_webp/IafLrvnamAw/sddefault.webp)](https://youtu.be/IafLrvnamAw)

You'll learn how to get the location ID of any city from the BBC Weather API -- as a precursor to scraping weather data -- covering:

- **Understanding API Calls**: Learn how backend API calls work when searching for a city on the BBC weather website.
- **Inspecting Web Interactions**: Use the browser's inspect element feature to track API calls and understand the network activity.
- **Extracting Location IDs**: Identify and extract the location ID from the API response using Python.
- **Using Python Libraries**: Import and use requests, json, and urlencode libraries to make API calls and process responses.
- **Constructing API URLs**: Create structured API URLs dynamically with constant prefixes and query parameters using urlencode.
- **Building Functions**: Develop a Python function that accepts a city name, constructs the API call, and returns the location ID.

To open the browser Developer Tools on Chrome, Edge, or Firefox, you can:

- Right-click on the page and select "Inspect" to open the developer tools
- OR: Press `F12`
- OR: Press `Ctrl+Shift+I` on Windows
- OR: Press `Cmd+Opt+I` on Mac

Here are links and references:

- [BBC Location ID scraping - Notebook](https://colab.research.google.com/drive/1-iV-tbtRicKR_HXWeu4Hi5aXJCV3QdQp)
- [BBC Weather - Palo Alto (location ID: 5380748)](https://www.bbc.com/weather/5380748)
- [BBC Locator Service - Los Angeles](https://locator-service.api.bbci.co.uk/locations?api_key=AGbFAKx58hyjQScCXIYrxuEwJh2W2cmv&stack=aws&locale=en&filter=international&place-types=settlement%2Cairport%2Cdistrict&order=importance&s=los%20angeles&a=true&format=json)
- Learn about the [`requests` package](https://docs.python-requests.org/en/latest/user/quickstart/). Watch [Python Requests Tutorial: Request Web Pages, Download Images, POST Data, Read JSON, and More](https://youtu.be/tb8gHvYlCFs)

## BBC Weather data with Python

[![Scrape BBC weather with Python](https://i.ytimg.com/vi_webp/Uc4DgQJDRoI/sddefault.webp)](https://youtu.be/Uc4DgQJDRoI)

You'll learn how to scrape the live weather data of a city from the BBC Weather API, covering:

- **Introduction to Web Scraping**: Understand the basics of web scraping and its legality.
- **Libraries Overview**: Learn the importance of [`requests`](https://docs.python-requests.org/en/latest/user/quickstart/) and [`BeautifulSoup`](https://beautiful-soup-4.readthedocs.io/).
- **Fetching HTML**: Use [`requests`](https://docs.python-requests.org/en/latest/user/quickstart/) to fetch HTML content from a web page.
- **Parsing HTML**: Utilize [`BeautifulSoup`](https://beautiful-soup-4.readthedocs.io/) to parse and navigate the HTML content.
- **Identifying Data**: Inspect HTML elements to locate specific data (e.g., high and low temperatures).
- **Extracting Data**: Extract relevant data using [`BeautifulSoup`](https://beautiful-soup-4.readthedocs.io/)'s `find_all()` function.
- **Data Cleanup**: Clean extracted data to remove unwanted elements.
- **Post-Processing**: Use regular expressions to split large strings into meaningful parts.
- **Data Structuring**: Combine extracted data into a structured pandas DataFrame.
- **Handling Special Characters**: Replace unwanted characters for better data manipulation.
- **Saving Data**: Save the cleaned data into CSV and Excel formats.

Here are links and references:

- [BBC Weather scraping - Notebook](https://colab.research.google.com/drive/1-gkMzE-TKe3U_yh1v0NPn4TM687H2Hcf)
- [BBC Weather - Mumbai (location ID: 1275339)](https://www.bbc.com/weather/1275339)
- [BBC Locator Service - Mumbai](https://locator-service.api.bbci.co.uk/locations?api_key=AGbFAKx58hyjQScCXIYrxuEwJh2W2cmv&stack=aws&locale=en&filter=international&place-types=settlement%2Cairport%2Cdistrict&order=importance&s=mumbai&a=true&format=json)
- Learn about the [`json` package](https://docs.python.org/3/library/json.html). Watch [Python Tutorial: Working with JSON Data using the json Module](https://youtu.be/9N6a-VLBa2I)
- Learn about the [`BeautifulSoup` package](https://beautiful-soup-4.readthedocs.io/). Watch [Python Tutorial: Web Scraping with BeautifulSoup and Requests](https://youtu.be/ng2o98k983k)
- Learn about the [`pandas` package](https://pandas.pydata.org/pandas-docs/stable/user_guide/10min.html). Watch
  - [Python Pandas Tutorial (Part 1): Getting Started with Data Analysis - Installation and Loading Data](https://youtu.be/ZyhVh-qRZPA)
  - [Python Pandas Tutorial (Part 2): DataFrame and Series Basics - Selecting Rows and Columns](https://youtu.be/zmdjNSmRXF4)
- Learn about the [`re` package](https://docs.python.org/3/library/re.html). Watch [Python Tutorial: re Module - How to Write and Match Regular Expressions (Regex)](https://youtu.be/K8L6KVGG-7o)
- Learn about the [`datetime` package](https://docs.python.org/3/library/datetime.html). Watch [Python Tutorial: Datetime Module - How to work with Dates, Times, Timedeltas, and Timezones](https://youtu.be/eirjjyP2qcQ)

## Scraping the IMDb with Browser JavaScript

[![Scraping the IMDb with Browser JavaScript](https://i.ytimg.com/vi_webp/YVIKZqZIcCo/sddefault.webp)](https://youtu.be/YVIKZqZIcCo)

You'll learn how to scrape the [IMDb Top 250 movies](https://www.imdb.com/chart/top) directly in the browser using JavaScript on the Chrome DevTools, covering:

- **Access Developer Tools**: Use F12 or right-click > Inspect to open developer tools in Chrome or Edge.
- **Inspect Elements**: Identify and inspect HTML elements using the Elements tab.
- **Query Selectors**: Use `document.querySelectorAll` and `document.querySelector` to find elements by CSS class.
- **Extract Text Content**: Retrieve text content from elements using JavaScript.
- **Functional Programming**: Apply [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
  and [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
  for concise data processing.
- **Data Structuring**: Collect and format data into an array of arrays.
- **Copying Data**: Use the copy function to transfer data to the clipboard.
- **Convert to Spreadsheet**: Use online tools to convert JSON data to CSV or Excel format.
- **Text Manipulation**: Perform text splitting and cleaning in Excel for final data formatting.

Here are links and references:

- [IMDB Top 250 movies](https://www.imdb.com/chart/top/)
- [Learn about Chrome Devtools](https://developer.chrome.com/docs/devtools/overview/)

## Nominatim API with Python

[![Nominatim Open Street Map with Python](https://i.ytimg.com/vi_webp/f0PZ-pphAXE/sddefault.webp)](https://youtu.be/f0PZ-pphAXE)

You'll learn how to get the latitude and longitude of any city from the Nominatim API.

- **Introduction to Nominatim**: Understand how Nominatim, from OpenStreetMap, works similarly to Google Maps for geocoding.
- **Installation and Import**: Learn to install and import [geopy](https://geopy.readthedocs.io/) and [nominatim](https://nominatim.org/).
- **Using the Locator**: Create a locator object using Nominatim and set up a user agent.
- **Geocoding an Address**: Use `locator.geocode` to input an address (e.g., Eiffel Tower) and fetch geocoded data.
- **Extracting Data**: Access detailed information like latitude, longitude, bounding box, and accurate address from the JSON response.
- **Classifying Locations**: Identify the type of place (e.g., tourism, university) using the response data.
- **Practical Example**: Geocode "IIT Madras" and retrieve its full address, type (university), and other relevant information.

Here are links and references:

- [Geocoding using Nominatim - Notebook](https://colab.research.google.com/drive/1-vvP-UyMjHgBqc-hdsUhm3Bsbgi7oO6g)
- Learn about the [`geocoders` module in the `geopy` package](https://geopy.readthedocs.io/)
- Learn about the [`nominatim` package](https://nominatim.org/release-docs/develop/api/Overview/)
- If you get a HTTP Error 403 from Nominatim, use your email ID or your name instead of "myGeocoder" in `Nominatim(user_agent="myGeocoder")`

## Wikipedia data with Wikimedia Python library

[![Wikipedia data with Wikimedia Python library](https://i.ytimg.com/vi_webp/b6puvm-QEY0/sddefault.webp)](https://youtu.be/b6puvm-QEY0)

You'll learn how to scrape data from Wikipedia using the `wikipedia` Python library, covering:

- **Installing and Importing**: Use pip install to get the Wikipedia library and import it with import wikipedia as wk.
- **Keyword Search**: Use the search function to find Wikipedia pages containing a specific keyword, limiting results with the results argument.
- **Fetching Summaries**: Use the summary function to get a concise summary of a Wikipedia page, limiting sentences with the sentences argument.
- **Retrieving Full Pages**: Use the page function to obtain the full content of a Wikipedia page, including sections and references.
- **Accessing URLs**: Retrieve the URL of a Wikipedia page using the url attribute of the page object.
- **Extracting References**: Use the references attribute to get all reference links from a Wikipedia page.
- **Fetching Images**: Access all images on a Wikipedia page via the images attribute, which returns a list of image URLs.
- **Extracting Tables**: Use the pandas.read_html function to extract tables from the HTML content of a Wikipedia page, being mindful of table indices.

Here are links and references:

- [Wikipedia Library - Notebook](https://colab.research.google.com/drive/1-w8Jo6xcQs2jK0NxNddPW4HVCZhXmTBe)
- Learn about the [`wikipedia` package](https://wikipedia.readthedocs.io/en/latest/)

**NOTE**: Wikipedia is constantly edited. The page may be different now from when the video was recorded. Handle accordingly.

## Scrape PDFs with Tabula Python library

[![Scrape PDFs with Tabula Python library](https://i.ytimg.com/vi_webp/yDoKlKyxClQ/sddefault.webp)](https://youtu.be/yDoKlKyxClQ)

You'll learn how to scrape tables from PDFs using the `tabula` Python library, covering:

- **Import Libraries**: Use Beautiful Soup for URL parsing and Tabula for extracting tables from PDFs.
- **Specify Save Location**: Mount Google Drive to save scraped PDFs.
- **Identify PDF URLs**: Parse the given URL to identify and select all PDF links.
- **Download PDFs**: Loop through identified links, saving each PDF to the specified location.
- **Extract Tables**: Use Tabula to read tabular content from the downloaded PDFs.
- **Control Extraction Area**: Specify page and area coordinates to accurately extract tables, avoiding extraneous text.
- **Save Extracted Data**: Convert the extracted table data into structured formats like CSV for further analysis.

Here are links and references:

- [PDF Scraping - Notebook](https://colab.research.google.com/drive/102Fv2Ji0J4mvao3mCse52E7Th8bZiuyf)
- Learn about the [`tabula` package](https://tabula-py.readthedocs.io/en/latest/tabula.html)
- Learn about the [`pandas` package](https://pandas.pydata.org/pandas-docs/stable/user_guide/10min.html). [Video](https://youtu.be/vmEHCJofslg)

## Optional: Emerging tools

- [PyMuPDF](https://pymupdf.readthedocs.io/) is emerging as a strong default for PDF text extraction.
- [PyMuPDF4LLM](https://pymupdf.readthedocs.io/en/latest/pymupdf4llm/index.html) is apart of PyMuPDF that generates Markdown from PDFs that's suitable for LLMs.
- [unstructured](https://unstructured.io/) is radidly becoming the de facto library for parsing over 40 different file types and extracting text and tables. It's particularly useful for generating content to pass to LLMs.

## Optional: Real-life scraping

In this live scraping session, we explore a real-life scenario where Straive had to scrape data from emarketer.com for a demo. This is a fairly realistic and representative way of how one might go about scraping a website.

[![Live scraping session](https://i.ytimg.com/vi_webp/ZzUsDE1XjhE/sddefault.webp?)](https://youtu.be/ZzUsDE1XjhE)

You'll learn:

- **Scraping**: How to extract data from web pages, including constructing URLs, fetching page content, and parsing HTML using packages like [`lxml`](https://lxml.de/) and [`httpx`](https://www.python-httpx.org/).
- **Caching**: Implementing a caching strategy to avoid redundant data fetching for efficiency and reliability.
- **Error Handling and Debugging**: Practical tips for troubleshooting, such as using liberal print statements, breakpoints for in-depth debugging, and the concept of "rubber duck debugging" to clarify problems.
- **LLMs**: Benefits of Gemini / ChatGPT for code suggestions and troubleshooting.
- **Real-World Application**: How quick proofs of concept to showcase capabilities to clients, emphasizing practice over theory.

## Optional: Live session recordings

[![Intro to Web scraping and HTML](https://i.ytimg.com/vi_webp/cAriusuJsmw/sddefault.webp)](https://youtu.be/cAriusuJsmw)

Fundamentals of web scraping with urllib and BeautifulSoup

[![Fundamentals of web scraping with urllib and BeautifulSoup](https://i.ytimg.com/vi_webp/I3auyTYORTs/sddefault.webp)](https://youtu.be/I3auyTYORTs)

Intermediate web scraping use of cookies

[![Intermediate web scraping use of cookies](https://i.ytimg.com/vi_webp/DryMIxMf3VU/sddefault.webp)](https://youtu.be/DryMIxMf3VU)

XML intro and scraping

[![XML intro and scraping](https://i.ytimg.com/vi_webp/8S_jvsjtaYg/sddefault.webp)](https://youtu.be/8S_jvsjtaYg)

## Reference and helpful content

- For those who don't know HTML, CSS, or JavaScript, this [FreeCodeCamp Responsive Web Design course](https://www.freecodecamp.org/learn/2022/responsive-web-design) is a good starting point.
- For those who don't know Python, this [Learn Python video](https://youtu.be/rfscVS0vtbw) and this [Python for Beginners](https://youtube.com/playlist?list=PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3&feature=shared) playlist is a good starting point.
- Few More Scraping tools
  1. [About Scrapy & Chrome Web Scraper Extension](https://docs.google.com/document/d/1QZPJIfg98-Gox7_tqzrqPy9PigYfRfgpsYgTHcBAYFM/view) [(Video)](https://youtu.be/s4jtkzHhLzY)
  2. Chrome Web Scraper Extension [(Video)](https://youtu.be/aClnnoQK9G0)

## Sample questions

- Read the [Hacker News API docs](https://github.com/HackerNews/API). Now, when was the post with ID `2921983` posted? Specifically, What is the timestamp? (ANS: 1314211127)
- Using [PokeAPI](https://pokeapi.co/), in the `sun-moon` version, find out how many moves `ivysaur` has that `bulbasaur` does not. (ANS: 1: leech-seed).
- How many images (`<img>` tags) does this [White House page snapshot](https://web.archive.org/web/20110101070603id_/https://www.whitehouse.gov/) have inside a link (`<a>` element)? (ANS: 15)
- What is the westernmost point (highest longitude) on the bounding box of `Baghdad, Iraq`, according to the Nominatim API? If there are multiple matches, get the highest longitude across all bounding boxes. (ANS: 44.969°E)
- What CSS selector would you use to extract the last list element with a class `highlight` from an unordered list? (ANS: `ul li.highlight:last-child`)
