export default {
  name: "gantt-chart",
  title: "Gantt chart",
  category: "Data display",
  description:
    "A project schedule with a grouped task list, zoomable time grid, progress bars, milestones, dependency arrows and a today line.",
  dependencies: [],
  imports: "GanttChart",
  usage: `<GanttChart
  title="Q4 delivery plan"
  today="2026-10-20"
  tasks={[
    { id: "research", group: "Design", label: "Research", owner: "Mia Chen", start: "2026-10-05", end: "2026-10-16", progress: 1 },
    { id: "api", group: "Engineering", label: "API contracts", owner: "Noah Kim", start: "2026-10-19", end: "2026-10-30", progress: 0.4, dependsOn: ["research"] },
    { id: "ga", group: "Launch", label: "General availability", start: "2026-11-02", end: "2026-11-02", milestone: true, dependsOn: ["api"] },
  ]}
  onSelectedChange={(id) => console.log(id)}
/>`,
  notes:
    'Dates are calendar days: `end` is inclusive, date-only strings such as "2026-10-05" never shift with the time zone, and `onTaskChange` returns local-midnight Dates. Tasks without a `color` take a chart colour per group. A task is overdue when its end is before `today` and it is not finished; the slip shows as a hatched tail up to the today line. Arrows turn red and dashed when a task starts before its predecessor ends. The task list stays pinned while the grid scrolls, bar names stick to the visible edge, and switching zoom keeps today where it was on screen. With `editable`, drag a bar to move it or its edges to resize, snapped to whole days; focused bars move with the arrow keys and resize with Shift. The chart only previews a drag: update `tasks` in `onTaskChange` or the bar returns to its old dates. Pass `height` to cap the schedule and keep the time header sticky.',
  previewWidth: 760,
  examples: [
    {
      name: "gantt-chart-demo",
      title: "Q4 delivery plan",
      description:
        "Three groups and twelve tasks with owners, progress, dependencies, two milestones and one overdue task. Hover a bar for its dates, or collapse a group to its summary.",
    },
    {
      name: "gantt-chart-editable-demo",
      title: "Editable sprint",
      description:
        "Drag bars and edges or use the arrow keys in day zoom. The readout echoes each change, and moving a task too early flags its dependency.",
    },
  ],
  api: [
    [
      "tasks",
      "{ id: string; label: string; start: Date | string; end: Date | string; progress?: number; group?: string; owner?: string; dependsOn?: string[]; milestone?: boolean; color?: string }[]",
      "One row per task, listed under its group in order. end is inclusive; progress runs 0–1.",
    ],
    [
      "zoom? / defaultZoom?",
      '"day" | "week" | "month"',
      "Controlled or initial time scale. Defaults to week.",
    ],
    [
      "onZoomChange?",
      "(zoom: GanttZoom) => void",
      "Called from the built-in zoom control.",
    ],
    [
      "today?",
      "Date | string",
      "Draws the today line and decides what is overdue. Defaults to the current date.",
    ],
    [
      "title?",
      "React.ReactNode",
      "Card heading. Also labels the schedule when it is a string.",
    ],
    ["description?", "React.ReactNode", "Supporting text under the title."],
    [
      "actions?",
      "React.ReactNode",
      "Controls at the top right, before the zoom control.",
    ],
    [
      "selectedId? / defaultSelectedId?",
      "string | null",
      "Controlled or initial selection. The selected task is ringed and keeps the readout.",
    ],
    [
      "onSelectedChange?",
      "(id: string | null, task: GanttTask | null) => void",
      "Called when a bar or row is clicked or toggled with Enter, Space or Escape.",
    ],
    [
      "renderTaskLabel?",
      "(task: GanttTask) => React.ReactNode",
      "Replaces the task name in the list.",
    ],
    [
      "renderBar?",
      "(task: GanttTask, info: GanttBarInfo) => React.ReactNode",
      "Replaces the inside of a bar. info carries dates, duration, width, colour, overdue and drag state.",
    ],
    [
      "editable?",
      "boolean",
      "Drag to move and resize, or use the arrow keys. Defaults to false.",
    ],
    [
      "onTaskChange?",
      "(task: GanttTask, change: { start: Date; end: Date }) => void",
      "Called with the new dates after a drag or key press.",
    ],
    [
      "dateFormatter?",
      "(date: Date) => string",
      'Formats dates in the readout and labels. Default "Oct 6".',
    ],
    [
      "groupOrder?",
      "string[]",
      "Order groups explicitly; others follow in order of appearance.",
    ],
    [
      "defaultCollapsedGroups?",
      "string[]",
      "Groups that start collapsed to their summary bar.",
    ],
    [
      "weekStartsOn?",
      "0 | 1",
      "First day of the week for week columns. Defaults to Monday.",
    ],
    [
      "summary?",
      "React.ReactNode",
      "Readout content when no task is active, such as a status line.",
    ],
    [
      "height?",
      "number",
      "Maximum schedule height. Taller schedules scroll under a sticky header.",
    ],
    [
      "showZoomControl?",
      "boolean",
      "Show the today button and zoom control. Defaults to true.",
    ],
    [
      "showLegend?",
      "boolean",
      "Show the key beside the readout. Defaults to true.",
    ],
    ["className?", "string", "Additional classes for the card."],
  ],
} as const;
