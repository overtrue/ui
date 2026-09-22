# Workspace verification

The workspace uses overtrue/ui branding and Acme Studio sample content. The route manifest in `src/data/workspace/pages.json` covers both business pages and interface demonstrations.

## Source and routes

```sh
pnpm build
pnpm content:check
pnpm preview --port 4175
```

With the preview running, check every route at desktop and mobile widths:

```sh
PREVIEW_URL=http://127.0.0.1:4175/workspace/ node scripts/examples/verify-workspace.mjs
PREVIEW_URL=http://127.0.0.1:4175/workspace/ node scripts/examples/verify-workspace.mjs --mobile
```

These checks detect page exceptions, broken images, and document overflow, and save route screenshots under `output/playwright/workspace/`. Review the screenshots; automated bounds checks alone do not catch poor spacing, cropping, or contrast.

## Interactions and visual checks

The other scripts under `scripts/examples/` cover business workflows and visual polish. Read their configured base URL and output path before running against another port.

For a changed page, check:

- Light and dark themes, plus dark navigation on a light page when the header is involved.
- Desktop and mobile layouts, including folded and expanded sidebar navigation.
- Empty/filter states, selection, forms, and actions that use local demo data.
- Keyboard focus, menu dismissal, and dialog focus restoration.
- Theme settings after reload, including corner radius and system color scheme.
- Related Blocks previews; extracted cards must render outside the full page too.

For Form elements, visit all eight categories, edit a field, switch categories and return, use a select and range control, open a dropdown, and submit a complete form example. Confirm that field values are preserved and that the selected category alone is visible.

Forms and business interactions use local demo state. Maps require external OpenFreeMap tiles and should show loading/error feedback when the service is unavailable. Testing a demo submission does not verify a backend integration.
