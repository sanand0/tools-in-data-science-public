# Data analysis

[<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-broadcast-pin" viewBox="0 0 16 16">
<path d="M3.05 3.05a7 7 0 0 0 0 9.9.5.5 0 0 1-.707.707 8 8 0 0 1 0-11.314.5.5 0 0 1 .707.707m2.122 2.122a4 4 0 0 0 0 5.656.5.5 0 1 1-.708.708 5 5 0 0 1 0-7.072.5.5 0 0 1 .708.708m5.656-.708a.5.5 0 0 1 .708 0 5 5 0 0 1 0 7.072.5.5 0 1 1-.708-.708 4 4 0 0 0 0-5.656.5.5 0 0 1 0-.708m2.122-2.12a.5.5 0 0 1 .707 0 8 8 0 0 1 0 11.313.5.5 0 0 1-.707-.707 7 7 0 0 0 0-9.9.5.5 0 0 1 0-.707zM6 8a2 2 0 1 1 2.5 1.937V15.5a.5.5 0 0 1-1 0V9.937A2 2 0 0 1 6 8"/>
</svg> <span style="font-size: 24px; margin: 0 6px; vertical-align: bottom">Data Analysis: Introduction Podcast</span>](https://drive.google.com/file/d/1isjtxFa43CLIFlLpo8mwwQfBog9VlXYl/view) by [NotebookLM](https://notebooklm.google.com/)

Once you've prepared the data, your next task is to analyze it to get insights that are not immediately obvious.

In this module, you'll learn how to:

- Calculate correlations, regressions, forecasts, and outliers using **spreadsheets**
- Aggregate and pivot data using **Python** and **databases**.

**NOTE**: This module earlier covered machine learning techniques such as classification and clustering.
These are removed in this version.

[![Data Analysis - Introduction](https://i.ytimg.com/vi_webp/CRSljunxjnk/sddefault.webp)](https://youtu.be/CRSljunxjnk)

## Correlation with Excel

[![Correlation with Excel](https://i.ytimg.com/vi_webp/lXHCyhO7DmY/sddefault.webp?)](https://youtu.be/lXHCyhO7DmY)

You'll learn to calculate and interpret correlations using Excel, covering:

- **Enabling the Data Analysis Tool Pack**: Steps to enable the Excel data analysis tool pack.
- **Correlation Analysis**: Understanding statistical association between variables.
- **Creating a Correlation Matrix**: Steps to generate and interpret a correlation matrix.
- **Scatterplots and Trendlines**: Plotting data and adding trend lines to visualize correlations.
- **Analyzing Results**: Comparing correlation coefficients and understanding their implications.
- **Insights and Further Analysis**: Interpreting scatterplots and planning further analysis for deeper insights.

Here are the links used in the video:

- [Understand correlation](https://www.khanacademy.org/math/ap-statistics/bivariate-data-ap/correlation-coefficient-r/v/correlation-coefficient-intuition-examples)
- [COVID-19 vaccinations data explorer - Website](https://ourworldindata.org/covid-vaccinations?country=OWID_WRL)
- [COVID-19 vaccinations - Correlations Excel file](https://docs.google.com/spreadsheets/d/1_vQF2i5ubKmHQMBqoTwsu6AlevWsQtTD/view#gid=790744269)

## Regression with Excel

[![Regression with Excel](https://i.ytimg.com/vi_webp/AERQBMIHwXA/sddefault.webp)](https://youtu.be/AERQBMIHwXA)

You'll learn to perform regression analysis using Excel, covering:

- **Data Preparation**: Understanding the cleaned dataset and necessary columns for analysis.
- **Enabling the Tool**: How to enable the Data Analysis Tool Pack in Excel.
- **Types of Regression**: Differences between simple and multiple linear regression.
- **Setting Up Regression**: Steps to input dependent (new deaths) and independent variables (new cases, new tests, new vaccinations, stringency index) for the analysis.
- **Interpreting Output**: Reading the regression output, focusing on adjusted R-squared, significance value (F-test), and P-values.
- **Coefficient Interpretation**: Understanding the impact of each independent variable on the dependent variable, including scaling factors (per 1000 units).
- **Model Evaluation**: Evaluating the model based on significance values and understanding the implications of unexpected results (e.g., stringency index).
- **Further Analysis**: Recognizing the need for additional analysis when encountering unexpected or inconclusive results.

Here are the links used in the video:

- [Understand regression](https://www.khanacademy.org/math/ap-statistics/bivariate-data-ap/least-squares-regression/v/calculating-the-equation-of-a-regression-line)
- [COVID-19 vaccinations - Regression Excel file](https://docs.google.com/spreadsheets/d/1YZLb9ozhmc-8KQ7EaaTgs57QT6dHju5u/view#gid=242862119)
- [COVID-19 vaccinations - Regression Model 2 Excel file](https://docs.google.com/spreadsheets/d/1KAolaOQC-P_6gXaw3jgUc7GWKAHfOrsi/view#gid=824457557)

## Forecasting with Excel

[![Forecasting with Excel](https://i.ytimg.com/vi_webp/QrTimmxwZw4/sddefault.webp)](https://youtu.be/QrTimmxwZw4)

Here are links used in the video:

- [FORECAST reference](https://support.microsoft.com/en-us/office/forecast-and-forecast-linear-functions-50ca49c9-7b40-4892-94e4-7ad38bbeda99)
- [FORECAST.ETS reference](https://support.microsoft.com/en-us/office/forecast-ets-function-15389b8b-677e-4fbd-bd95-21d464333f41)
- [Height-weight dataset](https://docs.google.com/spreadsheets/d/1iMFVPh8q9KgnfLwBeBMmX1GaFabP02FK/view) from [Kaggle](https://www.kaggle.com/datasets/burnoutminer/heights-and-weights-dataset)
- [Traffic dataset](https://docs.google.com/spreadsheets/d/1w2R0fHdLG5ZGW-papaK7wzWq_-WDArKC/view) from [Kaggle](https://www.kaggle.com/datasets/fedesoriano/traffic-prediction-dataset)

## Outlier detection with Excel

[![Outlier detection with Excel](https://i.ytimg.com/vi_webp/sUTJb0F9eBw/sddefault.webp)](https://youtu.be/sUTJb0F9eBw)

You'll learn how to identify and handle outliers in data using Excel, covering:

- **Understanding Outliers**: Definition of outliers and their impact on statistical analysis.
- **Calculating Quartiles**: Using Excel formulas to calculate Q1 (first quartile) and Q3 (third quartile).
- **Interquartile Range (IQR)**: Finding the IQR by subtracting Q1 from Q3.
- **Determining Bounds**: Calculating lower and upper bounds using 1.5 times the IQR.
- **Identifying Outliers**: Using Excel functions to determine if data points fall outside the calculated bounds.
- **Visualizing Data**: Creating box plots to visualize outliers and data distribution.
- **Handling Outliers**: Deciding whether to exclude or keep outliers based on their impact on analysis.

Here are the links used in the video:

- [Understand distributions and outliers](https://www.khanacademy.org/math/ap-statistics/quantitative-data-ap/xfb5d8e68:describing-distribution-quant/v/classifying-distributions)
- [COVID-19 vaccinations data - Excel](https://docs.google.com/spreadsheets/d/1_vQF2i5ubKmHQMBqoTwsu6AlevWsQtTD/view#gid=790744269)

## Data analysis with Python

[![Data Analysis with Python](https://i.ytimg.com/vi_webp/ZPfZH14FK90/sddefault.webp)](https://youtu.be/ZPfZH14FK90)

You'll learn practical data analysis techniques in Python using Pandas, covering:

- **Reading Parquet Files**: Utilize Pandas to read Parquet file formats for efficient data handling.
- **Dataframe Inspection**: Methods to preview and understand the structure of a dataset.
- **Pivot Tables**: Creating and interpreting pivot tables to summarize data.
- **Percentage Calculations**: Normalize pivot table values to percentages for better insights.
- **Correlation Analysis**: Calculate and interpret correlation between variables, including significance testing.
- **Statistical Significance**: Use statistical tests to determine the significance of observed correlations.
- **Datetime Handling**: Extract and manipulate date and time information from datetime columns.
- **Data Visualization**: Generate and customize heat maps to visualize data patterns effectively.
- **Leveraging AI**: Use ChatGPT to generate and refine analytical code, enhancing productivity and accuracy.

Here are the links used in the video:

- [Data analysis with Python - Notebook](https://colab.research.google.com/drive/1wEUEeF_e2SSmS9uf2-3fZJQ2kEFRnxah)
- [Card transactions dataset (Parquet)](https://drive.google.com/file/u/3/d/1XGvuFjoTwlybkw0cc9u34horMF9vMhrB/view)
- [10 minutes to Pandas](https://pandas.pydata.org/pandas-docs/stable/user_guide/10min.html)
- [Python Pandas tutorials](https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS)

## Data analysis with databases

[![Data Analysis with Databases](https://i.ytimg.com/vi_webp/Xn3QkYrThbI/sddefault.webp)](https://youtu.be/Xn3QkYrThbI)

You'll learn how to perform data analysis using SQL (via Python), covering:

- **Database Connection**: How to connect to a MySQL database using SQLAlchemy and Pandas.
- **SQL Queries**: Execute SQL queries directly from a Python environment to retrieve and analyze data.
- **Counting Rows**: Use SQL to count the number of rows in a table.
- **User Activity Analysis**: Query and identify top users by post count.
- **Post Concentration**: Determine if a small percentage of users contribute the majority of posts using SQL aggregation.
- **Correlation Calculation**: Calculate the Pearson correlation coefficient between user attributes such as age and reputation.
- **Regression Analysis**: Compute the regression slope to understand the relationship between views and reputation.
- **Handling Large Data**: Perform calculations on large datasets by fetching aggregated values from the database rather than entire datasets.
- **Statistical Analysis in SQL**: Use SQL as a tool for statistical analysis, demonstrating its power beyond simple data retrieval.
- **Leveraging AI**: Use ChatGPT to generate SQL queries and Python code, enhancing productivity and accuracy.

Here are the links used in the video:

- [Data analysis with databases - Notebook](https://colab.research.google.com/drive/1j_5AsWdf0SwVHVgfbEAcg7vYguKUN41o)
- [SQLZoo](https://www.sqlzoo.net/wiki/SQL_Tutorial) has simple interactive tutorials to learn SQL
- [Stats database](https://relational-data.org/dataset/Stats) that has an anonymized dump of [stats.stackexchange.com](https://stats.stackexchange.com/)
- [Pandas `read_sql`](https://pandas.pydata.org/docs/reference/api/pandas.read_sql.html)
- [SQLAlchemy docs](https://docs.sqlalchemy.org/)

## Optional: Data analysis with DuckDB

WIP


## Optional: Visualizing Machine Learning

[![**Visualizing Machine Learning**](https://i.ytimg.com/vi_webp/sORnCj52COw/sddefault.webp)](https://youtu.be/sORnCj52COw)

You'll learn about improving customer retention, understanding black box models, and using clustering for market segmentation:

- **Churn Reduction**: Use decision trees to identify customers likely to leave.
- **Cost Efficiency**: Compare customer acquisition vs. retention costs.
- **Model Improvement**: Apply SVMs and neural networks for better accuracy.
- **Project Challenges**: Understand issues with black box models in implementation.
- **K-Means Clustering**: Segment markets using demographic data.
- **Data Visualization**: Interpret clustering results using maps and charts.
- **Correlation Analysis**: Identify relationships between currency exchange rates.
- **Tool Proficiency**: Utilize Excel, Python, and JavaScript for analysis and communication.
- **Practical Application**: Tailor marketing strategies based on cluster characteristics.

Here are the links used in the video:

- [Visualizing-Forecast-Models.xlsx](https://docs.google.com/spreadsheets/d/1oJdwjOuZMfnWX3DKw47IuGPD7yUO8vgg/view) - the spreadsheet used in the video
