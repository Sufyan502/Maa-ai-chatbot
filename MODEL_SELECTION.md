# AI Model Selection — Prototype

## Selected model
**Gemini 2.5 Flash** via the server-side Google GenAI SDK.

## Why
- Natural-language question answering
- Instruction following
- Good latency for a chatbot prototype
- API/SDK available for Python
- Supports context supplied by the MaaProject retrieval layer
- No model hosting/GPU is required

## Grounding strategy
The backend retrieves relevant MaaProject knowledge documents first and passes that context to the model. The system instruction explicitly says not to invent missing facts. If no API key is configured, the deterministic fallback uses the same knowledge base.

## Alternatives to compare later
- Gemini 2.5 Flash-Lite
- A suitable OpenAI hosted model
- A suitable open-source/self-hosted model

A production report should record accuracy, latency, cost, reliability and privacy/data-handling results for the final candidate comparison.
