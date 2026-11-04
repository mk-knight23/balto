<div align="center">

# BALTO LAB
### Technical Escalation × AI Engineering · Candidate Case Study

**A product-aware, evidence-first engineering portfolio built by [Kazi Musharraf](https://mkazi.live/).**

[![Live experience](https://img.shields.io/badge/Explore-Live_Interactive_Experience-C79A4D?style=for-the-badge)](https://mk-knight23.github.io/balto/)
[![Assessment](https://img.shields.io/badge/Read-Technical_Assessment-20355B?style=for-the-badge)](https://mk-knight23.github.io/balto/#assessment)
[![Files](https://img.shields.io/badge/Explore-Submission_Files-4B6584?style=for-the-badge)](https://drive.google.com/drive/folders/1h9wBimNSyHqrXaHGGsPt8O9si7QqGtDX?usp=sharing)

*Independent educational / hiring work sample. Not an official Balto application or an endorsed Balto product.*

</div>

---

## 🚀 Start here — review the case in under five minutes

New to the workspace? Open **Start here**, keep **page help** visible, and choose **Walk me through it** on any tab for three steps and expected results. **Show this control** highlights the relevant control without activating it. Use the top-bar **Dark / Light** switch or **Display settings** to choose your appearance. The [downloadable visitor guide](https://mk-knight23.github.io/balto/downloads/visitor-guide.md) covers all 17 tabs, demo boundaries and a plain-language glossary.

| Priority | Link | What a reviewer will find |
| --- | --- | --- |
| **01 · Balto live website** | **[Launch interactive experience ↗](https://mk-knight23.github.io/balto/)** | Product intelligence, Agent Assist simulation, escalation lab, support workflows |
| **02 · Technical assessment** | **[Read the five answers ↗](https://mk-knight23.github.io/balto/#assessment)** | Observations, hypotheses, next checks, resolution/verification, customer update |
| **03 · Source code** | **[Explore this repository ↗](https://github.com/mk-knight23/balto)** | React/TypeScript, Python parser, tests, architecture and design notes |
| **04 · Files and supporting assets** | **[Google Drive folder ↗](https://drive.google.com/drive/folders/1h9wBimNSyHqrXaHGGsPt8O9si7QqGtDX?usp=sharing)** | User-uploaded supporting materials; verify individual file access before sharing |
| **05 · Presentation** | **[Interactive slide deck ↗](https://mk-knight23.github.io/balto/#presentation)** | Technical storyline, diagrams, speaker notes and editable PPTX download |
| **06 · PDF / PowerPoint / Excel downloads** | **[Evidence library ↗](https://mk-knight23.github.io/balto/#library)** | Project-hosted PDF, presentation, workbook and documentation |
| **07 · Video production** | **[NotebookLM script and storyboard ↗](https://mk-knight23.github.io/balto/#video)** | Video-generation prompt, script and captions — *not an actual rendered video* |

> **Submission instructions:** The original hiring assignment requests **one PDF** uploaded through the private Greenhouse portal. This repository and the links above are supplemental evidence, not a replacement for the mandatory PDF.

## 🧭 Case brief: Northwind Services

The provided exercise concerns a remote agent who intermittently sees a reconnecting banner and loses on-screen call templates. Two long-lived connections exist: **control** (settings/templates) and **audio** (call audio). The logs reveal repeat audio WebSocket ping/pong timeouts, a control-socket reconnect, and call-start sequences. They **do not prove a VPN root cause**, a shared failure, or that every call failed to record.

<details>
<summary><strong>What is confirmed — and what is not</strong></summary>

**Confirmed from the complete supplied assessment excerpt:** audio ping/pong timeouts at **12:33:06, 13:48:39 and 16:12:38 UTC**; a control socket close/re-establish at **12:47:55–12:47:58**; duplicate socket warning at **13:52:10**; and START_CALL events at **16:05 and 16:09**.

**Still unknown:** VPN contribution; whether audio and control share a cause; actual recording outcomes for later CHECK_START_CALL events; client-side socket close codes; and the precise reinstall error.

**Important source distinction:** The repository's `data/example.log` is an abbreviated nine-entry teaching sample, **not** the full assessment excerpt. Its counts should not be substituted for the complete case narrative. The bundled parser intentionally does not invent a year or timezone when source timestamps omit them.

</details>

### Investigation philosophy

```text
Customer report
   ↓
Preserve and normalize evidence
   ↓
Control socket  |  Audio socket  |  Call state
   ↓
Confirmed facts  ≠  Hypotheses
   ↓
Customer + Northwind IT + Engineering
   ↓
Controlled test → Repeat calls → Customer confirmation
```

## 🧪 Interactive experiences

| Area | What can be tried | Accuracy boundary |
| --- | --- | --- |
| **Agent Assist** | Eight scripted call scenarios, contextual guidance, state transitions, checklist, simulated summaries | Synthetic conversations; no real-time Balto speech or live tenant |
| **Knowledge** | Searchable local articles, filters, citations and related results | Local sample content, not a Balto knowledge integration |
| **Quality Assurance** | Rule-weighted scorecards, evidence review, exports | Illustrative scoring; not an official QA model |
| **Agentic Insights** | Synthetic tables/charts with filters, comparison and CSV | Sample metrics are not real customer outcomes |
| **Voice workflow** | Keyword-driven simulated intent, handoff logic and optional device TTS | No production voice agent |
| **Escalation & diagnostics** | Timeline, hypothesis tracker, browser-local log parsing, redaction preview, exports | Deterministic analysis, no definitive diagnosis |
| **Investigation Copilot** | Evidence-linked drafts and human-review workflow | No LLM API connected |
| **Presentation & downloads** | Keyboard-accessible slides, speaker notes, downloadable files | Video materials are scripts, not a hosted recording |

## 📁 Technical evidence & downloads

**Direct links to actual files hosted in this repository:**

- [Assessment PDF](public/downloads/assessment.pdf) · [Written response](docs/ASSESSMENT_REASONING.md)
- [Editable PowerPoint](public/downloads/executive-deck.pptx) · [Interactive slides](https://mk-knight23.github.io/balto/#presentation)
- [Investigation Excel workbook](public/downloads/incident-workbook.xlsx)
- [Company research PDF](public/downloads/company-research.pdf) · [Research notes](docs/COMPANY_RESEARCH.md)
- [Architecture / technical design](docs/ARCHITECTURE.md) · [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Video script](public/downloads/video-script.md) · [NotebookLM prompt](docs/NOTEBOOKLM_VIDEO_PROMPT.md) · [Storyboard](public/downloads/video-storyboard.md)
- [Python analyzer](src/analyzer.py) · [Python tests](tests/test_analyzer.py) · [Frontend tests](src/domain.test.ts)
- [Source-grounded slide content](public/downloads/slide-content.json) · [Download manifest](public/downloads/manifest.json)

**Additional submitted files:** [Google Drive supporting folder ↗](https://drive.google.com/drive/folders/1h9wBimNSyHqrXaHGGsPt8O9si7QqGtDX?usp=sharing). The specific final three-page assessment and third-party presentation uploads may differ from older files in the repository. Use the Greenhouse-uploaded PDF as the authoritative assessment and confirm the Drive folder is shared with anyone who has the link.

## 👨‍💻 About the creator

**Kazi Musharraf** · Software Developer & AI Engineer · Approximately three years of software development experience.

I created this independent project to demonstrate something beyond a written answer: how I gather evidence, maintain uncertainty, build reproducible tooling, and communicate an escalation without overpromising.

**Professional profiles**

| Portfolio | GitHub | LinkedIn |
| --- | --- | --- |
| 🌐 **[mkazi.live ↗](https://mkazi.live/)** | 💻 **[mk-knight23 ↗](https://github.com/mk-knight23)** | 🤝 **[Kazi Musharraf ↗](https://www.linkedin.com/in/kazi-musharraf/)** |

**Why this fits the role:** observable Python and frontend code, tests, deliberate product research, analysis of two WebSocket channels, actionable customer/IT/Engineering questions and a customer-friendly status update. These are work-sample demonstrations, **not claims of prior Balto employment**.

## 🛠️ Run it yourself

Requires Node.js 22+ (CI uses Node 24) and Python 3.12+.

```bash
git clone https://github.com/mk-knight23/balto.git
cd balto
npm ci
npm run dev
npm test
npm run build
python3 -m unittest discover -s tests -v
python3 src/analyzer.py data/example.log
npx playwright install chromium
npx playwright test
```

The development site runs at `http://localhost:5173`. Vite outputs to `dist/`; the GitHub Pages workflow publishes that build. `index.html` and `library.html` remain supported routes.

<details>
<summary><strong>Architecture and implementation details</strong></summary>

- `src/main.tsx`: React application, interactive views, navigation and state.
- `src/domain.ts`: event parsing, scripted scenarios, QA rules, sample data, exports.
- `src/analyzer.py`: standard-library Python CLI, deterministic log extraction.
- `public/downloads/`: real binary reports, deck, spreadsheet and source material.
- `docs/`: case reasoning, research, constraints, implementation and validation.
- `e2e/`: browser journeys, downloads, accessibility and responsive testing.
- `.github/workflows/`: CI and static Pages deployment.
- `public/legacy/`: historical implementation retained for comparison; not the active application.

</details>

## ✅ Validation, security and limitations

The implementation includes TypeScript and Python unit tests, Playwright browser tests, GitHub Actions and an accessibility-check script. **Review current [Actions results](https://github.com/mk-knight23/balto/actions)** for the authoritative latest outcome; a green badge on an older commit does not prove a current build.

The app uses local mock data; no customer API access, production LLM, server-side transcription or CRM integrations are claimed. Log input is restricted; partial redaction is not a substitute for a real privacy review. CSV output includes spreadsheet-injection precautions. Recorded-video content has not been verified; the repository offers storyboard, subtitles and prompt files.

Official Balto references: [Balto AI](https://www.balto.ai/) · [Docs](https://www.balto.ai/docs/). All trademarks remain with their owners.

---

<div align="center">

### Evidence first. Human review always.

**[Explore the live lab](https://mk-knight23.github.io/balto/)** · **[Read the assessment](https://mk-knight23.github.io/balto/#assessment)** · **[Access supporting files](https://drive.google.com/drive/folders/1h9wBimNSyHqrXaHGGsPt8O9si7QqGtDX?usp=sharing)**

*Made with focused effort by Kazi Musharraf. Independent applicant portfolio.*

</div>

## November 4 continuation

Diagnostics and the Investigation Copilot now share one versioned, in-memory evidence source. Imports survive lab navigation; edits invalidate prior analysis, draft review and citations. Drafts count only active-source events and can explain a selected line with source/revision references. Delayed file reads are cancelled on navigation so they cannot overwrite newer evidence. The original assessment remains explicitly scoped to its bundled exercise.

The connection explorer groups explicit session/client/connection/socket identifiers by channel. Session/client views never calculate transport durations. Exact transport-ID intervals require valid timezone-bearing timestamps, unambiguous lifecycle pairs and consistent additional identifiers. Close codes, unmatched events and contradictory IDs remain visible; no root cause is inferred. A separate, clearly labeled synthetic connection fixture demonstrates the controls.

All eight scripts now contain distinct objections, responses, relevant articles, follow-up instructions and optional simulated supervisor recommendations. QA evaluates six visible Agent-utterance rules, exposes exact transcript matches, supports incomplete excerpts, and resets human overrides when the scenario or excerpt changes.

Large-file views are bounded: 500 evidence rows per source window; selected later lines remain reachable, with full filtered CSV/JSON exports. Connection views display at most 50 groups and 100 sequence entries per group; source previews cap at 5,000 characters with an explicit notice. Input limits remain 1 MiB and 10,000 lines. Lines with more than 16 explicit identifier fields remain unassigned rather than being partially grouped.
