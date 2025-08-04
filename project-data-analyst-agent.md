# Project: Data Analyst Agent

> [!WARNING] > **THIS IS A DRAFT**

Deploy a data analyst agent. This is an API that uses LLMs to source, prepare, analyze, and visualize any data.

Your application exposes an API endpoint. You may host it anywhere. Let's assume it's at `https://app.example.com/api/`.

The endpoint must accept a POST request, e.g. `POST https://app.example.com/api/` with a data analysis task description in the body. For example:

```bash
curl "https://app.example.com/api/" -F "@question.txt"
```

The answers must be sent within 3 minutes in the format requested.

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

### Example A: Geospatial Sentiment Analysis

This task requires the agent to integrate data from multiple sources (a public API and provided text), perform geospatial lookup and LLM-based sentiment analysis, and return a structured JSON object.

#### questions.txt

```
You are provided with text snippets for three major world cities. Your task is to:
1. Use a public geocoding API (like Nominatim or a similar free service) to find the latitude and longitude for London, Paris, and Tokyo.
2. For each city, analyze the sentiment of the corresponding text snippet. The sentiment must be one of 'POSITIVE', 'NEGATIVE', or 'NEUTRAL'.
3. Respond with a single JSON object. The keys should be the city names. Each value should be an object containing two keys: "coords" (an object with "lat" and "lon") and "sentiment".

Here are the text snippets:
- London: "Recent transport strikes cause chaos for commuters, but the city's vibrant theatre scene continues to thrive."
- Paris: "Paris launches a successful new green initiative, planting thousands of trees and delighting residents."
- Tokyo: "A critical report highlights the rising cost of living in Tokyo, causing concern among citizens."
```

#### promptfoo.yaml

```yaml
- description: "Geospatial Sentiment Analysis"
  assert:
    - type: is-json
      value: { "schema": { "type": "object" } }
      weight: 1

    - type: python
      weight: 9 # 3 points per city
      value: |
        import json, math
        output = json.loads(output)
        score = 0
        expected = {
          "London": {"lat": 51.5, "lon": -0.12, "sentiment": "NEUTRAL"},
          "Paris": {"lat": 48.85, "lon": 2.35, "sentiment": "POSITIVE"},
          "Tokyo": {"lat": 35.68, "lon": 139.69, "sentiment": "NEGATIVE"}
        }

        if len(output.keys()) != 3:
          return 0

        for city, data in output.items():
          if city in expected:
            # Check coordinates within ~1 degree
            lat_ok = abs(data['coords']['lat'] - expected[city]['lat']) < 1.0
            lon_ok = abs(data['coords']['lon'] - expected[city]['lon']) < 1.0

            # Check sentiment (case-insensitive)
            sentiment_ok = data['sentiment'].upper() == expected[city]['sentiment']

            if lat_ok and lon_ok and sentiment_ok:
              score += 3

        print(score > 0)
        # This will be processed by promptfoo's scoring system, where the final score is weight * (returned_value / 100)
        # To give partial credit, we'd need a more complex setup or a custom provider.
        # For this example, we print True if any part is right, but the real score is calculated inside.
        # A better python assertion would be to return a score from 0 to 1.
        # Let's refine this to return a score.
        final_score = score / 9.0
        return final_score
```

### Example B: Email Network Analysis & Text Extraction

This task tests the agent's ability to parse structured data (CSV), perform network analysis, extract information from text, and create a data visualization.

#### questions.txt

```
Analyze the email dataset provided below to understand the communication network and project involvement.

**Dataset (`emails.csv`):**
```csv
from,to,body
"Alice","Bob","Here is the update on Project Alpha. It's going well."
"Charlie","Alice","Can you review the documentation for Project Beta?"
"Alice","Charlie","Yes, I'll take a look at the Project Beta docs."
"Bob","Alice","Thanks for the Project Alpha update. I have some feedback."
"David","Alice","Regarding Project Alpha, we need to talk."
"Charlie","Bob","Can you help me with Project Beta?"
```

**Tasks:**
1.  Construct a communication network from the data.
2.  For each person (Alice, Bob, Charlie, David), calculate their **degree centrality** (the total number of incoming and outgoing emails).
3.  Generate a network graph visualization as a single base64-encoded PNG image (`data:image/png;base64,...`). The size of each person's node in the graph must be proportional to their degree centrality.
4.  Return a JSON object as your response. The object should have two keys:
    - `centrality`: An object mapping each person's name to their calculated degree centrality.
    - `visualization`: The base64-encoded PNG image string.

```

