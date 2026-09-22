# Website refinement — 2026-09-21

This pass improves the overtrue/ui website’s presentation and completes its adoption paths. The 119-page workspace and the distributed component APIs are unchanged.

## Delivered

- A quieter home page with a restrained background, adjusted type spacing, a shorter mobile hero, and a keyboard-scrollable mobile component gallery.
- Interactive project, analytics, and service-status block previews, each linked to its source and installation instructions.
- Practical questions about licensing, compatibility, updates, and backend responsibilities.
- Four handbook pages: design principles, page composition, accessibility, and troubleshooting. Desktop and mobile guide navigation, previous/next links, and component-to-guide links complete the reading paths.
- A structured footer, system-theme initialization without an initial light flash, mobile-menu Escape handling, and cross-page section links.
- Individual static HTML metadata for all 34 public website routes, canonical URLs, a 1200 × 630 sharing image, sitemap, robots file, and a branded 404 entry. React still renders the page body; this is not full server rendering.

## Verification

- Production build and TypeScript checking pass. All 26 registry items still pass source and dependency validation.
- All 34 website routes pass full-page checks at 1440 × 1000 and 390 × 844 in light and dark themes: 136 route/viewport/theme checks. The last home-page adjustment receives four additional targeted captures.
- Existing website verification passes 68 route checks and 27 interactions.
- The focused website verifier checks raw HTTP metadata, deployment rewrite destinations, sitemap coverage, image dimensions, links, guide navigation, featured-block interactions, keyboard access, theme preferences, unknown-route recovery, and 320/768 px layouts.
- Visual review covers the site contact sheets, complete home and handbook layouts, and individual mobile hero, component-gallery, block, and sharing-image captures. These checks are not an accessibility certification or an assertion that every possible application state was manually reviewed.

Local evidence: `output/playwright/polish/site-*/`, `output/playwright/site-refinement/`, and `output/playwright/overtrue/verification.json`. The full-page capture script loads lazy images for the complete screenshot so offscreen media is checked as well.

## Reproduce

```sh
REGISTRY_ORIGIN=https://ui.overtrue.xyz npm run build
npm run preview -- --host 127.0.0.1 --port 4178 --strictPort
```

In a second terminal:

```sh
node scripts/site/verify.mjs
SITE_URL=http://127.0.0.1:4178 node scripts/registry/verify-browser.mjs
node scripts/examples/verify-polish.mjs --site
node scripts/examples/verify-polish.mjs --site --mobile
node scripts/examples/verify-polish.mjs --site --dark
node scripts/examples/verify-polish.mjs --site --dark --mobile
node scripts/registry/verify.mjs
node scripts/examples/verify-content.mjs
```

The sharing image is a browser capture of `scripts/site/social.html` at 1200 × 630, saved as `public/social.png`. It uses the project wordmark and a fictional metric, with no external fonts or images.

The deployment configuration follows Vercel’s [filesystem and rewrite behavior](https://vercel.com/docs/project-configuration/vercel-json) and [static 404 entry guidance](https://vercel.com/kb/guide/custom-404-page). These changes have been checked locally; this pass does not publish a new production deployment. The existing large-bundle build warning remains.
