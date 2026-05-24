# Lab 3.1 — YouTube → Subtitles → Topics → JSON Pipeline

**What you'll build:** A CLI tool that takes any YouTube URL and produces a structured JSON summary containing topics, key Q&A pairs, chapter breakdowns, and answer timestamps — all extracted by Claude from the auto-generated subtitles.

```bash
# Input
python pipeline.py "https://www.youtube.com/watch?v=VIDEO_ID"

# Output: output/VIDEO_ID_summary.json
{
  "title": "Introduction to Docker",
  "duration_minutes": 45,
  "topics": ["containerization", "Dockerfile", "docker-compose", ...],
  "chapters": [
    {
      "title": "What is Docker?",
      "start_time": "00:00",
      "end_time": "05:30",
      "summary": "Docker packages apps into containers..."
    }
  ],
  "qa_pairs": [
    {
      "question": "What is the difference between image and container?",
      "answer": "An image is a blueprint; a container is a running instance.",
      "timestamp": "03:42"
    }
  ]
}
```

---

## Architecture

```
YouTube URL
    │
    ▼ (yt-dlp)
VTT Subtitle File (.vtt)
    │
    ▼ (parse_vtt.py)
Timestamped Segments: [{text, start_time, end_time}, ...]
    │
    ├─ ▼ (Claude — topic extraction)
    │  Topics: ["docker", "containers", "networking", ...]
    │
    ├─ ▼ (Claude — chapter segmentation)
    │  Chapters with titles and time ranges
    │
    └─ ▼ (Claude — Q&A extraction + structured JSON)
       Final summary.json
```

---

<details>
<summary>**Step 1 — Project Setup**</summary>

```bash
mkdir tds-lab-3-1
cd tds-lab-3-1
uv init --no-workspace
```

Install dependencies:

```bash
uv add anthropic pydantic python-dotenv rich
uv tool install yt-dlp   # system-level CLI tool
```

Check yt-dlp is working:

```bash
yt-dlp --version
# → 2025.XX.XX
```

Install ffmpeg (required for subtitle formats):

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows — download from ffmpeg.org
```

Create project structure:

```
tds-lab-3-1/
├── pipeline.py          ← main orchestrator
├── downloader.py        ← yt-dlp subtitle extraction
├── vtt_parser.py        ← parse VTT subtitle files
├── llm_processor.py     ← all LLM calls
├── models.py            ← Pydantic output models
├── .env                 ← API keys
└── output/              ← generated JSON files
```

Create `.env`:
```bash title=".env"
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

</details>

<details>
<summary>**Step 2 — Define Pydantic Output Models**</summary>

```python title="models.py"
from pydantic import BaseModel, Field
from typing import Optional

class TimeRange(BaseModel):
    start: str = Field(description="Timestamp in HH:MM:SS or MM:SS format")
    end: str = Field(description="Timestamp in HH:MM:SS or MM:SS format")

class Chapter(BaseModel):
    title: str = Field(description="Short title for this chapter/section")
    start_time: str = Field(description="When this chapter starts, e.g. '05:30'")
    end_time: str = Field(description="When this chapter ends")
    summary: str = Field(
        max_length=300,
        description="2-3 sentence summary of what's covered in this chapter"
    )
    key_points: list[str] = Field(
        min_length=1,
        max_length=5,
        description="3-5 key points from this chapter"
    )

class QAPair(BaseModel):
    question: str = Field(description="A question a viewer might ask about this content")
    answer: str = Field(description="The answer found in the transcript")
    timestamp: str = Field(description="When this answer appears, e.g. '12:34'")
    confidence: float = Field(
        ge=0.0, le=1.0,
        description="How confident you are this timestamp is accurate"
    )

class SubtitleSegment(BaseModel):
    """One timestamped line from a VTT file."""
    text: str
    start_seconds: float
    end_seconds: float
    start_formatted: str  # "MM:SS" or "HH:MM:SS"

class VideoSummary(BaseModel):
    """The complete structured summary of a video."""
    video_id: str
    title: str
    url: str
    duration_seconds: int
    duration_formatted: str
    language: str = "en"
    topics: list[str] = Field(
        min_length=1,
        max_length=15,
        description="Main topics covered in the video"
    )
    one_line_summary: str = Field(
        max_length=150,
        description="One sentence capturing what the video is about"
    )
    chapters: list[Chapter] = Field(
        min_length=1,
        max_length=20
    )
    qa_pairs: list[QAPair] = Field(
        min_length=3,
        max_length=10,
        description="Questions a viewer would have, with answers from the transcript"
    )
    total_segments: int
    processing_notes: Optional[str] = None
```

