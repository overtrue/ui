import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { verifyHomeSections } from "./verify-home-sections.mjs";
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
  const page = await browser.newPage({
    reducedMotion: "reduce",
    colorScheme: "light",
    viewport: { width: 1440, height: 1000 },
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(origin);
  await page.locator('.lab-host-map [data-slot="host-map"]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.evaluate(() => scrollY), 0, "no initial scroll");
  assert.equal(await page.locator(".lab-grid .lab-panel").count(), 14);
  for (const width of [
    3840, 2560, 1920, 1440, 1280, 1024, 768, 640, 390, 320,
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const theme of ["light", "dark"]) {
      if (
        (await page.locator("html.dark").count()) !== Number(theme === "dark")
      )
        await page
          .getByRole("button", { name: `Switch to ${theme} theme` })
          .click();
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${width}px ${theme}: no page overflow`,
      );
      assert.ok(
        await page.locator(".lab-grid .lab-panel").evaluateAll((panels) =>
          panels.every((panel) => {
            const rect = panel.getBoundingClientRect();
            return (
              rect.left >= 0 &&
              rect.right <= innerWidth + 1 &&
              (innerWidth >= 768 ||
                rect.width >= Math.min(560, innerWidth - 42))
            );
          }),
        ),
        "every component fits",
      );
      assert.ok(
        await page
          .locator(".theme-app")
          .evaluate((app) => app.getBoundingClientRect().width <= 880),
        "theme preview stays compact on wide screens",
      );
      const dimensions = await page.evaluate(() => {
        const width = (selector) =>
          document.querySelector(selector).getBoundingClientRect().width;
        return {
          playground: width(".lab-playground"),
          monitor: width(".hero-console"),
          workspace: width(".workspace-window"),
          install: width(".install-layout"),
          projectCards: [
            ...document.querySelectorAll(
              '.assembled-preview [data-slot="media-card"]',
            ),
          ].map((card) => card.getBoundingClientRect().width),
          chart: document
            .querySelector(".hero-product .recharts-surface")
            .getBoundingClientRect()
            .toJSON(),
        };
      });
      assert.ok(
        dimensions.playground <= 1440 && dimensions.monitor <= 1280,
        "component canvases stop growing on wide screens",
      );
      assert.ok(
        dimensions.workspace <= 1184 && dimensions.install <= 1184,
        "workspace and code preview stay at a readable size",
      );
      assert.ok(
        dimensions.projectCards.every((width) => width <= 440),
        "project cards retain their image and content proportions",
      );
      if (width >= 1200)
        assert.ok(
          dimensions.chart.width / dimensions.chart.height < 3,
          "workspace chart is not stretched horizontally",
        );
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({
        path: `${output}/playground-${width}-${theme}.png`,
        animations: "disabled",
      });
      const footer = page.locator(".site-footer");
      const wordmark = await footer
        .locator(".footer-signature")
        .evaluate((node) => {
          const range = document.createRange();
          range.selectNodeContents(node);
          return {
            text: node.textContent,
            textBounds: range.getBoundingClientRect().toJSON(),
            bounds: node.getBoundingClientRect().toJSON(),
            footer: node.parentElement.getBoundingClientRect().toJSON(),
          };
        });
      assert.equal(wordmark.text, "overtrue/ui");
      assert.ok(
        wordmark.textBounds.left >= wordmark.bounds.left - 1 &&
          wordmark.textBounds.right <= wordmark.bounds.right + 1 &&
          wordmark.textBounds.top >= wordmark.bounds.top - 1 &&
          wordmark.textBounds.bottom <= wordmark.bounds.bottom + 1,
        `${width}px ${theme}: the entire footer wordmark fits its container`,
      );
      assert.ok(
        Math.abs(wordmark.footer.left - (width - wordmark.footer.right)) <= 1,
        "footer has balanced margins at every breakpoint",
      );
      await footer.screenshot({
        path: `${output}/footer-${width}-${theme}.png`,
        animations: "disabled",
      });
      checks.push(
        `${width}px ${theme}: no overflow; preview proportions and complete footer wordmark checked`,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  const details = page.getByRole("button", { name: "Show component details" });
  assert.equal(await page.locator(".lab-note").count(), 0);
  await details.click();
  assert.equal(await page.locator(".lab-note").count(), 14);
  await details.click();
  await verifyHomeSections(page, origin, output);
  const workspace = page.locator(".hero-product");
  await workspace.getByLabel("Report period").selectOption("6 months");
  await workspace.getByText("$24,600", { exact: true }).waitFor();
  const download = page.waitForEvent("download");
  await workspace.getByRole("button", { name: "Export", exact: true }).click();
  assert.equal((await download).suggestedFilename(), "revenue-report.csv");
  await page.getByRole("link", { name: "View Flame graph source" }).click();
  await page.waitForURL("**/components/flame-graph");
  await page.locator(".docs-layout").waitFor();
  assert.equal(await page.locator(".site-header.is-home").count(), 0);
  checks.push(
    "14 live advanced components, theme and header synchronization, six assembled blocks, directory and source links, installation assets, clipboard exports, FAQ, workspace CSV",
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
