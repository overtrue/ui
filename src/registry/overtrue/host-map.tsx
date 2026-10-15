"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type HostStatus = "ok" | "warn" | "critical" | "offline";

export interface HostMapHost {
  id: string;
  name: string;
  /** Region, cluster, or zone. Hosts sharing a group are drawn together. */
  group?: string;
  /** Metric as a 0–1 fraction, e.g. CPU utilisation. */
  value?: number;
  /** Explicit health. When omitted it is derived from `value` and `thresholds`. */
  status?: HostStatus;
}

export interface HostMapThresholds {
  /** Values at or above this run warm. */
  warn: number;
  /** Values at or above this read as critical. */
  critical: number;
}

export interface HostMapProps extends Omit<
  React.ComponentProps<"div">,
  "title" | "onSelect"
> {
  hosts: HostMapHost[];
  /** Colour cells by metric value or by health status. */
  colorBy?: "value" | "status";
  /** Name of the metric, e.g. "CPU". */
  metricLabel?: string;
  /** Formats a 0–1 metric value. Defaults to a whole percent. */
  valueFormatter?: (value: number) => string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls placed under the heading, such as a metric picker. */
  actions?: React.ReactNode;
  cellSize?: "sm" | "md";
  /** Where cells turn warm and critical, and how status is derived from value. */
  thresholds?: HostMapThresholds;
  /** Order groups explicitly. Unlisted groups follow in order of appearance. */
  groupOrder?: string[];
  /** Mark one host as selected. Pass null for none to expose pressed state. */
  selectedId?: string | null;
  /** Called when a host is clicked or activated with Enter or Space. */
  onSelect?: (host: HostMapHost) => void;
  showLegend?: boolean;
  /** Noun for one cell, used in counts and labels. */
  unit?: [singular: string, plural: string];
}

const statusLabel: Record<HostStatus, string> = {
  ok: "Healthy",
  warn: "Warning",
  critical: "Critical",
  offline: "Offline",
};

const statusOrder: HostStatus[] = ["ok", "warn", "critical", "offline"];

const statusFill: Record<HostStatus, string> = {
  ok: "bg-emerald-500/65 dark:bg-emerald-500/55",
  warn: "bg-amber-400 dark:bg-amber-400/90",
  critical: "bg-destructive",
  offline: "border border-dashed border-muted-foreground/45 bg-transparent",
};

const statusDot: Record<HostStatus, string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-400",
  critical: "bg-destructive",
  offline: "border border-dashed border-muted-foreground/60",
};

const statusText: Record<HostStatus, string> = {
  ok: "text-emerald-600 dark:text-emerald-400",
  warn: "text-amber-600 dark:text-amber-400",
  critical: "text-destructive",
  offline: "text-muted-foreground",
};

const AMBER = "var(--color-amber-400, oklch(82.8% 0.189 84.429))";

