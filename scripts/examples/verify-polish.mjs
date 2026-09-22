/** Full-page visual evidence; separate from the workflow interaction checks. */
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { sitePages } from "../../src/site/pages.ts";

const exec = promisify(execFile);
const mobile = process.argv.includes("--mobile");
const dark = process.argv.includes("--dark");
const site = process.argv.includes("--site");
const origin = process.env.SITE_URL ?? "http://127.0.0.1:4178";
const name = `${site ? "site" : "workspace"}-${dark ? "dark" : "light"}-${mobile ? "mobile" : "desktop"}`;
const output = `output/playwright/polish/${name}`;
const routes = site
  ? sitePages.map(page => page.path)
      .map(path => ({ path, name: path.slice(1).replaceAll("/", "-") || "home", url: origin + path }))
  : JSON.parse(await fs.readFile("src/data/workspace/pages.json", "utf8"))
      .map(page => ({ path: page.path, name: page.file.replace(".html", ""), url: origin + "/workspace/#" + page.path }));
const filter = process.env.ROUTES?.split(",");
const selectedRoutes = filter ? routes.filter(route => filter.includes(route.name)) : routes;
if (!selectedRoutes.length) throw new Error("No routes match ROUTES");
const cli = (...args) => exec("npx", ["--yes", "--package", "@playwright/cli", "playwright-cli", "--session", `polish-${name}`, ...args], { maxBuffer: 16 * 1024 * 1024 });
await fs.mkdir(output, { recursive: true });
await cli("open", origin);
const results = [];
try {
  await cli("run-code", `async page => {
    await page.setViewportSize(${JSON.stringify(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 })});
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.context().addInitScript(() => {
      localStorage.setItem('overtrue-site-theme', '${dark ? "dark" : "light"}');
      localStorage.setItem('overtrue-workspace-theme-v2', JSON.stringify({ scheme: '${dark ? "dark" : "light"}' }));
    });
  }`);
  for (let offset = 0; offset < selectedRoutes.length; offset += 10) {
    const { stdout } = await cli("run-code", `async page => {
      const results = [], errors = [];
      const listener = error => errors.push(error.message); page.on('pageerror', listener);
      for (const route of ${JSON.stringify(selectedRoutes.slice(offset, offset + 10))}) {
        const start = errors.length;
        await page.goto(route.url);
        await page.locator(${site ? "'.site-footer'" : "'[data-workspace-page=\"' + route.name + '\"]'"}).waitFor();
        await page.evaluate(async () => {
          await document.fonts.ready;
          // Full-page evidence includes images that normally load after scrolling.
          for (const img of document.images) img.loading = 'eager';
          await Promise.all([...document.images].map(img => img.complete ? Promise.resolve() : new Promise(resolve => { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }); setTimeout(resolve, 2000); })));
        });
        if (route.name.includes('map')) await page.locator('.workspace-map-label').first().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await page.screenshot({ path: ${JSON.stringify(output + "/")} + route.name + '.png', fullPage: true, animations: 'disabled' });
        const state = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          height: document.documentElement.scrollHeight,
          brokenImages: [...document.images].filter(img => !img.naturalWidth).map(img => img.getAttribute('src')),
          dark: document.documentElement.classList.contains('dark'),
        }));
        results.push({ path: route.path, name: route.name, ...state, errors: errors.slice(start) });
      }
      page.off('pageerror', listener); return results;
    }`);
    const match = stdout.match(/### Result\n([\s\S]*?)\n### Ran/);
    if (!match) throw new Error(stdout);
    results.push(...JSON.parse(match[1]));
    console.log(`${name}: ${results.length}/${selectedRoutes.length}`);
  }
} finally {
  await cli("close");
}
await fs.writeFile(`${output}/${filter ? "results-recheck" : "results"}.json`, JSON.stringify(results, null, 2));
const failures = results.filter(result => result.overflow || result.brokenImages.length || result.errors.length || result.dark !== dark);
console.log(JSON.stringify({ name, checked: results.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
