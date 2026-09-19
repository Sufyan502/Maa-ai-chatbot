# MaaProject — Maa AI Chat

A React + Vite + Tailwind frontend with a **FastAPI + Python backend**, **SQLite prototype database**, MaaProject-specific knowledge base, grounded LLM integration, authentication, support tickets, conversation storage, and a 30-case test suite.

## Architecture

User → React/Vite → FastAPI → SQLite + MaaProject Knowledge Retrieval → Gemini API (optional) → FastAPI → React

The backend works without a Gemini key using a verified knowledge-grounded fallback. If `GEMINI_API_KEY` is configured, `gemini-2.5-flash` is used with the retrieved MaaProject context.

## Run locally

Prerequisites:
- Node.js 20+
- Python 3.10+

### 1. Frontend dependencies

```bash
npm install
```

### 2. Python backend

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r backend/requirements.txt
```

Create `.env` from `.env.example` and optionally add `GEMINI_API_KEY`.

### 3. Start both

```bash
npm run dev
```

This starts FastAPI on `http://127.0.0.1:8000` and Vite on `http://127.0.0.1:5173`.

Open the Vite address in the browser.

## Production prototype

```bash
npm run build
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

FastAPI serves the built frontend when `dist/` exists.

## Dataset

- `datasets/maaproject_finetuning_dataset.csv` — supplied 110-row dataset.
- `datasets/maaproject_train.jsonl` — supplied 88-record JSONL.
- `datasets/maaproject_train_complete.jsonl` — 110-record complete JSONL generated from the supplied CSV.
- `backend/knowledge.json` — 12 verified knowledge documents used by the runtime retrieval layer.

The dataset is **knowledge/training data; it is not automatically fine-tuning**. A fine-tuned model requires a separate provider training/deployment job.

## Database

SQLite is created automatically at:

`backend/data/maa_project.db`

It stores users, sessions, conversations, messages, knowledge documents, support tickets, and an audit log.

## Authentication

Email/password signup and login are implemented with salted `scrypt` password hashing and signed bearer sessions. Google OAuth is intentionally not faked; it can be added later when real OAuth credentials are available.

## AI / grounding

The backend retrieves relevant MaaProject documents before generating an answer. The LLM receives only the retrieved verified context and is instructed not to invent unavailable facts. Without an API key, the deterministic fallback still answers from the same knowledge base.

## Test suite

The UI contains 30 test cases across normal, complex, incomplete, misconception, out-of-scope, contextual, invalid, long, and multiple-question scenarios. Run them from the Test Suite page after the backend is running.

## Important scope note

The requirements document asks for MaaProject-specific approved information. Any factual MaaProject content should therefore be replaced/verified against the project's actual approved documentation before production use. The implementation does not claim that the included prototype knowledge is an external government source.
