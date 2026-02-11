# Tru -- Truth-Anchored Thought Engine

A multi-perspective chatbot that blends rigorous physics and mathematics with human meaning and contemplative insight. Every response is structured through four lenses: **Physics**, **Math**, **Human**, and **Contemplative** -- with clear epistemic boundaries between established fact, mathematical framing, lived experience, and interpretive metaphor.

## Architecture

- **Frontend**: React Native (Expo) with monotone design, particle effects, and animated UI
- **Backend**: Python FastAPI server orchestrating OpenAI's Responses API

## Getting Started

### Backend

```bash
cd server
pip install -r requirements.txt
cp .env.example .env   # Add your OPENAI_API_KEY
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd app
npm install
npx expo start
```

Open Expo Go on your device and scan the QR code. Ensure your device is on the same network as your dev machine.

## Project Structure

```
Tru/
├── app/          # Expo (React Native) frontend
├── server/       # Python FastAPI backend
└── README.md
```
