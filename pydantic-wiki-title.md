## Wikipedia Page Title Finder Using Pydantic AI

### Problem Statement

Create a FastAPI application that accepts natural language queries about Wikipedia pages and returns the exact Wikipedia page title along with a list of related page suggestions. The agent should use web search capabilities to accurately identify the correct Wikipedia page before returning the title.

### Requirements

Build a Pydantic AI agent that:
elonmuskpage":["Elon Musk","Wealth of Elon Musk","Views of Elon Musk","Trump–Musk feud","Acquisition of Twitter by Elon Musk","Political activities of Elon Musk","Elon Musk salute controversy","Errol Musk","Public image of Elon Musk","Elon Musk (Isaacson book)"]}

1. Accepts GET requests with a query parameter `?q=...` containing a natural language description
2. Uses DuckDuckGo search tool to locate the appropriate Wikipedia page
3. Returns the exact Wikipedia page title wrapped in a Pydantic model
4. Provides a list of 10 related Wikipedia page titles as suggestions

### Input Format

**Endpoint:** `GET /?q={query}`

**Query Parameter:**

- `q` (string): Natural language description of a Wikipedia page

**Examples:**

```
GET /?q=Wikipedia page of the US President in 2025
```


### Expected Output Format

```json
{
  "Wikipedia page of the US President in 2025": [
    "Donald Trump",
    "Presidency of Donald Trump",
    "2024 United States presidential election",
    "List of presidents of the United States",
    "Joe Biden",
    "Kamala Harris",
    "2025 in the United States",
    "White House",
    "United States presidential election",
    "Electoral College (United States)"
  ]
}
```


### Output Structure

- **Key:** Original query string
- **Value:** List of strings containing:
    - List of Wikipedia pages title identified by the agent


### Starter Code

**File: `wiki_title_agent.py`**

```python
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.common_tools.duckduckgo import duckduckgo_search_tool
from typing import List
import wikipedia as wk

class wikipedia_title(BaseModel):
    '''
    The exact title of wikipedia page.
    '''
    title: str

# TODO: Create a Pydantic AI agent with:
# - Model: "openai:gpt-5-nano"
# - Tools: DuckDuckGo search tool
# - Output type: wikipedia_title
# - Instructions: Guide the agent to search the web first, then locate and return exact Wikipedia page title

wiki_title_agent = Agent(
    # YOUR CODE HERE
)

def wiki_page_titles(search_query: str) -> List[str]:
    """
    Search Wikipedia for related page titles.
    
    Args:
        search_query: The search term to query Wikipedia
        
    Returns:
        List of up to 10 Wikipedia page titles
    """
    # YOUR CODE HERE
    pass
```

**File: `main.py`**

```python
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from wiki_title_agent import wiki_title_agent, wiki_page_titles

app = FastAPI(title="Wikipedia Title Finder API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def title(q: str):
    """
    Find Wikipedia page title based on natural language query.
    
    Args:
        q: Natural language query describing a Wikipedia page
        
    Returns:
        Dictionary with query as key and list of related Wikipedia titles as value
    """
    pass

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=7860, reload=True)
```


### Verification

Your API will be tested with pre-computed queries. The returned title should match one of the acceptable titles for each query.

***

