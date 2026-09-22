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

  const measure = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const trigger = list.querySelector<HTMLElement>('[data-state="active"]');
    if (!trigger) return;
    setRect({
      left: trigger.offsetLeft,
      top: trigger.offsetTop,
      width: trigger.offsetWidth,
      height: trigger.offsetHeight,
    });
  }, []);

  React.useLayoutEffect(() => {
    if (!animated) return;
    measure();
  }, [animated, active, options, size, measure]);

  React.useEffect(() => {
    if (!animated || !listRef.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(listRef.current);
    return () => observer.disconnect();
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
          className={cn(
            "relative",
            size === "sm" && "group-data-[orientation=horizontal]/tabs:h-8 p-1",
          )}
        >
          {animated && rect ? (
            <span
              aria-hidden
              data-slot="period-tabs-indicator"
              className="pointer-events-none absolute rounded-md bg-background shadow-sm transition-[left,top,width,height] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none dark:border dark:border-input dark:bg-input/30"
              style={rect}
            />
          ) : null}
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className={cn(
                size === "sm" && "h-6 px-2.5 text-xs",
                animated &&
                  "relative z-10 data-[state=active]:bg-transparent group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent",
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
