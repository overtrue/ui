import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { load } from "cheerio";
import { sitePages, guides } from "../../src/site/pages.ts";

const origin = process.env.SITE_URL ?? "http://127.0.0.1:4178";
const canonicalOrigin = "https://ui.overtrue.xyz";
const config = JSON.parse(await fs.readFile("vercel.json", "utf8"));
for (const item of sitePages) {
  const file = `dist${item.path === "/" ? "" : item.path}/index.html`;
  const html = await fs.readFile(file, "utf8");
  const $ = load(html);
  assert.equal($("title").text(), `${item.title} — overtrue/ui`, file);
  assert.equal(
    $('meta[name="description"]').attr("content"),
    item.description,
    file,
  );
  assert.equal(
    $('link[rel="canonical"]').attr("href"),
    canonicalOrigin + item.path,
    file,
  );
  assert.equal(
    $('meta[property="og:url"]').attr("content"),
    canonicalOrigin + item.path,
    file,
  );
  assert.equal(
    $('meta[property="og:image"]').attr("content"),
    canonicalOrigin + "/social.png",
    file,
  );
  const response = await fetch(origin + item.path);
  assert.equal(response.status, 200, item.path);
  assert.equal(
    load(await response.text())("title").text(),
    `${item.title} — overtrue/ui`,
    `direct response: ${item.path}`,
  );
  if (item.path !== "/") {
    const rule = config.rewrites.find((rule) =>
      new RegExp("^" + rule.source.replace(/:[a-z]+/g, "([^/]+)") + "$").test(
        item.path,
      ),
    );
    assert.ok(rule, `Missing deployment route: ${item.path}`);
    const value = item.path.split("/").at(-1);
    const destination = rule.destination.replace(/:[a-z]+/g, value);
    assert.equal(destination, item.path + "/index.html");
  }
}
const sitemap = load(await fs.readFile("dist/sitemap.xml", "utf8"), {
  xmlMode: true,
});
assert.equal(sitemap("url").length, sitePages.length);
assert.deepEqual(
  sitemap("loc")
    .map((_, el) => sitemap(el).text())
    .get(),
  sitePages.map((page) => canonicalOrigin + page.path),
);
assert.match(
  await fs.readFile("dist/robots.txt", "utf8"),
  /Sitemap: https:\/\/ui\.overtrue\.xyz\/sitemap\.xml/,
);
assert.equal(
  load(await fs.readFile("dist/404.html", "utf8"))('meta[name="robots"]').attr(
    "content",
  ),
  "noindex,follow",
);
const png = await fs.readFile("dist/social.png");
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);

const exec = promisify(execFile);
const cli = (...args) =>
  exec(
    "npx",
    [
      "--yes",
      "--package",
      "@playwright/cli",
      "playwright-cli",
      "--session",
      "site-complete",
      ...args,
    ],
    { maxBuffer: 8 * 1024 * 1024 },
  );
