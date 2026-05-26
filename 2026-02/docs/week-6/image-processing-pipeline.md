# Image Processing Pipeline

When scraping images, you often need to pre-process them before analysis or storage.

## OpenCV Basics
OpenCV is the standard for computer vision.
```python
import cv2

# Read image
img = cv2.imread('screenshot.png')

# Convert to grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Find contours (e.g., to isolate a document)
contours, _ = cv2.findContours(gray, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
```

## Bounding Boxes & Cropping
Use ML models (like YOLO or Grounding DINO) to detect objects, then use OpenCV to crop those bounding boxes and save them as individual files.

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

