"use client";
import type { ComponentProps } from "react";
import { IconMessage } from "@tabler/icons-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionCard } from "./section-card";
import { cn } from "@/lib/utils";

export interface TaskCardProps extends Omit<ComponentProps<"li">, "title"> {
  title: string;
  due?: string;
  progressText?: string;
  comments?: number;
  done?: boolean;
  disabled?: boolean;
  onDoneChange?: (done: boolean) => void;
}
export function TaskCard({
  title,
  due,
  progressText,
  comments = 0,
  done = false,
  disabled = false,
  onDoneChange,
  className,
  ...props
}: TaskCardProps) {
  return (
    <li
      data-slot="task-card"
      className={cn(
        "flex flex-wrap items-center gap-3 border-b border-border py-3 last:border-0",
        className,
      )}
      {...props}
    >
      <Checkbox
        aria-label={title}
        checked={done}
        disabled={disabled || !onDoneChange}
        onCheckedChange={(checked) => onDoneChange?.(checked === true)}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "m-0 break-words text-sm font-medium text-foreground",
            done && "text-muted-foreground line-through",
          )}
        >
          {title}
        </p>
        {due && <p className="m-0 mt-1 text-xs text-muted-foreground">{due}</p>}
      </div>
      {progressText && (
        <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
          {progressText}
        </span>
      )}
      {comments > 0 && (
        <span
          aria-label={`${comments} comments`}
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <IconMessage aria-hidden="true" className="size-3.5" />
          {comments}
        </span>
      )}
    </li>
  );
}
export interface TaskItem extends Pick<
  TaskCardProps,
  "title" | "due" | "progressText" | "comments" | "done" | "disabled"
> {
  id: string;
}
/** Controlled completion state. Persist it in the caller's onTaskChange handler. */
export function TaskList({
  tasks,
  title = "Tasks",
  onTaskChange,
  className,
  emptyMessage = "No tasks yet.",
}: {
  tasks: readonly TaskItem[];
  title?: string;
  onTaskChange?: (id: string, done: boolean) => void;
  className?: string;
  emptyMessage?: string;
}) {
  return (
    <SectionCard title={title} className={className} contentClassName="py-2">
      {tasks.length ? (
        <ul aria-label={title} className="m-0 list-none p-0">
          {tasks.map(({ id, ...task }) => (
            <TaskCard
              key={id}
              {...task}
              onDoneChange={
                onTaskChange ? (done) => onTaskChange(id, done) : undefined
              }
            />
          ))}
        </ul>
      ) : (
        <p className="py-3 text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </SectionCard>
  );
}
