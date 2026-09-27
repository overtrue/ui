import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [];
let checked = 0;

function hasErrorBorder(element) {
  const marker = document.createElement("span");
  marker.style.color = "hsl(var(--destructive))";
  element.parentElement.append(marker);
  const expected = getComputedStyle(marker).color;
  marker.remove();
  return getComputedStyle(element).borderTopColor === expected;
}

try {
  for (const scheme of ["light", "dark"]) {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.addInitScript((scheme) => {
        localStorage.setItem(
          "overtrue-workspace-theme-v2",
          JSON.stringify({ scheme }),
        );
      }, scheme);
      await page.goto(`${origin}/workspace/#/form-layout`);
      await page.locator('[data-workspace-page="form-layout"]').waitFor();
      const company = page.getByRole("textbox", {
        name: "Client name",
        exact: true,
      });
      const email = page.getByRole("textbox", {
        name: "Contact email",
        exact: true,
      });
      assert.equal(
        await company.evaluate(hasErrorBorder),
        false,
        "untouched controls are not errors",
      );
      await page
        .getByRole("button", { name: "Save client", exact: true })
        .click();
      await page.waitForFunction(
        () => document.activeElement?.getAttribute("name") === "organization",
      );
      await page.waitForFunction(() =>
        document
          .querySelector('input[name="organization"]')
          .matches(":user-invalid"),
      );
      await page.waitForFunction(hasErrorBorder, await company.elementHandle());
      await page.waitForFunction(hasErrorBorder, await email.elementHandle());
      assert.ok(
        await company.evaluate(hasErrorBorder),
        "a focused invalid field keeps its error border",
      );
      assert.ok(
        await email.evaluate(hasErrorBorder),
        "unfocused invalid fields show their error border",
      );
      assert.equal(await page.locator(".scene-form-result").count(), 0);
      await company.fill("   ");
      assert.equal(
        await company.evaluate((input) => input.checkValidity()),
        false,
        "whitespace is not a company name",
      );
      await company.fill("QA Studio");
      await page
        .getByRole("textbox", { name: "Contact name", exact: true })
        .fill("Alex Example");
      await email.fill("alex@acme.example");
      await page
        .getByRole("button", { name: "Save client", exact: true })
        .click();
      await page
        .getByRole("status")
        .filter({ hasText: "QA Studio saved in this preview" })
        .waitFor();
      assert.equal(
        await company.evaluate((input) => input.matches(":user-invalid")),
        false,
      );
      await company.fill("QA Studio updated");
      await page.locator(".scene-form-result").waitFor({ state: "hidden" });
      const enabledSurface = await company.evaluate(
        (input) => getComputedStyle(input).backgroundColor,
      );
      await company.evaluate((input) => {
        input.disabled = true;
      });
      assert.notEqual(
        await company.evaluate(
          (input) => getComputedStyle(input).backgroundColor,
        ),
        enabledSurface,
        "disabled controls have a distinct surface",
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );

      await page.goto(`${origin}/workspace/#/sign-in`);
      await page.locator('[data-workspace-page="sign-in"]').waitFor();
      await page
        .getByRole("button", { name: "Continue to workspace", exact: true })
        .click();
      const authEmail = page.getByRole("textbox", {
        name: "Email address",
        exact: true,
      });
      await authEmail.and(page.locator(":focus")).waitFor();
      await page.waitForFunction(
        hasErrorBorder,
        await authEmail.elementHandle(),
      );
      assert.ok(
        await authEmail.evaluate(hasErrorBorder),
        "authentication uses the same focused error state",
      );

      await page.goto(`${origin}/workspace/#/pay`);
      await page.locator('[data-workspace-page="pay"]').waitFor();
      await page.getByRole("button", { name: "Overdue", exact: true }).click();
      await page.waitForFunction(
        () => document.querySelectorAll(".scene-table tbody tr").length === 1,
      );
      await page.getByRole("status").filter({ hasText: "$3,395" }).waitFor();
      assert.equal(
        await page.locator(".scene-table td.scene-number").innerText(),
        "$3,395",
      );
      assert.equal(
        await page
          .locator(".scene-table td.scene-number")
          .evaluate((cell) => getComputedStyle(cell).textAlign),
        "end",
      );
      const downloaded = page.waitForEvent("download");
      await page.getByRole("button", { name: "Export", exact: true }).click();
      const csv = await readFile(await (await downloaded).path(), "utf8");
      assert.equal(
        csv.trim().split("\n").length,
        2,
        "filtered export contains one invoice plus its header",
      );
      assert.ok(csv.includes('"INV-26-187"') && csv.includes('"Overdue"'));
      assert.ok(!csv.includes('"Paid"'));
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      for (const route of [
        "users",
        "gallery",
        "search-results",
        "email-inbox",
      ]) {
        await page.goto(`${origin}/workspace/#/${route}`);
        await page.locator(`[data-workspace-page="${route}"]`).waitFor();
        if (route === "email-inbox") {
          await page
            .getByRole("button", { name: "Archive", exact: true })
            .click();
        }
        const search = page.getByRole("searchbox");
        await search.fill("no-matching-record");
        await page
          .getByRole("button", {
            name: route === "gallery" ? "Clear filters" : "Clear search",
            exact: true,
          })
          .click();
        assert.ok(
          await search.evaluate((input) => input === document.activeElement),
          `${route} returns focus to search after an empty result`,
        );
        assert.equal(await search.inputValue(), "");
        if (route === "gallery") {
          const preview = page.locator(".scene-library > button").first();
          await preview.click();
          await page.getByRole("dialog").waitFor();
          await page
            .getByRole("button", { name: "Next asset", exact: true })
            .click();
          await page.keyboard.press("Escape");
          await page.getByRole("dialog").waitFor({ state: "hidden" });
          assert.ok(
            await preview.evaluate(
              (button) => button === document.activeElement,
            ),
            "Escape returns to the asset that opened the preview after browsing",
          );
          await preview.press("Enter");
          await page
            .getByRole("button", { name: "Close preview", exact: true })
            .click();
          assert.ok(
            await preview.evaluate(
              (button) => button === document.activeElement,
            ),
            "the close button restores preview trigger focus",
          );
        }
        if (route === "email-inbox") {
          assert.equal(
            await page.locator(".scene-inbox > aside > button").count(),
            3,
            "clearing a search preserves archived conversations",
          );
        }
      }
      if (width < 576) {
        for (const route of ["tasks-list", "datatables", "tables"]) {
          await page.goto(`${origin}/workspace/#/${route}`);
          await page.locator(`[data-workspace-page="${route}"]`).waitFor();
          const table = page.locator(".scene-table-wrap").first();
          assert.ok(
            await table.evaluate((element) => {
              const pinned = element
                .querySelector("th")
                .getBoundingClientRect();
              return pinned.width < element.clientWidth / 2;
            }),
            `${route} leaves room for data beside the pinned mobile column`,
          );
          if (route === "tasks-list") {
            const status = page.getByRole("combobox", {
              name: "Status of WK-182",
              exact: true,
            });
            await status.scrollIntoViewIfNeeded();
            await status.selectOption("In review");
            assert.equal(await status.inputValue(), "In review");
            assert.ok(
              await status.evaluate((element) => {
                const rect = element.getBoundingClientRect();
                const hit = document.elementFromPoint(
                  rect.left + rect.width / 2,
                  rect.top + rect.height / 2,
                );
                return hit === element;
              }),
              "the pinned task name does not cover the status control",
            );
          }
        }
      }
      checked++;
      await page.close();
    }
  }
  assert.deepEqual(errors, []);
  console.log(
    `Verified client validation, authentication errors, disabled fields, form feedback, numeric alignment, filtered CSV exports, empty-state and dialog focus, and archived conversations in ${checked} viewport/theme combinations.`,
  );
} finally {
  await browser.close();
}
