# Capstone — VivaAgent

## Objective
Create a real-time, voice-based AI agent capable of conducting an oral examination (viva) for students.

## Tech Stack
- **FastAPI + WebRTC:** For real-time audio streaming.
- **Claude 3.5 Sonnet:** For conversational logic and grading.
- **Whisper & ElevenLabs:** For STT and TTS.
- **LangGraph:** To manage the state of the exam (Introduction -> Questioning -> Grading).

## Requirements
1. The agent must ask 3 technical questions based on a provided syllabus.
2. It must listen to the student's answer, ask follow-up questions if the answer is vague, and grade the response.
3. Latency must be kept under 1.5 seconds.

## Deliverables
- A working web interface.
- Grading transcripts showing the AI's reasoning.

---

## 💬 Ask the AI Assistant

Have questions about this guide? Ask our virtual Teaching Assistant below!

<ai-widget prompt="Explain key concepts or solve questions related to the guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>

