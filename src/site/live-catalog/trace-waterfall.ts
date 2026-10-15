export default {
  name: "trace-waterfall",
  title: "Trace waterfall",
  category: "Data display",
  description:
    "A distributed trace as a collapsible span tree beside a zoomable time axis, with the critical path, errors, and span detail one click away.",
  dependencies: [],
  imports: "TraceWaterfall",
  usage: `<TraceWaterfall
  title="GET /api/orders"
  spans={[
    { id: "a", service: "gateway", name: "GET /api/orders", start: 0, duration: 184 },
    { id: "b", parentId: "a", service: "auth", name: "auth.verify", start: 3, duration: 22 },
    { id: "c", parentId: "a", service: "orders", name: "orders.list", start: 28, duration: 148 },
    { id: "d", parentId: "c", service: "postgres", name: "SELECT orders", start: 31, duration: 96 },
    { id: "e", parentId: "c", service: "redis", name: "GET customer:42", start: 130, duration: 41, status: "error" },
  ]}
  onSelectedChange={(id) => console.log(id)}
/>`,
  notes:
    "Pass spans with millisecond offsets from the start of the trace; order does not matter and spans whose parent is missing become roots. Services take `var(--color-chart-1)` to `var(--color-chart-5)` in order of appearance, then blends of those, so traces follow the theme; pin any service with `serviceColors`. The critical path is the chain of spans that actually held up the root: from each span's end it follows the child that finished last, then whatever finished before that child started. Drag across the axis or the minimap to zoom, double-click or Escape to reset; zoom animates through CSS variables, so long traces never re-render per frame. Only the rows in view are rendered, which keeps traces with thousands of spans responsive. The tree is one tab stop: arrow keys move, Left and Right collapse and expand, Enter selects. `renderDetail` replaces the attribute table with your own content, and `TraceSpanAttributes` is exported so you can keep it. Every part has a `data-slot`, such as `trace-row`, `trace-bar`, and `trace-detail`.",
  previewWidth: 760,
  examples: [
    {
      name: "trace-waterfall-demo",
      title: "Checkout request",
      description:
        "One checkout across eight services. The first card authorisation times out and is retried; the critical path shows what the customer actually waited for.",
    },
    {
      name: "trace-waterfall-detail-demo",
      title: "Custom span detail",
      description:
        "A slow search with the Elasticsearch span preselected. renderDetail adds span events beside the exported attribute table.",
    },
  ],
  api: [
    [
      "spans",
      '{ id: string; parentId?: string | null; name: string; service: string; start: number; duration: number; status?: "ok" | "error"; attributes?: Record<string, string | number | boolean> }[]',
      "Every span in the trace, in any order. start and duration are milliseconds from the trace start.",
    ],
    [
      "title?",
      "React.ReactNode",
      "Card heading. Also labels the span tree when it is a string.",
    ],
    [
      "description?",
      "React.ReactNode",
      "Supporting text under the trace summary.",
    ],
    [
      "actions?",
      "React.ReactNode",
      "Controls placed before the built-in tools at the top right.",
    ],
    [
      "selectedId? / defaultSelectedId?",
      "string | null",
      "The span shown in the detail panel. Pass selectedId to control it.",
    ],
    [
      "onSelectedChange?",
      "(id: string | null, span: TraceSpan | null) => void",
      "Called when a span is selected or the detail closes.",
    ],
    [
      "highlightCriticalPath?",
      "boolean",
      "Emphasise the critical path and fade other spans. Defaults to on; pair with onHighlightCriticalPathChange to control the toolbar toggle.",
    ],
    [
      "defaultCollapsedIds?",
      "string[]",
      "Spans that start collapsed. Collapsed rows show a count and a faint summary of their hidden children.",
    ],
    [
      "serviceColors?",
      "Record<string, string>",
      "Any CSS colour per service. Unlisted services take the chart palette.",
    ],
    [
      "durationFormatter?",
      "(ms: number) => string",
      "Formats durations and offsets. Defaults to µs, ms, or s by magnitude.",
    ],
    [
      "renderDetail?",
      "(span: TraceSpan, info: TraceSpanInfo) => React.ReactNode",
      "Replaces the attribute table. info carries the parent, children, self time, share of trace, critical flag, and colour.",
    ],
    ["rowHeight?", "number", "Row height in pixels. Defaults to 28."],
    [
      "height?",
      "number",
      "Maximum height of the scrolling span list. Defaults to 360.",
    ],
    [
      "treeWidth?",
      "number",
      "Span column width as a 0.2–0.7 share. Users can drag the divider.",
    ],
    [
      "showOverview? / showLegend?",
      "boolean",
      "Show the minimap and the service legend, which filters services. Both default to true.",
    ],
    [
      "onZoomChange?",
      "(range: [number, number] | null) => void",
      "Called with the visible range when zooming, and null on reset.",
    ],
    [
      "TraceSpanAttributes",
      "{ attributes?: Record<string, string | number | boolean> }",
      "The default attribute table, for use inside renderDetail.",
    ],
  ],
} as const;
