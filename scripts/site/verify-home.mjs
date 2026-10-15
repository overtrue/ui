import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
const output = "output/playwright/home";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [],
  checks = [];
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(origin);
  const hero = page.locator(".home-hero");
  const console_ = page.locator(".hero-console");
  const monitor = console_.locator('[data-slot="realtime-monitor"]');
  const lab = page.locator(".theme-lab");
  const workspace = page.locator(".hero-product");
  const showcase = page.locator(".assembled-preview");
  const switches = page.getByRole("group", { name: "Featured blocks" });

  async function settle(locator) {
    for (const image of await locator.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((image) => image.decode());
    }
    await locator.scrollIntoViewIfNeeded();
  }
  async function snapshot(locator, name) {
    await settle(locator);
    await locator.screenshot({
      path: `${output}/${name}.png`,
      animations: "disabled",
      style: ".site-header { visibility: hidden !important; }",
    });
  }
  async function checkSelect(locator) {
    const box = await locator.evaluate((select) => {
      const rect = select.getBoundingClientRect();
      const icon = select.parentElement
        .querySelector("svg")
        .getBoundingClientRect();
      return {
        centerOffset: Math.abs(
          rect.y + rect.height / 2 - icon.y - icon.height / 2,
        ),
        rightGap: rect.right - icon.right,
        appearance: getComputedStyle(select).appearance,
      };
    });
    assert.equal(box.appearance, "none");
    assert.ok(
      box.centerOffset <= 0.5 && box.rightGap >= 10,
      JSON.stringify(box),
    );
  }

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (theme) =>
          document.documentElement.classList.toggle("dark", theme === "dark"),
        theme,
      );
      await page.evaluate(() => window.scrollTo(0, 0));
      const layout = await page.evaluate(() => {
        const header = document
          .querySelector(".site-header-inner")
          .getBoundingClientRect();
        const heading = document
          .querySelector("#home-title")
          .getBoundingClientRect();
        const consoleBox = document
          .querySelector(".hero-console")
          .getBoundingClientRect();
        return {
          navFits: header.left >= 0 && header.right <= innerWidth,
          headingClear: heading.top >= header.bottom,
          headingFits: heading.right <= innerWidth,
          consoleFits: consoleBox.left >= 0 && consoleBox.right <= innerWidth,
          noOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
        };
      });
      assert.ok(Object.values(layout).every(Boolean), JSON.stringify(layout));
      assert.equal(await monitor.count(), 1);
      for (const slot of [
        "number-ticker",
        "live-chart",
        "host-map",
        "log-stream",
        "bullet-chart",
      ])
        assert.ok(
          (await monitor.locator(`[data-slot="${slot}"]`).count()) > 0,
          `${width} ${theme}: monitor is missing ${slot}`,
        );
      await snapshot(console_, `console-${width}-${theme}`);
      await snapshot(lab, `theme-lab-${width}-${theme}`);
      assert.ok(
        await lab.locator(".lab-app").evaluate((app) => {
          const box = app.getBoundingClientRect();
          return (
            box.left >= 0 &&
            box.right <= innerWidth &&
            app.scrollWidth <= app.clientWidth + 1
          );
        }),
        "the theme lab preview fits the viewport",
      );
      await checkSelect(workspace.getByLabel("Report period", { exact: true }));
      assert.ok(
        await workspace
          .locator("img")
          .evaluateAll((images) =>
            images.every((img) => img.complete && img.naturalWidth > 0),
          ),
      );
      const metrics = await workspace
        .locator('[data-slot="metric-group"] > div')
        .evaluateAll((items) =>
          items.map((item) => {
            const [label, value] = item.querySelectorAll("p");
            const lineHeight = parseFloat(getComputedStyle(label).lineHeight);
            return {
              valueTop: value.getBoundingClientRect().top,
              labelLines: label.getBoundingClientRect().height / lineHeight,
            };
          }),
        );
      assert.equal(metrics.length, 3);
      assert.ok(
        metrics.every((metric) => metric.labelLines < 1.5),
        `wrapped metric label at ${width}`,
      );
      assert.ok(
        metrics.every(
          (metric) => Math.abs(metric.valueTop - metrics[0].valueTop) < 1,
        ),
        `unaligned metric values at ${width}`,
      );
      await snapshot(workspace, `workspace-${width}-${theme}`);
      for (const title of [
        "Project portfolio",
        "Analytics overview",
        "Service status",
      ]) {
        await switches
          .getByRole("button", { name: title, exact: true })
          .click();
        await page
          .getByRole("region", { name: `${title} preview`, exact: true })
          .waitFor();
        assert.equal(
          await switches.locator('[aria-pressed="true"]').count(),
          1,
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `${width}: page overflow`,
        );
        if (title === "Project portfolio") {
          const cards = showcase.locator('[data-slot="media-card"]');
          assert.equal(await cards.count(), 2);
          if (width >= 768) {
            const tops = await cards.evaluateAll((cards) =>
              cards.map((card) => card.getBoundingClientRect().top),
            );
            assert.ok(
              Math.abs(tops[0] - tops[1]) < 1,
              `${width}: uneven portfolio grid`,
            );
          }
        }
        if (title === "Analytics overview")
          await checkSelect(showcase.getByLabel("Analytics period"));
        await snapshot(
          page.locator(".assembled-section"),
          `${title.split(" ")[0].toLowerCase()}-${width}-${theme}`,
        );
      }
      checks.push(
        `${width}px ${theme}: hero layout, monitor slots, theme lab, workspace metrics, all three block previews, no overflow`,
      );
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  await console_.scrollIntoViewIfNeeded();
  const inspect = console_.getByRole("button", { name: "Inspect" });
  await inspect.click();
  assert.equal(await inspect.getAttribute("aria-pressed"), "true");
  const boxes = console_.locator(".inspect-box");
  await boxes.first().waitFor();
  const hrefs = await boxes.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")),
  );
  assert.ok(hrefs.length >= 5, `only ${hrefs.length} inspect targets`);
  assert.ok(hrefs.every((href) => href.startsWith("/components/")));
  for (const href of [
    "/components/number-ticker",
    "/components/live-chart",
    "/components/host-map",
    "/components/log-stream",
    "/components/bullet-chart",
  ])
    assert.ok(hrefs.includes(href), `inspect is missing ${href}`);
  assert.equal(
    await console_.locator(".hero-console-content").getAttribute("inert"),
    "",
  );
  await page.keyboard.press("Escape");
  assert.equal(await inspect.getAttribute("aria-pressed"), "false");
  assert.equal(await boxes.count(), 0);
  await page.keyboard.press("i");
  assert.equal(await inspect.getAttribute("aria-pressed"), "true");
  await page.keyboard.press("i");
  assert.equal(await inspect.getAttribute("aria-pressed"), "false");
  await console_.getByRole("button", { name: "Pause", exact: true }).click();
  await monitor.locator(":scope > header").getByText("Paused", { exact: true }).waitFor();
  await console_.getByRole("button", { name: "Resume", exact: true }).click();
  await monitor.locator(":scope > header").getByText("Live", { exact: true }).waitFor();
  checks.push(
    "inspect overlay targets, inspect keyboard shortcut and Escape, inert console while inspecting, pause/resume",
  );

  await lab.getByRole("button", { name: "Iris", exact: true }).click();
  assert.equal(
    await lab
      .getByRole("group", { name: "Accent" })
      .locator('[aria-pressed="true"]')
      .count(),
    1,
  );
  for (const [theme, color] of [
    ["light", "#6d5efc"],
    ["dark", "#9698fc"],
  ]) {
    await page.evaluate(
      (theme) =>
        document.documentElement.classList.toggle("dark", theme === "dark"),
      theme,
    );
    assert.equal(
      await lab
        .locator(".lab-canvas")
        .evaluate((element) =>
          getComputedStyle(element).getPropertyValue("--primary").trim(),
        ),
      color,
    );
  }
  await lab.getByRole("button", { name: "Round", exact: true }).click();
  assert.equal(
    await lab
      .locator(".lab-canvas")
      .evaluate((element) =>
        getComputedStyle(element).getPropertyValue("--radius").trim(),
      ),
    "0.875rem",
  );
  await lab
    .getByRole("checkbox", { name: "Choose a corner radius", exact: true })
    .check();
  await lab
    .getByRole("checkbox", { name: "Name the workspace", exact: true })
    .check();
  await lab.getByText("3 of 3 done", { exact: true }).waitFor();
  await lab.getByText("Ready", { exact: true }).waitFor();
  await lab.getByLabel("Workspace name").fill("   ");
  assert.ok(await lab.getByRole("button", { name: "Rename" }).isDisabled());
  await lab.getByLabel("Workspace name").fill("  Forma studio  ");
  await lab.getByRole("button", { name: "Rename" }).click();
  await lab
    .locator(".lab-app-brand")
    .getByText("Forma studio", { exact: true })
    .waitFor();
  const question = page
    .locator(".questions-list details")
    .filter({ hasText: "Can I use it in a commercial project?" });
  await question.locator("summary").focus();
  await page.keyboard.press("Enter");
  assert.equal(await question.getAttribute("open"), "");
  assert.ok(
    await question.getByRole("link", { name: "MIT license" }).isVisible(),
  );
  await page.keyboard.press("Enter");
  assert.equal(await question.getAttribute("open"), null);
  checks.push(
    "theme lab accent and radius, task progress, trimmed workspace name, empty-name validation, keyboard FAQ expansion",
  );

  await workspace.getByLabel("Report period").selectOption("6 months");
  await workspace.getByText("$24,600", { exact: true }).waitFor();
  const download = page.waitForEvent("download");
  await workspace.getByRole("button", { name: "Export", exact: true }).click();
  assert.equal((await download).suggestedFilename(), "revenue-report.csv");
  const navigation = workspace.getByRole("navigation", {
    name: "Dashboard",
    exact: true,
  });
  await navigation
    .getByRole("button", { name: "Members", exact: true })
    .click();
  await workspace.getByRole("searchbox").fill("Maya");
  assert.equal(await workspace.locator("tbody tr").count(), 1);
  await navigation
    .getByRole("button", { name: "Settings", exact: true })
    .click();
  assert.equal(
    await workspace.getByLabel("Workspace name").inputValue(),
    "Acme Studio",
  );
  assert.ok(
    await workspace
      .getByRole("button", { name: "Save changes", exact: true })
      .isDisabled(),
  );
  await workspace.getByLabel("Workspace name").fill("Acme Studio West");
  await workspace
    .getByRole("button", { name: "Save changes", exact: true })
    .click();
  await workspace
    .getByText("Demo saved locally in this preview.", { exact: true })
    .waitFor();
  await switches
    .getByRole("button", { name: "Project portfolio", exact: true })
    .click();
  await showcase.getByRole("searchbox").fill("Ceramics");
  assert.equal(await showcase.locator('[data-slot="media-card"]').count(), 1);
  await showcase.getByRole("searchbox").fill("no matching project");
  await showcase
    .getByText("No projects match this search.", { exact: true })
    .waitFor();
  await switches
    .getByRole("button", { name: "Analytics overview", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await showcase.getByLabel("Analytics period").selectOption("7-days");
  await showcase.getByText("2.00%", { exact: true }).waitFor();
  await switches
    .getByRole("button", { name: "Service status", exact: true })
    .click();
  await showcase.getByRole("button", { name: "7 days", exact: true }).click();
  await showcase
    .getByText("Observed over the last 7 days", { exact: true })
    .waitFor();
  const indexLinks = await page
    .getByRole("navigation", { name: "All components and blocks" })
    .getByRole("link")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  assert.ok(indexLinks.length > 60, `${indexLinks.length} index links`);
  assert.ok(
    indexLinks.every(
      (href) => href.startsWith("/components/") || href.startsWith("/blocks/"),
    ),
  );
  checks.push(
    "period selection, CSV export, member search, settings save, project search/empty state, keyboard switching, analytics and service periods, complete library index",
  );
  assert.deepEqual(errors, []);
  writeFileSync(
    `${output}/verification.json`,
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} finally {
  await browser.close();
}
