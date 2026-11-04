import { readFile } from "node:fs/promises";
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { pageGuides, glossary } from "../src/visitor-guides";

async function openSourceEntries(page: Page) {
  const details = page.locator(".source-details");
  if ((await details.count()) && (await details.getAttribute("open")) === null)
    await details.locator("summary").click();
}
async function openConnectionDetails(page: Page) {
  const details = page.locator(".advanced-details");
  if ((await details.count()) && (await details.getAttribute("open")) === null)
    await details.locator("summary").first().click();
}
test("overview, skip link, navigation and real download destinations", async ({
  page,
  request,
}) => {
  await page.goto("./");
  await expect(
    page.getByRole("heading", {
      name: "Customer support, explained by doing.",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(
    page.getByRole("heading", {
      name: "Customer support, explained by doing.",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: pageGuides.library.simpleTitle, exact: true })
    .click();
  for (const a of await page.locator("a[download]").all()) {
    const path = await a.getAttribute("href");
    expect((await request.get(path!)).status()).toBe(200);
  }
  await page.goto("./library.html#slides");
  await expect(
    page.getByRole("heading", {
      name: pageGuides.presentation.simpleTitle,
      exact: true,
    }),
  ).toBeVisible();
  await page.goto("./library.html");
  await expect(
    page.getByRole("heading", {
      name: pageGuides.library.simpleTitle,
      exact: true,
    }),
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
test("weighted QA uses transcript evidence and clears overrides", async ({
  page,
}) => {
  await page.goto("./#qa");
  await expect(page.locator(".score-circle b")).toHaveText("100/100");
  await page.getByLabel("Follow-up instructions", { exact: true }).uncheck();
  await expect(page.locator(".score-circle b")).toHaveText("85/100");
  await page
    .getByRole("button", { name: "Mark human review complete" })
    .click();
  await expect(
    page.getByRole("button", { name: "Reviewed — click to reopen" }),
  ).toBeVisible();
  await page
    .getByLabel("Sample conversation")
    .selectOption("Insurance inquiry");
  await expect(page.locator(".score-circle b")).toHaveText("100/100");
  await expect(
    page.getByLabel("Follow-up instructions", { exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("button", { name: "Mark human review complete" }),
  ).toBeVisible();
  await page
    .getByLabel("Transcript scope")
    .selectOption("Incomplete excerpt (T1–T4)");
  await expect(page.locator(".score-circle b")).toHaveText("50/100");
  await expect(
    page.getByLabel("Follow-up instructions", { exact: true }),
  ).not.toBeChecked();
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
  await openSourceEntries(page);
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
    .fill("Analyze your logs");
  await page
    .getByRole("dialog")
    .getByRole("button", {
      name: pageGuides.diagnostics.simpleTitle,
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: pageGuides.diagnostics.simpleTitle,
      exact: true,
    }),
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
  await page
    .locator("nav")
    .getByRole("button", { name: pageGuides.agent.simpleTitle, exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: pageGuides.agent.simpleTitle,
      exact: true,
    }),
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
    .getByRole("button", { name: pageGuides.incident.simpleTitle, exact: true })
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

test("imported evidence persists across labs and invalidates stale copilot review", async ({
  page,
}) => {
  await page.goto("./#diagnostics");
  const input =
    "2026-11-04T10:00:00Z WARN audio-forwarding Ping Pong Monitor timeout\n2026-11-04T10:00:01Z INFO START_CALL";
  await page.getByLabel("Log input").fill(input);
  await page.getByRole("button", { name: "Analyze logs", exact: true }).click();
  await page.getByRole("button", { name: "Open copilot", exact: true }).click();
  await expect(page.locator(".report-text")).toContainText(
    "1 audio keepalive timeout",
  );
  await expect(page.locator(".report-text")).toContainText(
    "Source: Local pasted log",
  );
  await expect(page.locator(".report-text")).not.toContainText("3.203");
  await page
    .getByRole("button", { name: "Mark reviewed", exact: true })
    .click();
  await page.getByRole("button", { name: "L2", exact: true }).click();
  await expect(page.locator("#diagnostic-L2")).toHaveClass("selected-evidence");
  await expect(page.getByLabel("Log input")).toHaveValue(input);
  await page.getByLabel("Log input").fill("ordinary replacement text");
  await page.getByRole("button", { name: "Open copilot", exact: true }).click();
  await expect(page.locator(".report-text")).toContainText(
    "Analyze the current input",
  );
  await expect(
    page.getByRole("button", { name: "Mark reviewed", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "L2", exact: true }),
  ).toHaveCount(0);
});
test("connection explorer shows only defensible timing and exact source", async ({
  page,
}) => {
  await page.goto("./#diagnostics");
  await page
    .getByRole("button", {
      name: "Load connection example (synthetic)",
      exact: true,
    })
    .click();
  await expect(
    page.getByText("Active source: Synthetic connection example", {
      exact: false,
    }),
  ).toBeVisible();
  await openConnectionDetails(page);
  await expect(
    page.getByRole("heading", {
      name: "Connection & session explorer",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByLabel("Explicit ID and channel")
    .selectOption(JSON.stringify(["connection_id", "demo-control", "Control"]));
  await expect(page.locator(".ce-group")).toHaveCount(1);
  await expect(page.locator(".ce-group")).toContainText("L1 → L3: 10 seconds");
  await expect(page.locator(".ce-group")).toContainText("L3: 1006");
  const a11y = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(a11y.violations.map((v) => v.id)).toEqual([]);
  await page.getByLabel("Anonymization preview").check();
  await expect(
    page.getByRole("heading", { name: "Connection & session explorer" }),
  ).toHaveCount(0);
});
test("scenario-specific objections and supervisor guidance follow shown events", async ({
  page,
}) => {
  await page.goto("./#agent");
  await page
    .getByLabel("Scenario", { exact: true })
    .selectOption("Insurance inquiry");
  await page.getByRole("button", { name: "Start call", exact: true }).click();
  for (let i = 0; i < 4; i++)
    await page
      .getByRole("button", { name: "Next transcript event", exact: true })
      .click();
  await expect(
    page.getByText(
      "Licensed specialist review needed for a case-specific coverage determination.",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("No alert was sent.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Explaining coverage responsibly" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "End call", exact: true }).click();
  await expect(page.locator(".summary")).toContainText("licensed specialist");
});

test("pending uploads cannot overwrite evidence after navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = File.prototype.text;
    File.prototype.text = function () {
      if (this.name === "delayed.log")
        return new Promise<string>((resolve) => {
          (
            window as unknown as { releaseOld?: (s: string) => void }
          ).releaseOld = resolve;
        });
      return original.call(this);
    };
  });
  await page.goto("./#diagnostics");
  await page.getByLabel("Upload log file").setInputFiles({
    name: "delayed.log",
    mimeType: "text/plain",
    buffer: Buffer.from("INFO START_CALL older"),
  });
  await page.getByRole("button", { name: "Open copilot", exact: true }).click();
  await page
    .getByRole("button", { name: "Change source", exact: true })
    .click();
  await page.getByLabel("Log input").fill("INFO END_CALL newer");
  await page.getByRole("button", { name: "Analyze logs", exact: true }).click();
  await page.evaluate(() => {
    (window as unknown as { releaseOld?: (s: string) => void }).releaseOld?.(
      "INFO START_CALL older",
    );
  });
  await expect(page.getByLabel("Log input")).toHaveValue("INFO END_CALL newer");
  await expect(page.locator("#diagnostic-L1")).toContainText(
    "INFO END_CALL newer",
  );
});
test("evidence selection clears filters then scrolls to the correct source", async ({
  page,
}) => {
  await page.goto("./#diagnostics");
  await page
    .getByRole("button", {
      name: "Load connection example (synthetic)",
      exact: true,
    })
    .click();
  await openConnectionDetails(page);
  await page.getByLabel("Filter channel").selectOption("Audio");
  await page
    .locator(".ce-group")
    .filter({ hasText: "demo-control" })
    .getByText("L1 · source line 1", { exact: false })
    .first()
    .click();
  await page
    .locator(".ce-group")
    .filter({ hasText: "demo-control" })
    .getByRole("button", { name: "Select L1 evidence", exact: true })
    .first()
    .click();
  await expect(page.getByLabel("Filter channel")).toHaveValue("All channels");
  await expect(page.locator("#diagnostic-L1")).toBeInViewport();
  await page.getByRole("button", { name: "Open copilot", exact: true }).click();
  await page
    .getByRole("button", { name: "Explain selected evidence", exact: true })
    .click();
  await expect(page.getByLabel("Evidence line to explain")).toHaveValue("L1");
});

test("large source keeps exports complete and selection beyond preview limits accurate", async ({
  page,
}) => {
  await page.goto("./#diagnostics");
  const input = Array.from(
    { length: 600 },
    (_, i) => "INFO START_CALL target" + (i + 1),
  ).join("\n");
  await page.getByLabel("Log input").fill(input);
  await page.getByRole("button", { name: "Analyze logs", exact: true }).click();
  await expect(page.locator(".evidence-table tbody tr")).toHaveCount(500);
  const [file] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "JSON", exact: true }).click(),
  ]);
  const data = JSON.parse(await readFile((await file.path())!, "utf8"));
  expect(data.events).toHaveLength(600);
  expect(data.events[599].raw).toBe("INFO START_CALL target600");
  await page.getByLabel("Search events").fill("target600");
  await openSourceEntries(page);
  await page
    .getByRole("button", { name: "Select evidence L600", exact: true })
    .click();
  await expect(page.locator("#diagnostic-L600")).toBeInViewport();
  await page.getByRole("button", { name: "Open copilot", exact: true }).click();
  await page
    .getByRole("button", { name: "Explain selected evidence", exact: true })
    .click();
  await expect(page.getByLabel("Evidence line to explain")).toHaveValue("L600");
  await expect(page.locator(".report-text")).toContainText(
    "INFO START_CALL target600",
  );
  await page
    .getByRole("button", { name: "Open selected source line", exact: true })
    .click();
  await expect(page.locator("#diagnostic-L600")).toBeInViewport();
});

for (const [id, guide] of Object.entries(pageGuides)) {
  test(`beginner guide explains ${guide.simpleTitle} and its three steps`, async ({
    page,
  }) => {
    await page.goto(`./#${id}`);
    const help = page.getByRole("region", {
      name: `How to use ${guide.simpleTitle}`,
      exact: true,
    });
    await expect(help).toBeVisible();
    await expect(help).toContainText(guide.purpose);
    await expect(help).toContainText(guide.outcome);
    for (const item of guide.steps)
      await expect(
        help.getByRole("button", { name: item.title, exact: true }),
      ).toBeVisible();
    await help.getByText("Walk me through it", { exact: false }).click();
    for (let index = 0; index < guide.steps.length; index++) {
      const item = guide.steps[index];
      await expect(
        help.getByRole("heading", { name: item.title, exact: true }),
      ).toBeVisible();
      await expect(
        help.getByText(item.instruction, { exact: true }),
      ).toBeVisible();
      await expect(help.locator(".pg-result")).toContainText(item.result);
      await expect(page.locator(item.selector).first()).toBeAttached();
      await help
        .getByRole("button", { name: "Show this control", exact: true })
        .click();
      await expect(page.locator(item.selector).first()).toHaveClass(
        /guide-target/,
      );
      await expect(help.locator(".pg-feedback")).toContainText(
        "has not been activated",
      );
      await expect(
        help.getByRole("button", { name: "Back", exact: true }),
      ).toBeEnabled({ enabled: index !== 0 });
      if (index < guide.steps.length - 1)
        await help.getByRole("button", { name: "Next", exact: true }).click();
      else
        await expect(
          help.getByRole("button", { name: "Next", exact: true }),
        ).toBeDisabled();
    }
    await help
      .getByText("What is real, and what is a demo?", { exact: false })
      .click();
    await expect(help.getByText(guide.boundary, { exact: true })).toBeVisible();
  });
}

test("friendly search also accepts the familiar technical page name", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByRole("button", { name: "Search workspace", exact: true })
    .click();
  const search = page.getByRole("dialog", {
    name: "Search workspace",
    exact: true,
  });
  await search
    .getByPlaceholder("Where would you like to go?")
    .fill("WebSocket");
  await search
    .getByRole("button", {
      name: pageGuides.diagnostics.simpleTitle,
      exact: true,
    })
    .click();
  await expect(page.locator("main h1")).toHaveText(
    pageGuides.diagnostics.simpleTitle,
  );
});

test("page help can be hidden and shown; glossary defines selected terms", async ({
  page,
}) => {
  await page.goto("./#diagnostics");
  const help = page.getByRole("region", {
    name: `How to use ${pageGuides.diagnostics.simpleTitle}`,
    exact: true,
  });
  await page
    .getByRole("button", { name: "Hide page help", exact: true })
    .click();
  await expect(help).toHaveCount(0);
  await page
    .getByRole("button", { name: "Show page help", exact: true })
    .click();
  await expect(help).toBeVisible();
  await help.getByText("Explain an unfamiliar word", { exact: true }).click();
  for (const entry of glossary) {
    const term = help.getByRole("button", { name: entry.term, exact: true });
    await term.click();
    await expect(term).toHaveAttribute("aria-pressed", "true");
    await expect(help.locator(".pg-definition")).toContainText(
      entry.definition,
    );
  }
});

test("guide highlights and focuses controls without activating a practice call", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./#agent");
  const help = page.getByRole("region", {
    name: `How to use ${pageGuides.agent.simpleTitle}`,
    exact: true,
  });
  await help
    .getByRole("button", { name: "Choose a situation", exact: true })
    .click();
  await help
    .getByRole("button", { name: "Show this control", exact: true })
    .click();
  await expect(page.getByLabel("Scenario", { exact: true })).toBeFocused();
  await expect(page.locator(".guide-target")).toHaveCount(1);
  await help.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".guide-target")).toHaveCount(0);
  await help
    .getByRole("button", { name: "Show this control", exact: true })
    .click();
  const start = page.getByRole("button", { name: "Start call", exact: true });
  await expect(start).toBeFocused();
  await expect(start).toHaveClass(/guide-target/);
  await expect(
    page.getByRole("button", { name: "End call", exact: true }),
  ).toHaveCount(0);
  await expect(help.locator(".pg-feedback")).toContainText(
    "has not been activated",
  );
  await page
    .locator("nav")
    .getByRole("button", {
      name: pageGuides.knowledge.simpleTitle,
      exact: true,
    })
    .click();
  await expect(page.locator(".guide-target")).toHaveCount(0);
  await expect(
    page
      .getByRole("region", {
        name: `How to use ${pageGuides.knowledge.simpleTitle}`,
      })
      .locator(".pg-details")
      .first(),
  ).not.toHaveAttribute("open", "");
});

test("theme choice survives reload and takes precedence over the system", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("button", { name: "Switch to dark theme", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Switch to light theme", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Switch to light theme", exact: true })
    .click();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("system theme follows live system changes and effects preference persists", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByLabel("Display settings", { exact: true }).click();
  await page.getByLabel("Color theme", { exact: true }).selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByLabel("Color theme", { exact: true }).selectOption("system");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const effects = page.getByRole("checkbox", {
    name: "Gentle visual effects",
    exact: true,
  });
  await effects.uncheck();
  await expect(page.locator("html")).toHaveAttribute("data-effects", "off");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-effects", "off");
  await page.getByLabel("Display settings", { exact: true }).click();
  await expect(effects).not.toBeChecked();
  await effects.check();
  await expect(page.locator("html")).toHaveAttribute("data-effects", "on");
  expect(
    await page
      .locator(".pg-guide")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});

test("dark theme retains accessible contrast in navigation, controls and help", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("./#diagnostics");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.html),
    })),
  ).toEqual([]);
});
