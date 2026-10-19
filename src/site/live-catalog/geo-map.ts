export default {
  name: "geo-map",
  title: "Geo map",
  category: "Operations",
  description:
    "A dot-matrix world map with glowing markers sized by value, status colors, and animated arcs between locations.",
  dependencies: [],
  imports: "GeoMap",
  usage: `<GeoMap
  title="Edge network"
  valueLabel="req/s"
  points={[
    { id: "lhr", label: "London", lat: 51.47, lng: -0.45, value: 79300 },
    { id: "jfk", label: "New York", lat: 40.64, lng: -73.78, value: 84600 },
    { id: "bom", label: "Mumbai", lat: 19.09, lng: 72.87, value: 52700, status: "critical" },
  ]}
  arcs={[{ id: "madrid", from: [40.42, -3.7], to: "lhr" }]}
  onSelectedChange={(id) => console.log(id)}
/>`,
  notes:
    'Pass plain latitude and longitude in decimal degrees. The map uses a Robinson projection centered on 11°E (so the seam falls in the Bering Strait) and cropped to 84°N–56°S; `projectGeo(lat, lng)` returns the same viewBox coordinates for layers you draw with `overlay`. The land is a 400 × 168 bitmap rasterised from Natural Earth outlines and embedded as a 3 KB run-length string, so nothing loads at runtime and all dots are a single path. With `density="auto"` the dot pitch stays between 2.9 and 3.8px at any width, and markers keep their pixel size while the land scales. Marker area follows `value`, nearby land glows in the marker color, critical points pulse, and arcs take a point id or `[lat, lng]` at either end. Hover or focus a marker to light its arcs, draw a crosshair, and read it in the footer readout. The map is one tab stop: arrow keys move west to east, Enter toggles selection and Escape clears it. Arc pulses and sonar stop under reduced motion or with `animated={false}`.',
  previewWidth: 760,
  examples: [
    {
      name: "geo-map-demo",
      title: "Edge network",
      description:
        "Fourteen PoPs with request rates that drift every two seconds. Users route to the nearest healthy region, so Mumbai's traffic fails over while it is critical.",
    },
    {
      name: "geo-map-regions-demo",
      title: "Customers by city",
      description:
        "Status colors with custom labels and a side list in the aside slot. Selection is controlled, so the map and the list stay in sync.",
    },
  ],
  api: [
    [
      "points",
      '{ id: string; label: string; lat: number; lng: number; value?: number; status?: "ok" | "warn" | "critical"; color?: string; pulse?: boolean; description?: string }[]',
      "One marker per location. Area follows value relative to the largest; critical points pulse unless pulse is false.",
    ],
    [
      "arcs?",
      "{ id: string; from: string | [lat, lng]; to: string | [lat, lng]; value?: number; color?: string }[]",
      "Curved connections with a travelling pulse. Ends are point ids or coordinates; value weights the stroke.",
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
      "Controls at the top right, such as a live badge.",
    ],
    [
      "density?",
      'number | "auto"',
      "Dot columns across the map, 40–480. Auto keeps a steady pitch for the rendered width.",
    ],
    [
      "dotSize?",
      "number",
      "Dot diameter as a fraction of the pitch, 0.15–1. Defaults to 0.5.",
    ],
    [
      "colors?",
      "{ land?: string; marker?: string; arc?: string; warn?: string; critical?: string }",
      "CSS colors for each layer. The same values can come from the --geo-map-* CSS variables.",
    ],
    [
      "valueLabel?",
      "string",
      'Name of the value, e.g. "req/s". Default "Value".',
    ],
    [
      "valueFormatter?",
      "(value: number) => string",
      "Formats values. Defaults to a compact number.",
    ],
    [
      "statusLabels?",
      'Partial<Record<"ok" | "warn" | "critical", string>>',
      "Rename statuses in the readout, legend and accessible labels.",
    ],
    [
      "selectedId? / defaultSelectedId?",
      "string | null",
      "Controlled or initial selection. Selected markers ring, keep the readout, and light their arcs.",
    ],
    [
      "onSelectedChange?",
      "(id: string | null, point: GeoMapPoint | null) => void",
      "Called when a marker is clicked or toggled with Enter, Space or Escape.",
    ],
    [
      "renderTooltip?",
      "(point: GeoMapPoint) => React.ReactNode",
      "Replaces the readout body for the active point.",
    ],
    ["summary?", "React.ReactNode", "Readout content when no point is active."],
    [
      "overlay?",
      "(projection: { width; height; unit; project(lat, lng) }) => React.ReactNode",
      "Draw extra SVG above the land in viewBox units. unit converts CSS pixels.",
    ],
    [
      "aside?",
      "React.ReactNode",
      "Content beside the map on wide cards and below it on narrow ones.",
    ],
    [
      "height?",
      "number",
      "Fixed map height in pixels. By default the map keeps its aspect ratio.",
    ],
    [
      "showLegend?",
      "boolean",
      "Show status counts and the value key. Defaults to true.",
    ],
    [
      "animated?",
      "boolean",
      "Animate arcs and pulses. Defaults to true; always off under reduced motion.",
    ],
    ["className?", "string", "Additional classes for the card."],
  ],
} as const;
