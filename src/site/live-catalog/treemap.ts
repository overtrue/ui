export default {
  name: "treemap",
  title: "Treemap",
  category: "Charts",
  description:
    "A squarified treemap for hierarchical totals that zooms into any group with an animated layout tween and a breadcrumb back out.",
  dependencies: [],
  imports: "Treemap, type TreemapNode",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  // Controlled, so the zoom level can live in the URL or be reset from outside.
  const [path, setPath] = useState<string[]>([]);
  const spend: TreemapNode[] = [
    {
      id: "compute",
      label: "Compute",
      children: [
        { id: "k8s", label: "Kubernetes", value: 14820 },
        { id: "gpu", label: "Render farm", value: 9640 },
        { id: "web", label: "Web servers", value: 4210 },
      ],
    },
    {
      id: "storage",
      label: "Storage",
      children: [
        { id: "object", label: "Object storage", value: 5860 },
        { id: "backups", label: "Backups", value: 1730 },
      ],
    },
    { id: "network", label: "Network", value: 8060 },
  ];

  return (
    <Treemap
      title="Cloud spend"
      description="September"
      data={spend}
      rootLabel="All services"
      path={path}
      onPathChange={setPath}
      valueFormatter={(value) => "$" + value.toLocaleString("en-US")}
    />
  );
}`,
  notes:
    "Give leaves a `value`; parents always show the sum of their children, and empty or negative nodes are left out. Tiles are laid out largest first with the squarified algorithm, so each one stays close to square at any container size. Top-level groups take `colors` in data order (chart-1 to chart-5 by default) and keep them when you zoom; a node's own `color` overrides its branch, deeper levels get lighter, and smaller siblings lighter still, while text picks light or dark ink from its fill. Labels step down with tile size, from label, value and share to label only, to nothing; the readout under the map always has the full path, value, share of parent and share of total. `maxDepth={2}` draws the next level inside outlined groups. Clicking a tile, or pressing Enter, calls `onSelect` and zooms into it (a leaf inside a group zooms into the group); the breadcrumb, Backspace and Escape zoom out. Pass `path` and `onPathChange` to control the level, for example to sync it with the URL. `renderLabel` replaces tile content and receives the tile's size tier, pixel size, fill, ink and shares. The map is one tab stop: arrow keys move between tiles by position. Zooms tween with CSS transitions and are skipped with reduced motion.",
  previewWidth: 640,
  examples: [
    {
      name: "treemap-demo",
      title: "Cloud spend by service",
      description:
        "Five service groups with their services drawn inside. Click a group or a service to zoom in, then use the breadcrumb or Escape to come back.",
    },
    {
      name: "treemap-storage-demo",
      title: "Storage by folder",
      description:
        "Custom tile labels with folder icons and file counts from each node's meta, archive pinned to a neutral colour, and a controlled path that drives the description and a Reset action.",
    },
  ],
  api: [
    [
      "data",
      "TreemapNode[]",
      "Top-level nodes of { id, label, value?, children?, color?, meta? }. Ids must be unique across the tree.",
    ],
    [
      "valueFormatter?",
      '(value: number, context: "tile" | "detail") => string',
      "Formats values. Tiles default to compact numbers; the breadcrumb, readout and accessible labels default to grouped digits.",
    ],
    [
      "title?",
      "React.ReactNode",
      "Card heading. Also labels the map when it is a string.",
    ],
    ["description?", "React.ReactNode", "Supporting text under the title."],
    [
      "actions?",
      "React.ReactNode",
      "Controls at the top right, such as a period picker.",
    ],
    [
      "height?",
      "number | string",
      'Map height in pixels or any CSS length. Container units work, e.g. "clamp(240px, 56cqw, 420px)". Defaults to 360.',
    ],
    [
      "maxDepth?",
      "number",
      "Levels drawn at once. 2 or more nests the next level inside outlined groups. Defaults to 1.",
    ],
    [
      "colors?",
      "string[]",
      "Colours for top-level groups in data order. Defaults to var(--color-chart-1) … var(--color-chart-5).",
    ],
    [
      "rootLabel?",
      "string",
      'Name of the top level in the breadcrumb. Defaults to "All".',
    ],
    [
      "path? / defaultPath?",
      "string[]",
      "Ids from the top level to the node being shown. Use path for a controlled level, defaultPath to start zoomed in.",
    ],
    [
      "onPathChange?",
      "(path: string[], nodes: TreemapNode[]) => void",
      "Called whenever the map zooms in or out.",
    ],
    [
      "onSelect?",
      "(node: TreemapNode, path: TreemapNode[]) => void",
      "Called when a tile is clicked or activated with Enter, before any zoom. path runs from the top level to the node.",
    ],
    [
      "renderLabel?",
      "(node: TreemapNode, info: TreemapTileInfo) => React.ReactNode",
      "Replaces tile content. info has value, formattedValue, share, shareOfTotal, depth, path, width, height, size, fill, ink, leafCount, drillable and active.",
    ],
    [
      "className?",
      "string",
      "Additional classes for the card. Other div props go to the root.",
    ],
  ],
} as const;
