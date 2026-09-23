import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4206";
const output = process.env.SCREENSHOT_DIR ?? "/tmp/overtrue-table-actions";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [];
let checks = 0;
const focused = (locator) =>
  locator.evaluate((el) => el === document.activeElement);
try {
  for (const theme of ["light", "dark"]) {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        colorScheme: theme,
      });
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.goto(origin + "/components/advanced-data-table");
      await page.locator(".site-footer").waitFor();
      assert.match(await page.title(), /Interactive table/);
      assert.equal(await page.locator("vite-error-overlay").count(), 0);
      await page.evaluate(() => {
        navigator.clipboard.writeText = async (text) => {
          window.copiedKey = text;
        };
      });
      const demo = page.locator(
        '[data-dashboard-example="data-table-row-actions-demo"]',
      );
      const menu = demo.getByRole("button", {
        name: "Open menu for Client portal",
        exact: true,
      });
      const row = demo.locator("tbody tr").filter({ hasText: "Client portal" });
      await menu.click();
      await page
        .getByRole("menuitem", { name: "Copy key ID", exact: true })
        .click();
      await demo
        .getByRole("status")
        .filter({ hasText: "Copied the demo key ID for Client portal." })
        .waitFor();
      assert.equal(await page.evaluate(() => window.copiedKey), "demo_portal");
      await menu.click();
      const edit = page.getByRole("menuitem", {
        name: "Edit scope",
        exact: true,
      });
      await edit.focus();
      await edit.press("Enter");
      const dialog = page.getByRole("dialog", {
        name: "Edit access scope",
        exact: true,
      });
      await dialog.waitFor();
      assert.ok(
        await dialog.getByRole("button", { name: "Save changes" }).isDisabled(),
      );
      await dialog.getByRole("radio", { name: /^Read only/ }).check();
      for (let n = 0; n < 6; n++) {
        await page.keyboard.press("Tab");
        assert.ok(
          await dialog.evaluate((el) => el.contains(document.activeElement)),
        );
      }
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden" });
      await page.waitForFunction(
        () =>
          document.activeElement?.getAttribute("data-key-id") === "demo_portal",
      );
      assert.match(await row.innerText(), /admin/);
      await menu.click();
      await edit.click();
      await dialog.getByRole("radio", { name: /^Read and write/ }).check();
      assert.ok(
        await dialog.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.left >= 0 &&
            r.right <= innerWidth &&
            r.top >= 0 &&
            r.bottom <= innerHeight
          );
        }),
      );
      await page.screenshot({ path: `${output}/edit-${width}-${theme}.png` });
      await dialog.getByRole("button", { name: "Save changes" }).click();
      await demo
        .getByRole("status")
        .filter({ hasText: "Client portal now has write access in this demo." })
        .waitFor();
      assert.match(await row.innerText(), /write/);
      await page.waitForFunction(
        () =>
          document.activeElement?.getAttribute("data-key-id") === "demo_portal",
      );
      assert.ok(await focused(menu));
      await menu.click();
      await page
        .getByRole("menuitem", { name: "Revoke access", exact: true })
        .click();
      const revoke = page.getByRole("dialog", {
        name: "Revoke access?",
        exact: true,
      });
      await revoke.waitFor();
      assert.ok(
        await focused(
          revoke.getByRole("button", { name: "Cancel", exact: true }),
        ),
      );
      await revoke.getByRole("button", { name: "Cancel", exact: true }).click();
      assert.equal(await demo.locator("tbody tr").count(), 6);
      await row.locator("td").first().click({ button: "right" });
      await page
        .getByRole("menuitem", { name: "Revoke access", exact: true })
        .click();
      await revoke.waitFor();
      await page.screenshot({ path: `${output}/revoke-${width}-${theme}.png` });
      await revoke
        .getByRole("button", { name: "Revoke access", exact: true })
        .click();
      await demo
        .getByRole("status")
        .filter({ hasText: "Revoked demo access for Client portal." })
        .waitFor();
      assert.equal(await demo.locator("tbody tr").count(), 5);
      await page.waitForFunction(
        () =>
          document.activeElement?.getAttribute("id") ===
          document.querySelector(
            '[data-dashboard-example="data-table-row-actions-demo"] input[type="search"]',
          ).id,
      );
      await demo
        .getByRole("button", { name: "Reset demo", exact: true })
        .click();
      assert.equal(await demo.locator("tbody tr").count(), 6);
      assert.match(await row.innerText(), /admin/);
      await page.evaluate(() => {
        navigator.clipboard.writeText = async () => {
          throw new Error("Clipboard denied");
        };
      });
      await menu.click();
      await page
        .getByRole("menuitem", { name: "Copy key ID", exact: true })
        .click();
      await demo
        .getByRole("status")
        .filter({ hasText: "Copy unavailable. Key ID: demo_portal" })
        .waitFor();
      const compact = page.locator(
        '[data-dashboard-example="data-table-compact-demo"]',
      );
      const first = compact.locator("tbody tr").first();
      await first.focus();
      await first.press("Enter");
      assert.ok((await first.getAttribute("class")).includes("bg-muted/60"));
      await first.press("Tab");
      const second = compact.locator("tbody tr").nth(1);
      assert.ok(await focused(second));
      await second.press("Space");
      assert.ok((await second.getAttribute("class")).includes("bg-muted/60"));
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      await page.close();
      checks++;
    }
  }
  // Deterministic overlapping requests: only the last selection may publish data.
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(origin + "/components/advanced-data-table");
  const loading = page.locator(
    '[data-dashboard-example="data-table-loading-demo"]',
  );
  await loading.locator("tbody tr").first().waitFor();
  await page.clock.install();
  await loading.getByRole("tab", { name: "Week", exact: true }).click();
  assert.ok(
    await loading
      .getByRole("button", { name: "Refreshing…", exact: true })
      .isDisabled(),
  );
  await page.clock.fastForward(400);
  await loading.getByRole("tab", { name: "Year", exact: true }).click();
  await page.clock.fastForward(500);
  assert.equal(
    await loading
      .locator('[data-slot="data-table-content"]')
      .getAttribute("aria-busy"),
    "true",
  );
  assert.ok(await loading.locator("tbody").evaluate((el) => el.inert));
  await page.clock.fastForward(400);
  await loading.getByRole("button", { name: "Reload", exact: true }).waitFor();
  assert.match(await loading.locator("tbody tr").first().innerText(), /182/);
  assert.equal(
    await loading.locator("tbody").evaluate((el) => el.inert),
    false,
  );
  await loading.getByRole("button", { name: "Reload", exact: true }).click();
  assert.equal(await loading.getByRole("searchbox").isDisabled(), true);
  await page.clock.fastForward(400);
  await loading.getByRole("tab", { name: "Week", exact: true }).click();
  await page.clock.fastForward(900);
  assert.match(
    await loading.locator("tbody tr").first().innerText(),
    /Client referrals\s+8\s+2/,
  );
  assert.equal(
    await loading
      .locator('[data-slot="data-table-content"]')
      .getAttribute("aria-busy"),
    null,
  );
  await page.close();
  assert.deepEqual(errors, []);
  console.log(
    `Passed ${checks} action-menu layouts: copy/failure, edit/cancel, revoke/reset, modal focus, keyboard rows; latest-request loading checks passed.`,
  );
} finally {
  await browser.close();
}
