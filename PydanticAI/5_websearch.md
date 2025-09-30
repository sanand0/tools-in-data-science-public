## WebSearchTool

Lets the agent search the internet for **up-to-date information**.

**Supported providers:** OpenAI Responses, Anthropic, Gemini, Groq.

### Example 1: Basic Web Search

```python
from dotenv import load_dotenv
load_dotenv()
from pydantic_ai import Agent, WebSearchTool

# Create agent with web search capability
agent = Agent(
    'gemini-2.5-flash', 
    builtin_tools=[WebSearchTool()]
)

result = agent.run_sync('What is the current price of gold in delhi, india in INR for 24carat 10gm gold? Tell me source url also')
print(result.output)

'''
As of September 30, 2025, the current price of 24-carat, 10-gram gold in Delhi, India, is ₹1,16,583.00.

You can find this information on the following source:
*   Mint: https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGMZG4FW-QdePISRX-wVfa1-ou0EU_khN_9eesaTkxVNyPhMO-35cKBD8-mA7y9cTcUn8WqJSBEwSlm2pf8HXO_FeXp_c53p6xiJcR-UvEyXR8AKoq0JeASDokno9BrssS5-e0X
'''
```

**What happens:**

1. Agent receives your question
2. Realizes it needs current data
3. Uses WebSearchTool to search the web
4. Returns answer with latest information

