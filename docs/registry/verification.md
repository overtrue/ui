# Registry and website verification

Run checks against the revision you intend to publish. Generated artifacts and earlier reports do not establish that a later revision works.

## Build and source checks

```sh
pnpm install --frozen-lockfile
REGISTRY_ORIGIN=https://ui.overtrue.xyz pnpm build
node scripts/registry/verify.mjs
pnpm content:check
git diff --check
```

The registry checker validates source freshness, complete local dependency graphs, declared external dependencies, unique installation targets, and Tabler Icons. The content checker validates current branding, page titles, favicon references, local assets, route/navigation coverage, and preserved attribution.

`registry.json`, `public/r/`, `src/blocks/catalog.json`, `src/blocks/generated/`, and `src/blocks/registry/` are generated outputs. A fresh checkout must build them before starting development or running type checks.

## Website checks

Keep a production preview running in another terminal:

```sh
pnpm preview --port 4175
```

Then run:

```sh
SITE_URL=http://127.0.0.1:4175 pnpm site:check
SITE_URL=http://127.0.0.1:4175 node scripts/site/verify.mjs
SITE_URL=http://127.0.0.1:4175 node scripts/registry/verify-compositions.mjs
```

The browser scripts use Playwright CLI and Chrome. Check the configured origin in each script if using another port. Results and screenshots go to the ignored `output/playwright/` directory.

The website sweep derives routes from the catalog and checks desktop/mobile rendering and key interactions. The site verifier checks generated metadata, direct route responses, deployment rewrites, handbook navigation, themes, and internal links. The composition verifier covers composed components and their interactions.

For a changed component, inspect all affected variants in both themes. Exercise keyboard focus and Escape where relevant. Check the gallery thumbnail as well as the full-size detail page: they use different available widths.

## Installation checks

Use a separate React application initialized with shadcn/ui and Tailwind CSS v4. Install modified items through the CLI using the running preview origin:

```sh
npx shadcn@latest add http://127.0.0.1:4175/r/stat-card.json
```

Compile and render the installed files. Confirm that imports, CSS, declared package dependencies, and file targets work without access to this repository's internal aliases or workspace styles. Check an example card separately from a core component because they use different styling boundaries.

## Workspace and deployment

See [workspace verification](../examples/verification.md) for page and workflow checks, and [dashboard components](dashboard-components.md) for the analytics compatibility notes.

After deployment, verify the public website, workspace entry, representative registry JSON URLs, and an installation from the deployed origin. Confirm DNS independently. A successful local build or hosting dashboard status does not prove that the current public domain serves the intended revision.
