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
import * as React from "react";

import { cn } from "@/lib/utils";

export interface TickBarProps extends React.ComponentProps<"div"> {
  /** Current value, from 0 to max. */
  value: number;
  max?: number;
  /** Number of ticks. */
  segments?: number;
  /** Any CSS color for the filled ticks. Defaults to chart-1. */
  color?: string;
  /** Any CSS color for the unfilled ticks. Defaults to muted. */
  trackColor?: string;
  /** "tick" draws thin bars; "pill" draws wide rounded ones. */
  shape?: "tick" | "pill";
  /** Reveal filled ticks in sequence when the bar mounts. */
  animate?: boolean;
  /** Total reveal time in milliseconds. */
  animationDuration?: number;
}

/** A progress bar drawn as a row of ticks, lit up to the current value. */
function TickBar({
  value,
  max = 100,
  segments = 40,
  color = "var(--color-chart-1)",
  trackColor,
  shape = "tick",
  animate = false,
  animationDuration = 700,
  className,
  ...props
}: TickBarProps) {
  const fraction = Math.min(1, Math.max(0, value / (max || 1)));
  // Any non-zero value lights at least one tick so small values still register.
  const filled =
    fraction === 0 ? 0 : Math.max(1, Math.round(fraction * segments));

  return (
    <div
      data-slot="tick-bar"
      data-shape={shape}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn(
        "flex w-full",
        shape === "tick" ? "h-6 gap-[3px]" : "h-4 gap-1.5",
        className,
      )}
      {...props}
    >
      {Array.from({ length: segments }, (_, index) => {
        const lit = index < filled;
        return (
          <span
            key={index}
            data-filled={lit}
            className={cn(
              "bg-muted relative h-full min-w-0 flex-1 overflow-hidden transition-colors",
              shape === "tick" ? "rounded-[1.5px]" : "rounded-full",
            )}
            style={{ backgroundColor: trackColor }}
          >
            {lit ? (
              <span
                className={cn(
                  "absolute inset-0",
                  shape === "tick" ? "rounded-[1.5px]" : "rounded-full",
                  animate && "motion-safe:animate-in motion-safe:fade-in",
                )}
                style={{
                  backgroundColor: color,
                  ...(animate
                    ? {
                        animationDelay: `${(index / Math.max(1, filled)) * animationDuration * 0.8}ms`,
                        animationDuration: `${Math.max(120, animationDuration * 0.25)}ms`,
                        animationFillMode: "both",
                      }
                    : null),
                }}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

export { TickBar };
