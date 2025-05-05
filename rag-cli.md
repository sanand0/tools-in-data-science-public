## Retrieval Augmented Generation (RAG) with the CLI

Retrieval Augmented Generation (RAG) combines retrieval (searching a knowledge base) with generation (using an LLM) to produce answers grounded in your own documents. Instead of relying solely on a general-purpose LLM, RAG lets you feed it the most relevant chunks from your corpus at query time, improving accuracy, reducing hallucinations, and allowing you to answer domain‑specific questions without fine‑tuning.

In particular, you can answer questions that are hard to answer with a keyword search. For example:

```bash
Q="What does the author affectionately call the => syntax?"
# Answer: fat arrow

Q="What lets you walk every child node of a ts.Node?"
# Answer: node.getChildren()

Q="What are code pieces like comments and whitespace that aren’t in the AST called?"
# Answer: trivia

Q="Which operator converts any value into an explicit boolean?"
# Answer: !!
```

You can implement RAG entirely from your terminal, without writing a single line of application code. Below is a step‑by‑step example using the TypeScript book as a data source.

### 1. Clone the repository

```bash
git clone --depth 1 https://github.com/basarat/typescript-book
cd typescript-book
```

- `--depth 1` fetches only the latest commit to minimize download size.
- `cd typescript-book` moves into the project folder.

You'll now be in a new folder `typescript-book` containing the repo.

### 2. Split Markdown files into chunks

```bash
(
  shopt -s globstar
  for f in **/*.md; do
    uvx --from split_markdown4gpt mdsplit4gpt "$f" --model gpt-4o --limit 4096 --separator "===SPLIT===" \
    | sed '1s/^/===SPLIT===\n/' \
    | jq -R -s -c --arg file "$f" '
      split("===SPLIT===")[1:]
      | to_entries
      | map({
          id: ($file + "#" + (.key | tostring)),
          content: .value
        })[]
    '
  done
) | tee chunks.json
```

- `shopt -s globstar`: lets `**/*.md` match Markdown files in all subdirectories. [bash shopt manual](https://www.gnu.org/software/bash/manual/html_node/The-Shopt-Builtin.html)
- `uvx --from split_markdown4gpt mdsplit4gpt`: [a tool](https://github.com/twardoch/split-markdown4gpt) that splits Markdown into LLM‑sized chunks:
  - `--model gpt-4o`: uses GPT‑4o token limits
  - `--limit 4096`: max tokens per chunk
  - `--separator "===SPLIT==="`: custom split marker
- `sed '1s/^/===SPLIT===\n/'`: ensures the very first chunk starts with the separator (GNU sed manual)
- `jq -R -s -c --arg file "$f"`: uses [jq](https://stedolan.github.io/jq/manual/) to convert chunks to JSON
  - `-R`: read raw input
  - `-s`: slurp entire input into a single string
  - `-c`: compact JSON output
  - builds an array of objects `{id, content}`, where `id` is `filename#chunkIndex`
- `tee chunks.json`: writes the resulting JSON array to `chunks.json` while printing it to stdout.

You'll now have a `chunks.json` that has one `{id, content}` JSON object per line.

### 3. Generate embeddings

```bash
llm embed-multi typescript-book --model 3-small --store --format nl chunks.json
```

- `embed-multi`: computes embeddings for each entry in `chunks.json`.
- `typescript-book`: a namespace or collection name for storage.
- `--model 3-small`: selects the embedding model.
- `--store`: save embeddings in the default backend.
- `--format nl`: input is newline‑delimited JSON. [llm CLI embed-multi](https://github.com/kerenter/llm#embed-multi)

This stores the embeddings in a collection called `typescript-book`.

```bash
llm collections path  # shows where the collections are stored
llm collections delete typescript-book  # deletes the typescript-book collection
```

### 4. Find similar topics

```bash
llm similar typescript-book -n 3 -c "What does the author affectionately call the => syntax?"
```

This returns the 3 chunksmost similar to the question posed.

- `similar`: retrieves the top `n` most similar chunks from the embeddings store.
- `-n 3`: return three results.
- `-c`: the user’s query string.

### 5. Answer a question using retrieved context

```bash
Q="What does the author affectionately call the => syntax?"
llm similar typescript-book -n 3 -c "$Q" \
  | jq '.content' \
  | llm -s "$Q - Answer ONLY from these notes. Cite verbatim from notes." \
  | uvx streamdown
```

This answers the question in natural language following these steps:

1. Store the query in `Q`.
2. Retrieve the top 3 matching chunks.
3. `jq '.content'` extracts just the text snippets.
4. Pipe into `llm -s`, instructing the model:
   - `-s`: stream a prompt directly to the LLM.
   - `"$Q - Answer ONLY from these notes. Cite verbatim from notes."`: ensures the response is grounded.
5. `uvx streamdown` formats the streamed LLM output for easy reading.

<!--

More questions that cannot be answered via keyword search:

Q="Which shorthand lets you both declare and initialize a class member in one go?"
# Answer: constructor(public x:number)

Q="What syntax allows initializing class fields outside the constructor?"
# Answer: property initializer

Q="What property name do discriminated unions use to narrow types?"
# Answer: kind

Q="Which keyword pauses and resumes execution in generator functions?"
# Answer: yield

Q="What JSON-style syntax defines overloads in a callable type annotation?"
# Answer: { (foo: string): string; }

Q="What filename do you use to declare globals available across your entire TS project?"
# Answer: global.d.ts

Q="What TS helper wraps subclass constructors for ES5-style inheritance?"
# Answer: __extends

Q="What option in tsconfig.json turns on ES7 decorator support?"
# Answer: experimentalDecorators

Q="What directive in tsconfig.json preserves raw JSX output?"
# Answer: jsx: "preserve"

Q="In async/await, what wraps generator code to return a Promise?"
# Answer: __awaiter

Q="What config field controls which .ts/.js files to include in compilation?"
# Answer: include / exclude

Q="What npm package is recommended for structural deep-equality checks?"
# Answer: deep-equal
-->