</details>

<details>
<summary>**Step 3 — Subtitle Downloader with yt-dlp**</summary>

```python title="downloader.py"
"""
Downloads YouTube video metadata and subtitles using yt-dlp.
No video downloaded — subtitles only (fast, lightweight).
"""
import subprocess
import json
import tempfile
import os
from pathlib import Path
from dataclasses import dataclass

@dataclass
class VideoInfo:
    video_id: str
    title: str
    duration: int          # seconds
    url: str
    vtt_path: str | None   # path to downloaded VTT file

def download_subtitles(url: str, output_dir: str = "/tmp/tds_subs") -> VideoInfo:
    """
    Download auto-generated English subtitles for a YouTube video.
    Returns VideoInfo with path to the VTT file.
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    # Step 1: Get video metadata (no download)
    print(f"Fetching video info: {url}")
    meta_result = subprocess.run(
        [
            "yt-dlp",
            "--dump-json",       # print metadata as JSON
            "--no-playlist",
            "--skip-download",
            url,
        ],
        capture_output=True,
        text=True,
    )

    if meta_result.returncode != 0:
        raise RuntimeError(f"yt-dlp metadata failed: {meta_result.stderr}")

    meta = json.loads(meta_result.stdout)
    video_id = meta["id"]
    title = meta["title"]
    duration = meta.get("duration", 0)

    # Step 2: Download subtitles
    print(f"Downloading subtitles for: '{title}' ({duration//60}m {duration%60}s)")
    sub_result = subprocess.run(
        [
            "yt-dlp",
            "--write-auto-sub",    # auto-generated captions
            "--write-sub",         # also get manual subs if available
            "--sub-lang", "en",    # English
            "--sub-format", "vtt", # WebVTT format (timestamped)
            "--skip-download",     # don't download video
            "--no-playlist",
            "-o", f"{output_dir}/{video_id}.%(ext)s",
            url,
        ],
        capture_output=True,
        text=True,
    )

    # Find the downloaded VTT file
    vtt_path = None
    for ext in [".en.vtt", ".en-US.vtt", ".en-GB.vtt"]:
        candidate = f"{output_dir}/{video_id}{ext}"
        if Path(candidate).exists():
            vtt_path = candidate
            break

    if not vtt_path:
        # Try glob for any .vtt file with the video ID
        vtt_files = list(Path(output_dir).glob(f"{video_id}*.vtt"))
        if vtt_files:
            vtt_path = str(vtt_files[0])

    if not vtt_path:
        print("Warning: No subtitles found. Video may not have captions.")
        print(f"yt-dlp stderr: {sub_result.stderr[-500:]}")

    return VideoInfo(
        video_id=video_id,
        title=title,
        duration=duration,
        url=url,
        vtt_path=vtt_path,
    )
```

Test it:

```python
# test_downloader.py
from downloader import download_subtitles

# Test with a short YouTube video that has auto-generated captions
info = download_subtitles("https://www.youtube.com/watch?v=Tn6-PIqc4UM")
print(f"Title: {info.title}")
print(f"Duration: {info.duration // 60}m {info.duration % 60}s")
print(f"VTT file: {info.vtt_path}")
```

</details>

<details>
<summary>**Step 4 — Parse VTT Subtitle Files**</summary>

VTT files look like this:
```
WEBVTT
Kind: captions
Language: en

00:00:01.500 --> 00:00:04.000
Hello and welcome to this Docker tutorial.

00:00:04.000 --> 00:00:07.500
Today we'll learn what containers are
and why they matter.
```

They have duplicates and overlap — we need to clean them:

