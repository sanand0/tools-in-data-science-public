## Parsing JSON

JSON is everywhere—APIs, logs, configuration files—and its nested or large structure can challenge memory and processing. In this tutorial, we'll explore tools to flatten, stream, and query JSON data efficiently.

For example, we'll often need to process a multi-gigabyte log file from a web service where each record is a JSON object.

[![JSON Parsing in Python](https://i.ytimg.com/vi/1lxrb_ezP-g/sddefault.jpg)](https://youtu.be/1lxrb_ezP-g)

This requires us to handle complex nested structures, large files that don't fit in memory, or extract specific fields. Here are the key tools and techniques for efficient JSON parsing:

| Tool                                        | Extract from JSON...   | Why                                                               |
| ------------------------------------------- | ---------------------- | ----------------------------------------------------------------- |
| [jq](#command-line-json-processing-with-jq) | JSON in the shell      | Quick data exploration and pipeline processing                    |
| [JMESPath](#jmespath-queries)               | JSON in Python         | Handle complex queries with a clean syntax                        |
| [ijson](#streaming-with-ijson)              | JSON streams in Python | Parse streaming/large JSON files memory-efficiently               |
| [Pandas](#pandas-json-columns)              | JSON columns in Python | Fast analysis of structured data                                  |
| [SQL JSON](#sql-json-functions)             | JSON in databases      | Combine structured and semi-structured data                       |
| [DuckDB](#duckdb-json-processing)           | JSON anywhere          | Fast analysis of JSON files / databases without loading to memory |

**Examples:**

- Use Pandas when you need to transform API responses into a DataFrame for further analysis.
- Leverage ijson when dealing with huge JSON logs where memory is at a premium.
- Apply jq for quick, iterative exploration directly in your terminal.

Practice with these resources:

- [JSONPath Online Evaluator](https://jsonpath.com/): Test JSON queries
- [jq play](https://jqplay.org/): Interactive jq query testing
- [DuckDB JSON Tutorial](https://duckdb.org/docs/data/json): Learn DuckDB JSON functions

### Command-line JSON Processing with jq

[jq](https://jqlang.org/) is a versatile command-line tool for slicing, filtering, and transforming JSON. It excels in quick data exploration and can be integrated into shell scripts for automated data pipelines.

**Example:** Sifting through server logs in JSON Lines format to extract error messages or aggregate metrics without launching a full-scale ETL process.

```bash
# Extract specific fields from JSONL
cat data.jsonl | jq -c 'select(.type == "user") | {id, name}'

# Transform JSON structure
cat data.json | jq '.items[] | {name: .name, count: .details.count}'

# Filter and aggregate
cat events.jsonl | jq -s 'group_by(.category) | map({category: .[0].category, count: length})'
```

### JMESPath Queries

[JMESPath](https://jmespath.org/) offers a declarative query language to extract and transform data from nested JSON structures without needing verbose code. It's a neat alternative when you want to quickly pull out specific values or filter collections based on conditions.

**Example:** Extracting user emails or filtering out inactive records from a complex JSON payload received from a cloud service.

```python
import jmespath

# Example queries
data = {
    "locations": [
        {"name": "Seattle", "state": "WA", "info": {"population": 737015}},
        {"name": "Portland", "state": "OR", "info": {"population": 652503}}
    ]
}

# Find all cities with population > 700000
cities = jmespath.search("locations[?info.population > `700000`].name", data)
```

### Streaming with ijson

Loading huge JSON files all at once can quickly exhaust system memory. [ijson](https://ijson.readthedocs.io/en/latest/) lets you stream and process JSON incrementally. This method is ideal when your JSON file is too large or when you only need to work with part of the data.

**Example:** Processing a continuous feed from an API that returns a large JSON array, such as sensor data or event logs, while filtering on the fly.

```python
import ijson

async def process_large_json(filepath: str) -> list:
    """Process a large JSON file without loading it entirely into memory."""
    results = []

    with open(filepath, 'rb') as file:
        # Stream objects under the 'items' key
        parser = ijson.items(file, 'items.item')
        async for item in parser:
            if item['value'] > 100:  # Process conditionally
                results.append(item)

    return results
```

### Pandas JSON Columns

[Pandas](https://pandas.pydata.org/) makes it easy to work with tabular data that includes JSON strings. When you receive API data where one column holds nested JSON, flattening these structures lets you analyze and visualize the data using familiar DataFrame operations.

**Example:** Flattening customer records stored as nested JSON in a CSV file to extract demographic details and spending patterns.

```python
import pandas as pd

# Parse JSON strings in a column
df = pd.DataFrame({'json_col': ['{"name": "Alice", "age": 30}', '{"name": "Bob", "age": 25}']})
df['parsed'] = df['json_col'].apply(pd.json_normalize)

# Normalize nested JSON columns
df = pd.read_csv('data.csv')
df_normalized = pd.json_normalize(
    df['nested_json'].apply(json.loads),
    record_path=['items'],        # List of nested objects to unpack
    meta=['id', 'timestamp']      # Keep these columns from parent
)
```

### SQL JSON Functions

[SQL](https://en.wikipedia.org/wiki/SQL:2016) supports built-in JSON functions allow you to query and manipulate JSON stored within relational databases.
These are implemented by most popular databases, including
[SQLite](https://www.sqlite.org/json1.html),
[PostgreSQL](https://www.postgresql.org/docs/current/functions-json.html), and
[MySQL](https://dev.mysql.com/doc/refman/8.4/en/json-function-reference.html).
This is especially handy when you have a hybrid data model, combining structured tables with semi-structured JSON columns.

**Example:** An application that stores user settings or application logs as JSON in a SQLite database, enabling quick lookups and modifications without external JSON parsing libraries.

```sql
SELECT
    json_extract(data, '$.name') as name,
    json_extract(data, '$.details.age') as age
FROM users
WHERE json_extract(data, '$.active') = true
```

### DuckDB JSON Processing

[DuckDB](https://duckdb.org/) shines when analyzing JSON/JSONL files directly, making it a powerful tool for data analytics without the overhead of loading entire datasets into memory. Its SQL-like syntax simplifies exploratory analysis on nested data.

**Example:** Performing ad-hoc analytics on streaming JSON logs from a web service, such as calculating average response times or aggregating user behavior metrics.

```sql
SELECT
    json_extract_string(data, '$.user.name') as name,
    avg(json_extract_float(data, '$.metrics.value')) as avg_value
FROM read_json_auto('data/*.jsonl')
GROUP BY 1
HAVING avg_value > 100
```