function defaultValueFormatter(value: number) {
  return `${Math.round(value * 100)}%`;
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function metricOf(host: HostMapHost) {
  return host.value != null && Number.isFinite(host.value) ? host.value : null;
}

/**
 * Calm values ramp up the chart colour; warm values move from amber towards the
 * destructive colour so hot spots read before any label is checked.
 */
function valueFill(value: number, warn: number, critical: number) {
  const v = clamp01(value);
  if (v >= critical) return "var(--color-destructive)";
  if (v >= warn) {
    const t = (v - warn) / (critical - warn || 1);
    return `color-mix(in oklab, var(--color-destructive) ${Math.round(t * 45)}%, ${AMBER})`;
  }
  const t = v / (warn || 1);
  return `color-mix(in oklab, var(--color-chart-1) ${Math.round(12 + t * 66)}%, var(--color-muted))`;
}

function statusOf(host: HostMapHost, warn: number, critical: number): HostStatus {
  if (host.status) return host.status;
  const value = metricOf(host);
  if (value == null) return "offline";
  if (value >= critical) return "critical";
  if (value >= warn) return "warn";
  return "ok";
}

/**
 * Find the cell to move to with the arrow keys, following the visual layout across
 * wrapped rows and groups. Offsets ignore the hover scale transform.
 */
function neighbour(
  cells: HTMLElement[],
  from: HTMLElement,
  direction: "up" | "down",
) {
  const top = from.offsetTop;
  const cx = from.offsetLeft + from.offsetWidth / 2;
  const below = direction === "down";
  let rowTop: number | null = null;
  for (const cell of cells) {
    const ahead = below ? cell.offsetTop > top + 1 : cell.offsetTop < top - 1;
    if (!ahead) continue;
    if (
      rowTop == null ||
      (below ? cell.offsetTop < rowTop - 1 : cell.offsetTop > rowTop + 1)
    )
      rowTop = cell.offsetTop;
  }
  if (rowTop == null) return null;
  let best: HTMLElement | null = null;
  let bestDistance = Infinity;
  for (const cell of cells) {
    if (Math.abs(cell.offsetTop - rowTop) > 1) continue;
    const distance = Math.abs(cell.offsetLeft + cell.offsetWidth / 2 - cx);
    if (distance < bestDistance) {
      best = cell;
      bestDistance = distance;
    }
  }
  return best;
}

interface HostCellProps {
  host: HostMapHost;
  status: HostStatus;
  fill: string | undefined;
  label: string;
  active: boolean;
  selected: boolean | undefined;
  dimmed: boolean;
  tabStop: boolean;
  selectable: boolean;
  onHover: (id: string) => void;
  onFocusCell: (id: string) => void;
  onSelect?: (host: HostMapHost) => void;
}

/** Memoised so hovering one cell does not re-render a fleet of hundreds. */
const HostCell = React.memo(function HostCell({
  host,
  status,
  fill,
  label,
  active,
  selected,
  dimmed,
  tabStop,
  selectable,
  onHover,
  onFocusCell,
  onSelect,
}: HostCellProps) {
  return (
    <button
      type="button"
      data-slot="host-map-cell"
      data-id={host.id}
      data-status={status}
      data-active={active || undefined}
      data-selected={selected || undefined}
      aria-label={label}
      aria-pressed={selected}
      tabIndex={tabStop ? 0 : -1}
      onPointerEnter={() => onHover(host.id)}
      onFocus={() => onFocusCell(host.id)}
      onClick={onSelect ? () => onSelect(host) : undefined}
      className={cn(
        "relative size-(--host-cell) rounded-[3px] outline-none",
        "transition-[transform,opacity,background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
        fill ? "" : statusFill[status],
        dimmed && "opacity-20",
        selectable ? "cursor-pointer" : "cursor-default",
        "data-[active]:z-10 data-[active]:scale-[1.35] data-[active]:ring-2 data-[active]:ring-foreground/85 data-[active]:ring-offset-1 data-[active]:ring-offset-card",
        "focus-visible:z-10 focus-visible:scale-[1.35] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card",
        "data-[selected]:ring-2 data-[selected]:ring-primary data-[selected]:ring-offset-1 data-[selected]:ring-offset-card",
        status === "critical" &&
          !dimmed &&
          "after:pointer-events-none after:absolute after:-inset-[3px] after:rounded-[5px] after:border after:border-destructive/70 after:opacity-0 motion-safe:after:animate-[host-map-pulse_2.4s_ease-out_infinite]",
      )}
      style={fill ? { backgroundColor: fill } : undefined}
    />
  );
});

/**
 * A fleet host map: one small cell per host, pod, or node, coloured by a metric or by
 * health and grouped by region. Hover or focus a cell to inspect it in a fixed readout;
 * arrow keys move through the map and Enter selects.
 */
function HostMap({
  hosts,
  colorBy = "value",
  metricLabel = "Load",
  valueFormatter = defaultValueFormatter,
  title,
  description,
  actions,
  cellSize = "md",
  thresholds,
  groupOrder,
  selectedId,
  onSelect,
  showLegend = true,
  unit = ["host", "hosts"],
  className,
  ...props
}: HostMapProps) {
  const warn = thresholds?.warn ?? 0.7;
  const critical = thresholds?.critical ?? 0.9;
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const [tabStopId, setTabStopId] = React.useState<string | null>(null);
  const [isolated, setIsolated] = React.useState<HostStatus | null>(null);

  const onFocusCell = React.useCallback((id: string) => {
    setFocusedId(id);
    setTabStopId(id);
  }, []);

  const groups = React.useMemo(() => {
    const map = new Map<string, HostMapHost[]>();
    for (const name of groupOrder ?? []) map.set(name, []);
    for (const host of hosts) {
      const key = host.group ?? "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(host);
    }
    return [...map.entries()]
      .filter(([, members]) => members.length > 0)
      .map(([name, members]) => {
        const counts = { ok: 0, warn: 0, critical: 0, offline: 0 };
        let sum = 0;
        let measured = 0;
        for (const host of members) {
          const status = statusOf(host, warn, critical);
          counts[status] += 1;
          const value = metricOf(host);
          if (status !== "offline" && value != null) {
            sum += value;
            measured += 1;
          }
        }
        return {
          name,
          hosts: members,
          counts,
          sum,
          measured,
          average: measured ? sum / measured : null,
        };
      });
  }, [hosts, groupOrder, warn, critical]);

  const fleet = React.useMemo(() => {
    const counts = { ok: 0, warn: 0, critical: 0, offline: 0 };
    let sum = 0;
    let measured = 0;
    for (const group of groups) {
      for (const status of statusOrder) counts[status] += group.counts[status];
      sum += group.sum;
      measured += group.measured;
    }
    return { counts, average: measured ? sum / measured : null };
  }, [groups]);

  const ordered = React.useMemo(
    () => groups.flatMap((group) => group.hosts),
    [groups],
  );
  const grouped = groups.length > 1 || (groups[0]?.name ?? "") !== "";

  const activeId = hoveredId ?? focusedId;
  const activeHost = activeId
    ? (hosts.find((host) => host.id === activeId) ?? null)
    : null;
  const stopId =
    tabStopId && ordered.some((host) => host.id === tabStopId)
      ? tabStopId
      : (ordered[0]?.id ?? null);

  const plural = (n: number) => (n === 1 ? unit[0] : unit[1]);
  const { counts } = fleet;
  const attention =
    counts.warn + counts.critical + (colorBy === "status" ? counts.offline : 0);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.dataset.slot !== "host-map-cell") return;
    const all = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        '[data-slot="host-map-cell"]',
      ),
    );
    const index = all.indexOf(target);
    const moves: Record<string, () => HTMLElement | null | undefined> = {
      ArrowRight: () => all[index + 1],
      ArrowLeft: () => all[index - 1],
      ArrowDown: () => neighbour(all, target, "down"),
      ArrowUp: () => neighbour(all, target, "up"),
      Home: () => all[0],
      End: () => all[all.length - 1],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    const next = move();
    if (!next) return;
    setTabStopId(next.dataset.id ?? null);
    next.focus();
  };

  const describe = (host: HostMapHost, status: HostStatus) => {
    const parts = [host.name];
    if (host.group) parts.push(host.group);
    const value = metricOf(host);
    if (value != null && status !== "offline")
      parts.push(`${metricLabel} ${valueFormatter(value)}`);
    parts.push(statusLabel[status]);
    return parts.join(", ");
  };

  const hasHeader = title != null || description != null || actions != null;
  const mapLabel = typeof title === "string" ? title : "Host map";

  let readout: React.ReactNode;
  if (activeHost) {
    const status = statusOf(activeHost, warn, critical);
    const value = status === "offline" ? null : metricOf(activeHost);
    readout = (
      <>
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={cn("size-2 shrink-0 rounded-full", statusDot[status])}
          />
          <span className="truncate font-mono text-xs font-medium text-foreground">
            {activeHost.name}
          </span>
          {activeHost.group ? (
            <span className="ml-auto shrink-0 font-mono text-[10.5px] text-muted-foreground">
              {activeHost.group}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10.5px] tracking-wide text-muted-foreground uppercase">
            {metricLabel}
          </span>
          <span className="text-sm font-semibold tabular-nums">
            {value != null ? valueFormatter(value) : "—"}
          </span>
          <span className="relative h-1 min-w-8 flex-1 overflow-hidden rounded-full bg-muted">
            {value != null ? (
              <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${clamp01(value) * 100}%`,
                  background: valueFill(value, warn, critical),
                }}
              />
            ) : null}
          </span>
          <span className={cn("text-xs font-medium", statusText[status])}>
            {statusLabel[status]}
          </span>
        </div>
      </>
    );
  } else {
    readout = (
      <>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono text-[10.5px] tracking-wide uppercase">
            Fleet
          </span>
          <span className="ml-auto tabular-nums">
            {hosts.length} {plural(hosts.length)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-baseline gap-1.5">
            <span className="text-muted-foreground">
              {colorBy === "value" ? `avg ${metricLabel}` : "healthy"}
            </span>
            <span className="text-sm font-semibold tabular-nums">
              {colorBy === "value"
                ? fleet.average != null
                  ? valueFormatter(fleet.average)
                  : "—"
                : counts.ok}
            </span>
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-muted-foreground">
              {colorBy === "value" ? "hot" : "need attention"}
            </span>
            <span
              className={cn(
                "text-sm font-semibold tabular-nums",
                counts.critical > 0
                  ? "text-destructive"
                  : attention > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-foreground",
              )}
            >
              {attention}
            </span>
          </span>
        </div>
      </>
    );
  }

  return (
    <div
      data-slot="host-map"
      data-color-by={colorBy}
      className={cn(
        "@container/host-map flex min-w-0 flex-col rounded-xl border bg-card text-card-foreground shadow-xs",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col gap-3 px-5 pt-5 @md/host-map:flex-row @md/host-map:items-start @md/host-map:justify-between @md/host-map:gap-6",
          !hasHeader && "@md/host-map:justify-end",
        )}
      >
        {hasHeader ? (
          <div className="min-w-0 space-y-1">
            {title != null ? (
              <h3 className="text-sm leading-5 font-semibold tracking-tight">
                {title}
              </h3>
            ) : null}
            {description != null ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
            {actions != null ? (
              <div className="flex items-center gap-2 pt-2">{actions}</div>
            ) : null}
          </div>
        ) : null}
        <div
          data-slot="host-map-readout"
          aria-hidden="true"
          data-active={activeHost ? true : undefined}
          className="flex min-w-0 shrink-0 flex-col justify-center gap-1.5 rounded-lg border bg-muted/30 px-3 py-2 transition-colors data-[active]:bg-muted/60 motion-reduce:transition-none @md/host-map:w-56"
        >
          {readout}
        </div>
      </div>

      <div
        ref={mapRef}
        role="group"
        aria-label={`${mapLabel}: ${hosts.length} ${plural(hosts.length)}. Use the arrow keys to move between them.`}
        onKeyDown={onKeyDown}
        onPointerLeave={() => setHoveredId(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node))
            setFocusedId(null);
        }}
        className="flex flex-col gap-4 p-5"
        style={
          {
            "--host-cell": cellSize === "sm" ? "10px" : "14px",
            "--host-gap": cellSize === "sm" ? "2px" : "3px",
          } as React.CSSProperties
        }
      >
        {hosts.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground">
            No {unit[1]} to show.
          </p>
        ) : null}
        {groups.map((group) => {
          const groupActive =
            activeHost != null && (activeHost.group ?? "") === group.name;
          const groupHot = group.counts.warn + group.counts.critical;
          return (
            <div
              key={group.name || "_"}
              role={grouped ? "group" : undefined}
              aria-label={
                grouped
                  ? `${group.name}, ${group.hosts.length} ${plural(group.hosts.length)}`
                  : undefined
              }
              className="flex min-w-0 flex-col gap-2"
            >
              {grouped ? (
                <div
                  aria-hidden="true"
                  data-slot="host-map-group-header"
                  className="flex items-baseline gap-2 text-[11px]"
                >
                  <span
                    className={cn(
                      "font-mono font-medium transition-colors motion-reduce:transition-none",
                      groupActive ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {group.name}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {group.hosts.length}
                  </span>
                  <span className="h-px min-w-4 flex-1 self-center bg-border" />
                  <span className="flex items-baseline gap-2.5 text-muted-foreground tabular-nums">
                    {colorBy === "value" ? (
                      <>
                        {group.average != null ? (
                          <span>
                            avg{" "}
                            <span className="font-medium text-foreground">
                              {valueFormatter(group.average)}
                            </span>
                          </span>
                        ) : null}
                        {groupHot > 0 ? (
                          <span
                            className={
                              group.counts.critical > 0
                                ? "text-destructive"
                                : "text-amber-600 dark:text-amber-400"
                            }
                          >
                            {groupHot} hot
                          </span>
                        ) : null}
                      </>
                    ) : (
                      statusOrder
                        .filter(
                          (status) =>
                            status !== "ok" && group.counts[status] > 0,
                        )
                        .map((status) => (
                          <span key={status} className={statusText[status]}>
                            {group.counts[status]}{" "}
                            {status === "warn" ? "warn" : status}
                          </span>
                        ))
                    )}
                  </span>
                </div>
              ) : null}
              <div
                className="grid"
                style={{
                  gap: "var(--host-gap)",
                  gridTemplateColumns: "repeat(auto-fill, var(--host-cell))",
                }}
              >
                {group.hosts.map((host) => {
                  const status = statusOf(host, warn, critical);
                  const value = metricOf(host);
                  return (
                    <HostCell
                      key={host.id}
                      host={host}
                      status={status}
                      fill={
                        colorBy === "value" && status !== "offline" && value != null
                          ? valueFill(value, warn, critical)
                          : undefined
                      }
                      label={describe(host, status)}
                      active={host.id === activeId}
                      selected={
                        selectedId === undefined
                          ? undefined
                          : host.id === selectedId
                      }
                      dimmed={isolated != null && status !== isolated}
                      tabStop={host.id === stopId}
                      selectable={onSelect != null}
                      onHover={setHoveredId}
                      onFocusCell={onFocusCell}
                      onSelect={onSelect}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showLegend ? (
        <div
          data-slot="host-map-legend"
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t px-5 py-3 text-[11px] text-muted-foreground"
        >
          {colorBy === "value" ? (
            <>
              <span className="font-mono text-[10.5px] tracking-wide uppercase">
                {metricLabel}
              </span>
              <span className="flex items-center gap-4">
                <span className="flex flex-col gap-1">
                  <span
                    aria-hidden="true"
                    className="flex h-2 w-40 overflow-hidden rounded-full"
                  >
                    <span
                      className="h-full"
                      style={{
                        width: `${warn * 100}%`,
                        background: `linear-gradient(to right, ${valueFill(0, warn, critical)}, ${valueFill(warn - 0.001, warn, critical)})`,
                      }}
                    />
                    <span
                      className="h-full"
                      style={{
                        width: `${(critical - warn) * 100}%`,
                        background: `linear-gradient(to right, ${valueFill(warn, warn, critical)}, ${valueFill(critical - 0.001, warn, critical)})`,
                      }}
                    />
                    <span
                      className="h-full flex-1"
                      style={{ background: valueFill(1, warn, critical) }}
                    />
                  </span>
                  <span className="relative h-3 w-40 font-mono text-[10px] tabular-nums">
                    <span className="absolute left-0">{valueFormatter(0)}</span>
                    <span
                      className="absolute -translate-x-1/2"
                      style={{ left: `${warn * 100}%` }}
                    >
                      {valueFormatter(warn)}
                    </span>
                    <span
                      className="absolute -translate-x-1/2"
                      style={{ left: `${critical * 100}%` }}
                    >
                      {valueFormatter(critical)}
                    </span>
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-[2px] border border-dashed border-muted-foreground/60"
                  />
                  Offline
                </span>
              </span>
            </>
          ) : (
            <div
              role="group"
              aria-label={`Highlight ${unit[1]} by status`}
              className="flex flex-wrap items-center gap-1"
            >
              {statusOrder.map((status) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={isolated === status}
                  onClick={() =>
                    setIsolated((current) =>
                      current === status ? null : status,
                    )
                  }
                  className={cn(
                    "inline-flex h-7 items-center gap-1.5 rounded-md border border-transparent px-2 text-xs transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
                    "aria-pressed:border-border aria-pressed:bg-muted aria-pressed:text-foreground",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn("size-2.5 rounded-[2px]", statusFill[status])}
                  />
                  <span>{statusLabel[status]}</span>
                  <span className="font-medium text-foreground tabular-nums">
                    {counts[status]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <style href="overtrue-host-map" precedence="default">
        {`@keyframes host-map-pulse{0%{opacity:.9;transform:scale(.85)}70%,100%{opacity:0;transform:scale(1.25)}}`}
      </style>
    </div>
  );
}

export { HostMap };