```python title="vtt_parser.py"
"""
Parse WebVTT subtitle files into clean, deduplicated, timestamped segments.
"""
import re
from models import SubtitleSegment

def parse_vtt(vtt_path: str) -> list[SubtitleSegment]:
    """
    Parse a VTT file into timestamped text segments.
    Handles: duplicates, overlapping timestamps, multi-line cues.
    """
    content = open(vtt_path, encoding="utf-8", errors="replace").read()
    segments = _parse_raw(content)
    segments = _deduplicate(segments)
    segments = _merge_short_segments(segments, min_chars=20)
    return segments

def _timestamp_to_seconds(ts: str) -> float:
    """Convert '01:23:45.678' or '01:23.456' to seconds."""
    ts = ts.strip()
    parts = ts.replace(",", ".").split(":")
    if len(parts) == 3:
        h, m, s = parts
        return int(h) * 3600 + int(m) * 60 + float(s)
    elif len(parts) == 2:
        m, s = parts
        return int(m) * 60 + float(s)
    else:
        return float(parts[0])

def _seconds_to_formatted(seconds: float) -> str:
    """Convert 125.5 to '02:05'."""
    total = int(seconds)
    h = total // 3600
    m = (total % 3600) // 60
    s = total % 60
    if h > 0:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"

def _parse_raw(content: str) -> list[SubtitleSegment]:
    """Extract all cues from VTT content."""
    segments = []

    # Remove VTT header and metadata lines
    lines = content.split("\n")
    i = 0
    while i < len(lines) and not "-->" in lines[i]:
        i += 1

    # Parse each cue
    while i < len(lines):
        line = lines[i].strip()

        if "-->" in line:
            # Parse timestamp line: "00:01:23.000 --> 00:01:25.500"
            match = re.match(
                r"(\d{1,2}:\d{2}[:.]\d{3}|\d{2}:\d{2}:\d{2}[.:]\d{3})"
                r"\s*-->\s*"
                r"(\d{1,2}:\d{2}[:.]\d{3}|\d{2}:\d{2}:\d{2}[.:]\d{3})",
                line,
            )
            if match:
                start_ts, end_ts = match.group(1), match.group(2)
                start_sec = _timestamp_to_seconds(start_ts)
                end_sec = _timestamp_to_seconds(end_ts)

                # Collect text lines until blank line
                i += 1
                text_lines = []
                while i < len(lines) and lines[i].strip():
                    t = lines[i].strip()
                    # Remove VTT formatting tags: <c>, <00:00:01.000>, etc.
                    t = re.sub(r"<[^>]+>", "", t)
                    if t:
                        text_lines.append(t)
                    i += 1

                text = " ".join(text_lines).strip()
                if text:
                    segments.append(SubtitleSegment(
                        text=text,
                        start_seconds=start_sec,
                        end_seconds=end_sec,
                        start_formatted=_seconds_to_formatted(start_sec),
                    ))
        i += 1

    return segments

def _deduplicate(segments: list[SubtitleSegment]) -> list[SubtitleSegment]:
    """Remove consecutive duplicate lines (VTT often repeats the same text)."""
    if not segments:
        return []

    result = [segments[0]]
    for seg in segments[1:]:
        # Skip if identical text to previous (common in auto-generated captions)
        if seg.text.strip().lower() != result[-1].text.strip().lower():
            result.append(seg)

    return result

def _merge_short_segments(
    segments: list[SubtitleSegment],
    min_chars: int = 20,
    max_gap_seconds: float = 3.0,
) -> list[SubtitleSegment]:
    """
    Merge very short segments with the next one.
    Avoids sending "OK" or "Yeah" as separate chunks to the LLM.
    """
    if not segments:
        return []

    merged = []
    current = segments[0]

    for next_seg in segments[1:]:
        gap = next_seg.start_seconds - current.end_seconds
        if len(current.text) < min_chars and gap < max_gap_seconds:
            # Merge: append text, extend end time
            current = SubtitleSegment(
                text=current.text + " " + next_seg.text,
                start_seconds=current.start_seconds,
                end_seconds=next_seg.end_seconds,
                start_formatted=current.start_formatted,
            )
        else:
            merged.append(current)
            current = next_seg

    merged.append(current)
    return merged

def segments_to_transcript(segments: list[SubtitleSegment]) -> str:
    """Convert segments to a plain text transcript with timestamps."""
    lines = []
    for seg in segments:
        lines.append(f"[{seg.start_formatted}] {seg.text}")
    return "\n".join(lines)

def chunk_segments(
    segments: list[SubtitleSegment],
    max_chars: int = 8000,
) -> list[list[SubtitleSegment]]:
    """
    Split segments into chunks that fit within the LLM context.
    Each chunk is a list of SubtitleSegments.
    """
    chunks = []
    current_chunk = []
    current_chars = 0

    for seg in segments:
        seg_chars = len(seg.text) + 15  # +15 for timestamp
        if current_chars + seg_chars > max_chars and current_chunk:
            chunks.append(current_chunk)
            current_chunk = [seg]
            current_chars = seg_chars
        else:
            current_chunk.append(seg)
            current_chars += seg_chars

    if current_chunk:
        chunks.append(current_chunk)

    return chunks
```

