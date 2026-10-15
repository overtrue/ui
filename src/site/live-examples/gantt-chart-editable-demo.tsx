import { useState } from "react";
import { IconCircleCheck } from "@tabler/icons-react";
import { GanttChart, type GanttTask } from "@/registry/overtrue/gantt-chart";

const initial: GanttTask[] = [
  {
    id: "schema",
    group: "Backend",
    label: "Schema migration",
    owner: "Noah Kim",
    start: "2026-11-02",
    end: "2026-11-03",
    progress: 1,
  },
  {
    id: "refunds",
    group: "Backend",
    label: "Refund API",
    owner: "Noah Kim",
    start: "2026-11-04",
    end: "2026-11-09",
    progress: 0.3,
    dependsOn: ["schema"],
  },
  {
    id: "emails",
    group: "Backend",
    label: "Receipt emails",
    owner: "Omar Aziz",
    start: "2026-11-10",
    end: "2026-11-11",
    dependsOn: ["refunds"],
  },
  {
    id: "settings",
    group: "Frontend",
    label: "Billing settings",
    owner: "Sara Lind",
    start: "2026-11-03",
    end: "2026-11-06",
    progress: 0.6,
  },
  {
    id: "qa",
    group: "Frontend",
    label: "QA pass",
    owner: "Ava Rossi",
    start: "2026-11-12",
    end: "2026-11-13",
    dependsOn: ["emails", "settings"],
  },
  {
    id: "release",
    group: "Frontend",
    label: "Release",
    start: "2026-11-13",
    end: "2026-11-13",
    milestone: true,
    dependsOn: ["qa"],
  },
];

const day = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export default function Demo() {
  const [tasks, setTasks] = useState(initial);
  const [status, setStatus] = useState<string | null>(null);

  return (
    <GanttChart
      title="Sprint 42"
      description="Two weeks of billing work. Drag a bar or its edges to reschedule."
      tasks={tasks}
      today="2026-11-04"
      defaultZoom="day"
      editable
      onTaskChange={(task, { start, end }) => {
        setTasks((current) =>
          current.map((item) =>
            item.id === task.id
              ? { ...item, start: iso(start), end: iso(end) }
              : item,
          ),
        );
        const days =
          Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
        setStatus(
          task.milestone
            ? `${task.label} moved to ${day.format(start)}`
            : `${task.label} now runs ${day.format(start)} → ${day.format(end)}, ${days} ${days === 1 ? "day" : "days"}`,
        );
      }}
      summary={
        <div className="flex min-w-0 items-center gap-2 text-xs" role="status">
          {status ? (
            <>
              <IconCircleCheck
                aria-hidden="true"
                className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
              />
              <span className="truncate text-foreground">{status}</span>
            </>
          ) : (
            <span className="text-muted-foreground">
              Drag to move, drag an edge to resize, or focus a bar and press{" "}
              <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">
                ←
              </kbd>{" "}
              <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">
                →
              </kbd>{" "}
              (hold{" "}
              <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">
                Shift
              </kbd>{" "}
              to resize).
            </span>
          )}
        </div>
      }
    />
  );
}
