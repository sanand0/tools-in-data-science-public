# Video Understanding

Video is just an array of images plus an audio track.

## ffmpeg
The Swiss Army Knife of video processing. You must know how to use it.
```bash
# Extract 1 frame per second
ffmpeg -i video.mp4 -vf fps=1 frame_%04d.jpg

# Extract audio track
ffmpeg -i video.mp4 -q:a 0 -map a audio.mp3
```

## Video LLMs
Models like Gemini 1.5 Pro natively accept video files. They perform temporal reasoning (understanding the sequence of events over time), which is impossible with single images.

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

