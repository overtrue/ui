import { IconLayoutDashboard, IconMoon, IconSun, IconMenu2, IconSettings } from "@tabler/icons-react"
import * as React from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationMenu, type NotificationItem } from "@/components/overtrue/notification-menu"
import { AppsMenu, type AppBrand } from "@/components/overtrue/apps-menu"
import { UserMenu } from "@/components/overtrue/user-menu"
import { useThemeState } from "@/components/overtrue/theme-customizer"
import type { NavSection } from "@/data/nav"
import { navSections } from "@/data/nav"

const MENU_ICONS: Record<string, string> = {
  Dashboards: "M3 12h4v8H3zM7 8h4v12H7zM11 4h4v16h-4zM15 10h4v10h-4z",
  Interface: "M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z",
  Forms: "M5 4h14v2H5zM5 8h14v2H5zM5 12h10v2H5zM5 16h8v2H5z",
  Extra: "M12 2l2.4 7.2H22l-6 4.8 2.3 7L12 16.8 5.7 21l2.3-7-6-4.8h7.6z",
  Authentication: "M12 2a5 5 0 015 5v1h1a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3v-8a3 3 0 013-3h1V7a5 5 0 015-5z",
  Layout: "M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z",
  Plugins: "M7 7h4v4H7zM13 7h4v4h-4zM7 13h4v4H7zM13 13h4v4h-4z",
  Addons: "M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8",
  Help: "M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a3 3 0 110 6 3 3 0 010-6z",
}

export interface TopNavbarProps {
  className?: string
  sticky?: boolean
  layout?: "horizontal" | "sidebar"
  onToggleSidebar?: () => void
  onOpenCustomizer?: () => void
  notifications?: NotificationItem[]
  apps?: AppBrand[]
  nav?: NavSection[]
}

function MenuIcon({ title }: { title: string }) {
  return (
    <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d={MENU_ICONS[title] ?? MENU_ICONS.Layout} />
    </svg>
  )
}

function HorizontalMenu({
  nav,
  onCustomize,
}: {
  nav: NavSection[]
  onCustomize?: () => void
}) {
  const menus = React.useMemo(() => {
    const items: { title: string; children: { title: string; href: string }[] }[] = []
    for (const section of nav) {
      for (const item of section.items) {
        if (item.children?.length) {
          items.push({ title: item.title, children: item.children })
        }
      }
    }
    // Keep overtrue/ui IA labels
    const order = ["Dashboards", "Interface", "Forms", "Extra"]
    const extras = [
      { title: "Layout", children: [{ title: "Fluid", href: "/layout-fluid" }, { title: "Boxed", href: "/layout-boxed" }] },
      { title: "Plugins", children: [{ title: "Charts", href: "/charts" }, { title: "Tables", href: "/datatables" }] },
      { title: "Addons", children: [{ title: "Colors", href: "/colors" }, { title: "Gallery", href: "/gallery" }] },
      { title: "Help", children: [{ title: "Documentation", href: "/typography" }] },
    ]
    const renamed = items.map((m) => {
      if (m.title === "Authentication") return { ...m, title: "Extra" }
      return m
    })
    // Merge: use nav children for first four labels when possible
    const pick = (label: string) => renamed.find((m) => m.title === label)
    const base = order.map((l) => pick(l)).filter(Boolean) as typeof items
    const auth = renamed.find((m) => m.title === "Authentication" || m.title === "Auth")
    return [...base, ...(auth ? [{ ...auth, title: "Extra" }] : []), ...extras].filter(
      (m, i, arr) => arr.findIndex((x) => x.title === m.title) === i,
    )
  }, [nav])

  return (
    <nav className="hidden items-stretch border-t border-border lg:flex">
      {menus.map((menu, idx) => (
        <DropdownMenu key={menu.title}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium",
                idx === 0
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground hover:text-primary",
              )}
            >
              <MenuIcon title={menu.title} />
              {menu.title}
              <svg className="h-3 w-3 opacity-50" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
            {menu.children.map((c) => (
              <DropdownMenuItem asChild key={c.title + c.href}>
                <Link to={c.href} className="w-full">
                  {c.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
      <button
        type="button"
        onClick={onCustomize}
        className="ml-auto flex items-center gap-1.5 px-3 py-2.5 text-sm text-muted-foreground hover:text-primary"
      >
        <IconSettings className="h-4 w-4" />
        Customize
      </button>
    </nav>
  )
}

export function TopNavbar({
  className,
  sticky = true,
  layout = "horizontal",
  onToggleSidebar,
  onOpenCustomizer,
  notifications = [],
  apps = [],
  nav = navSections,
}: TopNavbarProps) {
  const { resolvedScheme, setTheme } = useThemeState()
  const dark = resolvedScheme === "dark"
  return (
    <header className={cn("z-40 bg-card", sticky ? "sticky top-0" : "relative", className)}>
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        {onToggleSidebar && <Button variant="ghost" size="icon" onClick={onToggleSidebar} aria-label="Toggle sidebar"><IconMenu2 className="h-4 w-4" /></Button>}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <IconLayoutDashboard className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold text-foreground">overtrue/ui</span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <Button asChild variant="outline" size="sm" className="mr-2 hidden font-medium sm:inline-flex">
            <a href="/docs">Documentation</a>
          </Button>
          <Button variant="ghost" size="icon" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setTheme((current) => ({ ...current, scheme: dark ? "light" : "dark", navbarTheme: "default" }))}>
            {dark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
          </Button>
          <NotificationMenu items={notifications} />
          <AppsMenu apps={apps} />
          <span className="mx-1 hidden text-sm text-muted-foreground sm:inline">EN</span>
          <UserMenu name="Chris An" role="@overtrue" avatar="/assets/overtrue/people/overtrue.png" />
        </div>
      </div>
      {layout === "horizontal" ? (
        <div className="px-2">
          <HorizontalMenu nav={nav} onCustomize={onOpenCustomizer} />
        </div>
      ) : null}
    </header>
  )
}
