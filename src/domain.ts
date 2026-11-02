export type CallState = "idle" | "active" | "paused" | "ended";
export function nextCallState(state: CallState, action: string): CallState {
  if (action === "reset") return "idle";
  if (action === "start" && (state === "idle" || state === "ended"))
    return "active";
  if (action === "pause" && state === "active") return "paused";
  if (action === "resume" && state === "paused") return "active";
  if (action === "end" && (state === "active" || state === "paused"))
    return "ended";
  return state;
}
export interface LogEvent {
  id: string;
  line: number;
  raw: string;
  time: string;
  utc: string | null;
  severity: string;
  kind: string;
  channel: "Audio" | "Control" | "Call" | "Unknown";
}
export const sampleLog = `Sep 14 12:33:06.442 WARN audio-forwarding Ping Pong Monitor timeout, closing websocket
Sep 14 12:47:55.018 INFO server user socket closed
Sep 14 12:47:58.221 INFO server established connection
Sep 14 13:48:39.180 WARN audio-forwarding Ping Pong Monitor timeout, closing websocket
Sep 14 13:52:10.445 INFO server Duplicate socket for client_id EXAMPLE, closing
Sep 14 16:05:11.884 INFO server Received stage CHECK_START_CALL
Sep 14 16:05:12.006 INFO server Received stage START_CALL
Sep 14 16:12:38.901 WARN audio-forwarding Ping Pong Monitor timeout, closing websocket
Sep 14 16:20:52.266 INFO server Received stage CHECK_START_CALL`;
export function parseLogs(text: string): LogEvent[] {
  if (new TextEncoder().encode(text).length > 1024 * 1024)
    throw Error("Maximum input is 1 MB.");
  const lines = text.split(/\r?\n/);
  if (lines.length > 10000) throw Error("Maximum input is 10,000 lines.");
  return lines.flatMap((raw, i) => {
    if (!raw.trim()) return [];
    const stamp =
      raw.match(
        /^(\d{4}-\d\d-\d\d[T ]\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)?|[A-Z][a-z]{2}\s+\d{1,2}\s+\d\d:\d\d:\d\d(?:\.\d+)?)/,
      )?.[1] || "";
    const explicit = /^\d{4}.*(?:Z|[+-]\d\d:\d\d)$/.test(stamp);
    const parts = stamp.match(/^(\d{4})-(\d\d)-(\d\d)[T ](\d\d):(\d\d):(\d\d)/);
    const calendar = parts
      ? Number(parts[2]) >= 1 &&
        Number(parts[2]) <= 12 &&
        Number(parts[3]) >= 1 &&
        Number(parts[3]) <=
          new Date(
            Date.UTC(Number(parts[1]), Number(parts[2]), 0),
          ).getUTCDate() &&
        Number(parts[4]) < 24 &&
        Number(parts[5]) < 60 &&
        Number(parts[6]) < 60
      : false;
    const date = explicit && calendar ? new Date(stamp) : null;
    let kind = "unclassified";
    if (/ping.?pong.*timeout|pong.*timeout/i.test(raw))
      kind = /audio/i.test(raw)
        ? "audio_keepalive_timeout"
        : "keepalive_timeout";
    else if (/duplicate socket/i.test(raw)) kind = "duplicate_socket";
    else if (/user socket closed/i.test(raw)) kind = "control_disconnect";
    else if (/established connection/i.test(raw)) kind = "control_connect";
    else if (/CHECK_START_CALL/.test(raw)) kind = "check_start_call";
    else if (/\bSTART_CALL\b/.test(raw)) kind = "start_call";
    else if (/END_CALL/.test(raw)) kind = "end_call";
    const channel = /audio/i.test(raw)
      ? "Audio"
      : /socket|established connection|control/i.test(raw)
        ? "Control"
        : /CALL/.test(raw)
          ? "Call"
          : "Unknown";
    return [
      {
        id: `L${i + 1}`,
        line: i + 1,
        raw,
        time: stamp || "Timestamp unavailable",
        utc: date && !isNaN(date.getTime()) ? date.toISOString() : null,
        severity:
          raw.match(/\b(WARN|ERROR|INFO|DEBUG|FATAL)\b/)?.[1] || "UNKNOWN",
        kind,
        channel,
      },
    ];
  });
}
export function toCSV(headers: string[], rows: unknown[][]) {
  const quote = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replaceAll('"', '""') + '"';
  };
  return [headers, ...rows].map((r) => r.map(quote).join(",")).join("\r\n");
}
export function download(name: string, body: string, type = "text/plain") {
  const u = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
export function qaScore(rules: { weight: number; pass: boolean }[]) {
  const total = rules.reduce((s, r) => s + r.weight, 0);
  return total
    ? Math.round(
        (rules.reduce((s, r) => s + (r.pass ? r.weight : 0), 0) / total) * 100,
      )
    : 0;
}
export const scenarioNames = [
  "Billing dispute",
  "Cancellation request",
  "Insurance inquiry",
  "Customer frustration",
  "Technical troubleshooting",
  "Subscription renewal",
  "Payment collection",
  "Supervisor escalation",
];
export const syntheticCalls = Array.from({ length: 96 }, (_, i) => ({
  id: `DEMO-${String(i + 1).padStart(3, "0")}`,
  day: 1 + (i % 30),
  agent: ["Alex", "Jamie", "Morgan"][i % 3],
  scenario: scenarioNames[i % 8],
  duration: 180 + ((i * 37) % 420),
  qa: 68 + ((i * 13) % 32),
  resolved: i % 5 !== 0,
  escalated: i % 7 === 0,
}));
export function filterCalls(
  rows: typeof syntheticCalls,
  agent: string,
  scenario: string,
  days: number,
) {
  return rows.filter(
    (r) =>
      (agent === "All agents" || r.agent === agent) &&
      (scenario === "All scenarios" || r.scenario === scenario) &&
      r.day <= days,
  );
}
export const articles = [
  {
    id: "KB-001",
    title: "Understanding a billing adjustment",
    category: "Billing",
    body: "Verify the customer’s identity before reviewing a charge. Compare the invoice with the agreed plan and explain the charge line by line. Document the disputed amount. Never promise a refund before authorization.",
    tags: "billing dispute invoice charge refund",
  },
  {
    id: "KB-002",
    title: "A thoughtful cancellation conversation",
    category: "Retention",
    body: "Acknowledge the request without pressure. Ask permission to understand the reason. Explain available options and any terms. Confirm the customer’s choice and document the effective cancellation date.",
    tags: "cancel cancellation subscription renewal",
  },
  {
    id: "KB-003",
    title: "Investigating WebSocket interruptions",
    category: "Technical",
    body: "Correlate control and audio connection IDs. Capture exact timestamps and timezone, close codes, ping/pong thresholds, app versions and approved network comparison results. Audio timeouts do not establish a control-channel failure or a root cause.",
    tags: "websocket technical network vpn timeout ping pong",
  },
  {
    id: "KB-004",
    title: "Escalating with context",
    category: "Support",
    body: "Explain why a supervisor is needed. Ask permission before transfer. Provide a concise summary, impact, evidence and actions already attempted. Never claim the transfer occurred until confirmed.",
    tags: "supervisor frustration escalation angry",
  },
  {
    id: "KB-005",
    title: "Explaining coverage responsibly",
    category: "Insurance",
    body: "Verify identity and consult the applicable policy. Explain that coverage depends on specific terms, eligibility and exclusions. Escalate uncertain coverage questions to a licensed specialist. This is sample training guidance, not insurance advice.",
    tags: "insurance inquiry policy coverage",
  },
  {
    id: "KB-006",
    title: "Respectful payment collection",
    category: "Billing",
    body: "Confirm identity and consent before discussing balances. Explain the balance, offer approved options, and never request full payment-card data in this demonstration. Escalate disputes and hardship cases for human review.",
    tags: "payment collection balance card compliance",
  },
  {
    id: "KB-007",
    title: "Renewal options and next steps",
    category: "Retention",
    body: "Review the current plan and ask about changing needs. Explain renewal pricing, term length and cancellation terms clearly. Obtain explicit consent before any renewal. The demo performs no account changes.",
    tags: "subscription renewal plan pricing",
  },
];
export function searchArticles(q: string, category = "All categories") {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  return articles.filter(
    (a) =>
      (category === "All categories" || a.category === category) &&
      terms.every((t) =>
        (a.title + " " + a.body + " " + a.tags).toLowerCase().includes(t),
      ),
  );
}
export function scenarioSteps(name: string) {
  const first: Record<string, string> = {
    "Billing dispute": "My bill is higher than expected. I was charged twice.",
    "Cancellation request": "I would like to cancel my subscription.",
    "Insurance inquiry": "Can you explain what my policy covers?",
    "Customer frustration":
      "I have called three times and this is still not fixed.",
    "Technical troubleshooting":
      "The reconnecting banner appears and my templates disappear.",
    "Subscription renewal": "My subscription is ending. What are my options?",
    "Payment collection": "I need help understanding my outstanding balance.",
    "Supervisor escalation": "I would like to speak with your supervisor.",
  };
  return [
    {
      speaker: "Agent",
      text: "Thank you for calling. This is Alex. This is a simulated, recorded training call.",
      stage: "Greeting",
      suggestion: "Start with a clear introduction and recording disclosure.",
    },
    {
      speaker: "Customer",
      text: first[name] || first["Billing dispute"],
      stage: "Discover",
      suggestion:
        name === "Technical troubleshooting"
          ? "Ask for the exact occurrence time and timezone."
          : "Acknowledge the concern, then verify identity before discussing account details.",
    },
    {
      speaker: "Agent",
      text: "I understand how frustrating that can be. Before we review your account, may I verify your identity?",
      stage: "Verify",
      suggestion:
        "Use the approved verification process. Do not collect sensitive details in this demo.",
    },
    {
      speaker: "Customer",
      text: "Yes, I have completed verification. Can you explain what happens next?",
      stage: "Investigate",
      suggestion: `Consult ${name === "Technical troubleshooting" ? "KB-003" : "KB-001"} and explain the next step. Ask one focused follow-up question.`,
    },
    {
      speaker: "Agent",
      text:
        name === "Technical troubleshooting"
          ? "I will document the timing and request an approved network comparison. The cause is not confirmed."
          : "I will document your request and review the available options. Any account adjustment requires authorization.",
      stage: "Resolve",
      suggestion:
        "Set a clear expectation; do not promise an unapproved outcome.",
    },
    {
      speaker: "Customer",
      text: "Thank you for explaining the next steps.",
      stage: "Wrap up",
      suggestion:
        "Summarize the concern, agreed action, and follow-up. Confirm whether anything else is needed.",
    },
  ];
}
