import { IconCheck as Check } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
export function Steps({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex flex-wrap gap-x-6 gap-y-4">
      {steps.map((step, index) => (
        <li
          key={`${index}-${step}`}
          aria-current={index === current ? "step" : undefined}
          className="flex items-center gap-2.5 text-sm"
        >
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
              index <= current
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-muted text-muted-foreground",
            )}
          >
            {index < current ? (
              <Check className="size-3.5" aria-label="Completed" />
            ) : (
              index + 1
            )}
          </span>
          <span
            className={
              index === current
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            }
          >
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
