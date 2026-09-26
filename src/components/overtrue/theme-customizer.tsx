import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export type ColorScheme = "light" | "dark" | "auto"
export type ThemeBase = "slate" | "gray" | "zinc" | "neutral" | "stone"
export type NavMode = "navbar" | "sidebar" | "horizontal"
export type ContainerWidth = "default" | "fluid" | "boxed"
export type NavbarBehavior = "default" | "sticky"

export interface ThemeState {
  /** Last layout example opened; keeps saved edits when that page reloads. */
  layoutPreset?: string
  navbarTheme?: "default" | "dark" | "primary"
  scheme: ColorScheme
  accent: string
  font: "sans" | "serif" | "mono" | "comic"
  base: ThemeBase
  radius: 0 | 0.5 | 1 | 1.5 | 2
  nav: NavMode
  container: ContainerWidth
  navbar: NavbarBehavior
  sidebar: "expanded" | "folded"
}

export const DEFAULT_THEME: ThemeState = {
  scheme: "light",
  accent: "#2563eb",
  font: "sans",
  base: "gray",
  radius: 0.5,
  nav: "sidebar",
  container: "default",
  navbar: "default",
  sidebar: "expanded",
}

const STORAGE_KEY = "overtrue-workspace-theme-v2"

const ACCENTS = [
  DEFAULT_THEME.accent,
  "#4299e1",
  "#6366f1",
  "#ae3ec9",
  "#d6336c",
  "#d63939",
  "#f76707",
  "#f59f00",
  "#74b816",
  "#2fb344",
  "#0ca678",
  "#17a2b8",
]

const FONT_STACKS: Record<ThemeState["font"], string> = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  mono: 'Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  comic: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive',
}

export function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return `${+(h * 360).toFixed(2)} ${+(s * 100).toFixed(2)}% ${+(l * 100).toFixed(2)}%`
}

export function loadTheme(): ThemeState {
  if (typeof window === "undefined") return DEFAULT_THEME
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_THEME
    const saved: unknown = JSON.parse(raw)
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return DEFAULT_THEME
    const theme = { ...DEFAULT_THEME }
    const choices = {
      scheme: ["light", "dark", "auto"], font: ["sans", "serif", "mono", "comic"],
      base: ["slate", "gray", "zinc", "neutral", "stone"], radius: [0, 0.5, 1, 1.5, 2],
      nav: ["navbar", "sidebar", "horizontal"], container: ["default", "fluid", "boxed"],
      navbar: ["default", "sticky"], sidebar: ["expanded", "folded"],
      navbarTheme: ["default", "dark", "primary"],
      layoutPreset: ["default", "boxed", "condensed", "fluid", "fluid-vertical", "folded", "folded-hover", "horizontal", "navbar-dark", "navbar-overlap", "navbar-sticky", "rtl", "vertical", "vertical-right", "vertical-transparent"],
    }
    for (const [key, allowed] of Object.entries(choices)) {
      const value = (saved as Record<string, unknown>)[key]
      if ((allowed as readonly unknown[]).includes(value)) Object.assign(theme, { [key]: value })
    }
    const accent = (saved as Record<string, unknown>).accent
    if (typeof accent === "string" && /^#[\da-f]{6}$/i.test(accent)) theme.accent = accent
    return theme
  } catch {
    return DEFAULT_THEME
  }
}

export function persistTheme(theme: ThemeState) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
  } catch {
    /* ignore quota */
  }
}

// Each palette uses the same semantic tokens for shadcn and workspace surfaces.
const BASE_PALETTES: Record<ThemeBase, { light: string[]; dark: string[] }> = {
  gray: { light: ["#f9fafb", "#111827", "#ffffff", "#f3f4f6", "#6b7280", "#e5e7eb", "#d1d5db"], dark: ["#030712", "#f9fafb", "#111827", "#1f2937", "#9ca3af", "#1f2937", "#374151"] },
  slate: { light: ["#f8fafc", "#334155", "#ffffff", "#f1f5f9", "#64748b", "#e2e8f0", "#cbd5e1"], dark: ["#0f172a", "#e2e8f0", "#1e293b", "#334155", "#94a3b8", "#334155", "#475569"] },
  zinc: { light: ["#fafafa", "#3f3f46", "#ffffff", "#f4f4f5", "#71717a", "#e4e4e7", "#d4d4d8"], dark: ["#18181b", "#e4e4e7", "#27272a", "#27272a", "#a1a1aa", "#3f3f46", "#52525b"] },
  neutral: { light: ["#fafafa", "#404040", "#ffffff", "#f5f5f5", "#737373", "#e5e5e5", "#d4d4d4"], dark: ["#171717", "#e5e5e5", "#262626", "#262626", "#a3a3a3", "#404040", "#525252"] },
  stone: { light: ["#fafaf9", "#44403c", "#ffffff", "#f5f5f4", "#78716c", "#e7e5e4", "#d6d3d1"], dark: ["#1c1917", "#e7e5e4", "#292524", "#292524", "#a8a29e", "#44403c", "#57534e"] },
}

