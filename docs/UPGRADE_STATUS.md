# Download artifact status

Updated 2026-11-03. This record covers the downloadable evidence package only; consult application tests and deployment records for release status.

## Delivered
- `public/downloads/assessment.pdf`: five-question assessment with exact nine-line source appendix and explicit uncertainty.
- `public/downloads/company-research.pdf`: official-source product summary and capability mapping; vendor descriptions distinguished from independent evidence.
- `public/downloads/executive-deck.pptx`: 15 editable slides matching the requested topics, with source notes and shared `slide-content.json` text.
- `public/downloads/incident-workbook.xlsx`: ten requested sheets; source-event count formulas, filterable tables, validated status selectors and editable proposed investigation records.
- Markdown architecture/design/source mapping, script, storyboard, NotebookLM prompt, SRT captions, deployment notes and test-evidence notes.

## Evidence corrections
`data/example.log` contains nine lines and only one START_CALL (16:05:12.006), not the two START_CALL entries mentioned by older assessment prose. There are three audio timeout lines. The source omits timezone/year; UTC is an exercise assumption rather than source-encoded metadata. The adjacent control close/reconnect interval is 3.203 seconds; session identity and total outage duration remain unverified.

## Validation and limitations
The PPTX passed package integrity, layout geometry and artifact-tool re-import validation. All slides were rendered and visually reviewed. PDF pages were rendered and reviewed. Workbook source counts were checked and all ten sheet previews reviewed. No PowerPoint or Microsoft Excel application compatibility review was performed. Runtime application tests, production integrations, a rendered video, customer outcomes, measured ROI and a live deployment are not established by these artifacts. Captions are a draft timing guide and require alignment to an actual recording.
