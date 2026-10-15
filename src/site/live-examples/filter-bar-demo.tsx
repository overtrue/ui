import { useMemo, useState } from "react";
import {
  IconAlertTriangle,
  IconCircleDot,
  IconClock,
  IconServer,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import {
  FilterBar,
  applyFilters,
  facetCounts,
  type Filter,
  type FilterField,
} from "@/registry/overtrue/filter-bar";

// Acme Studio's incident queue on Thursday 15 October 2026, 14:00.
const NOW = new Date(2026, 9, 15, 14, 0).getTime();
const HOUR = 3_600_000;

const statuses = [
  { value: "open", label: "Open", color: "var(--color-destructive)" },
  { value: "investigating", label: "Investigating", color: "var(--color-chart-3)" },
  { value: "monitoring", label: "Monitoring", color: "var(--color-chart-1)" },
  { value: "resolved", label: "Resolved", color: "var(--color-chart-2)" },
];
const severities = [
  { value: "sev1", label: "Sev 1", color: "var(--color-destructive)" },
  { value: "sev2", label: "Sev 2", color: "var(--color-chart-5)" },
  { value: "sev3", label: "Sev 3", color: "var(--color-chart-3)" },
  { value: "sev4", label: "Sev 4", color: "var(--color-muted-foreground)" },
];
const services = ["api-gateway", "billing", "checkout", "search", "auth", "notifications"];
const owners = ["Mia Chen", "Noah Kim", "Leo Park", "Ava Singh", "Sam Rivera", "Zoe Adams"];
const titles = [
  "Elevated 5xx on order creation",
  "Checkout latency above SLO",
  "Webhook deliveries delayed",
  "Search index lagging behind writes",
  "SSO sign-ins failing for one workspace",
  "Payment retries spiking",
  "Push notifications queued",
  "Rate limiter rejecting healthy traffic",
  "Invoice PDFs rendering blank",
  "Session tokens expiring early",
  "Autocomplete returning stale results",
  "Email digests sent twice",
  "Card declines above baseline",
  "Gateway memory climbing after deploy",
  "Cart totals rounding incorrectly",
  "Password reset links timing out",
  "Partial outage in eu-west",
  "Background jobs backing up",
  "Tax rates missing for new regions",
  "Mobile clients hitting old API version",
];

interface Incident {
  id: string;
  title: string;
  status: string;
  severity: string;
  service: string;
  owner: string;
  opened: number;
  customerImpact: boolean;
}

function noise(seed: number) {
  const x = Math.sin(seed * 91.345) * 47453.5453;
  return x - Math.floor(x);
}

const incidents: Incident[] = Array.from({ length: 40 }, (_, i) => {
  const r = (k: number) => noise(i * 7 + k);
  const ageHours = Math.round(Math.pow(r(1), 3) * 24 * 21 * 10) / 10 + 0.4;
  const severity = r(2) < 0.15 ? "sev1" : r(2) < 0.45 ? "sev2" : r(2) < 0.74 ? "sev3" : "sev4";
  const s = r(3);
  const status =
    ageHours > 120
      ? s < 0.85
        ? "resolved"
        : "monitoring"
      : s < 0.3
        ? "open"
        : s < 0.6
          ? "investigating"
          : s < 0.8
            ? "monitoring"
            : "resolved";
  return {
    id: `INC-${2180 - i}`,
    title: titles[(i * 7) % titles.length],
    status,
    severity,
    service: services[Math.floor(r(4) * services.length)],
    owner: owners[Math.floor(r(5) * owners.length)],
    opened: NOW - ageHours * HOUR,
    customerImpact: severity === "sev1" || r(6) < 0.35,
  };
});

const fields: FilterField[] = [
  { key: "status", label: "Status", type: "enum", icon: <IconCircleDot />, options: statuses, plural: "statuses" },
  { key: "severity", label: "Severity", type: "enum", icon: <IconAlertTriangle />, options: severities, plural: "severities" },
  {
    key: "service",
    label: "Service",
    type: "enum",
    icon: <IconServer />,
    plural: "services",
    options: services.map((s) => ({ value: s, label: s })),
  },
  {
    key: "owner",
    label: "Owner",
    type: "enum",
    icon: <IconUser />,
    plural: "owners",
    options: owners.map((o) => ({ value: o, label: o })),
  },
  { key: "opened", label: "Opened", type: "date", icon: <IconClock /> },
  { key: "customerImpact", label: "Customer impact", type: "boolean", icon: <IconUsersGroup /> },
  { key: "title", label: "Title", type: "text" },
];

const initialFilters: Filter[] = [
  { id: "status", field: "status", operator: "is-any-of", value: ["open", "investigating"] },
  { id: "severity", field: "severity", operator: "is-not", value: ["sev4"] },
];

function age(time: number) {
  const hours = (NOW - time) / HOUR;
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`;
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

function Pill({ option }: { option: { label: string; color: string } }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{
        color: `color-mix(in oklab, ${option.color} 82%, var(--color-foreground))`,
        background: `color-mix(in oklab, ${option.color} 10%, transparent)`,
      }}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: option.color }} />
      {option.label}
    </span>
  );
}

export default function Demo() {
  const [filters, setFilters] = useState<Filter[]>(initialFilters);
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () => applyFilters(incidents, filters, { fields, query, now: NOW }),
    [filters, query],
  );
  const counts = useMemo(
    () => facetCounts(incidents, filters, { fields, query, now: NOW }),
    [filters, query],
  );

  return (
    <section
      aria-label="Incidents"
      className="overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]"
    >
      <div className="space-y-3 border-b border-border/60 p-4 sm:p-5">
        <header className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-tight">Incidents</h3>
          <p aria-live="polite" className="text-xs text-muted-foreground tabular-nums">
            <span className="font-medium text-foreground">{rows.length}</span> of{" "}
            {incidents.length} incidents
          </p>
        </header>
        <FilterBar
          fields={fields}
          filters={filters}
          onFiltersChange={setFilters}
          query={query}
          onQueryChange={setQuery}
          searchPlaceholder="Search incidents…"
          optionCounts={counts}
        />
      </div>
      <ul className="max-h-[22.5rem] divide-y divide-border/60 overflow-y-auto">
        {rows.length === 0 && (
          <li className="px-5 py-12 text-center text-sm text-muted-foreground">
            No incidents match these filters.
          </li>
        )}
        {rows.map((incident) => {
          const status = statuses.find((s) => s.value === incident.status)!;
          const severity = severities.find((s) => s.value === incident.severity)!;
          return (
            <li
              key={incident.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-3 transition-colors duration-150 hover:bg-muted/40 sm:px-5"
            >
              <span
                className="font-mono text-[11px] font-medium tabular-nums"
                style={{ color: `color-mix(in oklab, ${severity.color} 85%, var(--color-foreground))` }}
              >
                {severity.label.replace("Sev ", "SEV")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{incident.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  <span className="font-mono">{incident.id}</span> · {incident.service} ·{" "}
                  {incident.owner}
                  {incident.customerImpact && " · customer impact"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="max-sm:hidden">
                  <Pill option={status} />
                </span>
                <span className="w-8 text-end font-mono text-xs text-muted-foreground tabular-nums">
                  {age(incident.opened)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
