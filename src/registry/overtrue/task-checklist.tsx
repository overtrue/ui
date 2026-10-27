"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { IconCircleCheck, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  meta?: ReactNode;
}

function ChecklistRow({
  item,
  onChange,
}: {
  item: ChecklistItem;
  onChange?: (id: string, checked: boolean) => void | Promise<void>;
}) {
  const id = useId();
  const inFlight = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  async function change(checked: boolean) {
    if (!onChange || inFlight.current || item.disabled) return;
    inFlight.current = true;
    setPending(true);
    setError(false);
    try {
      await onChange(item.id, checked);
    } catch {
      setError(true);
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }
  return (
    <li
      data-slot="checklist-item"
      data-checked={item.checked}
      className="flex items-start gap-3 py-3.5"
    >
      <input
        id={id}
        type="checkbox"
        checked={item.checked}
        disabled={!onChange || item.disabled || pending}
        aria-busy={pending}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => void change(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:cursor-default"
      />
      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className={cn(
            "block cursor-pointer text-sm font-medium leading-5 [overflow-wrap:anywhere]",
            item.checked && "text-muted-foreground line-through",
          )}
        >
          {item.title}
        </label>
        {item.description && (
          <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
            {item.description}
          </p>
        )}
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="m-0 mt-1 text-xs text-destructive"
          >
            Couldn’t save this change. Try again.
          </p>
        )}
      </div>
      {pending ? (
        <IconLoader2
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 animate-spin text-muted-foreground motion-reduce:animate-none"
        />
      ) : (
        item.meta && (
          <div
            data-slot="checklist-meta"
            className="max-w-24 shrink-0 text-right text-xs leading-5 text-muted-foreground"
          >
            {item.meta}
          </div>
        )
      )}
    </li>
  );
}

/** The caller owns completion state and persistence; failed changes stay unchecked. */
export function TaskChecklist({
  title = "Checklist",
  description,
  items,
  onCheckedChange,
  className,
}: {
  title?: string;
  description?: string;
  items: readonly ChecklistItem[];
  onCheckedChange?: (id: string, checked: boolean) => void | Promise<void>;
  className?: string;
}) {
  const id = useId();
  const completed = items.filter((item) => item.checked).length;
  return (
    <section
      data-slot="task-checklist"
      aria-labelledby={id}
      className={cn(
        "min-w-0 rounded-xl border border-border bg-card p-5 text-card-foreground",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id={id} className="m-0 text-sm font-semibold">
            {title}
          </h2>
          {description && (
            <p className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <span
          className="flex shrink-0 items-center gap-1.5 text-xs tabular-nums text-muted-foreground"
          aria-label={`${completed} of ${items.length} completed`}
        >
          {items.length > 0 && completed === items.length && (
            <IconCircleCheck
              className="size-4 text-primary"
              aria-hidden="true"
            />
          )}
          {completed}/{items.length}
        </span>
      </div>
      {items.length ? (
        <>
          <div
            className="my-4 h-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label={`${title} completion`}
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={items.length}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
              style={{ width: `${(completed / items.length) * 100}%` }}
            />
          </div>
          <ul className="m-0 list-none divide-y divide-border p-0">
            {items.map((item) => (
              <ChecklistRow
                key={item.id}
                item={item}
                onChange={onCheckedChange}
              />
            ))}
          </ul>
        </>
      ) : (
        <p className="mb-0 mt-5 text-sm text-muted-foreground">
          No tasks in this checklist.
        </p>
      )}
    </section>
  );
}
