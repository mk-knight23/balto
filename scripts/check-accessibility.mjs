import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
let failed = false;
for (const id of [
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
]) {
  await page.goto(
    (process.env.BALTO_TEST_URL || "http://localhost:5173/") + "#" + id,
  );
  await page.locator("main h1").waitFor();
  const r = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  console.log(id + ": " + r.violations.length + " violations");
  if (r.violations.length) {
    failed = true;
    for (const v of r.violations)
      console.log(
        JSON.stringify({
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        }),
      );
  }
}
await browser.close();
process.exitCode = failed ? 1 : 0;
