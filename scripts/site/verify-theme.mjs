import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
const output = "output/playwright/theme";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: "light",
  contrast: "no-preference",
  reducedMotion: "reduce",
});
const page = await context.newPage(),
  errors = [],
  checks = [];
page.on("pageerror", (error) => errors.push(error.message));
const contrastState = async (value) =>
  page.waitForFunction(
    (v) => document.documentElement.dataset.contrast === v,
    value,
  );
const themeValue = async (name) =>
  page.evaluate(
    (n) =>
      getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
    name,
  );
const selectRadio = async (root, name) => {
  const input = root.getByRole("radio", { name, exact: true });
  await input.focus();
  await input.press("Space");
};
const noOverflow = async (label) =>
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    `${label}: document overflow`,
  );
try {
  const fresh = await browser.newContext({ colorScheme: "dark", contrast: "more", reducedMotion: "reduce" });
  const firstVisit = await fresh.newPage();
  await firstVisit.goto(origin + "/workspace/");
  await firstVisit.locator(".overtrue-workspace").first().waitFor();
  assert.equal(await firstVisit.locator("html.dark").count(), 1);
  assert.equal(await firstVisit.locator("html").getAttribute("data-contrast"), "high");
  await firstVisit.emulateMedia({ colorScheme: "light", contrast: "no-preference" });
  await firstVisit.waitForFunction(() => !document.documentElement.classList.contains("dark") && document.documentElement.dataset.contrast === "standard");
  await firstVisit.emulateMedia({ colorScheme: "dark" });
  await firstVisit.goto(origin + "/");
  await firstVisit.locator("html.dark").waitFor();
  await fresh.close();
  checks.push("A fresh workspace follows the device scheme and contrast live; System scheme carries back to the gallery.");
  await page.goto(origin + "/docs#theming");
  await page.locator(".docs-studio").waitFor();
  const studio = page.locator(".docs-studio");
  await contrastState("standard");
  const standard = await themeValue("--border");
  await page.emulateMedia({ contrast: "more" });
  await contrastState("high");
  assert.notEqual(await themeValue("--border"), standard);
  await selectRadio(studio, "Standard");
  await contrastState("standard");
  await page.emulateMedia({ contrast: "no-preference" });
  await selectRadio(studio, "High");
  await contrastState("high");
  await page.emulateMedia({ contrast: "more" });
  await contrastState("high");
  await page.emulateMedia({ contrast: "no-preference" });
  await contrastState("high");
  await page.reload();
  await contrastState("high");
  await selectRadio(studio, "System");
  await contrastState("standard");
  await page.emulateMedia({ contrast: "more" });
  await contrastState("high");
  console.log("Completed theme check", checks.length + 1);
  checks.push(
    "System preference updates live; explicit Standard and High override it and survive reload.",
  );
  // Native radio groups must work with arrows, and each copy owns its own group.
  const stone = studio.getByRole("radio", { name: "Stone", exact: true });
  await stone.focus();
  await stone.press("Space");
  await stone.press("ArrowLeft");
  assert.equal(
    await studio.getByRole("radio", { name: "Zinc", exact: true }).isChecked(),
    true,
  );
  await studio.getByLabel("Custom accent color").fill("#ffff00");
  const range = studio.getByRole("slider", { name: "Corner radius" });
  await range.fill("0");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await selectRadio(studio, "High");
  await contrastState("high");
  const sitePrimary = await themeValue("--primary");
  assert.notEqual(sitePrimary, "#ffff00");
  const exported = await studio.locator(".studio-code").innerText();
  assert.ok(exported.includes("--radius: 0rem"));
  // Render the exported CSS in an isolated document, not just a text comparison.
  const exportParity = await page.evaluate(async (css) => {
    const iframe = document.createElement("iframe");
    document.body.append(iframe);
    const doc = iframe.contentDocument;
    doc.head.innerHTML = "<style>" + css + "</style>";
    doc.documentElement.className = "dark";
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const c = canvas.getContext("2d");
    const rgb = (value) => {
      c.clearRect(0, 0, 1, 1);
      c.fillStyle = value;
      c.fillRect(0, 0, 1, 1);
      return [...c.getImageData(0, 0, 1, 1).data].slice(0, 3);
    };
    const outer = getComputedStyle(document.documentElement),
      inner = iframe.contentWindow.getComputedStyle(doc.documentElement);
    const names = [
      "--primary",
      "--primary-foreground",
      "--muted-foreground",
      "--border",
      "--input",
      "--chart-1",
      "--chart-3",
    ];
    const result = names.map((name) => ({
      name,
      live: rgb(outer.getPropertyValue(name)),
      exported: rgb(inner.getPropertyValue(name)),
    }));
    iframe.remove();
    return result;
  }, exported);
  for (const item of exportParity)
    assert.ok(
      item.live.every((v, i) => Math.abs(v - item.exported[i]) <= 1),
      JSON.stringify(item),
    );
  console.log("Completed theme check", checks.length + 1);
  checks.push(
    "Keyboard color controls, arbitrary yellow accent, zero radius, and rendered CSS export match the live theme.",
  );
  // An existing workspace layout must remain intact while gallery colors carry over.
  await page.evaluate(() =>
    localStorage.setItem(
      "overtrue-workspace-theme-v3",
      JSON.stringify({
        font: "mono",
        nav: "horizontal",
        container: "boxed",
        sidebar: "folded",
        accent: "#ff0000",
        radius: 2,
        base: "ink",
        scheme: "light",
      }),
    ),
  );
  await page.goto(origin + "/workspace/");
  await page
    .getByRole("heading", { name: "Studio overview", exact: true })
    .waitFor();
  await contrastState("high");
  assert.equal(await page.locator("html.dark").count(), 1);
  assert.equal(await themeValue("--radius"), "0rem");
  const workspace = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("overtrue-workspace-theme-v3")),
  );
  assert.equal(workspace.accent, "#ffff00");
  assert.equal(workspace.base, "zinc");
  assert.equal(workspace.font, "mono");
  assert.equal(workspace.nav, "horizontal");
  assert.equal(workspace.container, "boxed");
  await page
    .getByRole("button", { name: "Customize theme", exact: true })
    .click();
  const settings = page.getByRole("dialog");
  await selectRadio(settings, "Standard");
  await contrastState("standard");
  await settings.getByLabel("Custom accent", { exact: true }).fill("#000000");
  await settings.getByRole("slider", { name: "Corner radius" }).fill("20");
  await settings.getByRole("button", { name: "Save", exact: true }).click();
  await page.goto(origin + "/components");
  await page
    .getByRole("heading", { name: "Components", exact: true })
    .waitFor();
  await contrastState("standard");
  assert.equal(await themeValue("--radius"), "1.25rem");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("overtrue-theme-studio")),
  );
  assert.equal(saved.accent, "#000000");
  console.log("Completed theme check", checks.length + 1);
  checks.push(
    "Gallery and workspace share scheme, accent, neutral, contrast and exact radius; saved workspace font/layout are preserved.",
  );
  // Cross-tab changes must converge without a storage-event loop.
  const other = await context.newPage();
  await other.goto(origin + "/docs#theming");
  await other.locator(".docs-studio").waitFor();
  await selectRadio(other.locator(".docs-studio"), "High");
  await contrastState("high");
  await other.close();
  await page
    .getByRole("button", { name: "Customize theme", exact: true })
    .click();
  const popover = page.locator(".studio-popover");
  await popover.getByRole("button", { name: "Reset to default" }).click();
  await contrastState("high");
  await page.emulateMedia({ contrast: "no-preference" });
  await contrastState("standard");
  await page.keyboard.press("Escape");
  assert.equal(await themeValue("--radius"), "0.5rem");
  console.log("Completed theme check", checks.length + 1);
  checks.push("Cross-tab updates and reset converge correctly.");
  await page.emulateMedia({ contrast: "more" });
  await contrastState("high");
  await page.goto(origin + "/blocks/overview-overview-1-1");
  const card = page.frameLocator('iframe[title="Studio metrics preview"]');
  await card.locator(".overtrue-block").waitFor();
  const parentPrimary = await themeValue("--primary");
  await page.waitForFunction((expected) => {
    const frame = document.querySelector("iframe");
    const block = frame?.contentDocument?.querySelector(".overtrue-block");
    return (
      block &&
      frame.contentWindow
        .getComputedStyle(block)
        .getPropertyValue("--primary")
        .trim() === expected
    );
  }, parentPrimary);
  await page
    .getByRole("button", { name: "Customize theme", exact: true })
    .click();
  await selectRadio(popover, "Rose");
  await page.waitForFunction(() => {
    const block = document
      .querySelector("iframe")
      ?.contentDocument?.querySelector(".overtrue-block");
    return (
      block &&
      getComputedStyle(block).getPropertyValue("--primary").trim() ===
        getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim()
    );
  });
  await page.keyboard.press("Escape");
  await page.goto(origin + "/components/trace-waterfall");
  await page.getByRole("button", { name: "Full screen", exact: true }).click();
  const stage = page.getByRole("dialog");
  await stage.locator("iframe").waitFor();
  const staged = page.frameLocator(".stage iframe");
  await staged.locator('[data-slot="trace-waterfall"]').waitFor();
  assert.equal(
    await staged.locator("html").getAttribute("data-contrast"),
    "high",
  );
  await stage.getByRole("button", { name: "Preview in light theme" }).click();
  assert.equal(await staged.locator("html.dark").count(), 0);
  assert.equal(await page.locator("html.dark").count(), 1);
  await page.keyboard.press("Escape");
  console.log("Completed theme check", checks.length + 1);
  checks.push(
    "Card iframe updates live with the gallery; full-screen preview retains contrast and an independent scheme.",
  );
  await page.goto(origin + "/blocks/alerts-basic-1");
  const alertFrame = page.frameLocator(".card-block-page iframe");
  await alertFrame.locator(".pn-alert-warning").waitFor();
  const alertColors = await alertFrame.locator(".overtrue-block").evaluate((block) => ({
    text: getComputedStyle(block.querySelector(".pn-card")).color,
    alerts: [...block.querySelectorAll(".pn-alert")].map((alert) => getComputedStyle(alert).color),
  }));
  assert.ok(alertColors.alerts.length === 4 && alertColors.alerts.every((color) => color === alertColors.text));
  checks.push("Installed card previews retain the workspace typography and readable alert text.");
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const dark of [false, true]) {
      const scheme = dark ? "dark" : "light";
      await page.evaluate(
        (value) => localStorage.setItem("overtrue-site-theme", value),
        scheme,
      );
      for (const route of [
        "/",
        "/components",
        "/components/trace-waterfall",
        "/blocks",
        "/docs/design",
        "/examples",
        "/workspace/",
        "/workspace/#/settings",
      ]) {
        await page.goto(origin + route);
        await page.locator("h1").first().waitFor();
        await contrastState("high");
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(
          () =>
            ![...document.querySelectorAll("[role=status]")].some((el) =>
              el.textContent.includes("Loading example"),
            ),
        );
        await noOverflow(`${route} ${width} ${scheme}`);
        assert.equal(await page.locator("html.dark").count(), Number(dark));
        assert.ok(!(await page.title()).startsWith("Page not found"));
        if (width === 1440 || route === "/" || route === "/workspace/")
          await page.screenshot({
            path: `${output}/${route.replaceAll("/", "-")}-${width}-${scheme}.png`,
            animations: "disabled",
          });
      }
    }
  }
  console.log("Completed theme check", checks.length + 1);
  checks.push(
    "Eight page families fit 1440, 390 and 320px in both high-contrast schemes (48 checks).",
  );
  await page.goto(origin + "/");
  await page.getByRole("button", { name: "Customize theme" }).click();
  await popover.waitFor();
  const bounds = await popover.boundingBox();
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 320);
  await selectRadio(popover, "Standard");
  await contrastState("standard");
  await popover.screenshot({ path: `${output}/mobile-customizer.png` });
  await page.emulateMedia({ forcedColors: "active" });
  await popover.getByRole("radio", { name: "High", exact: true }).focus();
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.activeElement).forcedColorAdjust,
    ),
    "auto",
  );
  await page.keyboard.press("Escape");
  console.log("Completed theme check", checks.length + 1);
  checks.push(
    "The 320px theme popover is reachable, fits the viewport, and respects forced colors.",
  );
  assert.deepEqual(errors, []);
  writeFileSync(
    `${output}/verification.json`,
    JSON.stringify({ checks, errors, exportParity }, null, 2),
  );
  console.log(JSON.stringify({ checks, errors }, null, 2));
} catch (error) {
  await page.screenshot({ path: `${output}/failure.png` });
  console.error("Failed at", page.url());
  throw error;
} finally {
  await browser.close();
}
