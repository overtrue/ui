import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DetailItem {
  id: string;
  label: ReactNode;
  value: ReactNode;
}
export function DetailList({
  items,
  className,
  ...props
}: ComponentProps<"dl"> & { items: readonly DetailItem[] }) {
  return (
    <dl className={cn("m-0 grid gap-3 text-sm", className)} {...props}>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-baseline gap-4"
        >
          <dt className="font-normal text-muted-foreground">{item.label}</dt>
          <dd className="m-0 min-w-0 break-words [overflow-wrap:anywhere]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
