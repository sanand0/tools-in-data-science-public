# Speech AI

> **Audio is a data source you can query. Transcribe it, timestamp it, and it becomes searchable text like anything else you scraped.**

⏱ ~8 min read · ~12 min hands-on
🔗 needs: [Video Understanding](/2026-05/week-6/video-understanding/) · [Local LLMs](/2026-05/week-2/11-local-llms-1-basics/)

Podcasts, lectures, earnings calls, support recordings — enormous amounts of information exist only as speech. Speech-to-text (STT) turns it into text you can search, chunk, and feed to an LLM.

## Try it in 5 minutes — transcribe with timestamps

`faster-whisper` runs Whisper on a CTranslate2 backend — several times quicker than the reference implementation and comfortable on CPU with a small model:

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["faster-whisper>=1.0"]
# ///
"""Transcribe an audio file with per-segment timestamps.

Run:  uv run transcribe.py audio.mp3
"""

import sys

from faster_whisper import WhisperModel

path = sys.argv[1] if len(sys.argv) > 1 else "audio.mp3"

# "base" downloads in seconds; int8 keeps it CPU-friendly.
model = WhisperModel("base", device="cpu", compute_type="int8")
segments, info = model.transcribe(path, vad_filter=True)

print(f"Detected {info.language} ({info.language_probability:.0%})")
for seg in segments:
    print(f"[{seg.start:6.1f}s → {seg.end:6.1f}s] {seg.text.strip()}")
```

✅ Timestamps are the valuable part: they let you cite "at 12:43" and link a claim back to the audio.

No audio handy? Pull some with `ffmpeg` — see [Video Understanding](/2026-05/week-6/video-understanding/):

```bash
ffmpeg -i video.mp4 -vn -acodec libmp3lame audio.mp3
```

## Choosing a model

| Model | Pick it for |
|---|---|
| **Whisper large-v3** | The all-rounder: 99+ languages, most versatile |
| **faster-whisper** | Same Whisper models, substantially faster/cheaper inference |
| **NVIDIA Parakeet TDT** | Fastest self-hosted English throughput; beats Whisper on English WER, but ~25 languages |
| **WhisperX** | Adds forced alignment (word-level timing) and speaker diarization |
| **Moonshine** | On-device and edge deployments |

For **Indian-language** audio, test before committing — accuracy varies a lot by language and accent. Whisper's breadth usually wins outside major European languages.

**Text-to-speech** is the reverse trip: hosted options (ElevenLabs, OpenAI TTS) sound best; [Piper](https://github.com/OHF-Voice/piper1-gpl) runs locally and free.

> ⚖️ Recordings of people are **personal data**, and voice is biometric. Transcribing a public lecture is fine; scraping private calls or cloning someone's voice without consent is not — [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/).

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| Invented text in silence | Whisper hallucinates on quiet audio | `vad_filter=True`; try Parakeet |
| Wrong language | Auto-detect confused by short/mixed audio | Pass `language="hi"` explicitly |
| Speakers indistinguishable | Plain STT has no speaker labels | Use WhisperX diarization |
| Painfully slow | Large model on CPU | Smaller model, `int8`, or GPU |
| Names/jargon wrong | Out-of-vocabulary terms | Pass an `initial_prompt` with expected terms |

## Your turn (≈12 min)

1. Extract audio from any short video with `ffmpeg` and transcribe it.
2. Run the same file with `vad_filter=False` and compare — look for hallucinated text in silences.
3. Compare `base` vs `small` on speed and accuracy.
4. Save segments as JSON (`start`, `end`, `text`) and write the code that finds which timestamp mentions a keyword.

## Checklist

- [ ] I can transcribe audio with per-segment timestamps.
- [ ] I know why timestamps matter for citations.
- [ ] I can extract audio from video with `ffmpeg`.
- [ ] I know VAD filtering suppresses silence hallucinations.
- [ ] I treat voice recordings as personal/biometric data.

## Go deeper

- [faster-whisper](https://github.com/SYSTRAN/faster-whisper) — the fast Whisper runtime used above.
- [WhisperX](https://github.com/m-bain/whisperX) — word-level alignment and diarization.
- [Open ASR Leaderboard](https://huggingface.co/spaces/hf-audio/open_asr_leaderboard) — current WER/speed comparisons.

<!-- SOURCES: https://github.com/SYSTRAN/faster-whisper , https://github.com/m-bain/whisperX , https://huggingface.co/spaces/hf-audio/open_asr_leaderboard , https://github.com/OHF-Voice/piper1-gpl -->
