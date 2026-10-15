import { GanttChart, type GanttTask } from "@/registry/overtrue/gantt-chart";

// Acme Studio's Checkout 2.0 plan, seen on Tuesday 20 October.
const tasks: GanttTask[] = [
  {
    id: "research",
    group: "Design",
    label: "Research synthesis",
    owner: "Mia Chen",
    start: "2026-10-05",
    end: "2026-10-16",
    progress: 1,
  },
  {
    id: "audit",
    group: "Design",
    label: "Design system audit",
    owner: "Leo Park",
    start: "2026-10-08",
    end: "2026-10-19",
    progress: 0.85,
  },
  {
    id: "flows",
    group: "Design",
    label: "Checkout flows",
    owner: "Mia Chen",
    start: "2026-10-19",
    end: "2026-11-06",
    progress: 0.3,
    dependsOn: ["research"],
  },
  {
    id: "signoff",
    group: "Design",
    label: "Design sign-off",
    start: "2026-11-06",
    end: "2026-11-06",
    milestone: true,
    dependsOn: ["flows"],
  },
  {
    id: "api",
    group: "Engineering",
    label: "API contracts",
    owner: "Noah Kim",
    start: "2026-10-12",
    end: "2026-10-23",
    progress: 0.7,
  },
  {
    id: "payments",
    group: "Engineering",
    label: "Payments service",
    owner: "Noah Kim",
    start: "2026-10-26",
    end: "2026-11-13",
    progress: 0,
    dependsOn: ["api"],
  },
  {
    id: "frontend",
    group: "Engineering",
    label: "Checkout frontend",
    owner: "Sara Lind",
    start: "2026-10-28",
    end: "2026-11-20",
    progress: 0,
    dependsOn: ["api"],
  },
  {
    id: "load",
    group: "Engineering",
    label: "Load testing",
    owner: "Omar Aziz",
    start: "2026-11-16",
    end: "2026-11-24",
    dependsOn: ["payments"],
  },
  {
    id: "site",
    group: "Launch",
    label: "Marketing site",
    owner: "Leo Park",
    start: "2026-11-02",
    end: "2026-11-25",
    progress: 0.1,
  },
  {
    id: "docs",
    group: "Launch",
    label: "Docs and enablement",
    owner: "Jun Sato",
    start: "2026-11-09",
    end: "2026-11-26",
    dependsOn: ["signoff"],
  },
  {
    id: "beta",
    group: "Launch",
    label: "Beta cohort",
    owner: "Ava Rossi",
    start: "2026-11-16",
    end: "2026-11-27",
    dependsOn: ["payments"],
  },
  {
    id: "ga",
    group: "Launch",
    label: "General availability",
    start: "2026-12-01",
    end: "2026-12-01",
    milestone: true,
    dependsOn: ["beta", "load", "frontend"],
  },
];

export default function Demo() {
  return (
    <GanttChart
      title="Q4 delivery plan"
      description="Checkout 2.0 at Acme Studio, from research to launch."
      tasks={tasks}
      today="2026-10-20"
      defaultZoom="week"
    />
  );
}
