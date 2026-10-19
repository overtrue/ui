export default {
  name: "latency-histogram",
  title: "Latency histogram",
  category: "Charts",
  description:
    "A request latency distribution with percentile markers, a shaded SLO tail, a comparison series, and brushing to measure any range.",
  dependencies: [],
  imports: "LatencyHistogram",
  usage: `<LatencyHistogram
  title="Checkout latency"
  values={[112, 138, 141, 156, 162, 170, 184, 191, 204, 236, 288, 412, 655]}
  percentiles={[50, 95, 99]}
  threshold={400}
  onRangeChange={(range) => console.log(range)}
/>`,
  notes:
    "Pass raw samples as `values` for exact nearest-rank percentiles, or pre-aggregated `buckets` from your metrics store, in which case percentiles are interpolated inside buckets. Linear charts end just past the slow tail and gather anything beyond into a hatched overflow bar, so one 30-second outlier never flattens the shape; log scale uses evenly spaced log buckets and suits multi-modal traffic such as cache hits and misses. The comparison is scaled to the current total so the shapes compare even when volumes differ; tooltips show its raw counts. Drag across the plot to measure a range, or focus it and use the arrow keys, Shift to extend, and Escape to clear. Bars grow in on mount and tween when data changes, and stay still under reduced motion. Every part has a `data-slot`, such as `histogram-bar`, `histogram-marker`, and `histogram-selection`.",
  previewWidth: 680,
  examples: [
    {
      name: "latency-histogram-demo",
      title: "API latency against yesterday",
      description:
        "5,000 sampled requests with p50, p95, and p99, a 400ms objective, and yesterday drawn as a dashed step line. Deltas show which percentiles slowed down.",
    },
    {
      name: "latency-histogram-log-demo",
      title: "Cache hits and misses on a log scale",
      description:
        "A bimodal lookup latency where the log scale separates the two humps. The cache-hit range is selected and reported through onRangeChange.",
    },
  ],
  api: [
    [
      "values?",
      "number[]",
      "Raw samples. Bucketed for you, with exact percentiles.",
    ],
    [
      "buckets?",
      "{ start: number; end: number; count: number }[]",
      "Pre-bucketed counts, used when values is not given.",
    ],
    [
      "compare?",
      "number[] | LatencyBucket[]",
      "A comparison distribution, e.g. yesterday. Scaled to the current total.",
    ],
    [
      "compareStyle?",
      '"step" | "outline"',
      "Draw the comparison as a dashed step line or outlined bars. Defaults to step.",
    ],
    [
      "seriesLabel? / compareLabel?",
      "string",
      'Legend names. Default "Current" and "Previous".',
    ],
    [
      "percentiles?",
      "number[]",
      "Percentiles to mark, such as 50 or 99.9. Defaults to [50, 90, 95, 99].",
    ],
    [
      "threshold?",
      "number",
      "Latency objective. Shades the slow tail and reports the share over it.",
    ],
    [
      "thresholdLabel?",
      "string",
      'Label for the objective. Defaults to "SLO".',
    ],
    [
      "scale? / defaultScale?",
      '"linear" | "log"',
      "X scale. Pass scale with onScaleChange to control the built-in toggle.",
    ],
    [
      "showScaleToggle?",
      "boolean",
      "Show the linear/log toggle. Defaults to true.",
    ],
    [
      "range? / defaultRange?",
      "[number, number] | null",
      "Brushed latency range. Pass range to control it.",
    ],
    [
      "onRangeChange?",
      "(range: [number, number] | null) => void",
      "Called when a range is brushed or cleared.",
    ],
    [
      "title? / description?",
      "React.ReactNode",
      "Card heading and supporting text.",
    ],
    ["actions?", "React.ReactNode", "Controls placed before the scale toggle."],
    [
      "unit?",
      "string",
      'Unit of the values. Defaults to "ms"; ms readouts switch to seconds from 1,000.',
    ],
    [
      "valueFormatter?",
      "(value: number) => string",
      "Formats latencies in readouts, markers, and ticks.",
    ],
    ["bucketCount?", "number", "Target number of bars. Defaults to 40."],
    [
      "domain?",
      "[number, number]",
      "Fix the latency domain instead of ending near p99.5.",
    ],
    [
      "height?",
      "number",
      "Plot height in pixels. Defaults to a third of the plot width, between 140 and 220.",
    ],
    [
      "colors?",
      "{ bar?; compare?; threshold?; marker?; selection? }",
      "Any CSS color per part. Defaults to chart-1, muted foreground, destructive, foreground, and primary.",
    ],
    [
      "renderTooltip?",
      "(bucket: LatencyHistogramBucket) => React.ReactNode",
      "Replaces the tooltip content. The bucket carries its range, count, share, cumulative share, and comparison.",
    ],
    [
      "showSummary?",
      "boolean",
      "Show the percentile summary above the plot. Defaults to true.",
    ],
  ],
} as const;
