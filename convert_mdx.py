#!/usr/bin/env python3
"""
convert_mdx.py — Convert Docusaurus MDX files to Docsify-compatible Markdown.

Transformations applied (in order):
1. Strip YAML frontmatter block (--- ... ---)
2. Remove `import { ... } from ...` JSX import lines
3. Convert <YouTube id="..." title="..." /> → clickable thumbnail image link
4. Convert Docusaurus admonitions (:::type ... :::) → Docsify callout blockquotes
5. Convert <kbd>...</kbd> — left as-is (HTML is fine in Docsify)
6. Rename file extension .mdx → .md

Admonition mapping:
  :::info    → ?>  (info, teal)
  :::tip     → ?>  (tip — reuse info style)
  :::note    → ?>  (note)
  :::warning → !>  (warning, orange)
  :::danger  → !>  (danger)
  :::caution → !>  (caution)
"""

import re
import sys
from pathlib import Path

# ── Admonition type → Docsify prefix ────────────────────────────────────────
ADMONITION_MAP = {
    "info": "?>",
    "tip": "?>",
    "note": "?>",
    "success": "?>",
    "warning": "!>",
    "danger": "!>",
    "caution": "!>",
}

# ── Regex patterns ────────────────────────────────────────────────────────────
RE_FRONTMATTER = re.compile(r"^---\s*\n.*?\n---\s*\n", re.DOTALL)
RE_JSX_IMPORT = re.compile(r"^import\s+\{[^}]+\}\s+from\s+['\"]@site/.*?['\"]\s*;\s*$", re.MULTILINE)
RE_YOUTUBE = re.compile(r'<YouTube\s+id=["\']([^"\']+)["\']\s+title=["\']([^"\']+)["\']\s*/>', re.IGNORECASE)
RE_ADMONITION_START = re.compile(r"^:::(info|tip|note|warning|danger|caution|success)\s*(.*)?$", re.IGNORECASE)
RE_ADMONITION_END = re.compile(r"^:::\s*$")


def convert_youtube(match: re.Match) -> str:
    vid_id = match.group(1)
    title = match.group(2)
    thumb = f"https://img.youtube.com/vi/{vid_id}/0.jpg"
    url = f"https://youtu.be/{vid_id}"
    return f'[![{title}]({thumb})]({url} "{title}")'


def convert_admonitions(text: str) -> str:
    """State-machine that converts :::type ... ::: blocks to Docsify blockquotes."""
    lines = text.splitlines()
    out = []
    in_admonition = False
    prefix = "?>"
    admonition_title = ""
    buffer = []

    def flush_admonition():
        nonlocal in_admonition, buffer, admonition_title, prefix
        # Emit title line if present, then body lines as blockquotes
        body_lines = buffer[:]
        # Remove leading/trailing blank lines inside the block
        while body_lines and not body_lines[0].strip():
            body_lines.pop(0)
        while body_lines and not body_lines[-1].strip():
            body_lines.pop()

        if admonition_title:
            out.append(f"{prefix} **{admonition_title}**")
        # Each non-empty line prefixed; blank lines become bare prefix
        for bl in body_lines:
            if bl.strip():
                out.append(f"{prefix} {bl}")
            else:
                out.append(prefix)
        in_admonition = False
        buffer = []
        admonition_title = ""

    for line in lines:
        if not in_admonition:
            m = RE_ADMONITION_START.match(line)
            if m:
                in_admonition = True
                atype = m.group(1).lower()
                prefix = ADMONITION_MAP.get(atype, "?>")
                admonition_title = (m.group(2) or "").strip()
                buffer = []
            else:
                out.append(line)
        else:
            if RE_ADMONITION_END.match(line):
                flush_admonition()
            else:
                buffer.append(line)

    # Unterminated admonition — flush anyway
    if in_admonition:
        flush_admonition()

    return "\n".join(out)


def convert_mdx(src: Path) -> Path:
    """Convert a single .mdx file in-place and return the new .md path."""
    text = src.read_text(encoding="utf-8")

    # 1. Strip YAML frontmatter
    text = RE_FRONTMATTER.sub("", text, count=1)

    # 2. Remove JSX import lines
    text = RE_JSX_IMPORT.sub("", text)

    # 3. Convert YouTube components
    text = RE_YOUTUBE.sub(convert_youtube, text)

    # 4. Convert admonitions
    text = convert_admonitions(text)

    # 5. Clean up excessive blank lines (> 2 consecutive)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # 6. Strip leading whitespace/blank lines from file start
    text = text.lstrip("\n")

    # Write as .md alongside the original (then we'll delete .mdx)
    dest = src.with_suffix(".md")
    dest.write_text(text, encoding="utf-8")

    # Remove original .mdx
    src.unlink()

    return dest


def main(root: str = "2026-02/docs"):
    root_path = Path(root)
    if not root_path.is_dir():
        print(f"ERROR: '{root}' is not a directory.", file=sys.stderr)
        sys.exit(1)

    mdx_files = sorted(root_path.rglob("*.mdx"))
    print(f"Found {len(mdx_files)} .mdx files under '{root}'")

    for f in mdx_files:
        dest = convert_mdx(f)
        print(f"  ✓  {f}  →  {dest}")

    print(f"\nDone. All {len(mdx_files)} files converted to .md")


if __name__ == "__main__":
    root_dir = sys.argv[1] if len(sys.argv) > 1 else "2026-02/docs"
    main(root_dir)
