export default {
  name: "cohort-grid",
  title: "Cohort grid",
  category: "Data display",
  description:
    "A retention triangle that shows how each signup cohort holds on over time, with a crosshair readout for exact numbers.",
  dependencies: [],
  imports: "CohortGrid",
  usage: `<CohortGrid
  title="Subscriber retention"
  cohorts={[
    { id: "jan", label: "Jan 2026", size: 1284, values: [1, 0.64, 0.52, 0.46] },
    { id: "feb", label: "Feb 2026", size: 1410, values: [1, 0.65, 0.52, null] },
    { id: "mar", label: "Mar 2026", size: 1562, values: [1, 0.64, null, null] },
  ]}
  showAverage
  showLegend
/>`,
  notes:
    "Pass retention as 0–1 fractions, oldest cohort first, and use null for periods that have not happened yet so they read as pending rather than zero. Colour always follows retention, even in count mode, and the scale skips period 0 (usually 100%) so the decay after it uses the full ramp; pass `domain` to pin it. Cell text picks light or dark ink from the fill itself, so any chart colour stays readable. The average row is weighted by cohort size and only counts cohorts that reached each period. The grid is one tab stop: arrow keys, Home/End, Ctrl+Home/End and Page Up/Down move between cells, the label column stays pinned while the matrix scrolls on narrow screens, and Enter calls `onCellSelect`.",
  previewWidth: 680,
  previewHeight: 420,
  examples: [
    {
      name: "cohort-grid-demo",
      title: "Subscriber retention",
      description:
        "Eight monthly cohorts with a weighted average row and a colour scale. Hover or tab into a cell to see the retained count.",
    },
    {
      name: "cohort-grid-weekly-demo",
      title: "Weekly return rate",
      description:
        "Switch between percentages and people with a segmented control, and pick a cell to follow up on.",
    },
  ],
  api: [
    [
      "cohorts",
      "{ id: string; label: string; size: number; values: (number | null)[] }[]",
      "One row per cohort. Values are 0–1 retention fractions per period; null marks a pending period.",
    ],
    [
      "periods?",
      "string[]",
      "Column labels. Defaults to M0, M1, … for the longest cohort.",
    ],
    [
      "mode?",
      '"percent" | "count"',
      "Show retention or retained people (size × retention, rounded). Defaults to percent.",
    ],
    [
      "showAverage?",
      "boolean",
      "Add a size-weighted average row. In count mode it shows the total retained.",
    ],
    [
      "showLegend?",
      "boolean",
      "Show the colour scale and the pending-period key.",
    ],
    ["title?", "React.ReactNode", "Card heading. Also labels the grid when it is a string."],
    ["description?", "React.ReactNode", "Supporting text under the title."],
    ["actions?", "React.ReactNode", "Controls at the top right, such as a percent/count toggle."],
    [
      "valueFormatter?",
      "(value: number) => string",
      "Formats a retention fraction everywhere. Defaults to whole percents in cells and one decimal in the readout.",
    ],
    [
      "countFormatter?",
      "(count: number) => string",
      "Formats people counts everywhere. Defaults to compact cells from 1,000 and exact counts in the readout.",
    ],
    ["color?", "string", "Any CSS colour for the fill. Defaults to var(--color-chart-1)."],
    [
      "domain?",
      "[number, number]",
      "Retention mapped to the lightest and strongest fill. Defaults to the range of the periods after period 0.",
    ],
    ["cohortLabel? / sizeLabel?", "string", 'Column headings. Default "Cohort" and "Users".'],
    ["unit?", "string", 'Noun for people in the readout and cell labels. Default "users".'],
    ["averageLabel?", "string", "Label for the average row."],
    [
      "onCellSelect?",
      "(cell: CohortGridCell) => void",
      "Called when a cell with data is clicked or activated with Enter or Space.",
    ],
    ["className?", "string", "Additional classes for the card."],
  ],
} as const;
