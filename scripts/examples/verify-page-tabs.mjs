import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
const output = "output/playwright/page-tabs";
const routes = JSON.parse(
  readFileSync("src/data/workspace/pages.json", "utf8"),
);
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const results = [];
const failures = [];
const screenshots = new Set([
  "ai-usage",
  "maps",
  "widgets",
  "logs",
  "social-icons",
  "lightbox",
  "index",
]);
try {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      colorScheme: theme,
    });
    await context.addInitScript((scheme) => {
      localStorage.setItem("overtrue-site-theme", scheme);
      localStorage.setItem(
        "overtrue-workspace-theme-v3",
        JSON.stringify({ scheme }),
      );
    }, theme);
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    let errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of routes) {
        const id = route.file.replace(".html", "");
        errors = [];
        const result = { id, width, theme };
        try {
          await page.goto(
            `${origin}/workspace/?tabs-check=${theme}#${route.path}`,
          );
          await page.locator(`[data-workspace-page="${id}"]`).waitFor();
          const groups = await page
            .locator(".scene-page-tabs")
            .evaluateAll((elements) =>
              elements.map((group) => ({
                tabs: [
                  ...group.querySelectorAll(
                    ":scope > a, :scope > button, :scope > span:not(.scene-tabs-context)",
                  ),
                ].map((element) => {
                  const style = getComputedStyle(element);
                  return {
                    text: element.textContent.trim(),
                    current: element.getAttribute("aria-current"),
                    radius: style.borderRadius,
                    shadow: style.boxShadow,
                    border: style.borderBottomColor,
                    borderWidth: style.borderBottomWidth,
                    height: element.getBoundingClientRect().height,
                    action: element.classList.contains("scene-button"),
                  };
                }),
              })),
            );
          for (const { tabs } of groups) {
            if (!tabs.length) continue;
            assert.equal(
              tabs.filter((tab) => tab.current === "page").length,
              1,
              "one current page",
            );
            for (const tab of tabs) {
              assert.equal(
                tab.action,
                false,
                `${tab.text}: navigation uses a link, not an action button`,
              );
              assert.equal(
                tab.radius,
                "0px",
                `${tab.text}: straight underline`,
              );
              assert.equal(tab.shadow, "none", `${tab.text}: no button shadow`);
              assert.ok(tab.height >= 44, `${tab.text}: target height`);
              assert.equal(
                tab.borderWidth,
                "2px",
                `${tab.text}: underline width`,
              );
              if (tab.current === "page")
                assert.notEqual(
                  tab.border,
                  "rgba(0, 0, 0, 0)",
                  `${tab.text}: visible current state`,
                );
              else
                assert.equal(
                  tab.border,
                  "rgba(0, 0, 0, 0)",
                  `${tab.text}: no inactive underline`,
                );
            }
          }
          // The old workspace element reset must not override registry layout utilities.
          const layoutLeaks = await page
            .locator(".overtrue-workspace [data-slot]")
            .evaluateAll((roots) =>
              [
                ...new Set(
                  roots.flatMap((root) => [
                    root,
                    ...root.querySelectorAll(".flex, .inline-flex, .grid"),
                  ]),
                ),
              ]
                .filter((element) => {
                  if (
                    !element.getClientRects().length ||
                    (element.closest("details:not([open])") &&
                      !element.closest("summary"))
                  )
                    return false;
                  if (
                    element.closest('[class*="scene-"]') === element ||
                    [...element.classList].some(
                      (token) =>
                        token.includes(":") &&
                        /(?:flex|grid|block|inline|hidden)$/.test(token),
                    )
                  )
                    return false;
                  const expected = element.classList.contains("inline-flex")
                    ? "inline-flex"
                    : element.classList.contains("flex")
                      ? "flex"
                      : element.classList.contains("grid")
                        ? "grid"
                        : null;
                  // Flex/grid items blockify their inline display variant.
                  return (
                    expected &&
                    getComputedStyle(element).display.replace(
                      /^inline-/,
                      "",
                    ) !== expected.replace(/^inline-/, "")
                  );
                })
                .map((element) => ({
                  tag: element.tagName,
                  text: element.textContent.slice(0, 60),
                  display: getComputedStyle(element).display,
                })),
            );
          assert.deepEqual(
            layoutLeaks,
            [],
            "registry layout utilities survive workspace styles",
          );
          assert.deepEqual(errors, [], "no runtime errors");
          result.groups = groups.length;
          if (screenshots.has(id)) {
            await page.evaluate(() => document.fonts.ready);
            await page.screenshot({
              path: `${output}/${id}-${width}-${theme}.png`,
              animations: "disabled",
            });
          }
        } catch (error) {
          result.error = error.message;
          failures.push(result);
        }
        results.push(result);
      }
      console.log(`Checked ${theme} at ${width}px`);
    }
    // Follow every report tab and verify the active state updates after routing.
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`${origin}/workspace/#/ai-usage`);
    await page.evaluate(() => document.fonts.ready);
    assert.ok(
      await page
        .locator('.scene-page-tabs > [aria-current="page"]')
        .evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const row = element.parentElement.getBoundingClientRect();
          return bounds.left >= row.left - 1 && bounds.right <= row.right + 1;
        }),
      "the current report tab is fully visible on initial load at 320px",
    );
    for (const [label, route] of [
      ["Acquisition", "charts"],
      ["Retention", "charts-advanced"],
      ["Revenue", "revenue"],
      ["AI usage", "ai-usage"],
    ]) {
      const link = page
        .getByRole("navigation", { name: "Reports", exact: true })
        .getByRole("link", { name: label, exact: true });
      await link.focus();
      await page.keyboard.press("Shift");
      const focus = await link.evaluate((element) => ({
        visible: element.matches(":focus-visible"),
        style: getComputedStyle(element).outlineStyle,
        offset: getComputedStyle(element).outlineOffset,
      }));
      assert.equal(focus.visible, true);
      assert.equal(focus.style, "solid");
      assert.equal(
        focus.offset,
        "-2px",
        "focus remains inside the scrolling tab row",
      );
      assert.ok(
        await link.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const row = element.parentElement.getBoundingClientRect();
          return bounds.left >= row.left - 1 && bounds.right <= row.right + 1;
        }),
        "keyboard focus scrolls the whole tab into view at 320px",
      );
      await page.keyboard.press("Enter");
      await page.locator(`[data-workspace-page="${route}"]`).waitFor();
      assert.equal(
        await page
          .locator('.scene-page-tabs > [aria-current="page"]')
          .innerText(),
        label,
      );
    }
    await page.goto(`${origin}/workspace/#/`);
    const summary = page.locator('[data-slot="audit-trail"] summary').first();
    await summary.waitFor();
    assert.equal(
      await summary.evaluate((element) => getComputedStyle(element).display),
      "flex",
    );
    await summary.click();
    assert.equal(
      await summary.evaluate((element) => element.parentElement.open),
      true,
    );
    await page.keyboard.press("Enter");
    assert.equal(
      await summary.evaluate((element) => element.parentElement.open),
      false,
    );
    await context.close();
  }
} finally {
  await browser.close();
  writeFileSync(
    `${output}/results.json`,
    JSON.stringify({ checked: results.length, failures, results }, null, 2),
  );
}
assert.deepEqual(failures, []);
console.log(
  `Page tabs passed: ${results.length} route/theme/viewport checks, report navigation and audit disclosure.`,
);
