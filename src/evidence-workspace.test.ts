import { describe, it, expect } from "vitest";
import {
  createEvidenceWorkspace,
  editEvidenceWorkspace,
  analyzeEvidenceWorkspace,
  buildEvidenceDraft,
  previewEvidence,
} from "./evidence-workspace";
describe("source-scoped evidence workspace", () => {
  it("keeps physical source lines and generates only current source counts", () => {
    const w = createEvidenceWorkspace(
      "\n2026-11-04T10:00:00Z WARN audio-forwarding Ping Pong Monitor timeout",
      "Local pasted log",
    );
    const text = buildEvidenceDraft("Incident summary", w);
    expect(text).toContain("1 audio keepalive timeout");
    expect(text).toContain("L2");
    expect(text).toContain("Local pasted log");
    expect(text).not.toContain("VPN");
    expect(text).not.toContain("3.203");
  });
  it("invalidates parsed events as soon as source text changes", () => {
    const w = createEvidenceWorkspace("INFO START_CALL", "First");
    const edited = editEvidenceWorkspace(w, "INFO END_CALL", "Second");
    expect(edited.events).toEqual([]);
    expect(edited.analyzed).toBe(false);
    expect(edited.revision).toBeGreaterThan(w.revision);
    expect(buildEvidenceDraft("Incident summary", edited)).toContain(
      "Analyze the current input",
    );
    const next = analyzeEvidenceWorkspace(edited);
    expect(buildEvidenceDraft("Incident summary", next)).not.toContain(
      "start_call: 1",
    );
  });
  it("does not attach exercise symptoms to unrelated or empty sources", () => {
    for (const raw of ["", "ordinary text"]) {
      const w = createEvidenceWorkspace(raw, "Uploaded example");
      const text = buildEvidenceDraft("Customer update", w);
      expect(text).not.toContain("missing templates");
      expect(text).not.toContain("reinstall");
      expect(text).not.toContain("L8");
      expect(text).toContain("No root cause");
    }
  });
  it("rejects invalid input without keeping old observations", () => {
    const w = analyzeEvidenceWorkspace(
      editEvidenceWorkspace(
        createEvidenceWorkspace("INFO START_CALL", "A"),
        "x".repeat(1024 * 1024 + 1),
        "B",
      ),
    );
    expect(w.events).toEqual([]);
    expect(w.error).toContain("1 MB");
    expect(w.analyzed).toBe(false);
  });
  it("does not substitute another line when a selection is missing", () => {
    expect(
      buildEvidenceDraft(
        "Explain selected evidence",
        createEvidenceWorkspace("INFO START_CALL", "A"),
        "L9",
      ),
    ).toContain("Selected evidence is unavailable");
  });
  it("grounds selected explanations in the active source", () => {
    const w = createEvidenceWorkspace(
      "WARN control Ping Pong Monitor timeout",
      "Customer sample",
    );
    const text = buildEvidenceDraft("Explain selected evidence", w, "L1");
    expect(text).toContain("Customer sample");
    expect(text).toContain("WARN control Ping Pong Monitor timeout");
    expect(text).toContain("does not identify");
    expect(text).not.toContain("audio channel");
  });
});

it("bounds raw previews while preserving the complete source for export", () => {
  const raw = "x".repeat(6000);
  expect(previewEvidence(raw)).toContain("Preview truncated");
  expect(createEvidenceWorkspace(raw, "Large").events[0].raw).toHaveLength(
    6000,
  );
});
