# Requirements Audit — 21 Aug 2026

## Completed in the patched prototype

- React + Vite + Tailwind frontend remains intact.
- FastAPI/Python backend added as the primary API layer.
- SQLite database implemented for users, sessions, conversations, messages, knowledge, tickets and audit logs.
- MaaProject knowledge retrieval added before LLM generation.
- Gemini API integration is server-side and optional; deterministic grounded fallback works without a key.
- Email/password authentication implemented with salted scrypt password hashing and bearer sessions.
- Conversation persistence is linked to authenticated users.
- Support/problem ticket creation is persisted in SQLite.
- 12 knowledge documents are seeded into SQLite.
- Supplied dataset files retained: 110-row CSV, 88-record JSONL, 110-record complete JSONL.
- Dataset validation script passes: CSV 110 / supplied JSONL 88 / complete JSONL 110.
- 30 automated test cases are retained and executable through the backend.
- Vite proxies `/api` to FastAPI during development.
- Production build can be served by FastAPI after `npm run build`.

## Requirements that still depend on project-owner verification

1. The specification requires information from approved MaaProject sources. The included knowledge content should be cross-checked against the actual approved MaaProject documentation before a real-world deployment.
2. The specification recommends 50–100 high-quality FAQ/knowledge entries. The supplied CSV contains 110 records, but the runtime retrieval knowledge base currently has 12 richer documents. Expand/verify the knowledge documents if the evaluator interprets 50–100 as runtime knowledge documents rather than FAQ records.
3. Model comparison/cost/privacy/performance evaluation is a project deliverable. Gemini 2.5 Flash is the selected prototype model, but a formal benchmark against alternatives should be recorded if the evaluator requires the full comparison deliverable.
4. RAG with embeddings/vector storage is optional for the initial prototype and is not required for this first-stage implementation.

## Important distinction

The supplied dataset files do not automatically fine-tune the model. They are retained as structured project knowledge/training data. Actual model fine-tuning is a separate training/deployment operation.
