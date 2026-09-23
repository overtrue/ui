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
  const toneClass =
    tone === "positive"
      ? "text-emerald-700 dark:text-emerald-400"
      : tone === "negative"
        ? "text-destructive"
        : "text-muted-foreground";
  return (
    <Card
      data-slot="stat-card"
      data-trend={trend}
      data-tone={tone}
      className={cn(
        "min-w-0 gap-0 rounded-lg border bg-card py-0 shadow-none",
        className,
      )}
    >
      <CardContent className="p-5">
        <p className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          {title}
          {icon && (
            <span aria-hidden="true" className="shrink-0 [&>svg]:size-4">
              {icon}
            </span>
          )}
        </p>
        <p className="mt-3 wrap-anywhere text-3xl font-semibold tracking-tight tabular-nums text-card-foreground">
          {typeof value === "number" ? value.toLocaleString("en-US") : value}
        </p>
        {sparkline && (
          <Sparkline
            data={sparkline}
            label={`${title} trend`}
            className={cn("mt-4", toneClass)}
          />
        )}
        {(change || description) && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            {change && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  toneClass,
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
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
