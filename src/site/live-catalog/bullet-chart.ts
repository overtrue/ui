export default {
  name: "bullet-chart",
  title: "Bullet chart",
  category: "Metrics",
  description:
    "Stephen Few’s bullet graph: compare each KPI with its target against poor, satisfactory and good ranges in a single line.",
  dependencies: [],
  imports: "BulletChart",
  usage: `<BulletChart
  title="Q3 targets"
  description="Quarter to date"
  items={[
    { id: "revenue", label: "Revenue", value: 812, target: 900, ranges: [600, 800, 1000], valueFormatter: v => "$" + v + "k" },
    { id: "clients", label: "New clients", value: 14, target: 12, ranges: [6, 10, 16] },
    { id: "response", label: "Response time", value: 4.6, target: 4, ranges: [3, 5, 8], invert: true, valueFormatter: v => v + " h" },
  ]}
/>`,
  notes:
    "Ranges are three ascending thresholds in the item’s own units; darker shading always means a worse result, so with `invert` (lower is better) the darkest range moves to the right. The scale starts at zero and ends at `max`, the last range, or a rounded value just above the data. Give rows with different units their own `valueFormatter`. Each row is a tab stop with a full text alternative (value, target, percentage, range and gap); hovering or focusing it reveals the exact readout. Below about 28rem of container width the label and value sit above the bar. Bars fill on mount with a short stagger, and stay still with reduced motion.",
  previewWidth: 640,
  examples: [
    {
      name: "bullet-chart-demo",
      title: "Quarterly studio targets",
      description:
        "Revenue, new clients, utilization, NPS, and support response time, where lower is better. Hover or tab through the rows for the gap to each target.",
    },
    {
      name: "bullet-chart-compact-demo",
      title: "Compact utilization report",
      description:
        "A denser layout for longer lists, with the measure colored by whether each person meets their role’s target.",
    },
  ],
  api: [
    [
      "items",
      "BulletChartItem[]",
      "Rows of { id, label, sublabel?, value, target, ranges?, max?, invert?, valueFormatter? }.",
    ],
    [
      "items[].ranges?",
      "[number, number, number]",
      "Upper bounds of the poor, satisfactory and good ranges. Omit for a plain track.",
    ],
    [
      "items[].invert?",
      "boolean",
      "Lower is better: ranges read good, satisfactory, poor and the target is met at or below it.",
    ],
    [
      "items[].max?",
      "number",
      "End of the scale. Defaults to the last range or a rounded value above the data.",
    ],
    [
      "title?",
      "React.ReactNode",
      "Heading for the chart; also labels the section.",
    ],
    ["description?", "React.ReactNode", "Supporting line under the title."],
    [
      "valueFormatter?",
      "(value: number, item: BulletChartItem) => string",
      "Formats values, targets and gaps. A row’s own valueFormatter takes precedence.",
    ],
    [
      "size?",
      '"default" | "compact"',
      "Compact uses thinner bars, one-line labels and tighter rows.",
    ],
    [
      "tone?",
      '"primary" | "status"',
      "Primary paints every measure in the theme color; status uses green when the target is met, amber when behind and red in the poor range.",
    ],
    [
      "showLegend?",
      "boolean",
      "Show the range, measure and target key. Defaults to true.",
    ],
    ["className?", "string", "Additional classes for the card."],
  ],
} as const;