Test the parser:

```python
# test_parser.py
from downloader import download_subtitles
from vtt_parser import parse_vtt, segments_to_transcript

info = download_subtitles("https://www.youtube.com/watch?v=Tn6-PIqc4UM")
if info.vtt_path:
    segments = parse_vtt(info.vtt_path)
    print(f"Parsed {len(segments)} segments")
    print("\nFirst 5 segments:")
    for seg in segments[:5]:
        print(f"  [{seg.start_formatted}] {seg.text}")
    print("\nFull transcript preview:")
    print(segments_to_transcript(segments[:20]))
```

</details>

<details>
<summary>**Step 5 — LLM Processing Module**</summary>

This module contains all Claude calls. Each function does one focused task.

```python title="llm_processor.py"
"""
All LLM calls for the YouTube pipeline.
Uses Claude claude-haiku-4-5-20251001 for cheap steps, claude-sonnet-4-6 for final summary.
"""
import anthropic
import instructor
from pydantic import BaseModel, Field
from typing import Optional
from models import Chapter, QAPair, SubtitleSegment, VideoSummary
from vtt_parser import segments_to_transcript, chunk_segments

# Use Instructor for structured output
claude = instructor.from_anthropic(anthropic.Anthropic())
raw_claude = anthropic.Anthropic()  # for non-structured calls

# ── Step 1: Extract Topics ─────────────────────────────────────────────────────

class TopicList(BaseModel):
    topics: list[str] = Field(
        min_length=3,
        max_length=15,
        description="Main topics covered in the video, in order of appearance"
    )
    one_line_summary: str = Field(
        max_length=150,
        description="One sentence capturing what the video is about"
    )

def extract_topics(segments: list[SubtitleSegment], title: str) -> TopicList:
    """Extract the main topics from the first 1/3 of the transcript."""
    # Use the first third of segments for topic extraction (efficient)
    sample_size = max(30, len(segments) // 3)
    sample_segments = segments[:sample_size]
    transcript_sample = segments_to_transcript(sample_segments)

    return claude.messages.create(
        model="claude-haiku-4-5-20251001",   # cheap model for this step
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"""Video title: "{title}"

Transcript sample (first part of video):
{transcript_sample}

Extract the main topics covered in this video. Be specific and technical."""
        }],
        response_model=TopicList,
    )

# ── Step 2: Create Chapter Breakdown ──────────────────────────────────────────

class ChapterList(BaseModel):
    chapters: list[Chapter] = Field(min_length=2, max_length=20)

def create_chapters(
    segments: list[SubtitleSegment],
    title: str,
    topics: list[str],
) -> list[Chapter]:
    """
    Divide the video into logical chapters with timestamps.
    For long videos, processes in chunks and merges.
    """
    # Chunk the transcript for long videos
    chunks = chunk_segments(segments, max_chars=6000)

    if len(chunks) == 1:
        return _create_chapters_single(segments_to_transcript(segments), title, topics)

    # Process each chunk independently, then merge
    all_chapters = []
    for i, chunk in enumerate(chunks):
        print(f"  Processing chapter chunk {i+1}/{len(chunks)}...")
        transcript_chunk = segments_to_transcript(chunk)
        chunk_start = chunk[0].start_formatted
        chunk_end = chunk[-1].start_formatted

        result = claude.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": f"""Video section from {chunk_start} to {chunk_end}.
Video title: "{title}"
Topics: {', '.join(topics)}

Transcript:
{transcript_chunk}

Identify 2-4 logical chapters in this section with timestamps."""
            }],
            response_model=ChapterList,
        )
        all_chapters.extend(result.chapters)

    return all_chapters

def _create_chapters_single(transcript: str, title: str, topics: list[str]) -> list[Chapter]:
    result = claude.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""Video title: "{title}"
Topics covered: {', '.join(topics)}

Full transcript with timestamps:
{transcript}

Divide this video into 3-8 logical chapters. Each chapter should cover a distinct topic or phase of the video.
Use the exact timestamps from the transcript."""
        }],
        response_model=ChapterList,
    )
    return result.chapters

# ── Step 3: Extract Q&A Pairs ─────────────────────────────────────────────────

class QAList(BaseModel):
    qa_pairs: list[QAPair] = Field(min_length=3, max_length=10)

def extract_qa_pairs(
    segments: list[SubtitleSegment],
    title: str,
    topics: list[str],
) -> list[QAPair]:
    """Extract questions a viewer might ask, with answers from the transcript."""
    # Use a focused sample — most Q&A content is in the middle
    start = len(segments) // 6
    end = len(segments) * 5 // 6
    sample = segments[start:end][:80]  # up to 80 segments
    transcript = segments_to_transcript(sample)

    result = claude.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""Video title: "{title}"
Topics: {', '.join(topics)}

Transcript excerpt with timestamps:
{transcript}

Generate 5-8 question-answer pairs that a viewer watching this video would find valuable.
For each Q&A, provide the timestamp where the answer is given in the video.
Focus on the most educational and practical information."""
        }],
        response_model=QAList,
    )
    return result.qa_pairs

# ── Step 4: Final Structured Summary ──────────────────────────────────────────

def build_final_summary(
    video_info,              # VideoInfo from downloader
    segments: list[SubtitleSegment],
    topic_result: TopicList,
    chapters: list[Chapter],
    qa_pairs: list[QAPair],
) -> VideoSummary:
    """Assemble all extracted data into the final VideoSummary."""
    duration = video_info.duration
    h = duration // 3600
    m = (duration % 3600) // 60
    s = duration % 60
    duration_fmt = f"{h:02d}:{m:02d}:{s:02d}" if h > 0 else f"{m:02d}:{s:02d}"

    return VideoSummary(
        video_id=video_info.video_id,
        title=video_info.title,
        url=video_info.url,
        duration_seconds=duration,
        duration_formatted=duration_fmt,
        topics=topic_result.topics,
        one_line_summary=topic_result.one_line_summary,
        chapters=chapters,
        qa_pairs=qa_pairs,
        total_segments=len(segments),
    )
```

