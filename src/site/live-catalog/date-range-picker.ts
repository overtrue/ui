export default {
  name: "date-range-picker",
  title: "Date range picker",
  category: "Forms",
  description:
    "A dashboard date range control with presets, a two-month keyboard calendar, and an optional comparison period.",
  dependencies: ["button", "switch"],
  imports: "DateRangePicker, previousPeriod, type DateRange",
  exampleImports: 'import { useState } from "react"',
  usage: `function Example() {
  const [range, setRange] = useState<DateRange>({
    from: new Date(2026, 8, 1),
    to: new Date(2026, 8, 30),
  })
  const [compare, setCompare] = useState<DateRange | null>(() => previousPeriod(range))
  return (
    <DateRangePicker
      value={range}
      onChange={setRange}
      compare={compare}
      onCompareChange={setCompare}
      maxDate={new Date()}
      align="end"
    />
  )
}`,
  notes:
    "Ranges are inclusive local calendar days: times are ignored, `onChange` returns local-midnight Dates, and day counts never drift across daylight-saving changes. The trigger names a matching preset and keeps the dates beside it in muted text. With `applyMode=\"confirm\"` (the default), picks stay in a draft until Apply, and Cancel, Escape, or an outside click discards them; `\"auto\"` commits on the second click and on presets. Escape while choosing an end date cancels just that pick. Comparison ranges are derived, not picked: previous period is the same number of days ending the day before, previous year is the same days a year earlier. The panel shows two months and collapses to one, with presets as a scrolling row, when the space is narrow. In the grid, arrows move by day, Page Up and Page Down by month, Shift with them by year, Home and End to the week edges, and Enter or Space selects. Pass `inline` to render the panel in place, sized to the nearest CSS container, for sheets and documentation.",
  previewWidth: 754,
  examples: [
    {
      name: "date-range-picker-demo",
      title: "Revenue report",
      description:
        "Opened in place over a revenue card. Pick a preset or two days and apply; the KPIs and daily bars follow the range and compare against the previous period.",
    },
    {
      name: "date-range-picker-compare-demo",
      title: "Compare to previous period",
      description:
        "Comparison is on, so the calendar underlines the earlier range and the card plots both. Switch to previous year in the popover to change the baseline.",
    },
  ],
  api: [
    [
      "value? / defaultValue?",
      "DateRange | null",
      "Controlled or initial range, { from: Date; to: Date }. Leave value undefined to let the picker manage it.",
    ],
    [
      "onChange?",
      "(range: DateRange, details: { preset; compare }) => void",
      "Called when a range is committed, with the matching preset and the comparison range.",
    ],
    [
      "compare? / defaultCompare?",
      "DateRange | null",
      "Controlled or initial comparison range. Null means comparison is off.",
    ],
    [
      "onCompareChange?",
      "(compare: DateRange | null) => void",
      "Called with the derived comparison range when it changes, or null when turned off.",
    ],
    [
      "compareMode? / defaultCompareMode?",
      '"previous-period" | "previous-year"',
      "How the comparison is derived. Defaults to previous period.",
    ],
    [
      "onCompareModeChange?",
      "(mode: DateRangeCompareMode) => void",
      "Called when the mode is changed in the popover.",
    ],
    [
      "showCompare?",
      "boolean",
      "Show the comparison toggle. Defaults to true when any compare prop is passed.",
    ],
    [
      "presets?",
      "DateRangePreset[]",
      "Quick ranges, { id; label; from; to }. Defaults to presetRanges(today); pass [] to hide them.",
    ],
    [
      "today?",
      "Date",
      "Anchors presets and the today marker. Defaults to the current date.",
    ],
    [
      "minDate? / maxDate?",
      "Date",
      "Earliest and latest selectable days. Navigation stops at their months.",
    ],
    [
      "isDateDisabled?",
      "(date: Date) => boolean",
      "Disable individual days, such as days without data.",
    ],
    [
      "maxDays?",
      "number",
      "Longest selectable range, counted inclusively. Days beyond it disable while choosing an end.",
    ],
    [
      "weekStartsOn?",
      "0 | 1 | 2 | 3 | 4 | 5 | 6",
      "First calendar column, 0 for Sunday. Defaults to the locale's first day of the week.",
    ],
    [
      "numberOfMonths?",
      "1 | 2",
      "Months side by side. Defaults to 2, collapsing to 1 when narrow.",
    ],
    [
      "locale?",
      "string",
      "BCP 47 locale for dates, month captions, and weekday names.",
    ],
    [
      "applyMode?",
      '"confirm" | "auto"',
      "Wait for Apply, or commit on the second click and on presets. Defaults to confirm.",
    ],
    ["size?", '"sm" | "default"', "Trigger height: 32px or 36px, 44px on touch screens."],
    [
      "align?",
      '"start" | "center" | "end"',
      "Panel alignment against the trigger. Defaults to start.",
    ],
    [
      "open? / defaultOpen? / onOpenChange?",
      "boolean / (open: boolean) => void",
      "Controlled or initial open state. Opening resets the draft and focuses the start date.",
    ],
    [
      "inline?",
      "boolean",
      "Render the panel in place under the trigger, sized to the nearest CSS container, with no portal and no outside-click dismissal.",
    ],
    [
      "name?",
      "string",
      "Adds hidden name[from] and name[to] inputs with yyyy-mm-dd values.",
    ],
    [
      "formatLabel?",
      "(range, preset) => ReactNode",
      "Replaces the trigger label.",
    ],
    [
      "labels?",
      "Partial<DateRangePickerLabels>",
      "Interface copy for translation, including days: (count) => string.",
    ],
    ["disabled?", "boolean", "Disables the trigger."],
    [
      "className? / triggerClassName? / contentClassName?",
      "string",
      "Classes for the root, the trigger, and the panel.",
    ],
    [
      "presetRanges(today)",
      "(today?: Date) => DateRangePreset[]",
      "The ten standard ranges: today through last 12 months.",
    ],
    [
      "previousPeriod(range) / previousYear(range)",
      "(range: DateRange) => DateRange",
      "Comparison helpers. Also exported: compareRange, formatDateRange, rangeDays, isSameRange.",
    ],
  ],
} as const;
