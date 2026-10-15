/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 *
 * MIT License
 *
 * Copyright (c) 2026 dashboardcn contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * ---
 *
 * Portions of this project are derived from shadcn/ui and shadcn/registry-template
 * (https://github.com/shadcn-ui/ui), Copyright (c) 2023 shadcn, licensed under the
 * MIT License. The notice above applies to those portions as well.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { formatNumber } from "./metric-format";

export interface HeatmapRow {
  label: string;
  /** One value per column, in column order. Missing entries read as 0. */
  values: number[];
}

/** A cell's position by row and column index. */
export interface HeatmapCell {
  row: number;
  column: number;
}

export interface HeatmapDatum extends HeatmapCell {
  rowLabel: string;
  columnLabel: string;
  value: number;
}

export interface HeatmapChartProps extends React.ComponentProps<"div"> {
  /** One row per line of the matrix, top to bottom. */
  rows: HeatmapRow[];
  /** Column labels, left to right. Sets the number of columns. */
  columns: string[];
  /** Any CSS color. Cells mix this into the card surface by value. Defaults to chart-1. */
  color?: string;
  /** Value drawn fully saturated. Defaults to the largest value. */
  max?: number;
  /** How values map to color. `sqrt` spreads out small values. */
  scale?: "linear" | "sqrt";
  /** Quantize the fill into this many steps instead of a continuous ramp. */
  levels?: number;
  /** Gap between cells in px. Cells themselves stretch to fill the container. */
  gap?: number;
  /** Cells stay square until they reach this height in px, then widen to fill the row. */
  maxCellHeight?: number;
  valueFormatter?: (value: number) => string;
  /** Label for the value in the tooltip, e.g. "sessions". */
  unit?: string;
  showLegend?: boolean;
  showRowLabels?: boolean;
  showColumnLabels?: boolean;
  /** Show every nth column label. Defaults to whatever keeps about 12 labels. */
  columnLabelEvery?: number;
  /** Replace the tooltip body. Return `null` to hide it for that cell. */
  renderTooltip?: (datum: HeatmapDatum) => React.ReactNode;
  onCellClick?: (datum: HeatmapDatum) => void;
  /** The hovered cell, to control it from outside. */
  activeCell?: HeatmapCell | null;
  /** Called when the hovered cell changes, with null when the pointer leaves. */
  onActiveCellChange?: (cell: HeatmapCell | null) => void;
}

const EMPTY_FILL = "color-mix(in oklab, var(--color-muted) 72%, transparent)";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function useReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Where a value sits between the empty track (0) and the accent (1). */
function fractionFor(
  value: number,
  max: number,
  scale: "linear" | "sqrt",
  levels?: number,
) {
  if (value <= 0 || max <= 0) return 0;
  let t = Math.min(1, value / max);
  if (scale === "sqrt") t = Math.sqrt(t);
  if (levels && levels > 1) {
    t = Math.max(1, Math.ceil(t * (levels - 1))) / (levels - 1);
  }
  return t;
}

/**
 * A sequential ramp mixed in OKLab from the card surface to the accent, so equal
 * steps in value read as equal steps in lightness in light and dark themes alike.
 */
function fillFor(color: string, fraction: number) {
  if (fraction <= 0) return EMPTY_FILL;
  // Floor the mix so the smallest non-zero values still read against the surface.
  const pct = Math.round(12 + fraction * 88);
  return `color-mix(in oklab, ${color} ${pct}%, var(--color-card))`;
}

function percentOf(value: number, max: number) {
  if (!(max > 0)) return "0%";
  const pct = (value / max) * 100;
  if (pct > 0 && pct < 1) return "<1%";
  return `${Math.round(pct)}%`;
}

/**
 * A matrix heatmap with a row per line and a column per label, e.g. weekday by hour.
 * Cells stretch to the container width. Hovering or focusing a cell outlines it,
 * lights up its row and column as a crosshair, and shows a readout; arrow keys move
 * between cells.
 */
function HeatmapChart({
  rows,
  columns,
  color = "var(--color-chart-1)",
  max,
  scale = "linear",
  levels,
  gap = 4,
  maxCellHeight = 32,
  valueFormatter = (value) => formatNumber(value),
  unit,
  showLegend = true,
  showRowLabels = true,
  showColumnLabels = true,
  columnLabelEvery,
  renderTooltip,
  onCellClick,
  activeCell,
  onActiveCellChange,
  className,
  ...props
}: HeatmapChartProps) {
  const reduced = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const tipRef = React.useRef<HTMLDivElement>(null);
  const [internal, setInternal] = React.useState<HeatmapCell | null>(null);
  const [tabStop, setTabStop] = React.useState<HeatmapCell>({
    row: 0,
    column: 0,
  });
  const [anchor, setAnchor] = React.useState<{
    x: number;
    top: number;
    bottom: number;
  } | null>(null);
  const active = activeCell === undefined ? internal : activeCell;
  const setActive = (cell: HeatmapCell | null) => {
    if (cell?.row === active?.row && cell?.column === active?.column) return;
    setInternal(cell);
    onActiveCellChange?.(cell);
  };

  const { top, peak } = React.useMemo(() => {
    let best: HeatmapCell | null = null;
    let bestValue = 0;
    rows.forEach((row, r) =>
      row.values.forEach((value, c) => {
        if (c < columns.length && value > bestValue) {
          bestValue = value;
          best = { row: r, column: c };
        }
      }),
    );
    return {
      top: max ?? bestValue,
      peak: best as HeatmapCell | null,
    };
  }, [rows, columns.length, max]);

  const every = columnLabelEvery ?? Math.max(1, Math.ceil(columns.length / 12));
  const steps = levels && levels > 1 ? levels : 0;

  const withUnit = (value: number) =>
    unit ? `${valueFormatter(value)} ${unit}` : valueFormatter(value);

  const datumAt = (cell: HeatmapCell): HeatmapDatum | null => {
    const row = rows[cell.row];
    const column = columns[cell.column];
    if (!row || column === undefined) return null;
    return {
      row: cell.row,
      column: cell.column,
      rowLabel: row.label,
      columnLabel: column,
      value: row.values[cell.column] ?? 0,
    };
  };

  const activeDatum = active ? datumAt(active) : null;
  const activeFraction = activeDatum
    ? fractionFor(activeDatum.value, top, scale, levels)
    : null;

  // Which edges have more columns hidden behind them, so they can fade out.
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ start: false, end: false });
  const updateEdges = React.useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const start = node.scrollLeft > 1;
    const end = node.scrollLeft < node.scrollWidth - node.clientWidth - 1;
    setEdges((current) =>
      current.start === start && current.end === end ? current : { start, end },
    );
  }, []);
  useIsomorphicLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    updateEdges();
    const observer = new ResizeObserver(updateEdges);
    observer.observe(node);
    return () => observer.disconnect();
  }, [updateEdges, columns.length]);

  // Measure the active cell so the readout can float above it, outside the scroll area.
  const measure = React.useCallback(() => {
    const root = rootRef.current;
    if (!root || !active) {
      setAnchor(null);
      return;
    }
    const cell = gridRef.current?.querySelector<HTMLElement>(
      `[data-row="${active.row}"][data-column="${active.column}"]`,
    );
    if (!cell) {
      setAnchor(null);
      return;
    }
    const box = root.getBoundingClientRect();
    const rect = cell.getBoundingClientRect();
    setAnchor({
      x: rect.left + rect.width / 2 - box.left,
      top: rect.top - box.top,
      bottom: rect.bottom - box.top,
    });
  }, [active]);

  useIsomorphicLayoutEffect(measure, [measure, rows, columns]);

  // Keep the readout inside the chart's width and flip it below the cell near the top edge.
  useIsomorphicLayoutEffect(() => {
    const tip = tipRef.current;
    const root = rootRef.current;
    if (!tip || !root || !anchor) return;
    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    const limit = root.clientWidth;
    const left = Math.min(
      Math.max(anchor.x - width / 2, 0),
      Math.max(0, limit - width),
    );
    const below = anchor.top - height - 10 < -4;
    const y = below ? anchor.bottom + 10 : anchor.top - height - 10;
    tip.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(y)}px, 0)`;
    tip.dataset.side = below ? "bottom" : "top";
  });

  const focusCell = (cell: HeatmapCell) => {
    const row = Math.min(Math.max(cell.row, 0), rows.length - 1);
    const column = Math.min(Math.max(cell.column, 0), columns.length - 1);
    setTabStop({ row, column });
    gridRef.current
      ?.querySelector<HTMLElement>(
        `[data-row="${row}"][data-column="${column}"]`,
      )
      ?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.dataset.slot !== "heatmap-chart-cell") return;
    const row = Number(target.dataset.row);
    const column = Number(target.dataset.column);
    const next: Record<string, HeatmapCell | undefined> = {
      ArrowRight: { row, column: column + 1 },
      ArrowLeft: { row, column: column - 1 },
      ArrowDown: { row: row + 1, column },
      ArrowUp: { row: row - 1, column },
      Home: { row, column: 0 },
      End: { row, column: columns.length - 1 },
    };
    const cell = next[event.key];
    if (!cell) return;
    event.preventDefault();
    focusCell(cell);
  };

  const stop = {
    row: Math.min(tabStop.row, Math.max(0, rows.length - 1)),
    column: Math.min(tabStop.column, Math.max(0, columns.length - 1)),
  };

  const tooltipBody = activeDatum ? (
    renderTooltip ? (
      renderTooltip(activeDatum)
    ) : (
      <div className="grid min-w-36 gap-1">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-[3px] inset-ring inset-ring-foreground/10"
            style={{
              backgroundColor: fillFor(color, activeFraction ?? 0),
            }}
          />
          <span className="font-medium text-foreground">
            {activeDatum.rowLabel}
            <span className="px-1 text-muted-foreground">·</span>
            {activeDatum.columnLabel}
          </span>
          <span className="ml-auto pl-4 font-semibold text-foreground tabular-nums">
            {valueFormatter(activeDatum.value)}
            {unit ? (
              <span className="ml-1 font-normal text-muted-foreground">
                {unit}
              </span>
            ) : null}
          </span>
        </div>
        <div className="pl-[18px] text-[11px] text-muted-foreground tabular-nums">
          {peak &&
          peak.row === activeDatum.row &&
          peak.column === activeDatum.column
            ? "Peak value"
            : `${percentOf(activeDatum.value, top)} of peak`}
        </div>
      </div>
    )
  ) : null;

  const peakDatum = peak ? datumAt(peak) : null;
  const legendGradient = steps
    ? null
    : `linear-gradient(to right, ${[0.02, 0.25, 0.5, 0.75, 1]
        .map((t) => fillFor(color, t))
        .join(", ")})`;

  return (
    <div
      ref={rootRef}
      data-slot="heatmap-chart"
      data-active={active ? "" : undefined}
      className={cn("relative flex min-w-0 flex-col gap-3 text-xs", className)}
      {...props}
    >
      <style href="overtrue-heatmap-chart" precedence="default">
        {`@keyframes heatmap-cell-in{from{opacity:0;transform:scale(.55)}}`}
      </style>
      <div
        ref={scrollRef}
        // The padding keeps the active outline clear of the scroll clip; the margin cancels it out.
        className="-m-1 overflow-x-auto overscroll-x-contain p-1 [scrollbar-color:color-mix(in_oklab,var(--color-foreground)_18%,transparent)_transparent] [scrollbar-width:thin]"
        tabIndex={0}
        role="region"
        aria-label="Heatmap, scroll to see all columns"
        onScroll={() => {
          measure();
          updateEdges();
        }}
        style={{
          maskImage:
            edges.start || edges.end
              ? `linear-gradient(to right, ${edges.start ? "transparent, #000 24px" : "#000"}, ${edges.end ? "#000 calc(100% - 24px), transparent" : "#000"})`
              : undefined,
        }}
      >
        <div
          ref={gridRef}
          role="group"
          aria-label="Heatmap"
          className="grid min-w-0 items-center"
          style={{
            gap,
            gridTemplateColumns: `${showRowLabels ? "auto " : ""}repeat(${columns.length}, minmax(${showColumnLabels ? "1.125rem" : "1rem"}, 1fr))`,
          }}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKeyDown}
          onBlur={(event) => {
            // Keep the highlight while focus moves between cells so the readout does not flash.
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setActive(null);
          }}
        >
          {rows.map((row, r) => (
            <React.Fragment key={r}>
              {showRowLabels ? (
                <div
                  data-slot="heatmap-chart-row-label"
                  data-active={active?.row === r}
                  onPointerEnter={() => setActive(null)}
                  className="flex items-center gap-1.5 pr-2 leading-none whitespace-nowrap text-muted-foreground transition-colors duration-150 data-[active=true]:font-medium data-[active=true]:text-foreground motion-reduce:transition-none"
                >
                  {row.label}
                </div>
              ) : null}
              {columns.map((column, c) => {
                const value = row.values[c] ?? 0;
                const datum: HeatmapDatum = {
                  row: r,
                  column: c,
                  rowLabel: row.label,
                  columnLabel: column,
                  value,
                };
                const isActive = active?.row === r && active?.column === c;
                const inCrosshair =
                  active != null && (active.row === r || active.column === c);
                const fraction = fractionFor(value, top, scale, levels);

                return (
                  <button
                    key={c}
                    type="button"
                    aria-label={`${withUnit(value)}, ${row.label} ${column}`}
                    data-slot="heatmap-chart-cell"
                    data-row={r}
                    data-column={c}
                    data-active={isActive}
                    data-empty={fraction === 0 || undefined}
                    tabIndex={stop.row === r && stop.column === c ? 0 : -1}
                    onPointerEnter={() => setActive({ row: r, column: c })}
                    onFocus={() => {
                      setTabStop({ row: r, column: c });
                      setActive({ row: r, column: c });
                    }}
                    onClick={onCellClick ? () => onCellClick(datum) : undefined}
                    className={cn(
                      "relative aspect-square w-full rounded-[4px] inset-ring inset-ring-foreground/6 outline-0 outline-offset-1 outline-transparent",
                      // In dark mode the strongest cells give off a little light of their own.
                      "dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_0_14px_-3px_var(--heatmap-glow)]",
                      "transition-[background-color,opacity,outline-color] [transition-duration:450ms,150ms,150ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      "data-[active=true]:z-10 data-[active=true]:outline-2 data-[active=true]:outline-foreground/85",
                      "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-ring",
                      active != null && !inCrosshair && "opacity-45",
                      !reduced &&
                        "motion-safe:animate-[heatmap-cell-in_640ms_cubic-bezier(0.22,1,0.36,1)_backwards]",
                      onCellClick ? "cursor-pointer" : "cursor-default",
                    )}
                    style={{
                      maxHeight: maxCellHeight,
                      backgroundColor: fillFor(color, fraction),
                      ["--heatmap-glow" as string]:
                        fraction > 0.55
                          ? `color-mix(in oklab, ${color} ${Math.round((fraction - 0.55) * 110)}%, transparent)`
                          : "transparent",
                      animationDelay: reduced
                        ? undefined
                        : `${Math.round((r + c) * Math.min(28, 520 / Math.max(1, rows.length + columns.length)))}ms`,
                    }}
                  />
                );
              })}
            </React.Fragment>
          ))}

          {showColumnLabels ? (
            <>
              {showRowLabels ? <div aria-hidden /> : null}
              {columns.map((column, c) => {
                const isActive = active?.column === c;
                return (
                  <div
                    key={c}
                    data-slot="heatmap-chart-column-label"
                    data-active={isActive}
                    onPointerEnter={() => setActive(null)}
                    className="min-w-0 pt-0.5 text-center text-[11px] leading-none whitespace-nowrap text-muted-foreground tabular-nums transition-colors duration-150 data-[active=true]:font-medium data-[active=true]:text-foreground motion-reduce:transition-none"
                  >
                    {c % every === 0 || isActive ? column : ""}
                  </div>
                );
              })}
            </>
          ) : null}
        </div>
      </div>

      {anchor && tooltipBody !== null && tooltipBody !== undefined ? (
        <div
          ref={tipRef}
          aria-hidden="true"
          data-slot="heatmap-chart-tooltip"
          className={cn(
            "pointer-events-none absolute top-0 left-0 z-20 w-max max-w-64 rounded-xl border border-border/70 bg-popover/90 px-3 py-2 text-xs text-popover-foreground shadow-xl backdrop-blur-md",
            !reduced &&
              "transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          )}
        >
          {tooltipBody}
        </div>
      ) : null}

      {showLegend ? (
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div
            data-slot="heatmap-chart-summary"
            className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 text-muted-foreground"
          >
            {peakDatum ? (
              <>
                <span>Peak</span>
                <span className="font-medium text-foreground">
                  {peakDatum.rowLabel} · {peakDatum.columnLabel}
                </span>
                <span aria-hidden="true" className="text-border">
                  /
                </span>
                <span>
                  <span className="font-medium text-foreground tabular-nums">
                    {valueFormatter(peakDatum.value)}
                  </span>
                  {unit ? ` ${unit}` : null}
                </span>
              </>
            ) : null}
          </div>
          <div
            data-slot="heatmap-chart-legend"
            className="ml-auto grid grid-cols-[auto_7.5rem_auto] items-center gap-x-2 gap-y-1 text-muted-foreground"
          >
            <span>Less</span>
            <span className="relative block h-2">
              {steps ? (
                <span className="flex h-full gap-0.5">
                  {Array.from({ length: steps }, (_, i) => (
                    <span
                      key={i}
                      className="h-full flex-1 rounded-[2px] inset-ring inset-ring-foreground/6 first:rounded-l-full last:rounded-r-full"
                      style={{
                        backgroundColor: fillFor(color, i / (steps - 1)),
                      }}
                    />
                  ))}
                </span>
              ) : (
                <span
                  className="block h-full rounded-full inset-ring inset-ring-foreground/6"
                  style={{ backgroundImage: legendGradient ?? undefined }}
                />
              )}
              <span
                aria-hidden="true"
                data-slot="heatmap-chart-legend-marker"
                className={cn(
                  "absolute -top-[3px] -bottom-[3px] w-[3px] -translate-x-1/2 rounded-full bg-foreground shadow-[0_0_0_1.5px_var(--color-card)] transition-[left,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  activeFraction == null ? "opacity-0" : "opacity-100",
                )}
                style={{
                  left: `${Math.min(98.5, Math.max(1.5, (activeFraction ?? 0) * 100))}%`,
                }}
              />
            </span>
            <span>More</span>
            <span
              aria-hidden="true"
              className="col-start-2 flex justify-between text-[11px] leading-none tabular-nums"
            >
              <span>{valueFormatter(0)}</span>
              <span>{valueFormatter(top)}</span>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { HeatmapChart };
