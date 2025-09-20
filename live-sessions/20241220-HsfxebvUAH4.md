# Mock QP - TA Session - TDS 2024 12 19 18 51

[![Mock QP - TA Session - TDS   2024 12 19 18 51](https://i.ytimg.com/vi_webp/HsfxebvUAH4/sddefault.webp)](https://youtu.be/HsfxebvUAH4)

Duration: 2h 25m

Here's an FAQ summary of the live tutorial:

**Q1: What is the purpose of this mock session?**
A1: This session is designed to go through questions that are related to what you can expect in your end-term exam.

**Q2: Can you explain the `RIGHT` and `MID` functions in Excel?**
A2: Sure.

- The `RIGHT` function (`RIGHT(text, num_chars)`) extracts a specified number of characters (`num_chars`) from the right side of a text string (`text`). For example, `RIGHT("example", 3)` would return "ple".
- The `MID` function (`MID(text, start_num, num_chars)`) extracts a specified number of characters (`num_chars`) from a text string (`text`), starting at a specified position (`start_num`). For example, `MID("example", 2, 3)` would return "xam" (assuming 1-indexed, or "amp" if 0-indexed as demonstrated with character 8 starting a 3 character extraction).

**Q3: Can you explain the `TEXT` function in Excel and what different formatting codes like `#`, `0.00`, `$,` and `dddd` mean?**
A3: The `TEXT` function (`TEXT(value, format_text)`) allows you to convert a numeric value to text and apply specific formatting.

- `#`: Displays only significant digits. If you use `#` (or `###`) with a decimal number, it will drop the decimal part, showing only the whole number. It also won't display extra zeros.
- `0`: Acts as a placeholder for digits. If the number has fewer digits than zeros in the format, it will pad with leading or trailing zeros. For example, `0.00` displays two decimal places, rounding as needed. `00000` will pad numbers like `42` to `00042`.
- `#,##0`: Adds a comma as a thousands separator. `#,##0.00` combines this with two decimal places.
- `$`: Adds a currency symbol. You can also specify other currency symbols like `€` or `₹`.
- `0%`: Formats the number as a percentage.
- Date/Time formats (e.g., `mm/dd/yyyy`, `mmmm d, yyyy`, `dddd`): These format dates. `dddd` specifically displays the full weekday name based on your system's local settings (e.g., "Thursday").

**Q4: What is the difference between using `#` and `0` as placeholders in the `TEXT` function, especially with leading zeros?**
A4:

- `#` is an optional digit placeholder. If there's no digit in that position, nothing is displayed, and it doesn't pad with leading or trailing zeros unless you explicitly put a `0`. It primarily focuses on displaying significant digits.
- `0` is a mandatory digit placeholder. If the number has fewer digits than specified zeros, it will pad with zeros. This is useful for ensuring a fixed number of digits (e.g., `00000` for ID numbers).

**Q5: For a K-NN (K-Nearest Neighbors) model, if K is increasing, what happens to the model's generalization, variance, and bias?**
A5:

- **Generalization:** If K is increasing, the model generally **generalizes better** on unseen data (test data).
- **Overfitting/Underfitting:** A very low K (e.g., K=1) often leads to **overfitting**, meaning it performs very well on training data but poorly on test data due to being too sensitive to individual data points. As K increases, the model tends to **underfit** if K becomes too large, leading to low accuracy on both training and test data because it loses the ability to capture complex patterns.
- **Variance and Bias:** Variance and bias are inversely related.
  - A **low K** (overfitting) results in **high variance** (model is too sensitive to training data changes) and **low bias**.
  - A **high K** (underfitting) results in **low variance** (model is less sensitive) and **high bias**.

**Q6: This K-NN question involves concepts not directly taught in the modules. Will the end-term exam be similar to this mock paper?**
A6: The end-term exam will be different from this mock paper. It will primarily feature 3-4 scenario-based questions requiring comprehensive understanding and analysis. Questions like K-NN, which haven't been thoroughly taught, should ideally not appear in the end-term. There were some issues with the mock paper content being mismatched, which is being addressed.

**Q7: Can you explain K-Means clustering algorithm, including `n_clusters`, `random_state`, `max_iter`, and `tolerance` parameters?**
A7:

- **K-Means Algorithm:** K-Means is an iterative clustering algorithm. It involves:
  1.  **Initialization:** Randomly or strategically choosing `n_clusters` (K) centroids (initial cluster centers).
  2.  **Assignment:** Assigning each data point to the nearest centroid (based on distance).
  3.  **Update:** Recalculating the centroids as the mean of all points assigned to that cluster.
  4.  **Iteration:** Repeating steps 2 and 3 until centroids no longer move significantly or `max_iter` is reached.
- **`n_clusters`:** This parameter determines the number of clusters (K) you want the algorithm to identify in the data.
- **`random_state`:** This ensures reproducibility. If you set a `random_state` to a specific integer, the centroid initialization will be the same every time you run the algorithm, leading to consistent results.
- **`max_iter`:** This sets the maximum number of iterations the algorithm will run. If the centroids don't converge before this limit, the algorithm stops.
- **`tolerance` (tol):** This parameter defines the acceptable level of change (or error) between iterations. If the change in centroids (or the loss function value) from one iteration to the next falls below this `tolerance` threshold, the algorithm stops, indicating convergence.
  - A **higher tolerance** means the algorithm will stop faster (fewer iterations) because it accepts larger changes as "converged."
  - A **lower tolerance** means the algorithm will run for more iterations, requiring a very small change to stop.
  - In K-Means, the "loss function" often refers to the sum of squared distances of samples to their closest cluster center.

**Q8: What are some key Dev Tools to be familiar with for the exam?**
A8: You should be familiar with the various tabs in browser developer tools:

- **Application Tab:** This is where you can access and inspect cookies, local storage, session storage, and other client-side data. It's the most comprehensive place to view cookie details (including expiration).
- **Network Tab:** This tab shows all network requests made by the page. You can inspect request and response headers, which include cookie information for specific requests.
- **Console Tab:** Used for debugging JavaScript, logging messages, and interacting with the page's runtime.
- **Elements Tab:** Used for inspecting and modifying the page's HTML and CSS.

**Q9: What aspects of Pandas are important for the exam?**
A9: You should be familiar with Pandas for data cleaning and manipulation. This includes:

- **Loading data:** Reading various file formats (CSV, Excel, Parquet).
- **Data inspection:** `head()`, `info()`, `describe()`, `isnull().sum()`.
- **Data cleaning:** Handling missing values (`dropna()`, `fillna()`), removing duplicates (`drop_duplicates()`), renaming columns.
- **Data transformation:** Applying functions (`apply()`), creating new columns, string operations (`.str` accessor for `lower()`, `strip()`, `replace()`, etc.).
- **Filtering and Sorting:** Selecting rows/columns based on conditions.
- **Aggregation:** Grouping data and applying aggregate functions (`groupby()`).

**Q10: What about Geo-spatial libraries like QGIS or GeoPandas?**
A10: Geo-spatial concepts are likely to be tested. You should understand the basic structure of commands for libraries like GeoPandas. For example, understanding how to apply the Haversine formula to calculate distances between geographic coordinates.

**Q11: Should I expect questions on Streamlit?**
A11: Yes, Streamlit commands are highly likely to appear. This includes basic commands for displaying text (`st.write`), taking user input (`st.text_input`, `st.number_input`), and understanding how to structure a basic Streamlit application.

**Q12: What about Project 1 and Project 2 marks and feedback?**
A12:

- **Project 2:** It involves running all student scripts on the server, which is a time-consuming process. We hope to have the results by December 22nd, but it might take longer.
- **Project 1:** You should be able to see the breakdown of your peer review marks. I (the instructor) am about 80% sure that this functionality will be made visible.

**Q13: What should I expect regarding the structure and content of the end-term exam?**
A13:

- **Scenario-based Questions:** There will likely be 3-4 lengthy scenarios. You will need to read these carefully and answer multiple questions related to each scenario. These scenarios will carry a significant portion of the exam's weight (potentially 50% or more of your total marks).
- **LLM Interactions:** Scenarios may involve interactions with LLMs (Large Language Models). Questions will test your understanding of LLMs, their capabilities, limitations, and ethical considerations (e.g., "Do you trust the LLM to do this sort of work?").
- **General Questions:** There will also be general questions on various topics covered in the syllabus.
- **Calculations:** While the previous mock had calculation-based questions, we've advocated that these should _not_ be in the end-term, as students are not expected to perform complex manual calculations. If any appear, you should highlight them.
- **Difficulty:** The difficulty level is not expected to be very high. The main challenge will be the exam's length, requiring you to manage your time effectively and understand what is being asked across multiple topics.

**Q14: Should I review previous year's question papers (PYQs)?**
A14: There is some value in reviewing PYQs. While the syllabus changes, and some topics (like Tableau or Comic-Gen in previous terms) are no longer relevant, others (like Streamlit, ARIMA, K-Means) appear consistently. PYQs can give you a general sense of the exam style and types of questions. However, don't expect an exact replica, and focus primarily on the current syllabus.

**Q15: Will Tableau be part of the exam?**
A15: No, I don't think there will be any questions on Tableau. Tableau is a paid application, and it's not explicitly taught in any video modules. It's not reasonable to expect students to answer questions on it.

**Q16: Will the solution for the full mock paper be uploaded?**
A16: Due to unforeseen problems, the full mock paper solution has not been fully uploaded yet. A second part containing more questions will be uploaded. The solutions to the calculation-based questions will be ignored in the end-term. You'll receive an email announcement once the full mock solution is available.

**Q17: What is ARIMA and what do its parameters (P, D, Q) mean?**
A17: ARIMA stands for AutoRegressive Integrated Moving Average, and it's a model used for time series analysis. It uses three parameters (P, D, Q):

- **P (AutoRegressive order):** Represents the number of previous time periods (or lagged observations) to include in the model. For example, if P=1, the current value depends on the previous one. If P=2, it depends on the previous two.
- **D (Integrated order):** Represents the number of times the raw observations are differenced to make the time series stationary (i.e., remove trends or seasonality).
  - Differencing means subtracting the previous value from the current value (e.g., `current_value - previous_value`).
  - If D=1, it's differenced once. If D=2, it's differenced twice.
- **Q (Moving Average order):** Represents the number of previous error terms (or lagged forecast errors) to include in the model. This accounts for past shocks in the system.

**Q18: What is the recommended strategy for preparing for the end-term exam, given the changes and nature of the questions?**
A18:

1.  **Focus on Core Concepts:** Understand the basic structure and parameters of models/libraries covered (Streamlit, ARIMA, K-Means, Pandas, Dev Tools, Geo-spatial libraries).
2.  **Practice Scenario Analysis:** The exam will be scenario-based, so practice reading complex situations and extracting relevant information.
3.  **LLM Interaction:** Be aware of LLM capabilities and limitations, as scenarios may involve interacting with them.
4.  **Data Cleaning with Pandas:** Dedicate time to Pandas for data cleaning, manipulation, and exploration. You're likely to get multiple questions on this.
5.  **Dev Tools:** Familiarize yourself with how to use browser developer tools, especially the Application and Network tabs, for inspecting cookies and network requests.
6.  **Avoid Unnecessary Calculations:** Don't stress over complex manual calculations; they are generally not expected.
7.  **Review PYQs (with caution):** Use previous PYQs for general understanding, but remember the syllabus is dynamic, and some older topics are no longer relevant. Focus on areas highlighted in the current term.

**Q19: Will the syllabus for the next term be the same or change again?**
A19: The syllabus is constantly changing. For the next term, they plan to remove "Comic-Gen" and replace it with LLM-based image generation tools like DALL-E, integrating it into narrative assignments. The field is very dynamic and cutting-edge.Here's an FAQ summary of the live tutorial:

**Q1: What is the purpose of this mock session?**
A1: This session is designed to go through questions that are related to what you can expect in your end-term exam.

**Q2: Can you explain the `RIGHT` and `MID` functions in Excel?**
A2: Sure.

- The `RIGHT` function (`RIGHT(text, num_chars)`) extracts a specified number of characters (`num_chars`) from the right side of a text string (`text`). For example, `RIGHT("example", 3)` would return "ple".
- The `MID` function (`MID(text, start_num, num_chars)`) extracts a specified number of characters (`num_chars`) from a text string (`text`), starting at a specified position (`start_num`). For example, `MID("example", 2, 3)` would return "xam" (assuming 1-indexed, or "amp" if 0-indexed as demonstrated with character 8 starting a 3 character extraction).

**Q3: Can you explain the `TEXT` function in Excel and what different formatting codes like `#`, `0.00`, `$,` and `dddd` mean?**
A3: The `TEXT` function (`TEXT(value, format_text)`) allows you to convert a numeric value to text and apply specific formatting.

- `#`: Displays only significant digits. If you use `#` (or `###`) with a decimal number, it will drop the decimal part, showing only the whole number. It also won't display extra zeros.
- `0`: Acts as a placeholder for digits. If the number has fewer digits than zeros in the format, it will pad with leading or trailing zeros. For example, `00.00` displays two decimal places, rounding as needed. `00000` will pad numbers like `42` to `00042`.
- `#,##0`: Adds a comma as a thousands separator. `#,##0.00` combines this with two decimal places.
- `$`: Adds a currency symbol. You can also specify other currency symbols like `€` or `₹`.
- `0%`: Formats the number as a percentage.
- Date/Time formats (e.g., `mm/dd/yyyy`, `mmmm d, yyyy`, `dddd`): These format dates. `dddd` specifically displays the full weekday name based on your system's local settings (e.g., "Thursday").

**Q4: What is the difference between using `#` and `0` as placeholders in the `TEXT` function, especially with leading zeros?**
A4:

- `#` is an _optional_ digit placeholder. If there's no digit in that position, nothing is displayed, and it doesn't pad with leading or trailing zeros unless you explicitly put a `0`. It primarily focuses on displaying significant digits.
- `0` is a _mandatory_ digit placeholder. If the number has fewer digits than specified zeros, it will pad with zeros. This is useful for ensuring a fixed number of digits (e.g., `00000` for ID numbers).

**Q5: For a K-NN (K-Nearest Neighbors) model, if K is increasing, what happens to the model's generalization, variance, and bias?**
A5:

- **Generalization:** If K is increasing, the model generally **generalizes better** on unseen data (test data).
- **Overfitting/Underfitting:** A very low K (e.g., K=1) often leads to **overfitting**, meaning it performs very well on training data but poorly on test data due to being too sensitive to individual data points. As K increases, the model tends to **underfit** if K becomes too large, leading to low accuracy on both training and test data because it loses the ability to capture complex patterns.
- **Variance and Bias:** Variance and bias are inversely related.
  - A **low K** (overfitting) results in **high variance** (model is too sensitive to training data changes) and **low bias**.
  - A **high K** (underfitting) results in **low variance** (model is less sensitive) and **high bias**.

**Q6: This K-NN question involves concepts not directly taught in the modules. Will the end-term exam be similar to this mock paper?**
A6: The end-term exam will be different from this mock paper. It will primarily feature 3-4 scenario-based questions requiring comprehensive understanding and analysis. Questions like K-NN, which haven't been thoroughly taught, should ideally not appear in the end-term. There were some issues with the mock paper content being mismatched, which is being addressed.

**Q7: Can you explain K-Means clustering algorithm, including `n_clusters`, `random_state`, `max_iter`, and `tolerance` parameters?**
A7:

- **K-Means Algorithm:** K-Means is an iterative clustering algorithm. It involves:
  1.  **Initialization:** Randomly or strategically choosing `n_clusters` (K) centroids (initial cluster centers).
  2.  **Assignment:** Assigning each data point to the nearest centroid (based on distance).
  3.  **Update:** Recalculating the centroids as the mean of all points assigned to that cluster.
  4.  **Iteration:** Repeating steps 2 and 3 until centroids no longer move significantly or `max_iter` is reached.
- **`n_clusters`:** This parameter determines the number of clusters (K) you want the algorithm to identify in the data.
- **`random_state`:** This ensures reproducibility. If you set a `random_state` to a specific integer, the centroid initialization will be the same every time you run the algorithm, leading to consistent results.
- **`max_iter`:** This sets the maximum number of iterations the algorithm will run. If the centroids don't converge before this limit, the algorithm stops.
- **`tolerance` (tol):** This parameter defines the acceptable level of change (or error) between iterations. If the change in centroids (or the loss function value) from one iteration to the next falls below this `tolerance` threshold, the algorithm stops, indicating convergence.
  - A **higher tolerance** means the algorithm will stop faster (fewer iterations) because it accepts larger changes as "converged."
  - A **lower tolerance** means the algorithm will run for more iterations, requiring a very small change to stop.
  - In K-Means, the "loss function" often refers to the sum of squared distances of samples to their closest cluster center.

**Q8: What are some key Dev Tools to be familiar with for the exam?**
A8: You should be familiar with the various tabs in browser developer tools:

- **Application Tab:** This is where you can access and inspect cookies, local storage, session storage, and other client-side data. It's the most comprehensive place to view cookie details (including expiration).
- **Network Tab:** This tab shows all network requests made by the page. You can inspect request and response headers, which include cookie information for specific requests.
- **Console Tab:** Used for debugging JavaScript, logging messages, and interacting with the page's runtime.
- **Elements Tab:** Used for inspecting and modifying the page's HTML and CSS.

**Q9: What aspects of Pandas are important for the exam?**
A9: You should be familiar with Pandas for data cleaning and manipulation. This includes:

- **Loading data:** Reading various file formats (CSV, Excel, Parquet).
- **Data inspection:** `head()`, `info()`, `describe()`, `isnull().sum()`.
- **Data cleaning:** Handling missing values (`dropna()`, `fillna()`), removing duplicates (`drop_duplicates()`), renaming columns.
- **Data transformation:** Applying functions (`apply()`), creating new columns, string operations (`.str` accessor for `lower()`, `strip()`, `replace()`, etc.).
- **Filtering and Sorting:** Selecting rows/columns based on conditions.
- **Aggregation:** Grouping data and applying aggregate functions (`groupby()`).

**Q10: What about Geo-spatial libraries like QGIS or GeoPandas?**
A10: Geo-spatial concepts are likely to be tested. You should understand the basic structure of commands for libraries like GeoPandas. For example, understanding how to apply the Haversine formula to calculate distances between geographic coordinates.

**Q11: Should I expect questions on Streamlit?**
A11: Yes, Streamlit commands are highly likely to appear. This includes basic commands for displaying text (`st.write`), taking user input (`st.text_input`, `st.number_input`), and understanding how to structure a basic Streamlit application.

**Q12: What about Project 1 and Project 2 marks and feedback?**
A12:

- **Project 2:** It involves running all student scripts on the server, which is a time-consuming process. We hope to have the results by December 22nd, but it might take longer.
- **Project 1:** You should be able to see the breakdown of your peer review marks. I (the instructor) am about 80% sure that this functionality will be made visible.

**Q13: What should I expect regarding the structure and content of the end-term exam?**
A13:

- **Scenario-based Questions:** There will likely be 3-4 lengthy scenarios. You will need to read these carefully and answer multiple questions related to each scenario. These scenarios will carry a significant portion of the exam's weight (potentially 50% or more of your total marks).
- **LLM Interactions:** Scenarios may involve interactions with LLMs (Large Language Models). Questions will test your understanding of LLMs, their capabilities, limitations, and ethical considerations (e.g., "Do you trust the LLM to do this sort of work?").
- **General Questions:** There will also be general questions on various topics covered in the syllabus.
- **Calculations:** While the previous mock had calculation-based questions, we've advocated that these should _not_ be in the end-term, as students are not expected to perform complex manual calculations. If any appear, you should highlight them.
- **Difficulty:** The difficulty level is not expected to be very high. The main challenge will be the exam's length, requiring you to manage your time effectively and understand what is being asked across multiple topics.

**Q14: Should I review previous year's question papers (PYQs)?**
A14: There is some value in reviewing PYQs. While the syllabus changes, and some topics (like Tableau or Comic-Gen in previous terms) are no longer relevant, others (like Streamlit, ARIMA, K-Means) appear consistently. PYQs can give you a general sense of the exam style and types of questions. However, don't expect an exact replica, and focus primarily on the current syllabus.

**Q15: Will Tableau be part of the exam?**
A15: No, I don't think there will be any questions on Tableau. Tableau is a paid application, and it's not explicitly taught in any video modules. It's not reasonable to expect students to answer questions on it.

**Q16: Will the solution for the full mock paper be uploaded?**
A16: Due to unforeseen problems, the full mock paper solution has not been fully uploaded yet. A second part containing more questions will be uploaded. The solutions to the calculation-based questions will be ignored in the end-term. You'll receive an email announcement once the full mock solution is available.

**Q17: What is ARIMA and what do its parameters (P, D, Q) mean?**
A17: ARIMA stands for AutoRegressive Integrated Moving Average, and it's a model used for time series analysis. It uses three parameters (P, D, Q):

- **P (AutoRegressive order):** Represents the number of previous time periods (or lagged observations) to include in the model. For example, if P=1, the current value depends on the previous one. If P=2, it depends on the previous two.
- **D (Integrated order):** Represents the number of times the raw observations are differenced to make the time series stationary (i.e., remove trends or seasonality).
  - Differencing means subtracting the previous value from the current value (e.g., `current_value - previous_value`).
  - If D=1, it's differenced once. If D=2, it's differenced twice.
- **Q (Moving Average order):** Represents the number of previous error terms (or lagged forecast errors) to include in the model. This accounts for past shocks in the system.

**Q18: What is the recommended strategy for preparing for the end-term exam, given the changes and nature of the questions?**
A18:

1.  **Focus on Core Concepts:** Understand the basic structure and parameters of models/libraries covered (Streamlit, ARIMA, K-Means, Pandas, Dev Tools, Geo-spatial libraries).
2.  **Practice Scenario Analysis:** The exam will be scenario-based, so practice reading complex situations and extracting relevant information.
3.  **LLM Interaction:** Be aware of LLM capabilities and limitations, as scenarios may involve interacting with them.
4.  **Data Cleaning with Pandas:** Dedicate time to Pandas for data cleaning, manipulation, and exploration. You're likely to get multiple questions on this.
5.  **Dev Tools:** Familiarize yourself with how to use browser developer tools, especially the Application and Network tabs, for inspecting cookies and network requests.
6.  **Review PYQs (with caution):** Use previous PYQs for general understanding, but remember the syllabus is dynamic, and some older topics are no longer relevant. Focus on areas highlighted in the current term.
7.  **Time Management:** The exam is lengthy, so practice time management during scenario-based questions.

**Q19: Will the syllabus for the next term be the same or change again?**
A19: The syllabus is constantly changing. For the next term, they plan to remove "Comic-Gen" and replace it with LLM-based image generation tools like DALL-E, integrating it into narrative assignments. The field is very dynamic and cutting-edge.
