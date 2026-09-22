"use client";
import { useState } from "react";
import {
  TaskList as RegistryTaskList,
  type TaskCardProps,
} from "@/registry/overtrue/task-list";
export { TaskCard, type TaskCardProps } from "@/registry/overtrue/task-list";
export { Badge } from "@/components/ui/badge";
export function TaskList({
  tasks,
  className,
}: {
  tasks: TaskCardProps[];
  className?: string;
}) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  return (
    <RegistryTaskList
      className={className}
      tasks={tasks.map((task) => ({
        ...task,
        id: task.title,
        done: completed[task.title] ?? task.done ?? false,
      }))}
      onTaskChange={(id, done) =>
        setCompleted((current) => ({ ...current, [id]: done }))
      }
    />
  );
}