#### promptfoo.yaml

```yaml
- description: "Email Network Analysis & Text Extraction"
  assert:
    - type: is-json
      value: { "schema": { "type": "object", "properties": { "centrality": {"type": "object"}, "visualization": {"type": "string"} }, "required": ["centrality", "visualization"] } }
      weight: 2

    - type: python
      weight: 8 # 2 points per person
      value: |
        import json
        output = json.loads(output)
        expected_centrality = {
          "Alice": 4, # 1 out, 3 in
          "Bob": 3, # 1 out, 2 in
          "Charlie": 3, # 2 out, 1 in
          "David": 1 # 1 out, 0 in
        }

        score = 0
        centrality = output.get('centrality', {})
        if len(centrality.keys()) != 4:
          return 0

        for person, value in centrality.items():
          if person in expected_centrality and value == expected_centrality[person]:
            score += 2

        return score / 8.0

    - type: llm-rubric
      provider: openai:gpt-4.1-nano
      weight: 10
      preprocess: |
        import json
        data = json.loads(output)
        context['plot'] = data['visualization']
      rubricPrompt: |
        [
          { "role": "system",
            "content": "Grade the network graph. Award *score 1* only iff ALL are true: \
            (a) it is a network graph with 4 nodes labelled Alice, Bob, Charlie, David; \
            (b) node sizes are clearly different, with Alice's node being the largest; \
            (c) connections are visible between nodes. Otherwise score 0. \
            Respond as JSON: {is_network_graph:bool, has_4_nodes:bool, variable_node_sizes:bool, score:number}"
          },
          { "role": "user",
            "content": [
              { "type": "image_url", "image_url": { "url": "{{plot}}" } },
              { "type": "text", "text": "Review the image and grade its features." }
            ]
          }
        ]
      threshold: 0.99
```

### Example C: PDF Data Extraction & Forecasting Narrative

This task challenges the agent to source data from a PDF, perform statistical analysis (forecasting), visualize the result, and generate a human-readable summary (data storytelling).

#### questions.txt

```
Access the financial report at the URL `https://sanand.org/assets/reports/TDS-2024-financials.pdf`.

Inside the document, on page 3, you will find a table titled "Annual Revenue".

**Tasks:**
1.  Extract the data from this table.
2.  Perform a simple linear forecast to predict the revenue for the next two years (2025 and 2026).
3.  Generate a line chart visualizing the data. The chart must show historical revenue (2020-2024) as a solid line and the forecasted revenue (2025-2026) as a dotted line.
4.  Write a brief, two-sentence narrative summarizing the historical revenue trend and the forecast.
5.  Return a single JSON object with three keys:
    - `forecast`: An object where keys are the years "2025" and "2026" and values are the forecasted revenues in millions (as numbers).
    - `chart`: A base64-encoded PNG image string of the chart (`data:image/png;base64,...`).
    - `narrative`: A string containing your two-sentence summary.
