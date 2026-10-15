import {
  ExperimentResult,
  type ExperimentVariant,
} from "@/registry/overtrue/experiment-result";

const variants: ExperimentVariant[] = [
  { id: "a", name: "Current pricing", users: 30_184, conversions: 1_219, isControl: true },
  { id: "b", name: "Annual first", users: 30_050, conversions: 1_352 },
  { id: "c", name: "Usage tiers", users: 30_122, conversions: 1_105 },
  { id: "d", name: "Feature grid", users: 29_961, conversions: 1_240 },
];

export default function Demo() {
  return (
    <ExperimentResult
      name="Pricing page layout"
      hypothesis="Leading with annual plans and a clearer feature grid will raise upgrades from the pricing page."
      metricLabel="Plan upgrades"
      variants={variants}
      mde={0.05}
      targetSampleSize={180_000}
      dailyUsers={10_900}
      startedAt="2026-10-03"
      now="2026-10-14"
    />
  );
}
