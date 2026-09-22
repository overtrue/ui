export interface NavChild {
  title: string
  href: string
}

export interface NavItem {
  title: string
  href: string
  children?: NavChild[]
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboards",
        href: "/",
        children: [
          { title: "Default", href: "/" },
          { title: "Crypto", href: "/dashboard/crypto" },
          { title: "CRM", href: "/dashboard/crm" },
        ],
      },
    ],
  },
  {
    title: "Components",
    items: [
      {
        title: "Interface",
        href: "/buttons",
        children: [
          { title: "Accordion", href: "/accordion" },
          { title: "Alerts", href: "/alerts" },
          { title: "Avatars", href: "/avatars" },
          { title: "Badges", href: "/badges" },
          { title: "Blank page", href: "/blank" },
          { title: "Buttons", href: "/buttons" },
          { title: "Cards", href: "/cards" },
          { title: "Dropdowns", href: "/dropdowns" },
          { title: "Lists", href: "/lists" },
          { title: "Modals", href: "/modals" },
          { title: "Offcanvas", href: "/offcanvas" },
          { title: "Pagination", href: "/pagination" },
          { title: "Placeholder", href: "/placeholder" },
          { title: "Progress", href: "/progress" },
          { title: "Prose", href: "/prose" },
          { title: "Steps", href: "/steps" },
          { title: "Tables", href: "/tables" },
          { title: "Tabs", href: "/tabs" },
          { title: "Tags", href: "/tags" },
          { title: "Toasts", href: "/toasts" },
          { title: "Typography", href: "/typography" },
          { title: "Navigation", href: "/navigation" },
          { title: "Social icons", href: "/social-icons" },
          { title: "Stars rating", href: "/stars-rating" },
          { title: "Segmented control", href: "/segmented-control" },
          { title: "Colors", href: "/colors" },
        ],
      },
      {
        title: "Forms",
        href: "/forms/form-elements",
        children: [
          { title: "Form elements", href: "/forms/form-elements" },
          { title: "Form layouts", href: "/forms/form-layout" },
        ],
      },
      {
        title: "Extra",
        href: "/activity",
        children: [
          { title: "Activity", href: "/activity" },
          { title: "Cookie banner", href: "/cookie-banner" },
          { title: "Empty page", href: "/empty" },
          { title: "FAQ", href: "/faq" },
          { title: "Gallery", href: "/gallery" },
          { title: "Invoice", href: "/invoice" },
          { title: "Logs", href: "/logs" },
          { title: "Pricing cards & table", href: "/pricing" },
          { title: "Search results", href: "/search-results" },
          { title: "Settings", href: "/settings" },
          { title: "Users", href: "/users" },
          { title: "Widgets", href: "/widgets" },
          { title: "Wizard", href: "/wizard" },
        ],
      },
      {
        title: "Authentication",
        href: "/auth/sign-in",
        children: [
          { title: "Sign in", href: "/auth/sign-in" },
          { title: "Sign up", href: "/auth/sign-up" },
          { title: "Forgot password", href: "/auth/forgot-password" },
          { title: "Lock screen", href: "/auth/lock" },
        ],
      },
    ],
  },
  {
    title: "Custom",
    items: [{ title: "High-order components", href: "/high-order" }],
  },
]
