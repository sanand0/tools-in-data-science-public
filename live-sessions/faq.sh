#!/usr/bin/env bash
# Converts TDS Live Session videos into FAQ transcripts.

set -euo pipefail

PLAYLIST_URL=${1:-"https://www.youtube.com/@se-lr5ff/videos"}
PLAYLIST_FILE="playlist.tsv"

# Fetch the playlist video IDs and titles.
uvx yt-dlp --flat-playlist -J "$PLAYLIST_URL" \
  | jq -r '.entries[] | [.id, .title, .duration] | @tsv' > "$PLAYLIST_FILE"

# Process each video in the playlist.
while IFS=$'\t' read -r video_id title seconds; do
  # Skip empty lines.
  [[ -z ${video_id//[$'\r\n']/} ]] && continue

  # Skip if transcript already exists.
  transcript_path=$(compgen -G "*-${video_id}.md" | head -n1 || true)
  [[ -n $transcript_path ]] && continue

  # Download audio if not already present.
  audio_path=$(compgen -G "*-${video_id}.opus" | head -n1 || true)
  if [[ -z $audio_path ]]; then
    # Download the audio in low-bitrate opus format.
    video_url="https://www.youtube.com/watch?v=${video_id}"
    echo "Downloading https://youtu.be/$video_id"
    uvx --with mutagen yt-dlp --extract-audio --audio-format opus \
      --postprocessor-args "FFmpegExtractAudio:-c:a libopus -b:a 12k -ac 1 -application voip -vbr off -ar 8000 -cutoff 4000 -frame_duration 60 -compression_level 10" \
      --output '%(upload_date)s-%(id)s.%(ext)s' \
      "$video_url"
    # Verify the audio was downloaded. If not, skip this video.
    audio_path=$(compgen -G "*-${video_id}.opus" | head -n1 || true)
    [[ -z $audio_path ]] && { echo "Missing audio for ${video_id}" >&2; continue; }
  fi

  # Generate the FAQ transcript using the LLM.
  # Note: Use < /dev/null to avoid llm reading the playlist from stdin.
  output_path="${audio_path%.opus}.md"
  echo "Transcribing https://youtu.be/$video_id"
  seconds=${seconds%.*}
  duration=$(printf "%dh %dm" $((seconds/3600)) $(( (seconds%3600)/60 )))
  printf "# $title\n\n[![$title](https://i.ytimg.com/vi_webp/$video_id/sddefault.webp)](https://youtu.be/$video_id)\n\nDuration: $duration\n\n" > "$output_path"
  llm -m gemini-2.5-flash --system 'Transcribe this Tools in Data Science (TDS) live tutorial as an FAQ.
Summarize the student questions faithfully.
Summarize the answers succinctly, without missing information, in a conversational style.
Ensure every part of the transcript is covered.
Consolidate near-identical questions.
Prefer "You" and "I" instead of "student" and "instructor".
For example:

**Q1: [Concisely framed question]**

**A1:** [Succinct answer]

**Q2: ...' -a "$audio_path" < /dev/null >> "$output_path" || echo "LLM failed for ${video_id}" >&2

done < "$PLAYLIST_FILE"
