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

export interface TickBarProps extends React.ComponentProps<"div"> {
  /** Current value, from 0 to max. */
  value: number;
  max?: number;
  /** Number of ticks. */
  segments?: number;
  /** Any CSS color for the filled ticks. Defaults to chart-1. */
  color?: string;
  /** Any CSS color for the unfilled ticks. Defaults to a faint foreground. */
  trackColor?: string;
  /** "tick" draws thin bars; "pill" draws wide rounded ones. */
  shape?: "tick" | "pill";
  /** Reveal filled ticks in sequence when the bar mounts. */
  animate?: boolean;
  /** Total reveal time in milliseconds. */
  animationDuration?: number;
  /** Show the current value at the end of the bar. */
  showValue?: boolean;
  /** Formats the readout and the announced value. Defaults to a whole percentage. */
  valueFormatter?: (value: number, max: number) => string;
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function useReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/** Glide a number toward its target on cubic-bezier(0.22, 1, 0.36, 1). */
function useTweened(target: number, duration: number, initial: number) {
  const reduced = useReducedMotion();
  const [shown, setShown] = React.useState(initial);
  const current = React.useRef(initial);
  React.useEffect(() => {
    if (current.current === target) return;
    if (reduced || duration <= 0) {
      current.current = target;
      setShown(target);
      return;
    }
    const from = current.current;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      current.current = from + (target - from) * (1 - (1 - t) ** 4);
      setShown(t === 1 ? target : current.current);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, reduced]);
  return shown;
}

const percent = (value: number, max: number) =>
  `${Math.round(Math.min(1, Math.max(0, value / (max || 1))) * 100)}%`;

/** A progress bar drawn as a row of ticks, lit up to the current value. */
function TickBar({
  value,
  max = 100,
  segments = 40,
  color = "var(--color-chart-1)",
  trackColor = "color-mix(in oklab, var(--color-foreground) 12%, transparent)",
  shape = "tick",
  animate = false,
  animationDuration = 700,
  showValue = false,
  valueFormatter = percent,
  className,
  style,
  ...props
}: TickBarProps) {
  const count = Math.max(1, Math.round(segments));
  const safe = Number.isFinite(value) ? value : 0;
  const fraction = Math.min(1, Math.max(0, safe / (max || 1)));
  // Any non-zero value lights at least one tick so small values still register.
  const filled = fraction === 0 ? 0 : Math.max(1, Math.round(fraction * count));

  // Light new ticks in sequence from where the fill was, and unlight in reverse.
  const previous = React.useRef(animate ? 0 : filled);
  const from = previous.current;
  React.useEffect(() => {
    previous.current = filled;
  }, [filled]);
  const changed = Math.abs(filled - from);
  const step = changed ? (animationDuration * 0.8) / changed : 0;

  const shown = useTweened(
    safe,
    showValue ? animationDuration : 0,
    animate ? 0 : safe,
  );
  const pill = shape === "pill";

  return (
    <div
      data-slot="tick-bar"
      data-shape={shape}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueFormatter(safe, max)}
      className={cn(
        "flex w-full items-center",
        pill ? "h-3.5 gap-1" : "h-6",
        className,
      )}
      style={
        {
          ...style,
          "--tick-color": color,
          "--tick-track": trackColor,
        } as React.CSSProperties
      }
      {...props}
    >
      {Array.from({ length: count }, (_, index) => {
        const lit = index < filled;
        const head = lit && index === filled - 1;
        const delay =
          filled > from && index >= from && index < filled
            ? (index - from) * step
            : filled < from && index >= filled && index < from
              ? (from - 1 - index) * step
              : 0;
        return (
          <span
            key={index}
            data-slot="tick-bar-tick"
            data-filled={lit}
            data-head={head || undefined}
            className={cn(
              "relative h-full min-w-0 flex-1",
              !pill && "flex justify-center",
            )}
          >
            <span
              className={cn(
                "block h-full rounded-full bg-(--tick-track) transition-[background-color,opacity,scale,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                pill ? "w-full" : "w-[3px] max-w-full scale-y-[0.58]",
                "data-[lit=true]:bg-(--tick-color) data-[lit=true]:opacity-(--tick-alpha) data-[lit=true]:scale-y-100",
                "data-[head=true]:dark:shadow-[0_0_10px_1px_color-mix(in_oklab,var(--tick-color)_70%,transparent)]",
                animate &&
                  "starting:data-[lit=true]:bg-(--tick-track) starting:data-[lit=true]:opacity-100",
                animate && !pill && "starting:data-[lit=true]:scale-y-[0.58]",
              )}
              data-lit={lit}
              data-head={head || undefined}
              style={
                {
                  // Filled ticks brighten toward the leading edge.
                  "--tick-alpha": lit
                    ? (0.55 + 0.45 * ((index + 1) / filled) ** 1.5).toFixed(3)
                    : 1,
                  transitionDelay: delay ? `${Math.round(delay)}ms` : undefined,
                } as React.CSSProperties
              }
            />
          </span>
        );
      })}
      {showValue ? (
        <span
          data-slot="tick-bar-value"
          aria-hidden="true"
          className="ml-3 shrink-0 text-sm leading-none font-semibold tracking-[-0.01em] text-foreground tabular-nums"
        >
          {valueFormatter(shown, max)}
        </span>
      ) : null}
    </div>
  );
}

export { TickBar };
