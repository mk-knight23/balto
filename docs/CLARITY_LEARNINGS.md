# Visitor clarity and guidance decisions

Updated 2026-11-05. Project knowledge from the visitor-guidance implementation; these are design decisions, not measured user-research findings.

## Explain the task before naming the technology

A first-time visitor should see what a page is for, what they can do and what result to expect before encountering terms such as QA, WebSocket or copilot. Keep a plain-language navigation title alongside the technical title. The 17 page definitions in `src/visitor-guides.ts` provide purpose, outcome, accuracy boundary and three instruction/result pairs.

## Reuse one guide source

The website and `public/downloads/visitor-guide.md` share content from `pageGuides` and `glossary` in `src/visitor-guides.ts`. Regenerate the Markdown when page labels, instructions or boundaries change; a downloaded copy remains a dated snapshot. Avoid maintaining a separate hand-written set of per-page instructions that can drift from the UI.

## Highlighting must not perform the action

Show this control scrolls, highlights and focuses an existing target. It must not invoke a call, upload, export or remediation action. A missing target needs an explanatory status message. When a step changes or the guide closes, remove its highlight and restore the prior tabindex. Honor reduced-motion settings during scrolling.

## Keep distinct evidence contexts visible

The incident and assessment explain the bundled exercise. Diagnostics and the deterministic copilot share the active analyzed input in memory. A visitor must be told when a page remains tied to the bundled example and when another page uses uploaded or edited input. Source citations and uncertainty matter more than confident-sounding summaries.

## Make demonstrations legible

Call scenarios are scripted; knowledge search is local; QA checks use visible phrases; analytics are synthetic; voice replies follow rules; the copilot uses fixed templates. Explain each boundary near the relevant activity. A finished-looking panel or completed walkthrough does not prove a production integration, verified root cause or customer outcome.

## Separate comfort preferences from evidence persistence

Light, dark, device-theme and effects preferences may be saved locally. Page-help visibility may also be remembered. Analyzed logs are in-memory session data and clear on reload. Do not imply that remembering appearance means incident evidence is retained.

## Downloads need the same discoverability as features

Add a dated visitor-guide card to the evidence library and link the guide near the README's Start here instructions. Retain user-provided portfolio, repository and supporting-material links. Download links should resolve to real files, and the manifest must record actual file size and SHA-256 after edits.

## Verification boundary

These notes record implementation intent. Accessibility, keyboard behavior, theme contrast, target discovery and mobile navigation require actual automated and browser checks before reporting success. No new test counts, Lighthouse scores or user-research outcomes are inferred here.