</details>

<details>
<summary>**Step 6 — Build the Main Pipeline Orchestrator**</summary>

```python title="pipeline.py"
"""
Main pipeline: YouTube URL → structured JSON summary.

Usage:
    python pipeline.py "https://youtube.com/watch?v=VIDEO_ID"
    python pipeline.py "https://youtube.com/watch?v=VIDEO_ID" --output my_output.json
"""
import sys
import json
import time
import argparse
from pathlib import Path
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from dotenv import load_dotenv

load_dotenv()

from downloader import download_subtitles
from vtt_parser import parse_vtt, segments_to_transcript
from llm_processor import (
    extract_topics,
    create_chapters,
    extract_qa_pairs,
    build_final_summary,
)

console = Console()

def run_pipeline(url: str, output_dir: str = "output") -> dict:
    """Run the full pipeline for a YouTube URL."""
    start_time = time.time()
    Path(output_dir).mkdir(exist_ok=True)

    # ── Step 1: Download subtitles ─────────────────────────────────────────────
    console.rule("[bold blue]Step 1: Downloading subtitles")
    video_info = download_subtitles(url)

    if not video_info.vtt_path:
        console.print("[red]❌ No subtitles found. Cannot proceed.[/red]")
        console.print("Try a video with auto-generated captions (most English YT videos have them).")
        sys.exit(1)

    console.print(f"[green]✅ Downloaded:[/green] {video_info.title}")
    console.print(f"   Duration: {video_info.duration // 60}m {video_info.duration % 60}s")
    console.print(f"   VTT file: {video_info.vtt_path}")

    # ── Step 2: Parse VTT ─────────────────────────────────────────────────────
    console.rule("[bold blue]Step 2: Parsing subtitles")
    segments = parse_vtt(video_info.vtt_path)
    console.print(f"[green]✅ Parsed {len(segments)} segments[/green]")

    if len(segments) < 10:
        console.print("[yellow]⚠️  Very few segments — subtitle quality may be low.[/yellow]")

    # Preview
    console.print("\nFirst 3 segments:")
    for seg in segments[:3]:
        console.print(f"  [{seg.start_formatted}] {seg.text[:80]}")

    # ── Step 3: Extract Topics ─────────────────────────────────────────────────
    console.rule("[bold blue]Step 3: Extracting topics (Claude Haiku)")
    topic_result = extract_topics(segments, video_info.title)
    console.print(f"[green]✅ Topics:[/green] {', '.join(topic_result.topics)}")
    console.print(f"   Summary: {topic_result.one_line_summary}")

    # ── Step 4: Create Chapters ────────────────────────────────────────────────
    console.rule("[bold blue]Step 4: Creating chapters (Claude Haiku)")
    chapters = create_chapters(segments, video_info.title, topic_result.topics)
    console.print(f"[green]✅ Created {len(chapters)} chapters[/green]")
    for ch in chapters:
        console.print(f"  [{ch.start_time}] {ch.title}")

    # ── Step 5: Extract Q&A Pairs ──────────────────────────────────────────────
    console.rule("[bold blue]Step 5: Extracting Q&A pairs (Claude Haiku)")
    qa_pairs = extract_qa_pairs(segments, video_info.title, topic_result.topics)
    console.print(f"[green]✅ Extracted {len(qa_pairs)} Q&A pairs[/green]")
    for qa in qa_pairs[:3]:
        console.print(f"  Q [{qa.timestamp}]: {qa.question[:70]}")

    # ── Step 6: Build Final Summary ────────────────────────────────────────────
    console.rule("[bold blue]Step 6: Assembling final summary")
    summary = build_final_summary(video_info, segments, topic_result, chapters, qa_pairs)

    # Save output
    output_path = Path(output_dir) / f"{video_info.video_id}_summary.json"
    output_dict = summary.model_dump()
    output_path.write_text(json.dumps(output_dict, indent=2, ensure_ascii=False))

    elapsed = time.time() - start_time
    console.rule("[bold green]✅ Pipeline Complete")
    console.print(f"Output saved to: [bold]{output_path}[/bold]")
    console.print(f"Total time: {elapsed:.1f}s")
    console.print(f"Chapters: {len(chapters)}, Q&A pairs: {len(qa_pairs)}")

    return output_dict

def main():
    parser = argparse.ArgumentParser(
        description="YouTube → Subtitles → Structured JSON Pipeline"
    )
    parser.add_argument("url", help="YouTube video URL")
    parser.add_argument("--output", default="output", help="Output directory (default: output/)")
    args = parser.parse_args()

    console.print(f"\n[bold]🎬 TDS Lab 3.1 — YouTube Pipeline[/bold]")
    console.print(f"URL: {args.url}\n")

    result = run_pipeline(args.url, args.output)
    console.print(f"\n[dim]JSON keys: {list(result.keys())}[/dim]")

if __name__ == "__main__":
    main()
```

