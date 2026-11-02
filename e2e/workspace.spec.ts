import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("overview, skip link, navigation and real download destinations", async ({
  page,
  request,
}) => {
  await page.goto("./");
  await expect(
    page.getByRole("heading", {
      name: "A little insight. A lot of possibility.",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(
    page.getByRole("heading", {
      name: "A little insight. A lot of possibility.",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Evidence & downloads", exact: true })
    .click();
  for (const a of await page.locator("a[download]").all()) {
    const path = await a.getAttribute("href");
    expect((await request.get(path!)).status()).toBe(200);
  }
  await page.goto("./library.html#slides");
  await expect(
    page.getByRole("heading", { name: "Executive presentation", exact: true }),
  ).toBeVisible();
  await page.goto("./library.html");
  await expect(
    page.getByRole("heading", { name: "Evidence & downloads", exact: true }),
  ).toBeVisible();
});
test("scripted call lifecycle, checklist and summary", async ({ page }) => {
  await page.goto("./#agent");
  await page.getByRole("button", { name: "Start call", exact: true }).click();
  await page
    .getByLabel("Introduce agent & disclose recording", { exact: true })
    .check();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.getByText("PAUSED", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page
    .getByRole("button", { name: "Next transcript event", exact: true })
    .click();
  await expect(
    page.getByText("My bill is higher than expected. I was charged twice.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "End call", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Call summary" }),
  ).toBeVisible();
  await expect(
    page.getByText("The call ended before all scripted events were shown.", {
      exact: false,
    }),
  ).toBeVisible();
});
test("knowledge retrieval and missing information state", async ({ page }) => {
  await page.goto("./#knowledge");
  await page.getByLabel("Search knowledge").fill("websocket");
  await expect(
    page.getByRole("heading", { name: "1 relevant articles" }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Investigating WebSocket interruptions",
      exact: false,
    })
    .click();
  await expect(page.getByText("Source: KB-003")).toBeVisible();
  await page.getByLabel("Search knowledge").fill("not-in-approved-source");
  await expect(
    page.getByRole("heading", { name: "No supported answer found." }),
  ).toBeVisible();
});
test("weighted QA responds to review and weights", async ({ page }) => {
  await page.goto("./#qa");
  await expect(page.locator(".score-circle b")).toHaveText("70/100");
  await page
    .getByLabel("Explicit follow-up commitment", { exact: true })
    .check();
  await expect(page.locator(".score-circle b")).toHaveText("100/100");
  await page
    .getByRole("button", { name: "Mark human review complete" })
    .click();
  await expect(
    page.getByRole("button", { name: "Reviewed — click to reopen" }),
  ).toBeVisible();
});
test("safe diagnostics filters source entries and clears stale input", async ({
  page,
}) => {
  await page.goto("./#diagnostics");
  await expect(
    page.getByRole("heading", { name: "9 visible events" }),
  ).toBeVisible();
  await page.getByLabel("Filter channel").selectOption("Audio");
  await expect(
    page.getByRole("heading", { name: "3 visible events" }),
  ).toBeVisible();
  await page.getByLabel("Log input").fill("<script>alert(1)</script>");
  await expect(
    page.getByRole("heading", { name: "0 visible events" }),
  ).toBeVisible();
  await page.getByLabel("Filter channel").selectOption("All channels");
  await page.getByRole("button", { name: "Analyze logs" }).click();
  await expect(
    page.getByRole("heading", { name: "1 visible events" }),
  ).toBeVisible();
  await expect(page.locator("td code").last()).toHaveText(
    "<script>alert(1)</script>",
  );
});
test("hypotheses, synthetic filters and voice handoff work", async ({
  page,
}) => {
  await page.goto("./#incident");
  await page.getByRole("button", { name: "Hypotheses", exact: true }).click();
  await expect(
    page.getByText("PLAUSIBLE · NOT CALIBRATED PROBABILITY"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Next diagnostic step", exact: true })
    .click();
  await page.getByRole("button", { name: "Not yet", exact: true }).click();
  await expect(
    page.getByText("Request exact local occurrence times", { exact: false }),
  ).toBeVisible();
  await page.goto("./#insights");
  await page.getByLabel("Filter agent").selectOption("Alex");
  await expect(page.locator(".metric strong").first()).toHaveText("32");
  await page.goto("./#voice");
  await page.getByLabel("Voice simulator message").fill("supervisor please");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(
    page.getByText(
      "A human handoff is recommended. In this demo no transfer is performed.",
    ),
  ).toBeVisible();
});
test("presentation keyboard navigation and search focus trap", async ({
  page,
}) => {
  await page.goto("./#presentation");
  await expect(page.locator(".slide-stage")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".slide-footer")).toContainText("2 / 15");
  await page
    .getByRole("button", { name: "Search workspace", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Search workspace" }),
  ).toBeVisible();
  await page
    .getByPlaceholder("Where would you like to go?")
    .fill("diagnostics");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "WebSocket diagnostics", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "WebSocket diagnostics", exact: true }),
  ).toBeVisible();
});
test("all primary sections render without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
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
    await page.goto("./#" + id);
    await expect(page.locator("main h1")).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test("responsive layout and accessibility", async ({ page }) => {
  await page.goto("./");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({ html: n.html, summary: n.failureSummary })),
    })),
  ).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("button", { name: "Agent Assist lab LIVE" }).click();
  await expect(
    page.getByRole("heading", { name: "Agent Assist lab", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("investigation decisions survive lab navigation", async ({ page }) => {
  await page.goto("./#incident");
  await page.getByRole("button", { name: "Hypotheses", exact: true }).click();
  await page.getByLabel("Investigation status").selectOption("Test planned");
  await page
    .getByRole("button", { name: "Open diagnostics lab", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Escalation command center", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Investigation notes", exact: true })
    .click();
  await expect(
    page.getByText(
      "VPN / proxy inspection: marked Test planned by user (not a confirmed finding).",
      { exact: true },
    ),
  ).toBeVisible();
});
test("all sections fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
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
    await page.goto("./#" + id);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      id + " must not overflow",
    ).toBe(true);
  }
});
