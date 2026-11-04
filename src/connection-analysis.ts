import type { LogEvent } from "./domain";

export type ConnectionIdType =
  "session_id" | "client_id" | "connection_id" | "socket_id";
export interface ConnectionIdentifier {
  type: ConnectionIdType;
  value: string;
}
export type LifecycleAction =
  "open" | "close" | "duplicate" | "timeout" | "other";
export interface ConnectionGroup {
  key: string;
  identifier: ConnectionIdentifier;
  channel: LogEvent["channel"];
  sequence: { event: LogEvent; action: LifecycleAction }[];
  durations: { milliseconds: number; startId: string; endId: string }[];
  closeCodes: { code: number; eventId: string }[];
  duplicateEventIds: string[];
  timeoutEventIds: string[];
  warnings: string[];
  unknowns: string[];
}
export interface ConnectionAnalysis {
  groups: ConnectionGroup[];
  unassigned: LogEvent[];
  warnings: string[];
}

/** Only explicitly named fields count. Identifier values use a conservative ASCII token grammar. */
export function extractConnectionIds(raw: string): ConnectionIdentifier[] {
  const matches = raw.matchAll(
    /(?:^|[\s{,(])['"]?(session_id|client_id|connection_id|socket_id)['"]?(?:\s*[:=]\s*|\s+)(?:"([A-Za-z0-9][A-Za-z0-9_.:@-]{0,255})"|'([A-Za-z0-9][A-Za-z0-9_.:@-]{0,255})'|([A-Za-z0-9][A-Za-z0-9_.:@-]{0,255})(?=$|[\s,;}\]]))/gi,
  );
  const result: ConnectionIdentifier[] = [];
  let examined = 0;
  for (const match of matches) {
    if (++examined > 16) return [];
    const identifier = {
      type: match[1].toLowerCase() as ConnectionIdType,
      value: match[2] || match[3] || match[4],
    };
    if (
      !result.some(
        (id) => id.type === identifier.type && id.value === identifier.value,
      )
    )
      result.push(identifier);
  }
  return result;
}

function hasDuplicate(event: LogEvent): boolean {
  return (
    event.kind === "duplicate_socket" || /\bduplicate socket\b/i.test(event.raw)
  );
}
function hasTimeout(event: LogEvent): boolean {
  return (
    event.kind === "keepalive_timeout" ||
    event.kind === "audio_keepalive_timeout" ||
    (/\b(?:socket|websocket|connection)\b/i.test(event.raw) &&
      /\b(?:timeout|timed out)\b/i.test(event.raw))
  );
}
function lifecycle(event: LogEvent): LifecycleAction {
  if (
    event.kind === "control_disconnect" ||
    /\b(?:socket|websocket|connection)\s+(?:was\s+)?closed\b/i.test(event.raw)
  )
    return "close";
  if (
    event.kind === "control_connect" ||
    /\bestablished connection\b|\b(?:socket|websocket|connection)\s+(?:opened|established)\b/i.test(
      event.raw,
    )
  )
    return "open";
  if (hasDuplicate(event)) return "duplicate";
  if (hasTimeout(event)) return "timeout";
  return "other";
}
function explicitTime(event: LogEvent): number | null {
  // utc must originate in an explicit timezone-bearing source timestamp.
  if (
    !/^\d{4}-\d\d-\d\d[T ]\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(
      event.time,
    ) ||
    !event.utc
  )
    return null;
  const milliseconds = Date.parse(event.utc);
  return Number.isFinite(milliseconds) ? milliseconds : null;
}

/** Sequences preserve source order. Multiple explicit ID namespaces are independent views, not joins. */
export function analyzeConnections(events: LogEvent[]): ConnectionAnalysis {
  const groups = new Map<string, ConnectionGroup>();
  const unassigned: LogEvent[] = [];
  const warnings: string[] = [];
  for (const event of events) {
    const identifiers = extractConnectionIds(event.raw);
    const conflicts = identifiers.filter((id) =>
      identifiers.some(
        (other) => other.type === id.type && other.value !== id.value,
      ),
    );
    if (conflicts.length) {
      warnings.push(
        `${event.id}: Conflicting ${[...new Set(conflicts.map((id) => id.type))].join(", ")} values; event left unassigned.`,
      );
      unassigned.push(event);
      continue;
    }
    if (!identifiers.length) {
      unassigned.push(event);
      continue;
    }
    for (const identifier of identifiers) {
      const key = JSON.stringify([
        identifier.type,
        identifier.value,
        event.channel,
      ]);
      let group = groups.get(key);
      if (!group) {
        group = {
          key,
          identifier,
          channel: event.channel,
          sequence: [],
          durations: [],
          closeCodes: [],
          duplicateEventIds: [],
          timeoutEventIds: [],
          warnings: [],
          unknowns: [
            "Root cause and transport delivery are not established by these log lines.",
          ],
        };
        groups.set(key, group);
      }
      group.sequence.push({ event, action: lifecycle(event) });
      const code = event.raw.match(
        /\b(?:close_code|closeCode|close code)["']?\s*[:=]\s*["']?(\d{4})(?!\d)/i,
      )?.[1];
      if (code)
        group.closeCodes.push({ code: Number(code), eventId: event.id });
    }
  }
  for (const group of groups.values()) {
    let open: LogEvent | null = null;
    let ambiguous = false;
    for (const { event, action } of group.sequence) {
      if (hasDuplicate(event)) group.duplicateEventIds.push(event.id);
      if (hasTimeout(event)) group.timeoutEventIds.push(event.id);
      if (action === "open") {
        if (open || ambiguous) {
          group.warnings.push(
            `${event.id}: Repeated open makes lifecycle pairing ambiguous.`,
          );
          ambiguous = true;
          open = null;
        } else open = event;
      }
      if (action === "close") {
        if (ambiguous)
          group.warnings.push(
            `${event.id}: Duration withheld because multiple opens cannot be paired.`,
          );
        else if (!open)
          group.warnings.push(
            `${event.id}: Close has no preceding explicit open in this ID/channel.`,
          );
        else if (
          group.identifier.type === "session_id" ||
          group.identifier.type === "client_id"
        )
          group.warnings.push(
            `${open.id} → ${event.id}: Duration withheld; session/client views do not establish individual transport identity.`,
          );
        else {
          const startIds = extractConnectionIds(open.raw);
          const endIds = extractConnectionIds(event.raw);
          const conflictingEndpoint = startIds.some((startId) =>
            endIds.some(
              (endId) =>
                startId.type === endId.type && startId.value !== endId.value,
            ),
          );
          const start = explicitTime(open),
            end = explicitTime(event);
          if (conflictingEndpoint)
            group.warnings.push(
              `${open.id} → ${event.id}: Conflicting explicit endpoint identity; duration withheld.`,
            );
          else if (start === null || end === null)
            group.warnings.push(
              `${open.id} → ${event.id}: Duration unavailable; explicit timezone-bearing timestamps required.`,
            );
          else if (end < start)
            group.warnings.push(
              `${open.id} → ${event.id}: Duration unavailable; timestamps reverse source order.`,
            );
          else
            group.durations.push({
              milliseconds: end - start,
              startId: open.id,
              endId: event.id,
            });
        }
        open = null;
        ambiguous = false;
      }
    }
    if (open || ambiguous)
      group.warnings.push(
        "Open lifecycle has no unambiguous explicit close in this ID/channel.",
      );
    if (!group.closeCodes.length)
      group.unknowns.push("No explicit close code observed.");
    if (group.channel === "Unknown")
      group.unknowns.push(
        "Channel is unknown; cross-channel association is unavailable.",
      );
    if (
      group.identifier.type === "client_id" ||
      group.identifier.type === "session_id"
    )
      group.unknowns.push(
        "A client/session ID can cover multiple sockets; individual socket identity is unknown unless logged.",
      );
    if (group.sequence.some(({ event }) => explicitTime(event) === null))
      group.unknowns.push(
        "Some source timestamps lack a comparable explicit timezone.",
      );
  }
  return { groups: [...groups.values()], unassigned, warnings };
}
