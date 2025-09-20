# ROE Session TDS 2024 11 16 19 52

[![ROE Session   TDS   2024 11 16 19 52](https://i.ytimg.com/vi_webp/TPh1srfrWDc/sddefault.webp)](https://youtu.be/TPh1srfrWDc)

Duration: 1h 13m

Here's an FAQ based on the live tutorial:

**Q1: Can you explain the code logic for processing PDF files?**

**A1:** The code loops through a folder, identifies files ending with `.pdf`, and then opens each PDF using the PDF Plumber library. It extracts the text or tables from each page.

**Q2: Are "Business ID", "Date", and "Score Type" considered headers in the data?**

**A2:** Yes, those are the headers in the data you're seeing.

**Q3: Can you show the file being processed so I can better understand the scraping?**

**A3:** (Instructor shared the file on screen) The file is structured with clear headers and tabular data.

**Q4: Since the file is well-structured, could I use a library like `tabula` for extraction?**

**A4:** Yes, you can. I was hoping you'd suggest a better way to handle it. You could use `page.extract_tables()` instead of `page.extract_text()` in the code.

**Q5: When looping through multiple files and pages, will the `text` variable accumulate data, or will it be overwritten with each iteration?**

**A5:** The `text` variable will be overwritten in each iteration of the loop, meaning it will only hold the data from the last page processed. If you want to keep data from all pages, you'll need to append it to a list or save it into a data frame.

**Q6: What kinds of code/scripts should I prepare beforehand for the ROE, beyond just basic data scraping?**

**A6:** You should prepare code for various data science tasks, including:

- **Data Validation:** Code to compare extracted data and ensure its correctness.
- **Data Cleaning:** Scripts to remove unwanted characters (like `\n`), drop irrelevant rows/columns, and handle missing values.
- **Data Transformation:** Code for operations like correlation, regression, and outlier detection.
- **Specific Topics:** Have code ready for concepts taught in later weeks, such as chat completions and embeddings (from Week 5), or geographical calculations like Haversine distance (from Week 6).

**Q7: Will previous graded assessment solution notebooks (Colab files for Week 1-5) be provided for practice?**

**A7:** No, solutions for TDS graded assessments are not provided, unlike some other subjects. It's recommended to create your own notebooks for these solutions, as it helps with understanding and quick reference.

**Q8: Do ROE questions have different weightage, or is it uniform?**

**A8:** Different questions might have different weightage depending on their difficulty level, so the marks assigned will vary for each question. It might not be uniform, similar to how OPE works.

**Q9: I tried to extract data from a complex PDF using my PDF Plumber code, but it's not working correctly. What should I do?**

**A9:** (Instructor demonstrated using `extract_tables`) For PDFs where rows are split across pages or data is very complex, standard `extract_tables()` might miss or misinterpret data. You might get "new line" characters or incomplete rows. You'll need to:

1.  **Check page by page:** The first page might have headers, but subsequent pages might not. Adjust your code to handle headers conditionally when looping through pages.
2.  **Clean Data:** Remove unwanted characters like `\n` that appear in the extracted text.
3.  **Use `tabula-py`:** For split rows, `tabula-py` with `stream=True` and `multiple_tables=True` can often concatenate data across pages, but observe carefully for misinterpretations.
4.  **Manual Intervention:** For extremely complex PDFs, perfect extraction with libraries might be impossible, and some manual cleanup or data population could be necessary.
5.  **Consider other libraries:** `Camelot` is another option for table extraction, but some complex PDFs might still cause it to fail.

**Q10: Are previous year's ROE questions significantly easier than this year's, and can the data files (e.g., XML, PDF) vary in type and number?**

**A10:** I cannot comment on the difficulty level, as it depends on your preparation for topics from Week 1 to Week 6. Yes, the data structure can differ (e.g., JSON, CSV, website scraping) and you might encounter more than two types of files (not just XML and PDF) for a single question.

**Q11: Will the ROE be non-proctored?**

**A11:** Yes, the ROE is non-proctored.

**Q12: Is there a specific distance calculation formula I should remember for Week 6 topics in ROE?**

**A12:** It's more important to understand the _use cases_ for different distance metrics (like Euclidean, cosine, Manhattan, Haversine distance) rather than just memorizing formulas. You should know when to apply each one. For geographical distances, you'll use Haversine distance. Code for these calculations is often provided in the course material (e.g., Week 5 notebook), and modules like `haversine` can calculate it directly if you provide coordinates and desired units (km/miles).

**Q13: Is there a tool to automatically identify data loss from split rows in PDFs?**

**A13:** I'm not aware of a specific tool that automatically identifies data loss from split rows. When merging cells in Excel, data can be lost if not handled carefully (e.g., one cell's data overriding another). For Python, libraries like Pandas can concatenate, but for split rows in PDFs, it's often a manual task to ensure correct merging without data loss.

**Q14: For the W20 PDF where a row was split, `tabula` introduced "Unnamed: 0" columns. Could this be due to borders in the PDF?**

**A14:** Yes, `tabula` uses a grid-based approach, and borders in the PDF can cause it to misinterpret the structure and create extra unnamed columns. `stream=True` can sometimes help if the PDF has invisible lines.

**Q15: What kind of questions will be asked in ROE tomorrow (objective/subjective)?**

**A15:** The questions will be of the fill-in-the-blank type, similar to OPE.

**Q16: Will data files for ROE be available before the exam, perhaps as password-protected zip files?**

**A16:** For this term, there are no password-protected files. Data files will be available for download when the ROE starts (i.e., when the clock hits 1 PM tomorrow).

**Q17: From which weeks will the content for tomorrow's ROE be drawn? Approximately how many questions?**

**A17:** The content will cover Week 1 to Week 6. The exact number of questions isn't known, but it will be less than 20.

**Q18: For data cleaning, will the ROE instructions specify what and how to clean, or are general checks expected?**

**A18:** General checks for data quality are expected. You'll need to identify unique values, potential rows to drop, and other data quality issues, as these can affect your answers. Instructions won't specify cleaning steps, but it's always recommended to ensure your data is clean.

**Q19: What types of data files can I expect in the ROE, besides HTML, XML, and Parquet?**

**A19:** You can also expect PDF files, JSON files, and CSV files. You might even need to scrape data directly from a website. For some questions, you may need to aggregate data from multiple file types (e.g., HTML and CSV).

**Q20: What are "data sourcing" techniques, and how are they relevant to ROE?**

**A20:** Data sourcing refers to methods for obtaining data. In ROE, this could involve HTML scraping, PDF scraping, and other techniques. You might use Python commands like `sort` and `unique` or specific Python libraries like `PDF Plumber` for extraction and initial processing.

**Q21: Are there specific tools for geographical plotting in Week 6?**

**A21:** Week 6 covers geographical plotting using `folium`. You can get coordinates for locations using the `nominatim` tool, then use `folium` to create interactive maps and visualize data with markers. `folium` is primarily for visualization, not core ROE calculations.