```

#### promptfoo.yaml

```yaml
- description: "PDF Extraction & Forecasting"
  assert:
    - type: is-json
      value: { "schema": { "type": "object", "properties": { "forecast": {"type": "object"}, "chart": {"type": "string"}, "narrative": {"type": "string"} }, "required": ["forecast", "chart", "narrative"] } }
      weight: 2

    - type: python
      weight: 8
      value: |
        import json
        output = json.loads(output)
        forecast = output.get('forecast', {})

        # Based on a linear regression of the source data, the slope is ~15.
        # 2024 value is 160. So 2025 should be ~175, 2026 should be ~190.
        # We'll allow a generous range.
        y2025_ok = 170 <= forecast.get('2025', 0) <= 185
        y2026_ok = 185 <= forecast.get('2026', 0) <= 200

        score = 0
        if y2025_ok:
          score += 4
        if y2026_ok:
          score += 4

        return score / 8.0

    - type: llm-rubric
      provider: openai:gpt-4.1-nano
      weight: 10
      preprocess: |
        import json
        data = json.loads(output)
        context['plot'] = data['chart']
        context['narrative'] = data['narrative']
      rubricPrompt: |
        [
          { "role": "system",
            "content": "First, grade the chart. Award *chart_score=1* only if it's a line chart showing a clear distinction (like solid vs dotted lines) between past and future data. Otherwise 0. \
            Second, grade the narrative. It must be 2 sentences. Award *narrative_score=1* only if it correctly mentions a positive historical growth trend and a continued positive forecast. Otherwise 0. \
            Respond as JSON: {chart_score:number, narrative_score:number, score:number}. The final score is the average of the two."
          },
          { "role": "user",
            "content": [
              { "type": "image_url", "image_url": { "url": "{{plot}}" } },
              { "type": "text", "text": "Narrative: {{narrative}}\n\nReview the chart and narrative and grade them." }
            ]
          }
        ]
      threshold: 0.99
```

### Example D: Multimedia Analysis & Generation

This advanced task tests the agent's ability to process and understand multiple media formats (audio, image), perform analysis on them, and synthesize the findings to generate a new creative artifact.

#### questions.txt

```
You are given a URL to an audio clip and a URL to an image.

- Audio URL: `https://sanand.org/assets/media/king-of-the-jungle.mp3`
- Image URL: `https://sanand.org/assets/media/jungle-landscape.jpg`

**Tasks:**
1.  Transcribe the spoken words from the audio file.
2.  Analyze the image to determine if it contains a lion.
3.  Generate a new image that depicts the scene described in the audio clip, set within the landscape shown in the image. The new image should be 512x512 pixels.
4.  Return a single JSON object with three keys:
    - `transcription`: A string containing the transcribed text.
    - `lion_is_in_original_image`: A boolean value (`true` or `false`).
    - `generated_image`: A base64-encoded PNG image string of your newly generated image (`data:image/png;base64,...`).
```

#### promptfoo.yaml

```yaml
- description: "Multimedia Analysis & Generation"
  assert:
    - type: is-json
      weight: 1
      value: { "schema": { "type": "object", "properties": { "transcription": {"type": "string"}, "lion_is_in_original_image": {"type": "boolean"}, "generated_image": {"type": "string"} }, "required": ["transcription", "lion_is_in_original_image", "generated_image"] } }

    - type: similar
      weight: 4
      value: "The king of the jungle let out a mighty roar."
      # The 'similar' assertion uses cosine similarity on embeddings.
      # We extract the 'transcription' field from the JSON output before comparing.
      extract: transcription
      threshold: 0.85

    - type: python
      weight: 5
      value: |
        import json
        output = json.loads(output)
        # The agent should correctly identify that there is no lion in the original image.
        return output.get('lion_is_in_original_image') == False

    - type: llm-rubric
      provider: openai:gpt-4.1-nano
      weight: 10
      preprocess: |
        import json
        data = json.loads(output)
        context['plot'] = data['generated_image']
      rubricPrompt: |
        [
          { "role": "system",
            "content": "You are grading a generated image. The image should depict a LION in a JUNGLE setting. Award *score 1* only if both elements (a clear depiction of a lion AND a jungle/forest background) are present. Otherwise, award *score 0*. \
            Respond as JSON: {has_lion:bool, has_jungle:bool, score:number}"
          },
          { "role": "user",
            "content": [
              { "type": "image_url", "image_url": { "url": "{{plot}}" } },
              { "type": "text", "text": "Review the image and grade its contents based on the criteria." }
            ]
          }
        ]
      threshold: 0.99
```

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