</details>

<details>
<summary>**Step 7 — Run the Pipeline**</summary>

Test with a well-known video that has good captions:

```bash
# Run the pipeline (this uses real API calls — ~$0.01–0.05 per video)
python pipeline.py "https://www.youtube.com/watch?v=Tn6-PIqc4UM"
```

Expected terminal output:

```
🎬 TDS Lab 3.1 — YouTube Pipeline
URL: https://www.youtube.com/watch?v=Tn6-PIqc4UM

─────────────── Step 1: Downloading subtitles ───────────────
Fetching video info: https://www.youtube.com/watch?v=...
Downloading subtitles for: 'Python in 100 Seconds' (2m 31s)
✅ Downloaded: Python in 100 Seconds
   Duration: 2m 31s
   VTT file: /tmp/tds_subs/Tn6-PIqc4UM.en.vtt

─────────────── Step 2: Parsing subtitles ───────────────────
✅ Parsed 47 segments

First 3 segments:
  [00:00] Python is a general-purpose interpreted language
  [00:04] created by Guido van Rossum in 1991.
  [00:08] It's consistently ranked as one of the most popular

─────────────── Step 3: Extracting topics ───────────────────
✅ Topics: python, interpreted language, syntax, data science, web development...
   Summary: Python is a versatile programming language...

─────────────── Step 4: Creating chapters ───────────────────
✅ Created 4 chapters
  [00:00] Introduction to Python
  [00:28] Python Syntax and Features
  [01:15] Python Ecosystem
  [01:52] Getting Started

─────────────── Step 5: Extracting Q&A pairs ────────────────
✅ Extracted 5 Q&A pairs
  Q [00:00]: What is Python?
  Q [00:28]: Why is Python's syntax called clean?
  Q [01:15]: What is Python used for?

─────────────── Step 6: Assembling final summary ────────────
Output saved to: output/Tn6-PIqc4UM_summary.json
Total time: 18.3s
Chapters: 4, Q&A pairs: 5
```

