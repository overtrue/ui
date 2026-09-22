import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";

const exec = promisify(execFile);
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4178";
const cli = (...args) => exec("npx", ["--yes", "--package", "@playwright/cli", "playwright-cli", "--session", "polish-regressions", ...args], { maxBuffer: 8 * 1024 * 1024 });
await cli("open", origin);
try {
  const { stdout } = await cli("run-code", `async page => {
    const passed = [];
    const check = (yes, label) => { if (!yes) throw Error(label); passed.push(label); };
    const go = async route => { await page.goto(${JSON.stringify(origin)} + '/workspace/#/' + route); await page.locator('[data-workspace-page="' + route + '"]').waitFor(); };
    await page.setViewportSize({ width: 1440, height: 1000 });
    await go('charts-advanced');
    const firstChart = page.locator('[data-workspace-chart]').first();
    check(await firstChart.locator('.recharts-bar-rectangle').count() === 12, 'revenue renders twelve visible columns');
    check(await firstChart.locator('.recharts-yAxis').count() === 2, 'revenue and project axes are separate');
    check(await page.locator('.recharts-reference-line').count() === 3, 'SLA and campaign reference lines render');
    const main = page.getByRole('img', { name: 'Sessions over 90 days, zoomed to the selected range' });
    const traveller = page.locator('.recharts-brush-traveller').last();
    await traveller.scrollIntoViewIfNeeded();
    const before = await main.locator('.recharts-xAxis').textContent();
    const box = await traveller.boundingBox();
    await page.mouse.move(box.x + 4, box.y + 12); await page.mouse.down();
    await page.mouse.move(box.x - 90, box.y + 12, { steps: 12 }); await page.mouse.up();
    check((await main.locator('.recharts-xAxis').textContent()) !== before, 'dragging the brush changes the main date range');
    const synced = page.locator('[data-workspace-chart]').nth(5);
    await synced.scrollIntoViewIfNeeded();
    const plot = await synced.boundingBox();
    await page.mouse.move(plot.x + plot.width / 2, plot.y + plot.height / 2);
    await page.waitForFunction(() => [...document.querySelectorAll('.recharts-tooltip-wrapper')].filter(el => getComputedStyle(el).visibility === 'visible').length === 3, null, { timeout: 10000 });
    passed.push('three charts synchronize their tooltip date');

    await go('charts');
    const labels = page.getByRole('img', { name: 'Data labels', exact: true }).locator('.recharts-label-list text');
    check((await labels.allTextContents()).join(',') === '41,45,39,45,39,19,19', 'data labels show every plotted value');
    const stepPath = await page.getByRole('img', { name: 'Stepped line', exact: true }).locator('.recharts-line-curve').getAttribute('d');
    check(!stepPath.includes('C') && (stepPath.match(/L/g) ?? []).length === 12, 'stepped line uses horizontal and vertical segments');
    await go('high-order');
    check(await page.locator('.recharts-pie-sector').count() > 0, 'composition pie renders immediately');

    await page.setViewportSize({ width: 390, height: 844 });
    await go('colorpicker');
    await page.locator('.clr-field').first().waitFor();
    check(await page.locator('.clr-field').first().evaluate(el => {
      const input = el.querySelector('input'), swatch = el.querySelector('button');
      return input.getBoundingClientRect().left + parseFloat(getComputedStyle(input).paddingLeft) >= swatch.getBoundingClientRect().right + 4;
    }), 'color swatch does not cover the HEX value');
    await page.getByLabel('Blue color value').fill('#ff8800');
    check((await page.locator('.showcase-color-sample').evaluate(el => getComputedStyle(el).backgroundColor)) === 'rgb(255, 136, 0)', 'color input updates its preview');

    await go('fullcalendar');
    const agenda = page.getByRole('region', { name: 'Events this month' });
    check(await agenda.getByRole('button').count() === 7, 'mobile calendar shows complete event titles');
    await agenda.getByRole('button', { name: '2 Sept Studio planning' }).click();
    check(await page.getByLabel('Event title', { exact: true }).inputValue() === 'Studio planning', 'agenda opens the corresponding event');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('button', { name: 'Next month' }).click();
    check(await agenda.getByText('No events planned this month.').isVisible(), 'calendar agenda follows the displayed month');

    await go('pricing-table');
    const table = page.locator('.scene-table-wrap');
    const firstCell = table.locator('tbody tr').first().locator('th,td').first();
    check((await firstCell.boundingBox()).width <= 160, 'mobile comparison leaves room for a complete plan column');
    const initialX = (await firstCell.boundingBox()).x;
    await table.evaluate(el => { el.scrollLeft = 260; });
    check(Math.abs((await firstCell.boundingBox()).x - initialX) < 2, 'comparison row labels remain visible while scrolling');

    await page.goto(${JSON.stringify(origin)} + '/components/stat-card');
    await page.getByLabel('Browse components', { exact: true }).selectOption('metric-chart');
    check(page.url().endsWith('/components/metric-chart'), 'mobile component picker navigates');
    await page.goto(${JSON.stringify(origin)} + '/docs');
    await page.getByText('On this page', { exact: true }).click();
    await page.getByRole('navigation', { name: 'Documentation sections' }).getByRole('link', { name: 'Theming', exact: true }).click();
    check(page.url().endsWith('#theming'), 'mobile documentation table of contents');
    return passed;
  }`);
  const result = stdout.match(/### Result\n([\s\S]*?)\n### Ran/);
  if (!result) throw new Error(stdout);
  const passed = JSON.parse(result[1]);
  await fs.mkdir("output/playwright/polish", { recursive: true });
  await fs.writeFile("output/playwright/polish/interactions.json", JSON.stringify(passed, null, 2));
  console.log(JSON.stringify({ passed: passed.length, checks: passed }, null, 2));
} finally {
  await cli("close");
}
