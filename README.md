# Balto Lab — engineering meets empathy

An independent contact-center engineering portfolio by **Kazi Musharraf — Software Developer & AI Engineer**. Inspired by publicly documented Balto capabilities; not affiliated with or endorsed by Balto. All calls are scripted, analytics are synthetic, and investigation findings cite the supplied exercise evidence.

## Run

Requires Node.js 22+ (CI uses Node 24) and Python 3.12+.

```bash
npm ci
npm run dev
npm test
npm run build
python3 -m unittest discover -s tests -v
python3 src/analyzer.py data/example.log
npx playwright install chromium
npx playwright test
```

Vite serves the workspace at http://localhost:5173. Build output is `dist/`. `index.html` and `library.html` remain supported, with relative assets for `/balto/` hosting. Original HTML and documentation are preserved in `public/legacy/` for historical reference.

## Working areas

- Executive overview and official-source product capability matrix.
- Eight scripted Agent Assist scenarios with start/pause/resume/end state transitions, progressive transcripts, contextual guidance, user checklist, call summary and JSON export.
- Seven local knowledge articles with search, categories, citations, source previews, related articles and session search history.
- QA studio with visible weighted rules, phrase evidence, adjustable weights, human overrides/review and evaluation export.
- Synthetic insights with 96 reproducible rows, date/agent/scenario filters, comparison, intent distribution, sorting, row drilldown and CSV export.
- Voice workflow with keyword intent rules, local knowledge lookup, clarification, human handoff recommendations and user-initiated device speech synthesis.
- Escalation workspace with exact line references, hypotheses, decision tree, session decision history and diagnostic criteria.
- Safe browser-local diagnostics with log upload/paste, source preservation, explicit-timezone normalization, channel/severity filters, search, partial anonymization preview and JSON/CSV export.
- Deterministic investigation drafts with evidence references and a human-review state. No LLM is connected.
- Technical assessment, architecture, coaching exercises, 15-slide keyboard-accessible presentation, actual PDFs/PPTX/XLSX, and a video production workspace.
- Global search (Ctrl/Cmd+K), skip link, modal focus handling, responsive drawer, reduced-motion and print styles.

## Evidence integrity

`data/example.log` contains **nine entries**: 3 audio timeouts, 1 control disconnect, 1 control reconnect, 1 duplicate socket, 2 CHECK_START_CALL and 1 START_CALL. The older assessment prose mentions a second START_CALL at 16:09:40; that event is absent from this excerpt and is excluded from the current findings. Source lines contain no year/timezone. The older assessment uses UTC by convention; the parsers leave these timestamps unresolved rather than inventing metadata.

The 3.203-second control reconnect interval is directly calculable within the same source date. No causal link between audio timeouts and missing templates is established. VPN involvement, recording failure, and a software defect remain unproven.

## Deployment

`.github/workflows/pages.yml` tests and builds with Node 24, uploads only `dist/`, then deploys to the existing GitHub Pages destination on pushes to `main`. `.github/workflows/ci.yml` checks TypeScript production build, frontend domain tests and Python tests. The Playwright suite can run locally or against an explicit deployment using `BALTO_TEST_URL`.

## Files and source boundaries

- `src/main.tsx`: UI and workspace state.
- `src/domain.ts`: parser, finite call state rules, safe CSV, local articles, scripted scenarios, deterministic synthetic dataset.
- `src/analyzer.py`: standard-library Python parser and CLI.
- `public/downloads/`: genuine binary deliverables, shared slide content, source-grounded research and production materials.
- `e2e/`: browser journeys, downloads, responsive layout, and automated accessibility checks.
- `docs/IMPLEMENTATION_PLAN.md`, `docs/UPGRADE_STATUS.md`: scope, evidence correction and limitations.

## Security and limitations

No secrets, account changes, telemetry, production AI, CRM, real-time audio capture or customer data. Uploaded text is parsed locally and never executed; inputs are limited to 1 MiB and 10,000 lines. CSV prefixes are neutralized to reduce spreadsheet formula injection. Redaction covers emails, IPv4 and client IDs only; manually review before sharing. Device speech synthesis is optional and user-initiated. External Google Fonts are requested for typography; system fallbacks apply if unavailable.

Video script, storyboard and proposed SRT timings are **not a rendered video**. Synthetic analytics cannot prove customer performance or connection stability. QA phrase matching is not semantic compliance assessment. The editable workbook and presentation are educational artifacts, not production integrations. No scientifically calibrated probabilities or Lighthouse scores are asserted.

Official research sources: [Balto platform](https://www.balto.ai/) and [documentation hub](https://www.balto.ai/docs/). Precise mappings are included in the downloadable research document.
