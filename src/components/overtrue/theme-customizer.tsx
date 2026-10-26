import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CONTRAST_OPTIONS, NEUTRALS, chartColors, ensureContrast, highContrast, isContrastPreference, onColor, semanticPalette, systemContrast, type ContrastPreference } from "@/lib/theme-colors"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export type ColorScheme = "light" | "dark" | "auto"
export type ThemeBase = "ink" | "slate" | "gray" | "zinc" | "neutral" | "stone"
export type NavMode = "navbar" | "sidebar" | "horizontal"
export type ContainerWidth = "default" | "fluid" | "boxed"
export type NavbarBehavior = "default" | "sticky"

export interface ThemeState {
  /** Last layout example opened; keeps saved edits when that page reloads. */
  layoutPreset?: string
  navbarTheme?: "default" | "dark" | "primary"
  harmonize: boolean
  contrast: ContrastPreference
  scheme: ColorScheme
  accent: string
  font: "sans" | "serif" | "mono" | "comic"
  base: ThemeBase
  radius: number
  nav: NavMode
  container: ContainerWidth
  navbar: NavbarBehavior
  sidebar: "expanded" | "folded"
}

export const DEFAULT_THEME: ThemeState = {
  harmonize: true,
  contrast: "system",
  scheme: "auto",
  accent: "#2a5bff",
  font: "sans",
  base: "ink",
  radius: 0.5,
  nav: "sidebar",
  container: "default",
  navbar: "default",
  sidebar: "expanded",
}

const STORAGE_KEY = "overtrue-workspace-theme-v3"

const ACCENTS = [
  DEFAULT_THEME.accent,
  "#6d5efc",
  "#9b5cf6",
  "#e5487d",
  "#f2555a",
  "#f76b15",
  "#e8a317",
  "#65a30d",
  "#0f9f6e",
  "#0ea5a4",
  "#0891b2",
  "#0d1424",
]

