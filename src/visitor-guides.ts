export type GuideCategory = "learn" | "practice" | "investigate" | "project";
export type GuideStep = {
  title: string;
  instruction: string;
  result: string;
  selector: string;
};
export type PageGuideData = {
  simpleTitle: string;
  technicalTitle: string;
  purpose: string;
  outcome: string;
  boundary: string;
  category: GuideCategory;
  steps: GuideStep[];
};
const step = (
  title: string,
  instruction: string,
  result: string,
  selector: string,
): GuideStep => ({ title, instruction, result, selector: `#main ${selector}` });
export const pageGuides: Record<string, PageGuideData> = {
  overview: {
    simpleTitle: "Start here",
    technicalTitle: "Executive overview",
    category: "learn",
    purpose:
      "This is the entrance to an independent learning project about customer-support tools and connection troubleshooting.",
    outcome:
      "Choose a practice activity or investigate the example connection problem.",
    boundary:
      "This is an independent demonstration, not Balto's live product. Charts are illustrative; customer calls are simulated.",
    steps: [
      step(
        "Get your bearings",
        "Read the introduction to see what this workspace contains.",
        "You can distinguish the learning project from a live support platform.",
        ".hero",
      ),
      step(
        "Try a conversation",
        "Choose the conversation practice card to explore a scripted customer call.",
        "The practice page opens; no customer is contacted.",
        ".feature-card",
      ),
      step(
        "Explore the investigation",
        "Choose the connection investigation card to read the example incident.",
        "You see observations and unanswered questions from the supplied exercise.",
        ".feature-card.engineering",
      ),
    ],
  },
  products: {
    simpleTitle: "What the tools do",
    technicalTitle: "Product intelligence",
    category: "learn",
    purpose:
      "Learn how call guidance, a knowledge library, call reviews, and coaching can fit into a support team's day.",
    outcome:
      "Understand the purpose of each product idea before trying its demonstration.",
    boundary:
      "The research describes product concepts and links to sources. The demos are independent approximations, not evidence of Balto's implementation.",
    steps: [
      step(
        "Read the context",
        "Start with the research introduction and its source links.",
        "You know where the product descriptions came from.",
        ".research-intro",
      ),
      step(
        "Compare the tools",
        "Read the comparison table to connect each tool with its support task.",
        "You can choose a tool based on the problem it helps address.",
        ".table-scroll",
      ),
      step(
        "Follow the journey",
        "Read the workflow from a conversation through review and improvement.",
        "You understand how the individual tools relate to one another.",
        ".architecture-flow",
      ),
    ],
  },
  agent: {
    simpleTitle: "Practice a call",
    technicalTitle: "Agent Assist lab",
    category: "practice",
    purpose:
      "Watch a scripted customer conversation unfold alongside suggested responses and a practice checklist.",
    outcome:
      "See how timely guidance could help a support agent handle a conversation.",
    boundary:
      "All eight scenarios are scripted simulations. No real call, microphone, live transcription, or production AI is connected.",
    steps: [
      step(
        "Choose a situation",
        "Use the Scenario menu to choose a customer-support situation.",
        "The script and guidance match the selected situation.",
        '[aria-label="Scenario"]',
      ),
      step(
        "Start the practice",
        "Press Start call in the toolbar, then pause or advance the conversation as needed.",
        "Scripted messages appear in the transcript panel.",
        ".toolbar button",
      ),
      step(
        "Read the suggestions",
        "Compare the visible conversation with the contextual guidance and checklist.",
        "You can explain which response or action is useful at this point.",
        ".guidance",
      ),
    ],
  },
  knowledge: {
    simpleTitle: "Find an answer",
    technicalTitle: "AI knowledge center",
    category: "practice",
    purpose:
      "Search a small built-in article library to find guidance for a support question.",
    outcome:
      "Open a relevant article, read its source information, and copy useful guidance.",
    boundary:
      "This is local keyword search over bundled demonstration articles. It does not search the web or generate AI answers.",
    steps: [
      step(
        "Search a topic",
        "Type billing, escalation, or WebSocket into the search field.",
        "The article list narrows to matching bundled articles.",
        '[aria-label="Search knowledge"]',
      ),
      step(
        "Narrow the topic",
        "Choose a category to make the article list easier to scan.",
        "Only matching articles in that category are shown.",
        '[aria-label="Article category"]',
      ),
      step(
        "Open an article",
        "Choose an article from the results and read the explanation and citation.",
        "You can connect the advice to its visible source.",
        ".article-row",
      ),
    ],
  },
  qa: {
    simpleTitle: "Review a call",
    technicalTitle: "QA automation studio",
    category: "practice",
    purpose:
      "Review a scripted transcript against visible checks such as identity verification and a clear next step. QA means quality assurance.",
    outcome:
      "Understand how a weighted call-review score changes when evidence or rule weights change.",
    boundary:
      "Checks match phrases in scripted agent lines. They are not a semantic AI evaluation, compliance certification, or real employee score.",
    steps: [
      step(
        "Choose a sample",
        "Choose a Sample conversation in the first menu.",
        "The transcript and its phrase-based checks update together.",
        ".toolbar select",
      ),
      step(
        "Try missing evidence",
        "Change Transcript scope to the incomplete excerpt and compare the checks.",
        "You can see why missing lines should affect what can be claimed.",
        ".toolbar label:nth-child(2) select",
      ),
      step(
        "Inspect a rule",
        "Read a check, open its evidence, and try changing its weight or human override.",
        "The score reflects the visible rules and explicit reviewer choices.",
        ".rule",
      ),
    ],
  },
  coaching: {
    simpleTitle: "Improve a skill",
    technicalTitle: "Coaching & performance",
    category: "practice",
    purpose:
      "Choose one customer-support skill, read an example, and use a short checklist to practice it.",
    outcome:
      "Leave with one concrete phrase or behavior to try in the call practice lab.",
    boundary:
      "This is a simulated coaching plan and session checklist. It does not measure an employee's improvement or retain a performance history.",
    steps: [
      step(
        "Pick a skill",
        "Choose a Focus area such as empathy or identity verification.",
        "The practice example changes to fit your chosen skill.",
        ".two-col select",
      ),
      step(
        "Read and rehearse",
        "Read the practice prompt aloud and explain why it helps the customer.",
        "You have a specific example to use during practice.",
        ".coaching-example",
      ),
      step(
        "Track your practice",
        "Use the checklist as you rehearse; open the call lab when ready.",
        "The checkmarks describe this session's practice, not a measured score.",
        ".check-row input",
      ),
    ],
  },
  insights: {
    simpleTitle: "Explore sample results",
    technicalTitle: "Agentic insights",
    category: "practice",
    purpose:
      "Explore an invented set of call records to learn how filters, comparisons, and summary numbers work.",
    outcome:
      "Connect a chart or average with the sample call records behind it.",
    boundary:
      "All calls and metrics here are synthetic: invented for learning. They do not show real Balto customers, employee results, or business impact.",
    steps: [
      step(
        "Choose a time range",
        "Change Date range to inspect a different slice of the sample records.",
        "The visible summaries use only records matching the filters.",
        '[aria-label="Date range"]',
      ),
      step(
        "Compare a group",
        "Filter agent or scenario to see how the sample numbers change.",
        "You can compare selected examples without treating them as real results.",
        '[aria-label="Filter agent"]',
      ),
      step(
        "Inspect the records",
        "Read a table row and use Inspect to see the details behind a sample call.",
        "A summary number can be traced back to invented source records.",
        ".table-scroll",
      ),
    ],
  },
  voice: {
    simpleTitle: "Try a scripted chat",
    technicalTitle: "Voice agent simulator",
    category: "practice",
    purpose:
      "Type a customer question and follow a small scripted support conversation, including a handoff to a person.",
    outcome:
      "Understand the stages of a support flow by trying example messages.",
    boundary:
      "Replies follow fixed rules. There is no speech recognition, live phone call, or connected language model. Optional browser speech only reads text aloud.",
    steps: [
      step(
        "Type a question",
        "Enter a short message such as ‘I have a billing question’.",
        "Your message is ready to send to the local scripted flow.",
        '[aria-label="Voice simulator message"]',
      ),
      step(
        "Send your message",
        "Press Send message and read the reply above the input.",
        "A fixed rule selects a response; no human receives your message.",
        '[aria-label="Send message"]',
      ),
      step(
        "Follow the stages",
        "Read the state path as you continue or request a human agent.",
        "The highlighted stage shows where you are in this demonstration.",
        ".state-path",
      ),
    ],
  },
  incident: {
    simpleTitle: "Explore the example incident",
    technicalTitle: "Escalation command center",
    category: "investigate",
    purpose:
      "Read the supplied exercise about disappearing call templates and intermittent connection failures, then separate facts from possible explanations.",
    outcome:
      "Explain what was observed, what remains uncertain, and which diagnostic step could help next.",
    boundary:
      "This page always describes the bundled nine-line exercise. It does not change when you load another log in Diagnostics, and the excerpt does not prove a root cause.",
    steps: [
      step(
        "Read the situation",
        "Start with the incident banner and the context below it.",
        "You know the symptom reported in the supplied exercise.",
        ".incident-banner",
      ),
      step(
        "Explore the views",
        "Use Timeline, Hypotheses, Next diagnostic step, and Investigation notes to compare observations with ideas.",
        "A hypothesis remains a possible explanation, not a proven cause.",
        ".tabs button",
      ),
      step(
        "Try the log tools",
        "Choose Open diagnostics lab to inspect or replace the active source separately.",
        "Diagnostics opens; this incident page stays tied to its bundled exercise.",
        ".tab-action",
      ),
    ],
  },
  diagnostics: {
    simpleTitle: "Analyze your logs",
    technicalTitle: "WebSocket diagnostics",
    category: "investigate",
    purpose:
      "Turn log text into searchable events and connection sessions. A log is a list of messages describing what an application observed.",
    outcome:
      "Find a relevant event, inspect its original line, and distinguish evidence from timing assumptions.",
    boundary:
      "Logs are processed locally in app memory and cleared on reload. Parsing and timing checks do not prove a root cause; input has a 1 MB or 10,000-line limit.",
    steps: [
      step(
        "Choose your log",
        "Use the bundled text, load an example, paste text, or upload a plain-text log.",
        "The Log input shows the active source; other tabs do not secretly replace it.",
        '[aria-label="Log input"]',
      ),
      step(
        "Analyze the input",
        "Press Analyze logs after editing the text. Uploading or loading an example also analyzes it.",
        "Searchable events and connection findings use the current input revision.",
        ".log-input + .button-row button",
      ),
      step(
        "Find an event",
        "Use Search events and the channel or severity filters, then inspect a source line.",
        "Visible rows narrow to matching evidence from the active log.",
        '[aria-label="Search events"]',
      ),
    ],
  },
  copilot: {
    simpleTitle: "Draft an investigation summary",
    technicalTitle: "Investigation copilot",
    category: "investigate",
    purpose:
      "Turn the log currently analyzed in Diagnostics into a structured draft with references to its source lines.",
    outcome:
      "Review a draft summary or customer update, then check each claim against the log.",
    boundary:
      "There is no LLM or live language model. Fixed templates use the active parsed log in memory; edits require fresh analysis. Drafts need human review and cannot take actions.",
    steps: [
      step(
        "Choose a draft",
        "Pick a draft type from the list, such as Incident summary or Customer update.",
        "The text changes format while staying tied to the active source.",
        ".article-row",
      ),
      step(
        "Review the text",
        "Read the draft and check the stated observations, limitations, and references.",
        "You can distinguish a supported observation from a missing piece of evidence.",
        ".report-text",
      ),
      step(
        "Check its sources",
        "Open an exact source citation to inspect the original line in Diagnostics.",
        "You can trace a draft claim to its source rather than trusting the format alone.",
        ".evidence-citations",
      ),
    ],
  },
  assessment: {
    simpleTitle: "Read the findings",
    technicalTitle: "Technical assessment",
    category: "learn",
    purpose:
      "Read the written analysis of the supplied connection exercise, including what is known and what should be tested next.",
    outcome: "Understand the reasoning and take away a printable report.",
    boundary:
      "This independent assessment concerns the bundled exercise. The excerpt omits year and timezone, and no supplied evidence proves a VPN, server, or application root cause.",
    steps: [
      step(
        "Start with the summary",
        "Read the executive summary before opening the detailed findings.",
        "You understand the reported symptom and the open investigation.",
        ".toolbar + .panel",
      ),
      step(
        "Open a finding",
        "Expand a report section using its heading and read the supporting explanation.",
        "The detail explains the evidence and the limits of the conclusion.",
        ".assessment-detail summary",
      ),
      step(
        "Keep a copy",
        "Use Download PDF for the report, or Print report for the on-screen content.",
        "You receive a document you can read outside this website.",
        'a[href="./downloads/assessment.pdf"]',
      ),
    ],
  },
  architecture: {
    simpleTitle: "See how it fits together",
    technicalTitle: "Architecture & engineering",
    category: "learn",
    purpose:
      "See how this website processes local text, produces exports, and models a practice call. Read why audio and control messages need separate evidence.",
    outcome:
      "Build a mental picture of the system before reading detailed connection evidence.",
    boundary:
      "The diagrams explain this independent website and its practice flow. They are not verified internal Balto architecture or a live view of production infrastructure.",
    steps: [
      step(
        "Follow the flow",
        "Read the first diagram in order to see how the proposed components connect.",
        "You can name the main components and their relationships.",
        ".architecture-flow",
      ),
      step(
        "Read the responsibilities",
        "Read the component cards and the engineering considerations beneath them.",
        "You can explain which part would handle each kind of work.",
        ".three-col",
      ),
      step(
        "Follow a practice call",
        "Read the Call lifecycle diagram and the deliberate limitations below it.",
        "You understand the practice call states and which integrations are absent.",
        ".three-col + .panel .architecture-flow",
      ),
    ],
  },
  presentation: {
    simpleTitle: "View the slide deck",
    technicalTitle: "Executive presentation",
    category: "project",
    purpose:
      "Browse a 15-slide presentation that explains the project and its investigation in a meeting-friendly sequence.",
    outcome:
      "Understand the story at a glance or download editable slides for a presentation.",
    boundary:
      "Slides summarize this independent project and exercise. They are not an official Balto presentation or proof of production results.",
    steps: [
      step(
        "Pick a slide",
        "Choose a slide thumbnail to jump to that part of the story.",
        "The selected slide appears in the main presentation area.",
        ".slide-thumbnails button",
      ),
      step(
        "Move through the story",
        "Use the previous and next controls below the slide to browse in order.",
        "You can follow the whole presentation one slide at a time.",
        ".slide-controls button:not(:disabled)",
      ),
      step(
        "Download editable slides",
        "Choose Editable PPTX if you want to open and edit the deck in presentation software.",
        "An actual PowerPoint file downloads to your device.",
        'a[href="./downloads/executive-deck.pptx"]',
      ),
    ],
  },
  library: {
    simpleTitle: "Download project files",
    technicalTitle: "Evidence & downloads",
    category: "project",
    purpose:
      "Find the reports, slides, workbook, source logs, and production materials that support this project.",
    outcome:
      "Download a real file in the format you need and understand its role.",
    boundary:
      "Files are project artifacts and exercise materials, not production data. Downloaded copies are snapshots; inspect their descriptions before using them as evidence.",
    steps: [
      step(
        "Find a file type",
        "Use Filter file type to choose reports, spreadsheets, slides, or other materials.",
        "The download cards narrow to the selected format.",
        '[aria-label="Filter file type"]',
      ),
      step(
        "Read a description",
        "Read a file card to understand what it contains and why you might use it.",
        "You can choose a file by purpose rather than its technical extension.",
        ".download-grid .panel",
      ),
      step(
        "Download your file",
        "Use the download link on the file card and open it in suitable software.",
        "A file downloads; this does not connect to a live customer system.",
        ".download-grid a[download]",
      ),
    ],
  },
  video: {
    simpleTitle: "Plan the demo video",
    technicalTitle: "Video demonstration",
    category: "project",
    purpose:
      "Explore a seven-scene storyboard with narration and recording materials for creating a tour of this website.",
    outcome:
      "Choose a scene, review its suggested visuals, and download the script or captions.",
    boundary:
      "No final video has been recorded, rendered, or embedded here. This page contains production materials; caption timings are proposed.",
    steps: [
      step(
        "Choose a scene",
        "Select a scene in the storyboard to see its narration and on-screen direction.",
        "The scene details update to the selected part of the planned tour.",
        ".article-row",
      ),
      step(
        "Prepare to record",
        "Read the recording checklist and tick the items as you prepare.",
        "You have a practical reminder list for making a clear recording.",
        ".check-row input",
      ),
      step(
        "Get the script",
        "Download Script or Captions / SRT to use while producing a recording.",
        "You receive planning text, not a finished video file.",
        'a[href="./downloads/video-script.md"]',
      ),
    ],
  },
  about: {
    simpleTitle: "Meet the creator",
    technicalTitle: "About the creator",
    category: "project",
    purpose:
      "Learn who created this independent case study, why it was built, and where to find the creator's other work.",
    outcome:
      "Understand the project's authorship and follow the portfolio or source-code links.",
    boundary:
      "This is a creator profile for an independent project. It does not imply employment by, endorsement from, or an official partnership with Balto.",
    steps: [
      step(
        "Meet the author",
        "Read the creator introduction and the motivation for the project.",
        "You understand whose work you are viewing and why it exists.",
        ".about-hero",
      ),
      step(
        "Explore the portfolio",
        "Use the Portfolio or LinkedIn link if you want more professional context.",
        "The chosen external page opens in another tab.",
        'a[href="https://mkazi.live/"]',
      ),
      step(
        "View the source",
        "Use Balto case code to inspect the public project repository.",
        "You can see the source behind this independent demonstration.",
        'a[href="https://github.com/mk-knight23/balto"]',
      ),
    ],
  },
};
export const glossary = [
  {
    term: "WebSocket",
    definition:
      "A connection that stays open so an app and a server can exchange messages in both directions.",
  },
  {
    term: "QA",
    definition:
      "Quality assurance: reviewing a conversation against a set of checks. Here the checks use visible scripted phrases.",
  },
  {
    term: "Synthetic",
    definition:
      "Invented sample information made for learning. It does not describe real customers or business results.",
  },
  {
    term: "Hypothesis",
    definition:
      "A possible explanation to test. It is an idea, not a proven cause of a problem.",
  },
  {
    term: "UTC",
    definition:
      "A worldwide reference time. The bundled log has no timezone; treating its times as UTC is a convention, not a verified fact.",
  },
  {
    term: "Copilot",
    definition:
      "An assistant for preparing work for a person to review. This project's copilot uses fixed templates, not a connected AI model.",
  },
  {
    term: "Log",
    definition:
      "A text record of messages from an application. A line may describe an event or error without proving why it happened.",
  },
  {
    term: "Evidence",
    definition:
      "A source line or observation you can check. Evidence supports a statement; it may still leave the cause uncertain.",
  },
];
export function guideStepIndex(index: number, count: number): number {
  return Math.max(0, Math.min(index, Math.max(0, count - 1)));
}
