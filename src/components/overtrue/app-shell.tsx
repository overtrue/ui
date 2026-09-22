import * as React from "react"
import { TopNavbar } from "@/components/overtrue/top-navbar"
import { SidebarNav } from "@/components/overtrue/sidebar-nav"
import { Footer } from "@/components/overtrue/footer"
import { ThemeCustomizer, useThemeState } from "@/components/overtrue/theme-customizer"
import type { NavSection } from "@/data/nav"
import { navSections } from "@/data/nav"
import { notifications, apps } from "@/data/mock"

export interface AppShellProps {
  children: React.ReactNode
  bare?: boolean
  nav?: NavSection[]
  layout?: "horizontal" | "sidebar"
}

export function AppShell({
  children,
  bare = false,
  nav = navSections,
  layout: layoutProp,
}: AppShellProps) {
  const { theme } = useThemeState()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [customizerOpen, setCustomizerOpen] = React.useState(false)

  if (bare) {
    return <div className="min-h-svh bg-background">{children}</div>
  }

  const layout =
    layoutProp ?? (theme.nav === "sidebar" || theme.nav === "navbar" ? "sidebar" : "horizontal")
  const showSidebar = layout === "sidebar" && sidebarOpen
  const containerClass =
    theme.container === "boxed"
      ? "mx-auto w-full max-w-[1140px]"
      : theme.container === "default"
        ? "mx-auto w-full max-w-[960px]"
        : "w-full"

  return (
    <div className="min-h-svh bg-background">
      <TopNavbar
        layout={layout}
        sticky={theme.navbar === "sticky"}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onOpenCustomizer={() => setCustomizerOpen(true)}
        notifications={notifications}
        apps={apps}
        nav={nav}
      />
      <div className="flex">
        {showSidebar ? (
          <SidebarNav
            sections={nav}
            open
            folded={theme.sidebar === "folded"}
            className="sticky top-20"
          />
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={containerClass}>
            <main className="page">{children}</main>
          </div>
          <Footer />
        </div>
      </div>
      <ThemeCustomizer open={customizerOpen} onOpenChange={setCustomizerOpen} />
    </div>
  )
}
