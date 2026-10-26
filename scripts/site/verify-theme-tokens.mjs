import assert from "node:assert/strict";
import {
  NEUTRALS,
  contrast,
  semanticPalette,
} from "../../src/lib/theme-colors.ts";
import {
  DEFAULT_STUDIO,
  exportCss,
  loadStudio,
  themeVariables,
} from "../../src/site/theme-tokens.ts";

let palettes = 0;
// Extremes and the entire coarse sRGB cube exercise both directions of adjustment.
const colors = [
  "#2a5bff",
  "#e8a317",
  "#0d1424",
  ...[0, 51, 102, 153, 204, 255].flatMap((r) =>
    [0, 51, 102, 153, 204, 255].flatMap((g) =>
      [0, 51, 102, 153, 204, 255].map(
        (b) =>
          "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join(""),
      ),
    ),
  ),
];
for (const neutral of Object.keys(NEUTRALS))
  for (const mode of ["light", "dark"])
    for (const high of [false, true])
      for (const accent of colors) {
        const p = semanticPalette(neutral, accent, mode, high);
        const ratio = high ? 7 : 4.5;
        for (const surface of [p.bg, p.subtle, p.card, p.muted]) {
          for (const text of [p.ink, p.graphite, p.primary])
            assert.ok(
              contrast(text, surface) >= ratio,
              `${neutral}/${mode}/${accent}: ${text} on ${surface}`,
            );
          assert.ok(contrast(p.input, surface) >= 3);
          if (high) assert.ok(contrast(p.border, surface) >= 3);
        }
        assert.ok(contrast(p.primary, p.onPrimary) >= ratio);
        assert.ok(contrast(p.tint, p.onTint) >= ratio);
        palettes++;
      }
for (const neutral of Object.keys(NEUTRALS))
  for (const mode of ["light", "dark"]) {
    const vars = themeVariables(
      { ...DEFAULT_STUDIO, neutral, accent: "#ffff00", contrast: "high" },
      mode,
    );
    for (const [name, color] of Object.entries(vars).filter(([name]) =>
      name.startsWith("--chart-"),
    )) {
      for (const surface of ["--background", "--card", "--muted"])
        assert.ok(contrast(color, vars[surface]) >= 3, `${name} on ${surface}`);
    }
    assert.equal(vars["--primary"], vars["--chart-1"]);
  }
const auto = exportCss(DEFAULT_STUDIO);
assert.ok(auto.includes("@media (prefers-contrast: more)"));
assert.ok(
  !exportCss({ ...DEFAULT_STUDIO, contrast: "standard" }).includes("@media"),
);
const store = new Map();
globalThis.localStorage = { getItem: (key) => store.get(key) ?? null };
for (const neutral of ["__proto__", "constructor", "not-a-neutral"]) {
  store.set(
    "overtrue-theme-studio",
    JSON.stringify({ neutral, contrast: "bogus", radius: -2 }),
  );
  assert.deepEqual(loadStudio(), DEFAULT_STUDIO);
}
store.set(
  "overtrue-theme-studio",
  JSON.stringify({
    accent: "#abcdef",
    radius: 20,
    neutral: "stone",
    harmonize: false,
  }),
);
assert.equal(loadStudio().contrast, "system");
assert.equal(loadStudio().radius, 20);
store.set("overtrue-theme-studio", "broken");
assert.deepEqual(loadStudio(), DEFAULT_STUDIO);
console.log(
  `Passed ${palettes} palette combinations, high-contrast charts, system CSS export, and saved-theme migration.`,
);
