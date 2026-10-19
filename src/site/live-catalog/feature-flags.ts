export default {
  name: "feature-flags",
  title: "Feature flags",
  category: "Blocks",
  description:
    "A feature flag console with search, an environment switcher, per-environment switches and rollout, optimistic saves that roll back on failure, and targeting rules and history per flag.",
  dependencies: ["switch"],
  imports:
    "FeatureFlags, sampleFlags, type FeatureFlag, type FeatureFlagPatch",
  usage: `function Example() {
  async function save(flag: FeatureFlag, patch: FeatureFlagPatch) {
    const response = await fetch("/api/flags/" + flag.key, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    if (!response.ok) throw new Error(await response.text());
  }

  return (
    <FeatureFlags
      defaultFlags={sampleFlags}
      defaultEnvironment="production"
      onChange={save}
    />
  );
}`,
  notes:
    "Every change is a patch, `{ environment, enabled }`, `{ environment, rollout }` or `{ status }`, passed to `onChange(flag, patch)` with the flag as it was. The block shows the change at once with a spinner beside the switch; resolve the promise to keep it, or reject it to roll it back and show your error inline under the row with Retry. With `defaultFlags` the block applies successful changes itself and records them in the flag's history as `actor`; with controlled `flags`, update them in `onChange`. Environments marked `protected` (Production by default) ask for an inline confirmation before a switch changes, with focus on the confirm button and Escape to cancel. Rollout saves when a drag ends, or 600ms after the last arrow key. Click a row, or press Enter on its name, to expand targeting rules for the current environment, the state in every environment, and the last five changes; arrow keys move between rows and Escape closes. The layout follows the block's own width: a full table from 960px, owners as avatars from 832px, and a stacked list below that works down to phone widths. `sampleFlags` is fictional demo data with timestamps relative to page load.",
  previewWidth: 1000,
  examples: [
    {
      name: "feature-flags-demo",
      title: "Flags across environments",
      description:
        "Eight fictional flags in Production. Flip a switch to see the inline confirmation, drag a rollout, or expand a row. Usage-based billing fails to save in Production on purpose, so you can see the rollback.",
    },
  ],
  api: [
    [
      "flags? / defaultFlags?",
      "FeatureFlag[]",
      "Controlled or initial flags: { id, key, name, description?, owner?, status, tags?, environments, updatedAt, lastEvaluatedAt?, history? }.",
    ],
    [
      "onChange?",
      "(flag, patch: FeatureFlagPatch) => void | Promise<unknown>",
      "Saves a change. Shown optimistically; a rejected promise rolls it back with an inline error and Retry.",
    ],
    [
      "onCreate?",
      "(draft: { name; key; description }) => void | FeatureFlag | Promise<FeatureFlag | void>",
      "Handles the inline New flag form. Return a flag to use it as is; reject to show the error in the form. The key is derived from the name until edited.",
    ],
    [
      "environments?",
      "{ id; label; protected? }[]",
      "Defaults to Development, Staging and a protected Production. Protected environments confirm switch changes inline.",
    ],
    [
      "environment? / defaultEnvironment? / onEnvironmentChange?",
      "string / (id: string) => void",
      "The environment whose switch, rollout and targeting the rows show.",
    ],
    [
      "query? / defaultQuery? / onQueryChange?",
      "string / (query: string) => void",
      "Search text, matched against name, key, description, owner and tags.",
    ],
    [
      "expandedId? / defaultExpandedId? / onExpandedChange?",
      "string | null / (id: string | null) => void",
      "The expanded row showing targeting rules, environments and history.",
    ],
    ["title? / description?", "ReactNode", "Heading and the line under it. description defaults to a live flag count."],
    ["actions?", "ReactNode", "Extra controls beside New flag."],
    ["actor?", "string", 'Name recorded in history for changes made here. Defaults to "You".'],
    [
      "now? / formatTime?",
      "Date | number / (date: Date, now: Date) => string",
      "Reference time and formatter for relative times. Defaults to now, refreshed every minute.",
    ],
    ["locale?", "string", "Locale for dates."],
    [
      "labels?",
      "Partial<FeatureFlagsLabels>",
      "Interface copy for translation, including status names and confirmation text.",
    ],
    [
      "className?",
      "string",
      "Classes for the card. Rows expose data-slot=feature-flag with data-state, data-status, data-selected and data-saving.",
    ],
    [
      "sampleFlags / defaultFlagEnvironments",
      "FeatureFlag[] / FeatureFlagEnvironment[]",
      "Fictional demo flags and the default environments.",
    ],
  ],
} as const;
