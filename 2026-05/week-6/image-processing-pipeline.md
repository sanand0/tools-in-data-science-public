# Image Processing Pipeline

> **Scraped images are rarely usable as-is. Deduplicate, normalise, and crop them before they reach a model or a database.**

⏱ ~7 min read · ~12 min hands-on
🔗 needs: [Vision Models for Scraping](/2026-05/week-6/vision-models-for-scraping/)

Scrape a few thousand images and you'll have duplicates at different resolutions, EXIF-rotated photos that appear sideways, and 8 MB PNGs where a 200 KB JPEG would do. Fix that in a pipeline, once.

## Try it in 5 minutes — normalise and fingerprint

```python
# /// script
# requires-python = ">=3.12"
# dependencies = ["pillow>=10.0", "httpx>=0.28"]
# ///
"""Download an image, fix rotation, make a thumbnail, and fingerprint it for dedup.

Run:  uv run image_pipe.py
"""

import hashlib
import io

import httpx
from PIL import Image, ImageOps

URL = "https://books.toscrape.com/media/cache/2c/da/2cdad67c44b002e7ead0cc35693c0e8b.jpg"

raw = httpx.get(URL, timeout=30).raise_for_status().content
img = Image.open(io.BytesIO(raw))

img = ImageOps.exif_transpose(img)      # honour EXIF rotation — or photos come out sideways
img = img.convert("RGB")                # normalise mode (drops alpha, CMYK surprises)

# Perceptual-ish fingerprint: tiny grayscale thumbnail → hash.
# Resizing first means near-identical images at different sizes collide.
thumb = img.copy().resize((16, 16)).convert("L")
fingerprint = hashlib.sha256(thumb.tobytes()).hexdigest()[:16]

img.thumbnail((512, 512))               # cap dimensions, preserve aspect ratio
img.save(f"{fingerprint}.jpg", "JPEG", quality=85, optimize=True)

print(f"{img.size}  {len(raw):,}B → {len(open(f'{fingerprint}.jpg','rb').read()):,}B  id={fingerprint}")
```

✅ Rotation fixed, mode normalised, size capped, and a content-derived filename that makes duplicates collide automatically.

## The pipeline stages

| Stage | Why | Tool |
|---|---|---|
| **Validate** | Reject truncated/fake files early | `Image.open` + `verify()` |
| **Orient** | EXIF rotation shows photos sideways | `ImageOps.exif_transpose` |
| **Normalise** | Consistent mode/format downstream | `.convert("RGB")` |
| **Resize** | Models cap resolution; storage costs | `.thumbnail(...)` |
| **Fingerprint** | Detect duplicates and near-duplicates | Hash of a tiny thumbnail |
| **Strip metadata** | EXIF can carry GPS and device IDs | Re-save without EXIF |

**Pillow** covers all of this. Reach for **OpenCV** only when you need real computer vision — contours, deskewing, transforms:

```python
import cv2
gray = cv2.cvtColor(cv2.imread("scan.png"), cv2.COLOR_BGR2GRAY)
contours, _ = cv2.findContours(
    cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1],
    cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE,
)
```

## Metadata is a privacy decision

Scraped photos routinely carry **GPS coordinates**, timestamps, and camera serial numbers in EXIF. Re-publishing those can expose exactly where someone lives.

- Reading EXIF for analysis (see [OSINT](/2026-05/week-6/osint/)) is a legitimate technique.
- **Storing or republishing** it is personal data under GDPR/DPDP → [Legal & Ethical Scraping](/2026-05/week-6/legal-ethical-scraping/).

Default to stripping it unless you have a documented reason to keep it.

## When it fails

| Symptom | Cause | Fix |
|---|---|---|
| Photos sideways | EXIF orientation ignored | `ImageOps.exif_transpose` |
| `cannot write mode RGBA as JPEG` | Alpha channel → JPEG | `.convert("RGB")` first |
| Duplicates not caught | Hashing raw bytes (re-encoding changes them) | Hash a downscaled thumbnail |
| Memory blows up | Huge images loaded at full size | `Image.draft()`, or `thumbnail()` before processing |
| `DecompressionBombWarning` | Maliciously huge image | Keep Pillow's limit; skip the file |

## Your turn (≈12 min)

1. Run `image_pipe.py`; note the size reduction.
2. Download the same image twice at different sizes — confirm the fingerprints match while raw-byte hashes don't.
3. Find a photo with EXIF and print its GPS tags. Decide whether you'd store them, and write one line justifying it.
4. Batch it: process a folder, skipping anything whose fingerprint you've already seen.

## Checklist

- [ ] I apply EXIF rotation before anything else.
- [ ] I normalise mode and cap dimensions.
- [ ] I dedupe with a thumbnail-based fingerprint, not raw bytes.
- [ ] I know EXIF can contain GPS, and I strip it by default.
- [ ] I use Pillow for the pipeline and OpenCV only for actual CV work.

## Go deeper

- [Pillow handbook](https://pillow.readthedocs.io/en/stable/handbook/tutorial.html) — the whole toolkit.
- [OpenCV Python tutorials](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html) — contours, thresholding, transforms.
- [ExifTool](https://exiftool.org/) — inspect or wipe metadata from the command line.

<!-- SOURCES: https://pillow.readthedocs.io/en/stable/handbook/tutorial.html , https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html , https://exiftool.org/ -->
