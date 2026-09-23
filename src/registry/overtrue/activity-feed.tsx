import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export interface ActivityItem {
  id: string;
  initials: string;
  content: ReactNode;
  time: string;
}
export function ActivityFeed({
  items,
  title = "Recent activity",
  className,
}: {
  items: ActivityItem[];
  title?: string;
  className?: string;
}) {
  return (
    <Card
      data-slot="activity-feed"
      className={cn(
        "gap-0 rounded-lg border bg-card py-0 shadow-none",
        className,
      )}
    >
      <CardHeader className="border-b px-5 py-4 [.border-b]:pb-4">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-1">
        <ol className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 py-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {item.initials}
              </span>
              <div className="min-w-0 text-sm">
                <div className="text-card-foreground">{item.content}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.time}
                </p>
              </div>
            </li>
          ))}
        </ol>
        {!items.length && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No activity yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
