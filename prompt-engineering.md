## Prompt Engineering

Prompt engineering is the process of crafting effective prompts for large language models (LLMs).

One of the best ways to approach prompt engineering is to think of LLMs as a smart colleague (with amnesia) who needs explicit instructions.

The most authoritative guides are from the LLM providers themselves:

- [Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/)
- [Google](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/introduction-prompt-design)
- [OpenAI](https://platform.openai.com/docs/guides/prompt-engineering)

Here are some best practices:

### Use prompt optimizers

They rewrite your prompt to improve it. Explore:

- [Anthropic Prompt Optimizer](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-improver)
- [OpenAI Prompt Generation](https://platform.openai.com/docs/guides/prompt-generation)
- [Google AI-powered prompt writing tools](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/ai-powered-prompt-writing)

### Be clear, direct, and detailed

Be explicit and thorough. Include all necessary context, goals, and details so the model understands the full picture.

- **BAD**: _Explain gravitation lensing._ (Reason: Vague and lacks context or detail.)
- **GOOD**: _Explain the concept of gravitational lensing to a high school student who understands basic physics, including how it’s observed and its significance in astronomy._ (Reason: Specifies the audience, scope, and focus.)

> When you ask a question, don’t be vague. Spell it out. Give every detail the listener needs.
> The clearer you are, the better the answer you’ll get.
> For example, don't just say, Explain Gravitation Lensing.
> Say, Explain the concept of gravitational lensing to a high school student who understands basic physics, including how it’s observed and its significance in astronomy.

[Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/be-clear-and-direct)
| [OpenAI](https://platform.openai.com/docs/guides/prompt-engineering#tactic-include-details-in-your-query-to-get-more-relevant-answers)
| [Google](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/clear-instructions)

### Give examples

Provide 2-3 relevant examples to guide the model on the style, structure, or format you expect. This helps the model produce outputs consistent with your desired style.

- **BAD**: _Explain how to tie a bow tie._ (Reason: No examples or reference points given.)
- **GOOD**:
  _Explain how to tie a bow tie. For example:_

  1. _To tie a shoelace, you cross the laces and pull them tight..._
  2. _To tie a necktie, you place it around the collar and loop it through..._

  _Now, apply a similar step-by-step style to describe how to tie a bow tie._ (Reason: Provides clear examples and a pattern to follow.)

> Give examples to the model. If you want someone to build a house, show them a sketch. Don’t just say ‘build something.’
> Giving examples is like showing a pattern. It makes everything easier to follow.

[Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting)
| [OpenAI](https://platform.openai.com/docs/guides/prompt-engineering#tactic-provide-examples)
| [Google](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/few-shot-examples)

### Think step by step

Instruct the model to reason through the problem step by step. This leads to more logical, well-structured answers.

- **BAD**: _Given this transcript, is the customer satisfied?_ (Reason: No prompt for structured reasoning.)
- **GOOD**: _Given this transcript, is the customer satisfied? Think step by step._ (Reason: Directly instructs the model to break down reasoning into steps.)

> Ask the model to think step by step. Don’t ask the model to just give the final answer right away.
> That's like asking someone to answer with the first thing that pops into their head.
> Instead, ask them to break down their thought process into simple moves — like showing each rung of a ladder as they climb.
> For example, when thinking step by step, the model could, A, list each customer question, B, find out if it was addressed, and C, decide that the agent answered only 2 out of the 3 questions.

[Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought)
| [OpenAI](https://platform.openai.com/docs/guides/prompt-engineering#strategy-give-models-time-to-think)
| [Google](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/break-down-prompts)

### Assign a role

Specify a role or persona for the model. This provides context and helps tailor the response style.

- **BAD**: _Explain how to fix a software bug._ (Reason: No role or perspective given.)
- **GOOD**: _You are a seasoned software engineer. Explain how to fix a software bug in legacy code, including the debugging and testing process._ (Reason: Assigns a clear, knowledgeable persona, guiding the style and depth.)

> Tell the model who they are. Maybe they’re a seasoned software engineer fixing a legacy bug, or an experienced copy editor revising a publication.
> By clearly telling the model who they are, you help them speak with just the right expertise and style.
> Suddenly, your explanation sounds like it’s coming from a true specialist, not a random voice.

[Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts)
| [OpenAI](https://platform.openai.com/docs/guides/prompt-engineering#tactic-ask-the-model-to-adopt-a-persona)
| [Google](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/assign-role)

### Use XML to structure your prompt

Use XML tags to separate different parts of the prompt clearly. This helps the model understand structure and requirements.

- **BAD**: _Here’s what I want: Provide a summary and then an example._ (Reason: Unstructured, no clear separation of tasks.)
- **GOOD**:
  ```xml
  <instructions>
    Provide a summary of the concept of machine learning.
  </instructions>
  <example>
    Then provide a simple, concrete example of a machine learning application (e.g., an email spam filter).
  </example>
  ```
  (Reason: Uses XML tags to clearly distinguish instructions from examples.)

> Think of your request like a box. XML tags are neat little labels on that box.
> They help keep parts sorted, so nothing gets lost in the shuffle.

[Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags)
| [OpenAI](https://platform.openai.com/docs/guides/prompt-engineering#tactic-use-delimiters-to-clearly-indicate-distinct-parts-of-the-input)
| [Google](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/structure-prompts)

### Use Markdown to format your output

Encourage the model to use Markdown for headings, lists, code blocks, and other formatting features to produce structured, easily readable answers.

- **BAD**: _Give me the steps in plain text._ (Reason: No specific formatting instructions, less readable.)
- **GOOD**: _Provide the steps in a markdown-formatted list with ### headings for each section and numbered bullet points._ (Reason: Directly instructs to use Markdown formatting, making output more structured and clear.)
- **BAD**: _Correct the spelling and show the corrections._ (Reason: No specific formatting instructions)
- **GOOD**: _Correct the spelling, showing &lt;ins&gt;additions&lt;/ins&gt; and &lt;del&gt;deletions&lt;/del&gt;._ (Reason: Directly instructs to use HTML formatting, making output more structured and clear.)

> Markdown is a simple formatting language that all models understand.
> You can have them add neat headings, sections, bold highlights, and bullet points.
> These make complex documents more scannable and easy on the eyes.

### Use JSON for machine-readable output

When you need structured data, ask for a JSON-formatted response. This ensures the output is machine-readable and organized.

- **BAD**: _Just list the items._ (Reason: Unstructured plain text makes parsing harder.)
- **GOOD**:

  ````markdown
  Organize as an array of objects in a JSON format, like this:

  ```json
  [
    { "name": "Item 1", "description": "Description of Item 1" },
    { "name": "Item 2", "description": "Description of Item 2" },
    { "name": "Item 3", "description": "Description of Item 3" }
  ]
  ```
  ````

  (Reason: Instructing JSON format ensures structured, machine-readable output.)

Note: Always use [JSON schema](playground#attachments) if possible. [JSON schema](https://json-schema.org/) is a way to describe the structure of JSON data. An easy way to get the JSON schema is to give ChatGPT sample output and ask it to generate the schema.

> Imagine you’re organizing data for a big project. Plain text is like dumping everything into one messy pile — it’s hard to find what you need later.
> JSON, on the other hand, is like packing your data into neat, labeled boxes within boxes.
> Everything has its place: fields like ‘name,’ ‘description,’ and ‘value’ make the data easy to read, especially for machines.
> For example, instead of just listing items, you can structure them as a JSON array, with each item as an object.
> That way, when you hand it to a program, it’s all clear and ready to use.

### Prefer Yes/No answers

Convert rating or percentage questions into Yes/No queries. LLMs handle binary choices better than numeric scales.

- **BAD**: _On a scale of 1-10, how confident are you that this method works?_ (Reason: Asks for a numeric rating, which can be imprecise.)
- **GOOD**: _Is this method likely to work as intended? Please give a reasoning and then answer Yes or No._ (Reason: A binary question simplifies the response and clarifies what’s being asked.)

> Don’t ask ‘On a scale of one to five...’. Models are not good with numbers.
> They don't know how to grade something 7 versus 8 on a 10 point scale. ‘Yes or no?’ is simple. It’s clear. It’s quick.
> So, break your question into simple parts that they can answer with just a yes or a no.

### Ask for reason first, then the answer

Instruct the model to provide its reasoning steps _before_ stating the final answer. This makes it less likely to justify itself and more likely to think deeper, leading to more accurate results.

- **BAD**: _What is the best route to take?_ (Reason: Direct question without prompting reasoning steps first.)
- **GOOD**: _First, explain your reasoning step by step for how you determine the best route. Then, after you’ve reasoned it out, state your final recommendation for the best route._ (Reason: Forces the model to show its reasoning process before giving the final answer.)

> BEFORE making its final choice, have the model talk through their thinking. Reasoning first, answer second.
> That way, the model won't be tempted to justify an answer that they gave impulsively. It is also more likely to think deeper.

### Use proper spelling and grammar

A well-written, grammatically correct prompt clarifies expectations. Poorly structured prompts can confuse the model.

- **BAD**: _xplin wht the weirless netork do? make shur to giv me a anser??_ (Reason: Poor spelling and unclear instructions.)
- **GOOD**: _Explain what a wireless network does. Please provide a detailed, step-by-step explanation._ (Reason: Proper spelling and clarity lead to a more coherent response.)

> If your question sounds like gibberish, expect a messy answer. Speak cleanly.
> When you do, the response will be much clearer.

## Video Tutorials

Watch [Prompt Engineering Tutorial – Master ChatGPT and LLM Responses (41 min)](https://youtu.be/_ZvnD73m40o). It covers:

1. Basics of **AI and large language models**.
2. How to write clear and detailed prompts to improve answers.
3. Tips for creating interactive and personalized AI responses.
4. Advanced topics like **AI mistakes** (hallucinations) and **text embeddings** (how AI understands words).
5. Fun examples, like making AI write poems or correct grammar.

[![Prompt Engineering Tutorial – Master ChatGPT and LLM Responses](https://i.ytimg.com/vi_webp/_ZvnD73m40o/sddefault.webp)](https://youtu.be/_ZvnD73m40o)
