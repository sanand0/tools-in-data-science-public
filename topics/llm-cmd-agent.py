#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = ["requests"]
# ///

import requests
import os
import subprocess
import sys
import re
from typing import Dict, List, Optional, Tuple

# Get API key from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("Error: OPENAI_API_KEY environment variable not set")
    sys.exit(1)

def call_openai_api(messages: List[Dict[str, str]], model: str = "gpt-4.1-nano") -> Tuple[str, bool]:
    """Call the OpenAI Chat Completions API and return the response."""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.7
    }

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers=headers,
        json=payload
    )

    if response.status_code != 200:
        print(f"Error: API request failed with status {response.status_code}")
        print(response.text)
        sys.exit(1)

    result = response.json()
    content = result["choices"][0]["message"]["content"]

    # Check if the response contains code that can be executed
    has_code = bool(re.search(r'```(bash|sh)[\s\S]*?```', content))

    return content, has_code

def extract_code(text: str) -> Optional[str]:
    """Extract code blocks from markdown text."""
    # Look for code blocks with python, bash, or sh syntax highlighting
    code_pattern = re.compile(r'```(?:bash|sh)?\s*([\s\S]*?)\s*```')
    matches = code_pattern.findall(text)

    if not matches:
        return None

    # Return the first code block found
    return matches[0].strip()

def run_command(command: str) -> Tuple[str, int]:
    """Run a shell command and return stdout/stderr and return code."""
    try:
        result = subprocess.run(
            command,
            shell=True,
            text=True,
            capture_output=True
        )
        output = result.stdout
        if result.stderr:
            output += "\n" + result.stderr
        return output, result.returncode
    except Exception as e:
        return f"Error executing command: {str(e)}", 1

def main():
    if len(sys.argv) < 2:
        print("Usage: python llm-cmd-agent.py 'your task description'")
        sys.exit(1)

    task = " ".join(sys.argv[1:])
    print(f"Task: {task}")

    # Initial prompt to the LLM
    messages = [
        {"role": "system", "content": "Generate bash code in a single ```sh ... ``` code fence to provide accomplish the user's task"},
        {"role": "user", "content": task}
    ]

    max_attempts = 3
    for attempt in range(max_attempts):
        # Call the API
        print("Thinking...")
        response, has_code = call_openai_api(messages)

        if not has_code:
            print("No executable code found in the response.")
            print("\nLLM Response:")
            print(response)
            break

        # Extract and run the code
        code = extract_code(response)
        if not code:
            print("Failed to extract code from the response.")
            break

        print("\nGenerated Code:")
        print("-" * 40)
        print(code)
        print("-" * 40)

        # Execute the code
        print("\nExecuting code...")
        output, return_code = run_command(code)

        print("\nOutput:")
        print("-" * 40)
        print(output)
        print("-" * 40)

        # Check if the command was successful
        if return_code == 0:
            # Ask the LLM to interpret the results
            messages.append({"role": "assistant", "content": response})
            messages.append({"role": "user", "content": f"The code executed successfully. Here's the output:\n\n{output}\n\nPlease interpret these results and provide a clear answer to my original task."})

            final_response, _ = call_openai_api(messages)
            print("\nFinal Answer:")
            print("-" * 40)
            print(final_response)
            print("-" * 40)
            break
        else:
            # If the command failed, ask the LLM to fix it
            messages.append({"role": "assistant", "content": response})
            messages.append({"role": "user", "content": f"The code execution failed with return code {return_code}. Here's the output:\n\n{output}\n\nPlease fix the code and try again."})

            if attempt < max_attempts - 1:
                print(f"\nAttempt {attempt + 1} failed. Trying again...")
            else:
                print("\nAll attempts failed. Please try a different approach.")

if __name__ == "__main__":
    main()
