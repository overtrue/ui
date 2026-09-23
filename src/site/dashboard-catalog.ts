export const dashboardCatalog = [
  {
    name: "corner-frame",
    title: "Content frame",
    category: "Layout",
    description:
      "Give an announcement or a short project brief a restrained visual boundary.",
    dependencies: [],
    imports: "CornerFrame",
    usage:
      '<CornerFrame cornerColor="var(--color-chart-1)" className="p-8">\n  Framed content\n</CornerFrame>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "corner-frame-demo",
        title: "A note for the team",
        description:
          "Frame a studio update or a project handoff without adding a heavy card.",
      },
    ],
    api: [
      ["cornerSize?", "number", "Length of each registration mark, in pixels."],
      ["cornerColor?", "string", "Any CSS color used for the corner marks."],
      [
        "bordered?",
        "boolean",
        "Show a quiet hairline around the framed content.",
      ],
    ],
  },
  {
    name: "command-palette",
    title: "Workspace commands",
    category: "Navigation",
    description:
      "Help people jump to a project, find a record, or start their next task from the keyboard.",
    dependencies: [],
    imports: "CommandPalette, useCommandPaletteShortcut",
    usage:
      'function CommandMenu() {\n  const [open, setOpen] = React.useState(false)\n  const [selected, setSelected] = React.useState("")\n  useCommandPaletteShortcut(setOpen)\n  return <>\n    <button type="button" onClick={() => setOpen(true)}>Open commands</button>\n    <CommandPalette open={open} onOpenChange={setOpen}\n      groups={[{ heading: "Navigation", items: [{ id: "projects", label: "Projects" }, { id: "people", label: "People" }] }]}\n      onSelect={item => { setSelected(item.label); setOpen(false) }}\n    />\n    <p role="status">{selected && \'Selected: \' + selected}</p>\n  </>\n}',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "command-palette-demo",
        title: "Find your next task",
        description:
          "Jump between the studio overview, client records, and delivery reports.",
      },
      {
        name: "command-palette-inline-demo",
        title: "Search inside a workspace",
        description:
          "Keep the most useful destinations close to the page content.",
      },
      {
        name: "command-palette-compact-demo",
        title: "Account shortcuts",
        description:
          "A smaller menu for everyday account and workspace settings.",
      },
      {
        name: "command-palette-grid-demo",
        title: "Workspace destinations",
        description:
          "Give each destination a short label and a useful piece of context.",
      },
    ],
    api: [
      ["groups", "CommandPaletteGroup[]", ""],
      ["variant?", '"dialog" | "inline"', ""],
      [
        "layout?",
        '"list" | "grid"',
        "Arrange results as familiar command rows or as an app-launcher grid.",
      ],
      [
        "density?",
        '"compact" | "default"',
        "Tighten list rows for dense navigation menus.",
      ],
      ["size?", '"compact" | "default" | "wide"', ""],
      ["open?", "boolean", ""],
      ["onOpenChange?", "(open: boolean) => void", ""],
      ["placeholder?", "string", ""],
      ["emptyLabel?", "React.ReactNode", ""],
      ["title?", "string", ""],
      ["description?", "string", ""],
      ["footer?", "React.ReactNode", ""],
      ["className?", "string", ""],
      ["onSelect?", "(item: CommandPaletteItem) => void", ""],
    ],
    exampleImports: 'import * as React from "react"',
  },
  {
    name: "kpi-card",
    title: "KPI card",
    category: "Data display",
    description:
      "Keep the current value, comparison period, and direction together in one compact summary.",
    dependencies: [],
    imports: "KpiCard",
    usage:
      '<KpiCard\n  label="Booked work"\n  value={36800}\n  format="currency"\n  delta={0.128}\n  deltaLabel="vs. last 30 days"\n  trend={[24200, 25800, 27900, 30400, 32100, 34500, 36800]}\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 800,
    examples: [
      {
        name: "kpi-card-demo",
        title: "The studio at a glance",
        description:
          "Booked work, client relationships, rework, and items waiting for review.",
      },
      {
        name: "kpi-card-delivery-demo",
        title: "A delivery report that moves together",
        description:
          "Switch between weekly and monthly results. Values, comparisons, and booked-work trends update as one report.",
      },
    ],
    api: [
      ["label", "string", 'Metric name, e.g. "Revenue".'],
      [
        "value",
        "number | string",
        "Current value. Numbers are formatted with `format`; strings render as-is.",
      ],
      [
        "delta?",
        "number",
        "Fractional change vs. the previous period, e.g. 0.124 for +12.4%.",
      ],
      [
        "deltaLabel?",
        "string",
        'Context for the delta, e.g. "vs. last 30 days".',
      ],
      [
        "trend?",
        "number[]",
        "Series for the sparkline. Rendered when it has two or more points.",
      ],
      ["format?", "NumberFormat", ""],
      [
        "currency?",
        "string",
        'ISO 4217 code, used when `format` is "currency".',
      ],
      [
        "invertDelta?",
        "boolean",
        "Treat a decrease as good and an increase as bad (churn, latency, errors).",
      ],
      ["icon?", "React.ReactNode", "Optional icon shown before the label."],
      ["children?", "React.ReactNode", ""],
    ],
  },
  {
    name: "trend-chart",
    title: "Trend chart",
    category: "Data display",
    description:
      "Compare changes over time with the chart style that fits the question.",
    dependencies: [],
    imports: "TrendChart",
    usage:
      '<TrendChart\n  data={[{ date: "Mon", desktop: 120, mobile: 80 }, { date: "Tue", desktop: 160, mobile: 110 }, { date: "Wed", desktop: 140, mobile: 95 }]}\n  xKey="date"\n  series={[\n    { key: "desktop", label: "Desktop" },\n    { key: "mobile", label: "Mobile" },\n  ]}\n  showLegend\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "trend-chart-demo",
        title: "Requests and deliveries",
        description:
          "Compare incoming requests with completed deliverables over two weeks.",
      },
      {
        name: "trend-chart-line-demo",
        title: "Review turnaround",
        description: "Watch the typical and slower review times together.",
      },
      {
        name: "trend-chart-dots-demo",
        title: "Average project value",
        description:
          "A sparse point chart makes changes in quoted work easy to pick out.",
      },
      {
        name: "trend-chart-bar-demo",
        title: "Work by engagement",
        description:
          "Compare retained work, individual projects, and short advisory engagements.",
      },
      {
        name: "trend-chart-grouped-demo",
        title: "This week in production",
        description:
          "Compare completed work with the previous week, day by day.",
      },
      {
        name: "trend-chart-horizontal-demo",
        title: "Where time goes",
        description: "Rank the studio disciplines by their booked hours.",
      },
    ],
    api: [
      ["data", "Record<string, unknown>[]", ""],
      ["xKey", "string", "Key of the x-axis value in each row."],
      ["series", "TrendSeries[]", ""],
      ["type?", '"area" | "line" | "bar"', ""],
      [
        "fill?",
        '"gradient" | "dots"',
        "Area fill: a plain gradient, or a dot grid that fades out toward the line.",
      ],
      [
        "layout?",
        '"vertical" | "horizontal"',
        'Bars only: "horizontal" runs bars left to right with categories down the side.',
      ],
      [
        "barRadius?",
        'number | "full"',
        'Bars only: corner radius in px, or "full" for pill-shaped bars.',
      ],
      [
        "barSize?",
        "number",
        "Bars only: thickness of each bar in px. Defaults to a share of the category width.",
      ],
      ["stacked?", "boolean", ""],
      ["showLegend?", "boolean", ""],
      ["legendPosition?", '"top" | "bottom"', ""],
      ["legendAlign?", '"left" | "center" | "right"', ""],
      ["showGrid?", "boolean", ""],
      [
        "showYAxis?",
        "boolean",
        "Show the value axis. In the horizontal layout this is the axis along the bottom.",
      ],
      [
        "yDomain?",
        'React.ComponentProps<typeof YAxis>["domain"]',
        'Recharts domain for the value axis, e.g. ["dataMin", "dataMax"] or ["auto", "auto"]. Defaults to [0, "auto"].',
      ],
      ["xFormatter?", "(value: unknown) => string", ""],
      ["yFormatter?", "(value: number) => string", ""],
      [
        "animate?",
        "boolean",
        "Animate series after hydration and when data changes. Respects reduced motion.",
      ],
      ["animationDuration?", "number", ""],
    ],
  },
  {
    name: "bar-chart",
    title: "Grouped bars",
    category: "Data display",
    description:
      "Organize related observations into periods and call out the group that needs attention.",
    dependencies: [],
    imports: "BarChart",
    usage:
      '<BarChart\n  data={[{ week: "W1", month: "Feb", spend: 1200 }, { week: "W2", month: "Feb", spend: 1800 }, { week: "W3", month: "Mar", spend: 2100 }]}\n  xKey="week"\n  yKey="spend"\n  groupKey="month"\n  color="var(--color-orange-500)"\n  highlight={(row) => row.month === "Mar"}\n  yFormatter={(value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)}\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "bar-chart-demo",
        title: "Production spend",
        description:
          "Compare weekly costs within each month and highlight a busy period.",
      },
      {
        name: "bar-chart-striped-demo",
        title: "Reserved capacity",
        description:
          "Use a second fill treatment to distinguish planned capacity.",
      },
    ],
    api: [
      ["data", "BarRow[]", ""],
      ["xKey", "string", "Key of the x-axis value in each row."],
      ["yKey", "string", "Key of the bar value in each row."],
      [
        "groupKey?",
        "string",
        'Key of a coarser label, e.g. "month" for weekly rows. When set, the x-axis\nshows one tick per group centered under its bars instead of a tick per bar.',
      ],
      [
        "variant?",
        '"gradient" | "striped" | "solid"',
        '"gradient" fades each bar toward the bottom; "striped" fills it with diagonal bands.',
      ],
      [
        "color?",
        "string",
        "Any CSS color for highlighted bars. Defaults to chart-1.",
      ],
      [
        "mutedColor?",
        "string",
        "Any CSS color for bars that are not highlighted. Defaults to the muted foreground.",
      ],
      [
        "highlight?",
        "(row: BarRow, index: number) => boolean",
        "Return true for bars drawn in color. Every bar is highlighted when omitted.",
      ],
      ["grid?", '"dashed" | "solid" | "none"', ""],
      ["showYAxis?", "boolean", ""],
      ["showTooltip?", "boolean", ""],
      [
        "showActiveMarker?",
        "boolean",
        "Draw a hollow ring on top of the hovered bar.",
      ],
      ["barRadius?", "number", ""],
      [
        "animate?",
        "boolean",
        "Animate bars after hydration and when data changes. Respects reduced motion.",
      ],
      ["animationDuration?", "number", ""],
      [
        "referenceLines?",
        "BarReferenceLine[]",
        "Horizontal lines, e.g. a goal or an average. The y-axis extends to fit them.",
      ],
      ["xFormatter?", "(value: unknown) => string", ""],
      ["yFormatter?", "(value: number) => string", ""],
      [
        "tooltipLabel?",
        "(row: BarRow, index: number) => React.ReactNode",
        "Secondary line of the tooltip. Defaults to the formatted x value.",
      ],
      ["onBarClick?", "(row: BarRow, index: number) => void", ""],
    ],
  },
  {
    name: "advanced-data-table",
    title: "Interactive table",
    category: "Data display",
    description:
      "Build record views with filtering, selection, column controls, and actions close to the data.",
    dependencies: [],
    imports: "DataTable, DataTableColumnHeader, createDataTableColumnHelper",
    usage:
      'function TrafficTable() {\n  const rows = [{ path: "/", views: 48210 }, { path: "/pricing", views: 21480 }]\n  const helper = createDataTableColumnHelper<(typeof rows)[number]>()\n  const columns = helper.columns([\n    helper.accessor("path", {\n      header: ({ column }) => <DataTableColumnHeader column={column} title="Page" />,\n    }),\n    helper.accessor("views", {\n      header: ({ column }) => <DataTableColumnHeader column={column} title="Views" align="right" />,\n      cell: ({ row }) => <div className="text-right">{row.original.views}</div>,\n    }),\n  ])\n  return <DataTable columns={columns} data={rows} searchKey="path" />\n}',
    notes:
      "Uses your application theme and a separate API from the compact data-table component. Search has an accessible label and clear action; searchLabel overrides the default column name. Empty filtered views offer Clear filters unless you supply emptyMessage. Pagination adapts to the container width. Replace sample data and connect callbacks to your workflow.",
    previewWidth: 800,
    examples: [
      {
        name: "data-table-demo",
        title: "Workspace traffic",
        description:
          "Sort and filter page activity without leaving the report.",
      },
      {
        name: "data-table-loading-demo",
        title: "Enquiry sources",
        description:
          "Keep the table structure visible while a report refreshes.",
      },
      {
        name: "data-table-selection-demo",
        title: "Client invoices",
        description:
          "Select individual invoices or a range before taking a batch action.",
      },
      {
        name: "data-table-row-actions-demo",
        title: "Integration access",
        description:
          "Copy a demo key ID, edit its scope, or confirm revoking access from either row menu.",
      },
      {
        name: "data-table-sticky-demo",
        title: "Campaign performance",
        description:
          "Keep context in view while scrolling across a wider report.",
      },
      {
        name: "data-table-reorder-demo",
        title: "Studio practices",
        description:
          "Arrange the columns to fit the question you are reviewing.",
      },
      {
        name: "data-table-compact-demo",
        title: "Search interests",
        description: "A dense view of how people discover the studio.",
      },
      {
        name: "data-table-composed-demo",
        title: "Client requests",
        description:
          "Combine search, column controls, records, and pagination in one working view.",
      },
      {
        name: "data-table-billing-demo",
        title: "A small billing workspace",
        description:
          "Filter by payment status, settle a sample invoice, and preview an empty view. The unpaid balance stays in sync.",
      },
    ],
    api: [
      [
        "searchKey?",
        "string",
        "Column id to filter with the search input. Omit to hide the input.",
      ],
      ["searchPlaceholder?", "string", ""],
      [
        "searchLabel?",
        "string",
        "Accessible search name; defaults to the column label.",
      ],
      [
        "toolbar?",
        "React.ReactNode",
        "Extra toolbar content, rendered between the search input and view options.",
      ],
      ["showViewOptions?", "boolean", ""],
      ["showPagination?", "boolean", ""],
      ["pageSizeOptions?", "number[]", ""],
      [
        "emptyMessage?",
        "React.ReactNode",
        "Replace the default empty state, including its filter recovery action.",
      ],
      [
        "loading?",
        "boolean",
        "Swap the rows for a skeleton, e.g. on first load.",
      ],
      [
        "pending?",
        "boolean",
        "Dim the existing rows and disable their pointer and keyboard interactions while refreshing.",
      ],
      ["skeletonRows?", "number", ""],
      ["stickyHeader?", "boolean", ""],
      [
        "maxHeight?",
        "number | string",
        'Caps the scroll area, e.g. 420 or "60vh". Pair it with stickyHeader.',
      ],
      [
        "reorderable?",
        "boolean | string[]",
        "Let columns be dragged into a new order. Pass ids to limit which ones.",
      ],
      [
        "density?",
        "DataTableDensity",
        "compact, default, or relaxed header and cell spacing.",
      ],
      [
        "onRowClick?",
        "(row: DataTableRow<TData>) => void",
        "Activate a row by click, Enter, or Space. Nested controls keep their own actions.",
      ],
      ["rowClassName?", "(row: DataTableRow<TData>) => string | undefined", ""],
      [
        "rowProps?",
        '(row: DataTableRow<TData>) => React.ComponentProps<"tr">',
        "Anything else to put on a row, e.g. a data attribute or a handler.",
      ],
      [
        "renderRow?",
        "(\n    row: DataTableRow<TData>,\n    element: React.ReactElement,\n  ) => React.ReactNode",
        "Wrap the row element, e.g. in a context menu trigger.",
      ],
      [
        "selectionActions?",
        "React.ReactNode",
        "Actions shown in the bar that appears while rows are selected.",
      ],
    ],
  },
  {
    name: "funnel-chart",
    title: "Conversion stages",
    category: "Data display",
    description:
      "Follow work through successive stages and see where the biggest drop occurs.",
    dependencies: [],
    imports: "FunnelChart",
    usage:
      '<FunnelChart\n  steps={[\n    { name: "Visited pricing", value: 12480 },\n    { name: "Started signup", value: 4920 },\n    { name: "Upgraded to Pro", value: 412 },\n  ]}\n/>\n\n<FunnelChart\n  variant="flow"\n  steps={[\n    { name: "Link opened", value: 197, color: "var(--color-lime-400)" },\n    { name: "Started", value: 110, color: "var(--color-blue-500)" },\n    { name: "Converted", value: 38, color: "var(--color-pink-500)" },\n  ]}\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "funnel-chart-demo",
        title: "From enquiry to project",
        description:
          "Follow a client enquiry through discovery, proposal, and a booked engagement.",
      },
      {
        name: "funnel-chart-flow-demo",
        title: "A review cycle",
        description: "Track a brief from opening through feedback to approval.",
      },
      {
        name: "funnel-chart-sharp-demo",
        title: "The project pipeline",
        description:
          "Compare the number of opportunities remaining at each stage.",
      },
    ],
    api: [
      ["steps", "FunnelStep[]", ""],
      ["valueFormatter?", "(value: number) => string", ""],
      [
        "color?",
        "string",
        'Any CSS color. "bars" fades it step by step. "flow" paints every stage in\nit, in place of the per-stage palette.',
      ],
      [
        "showDropoff?",
        "boolean",
        "Show the drop-off between consecutive steps. Bars only.",
      ],
      [
        "variant?",
        '"bars" | "flow"',
        '"bars" stacks one bar per step; "flow" runs the steps left to right, each tapering into the next.',
      ],
      [
        "shape?",
        '"eased" | "sharp"',
        'Flow only. "eased" curves each neck; "sharp" draws straight trapezoids.',
      ],
      ["height?", "number", "Flow only. Height of the stages in pixels."],
      [
        "neckWidth?",
        "number",
        "Flow only. Width of the neck between stages in pixels.",
      ],
      [
        "showPercentages?",
        "boolean",
        "Flow only. Show the share of the first step as a pill on each stage.",
      ],
      [
        "showLabels?",
        "boolean",
        "Flow only. Show a tile with the name and value under each stage.",
      ],
      [
        "activeIndex?",
        "number | null",
        "Flow only. Stage drawn at full strength while the rest dim.",
      ],
      ["onActiveIndexChange?", "(index: number | null) => void", ""],
    ],
  },
  {
    name: "bar-list",
    title: "Ranked bars",
    category: "Data display",
    description:
      "Compare the busiest destinations or highest-volume workstreams without a full chart.",
    dependencies: [],
    imports: "BarList",
    usage:
      '<BarList\n  data={[\n    { name: "/", value: 48210, href: "/analytics?page=/" },\n    { name: "/pricing", value: 21480 },\n  ]}\n  showPercentage\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "bar-list-demo",
        title: "Popular workspace pages",
        description: "A compact ranking of the pages the team visits most.",
      },
    ],
    api: [
      ["data", "BarListItem[]", ""],
      ["valueFormatter?", "(value: number) => string", ""],
      ["sortOrder?", '"descending" | "ascending" | "none"', ""],
      ["color?", "string", "Any CSS color. Defaults to chart-1."],
      [
        "showPercentage?",
        "boolean",
        "Show each row's share of the total next to its value.",
      ],
      ["onItemClick?", "(item: BarListItem) => void", ""],
    ],
  },
  {
    name: "distribution-bar",
    title: "Distribution bar",
    category: "Data display",
    description:
      "Show how a total is divided among categories in a single horizontal strip.",
    dependencies: [],
    imports: "DistributionBar",
    usage:
      '<DistributionBar\n  segments={[\n    { name: "Desktop", value: 61400 },\n    { name: "Mobile", value: 34200 },\n    { name: "Tablet", value: 4100 },\n  ]}\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "distribution-bar-demo",
        title: "Work by discipline",
        description:
          "See the share of design, engineering, research, and operations.",
      },
    ],
    api: [
      ["segments", "DistributionSegment[]", ""],
      ["valueFormatter?", "(value: number) => string", ""],
      ["showLegend?", "boolean", ""],
      [
        "showValues?",
        "boolean",
        "Show absolute values in the legend in addition to the share.",
      ],
    ],
  },
  {
    name: "activity-heatmap",
    title: "Activity calendar",
    category: "Data display",
    description:
      "Reveal working-day patterns and quieter weeks across a year of activity.",
    dependencies: [],
    imports: "ActivityHeatmap",
    usage:
      '<ActivityHeatmap\n  data={[\n    { date: "2026-09-01", value: 12 },\n    { date: "2026-09-02", value: 3 },\n  ]}\n  unit="deploys"\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 800,
    examples: [
      {
        name: "activity-heatmap-demo",
        title: "A year of deliveries",
        description:
          "Working days, quieter weekends, and gaps in delivery activity.",
      },
    ],
    api: [
      ["data", "ActivityDatum[]", ""],
      ["endDate?", "Date", "Last day shown. Defaults to today."],
      [
        "weeks?",
        "number",
        "Number of week columns. Ignored when `startDate` is set.",
      ],
      ["startDate?", "Date", "First day shown. Overrides `weeks`."],
      [
        "color?",
        "string",
        "Any CSS color. Levels are mixed from this and `--muted`. Defaults to chart-1.",
      ],
      [
        "colors?",
        "string[]",
        "Explicit color per level, from empty to most active.\nOverrides `color`. Length sets the number of levels.",
      ],
      [
        "scale?",
        '"linear" | "sqrt"',
        "How values map to levels. `sqrt` spreads out small values.",
      ],
      ["cellSize?", "number", "Cell size in px."],
      ["gap?", "number", "Gap between cells in px."],
      ["valueFormatter?", "(value: number) => string", ""],
      ["unit?", "string", 'Label for the value in the tooltip, e.g. "events".'],
      ["showMonthLabels?", "boolean", ""],
      [
        "weekdayLabels?",
        '"mwf" | "all" | "none"',
        "Which weekday labels to show along the left edge.",
      ],
      ["showLegend?", "boolean", ""],
      [
        "scrollToEnd?",
        "boolean",
        "Scroll to the most recent weeks when the grid overflows.",
      ],
      [
        "renderTooltip?",
        "(datum: { date: Date; value: number }) => React.ReactNode",
        "Replace the tooltip body. Return `null` to hide it for that cell.",
      ],
      ["onCellClick?", "(datum: { date: Date; value: number }) => void", ""],
    ],
  },
  {
    name: "trend-sparkline",
    title: "Inline trend",
    category: "Data display",
    description:
      "Add just enough history to a number without introducing a chart axis.",
    dependencies: [],
    imports: "Sparkline",
    usage:
      '<Sparkline data={[12, 18, 14, 22, 26, 21, 30]} className="h-8 w-24" />',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow. This component has a separate API from the existing sparkline component. ",
    previewWidth: 560,
    examples: [
      {
        name: "sparkline-demo",
        description:
          "Use the same history with different marks to suit its surrounding content.",
        title: "Trends at a glance",
      },
    ],
    api: [
      ["data", "number[]", "Series to plot, oldest first."],
      ["variant?", '"area" | "line"', ""],
      [
        "fill?",
        '"gradient" | "dots"',
        "Area fill: a plain gradient, or a dot grid that fades out toward the line.",
      ],
      ["color?", "string", "Any CSS color. Defaults to the theme primary."],
      ["curve?", '"monotone" | "linear" | "step"', ""],
      ["strokeWidth?", "number", ""],
      [
        "animate?",
        "boolean",
        "Animate after hydration and when data changes. Respects reduced motion.",
      ],
      ["animationDuration?", "number", ""],
    ],
  },
  {
    name: "composed-chart",
    title: "Combined chart",
    category: "Data display",
    description:
      "Put actuals, targets, and supporting measures on the same reporting surface.",
    dependencies: [],
    imports: "ComposedChart",
    usage:
      '<ComposedChart\n  data={[{ month: "Jan", sales: 36000, goal: 40000 }, { month: "Feb", sales: 42000, goal: 45000 }, { month: "Mar", sales: 51000, goal: 50000 }]}\n  xKey="month"\n  series={[\n    { key: "sales", label: "Sales", type: "area", highlightMax: true },\n    { key: "goal", label: "Goal", type: "line", dashed: true },\n  ]}\n  referenceLines={[{ y: 50000, label: "Target" }]}\n  showYAxis\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "composed-chart-demo",
        title: "Booked work against plan",
        description: "Show revenue and its target on the same monthly report.",
      },
      {
        name: "composed-chart-dual-axis-demo",
        title: "Enquiries and booked work",
        description:
          "Compare volume and revenue while keeping their units separate.",
      },
      {
        name: "composed-chart-hatched-demo",
        title: "Delivery costs",
        description:
          "Separate production and external services with two distinct fills.",
      },
    ],
    api: [
      ["data", "Record<string, unknown>[]", ""],
      ["xKey", "string", "Key of the x-axis value in each row."],
      ["series", "ComposedSeries[]", ""],
      ["referenceLines?", "ReferenceLineSpec[]", ""],
      ["showGrid?", "boolean", ""],
      ["showYAxis?", "boolean", ""],
      ["showLegend?", "boolean", ""],
      ["showTooltip?", "boolean", ""],
      ["xFormatter?", "(value: unknown) => string", ""],
      ["yFormatter?", "(value: number) => string", ""],
      ["rightYFormatter?", "(value: number) => string", ""],
      ["barRadius?", "number", ""],
      [
        "animate?",
        "boolean",
        "Animate series after hydration and when their data changes. Respects reduced motion.",
      ],
      ["animationDuration?", "number", ""],
      [
        "yDomain?",
        '"zero" | "auto" | [number, number]',
        '"zero" starts the y-axis at 0; "auto" fits it to the data.',
      ],
    ],
  },
  {
    name: "donut-chart",
    title: "Share chart",
    category: "Data display",
    description:
      "Explain the makeup of a total with a center summary and a readable legend.",
    dependencies: [],
    imports: "DonutChart",
    usage:
      '<DonutChart\n  data={[\n    { name: "Chrome", value: 58400 },\n    { name: "Safari", value: 21300 },\n    { name: "Firefox", value: 8900 },\n  ]}\n  centerLabel="Visitors"\n  showLegend\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "donut-chart-demo",
        title: "How clients find us",
        description: "Compare referral sources and the share each contributes.",
      },
      {
        name: "donut-chart-half-demo",
        title: "Booked revenue mix",
        description:
          "Split booked work across ongoing clients, new projects, and advisory work.",
      },
    ],
    api: [
      ["data", "DonutSlice[]", ""],
      [
        "innerRadius?",
        "number",
        "Inner radius as a fraction of the outer radius. 0 draws a pie.",
      ],
      [
        "centerLabel?",
        "React.ReactNode",
        "Label shown in the middle, under the value.",
      ],
      [
        "centerValue?",
        "React.ReactNode",
        "Value shown in the middle. Defaults to the total.",
      ],
      ["valueFormatter?", "(value: number) => string", ""],
      ["showLegend?", "boolean", ""],
      ["showTooltip?", "boolean", ""],
      [
        "startAngle?",
        "number",
        "Angle where the first slice starts, in degrees.",
      ],
      ["sweep?", "number", "Total sweep in degrees. 180 draws a half donut."],
      ["paddingAngle?", "number", ""],
      [
        "animate?",
        "boolean",
        "Animate slices after hydration and when data changes. Respects reduced motion.",
      ],
      ["animationDuration?", "number", ""],
    ],
  },
  {
    name: "radial-gauge",
    title: "Radial gauge",
    category: "Data display",
    description:
      "Use a compact dial to summarize a target, utilization level, or service measure.",
    dependencies: [],
    imports: "RadialGauge",
    usage:
      '<RadialGauge value={99.7} segments={40} size={180} thickness={12}>\n  <span className="text-2xl font-semibold">99.7%</span>\n  <span className="text-muted-foreground text-xs">Uptime</span>\n</RadialGauge>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "radial-gauge-demo",
        title: "Delivery health",
        description:
          "Compact summaries for availability, review coverage, and completion.",
      },
      {
        name: "radial-gauge-inline-demo",
        title: "Service pulse",
        description:
          "A small status row for latency, failures, and request volume.",
      },
    ],
    api: [
      ["value", "number", ""],
      ["min?", "number", ""],
      ["max?", "number", ""],
      ["size?", "number", "Diameter in pixels."],
      ["thickness?", "number", "Stroke width in pixels."],
      [
        "segments?",
        "number",
        "Number of arc segments. 0 draws a continuous arc.",
      ],
      ["gap?", "number", "Gap between segments in degrees."],
      [
        "startAngle?",
        "number",
        "Angle where the arc starts, in degrees clockwise from 12 o'clock.",
      ],
      [
        "sweep?",
        "number",
        "Total sweep of the arc in degrees. 180 is a semicircle, 360 a ring.",
      ],
      ["color?", "string", "Any CSS color. Defaults to chart-1."],
      ["trackColor?", "string", ""],
      [
        "animate?",
        "boolean",
        "Reveal filled segments in sequence when the gauge mounts.",
      ],
      ["animationDuration?", "number", "Total reveal time in milliseconds."],
      [
        "children?",
        "React.ReactNode",
        "Content rendered in the middle of the gauge.",
      ],
    ],
  },
  {
    name: "segmented-meter",
    title: "Capacity zones",
    category: "Data display",
    description:
      "Place a live value against named operating ranges and highlight its current zone.",
    dependencies: [],
    imports: "SegmentedMeter",
    usage:
      '<SegmentedMeter\n  value={142}\n  zones={[\n    { label: "Rest", from: 60, to: 110 },\n    { label: "Fat burn", from: 110, to: 140 },\n    { label: "Cardio", from: 140, to: 170 },\n    { label: "Peak", from: 170, to: 190 },\n  ]}\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "segmented-meter-demo",
        title: "Team capacity",
        description:
          "Locate booked time within clear availability and overload bands.",
      },
      {
        name: "segmented-meter-planner-demo",
        title: "Plan the next commitment",
        description:
          "Adjust booked hours to see the remaining capacity and when the team should protect its review time.",
      },
    ],
    api: [
      ["value", "number", ""],
      ["zones", "MeterZone[]", ""],
      [
        "highlightActive?",
        "boolean",
        "Only color the zone that contains the value; others stay muted.",
      ],
      ["showTicks?", "boolean", "Show zone boundary values under the bar."],
      ["showLabels?", "boolean", "Show zone labels under the bar."],
      ["showMarker?", "boolean", "Show a marker at the current value."],
      ["tickFormatter?", "(value: number) => string", ""],
    ],
  },
  {
    name: "metric-list",
    title: "Metric list",
    category: "Data display",
    description:
      "Collect related operational measures in a scan-friendly list with compact trends.",
    dependencies: [],
    imports: "MetricList",
    usage:
      '<MetricList\n  items={[\n    { label: "Orders", value: 2865, delta: 0.18, trend: [12, 14, 13, 18, 22, 26] },\n    { label: "Refunds", value: 42, delta: -0.06, invertDelta: true, trend: [50, 48, 51, 46, 42] },\n  ]}\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "metric-list-demo",
        title: "Operations brief",
        description:
          "A short list of measures to review before the weekly studio meeting.",
      },
    ],
    api: [
      ["items", "MetricListItem[]", ""],
      ["variant?", '"area" | "line"', "Sparkline variant."],
      ["fill?", '"gradient" | "dots"', "Sparkline area fill."],
      ["showDivider?", "boolean", ""],
    ],
  },
  {
    name: "delta-badge",
    title: "Change indicator",
    category: "Data display",
    description:
      "Show whether a change is helpful, harmful, or neutral in the context of the metric.",
    dependencies: [],
    imports: "DeltaBadge",
    usage:
      '<DeltaBadge delta={0.128} />\n<DeltaBadge delta={0.08} invert />\n<DeltaBadge delta={-0.032} variant="soft" />',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "delta-badge-demo",
        title: "Read a change in context",
        description:
          "Positive, negative, and unchanged values work in both compact and text-only treatments.",
      },
    ],
    api: [
      ["delta", "number", "Fractional change, e.g. 0.124 for +12.4%."],
      [
        "invert?",
        "boolean",
        "Treat a decrease as good and an increase as bad (churn, latency, errors).",
      ],
      ["variant?", '"outline" | "soft" | "text"', ""],
      ["showIcon?", "boolean", ""],
    ],
  },
  {
    name: "metric-value",
    title: "Metric value",
    category: "Data display",
    description:
      "Format large totals consistently while keeping the exact figure available on hover.",
    dependencies: [],
    imports: "MetricValue",
    usage:
      '<MetricValue value={158143} format="currency" maximumFractionDigits={0} />\n<MetricValue value={1234567} />\n<MetricValue value={41194} format="currency" maximumFractionDigits={0} />\n<MetricValue value={1234567} compactFrom={Infinity} />',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "metric-value-demo",
        title: "Readable totals",
        description:
          "Keep compact figures in the report and reveal exact values when needed.",
      },
    ],
    api: [
      ["value", "number | string", "Strings render as-is."],
      ["format?", "NumberFormat", ""],
      ["currency?", "string", ""],
      ["maximumFractionDigits?", "number", ""],
      [
        "compactFrom?",
        "number",
        "Values at or above this are abbreviated (e.g. $158K) with the full value in a tooltip. Set to Infinity to always show the full value.",
      ],
      ["suffix?", "React.ReactNode", "Text after the number, e.g. a unit."],
    ],
  },
  {
    name: "period-tabs",
    title: "Period selector",
    category: "Data display",
    description:
      "Give a report a clear time range without taking attention away from the numbers.",
    dependencies: [],
    imports: "PeriodTabs",
    usage:
      'function ReportPeriod() {\n  const [period, setPeriod] = React.useState("month")\n  return <PeriodTabs value={period} onValueChange={setPeriod} />\n}',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "period-tabs-demo",
        title: "Choose a reporting window",
        description:
          "The selected period is controlled by the surrounding report.",
      },
      {
        name: "period-tabs-animated-demo",
        title: "A moving period indicator",
        description:
          "Track the active window with a subtle shared selection highlight.",
      },
    ],
    api: [
      ["options?", "PeriodOption[]", ""],
      ["size?", '"sm" | "default"', ""],
      [
        "animated?",
        "boolean",
        "Slide a single pill between tabs instead of swapping backgrounds.",
      ],
    ],
    exampleImports: 'import * as React from "react"',
  },
  {
    name: "tick-bar",
    title: "Segmented progress",
    category: "Data display",
    description:
      "Make a count or capacity visible as a series of filled marks.",
    dependencies: [],
    imports: "TickBar",
    usage:
      '<TickBar value={46} color="var(--color-emerald-500)" />\n<TickBar value={7420} max={12300} segments={40} />\n<TickBar value={16} max={24} segments={24} shape="pill" />',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "tick-bar-demo",
        title: "Progress in small steps",
        description:
          "Show review completion, used capacity, and completed milestones.",
      },
    ],
    api: [
      ["value", "number", "Current value, from 0 to max."],
      ["max?", "number", ""],
      ["segments?", "number", "Number of ticks."],
      [
        "color?",
        "string",
        "Any CSS color for the filled ticks. Defaults to chart-1.",
      ],
      [
        "trackColor?",
        "string",
        "Any CSS color for the unfilled ticks. Defaults to muted.",
      ],
      [
        "shape?",
        '"tick" | "pill"',
        '"tick" draws thin bars; "pill" draws wide rounded ones.',
      ],
      [
        "animate?",
        "boolean",
        "Reveal filled ticks in sequence when the bar mounts.",
      ],
      ["animationDuration?", "number", "Total reveal time in milliseconds."],
    ],
  },
  {
    name: "dot-plot",
    title: "Dot comparison",
    category: "Data display",
    description: "Compare observations using position rather than bar area.",
    dependencies: [],
    imports: "DotPlot",
    usage:
      '<DotPlot data={[1, 1, 2, 1, 2, 4, 6, 4, 2, 1, 2, 1, 1, 1]} color="var(--color-green-600)" />\n<DotPlot data={[3, 5, 8, 12, 7, 4, 2]} labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]} rows={6} />\n<DotPlot data={[2, 3, 5, 4, 6, 3, 2]} emphasis={0} className="[--dot-size:0.875rem]" />',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "dot-plot-demo",
        title: "Compare delivery batches",
        description:
          "Small positional marks make repeated observations easy to compare.",
      },
    ],
    api: [
      ["data", "number[]", "One value per column, in order."],
      [
        "labels?",
        "string[]",
        "Optional label per column, shown in the tooltip and used for the accessible name.",
      ],
      [
        "max?",
        "number",
        "The value that fills a column. Defaults to the largest value in `data`.",
      ],
      ["rows?", "number", "Number of dots in a full column."],
      ["color?", "string", "Any CSS color. Defaults to chart-1."],
      [
        "emphasis?",
        "number",
        "Columns at or above this fraction of `max` are drawn at full strength and the\nrest are faded, so the peak stands out. Set to 0 to draw every column at full strength.",
      ],
      ["fadedOpacity?", "number", "Opacity of the faded columns."],
      [
        "showTooltip?",
        "boolean",
        "Show a tooltip with the column's label and value while it is hovered.",
      ],
      [
        "valueFormatter?",
        "(value: number) => string",
        "Formats the value in the tooltip. Defaults to a plain grouped number.",
      ],
      [
        "activeIndex?",
        "number | null",
        "Index of the hovered column, to control it from outside.",
      ],
      [
        "onActiveIndexChange?",
        "(index: number | null) => void",
        "Called when the hovered column changes, with null when the pointer leaves.",
      ],
    ],
  },
  {
    name: "event-timeline",
    title: "Event timeline",
    category: "Data display",
    description:
      "Tell the story of a project through decisions, reviews, and completed steps.",
    dependencies: [],
    imports:
      "Timeline, TimelineConnector, TimelineContent, TimelineDescription, TimelineHeader, TimelineItem, TimelineMarker, TimelineRail, TimelineTime, TimelineTitle,",
    usage:
      '<Timeline>\n  <TimelineItem status="current">\n    <TimelineRail>\n      <TimelineMarker><Rocket /></TimelineMarker>\n      <TimelineConnector />\n    </TimelineRail>\n    <TimelineContent>\n      <TimelineHeader>\n        <TimelineTitle>Canary rollout started</TimelineTitle>\n        <Badge variant="secondary">Canary</Badge>\n        <TimelineTime dateTime="2026-05-22T09:34">09:34</TimelineTime>\n      </TimelineHeader>\n      <TimelineDescription>Enabled for 5% of workspaces.</TimelineDescription>\n    </TimelineContent>\n  </TimelineItem>\n</Timeline>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow. This component has a separate API from the existing timeline component. ",
    previewWidth: 800,
    examples: [
      {
        name: "timeline-demo",
        title: "Project milestones",
        description:
          "Follow a brief from its first review to a scheduled handoff.",
      },
      {
        name: "timeline-compact-demo",
        title: "Invoice history",
        description:
          "A compact history of the steps leading to a payment review.",
      },
      {
        name: "timeline-activity-demo",
        title: "The review conversation",
        description:
          "Keep files, feedback, and approval decisions in one activity stream.",
      },
      {
        name: "timeline-versions-demo",
        title: "Brief revisions",
        description:
          "Record what changed between versions before the next client review.",
      },
    ],
    exampleImports:
      'import { IconRocket as Rocket } from "@tabler/icons-react"\nimport { Badge } from "@/components/ui/badge"',
  },
  {
    name: "activity-rings",
    title: "Goal rings",
    category: "Data display",
    description:
      "Track several delivery goals together, each with its own target and progress.",
    dependencies: [],
    imports: "ActivityRings",
    usage:
      '<ActivityRings\n  rings={[\n    { label: "Move", value: 1592, max: 1800, color: "var(--color-pink-500)" },\n    { label: "Exercise", value: 105, max: 120, color: "var(--color-lime-500)" },\n    { label: "Stand", value: 9, max: 12, color: "var(--color-chart-1)" },\n  ]}\n>\n  <span className="text-2xl font-semibold">82%</span>\n  <span className="text-muted-foreground text-xs">of goals</span>\n</ActivityRings>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "activity-rings-demo",
        title: "Weekly delivery goals",
        description:
          "Deliverables, reviews, and milestones each have their own target.",
      },
    ],
    api: [
      ["rings", "ActivityRing[]", "Outermost ring first."],
      ["size?", "number", "Diameter in pixels."],
      ["thickness?", "number", "Stroke width of each ring in pixels."],
      ["gap?", "number", "Space between rings in pixels."],
      [
        "trackOpacity?",
        "number",
        "Opacity of the unfilled track, drawn in the ring's color.",
      ],
      [
        "activeIndex?",
        "number | null",
        "Ring drawn at full strength while the rest dim. `null` shows every ring.",
      ],
      ["onActiveIndexChange?", "(index: number | null) => void", ""],
      ["children?", "React.ReactNode", "Content rendered in the middle."],
    ],
  },
  {
    name: "heatmap-chart",
    title: "Heatmap matrix",
    category: "Data display",
    description: "Find busy periods and uneven coverage across two dimensions.",
    dependencies: [],
    imports: "HeatmapChart",
    usage:
      '<HeatmapChart\n  rows={[\n    { label: "Mon", values: [12, 48, 210, 320, 260, 80] },\n    { label: "Tue", values: [10, 52, 230, 340, 250, 70] },\n  ]}\n  columns={["00", "04", "08", "12", "16", "20"]}\n  unit="sessions"\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "heatmap-chart-demo",
        title: "When requests arrive",
        description: "Find the busiest hours before planning review coverage.",
      },
      {
        name: "heatmap-chart-regions-demo",
        title: "Client coverage",
        description: "Compare activity across regions and reporting periods.",
      },
    ],
    api: [
      [
        "rows",
        "HeatmapRow[]",
        "One row per line of the matrix, top to bottom.",
      ],
      [
        "columns",
        "string[]",
        "Column labels, left to right. Sets the number of columns.",
      ],
      [
        "color?",
        "string",
        "Any CSS color. Cells mix this into `--muted` by value. Defaults to chart-1.",
      ],
      [
        "max?",
        "number",
        "Value drawn fully saturated. Defaults to the largest value.",
      ],
      [
        "scale?",
        '"linear" | "sqrt"',
        "How values map to color. `sqrt` spreads out small values.",
      ],
      [
        "levels?",
        "number",
        "Quantize the fill into this many steps instead of a continuous ramp.",
      ],
      [
        "gap?",
        "number",
        "Gap between cells in px. Cells themselves stretch to fill the container.",
      ],
      ["valueFormatter?", "(value: number) => string", ""],
      [
        "unit?",
        "string",
        'Label for the value in the tooltip, e.g. "sessions".',
      ],
      ["showLegend?", "boolean", ""],
      ["showRowLabels?", "boolean", ""],
      ["showColumnLabels?", "boolean", ""],
      [
        "columnLabelEvery?",
        "number",
        "Show every nth column label. Defaults to whatever keeps about 12 labels.",
      ],
      [
        "renderTooltip?",
        "(datum: HeatmapDatum) => React.ReactNode",
        "Replace the tooltip body. Return `null` to hide it for that cell.",
      ],
      ["onCellClick?", "(datum: HeatmapDatum) => void", ""],
      [
        "activeCell?",
        "HeatmapCell | null",
        "The hovered cell, to control it from outside.",
      ],
      [
        "onActiveCellChange?",
        "(cell: HeatmapCell | null) => void",
        "Called when the hovered cell changes, with null when the pointer leaves.",
      ],
    ],
  },
  {
    name: "radar-chart",
    title: "Profile comparison",
    category: "Data display",
    description: "Compare the shape of multiple measures across categories.",
    dependencies: [],
    imports: "RadarChart",
    usage:
      '<RadarChart\n  data={[{ month: "Jan", desktop: 120, mobile: 80 }, { month: "Feb", desktop: 160, mobile: 110 }, { month: "Mar", desktop: 140, mobile: 95 }]}\n  angleKey="month"\n  series={[\n    { key: "desktop", label: "Desktop" },\n    { key: "mobile", label: "Mobile" },\n  ]}\n  variant="line"\n  showLegend\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "radar-chart-demo",
        title: "Delivery profile",
        description:
          "Compare six aspects of project readiness on a common scale.",
      },
      {
        name: "radar-chart-multi-demo",
        title: "Planned and delivered",
        description: "See where delivery outcomes match the original brief.",
      },
      {
        name: "radar-chart-dots-demo",
        title: "Review scorecard",
        description: "Put individual assessment points in view.",
      },
    ],
    api: [
      ["data", "Record<string, unknown>[]", ""],
      [
        "angleKey",
        "string",
        "Key of the category label in each row, one per spoke.",
      ],
      ["series", "RadarSeries[]", ""],
      [
        "variant?",
        '"filled" | "line" | "dots"',
        '"filled" shades the area, "line" draws only the outline, "dots" adds a dot at every vertex.',
      ],
      [
        "grid?",
        '"polygon" | "circle" | "none"',
        "Shape of the background grid rings.",
      ],
      [
        "showAngleLabels?",
        "boolean",
        "Show the category label at the end of each spoke.",
      ],
      [
        "showRadiusAxis?",
        "boolean",
        "Show value ticks along the vertical spoke.",
      ],
      ["showLegend?", "boolean", ""],
      ["showTooltip?", "boolean", ""],
      [
        "domain?",
        'React.ComponentProps<typeof PolarRadiusAxis>["domain"]',
        'Recharts domain for the value axis, e.g. [0, 100]. Defaults to [0, "auto"].',
      ],
      ["valueFormatter?", "(value: number) => string", ""],
      [
        "animate?",
        "boolean",
        "Animate polygons after hydration and when data changes. Respects reduced motion.",
      ],
      ["animationDuration?", "number", ""],
    ],
  },
  {
    name: "scatter-chart",
    title: "Relationship chart",
    category: "Data display",
    description:
      "Explore how two measures move together, with optional bubble size for a third.",
    dependencies: [],
    imports: "ScatterChart",
    usage:
      '<ScatterChart\n  series={[\n    { label: "Free", data: [{ sessions: 12, revenue: 0 }, { sessions: 24, revenue: 0 }] },\n    { label: "Pro", data: [{ sessions: 85, revenue: 29 }, { sessions: 120, revenue: 58 }] },\n    { label: "Enterprise", data: [{ sessions: 280, revenue: 240 }, { sessions: 420, revenue: 480 }] },\n  ]}\n  xKey="sessions"\n  yKey="revenue"\n  xLabel="Sessions"\n  yLabel="Revenue"\n  showLegend\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "scatter-chart-demo",
        title: "Effort and project value",
        description:
          "Compare discovery, delivery, and ongoing support engagements.",
      },
      {
        name: "scatter-chart-bubbles-demo",
        title: "Client relationship signals",
        description: "Use bubble size to add context to the two main measures.",
      },
    ],
    api: [
      ["series", "ScatterSeries[]", ""],
      ["xKey", "string", "Key of the x value in each row."],
      ["yKey", "string", "Key of the y value in each row."],
      [
        "sizeKey?",
        "string",
        "Key of a value that scales each point into a bubble.",
      ],
      [
        "nameKey?",
        "string",
        "Key of a per-point label shown as the tooltip title.",
      ],
      ["xLabel?", "string", "Names for the tooltip rows. Default to the keys."],
      ["yLabel?", "string", ""],
      ["sizeLabel?", "string", ""],
      ["showGrid?", "boolean", ""],
      ["showXAxis?", "boolean", ""],
      ["showYAxis?", "boolean", ""],
      ["showLegend?", "boolean", ""],
      ["showTooltip?", "boolean", ""],
      ["xFormatter?", "(value: number) => string", ""],
      ["yFormatter?", "(value: number) => string", ""],
      ["sizeFormatter?", "(value: number) => string", ""],
      [
        "dotRadius?",
        "number",
        "Radius of each point in px when sizeKey is not set.",
      ],
      [
        "sizeRange?",
        "[number, number]",
        "Bubble area range in px² when sizeKey is set, smallest to largest.",
      ],
      [
        "xDomain?",
        'React.ComponentProps<typeof XAxis>["domain"]',
        'Recharts domain for the x-axis, e.g. ["auto", "auto"]. Defaults to [0, "auto"].',
      ],
      [
        "yDomain?",
        'React.ComponentProps<typeof YAxis>["domain"]',
        'Recharts domain for the y-axis, e.g. ["auto", "auto"]. Defaults to [0, "auto"].',
      ],
      [
        "animate?",
        "boolean",
        "Animate points after hydration and when data changes. Respects reduced motion.",
      ],
      ["animationDuration?", "number", ""],
    ],
  },
  {
    name: "sankey-chart",
    title: "Flow diagram",
    category: "Data display",
    description:
      "Trace how time or budget moves from one category to the next.",
    dependencies: [],
    imports: "SankeyChart",
    usage:
      '<SankeyChart\n  nodes={[\n    { name: "Focus" },\n    { name: "Meetings" },\n    { name: "Writing" },\n    { name: "Calls" },\n  ]}\n  links={[\n    { source: "Focus", target: "Writing", value: 12 },\n    { source: "Meetings", target: "Calls", value: 7 },\n    { source: "Meetings", target: "Writing", value: 2 },\n  ]}\n  valueFormatter={(value) => `${value}h`}\n/>',
    notes:
      "Uses your application theme. Replace the sample data and connect the callbacks to your own workflow.",
    previewWidth: 560,
    examples: [
      {
        name: "sankey-chart-demo",
        title: "A working week",
        description:
          "Follow time from broad work categories into specific activities.",
      },
      {
        name: "sankey-chart-cashflow-demo",
        title: "Studio cash allocation",
        description: "Trace income sources into operating costs and reserves.",
      },
    ],
    api: [
      ["nodes", "SankeyChartNode[]", ""],
      ["links", "SankeyChartLink[]", ""],
      ["valueFormatter?", "(value: number) => string", ""],
      [
        "showShares?",
        "boolean",
        'Append each node\'s share of the total flow to its label, e.g. "Writing · 18%".',
      ],
      ["showTooltip?", "boolean", ""],
      ["nodeWidth?", "number", ""],
      [
        "nodePadding?",
        "number",
        "Vertical gap between nodes in the same column.",
      ],
      [
        "linkOpacity?",
        "number",
        "Fill opacity of the links. Hovered links are drawn at double this, up to 1.",
      ],
      [
        "labelPosition?",
        '"outside" | "inside"',
        '"outside" reserves a margin and puts labels left of sources and right of targets; "inside" draws them over the flow.',
      ],
      [
        "colors?",
        "string[]",
        "Palette cycled through source nodes without a color. Defaults to chart-1 through chart-5.",
      ],
    ],
  },
] as const;
