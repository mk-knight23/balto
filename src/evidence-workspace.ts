import { parseLogs } from "./domain";
import type { LogEvent } from "./domain";
export interface EvidenceWorkspace {
  input: string;
  label: string;
  revision: number;
  events: LogEvent[];
  analyzed: boolean;
  error: string;
}
export type DraftMode =
  | "Incident summary"
  | "Customer update"
  | "Engineering escalation"
  | "Diagnostic checklist"
  | "Explain selected evidence";
export const draftModes: DraftMode[] = [
  "Incident summary",
  "Customer update",
  "Engineering escalation",
  "Diagnostic checklist",
  "Explain selected evidence",
];
export function createEvidenceWorkspace(
  input: string,
  label: string,
): EvidenceWorkspace {
  return analyzeEvidenceWorkspace({
    input,
    label,
    revision: 1,
    events: [],
    analyzed: false,
    error: "",
  });
}
export function editEvidenceWorkspace(
  w: EvidenceWorkspace,
  input: string,
  label = w.label,
): EvidenceWorkspace {
  return {
    input,
    label,
    revision: w.revision + 1,
    events: [],
    analyzed: false,
    error: "",
  };
}
export function analyzeEvidenceWorkspace(
  w: EvidenceWorkspace,
): EvidenceWorkspace {
  try {
    return { ...w, events: parseLogs(w.input), analyzed: true, error: "" };
  } catch (e) {
    return {
      ...w,
      events: [],
      analyzed: false,
      error: e instanceof Error ? e.message : "Unable to parse input.",
    };
  }
}
const reference = (w: EvidenceWorkspace, e: LogEvent) =>
  `${w.label} · revision ${w.revision} · ${e.id}`;
