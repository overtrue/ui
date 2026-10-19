import {
  FeatureFlags,
  sampleFlags,
  type FeatureFlag,
  type FeatureFlagPatch,
} from "@/registry/overtrue/feature-flags";

/**
 * A pretend API: every save takes a moment, and production changes to the
 * billing flag fail on purpose so the rollback and inline error are easy to see.
 */
function save(flag: FeatureFlag, patch: FeatureFlagPatch) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (flag.id === "usage-billing" && patch.environment === "production")
        reject(new Error("Billing flags need a second approver in Production."));
      else resolve();
    }, 700);
  });
}

export default function FeatureFlagsDemo() {
  return (
    <FeatureFlags
      defaultFlags={sampleFlags}
      defaultEnvironment="production"
      onChange={save}
      onCreate={() => new Promise<void>((resolve) => setTimeout(resolve, 500))}
    />
  );
}
