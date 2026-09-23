# Composing overtrue/ui interfaces

Use a component for a repeatable visual pattern. Use a block for a complete region that combines patterns, data, and behavior. These are ordinary React components with composition slots, not higher-order functions that wrap other components.

The installable files in `src/registry/overtrue/` are the implementation used by both the website and the workspace examples. They require no workspace stylesheet, router, demo dataset, or bundled image. Applications provide their own media URLs, data, navigation targets, and actions.

## Components

| Item | Composition / API | Current workspace use |
| --- | --- | --- |
| `feature-card` | `FeatureCard`, `FeatureCardBackground`, `FeatureCardDecoration`, `FeatureCardContent` | Icons announcement; member profile cover |
| `media-card` | `MediaCard layout="stacked" \| "split"`, image, body, content, footer | Project portfolio; recruitment feature |
| `detail-list` | `items: { id, label, value }[]`; values accept React content | Member directory; project brief |
| `resource-progress` | `label`, `value`, optional `max` and `valueLabel` | Project progress; resource allocation; billing usage |
| `uptime-history` | Named samples with operational/degraded/outage/unknown status | Operations and availability pages |
| `metric-group` | `MetricGroup` with `MetricGroupItem` children | Overview, client overview, operations, billing |

Every component accepts `className`; DOM-based components also forward ordinary attributes. Use shadcn `CardTitle`, `CardDescription`, and `Button` where appropriate. Do not add a new title/button prop every time a different arrangement is needed.

### Decorative announcement

```tsx
import { IconGhost } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { FeatureCard, FeatureCardContent, FeatureCardDecoration } from "@/components/overtrue/feature-card"

<FeatureCard>
  <FeatureCardDecoration><IconGhost /></FeatureCardDecoration>
  <FeatureCardContent>
    <CardTitle>Space for your next idea</CardTitle>
    <CardDescription>Bring the brief and the team together.</CardDescription>
    <Button onClick={createProject}>Start a project</Button>
  </FeatureCardContent>
</FeatureCard>
```

For an image cover, use `FeatureCardBackground src="…"` and `className="min-h-64 justify-end text-white"` on the root. The background includes a dark contrast overlay and is decorative (`alt=""`, hidden from assistive technology). Put meaningful images in `MediaCardImage`, which requires alt text. Decorations must not contain buttons or other interactive children. Foreground actions remain in the content slot.

### Image-led content

Wrap `MediaCardContent` and `MediaCardFooter` in `MediaCardBody`. Stacked cards place the image above the body; `layout="split"` places the image beside it at medium widths and above it on small screens. Give the image `className="h-full min-h-56"` for a full-height split composition. Footer actions remain independently focusable; do not turn the whole card into a link containing other links or buttons.

### Values and histories

`ResourceProgress` clamps finite values into `[0, max]`. Invalid or non-positive capacities fall back to 100, and non-finite values become zero. Supply units through `valueLabel`; accessibility uses the actual numeric capacity. The visible label names the progress bar.

`UptimeHistory` provides a textual list for every sample and a no-data state. Samples need stable IDs and meaningful dates or period labels. It displays supplied status history; it does not calculate an uptime percentage or pretend to monitor a service.

`MetricGroup` uses two columns on small screens and four on wide screens. Supply context as React content rather than inferring positive/negative sentiment from a string.

## Blocks

**IntegrationList** takes a controlled `integrations` list and optional async `onConnectionChange(id, connected)`. Each service has a stable ID, name, description, connection state, optional icon, and optional account label. The caller completes authorization or disconnection before updating the list. Rows show pending state independently and preserve the current connection on failure so the same action can be retried. Without a callback, the list is read-only. The preview uses local state and never connects external accounts. Install with `/r/integration-list.json`.

**ProjectPortfolio** takes `projects`, optional `description`, and optional toolbar `actions`. Each project supplies an image with alt text, status label and variant, progress, owner, and destination. The block owns local text search and its empty states. It trims search input and announces result counts. A workspace can use hash URLs; a different app can pass its own routes. It does not own project persistence.

**ServiceStatus** takes `services`, a title, description, and optional `actions` and `children`. Each service supplies its current status and history. The parent owns period selection, requests, and loading; the block does not introduce a second source of state. The `children` slot can contain incident notes or attribution. Empty lists are explicitly rendered.

Install a block with `npx shadcn@latest add <origin>/r/project-portfolio.json` or `/r/service-status.json`. The build follows relative imports recursively, includes each source once, and derives all shadcn dependencies from those sources. The website's source picker follows the same dependency graph.

## Analytics

`Sparkline` accepts numeric `data`, a required accessible `label`, optional `filled`, and `className`. It uses SVG and inherits text color; no chart library is needed. Empty, single-point, and constant series have explicit renderings. Non-finite observations are omitted. Use `MetricChart` for axis labels and individual values.

`StatCard` retains its original API and adds `sparkline`, `icon`, and `positiveTrend`. Set `positiveTrend="down"` for latency, churn, or errors. The direction arrow follows `trend`; color and accessible text describe whether that direction is positive. Values can be strings or numbers.

`MetricChart` supports an optional `previous` value per point. Set `seriesLabel` and `comparisonLabel` to name the solid and dashed series. `valueFormatter` controls exact values in the tooltip and text alternative; `axisFormatter` controls abbreviated ticks. `description` and `actions` extend the header. Empty data renders a no-data message.

`RankedList` accepts `items` with stable `id`, `label`, numeric `value`, optional `icon`, and optional `href`. It sorts a copy of the input. Bars are relative to the maximum; shares are relative to the total. `formatValue` changes the numeric display without changing the calculation. An empty list shows `emptyMessage`.

`ConversionFunnel` accepts ordered `stages` with `id`, `label`, and `value`. It shows both first-stage and previous-stage percentages. Zero denominators display unavailable text. Negative and non-finite counts in either list component are treated as zero.

`AnalyticsOverview` accepts `reports?: AnalyticsReport[]` and `className`. Each report has `id`, `label`, `description`, `traffic: MetricPoint[]`, `sources: RankedListItem[]`, `stages: FunnelStage[]`, and `previousConversions`. Keep traffic totals, source totals, and the first stage consistent; the last stage represents conversions. Omit `reports` for the included fictional demo, or pass `[]` for an empty state. The period selector updates every panel, and export downloads the selected traffic, source, and funnel rows. The parent owns fetching and loading. The same block is reused in the Dashboard Analytics view.

Install each by its catalog name, such as `/r/analytics-overview.json`; local dependencies are included automatically. Their implementation uses overtrue/ui's existing tokens, Tabler Icons, and shadcn primitives.

## Boundaries

Keep demo-specific adapters (`Scene`, team lookup, invoice data, period fixtures) in the workspace. A wrapper such as the existing `Metric` adapter may map demo terminology to the generic `MetricGroupItem` without duplicating its UI. Keep simple page-specific layouts inline until a repeated pattern has a clear boundary. Reuse the existing registry components instead of making another metric, badge, or avatar implementation.

The workspace has a small scoped CSS bridge for older unlayered card rules. Installed registry components do not depend on that bridge. The separate shadcn installation fixture verifies that the components work with stock primitives.

## Verification

- `pnpm build` and `pnpm registry:check` validate types, build output, and dependency closure.
- `node scripts/registry/verify-compositions.mjs` checks the new previews, source dependencies, search, period controls, decoration semantics, and progress labeling in a real browser.
- Existing site and 119-route workspace checks cover desktop/mobile rendering and business interactions.
- Install the new items into a separate initialized shadcn project and build there to catch accidental dependencies on this app.
