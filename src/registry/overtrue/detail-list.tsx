import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DetailItem {
  id: string;
  label: ReactNode;
  value: ReactNode;
}
export function DetailList({
  items,
  divided = false,
  className,
  ...props
}: ComponentProps<"dl"> & {
  items: readonly DetailItem[];
  /** Separate rows with hairlines, for denser property panels. */
  divided?: boolean;
}) {
  return (
    <dl
      data-slot="detail-list"
      data-divided={divided || undefined}
      className={cn(
        "@container/details m-0 grid text-sm",
        divided ? "divide-y divide-border/60" : "gap-3",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <div
          key={item.id}
          data-slot="detail-list-item"
          className={cn(
            "grid grid-cols-1 items-baseline gap-1 @min-[16rem]/details:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] @min-[16rem]/details:gap-4",
            divided && "py-2.5 first:pt-0 last:pb-0",
          )}
        >
          <dt className="min-w-0 font-normal text-muted-foreground [overflow-wrap:anywhere]">
            {item.label}
          </dt>
          <dd className="m-0 min-w-0 break-words tabular-nums [overflow-wrap:anywhere]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
