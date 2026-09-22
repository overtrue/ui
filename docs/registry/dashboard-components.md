# Dashboard components

The analytics and workflow collection includes 27 components and 61 examples. Examples use the Acme Studio workspace, with project delivery, client reviews, capacity, and billing data. The catalog groups them alongside the core components by common tasks.

| Component | overtrue/ui registry name | Examples |
| --- | --- | --- |
| Corner Frame | `corner-frame` | 1 |
| Command Palette | `command-palette` | 4 |
| KPI Card | `kpi-card` | 2 |
| Trend Chart | `trend-chart` | 6 |
| Bar Chart | `bar-chart` | 2 |
| Data Table | `advanced-data-table` | 9 |
| Funnel Chart | `funnel-chart` | 3 |
| Bar List | `bar-list` | 1 |
| Distribution Bar | `distribution-bar` | 1 |
| Activity Heatmap | `activity-heatmap` | 1 |
| Sparkline | `trend-sparkline` | 1 |
| Composed Chart | `composed-chart` | 3 |
| Donut Chart | `donut-chart` | 2 |
| Radial Gauge | `radial-gauge` | 2 |
| Segmented Meter | `segmented-meter` | 2 |
| Metric List | `metric-list` | 1 |
| Delta Badge | `delta-badge` | 1 |
| Metric Value | `metric-value` | 1 |
| Period Tabs | `period-tabs` | 2 |
| Tick Bar | `tick-bar` | 1 |
| Dot Plot | `dot-plot` | 1 |
| Timeline | `event-timeline` | 4 |
| Activity Rings | `activity-rings` | 1 |
| Heatmap Chart | `heatmap-chart` | 2 |
| Radar Chart | `radar-chart` | 3 |
| Scatter Chart | `scatter-chart` | 2 |
| Sankey Chart | `sankey-chart` | 2 |

## Additional workspace examples

- Delivery report: one period control updates three KPIs, their comparisons, and the revenue trend.
- Capacity planner: a keyboard-accessible range control updates booked hours, remaining capacity, and planning advice.
- Billing workspace: status filters, client search, local payment changes, an empty-state preview, and reset share the same invoice data.

The component detail pages link to [dashboardcn](https://dashboardcn.com/docs). Adapted source retains its MIT notices.

## Integration

- Each component has a gallery tile, a detail page, documented usage, source view, and an installable Registry JSON. Detail pages include every documented variant.
- Existing DataTable, Sparkline and Timeline APIs stay intact. Their advanced counterparts use distinct filenames and registry names.
- All icons use Tabler Icons. Colors resolve through the Tailwind semantic color variables, including five chart colors.
- New charts use Recharts 3.10.1 through the npm alias `recharts-analytics`. Existing charts retain Recharts 2. Registry items declare the alias explicitly, so standalone installs get the same version.
- Advanced Data Table uses TanStack Table 9.2.4, with sorting, filtering, pagination, visibility, selection, pinning, sizing and column ordering.
- Command Palette uses cmdk and Radix Dialog, with keyboard focus trapping and an accessible title.
- Analytics card spacing is isolated from workspace card styles.

Install, for example: `npx shadcn@latest add https://ui.overtrue.xyz/r/activity-heatmap.json`. Local changes must be deployed before the production URL serves this revision.

## Verification

- Full project build and TypeScript check pass; all 432 registry entries pass dependency and source verification.
- Installed all 27 entries through the shadcn CLI into an independent initialized React/shadcn project. The installed sources compile, including the Recharts alias and TanStack Table dependencies.
- Rendered all 27 detail pages and all 61 documented variants at 1440px and 390px, in light and dark modes. No page errors or document overflow. Tables and heatmaps scroll internally when needed.
- Rechecked changed components after mobile polish: command menu descriptions, heatmap labels, period indicators, segmented-meter tick collisions and bounded table scrolling.
- Verified table filtering, empty results, numeric sorting, pagination, visibility, mixed selection, select-all and keyboard column ordering; controlled and keyboard period selection; command search, shortcuts, selection and focus restoration; heatmap, metric and chart tooltips.
- Verified gallery scaling in four viewport/theme combinations, source display and the existing Work queue layout.

Rebuild with `REGISTRY_ORIGIN=https://ui.overtrue.xyz npm run build`, then run `node scripts/registry/verify.mjs`. Visual and interaction checks use Playwright CLI against the local preview server.
