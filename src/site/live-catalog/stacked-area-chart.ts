export default {
  name: "stacked-area-chart",
  title: "Stacked area chart",
  category: "Charts",
  description:
    "Show how a total splits across series over time, stacked, as 100% shares, or as a streamgraph, with a toggleable legend, annotations, and a snapping crosshair.",
  dependencies: [],
  imports: "StackedAreaChart, type StackedAreaSeries",
  usage: `function Example() {
  const series: StackedAreaSeries[] = [
    { key: "large", label: "Atlas Large" },
    { key: "small", label: "Atlas Small" },
    { key: "embed", label: "Embed v3" },
  ];
  const data = [
    { date: "2026-10-08", large: 842100, small: 301200, embed: 228400 },
    { date: "2026-10-09", large: 861900, small: 318800, embed: 231900 },
    { date: "2026-10-10", large: 604300, small: 552100, embed: 236200 },
    { date: "2026-10-11", large: 498700, small: 671400, embed: 240100 },
    { date: "2026-10-12", large: 512600, small: 689900, embed: 244800 },
  ];

  return (
    <StackedAreaChart
      title="Tokens by model"
      data={data}
      index="date"
      series={series}
      annotations={[{ x: "2026-10-10", label: "Routed summaries to Atlas Small" }]}
      header={(summary) => (
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {summary.format(summary.total)}
          <span className="ml-1.5 text-base font-medium text-muted-foreground">tokens</span>
        </p>
      )}
      onHiddenSeriesChange={(hidden) => console.log(hidden)}
    />
  );
}`,
  notes:
    "Pass one row per x value and name the series to stack, bottom first. The index can hold numbers, ISO date strings, Dates, or category labels; date-only strings such as 2026-10-03 are read as local calendar days, so they never shift a day in other time zones, and axis labels and tooltips pick Intl formats that match the spacing (hours label midnight with the date). Missing and negative values count as zero. `stack` switches between normal, expand (100% shares), stream (a centred streamgraph without a value axis), and none (overlapping translucent areas, largest at the back). The monotone curve uses Steffen tangents, so it never overshoots a point and stacked edges never cross. Clicking a legend item hides it, Alt or Option-click shows only that one (again to show all), and hovering one dims the rest; pass `hiddenSeries` with `onHiddenSeriesChange` to control it. Every change re-stacks by tweening the computed geometry with requestAnimationFrame over about 300ms, and a data update of the same shape glides: points are matched by their x value, so a sliding window moves left instead of morphing. On mount, bands rise from the baseline and lines draw in, bottom series first; all motion is skipped under reduced motion. The plot is one tab stop: Left and Right move the crosshair, Home and End jump, and each step is announced. `header` accepts a function that receives totals for the visible series, so a headline figure follows the legend. Colours default to the five chart tokens, then softer tints of them. Parts expose `data-slot` such as `stacked-area-series` (with `data-key` and `data-hidden`), `stacked-area-tooltip`, `stacked-area-legend-item`, and `stacked-area-annotation`.",
  previewWidth: 720,
  examples: [
    {
      name: "stacked-area-chart-demo",
      title: "Tokens by model",
      description:
        "Thirty days of tokens for five models, with an annotation where summaries moved to the small model. The headline total and its change follow the legend; switch to 14 days to watch the chart re-frame.",
    },
    {
      name: "stacked-area-chart-expand-demo",
      title: "Traffic share by region",
      description:
        "Hourly requests over two days as stacked values, 100% shares, or a streamgraph. Turn on Live to append an hour at a time and see the window glide.",
    },
  ],
  api: [
    [
      "data",
      "Record<string, unknown>[]",
      "Rows, one per x value. Missing or negative values count as zero.",
    ],
    [
      "index",
      "string",
      "Field holding the x value: numbers, ISO date strings, Dates, or category labels.",
    ],
    [
      "series",
      "{ key: string; label?: string; color?: string }[]",
      "Series to stack, bottom first. Colours default to var(--color-chart-1) to 5, then softer tints.",
    ],
    [
      "stack?",
      '"normal" | "expand" | "stream" | "none"',
      "Stacked values, 100% shares, a centred streamgraph, or overlapping areas. Defaults to normal.",
    ],
    [
      "curve?",
      '"monotone" | "linear" | "step"',
      "Monotone cubic without overshoot, straight segments, or centred steps. Defaults to monotone.",
    ],
    ["height?", "number", "Plot height in pixels. Defaults to 280."],
    [
      "title? / description?",
      "React.ReactNode",
      "Card heading and supporting text. A string title also names the chart for assistive tech.",
    ],
    ["actions?", "React.ReactNode", "Controls at the top right."],
    [
      "header?",
      "React.ReactNode | (summary: StackedAreaSummary) => React.ReactNode",
      "Content under the title, such as a headline total. The function receives totals, first and last values, and per-series totals and shares for the visible series.",
    ],
    [
      "valueFormatter?",
      "(value: number) => string",
      "Formats tooltip, legend, and summary values. Defaults to compact numbers from 10,000, such as 812k.",
    ],
    [
      "axisFormatter?",
      "(value: number) => string",
      "Formats y ticks. Defaults to compact numbers such as 2.4M, or percentages when expanded.",
    ],
    [
      "xFormatter?",
      '(value: string | number | Date, context: "axis" | "tooltip") => string',
      "Formats x values. Dates default to Intl formats matched to the data's spacing.",
    ],
    ["yLabel?", "string", "Short name of the value axis, shown above it."],
    [
      "referenceLines?",
      "{ y: number; label?: string; color?: string }[]",
      "Dashed horizontal lines such as a quota. Drawn in normal and none modes and kept inside the scale.",
    ],
    [
      "annotations?",
      "{ x: string | number | Date; label: string; color?: string }[]",
      "Thin vertical markers with a label, such as a deploy. Labels stack into lanes when they would collide, and the tooltip repeats them.",
    ],
    [
      "hiddenSeries? / defaultHiddenSeries?",
      "string[]",
      "Keys of hidden series. Pass hiddenSeries to control the legend.",
    ],
    [
      "onHiddenSeriesChange?",
      "(hidden: string[]) => void",
      "Called when the legend hides, shows, or solos a series.",
    ],
    ["showLegend?", "boolean", "Show the interactive legend. Defaults to true."],
    [
      "legendPosition?",
      '"top" | "bottom"',
      "Place the legend above the plot or in the footer. Defaults to bottom.",
    ],
    [
      "renderTooltip?",
      "(point: StackedAreaPoint) => React.ReactNode",
      "Replaces the tooltip content. The point has the formatted x, the row, the visible total, items top of the stack first with value and share, and annotations.",
    ],
    [
      "onHover?",
      "(point: StackedAreaPoint | null) => void",
      "Called when the crosshair moves to a point by pointer or keyboard, and with null when it leaves.",
    ],
    [
      "animate?",
      "boolean",
      "Entrance motion and tweened updates. Defaults to true; reduced motion always turns them off.",
    ],
  ],
} as const;
