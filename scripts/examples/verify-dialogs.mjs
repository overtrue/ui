import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
const output = process.env.SCREENSHOT_DIR ?? "output/playwright/dialogs";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [];
let checked = 0;
async function exercise(page, trigger, name) {
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  assert.ok(await dialog.getAttribute("aria-labelledby"), "dialog is named");
  for (let n = 0; n < 8; n++) {
    await page.keyboard.press(n < 4 ? "Tab" : "Shift+Tab");
    assert.ok(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
      name + " traps focus",
    );
  }
  assert.ok(
    await dialog.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return (
        el.scrollWidth <= el.clientWidth + 1 &&
        r.left >= -1 &&
        r.top >= -1 &&
        r.right <= innerWidth + 1 &&
        r.bottom <= innerHeight + 1
      );
    }),
    name + " fits viewport",
  );
  await page.screenshot({ path: output + "/" + name + ".png" });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  await trigger.and(page.locator(":focus")).waitFor();
  assert.ok(
    await trigger.evaluate((el) => el === document.activeElement),
    name + " restores focus",
  );
  await trigger.click();
  await dialog
    .getByRole("button", { name: "Close dialog", exact: true })
    .click();
  await dialog.waitFor({ state: "hidden" });
  await trigger.and(page.locator(":focus")).waitFor();
  assert.ok(
    await trigger.evaluate((el) => el === document.activeElement),
    name + " close button restores focus",
  );
  checked++;
}
try {
  for (const theme of ["light", "dark"])
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      page.on("pageerror", (e) => errors.push(e.message));
      await page.addInitScript((scheme) => {
        localStorage.setItem("overtrue-site-theme", scheme);
        localStorage.setItem(
          "overtrue-workspace-theme-v3",
          JSON.stringify({ scheme }),
        );
      }, theme);
      for (const [route, button] of [
        ["offcanvas", "Inspect"],
        ["modals", "Invite collaborator"],
        ["fullcalendar", "New event"],
      ]) {
        await page.goto(origin + "/workspace/#/" + route);
        await page.locator('[data-workspace-page="' + route + '"]').waitFor();
        assert.equal(
          await page
            .locator(".overtrue-workspace[data-bs-theme]")
            .first()
            .getAttribute("data-bs-theme"),
          theme,
        );
        await exercise(
          page,
          page.getByRole("button", { name: button, exact: true }).first(),
          route + "-" + width + "-" + theme,
        );
      }
      await page.goto(origin + "/workspace/#/offcanvas");
      await page
        .getByRole("button", { name: "Inspect", exact: true })
        .first()
        .click();
      await page
        .getByRole("dialog")
        .getByRole("link", { name: "Open full project", exact: true })
        .click();
      await page.locator('[data-workspace-page="datagrid"]').waitFor();
      assert.equal(
        await page.getByRole("dialog").count(),
        0,
        "navigation removes drawer",
      );
      await page.close();
    }
  for (const theme of ["light", "dark"])
    for (const width of [1280, 320]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      page.on("pageerror", (e) => errors.push(e.message));
      for (const [id, button] of [
        ["project-inspector-active-projects-1", "Inspect"],
        ["review-dialogs-visitor-experience-1", "Invite collaborator"],
      ]) {
        await page.goto(
          origin + "/card-preview.html?id=" + id + "&theme=" + theme,
        );
        await exercise(
          page,
          page.getByRole("button", { name: button, exact: true }).first(),
          id + "-" + width + "-" + theme,
        );
      }
      await page.close();
    }
  const page = await browser.newPage({ viewport: { width: 390, height: 420 } });
  await page.goto(origin + "/workspace/#/fullcalendar");
  await page.getByRole("button", { name: "New event", exact: true }).click();
  await page
    .getByLabel("Event title", { exact: true })
    .fill("Short viewport review");
  await page.getByRole("button", { name: "Save event", exact: true }).click();
  await page
    .getByRole("status")
    .filter({ hasText: "Short viewport review added." })
    .waitFor();
  assert.equal(await page.getByRole("dialog").count(), 0);
  await page.close();
  assert.deepEqual(errors, []);
  console.log(
    `Verified ${checked} dialog layouts, focus trapping and restoration, project navigation, and short-viewport submission.`,
  );
} finally {
  await browser.close();
}
