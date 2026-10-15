export default {
  name: "waterfall-chart",
  title: "Waterfall chart",
  category: "Data display",
  description:
    "A bridge chart that walks from an opening total through each increase and decrease to the closing total, with a crosshair readout per step.",
  dependencies: [],
  imports: "WaterfallChart, type WaterfallStep",
  usage: `function Example() {
  const steps: WaterfallStep[] = [
    { id: "open", label: "Aug 31 MRR", value: 412300, kind: "start" },
    { id: "new", label: "New business", value: 38400 },
    { id: "expansion", label: "Expansion", value: 21750 },
    { id: "contraction", label: "Contraction", value: -9260 },
    { id: "churn", label: "Churn", value: -24880 },
    { id: "close", label: "Sep 30 MRR", value: 0, kind: "end" },
  ];

  return (
    <WaterfallChart
      title="MRR bridge"
      description="September"
      steps={steps}
      valueFormatter={(value, context) =>
        context === "detail"
          ? "$" + value.toLocaleString("en-US")
          : "$" + (value / 1000).toFixed(1) + "k"
      }
    />
  );
}`,
  notes:
    'A `start` step sets the running total, each `delta` moves it by its signed value, and `subtotal` and `end` steps always draw the running total, so the bridge balances by construction (their own `value` is ignored). Increases paint emerald, decreases the destructive colour and totals the primary colour, with subtotals in a lighter tint; override any of them with `colors`. When every total sits far from zero, `baseline="auto"` starts the axis just below the lowest running total so the changes fill the plot, and marks the cut on total bars with two short strokes; pass `baseline="zero"` to always start at 0. `valueFormatter` always receives a non-negative amount and a context (label, axis or detail); the chart adds + and − itself. `orientation="auto"` uses columns when the card is wide enough for every step and rows below that, switched with a container query, so the same chart works in a wide panel and a phone. Bars rise in sequence on mount with CSS only and stay still with reduced motion. The plot is one tab stop: arrow keys move between steps and announce the change and running total, Enter calls `onSelect`, and an off-screen table lists every step for screen readers.',
  previewWidth: 640,
  examples: [
    {
      name: "waterfall-chart-demo",
      title: "MRR bridge",
      description:
        "September MRR from opening to closing balance. The axis starts near the opening total so the movements read clearly; hover or tab through the steps for the running total.",
    },
    {
      name: "waterfall-chart-horizontal-demo",
      title: "Operating income bridge",
      description:
        "A quarterly P&L in rows, from revenue through a gross profit subtotal to operating income, with a custom summary showing the operating margin.",
    },
  ],
  api: [
    [
      "steps",
      "WaterfallStep[]",
      'Steps of { id, label, value, kind? }. kind is "start", "delta" (default), "subtotal" or "end".',
    ],
    [
      "orientation?",
      '"vertical" | "horizontal" | "auto"',
      "Columns, rows, or columns only when the card is wide enough for every step. Defaults to auto.",
    ],
    [
      "valueFormatter?",
      '(value: number, context: "label" | "axis" | "detail") => string',
      "Formats a non-negative amount; signs are added by the chart. Defaults to compact numbers, with grouped digits in the tooltip and table.",
    ],
    [
      "title?",
      "React.ReactNode",
      "Card heading. Also names the chart for assistive tech when it is a string.",
    ],
    ["description?", "React.ReactNode", "Supporting text under the title."],
    ["actions?", "React.ReactNode", "Controls at the top right."],
    [
      "height?",
      "number",
      "Plot height in pixels for columns. Rows size themselves. Defaults to 280.",
    ],
    [
      "colors?",
      "{ increase?: string; decrease?: string; total?: string }",
      "Any CSS colours. Default to emerald, var(--color-destructive) and var(--color-primary).",
    ],
    [
      "baseline?",
      '"auto" | "zero"',
      "auto starts the axis below the lowest running total when all totals are far from zero, and marks the cut. Defaults to auto.",
    ],
    [
      "showSummary?",
      "boolean",
      "Show the closing total and net change under the title. Defaults to true.",
    ],
    [
      "renderSummary?",
      "(totals: WaterfallTotals) => React.ReactNode",
      "Replace the summary. totals has opening, closing, net, netShare and the chart's format function.",
    ],
    [
      "showLegend?",
      "boolean",
      "Show the increase, decrease and total key. Defaults to true.",
    ],
    [
      "renderTooltip?",
      "(step: WaterfallStep, info: WaterfallStepInfo) => React.ReactNode",
      "Replace the tooltip content. info has index, kind, direction, change, from, to, formattedChange, formattedTotal, shareOfStart and color.",
    ],
    [
      "onSelect?",
      "(step: WaterfallStep, info: WaterfallStepInfo) => void",
      "Called when a step is clicked or activated with Enter.",
    ],
    [
      "className?",
      "string",
      "Additional classes for the card. Other div props go to the root.",
    ],
  ],
} as const;
