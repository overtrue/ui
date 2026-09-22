# Page polish — 2026-09-21

This pass covers overtrue/ui’s 119 workspace pages and 30 website routes. It preserves the existing admin layouts, Acme Studio sample content, theme tokens, and Tabler Icons.

## Changes

- Adjusted mobile page gutters, action targets, authentication spacing, and the gap between overview sections. Table row labels remain visible during horizontal scrolling, including plan comparisons.
- Improved keyboard focus, tab hover states, dark-theme links, chart colors, and map labels. Numeric summaries use tabular figures.
- Fixed mixed revenue charts that omitted columns, separate revenue/project axes, annotation lines, linked chart tooltips, and the date-range brush. Uptime sample values now fit their percentage axis.
- Restored stepped lines and data labels. Composition charts render immediately, pie charts fit their container, and repeated area charts have independent gradient IDs.
- Corrected the color swatch/input overlap. Calendar events have readable styling and full titles in a mobile agenda; choosing an agenda entry focuses the corresponding editor.
- Added a mobile component picker and collapsible documentation contents. Visible product wordmarks consistently read `overtrue/ui`.

## Evidence and limits

Each route is captured as a full-page image at 1440 × 1000 and 390 × 844, in light and dark themes. The route checks detect document overflow, broken images, page exceptions, and incorrect theme selection. They do not certify every element’s contrast or every possible interaction.

Visual review covered contact sheets across the workspace and website, with individual inspection of affected layouts and readable crops of long component pages. Automated screenshots alone are not visual acceptance. This report does not claim pixel equality with the original reference or that every interaction has been tested.

The calendar, forms, and business actions use local demo state. Map tiles depend on OpenFreeMap; the route sweep allows a bounded loading wait and does not assert third-party tile availability. The production build retains a chunk-size warning for bundles over 500 kB.

Screenshots and machine-readable results are stored in `output/playwright/polish/`. Existing workflow and website results are in `output/playwright/workspace/interactions.json` and `output/playwright/overtrue/verification.json`.

## Reproduce

```sh
REGISTRY_ORIGIN=https://ui.overtrue.xyz npm run build
npm run preview -- --host 127.0.0.1 --port 4178
```

In another terminal:

```sh
node scripts/examples/verify-polish.mjs
node scripts/examples/verify-polish.mjs --mobile
node scripts/examples/verify-polish.mjs --dark
node scripts/examples/verify-polish.mjs --dark --mobile
node scripts/examples/verify-polish.mjs --site
node scripts/examples/verify-polish.mjs --site --mobile
node scripts/examples/verify-polish.mjs --site --dark
node scripts/examples/verify-polish.mjs --site --dark --mobile
node scripts/examples/verify-polish-interactions.mjs
PREVIEW_URL=http://127.0.0.1:4178/workspace/ node scripts/examples/verify-interactions.mjs
SITE_URL=http://127.0.0.1:4178 node scripts/registry/verify-browser.mjs
node scripts/registry/verify.mjs
node scripts/examples/verify-content.mjs
```

The polish scripts accept `SITE_URL` when using a different preview port. Set `ROUTES=pricing-table` (or comma-separated route names) for a targeted screenshot rerun; it writes `results-recheck.json` without replacing the full sweep report.

## Verified results

- Production build and TypeScript checking pass; all 26 registry items pass the source/dependency checks.
- 596 route/viewport/theme checks pass across 149 routes. Four additional plan-comparison checks pass after the final mobile header adjustment.
- 38 workspace workflow checks, 27 website interaction checks, and 17 targeted polish regressions pass (82 checks). The website verifier also repeats 60 route checks.

The table below records route coverage; each Pass includes both the saved screenshot and automated page-health checks. It is not a claim of a separate exhaustive manual review of every state.

### Workspace routes

