/**
 * Theme math for the studio: OKLCH conversions, a chart palette harmonized to
 * any accent, dark-mode variants, and the CSS a shadcn project can paste in.
 */
import {
  NEUTRALS,
  chartColors,
  ensureContrast,
  formatOklch,
  hexToOklch,
  highContrast,
  isContrastPreference,
  onColor,
  semanticPalette,
  type ContrastPreference,
  type NeutralName,
} from "../lib/theme-colors.ts";
export {
  NEUTRALS,
  contrast,
  darkVariant,
  hexToOklch,
  oklchToHex,
  onColor,
  type NeutralName,
} from "../lib/theme-colors.ts";
export interface StudioTheme {
  accent: string;
  radius: number;
  neutral: NeutralName;
  harmonize: boolean;
  contrast: ContrastPreference;
}

export const DEFAULT_STUDIO: StudioTheme = {
  accent: "#2a5bff",
  radius: 8,
  neutral: "ink",
  harmonize: true,
  contrast: "system",
};

export const ACCENT_PRESETS = [
  { name: "Ultramarine", value: "#2a5bff" },
  { name: "Iris", value: "#6d5efc" },
  { name: "Violet", value: "#9b5cf6" },
  { name: "Rose", value: "#e5487d" },
  { name: "Ember", value: "#f76b15" },
  { name: "Amber", value: "#e8a317" },
  { name: "Jade", value: "#0f9f6e" },
  { name: "Cyan", value: "#0891b2" },
] as const;

export { chartColors as chartPalette } from "../lib/theme-colors.ts";

/** Every variable the studio controls, for one mode. */
export function themeVariables(
  theme: StudioTheme,
  mode: "light" | "dark",
  system?: boolean,
) {
  const high = highContrast(theme.contrast, system);
  const n = semanticPalette(theme.neutral, theme.accent, mode, high);
  const primary = n.primary;
  const charts = chartColors(theme, mode, system);
  const destructive = ensureContrast(
    mode === "dark" ? "#f87171" : "#dc2626",
    [n.bg, n.subtle, n.card, n.muted],
    high ? 7.05 : 4.55,
  );
  return {
    "--radius": `${theme.radius / 16}rem`,
    "--primary": primary,
    "--primary-foreground": n.onPrimary,
    "--ring": primary,
    "--destructive": destructive,
    "--destructive-foreground": onColor(destructive),
    "--accent": n.tint,
    "--accent-foreground": n.onTint,
    "--chart-1": charts[0],
    "--chart-2": charts[1],
    "--chart-3": charts[2],
    "--chart-4": charts[3],
    "--chart-5": charts[4],
    "--background": n.subtle,
    "--foreground": n.ink,
    "--card": n.card,
    "--card-foreground": n.ink,
    "--popover": n.card,
    "--popover-foreground": n.ink,
    "--muted": n.muted,
    "--muted-foreground": n.graphite,
    "--secondary": n.muted,
    "--secondary-foreground": n.ink,
    "--border": n.border,
    "--input": n.input,
    "--site-bg": n.bg,
    "--site-subtle": n.subtle,
    "--site-ink": n.ink,
    "--site-graphite": n.graphite,
  } as Record<string, string>;
}

/** CSS for a shadcn/ui globals.css, in the oklch() notation shadcn uses. */
export function exportCss(theme: StudioTheme) {
  const block = (selector: string, mode: "light" | "dark", system = false) => {
    const vars = themeVariables(theme, mode, system);
    const lines = Object.entries(vars)
      .filter(([name]) => !name.startsWith("--site-"))
      .filter(([name]) => mode === "light" || name !== "--radius")
      .map(
        ([name, value]) =>
          `  ${name}: ${value.startsWith("#") ? formatOklch(hexToOklch(value)) : value};`,
      );
    return `${selector} {\n${lines.join("\n")}\n}`;
  };
  const base = `${block(":root", "light")}\n\n${block(".dark", "dark")}\n`;
  return theme.contrast === "system"
    ? `${base}\n@media (prefers-contrast: more) {\n${block(":root", "light", true)}\n${block(".dark", "dark", true)}\n}\n`
    : base;
}

const STORAGE_KEY = "overtrue-theme-studio";
export function loadStudio(): StudioTheme {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!saved || typeof saved !== "object") return DEFAULT_STUDIO;
    return {
      accent: /^#[\da-f]{6}$/i.test(saved.accent)
        ? saved.accent
        : DEFAULT_STUDIO.accent,
      radius:
        typeof saved.radius === "number" &&
        saved.radius >= 0 &&
        saved.radius <= 32
          ? saved.radius
          : DEFAULT_STUDIO.radius,
      neutral: Object.hasOwn(NEUTRALS, saved.neutral)
        ? saved.neutral
        : DEFAULT_STUDIO.neutral,
      harmonize: typeof saved.harmonize === "boolean" ? saved.harmonize : true,
      contrast: isContrastPreference(saved.contrast)
        ? saved.contrast
        : "system",
    };
  } catch {
    return DEFAULT_STUDIO;
  }
}
export function saveStudio(theme: StudioTheme) {
  try {
    const json = JSON.stringify(theme);
    if (localStorage.getItem(STORAGE_KEY) !== json)
      localStorage.setItem(STORAGE_KEY, json);
  } catch {
    /* Storage is optional. */
  }
}
export const isDefaultStudio = (theme: StudioTheme) =>
  theme.accent.toLowerCase() === DEFAULT_STUDIO.accent &&
  theme.radius === DEFAULT_STUDIO.radius &&
  theme.neutral === DEFAULT_STUDIO.neutral &&
  theme.harmonize === DEFAULT_STUDIO.harmonize &&
  theme.contrast === DEFAULT_STUDIO.contrast;

/** Inject the theme as a stylesheet so both modes stay correct. */
export function applyStudio(theme: StudioTheme) {
  const id = "overtrue-theme-studio";
  let style = document.getElementById(id) as HTMLStyleElement | null;
  document.documentElement.dataset.contrast = highContrast(theme.contrast)
    ? "high"
    : "standard";
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.append(style);
  }
  const rule = (selector: string, mode: "light" | "dark") =>
    `${selector}{${Object.entries(themeVariables(theme, mode))
      .map(([name, value]) => `${name}:${value}`)
      .join(";")}}`;
  style.textContent = `${rule(":root:root", "light")}${rule(":root:root.dark", "dark")}`;
}
