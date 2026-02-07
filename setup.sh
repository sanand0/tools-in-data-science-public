#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_ROOT="$ROOT_DIR/.hugo-build"
SITE_DIR="$BUILD_ROOT/site"
THEME_DIR="$SITE_DIR/themes/hugo-book"
CONTENT_DIR="$SITE_DIR/content"
STATIC_DIR="$SITE_DIR/static"
DATA_DIR="$SITE_DIR/sidebars"
DATA_NAV_DIR="$SITE_DIR/data"
NAV_DATA_FILE="$DATA_NAV_DIR/sidebar-nav.yaml"
LAYOUTS_DIR="$SITE_DIR/layouts/_partials/docs"
INJECT_DIR="$LAYOUTS_DIR/inject"
ASSETS_DIR="$SITE_DIR/assets"
OUTPUT_DIR="$ROOT_DIR/public"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: missing required command '$1'" >&2
    exit 1
  fi
}

require_cmd git
require_cmd hugo

if ! hugo version 2>/dev/null | grep -qi "extended"; then
  echo "Warning: running without Hugo extended. Build may fail for themes that require SCSS." >&2
fi

rm -rf "$BUILD_ROOT" "$OUTPUT_DIR"
mkdir -p "$THEME_DIR" "$CONTENT_DIR" "$STATIC_DIR" "$DATA_DIR" "$DATA_NAV_DIR" "$LAYOUTS_DIR" "$INJECT_DIR" "$ASSETS_DIR"

git clone --depth 1 https://github.com/alex-shpak/hugo-book "$THEME_DIR" >/dev/null 2>&1

cat > "$SITE_DIR/hugo.toml" <<'HUGO'
baseURL = '/'
languageCode = 'en-us'
title = 'Tools in Data Science'
theme = 'hugo-book'

disableKinds = ['taxonomy', 'term']

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true

[params]
  BookTheme = 'auto'
  BookToC = true
  BookSearch = true
  BookSection = '*'
HUGO

