import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

export interface SearchResultItem {
  id: string
  title: string
  excerpt: string
  type: string
  date: string
  author?: string
  initials?: string
}

export function SearchResultList({
  items,
  className,
}: {
  items: SearchResultItem[]
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex gap-3 p-4">
            <Avatar size="sm" fallback={item.initials ?? "R"} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{item.title}</span>
                <Badge variant="light">{item.type}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.excerpt}</p>
              <div className="mt-1 text-xs text-muted-foreground">
                {item.author ? `${item.author} · ` : ""}
                {item.date}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function SearchToolbar({
  query,
  onQueryChange,
  placeholder = "Search…",
  className,
}: {
  query: string
  onQueryChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <Input
      className={className}
      value={query}
      placeholder={placeholder}
      onChange={(e) => onQueryChange(e.target.value)}
    />
  )
}
