# Workspace release verification — 2026-11-03

## Verified locally

- Vitest 4.1.12: 10 domain tests passed.
- Python unittest: 11 parser/CLI tests passed.
- Playwright: 11 browser journeys passed, including all primary section rendering, real download destinations, call lifecycle, knowledge search, weighted QA, log safety, filters, voice handoff, slides, investigation persistence, and responsive checks.
- axe-core WCAG 2 A/AA: zero automated violations on 17 workspace sections at 1440px viewport. This is not a claim of complete manual accessibility conformance.
- All 17 sections fit the 390px mobile viewport without document-level horizontal overflow; tables retain their own scroll containers.
- TypeScript and Vite production build passed; both index.html and library.html emitted.
- npm audit: zero reported vulnerabilities across installed dependencies.
- PPTX/PDF/XLSX package validation and rendered document review recorded in UPGRADE_STATUS.md and downloadable test-evidence.md.

## Review

Independent code review and a second-model adversarial review were completed. Resolved findings: impossible calendar dates, generic keepalive channel misclassification, stale evidence after failed parsing, hash-router skip link, modal focus handling, invalid Python timezone offsets/UTC overflow, investigation state persistence across labs, and deployment gates for Python/browser tests.

## Durable safeguards

Timestamp ambiguity and malformed timestamps are covered by regression tests. Exact source preservation and one-START_CALL evidence correction are documented in README and the assessment; duplicate learning files are unnecessary. The source excerpt is authoritative over historical prose. Local notes use session storage and are not evidence of an action taken.

## Limits

No live AI, telephony, CRM or customer system is connected. No final video rendered. No measured Lighthouse score, production performance, Office application compatibility, customer resolution or calibrated probabilities are claimed. The overview trend is an explicitly illustrative SVG; calculated metrics come from the filterable synthetic call rows. File anonymization is partial and requires human review.

Deployment verification belongs to the GitHub Actions run and a fresh public-site browser review; local test success alone does not establish that publication succeeded.
