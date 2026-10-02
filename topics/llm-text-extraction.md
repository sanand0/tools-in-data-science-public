## LLM Text Extraction

[JSON](json.md) is one of the most widely used formats in the world for applications to exchange data.

[![LLM Extraction](https://i.ytimg.com/vi_webp/72514uGffPE/sddefault.webp)](https://youtu.be/72514uGffPE)

This video explains how to use LLMs to extract structure from unstructured data, covering:

- **LLM for Data Extraction**: Use OpenAI's API to extract structured information from unstructured data like addresses.
- **JSON Schema**: Define a JSON schema to ensure consistent and structured output from the LLM.
- **Prompt Engineering**: Craft effective prompts to guide the LLM's response and improve accuracy.
- **Data Cleaning**: Use string functions and OpenAI's API to clean and standardize data.
- **Data Analysis**: Analyze extracted data using Pandas to gain insights.
- **LLM Limitations**: Understand the limitations of LLMs, including potential errors and inconsistencies in output.
- **Production Use Cases**: Explore real-world applications of LLMs for data extraction, such as customer service email analysis.

Here are the links used in the video:

- [Jupyter Notebook](https://colab.research.google.com/drive/1Z8mG-RPTSYY4qwkoNdzRTc4StbnwOXeE)
- [JSON Schema](https://json-schema.org/)
- [Function calling](https://platform.openai.com/docs/guides/function-calling)

Structured Outputs is a feature that ensures the model will always generate responses that adhere to your supplied
[JSON Schema](https://json-schema.org/overview/what-is-jsonschema), so you don't need to worry about the model omitting a required key,
or hallucinating an invalid enum value.

```bash
curl https://api.openai.com/v1/chat/completions \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "Content-Type: application/json" \
-d '{
  "model": "gpt-4o-2024-08-06",
  "messages": [
    { "role": "system", "content": "You are a helpful math tutor. Guide the user through the solution step by step." },
    { "role": "user", "content": "how can I solve 8x + 7 = -23" }
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "math_response",
      "strict": true
      "schema": {
        "type": "object",
        "properties": {
          "steps": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": { "explanation": { "type": "string" }, "output": { "type": "string" } },
              "required": ["explanation", "output"],
              "additionalProperties": false
            }
          },
          "final_answer": { "type": "string" }
        },
        "required": ["steps", "final_answer"],
        "additionalProperties": false
      }
    }
  }
}'
```

Here's what the `response_format` tells OpenAI. The items marked ⚠️ are OpenAI specific requirements for the JSON schema.

- `"type": "json_schema"`: We want you to generate a JSON response that follows this schema.
- `"json_schema":`: We're going to give you a schema.
  - `"name": "math_response"`: The schema is called `math_response`. (We can call it anything.)
  - `"strict": true`: Follow the schema exactly.
  - `"schema":`: Now, here's the actual JSON schema.
    - `"type": "object"`: Return an object. ⚠️ The root object **must** be an object.
    - `"properties":`: The object has these properties:
      - `"steps":`: There's a `steps` property.
        - `"type": "array"`: It's an array.
        - `"items":`: Each item in the array...
          - `"type": "object"`: ... is an object.
          - `"properties":`: The object has these properties:
            - `"explanation":`: There's an `explanation` property.
              - `"type": "string"`: ... which is a string.
            - `"output":`: There's an `output` property.
              - `"type": "string"`: ... which is a string, too.
          - `"required": ["explanation", "output"]`: ⚠️ You **must** add `"required": [...]` and include **all** fields int he object.
          - `"additionalProperties": false`: ⚠️ OpenAI requires every object to have `"additionalProperties": false`.
      - `"final_answer":`: There's a `final_answer` property.
        - `"type": "string"`: ... which is a string.
    - `"required": ["steps", "final_answer"]`: ⚠️ You **must** add `"required": [...]` and include **all** fields in the object.
    - `"additionalProperties": false`: ⚠️ OpenAI requires every object to have `"additionalProperties": false`.
