export default {
  name: "flame-graph",
  title: "Flame graph",
  category: "Operations",
  description:
    "A profiler flame graph with crisp HTML frames, an animated zoom into any call, and search that reports how much of the total it matches.",
  dependencies: [],
  imports: "FlameGraph, type FlameNode",
  usage: `function Example() {
  const profile: FlameNode = {
    name: "GET /api/orders",
    value: 182,
    children: [
      { name: "middleware.auth", value: 24, children: [{ name: "jwt.verify", value: 19 }] },
      {
        name: "orders.list",
        value: 131,
        children: [
          { name: "db.query", value: 88, children: [{ name: "pg.parseRows", value: 41 }] },
          { name: "JSON.stringify", value: 30 },
        ],
      },
      { name: "zlib.gzip", value: 21 },
    ],
  };

  return (
    <FlameGraph
      title="GET /api/orders"
      description="CPU profile"
      data={profile}
      onZoomChange={(id, node) => console.log(id, node?.name)}
    />
  );
}`,
  notes:
    "Pass one root frame, or an array of roots that are drawn under a single `rootName` frame. Each node's `value` is its total; when its children add up to more, their sum wins, and whatever is left over is self time. Frames are absolutely positioned HTML in rows of `rowHeight`, so labels stay sharp and truncate with an ellipsis; frames narrower than `minFrameWidth` pixels are skipped, which keeps profiles with thousands of frames fast. With `colorBy=\"group\"` the package prefix of each name (`db` for `db.query`, `react-dom` for `react-dom.renderToString`), or the node's own `group`, picks one of the chart colors and the function name picks one of three tints; `colorBy=\"self\"` switches to a heat scale of self time, and a function gives you full control. Text ink is chosen against the fill that is actually on screen, so it stays readable on every tint and in both themes. Click a frame or press Enter to zoom it to full width; ancestors stay full width and dim, and clicking one, Escape, or the reset button zooms back out. The zoom tweens about a fixed point over 300ms and is instant under reduced motion. Pass `zoomedId` and `onZoomChange` to control it, or `search` and `onSearchChange` to drive the highlight from your own field. The graph is one tab stop: Up and Down move to the parent or first child following the orientation, Left and Right move along the row, and Home returns to the zoomed frame. Hovering or focusing a frame shows its total, self time and share of the parent; `renderTooltip` replaces that readout. Every part has a `data-slot`, and frames carry `data-depth`, `data-match` and `data-dimmed`.",
  previewWidth: 720,
  examples: [
    {
      name: "flame-graph-demo",
      title: "Server-rendered checkout",
      description:
        "A CPU profile of one POST /api/checkout: middleware, database queries, a payment call and a React render. Click a frame to zoom in, then press Escape to step back out.",
    },
    {
      name: "flame-graph-search-demo",
      title: "Data layer hot spots",
      description:
        "A background job in flame orientation, colored by self time, with the search preset to db. and the heaviest functions listed below. Select a function to search for it.",
    },
  ],
  api: [
    [
      "data",
      "FlameNode | FlameNode[]",
      "The root frame, or several roots. Nodes are { id?, name, value, children?, group?, meta? }; value is the total, including children.",
    ],
    ["rootName?", "string", 'Name of the synthetic root when data is an array. Default "all".'],
    [
      "orientation?",
      '"icicle" | "flame"',
      "Root on top (icicle) or at the bottom (flame). Defaults to icicle.",
    ],
    ["rowHeight?", "number", "Row height in pixels. Defaults to 22."],
    ["minFrameWidth?", "number", "Frames narrower than this many pixels are skipped. Defaults to 2."],
    [
      "height?",
      "number",
      "Maximum height of the frame area; deeper profiles scroll. Flame graphs start scrolled to the root.",
    ],
    [
      "colorBy?",
      '"group" | "self" | (node: FlameNode, context: FlameColorContext) => string',
      "Hash the package group onto the palette, use a heat scale of self time, or return any CSS color. Defaults to group.",
    ],
    [
      "colors?",
      "string[]",
      "The group palette, or the heat scale stops from cold to hot with colorBy=\"self\". Defaults to var(--color-chart-1) … var(--color-chart-5).",
    ],
    [
      "zoomedId? / defaultZoomedId?",
      "string | null",
      "The frame drawn at full width, or null for the root. Ids default to the node's path, such as root/2/0.",
    ],
    [
      "onZoomChange?",
      "(id: string | null, node: FlameNode | null) => void",
      "Called when a frame is zoomed into, or with null when the zoom resets.",
    ],
    [
      "search? / defaultSearch?",
      "string",
      "Highlights frames whose name contains the text, case-insensitively, and dims the rest.",
    ],
    ["onSearchChange?", "(search: string) => void", "Called as the search changes."],
    ["showSearch?", "boolean", "Show the built-in search field. Defaults to true."],
    [
      "valueFormatter?",
      "(value: number) => string",
      "Formats totals and self times. Defaults to milliseconds, switching to seconds above 1,000.",
    ],
    [
      "renderTooltip?",
      "(info: FlameFrameInfo) => React.ReactNode",
      "Replaces the hover and focus readout. info has total, self, share, selfShare, parentShare, depth, group, path, fill and match.",
    ],
    [
      "showTopFunctions?",
      "boolean | number",
      "List the heaviest functions by self time within the zoomed frame; selecting one searches for it. true shows 8.",
    ],
    [
      "onSelect?",
      "(node: FlameNode, info: FlameFrameInfo) => void",
      "Called when a frame is clicked or activated with Enter, before it zooms.",
    ],
    ["title? / description?", "React.ReactNode", "Card heading and supporting text. The total is shown beside them."],
    ["actions?", "React.ReactNode", "Controls at the top right, before the total."],
    ["className?", "string", "Additional classes for the card. Other div props go to the root."],
  ],
} as const;
