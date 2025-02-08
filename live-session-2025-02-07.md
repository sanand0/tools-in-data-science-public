# Live Session: 07 Feb 2025

[![2025-02-07 Week 4 - Session 4 - TDS Jan 25](https://i.ytimg.com/vi_webp/SiW-rcMk0Nk/sddefault.webp)](https://youtu.be/SiW-rcMk0Nk)

**Q1: How difficult are the TDS assignments?**

**A1:** The first assignment was easy, the second was hard, the third was average, and the fourth seems easy. However, the instructor notes that the first assignment was only easy for those with a technical background; for most students, it was very difficult. The difficulty level of subsequent assignments will decrease.

**Q2: Where can I find the recording of yesterday's session?**

**A2:** It's already uploaded to your calendar associated with your IIT-DS ID. It takes Google about an hour or two to process the video.

**Q3: How do I use the BBC Weather API to get weather data for a specific location?**

**A3:** First, use the BBC location service API to get the location ID for your city (e.g., Delhi). You can use the Thunder Client extension or Postman to send the API request. The instructor demonstrates using Postman. Once you have the location ID, use it in the BBC Weather API endpoint.

**Q4: How do I access data from a JSON object in Python?**

**A4:** JSON objects are like Python dictionaries. You can access the data using standard Python dictionary access methods. The instructor shows how to access the "reports" key.

**Q5: How do I prepare for the upcoming R.O.E.?**

**A5:** The instructor recommends creating your own code and keeping it ready. Separate sessions will be held to cover this.

**Q6: How do I use Nominatim to get geolocation data?**

**A6:** Nominatim is an API used for extracting geolocation data. The instructor demonstrates how to use it with Postman, showing how to pass parameters for the location (e.g., "Delhi") and specify the desired format (JSON). The instructor notes that Nominatim may return multiple results if there are multiple locations with the same name (e.g., Delhi in India and Delhi in the United States).

**Q7: How do I use Beautiful Soup to parse XML data?**

**A7:** The instructor demonstrates using Beautiful Soup to parse XML data from the Hacker News API. The instructor explains how to use the `find_all` function to locate specific tags (e.g., "item") and extract the desired information. The instructor also explains the difference between `find` and `findall` functions. The instructor notes that if you encounter issues, you can use an XML viewer to examine the structure of the XML file. The instructor also explains that you should use an XML parser (lxml) instead of an HTML parser.

**Q8: How do I handle situations where the number of values in different lists doesn't match?**

**A8:** If the lengths of lists (e.g., product names, prices, links) don't match, it usually means there's an extra value. The instructor shows how to handle this by checking the lengths of the lists and potentially removing extra values.

**Q9: How do I save the extracted data to a CSV file?**

**A9:** The instructor demonstrates using the pandas library to create a DataFrame from the extracted data and then saving it to a CSV file using the `to_csv` method.

**Q10: How do I scrape data from multiple pages of a website?**

**A10:** Many websites allow scraping, but you should always check their terms and conditions. If a website allows scraping, you can often use a page parameter in the URL to access subsequent pages (e.g., `page=2` for the second page). You can use a for loop to iterate through multiple pages.

**Q11: What are the legal and technical considerations when scraping websites?**

**A11:** Always check the website's terms and conditions before scraping. Some websites can detect when requests are not coming from a browser and may block you. To avoid this, use a sleep timer between requests to give the server time to respond. Selenium is an alternative approach that simulates a browser, but it's more involved than Beautiful Soup. The instructor mentions being banned from Nominatim for sending too many requests in a short time frame.

**Q12: How can I use Beautiful Soup to extract data from an e-commerce website?**

**A12:** The instructor demonstrates using Beautiful Soup to extract product names, prices, and links from an Amazon search result page. The instructor explains how to use the `find_all` function to locate specific tags and attributes (e.g., `span` elements with a specific class) and extract the text content. The instructor also shows how to convert string prices to numerical values. The instructor notes that the order of elements is preserved when using Beautiful Soup, ensuring that data is correctly associated.
