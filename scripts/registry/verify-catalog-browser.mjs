import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  blockCollections,
  catalog,
  catalogPath,
} from "../../src/site/catalog.ts";
import { usageSource } from "../../src/site/usage.ts";

const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
const output = "output/playwright/catalog";
const cards = JSON.parse(readFileSync("src/blocks/catalog.json", "utf8"));
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const results = [];
const errors = [];
assert.deepEqual(
  blockCollections.flatMap((group) => [...group.names]).sort(),
  catalog
    .filter((item) => item.category === "Blocks")
    .map((item) => item.name)
    .sort(),
  "Each composed block belongs to exactly one business category",
);
try {
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const item of catalog) {
      const response = await page.goto(origin + catalogPath(item));
      assert.equal(response.status(), 200);
      await page.locator(".detail-preview").waitFor();
      await page.waitForFunction(
        () =>
          !document
            .querySelector(".detail-preview")
            ?.textContent.includes("Loading example"),
      );
      const collection = item.category === "Blocks" ? "blocks" : "components";
      const sidebarPaths = await page
        .locator(".docs-sidebar a")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
      assert.ok(
        sidebarPaths.every(
          (link) =>
            link === `/${collection}` || link.startsWith(`/${collection}/`),
        ),
        `${item.name}: mixed sidebar`,
      );
      assert.equal(
        await page.locator(".component-picker option").count(),
        catalog.filter(
          (entry) =>
            (entry.category === "Blocks") === (collection === "blocks"),
        ).length,
      );
      assert.ok(
        (await page.locator(".code-box pre").allTextContents()).includes(
          usageSource(item),
        ),
        `${item.name}: Usage mismatch`,
      );
      assert.ok(
        !(await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )),
        `${item.name}: overflow at ${width}`,
      );
      if (width === 1440) {
        await page.getByRole("button", { name: "Source", exact: true }).click();
        assert.equal(
          await page.getByLabel("Source file").inputValue(),
          item.name,
        );
        assert.equal(
          await page.locator(".source-view pre").textContent(),
          readFileSync(`src/registry/overtrue/${item.name}.tsx`, "utf8"),
          `${item.name}: source mismatch`,
        );
      }
      results.push({ name: item.name, width, path: catalogPath(item) });
    }
    console.log(`Verified ${catalog.length} catalog pages at ${width}px`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin + "/components");
  assert.equal(
    await page.locator(".tile-caption").count(),
    catalog.filter((item) => item.category !== "Blocks").length,
  );
  assert.ok(
    (
      await page
        .locator(".tile-caption")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    ).every((link) => link.startsWith("/components/")),
  );
  await page.goto(origin + "/blocks");
  assert.equal(
    await page.locator(".block-grid .tile-caption").count(),
    catalog.filter((item) => item.category === "Blocks").length,
  );
  assert.ok(
    (
      await page
        .locator(".block-grid .tile-caption")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")))
    ).every((link) => link.startsWith("/blocks/")),
  );
  for (const iframe of await page.locator(".card-collection iframe").all()) {
    await iframe.scrollIntoViewIfNeeded();
    await iframe.contentFrame().locator(".overtrue-block").waitFor();
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${output}/blocks.png`, fullPage: true });
  // Each collection owns its URL filters; browsing details must retain them.
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(origin + "/blocks");
    const blockSearch = page.getByLabel("Search composed blocks");
    const blockTiles = page.locator(".block-grid .tile-caption");
    const filters = page.locator('[aria-label="Filter composed blocks"]');
    const expectBlockCount = async (count) => {
      await page.waitForFunction(
        (expected) =>
          document.querySelectorAll(".block-grid .tile-caption").length ===
          expected,
        count,
      );
      assert.equal(await blockTiles.count(), count);
    };
    for (const group of blockCollections) {
      await filters
        .getByRole("button", { name: group.label, exact: true })
        .click();
      await filters
        .getByRole("button", { name: group.label, exact: true, pressed: true })
        .waitFor();
      await expectBlockCount(group.names.length);
    }
    await filters.getByRole("button", { name: "Billing", exact: true }).click();
    await expectBlockCount(2);
    await blockSearch.fill("  INVOICE  ");
    await expectBlockCount(1);
    await page.reload();
    assert.equal(await blockSearch.inputValue(), "  INVOICE  ");
    assert.equal(await blockTiles.count(), 1);
    await blockTiles.first().click();
    await page.waitForURL(origin + "/blocks/invoice-list");
    await page.goBack();
    await blockSearch.waitFor();
    assert.equal(await blockTiles.count(), 1);
    assert.equal(
      await filters
        .getByRole("button", { name: "Billing", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );

    await page.getByLabel("Search card blocks").fill("not-a-real-card");
    await page
      .locator(".card-collection")
      .getByRole("button", { name: "Clear filters" })
      .click();
    assert.equal(await blockSearch.inputValue(), "  INVOICE  ");
    assert.equal(
      new URL(page.url()).searchParams.get("blockCategory"),
      "Billing",
    );
    await page.getByLabel("Search card blocks").fill("chart");
    await blockSearch.fill("not-a-real-block");
    const empty = page.locator(".catalog-page > .search-empty");
    await empty.getByRole("heading", { name: "No matching blocks." }).waitFor();
    assert.ok(
      await empty.evaluate(
        (el) =>
          !!(
            el.compareDocumentPosition(
              document.querySelector(".card-collection"),
            ) & Node.DOCUMENT_POSITION_FOLLOWING
          ),
      ),
    );
    await empty.getByRole("button", { name: "Clear filters" }).click();
    assert.equal(
      await page.getByLabel("Search card blocks").inputValue(),
      "chart",
    );
    await expectBlockCount(
      catalog.filter((item) => item.category === "Blocks").length,
    );
    await blockSearch.fill("All");
    await page.waitForURL(
      (url) => url.searchParams.get("blockQuery") === "All",
    );
    assert.equal(await blockSearch.inputValue(), "All");
    assert.equal(new URL(page.url()).searchParams.get("blockQuery"), "All");

    await page.goto(origin + "/blocks?blockCategory=unknown&category=unknown");
    assert.equal(
      await filters
        .getByRole("button", { name: "All blocks", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    assert.equal(
      await page.getByLabel("Card category").inputValue(),
      "All cards",
    );
    await page
      .getByRole("navigation", { name: "Block collections" })
      .getByRole("link", { name: /Card patterns/ })
      .click();
    await page.waitForFunction(() => {
      const top = document
        .querySelector("#card-collection-title")
        .getBoundingClientRect().top;
      return top >= 64 && top < 160;
    });
    assert.ok(
      !(await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      )),
      `Block filters overflow at ${width}px`,
    );
  }
  console.log(
    "Verified block categories, shared filter URLs, history, empty states, and collection anchors at desktop and mobile widths",
  );
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(
      origin + "/blocks?q=Form%20elements%202#card-collection-title",
    );
    const cardLink = page.getByRole("link", {
      name: "Select and multi-select inputs Forms & settings",
      exact: true,
    });
    await cardLink.scrollIntoViewIfNeeded();
    await cardLink
      .locator("iframe")
      .contentFrame()
      .locator(".overtrue-block")
      .waitFor();
    await page.waitForFunction(() => {
      const preview = document.querySelector(
        ".card-library-link .fit-preview-content",
      );
      return preview && preview.offsetHeight > 1000;
    });
    const scale = await cardLink
      .locator(".fit-preview-content")
      .evaluate(
        (element) => new DOMMatrix(getComputedStyle(element).transform).a,
      );
    assert.ok(
      scale > (width === 1440 ? 0.8 : 0.4),
      `Long card content is illegible at ${width}px`,
    );
    assert.equal(
      await cardLink.locator("[inert][aria-hidden=true]").count(),
      1,
    );
    await cardLink.focus();
    await page.keyboard.press("Enter");
    await page.waitForURL(origin + "/blocks/form-elements-form-elements-2-2");
    await page
      .getByRole("heading", {
        name: "Select and multi-select inputs",
        exact: true,
      })
      .waitFor();
    const preview = page.locator(".card-live-preview iframe").contentFrame();
    await preview.getByText("Select multiple", { exact: true }).waitFor();
    const select = preview.locator("select").first();
    await select.selectOption("2");
    assert.equal(await select.inputValue(), "2");

    await page.goto(origin + "/blocks?q=AvatarStack#card-collection-title");
    await page
      .getByRole("link", {
        name: "Workspace interface patterns UI patterns",
        exact: true,
      })
      .waitFor();
    await page.goto(
      origin + "/blocks?q=Social%20referrals#card-collection-title",
    );
    const chartLink = page.getByRole("link", {
      name: "Social referrals Charts & metrics",
      exact: true,
    });
    await chartLink.scrollIntoViewIfNeeded();
    await chartLink
      .locator("iframe")
      .contentFrame()
      .locator(".overtrue-block")
      .waitFor();
    await page.waitForFunction(() => {
      const content = document.querySelector(
        ".card-library-link .fit-preview-content",
      );
      return (
        content &&
        content.offsetHeight > 0 &&
        content.getBoundingClientRect().height <= 321
      );
    });
    await page.goto(origin + "/blocks?q=Facebook#card-collection-title");
    const socialCard = page.getByRole("link", {
      name: "Facebook shares Charts & metrics",
      exact: true,
    });
    await socialCard.scrollIntoViewIfNeeded();
    await socialCard.click({ position: { x: 40, y: 40 } });
    await page.waitForURL(origin + "/blocks/social-icons-social-icons-2-2");
  }
  console.log(
    "Verified descriptive card names, legacy searches, readable thumbnails, and mouse/keyboard access to live previews",
  );
  for (const item of catalog.filter((item) => item.category === "Blocks")) {
    await page.goto(origin + `/components/${item.name}`);
    await page.waitForURL(origin + catalogPath(item));
    await page.locator(".detail-preview").waitFor();
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(origin + "/blocks/settings-panel");
    await page.getByLabel("Workspace name", { exact: true }).waitFor();
    const gaps = await page
      .locator(".detail-preview label")
      .evaluateAll((labels) =>
        labels.map(
          (label) =>
            document.getElementById(label.htmlFor).getBoundingClientRect().top -
            label.getBoundingClientRect().bottom,
        ),
      );
    assert.ok(
      gaps.every((gap) => Math.abs(gap - 8) < 0.5),
      `label gaps: ${gaps}`,
    );
    await page
      .getByLabel("Workspace name", { exact: true })
      .fill("Review workspace");
    await page
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "Demo saved locally" })
      .waitFor();
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (theme) =>
          document.documentElement.classList.toggle("dark", theme === "dark"),
        theme,
      );
      await page.screenshot({
        path: `${output}/settings-${width}-${theme}.png`,
        fullPage: true,
      });
    }
  }
  // Navigating away after picking a dependency must reset the main source file.
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(origin + "/blocks/member-card");
  await page.getByRole("button", { name: "Source", exact: true }).click();
  await page.getByLabel("Source file").selectOption("section-card");
  await page
    .locator(".docs-sidebar")
    .getByRole("link", { name: "Settings panel", exact: true })
    .click();
  await page.locator(".detail-preview").waitFor();
  await page.getByRole("button", { name: "Source", exact: true }).click();
  assert.equal(
    await page.getByLabel("Source file").inputValue(),
    "settings-panel",
  );
  assert.ok(
    (await page.locator(".source-view pre").textContent()).includes(
      "export function SettingsPanel",
    ),
  );
  await page.goto(origin + `/blocks/${cards[0].id}`);
  await page.frameLocator("iframe").locator(".overtrue-block").waitFor();
  await page.getByRole("button", { name: "Source", exact: true }).click();
  await page.waitForFunction(
    () =>
      !document
        .querySelector(".source-view pre")
        ?.textContent.includes("Loading source"),
  );
  assert.equal(
    await page.locator(".source-view pre").textContent(),
    readFileSync(`src/blocks/registry/${cards[0].id}.tsx`, "utf8"),
  );
  // Installation is reachable above long previews, in either view.
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/components/section-card",
      "/blocks/team-access",
      `/blocks/${cards[0].id}`,
    ]) {
      for (const view of ["Preview", "Source"]) {
        await page.goto(origin + route);
        await page.getByRole("button", { name: view, exact: true }).click();
        assert.ok(
          !(await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth + 1,
          )),
          `${route}: ${view} toolbar overflow at ${width}px`,
        );
        await page.getByRole("link", { name: "Install", exact: true }).click();
        await page.waitForFunction(() => {
          const top = document
            .getElementById("installation")
            .getBoundingClientRect().top;
          return top >= 64 && top < 180;
        });
        assert.equal(new URL(page.url()).hash, "#installation");
        assert.ok(
          await page
            .getByRole("link", { name: "Registry JSON", exact: true })
            .count(),
        );
      }
    }
  }
  // A failed source chunk has a recovery path and never offers to copy nothing.
  const sourceContext = await browser.newContext();
  const sourcePage = await sourceContext.newPage();
  const sourceErrors = [];
  sourcePage.on("pageerror", (error) => sourceErrors.push(error.message));
  const cardId = cards[0].id;
  let releaseSource;
  const sourceGate = new Promise((resolve) => {
    releaseSource = resolve;
  });
  await sourcePage.route(`**/*${cardId}*`, async (route) => {
    if (
      route.request().resourceType() === "script" &&
      route.request().frame() === sourcePage.mainFrame()
    ) {
      await sourceGate;
      await route.abort("failed");
    } else await route.continue();
  });
  try {
    await sourcePage.goto(origin + `/blocks/${cardId}`, {
      waitUntil: "domcontentloaded",
    });
    await sourcePage
      .getByRole("button", { name: "Source", exact: true })
      .click();
    await sourcePage
      .getByRole("status")
      .filter({ hasText: "Loading source…" })
      .waitFor();
    assert.equal(
      await sourcePage
        .getByRole("button", { name: "Copy block source" })
        .count(),
      0,
    );
    releaseSource();
    await sourcePage
      .getByRole("alert")
      .filter({ hasText: "Source could not be loaded." })
      .waitFor();
    assert.equal(
      await sourcePage
        .getByRole("button", { name: "Copy block source" })
        .count(),
      0,
    );
    await sourcePage.unroute(`**/*${cardId}*`);
    await sourcePage.getByRole("button", { name: "Reload page" }).click();
    await sourcePage
      .getByRole("button", { name: "Source", exact: true })
      .click();
    await sourcePage
      .getByRole("button", { name: "Copy block source" })
      .waitFor();
    assert.equal(
      await sourcePage.locator(".source-view pre").textContent(),
      readFileSync(`src/blocks/registry/${cardId}.tsx`, "utf8"),
    );
    assert.deepEqual(sourceErrors, []);
  } finally {
    releaseSource();
    await sourceContext.close();
  }
  console.log(
    "Verified installation shortcuts and source loading, failure, and reload recovery",
  );
  // Business blocks keep real interaction state in both responsive layouts.
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(origin + "/blocks/team-access");
    const preview = page.locator(".detail-preview");
    assert.equal(await preview.getByLabel("Role for Chris An").count(), 0);
    await preview.getByLabel("Role for Leo Nakamura").selectOption("Admin");
    assert.equal(
      await preview.getByLabel("Role for Leo Nakamura").inputValue(),
      "Admin",
    );
    await preview.getByLabel("Search team members").fill("no-match");
    assert.equal(await preview.getByRole("listitem").count(), 0);
    assert.ok(
      await preview.getByText("No members match your search.").isVisible(),
    );
    await preview.getByLabel("Search team members").fill("LEO@EXAMPLE.COM");
    assert.equal(await preview.getByRole("listitem").count(), 1);
    assert.equal(
      await preview.getByLabel("Role for Leo Nakamura").inputValue(),
      "Admin",
    );

    await page.goto(origin + "/blocks/notification-preferences");
    const save = preview.getByRole("button", { name: "Save preferences" });
    assert.ok(await save.isDisabled());
    const digest = preview.getByRole("switch", { name: "Weekly digest" });
    await digest.focus();
    await digest.press("Space");
    assert.equal(await digest.getAttribute("aria-checked"), "true");
    assert.ok(await save.isEnabled());
    await digest.press("Space");
    assert.ok(await save.isDisabled());
    await digest.press("Space");
    await save.click();
    assert.ok(
      await preview.getByText("Preferences saved in this demo.").isVisible(),
    );
    assert.ok(await save.isDisabled());

    await page.goto(origin + "/blocks/invoice-list");
    assert.equal(await preview.getByRole("listitem").count(), 3);
    await preview.getByRole("button", { name: "Paid", exact: true }).click();
    assert.equal(await preview.getByRole("listitem").count(), 2);
    await preview.getByRole("button", { name: "Overdue", exact: true }).click();
    assert.ok(
      await preview.getByText("No invoices with this status.").isVisible(),
    );
    await preview.getByRole("button", { name: "All", exact: true }).click();
    assert.equal(await preview.getByRole("listitem").count(), 3);
  }
  // Unknown routes must never invoke a loader inherited from Object.prototype.
  await page.addInitScript(() => {
    Object.defineProperty(
      Object.prototype,
      "../blocks/registry/unregistered-source.tsx",
      {
        configurable: true,
        value: () => {
          document.documentElement.dataset.unexpectedLoader = "called";
          return Promise.resolve("unexpected source");
        },
      },
    );
  });
  for (const id of ["unregistered-source", "constructor", "__proto__"]) {
    await page.goto(origin + `/blocks/${id}`);
    await page.getByRole("heading", { name: "Card not found." }).waitFor();
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    assert.equal(
      await page.locator("html").getAttribute("data-unexpected-loader"),
      null,
      `${id}: invoked an inherited loader`,
    );
  }
  assert.deepEqual(errors, []);
  writeFileSync(
    `${output}/results.json`,
    JSON.stringify(
      {
        results,
        errors,
        labelGap: 8,
        legacyRedirects: catalog.filter((item) => item.category === "Blocks")
          .length,
      },
      null,
      2,
    ),
  );
  console.log(
    "Verified catalog separation, block legacy redirects, exact Source/Usage, source reset, and 8px field spacing with save feedback in both themes.",
  );
} finally {
  await browser.close();
}
