/**
 * Theme math for the studio: OKLCH conversions, a chart palette harmonized to
 * any accent, dark-mode variants, and the CSS a shadcn project can paste in.
 */
export type Oklch = { l: number; c: number; h: number };
export type NeutralName = "ink" | "slate" | "zinc" | "stone";
export interface StudioTheme {
  accent: string;
  radius: number;
  neutral: NeutralName;
  harmonize: boolean;
}

export const DEFAULT_STUDIO: StudioTheme = {
  accent: "#2a5bff",
  radius: 8,
  neutral: "ink",
  harmonize: true,
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

const toLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const toGamma = (v: number) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;

export function hexToOklch(hex: string): Oklch {
  const [r, g, b] = [1, 3, 5].map((i) =>
    toLinear(parseInt(hex.slice(i, i + 2), 16) / 255),
  );
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    l: L,
    c: Math.hypot(A, B),
    h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360,
  };
}

function oklchToRgb({ l, c, h }: Oklch) {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

/** Reduce chroma until the color fits in sRGB. */
export function oklchToHex(color: Oklch) {
  let { c } = color;
  let rgb = oklchToRgb({ ...color, c });
  for (let i = 0; i < 40 && rgb.some((v) => v < -0.0005 || v > 1.0005); i++) {
    c *= 0.94;
    rgb = oklchToRgb({ ...color, c });
  }
  return (
    "#" +
    rgb
      .map((v) =>
        Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, v))))) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

export const formatOklch = ({ l, c, h }: Oklch) =>
  `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${c < 0.002 ? 0 : h.toFixed(1)})`;

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) =>
    toLinear(parseInt(hex.slice(i, i + 2), 16) / 255),
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
/** White or ink, whichever reads better on the accent. */
export function onColor(hex: string) {
  return contrast(hex, "#ffffff") >= contrast(hex, "#0d1424") ? "#ffffff" : "#0d1424";
}

/** Lighter, slightly calmer accent for dark surfaces. */
export function darkVariant(hex: string) {
  const color = hexToOklch(hex);
  return oklchToHex({
    l: Math.max(color.l, 0.72),
    c: color.c * 0.82,
    h: color.h,
  });
}