View the output:
```bash
cat output/Tn6-PIqc4UM_summary.json | python -m json.tool | head -60
```

</details>

<details>
<summary>**Step 8 — Handle Long Videos (Chunking)**</summary>

For videos longer than 30 minutes, the transcript can exceed the LLM context window. The chunking logic in `vtt_parser.py` handles this, but let's verify with a longer video:

```bash
# Test with a longer video (~45 min lecture)
python pipeline.py "https://www.youtube.com/watch?v=0RS9W8MtZe4"
```

If you see `Processing chapter chunk 1/3...` etc., chunking is working correctly.

**Manual chunking test:**

```python
# test_chunking.py
from vtt_parser import parse_vtt, chunk_segments

segments = parse_vtt("/tmp/tds_subs/VIDEO_ID.en.vtt")
chunks = chunk_segments(segments, max_chars=6000)

print(f"Total segments: {len(segments)}")
print(f"Chunks: {len(chunks)}")
for i, chunk in enumerate(chunks):
    start = chunk[0].start_formatted
    end = chunk[-1].start_formatted
    chars = sum(len(s.text) for s in chunk)
    print(f"  Chunk {i+1}: [{start}–{end}], {len(chunk)} segs, ~{chars} chars")
```

</details>

<details>
<summary>**Step 9 — Add Prompt Caching for Repeated Runs**</summary>

If you process the same video multiple times (iterating on your prompt), caching saves money:

```python title="llm_processor_cached.py"
"""
Version of llm_processor.py with prompt caching enabled.
Caches the transcript — repeated runs on the same video are 90% cheaper.
"""
import anthropic

raw_claude = anthropic.Anthropic()

def extract_topics_cached(transcript: str, title: str) -> dict:
    """Extract topics with the transcript cached."""
    response = raw_claude.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        system=[
            {
                "type": "text",
                "text": "You are an expert video content analyzer.",
            },
            {
                "type": "text",
                "text": f"Video title: '{title}'\n\nFull transcript:\n{transcript}",
                "cache_control": {"type": "ephemeral"},  # ← cache the transcript
            },
        ],
        messages=[{
            "role": "user",
            "content": "Extract the main topics covered. Return a JSON with 'topics' (list) and 'one_line_summary' (string).",
        }],
    )

    cache_read = response.usage.cache_read_input_tokens
    cache_write = response.usage.cache_creation_input_tokens
    print(f"  Cache: {cache_read} read, {cache_write} write")

    import json, re
    text = response.content[0].text
    # Extract JSON from response
    match = re.search(r'\{.*\}', text, re.DOTALL)
    return json.loads(match.group()) if match else {"topics": [], "one_line_summary": ""}
```

</details>

<details>
<summary>**Step 10 — Write Tests**</summary>

