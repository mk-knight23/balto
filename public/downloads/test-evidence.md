# Artifact verification evidence
Updated 2026-11-04. Artifact generation and dated local application verification snapshots are recorded separately below. November 3 results are historical; November 4 results cover the subsequent functional continuation.

- Executive presentation: 15 editable slides, shared text in slide-content.json; PPTX package, geometry and import validation via bundled artifact-tool finalizer.
- Workbook: 10 requested sheets, 10 verified OpenXML autoFilters, 2 list validations on task and verification statuses, and 7 COUNTIF/COUNTA source-event summary formulas. Imported-file sensitivity check changed one source event: summary audio timeout count recalculated 3 -> 2 -> 3 after restoration; the export was not modified by this test.
- PDFs: generated from supplied assessment and current official research; source discrepancy corrected to one START_CALL in the supplied excerpt.
- No customer resolution, production integration, runtime performance, Lighthouse score or public deployment is asserted here.
- Test results sheet now includes the subsequent local application checks below. Production deployment and customer resolution remain unverified.

## November 3 local application verification - historical snapshot
Verified by the main implementation agent on 2026-11-03, independently of artifact generation:

- Frontend domain tests: 10 passed using Vitest 4.1.12.
- Python tests: 11 passed.
- Playwright browser tests: 11 passed.
- TypeScript and Vite production build: passed.
- npm audit: 0 reported vulnerabilities at verification.
- axe accessibility, WCAG 2 A / AA: 17 sections checked, 0 violations.
- Mobile at 390px viewport: 17 sections checked, no horizontal overflow.

Public deployment was not yet verified when this record was updated. No Lighthouse score was measured or claimed. Microsoft PowerPoint and Excel application compatibility was not tested. These local checks do not establish production integrations, a customer fix or a rendered video.

## November 4 local application verification - continuation snapshot
Actual local results confirmed by the main implementation agent on 2026-11-04:

- Frontend domain tests: 37 passed with Vitest.
- Python tests: 11 passed.
- Playwright browser journeys: 17 passed.
- TypeScript and Vite production build: passed.
- npm audit: 0 reported vulnerabilities across all dependencies at verification.
- axe accessibility, WCAG 2 A / AA: all 17 sections checked, 0 violations. The loaded synthetic connection explorer also passed an automated axe check with 0 violations.
- Mobile at 390px viewport: all 17 sections checked, no horizontal overflow; covered within the browser journeys.
- Large-source regression: a 600-line input retains all 600 exported events while the displayed event window is limited to 500; L600 citations remain correct.
- Browser regressions cover pending-upload race behavior, shared-source navigation, distinct scenario alerts and QA reset.

The workbook retains the November 3 rows with an explicit snapshot date and appends November 4 rows. November 4 deployment remains pending verification. Lighthouse was not measured; Microsoft PowerPoint/Excel application compatibility was not tested. These checks validate the local synthetic demonstration, not a real customer resolution or production Balto integration.
