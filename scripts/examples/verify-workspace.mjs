import { browserCli } from "../browser/cli.mjs";
/** Browser smoke checks and screenshots for every workspace route. */
import fs from "node:fs/promises"
const mobile = process.argv.includes("--mobile")
const base = process.env.PREVIEW_URL ?? "http://127.0.0.1:4174/workspace/"
const session = `overtrue-verify-${mobile ? "mobile" : "desktop"}`
const output = "output/playwright/workspace"
const pages = JSON.parse(
  await fs.readFile("src/data/workspace/pages.json", "utf8"),
)
const cli = browserCli(session);
await fs.mkdir(output, { recursive: true })
await cli("open", base)
const results = []
try {
  for (let offset = 0; offset < pages.length; offset += 20) {
    const code = `async (page) => {
      await page.setViewportSize(${JSON.stringify(mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 })});
      const errors = []; const listener = error => errors.push(error.message); page.on('pageerror', listener);
      const results = [];
      for (const entry of ${JSON.stringify(pages.slice(offset, offset + 20))}) {
        const start = errors.length;
        await page.goto(${JSON.stringify(base)} + '#' + entry.path);
        await page.locator('[data-workspace-page="' + entry.file.replace('.html', '') + '"]').waitFor();
        await page.evaluate(async () => { await Promise.all([...document.images].map(image => image.complete ? Promise.resolve() : new Promise(resolve => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }); setTimeout(resolve, 1500); }))) });
        const state = await page.evaluate(() => ({ title: document.title, overflow: document.documentElement.scrollWidth > innerWidth + 1, brokenImages: [...document.images].filter(image => image.complete && !image.naturalWidth).map(image => image.getAttribute('src')) }));
        await page.screenshot({ path: ${JSON.stringify(`${output}/${mobile ? "mobile-" : ""}`)} + entry.file.replace('.html', '.png') });
        results.push({ path: entry.path, ...state, errors: errors.slice(start) });
      }
      page.off('pageerror', listener); return results;
    }`
    const { stdout } = await cli("run-code", code)
    const match = stdout.match(/### Result\n([\s\S]*?)\n### Ran/)
    if (!match)
      throw new Error(
        `Browser did not return batch ${offset}: ${stdout.slice(0, 500)}`,
      )
    results.push(...JSON.parse(match[1]))
    console.log(`Checked ${results.length}/${pages.length} pages`)
  }
} finally {
  await cli("close")
}
await fs.writeFile(
  `${output}/${mobile ? "mobile" : "desktop"}.json`,
  JSON.stringify(results, null, 2),
)
const failures = results.filter(
  (result) =>
    result.overflow || result.brokenImages.length || result.errors.length,
)
console.log(JSON.stringify({ checked: results.length, failures }, null, 2))
if (failures.length) process.exitCode = 1
