/** Shared colors for the gallery, exported themes, and workspace. */
export type Oklch = { l: number; c: number; h: number };
export type NeutralName =
  "ink" | "slate" | "gray" | "zinc" | "neutral" | "stone";
export type ContrastPreference = "system" | "standard" | "high";
export const CONTRAST_OPTIONS = [
  { value: "system", label: "System" },
  { value: "standard", label: "Standard" },
  { value: "high", label: "High" },
] as const;
export const isContrastPreference = (
  value: unknown,
): value is ContrastPreference =>
  value === "system" || value === "standard" || value === "high";
export function systemContrast() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-contrast: more)").matches
  );
}
export function highContrast(
  preference: ContrastPreference,
  system = systemContrast(),
) {
  return preference === "high" || (preference === "system" && system);
}

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
        Math.round(
          Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, v))))) * 255,
        )
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

export const formatOklch = ({ l, c, h }: Oklch) =>
  `oklch(${l.toFixed(5)} ${c.toFixed(5)} ${c < 0.002 ? 0 : h.toFixed(3)})`;

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
/** White or black, whichever reads better on the accent. */
export function onColor(hex: string) {
  return contrast(hex, "#ffffff") >= contrast(hex, "#000000")
    ? "#ffffff"
    : "#000000";
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

/** Move only as far toward white or black as the requested contrast needs. */
export function ensureContrast(
  color: string,
  surfaces: string[],
  minimum: number,
) {
  const passes = (candidate: string) =>
    surfaces.every((surface) => contrast(candidate, surface) >= minimum);
  if (passes(color)) return color;
  const rgb = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16));
  const candidates = [0, 255].flatMap((end) => {
    const mix = (amount: number) =>
      "#" +
      rgb
        .map((v) =>
          Math.round(v + (end - v) * amount)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("");
    if (!passes(mix(1))) return [];
    let low = 0,
      high = 1;
    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2;
      if (passes(mix(mid))) high = mid;
      else low = mid;
    }
    return [{ color: mix(high), distance: high }];
  });
  return (
    candidates.sort((a, b) => a.distance - b.distance)[0]?.color ??
    onColor(surfaces[0])
  );
}

type NeutralPalette = Record<
  "bg" | "subtle" | "ink" | "graphite" | "card" | "muted" | "border" | "input",
  string
>;

export const NEUTRALS: Record<
  NeutralName,
  { label: string; light: NeutralPalette; dark: NeutralPalette }
