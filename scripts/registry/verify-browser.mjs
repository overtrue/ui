import { browserCli } from "../browser/cli.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { sitePages } from "../../src/site/pages.ts";
const origin = process.env.SITE_URL || "http://127.0.0.1:4175";
const session = "overtrue-verification";
const cli = browserCli(session);
const run = async (code) => {
  const { stdout } = await cli("run-code", code);
  const result = stdout.match(/### Result\n([\s\S]*?)\n### Ran/);
  if (!result) throw Error(stdout);
  return JSON.parse(result[1]);
};
await mkdir("output/playwright/overtrue", { recursive: true });
await cli("open", origin);
const routes = sitePages.map((page) => page.path);
const results = [];
try {
  for (const width of [1440, 390]) {
    // Isolate batches so hundreds of full navigations and iframe documents do
    // not accumulate in one renderer. Every route still runs at both widths.
    for (let offset = 0; offset < routes.length; offset += 50) {
      if (offset > 0 || width === 390) {
        await cli("close");
        await cli("open", origin);
      }
      const batch = routes.slice(offset, offset + 50);
      results.push(
        ...(await run(`async page => {
      await page.setViewportSize({ width: ${width}, height: 1000 });
      const errors = []; const onError = error => errors.push(error.message); page.on('pageerror', onError);
      const diagnostics = [];
      const onRequestFailed = request => diagnostics.push(request.url() + ': ' + request.failure()?.errorText);
      const onConsole = message => { if (message.type() === 'error') diagnostics.push(message.text() + ': ' + message.location().url); };
      page.on('requestfailed', onRequestFailed);
      page.on('console', onConsole);
      const results = [];
      for (const route of ${JSON.stringify(batch)}) {
        const start = errors.length;
        let response;
        let cardState = { cardOverflow: false, cardBrokenImages: 0 };
        try {
          response = await page.goto(${JSON.stringify(origin)} + route);
          await page.locator('.site-footer').waitFor();
          await page.waitForFunction(() => !document.querySelector('.detail-preview')?.textContent.includes('Loading example'));
          const cardFrame = page.locator('.card-live-preview.is-expanded iframe');
          if (await cardFrame.count()) {
            await cardFrame.scrollIntoViewIfNeeded();
            const block = cardFrame.contentFrame().locator('.overtrue-block').first();
            await block.waitFor();
            cardState = await block.evaluate(async el => {
              const doc = el.ownerDocument;
              await doc.fonts.ready;
              const images = [...doc.images];
              images.forEach(image => { image.loading = 'eager'; });
              await Promise.race([
                Promise.all(images.map(image => image.decode().catch(() => {}))),
                new Promise(resolve => setTimeout(resolve, 2000)),
              ]);
              return {
                cardOverflow: doc.documentElement.scrollWidth > doc.defaultView.innerWidth + 1,
                cardBrokenImages: images.filter(image => image.complete && !image.naturalWidth).length,
              };
            });
          }
        } catch (error) {
          throw new Error(route + ' at ${width}px: ' + error.message + '; runtime errors: ' + JSON.stringify(errors.slice(start)) + '; failed requests: ' + JSON.stringify(diagnostics.slice(-5)));
        }
        const state = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).length }));
        results.push({ route, width: ${width}, status: response.status(), ...state, ...cardState, errors: errors.slice(start) });
        if (['/', '/components', '/docs', '/blocks/dashboard'].includes(route)) await page.screenshot({ path: 'output/playwright/overtrue/' + ${width} + '-' + (route.slice(1).replaceAll('/', '-') || 'home') + '.png', fullPage: true });
      }
      page.off('pageerror', onError); page.off('requestfailed', onRequestFailed); page.off('console', onConsole); return results;
    }`)),
      );
      console.log(
        `Checked ${Math.min(offset + 50, routes.length)}/${routes.length} routes at ${width}px`,
      );
    }
    console.log(`Checked ${routes.length} routes at ${width}px`);
  }
  await writeFile(
    "output/playwright/overtrue/routes.json",
    JSON.stringify(results, null, 2),
  );
  const interactions = await run(`async page => {
    const passed = [];
    const check = (condition, label) => { if (!condition) throw Error(label); passed.push(label) };
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(${JSON.stringify(origin)} + '/docs');
    const docsSidebar = page.locator('.docs-sidebar');
    const docsLinks = await docsSidebar.getByRole('link').allTextContents();
    await docsSidebar.getByRole('link', { name: 'Design principles', exact: true }).click();
    await page.waitForURL('**/docs/design');
    await docsSidebar.locator('a[aria-current=page]').waitFor();
    check(JSON.stringify(await docsSidebar.getByRole('link').allTextContents()) === JSON.stringify(docsLinks), 'documentation keeps both navigation sections');
    await docsSidebar.getByRole('link', { name: 'Installation', exact: true }).click();
    await page.waitForURL('**/docs#installation');
    await docsSidebar.locator('a[aria-current=location]').waitFor();
    await page.waitForFunction(() => { const top = document.getElementById('installation').getBoundingClientRect().top; return top >= 70 && top < innerHeight; });
    passed.push('documentation cross-page section navigation');
    await page.goto(${JSON.stringify(origin)} + '/components');
    await page.getByRole('textbox', { name: 'Search components', exact: true }).fill('resource progress');
    await page.waitForFunction(() => document.querySelectorAll('.component-tile').length === 1);
    check(await page.locator('.component-tile').count() === 1, 'component search');
    await page.getByRole('textbox', { name: 'Search components', exact: true }).fill('not-a-component');
    await page.getByText('No components found.').waitFor();
    check(await page.getByText('No components found.').isVisible(), 'empty search state');
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await page.locator('.component-tile').first().waitFor();
    await page.getByRole('button', { name: 'Forms', exact: true }).click();
    await page.getByRole('button', { name: 'Forms', exact: true, pressed: true }).waitFor();
    await page.waitForFunction(() => document.querySelectorAll('.component-tile').length === 1);
    check(await page.locator('.component-tile').count() === 1, 'category filtering');
    await page.goto(${JSON.stringify(origin)} + '/components/data-table');
    await page.getByRole('searchbox', { name: 'Search team members' }).fill('Maya');
    check(await page.locator('tbody tr').count() === 1 && (await page.locator('tbody tr').textContent()).includes('Maya Okafor'), 'table filtering');
    await page.getByRole('searchbox', { name: 'Search team members' }).fill('');
    await page.getByRole('button', { name: 'Name', exact: true }).click();
    check((await page.locator('tbody tr').first().textContent()).includes('Alina'), 'table sorting');
    await page.getByRole('button', { name: 'Next page' }).click();
    check(await page.locator('tbody tr').count() === 2, 'table pagination');
    await page.getByRole('button', { name: 'Source', exact: true }).click();
    check((await page.locator('.source-view').textContent()).includes('@tabler/icons-react'), 'overtrue/ui source view');
    await page.goto(${JSON.stringify(origin)} + '/blocks/settings-panel');
    await page.getByLabel('Workspace name').fill('overtrue/ui QA');
    await page.getByRole('button', { name: 'Save changes' }).click();
    check(await page.getByText('Demo saved locally in this preview.').isVisible(), 'settings save state');
    await page.goto(${JSON.stringify(origin)} + '/');
    await page.getByLabel('Report period').selectOption('6 months');
    check(await page.getByText('$24,600', { exact: true }).isVisible(), 'report period');
    const download = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export', exact: true }).click();
    check((await download).suggestedFilename() === 'revenue-report.csv', 'CSV export');
    await page.getByRole('navigation', { name: 'Dashboard', exact: true }).getByRole('button', { name: 'Members' }).click();
    check(await page.getByRole('heading', { name: 'Team members' }).isVisible(), 'dashboard navigation');
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    check(await page.locator('html.dark').count() === 1, 'dark theme');
    await page.screenshot({ path: 'output/playwright/overtrue/dark-desktop.png', fullPage: true });
    await page.reload(); check(await page.locator('html.dark').count() === 1, 'theme persistence');
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Documentation' }).click();
    check(page.url().endsWith('/docs'), 'mobile navigation');
    await page.getByRole('navigation', { name: 'Main navigation' }).waitFor({ state: 'hidden' }); passed.push('mobile menu closes');
    const mobileDocs = page.locator('.docs-mobile-contents');
    await mobileDocs.locator('summary').click();
    await mobileDocs.getByRole('link', { name: 'Design principles', exact: true }).click();
    await page.waitForURL('**/docs/design');
    await page.locator('.docs-mobile-contents:not([open])').waitFor();
    await mobileDocs.locator('summary').click();
    check(JSON.stringify(await mobileDocs.getByRole('link').allTextContents()) === JSON.stringify(docsLinks), 'mobile documentation keeps both sections');
    await mobileDocs.getByRole('link', { name: 'Installation', exact: true }).click();
    await page.waitForURL('**/docs#installation');
    await page.locator('.docs-mobile-contents:not([open])').waitFor(); passed.push('mobile documentation closes after selection');
    await page.goto(${JSON.stringify(origin)} + '/examples');
    await page.getByRole('textbox', { name: 'Search pages' }).fill('accordion');
    await page.waitForFunction(() => document.querySelectorAll('.example-list > a').length === 1);
    check(await page.locator('.example-list > a').count() === 1, 'reference search');
    await page.locator('.example-list > a').click();
    await page.locator('[data-workspace-page="accordion"]').waitFor();
    check(page.url().includes('/workspace/#/accordion'), 'reference entry point');
    await page.goto(${JSON.stringify(origin)} + '/blocks/analytics-overview');
    const analytics = page.locator('[data-slot="analytics-overview"]');
    await analytics.getByLabel('Analytics period').selectOption('7-days');
    check(await analytics.getByText('8,800', { exact: true }).count() === 2, 'analytics period updates traffic and funnel');
    check(await analytics.getByText('2.00%', { exact: true }).isVisible(), 'analytics period updates conversion');
    check((await analytics.locator('[data-slot="ranked-list"]').innerText()).includes('3,784'), 'analytics period updates sources');
    const analyticsDownload = page.waitForEvent('download');
    await analytics.getByRole('button', { name: 'Export', exact: true }).click();
    check((await analyticsDownload).suggestedFilename() === 'analytics-report.csv', 'analytics export');
    await page.goto(${JSON.stringify(origin)} + '/components/stat-card');
    check(await page.locator('[data-slot="stat-card"]').filter({ hasText: 'Response time' }).getAttribute('data-tone') === 'positive', 'decreasing latency is positive');
    check(await page.locator('[data-slot="stat-card"]').filter({ hasText: 'Failed requests' }).getAttribute('data-tone') === 'negative', 'increasing errors are negative');
    for (const name of ['ranked-list', 'conversion-funnel']) {
      await page.goto(${JSON.stringify(origin)} + '/components/' + name);
      await page.getByRole('button', { name: 'Preview empty state' }).click();
      check((await page.locator('.detail-preview').innerText()).includes('No '), name + ' empty state');
      await page.getByRole('button', { name: 'Restore sample data' }).click();
      check(await page.locator('.detail-preview li').count() > 0, name + ' restored data');
    }
    return passed;
  }`);
  await writeFile(
    "output/playwright/overtrue/verification.json",
    JSON.stringify({ routes: results, interactions }, null, 2),
  );
  const failures = results.filter(
    (result) =>
      result.overflow ||
      result.brokenImages ||
      result.cardOverflow ||
      result.cardBrokenImages ||
      result.errors.length ||
      result.status !== 200,
  );
  console.log(
    JSON.stringify(
      { routes: results.length, interactions: interactions.length, failures },
      null,
      2,
    ),
  );
  if (failures.length) process.exitCode = 1;
} finally {
  await cli("close");
}