/** Choose the stronger contrast, including for custom yellow and lime accents. */
export function accentForeground(hex: string): string {
  const channels = [1, 3, 5].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
  return 1.05 / (luminance + 0.05) >= (luminance + 0.05) / 0.05 ? "#ffffff" : "#000000"
}

export function applyTheme(t: ThemeState) {
  const root = document.documentElement
  root.classList.toggle(
    "dark",
    t.scheme === "dark" ||
      (t.scheme === "auto" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  )
  const dark = root.classList.contains("dark")
  const palette = BASE_PALETTES[t.base][dark ? "dark" : "light"]
  const [background, foreground, card, muted, mutedForeground, border, input] = palette.map(hexToHsl)
  for (const [name, value] of Object.entries({ background, foreground, card, "card-foreground": foreground, popover: card, "popover-foreground": foreground, muted, "muted-foreground": mutedForeground, border, input, sidebar: card, "sidebar-foreground": foreground, "sidebar-border": border })) {
    root.style.setProperty("--" + name, value)
  }
  root.style.setProperty("--secondary", muted)
  root.style.setProperty("--secondary-foreground", foreground)
  root.style.setProperty("--accent", muted)
  root.style.setProperty("--accent-foreground", foreground)
  root.style.setProperty("--sidebar-accent", muted)
  root.style.setProperty("--sidebar-accent-foreground", foreground)
  root.dataset.workspaceNavbarTheme = t.navbarTheme ?? "default"
  root.dataset.workspaceBase = t.base
  const accent = dark && t.accent === DEFAULT_THEME.accent ? "#60a5fa" : t.accent
  const primaryForeground = hexToHsl(accentForeground(accent))
  root.style.setProperty(
    "--workspace-primary-rgb",
    [1, 3, 5].map((i) => parseInt(accent.slice(i, i + 2), 16)).join(", "),
  )
  root.style.setProperty("--primary", hexToHsl(accent))
  root.style.setProperty("--primary-foreground", primaryForeground)
  root.style.setProperty("--ring", hexToHsl(accent))
  root.style.setProperty("--chart-1", hexToHsl(accent))
  root.style.setProperty("--sidebar-ring", hexToHsl(accent))
  root.style.setProperty("--sidebar-primary", hexToHsl(accent))
  root.style.setProperty("--sidebar-primary-foreground", primaryForeground)
  root.style.setProperty("--radius", `${t.radius}rem`)
  root.style.setProperty("--font-sans", FONT_STACKS[t.font])
  root.dataset.container = t.container
  root.dataset.navMode = t.nav
  root.dataset.navbar = t.navbar
  root.dataset.sidebar = t.sidebar
}

const ThemeStateContext = React.createContext<{
  theme: ThemeState
  setTheme: React.Dispatch<React.SetStateAction<ThemeState>>
  resolvedScheme: "light" | "dark"
}>({ theme: DEFAULT_THEME, setTheme: () => {}, resolvedScheme: "light" })

export function useThemeState() {
  return React.useContext(ThemeStateContext)
}

/** App-level provider: persists theme across route remounts */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeState>(() => loadTheme())

  const [systemDark, setSystemDark] = React.useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches)
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const refresh = () => setSystemDark(media.matches)
    media.addEventListener("change", refresh)
    return () => media.removeEventListener("change", refresh)
  }, [])
  const resolvedScheme = theme.scheme === "dark" || (theme.scheme === "auto" && systemDark) ? "dark" : "light"

  React.useLayoutEffect(() => {
    applyTheme(theme)
    persistTheme(theme)
  }, [theme, resolvedScheme])

  return (
    <ThemeStateContext.Provider value={{ theme, setTheme, resolvedScheme }}>
      {children}
    </ThemeStateContext.Provider>
  )
}

export interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  className?: string
}

