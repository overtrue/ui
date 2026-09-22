import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { catalog, catalogPath } from "../../src/site/catalog.ts";
import { usageSource } from "../../src/site/usage.ts";

const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
const output = "output/playwright/catalog";
const cards = JSON.parse(readFileSync("src/blocks/catalog.json", "utf8"));
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const results = [];
const errors = [];
try {
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const item of catalog) {
      const response = await page.goto(origin + catalogPath(item));
      assert.equal(response.status(), 200);
      await page.locator(".detail-preview").waitFor();
      await page.waitForFunction(
        () =>
          !document
            .querySelector(".detail-preview")
            ?.textContent.includes("Loading example"),
      );
      const collection = item.category === "Blocks" ? "blocks" : "components";
      const sidebarPaths = await page
        .locator(".docs-sidebar a")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      assert.ok(
        sidebarPaths.every(
          (link) =>
            link === `/${collection}` || link.startsWith(`/${collection}/`),
        ),
        `${item.name}: mixed sidebar`,
      );
      assert.equal(
        await page.locator(".component-picker option").count(),
        catalog.filter(
          (entry) =>
            (entry.category === "Blocks") === (collection === "blocks"),
        ).length,
      );
      assert.ok(
        (await page.locator(".code-box pre").allTextContents()).includes(
          usageSource(item),
        ),
        `${item.name}: Usage mismatch`,
      );
      assert.ok(
        !(await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )),
        `${item.name}: overflow at ${width}`,
      );
      if (width === 1440) {
        await page.getByRole("button", { name: "Source", exact: true }).click();
        assert.equal(
          await page.getByLabel("Source file").inputValue(),
          item.name,
        );
        assert.equal(
          await page.locator(".source-view pre").textContent(),
          readFileSync(`src/registry/overtrue/${item.name}.tsx`, "utf8"),
          `${item.name}: source mismatch`,
        );
      }
      results.push({ name: item.name, width, path: catalogPath(item) });
    }
    console.log(`Verified ${catalog.length} catalog pages at ${width}px`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin + "/components");
  assert.equal(
    await page.locator(".tile-caption").count(),
    catalog.filter((item) => item.category !== "Blocks").length,
  );
  assert.ok(
    (
      await page
        .locator(".tile-caption")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    ).every((link) => link.startsWith("/components/")),
  );
  await page.goto(origin + "/blocks");
  assert.equal(
    await page.locator(".block-grid .tile-caption").count(),
    catalog.filter((item) => item.category === "Blocks").length,
  );
  assert.ok(
    (
      await page
        .locator(".block-grid .tile-caption")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    ).every((link) => link.startsWith("/blocks/")),
  );
  for (const iframe of await page.locator(".card-collection iframe").all()) {
    await iframe.scrollIntoViewIfNeeded();
    await iframe.contentFrame().locator(".overtrue-block").waitFor();
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${output}/blocks.png`, fullPage: true });
  for (const item of catalog.filter((item) => item.category === "Blocks")) {
    await page.goto(origin + `/components/${item.name}`);
    await page.waitForURL(origin + catalogPath(item));
    await page.locator(".detail-preview").waitFor();
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(origin + "/blocks/settings-panel");
    await page.getByLabel("Workspace name", { exact: true }).waitFor();
    const gaps = await page
      .locator(".detail-preview label")
      .evaluateAll((labels) =>
        labels.map(
          (label) =>
            document.getElementById(label.htmlFor).getBoundingClientRect().top -
            label.getBoundingClientRect().bottom,
        ),
      );
    assert.ok(
      gaps.every((gap) => Math.abs(gap - 8) < 0.5),
      `label gaps: ${gaps}`,
    );
    await page
      .getByLabel("Workspace name", { exact: true })
      .fill("Review workspace");
    await page
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Demo saved locally" })
      .waitFor();
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (theme) =>
          document.documentElement.classList.toggle("dark", theme === "dark"),
        theme,
      );
      await page.screenshot({
        path: `${output}/settings-${width}-${theme}.png`,
        fullPage: true,
      });
    }
  }
  // Navigating away after picking a dependency must reset the main source file.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin + "/blocks/member-card");
  await page.getByRole("button", { name: "Source", exact: true }).click();
  await page.getByLabel("Source file").selectOption("section-card");
  await page
    .locator(".docs-sidebar")
    .getByRole("link", { name: "Settings panel", exact: true })
    .click();
  await page.locator(".detail-preview").waitFor();
  await page.getByRole("button", { name: "Source", exact: true }).click();
  assert.equal(
    await page.getByLabel("Source file").inputValue(),
    "settings-panel",
  );
  assert.ok(
    (await page.locator(".source-view pre").textContent()).includes(
      "export function SettingsPanel",
    ),
  );
  await page.goto(origin + `/blocks/${cards[0].id}`);
  await page.frameLocator("iframe").locator(".overtrue-block").waitFor();
  await page.getByRole("button", { name: "Source", exact: true }).click();
  await page.waitForFunction(
    () =>
      !document
        .querySelector(".source-view pre")
        ?.textContent.includes("Loading source"),
  );
  assert.equal(
    await page.locator(".source-view pre").textContent(),
    readFileSync(`src/blocks/registry/${cards[0].id}.tsx`, "utf8"),
  );
  assert.deepEqual(errors, []);
  writeFileSync(
    `${output}/results.json`,
    JSON.stringify(
      { results, errors, labelGap: 8, legacyRedirects: 10 },
      null,
      2,
    ),
  );
  console.log(
    "Verified catalog separation, 10 legacy redirects, exact Source/Usage, source reset, and 8px field spacing with save feedback in both themes.",
  );
} finally {
  await browser.close();
}
