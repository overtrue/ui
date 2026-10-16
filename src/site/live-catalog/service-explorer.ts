export default {
  name: "service-explorer",
  title: "Service explorer",
  category: "Blocks",
  description:
    "A live service map that drives the rest of the page: pick a service to see its latency, its slowest request and a CPU flame graph.",
  dependencies: [],
  imports: "ServiceExplorer, sampleServiceExplorer",
  usage:
    '<ServiceExplorer data={sampleServiceExplorer} defaultSelectedId="checkout" />',
  notes:
    "Pass the map's `nodes` and `edges`, and a `services` record with each service's latency samples, an optional objective, a CPU profile as a `FlameNode` tree, and the slowest request as any JSON value. Nodes without an entry, such as clients and databases, can still be selected and show a hint. Selection is uncontrolled by default; pass `selectedId` and `onSelect` to sync it with the URL or another panel. The detail panels remount when the service changes, so zoom and search start fresh. Every panel is an ordinary overtrue/ui component you can rearrange in the installed file. `sampleServiceExplorer` is fictional demo data.",
  previewWidth: 1180,
  previewHeight: 1240,
  examples: [
    {
      name: "service-explorer-demo",
      title: "Checkout platform",
      description:
        "Checkout is selected. Pick Payments to see the provider retries behind its error rate, or any other service on the map.",
    },
  ],
  api: [
    [
      "data",
      "ServiceExplorerData",
      "Title, description, service map nodes and edges, and per-service latency, objective, profile and slowest request.",
    ],
    ["selectedId", "string | null", "Controlled selection."],
    ["defaultSelectedId", "string | null", "Initial selection when uncontrolled."],
    ["onSelect", "(id: string | null) => void", "Called when a service is selected or cleared."],
    ["actions", "ReactNode", "Controls for the header."],
  ],
} as const;
