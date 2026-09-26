import { lazy, Suspense } from "react";
import { dashboardCatalog } from "./dashboard-catalog";
const examples = {
  "kpi-card-delivery-demo": lazy(
    () => import("./dashboard-examples/kpi-card-delivery-demo"),
  ),
  "segmented-meter-planner-demo": lazy(
    () => import("./dashboard-examples/segmented-meter-planner-demo"),
  ),
  "data-table-billing-demo": lazy(
    () => import("./dashboard-examples/data-table-billing-demo"),
  ),
  "corner-frame-demo": lazy(
    () => import("./dashboard-examples/corner-frame-demo"),
  ),
  "command-palette-demo": lazy(
    () => import("./dashboard-examples/command-palette-demo"),
  ),
  "command-palette-inline-demo": lazy(
    () => import("./dashboard-examples/command-palette-inline-demo"),
  ),
  "command-palette-compact-demo": lazy(
    () => import("./dashboard-examples/command-palette-compact-demo"),
  ),
  "command-palette-grid-demo": lazy(
    () => import("./dashboard-examples/command-palette-grid-demo"),
  ),
  "kpi-card-demo": lazy(() => import("./dashboard-examples/kpi-card-demo")),
  "trend-chart-demo": lazy(
    () => import("./dashboard-examples/trend-chart-demo"),
  ),
  "trend-chart-line-demo": lazy(
    () => import("./dashboard-examples/trend-chart-line-demo"),
  ),
  "trend-chart-dots-demo": lazy(
    () => import("./dashboard-examples/trend-chart-dots-demo"),
  ),
  "trend-chart-bar-demo": lazy(
    () => import("./dashboard-examples/trend-chart-bar-demo"),
  ),
  "trend-chart-grouped-demo": lazy(
    () => import("./dashboard-examples/trend-chart-grouped-demo"),
  ),
  "trend-chart-horizontal-demo": lazy(
    () => import("./dashboard-examples/trend-chart-horizontal-demo"),
  ),
  "bar-chart-demo": lazy(() => import("./dashboard-examples/bar-chart-demo")),
  "bar-chart-striped-demo": lazy(
    () => import("./dashboard-examples/bar-chart-striped-demo"),
  ),
  "data-table-demo": lazy(() => import("./dashboard-examples/data-table-demo")),
  "data-table-loading-demo": lazy(
    () => import("./dashboard-examples/data-table-loading-demo"),
  ),
  "data-table-selection-demo": lazy(
    () => import("./dashboard-examples/data-table-selection-demo"),
  ),
  "data-table-row-actions-demo": lazy(
    () => import("./dashboard-examples/data-table-row-actions-demo"),
  ),
  "data-table-sticky-demo": lazy(
    () => import("./dashboard-examples/data-table-sticky-demo"),
  ),
  "data-table-reorder-demo": lazy(
    () => import("./dashboard-examples/data-table-reorder-demo"),
  ),
  "data-table-compact-demo": lazy(
    () => import("./dashboard-examples/data-table-compact-demo"),
  ),
  "data-table-composed-demo": lazy(
    () => import("./dashboard-examples/data-table-composed-demo"),
  ),
  "funnel-chart-demo": lazy(
    () => import("./dashboard-examples/funnel-chart-demo"),
  ),
  "funnel-chart-flow-demo": lazy(
    () => import("./dashboard-examples/funnel-chart-flow-demo"),
  ),
  "funnel-chart-sharp-demo": lazy(
    () => import("./dashboard-examples/funnel-chart-sharp-demo"),
  ),
  "bar-list-demo": lazy(() => import("./dashboard-examples/bar-list-demo")),
  "distribution-bar-demo": lazy(
    () => import("./dashboard-examples/distribution-bar-demo"),
  ),
  "activity-heatmap-demo": lazy(
    () => import("./dashboard-examples/activity-heatmap-demo"),
  ),
  "sparkline-demo": lazy(() => import("./dashboard-examples/sparkline-demo")),
  "composed-chart-demo": lazy(
    () => import("./dashboard-examples/composed-chart-demo"),
  ),
  "composed-chart-dual-axis-demo": lazy(
    () => import("./dashboard-examples/composed-chart-dual-axis-demo"),
  ),
  "composed-chart-hatched-demo": lazy(
    () => import("./dashboard-examples/composed-chart-hatched-demo"),
  ),
  "donut-chart-demo": lazy(
    () => import("./dashboard-examples/donut-chart-demo"),
  ),
  "donut-chart-half-demo": lazy(
    () => import("./dashboard-examples/donut-chart-half-demo"),
  ),
  "radial-gauge-demo": lazy(
    () => import("./dashboard-examples/radial-gauge-demo"),
  ),
  "radial-gauge-inline-demo": lazy(
    () => import("./dashboard-examples/radial-gauge-inline-demo"),
  ),
  "segmented-meter-demo": lazy(
    () => import("./dashboard-examples/segmented-meter-demo"),
  ),
  "metric-list-demo": lazy(
    () => import("./dashboard-examples/metric-list-demo"),
  ),
  "delta-badge-demo": lazy(
    () => import("./dashboard-examples/delta-badge-demo"),
  ),
  "metric-value-demo": lazy(
    () => import("./dashboard-examples/metric-value-demo"),
  ),
  "period-tabs-demo": lazy(
    () => import("./dashboard-examples/period-tabs-demo"),
  ),
  "period-tabs-animated-demo": lazy(
    () => import("./dashboard-examples/period-tabs-animated-demo"),
  ),
  "tick-bar-demo": lazy(() => import("./dashboard-examples/tick-bar-demo")),
  "dot-plot-demo": lazy(() => import("./dashboard-examples/dot-plot-demo")),
  "timeline-demo": lazy(() => import("./dashboard-examples/timeline-demo")),
  "timeline-compact-demo": lazy(
    () => import("./dashboard-examples/timeline-compact-demo"),
  ),
  "timeline-activity-demo": lazy(
    () => import("./dashboard-examples/timeline-activity-demo"),
  ),
  "timeline-versions-demo": lazy(
    () => import("./dashboard-examples/timeline-versions-demo"),
  ),
  "activity-rings-demo": lazy(
    () => import("./dashboard-examples/activity-rings-demo"),
  ),
  "heatmap-chart-demo": lazy(
    () => import("./dashboard-examples/heatmap-chart-demo"),
  ),
  "heatmap-chart-regions-demo": lazy(
    () => import("./dashboard-examples/heatmap-chart-regions-demo"),
  ),
  "radar-chart-demo": lazy(
    () => import("./dashboard-examples/radar-chart-demo"),
  ),
  "radar-chart-multi-demo": lazy(
    () => import("./dashboard-examples/radar-chart-multi-demo"),
  ),
  "radar-chart-dots-demo": lazy(
    () => import("./dashboard-examples/radar-chart-dots-demo"),
  ),
  "scatter-chart-demo": lazy(
    () => import("./dashboard-examples/scatter-chart-demo"),
  ),
  "scatter-chart-bubbles-demo": lazy(
    () => import("./dashboard-examples/scatter-chart-bubbles-demo"),
  ),
  "sankey-chart-demo": lazy(
    () => import("./dashboard-examples/sankey-chart-demo"),
  ),
  "sankey-chart-cashflow-demo": lazy(
    () => import("./dashboard-examples/sankey-chart-cashflow-demo"),
  ),
};
export function DashboardExample({
  name,
  expanded = false,
}: {
  name: string;
  expanded?: boolean;
}) {
  const CommandDemo = examples["command-palette-demo"];
  const item = dashboardCatalog.find((item) => item.name === name);
  if (!item) return null;
  return (
    <div className="dashboard-examples flex min-w-0 flex-col gap-10">
      {(expanded ? item.examples : item.examples.slice(0, 1)).map(
        (example, index) => {
          const Demo = examples[example.name];
          return (
            <section
              key={example.name}
              data-dashboard-example={example.name}
              className="min-w-0"
            >
              {expanded && ("title" in example || index > 0) && (
                <h3 className="mb-3 text-base font-semibold">
                  {"title" in example
                    ? example.title
                    : "Example " + (index + 1)}
                </h3>
              )}
              {expanded && "description" in example && (
                <p className="mb-4 text-sm text-muted-foreground">
                  {example.description}
                </p>
              )}
              <Suspense
                fallback={
                  <p role="status" className="text-sm text-muted-foreground">
                    Loading example…
                  </p>
                }
              >
                {example.name === "command-palette-demo" ? (
                  <CommandDemo enableShortcut={expanded} />
                ) : (
                  <Demo />
                )}
              </Suspense>
            </section>
          );
        },
      )}
    </div>
  );
}
