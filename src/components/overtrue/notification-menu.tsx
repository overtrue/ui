import { useState } from "react"
import { IconBell } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface NotificationItem {
  id: string
  title: string
  meta: string
  unread?: boolean
}

export function NotificationMenu({
  items,
  className,
}: {
  items: NotificationItem[]
  className?: string
}) {
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set())
  const isUnread = (item: NotificationItem) => item.unread && !readIds.has(item.id)
  const unread = items.filter(isUnread)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative", className)} aria-label="Notifications">
          <IconBell className="h-4 w-4" />
          {unread.length > 0 ? (
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-auto">
          {items.map((n) => (
            <DropdownMenuItem key={n.id} onSelect={() => setReadIds((ids) => new Set([...ids, n.id]))} className="flex flex-col items-start gap-0.5 py-2">
              <span className={cn("text-sm", isUnread(n) && "font-semibold")}>{n.title}</span>
              <span className="text-xs text-muted-foreground">{n.meta}</span>
            </DropdownMenuItem>
          ))}
          {!items.length && <p className="px-2 py-6 text-center text-sm text-muted-foreground">You’re all caught up.</p>}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={!unread.length} onSelect={() => setReadIds(new Set(items.map((item) => item.id)))}>Mark all as read</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
