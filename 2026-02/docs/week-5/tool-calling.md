# Function / Tool Calling

Tool calling is the bridge between LLMs and external systems (APIs, databases, the OS).

## Schema Design
LLMs need well-defined JSON schemas to understand what tools are available.
```python
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather in a location",
        "parameters": {
            "type": "object",
            "properties": {"location": {"type": "string"}}
        }
    }
}]
```

## Parallel Tool Calling
Modern LLMs can invoke multiple tools simultaneously. If asked "What is the weather in Tokyo and Paris?", the model can return two tool calls in a single response, dramatically reducing latency.

## Best Practices
- **Descriptions matter:** The LLM relies heavily on parameter descriptions. 
- **Graceful failure:** If a tool fails, return the error to the LLM so it can correct its parameters.

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

