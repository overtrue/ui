import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4206";
const output = "output/playwright/tables";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [];
let checks = 0;
try {
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({ colorScheme: theme });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error")
        errors.push(`${message.text()} ${message.location().url}`);
    });
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1100 });
      await page.goto(origin + "/components/data-table");
      await page.locator(".detail-preview table").waitFor();
      assert.equal(
        await page.locator("html.dark").count(),
        theme === "dark" ? 1 : 0,
      );
      const simple = page.locator(".detail-preview");
      const search = simple.getByRole("searchbox", {
        name: "Search team members",
      });
      await search.fill("no matching person");
      await simple.getByText("No matching records.", { exact: true }).waitFor();
      assert.ok(
        await simple.getByRole("status").evaluate((el) => {
          const bounds = el.closest("section").getBoundingClientRect();
          return [...el.querySelectorAll("p, button")].every((child) => {
            const rect = child.getBoundingClientRect();
            return rect.left >= bounds.left && rect.right <= bounds.right;
          });
        }),
      );
      await simple
        .getByRole("button", { name: "Clear search", exact: true })
        .click();
      assert.equal(await search.inputValue(), "");
      assert.equal(await simple.locator("tbody tr").count(), 5);
      await search.fill("Maya");
      const clear = simple.getByRole("button", {
        name: "Clear search team members",
      });
      await clear.focus();
      await clear.press("Enter");
      assert.ok(
        await search.evaluate((input) => input === document.activeElement),
      );
      await simple.getByRole("button", { name: "Name", exact: true }).click();
      assert.equal(
        await simple
          .getByRole("columnheader", { name: "Name", exact: true })
          .getAttribute("aria-sort"),
        "ascending",
      );
      await simple.getByRole("button", { name: "Name", exact: true }).click();
      assert.equal(
        await simple
          .getByRole("columnheader", { name: "Name", exact: true })
          .getAttribute("aria-sort"),
        "descending",
      );
      await simple.getByRole("button", { name: "Next page" }).click();
      assert.equal(await simple.locator("tbody tr").count(), 2);
      await simple.screenshot({
        path: `${output}/simple-${width}-${theme}.png`,
      });

      await page.goto(origin + "/components/advanced-data-table");
      const basic = page.locator('[data-dashboard-example="data-table-demo"]');
      await basic.locator("table").waitFor();
      const filter = basic.getByRole("searchbox", { name: "Search path" });
      await basic.getByRole("button", { name: "Next page" }).click();
      await basic.getByText("Page 2 of 2", { exact: true }).waitFor();
      await filter.fill("no matching path");
      await basic.getByText("No matching records.", { exact: true }).waitFor();
      assert.ok(
        await basic.getByRole("status").evaluate((el) => {
          const bounds = el
            .closest('[data-slot="data-table-content"]')
            .getBoundingClientRect();
          return [...el.querySelectorAll("p, button")].every((child) => {
            const rect = child.getBoundingClientRect();
            return rect.left >= bounds.left && rect.right <= bounds.right;
          });
        }),
      );
      await basic.screenshot({ path: `${output}/empty-${width}-${theme}.png` });
      await basic.getByRole("button", { name: "Clear filters" }).click();
      await basic.getByText("Page 1 of 2", { exact: true }).waitFor();
      assert.equal(await filter.inputValue(), "");
      assert.equal(await basic.locator("tbody tr").count(), 8);
      await basic.getByRole("button", { name: "Views", exact: true }).click();
      assert.ok(
        ["ascending", "descending"].includes(
          await basic
            .getByRole("columnheader", { name: "Views", exact: true })
            .getAttribute("aria-sort"),
        ),
      );
      await basic.getByRole("button", { name: "View", exact: true }).click();
      await page
        .getByRole("menuitemcheckbox", { name: "Status", exact: true })
        .click();
      assert.equal(
        await basic
          .getByRole("columnheader", { name: "Status", exact: true })
          .count(),
        0,
      );
      await basic.getByRole("button", { name: "View", exact: true }).click();
      await page
        .getByRole("menuitemcheckbox", { name: "Status", exact: true })
        .click();
      assert.equal(
        await basic
          .getByRole("columnheader", { name: "Status", exact: true })
          .count(),
        1,
      );
      await filter.fill("projects");
      const clearFilter = basic.getByRole("button", {
        name: "Clear search path",
      });
      await clearFilter.focus();
      await clearFilter.press("Enter");
      assert.ok(
        await filter.evaluate((input) => input === document.activeElement),
      );
      await basic.screenshot({
        path: `${output}/advanced-${width}-${theme}.png`,
      });
      const composed = page.locator(
        '[data-dashboard-example="data-table-composed-demo"]',
      );
      await composed.screenshot({
        path: `${output}/composed-${width}-${theme}.png`,
      });
      const sticky = page.locator(
        '[data-dashboard-example="data-table-sticky-demo"]',
      );
      const scroller = sticky.locator('[data-slot="table-container"]');
      await scroller.evaluate((el) => {
        el.scrollLeft = 280;
        el.scrollTop = 100;
      });
      const pinned = await sticky.evaluate((el) => {
        const frame = el
          .querySelector('[data-slot="table-container"]')
          .getBoundingClientRect();
        const head = el
          .querySelector('th[data-pinned="end"]')
          .getBoundingClientRect();
        const cell = el.querySelector('td[data-pinned="end"]');
        return {
          edge: Math.abs(cell.getBoundingClientRect().right - frame.right) < 2,
          top: Math.abs(head.top - frame.top) < 2,
          background:
            getComputedStyle(cell).backgroundColor ===
            getComputedStyle(
              el.querySelector('[data-slot="data-table-content"]'),
            ).backgroundColor,
        };
      });
      assert.deepEqual(pinned, { edge: true, top: true, background: true });
      await sticky.screenshot({
        path: `${output}/sticky-${width}-${theme}.png`,
      });
      const compact = page.locator(
        '[data-dashboard-example="data-table-compact-demo"]',
      );
      assert.equal(
        await compact
          .locator("tbody td")
          .first()
          .evaluate((el) => getComputedStyle(el).paddingTop),
        "4px",
      );
      const layout = await page.locator(".detail-preview").evaluate((root) => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        pagination: [
          ...root.querySelectorAll('[data-slot="data-table-pagination"]'),
        ].some((el) => el.scrollWidth > el.clientWidth + 1),
        names: [
          ...root.querySelectorAll('[data-slot="data-table-search"]'),
        ].every(
          (el) =>
            el.labels?.length ||
            el.getAttribute("aria-label") ||
            el.getAttribute("aria-labelledby"),
        ),
        headings: [...root.querySelectorAll('[data-slot="card-header"]')].every(
          (el) => {
            const title = el.querySelector("h3"),
              description = el.querySelector("p");
            return (
              !title ||
              !description ||
              description.getBoundingClientRect().top >=
                title.getBoundingClientRect().bottom
            );
          },
        ),
      }));
      assert.deepEqual(layout, {
        overflow: false,
        pagination: false,
        names: true,
        headings: true,
      });
      assert.equal(
        await basic
          .getByRole("button", { name: "First page", exact: true })
          .isVisible(),
        await basic
          .locator('[data-slot="data-table-pagination"]')
          .evaluate((el) => el.clientWidth >= 320),
      );
      checks++;
    }
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    `Passed ${checks} table layouts and interaction flows: search recovery, sorting, pagination, column visibility, accessible names, and heading spacing.`,
  );
} finally {
  await browser.close();
}
