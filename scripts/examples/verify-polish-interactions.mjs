import { browserCli } from "../browser/cli.mjs";
import fs from "node:fs/promises";

const origin = process.env.SITE_URL ?? "http://127.0.0.1:4178";
const cli = browserCli("polish-regressions");
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
    await page.setViewportSize({ width: 320, height: 568 });
    await page.getByLabel('Blue color value').click();
    const picker = page.locator('#clr-picker.clr-open');
    await picker.waitFor();
    check(await picker.evaluate(el => {
      const rect = el.getBoundingClientRect();
      const card = document.querySelector('.scene-card');
      return rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight &&
        getComputedStyle(el).backgroundColor === getComputedStyle(card).backgroundColor;
    }), 'color popup fits mobile and matches the card surface');
    check(await picker.locator('.clr-swatches button').first().evaluate(el => el.getBoundingClientRect().height >= 28), 'color swatches have comfortable targets');
    await picker.locator('.clr-swatches button').last().click();
    check((await page.locator('.showcase-color-sample').evaluate(el => getComputedStyle(el).backgroundColor)) === 'rgb(23, 162, 184)', 'popup swatch updates the live preview');
    await picker.getByRole('button', { name: 'Close color picker', exact: true }).click();
    await picker.waitFor({ state: 'hidden' });
    check(await page.getByLabel('Blue color value').evaluate(el => el === document.activeElement), 'closing the color popup restores input focus');
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto(${JSON.stringify(origin)} + '/card-preview.html?id=colorpicker-workspace-palette-1&theme=dark');
    const installedColor = page.getByLabel('Blue color value', { exact: true });
    await page.locator('.clr-field').first().waitFor();
    check(await installedColor.evaluate(el => {
      const swatch = el.parentElement.querySelector('button');
      return parseFloat(getComputedStyle(el).borderTopWidth) >= 1 &&
        el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft) >= swatch.getBoundingClientRect().right + 4;
    }), 'installed color field retains its border and swatch spacing');
    await installedColor.click();
    const installedPicker = page.locator('#clr-picker.clr-open');
    await installedPicker.waitFor();
    check(await installedPicker.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return rect.width >= 260 && rect.top >= 0 && rect.bottom <= innerHeight &&
        getComputedStyle(el).backgroundColor === getComputedStyle(document.querySelector('.scene-card')).backgroundColor;
    }), 'installed popup keeps scoped styling and document positioning');
    await installedPicker.getByRole('button', { name: 'Close color picker', exact: true }).click();
    check(await installedColor.evaluate(el => el === document.activeElement), 'installed popup returns focus to its input');

    await page.setViewportSize({ width: 840, height: 844 });
    for (const theme of ['light', 'dark']) {
      await page.goto(${JSON.stringify(origin)} + '/card-preview.html?id=overview-overview-1-1&theme=' + theme);
      const metrics = page.locator('[data-slot="metric-group"]');
      await metrics.waitFor();
      check(await metrics.evaluate(el => {
        const probe = document.createElement('span');
        el.append(probe);
        const color = token => { probe.style.color = 'var(' + token + ')'; return getComputedStyle(probe).color; };
        const surface = getComputedStyle(el.firstElementChild);
        const group = getComputedStyle(el);
        const valid = surface.backgroundColor === color('--card') &&
          group.borderTopColor === color('--border') && group.color === color('--card-foreground');
        probe.remove();
        return valid;
      }), 'exported metric colors match their ' + theme + ' theme tokens');
      check(await metrics.evaluate(el => new Set([...el.children].map(child => child.offsetTop)).size === 1),
        'exported metric overview keeps all four columns in ' + theme + ' mode');
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(${JSON.stringify(origin)} + '/blocks');
    const thumbnail = page.locator('.tile-service-status .fit-preview');
    await thumbnail.scrollIntoViewIfNeeded();
    check(await thumbnail.evaluate(el => el.getBoundingClientRect().height <= 300),
      'mobile block thumbnails avoid desktop-sized empty space');

    await go('form-elements');
    await page.getByRole('button', { name: 'Dates & files', exact: true }).click();
    const datepicker = page.locator('.workspace-datepicker');
    await datepicker.getByRole('button', { name: 'Next month', exact: true }).click();
    check(await datepicker.getByRole('gridcell', { selected: true }).count() === 0, 'browsing a month does not change the selected date');
    check((await datepicker.getByRole('status').innerText()).includes('Sep 20, 2026'), 'date selection includes the month and year');
    await datepicker.getByRole('button', { name: 'Previous month', exact: true }).click();
    check((await datepicker.getByRole('gridcell', { selected: true }).innerText()) === '20', 'returning to the selected month restores its highlight');
    check(await datepicker.locator('tbody button[tabindex="0"]').count() === 1, 'calendar has one date in the tab order');
    await datepicker.getByRole('button', { name: 'Wednesday, September 30, 2026', exact: true }).focus();
    await page.keyboard.press('ArrowRight');
    check(await page.evaluate(() => document.activeElement.getAttribute('aria-label')) === 'Thursday, October 1, 2026', 'calendar arrows cross month boundaries');
    await page.keyboard.press('Enter');
    check((await datepicker.getByRole('status').innerText()).includes('Oct 1, 2026'), 'keyboard selection updates the date feedback');
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');
    await page.keyboard.press('PageDown');
    await datepicker.getByRole('button', { name: 'Sunday, January 31, 2027', exact: true }).focus();
    await page.keyboard.press('PageDown');
    check(await page.evaluate(() => document.activeElement.getAttribute('aria-label')) === 'Sunday, February 28, 2027', 'short months clamp keyboard focus to the last day');
    await page.keyboard.press('Shift+PageDown');
    await page.keyboard.press('ArrowRight');
    check(await page.evaluate(() => document.activeElement.getAttribute('aria-label')) === 'Tuesday, February 29, 2028', 'leap day is reachable by keyboard');
    await page.setViewportSize({ width: 320, height: 568 });
    check(await datepicker.evaluate(el => el.scrollWidth <= el.clientWidth && el.getBoundingClientRect().right <= innerWidth), 'inline datepicker fits a narrow form');
    await page.setViewportSize({ width: 390, height: 844 });

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
    const mobileDocs = page.locator('.docs-mobile-contents');
    await mobileDocs.locator('summary').click();
    check(await mobileDocs.getByText('Getting started', { exact: true }).isVisible() && await mobileDocs.getByText('Handbook', { exact: true }).isVisible(), 'mobile documentation retains both navigation groups');
    await mobileDocs.getByRole('navigation', { name: 'Documentation', exact: true }).getByRole('link', { name: 'Theming', exact: true }).click();
    await page.waitForURL('**/docs#theming');
    check(page.url().endsWith('#theming'), 'mobile documentation table of contents');
    await page.locator('.docs-mobile-contents:not([open])').waitFor();
    passed.push('mobile documentation closes after navigation');
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
