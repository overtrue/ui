export default {
  name: "filter-bar",
  title: "Filter bar",
  category: "Forms",
  description:
    "A query builder for tables and lists: search, editable filter chips, saved views, and a pure helper that applies every operator.",
  dependencies: ["switch"],
  imports: "FilterBar, applyFilters, type Filter, type FilterField",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const fields: FilterField[] = [
    { key: "status", label: "Status", type: "enum", options: [
      { value: "open", label: "Open", color: "var(--color-destructive)" },
      { value: "resolved", label: "Resolved", color: "var(--color-chart-2)" },
    ] },
    { key: "duration", label: "Duration", type: "number", unit: "s" },
    { key: "openedAt", label: "Opened", type: "date" },
  ]
  const rows = [
    { id: 1, title: "Checkout latency above SLO", status: "open", duration: 420, openedAt: "2026-10-14" },
    { id: 2, title: "Webhook deliveries delayed", status: "resolved", duration: 95, openedAt: "2026-10-02" },
  ]
  const [filters, setFilters] = useState<Filter[]>([
    { id: "status", field: "status", operator: "is", value: ["open"] },
  ])
  const [query, setQuery] = useState("")
  const visible = applyFilters(rows, filters, { fields, query })
  return (
    <div className="space-y-3">
      <FilterBar fields={fields} filters={filters} onFiltersChange={setFilters} query={query} onQueryChange={setQuery} />
      <p className="text-sm text-muted-foreground">{visible.length} of {rows.length} incidents</p>
    </div>
  )
}`,
  notes:
    "The bar only edits a list of `{ id, field, operator, value }` filters; `applyFilters` turns that list into rows, so the same state can drive a server query instead. Filters combine with AND, values inside one enum filter with OR, and incomplete filters are skipped until they have a value. Enum chips switch between is and is any of as values are added, and summarize three or more as a count. Date filters take a duration such as \"7d\" for within the last, or yyyy-mm-dd days for before, after, and between; pass `now` to `applyFilters` for repeatable results. Pass `optionCounts` from `facetCounts` to show how many rows each option would match given the other filters. Picking a field in the Filter menu opens its editor in place; Backspace in an empty search box removes the last chip, Backspace or Delete on a focused chip removes it, and Left and Right move between chip segments. Saved views replace the filters and query; the views button marks a view as modified once they drift.",
  previewWidth: 720,
  examples: [
    {
      name: "filter-bar-demo",
      title: "Incident queue",
      description:
        "Forty incidents filtered live by search and chips, starting with open or investigating incidents above Sev 4. Option counts update with the other filters.",
    },
    {
      name: "filter-bar-table-demo",
      title: "Deployments with saved views",
      description:
        "A deploy log with a duration filter applied, saved views for your own deploys and recent failures, and Save as view in the views menu.",
    },
  ],
  api: [
    [
      "fields",
      "FilterField[]",
      "{ key; label; type: \"enum\" | \"text\" | \"number\" | \"date\" | \"boolean\"; options?; icon?; operators?; plural?; unit?; format? }.",
    ],
    [
      "filters? / defaultFilters?",
      "Filter[]",
      "Controlled or initial filters, { id; field; operator; value }. Leave filters undefined to let the bar manage them.",
    ],
    [
      "onFiltersChange?",
      "(filters: Filter[]) => void",
      "Called on every edit, including while a value is still being typed.",
    ],
    [
      "query? / defaultQuery? / onQueryChange?",
      "string / (query: string) => void",
      "Free-text search. The input appears when any of these is passed.",
    ],
    ["showSearch?", "boolean", "Force the search input on or off."],
    ["searchPlaceholder?", "string", "Placeholder for the search input."],
    [
      "optionCounts?",
      "Record<string, Record<string, number>>",
      "Counts shown beside enum options, keyed by field then value. facetCounts builds them.",
    ],
    [
      "views? / activeViewId? / defaultActiveViewId?",
      "FilterView[] / string | null",
      "Saved views, { id; name; filters; query? }, and which one is active.",
    ],
    [
      "onViewChange?",
      "(view: FilterView | null) => void",
      "Called after a view's filters and query are applied. Null is the all view.",
    ],
    [
      "onSaveView?",
      "(name: string, state: { filters; query }) => void",
      "Adds Save as view to the views menu. Store the view and pass it back in views.",
    ],
    ["actions?", "ReactNode", "Content at the end of the bar, such as a result count."],
    ["size?", '"sm" | "default"', "Control height: 32px or 36px, 40px or 44px on touch screens."],
    ["locale?", "string", "Locale for numbers and dates in chips."],
    [
      "createId?",
      "(field: FilterField) => string",
      "Ids for new filters. Defaults to the field key plus a random suffix.",
    ],
    [
      "renderValue?",
      "(filter: Filter, field: FilterField) => ReactNode",
      "Replaces the value segment of a chip.",
    ],
    [
      "labels?",
      "Partial<FilterBarLabels>",
      "Interface copy for translation, including operator names and the all view label.",
    ],
    ["className?", "string", "Additional classes for the root."],
    [
      "applyFilters(rows, filters, options)",
      "(rows: T[], filters: Filter[], { fields; query?; getValue?; getSearchText?; now? }) => T[]",
      "Pure filtering with every operator. Query words must all appear in text and enum fields.",
    ],
    [
      "facetCounts(rows, filters, options)",
      "(…) => Record<string, Record<string, number>>",
      "Per-option counts for enum fields, each ignoring its own filter.",
    ],
  ],
} as const;
