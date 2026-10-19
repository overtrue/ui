import { IconCheck as Check } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function Steps({
  steps,
  current,
  orientation = "horizontal",
  className,
}: {
  steps: string[];
  current: number;
  /** Lay the steps out in a row, or down the side of a panel. */
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  const vertical = orientation === "vertical";
  return (
    <ol
      data-slot="steps"
      data-orientation={orientation}
      className={cn("grid", vertical ? "grid-cols-1" : "w-full items-start", className)}
      // Equal tracks for every step but the last, which only needs room for its label.
      style={
        vertical
          ? undefined
          : {
              gridTemplateColumns:
                steps.length > 1
                  ? `repeat(${steps.length - 1}, minmax(0, 1fr)) fit-content(40%)`
                  : "minmax(0, 1fr)",
            }
      }
    >
      {steps.map((step, index) => {
        const state =
          index < current
            ? "complete"
            : index === current
              ? "current"
              : "upcoming";
        const last = index === steps.length - 1;
        return (
          <li
            key={`${index}-${step}`}
            data-slot="steps-item"
            data-state={state}
            aria-current={index === current ? "step" : undefined}
            className={cn(
              "group/step relative flex min-w-0",
              vertical ? "gap-3" : "flex-col gap-2.5",
            )}
          >
            <div
              className={cn(
                "flex items-center",
                vertical ? "flex-col self-stretch" : "w-full",
              )}
            >
              <span
                data-slot="steps-marker"
                className={cn(
                  "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-[background-color,color,box-shadow] duration-300 motion-reduce:transition-none",
                  ease,
                  state === "complete" &&
                    "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_1px_2px_rgb(0_0_0/0.1)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_0_14px_-3px_color-mix(in_oklab,var(--color-primary)_80%,transparent)]",
                  state === "current" &&
                    "bg-card text-primary shadow-[inset_0_0_0_1.5px_var(--color-primary),0_0_0_4px_color-mix(in_oklab,var(--color-primary)_16%,transparent)] dark:shadow-[inset_0_0_0_1.5px_var(--color-primary),0_0_0_4px_color-mix(in_oklab,var(--color-primary)_16%,transparent),0_0_18px_-2px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]",
                  state === "upcoming" &&
                    "bg-muted/60 text-muted-foreground shadow-[inset_0_0_0_1px_var(--color-border)]",
                )}
              >
                {state === "complete" ? (
                  <Check
                    className={cn(
                      "size-3.5 transition-[scale,opacity] duration-500 motion-safe:starting:scale-50 motion-safe:starting:opacity-0 motion-reduce:transition-none",
                      ease,
                    )}
                    stroke={2.75}
                    aria-label="Completed"
                  />
                ) : (
                  index + 1
                )}
              </span>
              {!last && (
                <span
                  aria-hidden="true"
                  data-slot="steps-rail"
                  className={cn(
                    "relative flex-1 rounded-full bg-border/80",
                    vertical ? "my-1.5 min-h-5 w-0.5" : "mx-2 h-0.5 min-w-2",
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full transition-[scale] duration-700 motion-reduce:transition-none",
                      ease,
                      vertical
                        ? "origin-top bg-linear-to-b"
                        : "origin-left bg-linear-to-r rtl:origin-right rtl:bg-linear-to-l",
                      state === "complete"
                        ? "from-primary/80 to-primary dark:shadow-[0_0_12px_color-mix(in_oklab,var(--color-primary)_75%,transparent)]"
                        : "from-primary/70 to-transparent",
                      state === "complete"
                        ? "scale-100"
                        : state === "current"
                          ? vertical
                            ? "scale-y-[0.45]"
                            : "scale-x-[0.45]"
                          : vertical
                            ? "scale-y-0"
                            : "scale-x-0",
                    )}
                  />
                </span>
              )}
            </div>
            <span
              data-slot="steps-label"
              className={cn(
                "min-w-0 text-[13px] leading-5 break-words text-pretty transition-colors duration-300 motion-reduce:transition-none",
                vertical ? cn("pt-1", !last && "pb-6") : "pe-3",
                state === "current"
                  ? "font-medium text-foreground"
                  : state === "complete"
                    ? "text-foreground/75"
                    : "text-muted-foreground",
              )}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
