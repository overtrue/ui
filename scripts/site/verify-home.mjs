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
  const hero = page.locator(".hero-product");
  const showcase = page.locator(".assembled-preview");
  const switches = page.getByRole("group", { name: "Featured blocks" });
  async function snapshot(locator, name) {
    for (const image of await locator.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((image) => image.decode());
    }
    await locator.scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      [
        ...document.querySelectorAll(
          ".hero-product .recharts-responsive-container, .assembled-preview .recharts-responsive-container",
        ),
      ].every((container) => {
        const chart = container.querySelector("svg.recharts-surface");
        return (
          !chart ||
          Math.abs(
            chart.getBoundingClientRect().width -
              container.getBoundingClientRect().width,
          ) < 2
        );
      }),
    );
    await locator.screenshot({
      path: `${output}/${name}.png`,
      animations: "disabled",
      // Keep the fixed site navigation out of isolated specimen screenshots.
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
      await checkSelect(hero.getByLabel("Report period", { exact: true }));
      assert.equal(
        await hero
          .locator('img[src="/assets/overtrue/people/overtrue.png"]')
          .count(),
        1,
      );
      assert.ok(
        await hero
          .locator("img")
          .evaluateAll((images) =>
            images.every((img) => img.complete && img.naturalWidth > 0),
          ),
      );
      const metrics = await hero
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
      await snapshot(hero, `workspace-${width}-${theme}`);
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
        `${width}px ${theme}: avatar, select alignment, metrics, all three previews, no overflow`,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await hero.getByLabel("Report period").selectOption("6 months");
  await hero.getByText("$24,600", { exact: true }).waitFor();
  const download = page.waitForEvent("download");
  await hero.getByRole("button", { name: "Export", exact: true }).click();
  assert.equal((await download).suggestedFilename(), "revenue-report.csv");
  const navigation = hero.getByRole("navigation", {
    name: "Dashboard",
    exact: true,
  });
  await navigation
    .getByRole("button", { name: "Members", exact: true })
    .click();
  await hero.getByRole("searchbox").fill("Maya");
  assert.equal(await hero.locator("tbody tr").count(), 1);
  await navigation
    .getByRole("button", { name: "Settings", exact: true })
    .click();
  assert.equal(
    await hero.getByLabel("Workspace name").inputValue(),
    "overtrue",
  );
  assert.ok(
    await hero
      .getByRole("button", { name: "Save changes", exact: true })
      .isDisabled(),
  );
  await hero.getByLabel("Workspace name").fill("overtrue studio");
  await hero.getByRole("button", { name: "Save changes", exact: true }).click();
  await hero
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
  assert.ok(
    (
      await page
        .locator(".home-component-grid .tile-caption")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    ).every((href) => href.startsWith("/components/")),
  );
  checks.push(
    "period selection, CSV export, member search, settings save, project search/empty state, keyboard switching, analytics and service periods, component-only gallery",
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
