import { describe, expect, it } from "vitest";
import {
  scenarioNames,
  articles,
  scenarioSteps as exportedSteps,
} from "./domain";
import { extractScenarioQA, scenarioQARules, scenarioSteps } from "./scenarios";

const expectedKB = [
  "KB-001",
  "KB-002",
  "KB-005",
  "KB-004",
  "KB-003",
  "KB-007",
  "KB-006",
  "KB-004",
];

describe("scripted scenario evidence", () => {
  it("has eight distinct six-stage conversations with appropriate knowledge", () => {
    const conversations = scenarioNames.map(scenarioSteps);
    expect(
      new Set(
        conversations.map((steps) => steps.map((step) => step.text).join("\n")),
      ).size,
    ).toBe(8);
    conversations.forEach((steps, index) => {
      expect(steps.map((step) => step.stage)).toEqual([
        "Greeting",
        "Discover",
        "Verify",
        "Investigate",
        "Resolve",
        "Wrap up",
      ]);
      expect(steps.every((step) => step.text && step.suggestion)).toBe(true);
      expect(
        steps
          .filter((step) => step.articleId)
          .every((step) => step.articleId === expectedKB[index]),
      ).toBe(true);
      expect(steps.some((step) => step.articleId === expectedKB[index])).toBe(
        true,
      );
      expect(articles.some((article) => article.id === expectedKB[index])).toBe(
        true,
      );
      expect(steps.some((step) => step.objection)).toBe(true);
      expect(steps.some((step) => step.followUp)).toBe(true);
      expect(steps[0].text).toMatch(/recorded training call/i);
      expect(steps[2].text).toMatch(/verify your identity/i);
      expect(steps[4].text).toMatch(
        /not confirmed|not approved|not guaranteed|not completed|requires|cannot confirm/i,
      );
      expect(exportedSteps(scenarioNames[index])).toEqual(steps);
    });
    expect(new Set(conversations.map((steps) => steps[3].text)).size).toBe(8);
    expect(new Set(conversations.map((steps) => steps[4].text)).size).toBe(8);
  });

  it("preserves the billing first customer utterance and safe fallback", () => {
    expect(scenarioSteps("Billing dispute")[1].text).toBe(
      "My bill is higher than expected. I was charged twice.",
    );
    expect(scenarioSteps("unknown")).toEqual(scenarioSteps("Billing dispute"));
  });

  it("detects QA solely from visible utterances with transcript evidence", () => {
    scenarioNames.forEach((name) => {
      const steps = scenarioSteps(name);
      const initial = extractScenarioQA(name, steps.slice(0, 1));
      expect(initial.find((rule) => rule.id === "recording")?.pass).toBe(true);
      expect(initial.find((rule) => rule.id === "verification")?.pass).toBe(
        false,
      );
      const complete = extractScenarioQA(name, steps);
      expect(complete.length).toBe(scenarioQARules(name).length);
      expect(
        complete.every((rule) => rule.pass && rule.evidence.length > 0),
      ).toBe(true);
      complete.forEach((rule) =>
        rule.evidence.forEach((id, i) => {
          expect(rule.evidenceText[i]).toBe(
            steps[Number(id.slice(1)) - 1].text,
          );
        }),
      );
      expect(
        extractScenarioQA(name, []).every(
          (rule) => !rule.pass && rule.evidence.length === 0,
        ),
      ).toBe(true);
      const metadataOnly = steps.map((step) => ({
        ...step,
        text: "Unrelated utterance",
      }));
      expect(
        extractScenarioQA(name, metadataOnly).every((rule) => !rule.pass),
      ).toBe(true);
      const customerOnly = steps.map((step) => ({
        ...step,
        speaker: "Customer" as const,
      }));
      expect(
        extractScenarioQA(name, customerOnly).every((rule) => !rule.pass),
      ).toBe(true);
    });
  });
});
