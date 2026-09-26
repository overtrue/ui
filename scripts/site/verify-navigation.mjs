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
    assert.ok(
      await locator.evaluate((element) => element === document.activeElement),
    );
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
    return heading.top >= 80 && heading.top < 300;
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
  const catalogSearch = page.getByRole("textbox", {
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

  await page.goto(`${origin}/examples`);
  await page.getByRole("textbox", { name: "Search pages" }).fill("settings");
  await page.waitForURL("**/examples?q=settings");
  await page.reload();
  assert.equal(
    await page.getByRole("textbox", { name: "Search pages" }).inputValue(),
    "settings",
  );
  await page
    .getByRole("textbox", { name: "Search pages" })
    .fill("no-such-page-xyz");
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await page.waitForURL("**/examples");
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
  await page.goto(`${origin}/workspace/#/layout-horizontal`);
  const mobileToggle = page.getByRole("button", {
    name: "Toggle navigation",
    exact: true,
  });
  await mobileToggle.click();
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
