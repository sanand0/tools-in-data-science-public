#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Build Orchestrator
# -----------------------------------------------------------------------------
# This script converts the existing docsify-style repository into a temporary
# Hugo site and builds static output into `public/`.
#
# Why this exists:
# - Keep source authoring unchanged (markdown + _sidebar.md files in-place)
# - Keep generated/build files out of git
# - Keep Hugo customization in committed scaffold files under `hugo/`
# -----------------------------------------------------------------------------

# Canonical paths used throughout the build.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCAFFOLD_DIR="$ROOT_DIR/hugo"
BUILD_ROOT="$ROOT_DIR/.hugo-build"
SITE_DIR="$BUILD_ROOT/site"
CONTENT_DIR="$SITE_DIR/content"
STATIC_DIR="$SITE_DIR/static"
SIDEBAR_DIR="$SITE_DIR/sidebars"
DATA_DIR="$SITE_DIR/data"
NAV_DATA_FILE="$DATA_DIR/sidebar-nav.yaml"
OUTPUT_DIR="$ROOT_DIR/public"

# Fail fast when required CLI tools are missing.
require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: missing required command '$1'" >&2
    exit 1
  fi
}

require_cmd git
require_cmd hugo
require_cmd go

# Hugo Book uses SCSS. Non-extended Hugo may fail at build time.
if ! hugo version 2>/dev/null | grep -qi "extended"; then
  echo "Warning: running without Hugo extended. Build may fail for themes that require SCSS." >&2
fi

# Ensure committed scaffold exists before proceeding.
if [[ ! -d "$SCAFFOLD_DIR" ]]; then
  echo "Error: missing Hugo scaffold at $SCAFFOLD_DIR" >&2
  exit 1
fi

# Start from a clean temporary site and output folder on every run.
rm -rf "$BUILD_ROOT" "$OUTPUT_DIR"
mkdir -p "$SITE_DIR" "$CONTENT_DIR" "$STATIC_DIR" "$SIDEBAR_DIR" "$DATA_DIR"

# Copy committed Hugo scaffold (config, layout overrides, styles).
cp -R "$SCAFFOLD_DIR"/. "$SITE_DIR"/

# Initialize and resolve Hugo modules in the temporary site.
# This fetches the theme declared in `hugo/hugo.toml`.
(
  cd "$SITE_DIR"
  hugo mod init github.com/sanand0/tools-in-data-science-public >/dev/null 2>&1 || true
  hugo mod get -u >/dev/null 2>&1
)

# Convert docsify sidebar markdown into Hugo-friendly sidebar markdown:
# - remove docsify-only inline <style> blocks
# - normalize links to Hugo permalink-style paths
normalize_sidebar() {
  local src="$1"
  local dst="$2"
  local section_root="$3"

  sed '/^[[:space:]]*<style>/d' "$src" | \
    BASE_URL="$section_root" perl -pe '
      BEGIN { $base = $ENV{"BASE_URL"} }
      s{\(README\.md\)}{($base)}g;
      s{\((?:\.\./)+([^)]+?)\.md\)}{(/$1/)}g;
      s{\((?!https?://|/|#|mailto:)([^)]+?)\.md\)}{(/$1/)}g;
      s{\((?!https?://|/|#|mailto:)([-a-zA-Z0-9_/]+)\)}{(/$1/)}g;
    ' > "$dst"
}

# Generate per-section sidebar files from existing sidebar sources.
normalize_sidebar "$ROOT_DIR/_sidebar.md" "$SIDEBAR_DIR/root.md" "/"
normalize_sidebar "$ROOT_DIR/2025-01/_sidebar.md" "$SIDEBAR_DIR/2025-01.md" "/2025-01/"
normalize_sidebar "$ROOT_DIR/2025-05/_sidebar.md" "$SIDEBAR_DIR/2025-05.md" "/2025-05/"
normalize_sidebar "$ROOT_DIR/2025-09/_sidebar.md" "$SIDEBAR_DIR/2025-09.md" "/2025-09/"

# Extract unique navigable links from a normalized sidebar.
# Used to define strict prev/next order that mirrors sidebar order.
sidebar_links() {
  local src="$1"
  perl -ne '
    while (/\(([^)]+)\)/g) {
      $u = $1;
      next if $u =~ m{^(https?://|mailto:|#)};
      $u =~ s/[?#].*$//;
      next if $u eq "";
      $u = "/$u" unless $u =~ m{^/};
      $u .= "/" unless $u =~ m{/$};
      print "$u\n";
    }
  ' "$src" | awk '!seen[$0]++'
}

# Append one sidebar's ordered links to a YAML map.
write_sidebar_nav_yaml() {
  local key="$1"
  local src="$2"
  echo "\"$key\":" >> "$NAV_DATA_FILE"
  while IFS= read -r link; do
    printf '  - "%s"\n' "$link" >> "$NAV_DATA_FILE"
  done < <(sidebar_links "$src")
}

# Build data file consumed by `hugo/layouts/_partials/docs/prev-next.html`.
rm -f "$NAV_DATA_FILE"
write_sidebar_nav_yaml "root" "$SIDEBAR_DIR/root.md"
write_sidebar_nav_yaml "2025-01" "$SIDEBAR_DIR/2025-01.md"
write_sidebar_nav_yaml "2025-05" "$SIDEBAR_DIR/2025-05.md"
write_sidebar_nav_yaml "2025-09" "$SIDEBAR_DIR/2025-09.md"

# Copy tracked markdown into Hugo content.
# Behavior:
# - skip docsify sidebar files
# - map README.md -> _index.md for clean section URLs
# - rewrite `images/` links to absolute `/images/`
while IFS= read -r rel; do
  case "$rel" in
    */_sidebar.md|_sidebar.md)
      continue
      ;;
  esac

  dest="$CONTENT_DIR/$rel"
  if [[ "$(basename "$rel")" == "README.md" ]]; then
    dest="$(dirname "$dest")/_index.md"
  fi

  mkdir -p "$(dirname "$dest")"
  cp "$ROOT_DIR/$rel" "$dest"
  sed -E -i 's#\((\.\./)?images/#(/images/#g' "$dest"
done < <(git -C "$ROOT_DIR" ls-files '*.md')

# Copy all non-markdown tracked files as static assets, excluding
# build/config scaffolding files that should not be published as assets.
while IFS= read -r rel; do
  mkdir -p "$STATIC_DIR/$(dirname "$rel")"
  cp "$ROOT_DIR/$rel" "$STATIC_DIR/$rel"
done < <(git -C "$ROOT_DIR" ls-files | rg -v '\.md$|^hugo/|^\.github/|^\.gitignore$|^setup\.sh$')

# Build final static site into `public/`.
hugo --source "$SITE_DIR" --destination "$OUTPUT_DIR" --minify

echo "Done. Static site generated at: $OUTPUT_DIR"
