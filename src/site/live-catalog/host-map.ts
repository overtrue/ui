export default {
  name: "host-map",
  title: "Host map",
  category: "Operations",
  description:
    "A dense fleet map with one cell per host, coloured by load or health and grouped by region, so hot spots stand out at a glance.",
  dependencies: [],
  imports: "HostMap",
  usage: `<HostMap
  title="Fleet CPU"
  metricLabel="CPU"
  hosts={[
    { id: "web-1", name: "web-use1-01", group: "us-east-1", value: 0.42 },
    { id: "web-2", name: "web-use1-02", group: "us-east-1", value: 0.93 },
    { id: "api-1", name: "api-euw1-01", group: "eu-west-1", value: 0.31 },
    { id: "api-2", name: "api-euw1-02", group: "eu-west-1", status: "offline" },
  ]}
  onSelect={(host) => console.log(host.name)}
/>`,
  notes:
    "Pass the metric as a 0–1 fraction. Below the warn threshold cells ramp up the chart colour; above it they turn amber, and at the critical threshold they switch to the destructive colour with a soft pulse that stops under reduced motion. Status comes from `status` when you have real health checks, otherwise from `value` and `thresholds`; offline hosts always draw as an empty dashed cell. The readout sits in the card, so it never clips at the viewport edge. The map is a single tab stop: arrow keys follow the visual layout across groups, and Enter calls `onSelect`. For more than a few hundred hosts use `cellSize=\"sm\"`.",
  previewWidth: 640,
  previewHeight: 400,
  examples: [
    {
      name: "host-map-demo",
      title: "Fleet CPU by region",
      description:
        "104 hosts across three regions with live CPU that drifts every two seconds and pauses while the tab is hidden.",
    },
    {
      name: "host-map-status-demo",
      title: "Node health",
      description:
        "Colour by status instead of load. The legend doubles as a summary; pick a status to isolate those nodes, and select a node to pin it.",
    },
  ],
  api: [
    [
      "hosts",
      '{ id: string; name: string; group?: string; value?: number; status?: "ok" | "warn" | "critical" | "offline" }[]',
      "One cell per host. Hosts sharing a group are drawn together in order of appearance.",
    ],
    [
      "colorBy?",
      '"value" | "status"',
      "Colour by the 0–1 metric or by health. Defaults to value.",
    ],
    ["metricLabel?", "string", 'Name of the metric, e.g. "CPU". Default "Load".'],
    [
      "valueFormatter?",
      "(value: number) => string",
      "Formats a 0–1 value. Defaults to a whole percent.",
    ],
    [
      "thresholds?",
      "{ warn: number; critical: number }",
      "Where cells turn warm and critical, and how status is derived from value. Default 0.7 and 0.9.",
    ],
    ["title?", "React.ReactNode", "Card heading. Also labels the map when it is a string."],
    ["description?", "React.ReactNode", "Supporting text under the title."],
    ["actions?", "React.ReactNode", "Controls under the heading, such as a metric picker."],
    ["cellSize?", '"sm" | "md"', "10px or 14px cells. Defaults to md."],
    ["groupOrder?", "string[]", "Order groups explicitly; others follow in order of appearance."],
    ["selectedId?", "string | null", "Ring one host as selected and expose pressed state."],
    [
      "onSelect?",
      "(host: HostMapHost) => void",
      "Called when a host is clicked or activated with Enter or Space.",
    ],
    ["showLegend?", "boolean", "Show the scale, or the status summary in status mode. Defaults to true."],
    ["unit?", "[singular: string, plural: string]", 'Noun for a cell. Default ["host", "hosts"].'],
    ["className?", "string", "Additional classes for the card."],
  ],
} as const;