// The default palette, described relative to Ultramarine's hue.
const SERIES = [
  { offset: 0, light: [0.55, 0.24], dark: [0.72, 0.16] },
  { offset: -104, light: [0.6, 0.13], dark: [0.77, 0.14] },
  { offset: -189, light: [0.73, 0.16], dark: [0.84, 0.16] },
  { offset: 31, light: [0.6, 0.22], dark: [0.73, 0.15] },
  { offset: 86, light: [0.63, 0.2], dark: [0.74, 0.16] },
];
const CLASSIC = {
  light: ["#2a5bff", "#0f9f6e", "#e19a0b", "#8b5cf6", "#e5487d"],
  dark: ["#7b93ff", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"],
};

export function chartPalette(theme: StudioTheme, mode: "light" | "dark") {
  const accent = mode === "dark" ? darkVariant(theme.accent) : theme.accent;
  if (!theme.harmonize) return [accent, ...CLASSIC[mode].slice(1)];
  const { h } = hexToOklch(theme.accent);
  return SERIES.map((series, index) =>
    index === 0
      ? accent
      : oklchToHex({
          l: series[mode][0],
          c: series[mode][1],
          h: (h + series.offset + 360) % 360,
        }),
  );
}

export const NEUTRALS: Record<
  NeutralName,
  { label: string; light: Record<string, string>; dark: Record<string, string> }
> = {
  ink: {
    label: "Ink",
    light: { bg: "#fbfbfc", subtle: "#f3f4f7", ink: "#0d1424", graphite: "#5d6678", card: "#ffffff", muted: "#eef0f4", border: "#e4e7ec", input: "#d5dae2" },
    dark: { bg: "#07090f", subtle: "#0c0f17", ink: "#eef1f7", graphite: "#8b93a5", card: "#0f131c", muted: "#171c28", border: "#1d2330", input: "#2a3242" },
  },
  slate: {
    label: "Slate",
    light: { bg: "#f8fafc", subtle: "#f1f5f9", ink: "#0f172a", graphite: "#64748b", card: "#ffffff", muted: "#eef2f6", border: "#e2e8f0", input: "#cbd5e1" },
    dark: { bg: "#020617", subtle: "#0b1222", ink: "#f1f5f9", graphite: "#94a3b8", card: "#0f172a", muted: "#1e293b", border: "#1e293b", input: "#334155" },
  },
  zinc: {
    label: "Zinc",
    light: { bg: "#fafafa", subtle: "#f4f4f5", ink: "#18181b", graphite: "#71717a", card: "#ffffff", muted: "#f1f1f3", border: "#e4e4e7", input: "#d4d4d8" },
    dark: { bg: "#09090b", subtle: "#0f0f12", ink: "#fafafa", graphite: "#a1a1aa", card: "#131316", muted: "#1c1c20", border: "#232328", input: "#3f3f46" },
  },
  stone: {
    label: "Stone",
    light: { bg: "#fafaf9", subtle: "#f5f5f4", ink: "#1c1917", graphite: "#78716c", card: "#ffffff", muted: "#f2f1ef", border: "#e7e5e4", input: "#d6d3d1" },
    dark: { bg: "#0c0a09", subtle: "#13110f", ink: "#fafaf9", graphite: "#a8a29e", card: "#171412", muted: "#211d1a", border: "#292524", input: "#44403c" },
  },
};

/** Every variable the studio controls, for one mode. */
export function themeVariables(theme: StudioTheme, mode: "light" | "dark") {
  const n = NEUTRALS[theme.neutral][mode];
  const primary = mode === "dark" ? darkVariant(theme.accent) : theme.accent;
  const charts = chartPalette(theme, mode);
  const accentTint = oklchToHex({
    ...hexToOklch(primary),
    l: mode === "dark" ? 0.26 : 0.96,
    c: mode === "dark" ? 0.06 : 0.025,
  });
  return {
    "--radius": `${theme.radius / 16}rem`,
    "--primary": primary,
    "--primary-foreground": onColor(primary),
    "--ring": primary,
    "--accent": accentTint,
    "--accent-foreground": mode === "dark" ? primary : theme.accent,
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
  const block = (selector: string, mode: "light" | "dark") => {
    const vars = themeVariables(theme, mode);
    const lines = Object.entries(vars)
      .filter(([name]) => !name.startsWith("--site-"))
      .filter(([name]) => mode === "light" || name !== "--radius")
      .map(([name, value]) =>
        `  ${name}: ${value.startsWith("#") ? formatOklch(hexToOklch(value)) : value};`,
      );
    return `${selector} {\n${lines.join("\n")}\n}`;
  };
  return `${block(":root", "light")}\n\n${block(".dark", "dark")}\n`;
}

const STORAGE_KEY = "overtrue-theme-studio";
export function loadStudio(): StudioTheme {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!saved || typeof saved !== "object") return DEFAULT_STUDIO;
    return {
      accent: /^#[\da-f]{6}$/i.test(saved.accent) ? saved.accent : DEFAULT_STUDIO.accent,
      radius:
        typeof saved.radius === "number" && saved.radius >= 0 && saved.radius <= 20
          ? saved.radius
          : DEFAULT_STUDIO.radius,
      neutral: saved.neutral in NEUTRALS ? saved.neutral : DEFAULT_STUDIO.neutral,
      harmonize: typeof saved.harmonize === "boolean" ? saved.harmonize : true,
    };
  } catch {
    return DEFAULT_STUDIO;
  }
}
export function saveStudio(theme: StudioTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    /* Storage is optional. */
  }
}
export const isDefaultStudio = (theme: StudioTheme) =>
  theme.accent.toLowerCase() === DEFAULT_STUDIO.accent &&
  theme.radius === DEFAULT_STUDIO.radius &&
  theme.neutral === DEFAULT_STUDIO.neutral &&
  theme.harmonize === DEFAULT_STUDIO.harmonize;

/** Inject the theme as a stylesheet so both modes stay correct. */
export function applyStudio(theme: StudioTheme) {
  const id = "overtrue-theme-studio";
  let style = document.getElementById(id) as HTMLStyleElement | null;
  if (isDefaultStudio(theme)) {
    style?.remove();
    return;
  }
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
