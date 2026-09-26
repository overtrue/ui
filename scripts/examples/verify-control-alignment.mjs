import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
const output = "output/playwright/controls";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [];
let checked = 0;
try {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({
      colorScheme: theme,
      reducedMotion: "reduce",
    });
    await context.addInitScript((scheme) => {
      localStorage.setItem("overtrue-site-theme", scheme);
      localStorage.setItem(
        "overtrue-workspace-theme-v2",
        JSON.stringify({ scheme }),
      );
    }, theme);
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    const checkSelects = async () => {
      const selects = page.locator("select.native-select");
      await selects.first().waitFor({ state: "attached" });
      const states = await selects.evaluateAll((elements) =>
        elements.map((element) => {
          const style = getComputedStyle(element);
          return {
            appearance: style.appearance,
            position: style.backgroundPosition,
            size: style.backgroundSize,
            arrow: style.backgroundImage,
            inset: parseFloat(style.paddingInlineEnd),
          };
        }),
      );
      for (const state of states) {
        assert.equal(state.appearance, "none", page.url());
        assert.equal(state.position, "calc(100% - 12px) 50%", page.url());
        assert.equal(state.size, "16px 16px", page.url());
        assert.ok(state.inset >= 40, page.url());
        assert.ok(
          state.arrow.includes(theme === "dark" ? "%239ca3af" : "%236b7280"),
          page.url(),
        );
        checked++;
      }
    };
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of [
        "form-layout",
        "settings",
        "wizard",
        "onboarding",
        "2-step-verification",
      ]) {
        await page.goto(`${origin}/workspace/#/${route}`);
        await checkSelects();
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          route,
        );
        if (route === "form-layout") {
          await page
            .getByRole("combobox", { name: "Industry", exact: true })
            .selectOption("Technology");
          assert.equal(
            await page
              .getByRole("combobox", { name: "Industry", exact: true })
              .inputValue(),
            "Technology",
          );
          await page.screenshot({
            path: `${output}/intake-${theme}-${width}.png`,
          });
        }
        if (route === "settings") {
          await page
            .getByRole("button", { name: "Access", exact: true })
            .click();
          await page
            .getByRole("combobox", { name: "Default member role", exact: true })
            .waitFor();
          await checkSelects();
        }
      }
      // The installable block must carry the same styles as its workspace source.
      for (const id of [
        "client-form-01-organization-1",
        "client-form-03-billing-preferences-3",
        "settings-settings-1-1",
        "onboarding-welcome-to-1",
        "wizard-wizard-1-1",
      ]) {
        await page.goto(`${origin}/card-preview.html?id=${id}&theme=${theme}`);
        await checkSelects();
      }
      await page.goto(`${origin}/workspace/#/tasks`);
      const search = page.getByRole("searchbox", {
        name: "Search tasks…",
        exact: true,
      });
      await search.fill("A long search query that reaches the clear control");
      await page
        .getByRole("button", { name: "Clear search tasks…", exact: true })
        .waitFor();
      assert.ok(
        await search.evaluate((input) => {
          const field = input.closest('[data-slot="search-field"]');
          const icon = field.querySelector("svg").getBoundingClientRect();
          const clear = field.querySelector("button").getBoundingClientRect();
          const rect = input.getBoundingClientRect();
          const style = getComputedStyle(input);
          return (
            rect.left + parseFloat(style.paddingLeft) >= icon.right + 4 &&
            rect.right - parseFloat(style.paddingRight) <= clear.left - 4
          );
        }),
        "search text reserves space for both controls",
      );
      await page
        .getByRole("button", { name: "Clear search tasks…", exact: true })
        .click();
      await page.waitForFunction(
        () =>
          document.querySelector('[data-slot="search-field"] input').value ===
          "",
      );
      assert.equal(await search.inputValue(), "");
      await search.and(page.locator(":focus")).waitFor();

      await page.goto(`${origin}/workspace/#/form-elements`);
      await page
        .getByRole("button", { name: "Select & search", exact: true })
        .click();
      assert.ok(
        await page
          .locator("select[multiple]")
          .evaluateAll(
            (elements) =>
              elements.length > 0 &&
              elements.every(
                (element) =>
                  getComputedStyle(element).backgroundImage === "none",
              ),
          ),
        "multi-selects have no dropdown indicator",
      );
      assert.ok(
        await page.locator("select.pn-is-invalid").evaluate((element) => {
          const style = getComputedStyle(element);
          return (
            parseFloat(style.paddingInlineEnd) >= 80 &&
            style.backgroundPosition.includes("48px")
          );
        }),
        "validation and dropdown indicators have separate space",
      );

      await page.goto(`${origin}/blocks`);
      await checkSelects();
      await page.goto(`${origin}/components/section-card`);
      await page.getByRole("button", { name: "Source", exact: true }).click();
      await page
        .getByRole("combobox", { name: "Source file", exact: true })
        .waitFor();
      await checkSelects();
    }
    await page.evaluate(() => {
      document.documentElement.dir = "rtl";
    });
    assert.equal(
      await page
        .locator("select.native-select")
        .last()
        .evaluate((el) => getComputedStyle(el).backgroundPosition),
      "12px 50%",
    );
    await page.emulateMedia({ forcedColors: "active" });
    assert.ok(
      await page
        .locator("select.native-select")
        .last()
        .evaluate((el) => {
          const style = getComputedStyle(el);
          return (
            style.appearance === "auto" && style.backgroundImage === "none"
          );
        }),
      "forced colors keeps the browser's native indicator",
    );
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    `Verified ${checked} select states, exported block styles, search adornments, validation, RTL, and forced colors.`,
  );
} finally {
  await browser.close();
}
