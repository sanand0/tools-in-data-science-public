# 2025-04-08 End Term Session 1 - TDS Jan 25

[![2025-04-08 End Term Session 1 - TDS Jan 25](https://i.ytimg.com/vi_webp/CXRnZBaR4BY/sddefault.webp)](https://youtu.be/CXRnZBaR4BY)

Duration: 7177.0Here's an FAQ summary of the live tutorial:

---

**Q1: How are bonus scores calculated for submissions, and when are they awarded for Project 2?**

**A1:** Bonus scores are calculated automatically based on specific metrics and weights defined for your submission. For Project 2, bonuses are typically awarded if the distribution of scores is not a normal distribution. If the scores follow a normal distribution, it suggests the project was inherently doable, and therefore, no additional bonus will be provided.

**Q2: How difficult are the End Term exams in TDS?**

**A2:** Historically, End Term exams in TDS have been relatively easy, and this term is not expected to be different. However, it's essential to approach it with a proper mindset. While the exam itself might not be overly difficult, preparing adequately will ensure you perform well.

**Q3: Why should I attend these live sessions for End Term preparation?**

**A3:** Attending these sessions is highly recommended. While the End Term might be easy, these sessions offer valuable pointers and tips that can significantly improve your performance. Historically, students who attend these sessions almost always do very well. Ignoring them could mean missing out on crucial insights.

**Q4: What kind of questions can I expect (theory vs. practical, syntax vs. application)?**

**A4:** The question pattern will be similar to previous terms. You can expect questions that test your practical application of concepts rather than just memorizing syntax. For example, instead of asking for specific code syntax, questions might focus on _how_ to add CORS to a FastAPI application or _how_ to select specific elements from a web page.

---

### **Key Topics for End Term (Module-wise):**

**Q5: Are VS Code and NPX important for the End Term?**

**A5:** VS Code is generally not considered important, and it's highly unlikely that you'll see questions about it. NPX (Node Package eXecuter) is also not critical; you only need to know it's a package manager used for installing libraries, for example, for data visualization.

**Q6: What should I know about file encoding for the End Term?**

**A6:** Understanding file encoding is important. If you're opening a file and don't specify its encoding, Python will often default to UTF-8. However, if the file uses a different encoding, you must explicitly provide it when opening the file to avoid errors. The `chardet` library is a useful tool to detect a file's encoding by reading it in bits. Expect a question related to this, as it's been in Graded Assignment 1.

**Q7: What's crucial to know about Browser Tools and CSS Selectors?**

**A7:** Browser tools, especially CSS selectors, are very likely to appear in the exam. Focus on:

- How to select specific elements from the Document Object Model (DOM) structure using CSS selectors (e.g., using `document.querySelector`, `querySelectorAll`, `getElementById`, `getElementsByClassName`). This applies to both XML and HTML.
- Understanding the difference between direct child selectors (e.g., `UL > LI`) and descendant selectors (e.g., `UL LI`).
- Attribute-based selecting (e.g., `a[title]`).
- Locating the DOM within browser developer tools (Elements tab).

**Q8: What aspects of JSON processing are important?**

**A8:** JSON processing is important. Key operations include:

- Converting a JSON object to a string (`json.dumps`).
- Loading a JSON string into a Python object (`json.loads`).
- Understanding that JSON is structurally similar to Python dictionaries, making it easy to access data elements.

**Q9: Which Terminal/Bash commands are most relevant for the End Term?**

**A9:** Focus on these commands:

- `grep`: Used for searching patterns within files. This is considered more important than `sed`.
- `curl`: Used for sending requests to URLs and downloading files.

**Q10: What should I focus on regarding Spreadsheets (Excel/Google Sheets)?**

**A10:** Focus on understanding the formulas used in spreadsheets. You can expect questions related to formula usage.

**Q11: What database operations are important?**

**A11:** For databases, the key areas are:

- How to query and select specific data from tables.
- Grouping data (e.g., using `GROUP BY`).
- Merging data from different tables (various types of `JOIN` operations like `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`).

**Q12: What Git commands should I know for the End Term?**

**A12:** You should be familiar with fundamental Git commands:

- `git add`
- `git commit`
- `git push`
- `git pull`
- `git branch` (listing branches, switching branches)

**Q13: Is image compression important, or other image handling topics?**

**A13:** Topics like image compression (lossless vs. lossy) and basic image dimensions are covered but are not expected to be a major focus in the exam.

**Q14: What should I know about FastAPI and CORS?**

**A14:** For FastAPI, understand its basic use and how to handle Cross-Origin Resource Sharing (CORS). Specifically, know how to:

- Add CORS to a FastAPI application using `Access-Control-Allow-Origin`.
- Control allowed methods, headers, and credentials.

**Q15: What aspects of Large Language Models (LLMs) are key?**

**A15:** For LLMs, focus on:

- How to construct simple prompts for generating chat completions.
- Understanding the structure of a prompt (user prompt, system prompt).
- Calculating pricing based on token usage (input/output tokens).
- What embeddings are and how they are used for finding similarity between text data (e.g., using cosine similarity after embedding generation).

**Q16: What are the key functions in the `datetime` module?**

**A16:** The `datetime` module is important for handling dates and times. Key functions involve:

- Parsing dates (converting strings to `datetime` objects).
- Formatting dates (converting `datetime` objects to specific string formats, e.g., using `strftime`).

**Q17: What `Pandas` operations are important?**

**A17:** In Pandas, focus on:

- Filtering data (e.g., using `filter` or boolean indexing).
- Data transformation operations like `pivot`, `groupby`.

**Q18: What's important regarding web scraping (`BeautifulSoup`, `requests`)?**

**A18:** For web scraping:

- Understand how to use libraries like `requests` to send HTTP requests and retrieve web page content.
- Learn how to parse HTML/XML content using `BeautifulSoup`, particularly constructing selectors to extract specific data.

**Q19: What should I know about outlier detection, correlation, and handling missing values?**

**A19:** These concepts are important in data analysis:

- **Outlier detection:** Understanding what outliers are and basic methods to identify them.
- **Correlation analysis:** How to identify relationships between variables.
- **Handling missing values:** Common strategies for dealing with incomplete data.

**Q20: How is connecting to databases (`SQLAlchemy`) tested?**

**A20:** You'll need to know how to connect to a database. Specifically, understand:

- How to form a connection string (e.g., for MySQL).
- Using `SQLAlchemy` (e.g., `create_engine`) to establish a connection.
- How to query the database using Pandas (e.g., `pandas.read_sql`).

**Q21: What should I focus on for file formats (CSV, JSON, XML) and data transformation?**

**A21:** Understand different file formats and how to work with them:

- **Reading/Writing:** How to read and write data in CSV, JSON, and XML formats.
- **Comparison:** Understand the differences and appropriate uses of these formats.
- **Data Transformation:** Operations like pivoting, grouping, and merging data.

**Q22: What's relevant for map creation/visualization (`Folium`, `Geopy`)?**

**A22:** For map creation and visualization:

- **Geopy:** How to get latitude and longitude from an address.
- **Folium:** How to use this library to create interactive maps.
- **GPS data:** How to plot GPS data on maps.

**Q23: What Docker commands are important?**

**A23:** Know the essential Docker commands:

- `docker run`
- `docker build`
- `docker push`
- `docker pull`

**Q24: What are `Ffmpeg` and `yt-dlp` used for?**

**A24:** You should know the use case of these tools:

- `Ffmpeg`: Used for audio/video manipulation (e.g., extracting audio, video from URLs).
- `yt-dlp`: A command-line program to download videos from YouTube and other sites. Understand their basic function, not necessarily complex syntax.

**Q25: What is `PymuPDF` used for?**

**A25:** `PymuPDF` is a Python library used for working with PDF documents, including extracting data, text, and images.

**Q26: What are `Whisper` and `Google Gemini` used for?**

**A26:**

- `Whisper`: Used for speech-to-text transcription.
- `Google Gemini`: A large language model with multimodal capabilities.

**Q27: What is `SKlearn` and `NetworkX` used for?**

**A27:**

- `SKlearn` (Scikit-learn): A popular machine learning library used for various tasks like classification, regression, clustering, etc.
- `NetworkX`: A Python library for the creation, manipulation, and study of the structure, dynamics, and functions of complex networks.

---

**Q28: What's the best way to prepare for the End Term? Should I use Previous Year Questions (PYQs)?**

**A28:** Your preparation should focus on:

1. **Course Portal Content:** Thoroughly go through all the material available on the course portal.
2. **Previous Year Questions (PYQs):** It is highly recommended to study PYQs. While question patterns will be similar, new modules have been introduced, so PYQs up to January 2024 would be a good reference.
3. **Specific Topics:** As mentioned in previous answers, pay extra attention to browser tools (CSS selectors), JSON processing, database querying, Git commands, and `Pandas` filtering, among others.
4. **Practice:** Use tools like CSS Diner for interactive practice.

---

**Q29: What are the new modules introduced this term?**

**A29:** There are two new modules introduced this term, but the core question patterns for other topics remain largely similar.

**Q30: Can we get notes/agendas and relevant links for each live session?**

**A30:** Yes, this has been a common request. The course team is planning to automate the process of providing session notes, agendas, and relevant links. This will include automatically fetching transcriptions and creating FAQs with links to discussed resources on the TDS portal. This is planned for implementation from the next term.

**Q31: Can solutions for Graded Assignments (GAs) be released after the End Term?**

**A31:** This is a good suggestion that will be discussed further within the course team. Providing GA solutions after the End Term could help students understand where they went wrong, especially if they need to retake the course.

---

**Q32: Is there anything else you'd like to add, or any final advice?**

**A32:** Yes, as you embark on your End Term, remember:

- **Networking tools:** Pay attention to tools like `ngrok` for tunneling local servers to the internet.
- **Data Sourcing:** Understanding how to use API calls (e.g., with `requests` module) to fetch data is crucial.
- **Data Preprocessing:** Libraries like `Pandas` are vital for data cleaning, transformation, and analysis. Focus on filtering, handling missing values, and identifying outliers.
- **Visualization:** Tools for creating charts and maps (like `Folium`) are important for presenting insights.
- **Continuous Improvement:** The course team is actively working to improve the learning experience based on your feedback, including better session resources.

Thank you for your active participation and valuable feedback throughout this term. It has been a fun journey, and we wish you the best for your End Term!Here's an FAQ summary of the live tutorial:

---

**Q1: How are bonus scores calculated for submissions, and when are they awarded for Project 2?**

**A1:** Bonus scores are calculated automatically based on specific metrics and weights defined for your submission. For Project 2, bonuses are typically awarded if the distribution of scores is not a normal distribution. If the scores follow a normal distribution, it suggests the project was inherently doable, and therefore, no additional bonus will be provided.

**Q2: How difficult are the End Term exams in TDS?**

**A2:** Historically, End Term exams in TDS have been relatively easy, and this term is not expected to be different. However, it's essential to approach it with a proper mindset. While the exam itself might not be overly difficult, preparing adequately will ensure you perform well.

**Q3: Why should I attend these live sessions for End Term preparation?**

**A3:** Attending these sessions is highly recommended. While the End Term might be easy, these sessions offer valuable pointers and tips that can significantly improve your performance. Historically, students who attend these sessions almost always do very well. Ignoring them could mean missing out on crucial insights.

**Q4: What kind of questions can I expect (theory vs. practical, syntax vs. application)?**

**A4:** The question pattern will be similar to previous terms. You can expect questions that test your practical application of concepts rather than just memorizing syntax. For example, instead of asking for specific code syntax, questions might focus on _how_ to add CORS to a FastAPI application or _how_ to select specific elements from a web page.

---

### **Key Topics for End Term (Module-wise):**

**Q5: Are VS Code and NPX important for the End Term?**

**A5:** VS Code is generally not considered important, and it's highly unlikely that you'll see questions about it. NPX (Node Package eXecuter) is also not critical; you only need to know it's a package manager used for installing libraries, for example, for data visualization.

**Q6: What should I know about file encoding for the End Term?**

**A6:** Understanding file encoding is important. If you're opening a file and don't specify its encoding, Python will often default to UTF-8. However, if the file uses a different encoding, you must explicitly provide it when opening the file to avoid errors. The `chardet` library is a useful tool to detect a file's encoding by reading it in bits. Expect a question related to this, as it's been in Graded Assignment 1.

**Q7: What's crucial to know about Browser Tools and CSS Selectors?**

**A7:** Browser tools, especially CSS selectors, are very likely to appear in the exam. Focus on:

- How to select specific elements from the Document Object Model (DOM) structure using CSS selectors (e.g., using `document.querySelector`, `querySelectorAll`, `getElementById`, `getElementsByClassName`). This applies to both XML and HTML.
- Understanding the difference between direct child selectors (e.g., `UL > LI`) and descendant selectors (e.g., `UL LI`).
- Attribute-based selecting (e.g., `a[title]`).
- Locating the DOM within browser developer tools (Elements tab).

**Q8: What aspects of JSON processing are important?**

**A8:** JSON processing is important. Key operations include:

- Converting a JSON object to a string (`json.dumps`).
- Loading a JSON string into a Python object (`json.loads`).
- Understanding that JSON is structurally similar to Python dictionaries, making it easy to access data elements.

**Q9: Which Terminal/Bash commands are most relevant for the End Term?**

**A9:** Focus on these commands:

- `grep`: Used for searching patterns within files. This is considered more important than `sed`.
- `curl`: Used for sending requests to URLs and downloading files.

**Q10: What should I focus on regarding Spreadsheets (Excel/Google Sheets)?**

**A10:** Focus on understanding the formulas used in spreadsheets. You can expect questions related to formula usage.

**Q11: What database operations are important?**

**A11:** For databases, the key areas are:

- How to query and select specific data from tables.
- Grouping data (e.g., using `GROUP BY`).
- Merging data from different tables (various types of `JOIN` operations like `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`).

**Q12: What Git commands should I know for the End Term?**

**A12:** You should be familiar with fundamental Git commands:

- `git add`
- `git commit`
- `git push`
- `git pull`
- `git branch` (listing branches, switching branches)

**Q13: Is image compression important, or other image handling topics?**

**A13:** Topics like image compression (lossless vs. lossy) and basic image dimensions are covered but are not expected to be a major focus in the exam.

**Q14: What should I know about FastAPI and CORS?**

**A14:** For FastAPI, understand its basic use and how to handle Cross-Origin Resource Sharing (CORS). Specifically, know how to:

- Add CORS to a FastAPI application using `Access-Control-Allow-Origin`.
- Control allowed methods, headers, and credentials.

**Q15: What aspects of Large Language Models (LLMs) are key?**

**A15:** For LLMs, focus on:

- How to construct simple prompts for generating chat completions.
- Understanding the structure of a prompt (user prompt, system prompt).
- Calculating pricing based on token usage (input/output tokens).
- What embeddings are and how they are used for finding similarity between text data (e.g., using cosine similarity after embedding generation).

**Q16: What are the key functions in the `datetime` module?**

**A16:** The `datetime` module is important for handling dates and times. Key functions involve:

- Parsing dates (converting strings to `datetime` objects).
- Formatting dates (converting `datetime` objects to specific string formats, e.g., using `strftime`).

**Q17: What `Pandas` operations are important?**

**A17:** In Pandas, focus on:

- Filtering data (e.g., using `filter` or boolean indexing).
- Data transformation operations like `pivot`, `groupby`.

**Q18: What's important regarding web scraping (`BeautifulSoup`, `requests`)?**

**A18:** For web scraping:

- Understand how to use libraries like `requests` to send HTTP requests and retrieve web page content.
- Learn how to parse HTML/XML content using `BeautifulSoup`, particularly constructing selectors to extract specific data.

**Q19: What should I know about outlier detection, correlation, and handling missing values?**

**A19:** These concepts are important in data analysis:

- **Outlier detection:** Understanding what outliers are and basic methods to identify them.
- **Correlation analysis:** How to identify relationships between variables.
- **Handling missing values:** Common strategies for dealing with incomplete data.

**Q20: How is connecting to databases (`SQLAlchemy`) tested?**

**A20:** You'll need to know how to connect to a database. Specifically, understand:

- How to form a connection string (e.g., for MySQL).
- Using `SQLAlchemy` (e.g., `create_engine`) to establish a connection.
- How to query the database using Pandas (e.g., `pandas.read_sql`).

**Q21: What should I focus on for file formats (CSV, JSON, XML) and data transformation?**

**A21:** Understand different file formats and how to work with them:

- **Reading/Writing:** How to read and write data in CSV, JSON, and XML formats.
- **Comparison:** Understand the differences and appropriate uses of these formats.
- **Data Transformation:** Operations like pivoting, grouping, and merging data.

**Q22: What's relevant for map creation/visualization (`Folium`, `Geopy`)?**

**A22:** For map creation and visualization:

- **Geopy:** How to get latitude and longitude from an address.
- **Folium:** How to use this library to create interactive maps.
- **GPS data:** How to plot GPS data on maps.

**Q23: What Docker commands are important?**

**A23:** Know the essential Docker commands:

- `docker run`
- `docker build`
- `docker push`
- `docker pull`

**Q24: What are `Ffmpeg` and `yt-dlp` used for?**

**A24:** You should know the use case of these tools:

- `Ffmpeg`: Used for audio/video manipulation (e.g., extracting audio, video from URLs).
- `yt-dlp`: A command-line program to download videos from YouTube and other sites. Understand their basic function, not necessarily complex syntax.

**Q25: What is `PymuPDF` used for?**

**A25:** `PymuPDF` is a Python library used for working with PDF documents, including extracting data, text, and images.

**Q26: What are `Whisper` and `Google Gemini` used for?**

**A26:**

- `Whisper`: Used for speech-to-text transcription.
- `Google Gemini`: A large language model with multimodal capabilities.

**Q27: What is `SKlearn` and `NetworkX` used for?**

**A27:**

- `SKlearn` (Scikit-learn): A popular machine learning library used for various tasks like classification, regression, clustering, etc.
- `NetworkX`: A Python library for the creation, manipulation, and study of the structure, dynamics, and functions of complex networks.

---

**Q28: What's the best way to prepare for the End Term? Should I use Previous Year Questions (PYQs)?**

**A28:** Your preparation should focus on:

1. **Course Portal Content:** Thoroughly go through all the material available on the course portal.
2. **Previous Year Questions (PYQs):** It is highly recommended to study PYQs. While question patterns will be similar, new modules have been introduced, so PYQs up to January 2024 would be a good reference.
3. **Specific Topics:** As mentioned in previous answers, pay extra attention to browser tools (CSS selectors), JSON processing, database querying, Git commands, and `Pandas` filtering, among others.
4. **Practice:** Use tools like CSS Diner for interactive practice.

---

**Q29: What are the new modules introduced this term?**

**A29:** There are two new modules introduced this term, but the core question patterns for other topics remain largely similar.

**Q30: Can we get notes/agendas and relevant links for each live session?**

**A30:** Yes, this has been a common request. The course team is planning to automate the process of providing session notes, agendas, and relevant links. This will include automatically fetching transcriptions and creating FAQs with links to discussed resources on the TDS portal. This is planned for implementation from the next term.

**Q31: Can solutions for Graded Assignments (GAs) be released after the End Term?**

**A31:** This is a good suggestion that will be discussed further within the course team. Providing GA solutions after the End Term could help students understand where they went wrong, especially if they need to retake the course.

---

**Q32: Is there anything else you'd like to add, or any final advice?**

**A32:** Yes, as you embark on your End Term, remember:

- **Networking tools:** Pay attention to tools like `ngrok` for tunneling local servers to the internet.
- **Data Sourcing:** Understanding how to use API calls (e.g., with `requests` module) to fetch data is crucial.
- **Data Preprocessing:** Libraries like `Pandas` are vital for data cleaning, transformation, and analysis. Focus on filtering, handling missing values, and identifying outliers.
- **Visualization:** Tools for creating charts and maps (like `Folium`) are important for presenting insights.
- **Continuous Improvement:** The course team is actively working to improve the learning experience based on your feedback, including better session resources.

Thank you for your active participation and valuable feedback throughout this term. It has been a fun journey, and we wish you the best for your End Term!
