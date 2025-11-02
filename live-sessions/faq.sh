#!/usr/bin/env bash
# Converts TDS Live Session videos into FAQ transcripts.
#
# Usage:
#   MAX_CHUNK_SECONDS=3600 CHUNK_OVERLAP=10 FAQ_MAX_VIDEOS=5 \
#     bash live-sessions/faq.sh [PLAYLIST_URL]
#
# Defaults:
#   - PLAYLIST_URL: https://www.youtube.com/@se-lr5ff/videos
#   - MAX_CHUNK_SECONDS: 3600 (≈1 hour per chunk)
#   - CHUNK_OVERLAP: 10 seconds (to avoid clipping between chunks)
#   - FAQ_MAX_VIDEOS unset processes the full playlist; set to limit runs
#
# All audio/transcripts are cached under live-sessions/ so reruns are fast.

set -euo pipefail

shopt -s nullglob

# Location for cached audio, transcripts, and playlist metadata.
OUTPUT_DIR="live-sessions"
mkdir -p "$OUTPUT_DIR"

# Configure chunk size and overlap (defaults target ~1 hour per chunk).
MAX_CHUNK_SECONDS=${MAX_CHUNK_SECONDS:-3600}
CHUNK_OVERLAP=${CHUNK_OVERLAP:-10}

if ! [[ $MAX_CHUNK_SECONDS =~ ^[0-9]+$ ]] || (( MAX_CHUNK_SECONDS <= 0 )); then
  echo "MAX_CHUNK_SECONDS must be a positive integer" >&2
  exit 1
fi

if ! [[ $CHUNK_OVERLAP =~ ^[0-9]+$ ]] || (( CHUNK_OVERLAP < 0 )); then
  echo "CHUNK_OVERLAP must be a non-negative integer" >&2
  exit 1
fi

if (( CHUNK_OVERLAP >= MAX_CHUNK_SECONDS )); then
  echo "CHUNK_OVERLAP must be smaller than MAX_CHUNK_SECONDS" >&2
  exit 1
fi

# Base instructions shared across all LLM calls.
BASE_SYSTEM_PROMPT=$(cat <<'EOF'
Transcribe this Tools in Data Science (TDS) live tutorial as an FAQ.
Summarize the student questions faithfully.
Summarize the answers succinctly, without missing information, in a conversational style.
Ensure every part of the transcript is covered.
Consolidate near-identical questions.
Prefer "You" and "I" instead of "student" and "instructor".
For example:

**Q1: [Concisely framed question]**

**A1:** [Succinct answer]

**Q2: ...
EOF
)

# Split the source opus into overlapping chunks to keep each LLM call manageable.
split_audio_chunks() {
  local audio_path=$1
  local total_seconds=$2
  local step=$(( MAX_CHUNK_SECONDS - CHUNK_OVERLAP ))
  local base=${audio_path%.opus}

  local start=0
  local part=1
  while (( start < total_seconds )); do
    local chunk_duration=$MAX_CHUNK_SECONDS
    if (( start + chunk_duration > total_seconds )); then
      chunk_duration=$(( total_seconds - start ))
    fi

    if (( chunk_duration <= 0 )); then
      break
    fi

    local chunk_path
    chunk_path=$(printf "%s-part%02d.opus" "$base" "$part")
    echo "Creating chunk ${chunk_path##*/} (start ${start}s, duration ${chunk_duration}s)" >&2
    ffmpeg -nostdin -hide_banner -loglevel error -ss "$start" -i "$audio_path" \
      -t "$chunk_duration" -c copy -y "$chunk_path"
    printf '%s\n' "$chunk_path"

    part=$(( part + 1 ))
    start=$(( start + step ))
  done
}

