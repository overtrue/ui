import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import {
  IconCheck,
  IconColorSwatch,
  IconRefresh,
} from "@tabler/icons-react";
import {
  ACCENT_PRESETS,
  DEFAULT_STUDIO,
  NEUTRALS,
  applyStudio,
  chartPalette,
  exportCss,
  isDefaultStudio,
  loadStudio,
  onColor,
  saveStudio,
  type NeutralName,
  type StudioTheme,
} from "./theme-tokens";
import { CopyButton } from "./code";

// Apply before the first paint so a saved theme never flashes the default.
if (typeof document !== "undefined") applyStudio(loadStudio());

const StudioContext = createContext<{
  theme: StudioTheme;
  setTheme: (update: (theme: StudioTheme) => StudioTheme) => void;
}>({ theme: DEFAULT_STUDIO, setTheme: () => {} });

export function useStudio() {
  return useContext(StudioContext);
}

export function ThemeStudioProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState(loadStudio);
  useEffect(() => {
    applyStudio(theme);
    saveStudio(theme);
  }, [theme]);
  return (
    <StudioContext.Provider
      value={{ theme, setTheme: (update) => setThemeState(update) }}
    >
      {children}
    </StudioContext.Provider>
  );
}

/** The controls, usable in the header popover and inline in the docs. */
export function ThemeStudioPanel({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useStudio();
  const set = <K extends keyof StudioTheme>(key: K, value: StudioTheme[K]) =>
    setTheme((current) => ({ ...current, [key]: value }));
  const light = chartPalette(theme, "light");
  const dark = chartPalette(theme, "dark");
  const css = exportCss(theme);
  return (
    <div className="studio-panel" data-compact={compact || undefined}>
      <fieldset>
        <legend>Accent</legend>
        <div className="studio-swatches" role="radiogroup" aria-label="Accent">
          {ACCENT_PRESETS.map((preset) => {
            const active = theme.accent.toLowerCase() === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={preset.name}
                title={preset.name}
                className="studio-swatch"
                style={{ background: preset.value, color: onColor(preset.value) }}
                onClick={() => set("accent", preset.value)}
              >
                {active && <IconCheck size={13} stroke={3} aria-hidden="true" />}
              </button>
            );
          })}
          <label className="studio-swatch studio-custom" title="Custom color">
            <span className="sr-only">Custom accent color</span>
            <input
              type="color"
              value={theme.accent}
              onChange={(event) => set("accent", event.target.value)}
            />
          </label>
        </div>
        <div className="studio-hex">
          <span style={{ background: theme.accent }} aria-hidden="true" />
          <code>{theme.accent.toUpperCase()}</code>
        </div>
      </fieldset>
      <fieldset>
        <legend>
          Chart palette
          <label className="studio-toggle">
            <input
              type="checkbox"
              checked={theme.harmonize}
              onChange={(event) => set("harmonize", event.target.checked)}
            />
            Harmonize with accent
          </label>
        </legend>
        <div className="studio-palette" aria-label="Chart colors, light and dark">
          {light.map((color, index) => (
            <span key={index} title={`chart-${index + 1}`}>
              <i style={{ background: color }} />
              <i style={{ background: dark[index] }} />
            </span>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>
          Radius <output>{theme.radius}px</output>
        </legend>
        <input
          className="studio-range"
          type="range"
          min={0}
          max={16}
          step={1}
          value={theme.radius}
          aria-label="Corner radius"
          onChange={(event) => set("radius", Number(event.target.value))}
        />
      </fieldset>
      <fieldset>
        <legend>Neutral</legend>
        <div className="studio-neutrals" role="radiogroup" aria-label="Neutral">
          {(Object.keys(NEUTRALS) as NeutralName[]).map((name) => (
            <button
              key={name}
              type="button"
              role="radio"
              aria-checked={theme.neutral === name}
              onClick={() => set("neutral", name)}
            >
              <span
                aria-hidden="true"
                style={{
                  background: `linear-gradient(135deg, ${NEUTRALS[name].light.subtle} 50%, ${NEUTRALS[name].dark.card} 50%)`,
                }}
              />
              {NEUTRALS[name].label}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="studio-export">
        <div>
          <strong>globals.css</strong>
          <span>Paste into your shadcn/ui project.</span>
        </div>
        <CopyButton text={css} label="Copy theme CSS" />
      </div>
      {!compact && <pre className="studio-code">{css}</pre>}
      <button
        type="button"
        className="studio-reset"
        disabled={isDefaultStudio(theme)}
        onClick={() => setTheme(() => DEFAULT_STUDIO)}
      >
        <IconRefresh size={14} aria-hidden="true" /> Reset to default
      </button>
    </div>
  );
}

export function ThemeStudioButton() {
  const { theme } = useStudio();
  return (
    <Popover.Root>
      <Popover.Trigger
        className="icon-button studio-trigger"
        aria-label="Customize theme"
        title="Customize theme"
        data-custom={isDefaultStudio(theme) ? undefined : ""}
      >
        <IconColorSwatch size={18} aria-hidden="true" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="studio-popover"
          align="end"
          sideOffset={10}
          collisionPadding={12}
        >
          <div className="studio-popover-head">
            <strong>Theme</strong>
            <span>Recolors the site and every preview.</span>
          </div>
          <ThemeStudioPanel compact />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
