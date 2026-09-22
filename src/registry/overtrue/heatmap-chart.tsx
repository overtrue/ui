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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  /** Any CSS color. Cells mix this into `--muted` by value. Defaults to chart-1. */
  color?: string;
  /** Value drawn fully saturated. Defaults to the largest value. */
  max?: number;
  /** How values map to color. `sqrt` spreads out small values. */
  scale?: "linear" | "sqrt";
  /** Quantize the fill into this many steps instead of a continuous ramp. */
  levels?: number;
  /** Gap between cells in px. Cells themselves stretch to fill the container. */
  gap?: number;
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

/** Where a value sits between the muted track (0) and the accent (1). */
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

function fillFor(color: string, fraction: number) {
  if (fraction <= 0) return "var(--color-muted)";
  // Floor the mix so the smallest non-zero values still read against the track.
  const pct = Math.round(12 + fraction * 88);
  return `color-mix(in oklab, ${color} ${pct}%, var(--color-muted))`;
}

/**
 * A matrix heatmap with a row per line and a column per label, e.g. weekday by hour.
 * Cells stretch to the container width. Hovering a cell rings it, lights up its row
 * and column labels, and shows its value.
 */
function HeatmapChart({
  rows,
  columns,
  color = "var(--color-chart-1)",
  max,
  scale = "linear",
  levels,
  gap = 4,
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
  const [internal, setInternal] = React.useState<HeatmapCell | null>(null);
  const active = activeCell === undefined ? internal : activeCell;
  const setActive = (cell: HeatmapCell | null) => {
    setInternal(cell);
    onActiveCellChange?.(cell);
  };

  const top = React.useMemo(
    () =>
      max ??
      rows.reduce(
        (acc, row) => row.values.reduce((m, v) => Math.max(m, v), acc),
        0,
      ),
    [rows, max],
  );

  const every = columnLabelEvery ?? Math.max(1, Math.ceil(columns.length / 12));
  const steps = levels && levels > 1 ? levels : 5;
  const swatches = Array.from({ length: steps }, (_, i) =>
    fillFor(color, i / (steps - 1)),
  );

  const withUnit = (value: number) =>
    unit ? `${valueFormatter(value)} ${unit}` : valueFormatter(value);

  return (
    <div
      data-slot="heatmap-chart"
      className={cn("flex min-w-0 flex-col gap-2 text-xs", className)}
      {...props}
    >
      <TooltipProvider delayDuration={100} skipDelayDuration={0}>
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Heatmap, scroll to see all columns"
        >
          <div
            role="group"
            aria-label="Heatmap"
            className="grid min-w-0"
            style={{
              gap,
              gridTemplateColumns: `${showRowLabels ? "auto " : ""}repeat(${columns.length}, minmax(${showColumnLabels ? "2rem" : "1rem"}, 1fr))`,
            }}
            onPointerLeave={() => setActive(null)}
          >
            {rows.map((row, r) => (
              <React.Fragment key={r}>
                {showRowLabels ? (
                  <div
                    data-slot="heatmap-chart-row-label"
                    data-active={active?.row === r}
                    onPointerEnter={() => setActive(null)}
                    className="text-muted-foreground data-[active=true]:text-foreground flex items-center pr-1.5 leading-none whitespace-nowrap transition-colors"
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
                  const body = renderTooltip ? (
                    renderTooltip(datum)
                  ) : (
                    <>
                      <span className="font-medium tabular-nums">
                        {withUnit(value)}
                      </span>
                      <span className="text-background/70 block">
                        {row.label} · {column}
                      </span>
                    </>
                  );

                  const cell = (
                    <button
                      type="button"
                      aria-label={`${withUnit(value)}, ${row.label} ${column}`}
                      data-slot="heatmap-chart-cell"
                      data-row={r}
                      data-column={c}
                      data-active={isActive}
                      onPointerEnter={() => setActive({ row: r, column: c })}
                      onFocus={() => setActive({ row: r, column: c })}
                      onBlur={(event) => {
                        // Keep the highlight while focus moves between cells so the readout does not flash.
                        const next = event.relatedTarget;
                        if (
                          next instanceof HTMLElement &&
                          next.dataset.slot === "heatmap-chart-cell"
                        )
                          return;
                        setActive(null);
                      }}
                      onClick={
                        onCellClick ? () => onCellClick(datum) : undefined
                      }
                      className={cn(
                        "inset-ring-foreground/6 aspect-square w-full rounded-sm outline-none inset-ring transition-[box-shadow] duration-100",
                        "data-[active=true]:inset-ring-foreground/45 data-[active=true]:inset-ring-2",
                        "focus-visible:inset-ring-ring focus-visible:inset-ring-2",
                        onCellClick ? "cursor-pointer" : "cursor-default",
                      )}
                      style={{
                        backgroundColor: fillFor(
                          color,
                          fractionFor(value, top, scale, levels),
                        ),
                      }}
                    />
                  );

                  if (body === null) {
                    return <React.Fragment key={c}>{cell}</React.Fragment>;
                  }

                  return (
                    <Tooltip key={c}>
                      <TooltipTrigger asChild>{cell}</TooltipTrigger>
                      <TooltipContent sideOffset={4} className="text-left">
                        {body}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </React.Fragment>
            ))}

            {showColumnLabels ? (
              <>
                {showRowLabels ? <div aria-hidden /> : null}
                {columns.map((column, c) => (
                  <div
                    key={c}
                    data-slot="heatmap-chart-column-label"
                    data-active={active?.column === c}
                    onPointerEnter={() => setActive(null)}
                    className="text-muted-foreground data-[active=true]:text-foreground min-w-0 pt-0.5 text-center leading-none whitespace-nowrap transition-colors"
                  >
                    {c % every === 0 ? column : ""}
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>
      </TooltipProvider>

      {showLegend ? (
        <div className="text-muted-foreground flex items-center justify-end gap-1">
          <span className="mr-0.5">Less</span>
          {swatches.map((fill, index) => (
            <span
              key={index}
              className="inset-ring-foreground/6 size-3 rounded-[3px] inset-ring"
              style={{ backgroundColor: fill }}
            />
          ))}
          <span className="ml-0.5">More</span>
        </div>
      ) : null}
    </div>
  );
}

export { HeatmapChart };
