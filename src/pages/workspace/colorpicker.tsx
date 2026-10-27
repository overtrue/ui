import { useState } from "react";
import { WorkspaceColorpicker } from "@/components/overtrue/workspace/plugins";
import { SettingsSection } from "@/registry/overtrue/settings-section";
import {
  Scene,
  SceneCard,
  Action,
  Person,
  Go,
} from "@/components/overtrue/scenes/shared";
const defaults = {
  primary: "#4263eb",
  secondary: "#14836b",
  surface: "#f5f7fb",
};
export default function Page() {
  const [colors, setColors] = useState(defaults);
  const [saved, setSaved] = useState(defaults);
  const [notice, setNotice] = useState("");
  return (
    <Scene
      id="colorpicker"
      title="Brand palette"
      description="Set the colors used in the client portal’s project previews."
      actions={<Go to="/patterns">Project appearance</Go>}
    >
      <div className="scene-product-grid">
        <SceneCard title="Portal colors">
          <form
            className="scene-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(colors);
              setNotice("Palette saved in this preview.");
            }}
          >
            {(
              [
                {
                  key: "primary",
                  title: "Primary accent",
                  description: "Project markers and key actions.",
                },
                {
                  key: "secondary",
                  title: "Secondary accent",
                  description: "Supporting labels and categories.",
                },
                {
                  key: "surface",
                  title: "Preview surface",
                  description: "The background behind artwork previews.",
                },
              ] as const
            ).map(({ key, title, description }, i) => (
              <SettingsSection
                key={key}
                title={title}
                description={description}
              >
                <label className="scene-field">
                  Color value
                  <WorkspaceColorpicker
                    id={`brand-color-${i}`}
                    aria-label={title}
                    value={colors[key]}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      if (CSS.supports("color", value)) {
                        setColors((items) => ({ ...items, [key]: value }));
                        setNotice("");
                      }
                    }}
                    onChange={() => {}}
                  />
                </label>
              </SettingsSection>
            ))}
            <div className="scene-actions">
              <Action type="submit" primary>
                Save palette
              </Action>
              <Action
                onClick={() => {
                  setColors(saved);
                  setNotice("");
                }}
              >
                Discard
              </Action>
            </div>
            <p role="status">{notice}</p>
          </form>
        </SceneCard>
        <aside className="scene-product-aside">
          <SceneCard title="Portal preview">
            <div
              className="scene-brand-preview"
              style={{
                background: colors.surface,
                borderTopColor: colors.primary,
              }}
            >
              <div className="scene-brand-preview-content">
                <span>ACME STUDIO</span>
                <h3>Visitor experience</h3>
                <p>Concept review · Version 03</p>
              </div>
              <span
                className="scene-brand-marker"
                style={{ background: colors.secondary }}
                aria-hidden="true"
              />
            </div>
            <div className="scene-record-list">
              <div>
                <Person name="Maya Okafor" subtitle="Project owner" />
              </div>
            </div>
            <p>
              Keep status colors consistent and pair color with a clear text
              label.
            </p>
          </SceneCard>
        </aside>
      </div>
    </Scene>
  );
}
