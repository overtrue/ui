import { useMemo, useState } from "react";
import {
  IconCircleDot,
  IconClock,
  IconGitCommit,
  IconServer,
  IconStopwatch,
  IconUser,
  IconWorld,
} from "@tabler/icons-react";
import {
  FilterBar,
  applyFilters,
  facetCounts,
  type Filter,
  type FilterField,
  type FilterView,
} from "@/registry/overtrue/filter-bar";

// Acme Studio's deploy log on Thursday 15 October 2026, 16:30. You are Ada Park.
const NOW = new Date(2026, 9, 15, 16, 30).getTime();
const HOUR = 3_600_000;
const ME = "Ada Park";

const statuses = [
  { value: "succeeded", label: "Succeeded", color: "var(--color-chart-2)" },
  { value: "failed", label: "Failed", color: "var(--color-destructive)" },
  { value: "rolled-back", label: "Rolled back", color: "var(--color-chart-3)" },
  { value: "running", label: "Running", color: "var(--color-chart-1)" },
];
const environments = ["production", "staging", "preview"];
const services = ["web", "api", "worker", "billing", "search"];
const authors = [ME, "Mia Chen", "Noah Kim", "Leo Park", "Ava Singh"];
const messages = [
  "Cache invoice totals per workspace",
  "Bump checkout SDK to 4.2",
  "Retry webhook deliveries with jitter",
  "Split search indexer into shards",
  "Add audit events for role changes",
  "Fix timezone drift in usage reports",
  "Stream exports instead of buffering",
  "Tighten rate limits on public API",
  "Migrate sessions to the new store",
  "Lazy-load the analytics bundle",
  "Remove legacy billing endpoints",
  "Warm caches before cutover",
];

interface Deploy {
  id: string;
  service: string;
  environment: string;
  status: string;
  author: string;
  message: string;
  sha: string;
  duration: number;
  deployedAt: number;
}

function noise(seed: number) {
  const x = Math.sin(seed * 63.719) * 39758.5453;
  return x - Math.floor(x);
}

const deploys: Deploy[] = Array.from({ length: 32 }, (_, i) => {
  const r = (k: number) => noise(i * 11 + k);
  const environment = r(1) < 0.45 ? "production" : r(1) < 0.8 ? "staging" : "preview";
  const s = r(2);
  const status =
    i === 0 ? "running" : s < 0.7 ? "succeeded" : s < 0.88 ? "failed" : "rolled-back";
  return {
    id: `dpl_${(4821 - i).toString(36)}`,
    service: services[Math.floor(r(3) * services.length)],
    environment,
    status,
    author: authors[Math.floor(r(4) * authors.length)],
    message: messages[(i * 5) % messages.length],
    sha: Math.floor(r(5) * 0xfffffff).toString(16).padStart(7, "0"),
    duration: Math.round(
      (environment === "production" ? 150 : 70) + r(6) * 260 + (status === "failed" ? -40 : 0),
    ),
    deployedAt: NOW - (i * 9.5 + r(7) * 6) * HOUR,
  };
});

function duration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (!m) return `${s}s`;
  return s ? `${m}m ${String(s).padStart(2, "0")}s` : `${m}m`;
}