function eventSummary(w: EvidenceWorkspace) {
  const kinds = [...new Set(w.events.map((e) => e.kind))];
  return (
    kinds
      .map((k) => {
        const matches = w.events.filter((e) => e.kind === k);
        const refs = matches
          .slice(0, 20)
          .map((e) => e.id)
          .join(", ");
        return `${k}: ${matches.length} [${refs}${matches.length > 20 ? `; ${matches.length - 20} further entries` : ""}]`;
      })
      .join("\n") || "No source entries supplied."
  );
}
export function previewEvidence(raw: string): string {
  return raw.length > 5000
    ? raw.slice(0, 5000) +
        "\n[Preview truncated after 5,000 characters; the complete source is available in Diagnostics JSON/CSV export.]"
    : raw;
}
export function buildEvidenceDraft(
  mode: DraftMode,
  w: EvidenceWorkspace,
  selectedId?: string,
): string {
  const header = `DRAFT — HUMAN REVIEW REQUIRED\nSource: ${w.label} · revision ${w.revision}\n`;
  if (!w.analyzed)
    return (
      header +
      "\nAnalyze the current input in WebSocket Diagnostics before generating a draft. " +
      (w.error || "Previous analysis was invalidated when the input changed.")
    );
  const recognized = w.events.filter((e) => e.kind !== "unclassified");
  const audio = w.events.filter((e) => e.kind === "audio_keepalive_timeout");
  const unknown = w.events.filter((e) => !e.utc);
  const observations = `${audio.length} audio keepalive timeout${audio.length === 1 ? "" : "s"} observed in this source.\n${eventSummary(w)}\n${unknown.length} of ${w.events.length} entries lack a valid explicit UTC timestamp.\nNo root cause is established. No customer action or fix has been verified.`;
  const missing =
    "MISSING CONTEXT\nReported impact, customer symptom times, connection/session identifiers where absent, keepalive thresholds, close reasons, affected-user scope, and recording outcomes require confirmation. No exercise-specific symptoms are attached to this source.";
  if (mode === "Explain selected evidence") {
    const e = selectedId
      ? w.events.find((x) => x.id === selectedId)
      : w.events[0];
    if (selectedId && !e)
      return (
        header +
        "\nSelected evidence is unavailable in the active source. Select an existing line; no replacement evidence was used."
      );
    if (!e)
      return (
        header +
        "\nNo source entry is available to explain. No root cause is established."
      );
    let explanation =
      "No known lifecycle rule matched this text. Inspect the exact source and gather application-specific context; no failure is inferred.";
    if (/keepalive_timeout/.test(e.kind))
      explanation =
        "The source records a missed expected keepalive. It does not identify whether a network interruption, runtime delay, or another condition caused it. The configured threshold and peer behavior are not supplied.";
    if (e.kind === "duplicate_socket")
      explanation =
        "The source reports a duplicate socket. Expected replacement/session semantics must be checked before interpreting this as a defect.";
    if (e.kind === "control_disconnect")
      explanation =
        "A socket-close message was observed. It does not establish why the connection closed, total impact, or a successful later recovery.";
    if (e.kind === "control_connect")
      explanation =
        "An established-connection message was observed. It does not alone verify templates, audio, or end-to-end recovery.";
    if (e.kind === "check_start_call")
      explanation =
        "A call-start check was observed. This is not a START_CALL or a confirmed recording outcome.";
    if (e.kind === "start_call" || e.kind === "end_call")
      explanation =
        "A call lifecycle signal was observed. Recording completeness and customer outcome are not established by this line alone.";
    return `${header}\n[${reference(w, e)}]\nEXACT SOURCE\n${previewEvidence(e.raw)}\n\nOBSERVATION\n${e.kind}; channel classification: ${e.channel}; severity: ${e.severity}.\nUTC: ${e.utc || "Unresolved: missing or invalid timestamp metadata."}\n\nINTERPRETATION\n${explanation}\n\nNo root cause is established.`;
  }
  if (mode === "Customer update")
    return `${header}\nWe reviewed ${w.events.length} entries in the source you provided. ${recognized.length ? "The rule-based parser recognized the following signals:" : "No recognized lifecycle events were found; this does not establish that the system was healthy."}\n${eventSummary(w)}\n\nWe have not confirmed the cause, customer impact, or a resolution. Please confirm the occurrence times with timezone, symptoms, affected scope, and relevant application context before agreeing next steps. No root cause is established. This is an unsent draft; agree any update schedule with the customer.`;
  if (mode === "Engineering escalation")
    return `${header}\nOBSERVATIONS\n${observations}\n\n${missing}\n\nPROPOSED ENGINEERING CHECKS\nCorrelate only explicitly identified sessions and channels. Inspect expected close/duplicate semantics and version context. Obtain a reproducible case and approved diagnostic evidence before assigning a cause. No escalation was sent.`;
  if (mode === "Diagnostic checklist")
    return `${header}\n[ ] Confirm the active source and exact line references.\n[ ] ${unknown.length ? "Request missing timestamp metadata; do not invent a timezone." : "Confirm source clock alignment before cross-system correlation."}\n[ ] Capture reported symptoms, occurrence times, and affected scope.\n[ ] Review explicit connection/session IDs and close codes.\n[ ] ${audio.length ? "Inspect audio keepalive intervals and thresholds." : "Check channel-specific evidence; no audio timeout is assumed."}\n[ ] Validate expected lifecycle and duplicate handling with Engineering.\n[ ] Coordinate any controlled comparison with the responsible IT team.\n[ ] Agree verification, rollback, and customer confirmation.\n\nSOURCE COUNTS\n${eventSummary(w)}\n\nNo root cause is established. These are proposed checks, not completed actions.`;
  return `${header}\nOBSERVATIONS\n${observations}\n${recognized.length ? "" : "No recognized lifecycle events were found. Unknown lines remain preserved as evidence.\n"}\n${missing}\n\nHYPOTHESES\nNo hypothesis is proven or automatically ranked by this source summary. Correlation, source clocks, and expected application behavior must be checked before attributing cause.`;
}
/** Synthetic connection example, distinct from the supplied exercise evidence. */
export const syntheticConnectionLog = `2026-11-04T10:00:00Z INFO control session_id=demo-session connection_id=demo-control established connection
2026-11-04T10:00:01Z INFO audio-forwarding session_id=demo-session connection_id=demo-audio established connection
2026-11-04T10:00:10Z WARN control session_id=demo-session connection_id=demo-control connection closed due to timeout close_code=1006
2026-11-04T10:00:12Z INFO control session_id=demo-session connection_id=demo-control established connection
2026-11-04T10:00:20Z WARN audio-forwarding session_id=demo-session connection_id=demo-audio Ping Pong Monitor timeout, closing websocket`;
