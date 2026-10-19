"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterOption<T extends string = string> {
  value: T;
  label: ReactNode;
  count?: number;
  disabled?: boolean;
}

interface IndicatorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Filters a shared result set; these are pressed buttons, not tab panels. */
export function FilterTabs<T extends string>({
  label,
  items,
  value,
  onValueChange,
  className,
}: {
  label: string;
  items: readonly FilterOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<IndicatorRect | null>(null);
  // The first placement snaps; later changes glide.
  const [glide, setGlide] = useState(false);

  const measure = useCallback(() => {
    const pressed = root.current?.querySelector<HTMLElement>(
      ':scope > [aria-pressed="true"]',
    );
    if (!pressed) {
      setRect(null);
      return;
    }
    const next = {
      left: pressed.offsetLeft,
      top: pressed.offsetTop,
      width: pressed.offsetWidth,
      height: pressed.offsetHeight,
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

  useIsoLayoutEffect(measure, [measure, value, items]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
    const frame = requestAnimationFrame(() => setGlide(true));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [measure, items]);

  return (
    <div
      ref={root}
      data-slot="filter-tabs"
      data-indicator={rect ? "" : undefined}
      role="group"
      aria-label={label}
      className={cn(
        "group/filters relative isolate flex flex-wrap items-center gap-1",
        className,
      )}
    >
      {rect ? (
        <span
          aria-hidden="true"
          data-slot="filter-tabs-indicator"
          className={cn(
            "pointer-events-none absolute top-0 left-0 -z-10 rounded-lg bg-primary/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_22%,transparent)] dark:bg-primary/15",
            glide &&
              "transition-[translate,width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          )}
          style={{
            width: rect.width,
            height: rect.height,
            translate: `${rect.left}px ${rect.top}px`,
          }}
        />
      ) : null}
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <Button
            key={item.value}
            type="button"
            size="sm"
            variant="ghost"
            disabled={item.disabled}
            aria-pressed={selected}
            onClick={() => onValueChange(item.value)}
            className={cn(
              "h-8 gap-2 rounded-lg border-0 px-3 text-xs font-medium shadow-none transition-[color,background-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-primary/30 motion-reduce:transition-none",
              selected
                ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary dark:bg-primary/15 dark:hover:bg-primary/20 group-data-[indicator]/filters:bg-transparent group-data-[indicator]/filters:hover:bg-transparent dark:group-data-[indicator]/filters:bg-transparent dark:group-data-[indicator]/filters:hover:bg-transparent"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground dark:hover:bg-muted/50",
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                data-slot="filter-tabs-count"
                className={cn(
                  "-me-1 min-w-5 rounded-full px-1.5 text-center text-[11px] leading-[18px] font-medium tabular-nums transition-colors duration-150 motion-reduce:transition-none",
                  selected
                    ? "bg-primary/15 text-primary dark:bg-primary/20"
                    : "bg-muted text-muted-foreground dark:bg-muted/70",
                )}
              >
                {item.count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