export function ThemeCustomizer({
  open,
  onOpenChange,
  className,
}: ThemeCustomizerProps) {
  const { theme, setTheme } = useThemeState()
  const set = <K extends keyof ThemeState>(key: K, value: ThemeState[K]) =>
    setTheme((t) => ({ ...t, [key]: value }))
  const choices = <T extends string | number>(
    name: string,
    label: string,
    description: string,
    current: T,
    values: readonly (readonly [T, string])[],
    onChange: (value: T) => void,
  ) => (
    <fieldset className="workspace-setting">
      <legend>{label}</legend>
      <p>{description}</p>
      <div className="workspace-setting-options">
        {values.map(([value, title]) => (
          <label
            key={value}
            className={cn(
              "workspace-setting-choice",
              current === value && "is-selected",
            )}
          >
            <input
              type="radio"
              name={name}
              value={value}
              checked={current === value}
              onChange={() => onChange(value)}
            />
            <span>{title}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
  const scheme =
    theme.navbarTheme === "dark"
      ? "dark-nav"
      : theme.navbarTheme === "primary"
        ? "colored"
        : theme.scheme
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <div className="overtrue-workspace workspace-portal">
          <DialogPrimitive.Overlay className="workspace-settings-overlay" />
          <DialogPrimitive.Content
            className={cn("workspace-settings-panel", className)}
            aria-describedby="workspace-settings-description"
          >
            <div className="workspace-settings-header">
              <DialogPrimitive.Title>
                Make overtrue/ui your own
              </DialogPrimitive.Title>
              <DialogPrimitive.Close asChild>
                <Button
                  variant="workspace"
                  aria-label="Close customizer"
                  className="workspace-settings-close"
                >
                  ×
                </Button>
              </DialogPrimitive.Close>
            </div>
            <DialogPrimitive.Description
              id="workspace-settings-description"
              className="workspace-settings-description"
            >
              Pick the look and layout of this workspace. Your choices are saved
              in this browser.
            </DialogPrimitive.Description>
            <div className="workspace-settings-body">
              <h3>Appearance</h3>
              {choices(
                "scheme",
                "Color scheme",
                "The page and its navigation, in one pick.",
                scheme,
                [
                  ["auto", "Auto"],
                  ["light", "Light"],
                  ["dark", "Dark"],
                  ["dark-nav", "Dark nav"],
                  ["colored", "Colored"],
                ],
                (value) =>
                  setTheme((t) => ({
                    ...t,
                    scheme:
                      value === "dark-nav" || value === "colored"
                        ? "light"
                        : (value as ColorScheme),
                    navbarTheme:
                      value === "dark-nav"
                        ? "dark"
                        : value === "colored"
                          ? "primary"
                          : "default",
                  })),
              )}
              <fieldset className="workspace-setting">
                <legend>Accent color</legend>
                <p>The accent color used across the app.</p>
                <div className="workspace-setting-colors">
                  {ACCENTS.map((color) => (
                    <label
                      key={color}
                      style={{ background: color, color: accentForeground(color) }}
                      className={cn(theme.accent === color && "is-selected")}
                    >
                      <input
                        type="radio"
                        name="accent"
                        aria-label={color}
                        checked={theme.accent === color}
                        onChange={() => set("accent", color)}
                      />
                      <span>{theme.accent === color ? "✓" : ""}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {choices(
                "font",
                "Font family",
                "The typeface used across the app.",
                theme.font,
                [
                  ["sans", "Sans-serif"],
                  ["serif", "Serif"],
                  ["mono", "Monospace"],
                  ["comic", "Comic"],
                ] as const,
                (value) => set("font", value),
              )}
              {choices(
                "base",
                "Theme base",
                "The gray palette behind every surface.",
                theme.base,
                [
                  ["slate", "Slate"],
                  ["gray", "Gray"],
                  ["zinc", "Zinc"],
                  ["neutral", "Neutral"],
                  ["stone", "Stone"],
                ] as const,
                (value) => set("base", value),
              )}
              {choices(
                "radius",
                "Corner radius",
                "How round corners are drawn.",
                theme.radius,
                [
                  [0, "0"],
                  [0.5, "0.5"],
                  [1, "1"],
                  [1.5, "1.5"],
                  [2, "2"],
                ] as const,
                (value) => set("radius", value),
              )}
              <h3>Layout</h3>
              {choices(
                "navigation",
                "Navigation",
                "Where the main menu lives.",
                theme.nav === "sidebar" ? "sidebar" : "horizontal",
                [
                  ["horizontal", "Navbar"],
                  ["sidebar", "Sidebar"],
                ] as const,
                (value) => set("nav", value),
              )}
              {choices(
                "container",
                "Container width",
                "How wide the page content runs.",
                theme.container,
                [
                  ["default", "Default"],
                  ["fluid", "Fluid"],
                  ["boxed", "Boxed"],
                ] as const,
                (value) => set("container", value),
              )}
              {choices(
                "navbar",
                "Navbar behavior",
                "Keep the navbar visible while scrolling.",
                theme.navbar,
                [
                  ["default", "Default"],
                  ["sticky", "Sticky"],
                ] as const,
                (value) => set("navbar", value),
              )}
              {theme.nav === "sidebar" &&
                choices(
                  "sidebar",
                  "Sidebar",
                  "Choose the sidebar width.",
                  theme.sidebar,
                  [
                    ["expanded", "Default"],
                    ["folded", "Folded"],
                  ] as const,
                  (value) => set("sidebar", value),
                )}
            </div>
            <div className="workspace-settings-footer">
              <Button
                variant="workspace"
                className="pn-btn"
                onClick={() => setTheme((current) => ({ ...DEFAULT_THEME, layoutPreset: current.layoutPreset }))}
              >
                Reset changes
              </Button>
              <Button
                variant="workspace"
                className="pn-btn pn-btn-primary"
                onClick={() => onOpenChange(false)}
              >
                Save
              </Button>
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
