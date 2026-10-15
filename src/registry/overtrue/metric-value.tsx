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
import { formatNumber, type NumberFormat } from "./metric-format";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Values at or above this are abbreviated by default. */
export const DEFAULT_COMPACT_FROM = 100_000;

export interface MetricValueProps extends Omit<
  React.ComponentProps<"span">,
  "children"
> {
  /** Strings render as-is. */
  value: number | string;
  format?: NumberFormat;
  currency?: string;
  maximumFractionDigits?: number;
  /** Values at or above this are abbreviated (e.g. $158K) with the full value in a tooltip. Set to Infinity to always show the full value. */
  compactFrom?: number;
  /** Text after the number, e.g. a unit. */
  suffix?: React.ReactNode;
}

// Units and currency symbols sit quieter than the digits they qualify, in
// whatever color the figure has. They never drop below 12px, and a currency
// symbol rises toward the cap height only once the figure is large.
const quiet = "font-medium tracking-normal text-current/55";
const unitSize = "text-[length:max(0.6em,0.75rem)]";
const symbolSize =
  "mr-[0.04em] text-[length:max(0.62em,0.75rem)] align-[calc((1em_-_0.75rem)*1.1)]";

/**
 * Split "$1,234.5", "-€12", "12.4%" or "2.4 days" into a quiet symbol, the
 * digits, and a quiet unit. Magnitude letters (K, M, B) stay with the digits.
 * Anything else, such as "Q3 2026", renders untouched.
 */
function typeset(text: string) {
  const match =
    /^([+\-\u2212]?)([^\d\s+\-\u2212]{0,3})(\d(?:[\d.,\u202f\u00a0]*\d)?[KkMBT]?)(%|\s+\S.*)?$/.exec(
      text,
    );
  if (!match || /[a-z]/i.test(match[2].replace(/[A-Z]{1,2}(?=\$)/, "")))
    return text;
  const [, sign, symbol, digits, unit] = match;
  return (
    <>
      {sign}
      {symbol ? (
        <span data-slot="metric-value-affix" className={cn(quiet, symbolSize)}>
          {symbol}
        </span>
      ) : null}
      {digits}
      {unit ? (
        <span data-slot="metric-value-unit" className={cn(quiet, unitSize)}>
          {unit}
        </span>
      ) : null}
    </>
  );
}

function Unit({ children }: { children: React.ReactNode }) {
  if (children === null || children === undefined || children === false)
    return null;
  return (
    <span data-slot="metric-value-unit" className={cn(quiet, unitSize)}>
      {children}
    </span>
  );
}

/** A formatted number. Large values are abbreviated and reveal the full value on hover. */
function MetricValue({
  value,
  format,
  currency,
  maximumFractionDigits,
  compactFrom = DEFAULT_COMPACT_FROM,
  suffix,
  className,
  ...props
}: MetricValueProps) {
  const classes = cn("tabular-nums tracking-[-0.02em]", className);

  if (typeof value !== "number") {
    return (
      <span data-slot="metric-value" className={classes} {...props}>
        {typeset(value)}
        <Unit>{suffix}</Unit>
      </span>
    );
  }

  const full = formatNumber(value, { format, currency, maximumFractionDigits });
  const abbreviate = format !== "percent" && Math.abs(value) >= compactFrom;
  if (!abbreviate) {
    return (
      <span data-slot="metric-value" className={classes} {...props}>
        {typeset(full)}
        <Unit>{suffix}</Unit>
      </span>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            data-slot="metric-value"
            data-compact=""
            className={cn(
              classes,
              "cursor-default decoration-current/30 decoration-dotted underline-offset-[0.18em] hover:underline",
            )}
            {...props}
          >
            {typeset(formatNumber(value, { format, currency, compact: true }))}
            <Unit>{suffix}</Unit>
          </span>
        </TooltipTrigger>
        <TooltipContent className="font-medium tabular-nums">
          {full}
          {suffix}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { MetricValue };
