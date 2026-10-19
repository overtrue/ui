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
import { Tabs, TabsList, TabsTrigger } from "./analytics-tabs";

export interface PeriodOption {
  value: string;
  label: string;
}

export const defaultPeriods: PeriodOption[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export interface PeriodTabsProps extends Omit<
  React.ComponentProps<typeof Tabs>,
  "children"
> {
  options?: PeriodOption[];
  size?: "sm" | "default";
  /** Slide a single pill between tabs instead of swapping backgrounds. */
  animated?: boolean;
}

interface IndicatorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

// The raised pill shared by the static active tab and the sliding indicator.
const pill =
  "bg-card shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_rgb(0_0_0/0.04)] dark:bg-foreground/10 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_1px_2px_rgb(0_0_0/0.5),0_6px_18px_-10px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]";

/** Small segmented control for switching a chart's time range. */
function PeriodTabs({
  options = defaultPeriods,
  size = "sm",
  animated = false,
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: PeriodTabsProps) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? options[0]?.value,
  );
  const active = value ?? internalValue;
  const [rect, setRect] = React.useState<IndicatorRect | null>(null);
  // The first placement snaps into place; later changes glide.
  const [glide, setGlide] = React.useState(false);

  const measure = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const trigger = list.querySelector<HTMLElement>('[data-state="active"]');
    if (!trigger) return;
    const next = {
      left: trigger.offsetLeft,
      top: trigger.offsetTop,
      width: trigger.offsetWidth,
      height: trigger.offsetHeight,
    };
    setRect((current) =>
      current &&
      current.left === next.left &&
      current.top === next.top &&
      current.width === next.width &&
      current.height === next.height
        ? current
        : next,
    );
  }, []);

  React.useLayoutEffect(() => {
    if (!animated) return;
    measure();
  }, [animated, active, options, size, measure]);

  React.useEffect(() => {
    if (!animated || !listRef.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(listRef.current);
    const frame = requestAnimationFrame(() => setGlide(true));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [animated, measure]);

  return (
    <Tabs
      data-slot="period-tabs"
      className={cn("w-fit", className)}
      value={value}
      defaultValue={defaultValue ?? options[0]?.value}
      onValueChange={(next) => {
        setInternalValue(next);
        onValueChange?.(next);
      }}
      {...props}
    >
      <div ref={listRef}>
        <TabsList
          data-animated={animated || undefined}
          className={cn(
            "relative isolate h-9 gap-0.5 rounded-xl bg-muted/60 p-1 text-muted-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-border)_70%,transparent)] dark:bg-muted/40",
            size === "sm" &&
              "h-8 rounded-[10px] p-1 group-data-[orientation=horizontal]/tabs:h-8",
          )}
        >
          {animated && rect ? (
            <span
              aria-hidden
              data-slot="period-tabs-indicator"
              className={cn(
                "pointer-events-none absolute top-0 left-0 -z-10",
                size === "sm" ? "rounded-md" : "rounded-lg",
                pill,
                glide &&
                  "transition-[translate,width,height] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              )}
              style={{
                width: rect.width,
                height: rect.height,
                translate: `${rect.left}px ${rect.top}px`,
              }}
            />
          ) : null}
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className={cn(
                "h-7 rounded-lg border-0 px-3 text-[13px] font-medium text-muted-foreground tabular-nums transition-[color,background-color,box-shadow] duration-150 hover:text-foreground focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-primary/30 motion-reduce:transition-none data-[state=active]:text-foreground",
                size === "sm" && "h-6 rounded-md px-2.5 text-xs",
                animated
                  ? "data-[state=active]:bg-transparent data-[state=active]:shadow-none group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent"
                  : cn(
                      "data-[state=active]:bg-card data-[state=active]:shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_rgb(0_0_0/0.04)]",
                      "dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-foreground/10 dark:data-[state=active]:shadow-[inset_0_1px_0_rgb(255_255_255/0.07),0_1px_2px_rgb(0_0_0/0.5),0_6px_18px_-10px_color-mix(in_oklab,var(--color-primary)_70%,transparent)]",
                    ),
              )}
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}

export { PeriodTabs };
