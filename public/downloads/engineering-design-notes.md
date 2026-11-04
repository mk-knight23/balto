# Product boundaries and engineering upgrade notes

Updated 2026-11-04. The downloadable deck contains 15 slides sourced from slide-content.json. Dated local test snapshots appear in test-evidence.md; feature descriptions alone do not establish verification. Source correction: data/example.log has one START_CALL at 16:05:12.006 and omits year/timezone. No proprietary model, live Balto API, production RAG, telephony or customer outcomes are claimed.

## November 4 functional continuation
- Accepted local log input is shared in memory between diagnostics and the deterministic investigation copilot. Source references must use that accepted input, rather than silently reverting to the exercise sample. State is limited to the current browser tab; no backend evidence store or external LLM is connected.
- Connection exploration groups explicit connection/session identifiers only. Missing IDs, interleaved streams, incomplete lifecycle pairs and absent timestamp context retain uncertainty. Adjacency alone is not identity, a definitive reconnect pair or a complete outage measurement.
- Distinct scripted scenarios provide different conversation content and prompts. Transcript QA applies visible deterministic rules and weighted criteria to the selected synthetic conversation; any trend or performance metric remains synthetic.
- User-controlled drafts remain drafts. Generating a summary, diagnostic suggestion or customer update does not send a message or perform a remediation action.

## Current public product understanding
Balto's official Real-Time Agent Assist page describes dynamic prompts, AI Answers/AgentGPT grounded in knowledge sources, customer history and a customizable agent workspace. Its separate QA and Notes pages describe scorecard-backed evidence and automated post-call notes. The July 2026 RTG3 webinar discusses an intent-based agent homebase.

Verified public sources:
- https://www.balto.ai/real-time-agent-assist/
- https://www.balto.ai/call-center-quality-assurance-software/
- https://www.balto.ai/real-time-notetaker/
- https://www.balto.ai/resources/webinars/agent-assist-reimagined/
- https://www.balto.ai/press/ (official press page has image/media resources)

## What the independent Balto studio demonstrates
- Scripted scenario selection updates simulated conversation guidance and local knowledge context.
- Manual checklist interaction with visual progress.
- Mock note generation (no LLM, no audio, no CRM).
- Browser-side deterministic log extraction and event counts.
- Five-part incident assessment with clearly marked unknowns.
- Interactive 15-slide presentation and companion web document library.
- White/gold responsive glassmorphic layout.

## What it does NOT do
It does not connect to Balto, perform real-time audio transcription, reproduce proprietary UX, access real customer history, provide production AI Answers grounding, evaluate real customer calls or provide a live external AI model. Local synthetic transcript scoring is a transparent educational rule system.

## Image and branding policy
Use original graphics and navigation links to Balto's official product and press pages. Do not copy branded screenshots or logos into the candidate site without verifying permissions. Media resources are linked rather than downloaded from third-party page markup. This avoids implying endorsement and broken externally hosted assets.

## Why the approach matters
The hiring assessment is an investigation exercise. The simulation is optional supporting evidence of product understanding, not a replacement for the five written answers or the PDF required by Frontier.
