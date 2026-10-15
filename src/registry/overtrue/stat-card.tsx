"use client";
import type { ReactNode } from "react";
import {
  IconArrowDownRight as ArrowDownRight,
  IconArrowUpRight as ArrowUpRight,
  IconMinus as Minus,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkline } from "./sparkline";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  /** A decrease is positive for metrics such as latency or churn. */
  positiveTrend?: "up" | "down";
  sparkline?: number[];
  icon?: ReactNode;
  description?: string;
  className?: string;
}

// Currency symbols and units sit quieter than the digits; "Q3 2026" stays untouched.
const quiet = "font-medium tracking-normal text-current/50";
const unitSize = "text-[0.6em]";
const symbolSize = "mr-[0.04em] text-[0.62em] align-[0.4em]";
function typeset(text: string) {
  const match =
    /^([+\-−]?)([^\d\s+\-−]{0,3})(\d(?:[\d.,  ]*\d)?[KkMBT]?)(%|\s+\S.*)?$/.exec(
      text,
    );
  if (!match || /[a-z]/i.test(match[2].replace(/[A-Z]{1,2}(?=\$)/, "")))
    return text;
  const [, sign, symbol, digits, unit] = match;
  return (
    <>
      {sign}
      {symbol ? <span className={cn(quiet, symbolSize)}>{symbol}</span> : null}
      {digits}
      {unit ? <span className={cn(quiet, unitSize)}>{unit}</span> : null}
    </>
  );
}

const toneText = {
  positive: "text-emerald-700 dark:text-emerald-400",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
};
const tonePill = {
  positive: "bg-emerald-500/10 dark:bg-emerald-400/10",
  negative: "bg-destructive/10",
  neutral: "bg-muted",
};
const toneLine = {
  positive: "text-emerald-600 dark:text-emerald-400",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
};

export function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  positiveTrend = "up",
  sparkline,
  icon,
  description,
  className,
}: StatCardProps) {
  const Icon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const tone =
    trend === "neutral"
      ? "neutral"
      : trend === positiveTrend
        ? "positive"
        : "negative";
  return (
    <Card
      data-slot="stat-card"
      data-trend={trend}
      data-tone={tone}
      className={cn(
        "min-w-0 gap-0 rounded-2xl border border-border/70 bg-card py-0 text-card-foreground ring-0 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        className,
      )}
    >
      <CardContent className="p-5">
        <p
          data-slot="stat-card-title"
          className="flex min-h-7 items-center justify-between gap-3 text-sm leading-5 font-medium text-muted-foreground"
        >
          {title}
          {icon && (
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted/60 text-muted-foreground ring-1 ring-border/60 ring-inset [&>svg]:size-4"
            >
              {icon}
            </span>
          )}
        </p>
        <p
          data-slot="stat-card-value"
          className="mt-2 text-3xl leading-9 font-semibold tracking-[-0.035em] wrap-anywhere text-card-foreground tabular-nums"
        >
          {typeset(
            typeof value === "number" ? value.toLocaleString("en-US") : value,
          )}
        </p>
        {sparkline && (
          <Sparkline
            data={sparkline}
            label={`${title} trend`}
            className={cn("mt-4", toneLine[tone])}
          />
        )}
        {(change || description) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {change && (
              <span
                data-slot="stat-card-change"
                className={cn(
                  "inline-flex h-5 items-center gap-0.5 rounded-full pr-1.5 pl-1 leading-none font-medium tracking-[-0.01em] tabular-nums",
                  toneText[tone],
                  tonePill[tone],
                )}
              >
                <Icon
                  className="size-3 shrink-0"
                  aria-hidden="true"
                  stroke={2.5}
                />
                <span className="sr-only">
                  {trend === "up"
                    ? "Increase"
                    : trend === "down"
                      ? "Decrease"
                      : "No change"}
                  {tone !== "neutral" ? ` (${tone})` : ""}:{" "}
                </span>
                {change}
              </span>
            )}
            <span className="text-muted-foreground">
              {description ?? "vs. last month"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
