"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface CohortGridCohort {
  id: string;
  /** Row label, e.g. "Jan 2026" or "Week of Sep 29". */
  label: string;
  /** People who entered the cohort. Retained counts are derived from it. */
  size: number;
  /**
   * Retention per period as a 0–1 fraction, in period order.
   * Use `null` (or leave the entry out) for periods that have not happened yet.
   */
  values: (number | null)[];
}

export type CohortGridMode = "percent" | "count";

/** Everything known about one cell, passed to `onCellSelect`. */
export interface CohortGridCell {
  /** The cohort row, or `null` for the weighted average row. */
  cohort: CohortGridCohort | null;
  label: string;
  period: string;
  periodIndex: number;
  /** Retention fraction, or `null` when the period has not happened yet. */
  value: number | null;
  /** People still active in this period, or `null` when there is no data yet. */
  retained: number | null;
  /** People the retention is measured against. */
  base: number;
}

export interface CohortGridProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  /** One row per cohort, oldest first so the matrix forms a triangle. */
  cohorts: CohortGridCohort[];
  /** Column labels. Defaults to M0, M1, … for the longest cohort. */
  periods?: string[];
  /** Show retention as a percentage or as retained people. Color always follows retention. */
  mode?: CohortGridMode;
  /** Add a size-weighted average row under the cohorts. */
  showAverage?: boolean;
  /** Show the color scale and the pending-period key. */
  showLegend?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Controls placed at the top right, such as a percent/count toggle. */
  actions?: React.ReactNode;
  /**
   * Formats a 0–1 retention fraction everywhere. By default cells show whole
   * percentages and the readout shows one decimal.
   */
  valueFormatter?: (value: number) => string;
  /**
   * Formats people counts everywhere. By default cells go compact from 1,000 and the
   * size column from 10,000, while the readout and cell labels stay exact.
   */
  countFormatter?: (count: number) => string;
  /** Any CSS color. Cells mix it with transparency by retention. Defaults to chart-1. */
  color?: string;
  /**
   * Retention mapped to the lightest and strongest fill. Defaults to the range of
   * the periods after period 0, which is usually 100% by definition.
   */
  domain?: [number, number];
  /** Heading for the label column. */
  cohortLabel?: string;
  /** Heading for the cohort size column. */
  sizeLabel?: string;
  /** Noun used in the readout and cell labels, e.g. "subscribers". */
  unit?: string;
  /** Label for the average row. Defaults to "Weighted avg", or "Total retained" in count mode. */
  averageLabel?: string;
  /** Called when a cell with data is clicked or activated with Enter or Space. */
  onCellSelect?: (cell: CohortGridCell) => void;
}

type Position = { row: number; col: number };

/** Precise percent for the readout and cell labels. */
function detailPercent(value: number) {
  const pct = value * 100;
  if (pct === 0) return "0%";
  if (pct >= 99.95) return "100%";
  if (pct > 0 && pct < 0.05) return "<0.1%";
  return `${pct.toFixed(1)}%`;
}

/** Whole percent keeps dense cells quiet; the readout carries the decimals. */
function cellPercent(value: number) {
  const pct = value * 100;
  if (pct > 0 && pct < 1) return "<1%";
  return `${Math.round(pct)}%`;
}

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function exactCount(count: number) {
  return count.toLocaleString("en-US");
}

/** Size column: exact until five digits. */
function sizeCount(count: number) {
  return Math.abs(count) >= 10_000
    ? compact.format(count)
    : count.toLocaleString("en-US");
}

