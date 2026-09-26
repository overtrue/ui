import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
const output = "output/playwright/navigation";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [];
const checks = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (error) => errors.push(error.message));
  const searchInput = page.getByRole("combobox", {
    name: "Search by name or topic",
  });
  const dialog = page.locator(".page-search-dialog");
  const focused = async (locator) =>
    locator.and(page.locator(":focus")).waitFor({ timeout: 5000 });
  const closeSearch = async () => {
    await searchInput.press("Escape");
    await dialog.waitFor({ state: "hidden" });
  };
  const withinViewport = async (locator) => {
    const box = await locator.boundingBox();
    const viewport = page.viewportSize();
    assert.ok(
      box &&
        box.x >= 0 &&
        box.y >= 0 &&
        box.x + box.width <= viewport.width + 1 &&
        box.y + box.height <= viewport.height + 1,
      JSON.stringify(box),
    );
  };

  await page.goto(`${origin}/components`);
  await page
    .getByRole("button", { name: "Search site", exact: true })
    .press("ControlOrMeta+k");
  await searchInput.waitFor();
  await focused(searchInput);
  assert.equal(await page.getByRole("dialog").count(), 1);
  await searchInput.fill("data table");
  await page
    .getByRole("option")
    .filter({ hasText: "Data table" })
    .first()
    .waitFor();
  await page.waitForFunction(() =>
    document
      .querySelector('[cmdk-item][data-selected="true"]')
      ?.textContent.startsWith("Data table"),
  );
  await searchInput.press("Enter");
  await page.waitForURL("**/components/data-table");
  await page
    .getByRole("searchbox", { name: "Find in components" })
    .fill("chart");
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".component-sidebar-links a")].every((link) =>
      /chart/i.test(`${link.textContent} ${link.getAttribute("href")}`),
    ),
  );
  assert.ok((await page.locator(".component-sidebar-links a").count()) > 0);
  await page
    .getByRole("navigation", { name: "On this page" })
    .getByRole("link", { name: "Usage", exact: true })
    .click();
  await page.waitForURL("**#usage");
  await page.waitForFunction(() => {
    const heading = document.getElementById("usage").getBoundingClientRect();
    const header = document
      .querySelector(".site-header")
      .getBoundingClientRect();
    return heading.top >= header.bottom && heading.top < header.bottom + 60;
  });
  checks.push(
    "keyboard search ranks results, opens pages, and documentation links clear the sticky header",
  );

  await page.getByRole("button", { name: "Search site", exact: true }).click();
  await searchInput.fill("no-such-page-xyz");
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await focused(searchInput);
  assert.equal(await searchInput.inputValue(), "");
  await closeSearch();
  await focused(page.getByRole("button", { name: "Search site", exact: true }));
  checks.push(
    "empty search resets the input and Escape restores trigger focus",
  );

  await page.goto(`${origin}/components`);
  const catalogSearch = page.getByRole("searchbox", {
    name: "Search components",
    exact: true,
  });
  await catalogSearch.fill("status");
  await page.getByRole("button", { name: "Feedback", exact: true }).click();
  await page.waitForURL("**/components?q=status&category=Feedback");
  await page.reload();
  assert.equal(await catalogSearch.inputValue(), "status");
  assert.equal(
    await page
      .getByRole("button", { name: "Feedback", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await catalogSearch.press("ControlOrMeta+k");
  assert.equal(await dialog.count(), 0);
  await page
    .locator('.component-grid a[href="/components/status-badge"]')
    .click();
  await page.waitForURL("**/components/status-badge");
  await page.goBack();
  assert.equal(await catalogSearch.inputValue(), "status");
  checks.push(
    "component filters survive reload and Back; typing does not trigger page search",
  );

  await catalogSearch.press("Tab");
  await focused(
    page.getByRole("button", { name: "Clear search components", exact: true }),
  );
  await page.keyboard.press("Enter");
  await focused(catalogSearch);
  await page.waitForURL("**/components?category=Feedback");
  await page.waitForFunction(
    () => document.querySelectorAll(".component-tile").length === 2,
  );
  assert.equal(await catalogSearch.inputValue(), "");
  assert.equal(await page.locator(".component-tile").count(), 2);
  await page
    .getByRole("button", { name: "Reset filters", exact: true })
    .click();
  await page.waitForURL("**/components");
  await focused(catalogSearch);
  await page.waitForFunction(
    () => document.querySelectorAll(".component-tile").length === 52,
  );
  assert.equal(await page.locator(".component-tile").count(), 52);
  await catalogSearch.fill("sparkline");
  await page.waitForURL("**/components?q=sparkline");
  await page.waitForFunction(() => {
    const count = document.querySelector(
      '[aria-label="Filter components"] button .filter-count',
    );
    return (
      new URL(location.href).searchParams.get("q") === "sparkline" &&
      document.querySelector(".component-tile.tile-sparkline") &&
      Number(count?.textContent) === 3 &&
      Number(count?.textContent) ===
        document.querySelectorAll(".component-tile").length
    );
  });
  checks.push(
    "catalog search clears without losing category, resets all filters, and keeps counts in sync",
  );

  await page.goto(`${origin}/components/search-field`);
  await page.waitForFunction(() => {
    const nav = document.querySelector(".component-sidebar-links");
    const active = nav?.querySelector('[aria-current="page"]');
    if (!nav || !active) return false;
    const bounds = nav.getBoundingClientRect();
    const link = active.getBoundingClientRect();
    return link.top >= bounds.top && link.bottom <= bounds.bottom;
  });
  assert.equal(await page.evaluate(() => window.scrollY), 0);
  const directorySearch = page.getByRole("searchbox", {
    name: "Find in components",
  });
  await directorySearch.fill("no-such-component");
  await page
    .locator(".sidebar-empty")
    .getByRole("button", { name: "Clear search" })
    .click();
  await focused(directorySearch);
  assert.equal(await directorySearch.inputValue(), "");
  checks.push(
    "deep component links reveal the current sidebar item without moving the document, and empty directory search restores focus",
  );

  await page.goto(`${origin}/examples`);
  await page.getByRole("searchbox", { name: "Search pages" }).fill("settings");
  await page.waitForURL("**/examples?q=settings");
  await page.reload();
  assert.equal(
    await page.getByRole("searchbox", { name: "Search pages" }).inputValue(),
    "settings",
  );
  await page
    .getByRole("searchbox", { name: "Search pages" })
    .fill("no-such-page-xyz");
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await page.waitForURL("**/examples");
  await focused(page.getByRole("searchbox", { name: "Search pages" }));
  await page.waitForFunction(
    () => document.querySelectorAll(".example-list > a").length === 119,
  );
  assert.equal(await page.locator(".example-list > a").count(), 119);
  checks.push(
    "example filters are shareable and have a recoverable empty state",
  );

  await page.goto(`${origin}/components/command-palette`);
  await page.getByRole("button", { name: /Find a page or action/ }).waitFor();
  await page
    .getByRole("button", { name: /Find a page or action/ })
    .press("ControlOrMeta+k");
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.getByRole("dialog").count(), 1);
  assert.equal(await dialog.count(), 0);
  await page.keyboard.press("Escape");
  checks.push(
    "the command palette example owns its shortcut without opening a second dialog",
  );

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${origin}/components/kpi-card`);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (theme) =>
          document.documentElement.classList.toggle("dark", theme === "dark"),
        theme,
      );
      await page
        .getByRole("button", { name: "Search site", exact: true })
        .click();
      await searchInput.fill("data table");
      await page.getByRole("option").first().waitFor();
      await withinViewport(dialog);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page.screenshot({
        path: `${output}/site-search-${width}-${theme}.png`,
      });
      await closeSearch();
    }
  }
  checks.push(
    "site search fits desktop, tablet, and 320–390px phones in both themes",
  );

  await page.goto(`${origin}/workspace/`);
  await page
    .getByRole("button", { name: "Search workspace", exact: true })
    .click();
  await searchInput.fill("settings");
  await page.waitForFunction(() =>
    document
      .querySelector('[cmdk-item][data-selected="true"]')
      ?.textContent.startsWith("Settings"),
  );
  await searchInput.press("Enter");
  await page.waitForURL("**/workspace/#/settings");
  await page.getByRole("heading", { name: "Workspace settings" }).waitFor();
  for (const theme of ["dark", "light"]) {
    const switcher = page.getByRole("button", {
      name: `Use ${theme} theme`,
      exact: true,
    });
    if (await switcher.isVisible()) await switcher.click();
    await page
      .getByRole("button", { name: "Search workspace", exact: true })
      .click();
    await searchInput.waitFor();
    await withinViewport(dialog);
    await page.screenshot({ path: `${output}/workspace-search-${theme}.png` });
    await closeSearch();
  }
  await page.setViewportSize({ width: 1440, height: 844 });
  await page.goto(`${origin}/workspace/#/tasks`);
  await page.locator('[data-workspace-page="tasks"]').waitFor();
  for (const theme of ["dark", "light"]) {
    await page
      .getByRole("button", { name: `Use ${theme} theme`, exact: true })
      .click();
    await page
      .getByRole("link", { name: "Work queue", exact: true })
      .press("Shift+Tab");
    assert.ok(
      await page
        .getByRole("link", { name: "Project board", exact: true })
        .evaluate((element) => {
          const style = getComputedStyle(element);
          return (
            element.matches(":focus-visible") &&
            style.outlineStyle === "solid" &&
            parseFloat(style.outlineWidth) >= 2 &&
            style.outlineColor !== style.backgroundColor
          );
        }),
      `Selected navigation retains a visible keyboard focus in ${theme} mode`,
    );
  }
  checks.push(
    "selected sidebar links retain a distinct keyboard focus in both themes",
  );
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(`${origin}/workspace/#/layout-horizontal`);
  const mobileToggle = page.getByRole("button", {
    name: "Toggle navigation",
    exact: true,
  });
  await mobileToggle.click();
  await mobileToggle.and(page.locator('[aria-expanded="true"]')).waitFor();
  assert.equal(await mobileToggle.getAttribute("aria-expanded"), "true");
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () =>
      document
        .querySelector('[aria-label="Toggle navigation"]')
        ?.getAttribute("aria-expanded") === "false",
  );
  await focused(mobileToggle);
  checks.push(
    "workspace search opens real routes in both themes; Escape closes mobile navigation and restores focus",
  );
  assert.deepEqual(errors, []);
  writeFileSync(
    `${output}/results.json`,
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(`Passed ${checks.length} navigation checks.`);
} finally {
  await browser.close();
}
