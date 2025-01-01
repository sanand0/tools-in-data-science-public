## Local LLMs

- Serve `llamafile -a UNIQUE-MODEL-ALIAS -ngl 35 -m Llama-3.2-1B-Instruct-Q8_0.gguf`. [Ref](https://github.com/Mozilla-Ocho/llamafile/blob/main/llama.cpp/server/README.md)
- Use `ngrok http 8080 --response-header-add="Access-Control-Allow-Origin:*"` to expose and test
