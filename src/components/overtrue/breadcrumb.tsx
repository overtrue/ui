import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  title: string
  href?: string
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-1 text-sm text-muted-foreground", className)}>
      {items.map((item, i) => (
        <span key={item.title} className="inline-flex items-center gap-1">
          {i > 0 ? <span aria-hidden>/</span> : null}
          {item.href ? (
            <Link to={item.href} className="hover:text-primary hover:underline">
              {item.title}
            </Link>
          ) : (
            <span className={cn(i === items.length - 1 && "text-foreground")}>{item.title}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
