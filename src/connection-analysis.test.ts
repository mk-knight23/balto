import { describe, expect, it } from "vitest";
import { parseLogs } from "./domain";
import {
  analyzeConnections,
  extractConnectionIds,
} from "./connection-analysis";

describe("explicit connection evidence", () => {
  it("accepts explicit typed IDs and never guesses unlabeled values", () => {
    expect(
      extractConnectionIds(
        'session_id="s-1" client_id C_2 connection_id: c3 socket_id=s4',
      ),
    ).toEqual([
      { type: "session_id", value: "s-1" },
      { type: "client_id", value: "C_2" },
      { type: "connection_id", value: "c3" },
      { type: "socket_id", value: "s4" },
    ]);
    expect(
      extractConnectionIds("session a client b socket closed token=secret"),
    ).toEqual([]);
    expect(
      extractConnectionIds("not_session_id=bad session_id=ok/value"),
    ).toEqual([]);
  });
  it("keeps missing IDs separate and channels isolated", () => {
    const result = analyzeConnections(
      parseLogs(
        "2026-11-01T10:00:00Z INFO established connection session_id=a\n2026-11-01T10:00:03Z WARN audio Ping Pong timeout session_id=a\n2026-11-01T10:00:04Z INFO user socket closed",
      ),
    );
    expect(result.groups).toHaveLength(2);
    expect(result.unassigned.map((e) => e.id)).toEqual(["L3"]);
    expect(result.groups.every((g) => g.durations.length === 0)).toBe(true);
  });
  it("measures only same-ID same-channel explicit UTC lifecycle pairs with exact citations", () => {
    const result = analyzeConnections(
      parseLogs(
        "2026-11-01T10:00:00Z INFO established connection connection_id=a\n2026-11-01T10:00:04Z INFO user socket closed connection_id=b close_code=1006\n2026-11-01T10:00:05Z INFO user socket closed connection_id=a close_code=1000",
      ),
    );
    const a = result.groups.find((g) => g.identifier.value === "a")!;
    expect(a.durations).toEqual([
      { milliseconds: 5000, startId: "L1", endId: "L3" },
    ]);
    expect(a.closeCodes).toEqual([{ code: 1000, eventId: "L3" }]);
    expect(a.sequence[0].event.raw).toContain("connection_id=a");
    expect(
      result.groups.find((g) => g.identifier.value === "b")!.warnings,
    ).toContain("L2: Close has no preceding explicit open in this ID/channel.");
  });
  it("does not calculate elapsed time from timezone-free, reverse or ambiguous lifecycles", () => {
    for (const input of [
      "Sep 14 12:00:00 INFO established connection socket_id=x\nSep 14 12:00:05 INFO user socket closed socket_id=x",
      "2026-11-01T10:00:05Z INFO established connection socket_id=x\n2026-11-01T10:00:00Z INFO user socket closed socket_id=x",
      "2026-11-01T10:00:00Z INFO established connection socket_id=x\n2026-11-01T10:00:01Z INFO established connection socket_id=x\n2026-11-01T10:00:05Z INFO user socket closed socket_id=x",
    ])
      expect(analyzeConnections(parseLogs(input)).groups[0].durations).toEqual(
        [],
      );
  });
  it("reports observed duplicate and timeout evidence without invented cause", () => {
    const group = analyzeConnections(
      parseLogs(
        "WARN Duplicate socket for client_id EXAMPLE, closing\nWARN socket Ping Pong timeout client_id EXAMPLE",
      ),
    ).groups[0];
    expect(group.duplicateEventIds).toEqual(["L1"]);
    expect(group.timeoutEventIds).toEqual(["L2"]);
    expect(group.durations).toEqual([]);
    expect(group.unknowns.length).toBeGreaterThan(0);
  });
  it("deduplicates repeated ID fields, preserves quoted JSON fields and refuses conflicting values", () => {
    expect(
      extractConnectionIds(
        '{"session_id":"abc","socket_id":"s-1"} session_id=abc',
      ),
    ).toHaveLength(2);
    const result = analyzeConnections(
      parseLogs("INFO established connection session_id=a session_id=b"),
    );
    expect(result.groups).toHaveLength(0);
    expect(result.unassigned).toHaveLength(1);
    expect(result.warnings[0]).toContain("Conflicting session_id");
  });
});

