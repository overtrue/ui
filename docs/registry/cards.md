# Example card blocks

The Blocks library includes 368 card patterns extracted from the workspace examples, alongside 14 composed forms, business cards, and screens. A mapped group of cards is one collection: the source keeps its demo records and interactions instead of duplicating a block for every person or project.

## Source and maintenance

- `src/blocks/catalog.json` records each card's category, source file and line, and example routes.
- `scripts/blocks/prepare.mjs` extracts actual card JSX, local state, handlers, referenced declarations, imports, and enclosing form behavior. TypeScript removes unused declarations; Prettier formats the result.
- `src/blocks/generated/` contains the intermediate extracted components. Change the original example to update a card, then run `pnpm registry:build` to refresh the installable source and previews.
- `scripts/blocks/registry.mjs` packages the same components with relative imports and a shared foundation. Generated installable source lives in `src/blocks/registry/`.
- `pnpm registry:build` regenerates both layers before invoking the official shadcn registry builder.

Repeated template data remains editable. These are example compositions, with sample data and local state; they are not backend-connected features.

## Installation

```sh
npx shadcn@latest add https://ui.overtrue.xyz/r/card-overview-revenue-delivery-2.json
```

```tsx
import Block from "@/components/overtrue/blocks/overview-revenue-delivery-2"

export default function Page() {
  return <Block />
}
```

The card declares `overtrue-card-foundation` as a registry dependency. That item includes the styling and interaction primitives used across the examples, their npm dependencies, and third-party notices. Files live under `components/overtrue/blocks/`; they do not overwrite the consuming application's existing shadcn components. CSS is scoped to `.overtrue-block`, including local theme defaults, so these cards preserve their example appearance.

A card can use an existing React Router context. Outside one, its frame provides an isolated memory router. Replace sample navigation with your application's routes. Some demo imagery is hosted at the registry origin; replace those images with your own assets. CSS flag images and legacy example icons are embedded. Map tiles and editor resources still use their respective external services.

## Website

`/blocks` supports category filtering, text search, and pagination. Each `/blocks/:id` route includes the interactive card, a source tab, installation command, and links back to the examples. Previews load in a separate HTML entry to keep workspace styling out of the website. Only the current page of cards is mounted, and iframe loading is deferred.

Every detail route gets its own initial HTML metadata and sitemap entry. Vercel routes are generated alongside the other website pages.

## Verification

Run `pnpm build`, `node scripts/registry/verify.mjs`, and `node scripts/examples/verify-content.mjs`. Registry checks include the shared dependency graph, generated source freshness, unique file targets, required package dependencies, and icon consistency.

Card previews load the exported modules from `src/blocks/registry/`, including their shared foundation and scoped CSS. They do not import the workspace styles separately, so missing installation styles are visible in the gallery too.
Their Tailwind theme is generated from the site's theme mapping with complete color values, matching the installed foundation's tokens rather than the website's HSL channel format.

Browser validation must cover the card previews themselves, filters and pagination, source display, preview widths and themes, and representative interactions. Validate installation in a fresh consumer project as well; workspace rendering alone does not prove portability.
