# Project: Data Analyst Agent

Deploy a data analyst agent. This is an API that uses LLMs to source, prepare, analyze, and visualize any data.

Your application exposes an API endpoint. You may host it anywhere. Let's assume it's at `https://app.example.com/api/`.

The endpoint must accept a POST request, e.g. `POST https://app.example.com/api/` with a data analysis task description and optional attachments in the body. For example:

```bash
curl "https://app.example.com/api/" -F "questions.txt=@question.txt" -F "image.png=@image.png" -F "data.csv=@data.csv"
```

`questions.txt` will ALWAYS be sent and contain the questions. There may be zero or more additional files passed.

The answers must be sent within 3 minutes in the format requested.

> [!WARNING] > \*\*These are not the final questions you'll be evaluated on. These examples are indicative.

## Sample questions

These are _examples_ of `quesions.txt` that will be sent. **NOT** the actual question, which will be a secret.

```markdown
Scrape the list of highest grossing films from Wikipedia. It is at the URL:
https://en.wikipedia.org/wiki/List_of_highest-grossing_films

Answer the following questions and respond with a JSON array of strings containing the answer.

1. How many $2 bn movies were released before 2000?
2. Which is the earliest film that grossed over $1.5 bn?
3. What's the correlation between the Rank and Peak?
4. Draw a scatterplot of Rank and Peak along with a dotted red regression line through it.
   Return as a base-64 encoded data URI, `"data:image/png;base64,iVBORw0KG..."` under 100,000 bytes.
```

Here's another example.

