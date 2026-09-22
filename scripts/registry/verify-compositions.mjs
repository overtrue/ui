import { browserCli } from "../browser/cli.mjs";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const origin = process.env.SITE_URL || "http://127.0.0.1:4177";
const items = [
  "feature-card",
  "media-card",
  "detail-list",
  "resource-progress",
  "uptime-history",
  "metric-group",
  "project-portfolio",
  "service-status",
];
const cli = browserCli("overtrue-compositions-check");
async function run(code) {
  const { stdout } = await cli("run-code", code);
  const match = stdout.match(/### Result\n([\s\S]*?)\n### Ran/);
  if (!match) throw Error(stdout);
  return JSON.parse(match[1]);
}
await mkdir("output/playwright/compositions", { recursive: true });
await cli("open", origin);
try {
  const layouts = [];
  for (const theme of ["light", "dark"]) {
    layouts.push(
      ...(await run(`async page => {
      await page.evaluate(theme => localStorage.setItem('overtrue-site-theme', theme), ${JSON.stringify(theme)});
      const results = []; const errors = []; page.on('pageerror', error => errors.push(error.message));
      for (const width of [1440, 390]) {
        await page.setViewportSize({width, height: 1000});
        for (const name of ${JSON.stringify(items)}) {
          await page.goto(${JSON.stringify(origin)} + '/components/' + name);
          await page.locator('.detail-preview').waitFor();
          await page.evaluate(async () => { await Promise.all([...document.images].filter(img => img.loading !== 'lazy').map(img => img.decode().catch(() => {}))) });
          const result = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, brokenImages: [...document.images].filter(img => img.complete && !img.naturalWidth).length }));
          await page.locator('.detail-preview').screenshot({path: 'output/playwright/compositions/' + ${JSON.stringify(theme)} + '-' + width + '-' + name + '.png'});
          results.push({name, width, theme: ${JSON.stringify(theme)}, ...result});
        }
      }
      if (errors.length) throw Error(errors.join('; ')); return results;
    }`)),
    );
  }
  const interactions = await run(`async page => {
    const passed = []; const check = (condition, message) => { if (!condition) throw Error(message); passed.push(message); };
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(${JSON.stringify(origin)} + '/components/feature-card');
    check(await page.locator('.detail-preview [aria-hidden=true] svg').count() === 1, 'corner artwork is decorative');
    check(await page.locator('.detail-preview img[alt=""]').count() === 1, 'background image is decorative');
    await page.getByRole('link', {name: 'Start a project', exact:true}).click();
    await page.locator('[data-workspace-page="wizard"]').waitFor(); passed.push('feature action navigation');
    await page.goto(${JSON.stringify(origin)} + '/components/resource-progress');
    const progress = page.getByRole('progressbar', {name:'Member seats'});
    check(await progress.getAttribute('aria-valuenow') === '8' && await progress.getAttribute('aria-valuemax') === '12', 'progress has units and an accessible label');
    await page.goto(${JSON.stringify(origin)} + '/blocks/project-portfolio');
    await page.getByRole('searchbox', {name:'Find a project…'}).fill('  visitor  ');
    check(await page.locator('[data-slot=media-card]').count() === 1, 'project search trims whitespace');
    await page.getByRole('searchbox').fill('no-such-project');
    check(await page.getByText('No projects match this search.', {exact:true}).isVisible(), 'project search empty state');
    await page.getByRole('searchbox').fill('');
    check(await page.locator('[data-slot=media-card]').count() === 3, 'project search restores records');
    await page.getByRole('button', {name:'Source',exact:true}).click();
    const files = await page.getByLabel('Source file').locator('option').allTextContents();
    check(files.includes('media-card.tsx') && files.includes('resource-progress.tsx') && files.includes('empty-state.tsx'), 'block exposes complete source dependencies');
    await page.goto(${JSON.stringify(origin)} + '/blocks/service-status');
    await page.getByRole('button', {name:'7 days',exact:true}).click();
    check(await page.getByText('Observed over the last 7 days', {exact:true}).isVisible(), 'service period changes');
    check(await page.locator('[data-slot=service-status] ul').first().locator('li').count() === 7, 'history includes seven accessible samples');
    await page.getByRole('button', {name:'90 days',exact:true}).click();
    check(await page.locator('[data-slot=service-status] ul').first().locator('li').count() === 90, 'history expands to ninety samples');
    return passed;
  }`);
  await writeFile(
    "output/playwright/compositions/verification.json",
    JSON.stringify({ layouts, interactions }, null, 2),
  );
  assert.deepEqual(
    layouts.filter((result) => result.overflow || result.brokenImages),
    [],
  );
  console.log(
    JSON.stringify({
      layouts: layouts.length,
      interactions: interactions.length,
      failures: 0,
    }),
  );
} finally {
  await cli("close");
}
