## Converting HTML to Markdown

When working with web content, converting HTML files to plain text or Markdown is a common requirement for content extraction, analysis, and preservation. For example:

- **Content analysis**: Extract clean text from HTML for natural language processing
- **Data mining**: Strip formatting to focus on the actual content
- **Offline reading**: Convert web pages to readable formats for e-readers or offline consumption
- **Content migration**: Move content between different CMS platforms
- **SEO analysis**: Extract headings, content structure, and text for optimization
- **Archive creation**: Store web content in more compact, preservation-friendly formats
- **Accessibility**: Convert content to formats that work better with screen readers

This tutorial covers both converting existing HTML files and combining web crawling with HTML-to-text conversion in a single workflow -- all using the command line.

### defuddle-cli

[defuddle-cli](https://github.com/defuddle/defuddle) specializes in HTML - Markdown conversion. It's a bit slow and not very customizable but produces clean Markdown that preserves structure, links, and basic formatting. Best for content where preserving the document structure is important.

```bash
find . -name '*.html' -exec npx --package defuddle-cli -y defuddle parse {} --md -o {}.md \;
```

- `find . -name '*.html'`: Finds all HTML files in the current directory and subdirectories
- `-exec ... \;`: Executes the following command for each file found
- `npx --package defuddle-cli -y`: Installs and runs defuddle-cli without prompting
- `defuddle parse {} --md`: Parses the HTML file (represented by `{}`) and converts to markdown
- `-o {}.md`: Outputs to a file with the original name plus .md extension

### Pandoc

[Pandoc](https://pandoc.org/) is a bit slow and highly customizable, preserving almost all formatting elements, leading to verbose markdown. Best for academic or documentation conversion where precision matters.

Pandoc can convert from many other formats (such as Word, PDF, LaTeX, etc.) to Markdown and vice versa, making it one of most popular and versatele document convertors.

[![How to Convert a Word Document to Markdown for Free using Pandoc (12 min)](https://i.ytimg.com/vi/HPSK7q13-40/sddefault.jpg)](https://youtu.be/HPSK7q13-40)

```bash
find . -name '*.html' -exec pandoc -f html -t markdown_strict -o {}.md {} \;
```

- `find . -name '*.html'`: Finds all HTML files in the current directory and subdirectories
- `-exec ... \;`: Executes the following command for each file found
- `pandoc`: The Swiss Army knife of document conversion
- `-f html -t markdown_strict`: Convert from HTML format to strict markdown
- `-o {}.md {}`: Output to a markdown file, with the input file as the last argument

### Lynx

[Lynx](https://lynx.invisible-island.net/) is fast and generates text (not Markdown) with minimal formatting. Lynx renders the HTML as it would appear in a text browser, preserving basic structure but losing complex formatting. Best for quick content extraction or when processing large numbers of files.

```bash
find . -type f -name '*.html' -exec sh -c 'for f; do lynx -dump -nolist "$f" > "${f%.html}.txt"; done' _ {} +
```

- `find . -type f -name '*.html'`: Finds all HTML files in the current directory and subdirectories
- `-exec sh -c '...' _ {} +`: Executes a shell command with batched files for efficiency
- `for f; do ... done`: Loops through each file in the batch
- `lynx -dump -nolist "$f"`: Uses the lynx text browser to render HTML as plain text
  - `-dump`: Output the rendered page to stdout
  - `-nolist`: Don't include the list of links at the end
- `> "${f%.html}.txt"`: Save output to a .txt file with the same base name

### w3m

[w3m](https://w3m.sourceforge.net/) is very slow processing with minimal formatting. w3m tends to be more thorough in its rendering than lynx but takes considerably longer. It supports basic JavaScript processing, making it better at handling modern websites with dynamic content. Best for cases where you need slightly better rendering than lynx, particularly for complex layouts and tables, and when some JavaScript processing is beneficial.

```bash
find . -type f -name '*.html' \
  -exec sh -c 'for f; do \
      w3m -dump -T text/html -cols 80 -no-graph "$f" > "${f%.html}.md"; \
    done' _ {} +
```

- `find . -type f -name '*.html'`: Finds all HTML files in the current directory and subdirectories
- `-exec sh -c '...' _ {} +`: Executes a shell command with batched files for efficiency
- `for f; do ... done`: Loops through each file in the batch
- `w3m -dump -T text/html -cols 80 -no-graph "$f"`: Uses the w3m text browser to render HTML
  - `-dump`: Output the rendered page to stdout
  - `-T text/html`: Specify input format as HTML
  - `-cols 80`: Set output width to 80 columns
  - `-no-graph`: Don't show graphic characters for tables and frames
- `> "${f%.html}.md"`: Save output to a .md file with the same base name

### Comparison

| Approach     | Speed     | Format Quality | Preservation                       | Best For                        |
| ------------ | --------- | -------------- | ---------------------------------- | ------------------------------- |
| defuddle-cli | Slow      | High           | Good structure and links           | Content migration, publishing   |
| pandoc       | Slow      | Very High      | Almost everything                  | Academic papers, documentation  |
| lynx         | Fast      | Low            | Basic structure only               | Quick extraction, large batches |
| w3m          | Very Slow | Medium-Low     | Basic structure with better tables | Improved readability over lynx  |

### Optimize Batch Processing

1. **Process in parallel**: Use GNU Parallel for multi-core processing:

   ```bash
   find . -name "*.html" | parallel "pandoc -f html -t markdown_strict -o {}.md {}"
   ```

2. **Filter files before processing**:

   ```bash
   find . -name "*.html" -type f -size -1M -exec pandoc -f html -t markdown {} -o {}.md \;
   ```

3. **Customize output format** with additional parameters:

   ```bash
   # For pandoc, preserve line breaks but simplify other formatting
   find . -name "*.html" -exec pandoc -f html -t markdown --wrap=preserve --atx-headers {} -o {}.md \;
   ```

4. **Handle errors gracefully**:

   ```bash
   find . -name "*.html" -exec sh -c 'for f; do pandoc -f html -t markdown "$f" -o "${f%.html}.md" 2>/dev/null || echo "Failed: $f" >> conversion_errors.log; done' _ {} +
   ```

### Choosing the Right Tool

- **Need speed with minimal formatting?** Use the lynx approach
- **Need precise, complete conversion?** Use pandoc
- **Need a balance of structure and cleanliness?** Try defuddle-cli
- **Working with complex tables?** w3m might render them better

Remember that the best approach depends on your specific use case, volume of files, and how you intend to use the converted text.

### Combined Crawling and Conversion

Sometimes you need to both crawl a website and convert its content to markdown or text in a single workflow, like [Crawl4AI](#crawl4ai) or [markdown-crawler](#markdown-crawler).

1. **For research/data collection**: Use a specialized crawler (like Crawl4AI) with post-processing conversion
2. **For simple website archiving**: Markdown-crawler provides a convenient all-in-one solution
3. **For high-quality conversion**: Use wget/wget2 for crawling followed by pandoc for conversion
4. **For maximum speed**: Combine wget with lynx in a pipeline

### Crawl4AI

[Crawl4AI](https://github.com/crawl4ai/crawl4ai) is designed for single-page extraction with high-quality content processing. Crawl4AI is optimized for AI training data extraction, focusing on clean, structured content rather than complete site preservation. It excels at removing boilerplate content and preserving the main article text.

```bash
uv venv
source .venv/bin/activate.fish
uv pip install crawl4ai
crawl4ai-setup
```

- `uv venv`: Creates a Python virtual environment using uv (a faster alternative to virtualenv)
- `source .venv/bin/activate.fish`: Activates the virtual environment (fish shell syntax)
- `uv pip install crawl4ai`: Installs the crawl4ai package
- `crawl4ai-setup`: Initializes crawl4ai's required dependencies

### markdown-crawler

[markdown-crawler](https://pypi.org/project/markdown-crawler/) combines web crawling with markdown conversion in one tool. It's efficient for bulk processing but tends to produce lower-quality markdown conversion compared to specialized converters like pandoc or defuddle. Best for projects where quantity and integration are more important than perfect formatting.

```bash
uv venv
source .venv/bin/activate.fish
uv pip install markdown-crawler
markdown-crawler -t 5 -d 3 -b ./markdown https://study.iitm.ac.in/ds/
```

- `uv venv` and activation: Same as above
- `uv pip install markdown-crawler`: Installs the markdown-crawler package
- `markdown-crawler`: Runs the crawler with these options:
  - `-t 5`: Sets 5 threads for parallel crawling
  - `-d 3`: Limits crawl depth to 3 levels
  - `-b ./markdown`: Sets the base output directory
  - Final argument is the starting URL
