import { browserCli } from "../browser/cli.mjs";
import fs from "node:fs/promises";

const origin = process.env.SITE_URL ?? "http://127.0.0.1:4178";
const cli = browserCli("polish-regressions");
await cli("open", origin);
try {
  const { stdout } = await cli(
    "run-code",
    `async page => {
    const passed = [];
    const check = (yes, label) => { if (!yes) throw Error(label); passed.push(label); };
    const go = async route => { await page.goto(${JSON.stringify(origin)} + '/workspace/#/' + route); await page.locator('[data-workspace-page="' + route + '"]').waitFor(); };
    await page.setViewportSize({ width: 1440, height: 1000 });
    await go('charts-advanced');
    const cell=page.locator('[data-slot="cohort-grid-cell"][data-row="0"][data-col="0"]');
    const label=await cell.getAttribute('aria-label');
    check(label.includes('100% retained'),'new signup cohort starts at one hundred percent');
    await cell.click();
    check((await page.getByRole('status').last().innerText()).includes('retained subscribers of'),'cohort selection explains its denominator');
    await page.getByRole('button',{name:'Subscriber count',exact:true}).click();
    check(!(await cell.innerText()).includes('%'),'cohort switches to subscriber counts');
    await page.getByRole('button',{name:'Retention %',exact:true}).click();
    check((await cell.innerText()).includes('100%'),'cohort restores percentage values');
    await go('ai-usage');
    await page.getByRole('button',{name:'Budget controls',exact:true}).click();
    await page.getByLabel('Budget in USD',{exact:true}).fill('1250');
    await page.getByRole('button',{name:'Save budget',exact:true}).click();
    check((await page.getByRole('progressbar',{name:'Spend this month'}).getAttribute('aria-valuemax'))==='1250','budget warning uses the saved limit');

    await page.setViewportSize({ width: 390, height: 844 });
    await go('colorpicker');
    await page.locator('.clr-field').first().waitFor();
    check(await page.locator('.clr-field').first().evaluate(el => {
      const input = el.querySelector('input'), swatch = el.querySelector('button');
      return input.getBoundingClientRect().left + parseFloat(getComputedStyle(input).paddingLeft) >= swatch.getBoundingClientRect().right + 4;
    }), 'color swatch does not cover the HEX value');
    await page.getByRole('textbox',{name:'Primary accent',exact:true}).fill('#ff8800');
    check((await page.locator('.scene-brand-preview').evaluate(el => getComputedStyle(el).borderTopColor)) === 'rgb(255, 136, 0)', 'color input updates its preview');
    await page.setViewportSize({ width: 320, height: 568 });
    await page.getByRole('textbox',{name:'Primary accent',exact:true}).click();
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
    check((await page.locator('.scene-brand-preview').evaluate(el => getComputedStyle(el).borderTopColor)) === 'rgb(23, 162, 184)', 'popup swatch updates the live preview');
    await picker.getByRole('button', { name: 'Close color picker', exact: true }).click();
    await picker.waitFor({ state: 'hidden' });
    check(await page.getByRole('textbox',{name:'Primary accent',exact:true}).evaluate(el => el === document.activeElement), 'closing the color popup restores input focus');
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto(${JSON.stringify(origin)} + '/card-preview.html?id=colorpicker-portal-colors-1&theme=dark');
    const installedColor = page.getByRole('textbox', { name:'Primary accent',exact: true });
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
        const surfaces = [...el.children].filter(child => child !== probe).slice(1);
        const group = getComputedStyle(el);
        const card = color('--card');
        const valid = surfaces.every(surface => getComputedStyle(surface).backgroundColor === card) &&
          group.borderTopColor === color('--border') && group.color === color('--card-foreground');
        probe.remove();
        return valid;
      }), 'exported metric colors match their ' + theme + ' theme tokens');
      check(await metrics.evaluate(el => {
        const primary = el.firstElementChild;
        // Computed colors here are rgb() or color(srgb) from the accent mix.
        const luminance = color => {
          const values = color.match(/[\\d.]+/g).slice(0, 3).map(Number);
          const channels = (color.startsWith('color(srgb') ? values : values.map(value => value / 255))
            .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
          return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
        };
        const surface = getComputedStyle(primary).backgroundColor;
        const background = luminance(surface);
        return [...primary.children].every(child => {
            const text = luminance(getComputedStyle(child).color);
            return (Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05) >= 4.5;
          });
      }), 'metric keeps readable text in ' + theme + ' mode');
      check(await metrics.evaluate(el => new Set([...el.children].map(child => child.offsetTop)).size === 1),
        'exported metric overview keeps all four columns in ' + theme + ' mode');
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(${JSON.stringify(origin)} + '/blocks');
    const thumbnail = page.locator('.tile-service-status .fit-preview');
    await thumbnail.scrollIntoViewIfNeeded();
    check(await thumbnail.evaluate(el => el.getBoundingClientRect().height <= 320),
      'mobile block thumbnails avoid desktop-sized empty space');

    await go('fullcalendar');
    await page.getByRole('button',{name:'New event',exact:true}).click();
    await page.getByLabel('Event title',{exact:true}).fill('Accessibility review');
    await page.getByLabel('Date',{exact:true}).fill('2026-09-23');
    await page.getByRole('button',{name:'Save event',exact:true}).click();
    await page.getByRole('status').filter({hasText:'Accessibility review added.'}).waitFor();
    const calendarEvent=page.getByRole('button',{name:/Accessibility review/}).first();
    await calendarEvent.click();
    check(await page.getByLabel('Event title',{exact:true}).inputValue()==='Accessibility review','calendar opens the created event');
    await page.getByLabel('Event title',{exact:true}).fill('Accessibility review complete');
    await page.getByRole('button',{name:'Save event',exact:true}).click();
    await page.getByRole('status').filter({hasText:'Accessibility review complete updated.'}).waitFor();
    await page.getByRole('button',{name:/Accessibility review complete/}).first().click();
    await page.getByRole('button',{name:'Delete event',exact:true}).click();
    check(await page.getByRole('button',{name:/Accessibility review complete/}).count()===0,'calendar edits and deletes the matching event');

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
  }`,
  );
  const result = stdout.match(/### Result\n([\s\S]*?)\n### Ran/);
  if (!result) throw new Error(stdout);
  const passed = JSON.parse(result[1]);
  await fs.mkdir("output/playwright/polish", { recursive: true });
  await fs.writeFile(
    "output/playwright/polish/interactions.json",
    JSON.stringify(passed, null, 2),
  );
  console.log(
    JSON.stringify({ passed: passed.length, checks: passed }, null, 2),
  );
} finally {
  await cli("close");
}
