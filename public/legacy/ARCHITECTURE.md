# Solution architecture and decision record
## Current implemented (verified by source)
- Standalone HTML/CSS/JS site with a white-and-gold design
- Deterministic browser-side classification for pasted log lines; no server or external AI API
- Python standard library parser outputting timestamped JSON and explicit limitations
- 3 Python unit tests and CI definition
- Anonymized sample dataset

## Proposed, not yet built
Ingestion adapters (Datadog export/API, Salesforce case, permitted support bundle) -> redaction and access control -> normalized event store -> correlation engine for control/audio sessions -> evidence citations -> optional LLM explanation with strict traceable provenance -> human-owned ticket workflow and audit trail.

## Risk controls
- Never silently upload raw logs
- Redact identifiers and customer PII
- Store incident evidence with retention controls
- Treat hypotheses as hypotheses; make uncertainty prominent
- Human approval before escalating or contacting customer
- Track baseline time-to-triage and reopen rate before claiming improvement

## Suggested phases
P0 static evidence lab -> P1 documented data model and schema validation -> P2 consented integrations/SSO -> P3 evaluator pilot and metrics -> P4 production security + observability.
