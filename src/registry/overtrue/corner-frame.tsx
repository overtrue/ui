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
}

/** A content frame with small registration marks at every corner. */
function CornerFrame({
  cornerSize = 10,
  cornerColor = "var(--color-muted-foreground)",
  bordered = true,
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
      className={cn("relative", bordered && "border", className)}
      style={cornerStyle}
      {...props}
    >
      {children}
      {(["top-left", "top-right", "bottom-right", "bottom-left"] as const).map(
        (corner) => (
          <span
            key={corner}
            data-corner={corner}
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute z-10 size-(--corner-size)",
              "before:absolute before:bg-(--corner-color) after:absolute after:bg-(--corner-color)",
              "before:top-1/2 before:h-px before:w-full before:-translate-y-1/2 after:left-1/2 after:h-full after:w-px after:-translate-x-1/2",
              corner === "top-left" &&
                "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
              corner === "top-right" &&
                "top-0 right-0 translate-x-1/2 -translate-y-1/2",
              corner === "bottom-right" &&
                "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
              corner === "bottom-left" &&
                "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
            )}
          />
        ),
      )}
    </div>
  );
}

export { CornerFrame };
