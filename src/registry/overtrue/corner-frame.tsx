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

export interface CornerFrameProps extends React.ComponentProps<"div"> {
  /** Length of each registration mark, in pixels. */
  cornerSize?: number;
  /** Any CSS color used for the corner marks. */
  cornerColor?: string;
  /** Show a quiet hairline around the framed content. */
  bordered?: boolean;
  /** Crosshair registration marks, or brackets that hug each corner. */
  marks?: "cross" | "bracket";
}

const corners = ["top-left", "top-right", "bottom-right", "bottom-left"] as const;

const crossPosition = {
  "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-right": "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
  "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
};

const bracketPosition = {
  "top-left": "-top-px -left-px border-t-2 border-l-2",
  "top-right": "-top-px -right-px border-t-2 border-r-2",
  "bottom-right": "-right-px -bottom-px border-r-2 border-b-2",
  "bottom-left": "-bottom-px -left-px border-b-2 border-l-2",
};

/** A content frame with small registration marks at every corner. */
function CornerFrame({
  cornerSize = 10,
  cornerColor = "var(--color-muted-foreground)",
  bordered = true,
  marks = "cross",
  className,
  children,
  style,
  ...props
}: CornerFrameProps) {
  const cornerStyle = {
    "--corner-size": `${cornerSize}px`,
    "--corner-color": cornerColor,
    ...style,
  } as React.CSSProperties;

  return (
    <div
      data-slot="corner-frame"
      data-marks={marks}
      className={cn("relative", bordered && "border border-border/70", className)}
      style={cornerStyle}
      {...props}
    >
      {children}
      {corners.map((corner, index) => (
        <span
          key={corner}
          data-corner={corner}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute z-10 size-(--corner-size)",
            // Marks settle in one after another, then stay still.
            "transition-[scale,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:starting:scale-50 motion-safe:starting:opacity-0 motion-reduce:transition-none",
            index === 1 && "delay-[40ms]",
            index === 2 && "delay-[80ms]",
            index === 3 && "delay-[120ms]",
            "dark:drop-shadow-[0_0_4px_color-mix(in_oklab,var(--corner-color)_65%,transparent)]",
            marks === "bracket"
              ? cn("border-(--corner-color)", bracketPosition[corner])
              : cn(
                  crossPosition[corner],
                  "before:absolute before:top-1/2 before:h-px before:w-full before:-translate-y-1/2 before:bg-(--corner-color)",
                  "after:absolute after:left-1/2 after:h-full after:w-px after:-translate-x-1/2 after:bg-(--corner-color)",
                ),
          )}
        />
      ))}
    </div>
  );
}

export { CornerFrame };