| Route | Desktop light | Mobile light | Desktop dark | Mobile dark |
| --- | --- | --- | --- | --- |
| `/workspace/#/2-step-verification-code` | Pass | Pass | Pass | Pass |
| `/workspace/#/2-step-verification` | Pass | Pass | Pass | Pass |
| `/workspace/#/accordion` | Pass | Pass | Pass | Pass |
| `/workspace/#/activity` | Pass | Pass | Pass | Pass |
| `/workspace/#/alerts` | Pass | Pass | Pass | Pass |
| `/workspace/#/all-elements` | Pass | Pass | Pass | Pass |
| `/workspace/#/auth-lock` | Pass | Pass | Pass | Pass |
| `/workspace/#/avatars` | Pass | Pass | Pass | Pass |
| `/workspace/#/badges` | Pass | Pass | Pass | Pass |
| `/workspace/#/blank` | Pass | Pass | Pass | Pass |
| `/workspace/#/buttons` | Pass | Pass | Pass | Pass |
| `/workspace/#/card-actions` | Pass | Pass | Pass | Pass |
| `/workspace/#/card-gradients` | Pass | Pass | Pass | Pass |
| `/workspace/#/cards-masonry` | Pass | Pass | Pass | Pass |
| `/workspace/#/cards` | Pass | Pass | Pass | Pass |
| `/workspace/#/carousel` | Pass | Pass | Pass | Pass |
| `/workspace/#/charts-advanced` | Pass | Pass | Pass | Pass |
| `/workspace/#/charts` | Pass | Pass | Pass | Pass |
| `/workspace/#/chat` | Pass | Pass | Pass | Pass |
| `/workspace/#/colorpicker` | Pass | Pass | Pass | Pass |
| `/workspace/#/colors` | Pass | Pass | Pass | Pass |
| `/workspace/#/cookie-banner` | Pass | Pass | Pass | Pass |
| `/workspace/#/client-overview` | Pass | Pass | Pass | Pass |
| `/workspace/#/operations-overview` | Pass | Pass | Pass | Pass |
| `/workspace/#/datagrid` | Pass | Pass | Pass | Pass |
| `/workspace/#/datatables` | Pass | Pass | Pass | Pass |
| `/workspace/#/dropdowns` | Pass | Pass | Pass | Pass |
| `/workspace/#/dropzone` | Pass | Pass | Pass | Pass |
| `/workspace/#/email-inbox` | Pass | Pass | Pass | Pass |
| `/workspace/#/emails` | Pass | Pass | Pass | Pass |
| `/workspace/#/empty` | Pass | Pass | Pass | Pass |
| `/workspace/#/error-404` | Pass | Pass | Pass | Pass |
| `/workspace/#/error-500` | Pass | Pass | Pass | Pass |
| `/workspace/#/error-maintenance` | Pass | Pass | Pass | Pass |
| `/workspace/#/faq` | Pass | Pass | Pass | Pass |
| `/workspace/#/flags` | Pass | Pass | Pass | Pass |
| `/workspace/#/forgot-password` | Pass | Pass | Pass | Pass |
| `/workspace/#/form-elements` | Pass | Pass | Pass | Pass |
| `/workspace/#/form-layout` | Pass | Pass | Pass | Pass |
| `/workspace/#/fullcalendar` | Pass | Pass | Pass | Pass |
| `/workspace/#/gallery` | Pass | Pass | Pass | Pass |
| `/workspace/#/icons` | Pass | Pass | Pass | Pass |
| `/workspace/#/illustrations` | Pass | Pass | Pass | Pass |
| `/workspace/#/` | Pass | Pass | Pass | Pass |
| `/workspace/#/artwork-review` | Pass | Pass | Pass | Pass |
| `/workspace/#/invoice` | Pass | Pass | Pass | Pass |
| `/workspace/#/open-positions` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-boxed` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-condensed` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-fluid-vertical` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-fluid` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-folded-hover` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-folded` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-horizontal` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-navbar-dark` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-navbar-overlap` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-navbar-sticky` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-rtl` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-vertical-right` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-vertical-transparent` | Pass | Pass | Pass | Pass |
| `/workspace/#/layout-vertical` | Pass | Pass | Pass | Pass |
| `/workspace/#/license` | Pass | Pass | Pass | Pass |
| `/workspace/#/lightbox` | Pass | Pass | Pass | Pass |
| `/workspace/#/lists` | Pass | Pass | Pass | Pass |
| `/workspace/#/logs` | Pass | Pass | Pass | Pass |
| `/workspace/#/map-fullsize` | Pass | Pass | Pass | Pass |
| `/workspace/#/maps-vector` | Pass | Pass | Pass | Pass |
| `/workspace/#/maps` | Pass | Pass | Pass | Pass |
| `/workspace/#/editorial-story` | Pass | Pass | Pass | Pass |
| `/workspace/#/modals` | Pass | Pass | Pass | Pass |
| `/workspace/#/creative-review` | Pass | Pass | Pass | Pass |
| `/workspace/#/navigation` | Pass | Pass | Pass | Pass |
| `/workspace/#/offcanvas` | Pass | Pass | Pass | Pass |
| `/workspace/#/onboarding` | Pass | Pass | Pass | Pass |
| `/workspace/#/page-loader` | Pass | Pass | Pass | Pass |
| `/workspace/#/pagination` | Pass | Pass | Pass | Pass |
| `/workspace/#/patterns` | Pass | Pass | Pass | Pass |
| `/workspace/#/pay` | Pass | Pass | Pass | Pass |
| `/workspace/#/payment-providers` | Pass | Pass | Pass | Pass |
| `/workspace/#/photogrid` | Pass | Pass | Pass | Pass |
| `/workspace/#/placeholder` | Pass | Pass | Pass | Pass |
| `/workspace/#/pricing-table` | Pass | Pass | Pass | Pass |
| `/workspace/#/pricing` | Pass | Pass | Pass | Pass |
| `/workspace/#/profile` | Pass | Pass | Pass | Pass |
| `/workspace/#/progress` | Pass | Pass | Pass | Pass |
| `/workspace/#/prose` | Pass | Pass | Pass | Pass |
| `/workspace/#/scroll-spy` | Pass | Pass | Pass | Pass |
| `/workspace/#/search-results` | Pass | Pass | Pass | Pass |
| `/workspace/#/segmented-control` | Pass | Pass | Pass | Pass |
| `/workspace/#/settings-plan` | Pass | Pass | Pass | Pass |
| `/workspace/#/settings` | Pass | Pass | Pass | Pass |
| `/workspace/#/sign-in-cover` | Pass | Pass | Pass | Pass |
| `/workspace/#/sign-in-illustration` | Pass | Pass | Pass | Pass |
| `/workspace/#/sign-in-link` | Pass | Pass | Pass | Pass |
| `/workspace/#/sign-in` | Pass | Pass | Pass | Pass |
| `/workspace/#/sign-up` | Pass | Pass | Pass | Pass |
| `/workspace/#/signatures` | Pass | Pass | Pass | Pass |
| `/workspace/#/social-icons` | Pass | Pass | Pass | Pass |
| `/workspace/#/sortable` | Pass | Pass | Pass | Pass |
| `/workspace/#/stars-rating` | Pass | Pass | Pass | Pass |
| `/workspace/#/steps` | Pass | Pass | Pass | Pass |
| `/workspace/#/tables` | Pass | Pass | Pass | Pass |
| `/workspace/#/tabs` | Pass | Pass | Pass | Pass |
| `/workspace/#/tags` | Pass | Pass | Pass | Pass |
| `/workspace/#/tasks-list` | Pass | Pass | Pass | Pass |
| `/workspace/#/tasks` | Pass | Pass | Pass | Pass |
| `/workspace/#/terms-of-service` | Pass | Pass | Pass | Pass |
| `/workspace/#/text-features` | Pass | Pass | Pass | Pass |
| `/workspace/#/toasts` | Pass | Pass | Pass | Pass |
| `/workspace/#/tour` | Pass | Pass | Pass | Pass |
| `/workspace/#/tracking` | Pass | Pass | Pass | Pass |
| `/workspace/#/trial-ended` | Pass | Pass | Pass | Pass |
| `/workspace/#/typography` | Pass | Pass | Pass | Pass |
| `/workspace/#/uptime` | Pass | Pass | Pass | Pass |
| `/workspace/#/users` | Pass | Pass | Pass | Pass |
| `/workspace/#/widgets` | Pass | Pass | Pass | Pass |
| `/workspace/#/wizard` | Pass | Pass | Pass | Pass |
| `/workspace/#/wysiwyg` | Pass | Pass | Pass | Pass |
| `/workspace/#/high-order` | Pass | Pass | Pass | Pass |

