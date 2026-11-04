import type { LogEvent } from "./domain";

export interface EventExplanation {
  title: string;
  meaning: string;
  nextCheck: string;
  limitation: string;
}

/** Explain a parser classification, never infer network health or an underlying cause. */
export function explainEvent(event: LogEvent): EventExplanation {
  const explanations: Record<string, EventExplanation> = {
    audio_keepalive_timeout: {
      title: "Audio keepalive timed out",
      meaning:
        "The audio connection monitor recorded that its expected keepalive response did not arrive within its time limit.",
      nextCheck:
        "Find the audio connection ID, the configured time limit, and the nearby ping/pong records.",
      limitation:
        "This does not establish why the response was missing or whether the control connection also failed.",
    },
    keepalive_timeout: {
      title: "Keepalive timed out",
      meaning:
        "A connection monitor recorded that its expected keepalive response did not arrive within its time limit.",
      nextCheck:
        "Check which connection and channel this refers to, its time limit, and nearby ping/pong records.",
      limitation:
        "This does not establish a network outage, the affected channel, or an underlying cause.",
    },
    control_connect: {
      title: "Connection opened",
      meaning: "The application logged that it established a connection.",
      nextCheck:
        "Compare the explicit connection ID with nearby close and open entries on the same channel.",
      limitation:
        "An open entry does not prove continued connectivity, recovery of an earlier connection, or successful audio.",
    },
    control_disconnect: {
      title: "Connection closed",
      meaning:
        "The application logged that a user socket closed. Check its channel and explicit connection ID in the original source.",
      nextCheck:
        "Look for the same explicit socket or connection ID and an explicit close code.",
      limitation:
        "This entry does not establish who closed the connection, why it closed, or whether audio also stopped.",
    },
    duplicate_socket: {
      title: "Duplicate socket reported",
      meaning:
        "The application reported a duplicate socket. A message saying “closing” records an intended action, not a confirmed completed close.",
      nextCheck:
        "Compare the explicit client, socket, and connection IDs and look for an actual closed entry.",
      limitation:
        "This does not establish a duplicate browser tab, an account issue, or the cause of an interruption.",
    },
    check_start_call: {
      title: "Call readiness check recorded",
      meaning:
        "The application logged the CHECK_START_CALL stage, which is a readiness-check label.",
      nextCheck:
        "Look for subsequent call-stage entries tied to the same explicit session or call context.",
      limitation:
        "A readiness-check entry does not establish that a call started or that a person could hear audio.",
    },
    start_call: {
      title: "Call start stage recorded",
      meaning: "The application logged the START_CALL stage.",
      nextCheck:
        "Check the surrounding call and audio entries using explicit IDs and comparable timestamps.",
      limitation:
        "A stage label does not establish that the call connected successfully or that audio was delivered.",
    },
    end_call: {
      title: "Call end stage recorded",
      meaning: "The application logged the END_CALL stage.",
      nextCheck:
        "Check for a matching call context and any explicit outcome or reason in the surrounding source.",
      limitation:
        "This stage does not establish the reason the call ended or its complete duration.",
    },
  };
  const explanation =
    event.kind === "keepalive_timeout" && event.channel === "Control"
      ? {
          title: "Control keepalive timed out",
          meaning:
            "A connection monitor recorded a missing keepalive response within its time limit. The parser places this entry in the control channel category.",
          nextCheck:
            "Check the explicit control connection ID, the configured time limit, and nearby ping/pong records.",
          limitation:
            "This does not establish why the response was missing or whether audio also failed.",
        }
      : explanations[event.kind] || {
          title: "Not recognized by these rules",
          meaning:
            "This entry does not match a supported event pattern. The classification is not a diagnosis or a statement of system health.",
          nextCheck:
            "Read the original line and the surrounding application context. A WARN label alone does not identify a cause.",
          limitation:
            "Unrecognized entries may still matter; these rules cannot explain their application-specific meaning.",
        };
  return {
    ...explanation,
    limitation:
      explanation.limitation +
      (event.utc
        ? ""
        : " An explicit timezone is missing or the timestamp cannot be validated; UTC timing is unknown."),
  };
}
