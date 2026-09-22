import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { NavSection } from "@/data/nav"

export interface SidebarNavProps {
  sections: NavSection[]
  open?: boolean
  folded?: boolean
  className?: string
}

export function SidebarNav({ sections, open = true, folded = false, className }: SidebarNavProps) {
  if (!open) return null
  return (
    <aside
      className={cn(
        "sticky h-[calc(100svh-3.5rem)] shrink-0 overflow-y-auto border-r border-border bg-sidebar px-2 py-3",
        folded ? "w-14" : "w-60",
        className,
      )}
    >
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          <div className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {section.title}
          </div>
          {section.items.map((item) =>
            item.children?.length ? (
              <div key={item.title} className="mb-1">
                <div className="px-2 py-1.5 text-sm font-medium text-sidebar-foreground">
                  {item.title}
                </div>
                <ul className="ml-2 space-y-0.5 border-l border-border pl-2">
                  {item.children.map((child) => (
                    <li key={child.title}>
                      <NavLink
                        to={child.href}
                        className={({ isActive }) =>
                          cn(
                            "block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isActive &&
                              "bg-sidebar-accent font-medium text-sidebar-primary",
                          )
                        }
                      >
                        {child.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div key={item.title}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "mb-0.5 flex items-center rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive && "bg-sidebar-accent font-medium text-sidebar-primary",
                    )
                  }
                >
                  {item.title}
                </NavLink>
              </div>
            ),
          )}
        </div>
      ))}
    </aside>
  )
}
