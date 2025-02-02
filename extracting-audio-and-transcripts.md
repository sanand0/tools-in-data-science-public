## Extracting Audio and Transcripts

## Media Processing: FFmpeg

[FFmpeg](https://ffmpeg.org/) is the standard command-line tool for processing video and audio files. It's essential for data scientists working with media files for:

- Extracting audio/video for machine learning
- Converting formats for web deployment
- Creating visualizations and presentations
- Processing large media datasets

Basic Operations:

```bash
# Basic conversion
ffmpeg -i input.mp4 output.avi

# Extract audio
ffmpeg -i input.mp4 -vn output.mp3

# Convert format without re-encoding
ffmpeg -i input.mkv -c copy output.mp4

# High quality encoding (crf: 0-51, lower is better)
ffmpeg -i input.mp4 -preset slower -crf 18 output.mp4
```

Common Data Science Tasks:

```bash
# Extract frames for computer vision
ffmpeg -i input.mp4 -vf "fps=1" frames_%04d.png    # 1 frame per second
ffmpeg -i input.mp4 -vf "select='eq(n,0)'" -vframes 1 first_frame.jpg

# Create video from image sequence
ffmpeg -r 1/5 -i img%03d.png -c:v libx264 -vf fps=25 output.mp4

# Extract audio for speech recognition
ffmpeg -i input.mp4 -ar 16000 -ac 1 audio.wav      # 16kHz mono

# Trim video/audio for training data
ffmpeg -ss 00:01:00 -i input.mp4 -t 00:00:30 -c copy clip.mp4
```

Processing Multiple Files:

```bash
# Concatenate videos (first create files.txt with list of files)
echo "file 'input1.mp4'
file 'input2.mp4'" > files.txt
ffmpeg -f concat -i files.txt -c copy output.mp4

# Batch process with shell loop
for f in *.mp4; do
    ffmpeg -i "$f" -vn "audio/${f%.mp4}.wav"
done
```

Data Analysis Features:

```bash
# Get media file information
ffprobe -v quiet -print_format json -show_format -show_streams input.mp4

# Display frame metadata
ffprobe -v quiet -print_format json -show_frames input.mp4

# Generate video thumbnails
ffmpeg -i input.mp4 -vf "thumbnail" -frames:v 1 thumb.jpg
```

Watch this introduction to FFmpeg (12 min):

[![FFmpeg in 12 Minutes](https://i.ytimg.com/vi_webp/MPV7JXTWPWI/sddefault.webp)](https://youtu.be/MPV7JXTWPWI)

Tools:

- [ffmpeg.lav.io](https://ffmpeg.lav.io/): Interactive command builder
- [FFmpeg Explorer](https://ffmpeg.guide/): Visual FFmpeg command generator
- [FFmpeg Buddy](https://evanhahn.github.io/ffmpeg-buddy/): Simple command generator

Tips:

1. Use `-c copy` when possible to avoid re-encoding
2. Monitor progress with `-progress pipe:1`
3. Use `-hide_banner` to reduce output verbosity
4. Test commands with small clips first
5. Use hardware acceleration when available (-hwaccel auto)

Error Handling:

```bash
# Validate file before processing
ffprobe input.mp4 2>&1 | grep "Invalid"

# Continue on errors in batch processing
ffmpeg -i input.mp4 output.mp4 -xerror

# Get detailed error information
ffmpeg -v error -i input.mp4 2>&1 | grep -A2 "Error"
```

<!-- Assessment: Share output of `ffprobe -v quiet -print_format json -show_format {video}` -->
<!-- Assessment: Share output of `ffmpeg -i {video} -vf "select='eq(n,0)'" -vframes 1 {email}.jpg` -->

## Media tools: yt-dlp

[yt-dlp](https://github.com/yt-dlp/yt-dlp) is a feature-rich command-line tool for downloading audio/video from thousands of sites. It's particularly useful for extracting audio and transcripts from videos.

Install using your package manager:

```bash
# macOS
brew install yt-dlp

# Linux
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ~/.local/bin/yt-dlp
chmod a+rx ~/.local/bin/yt-dlp

# Windows
winget install yt-dlp
```

Common operations for extracting audio and transcripts:

```bash
# Download audio only at lowest quality suitable for speech
yt-dlp -f "ba[abr<50]/worstaudio" \
       --extract-audio \
       --audio-format mp3 \
       --audio-quality 32k \
       "https://www.youtube.com/watch?v=VIDEO_ID"

# Download auto-generated subtitles
yt-dlp --write-auto-sub \
       --skip-download \
       --sub-format "srt" \
       "https://www.youtube.com/watch?v=VIDEO_ID"

# Download both audio and subtitles with custom output template
yt-dlp -f "ba[abr<50]/worstaudio" \
       --extract-audio \
       --audio-format mp3 \
       --audio-quality 32k \
       --write-auto-sub \
       --sub-format "srt" \
       -o "%(title)s.%(ext)s" \
       "https://www.youtube.com/watch?v=VIDEO_ID"

# Download entire playlist's audio
yt-dlp -f "ba[abr<50]/worstaudio" \
       --extract-audio \
       --audio-format mp3 \
       --audio-quality 32k \
       -o "%(playlist_index)s-%(title)s.%(ext)s" \
       "https://www.youtube.com/playlist?list=PLAYLIST_ID"
```

For Python integration:

```python
# /// script
# requires-python = ">=3.9"
# dependencies = ["yt-dlp"]
# ///

import yt_dlp

def download_audio(url: str) -> None:
    """Download audio at speech-optimized quality."""
    ydl_opts = {
        'format': 'ba[abr<50]/worstaudio',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '32'
        }]
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

# Example usage
download_audio('https://www.youtube.com/watch?v=VIDEO_ID')
```

Tools:

- [ffmpeg](https://ffmpeg.org/): Required for audio extraction and conversion
- [whisper](https://github.com/openai/whisper): Can be used with yt-dlp for speech-to-text
- [gallery-dl](https://github.com/mikf/gallery-dl): Alternative for image-focused sites

Note: Always respect copyright and terms of service when downloading content.

## Whisper transcription

[Faster Whisper](https://github.com/SYSTRAN/faster-whisper) is a highly optimized implementation of OpenAI's [Whisper model](https://github.com/openai/whisper), offering up to 4x faster transcription while using less memory.

You can install it via:

- `pip install faster-whisper`
- [Download Windows Standalone](https://github.com/Purfview/whisper-standalone-win/releases)

Here's a basic usage example:

```bash
faster-whisper-xxl "video.mp4" --model medium --language en
```

Here's my recommendation for transcribing videos. This saves the output in JSON as well as SRT format in the source directory.

```bash
faster-whisper-xxl --print_progress --output_dir source --batch_recursive \
                   --check_files --standard --output_format json srt \
                   --model medium --language en $FILE
```

- `--model`: The OpenAI Whisper model to use. You can choose from:
  - `tiny`: Fastest but least accurate
  - `base`: Good for simple audio
  - `small`: Balanced speed/accuracy
  - `medium`: Recommended default
  - `large-v3`: Most accurate but slowest
- `--output_format`: The output format to use. You can pick multiple formats from:
  - `json`: Has the most detailed information including timing, text, quality, etc.
  - `srt`: A popular subtitle format. You can use this in YouTube, for example.
  - `vtt`: A modern subtitle format.
  - `txt`: Just the text transcript
- `--output_dir`: The directory to save the output files. `source` indicates the source directory, i.e. where the input `$FILE` is
- `--language`: The language of the input file. If you don't specify it, it analyzes the first 30 seconds to auto-detect. You can speed it up by specifying it.

Run `faster-whisper-xxl --help` for more options.

## Gemini transcription

The [Gemini](https://gemini.google.com/) models from Google are notable in two ways:

1. They have a _huge_ input context window. Gemini 2.0 Flash can accept 1M tokens, for example.
2. They can handle audio input.

This allows us to use Gemini to transcribe audio files.

LLMs are not good at transcribing audio _faithfully_. They tend to correct errors and meander from what was said. But they are intelligent. That enables a few powerful workflows. Here are some examples:

1. **Transcribe into other languages**. Gemini will handle the transcription and translation in a single step.
2. **Summarize audio transcripts**. For example, convert a podcast into a tutorial, or a meeting recording into actions.
3. **Legal Proceeding Analysis**. Extract case citations, dates, and other details from a legal debate.
4. **Medical Consultation Summary**. Extract treatments, medications, details of next visit, etc. from a medical consultation.

Here's how to use Gemini to transcribe audio files.

1. Get a [Gemini API key](https://aistudio.google.com/app/apikey) from Google AI Studio.
2. Set the `GEMINI_API_KEY` environment variable to the API key.
3. Set the `MP3_FILE` environment variable to the path of the MP3 file you want to transcribe.
4. Run this code:
   ```bash
   curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:streamGenerateContent?alt=sse \
     -H "X-Goog-API-Key: $GEMINI_API_KEY" \
     -H "Content-Type: application/json" \
     -d "$(cat << EOF
   {
     "contents": [
       {
         "role": "user",
         "parts": [
           {
             "inline_data": {
               "mime_type": "audio/mp3",
               "data": "$(base64 --wrap=0 $MP3_FILE)"
             }
           },
           {"text": "Transcribe this"}
         ]
       }
     ]
   }
   EOF
   )"
   ```