> = {
  ink: {
    label: "Ink",
    light: {
      bg: "#ffffff",
      subtle: "#fafafa",
      ink: "#202020",
      graphite: "#666666",
      card: "#ffffff",
      muted: "#f5f5f5",
      border: "#e5e5e5",
      input: "#d4d4d4",
    },
    dark: {
      bg: "#121212",
      subtle: "#181818",
      ink: "#eeeeee",
      graphite: "#a3a3a3",
      card: "#1b1b1b",
      muted: "#242424",
      border: "#303030",
      input: "#454545",
    },
  },
  gray: {
    label: "Gray",
    light: {
      bg: "#f9fafb",
      subtle: "#f3f4f6",
      ink: "#111827",
      graphite: "#6b7280",
      card: "#ffffff",
      muted: "#f3f4f6",
      border: "#e5e7eb",
      input: "#d1d5db",
    },
    dark: {
      bg: "#030712",
      subtle: "#0b101b",
      ink: "#f9fafb",
      graphite: "#9ca3af",
      card: "#111827",
      muted: "#1f2937",
      border: "#1f2937",
      input: "#374151",
    },
  },
  neutral: {
    label: "Neutral",
    light: {
      bg: "#fafafa",
      subtle: "#f5f5f5",
      ink: "#171717",
      graphite: "#737373",
      card: "#ffffff",
      muted: "#f5f5f5",
      border: "#e5e5e5",
      input: "#d4d4d4",
    },
    dark: {
      bg: "#0a0a0a",
      subtle: "#171717",
      ink: "#fafafa",
      graphite: "#a3a3a3",
      card: "#262626",
      muted: "#262626",
      border: "#404040",
      input: "#525252",
    },
  },
  slate: {
    label: "Slate",
    light: {
      bg: "#f8fafc",
      subtle: "#f1f5f9",
      ink: "#0f172a",
      graphite: "#64748b",
      card: "#ffffff",
      muted: "#eef2f6",
      border: "#e2e8f0",
      input: "#cbd5e1",
    },
    dark: {
      bg: "#020617",
      subtle: "#0b1222",
      ink: "#f1f5f9",
      graphite: "#94a3b8",
      card: "#0f172a",
      muted: "#1e293b",
      border: "#1e293b",
      input: "#334155",
    },
  },
  zinc: {
    label: "Zinc",
    light: {
      bg: "#fafafa",
      subtle: "#f4f4f5",
      ink: "#18181b",
      graphite: "#71717a",
      card: "#ffffff",
      muted: "#f1f1f3",
      border: "#e4e4e7",
      input: "#d4d4d8",
    },
    dark: {
      bg: "#09090b",
      subtle: "#0f0f12",
      ink: "#fafafa",
      graphite: "#a1a1aa",
      card: "#131316",
      muted: "#1c1c20",
      border: "#232328",
      input: "#3f3f46",
    },
  },
  stone: {
    label: "Stone",
    light: {
      bg: "#fafaf9",
      subtle: "#f5f5f4",
      ink: "#1c1917",
      graphite: "#78716c",
      card: "#ffffff",
      muted: "#f2f1ef",
      border: "#e7e5e4",
      input: "#d6d3d1",
    },
    dark: {
      bg: "#0c0a09",
      subtle: "#13110f",
      ink: "#fafaf9",
      graphite: "#a8a29e",
      card: "#171412",
      muted: "#211d1a",
      border: "#292524",
      input: "#44403c",
    },
  },
};

export function semanticPalette(
  neutral: NeutralName,
  accent: string,
  mode: "light" | "dark",
  high: boolean,
) {
  const n = { ...NEUTRALS[neutral][mode] };
  const surfaces = [n.bg, n.subtle, n.card, n.muted];
  const textRatio = high ? 7.05 : 4.55;
  n.ink = ensureContrast(n.ink, surfaces, textRatio);
  n.graphite = ensureContrast(n.graphite, surfaces, textRatio);
  n.input = ensureContrast(n.input, surfaces, 3.05);
  if (high) n.border = ensureContrast(n.border, surfaces, 3.05);
  const primary = ensureContrast(
    mode === "dark" ? darkVariant(accent) : accent,
    surfaces,
    textRatio,
  );
  const tint = oklchToHex({
    ...hexToOklch(primary),
    l: mode === "dark" ? 0.26 : 0.96,
    c: mode === "dark" ? 0.06 : 0.025,
  });
  return {
    ...n,
    primary,
    onPrimary: onColor(primary),
    tint,
    onTint: ensureContrast(primary, [tint], textRatio),
  };
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

export function chartColors(
  theme: {
    neutral: NeutralName;
    accent: string;
    contrast: ContrastPreference;
    harmonize: boolean;
  },
  mode: "light" | "dark",
  system?: boolean,
) {
  const high = highContrast(theme.contrast, system);
  const n = semanticPalette(theme.neutral, theme.accent, mode, high);
  const accent = n.primary;
  const { h } = hexToOklch(theme.accent);
  const colors = !theme.harmonize
    ? [accent, ...CLASSIC[mode].slice(1)]
    : SERIES.map((series, index) =>
        index === 0
          ? accent
          : oklchToHex({
              l: series[mode][0],
              c: series[mode][1],
              h: (h + series.offset + 360) % 360,
            }),
      );
  return colors.map((color) =>
    high
      ? ensureContrast(color, [n.bg, n.subtle, n.card, n.muted], 3.05)
      : color,
  );
}
