export default {
  name: "json-viewer",
  title: "JSON viewer",
  category: "Operations",
  description:
    "Inspect payloads, logs and trace attributes in a collapsible JSON tree with search, copyable paths and full keyboard navigation.",
  dependencies: [],
  imports: "JsonViewer",
  usage:
    '<JsonViewer\n  title="Request payload"\n  rootName="payload"\n  data={{\n    id: "req_9mZ2kq7Lx",\n    receivedAt: "2026-10-14T14:05:12.284Z",\n    items: [{ sku: "SKU-1042", qty: 2 }, { sku: "SKU-2210", qty: 1 }],\n    coupon: null,\n    express: false,\n  }}\n  onSelect={(path, value) => console.log(path, value)}\n/>',
  notes:
    "Pass any JSON-like value to `data`; Dates, Maps, Sets, bigints and circular references render safely. Containers shallower than `defaultExpandDepth` start open, or pass `defaultExpanded` paths, or control everything with `expanded` and `onExpandedChange`. Paths read like code (`payload.items[2].sku`, `headers[\"content-type\"]`) and are the ids used for expansion, selection, `onSelect` and Copy path. Search matches keys and values, opens the ancestors of every match and steps through them with Enter and Shift+Enter or the arrows, scrolling the current match into view; matches inside long strings or beyond the first `pageSize` items are revealed when reached. Strings over `maxStringLength` get an inline Show more, ISO-8601 timestamps show a localized time on hover or focus, and URLs become links. The tree follows the ARIA tree pattern: arrow keys move and expand, Home and End jump, Enter toggles, Space selects, * expands siblings, Cmd or Ctrl+C copies the focused value, and / focuses search. Use `renderValue` to draw leaves yourself (for example ids as links) and `actions` to add toolbar buttons.",
  previewWidth: 640,
  examples: [
    {
      name: "json-viewer-demo",
      title: "Trace span payload",
      description:
        "An HTTP server span with attributes, headers, a nested body with line items, timings, nulls, booleans, a long user agent, a timestamp and a URL. Hover a row for copy actions.",
    },
    {
      name: "json-viewer-search-demo",
      title: "Search a webhook log",
      description:
        "Four webhook deliveries searched for sku, starting one level deep. Step through matches with Enter, sort keys from the toolbar, and click any node to see the path onSelect receives.",
    },
  ],
  api: [
    ["data", "unknown", "The value to show. Dates, Maps, Sets, bigints and circular references are handled."],
    ["rootName?", "string", 'Name of the root node and the first segment of every path, e.g. "payload".'],
    ["title? / description?", "React.ReactNode", "Heading and supporting text. The payload size shows next to the title."],
    ["defaultExpandDepth?", "number", "Containers shallower than this start expanded. Defaults to 2."],
    ["defaultExpanded?", "string[]", "Paths expanded initially, instead of the depth rule."],
    ["expanded? / onExpandedChange?", "string[] | Set<string> / (expanded: string[]) => void", "Control expansion as a set of paths."],
    ["showSearch?", "boolean", "Show the search field. Defaults to true."],
    ["search? / defaultSearch? / onSearchChange?", "string / string / (search: string) => void", "Search text, controlled or not. Matches keys and values case-insensitively."],
    ["maxStringLength?", "number", "Strings longer than this are cut with an inline Show more. Defaults to 120."],
    ["pageSize?", "number", "Children rendered per container before a Show more row. Defaults to 100."],
    ["sortKeys?", "boolean | ((a: string, b: string) => number)", "Sort object keys naturally, or with your comparator."],
    ["selectedPath? / defaultSelectedPath?", "string | null", "The selected node, controlled or not."],
    ["onSelect?", "(path: string, value: unknown) => void", "Called when a node is clicked or chosen with Enter or Space."],
    ["renderValue?", "(value: unknown, path: string) => React.ReactNode | undefined", "Draw a leaf value yourself. Return undefined to keep the built-in rendering."],
    ["copyable?", "boolean", "Copy path and copy value on rows and in the status bar, plus Copy JSON. Defaults to true."],
    ["onCopy?", '(text: string, detail: { kind: "value" | "path" | "json", path: string }) => void', "Receives copied text. Without it, copies go to the clipboard."],
    ["showToolbar?", "boolean", "Expand all, Collapse all and Copy JSON. Defaults to true."],
    ["showStatusBar?", "boolean", "Path, size and copy actions for the focused node. Defaults to true."],
    ["actions?", "React.ReactNode", "Extra buttons placed before the built-in toolbar actions."],
    ["maxHeight?", "number | string", "Height limit of the tree; it scrolls beyond this."],
    ["formatDate?", "(date: Date) => string", "Formats the hint shown for ISO-8601 timestamps."],
    ["labels?", "Partial<JsonViewerLabels>", "Override any visible or accessible text."],
    ["className", "string", "Applied to the root."],
  ],
} as const;