```python title="tests/test_vtt_parser.py"
import pytest
from vtt_parser import parse_vtt, segments_to_transcript, chunk_segments
from pathlib import Path

SAMPLE_VTT = """WEBVTT
Kind: captions
Language: en

00:00:01.500 --> 00:00:04.000
Hello and welcome to this tutorial.

00:00:04.000 --> 00:00:07.500
Today we'll learn about Python.

00:00:04.000 --> 00:00:07.500
Today we'll learn about Python.

00:00:07.500 --> 00:00:10.000
Let's get started.
"""

@pytest.fixture
def sample_vtt_file(tmp_path):
    vtt_file = tmp_path / "test.vtt"
    vtt_file.write_text(SAMPLE_VTT)
    return str(vtt_file)

def test_parse_removes_duplicates(sample_vtt_file):
    segments = parse_vtt(sample_vtt_file)
    texts = [s.text for s in segments]
    # "Today we'll learn about Python." appears twice in VTT, should be once
    assert texts.count("Today we'll learn about Python.") == 1

def test_parse_timestamps(sample_vtt_file):
    segments = parse_vtt(sample_vtt_file)
    assert segments[0].start_formatted == "00:01"
    assert segments[0].start_seconds == pytest.approx(1.5)

def test_segments_to_transcript(sample_vtt_file):
    segments = parse_vtt(sample_vtt_file)
    transcript = segments_to_transcript(segments)
    assert "[00:01]" in transcript
    assert "Hello and welcome" in transcript

def test_chunk_segments(sample_vtt_file):
    segments = parse_vtt(sample_vtt_file)
    # With tiny max_chars, should create multiple chunks
    chunks = chunk_segments(segments, max_chars=30)
    assert len(chunks) > 1
    # All segments should be accounted for
    total = sum(len(c) for c in chunks)
    assert total == len(segments)
```

```python title="tests/test_models.py"
import pytest
from pydantic import ValidationError
from models import VideoSummary, Chapter, QAPair

def test_video_summary_requires_chapters():
    with pytest.raises(ValidationError):
        VideoSummary(
            video_id="test",
            title="Test",
            url="https://youtube.com/watch?v=test",
            duration_seconds=100,
            duration_formatted="01:40",
            topics=["python"],
            one_line_summary="A test video",
            chapters=[],  # must have at least 1
            qa_pairs=[],
            total_segments=10,
        )

def test_qa_confidence_validation():
    with pytest.raises(ValidationError):
        QAPair(
            question="What is Python?",
            answer="A programming language",
            timestamp="01:23",
            confidence=1.5,  # must be <= 1.0
        )
```

Run tests:
```bash
uv run pytest tests/ -v
```

</details>

---

## Final Project Structure

```
tds-lab-3-1/
├── pipeline.py              ← main CLI
├── downloader.py            ← yt-dlp wrapper
├── vtt_parser.py            ← VTT parsing + chunking
├── llm_processor.py         ← all Claude calls
├── models.py                ← Pydantic schemas
├── tests/
│   ├── test_vtt_parser.py
│   └── test_models.py
├── output/
│   └── VIDEO_ID_summary.json   ← generated outputs
├── .env
└── pyproject.toml
```

---

## Deliverables

Submit on the course portal:

1. **GitHub repo URL** — code pushed, no `.env`, `output/` gitignored
2. **3 summary JSON files** — run the pipeline on 3 different YouTube videos
3. **Screenshot** of the terminal showing a successful pipeline run
4. **Brief write-up** (max 150 words): What was the hardest part? How did you handle long videos?

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `yt-dlp: command not found` | `uv tool install yt-dlp` and restart terminal |
| No VTT file found | Try `yt-dlp --list-subs URL` to see available subtitles |
| `ValidationError` from Instructor | Increase `max_retries=3` in the `create()` call |
| Pipeline too slow | Use `claude-haiku-4-5-20251001` for all steps (add it to .env as a flag) |
| VTT has no text | Video may use image-based subtitles — try a different video |
| Rate limit error | Add `time.sleep(1)` between LLM calls in the processor |

---

## Going Further

- Add support for YouTube playlists (process multiple videos, combine into a course outline)
- Export to Markdown instead of JSON, ready for a Docusaurus docs site
- Add a Streamlit UI so non-technical users can paste a URL and get a summary
- Compare Claude Haiku vs Sonnet quality on the same video