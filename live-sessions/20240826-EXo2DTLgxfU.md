# TA Session 25th August: Revision: Modules 4 to 6

[![TA Session 25th August: Revision: Modules 4 to 6](https://i.ytimg.com/vi_webp/EXo2DTLgxfU/sddefault.webp)](https://youtu.be/EXo2DTLgxfU)

Duration: 1h 51m

Here's an FAQ-style transcription of the TDS live tutorial:

**Q1: Will you share the model you mentioned in the last session for generating mocks? (0:39, 1:20)**

**A1:** I haven't had a chance to discuss that with Anand yet (who built it at his own expense). I'm not sure if it's ready to be released to all students. I'll find out first if it's possible. If not, the alternative of uploading your own data to create a model would require a lot of information and tokens, which might be an issue.

**Q2: We don't need a paid version of Jupyter Notebook or tokens, right? (1:51)**

**A2:** That's correct, you don't need a paid version or tokens. My suggestion for Antrim preparation is to collaborate. Each person can pick one week (out of weeks 4, 5, 6), do 4-5 iterations (generating about 10 questions per iteration), and that will give you 50 questions per week. If 5-6 people pool their efforts, you'll have a really good dataset.

**Q3: What tools and functions should I know for modeling data, correlation, and regression? (2:43, 4:25, 15:32, 19:30)**

**A3:**

- **General:** We mainly use Excel and Python.
- **Correlation:** Create a two-column table: one column for the function name and the other for its use. For Python, know which formula to use to find correlation. The general form of correlation we use is `Pearson Correlation`. Make a note of it. If they ask for Pearson correlation, it's just the simple correlation; don't be confused. In Excel, the tool you use is `Analysis ToolPak`.
- **Regression:** In Excel or Google Sheets, regression commonly uses the `INTERCEPT` and `SLOPE` formulas. Remember what slope and interception represent.

**Q4: How are the end-term exam questions generated, and what types of questions should I expect? (4:43)**

**A4:** Historically, the question papers were made by humans. However, now professors and instructors are using ChatGPT to generate them. So, the type of questions might change this time. You should be prepared for different types. While I can't guarantee anything, it's _most likely_ that they will _not_ ask numerical questions.

**Q5: What graphs are used for outlier detection, and what's the formula for IQR? (5:04, 5:51)**

**A5:**

- **Graphs:** `Box plots` and `Violin plots` are helpful for outlier detection. They might ask which graph is _not_ used.
- **IQR:** IQR (Interquartile Range) is calculated as `Q3 - Q1`. For defining outliers, values that are less than `Q1 - 1.5 * IQR` or greater than `Q3 + 1.5 * IQR` are considered outliers. Remember this formula and how it relates to a box plot.

**Q6: Is classification supervised or unsupervised, and what about clustering? (7:44)**

**A6:**

- `Classification` is a `supervised` problem because we need to provide labels to the data.
- `Clustering` is an `unsupervised` problem because we don't know the optimal number of clusters beforehand.

**Q7: Can you explain the Elbow Method in clustering? (8:19)**

**A7:** The Elbow Method helps find the optimal number of clusters (K) in K-means clustering. Choosing too small a K (e.g., K=1) makes every instance its own cluster, leading to overfitting and high variance. Choosing too large a K (e.g., K=100 for 100 instances) makes the entire dataset a single cluster, making it too generalized. The Elbow Method visualizes the relationship between the number of clusters and the error/distortion. The "elbow" point (where the graph's slope sharply decreases) suggests the optimal K value. It's a heuristic, not a guaranteed solution, especially for NP-hard problems.

**Q8: What's the ARIMA order, and how can I remember it? (11:16, 12:08, 12:19, 12:46)**

**A8:** The ARIMA order is (AutoRegression, Integrated, Moving Average). A good mnemonic is the name itself: **AR** (AutoRegression), **I** (Integrated, for difference order), **MA** (Moving Average). This is a single formula you need to mug up, as it's frequently asked. Carton pasted it in the chatbox earlier: `(p, d, q)` where `p` is AR, `d` is I, and `q` is MA.

**Q9: Can you explain the role of Beautiful Soup in web scraping? (14:00)**

**A9:** Beautiful Soup does _not_ bring HTML content from a server to your Python notebook. For that, you need libraries like `requests` or `urllib`. Beautiful Soup's role is to _beautify_ and _parse_ the HTML content that you've already fetched, making it readable and searchable. This distinction is crucial, as many students mistakenly select Beautiful Soup for fetching HTML in exams.

**Q10: What's new in this term's content? (21:36)**

**A10:** A new topic introduced this term is the `Parquet file format`. Parquet is an open-source, columnar storage data format designed for efficient handling of large, complex data volumes. It offers high compression and supports various encoding types. It differs from CSV in being column-oriented (CSV is row-oriented). Make notes on its benefits, as it's a new area.

**Q11: How do I handle date/time data that isn't in a standard format in Excel? (24:20)**

**A11:** If you enter dates in a human-readable but non-standard format (e.g., "21.08.2024" instead of "21/08/2024"), Excel won't recognize it as a date. This prevents calculations and can cause errors. You must first `format` the column's data type to a standard date/time format within Excel. You should know the various date/time formats available in Excel/Google Sheets.

**Q12: How do delimiters work in Excel's "Text to Column" feature? (28:04)**

**A12:** A `delimiter` is a character used to separate data (e.g., a space separates "Amit Kumar Gupta"). Excel's "Text to Column" feature uses delimiters to split data into different columns. You can define _any_ character (or even a word) as a delimiter using the "custom" option. Therefore, questions asking which option is _not_ a correct delimiter (e.g., comma, dot, tilde) are tricky, as you can define almost anything as a custom delimiter.

**Q13: What is "sentiment analysis," and how is sentiment quantified? (36:43)**

**A13:** Sentiment analysis determines the emotional tone behind a piece of text. Each statement can be classified as a `fact` (zero subjectivity) or an `opinion` (having some subjectivity). Opinions carry sentiment (positive, negative, or neutral).

- **Quantification:** Sentiment is often expressed numerically, typically on a scale from `-1 (very negative)` to `+1 (very positive)`, with `0` representing `neutral`.
  - Values like `0.2` would be "slightly positive," while `0.8` would be "strongly positive."
  - Values like `-0.1` would be "slightly negative," and `-0.9` would be "strongly negative."
  - `0` is strictly neutral.
- **Custom Ranges:** While Python's standard TextBlob library uses the -1 to +1 range, you can instruct LLMs like ChatGPT to provide sentiment ratings using a custom range (e.g., -10 to +10). The key is to understand what the numerical value represents within the given scale.

**Q14: What are "tokens" and how many words equal one token? (40:40)**

**A14:** In the context of LLMs, a `token` is the unit of text processing. A rough rule of thumb is that `one token is approximately three-fourths of a word`. For instance, 75 words would equate to roughly 100 tokens. This is important for understanding processing limits and costs.

**Q15: Can you explain "zero-shot," "one-shot," and "few-shot" learning? (41:23)**

**A15:** These are techniques for machine learning models to make predictions for new (unseen) classes with limited labeled data:

- **Zero-shot learning:** The model classifies a new class without _any_ prior labeled examples for that specific class. It relies on generalized knowledge.
- **One-shot learning:** The model learns to classify a new class from just _one_ labeled example.
- **Few-shot learning:** The model learns from a _small, limited number_ of labeled examples (more than one) per new class.

**Q16: What are word "embeddings" and "cosine similarity" used for? (45:51)**

**A16:**

- `Embeddings`: These convert words or text into numerical vectors in a multi-dimensional space. This allows computers to process semantic relationships between words.
- `Cosine similarity`: This is a mathematical metric used to measure the similarity between two word vectors. Words with similar meanings or contexts will have higher cosine similarity (be "closer" in the multi-dimensional space). For example, "Apple" (the company) might have higher cosine similarity with "Samsung" than with "banana" if the model's training data emphasizes the tech context.
- Word vectors typically range from 50 to 300 dimensions, representing unique features.

**Q17: What is "one-hot encoding," and how does it affect column names? (47:20)**

**A17:** One-hot encoding converts categorical variables (like "Blue," "Red," "Grey") into a numerical format that machine learning models can process. For each unique category, a new column is created. If a data point belongs to that category, its corresponding new column gets a `1`, and others get `0`.

- **Column Names:** When applying one-hot encoding (e.g., using Pandas), the new column names follow a convention: `original_column_name_category_value`. For example, a "Color" column with values "Blue," "Red," "Grey" would become `Color_Blue`, `Color_Red`, and `Color_Grey`. This naming convention is important to remember.

**Q18: What are `GeoPandas`, `Folium`, and `KML/KMZ` files used for in geographical analysis? (51:50, 52:43)**

**A18:**

- `GeoPandas` and `Folium` (along with `Leaflet`) are Python libraries used for geospatial analysis and visualization.
- `KML` (Keyhole Markup Language) and `KMZ` (compressed KML) are file formats specifically for geographical data, often used with tools like Google Earth.
- These tools allow you to plot geographical data (e.g., health indicators on a map) and perform spatial analysis.

**Q19: How do I calculate the distance between two cities based on latitude and longitude? (54:16)**

**A19:** You can calculate the distance between two geographical points using the `GeoPy.distance.distance` function.

**Q20: Can I get information about a place (like its type or address) if I input latitude and longitude? (55:00)**

**A20:** Yes, if you input latitude and longitude into a geocoder (like Nominatim via `geopy.geocoders`), it can provide information about the place, such as its address, type (e.g., school, college, tourist spot), and other geographical details.

**Q21: What are "from" and "to" in the context of K-means clustering and network analysis? (53:19)**

**A21:** In K-means clustering and network analysis, "from" and "to" typically refer to directional connections or relationships within a network. For example, if you have a dataset showing interactions, "from" indicates the origin point and "to" indicates the destination point. This helps define how elements move or relate within a complex system, often used in libraries like `networkx` to represent graphs.

**Q22: Are there errors in GA6, Question 2 and 3? (41:07)**

**A22:** Yes, there might be a problem with the generated answer key for GA6, Questions 2 and 3. The team is aware of discrepancies and is working to verify them with the instructor. It's highly likely that students will be awarded marks for those specific questions.

**Q23: How can I efficiently calculate distances or perform operations on Pandas DataFrame columns? (41:52)**

**A23:** To efficiently perform calculations or operations on Pandas DataFrame columns, especially for speed-critical tasks, you should `vectorize` your data. This involves converting the relevant DataFrame columns into NumPy arrays using `np.array(df['column_name'])`. NumPy arrays are highly optimized for mathematical operations, utilize multiple CPU cores, and are significantly faster than traditional Python `for` loops. For example, converting distance calculations to NumPy arrays can reduce processing time from minutes to seconds.

**Q24: Will there be graded assignments for Weeks 6, 7, and 8, and do all weeks have equal weightage in the end-term? (35:30, 35:56)**

**A24:** If graded assignments (GAs) haven't been released for Weeks 7 and 8 by now, there won't be any more. Week 6 does have a GA. Regarding weightage, all weeks are considered to have "very much equal weightage," but the instructor cannot guarantee precise allocations as that's up to the professor.

**Q25: Are there alternative tools to Pandas for viewing CSV files in an Excel-like format? (109:49)**

**A25:** While you can view files using Pandas, there are no direct, widely recognized Pandas alternatives that replicate the full Excel-like interactive viewing experience within the context of data analysis tools. However, for visual display, some integrated development environments (IDEs) might offer enhanced data table views.

**Q26: Are there other tools similar to Pandas for data manipulation? (109:49)**

**A26:** The instructor states they are not aware of other direct Pandas alternatives for similar robust data manipulation functionalities within the Python ecosystem.

**Q27: Where can I find the recorded sessions for the TDS tutorial? (110:18)**

**A27:** You can access the recorded sessions on the YouTube playlist. Note that some sessions with very minimal content (like short doubt sessions) might not be uploaded to avoid wasting your time. All important sessions will be available. For example, this current session will be uploaded after processing.
