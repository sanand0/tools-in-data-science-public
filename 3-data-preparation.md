# Data preparation

[![Data preparation](https://i.ytimg.com/vi_webp/dF3zchJJKqk/sddefault.webp)](https://youtu.be/dF3zchJJKqk)

Data preparation is crucial because raw data is rarely perfect.

It often contains errors, inconsistencies, or missing values. For example, marks data may have 'NA' or 'absent' for non-attendees, which you need to handle.

This section teaches you how to clean up data, convert it to different formats, aggregate it if required, and get a feel for the data before you analyze.

Here are links used in the video:

- [Presentation used in the video](https://docs.google.com/presentation/d/1Gb0QnPUN1YOwM_O5EqDdXUdL-5Azp1Tf/view)
- [Scraping assembly elections - Notebook](https://colab.research.google.com/drive/1SP8yVxzmofQO48-yXF3rujqWk2iM0KSl)
- [Assembly election results (CSV)](https://github.com/datameet/india-election-data/blob/master/assembly-elections/assembly.csv)
- [`pdftotext` software](https://www.xpdfreader.com/pdftotext-man.html)
- [OpenRefine software](https://openrefine.org)
- [The most persistent party](https://gramener.com/election/parliament#story.ddp)
- [TN assembly election cartogram](https://gramener.com/election/cartogram?ST_NAME=Tamil%20Nadu)

## Clean up data in Excel

[![Clean up data in Excel](https://i.ytimg.com/vi_webp/7du7xkqeu4s/sddefault.webp)](https://youtu.be/7du7xkqeu4s)

You'll learn basic but essential data cleaning techniques in Excel, covering:

- **Find and Replace**: Use Ctrl+H to replace or remove specific terms (e.g., removing "[more]" from country names).
- **Changing Data Formats**: Convert columns from general to numerical format.
- **Removing Extra Spaces**: Use the TRIM function to clean up unnecessary spaces in text.
- **Identifying and Removing Blank Cells**: Highlight and delete entire rows with blank cells using the "Go To Special" function.
- **Removing Duplicates**: Use the "Remove Duplicates" feature to eliminate duplicate entries, demonstrated with country names.

Here are links used in the video:

- [List of Largest Cities Excel file](https://docs.google.com/spreadsheets/d/1jl8tHGoxmIba4J78aJVfT9jtZv7lfCbV/view)

## Data transformation in Excel

[![Data transformation in Excel](https://i.ytimg.com/vi_webp/gR2IY5Naja0/sddefault.webp)](https://youtu.be/gR2IY5Naja0)

You'll learn data transformation techniques in Excel, covering:

- **Calculating Ratios**: Compute metro area to city area and metro population to city population ratios.
- **Using Pivot Tables**: Create pivot tables to aggregate data and identify outliers.
- **Filtering Data**: Apply filters in pivot tables to analyze specific subsets of data.
- **Counting Data Occurrences**: Use pivot tables to count the frequency of specific entries.
- **Creating Charts**: Generate charts from pivot table data to visualize distributions and outliers.

Here are links used in the video:

- [List of Largest Cities Excel file](https://docs.google.com/spreadsheets/d/1jl8tHGoxmIba4J78aJVfT9jtZv7lfCbV/view)

## Convert text-to-columns in Excel

[![Convert text-to-columns in Excel](https://i.ytimg.com/vi_webp/fQeADnqiOAg/sddefault.webp)](https://youtu.be/fQeADnqiOAg)

You'll learn how to transform a single-column data set into multiple, organized columns based on specific delimiters using the "Text to Columns" feature.

Here are links used in the video:

- [US Senate Legislation - Votes](https://www.senate.gov/legislative/votes_new.htm)

## Data aggregation in Excel

[![Data aggregation in Excel](https://i.ytimg.com/vi_webp/NkpT0dDU8Y4/sddefault.webp)](https://youtu.be/NkpT0dDU8Y4)

You'll learn data aggregation and visualization techniques in Excel, covering:

- **Data Cleanup**: Remove empty columns and rows with missing values.
- **Creating Excel Tables**: Convert raw data into tables for easier manipulation and formula application.
- **Date Manipulation**: Extract week, month, and year from date columns using Excel functions (WEEKNUM, TEXT).
- **Color Scales**: Apply color scales to visualize clusters and trends in data over time.
- **Pivot Tables**: Create pivot tables to aggregate data by location and date, summarizing values weekly and monthly.
- **Sparklines**: Use sparklines to visualize trends within pivot tables, making data patterns more apparent.
- **Data Bars**: Implement data bars for graphical illustrations of numerical columns, showing trends and waves.

Here are links used in the video:

- [COVID-19 data Excel file - raw data](https://docs.google.com/spreadsheets/d/14HLgSmME95q--6lcBv9pUstqHL183wTd/view)

## Data preparation in the shell

[![Data preparation in the shell](https://i.ytimg.com/vi_webp/XEdy4WK70vU/sddefault.webp)](https://youtu.be/XEdy4WK70vU)

You'll learn how to use UNIX tools to process and clean data, covering:

- `curl` (or `wget`) to fetch data from websites.
- `gzip` (or `xz`) to compress and decompress files.
- `wc` to count lines, words, and characters in text.
- `head` and `tail` to get the start and end of files.
- `cut` to extract specific columns from text.
- `uniq` to de-duplicate lines.
- `sort` to sort lines.
- `grep` to filter lines containing specific text.
- `sed` to search and replace text.
- `awk` for more complex text processing.

Here are the links used in the video:

- [Data preparation in the shell - Notebook](https://colab.research.google.com/drive/1KSFkQDK0v__XWaAaHKeQuIAwYV0dkTe8)
- [Data Science at the Command Line](https://jeroenjanssens.com/dsatcl/)

## Data preparation in the editor

[![Data preparation in the editor](https://i.ytimg.com/vi_webp/99lYu43L9uM/sddefault.webp)](https://youtu.be/99lYu43L9uM)

You'll learn how to use a text editor [Visual Studio Code](https://code.visualstudio.com/) to process and clean data, covering:

- **Format** JSON files
- **Find all** and multiple cursors to extract specific fields
- **Sort** lines
- **Delete duplicate** lines
- **Replace** text with multiple cursors

Here are the links used in the video:

- [City-wise product sales JSON](https://drive.google.com/file/d/1VEnKChf4i04iKsQfw0MwoJlfkOBGQ65B/view?usp=drive_link)

## Cleaning data with OpenRefine

[![Cleaning data with OpenRefine](https://i.ytimg.com/vi_webp/zxEtfHseE84/sddefault.webp)](https://youtu.be/zxEtfHseE84)

This session covers the use of OpenRefine for data cleaning, focusing on resolving entity discrepancies:

- **Data Upload and Project Creation**: Import data into OpenRefine and create a new project for analysis.
- **Faceting Data**: Use text facets to group similar entries and identify frequency of address crumbs.
- **Clustering Methodology**: Apply clustering algorithms to merge similar entries with minor differences, such as punctuation.
- **Manual and Automated Clustering**: Learn to merge clusters manually or in one go, trusting the system's clustering accuracy.
- **Entity Resolution**: Clean and save the data by resolving multiple versions of the same entity using Open Refine.

Here are links used in the video:

- [OpenRefine software](https://openrefine.org)
- [Dataset for OpenRefine](https://drive.google.com/file/d/1ccu0Xxk8UJUa2Dz4lihmvzhLjvPy42Ai/view)

## Profile data with Python

[![Discover the data profile with Python](https://i.ytimg.com/vi_webp/kFVxdBhLa_A/sddefault.webp)](https://youtu.be/kFVxdBhLa_A)

This session covers the use of the `pandas_profiling` library for generating comprehensive data reports in Python:

- **Library Installation and Import**: Learn how to install and import the pandas_profiling library.
- **Profile Report Generation**: Generate an HTML report with a single line of code using ProfileReport.
- **Descriptive Statistics**: View detailed descriptive statistics such as variance, standard deviation, and kurtosis.
- **Outlier Detection**: Identify and analyze outliers within the dataset.
- **Correlation Analysis**: Understand how variables are correlated with each other using visual representations.
- **Handling Missing Values**: Get insights on missing data and decide on imputation or removal strategies.
- **Initial Data Insights**: Use the report to gather early warnings and insights before starting the data cleaning and modeling process.

Here are links used in the video:

- [Jupyter Notebook](https://colab.research.google.com/drive/1hFo_zvBuKw_ugxRjX4XUSh65-hAvl7X0)
- [Pandas Profiling output](https://drive.google.com/file/d/1cqu52zgddCJqzbLd7xqDC2RXPNkufFlN/view)
- Learn about the [`pandas_profiling` package](https://github.com/ydataai/ydata-profiling). [Video](https://youtu.be/Ef169VELt5o)
- Learn about the [`google.colab` package](https://colab.research.google.com/notebooks/io.ipynb)

## Optional: Image transformation with pillow

[![Image transformation with Pillow](https://i.ytimg.com/vi_webp/6Qs3wObeWwc/sddefault.webp)](https://youtu.be/6Qs3wObeWwc)

- Learn about the [`pillow` package](https://pypi.org/project/pillow/). [Docs](https://pillow.readthedocs.io/en/stable/). [Video](https://youtu.be/dkp4wUhCwR4)

## Optional: Apache Airflow

1. [Overview of Apache Airflow](https://airflow.apache.org/docs/apache-airflow/stable/)
2. [Airflow Playlist](https://www.youtube.com/playlist?list=PL5_c35Deekdm6N1OBHdQm7JZECTdm7zl-)

## Reference and helpful content

- For those who don't know Excel, [Microsoft's Excel video training](https://support.microsoft.com/en-au/office/excel-video-training-9bc05390-e94c-46af-a5b3-d7c22f6990bb) is a good starting point.
- For those who don't know Python, this [Learn Python video](https://youtu.be/rfscVS0vtbw) and this [Python for Beginners](https://youtube.com/playlist?list=PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3&feature=shared) playlist is a good starting point.
