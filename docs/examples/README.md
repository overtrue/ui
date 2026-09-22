# Workspace examples

The `/workspace/` entry contains 119 routes for business workflows and reusable interface patterns. `/` serves the overtrue/ui website and `/examples` indexes the workspace pages.

## Organization

- `src/pages/workspace/`: route modules and component demonstrations.
- `src/components/overtrue/scenes/`: studio overview, projects, people, conversations, billing, asset library, settings, authentication, and knowledge pages.
- `src/data/workspace/studio.ts`: shared sample people, projects, clients, tasks, and invoices.
- `src/components/overtrue/workspace/`: navigation, interactions, charts, and plugin adapters.
- `src/styles/workspace-base.css`: namespaced utility styles with retained third-party notices.
- `src/styles/workspace-theme.css`: theme integration, navigation, responsive behavior, and adapters.
- `src/styles/scenes.css`: overtrue/ui’s business page compositions.
- `public/assets/overtrue/`: original generated photographs, SVG project covers, illustrations, and initial avatars.
- `public/assets/examples/`: generic flags, payment-provider symbols, and integration logos.

Acme Studio is the sample workspace name. People, client records, contact addresses, and amounts demonstrate an interface; they do not describe actual business activity. Interactions are local demos and do not send mail, charge cards, or create accounts.

Charts use Recharts. Calendar, editor, color, and map examples retain their appropriate libraries. Maps load OpenFreeMap tiles through MapLibre. Third-party libraries and adapted styles retain required attribution in `licenses/third-party.txt` and the public notices file.

## Verification

```sh
pnpm build
pnpm preview --port 4175
PREVIEW_URL=http://127.0.0.1:4175/workspace/ node scripts/examples/verify-workspace.mjs
PREVIEW_URL=http://127.0.0.1:4175/workspace/ node scripts/examples/verify-workspace.mjs --mobile
node scripts/examples/verify-content.mjs
```

Browser checks visit every route at 1440 × 1000 and 390 × 844, save screenshots, and detect JavaScript errors, broken images, and document overflow. Results are written to `output/playwright/workspace/`. Interaction checks separately cover task creation and state changes, messages, library dialogs, forms, sorting, exports, and keyboard behavior.

The [page polish report](polish.md) records the later 149-page desktop/mobile and light/dark pass, its fixes, and reproducible checks.
