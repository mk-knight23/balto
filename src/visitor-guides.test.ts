import { describe, expect, it } from "vitest";
import { pageGuides, glossary, guideStepIndex } from "./visitor-guides";

describe("beginner page guides", () => {
  it("explains every workspace destination with three usable steps", () => {
    expect(Object.keys(pageGuides).sort()).toEqual(
      [
        "overview",
        "products",
        "agent",
        "knowledge",
        "qa",
        "coaching",
        "insights",
        "voice",
        "incident",
        "diagnostics",
        "copilot",
        "assessment",
        "architecture",
        "presentation",
        "library",
        "video",
        "about",
      ].sort(),
    );
    for (const guide of Object.values(pageGuides)) {
      expect(guide.simpleTitle.length).toBeGreaterThan(3);
      expect(guide.technicalTitle.length).toBeGreaterThan(3);
      expect(guide.purpose.length).toBeGreaterThan(30);
      expect(guide.outcome.length).toBeGreaterThan(20);
      expect(guide.boundary.length).toBeGreaterThan(35);
      expect(["learn", "practice", "investigate", "project"]).toContain(
        guide.category,
      );
      expect(guide.steps).toHaveLength(3);
      for (const step of guide.steps) {
        expect(step.title.length).toBeGreaterThan(3);
        expect(step.instruction.length).toBeGreaterThan(20);
        expect(step.result.length).toBeGreaterThan(15);
        expect(step.selector.startsWith("#main ")).toBe(true);
      }
    }
  });
  it("keeps exercise evidence separate from the active log workspace", () => {
    expect(pageGuides.incident.boundary).toMatch(/bundled.*exercise/i);
    expect(pageGuides.diagnostics.boundary).toMatch(/memory|reload/i);
    expect(pageGuides.copilot.boundary).toMatch(/no.*(LLM|language model)/i);
    expect(pageGuides.voice.boundary).toMatch(/speech recognition/i);
    expect(pageGuides.video.boundary).toMatch(/no.*video/i);
    expect(pageGuides.insights.boundary).toMatch(/synthetic|invented/i);
  });
  it("keeps walkthrough navigation in range", () => {
    expect(guideStepIndex(-1, 3)).toBe(0);
    expect(guideStepIndex(3, 3)).toBe(2);
    expect(guideStepIndex(1, 3)).toBe(1);
    expect(guideStepIndex(5, 0)).toBe(0);
  });
  it("defines unfamiliar words in plain language", () => {
    for (const term of [
      "WebSocket",
      "QA",
      "Synthetic",
      "Hypothesis",
      "UTC",
      "Copilot",
    ]) {
      expect(
        glossary.find((entry) => entry.term === term)?.definition.length,
      ).toBeGreaterThan(25);
    }
  });
});
