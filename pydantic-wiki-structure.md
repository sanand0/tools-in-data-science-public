## Dynamic Wikipedia Data Extractor with Custom Schema

### Problem Statement

Create a FastAPI endpoint that accepts a Wikipedia URL and a dynamic JSON schema, extracts the page content, and uses a Pydantic AI agent to return structured data matching the user-provided schema. The schema can contain any combination of field names and data types.

### Requirements

Build a system that:

1. Accepts POST requests with JSON body containing a Wikipedia URL and custom schema
2. Extracts full Wikipedia page content
3. Dynamically creates a Pydantic model from the provided schema
4. Uses Pydantic AI to extract structured information from the Wikipedia content
5. Returns data matching the exact schema structure provided by the user

### Input Format

**Endpoint:** `POST /structured_json`

**Content-Type:** `application/json`

**Request Body:**

```json
{
  "wiki_url": "https://en.wikipedia.org/wiki/Albert_Einstein",
  "response_schema": {
    "name": "string",
    "birth_year": "int",
    "nationality": "string",
    "notable_achievements": "list[string]",
    "field_of_study": "string"
  }
}
```


### Supported Schema Types

- `string` or `str`: Text data
- `int` or `integer`: Integer numbers
- `float`: Decimal numbers
- `bool` or `boolean`: True/False values
- `list[string]` or `list[str]`: List of strings
- `list[int]`: List of integers
- `list[float]`: List of decimals
- `dict`: Dictionary/object


### Expected Output Format

```json
{
  "name": "Albert Einstein",
  "birth_year": 1879,
  "nationality": "German-born, Swiss and American citizen",
  "notable_achievements": [
    "Theory of Relativity",
    "Mass-energy equivalence (E=mc²)",
    "Photoelectric effect",
    "Nobel Prize in Physics 1921"
  ],
  "field_of_study": "Theoretical Physics"
}
```

### Starter Code

**File: `wiki_json_schema.py`**

```python
from pydantic_ai import Agent
from pydantic import BaseModel, create_model
from typing import Dict, Any, Type
import wikipedia as wk

TYPE_MAPPING = {
    "string": (str, ...),
    # ....
}

def parse_schema_to_pydantic_fields(schema: Dict[str, str]) -> Dict[str, tuple]:
    """
    Convert schema dictionary to Pydantic field definitions.
    
    Args:
        schema: Dictionary with field names as keys and type strings as values
        
    Returns:
        Dictionary with field names and their Pydantic type definitions
    """
    # TODO: Iterate through schema and map each field type to corresponding Pydantic type
    # Use TYPE_MAPPING to get the correct type tuple
    # Default to string type if type not recognized
    
    # YOUR CODE HERE
    pass

def create_dynamic_model(schema: Dict[str, str]) -> Type[BaseModel]:
    """
    Create a dynamic Pydantic model from a schema dictionary.
    
    Args:
        schema: Dictionary with field names as keys and type strings as values
        
    Returns:
        A dynamically created Pydantic BaseModel class
    """
    # TODO:
    # 1. Call parse_schema_to_pydantic_fields() to get pydantic fields
    # 2. Use create_model() to create a dynamic Pydantic model
    # 3. Call model_rebuild() on the created model to resolve all type references
    # 4. Return the model class
    
    # YOUR CODE HERE
    pass

def get_wikipedia_content(url: str) -> str:
    """
    Extract full Wikipedia page content from a given URL.
    
    Args:
        url: Wikipedia page URL (e.g., "https://en.wikipedia.org/wiki/Albert_Einstein")
        
    Returns:
        Full text content of the Wikipedia page
    """
    # TODO:
    # 1. Extract the page title from the URL (text after "/wiki/")
    # 2. Use wikipedia library to fetch the page
    # 3. Return the page content
    
    # YOUR CODE HERE
    pass

async def get_ai_answer(output_model: Type[BaseModel], page_content: str):
    """
    Use Pydantic AI agent to extract structured data from Wikipedia content.
    
    Args:
        output_model: Dynamically created Pydantic model defining the output structure
        page_content: Wikipedia page text content
        
    Returns:
        AgentRunResult with structured output matching the output_model
    """
    # TODO:
    # 1. Create a Pydantic AI Agent with:
    #    - Model: "openai:gpt-5-nano"
    #    - Instructions: Extract required information from provided data only
    #    - Output type: output_model parameter
    # 2. Run the agent with page_content as input
    # 3. Return the agent response
    
    # YOUR CODE HERE
    pass
```



### Verification

Your endpoint will be tested with different Wikipedia pages and various schema configurations to ensure:

- Accurate data extraction
- Correct type conversion
- Handling of missing data
- Support for nested data structures (lists, dictionaries)


***



