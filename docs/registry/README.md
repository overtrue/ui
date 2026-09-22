# overtrue/ui registry and website

## Distribution boundary

The installable toolkit is in `src/registry/overtrue/`. These components use Tailwind v4 semantic utilities, shadcn/ui primitives, and Tabler Icons. They do not import the workspace application's stylesheet, theme provider, router, static assets, or workspace adapters.

The website imports exactly the same component files it distributes. Source tabs read these files through Vite's raw import support. The workspace gallery remains a separate HTML entry at `/workspace/`, with its own CSS bundle and HashRouter. Its shared link adapter rewrites workspace links to preserve that entry point.

The core catalogue contains 58 components and four complete blocks: dashboard, project portfolio, service status, and analytics overview. Reusable pieces include feature cards, media cards, detail lists, resource progress, uptime history, metric groups, sparklines, ranked lists, and conversion funnels. The optional theme is a `registry:theme` item. See [Composition guide](compositions.md) and [Reusable admin components](components.md) for APIs and adoption.

The example card catalogue is separate from the core components. Its shared foundation installs scoped styles, local UI primitives, and interaction dependencies under `components/overtrue/blocks/runtime/`. It does not replace the consumer’s UI components or require the full workspace application. See [Card blocks](cards.md) for the extraction and installation boundary.

## Build

1. `scripts/blocks/prepare.mjs` extracts card JSX and its lexical dependencies from the example sources. `scripts/registry/prepare.mjs` builds both catalogues into `registry.json`.
2. `shadcn build` creates `public/r/registry.json` and the individual item JSON files, including source content.
3. Vite builds the website, `/workspace/index.html`, and the isolated card preview entry, copying public JSON and licensed assets into the deployment.

Each component installs under `components/overtrue/`. Core UI dependencies are declared with `registryDependencies`; npm packages are declared with `dependencies`. Every item includes its complete local dependency graph, derived from relative imports, in its `files` array. It uses relative imports, so consumers with a `src/` directory or alternative component aliases can install through the CLI.

`registry:check` verifies that generated sources are current, targets are unique, local imports are included, UI and package dependencies are declared, and icons use Tabler Icons.

## Website

- `/`: interactive dashboard hero, component previews, and installation entry points.
- `/components`: searchable, filterable catalogue.
- `/components/:name`: live preview, actual source, installation, and usage.
- `/blocks`: searchable library of 368 card patterns, followed by four complete interfaces.
- `/blocks/:id`: live card, source, desktop/mobile preview, installation command, and original example links.
- `/card-preview.html?id=...`: isolated interactive card renderer.
- `/docs`: setup, namespace configuration, theme, compatibility boundary, and attribution.
- `/docs/design`, `/docs/composition`, `/docs/accessibility`, `/docs/troubleshooting`: the product handbook, with linked examples and implementation guidance.
- `/examples`: searchable index of all 119 workspace examples.
- `/workspace/#/...`: original workspace gallery.
- `/r/registry.json`, `/r/:name.json`: public registry files.
- `/llms.txt`: discovery links and installation guidance.
- `/sitemap.xml`, `/robots.txt`, `/social.png`: discovery and link-sharing assets.

The public website routes are declared in `src/site/pages.ts`. The build writes an HTML entry with its own title, description, canonical URL, and sharing metadata for each route; the page body is still rendered by React. Vercel rewrites and the local preview middleware serve those entries directly. A `404.html` entry provides recovery for unknown production routes. The website remains independent of the workspace entry.

Run `node scripts/site/verify.mjs` against the built preview to check static metadata, deployment destinations, handbook navigation, featured blocks, keyboard behavior, themes, narrow layouts, and internal link targets. See [Website refinement](website-refinement.md) for the latest evidence.

Light and dark mode are separate from the workspace gallery's theme settings. Registry URLs in visible installation commands use the current origin. Registry metadata uses `REGISTRY_ORIGIN`, `VERCEL_URL`, or a localhost fallback, in that order.

## Behavior and limits

The data table filters, sorts, and paginates local data; it is not a server-side table engine. Row identity is supplied explicitly. Storage is calculated against total capacity and negative/non-finite values are guarded. Settings support asynchronous save callbacks and error states; without a callback the form is an explicitly labeled demo. Dashboard navigation, period selection, and CSV export work with bundled example data. Authentication and backend persistence are application concerns.

The workspace gallery is available for exploration, but its 119 pages are not advertised as independently installable registry items. Its structure and verification steps are documented in `docs/examples/README.md`.

## References

- [shadcn Registry](https://ui.shadcn.com/docs/registry) and [getting started](https://ui.shadcn.com/docs/registry/getting-started): static JSON, file targets, dependencies, and the official build command.
- [shadcn Directory](https://ui.shadcn.com/docs/directory): community registry discovery. overtrue/ui has not been submitted.
- [Kibo UI](https://www.kibo-ui.com/): usable component previews and clear installation paths.
- [Basecn](https://basecn.dev/): restrained catalogue and documentation presentation.
- [overtrue/ui](/docs): existing product typography, compact density, blue-gray palette, and icons.