const FONT_STACKS: Record<ThemeState["font"], string> = {
  sans: '"Mona Sans Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  mono: '"JetBrains Mono Variable", Menlo, Monaco, Consolas, monospace',
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

/** Appearance is shared with the gallery; layout and font stay workspace-specific. */
function themeFromStudio(theme: ThemeState): ThemeState {
  try {
    const scheme = window.localStorage.getItem("overtrue-site-theme")
    if (scheme === "light" || scheme === "dark") theme.scheme = scheme
    if (scheme === "system") theme.scheme = "auto"
    const studio = JSON.parse(window.localStorage.getItem("overtrue-theme-studio") ?? "null")
    if (!studio || typeof studio !== "object") return theme
    if (typeof studio.accent === "string" && /^#[\da-f]{6}$/i.test(studio.accent)) theme.accent = studio.accent.toLowerCase()
    if (Object.hasOwn(NEUTRALS, studio.neutral)) theme.base = studio.neutral
    if (typeof studio.radius === "number" && studio.radius >= 0 && studio.radius <= 32) theme.radius = studio.radius / 16
    if (typeof studio.harmonize === "boolean") theme.harmonize = studio.harmonize
    if (isContrastPreference(studio.contrast)) theme.contrast = studio.contrast
  } catch { /* Storage is optional. */ }
  return theme
}

export function loadTheme(): ThemeState {
  if (typeof window === "undefined") return DEFAULT_THEME
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return themeFromStudio({ ...DEFAULT_THEME })
    const saved: unknown = JSON.parse(raw)
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return themeFromStudio({ ...DEFAULT_THEME })
    const theme = { ...DEFAULT_THEME }
    const choices = {
      contrast: ["system", "standard", "high"], scheme: ["light", "dark", "auto"], font: ["sans", "serif", "mono", "comic"],
      base: ["ink", "slate", "gray", "zinc", "neutral", "stone"],
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
    const harmonize = (saved as Record<string, unknown>).harmonize
    if (typeof harmonize === "boolean") theme.harmonize = harmonize
    const radius = (saved as Record<string, unknown>).radius
    if (typeof radius === "number" && radius >= 0 && radius <= 2) theme.radius = radius
    return themeFromStudio(theme)
  } catch {
    return themeFromStudio({ ...DEFAULT_THEME })
  }
}

export function persistTheme(theme: ThemeState) {
  if (typeof window === "undefined") return
  try {
    const local = JSON.stringify(theme)
    if (window.localStorage.getItem(STORAGE_KEY) !== local) window.localStorage.setItem(STORAGE_KEY, local)
    const scheme = theme.scheme === "auto" ? "system" : theme.scheme
    if (window.localStorage.getItem("overtrue-site-theme") !== scheme) window.localStorage.setItem("overtrue-site-theme", scheme)
    let studio: Record<string, unknown> = {}
    try { studio = JSON.parse(window.localStorage.getItem("overtrue-theme-studio") ?? "{}") ?? {} } catch { /* Repair invalid storage. */ }
    const shared = JSON.stringify({ ...studio, accent: theme.accent, neutral: theme.base, radius: theme.radius * 16, contrast: theme.contrast, harmonize: theme.harmonize })
    if (window.localStorage.getItem("overtrue-theme-studio") !== shared) window.localStorage.setItem("overtrue-theme-studio", shared)
  } catch {
    /* ignore quota */
  }
}

/** White or black, whichever reads better on the selected swatch. */
export const accentForeground = onColor

export function applyTheme(t: ThemeState) {
  const root = document.documentElement
  root.classList.toggle(
    "dark",
    t.scheme === "dark" ||
      (t.scheme === "auto" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  )
  const dark = root.classList.contains("dark")
  const high = highContrast(t.contrast)
  root.dataset.contrast = high ? "high" : "standard"
  const palette = semanticPalette(t.base, t.accent, dark ? "dark" : "light", high)
  const [background, foreground, card, muted, mutedForeground, border, input] = [palette.subtle, palette.ink, palette.card, palette.muted, palette.graphite, palette.border, palette.input].map(hexToHsl)
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
  const accent = palette.primary
  const primaryForeground = hexToHsl(accentForeground(accent))
  root.style.setProperty(
    "--workspace-primary-rgb",
    [1, 3, 5].map((i) => parseInt(accent.slice(i, i + 2), 16)).join(", "),
  )
  root.style.setProperty("--primary", hexToHsl(accent))
  root.style.setProperty("--primary-foreground", primaryForeground)
  root.style.setProperty("--ring", hexToHsl(accent))
  chartColors({ ...t, neutral: t.base }, dark ? "dark" : "light").forEach((color, index) => root.style.setProperty(`--chart-${index + 1}`, hexToHsl(color)))
  const destructive = ensureContrast(dark ? "#f87171" : "#dc2626", [palette.bg, palette.subtle, palette.card, palette.muted], high ? 7.05 : 4.55)
  root.style.setProperty("--destructive", hexToHsl(destructive))
  root.style.setProperty("--destructive-foreground", hexToHsl(onColor(destructive)))
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

  const [moreContrast, setMoreContrast] = React.useState(systemContrast)
  const [systemDark, setSystemDark] = React.useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches)
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const contrast = window.matchMedia("(prefers-contrast: more)")
    const refreshContrast = () => setMoreContrast(contrast.matches)
    const refreshStorage = (event: StorageEvent) => {
      if (event.key === "overtrue-theme-studio" || event.key === STORAGE_KEY || event.key === "overtrue-site-theme" || event.key === null) setTheme(loadTheme())
    }
    contrast.addEventListener("change", refreshContrast)
    window.addEventListener("storage", refreshStorage)
    const refresh = () => setSystemDark(media.matches)
    media.addEventListener("change", refresh)
    return () => {
      media.removeEventListener("change", refresh)
      contrast.removeEventListener("change", refreshContrast)
      window.removeEventListener("storage", refreshStorage)
    }
  }, [])
  const resolvedScheme = theme.scheme === "dark" || (theme.scheme === "auto" && systemDark) ? "dark" : "light"

  React.useLayoutEffect(() => {
    applyTheme(theme)
    persistTheme(theme)
  }, [theme, resolvedScheme, moreContrast])

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
              {choices(
                "contrast", "Contrast", "Stronger text and boundaries, or follow your device.", theme.contrast,
                CONTRAST_OPTIONS.map(({ value, label }) => [value, label] as const),
                (value) => set("contrast", value),
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
                <label className="workspace-custom-color">
                  Custom accent
                  <input type="color" aria-label="Custom accent" value={theme.accent} onChange={(event) => set("accent", event.target.value)} />
                  <code>{theme.accent.toUpperCase()}</code>
                </label>
              </fieldset>
              <label className="workspace-custom-color">
                <input type="checkbox" checked={theme.harmonize} onChange={(event) => set("harmonize", event.target.checked)} />
                Harmonize chart colors
              </label>
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
                  ["ink", "Ink"],
                  ["slate", "Slate"],
                  ["gray", "Gray"],
                  ["zinc", "Zinc"],
                  ["neutral", "Neutral"],
                  ["stone", "Stone"],
                ] as const,
                (value) => set("base", value),
              )}
              <fieldset className="workspace-setting">
                <legend>Corner radius <output>{Math.round(theme.radius * 16)}px</output></legend>
                <input type="range" min={0} max={32} step={1} value={theme.radius * 16} aria-label="Corner radius" onChange={(event) => set("radius", Number(event.target.value) / 16)} />
              </fieldset>
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
