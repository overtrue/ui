import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
  colorScheme: "light",
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const result = [];
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4175";
mkdirSync("output/playwright/workspace", { recursive: true });
const goto = async (path) => {
  await page.goto(origin + "/workspace/#" + path);
  await page
    .locator(
      '[data-workspace-page="' +
        (path.split("?")[0].slice(1) || "index") +
        '"]',
    )
    .waitFor();
};
const check = (name) => {
  result.push(name);
  console.log("PASS", name);
};
try {
  await goto("/wizard");
  await page
    .getByLabel("Project name", { exact: true })
    .fill("Harbor research");
  await page
    .getByLabel("What does success look like?")
    .fill("Understand the first visit.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await page.getByRole("link", { name: "Open project", exact: true }).click();
  await page.locator('[data-workspace-page="datagrid"]').waitFor();
  await page
    .getByRole("heading", { name: "Harbor research", exact: true, level: 1 })
    .waitFor();
  assert.ok(
    await page
      .getByText("Understand the first visit.", { exact: true })
      .isVisible(),
  );
  check("Project creation opens the created record with its brief");
  await goto("/form-layout");
  await page.getByLabel("Client name *", { exact: true }).fill("Harbor museum");
  await page.getByLabel("Contact name *", { exact: true }).fill("Alex Example");
  await page
    .getByLabel("Contact email *", { exact: true })
    .fill("hello@harbor.example");
  await page.getByRole("button", { name: "Save client", exact: true }).click();
  await page
    .getByRole("link", { name: "View client directory", exact: true })
    .click();
  await page.getByText("Harbor museum", { exact: true }).waitFor();
  check("Client form creates a directory record");
  await goto("/tasks-list");
  await page
    .getByLabel("Status of WK-182", { exact: true })
    .selectOption("Complete");
  await page
    .locator(".scene-page-tabs")
    .getByRole("link", { name: "Board", exact: true })
    .click();
  await page.locator('[data-slot="kanban-board"]').waitFor();
  assert.ok(await page.getByText("2 completed", { exact: false }).isVisible());
  check("Task status survives switching from list to board");
  await goto("/form-elements");
  assert.equal(
    await page
      .locator(".scene-product-grid")
      .evaluate((el) => getComputedStyle(el).display),
    "grid",
  );
  const bounds = await page
    .locator(".scene-product-grid")
    .evaluate((el) =>
      [...el.children].map((child) => ({
        x: child.getBoundingClientRect().x,
        w: child.getBoundingClientRect().width,
      })),
    );
  assert.ok(
    bounds[0].x < bounds[1].x && bounds[0].w > bounds[1].w,
    JSON.stringify(bounds),
  );
  await page
    .getByLabel("Request title *", { exact: true })
    .fill("Prototype materials");
  await page
    .getByLabel("Business reason *", { exact: true })
    .fill("Build a physical wayfinding prototype.");
  await page
    .getByLabel("I confirm this request is within the project scope.")
    .check();
  await page
    .getByRole("button", { name: "Prepare request", exact: true })
    .click();
  assert.ok(
    await page
      .getByText(
        "“Prototype materials” is ready for 1 reviewers in this preview.",
        { exact: true },
      )
      .isVisible(),
  );
  check("Purchase request layout and valid local submission");
  await goto("/settings");
  await page.getByLabel("Workspace name *", { exact: true }).fill("Draft name");
  await page.getByRole("button", { name: "Discard", exact: true }).click();
  assert.equal(
    await page.getByLabel("Workspace name *", { exact: true }).inputValue(),
    "Acme Studio",
  );
  await page
    .getByLabel("Contact email *", { exact: true })
    .fill("team@acme.example");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  assert.ok(
    await page
      .getByText("Your changes have been saved in this preview.", {
        exact: true,
      })
      .isVisible(),
  );
  await page.getByRole("button", { name: "Access", exact: true }).click();
  const role = page.locator('[data-slot="section-card"] select').first();
  if (await role.count()) await role.selectOption("Member");
  else await page.getByLabel(/Role for Leo/).selectOption("Member");
  assert.ok(
    await page.getByText("changed access for", { exact: false }).isVisible(),
  );
  check("Settings discard/save and permission audit");
  await goto("/modals");
  const invite = page.getByRole("button", {
    name: "Invite collaborator",
    exact: true,
  });
  await invite.click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  await invite.and(page.locator(":focus")).waitFor();
  assert.ok(await invite.evaluate((el) => document.activeElement === el));
  await invite.click();
  await page
    .getByRole("dialog")
    .getByLabel("Email address")
    .fill("reviewer@example.com");
  await page
    .getByRole("button", { name: "Prepare invitation", exact: true })
    .click();
  assert.ok(
    await page
      .getByText(
        "Invitation prepared for reviewer@example.com. No email was sent.",
        { exact: true },
      )
      .isVisible(),
  );
  check("Dialog Escape restores focus; invitation form updates state");
  await goto("/gallery");
  await page.getByRole("button", { name: "List", exact: true }).click();
  await page
    .getByRole("checkbox", { name: "Select all files", exact: true })
    .check();
  assert.equal(
    await page.locator('[data-slot="file-browser-item"] input:checked').count(),
    12,
  );
  await page
    .getByRole("button", { name: "Culture venue", exact: true })
    .click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  check("File list selection and image preview");
  await page.setViewportSize({ width: 390, height: 844 });
  await goto("/email-inbox");
  const first = page.locator(".scene-thread-list > button").first();
  assert.ok(await first.isVisible());
  const padding = await page
    .getByRole("searchbox")
    .evaluate((el) => parseFloat(getComputedStyle(el).paddingInlineStart));
  assert.ok(padding >= 32, String(padding));
  await first.click();
  await page
    .getByLabel("Reply to Ines Duarte", { exact: true })
    .fill("Reviewing the arrival sequence.");
  await page
    .getByRole("button", { name: "Back to conversations", exact: true })
    .click();
  assert.ok(await first.evaluate((el) => document.activeElement === el));
  await page.locator(".scene-thread-list > button").nth(1).click();
  assert.equal(
    await page
      .getByLabel("Reply to Leo Nakamura", { exact: true })
      .inputValue(),
    "",
  );
  await page
    .getByRole("button", { name: "Back to conversations", exact: true })
    .click();
  await first.click();
  assert.equal(
    await page.getByLabel("Reply to Ines Duarte", { exact: true }).inputValue(),
    "Reviewing the arrival sequence.",
  );
  await page.getByRole("button", { name: "Archive", exact: true }).click();
  await page.getByRole("button", { name: "Archived", exact: true }).click();
  await page.locator(".scene-thread-list > button").first().click();
  await page.getByRole("button", { name: "Restore", exact: true }).click();
  assert.ok(
    await page
      .getByText("You're all caught up in this view.", { exact: true })
      .isVisible(),
  );
  check("Mobile split view focus, per-thread drafts, archive and restore");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await goto("/");
  assert.equal(
    await page
      .getByRole("link", { name: "Documentation", exact: true })
      .first()
      .getAttribute("href"),
    "/docs",
  );
  await page.getByRole("button", { name: "Quarterly", exact: true }).click();
  assert.ok(
    (
      await page
        .getByRole("img", {
          name: /Quarterly booked and planned revenue for 2026/,
        })
        .getAttribute("aria-label")
    ).includes("Q3 $16600"),
  );
  assert.ok(
    (await page.locator(".scene-chart-summary").innerText()).includes(
      "$61,700",
    ),
  );
  await page.getByRole("button", { name: "Monthly", exact: true }).click();
  assert.ok(
    (
      await page
        .getByRole("img", {
          name: /Monthly booked and planned revenue for 2026/,
        })
        .getAttribute("aria-label")
    ).includes("Dec $7400"),
  );
  check("Revenue period controls retain all twelve months and four quarters");
  const approval = page.locator('[data-slot="approval-queue"]');
  await approval
    .getByRole("button", { name: /^Approve / })
    .first()
    .click();
  assert.ok(await approval.getByText("Approved", { exact: true }).isVisible());
  await page.evaluate(() => {
    location.hash = "/alerts";
  });
  await page.locator('[data-workspace-page="alerts"]').waitFor();
  assert.ok(
    await page
      .locator('[data-slot="approval-queue"]')
      .getByText("Approved", { exact: true })
      .isVisible(),
  );
  check("Approval decisions persist across workspace views");

  await goto("/tasks");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await page
    .getByLabel("Task title", { exact: true })
    .fill("Review accessibility");
  await page.getByRole("button", { name: "Create task", exact: true }).click();
  const card = page
    .locator('[data-slot="kanban-card"]')
    .filter({ hasText: "Review accessibility" });
  await card.waitFor();
  await card.press("Space");
  await card.press("ArrowRight");
  await card.press("Space");
  await page
    .locator(".scene-page-tabs")
    .getByRole("link", { name: "List", exact: true })
    .click();
  const task = page
    .locator("tbody tr")
    .filter({ hasText: "Review accessibility" });
  assert.equal(await task.getByRole("combobox").inputValue(), "In progress");
  await page.getByPlaceholder("Search tasks…").fill("does-not-exist");
  await page.getByText("No tasks match this view", { exact: true }).waitFor();
  check("Create a task, move it by keyboard, and verify shared list state");
  await goto("/sortable");
  const firstPriority = await page
    .locator(".scene-priority")
    .first()
    .innerText();
  await page
    .getByRole("button", { name: "Move down", exact: true })
    .first()
    .click();
  assert.notEqual(
    await page.locator(".scene-priority").first().innerText(),
    firstPriority,
  );
  check("Reorder task priorities");
  await goto("/users");
  await page.getByRole("searchbox").fill("Research");
  assert.equal(await page.locator("tbody tr").count(), 1);
  await page.locator("tbody tr").getByRole("link").first().click();
  await page
    .getByRole("heading", { name: "Ines Duarte", exact: true, level: 1 })
    .waitFor();
  check("Find a teammate and open the matching profile");
  await goto("/chat");
  await page.locator(".scene-channel-list > button").first().click();
  await page
    .getByLabel("Message #studio-general", { exact: true })
    .fill("The review notes are ready.");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await page
    .getByText("The review notes are ready.", { exact: true })
    .waitFor();
  await page.locator(".scene-channel-list > button").nth(1).click();
  assert.equal(
    await page
      .getByText("The review notes are ready.", { exact: true })
      .count(),
    0,
  );
  check("Chat messages remain in their project channel");
  await goto("/datatables");
  await page.getByPlaceholder("Search projects or clients…").fill("Ceramics");
  assert.equal(await page.locator("tbody tr").count(), 1);
  await page.getByPlaceholder("Search projects or clients…").fill("");
  const budgets = await page.locator("tbody td.scene-number").allTextContents();
  assert.deepEqual(
    budgets.map((s) => Number(s.replace(/[^0-9.]/g, ""))),
    budgets.map((s) => Number(s.replace(/[^0-9.]/g, ""))).sort((a, b) => a - b),
    "budgets initially sort ascending",
  );
  await page.getByRole("button", { name: "Budget ↑", exact: true }).click();
  assert.equal(
    await page.locator("th[aria-sort]").getAttribute("aria-sort"),
    "descending",
  );
  await page.getByRole("button", { name: "Budget ↓", exact: true }).click();
  assert.equal(
    await page.locator("th[aria-sort]").getAttribute("aria-sort"),
    "ascending",
  );
  const exportWait = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export", exact: true }).click();
  assert.ok((await exportWait).suggestedFilename().endsWith(".csv"));
  check("Project register filtering, budget order, and CSV download");
  await goto("/pay");
  await page.getByRole("button", { name: "Overdue", exact: true }).click();
  assert.equal(await page.locator("tbody tr").count(), 1);
  await page.getByRole("link", { name: "INV-26-187", exact: true }).click();
  await page
    .getByRole("heading", { name: "INV-26-187", exact: true })
    .waitFor();
  check("Filtered invoices open the selected record");
  await goto("/sign-in");
  await page.getByLabel("Email address").fill("qa@acme.example");
  await page.getByLabel("Password", { exact: true }).fill("example-only");
  await page
    .getByRole("button", { name: "Continue to workspace", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Demo complete", exact: true })
    .waitFor();
  check("Demo sign-in validates and completes locally");
  await goto("/high-order");
  await page.evaluate(() => {
    localStorage.setItem(
      "overtrue-workspace-theme-v3",
      JSON.stringify({ accent: null, font: "invalid", radius: -100 }),
    );
  });
  await page.reload();
  await page.locator('[data-workspace-page="high-order"]').waitFor();
  assert.ok(await page.locator('[data-slot="task-checklist"]').isVisible());
  check("Invalid stored appearance recovers without a blank screen");
  await page
    .getByRole("button", { name: "Use dark theme", exact: true })
    .click();
  await page
    .locator('.overtrue-workspace[data-bs-theme="dark"]')
    .first()
    .waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await goto("/tasks");
  const sidebar = page.getByRole("dialog", { name: "Sidebar", exact: true });
  assert.ok(!(await sidebar.isVisible()));
  const toggle = page.getByRole("button", {
    name: "Toggle sidebar",
    exact: true,
  });
  await toggle.click();
  await sidebar.waitFor();
  await page.keyboard.press("Escape");
  await sidebar.waitFor({ state: "hidden" });
  await toggle.and(page.locator(":focus")).waitFor();
  check("Dark appearance persists and mobile navigation restores focus");

  assert.deepEqual(errors, []);
  writeFileSync(
    "output/playwright/workspace/interactions.json",
    JSON.stringify({ checks: result, errors }, null, 2),
  );
} catch (error) {
  await page.screenshot({
    path: "output/playwright/workspace/flow-failure.png",
    fullPage: true,
  });
  console.error("FAILED AT", page.url(), error);
  throw error;
} finally {
  await browser.close();
}
