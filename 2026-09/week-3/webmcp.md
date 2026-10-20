# WebMCP

## Learn by Playing

Start with these demos from [GoogleChromeLabs' WebMCP collection](https://github.com/GoogleChromeLabs/webmcp-tools):

| Site | What to try | What you learn |
|------|-------------|----------------|
| [WebMCP Maze](https://googlechromelabs.github.io/webmcp-tools/demos/webmcp-maze/) | Guide an agent to the exit | Observation, planning, tool calls, and feedback |
| [Mystery Doors](https://googlechromelabs.github.io/webmcp-tools/demos/doors/) | Ask the agent to explore the doors | Tools and page context across navigation |

### Set Up the Browser

1. Follow the [demo requirements](https://github.com/GoogleChromeLabs/webmcp-tools/blob/main/demos/README.md), which currently specify **Chrome 155 or later**.
2. For local development, enable `chrome://flags/#enable-webmcp-testing` and relaunch Chrome. See [Chrome's setup guide](https://developer.chrome.com/docs/ai/webmcp).
3. Install the [Model Context Tool Inspector](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd), then open a demo and the extension's side panel.
4. Inspect a tool's description and JSON input schema. You can execute tools manually; the Inspector's Gemini agent mode requires an API key. See the [Inspector instructions](https://github.com/beaufortfrancois/model-context-tool-inspector).

**If no tools appear:** check the browser version, enable the testing flag, relaunch, and reload the demo. Enabling WebMCP alone does not install an AI agent.

### Mini-Lab: Escape the Maze

The [maze source and instructions](https://github.com/GoogleChromeLabs/webmcp-tools/tree/main/demos/webmcp-maze) document these tools:

| Tool | Purpose |
|------|---------|
| `start_game` | Start a maze |
| `look` | Inspect nearby walls, paths, and the exit |
| `move` | Move in a cardinal direction |
| `pickup` / `drop` | Manage a carried item |
| `use` | Use an item on a blocker, such as a key on a door |

In the Inspector's agent chat, try:

```text
Start a new maze. Inspect my surroundings and explain the available paths.
Make one valid move, then inspect again and report what changed.
```

Then try:

```text
Help me reach the exit. Use observations to plan your moves, remember visited
locations, and inspect the result after each action. Use items when needed.
```

Watch the tool trace alongside the game. Does a reported move match the visible state? Does the agent recover from a blocked path? If you are using manual execution, follow the same observation–action cycle using arguments from each tool's displayed schema.

**Checkpoint:** record one tool's name, its arguments, its result, and the visible change. Explain why valid tool calls alone do not guarantee that the agent will solve the maze.

---

## What Is WebMCP?

WebMCP lets a website expose its functionality as **structured tools that an AI agent can call**. A game might offer `look` and `move`; a course dashboard might offer `filter_assignments`. The website describes each tool and its inputs, and its JavaScript performs the action. The user and agent work with the same application state. See the [WebMCP draft specification](https://webmachinelearning.github.io/webmcp/).

**After this lesson, you should be able to:** inspect a site's tools, use them to play a game, and explain where this approach is useful.

> **Status checked: 20 October 2026.** WebMCP is an experimental Community Group draft, with APIs and browser support still changing. Use the linked setup instructions if your browser behaves differently.

---

## The Mental Model

```text
User: "Help me escape the maze."
    ↓
Agent discovers the game's tools and their input schemas
    ↓
Agent calls a tool → game updates → tool returns the result
    ↓
Agent observes the result and chooses the next action
```

| Approach | How the agent interacts |
|----------|------------------------|
| Browser automation | Reads page elements or screenshots, then clicks and types |
| WebMCP | Calls actions explicitly exposed by the website |
| Remote MCP server | Connects an MCP client to tools provided by a server |

WebMCP runs tools in the page's context. It does not automatically make a website a remote MCP endpoint, give every chatbot access to the page, or add tools to arbitrary websites. You need a compatible browser and agent. The [interactive explainer](https://googlechromelabs.github.io/webmcp-tools/demos/explainer/) illustrates the difference with a booking widget.

---

## How a Website Exposes a Tool

WebMCP provides two approaches: the [Imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api) registers JavaScript functions; the [Declarative API](https://developer.chrome.com/docs/ai/webmcp/declarative-api) annotates HTML forms with attributes such as `toolname` and `tooldescription`.

Here is a minimal read-only tool for a learning game's score. Save this as `index.html` in an empty directory:

```html
<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>WebMCP Score Demo</title>
<h1>Learning Game</h1>
<p>Score: <output id="score">3</output> / 5</p>
<p id="status">Checking WebMCP support…</p>
<script type="module">
  const status = document.querySelector("#status");

  if (!document.modelContext) {
    status.textContent = "Use a WebMCP-capable browser with testing enabled.";
  } else {
    await document.modelContext.registerTool({
      name: "get_score",
      description: "Read the current learning game score out of five.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => JSON.stringify({
        score: Number(document.querySelector("#score").textContent),
        maximum: 5,
      }),
    });
    status.textContent = "get_score is registered. Open the tool inspector.";
  }
</script>
</html>
```

Serve the directory with `python -m http.server 8000`, open `http://localhost:8000`, and invoke `get_score` with `{}` in the Inspector. Expect a score of `3` and maximum of `5`. This example exposes existing page data; it does not include a quiz or an agent. Local WebMCP examples need a secure context, which `localhost` provides.

---

## Practicality: When Would You Use It?

For a learning site, possible tools include `get_current_question`, `submit_answer`, and `request_hint`. A tutor could read progress, offer a hint, and let the learner attempt the question. For a data dashboard, `filter_results` could apply a user's requested filters while updating the chart they see. These are suggested designs for your own applications.

The practical benefit is an explicit interface: the agent receives meaningful actions and typed inputs, reducing the need to infer a sequence of clicks. Measure completion rate, errors, and tool calls on the same tasks before claiming an improvement.

Keep the scope realistic:

- **Adoption:** the site must expose tools and the agent must support them. Keep the normal interface usable as support evolves.
- **Correctness:** validate inputs in application code, enforce quiz rules, and return useful errors. A schema helps describe inputs; it does not replace validation.
- **State:** update the visible interface and return the actual outcome so the learner and agent agree on what happened.
- **Permissions:** retain server-side authentication and authorization. Require confirmation for consequential actions such as publishing grades or making purchases.

The [WebMCP best practices](https://developer.chrome.com/docs/ai/webmcp/best-practices) explain tool design, validation, state updates, and evaluation. For consequential actions and untrusted content, also read [Chrome's WebMCP security guidance](https://developer.chrome.com/docs/ai/webmcp/secure-tools).
