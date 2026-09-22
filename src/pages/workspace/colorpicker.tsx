import { useState } from "react";
import { IconPalette } from "@tabler/icons-react";
import { WorkspaceColorpicker } from "@/components/overtrue/workspace/plugins";
import { Scene, SceneCard } from "@/components/overtrue/scenes/shared";
const colors = [
  ["Blue", "#4263c7"],
  ["Azure", "#4299e1"],
  ["Indigo", "#4263eb"],
  ["Purple", "#ae3ec9"],
  ["Pink", "#d6336c"],
  ["Red", "#d63939"],
  ["Orange", "#f76707"],
  ["Yellow", "#f59f00"],
  ["Lime", "#74b816"],
  ["Green", "#2fb344"],
  ["Teal", "#0ca678"],
  ["Cyan", "#17a2b8"],
];
export default function Page() {
  const [color, setColor] = useState("#4263c7");
  return (
    <Scene
      id="colorpicker"
      title="Find the right color"
      description="Explore a palette, fine-tune a value, and see it in the context of a real card."
    >
      <div className="scene-grid-main">
        <SceneCard
          title="Workspace palette"
          description="Click a swatch to open the picker. You can also enter a color value directly."
        >
          <div className="showcase-palette">
            {colors.map(([name, value], i) => (
              <label key={name}>
                {name}
                <WorkspaceColorpicker
                  id={`colorpicker-${i + 1}`}
                  aria-label={`${name} color value`}
                  defaultValue={value}
                  onInput={(event) => {
                    const value = event.currentTarget.value;
                    if (CSS.supports("color", value)) setColor(value);
                  }}
                />
              </label>
            ))}
          </div>
          <p className="showcase-palette-note">
            HEX, RGB, and HSL values are supported. Changes apply to the live
            preview in this example.
          </p>
        </SceneCard>
        <SceneCard title="Selected color">
          <div
            className="showcase-color-sample"
            style={{ background: color }}
          />
          <div className="showcase-divider">
            <strong>Current value</strong>
            <code aria-live="polite">{color}</code>
          </div>
          <p>
            Keep color paired with a label or icon so the meaning is clear to
            everyone.
          </p>
        </SceneCard>
      </div>
      <SceneCard
        title="In context"
        description="A subtle accent brings hierarchy to the content without taking over."
      >
        <div
          className="showcase-color-context"
          style={{
            borderColor: color,
            background: `color-mix(in srgb, ${color} 8%, var(--scene-surface))`,
          }}
        >
          <span
            className="showcase-icon"
            style={{
              color,
              background: `color-mix(in srgb, ${color} 12%, var(--scene-surface))`,
            }}
          >
            <IconPalette />
          </span>
          <div>
            <h3>Identity directions</h3>
            <p>Three concepts are ready for the next studio review.</p>
          </div>
          <span
            className="showcase-color-dot"
            style={{ background: color }}
            aria-hidden="true"
          />
          <small>In review</small>
        </div>
      </SceneCard>
    </Scene>
  );
}
