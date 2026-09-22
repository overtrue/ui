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
export type NumberFormat = "number" | "compact" | "currency" | "percent";

export interface FormatNumberOptions {
  format?: NumberFormat;
  /** ISO 4217 code, used when format is "currency". Defaults to USD. */
  currency?: string;
  locale?: string;
  maximumFractionDigits?: number;
  /** Abbreviate large values, e.g. "$158K" instead of "$158,143". */
  compact?: boolean;
}

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string, options: Intl.NumberFormatOptions) {
  const key = locale + JSON.stringify(options);
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    formatterCache.set(key, formatter);
  }
  return formatter;
}

/**
 * Format a metric value for display.
 *
 * formatNumber(1234567)                          -> "1,234,567"
 * formatNumber(1234567, { format: "compact" })   -> "1.2M"
 * formatNumber(48.2, { format: "currency" })     -> "$48.20"
 * formatNumber(158143, { format: "currency", compact: true }) -> "$158K"
 * formatNumber(0.124, { format: "percent" })     -> "12.4%"
 */
export function formatNumber(
  value: number,
  {
    format = "number",
    currency = "USD",
    locale = "en-US",
    maximumFractionDigits,
    compact = false,
  }: FormatNumberOptions = {},
): string {
  if (!Number.isFinite(value)) return "—";

  // Compact values keep three significant digits: $158K, $1.23M, 41.2K.
  const compactOptions: Intl.NumberFormatOptions = compact
    ? maximumFractionDigits === undefined
      ? { notation: "compact", maximumSignificantDigits: 3 }
      : { notation: "compact", maximumFractionDigits }
    : {};
  switch (format) {
    case "compact":
      return getFormatter(locale, {
        notation: "compact",
        maximumFractionDigits: maximumFractionDigits ?? 1,
      }).format(value);
    case "currency":
      return getFormatter(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: maximumFractionDigits ?? 2,
        ...compactOptions,
      }).format(value);
    case "percent":
      return getFormatter(locale, {
        style: "percent",
        maximumFractionDigits: maximumFractionDigits ?? 1,
      }).format(value);
    default:
      return getFormatter(locale, {
        maximumFractionDigits: maximumFractionDigits ?? 0,
        ...compactOptions,
      }).format(value);
  }
}

/**
 * Format a fractional change as a signed percentage.
 *
 * formatDelta(0.124)  -> "+12.4%"
 * formatDelta(-0.03)  -> "-3.0%"
 * formatDelta(0)      -> "0.0%"
 */
export function formatDelta(delta: number, locale = "en-US"): string {
  if (!Number.isFinite(delta)) return "—";
  return getFormatter(locale, {
    style: "percent",
    signDisplay: "exceptZero",
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(delta);
}

/**
 * Fractional change between two values. Returns 0 when there is no baseline.
 */
export function computeDelta(current: number, previous: number): number {
  if (!previous) return 0;
  return (current - previous) / Math.abs(previous);
}
