# Capstone — Live Multilingual Travel Translator

## Objective
Build an end-to-end API that takes spoken audio in one language and returns spoken audio translated into another language.

## Architecture
1. **Input:** User uploads an audio file (`.wav` or `.mp3`) via FastAPI.
2. **STT:** Use Whisper to transcribe the audio to text.
3. **LLM:** Use Claude/GPT to translate the text to the target language (e.g., English to Japanese).
4. **TTS:** Use ElevenLabs (or OpenAI TTS) to generate audio of the translated text.
5. **Output:** Return the generated audio file to the user.

## Deliverables
- FastAPI source code.
- A README documenting how to test the endpoint with `curl`.

---

