## OpenAI TTS-1 for Text-to-Speech Generation

OpenAI's Text-to-Speech API (TTS-1) converts text into natural-sounding speech using state-of-the-art neural models. Released in March 2025, it offers multiple voices and control over speaking style and speed.

[![Audio Models in the API (15 min)](https://i.ytimg.com/vi_webp/lXb0L16ISAc/sddefault.webp)](https://youtu.be/lXb0L16ISAc)

### Simple speech generation

To generate speech from text, send a POST request to the speech endpoint:

```bash
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1",
    "input": "Hello! This is a test of the OpenAI text to speech API.",
    "voice": "alloy"
  }' --output speech.mp3
```

### Generation options

Control the output with these parameters:

- `model`: `tts-1` (standard) or `tts-1-hd` (higher quality)
- `input`: Text to convert (max 4096 characters)
- `voice`: `alloy`, `echo`, `fable`, `onyx`, `nova`, or `shimmer`
- `response_format`: `mp3` (default), `opus`, `aac`, or `flac`
- `speed`: 0.25 to 4.0 (default 1.0)

```bash
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1-hd",
    "input": "Welcome to our podcast! Today we will be discussing artificial intelligence.",
    "voice": "nova",
    "response_format": "mp3",
    "speed": 1.2
  }' --output podcast_intro.mp3
```

### Costs and optimization

Pricing per 1,000 characters:

- `tts-1`: $0.015
- `tts-1-hd`: $0.030

To optimize costs:

- Use `tts-1` for drafts, `tts-1-hd` for final versions
- Batch process text in chunks
- Cache frequently used phrases
- Choose lower quality formats for testing

## Google Gemini Speech Studio for Text-to-Speech

Google's Gemini Speech Studio offers advanced text-to-speech capabilities with support for multiple languages, voices, and speaking styles.

[![Getting Started with Gemini Speech Studio (7 min)](https://i.ytimg.com/vi_webp/Rx8PmBo9vfI/sddefault.webp)](https://youtu.be/Rx8PmBo9vfI)

For this, you need a `GOOGLE_API_KEY`. You can:

1. Go to the Google Cloud Console: [https://console.cloud.google.com/apis/library/texttospeech.googleapis.com](https://console.cloud.google.com/apis/library/texttospeech.googleapis.com), select or create the project you want and click **Enable**.
2. **Create an API key**. In the Console, navigate to **APIs & Services → Credentials** and click **+ Create Credentials → API key**. Copy the generated key (it’ll look like `AIza…`).

### Simple speech generation

Generate speech using the Gemini API:

```bash
curl -X POST "https://texttospeech.googleapis.com/v1/text:synthesize?key=$GOOGLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": { "text": "Hello, welcome to Gemini Speech Studio!" },
    "voice": { "languageCode": "en-US", "name": "en-US-Neural2-A" },
    "audioConfig": { "audioEncoding": "MP3" }
  }' | jq -r .audioContent | base64 --decode > gemini-speech.mp3
```

### Generation options

Customize synthesis with these parameters:

- `voice`:
  - `languageCode`: Language code (e.g., "en-US", "es-ES")
  - `name`: Voice model name
  - `ssmlGender`: "NEUTRAL", "MALE", or "FEMALE"
- `audioConfig`:
  - `audioEncoding`: "MP3", "WAV", "OGG_OPUS"
  - `speakingRate`: 0.25 to 4.0
  - `pitch`: -20.0 to 20.0
  - `volumeGainDb`: Volume adjustment

```bash
curl -X POST "https://texttospeech.googleapis.com/v1/text:synthesize?key=$GOOGLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "text": "This is a demonstration of advanced speech settings."
    },
    "voice": {
      "languageCode": "en-US",
      "name": "en-US-Neural2-D"
    },
    "audioConfig": {
      "audioEncoding": "MP3",
      "speakingRate": 1.2,
      "pitch": 2.0,
      "volumeGainDb": 1.0
    }
  }' | jq -r .audioContent | base64 --decode > gemini-options.mp3
```

### SSML support

Both APIs support Speech Synthesis Markup Language (SSML) for fine-grained control:

```bash
curl -X POST "https://texttospeech.googleapis.com/v1/text:synthesize?key=$GOOGLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "ssml": "<speak>Hello <break time=\"1s\"/> This text has a pause and <emphasis level=\"strong\">emphasized words</emphasis>.</speak>"
    },
    "voice": { "languageCode": "en-US", "name": "en-US-Neural2-A" },
    "audioConfig": { "audioEncoding": "MP3" }
  }' | jq -r .audioContent | base64 --decode > gemini-ssml.mp3
```

### Costs and optimization

Pricing (per character):

- Standard voices: $0.000004
- Neural voices: $0.000016
- Neural2 voices: $0.000024

To optimize:

- Use standard voices for development
- Cache common phrases
- Batch process where possible
- Choose appropriate audio quality

### Python implementation

Here's a simple Python wrapper for both APIs:

```python
import requests
import base64
import os

openai_key = os.getenv("OPENAI_API_KEY")
google_key = os.getenv("GOOGLE_API_KEY")

def generate_openai_speech(text, voice="alloy", model="tts-1"):
    response = requests.post(
        "https://api.openai.com/v1/audio/speech",
        headers={"Authorization": f"Bearer {openai_key}"},
        json={"model": model, "input": text, "voice": voice}
    )
    return response.content

def generate_gemini_speech(text, voice_name="en-US-Neural2-A"):
    response = requests.post(
        f"https://texttospeech.googleapis.com/v1/text:synthesize?key={google_key}",
        json={
            "input": {"text": text},
            "voice": {"languageCode": "en-US", "name": voice_name},
            "audioConfig": {"audioEncoding": "MP3"}
        }
    )
    return base64.b64decode(response.json()["audioContent"])

if __name__ == "__main__":
    with open("openai_speech.mp3", "wb") as f:
        f.write(generate_openai_speech("Hello from OpenAI's text to speech API!"))
    with open("gemini_speech.mp3", "wb") as f:
        f.write(generate_gemini_speech("Hello from Google's Gemini Speech Studio!"))
```
