#!/usr/bin/env -S uv run
from pathlib import Path


def update() -> None:
    """Run the updater."""
    ROOT = Path(__file__).resolve().parent
    playlist = [line.split("\t", 2) for line in (ROOT / "playlist.tsv").read_text().splitlines()]
    faqs = {path.stem.split("-", 1)[-1]: path.name for path in ROOT.glob("*-*.md")}

    readme = ROOT / "../live-sessions.md"
    head, sep, _ = readme.read_text(encoding="utf-8").partition("## Sessions")

    lines = []
    for video_id, title, seconds in playlist:
        if video_id not in faqs:
            continue
        # duration "%02d:%02d\n" $((secs/3600)) $(( (secs%3600)/60 ))
        title += f" ({float(seconds) // 3600:.0f}h {(float(seconds) % 3600) // 60:.0f}m)"
        line = f"- [Video](https://youtu.be/{video_id}) | [FAQ](live-sessions/{faqs[video_id]}) | {title}"
        lines.append(line)

    readme.write_text(f"{head}{sep}\n\n{'\n'.join(lines)}\n", encoding="utf-8")


if __name__ == "__main__":
    update()
