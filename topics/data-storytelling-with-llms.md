# Data Storytelling with LLMs

Large Language Models (LLMs) can help create compelling data stories by assisting at every step of the data-to-story value chain:

1. Data Engineering (scraping, cleaning)
2. Data Analysis (modeling, insights)
3. Data Visualization (charts, narratives)

[Watch this talk (30m) on data storytelling with LLMs](https://sanand0.github.io/talks/2025-06-27-data-design-by-dialogue/)

[![Data Design by Dialogue (30m)](https://i.ytimg.com/vi_webp/htc3LwVbPgI/sddefault.webp)](https://youtu.be/htc3LwVbPgI)

## Prerequisites

To follow this tutorial, you'll need:

- [ChatGPT Plus](https://chatgpt.com/) ($20/month) - recommended for better models
- Basic understanding of data analysis concepts

Optional but useful:

- [Claude Code](https://www.anthropic.com/claude-code) ($17/month) for advanced coding tasks
- Knowledge of Python for running analyses

## Data Engineering with LLMs

### Web Scraping

Ask LLMs to write scraping code for you. For example, to scrape WhatsApp messages:

```
I want to scrape data from a WhatsApp group by pasting JavaScript code on the DevTools console.
Write code that will:
1. Copy HTML from the WhatsApp web page
2. Trim as needed to avoid length issues
3. Put the data into clipboard
4. Parse the data into an array of JSON objects with message details
```

**Key Tips:**

- Have LLMs write code rather than process data directly
- If code fails, simply ask LLM to fix it
- Try the same prompt multiple times if needed - LLMs make different mistakes each time

### Data Cleaning

Use LLMs to identify and fix data quality issues:

```
Here is my dataset. Can you:
1. Identify missing or problematic values
2. Suggest appropriate cleaning strategies
3. Write code to clean and standardize the data
4. Handle special cases (e.g., system messages, deleted content)
```

## Data Analysis with LLMs

### Topic Modeling

LLMs can help analyze text data through embeddings:

1. Calculate embeddings for text content
2. Cluster similar content
3. Name/categorize clusters
4. Add cluster tags to original data

Example prompt for topic modeling:

```
Write code to:
1. Calculate embeddings for each text entry
2. Cluster using K-means (N clusters)
3. Use GPT to name each cluster based on contents
4. Add cluster labels to original dataset
```

### Pattern Discovery

Ask LLMs to explore your data creatively:

```
What interesting insights can we find in this dataset?
Please:
1. List 10 diverse angles we could explore
2. Include both obvious and quirky analyses
3. Write code to analyze each angle
4. Present results as tables and charts
5. Interpret each as a story with human appeal
```

## Best Practices

1. **Delegate Generously**: LLMs keep improving - try them on complex tasks

2. **Iterate & Experiment**:

   - Ask for multiple analyses
   - Try different approaches
   - Keep track of what works/doesn't

3. **Write Code**:

   - Have LLMs write code instead of processing directly
   - Code is more reliable and reusable
   - LLMs excel at code generation

4. **Start Fresh**:

   - Often easier to start over than fix broken code
   - Try multiple prompts for different approaches

5. **Track Impossibilities**:
   - Keep a list of what LLMs can't do yet
   - Review monthly as capabilities improve

## Example Workflow

1. **Data Collection**:

   ```
   Write code to scrape/collect data from [source]
   ```

2. **Data Cleaning**:

   ```
   Identify and fix data quality issues in this dataset
   ```

3. **Analysis**:

   ```
   What are the most interesting patterns in this data?
   Write code to analyze and visualize them.
   ```

4. **Visualization**:

   ```
   Create beautiful visualizations using [tool]
   Make them publication-quality with proper styling
   ```

5. **Storytelling**:
   ```
   Write a compelling narrative around these insights
   Include surprising findings and human interest
   ```

## Tips for Better Results

1. **Ask for Multiple Options**:

   - Request several analysis approaches
   - Get multiple visualization styles
   - Compare different narrative angles

2. **Be Specific**:

   - Mention target audience
   - Specify visualization style preferences
   - Include technical constraints

3. **Iterate on Quality**:

   - Ask for improvements on initial results
   - Request specific enhancements
   - Have LLMs critique their own work

4. **Handle Failures Gracefully**:
   - If something doesn't work, try a different approach
   - Break complex tasks into smaller steps
   - Use simpler alternatives when needed

## References

- [Vector Embeddings: OpenAI API](https://platform.openai.com/docs/guides/embeddings)
- [Anthropic's Claude Code Documentation](https://docs.anthropic.com/claude/docs)
- [Data Storytelling Best Practices](https://www.storytellingwithdata.com/)