function ago(time: number) {
  const hours = (NOW - time) / HOUR;
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m ago`;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

const fields: FilterField[] = [
  {
    key: "status",
    label: "Status",
    type: "enum",
    icon: <IconCircleDot />,
    options: statuses,
    plural: "statuses",
  },
  {
    key: "environment",
    label: "Environment",
    type: "enum",
    icon: <IconWorld />,
    plural: "environments",
    options: environments.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })),
  },
  {
    key: "service",
    label: "Service",
    type: "enum",
    icon: <IconServer />,
    plural: "services",
    options: services.map((s) => ({ value: s, label: s })),
  },
  {
    key: "author",
    label: "Author",
    type: "enum",
    icon: <IconUser />,
    plural: "authors",
    options: authors.map((a) => ({ value: a, label: a === ME ? `${a} (you)` : a })),
  },
  {
    key: "duration",
    label: "Duration",
    type: "number",
    icon: <IconStopwatch />,
    unit: "s",
    format: duration,
  },
  { key: "deployedAt", label: "Deployed", type: "date", icon: <IconClock /> },
  { key: "message", label: "Commit message", type: "text", icon: <IconGitCommit /> },
];

const initialViews: FilterView[] = [
  {
    id: "mine",
    name: "My deploys",
    filters: [{ id: "v-author", field: "author", operator: "is", value: [ME] }],
  },
  {
    id: "failed-7d",
    name: "Failed in the last 7 days",
    filters: [
      { id: "v-status", field: "status", operator: "is", value: ["failed"] },
      { id: "v-when", field: "deployedAt", operator: "within-last", value: "7d" },
    ],
  },
];

export default function Demo() {
  const [views, setViews] = useState(initialViews);
  const [viewId, setViewId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filter[]>([
    { id: "env", field: "environment", operator: "is", value: ["production"] },
    { id: "slow", field: "duration", operator: "gt", value: 240 },
  ]);
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () => applyFilters(deploys, filters, { fields, query, now: NOW }),
    [filters, query],
  );
  const counts = useMemo(
    () => facetCounts(deploys, filters, { fields, query, now: NOW }),
    [filters, query],
  );

  return (
    <section
      aria-label="Deployments"
      className="overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
    >
      <div className="space-y-3 border-b border-border/60 p-4 sm:p-5">
        <header className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-tight">Deployments</h3>
          <p aria-live="polite" className="text-xs text-muted-foreground tabular-nums">
            <span className="font-medium text-foreground">{rows.length}</span> of{" "}
            {deploys.length} deploys
          </p>
        </header>
        <FilterBar
          aria-label="Deployment filters"
          fields={fields}
          filters={filters}
          onFiltersChange={setFilters}
          query={query}
          onQueryChange={setQuery}
          searchPlaceholder="Search commits…"
          optionCounts={counts}
          views={views}
          activeViewId={viewId}
          onViewChange={(view) => setViewId(view?.id ?? null)}
          onSaveView={(name, state) => {
            const id = `view-${views.length + 1}`;
            setViews((current) => [...current, { id, name, ...state }]);
            setViewId(id);
          }}
          labels={{ allView: "All deployments" }}
        />
      </div>
      <div className="max-h-[24rem] overflow-auto">
        <table className="w-full min-w-[42rem] text-sm">
          <thead className="sticky top-0 z-10 bg-card/95 text-xs text-muted-foreground backdrop-blur">
            <tr className="border-b border-border/60 text-start">
              <th scope="col" className="px-5 py-2.5 text-start font-normal">Service</th>
              <th scope="col" className="px-3 py-2.5 text-start font-normal">Status</th>
              <th scope="col" className="px-3 py-2.5 text-start font-normal">Commit</th>
              <th scope="col" className="px-3 py-2.5 text-start font-normal">Author</th>
              <th scope="col" className="px-3 py-2.5 text-end font-normal">Duration</th>
              <th scope="col" className="px-5 py-2.5 text-end font-normal">Deployed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  No deployments match these filters.
                </td>
              </tr>
            )}
            {rows.map((deploy) => {
              const status = statuses.find((s) => s.value === deploy.status)!;
              return (
                <tr key={deploy.id} className="transition-colors duration-150 hover:bg-muted/40">
                  <td className="px-5 py-2.5 whitespace-nowrap">
                    <p className="font-mono text-xs font-medium">{deploy.service}</p>
                    <p className="text-xs text-muted-foreground capitalize">{deploy.environment}</p>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        color: `color-mix(in oklab, ${status.color} 82%, var(--color-foreground))`,
                        background: `color-mix(in oklab, ${status.color} 10%, transparent)`,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full"
                        style={{ background: status.color }}
                      />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <p className="max-w-56 truncate">{deploy.message}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{deploy.sha}</p>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                    {deploy.author === ME ? "You" : deploy.author}
                  </td>
                  <td className="px-3 py-2.5 text-end font-mono text-xs whitespace-nowrap tabular-nums">
                    {duration(deploy.duration)}
                  </td>
                  <td className="px-5 py-2.5 text-end text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                    {ago(deploy.deployedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
