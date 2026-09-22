import { IconCheck } from "@tabler/icons-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ActivityItemData {
  id: string;
  avatar?: string;
  initials?: string;
  text: React.ReactNode;
  time: string;
}

export function ActivityItem({
  item,
  className,
}: {
  item: ActivityItemData;
  className?: string;
}) {
  return (
    <li
      className={cn(
        "flex gap-3 border-b border-[rgba(31,41,55,0.06)] py-3 last:border-0",
        className,
      )}
    >
      <Avatar
        size="sm"
        src={item.avatar}
        fallback={item.initials}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <div className="text-sm text-foreground">{item.text}</div>
        <div className="text-xs text-muted-foreground">{item.time}</div>
      </div>
    </li>
  );
}

export function ActivityFeed({
  title = "Activity",
  items,
  className,
}: {
  title?: string;
  items: ActivityItemData[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul>
          {items.map((item) => (
            <ActivityItem key={item.id} item={item} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return <IconCheck className={cn("h-4 w-4", className)} />;
}
