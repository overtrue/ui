import { IconCheck } from "@tabler/icons-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

export interface StepsProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: StepItem[];
  current?: number;
  orientation?: "horizontal" | "vertical";
}

export function Steps({
  steps,
  current = 0,
  orientation = "horizontal",
  className,
  ...props
}: StepsProps) {
  return (
    <ol
      className={cn(
        "flex",
        orientation === "horizontal"
          ? "w-full flex-row items-start"
          : "flex-col",
        className,
      )}
      {...props}
    >
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "current" : "todo";
        return (
          <li
            key={step.id}
            className={cn(
              "relative flex gap-2",
              orientation === "horizontal"
                ? "flex-1 flex-col items-center text-center"
                : "pb-4",
            )}
          >
            {orientation === "horizontal" && i < steps.length - 1 ? (
              <span
                className="absolute left-[calc(50%+12px)] right-[calc(-50%+12px)] top-3 h-px bg-border"
                aria-hidden
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs",
                state === "done" &&
                  "border-primary bg-primary text-primary-foreground",
                state === "current" && "border-primary bg-card text-primary",
                state === "todo" &&
                  "border-border bg-card text-muted-foreground",
              )}
            >
              {state === "done" ? <IconCheck className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <div className="min-w-0">
              <div
                className={cn(
                  "text-sm font-medium",
                  state === "todo" && "text-muted-foreground",
                )}
              >
                {step.title}
              </div>
              {step.description ? (
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
