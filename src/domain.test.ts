import { describe, it, expect } from "vitest";
import {
  parseLogs,
  nextCallState,
  toCSV,
  qaScore,
  filterCalls,
  syntheticCalls,
} from "./domain";
describe("safe evidence parser", () => {
  it("keeps exact evidence and separates check from start", () => {
    const r = parseLogs(
      "Sep 14 16:05:11.884 INFO CHECK_START_CALL\nSep 14 16:05:12.006 INFO START_CALL",
    );
    expect(r.map((x) => x.kind)).toEqual(["check_start_call", "start_call"]);
    expect(r[0].line).toBe(1);
    expect(r[0].utc).toBeNull();
  });
  it("normalizes explicit timezone and preserves unknown lines", () => {
    const r = parseLogs(
      "2026-09-14T17:35:12+05:30 WARN audio-forwarding Ping Pong Monitor timeout\nnot a timestamp",
    );
    expect(r[0].utc).toBe("2026-09-14T12:05:12.000Z");
    expect(r[1].kind).toBe("unclassified");
    expect(r[1].utc).toBeNull();
  });
  it("rejects impossible calendar dates without losing the raw line", () => {
    expect(
      parseLogs("2026-02-30T12:00:00Z INFO established connection")[0].utc,
    ).toBeNull();
  });
  it("does not classify control timeout as audio", () => {
    const e = parseLogs(
      "2026-09-14T12:00:00Z WARN server control Ping Pong Monitor timeout",
    )[0];
    expect(e.kind).toBe("keepalive_timeout");
    expect(e.channel).toBe("Control");
  });
  it("rejects oversized input", () =>
    expect(() => parseLogs("x".repeat(1024 * 1024 + 1))).toThrow("1 MB"));
  it("recognizes audio and control channels without inferring causes", () => {
    const r = parseLogs(
      "Sep 14 12:00:00.000 WARN audio-forwarding Ping Pong Monitor timeout\nSep 14 12:00:01.000 INFO server established connection",
    );
    expect(r.map((x) => x.channel)).toEqual(["Audio", "Control"]);
  });
});
describe("call lifecycle", () => {
  it("enforces transitions", () => {
    expect(nextCallState("idle", "start")).toBe("active");
    expect(nextCallState("active", "pause")).toBe("paused");
    expect(nextCallState("paused", "resume")).toBe("active");
    expect(nextCallState("idle", "resume")).toBe("idle");
    expect(nextCallState("active", "end")).toBe("ended");
  });
});
describe("visible calculations and exports", () => {
  it("calculates weighted score", () =>
    expect(
      qaScore([
        { weight: 20, pass: true },
        { weight: 30, pass: false },
      ]),
    ).toBe(40));
  it("neutralizes spreadsheet formulas and escapes commas", () =>
    expect(toCSV(["Name"], [["=SUM(A1)", "a,b"]])).toContain("'=SUM(A1)"));
  it("filters synthetic rows before metrics", () => {
    const rows = filterCalls(syntheticCalls, "Alex", "Billing dispute", 7);
    expect(
      rows.every(
        (r) =>
          r.agent === "Alex" && r.scenario === "Billing dispute" && r.day <= 7,
      ),
    ).toBe(true);
  });
});