# Return existing chunks (if any) or create them on demand.
get_or_create_chunks() {
  local audio_path=$1
  local total_seconds=$2
  local base=${audio_path%.opus}
  local -a matches=("${base}-part"*.opus)

  if (( ${#matches[@]} > 0 )); then
    printf '%s\n' "${matches[@]}" | LC_ALL=C sort
    return 0
  fi

  split_audio_chunks "$audio_path" "$total_seconds"
}

main() {
  # Resolve playlist target, workspace paths, and optional per-run limits.
  local playlist_url=${1:-"https://www.youtube.com/@se-lr5ff/videos"}
  local playlist_path="$OUTPUT_DIR/playlist.tsv"
  # Optional: limit processing for smoke tests by setting FAQ_MAX_VIDEOS=n.
  local max_videos_raw=${FAQ_MAX_VIDEOS:-}
  local max_videos=""
  if [[ -n ${max_videos_raw:-} ]]; then
    if [[ $max_videos_raw =~ ^[0-9]+$ ]] && (( max_videos_raw > 0 )); then
      max_videos=$max_videos_raw
    else
      echo "Ignoring FAQ_MAX_VIDEOS (must be a positive integer)." >&2
    fi
  fi

  # Fetch the playlist video IDs, titles, and durations.
  uvx yt-dlp --flat-playlist -J "$playlist_url" \
    | jq -r '.entries[] | [.id, .title, .duration] | @tsv' > "$playlist_path"

  # Process each video in the playlist file.
  # Track how many entries we've handled so the optional cap can short-circuit.
  local processed=0
  while IFS=$'\t' read -r video_id title seconds_raw; do
    if [[ -n $max_videos ]] && (( processed >= max_videos )); then
      break
    fi
    # Skip empty lines.
    [[ -z ${video_id//[$'\r\n']/} ]] && continue

    # Skip if transcript already exists (makes reruns nearly instant).
    local transcript_path
    transcript_path=$(compgen -G "$OUTPUT_DIR/*-${video_id}.md" | head -n1 || true)
    [[ -n $transcript_path ]] && continue

    # Download audio if not already present.
    local audio_path
    audio_path=$(compgen -G "$OUTPUT_DIR/*-${video_id}.opus" | head -n1 || true)
    if [[ -z $audio_path ]]; then
      # Download the audio in low-bitrate opus format.
      local video_url="https://www.youtube.com/watch?v=${video_id}"
      echo "Downloading https://youtu.be/$video_id"
      uvx --with mutagen yt-dlp --extract-audio --audio-format opus \
        --postprocessor-args "FFmpegExtractAudio:-c:a libopus -b:a 12k -ac 1 -application voip -vbr off -ar 8000 -cutoff 4000 -frame_duration 60 -compression_level 10" \
        --output "$OUTPUT_DIR/%(upload_date)s-%(id)s.%(ext)s" \
        "$video_url"
      # Verify the audio was downloaded. If not, skip this video.
      audio_path=$(compgen -G "$OUTPUT_DIR/*-${video_id}.opus" | head -n1 || true)
      [[ -z $audio_path ]] && { echo "Missing audio for ${video_id}" >&2; continue; }
    fi

    # Generate the FAQ transcript using the LLM.
    # Note: Use < /dev/null to avoid llm reading the playlist from stdin.
    local output_path="${audio_path%.opus}.md"
    echo "Transcribing https://youtu.be/$video_id"

    local seconds_clean=${seconds_raw%.*}
    if ! [[ $seconds_clean =~ ^[0-9]+$ ]]; then
      seconds_clean=0
    fi

    local duration
    # Write a short metadata header before streaming the FAQ content.
    duration=$(printf "%dh %dm" $((seconds_clean/3600)) $(((seconds_clean%3600)/60)))
    printf "# $title\n\n[![$title](https://i.ytimg.com/vi_webp/$video_id/sddefault.webp)](https://youtu.be/$video_id)\n\nDuration: $duration\n\n" > "$output_path"

    local -a chunk_paths=()
    # Reuse cached chunks when available instead of re-splitting.
    if (( seconds_clean > MAX_CHUNK_SECONDS )); then
      while IFS= read -r chunk_path; do
        [[ -n ${chunk_path// } ]] && chunk_paths+=("$chunk_path")
      done < <(get_or_create_chunks "$audio_path" "$seconds_clean")
    fi

    # If no chunks were created, just use the original audio.
    if (( ${#chunk_paths[@]} == 0 )); then
      chunk_paths=("$audio_path")
    fi

    # Process each chunk sequentially, appending to the output.
    local total_parts=${#chunk_paths[@]}
    if (( total_parts > 1 )); then
      echo "Processing ${total_parts} chunks for ${video_id}" >&2
    fi

    local next_question_number=1
    local part_index=0
    # Process each chunk and append to the output file.
    for chunk_path in "${chunk_paths[@]}"; do
      # If processing multiple parts, add instructions for numbering continuity.
      part_index=$(( part_index + 1 ))
      local system_prompt=$BASE_SYSTEM_PROMPT
      if (( total_parts > 1 )); then
        system_prompt+=$'\n\n'
        # Tell the model how to continue numbering across chunk boundaries.
        system_prompt+="You are processing part ${part_index}/${total_parts} of this audio. Continue numbering the Q/A pairs starting at Q${next_question_number}. Avoid repeating earlier answers except to reference them briefly."
      fi

      # Process the chunk with the LLM.
      local chunk_tmp
      chunk_tmp=$(mktemp "$OUTPUT_DIR/$(basename "${audio_path%.opus}").XXXXXX")
      if ! llm -m gemini-2.5-flash --system "$system_prompt" -a "$chunk_path" < /dev/null > "$chunk_tmp"; then
        echo "LLM failed for ${video_id} part ${part_index}" >&2
        rm -f "$chunk_tmp"
        continue
      fi

      # Append part header if needed.
      if (( total_parts > 1 )); then
        printf "\n## Part %d\n\n" "$part_index" >> "$output_path"
      fi

      # Append the chunk's FAQ content to the overall transcript.
      cat "$chunk_tmp" >> "$output_path"

      # Determine the last question number in this chunk to continue numbering.
      local last_question=""
      if grep -q '\*\*Q[0-9]\+:' "$chunk_tmp"; then
        last_question=$(grep -oE '\*\*Q([0-9]+):' "$chunk_tmp" | sed -E 's/\*\*Q([0-9]+):/\1/' | tail -n1)
      fi
      if [[ -n $last_question ]]; then
        next_question_number=$(( last_question + 1 ))
      fi

      # Clean up the temporary chunk file.
      rm -f "$chunk_tmp"
    done
    processed=$(( processed + 1 ))
  done < "$playlist_path"
}

if [[ ${FAQ_SH_SOURCE_ONLY:-0} -ne 1 ]]; then
  main "$@"
fi
