# Balto Evidence Lab - candidate demonstration

Updated 2026-11-04. React/TypeScript and Vite power the local demonstration. Use `npm install`, `npm run dev`, `npm test` and `npm run build`. The static `dist` build deploys through `.github/workflows/pages.yml`; both index.html and library.html are preserved. The presentation has 15 slides. See test-evidence.md for dated verification snapshots; a change description alone is not a passing test or deployment claim.

**Independent portfolio demonstration** for the Technical Support & AI Engineer take-home exercise. Not affiliated with Balto, Frontier, or Northwind.

## What is included
- React/TypeScript investigation dashboard, browser-side log classifier, hypotheses and checklists.
- Shared in-memory investigation input: accepted local log text supplies the diagnostics and source-grounded deterministic copilot. This is current-tab state, not a persistent evidence database or external model.
- Conservative connection exploration: explicitly supplied connection/session identifiers define correlation groups. Missing identifiers remain unknown; neighboring events do not prove a shared connection or total outage duration.
- Distinct scripted call scenarios and transcript-based QA rules. QA explanations refer to visible transcript evidence and editable criteria, not invented customer performance or a trained model.
- `src/analyzer.py`: deterministic Python event parser
- `tests/test_analyzer.py`: regression tests
- `data/example.log`: anonymized exercise-derived sample
- `docs/`: assessment reasoning, research, architecture, implementation roadmap, timed demo script and acquisition plan
- `public/downloads/`: assessment/research PDFs, editable PPTX/XLSX and companion source documents

## Run locally
```bash
npm install
npm run dev
npm test
npm run build
python -m unittest discover -s tests -v
python src/analyzer.py data/example.log
```

## Diagnostic principles
A repeated audio websocket keepalive timeout is confirmed. The cause is **not** confirmed. The customer’s missing call templates are associated with the *control* connection, and the supplied excerpt does not prove that the two failures share a cause. A 70/70 Mbps speed test does not prove persistent WebSocket reliability. VPN routing, inspection and idle-timeout policies merit controlled investigation.

## Privacy
This repository intentionally contains no applicant email links, private customer logs, credentials, or actual customer data. Assumptions and limitations are labeled. Product names are used descriptively.

## Deployment
GitHub Pages uses the built `dist` directory via GitHub Actions. Repository visibility and local test success alone do not establish a live deployment. Preserve the existing root and library.html destinations and verify public downloads after publishing.

## Sources
- https://www.balto.ai/ai-info-page/
- https://www.balto.ai/docs/
- https://www.balto.ai/real-time-agent-assist/
- https://www.hirefrontier.com/

## Submission
The candidate assessment PDF should be reviewed and submitted through the private submission portal, not published with private invitation URLs.
