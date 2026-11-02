# Balto Balto · Evidence-First Escalation Lab

**Independent portfolio demonstration** for the Technical Support & AI Engineer take-home exercise. Not affiliated with Balto, Frontier, or Northwind.

## What is included
- `index.html`: standalone responsive white-and-gold investigation dashboard, browser-side log classifier, prioritized hypotheses and checklists
- `src/analyzer.py`: deterministic Python event parser
- `tests/test_analyzer.py`: regression tests
- `data/example.log`: anonymized exercise-derived sample
- `docs/`: assessment reasoning, research, architecture, implementation roadmap, timed demo script and acquisition plan
- `vercel.json`: static hosting configuration

## Run locally
```bash
python -m http.server 8000
# open http://localhost:8000
python -m unittest discover -s tests -v
python src/analyzer.py data/example.log
```

## Diagnostic principles
A repeated audio websocket keepalive timeout is confirmed. The cause is **not** confirmed. The customer’s missing call templates are associated with the *control* connection, and the supplied excerpt does not prove that the two failures share a cause. A 70/70 Mbps speed test does not prove persistent WebSocket reliability. VPN routing, inspection and idle-timeout policies merit controlled investigation.

## Privacy
This repository intentionally contains no applicant email links, private customer logs, credentials, or actual customer data. Assumptions and limitations are labeled. Product names are used descriptively.

## Deployment
Static site: import this repository to Vercel with framework **Other** and no build command, or enable GitHub Pages. GitHub repository visibility alone does not mean the website has been deployed.

## Sources
- https://www.balto.ai/ai-info-page/
- https://www.balto.ai/docs/
- https://www.balto.ai/real-time-agent-assist/
- https://www.hirefrontier.com/

## Submission
The candidate assessment PDF should be reviewed and submitted through the private submission portal, not published with private invitation URLs.