normalize_sidebar() {
  local src="$1"
  local dst="$2"
  local section_root="$3"

  # Drop docsify-only inline style tags and normalize links to Hugo permalinks.
  sed '/^[[:space:]]*<style>/d' "$src" | \
    BASE_URL="$section_root" perl -pe '
      BEGIN { $base = $ENV{"BASE_URL"} }
      s{\(README\.md\)}{($base)}g;
      s{\((?:\.\./)+([^)]+?)\.md\)}{(/$1/)}g;
      s{\((?!https?://|/|#|mailto:)([^)]+?)\.md\)}{(/$1/)}g;
      s{\((?!https?://|/|#|mailto:)([-a-zA-Z0-9_/]+)\)}{(/$1/)}g;
    ' > "$dst"
}

normalize_sidebar "$ROOT_DIR/_sidebar.md" "$DATA_DIR/root.md" "/"
normalize_sidebar "$ROOT_DIR/2025-01/_sidebar.md" "$DATA_DIR/2025-01.md" "/2025-01/"
normalize_sidebar "$ROOT_DIR/2025-05/_sidebar.md" "$DATA_DIR/2025-05.md" "/2025-05/"
normalize_sidebar "$ROOT_DIR/2025-09/_sidebar.md" "$DATA_DIR/2025-09.md" "/2025-09/"

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

write_sidebar_nav_yaml() {
  local key="$1"
  local src="$2"
  echo "\"$key\":" >> "$NAV_DATA_FILE"
  while IFS= read -r link; do
    printf '  - "%s"\n' "$link" >> "$NAV_DATA_FILE"
  done < <(sidebar_links "$src")
}

rm -f "$NAV_DATA_FILE"
write_sidebar_nav_yaml "root" "$DATA_DIR/root.md"
write_sidebar_nav_yaml "2025-01" "$DATA_DIR/2025-01.md"
write_sidebar_nav_yaml "2025-05" "$DATA_DIR/2025-05.md"
write_sidebar_nav_yaml "2025-09" "$DATA_DIR/2025-09.md"

cat > "$LAYOUTS_DIR/menu-filetree.html" <<'MENU'
{{ $path := .RelPermalink }}
{{ $sidebar := "root" }}
{{ if or (eq $path "/2025-01/") (hasPrefix $path "/2025-01/") }}
  {{ $sidebar = "2025-01" }}
{{ else if or (eq $path "/2025-05/") (hasPrefix $path "/2025-05/") }}
  {{ $sidebar = "2025-05" }}
{{ else if or (eq $path "/2025-09/") (hasPrefix $path "/2025-09/") }}
  {{ $sidebar = "2025-09" }}
{{ end }}

{{ $sidebarFile := printf "sidebars/%s.md" $sidebar }}
{{ $sidebarMarkdown := readFile $sidebarFile }}
{{ $sidebarMarkdown | markdownify }}
MENU

cat > "$LAYOUTS_DIR/prev-next.html" <<'PREV_NEXT'
{{ $path := .RelPermalink }}
{{ $nav := index .Site.Data "sidebar-nav" }}

{{ $activeKey := "root" }}
{{ if or (eq $path "/2025-01/") (hasPrefix $path "/2025-01/") }}
  {{ $activeKey = "2025-01" }}
{{ else if or (eq $path "/2025-05/") (hasPrefix $path "/2025-05/") }}
  {{ $activeKey = "2025-05" }}
{{ else if or (eq $path "/2025-09/") (hasPrefix $path "/2025-09/") }}
  {{ $activeKey = "2025-09" }}
{{ else if in (default (slice) (index $nav "2025-09")) $path }}
  {{ $activeKey = "2025-09" }}
{{ else if in (default (slice) (index $nav "2025-05")) $path }}
  {{ $activeKey = "2025-05" }}
{{ else if in (default (slice) (index $nav "2025-01")) $path }}
  {{ $activeKey = "2025-01" }}
{{ end }}

{{ $order := default (slice) (index $nav $activeKey) }}
{{ $ix := -1 }}
{{ range $i, $p := $order }}
  {{ if eq $p $path }}
    {{ $ix = $i }}
  {{ end }}
{{ end }}

{{ if ge $ix 0 }}
  {{ $prevPath := "" }}
  {{ $nextPath := "" }}
  {{ if gt $ix 0 }}
    {{ $prevPath = index $order (sub $ix 1) }}
  {{ end }}
  {{ if lt (add $ix 1) (len $order) }}
    {{ $nextPath = index $order (add $ix 1) }}
  {{ end }}

  {{ $prevPage := cond (ne $prevPath "") (.Site.GetPage $prevPath) nil }}
  {{ $nextPage := cond (ne $nextPath "") (.Site.GetPage $nextPath) nil }}
  {{ if or $prevPage $nextPage }}
  <div class="flex flex-wrap justify-between">
    <span>
    {{ with $prevPage }}
      <a href="{{ .RelPermalink }}" class="flex align-center">
        <img src="{{ partial "docs/icon" "backward" }}" class="book-icon" alt="{{ partial "docs/text/i18n" "Backward" }}" />
        <span>{{ partial "docs/title" . }}</span>
      </a>
    {{ end }}
    </span>
    <span>
    {{ with $nextPage }}
      <a href="{{ .RelPermalink }}" class="flex align-center">
        <span>{{ partial "docs/title" . }}</span>
        <img src="{{ partial "docs/icon" "forward" }}" class="book-icon" alt="{{ partial "docs/text/i18n" "Forward" }}" />
      </a>
    {{ end }}
    </span>
  </div>
  {{ end }}
{{ end }}
PREV_NEXT

cat > "$INJECT_DIR/head.html" <<'HEAD_INJECT'
<script>
  (function () {
    var t = localStorage.getItem("tds-theme");
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-user-theme", t);
    }
  })();
</script>
HEAD_INJECT

cat > "$INJECT_DIR/menu-after.html" <<'MENU_AFTER'
<button id="tds-theme-toggle" class="tds-theme-toggle" type="button" aria-label="Toggle dark and light mode">◐ Theme</button>
<script>
  (function () {
    var btn = document.getElementById("tds-theme-toggle");
    if (!btn) return;

    var getTheme = function () {
      var saved = localStorage.getItem("tds-theme");
      if (saved === "light" || saved === "dark") return saved;
      return "dark";
    };

    var applyTheme = function (theme) {
      document.documentElement.setAttribute("data-user-theme", theme);
      localStorage.setItem("tds-theme", theme);
      btn.textContent = theme === "dark" ? "☀ Light Mode" : "☾ Dark Mode";
    };

    applyTheme(getTheme());
    btn.addEventListener("click", function () {
      var now = document.documentElement.getAttribute("data-user-theme");
      applyTheme(now === "dark" ? "light" : "dark");
    });
  })();
</script>
MENU_AFTER

cat > "$ASSETS_DIR/_custom.scss" <<'CUSTOM_SCSS'
html[data-user-theme="light"] {
  @include theme-light;
}

html[data-user-theme="dark"] {
  @include theme-dark;
}

.tds-theme-toggle {
  margin-top: 1rem;
  width: 100%;
  border: 1px solid var(--gray-400);
  border-radius: 0.375rem;
  background: var(--body-background);
  color: var(--body-font-color);
  padding: 0.5rem 0.625rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.tds-theme-toggle:hover {
  border-color: var(--color-link);
}
CUSTOM_SCSS

# Copy tracked Markdown into Hugo content.
# - README.md becomes _index.md so section URLs stay clean.
# - _sidebar.md files are docsify-specific and intentionally skipped.
while IFS= read -r rel; do
  case "$rel" in
    */_sidebar.md|_sidebar.md)
      continue
      ;;
  esac

  dest="$CONTENT_DIR/$rel"
  base="$(basename "$rel")"
  if [[ "$base" == "README.md" ]]; then
    dest="$(dirname "$dest")/_index.md"
  fi

  mkdir -p "$(dirname "$dest")"
  cp "$ROOT_DIR/$rel" "$dest"
  sed -E -i 's#\((\.\./)?images/#(/images/#g' "$dest"
done < <(git -C "$ROOT_DIR" ls-files '*.md')

# Copy all other tracked files as static assets to preserve linked resources.
while IFS= read -r rel; do
  mkdir -p "$STATIC_DIR/$(dirname "$rel")"
  cp "$ROOT_DIR/$rel" "$STATIC_DIR/$rel"
done < <(git -C "$ROOT_DIR" ls-files | rg -v '\.md$')

hugo --source "$SITE_DIR" --destination "$OUTPUT_DIR" --minify

echo "Done. Static site generated at: $OUTPUT_DIR"
