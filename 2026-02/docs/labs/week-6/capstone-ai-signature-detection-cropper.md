# Capstone — AI Signature Detection & Cropper

## Objective
Process scanned documents to automatically detect, crop, and extract signatures using zero-shot vision models.

## Requirements
1. Use Grounding DINO to detect the bounding box of "handwritten signature" on document images.
2. Use OpenCV to crop the image based on the bounding box.
3. Pass the cropped image to a local Ollama vision model (like LLaVA) to verify it is indeed a signature.
4. Save validated signatures to an output directory.

## Deliverables
- A Python script that processes a folder of test images.
- The cropped output images.

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

