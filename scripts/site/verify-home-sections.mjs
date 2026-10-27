import assert from "node:assert/strict";
import { catalog } from "../../src/site/catalog.ts";

export async function verifyHomeSections(page, origin, output) {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  const directory = page.locator(".library-directory");
  await directory.locator("summary").click();
  const links = await directory
    .locator("a")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  assert.equal(links.length, catalog.length);
  assert.equal(new Set(links).size, links.length);
  await directory.locator("summary").click();

  const features = page.locator(".lab-grid");
  assert.equal(await features.locator(".lab-panel").count(), 14);
  const geo = features.locator('[data-slot="geo-map"]');
  const pointId = await geo
    .locator('[data-slot="geo-map-marker"]')
    .first()
    .getAttribute("data-id");
  const marker = geo.locator(
    `[data-slot="geo-map-marker"][data-id="${pointId}"]`,
  );
  await marker.focus();
  await marker.press("Enter");
  assert.equal(await marker.getAttribute("aria-pressed"), "true");
  const trace = features.locator('[data-slot="trace-waterfall"]');
  const rowCount = await trace.getByRole("treeitem").count();
  await trace.getByTitle("Collapse all", { exact: true }).click();
  assert.ok((await trace.getByRole("treeitem").count()) < rowCount);
  await trace.getByTitle("Expand all", { exact: true }).click();
  await trace.getByRole("treeitem").first().click();
  await trace.locator('[data-slot="trace-detail"]').waitFor();

  const flame = features.locator('[data-slot="flame-graph"]');
  await flame.getByRole("searchbox", { name: "Search frames" }).fill("JSON");
  assert.match(
    await flame.locator('[data-slot="flame-graph-matches"]').textContent(),
    /[1-9]/,
  );
  await flame.getByRole("button", { name: "Clear search" }).click();
  await flame.getByRole("button", { name: /^handleRequest,/ }).click();
  assert.ok(await flame.locator('[data-slot="flame-graph-reset"]').isEnabled());
  await flame.locator('[data-slot="flame-graph-reset"]').click();
  const gantt = features.locator('[data-slot="gantt-chart"]');
  const day = gantt
    .getByRole("group", { name: "Zoom", exact: true })
    .getByRole("button", { name: "Day", exact: true });
  await day.click();
  assert.equal(await day.getAttribute("aria-pressed"), "true");
  await gantt.getByRole("button", { name: "Scroll to today" }).click();
  const pipeline = features.locator('[data-slot="deploy-pipeline"]');
  await pipeline.locator('[data-slot="pipeline-job-trigger"]').first().click();
  await pipeline.locator('[data-slot="pipeline-detail"]').waitFor();

  const monitor = page.locator(".hero-console");
  await monitor.getByRole("button", { name: "Pause", exact: true }).click();
  await monitor.getByRole("button", { name: "Resume", exact: true }).waitFor();
  await monitor.getByRole("button", { name: "Inspect", exact: true }).click();
  assert.ok((await monitor.locator(".inspect-box").count()) > 3);
  assert.ok(
    await monitor
      .locator(".hero-console-content")
      .evaluate((node) => node.inert),
  );
  await page.keyboard.press("Escape");
  assert.equal(await monitor.locator(".inspect-box").count(), 0);
  await monitor.getByRole("button", { name: "Resume", exact: true }).click();

  const theme = page.locator(".theme-lab");
  const oldColor = await page
    .locator(".lab-intro .lab-primary-button")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  await theme.getByRole("button", { name: "Rose", exact: true }).click();
  assert.notEqual(
    await page
      .locator(".lab-intro .lab-primary-button")
      .evaluate((node) => getComputedStyle(node).backgroundColor),
    oldColor,
  );
  await theme.getByRole("button", { name: "Sharp", exact: true }).click();
  assert.equal(
    await page
      .locator(".theme-revenue .card")
      .first()
      .evaluate((node) => getComputedStyle(node).borderTopLeftRadius),
    "2px",
  );
  await theme
    .getByRole("textbox", { name: "Workspace name" })
    .fill("Nova studio");
  await theme.getByRole("button", { name: "Rename", exact: true }).click();
  assert.equal(
    await theme.locator(".theme-app-brand strong").textContent(),
    "Nova studio",
  );
  await theme.getByRole("checkbox", { name: "Choose a corner radius" }).click();
  await theme.getByRole("checkbox", { name: "Name the workspace" }).click();
  await theme.getByText("3 of 3 done", { exact: true }).waitFor();
  await theme.getByRole("button", { name: "Copy theme CSS" }).click();
  const css = await page.evaluate(() => navigator.clipboard.readText());
  assert.match(css, /--primary:/);
  assert.match(css, /--radius: 0\.125rem/);
  await theme.getByRole("button", { name: "Round", exact: true }).click();

  const switcher = page.getByRole("group", {
    name: "Featured blocks",
    exact: true,
  });
  for (const [name, slot] of [
    ["AI gateway", "model-usage"],
    ["Service explorer", "service-explorer"],
    ["Revenue", "revenue-overview"],
    ["Analytics overview", "analytics-overview"],
    ["Service status", "service-status"],
    ["Project portfolio", "project-portfolio"],
  ]) {
    await switcher.getByRole("button", { name, exact: true }).click();
    const preview = page.getByRole("region", {
      name: `${name} preview`,
      exact: true,
    });
    await preview.locator(`[data-slot="${slot}"]`).waitFor();
    assert.ok((await preview.innerText()).length > 100);
  }
  await page.getByRole("button", { name: "Copy install command" }).click();
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    `npx shadcn@latest add ${origin}/r/number-ticker.json`,
  );
  for (const name of [
    "geo-map",
    "trace-waterfall",
    "flame-graph",
    "gantt-chart",
    "number-ticker",
    "model-usage",
  ]) {
    const response = await page.request.get(`${origin}/r/${name}.json`);
    assert.ok(response.ok());
    const item = await response.json();
    assert.equal(item.name, name);
    assert.ok(item.files.some((file) => file.content.includes("export")));
  }
  const questions = page.locator(".questions-list details");
  assert.equal(await questions.count(), 5);
  for (const question of await questions.all()) {
    await question.locator("summary").click();
    assert.ok(await question.locator(".question-answer").isVisible());
  }

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  for (const [name, selector] of [
    ["advanced", ".lab-grid"],
    ["theme", ".theme-lab"],
    ["blocks", ".assembled-section"],
  ]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `${output}/expanded-${name}-dark.png`,
      animations: "disabled",
    });
  }
  await page.getByRole("button", { name: "Switch to light theme" }).click();
}
