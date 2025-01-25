# Live Sessions

Live sessions by the instructors and TAs are recorded and uploaded to YouTube.

[![TDS Live Sessions: Jan 2025](https://i.ytimg.com/vi_webp/VTBwpPT3A3U/sddefault.webp)](https://www.youtube.com/playlist?list=PL_h5u1jMeBCl1BquBhgunA4t08XAxsA-C)

These were downloaded using [yt-dlp](https://github.com/yt-dlp/yt-dlp). The options compress the audio optimized for speech.

```bash
yt-dlp --extract-audio --audio-format opus --embed-thumbnail --postprocessor-args \
  "-c:a libopus -b:a 12k -ac 1 -application voip -vbr off -ar 8000 -cutoff 4000 -frame_duration 60 -compression_level 10" \
  $YOUTUBE_URL
```

They were then transcribed by Gemini 1.5 Flash 002 (currently the best model from a price-quality perspective for audio transcription).

System prompt:

```
You are an expert transcriber of data science audio tutorials
```

User prompt:

```
Transcribe this audio tutorial about Tools in Data Science (TDS) as an FAQ.
Summarize the student questions faithfully.
Summarize the answers succinctly, without missing information, in a conversational style.
Avoid repeating questions, consolidating similar ones.
Prefer "You" and "I" instead of "student" and "instructor".
For example:

**Q1: [Concisely framed question]**

**A1:** [Succinct answer]
```
