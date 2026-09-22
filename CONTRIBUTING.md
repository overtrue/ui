# Contributing

Thanks for helping improve overtrue/ui. Keep changes focused and describe the behavior a user will see.

## Local setup

Use Node.js 22.18+ and pnpm 10.32.1:

```sh
pnpm install --frozen-lockfile
pnpm registry:build
pnpm dev
```

The website is at `/`; workspace examples are at `/workspace/`.

## Where to make changes

- Installable components: `src/registry/overtrue/`. Update the matching entry in `src/site/catalog.ts` or `src/site/dashboard-catalog.ts`, and its usage examples.
- Workspace pages: `src/pages/workspace/` and `src/components/overtrue/scenes/`.
- Website and documentation: `src/site/` and `docs/`.
- Design conventions: `DESIGN.md`.

Use semantic theme colors and Tabler Icons. Check keyboard interaction, visible focus, accessible labels, narrow screens, and dark mode. Keep sample data clearly fictional. Do not add working credentials or personal business data.

Do not edit generated card sources or registry JSON. Change their original source and run `pnpm registry:build`. The public registry builder includes local dependencies automatically; declare external packages and shadcn dependencies when needed.

## Before submitting

```sh
pnpm build
node scripts/registry/verify.mjs
pnpm content:check
git diff --check
```

For UI changes, serve the production build with `pnpm preview --port 4175` and inspect the affected pages at desktop and mobile widths in light and dark themes. Exercise the changed interaction. If an installable component changes, also install it into a separate initialized shadcn application and check its types and rendering.

The README and `docs/registry/verification.md` list browser verification commands. Generated screenshots, logs, build output, environment files, and local hosting settings must stay out of commits.

## Pull requests

Explain the problem, the resulting behavior, and what you tested. Include before/after screenshots when they clarify a visual change. Call out any remaining limitations. Preserve third-party notices in adapted files and `licenses/third-party.txt`.
