export default {
  name: "live-chart",
  title: "Live chart",
  category: "Charts",
  description:
    "Stream a rolling window of samples into an area, line, or bar chart that glides smoothly as each value arrives.",
  dependencies: [],
  imports: "LiveChart, useLiveSeries",
  usage:
    'function Example() {\n  const data = useLiveSeries({\n    initial: [1180, 1204, 1162, 1236, 1215, 1251, 1198, 1240],\n    next: (last) => Math.max(800, last + (Math.random() - 0.5) * 120),\n    interval: 1000,\n  })\n  return (\n    <LiveChart\n      label="Requests per second"\n      unit="req/s"\n      data={data}\n      interval={1000}\n      threshold={1500}\n      thresholdLabel="Limit"\n    />\n  )\n}',
  notes:
    "Pass a fixed-length window, oldest first, and append one sample per update; the chart renders once per sample and slides on the compositor between them, so it stays smooth at one update a second without per-frame React work. Set interval when samples arrive on a schedule so the glide and the time axis match it. The value axis expands immediately and only shrinks after the window has been calm for a few updates, so it never jitters. Reduced motion turns off the glide and the pulse; screen readers get a summary at most every ten seconds.",
  previewWidth: 600,
  previewHeight: 330,
  examples: [
    {
      name: "live-chart-demo",
      title: "API gateway throughput",
      description:
        "Requests per second for the last minute, with a capacity limit. Bursts past the limit turn the line and the head red.",
    },
    {
      name: "live-chart-variants-demo",
      title: "Latency and queue throughput",
      description:
        "A p95 latency line against its objective and a bar stream of processed jobs. Pause both feeds with one control.",
    },
  ],
  api: [
    ["data", "number[]", "Rolling window of samples, oldest first. Append to the end and drop from the start to stream."],
    ["label?", "string", "Metric name for the header and the accessible summary."],
    ["description?", "React.ReactNode", "Supporting text under the current value."],
    ["actions?", "React.ReactNode", "Status or controls at the top right."],
    ["unit?", "string", 'Shown beside the current value and in the tooltip, e.g. "req/s".'],
    ["variant?", '"area" | "line" | "bars"', 'Defaults to "area". Area and bars start at zero; lines fit the data.'],
    ["windowSize?", "number", "Samples across the plot. Defaults to data.length; shorter series fill in from the right."],
    ["interval?", "number", "Milliseconds between samples. Sets the glide speed and labels the time axis; measured from updates when omitted."],
    ["threshold?", "number", "Draws a dashed limit. Parts of the series past it, the head, and the readouts turn destructive."],
    ["thresholdLabel?", "string", 'Label for the limit line. Defaults to "Threshold".'],
    ["alertWhen?", '"above" | "below"', "Which side of the threshold is a breach. Defaults to above."],
    ["stats?", "boolean", "Show min, average, max, and p95 for the visible window. Defaults to true."],
    ["valueFormatter?", "(value: number) => string", "Formats the current value, readouts, and tooltip."],
    ["axisFormatter?", "(value: number) => string", "Formats axis ticks. Defaults to compact numbers such as 1.5k."],
    ["height?", "number", "Plot height in pixels. Defaults to 180."],
    ["min? / max?", "number", "Fix either end of the value axis."],
    ["color?", "string", "Any CSS color. Defaults to var(--color-chart-1)."],
    ["useLiveSeries", "{ initial, next, interval?, length?, paused? }", "Returns a rolling window that appends next(last) every interval and pauses while the tab is hidden."],
  ],
} as const;
