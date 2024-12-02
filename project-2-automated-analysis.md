# Project 2 - Automated Analysis

**THIS IS A DRAFT. ANYTHING CAN CHANGE.**

Your task is to:

1. Write a Python script that uses an LLM to analyze, visualize, and narrate a story from a dataset.
2. Convince an LLM that your script and output are of high quality.

This project is not just a test of what you learned. It also teaches you new things. Check the [reading material](#reading-material) below.

## Write a Python script

Your submission must be a Python script, `autolysis.py` submitted via a Git repository.

The Python script must accept a single CSV filename like below. ([Read about uv](https://docs.astral.sh/uv/). [Inline your dependencies](https://docs.astral.sh/uv/guides/scripts/#declaring-script-dependencies).)

```shell
uv run autolysis.py dataset.csv
```

This should create, in your current directory, the following files:

- A single [Markdown](https://commonmark.org/help/) file called `README.md` with results of your automated analysis, written as a story.
- 1-3 charts as PNG providing supporting data visualizations. Name them as `*.png`. Add the images in your `README.md`.

You can try this on these [sample datasets](https://drive.google.com/drive/folders/1KNGfcgA1l2uTnqaldaX6LFr9G1RJQNK3):

- [`goodreads.csv`](https://drive.google.com/file/d/1oYI_Vdo-Xmelq7FQVCweTQgs_Ii3gEL6/view): 10,000 books from GoodReads with their genres, ratings, etc.
- [`happiness.csv`](https://drive.google.com/file/d/15nasMs0VKVB4Tm7-2EKYNpDzPdkiRW1q/view): Data from the [World Happiness Report](https://worldhappiness.report/data/)
- [`media.csv`](https://drive.google.com/file/d/10LcR2p6SjD3pWASVp5M4k94zjMZD6x5W/view): The course faculty's rating of movies, TV series, and books.

Notes:

- **Create a single Python script**: Don't load other local scripts (e.g. `utils.py`) or files (e.g. `system-prompt.txt`). Keep the entire code in `autolysis.py`. This eases LLM evaluation.
- **Use your AI Proxy token**. Your [AI Proxy token](https://aiproxy.sanand.workers.dev/) now has a $2 limit. You may use it. If you run out of tokens, ask the TDS team for more. (But try and avoid that.)
- **Stick to GPT-4o-Mini**. This is the only generation model that AI Proxy currently supports. When this page says "LLM", it means GPT-4o-Mini.

## Analyze the data

Your script should work with _any_ valid CSV file.

Since you don't know in advance what the data looks like, don't make assumptions. Instead:

1. **Do generic analysis** that will apply to all datasets. For example, summary statistics, counting missing values, correlation matrices, outliers, clustering, hierarchy detection, etc.
2. **Ask the LLM** to analyze the data. Send the LLM your filename, column names & types, and additional context (like summary statistics, example values, etc.) to the LLM. Then
   1. **For code**. Have the LLM give you Python code and run it. This is risky because LLM code might fail and your program might terminate. Use with caution.
   2. **For summaries**. Have the LLM summarize your generic analysis. Use liberally.
   3. **For function calls**. Have the LLM suggest specific function calls or analyses that will give you more insights, and run them. Use liberally. Read the [OpenAI Function Calling](#openai-function-calling) docs.

Here are some ideas for analysis that may be insightful. _Some_ of these are covered in this course, but don't limit yourself.

- Outlier and Anomaly Detection: You might find errors, fraud, or high-impact opportunities.
- Correlation Analysis, Regression Analysis, and Feature Importance Analysis: You might find what to improve to impact an outcome.
- Time Series Analysis: You might find patterns that help predict the future.
- Cluster Analysis: You might find natural groupings for targeted marketing or resource allocation.
- Geographic Analysis: You might find where the biggest problems or opportunities are.
- Network Analysis: You might find what to cross-sell or collaborate with.

Notes:

- **Don't send the entire dataset to the LLM**: LLMs are bad at numbers - even arithmetic. Also, you'll run out of tokens. Instead, do your analysis in Python and send relevant summaries.
- **You can consult the LLM multiple times**. If one analysis doesn't work, ask for another. Or, share the results of one analysis to help the next one.

## Visualize your results

When you have your analysis, visualize the results.

For analysis that you wrote the code for, you know the structure of the output. So you can write functions to create the chart(s) for the structure they generate.

For example, if you create a correlation matrix, you can write a function to visualize it as a heatmap.

You need a Python-based library to create charts. We suggest [Seaborn](#seaborn) but you're welcome to use [Matplotlib](https://matplotlib.org/). We wouldn't recommend [Bokeh](https://bokeh.org/), [Plotly](https://plotly.com/) or [Altair](https://altair-viz.github.io/) unless you know how to get them to work without a browser.

You could get creative and ask the LLM to generate the code for your chart based on the data. This is risky because LLM code might fail and your program might terminate. Use with caution.

Notes:

- **Export as PNG**. Save all your charts as PNG files (with different file names) in the current directory.
- **Don't send the entire analysis to the LLM**. You might run out of tokens. Send only what might be significant analysis.

## Narrate a story

Use the LLM to write a story about your analysis. You can pass it your data structure, analysis, and even your charts. Have it describe:

1. The data you received, briefly
2. The analysis you carried out
3. The insights you discovered
4. The implications of your findings (i.e. what to do with the insights)

Save this as `README.md`.

Notes:

- **Keep images small**. 512x512 px images are ideal. That's the size of 1 tile. Or, send `detail: low` to reduce cost.
  Read the [LLM Vision Models module](#5-large-language-models#llm-vision-models) and the [OpenAI Vision API docs](https://platform.openai.com/docs/guides/vision#calculating-costs)

## Submit your script

- Create a new public repository in your GitHub account with an MIT license.
- Add your code: `autolysis.py`
- Create directories called `goodreads/`, `happiness/`, and `media/`.
- Run your script on the respective CSV files and commit the **output** in that directory. (Don't commit the input CSVs. Just `README.md` and `*.png` files.)
- Commit and push these.
- [**Submit the raw link to your `autolysis.py`**](https://forms.gle/r2sNJvGicxrhE9mYA). It will look like `https://raw.githubusercontent.com/[YOUR-ID]/[YOUR-PROJECT]/main/autolysis.py`

## Evaluation

Here is how your script will be evaluated. Try this yourself to guess your score.

### Submission (4 marks)

- 1 mark: **REQUIRED**: If your repository is public and has an [MIT License](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository). **NOTE** If you don't make your repo public or add an MIT license, the code will not be evaluated.
- 1 mark: If the repository has the required files
  - 0.4: `autolysis.py`
  - 0.1: `goodreads/README.md`
  - 0.1: `goodreads/*.png`
  - 0.1: `happiness/README.md`
  - 0.1: `happiness/*.png`
  - 0.1: `media/README.md`
  - 0.1: `media/*.png`
- 2 marks: If `uv run autolysis.py dataset.csv` runs without errors
  - 0.5: If `uv run autolysis.py goodreads.csv` runs without errors and creates `README.md` and `*.png`
  - 0.5: If `uv run autolysis.py happiness.csv` runs without errors and creates `README.md` and `*.png`
  - 0.5: If `uv run autolysis.py media.csv` runs without errors and creates `README.md` and `*.png`
  - 0.5: If all the above run without errors and create the correct files (bonus)

### Code (7 marks)

Your code is passed to an LLM. You get marks as follows:

- 1 mark: If code is well structured, logically organized, with appropriate use of functions, clear separation of concerns, consistent coding style, meaningful variable names, proper indentation, and sufficient commenting for understandability.
- 1 mark: If code uses robust analytical techniques. Statistical methods, comprehensiveness of analysis, innovative analytical techniques, and dynamic analysis based on data exploration.
- 1 mark: If code uses appropriate visualization types, enhances charts with titles, axis labels, legends, and annotations, and uses colors effectively.
- 1 mark: If code crafts clear, context-rich prompts to guide the LLM on the narrative, includes relevant results, ensures proper Markdown formatting, logically sequences the narratives (data description, analysis, insights, implications), integrates visualizations at the right places, and prompts the LLM to emphasie significant findings and implications.
- 1 mark: If code makes uses LLMs efficiently, minimizing token usage by avoiding sending large data and using concise prompts.
- 1 mark: If code uses dynamic prompts and function calling
- 1 mark: If code uses vision capabilities and multiple calls to LLMs (agentic workflows).

We don't know the exact prompts we will use for this. We won't share these either. But this gives you an idea of what we're looking for.

### Output (9 marks)

We will run your code against the output from 3 datasets:

1. The first will be the output from _one_ of the datasets you submitted. We will not share which one, and it may vary for each person.
2. Dataset 2: We won't be sharing this dataset. Your code should work with any CSV file.
3. Dataset 3: Same as above

The LLM will review your `README.md` and `*.png` files on these criteria:

- 1 mark: If `README.md` is well-structured, using headers, lists, and emphasis appropriately. The narrative clearly describes the data, analysis performed, insights gained, and implications.
- 1 mark: If the analysis demonstrates a deep understanding of the data, utilizing appropriate statistical methods and uncovering meaningful insights.
- 1 mark: If the PNG images are relevant, well-designed, and enhance the narrative by effectively illustrating key findings.

**REMEMBER**: LLMs give different results each time. Just because it worked for you doesn't mean it'll work when we evaluate it. So be robust in your prompts and code.

### Bonus marks (12 marks)

- 8 marks: **Code diversity**. You're welcome to copy code and learn from each other. But we encourage diversity too. We will use code embedding similarity (via `text-embedding-3-small`, dropping comments and docstrings) and give up to 5 bonus marks for most unique responses. (That is, if your response is similar to a lot of others, you lose these marks.)
- 4 marks: **Engaging and interesting**. We'll read your output. If it tugs at our hearts or blows our minds, we'll give bonus marks to a few lucky students.

**Prompt injection is fine**. LLMs can be coerced via prompt injection. You're welcome to try it. We'll try hard with our prompts to reduce this possibility. But if you succeed, you deserve your marks.

**Normalization**. Clearly, adding all this up won't total to 20 marks. We'll normalize the marks to a maximum of 20.

## Deadline

We'll evaluate the commit at the time of the deadline. You can commit after that, but we'll only grade the last commit before the deadline.

## Reading material

### uv

[`uv`](https://docs.astral.sh/uv/) is a fast Python package manager that's becoming the standard for running Python scripts.

[Install uv](https://docs.astral.sh/uv/getting-started/installation/). Then run `uv run autolysis.py dataset.csv` instead of `python autolysis.py dataset.csv`. This automatically installs Python and your dependencies.

It automatically installs dependencies mentioned as [inline script metadata](https://packaging.python.org/en/latest/specifications/inline-script-metadata/#inline-script-metadata). Make sure all dependencies are mentioned at the top of your script. For example:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "httpx",
#   "pandas",
# ]
# ///
```

[![uv - Python package and project management | Inline Script Metadata](https://i.ytimg.com/vi_webp/igWlYl3asKw/sddefault.webp)](https://youtu.be/igWlYl3asKw?t=1240)

### OpenAI Function Calling

OpenAI supports [Function Calling](https://platform.openai.com/docs/guides/function-calling) -- a way for LLMs to suggest what functions to call and how.

[![OpenAI Function Calling - Full Beginner Tutorial](https://i.ytimg.com/vi_webp/aqdWSYWC_LI/sddefault.webp)](https://youtu.be/aqdWSYWC_LI)

## Data visualization with Seaborn

[Seaborn](https://seaborn.pydata.org/) is a data visualization library for Python. It's based on Matplotlib but a bit easier to use, and a bit prettier.

[![Seaborn Tutorial : Seaborn Full Course](https://i.ytimg.com/vi_webp/6GUZXDef2U0/sddefault.webp)](https://youtu.be/6GUZXDef2U0)