describe("conservative lifecycle boundaries", () => {
  it("normalizes explicit UTC offsets for elapsed time", () => {
    const group = analyzeConnections(
      parseLogs(
        "2026-11-01T10:00:00+02:00 INFO established connection socket_id=x\n2026-11-01T08:00:03Z INFO user socket closed socket_id=x",
      ),
    ).groups[0];
    expect(group.durations[0].milliseconds).toBe(3000);
  });
  it("does not treat a timeout or duplicate warning as a completed lifecycle", () => {
    const group = analyzeConnections(
      parseLogs(
        "2026-11-01T10:00:00Z INFO established connection socket_id=x\n2026-11-01T10:00:01Z WARN Ping Pong timeout socket_id=x closing websocket\n2026-11-01T10:00:02Z WARN Duplicate socket socket_id=x closing",
      ),
    ).groups[0];
    expect(group.durations).toHaveLength(0);
    expect(group.warnings).toContain(
      "Open lifecycle has no unambiguous explicit close in this ID/channel.",
    );
  });
  it("never joins different namespaces or different channel identities", () => {
    const result = analyzeConnections(
      parseLogs(
        "2026-11-01T10:00:00Z INFO established connection socket_id=x\n2026-11-01T10:00:03Z INFO user socket closed client_id=x\n2026-11-01T10:00:04Z INFO audio socket closed socket_id=x",
      ),
    );
    expect(result.groups).toHaveLength(3);
    expect(result.groups.every((group) => group.durations.length === 0)).toBe(
      true,
    );
  });
});

describe("identifier views are not transport identity", () => {
  it("never pairs different connection lifecycles through a shared session or client ID", () => {
    const analysis = analyzeConnections(
      parseLogs(
        "2026-11-01T10:00:00Z INFO established connection session_id=s client_id=c connection_id=A\n2026-11-01T10:00:05Z INFO user socket closed session_id=s client_id=c connection_id=B",
      ),
    );
    expect(analysis.groups.every((group) => group.durations.length === 0)).toBe(
      true,
    );
  });
  it("does not classify an unrelated authentication timeout as socket timeout", () => {
    const group = analyzeConnections(
      parseLogs(
        "2026-11-01T10:00:00Z WARN authentication timeout session_id=s",
      ),
    ).groups[0];
    expect(group.timeoutEventIds).toEqual([]);
    expect(group.sequence[0].action).toBe("other");
  });
});

describe("close evidence and warning flags are independent", () => {
  it.each([
    "socket closed due to timeout",
    "socket closed due to duplicate socket",
  ])("preserves explicit close with %s", (message) => {
    const group = analyzeConnections(
      parseLogs(
        `2026-11-01T10:00:00Z INFO established connection socket_id=x\n2026-11-01T10:00:04Z WARN ${message} socket_id=x`,
      ),
    ).groups[0];
    expect(group.sequence[1].action).toBe("close");
    expect(group.durations).toEqual([
      { milliseconds: 4000, startId: "L1", endId: "L2" },
    ]);
    expect(
      message.includes("timeout")
        ? group.timeoutEventIds
        : group.duplicateEventIds,
    ).toEqual(["L2"]);
  });
});

describe("bounded identifier extraction and consistent endpoints", () => {
  it("rejects a complete line rather than partially grouping more than 16 explicit ID fields", () => {
    expect(
      extractConnectionIds(Array(16).fill("socket_id=x").join(" ")),
    ).toEqual([{ type: "socket_id", value: "x" }]);
    expect(
      extractConnectionIds(Array(17).fill("socket_id=x").join(" ")),
    ).toEqual([]);
    const result = analyzeConnections(
      parseLogs(
        Array.from({ length: 5000 }, (_, index) => `socket_id=s${index}`).join(
          " ",
        ),
      ),
    );
    expect(result.groups).toHaveLength(0);
    expect(result.unassigned).toHaveLength(1);
  });
  it.each(["socket_id", "session_id", "client_id"])(
    "withholds connection interval when endpoints disagree on %s",
    (idType) => {
      const result = analyzeConnections(
        parseLogs(
          `2026-11-01T10:00:00Z INFO established connection connection_id=c ${idType}=old\n2026-11-01T10:00:05Z INFO socket closed connection_id=c ${idType}=new`,
        ),
      );
      const group = result.groups.find(
        (group) => group.identifier.type === "connection_id",
      )!;
      expect(group.durations).toEqual([]);
      expect(group.warnings.join(" ")).toContain(
        "Conflicting explicit endpoint identity",
      );
    },
  );
});
