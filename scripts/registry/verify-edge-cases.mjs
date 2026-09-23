// Run against the Vite dev server: SITE_URL=http://127.0.0.1:5173 node scripts/registry/verify-edge-cases.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";

// Reuse the browser runtime pinned by the project's existing CLI dependency.
const require = createRequire(import.meta.url);
const { chromium } = createRequire(
  require.resolve("@playwright/cli/package.json"),
)("playwright");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const errors = [];
let checks = 0;

try {
  const page = await browser.newPage({ timezoneId: "America/New_York" });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(origin + "/docs");
  await page.locator(".docs-content").waitFor();
  await page.evaluate(async () => {
    const { default: React } =
      await import("/node_modules/.vite/deps/react.js");
    const {
      default: { createRoot },
    } = await import("/node_modules/.vite/deps/react-dom_client.js");
    const host = document.createElement("div");
    host.id = "regression-fixture";
    host.style =
      "position:fixed;inset:0;z-index:9999;background:white;padding:24px;overflow:auto";
    document.body.append(host);
    const root = createRoot(host);
    window.fixture = {
      React,
      async render(element) {
        root.render(element);
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );
      },
      async mount(name, exportName, props) {
        const module = await import(`/src/registry/overtrue/${name}.tsx`);
        await this.render(React.createElement(module[exportName], props));
      },
    };
  });

  // Both DST boundaries must contain each calendar date exactly once.
  for (const [start, end] of [
    ["2026-03-01", "2026-03-15"],
    ["2026-10-25", "2026-11-08"],
  ]) {
    await page.evaluate(
      async ([start, end]) => {
        await window.fixture.mount("activity-heatmap", "ActivityHeatmap", {
          data: [],
          startDate: new Date(start + "T00:00:00"),
          endDate: new Date(end + "T00:00:00"),
        });
      },
      [start, end],
    );
    const dates = await page
      .locator("#regression-fixture [data-date]")
      .evaluateAll((cells) => cells.map((cell) => cell.dataset.date));
    const expected = Array.from({ length: 15 }, (_, i) =>
      new Date(Date.parse(start + "T00:00:00Z") + i * 86400000)
        .toISOString()
        .slice(0, 10),
    );
    assert.deepEqual(dates, expected);
    checks++;
  }
  await page.evaluate(() =>
    window.fixture.mount("activity-heatmap", "ActivityHeatmap", {
      data: [],
      weeks: 2,
      endDate: new Date(2026, 10, 8),
    }),
  );
  assert.equal(
    await page.locator("#regression-fixture [data-date]").count(),
    14,
  );
  checks++;

  for (const value of [0, 50, 100]) {
    await page.evaluate(
      (value) =>
        window.fixture.mount("radial-gauge", "RadialGauge", {
          value,
          sweep: 360,
        }),
      value,
    );
    const paths = await page
      .locator("#regression-fixture path")
      .evaluateAll((paths) => paths.map((path) => path.getTotalLength()));
    assert.equal(paths.length, value ? 2 : 1);
    if (value) assert.ok(Math.abs(paths[1] / paths[0] - value / 100) < 0.001);
    checks++;
  }

  await page.evaluate(() =>
    window.fixture.mount("command-palette", "CommandPalette", {
      variant: "inline",
      groups: [
        {
          items: [
            {
              id: "first",
              label: "Open",
              keywords: ["alpha"],
              onSelect: () => (window.selectedCommand = "first"),
            },
            {
              id: "second",
              label: "Open",
              keywords: ["beta"],
              onSelect: () => (window.selectedCommand = "second"),
            },
          ],
        },
      ],
    }),
  );
  const input = page.locator("#regression-fixture [cmdk-input]");
  await input.focus();
  await input.press("Home");
  await page.waitForFunction(
    () =>
      document
        .querySelector('#regression-fixture [data-value="first"]')
        ?.getAttribute("aria-selected") === "true",
  );
  await input.press("ArrowDown");
  await page.waitForFunction(
    () =>
      document
        .querySelector('#regression-fixture [data-value="second"]')
        ?.getAttribute("aria-selected") === "true",
  );
  assert.equal(
    await page.locator('#regression-fixture [aria-selected="true"]').count(),
    1,
  );
  await input.press("Enter");
  assert.equal(await page.evaluate(() => window.selectedCommand), "second");
  await input.fill("alpha");
  await page.waitForFunction(
    () =>
      document.querySelectorAll("#regression-fixture [cmdk-item]").length === 1,
  );
  await input.press("Enter");
  assert.equal(await page.evaluate(() => window.selectedCommand), "first");
  checks += 2;

  await page.evaluate(() =>
    window.fixture.mount("segmented-meter", "SegmentedMeter", {
      value: 20,
      zones: [],
    }),
  );
  assert.equal(
    await page.locator("#regression-fixture [role=meter]").count(),
    0,
  );
  assert.match(
    await page.locator("#regression-fixture").innerText(),
    /No ranges available/,
  );
  for (const [value, expected] of [
    [-10, "0"],
    [120, "100"],
    [NaN, "0"],
  ]) {
    await page.evaluate(
      (value) =>
        window.fixture.mount("segmented-meter", "SegmentedMeter", {
          value,
          zones: [
            { from: 0, to: 50 },
            { from: 50, to: 100 },
          ],
        }),
      value,
    );
    assert.equal(
      await page
        .locator("#regression-fixture [role=meter]")
        .getAttribute("aria-valuenow"),
      expected,
    );
    checks++;
  }
  checks++;

  // The example controls must implement the keyboard behavior their radio roles promise.
  for (const kind of ["segmented-control", "stars-rating"]) {
    await page.evaluate(async (kind) => {
      const { React, render } = window.fixture;
      const module = await import(`/src/components/overtrue/${kind}.tsx`);
      function Example() {
        const [value, setValue] = React.useState(
          kind === "stars-rating" ? 1 : "first",
        );
        return kind === "stars-rating"
          ? React.createElement(module.StarsRating, {
              value,
              onChange: setValue,
            })
          : React.createElement(module.SegmentedControl, {
              value,
              onValueChange: setValue,
              options: [
                { value: "first", label: "First" },
                { value: "second", label: "Second" },
              ],
            });
      }
      await render(React.createElement(Example));
    }, kind);
    const radios = page.locator("#regression-fixture [role=radio]");
    await radios.first().focus();
    await radios.first().press("ArrowRight", { delay: 50 });
    await page.waitForFunction(
      () =>
        document
          .querySelectorAll("#regression-fixture [role=radio]")[1]
          ?.getAttribute("aria-checked") === "true",
    );
    assert.equal(await radios.nth(1).getAttribute("tabindex"), "0");
    checks++;
  }
  // Notification drafts survive a rejected save and become clean after retry.
  await page.evaluate(() =>
    window.fixture.mount(
      "notification-preferences",
      "NotificationPreferences",
      {
        onSave: (values) =>
          new Promise((resolve, reject) => {
            window.preferenceSave = { values, resolve, reject };
          }),
      },
    ),
  );
  const fixture = page.locator("#regression-fixture");
  const digest = fixture.getByRole("switch", { name: "Weekly digest" });
  await digest.click();
  await fixture.getByRole("button", { name: "Save preferences" }).click();
  assert.ok(
    await fixture.getByRole("button", { name: "Saving…" }).isDisabled(),
  );
  assert.ok(await digest.isDisabled());
  assert.equal(
    await page.evaluate(() => window.preferenceSave.values.weeklyDigest),
    true,
  );
  await page.evaluate(() =>
    window.preferenceSave.reject(new Error("Unavailable")),
  );
  await fixture.getByRole("alert").waitFor();
  assert.equal(await digest.getAttribute("aria-checked"), "true");
  await fixture.getByRole("button", { name: "Save preferences" }).click();
  await page.evaluate(() => window.preferenceSave.resolve());
  await fixture.getByText("Preferences saved.", { exact: true }).waitFor();
  assert.ok(
    await fixture
      .getByRole("button", { name: "Save preferences" })
      .isDisabled(),
  );
  checks++;

  // Settings saves lock their draft, reject invalid email, and retain edits on failure.
  await page.evaluate(() => {
    window.settingsSaves = [];
    return window.fixture.mount("settings-panel", "SettingsPanel", {
      initialName: "Test workspace",
      initialEmail: "team@example.com",
      onSave: (values) =>
        new Promise((resolve, reject) => {
          window.settingsSaves.push({ values, resolve, reject });
        }),
    });
  });
  const workspaceName = fixture.getByRole("textbox", {
    name: "Workspace name",
  });
  const contactEmail = fixture.getByRole("textbox", { name: "Contact email" });
  const saveSettings = fixture.getByRole("button", { name: "Save changes" });
  assert.ok(await saveSettings.isDisabled());
  await workspaceName.fill("Draft workspace");
  assert.ok(await saveSettings.isEnabled());
  await workspaceName.fill("Test workspace");
  assert.ok(await saveSettings.isDisabled());
  await workspaceName.fill("Draft workspace");
  await contactEmail.fill("invalid-email");
  await saveSettings.click();
  assert.equal(await page.evaluate(() => window.settingsSaves.length), 0);
  await contactEmail.fill("draft@example.com");
  await saveSettings.click();
  assert.ok(await workspaceName.isDisabled());
  assert.ok(await contactEmail.isDisabled());
  assert.ok(
    await fixture.getByRole("button", { name: "Saving…" }).isDisabled(),
  );
  await fixture.locator("form").evaluate((form) => form.requestSubmit());
  assert.equal(await page.evaluate(() => window.settingsSaves.length), 1);
  assert.deepEqual(await page.evaluate(() => window.settingsSaves[0].values), {
    name: "Draft workspace",
    email: "draft@example.com",
  });
  await page.evaluate(() =>
    window.settingsSaves[0].reject(new Error("Unavailable")),
  );
  await fixture.getByRole("alert").waitFor();
  assert.equal(await workspaceName.inputValue(), "Draft workspace");
  assert.equal(await contactEmail.inputValue(), "draft@example.com");
  assert.ok(await workspaceName.isEnabled());
  await saveSettings.click();
  await page.evaluate(() => window.settingsSaves[1].resolve());
  await fixture
    .getByRole("status")
    .filter({ hasText: "Changes saved." })
    .waitFor();
  assert.ok(await saveSettings.isDisabled());
  await workspaceName.fill("Another draft");
  assert.ok(await saveSettings.isEnabled());
  await workspaceName.fill("Draft workspace");
  assert.ok(await saveSettings.isDisabled());
  checks++;

  await page.evaluate(() =>
    window.fixture.mount("team-access", "TeamAccess", { members: [] }),
  );
  assert.ok(await fixture.getByText("No members yet.").isVisible());
  await page.evaluate(() =>
    window.fixture.mount("team-access", "TeamAccess", {
      members: [
        {
          id: "one",
          name: "Test member",
          email: "one@example.com",
          role: "Admin",
        },
      ],
    }),
  );
  assert.equal(await fixture.getByRole("combobox").count(), 0);
  checks++;
  await page.evaluate(() =>
    window.fixture.mount("invoice-list", "InvoiceList", { invoices: [] }),
  );
  assert.ok(
    await fixture.getByText("Your invoices will appear here.").isVisible(),
  );
  await page.evaluate(() =>
    window.fixture.mount("invoice-list", "InvoiceList", {
      invoices: [
        {
          id: "INV-1",
          description: "Studio",
          date: "Sep 1, 2026",
          amount: "€128.00",
          status: "Paid",
          href: "/invoices/receipt.pdf",
        },
      ],
    }),
  );
  assert.equal(
    await fixture
      .getByRole("link", { name: "Download invoice INV-1" })
      .getAttribute("href"),
    "/invoices/receipt.pdf",
  );
  checks++;
  await page.evaluate(() =>
    window.fixture.mount("integration-list", "IntegrationList", {
      integrations: [],
    }),
  );
  assert.ok(
    await fixture.getByText("No integrations available yet.").isVisible(),
  );
  await page.evaluate(() =>
    window.fixture.mount("integration-list", "IntegrationList", {
      integrations: [
        {
          id: "github",
          name: "GitHub",
          description: "Repository activity",
          connected: true,
          account: "example/repo",
        },
      ],
    }),
  );
  assert.equal(await fixture.getByRole("button").count(), 0);
  assert.ok(await fixture.getByText("example/repo").isVisible());
  checks++;

  // A completed callback cannot invent a connection when the controlled data has not changed.
  await page.evaluate(() =>
    window.fixture.mount("integration-list", "IntegrationList", {
      integrations: [
        {
          id: "slack",
          name: "Slack",
          description: "Team updates",
          connected: false,
        },
      ],
      onConnectionChange: async () => {},
    }),
  );
  await fixture
    .getByRole("button", { name: "Connect Slack", exact: true })
    .click();
  await fixture
    .getByRole("button", { name: "Connect Slack", exact: true })
    .waitFor();
  assert.ok(
    await fixture.getByText("Not connected", { exact: true }).isVisible(),
  );
  checks++;

  await page.evaluate(async () => {
    const { IntegrationList } =
      await import("/src/registry/overtrue/integration-list.tsx");
    const { React, render } = window.fixture;
    window.connectionCalls = [];
    function ControlledConnections() {
      const [integrations, setIntegrations] = React.useState([
        {
          id: "github",
          name: "GitHub",
          description: "Repository activity",
          connected: true,
          account: "example/repo",
        },
        {
          id: "slack",
          name: "Slack",
          description: "Team updates",
          connected: false,
        },
      ]);
      return React.createElement(IntegrationList, {
        integrations,
        onConnectionChange: async (id, connected) => {
          window.connectionCalls.push({ id, connected });
          await new Promise((resolve, reject) => {
            window.finishConnection = resolve;
            window.failConnection = reject;
          });
          setIntegrations((current) =>
            current.map((item) =>
              item.id === id ? { ...item, connected } : item,
            ),
          );
        },
      });
    }
    await render(React.createElement(ControlledConnections));
  });
  const disconnect = fixture.getByRole("button", {
    name: "Disconnect GitHub",
    exact: true,
  });
  await disconnect.click();
  assert.ok(await disconnect.isDisabled());
  await disconnect.evaluate((button) => button.click());
  assert.deepEqual(await page.evaluate(() => window.connectionCalls), [
    { id: "github", connected: false },
  ]);
  assert.ok(
    await fixture
      .getByRole("button", { name: "Connect Slack", exact: true })
      .isEnabled(),
  );
  assert.ok(
    await fixture.getByText("1 connected", { exact: true }).isVisible(),
  );
  await page.evaluate(() => window.failConnection(new Error("offline")));
  await fixture.getByRole("alert").waitFor();
  assert.ok(await fixture.getByText("example/repo").isVisible());
  await disconnect.click();
  assert.equal(await fixture.getByRole("alert").count(), 0);
  await page.evaluate(() => window.finishConnection());
  await fixture.getByText("0 connected", { exact: true }).waitFor();
  assert.equal(await fixture.getByText("example/repo").count(), 0);
  assert.ok(
    await fixture
      .getByRole("button", { name: "Connect GitHub", exact: true })
      .isEnabled(),
  );
  checks++;

  await fixture
    .getByRole("button", { name: "Connect Slack", exact: true })
    .click();
  await page.evaluate(() => window.finishConnection());
  await fixture.getByText("1 connected", { exact: true }).waitFor();
  assert.deepEqual(await page.evaluate(() => window.connectionCalls), [
    { id: "github", connected: false },
    { id: "github", connected: false },
    { id: "slack", connected: true },
  ]);
  assert.ok(
    await fixture
      .getByRole("button", { name: "Disconnect Slack", exact: true })
      .isEnabled(),
  );
  checks++;
  await page.goto(origin + "/workspace/#/stars-rating");
  const rating = page.getByRole("radiogroup", { name: "Rating" }).first();
  await rating.waitFor();
  const current = rating.locator('[aria-checked="true"]');
  const nextValue = String(Number(await current.getAttribute("value")) + 1);
  await current.focus();
  await current.press("ArrowRight", { delay: 50 });
  await rating.locator(`[value="${nextValue}"][aria-checked="true"]`).waitFor();
  checks++;
  assert.deepEqual(errors, []);
  console.log(
    `Passed ${checks} component edge cases; no console or runtime errors.`,
  );
} finally {
  await browser.close();
}