/** Cells are narrow, so counts go compact from four digits. */
function cellCount(count: number) {
  return Math.abs(count) >= 1_000
    ? compact.format(count)
    : count.toLocaleString("en-US");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Mix the accent into the card surface so every theme gets its own ramp. */
function fillFor(color: string, t: number) {
  const pct = Math.round(8 + clamp(t, 0, 1) * 92);
  return `color-mix(in oklab, ${color} ${pct}%, var(--color-card))`;
}

/**
 * Pick light or dark text from the fill's own lightness, tinted with its hue, so
 * strong cells stay readable whether the theme's chart color is deep or pale.
 * Browsers without relative color syntax keep the inherited foreground.
 */
function inkFor(fill: string) {
  return `oklch(from ${fill} clamp(0.2, (0.6 - l) * 1000, 0.985) min(c, 0.035) h)`;
}

// A short fade on the sticky column's edge, shown once the matrix scrolls under it.
const stickyFade =
  "after:pointer-events-none after:absolute after:inset-y-0 after:-right-3 after:w-3 after:bg-gradient-to-r after:from-card after:to-transparent after:opacity-0 after:transition-opacity group-data-[scrolled=true]/scroll:after:opacity-100 motion-reduce:after:transition-none";

const hatch =
  "repeating-linear-gradient(-45deg, color-mix(in oklab, var(--color-muted-foreground) 26%, transparent) 0 1px, transparent 1px 5px)";

/**
 * A retention cohort matrix. Rows are cohorts, columns are periods since the cohort
 * started, and cell color follows retention. Hover or focus a cell to light up its
 * row and column and read the exact numbers; arrow keys move between cells.
 */
function CohortGrid({
  cohorts,
  periods: periodsProp,
  mode = "percent",
  showAverage = false,
  showLegend = false,
  title,
  description,
  actions,
  valueFormatter,
  countFormatter,
  color = "var(--color-chart-1)",
  domain,
  cohortLabel = "Cohort",
  sizeLabel = "Users",
  unit = "users",
  averageLabel,
  onCellSelect,
  className,
  ...props
}: CohortGridProps) {
  const formatCell = valueFormatter ?? cellPercent;
  // Dense spots (cells, the size column) go compact; the readout and labels stay exact.
  const formatCellCount = countFormatter ?? cellCount;
  const formatSize = countFormatter ?? sizeCount;
  const formatExact = countFormatter ?? exactCount;
  const formatDetail = valueFormatter ?? detailPercent;
  const id = React.useId();
  const tableRef = React.useRef<HTMLTableElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState<Position | null>(null);
  const [focused, setFocused] = React.useState<Position | null>(null);
  const [tabStop, setTabStop] = React.useState<Position>({ row: 0, col: 0 });
  const [scrolled, setScrolled] = React.useState(false);

  const periodCount =
    periodsProp?.length ??
    cohorts.reduce((max, cohort) => Math.max(max, cohort.values.length), 0);
  const periods = React.useMemo(
    () =>
      periodsProp ?? Array.from({ length: periodCount }, (_, i) => `M${i}`),
    [periodsProp, periodCount],
  );

  const [low, high] = React.useMemo(() => {
    if (domain) return domain;
    // Period 0 is usually 100% by definition, so spend the ramp on the periods after it.
    const range = (from: number) => {
      let min = Infinity;
      let max = -Infinity;
      for (const cohort of cohorts)
        for (let i = from; i < cohort.values.length; i++) {
          const value = cohort.values[i];
          if (value == null || !Number.isFinite(value)) continue;
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      return [min, max] as [number, number];
    };
    let [min, max] = range(1);
    if (!Number.isFinite(min) || min === max) [min, max] = range(0);
    if (!Number.isFinite(min)) return [0, 1] as [number, number];
    return [min === max ? 0 : min, max || 1] as [number, number];
  }, [cohorts, domain]);
  const span = high - low || 1;
  const position = (value: number) => clamp((value - low) / span, 0, 1);

  const totalSize = cohorts.reduce((sum, cohort) => sum + cohort.size, 0);

  const average = React.useMemo(
    () =>
      periods.map((_, c) => {
        let base = 0;
        let retained = 0;
        let weighted = 0;
        for (const cohort of cohorts) {
          const value = cohort.values[c];
          if (value == null || !Number.isFinite(value)) continue;
          base += cohort.size;
          weighted += cohort.size * value;
          retained += Math.round(cohort.size * value);
        }
        return base > 0
          ? { value: weighted / base, retained, base }
          : { value: null, retained: null, base: 0 };
      }),
    [cohorts, periods],
  );

  const rowCount = cohorts.length + (showAverage ? 1 : 0);
  const averageRow = showAverage ? cohorts.length : -1;

  const cellAt = React.useCallback(
    (row: number, col: number): CohortGridCell => {
      const period = periods[col] ?? "";
      if (row === averageRow) {
        const entry = average[col];
        return {
          cohort: null,
          label:
            averageLabel ??
            (mode === "count" ? "Total retained" : "Weighted avg"),
          period,
          periodIndex: col,
          value: entry?.value ?? null,
          retained: entry?.retained ?? null,
          base: entry?.base ?? 0,
        };
      }
      const cohort = cohorts[row];
      const raw = cohort?.values[col];
      const value = raw == null || !Number.isFinite(raw) ? null : raw;
      return {
        cohort: cohort ?? null,
        label: cohort?.label ?? "",
        period,
        periodIndex: col,
        value,
        retained: value == null ? null : Math.round((cohort?.size ?? 0) * value),
        base: cohort?.size ?? 0,
      };
    },
    [average, averageLabel, averageRow, cohorts, mode, periods],
  );

  // Keep the roving tab stop inside the matrix when the data shrinks.
  const stop = {
    row: clamp(tabStop.row, 0, Math.max(0, rowCount - 1)),
    col: clamp(tabStop.col, 0, Math.max(0, periods.length - 1)),
  };
  const active = hovered ?? focused;
  const activeCell = active ? cellAt(active.row, active.col) : null;

  const move = (next: Position) => {
    const row = clamp(next.row, 0, rowCount - 1);
    const col = clamp(next.col, 0, periods.length - 1);
    setTabStop({ row, col });
    const element = tableRef.current?.querySelector<HTMLElement>(
      `[data-row="${row}"][data-col="${col}"]`,
    );
    if (!element) return;
    element.focus({ preventScroll: true });
    // Keep the cell clear of the sticky label column while scrolling sideways.
    const scroller = scrollRef.current;
    const sticky =
      tableRef.current?.querySelector<HTMLElement>("th")?.offsetWidth ?? 0;
    if (scroller) {
      const left = element.offsetLeft;
      const right = left + element.offsetWidth;
      if (left - scroller.scrollLeft < sticky)
        scroller.scrollLeft = left - sticky;
      else if (right - scroller.scrollLeft > scroller.clientWidth)
        scroller.scrollLeft = right - scroller.clientWidth;
    }
    element.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTableElement>) => {
    const target = event.target as HTMLElement;
    if (target.dataset.slot !== "cohort-grid-cell") return;
    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);
    const last = { row: rowCount - 1, col: periods.length - 1 };
    const keys: Record<string, Position | undefined> = {
      ArrowRight: { row, col: col + 1 },
      ArrowLeft: { row, col: col - 1 },
      ArrowDown: { row: row + 1, col },
      ArrowUp: { row: row - 1, col },
      Home: event.ctrlKey ? { row: 0, col: 0 } : { row, col: 0 },
      End: event.ctrlKey ? last : { row, col: last.col },
      PageUp: { row: 0, col },
      PageDown: { row: last.row, col },
    };
    const next = keys[event.key];
    if (next) {
      event.preventDefault();
      move(next);
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && onCellSelect) {
      const cell = cellAt(row, col);
      if (cell.value == null) return;
      event.preventDefault();
      onCellSelect(cell);
    }
  };

  const hasHeader = title != null || description != null || actions != null;
  const tableLabel =
    typeof title === "string" ? title : "Cohort retention by period";
  const resolvedAverageLabel =
    averageLabel ?? (mode === "count" ? "Total retained" : "Weighted avg");

  const display = (cell: CohortGridCell) =>
    cell.value == null
      ? ""
      : mode === "count"
        ? formatCellCount(cell.retained ?? 0)
        : formatCell(cell.value);

  const describe = (cell: CohortGridCell) =>
    cell.value == null
      ? `${cell.label}, ${cell.period}: no data yet`
      : `${cell.label}, ${cell.period}: ${formatDetail(cell.value)} retained, ${formatExact(cell.retained ?? 0)} of ${formatExact(cell.base)} ${unit}`;

  const renderCell = (row: number, col: number) => {
    const cell = cellAt(row, col);
    const isAverage = row === averageRow;
    const isActive = active?.row === row && active?.col === col;
    const inCrosshair =
      active != null && (active.row === row || active.col === col);
    const t = cell.value == null ? null : position(cell.value);
    const fill = t == null ? null : fillFor(color, t);
    const selectable = onCellSelect != null && cell.value != null;

    return (
      <td
        key={col}
        role="gridcell"
        data-slot="cohort-grid-cell"
        data-row={row}
        data-col={col}
        data-empty={cell.value == null || undefined}
        aria-label={describe(cell)}
        tabIndex={stop.row === row && stop.col === col ? 0 : -1}
        onPointerEnter={() => setHovered({ row, col })}
        onFocus={() => {
          setFocused({ row, col });
          setTabStop({ row, col });
        }}
        onClick={selectable ? () => onCellSelect(cell) : undefined}
        className={cn(
          "group/cell p-[1.5px] outline-none",
          isAverage && "border-t border-dashed pt-2",
          col === periods.length - 1 && "pr-4",
          selectable && "cursor-pointer",
        )}
      >
        <div
          data-active={isActive || undefined}
          className={cn(
            "relative flex h-8 min-w-[2.125rem] items-center justify-center rounded-[4px] px-0.5 text-xs tabular-nums transition-[opacity,box-shadow] duration-150 motion-reduce:transition-none",
            fill == null ? "bg-muted/40" : "text-foreground",
            isAverage ? "font-semibold" : "font-medium",
            active != null && !inCrosshair && "opacity-50",
            "data-[active]:z-10 data-[active]:ring-2 data-[active]:ring-foreground/80 data-[active]:ring-offset-1 data-[active]:ring-offset-card",
            "group-focus-visible/cell:z-10 group-focus-visible/cell:ring-2 group-focus-visible/cell:ring-ring group-focus-visible/cell:ring-offset-1 group-focus-visible/cell:ring-offset-card",
          )}
          style={
            fill == null
              ? { backgroundImage: hatch }
              : { backgroundColor: fill, color: inkFor(fill) }
          }
        >
          <span aria-hidden="true">{display(cell)}</span>
        </div>
      </td>
    );
  };

  const rowHeader = (row: number, label: string, size: number) => {
    const isActive = active?.row === row;
    return (
      <th
        scope="row"
        data-active={isActive || undefined}
        onPointerEnter={() => setHovered(null)}
        className={cn(
          "sticky left-0 z-20 bg-card py-0 pr-2.5 pl-4 text-left font-normal whitespace-nowrap",
          "before:absolute before:inset-y-2 before:left-1.5 before:w-0.5 before:rounded-full before:bg-foreground before:opacity-0 before:transition-opacity data-[active]:before:opacity-100 motion-reduce:before:transition-none",
          stickyFade,
          row === averageRow && "border-t border-dashed pt-2",
        )}
      >
        <span className="flex items-baseline justify-between gap-3">
          <span
            className={cn(
              "text-xs transition-colors motion-reduce:transition-none",
              row === averageRow
                ? "font-semibold text-foreground"
                : "font-medium text-foreground/80",
              isActive && "text-foreground",
            )}
          >
            {label}
          </span>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {formatSize(size)}
          </span>
        </span>
      </th>
    );
  };

  return (
    <div
      data-slot="cohort-grid"
      data-mode={mode}
      className={cn(
        "flex min-w-0 flex-col rounded-xl border bg-card text-card-foreground shadow-xs",
        className,
      )}
      {...props}
    >
      {hasHeader ? (
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 px-4 pt-4">
          <div className="min-w-0 space-y-1">
            {title != null ? (
              <h3 className="text-sm leading-5 font-semibold tracking-tight">
                {title}
              </h3>
            ) : null}
            {description != null ? (
              <p id={`${id}-description`} className="text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {actions != null ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}

      <div
        ref={scrollRef}
        data-scrolled={scrolled}
        className={cn(
          "group/scroll relative overflow-x-auto overscroll-x-contain pb-1",
          hasHeader ? "mt-4" : "mt-3",
        )}
        onScroll={(event) => setScrolled(event.currentTarget.scrollLeft > 0)}
      >
        <table
          ref={tableRef}
          role="grid"
          aria-label={tableLabel}
          aria-describedby={description != null ? `${id}-description` : undefined}
          aria-rowcount={rowCount + 1}
          aria-colcount={periods.length + 1}
          onKeyDown={onKeyDown}
          onPointerLeave={() => setHovered(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setFocused(null);
          }}
          className="w-full border-separate border-spacing-0 text-xs"
        >
          <thead onPointerEnter={() => setHovered(null)}>
            <tr>
              <th
                scope="col"
                className={cn(
                  "sticky left-0 z-20 bg-card pr-2.5 pb-1.5 pl-4 text-left align-bottom font-normal whitespace-nowrap",
                  stickyFade,
                )}
              >
                <span className="flex items-baseline justify-between gap-3 text-[11px] font-medium text-muted-foreground">
                  <span>{cohortLabel}</span>
                  <span>{sizeLabel}</span>
                </span>
              </th>
              {periods.map((period, col) => {
                const isActive = active?.col === col;
                return (
                  <th
                    key={col}
                    scope="col"
                    data-active={isActive || undefined}
                    style={{ width: `${100 / Math.max(1, periods.length)}%` }}
                    className={cn(
                      "group/col px-0 pb-1.5 text-center align-bottom text-[11px] font-medium whitespace-nowrap text-muted-foreground tabular-nums transition-colors motion-reduce:transition-none",
                      "data-[active]:text-foreground",
                      col === periods.length - 1 && "pr-4",
                    )}
                  >
                    <span className="relative inline-block px-0.5 after:absolute after:inset-x-0.5 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 after:transition-opacity group-data-[active]/col:after:opacity-100 motion-reduce:after:transition-none">
                      {period}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort, row) => (
              <tr key={cohort.id}>
                {rowHeader(row, cohort.label, cohort.size)}
                {periods.map((_, col) => renderCell(row, col))}
              </tr>
            ))}
          </tbody>
          {showAverage ? (
            <tfoot>
              <tr>
                {rowHeader(averageRow, resolvedAverageLabel, totalSize)}
                {periods.map((_, col) => renderCell(averageRow, col))}
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t px-4 py-3">
        <div
          aria-hidden="true"
          data-slot="cohort-grid-readout"
          className="flex min-h-8 min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-xs"
        >
          {activeCell ? (
            <>
              <span className="font-medium text-foreground">
                {activeCell.label}
              </span>
              <span className="rounded-[4px] border px-1.5 py-px font-mono text-[10.5px] text-muted-foreground">
                {activeCell.period}
              </span>
              {activeCell.value == null ? (
                <span className="text-muted-foreground">No data yet</span>
              ) : (
                <>
                  <span className="text-sm font-semibold tabular-nums">
                    {formatDetail(activeCell.value)}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatExact(activeCell.retained ?? 0)} of{" "}
                    {formatExact(activeCell.base)} {unit}
                  </span>
                </>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground tabular-nums">
                {cohorts.length}
              </span>{" "}
              cohorts ·{" "}
              <span className="font-medium text-foreground tabular-nums">
                {formatExact(totalSize)}
              </span>{" "}
              {unit}
              <span className="hidden sm:inline"> · hover a cell for detail</span>
            </span>
          )}
        </div>

        {showLegend ? (
          <div
            data-slot="cohort-grid-legend"
            className="flex items-center gap-4 text-[10.5px] text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-3 rounded-[3px] bg-muted/40 inset-ring inset-ring-foreground/5"
                style={{ backgroundImage: hatch }}
              />
              Pending
            </span>
            <span className="flex flex-col gap-1">
              <span
                aria-hidden="true"
                className="block h-2 w-32 rounded-full inset-ring inset-ring-foreground/5"
                style={{
                  backgroundImage: `linear-gradient(to right, ${fillFor(color, 0)}, ${fillFor(color, 0.5)}, ${fillFor(color, 1)})`,
                }}
              />
              <span className="flex justify-between font-mono tabular-nums">
                <span>{formatCell(low)}</span>
                <span className="sr-only"> to </span>
                <span>{formatCell(high)}</span>
              </span>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { CohortGrid };
