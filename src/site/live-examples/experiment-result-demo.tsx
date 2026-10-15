import {
  ExperimentResult,
  upliftInterval,
  type ExperimentHistoryPoint,
  type ExperimentVariant,
} from "@/registry/overtrue/experiment-result";

const variants: ExperimentVariant[] = [
  { id: "control", name: "Control", users: 44_812, conversions: 2_778, isControl: true },
  { id: "one-page", name: "One-page checkout", users: 44_690, conversions: 3_005 },
];

/** Deterministic wobble that fades as the sample grows, like a real cumulative readout. */
function wobble(day: number, salt: number) {
  const x = Math.sin(day * 91.17 + salt * 17.3) * 10_000;
  return (x - Math.floor(x) - 0.5) / Math.sqrt(day + 1);
}

const DAYS = 14;
const history: ExperimentHistoryPoint[] = Array.from({ length: DAYS }, (_, day) => {
  const share = (day + 1) / DAYS;
  const [control, treatment] = variants.map((variant, i) => ({
    users: Math.round(variant.users * share),
    conversions: Math.round(
      variant.conversions * share * (1 + (day === DAYS - 1 ? 0 : wobble(day, i) * 0.16)),
    ),
  }));
  const date = new Date(2026, 8, 30 + day);
  return {
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
    values: { "one-page": upliftInterval(control, treatment)! },
  };
});

export default function Demo() {
  return (
    <ExperimentResult
      name="One-page checkout"
      metricLabel="Checkout conversion"
      variants={variants}
      mde={0.03}
      targetSampleSize={88_000}
      startedAt="2026-09-30"
      now="2026-10-14"
      history={history}
    />
  );
}