````markdown
The Indian high court judgement dataset contains judgements from the Indian High Courts, downloaded from [ecourts website](https://judgments.ecourts.gov.in/). It contains judgments of 25 high courts, along with raw metadata (as .json) and structured metadata (as .parquet).

- 25 high courts
- ~16M judgments
- ~1TB of data

Structure of the data in the bucket:

- `data/pdf/year=2025/court=xyz/bench=xyz/judgment1.pdf,judgment2.pdf`
- `metadata/json/year=2025/court=xyz/bench=xyz/judgment1.json,judgment2.json`
- `metadata/parquet/year=2025/court=xyz/bench=xyz/metadata.parquet`
- `metadata/tar/year=2025/court=xyz/bench=xyz/metadata.tar.gz`
- `data/tar/year=2025/court=xyz/bench=xyz/pdfs.tar`

This DuckDB query counts the number of decisions in the dataset.

```sql
INSTALL httpfs; LOAD httpfs;
INSTALL parquet; LOAD parquet;

SELECT COUNT(*) FROM read_parquet('s3://indian-high-court-judgments/metadata/parquet/year=*/court=*/bench=*/metadata.parquet?s3_region=ap-south-1');
```

Here are the columns in the data:

| Column                 | Type    | Description                    |
| ---------------------- | ------- | ------------------------------ |
| `court_code`           | VARCHAR | Court identifier (e.g., 33~10) |
| `title`                | VARCHAR | Case title and parties         |
| `description`          | VARCHAR | Case description               |
| `judge`                | VARCHAR | Presiding judge(s)             |
| `pdf_link`             | VARCHAR | Link to judgment PDF           |
| `cnr`                  | VARCHAR | Case Number Register           |
| `date_of_registration` | VARCHAR | Registration date              |
| `decision_date`        | DATE    | Date of judgment               |
| `disposal_nature`      | VARCHAR | Case outcome                   |
| `court`                | VARCHAR | Court name                     |
| `raw_html`             | VARCHAR | Original HTML content          |
| `bench`                | VARCHAR | Bench identifier               |
| `year`                 | BIGINT  | Year partition                 |

Here is a sample row:

```json
{
  "court_code": "33~10",
  "title": "CRL MP(MD)/4399/2023 of Vinoth Vs The Inspector of Police",
  "description": "No.4399 of 2023 BEFORE THE MADURAI BENCH OF MADRAS HIGH COURT ( Criminal Jurisdiction ) Thursday, ...",
  "judge": "HONOURABLE  MR JUSTICE G.K. ILANTHIRAIYAN",
  "pdf_link": "court/cnrorders/mdubench/orders/HCMD010287762023_1_2023-03-16.pdf",
  "cnr": "HCMD010287762023",
  "date_of_registration": "14-03-2023",
  "decision_date": "2023-03-16",
  "disposal_nature": "DISMISSED",
  "court": "33_10",
  "raw_html": "<button type='button' role='link'..",
  "bench": "mdubench",
  "year": 2023
}
```

Answer the following questions and respond with a JSON object containing the answer.

```json
{
  "Which high court disposed the most cases from 2019 - 2022?": "...",
  "What's the regression slope of the date_of_registration - decision_date by year in the court=33_10?": "...",
  "Plot the year and # of days of delay from the above question as a scatterplot with a regression line. Encode as a base64 data URI under 100,000 characters": "data:image/webp:base64,..."
}
```
````

## Sample responses

Here is a sample response to the first question:

```json
[1, "Titanic", 0.485782, "data:image/png;base64,iVBORw0KG... (response truncated)"]
```

## Evaluation

Here is a sample evaluation to the first question. This is **indicative**. The real evaluation will depend on the actual question, which will be a secret.

```yaml
description: "TDS Data Analyst Agent – generic eval (20-point rubric)"

providers:
  - id: https
    config:
      url: https://app.example.com/api/ # Replace this with your API endpoint
      method: POST
      body: file://question.txt
      transformResponse: json

  assert:
    # Structural gate – no score, hard-fail if not a 4-element array
    - type: is-json
      value: {type: array, minItems: 4, maxItems: 4}
      weight: 0

    # 1️⃣ first answer must equal 1
    - type: python
      weight: 4
      value: |
        import json, sys
        print(json.loads(output)[0] == 1)

    # 2️⃣ second answer must contain “Titanic” (case-insensitive)
    - type: python
      weight: 4
      value: |
        import json, re, sys
        print(bool(re.search(r'titanic', json.loads(output)[1], re.I)))

    # 3️⃣ third answer within ±0.001 of 0.485782
    - type: python
      weight: 4
      value: |
        import json, sys, math
        print(abs(float(json.loads(output)[2]) - 0.485782) <= 0.001)

    # 4️⃣ vision check ― send plot to GPT-4o-mini and grade multiple criteria
    - type: llm-rubric
      provider: openai:gpt-4.1-nano
      weight: 8
      # extract base-64 PNG from the 4th array element and inject into the prompt
      preprocess: |
        import json, re
        data = json.loads(output)
        context['plot'] = data[3
      rubricPrompt: |
        [
          { "role": "system",
            "content": "Grade the scatterplot. Award *score 1* only iff ALL are true: \
            (a) it’s a scatterplot of Rank (x-axis) vs Peak (y-axis); \
            (b) a dotted **red** regression line is present; \
            (c) axes are visible & labelled; \
            (d) file size < 100 kB. Otherwise score 0. \
            Respond as JSON: {scatterplot:bool, regression:bool, axes:bool, size:bool, score:number}"
          },
          { "role": "user",
            "content": [
              { "type": "image_url",
                "image_url": { "url": "{{plot}}" }      # data:image/png;base64,… :contentReference[oaicite:5]{index=5}
              },
              { "type": "text",
                "text": "Here is the original task:\n\n{{vars.question}}\n\nReview the image and JSON above." }
            ]
          }
        ]
      threshold: 0.99  # require full pass

tests:
  - description: "Data analysis"
```

Your score will be the score provided by promptfoo. No normalization. What you get is what you get.

## Deploy your application

Deploy your application to a public URL that can be accessed by anyone. You may use any platform.

(If you use ngrok, ensure that it is running continuously until you get your results.)

## Share your code

- [Create a new _public_ GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)
- [Add an MIT `LICENSE` file](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)
- Commit and push your code

## Submit your URL

Submit your GitHub repository URL and your API endpoint URL at https://exam.sanand.workers.dev/tds-data-analyst-agent (once it is available).