### Site routes

| Route | Desktop light | Mobile light | Desktop dark | Mobile dark |
| --- | --- | --- | --- | --- |
| `/` | Pass | Pass | Pass | Pass |
| `/components` | Pass | Pass | Pass | Pass |
| `/blocks` | Pass | Pass | Pass | Pass |
| `/docs` | Pass | Pass | Pass | Pass |
| `/examples` | Pass | Pass | Pass | Pass |
| `/components/stat-card` | Pass | Pass | Pass | Pass |
| `/components/metric-chart` | Pass | Pass | Pass | Pass |
| `/components/data-table` | Pass | Pass | Pass | Pass |
| `/components/activity-feed` | Pass | Pass | Pass | Pass |
| `/components/status-badge` | Pass | Pass | Pass | Pass |
| `/components/storage-meter` | Pass | Pass | Pass | Pass |
| `/components/avatar-stack` | Pass | Pass | Pass | Pass |
| `/components/page-header` | Pass | Pass | Pass | Pass |
| `/components/empty-state` | Pass | Pass | Pass | Pass |
| `/components/steps` | Pass | Pass | Pass | Pass |
| `/components/pricing-card` | Pass | Pass | Pass | Pass |
| `/components/settings-panel` | Pass | Pass | Pass | Pass |
| `/components/dashboard` | Pass | Pass | Pass | Pass |
| `/components/feature-card` | Pass | Pass | Pass | Pass |
| `/components/media-card` | Pass | Pass | Pass | Pass |
| `/components/detail-list` | Pass | Pass | Pass | Pass |
| `/components/resource-progress` | Pass | Pass | Pass | Pass |
| `/components/uptime-history` | Pass | Pass | Pass | Pass |
| `/components/metric-group` | Pass | Pass | Pass | Pass |
| `/components/project-portfolio` | Pass | Pass | Pass | Pass |
| `/components/service-status` | Pass | Pass | Pass | Pass |
| `/components/sparkline` | Pass | Pass | Pass | Pass |
| `/components/ranked-list` | Pass | Pass | Pass | Pass |
| `/components/conversion-funnel` | Pass | Pass | Pass | Pass |
| `/components/analytics-overview` | Pass | Pass | Pass | Pass |