await fs.mkdir("output/playwright/site-refinement", { recursive: true });
await cli("open", origin);
try {
  const { stdout } = await cli(
    "run-code",
    `async page => {
    const checks = [], links = new Set();
    const check = (yes, name) => { if (!yes) throw Error(name); checks.push(name); };
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(${JSON.stringify(origin)});
    const showcase = page.getByRole('group', {name:'Featured blocks'});
    await showcase.getByRole('button', {name:'Analytics overview',exact:true}).click();
    await page.locator('.assembled-preview [data-slot="analytics-overview"]').waitFor();
    check(await page.locator('.assembled-preview [data-slot="analytics-overview"]').isVisible(), 'home analytics block switch');
    await page.locator('.assembled-preview').getByLabel('Analytics period').selectOption('7-days');
    check(await page.locator('.assembled-preview').getByText('2.00%',{exact:true}).isVisible(), 'featured block retains its interactions');
    await showcase.getByRole('button', {name:'Service status',exact:true}).click();
    await page.locator('.assembled-preview [data-slot="service-status"]').waitFor();
    check(await page.locator('.assembled-preview [data-slot="service-status"]').isVisible(), 'home service block switch');
    await page.getByRole('link',{name:'Source & installation'}).click();
    await page.waitForURL('**/components/service-status');
    check(page.url().endsWith('/components/service-status'), 'featured block opens matching installation page');
    await page.getByRole('navigation',{name:'Component guides'}).getByRole('link',{name:'Put it to work Building a page'}).click();
    await page.getByRole('heading',{name:'Building a page',exact:true}).waitFor();
    check(await page.getByRole('heading',{name:'Building a page',exact:true}).isVisible(), 'component leads to composition guide');
    await page.getByRole('link',{name:'@overtrue namespace configuration',exact:true}).click();
    await page.waitForFunction(() => { const top=document.getElementById('namespace')?.getBoundingClientRect().top; return top >= 70 && top < 180; });
    check(page.url().endsWith('/docs#namespace'), 'cross-page guide anchor reaches the correct section');
    for (const guide of ${JSON.stringify(guides)}) {
      await page.goto(${JSON.stringify(origin)} + '/docs/' + guide.slug);
      await page.getByRole('heading',{name:guide.title,exact:true}).waitFor();
      check(await page.title() === guide.title + ' — overtrue/ui', guide.slug + ' has matching page metadata');
      check(await page.locator('.docs-sidebar a[aria-current="page"]').textContent() === guide.title, guide.slug + ' navigation indicates current page');
    }
    await page.setViewportSize({width:390,height:844});
    await page.goto(${JSON.stringify(origin)});
    const gallery = page.getByRole('region',{name:'Component previews'});
    await gallery.focus(); await page.keyboard.press('ArrowRight');
    await page.waitForFunction(()=>document.querySelector('.home-component-grid').scrollLeft > 0);
    checks.push('mobile component gallery scrolls with the keyboard');
    const lastPreview = gallery.locator('.tile-caption').last();
    await lastPreview.focus();
    check(await lastPreview.evaluate(el=>el.getBoundingClientRect().right <= innerWidth), 'last component preview remains reachable');
    await page.goto(${JSON.stringify(origin)} + '/docs/design');
    const trigger = page.getByRole('button',{name:'Open navigation',exact:true});
    await trigger.click(); await page.keyboard.press('Escape');
    await page.getByRole('navigation',{name:'Main navigation'}).waitFor({state:'hidden'});
    check(await trigger.evaluate(el=>el===document.activeElement) && !await page.getByRole('navigation',{name:'Main navigation'}).isVisible(), 'mobile menu Escape restores focus');
    await page.locator('.docs-mobile-contents summary').click();
    await page.locator('.docs-mobile-contents').getByRole('link',{name:'Troubleshooting',exact:true}).click();
    await page.getByRole('heading',{name:'Troubleshooting',exact:true}).waitFor();
    check(await page.getByRole('heading',{name:'Troubleshooting',exact:true}).isVisible(), 'mobile handbook navigation');
    await page.emulateMedia({colorScheme:'dark'});
    await page.evaluate(()=>localStorage.removeItem('overtrue-site-theme')); await page.reload();
    check(await page.locator('html.dark').count() === 1, 'initial theme respects the system preference');
    await page.getByRole('button',{name:'Switch to light theme'}).click(); await page.reload();
    check(await page.locator('html.dark').count() === 0, 'explicit theme overrides the system preference');
    await page.goto(${JSON.stringify(origin)} + '/not-a-page');
    check(await page.getByRole('heading',{name:'This page got away.'}).isVisible(), 'unknown route gives useful recovery');
    check(await page.locator('meta[name="robots"]').getAttribute('content') === 'noindex,follow', 'unknown route does not advertise itself for indexing');
    await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});
    for (const width of [320,768]) {
      await page.setViewportSize({width,height:900});
      for (const route of ['/', '/docs/design', '/docs/composition', '/docs/accessibility', '/docs/troubleshooting']) {
        await page.goto(${JSON.stringify(origin)} + route);
        await page.locator('.site-footer').waitFor();
        check(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth + 1), width + 'px layout: ' + route);
      }
    }
    for (const route of ${JSON.stringify(sitePages.map((page) => page.path))}) {
      await page.goto(${JSON.stringify(origin)} + route);
      await page.locator('.site-footer').waitFor();
      for (const href of await page.locator('a[href]').evaluateAll(els=>els.map(el=>el.href))) links.add(href);
    }
    return {checks, links:[...links]};
  }`,
  );
  const match = stdout.match(/### Result\n([\s\S]*?)\n### Ran/);
  if (!match) throw Error(stdout);
  const result = JSON.parse(match[1]);
  const knownRoutes = new Set(sitePages.map((page) => page.path));
  for (const href of result.links) {
    const url = new URL(href);
    if (
      url.origin !== origin ||
      knownRoutes.has(url.pathname) ||
      url.pathname.startsWith("/workspace/")
    )
      continue;
    await fs.access("dist" + decodeURIComponent(url.pathname));
  }
  const report = {
    metadataPages: sitePages.length,
    internalLinks: result.links.filter(
      (href) => new URL(href).origin === origin,
    ).length,
    interactions: result.checks,
  };
  await fs.writeFile(
    "output/playwright/site-refinement/verification.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await cli("close");
}
