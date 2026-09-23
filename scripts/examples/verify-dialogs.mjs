import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
const output = process.env.SCREENSHOT_DIR ?? "/tmp/overtrue-dialogs";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [];
let layouts = 0;
const panels = {
  start: "Project navigation",
  end: "Project details",
  top: "Quick search",
  bottom: "View preferences",
};
async function restored(page, target) {
  await page.waitForFunction(
    (target) =>
      document.activeElement?.getAttribute("data-workspace-target") === target,
    target,
  );
}
try {
  for (const theme of ["light", "dark"]) {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.addInitScript(
        (theme) =>
          localStorage.setItem(
            "overtrue-workspace-theme-v2",
            JSON.stringify({ scheme: theme }),
          ),
        theme,
      );
      await page.goto(origin + "/workspace/#/offcanvas");
      await page.locator('[data-workspace-page="offcanvas"]').waitFor();
      assert.ok(
        await page
          .getByRole("heading", { name: "Keep the context close", exact: true })
          .isVisible(),
      );
      assert.equal(await page.locator("vite-error-overlay").count(), 0);
      assert.equal(
        await page
          .locator(".overtrue-workspace[data-bs-theme]")
          .first()
          .getAttribute("data-bs-theme"),
        theme,
      );
      for (const [side, title] of Object.entries(panels)) {
        const trigger = page.getByRole("button", {
          name: `Open ${side} panel`,
          exact: true,
        });
        await trigger.click();
        const dialog = page.getByRole("dialog", { name: title, exact: true });
        await dialog.waitFor();
        for (let step = 0; step < 6; step++) {
          await page.keyboard.press(step < 3 ? "Tab" : "Shift+Tab");
          assert.ok(
            await dialog.evaluate((el) => el.contains(document.activeElement)),
          );
        }
        assert.ok(
          await dialog.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return (
              el.scrollWidth <= el.clientWidth &&
              rect.left >= -1 &&
              rect.top >= -1 &&
              rect.right <= innerWidth + 1 &&
              rect.bottom <= innerHeight + 1
            );
          }),
        );
        if (side === "top") {
          assert.ok(
            await dialog.evaluate(
              (el) => el.getBoundingClientRect().height < 400,
            ),
          );
          const search = dialog.getByRole("searchbox", {
            name: "Search the handbook",
            exact: true,
          });
          assert.ok(
            await search.evaluate(
              (el) =>
                parseFloat(getComputedStyle(el).borderTopWidth) >= 1 &&
                el.getBoundingClientRect().height >= 32,
            ),
          );
        }
        if (side === "bottom") {
          await dialog
            .getByRole("checkbox", {
              name: "Show completed projects",
              exact: true,
            })
            .check();
          assert.ok(
            await dialog
              .getByRole("button", { name: "Done", exact: true })
              .evaluate((el) => {
                const rect = el.getBoundingClientRect();
                return rect.bottom <= innerHeight;
              }),
          );
        }
        await dialog.screenshot({
          path: `${output}/${side}-${width}-${theme}.png`,
        });
        await page.keyboard.press("Escape");
        await dialog.waitFor({ state: "hidden" });
        await restored(page, `panel-${side}`);
        await trigger.click();
        if (side === "bottom")
          assert.ok(
            await dialog
              .getByRole("checkbox", {
                name: "Show completed projects",
                exact: true,
              })
              .isChecked(),
          );
        await dialog
          .getByRole("button", { name: "Close panel", exact: true })
          .click();
        await dialog.waitFor({ state: "hidden" });
        await restored(page, `panel-${side}`);
        layouts++;
      }
      await page
        .getByRole("button", { name: "Open top panel", exact: true })
        .click();
      await page
        .getByRole("searchbox", { name: "Search the handbook", exact: true })
        .fill("handover");
      await page
        .getByRole("button", { name: "Search handbook", exact: true })
        .click();
      await page.locator('[data-workspace-page="search-results"]').waitFor();
      assert.ok(page.url().includes("query=handover"));
      assert.equal(await page.locator(".workspace-offcanvas").count(), 0);
      await page.goto(origin + "/workspace/#/all-elements");
      const modalTrigger = page.getByRole("button", {
        name: "Open Modal",
        exact: true,
      });
      await modalTrigger.click();
      const modal = page.getByRole("dialog", {
        name: "Project access",
        exact: true,
      });
      await modal.waitFor();
      for (let step = 0; step < 5; step++) {
        await page.keyboard.press("Tab");
        assert.ok(
          await modal.evaluate((el) => el.contains(document.activeElement)),
        );
      }
      await page.screenshot({ path: `${output}/modal-${width}-${theme}.png` });
      await page.keyboard.press("Escape");
      await modal.waitFor({ state: "hidden" });
      await restored(page, "modal-demo");
      await modalTrigger.click();
      await modal.getByRole("button", { name: "Cancel", exact: true }).click();
      await restored(page, "modal-demo");
      await page
        .getByRole("button", { name: "Success Modal", exact: true })
        .click();
      const success = page.getByRole("dialog", {
        name: "Changes saved",
        exact: true,
      });
      await success.getByRole("button", { name: "OK", exact: true }).click();
      await restored(page, "modal-success");
      await modalTrigger.click();
      await modal
        .getByRole("link", { name: "Open settings", exact: true })
        .click();
      await page.locator('[data-workspace-page="settings"]').waitFor();
      await page.goto(origin + "/workspace/#/cookie-banner");
      const privacy = page.getByRole("dialog", {
        name: "Privacy preferences",
        exact: true,
      });
      await privacy.waitFor();
      await privacy
        .getByRole("button", { name: "Essential Cookies Only", exact: true })
        .click();
      await privacy.waitFor({ state: "hidden" });
      await page
        .getByRole("button", { name: "Review preferences", exact: true })
        .click();
      await privacy.waitFor();
      await page.keyboard.press("Escape");
      await restored(page, "offcanvasBottom");
      await page.close();
    }
  }
  // The exported cards use a copied runtime, so exercise their portals too.
  for (const theme of ["light", "dark"]) {
    for (const width of [1280, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(
        `${origin}/card-preview.html?id=offcanvas-visitor-experience-1&theme=${theme}`,
      );
      for (const [side, title] of Object.entries(panels)) {
        await page
          .getByRole("button", { name: `Open ${side} panel`, exact: true })
          .click();
        const dialog = page.getByRole("dialog", { name: title, exact: true });
        await dialog.waitFor();
        assert.ok(
          await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
        );
        if (side === "top") {
          assert.ok(
            await dialog
              .getByRole("searchbox")
              .evaluate(
                (el) => parseFloat(getComputedStyle(el).borderTopWidth) >= 1,
              ),
          );
        }
        await dialog.screenshot({
          path: `${output}/card-${side}-${width}-${theme}.png`,
        });
        await page.keyboard.press("Escape");
        await restored(page, `panel-${side}`);
      }
      await page.goto(
        `${origin}/card-preview.html?id=all-elements-modals-22&theme=${theme}`,
      );
      await page
        .getByRole("button", { name: "Open Modal", exact: true })
        .click();
      await page
        .getByRole("dialog", { name: "Project access", exact: true })
        .waitFor();
      await page.keyboard.press("Escape");
      await restored(page, "modal-demo");
      await page.goto(
        `${origin}/card-preview.html?id=cookie-banner-privacy-preferences-1&theme=${theme}`,
      );
      await page
        .getByRole("dialog", { name: "Privacy preferences", exact: true })
        .waitFor();
      await page.screenshot({
        path: `${output}/card-privacy-${width}-${theme}.png`,
      });
      await page.keyboard.press("Escape");
      await page
        .getByRole("button", { name: "Review preferences", exact: true })
        .click();
      await page.keyboard.press("Escape");
      await restored(page, "offcanvasBottom");
      await page.close();
    }
  }
  // A short viewport still lets the user reach the bottom sheet's last action.
  const page = await browser.newPage({ viewport: { width: 390, height: 420 } });
  await page.goto(origin + "/workspace/#/offcanvas");
  await page
    .getByRole("button", { name: "Open bottom panel", exact: true })
    .click();
  await page
    .getByRole("dialog", { name: "View preferences", exact: true })
    .getByRole("button", { name: "Done", exact: true })
    .click();
  await restored(page, "panel-bottom");
  await page.close();
  assert.deepEqual(errors, []);
  console.log(
    `Passed ${layouts} drawer layouts, modal and privacy flows, 12 exported card layouts, keyboard focus restoration, preference persistence, search navigation, and short-viewport scrolling.`,
  );
} finally {
  await browser.close();
}
