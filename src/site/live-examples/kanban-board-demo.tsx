import { useState } from "react";
import { IconMessage } from "@tabler/icons-react";
import {
  KanbanBoard,
  type KanbanAssignee,
  type KanbanCard,
  type KanbanColumn,
} from "@/registry/overtrue/kanban-board";

// Sprint 24 for a fictional product team. People, issues and dates are made up.
const people = {
  maya: { id: "maya", name: "Maya Chen" },
  leo: { id: "leo", name: "Leo Park" },
  priya: { id: "priya", name: "Priya Raman" },
  jonas: { id: "jonas", name: "Jonas Weber" },
  ama: { id: "ama", name: "Ama Owusu" },
  sofia: { id: "sofia", name: "Sofia Marín" },
} satisfies Record<string, KanbanAssignee>;

const labels = {
  billing: { name: "Billing", color: "var(--color-chart-1)" },
  web: { name: "Web", color: "var(--color-chart-2)" },
  mobile: { name: "Mobile", color: "var(--color-chart-4)" },
  design: { name: "Design", color: "var(--color-chart-5)" },
  infra: { name: "Infra", color: "var(--color-chart-3)" },
  security: { name: "Security", color: "var(--color-destructive)" },
  api: { name: "API", color: "var(--color-chart-1)" },
  docs: { name: "Docs", color: "var(--color-muted-foreground)" },
};

const columns: KanbanColumn[] = [
  { id: "backlog", title: "Backlog", color: "var(--color-muted-foreground)" },
  { id: "progress", title: "In progress", color: "var(--color-chart-1)" },
  { id: "review", title: "In review", color: "var(--color-chart-3)" },
  { id: "done", title: "Done", color: "var(--color-chart-2)" },
];

function meta(key: string, comments?: number) {
  return (
    <>
      <span className="font-mono">{key}</span>
      {comments ? (
        <span className="inline-flex items-center gap-0.5 tabular-nums">
          <IconMessage className="size-3.5" stroke={1.75} aria-hidden="true" />
          {comments}
          <span className="sr-only"> comments</span>
        </span>
      ) : null}
    </>
  );
}

const initial: KanbanCard[] = [
  {
    id: "ATL-218",
    column: "progress",
    title: "Usage alerts at 80% and 100% of plan quota",
    labels: [labels.billing, labels.web],
    priority: "urgent",
    assignees: [people.maya, people.leo],
    due: "2026-10-21",
    meta: meta("ATL-218", 6),
  },
  {
    id: "ATL-224",
    column: "progress",
    title: "Offline drafts for the field app",
    description: "Queue edits locally and sync them when the connection returns.",
    labels: [labels.mobile],
    priority: "high",
    assignees: [people.ama],
    due: "2026-10-24",
    meta: meta("ATL-224", 2),
  },
  {
    id: "ATL-227",
    column: "progress",
    title: "Move workspace search to the new index",
    labels: [labels.infra],
    priority: "medium",
    assignees: [people.jonas, people.maya],
    meta: meta("ATL-227"),
  },
  {
    id: "ATL-229",
    column: "progress",
    title: "Keyboard shortcuts panel",
    labels: [labels.web, labels.design],
    priority: "low",
    assignees: [people.leo],
    meta: meta("ATL-229", 1),
  },
  {
    id: "ATL-231",
    column: "backlog",
    title: "Saved filters for the activity log",
    labels: [labels.web],
    priority: "medium",
    assignees: [people.priya],
    due: "2026-10-30",
    meta: meta("ATL-231"),
  },
  {
    id: "ATL-236",
    column: "backlog",
    title: "Empty states for new workspaces",
    description: "First-run copy and artwork for projects, members and billing.",
    labels: [labels.design],
    priority: "low",
    assignees: [people.sofia],
    meta: meta("ATL-236", 3),
  },
  {
    id: "ATL-240",
    column: "backlog",
    title: "Back off webhook retries per endpoint",
    labels: [labels.api],
    priority: "high",
    assignees: [people.jonas],
    meta: meta("ATL-240"),
  },
  {
    id: "ATL-212",
    column: "review",
    title: "Two-factor recovery codes",
    description: "Generate, download and regenerate ten single-use codes.",
    labels: [labels.security],
    priority: "high",
    assignees: [people.priya],
    due: "2026-10-18",
    meta: meta("ATL-212", 9),
  },
  {
    id: "ATL-219",
    column: "review",
    title: "Photo upload crashes on Android 15",
    labels: [labels.mobile],
    priority: "urgent",
    assignees: [people.ama, people.jonas],
    due: "2026-10-20",
    meta: meta("ATL-219", 4),
  },
  {
    id: "ATL-215",
    column: "review",
    title: "Invoice PDF redesign",
    labels: [labels.billing, labels.design],
    priority: "medium",
    assignees: [people.sofia, people.ama],
    meta: meta("ATL-215", 2),
  },
  {
    id: "ATL-207",
    column: "done",
    title: "Custom roles and permissions",
    labels: [labels.security, labels.web],
    priority: "high",
    assignees: [people.maya, people.priya, people.jonas, people.leo],
    meta: meta("ATL-207", 12),
  },
  {
    id: "ATL-204",
    column: "done",
    title: "SSO setup guide",
    labels: [labels.docs],
    priority: "low",
    assignees: [people.leo],
    meta: meta("ATL-204"),
  },
];

export default function Demo() {
  const [cards, setCards] = useState(initial);
  const [next, setNext] = useState(241);
  const done = cards.filter((card) => card.column === "done").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold tracking-tight">Sprint 24</h3>
        <span className="text-[13px] text-muted-foreground tabular-nums">Oct 14 – Oct 27</span>
        <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
          <span className="relative h-1.5 w-20 overflow-hidden rounded-full bg-muted">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-emerald-400"
              style={{ width: `${(done / cards.length) * 100}%` }}
            />
          </span>
          {done} of {cards.length} done
        </span>
      </div>
      <KanbanBoard
        aria-label="Sprint 24 board"
        columns={columns}
        cards={cards}
        onCardsChange={setCards}
        locale="en-US"
        now={new Date(2026, 9, 19)}
        onAddCard={(column) => {
          const key = `ATL-${next}`;
          setNext(next + 1);
          setCards((current) => [
            ...current,
            { id: key, column: column.id, title: "Untitled issue", meta: meta(key) },
          ]);
        }}
      />
    </div>
  );
}
