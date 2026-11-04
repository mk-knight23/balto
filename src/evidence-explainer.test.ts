import { describe, expect, it } from "vitest";
import { parseLogs } from "./domain";
import { explainEvent } from "./evidence-explainer";

describe("plain English log explanations", () => {
  it("explains audio timeout without diagnosing the control connection or root cause", () => {
    const explanation = explainEvent(
      parseLogs("WARN audio Ping Pong Monitor timeout")[0],
    );
    expect(explanation.title).toBe("Audio keepalive timed out");
    expect(explanation.meaning).toContain("audio");
    expect(explanation.limitation).toContain("does not establish");
    expect(explanation.limitation).toContain("timezone");
    expect(explanation.nextCheck).toContain("connection");
  });
  it.each([
    ["INFO established connection", "Connection opened"],
    ["INFO user socket closed", "Connection closed"],
    ["WARN Duplicate socket for client_id x", "Duplicate socket reported"],
    ["INFO Received stage CHECK_START_CALL", "Call readiness check recorded"],
    ["INFO Received stage START_CALL", "Call start stage recorded"],
    ["INFO Received stage END_CALL", "Call end stage recorded"],
    ["WARN something unfamiliar", "Not recognized by these rules"],
  ])("explains %s as an observation", (raw, title) => {
    const result = explainEvent(parseLogs(raw)[0]);
    expect(result.title).toBe(title);
    expect(result.meaning.length).toBeGreaterThan(20);
    expect(result.nextCheck.length).toBeGreaterThan(20);
    expect(result.limitation).not.toMatch(
      /healthy|caused by|confirmed cause|confidence/i,
    );
  });
  it("keeps an unknown WARN visible as unrecognized rather than healthy", () => {
    const explanation = explainEvent(
      parseLogs("2026-11-01T10:00:00Z WARN authentication timeout")[0],
    );
    expect(explanation.title).toBe("Not recognized by these rules");
    expect(explanation.limitation).not.toContain("timezone is missing");
    expect(explanation.meaning).toContain("not a diagnosis");
  });
});

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EvidenceSummary } from "./evidence-summary";

describe("plain English evidence rendering", () => {
  const render = (events: ReturnType<typeof parseLogs>, analyzed: boolean) =>
    renderToStaticMarkup(
      createElement(EvidenceSummary, {
        events,
        analyzed,
        onSelectEvidence: () => {},
      }),
    );
  it("distinguishes edited input from an analyzed empty result", () => {
    expect(render([], false)).toContain(
      "Analyze your input to see an explanation",
    );
    expect(render([], true)).toContain("No log entries to explain");
  });
  it("shows unknown warning counts, no health inference, and an inline legend", () => {
    const html = render(parseLogs("WARN unfamiliar event"), true);
    expect(html).toContain("1 labeled WARN");
    expect(html).toContain("Not recognized by these rules");
    expect(html).toContain("does not prove the system is healthy");
    expect(html).toContain("What do L1, WARN and UTC mean?");
    expect(html).toContain("Select L1, source line 1");
  });
  it("escapes untrusted source and bounds each preview while retaining full counts", () => {
    const source = Array(4)
      .fill("WARN <script>alert(1)</script> " + "x".repeat(6000))
      .join("\n");
    const html = render(parseLogs(source), true);
    expect(html).toContain("Showing 3 of 4 source references");
    expect(html).toContain("Source preview truncated");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("x".repeat(5001));
  });
});

it("names a parsed control-channel keepalive warning without assuming audio failed", () => {
  const result = explainEvent(
    parseLogs("WARN control socket Ping Pong timeout")[0],
  );
  expect(result.title).toBe("Control keepalive timed out");
  expect(result.limitation).toContain("audio");
});

it("does not relabel an audio socket close as control", () => {
  const event = parseLogs(
    "2026-11-04T10:00:00Z INFO audio-forwarding user socket closed connection_id=audioA",
  )[0];
  expect(event.channel).toBe("Audio");
  const result = explainEvent(event);
  expect(result.title).toBe("Connection closed");
  expect(result.meaning).not.toContain("control");
});
