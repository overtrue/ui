import {
  CohortGrid,
  type CohortGridCohort,
} from "@/registry/overtrue/cohort-grid";

// Monthly subscriber cohorts. Later cohorts hold on slightly better after onboarding changes.
const cohorts: CohortGridCohort[] = [
  { id: "2026-01", label: "Jan 2026", size: 1284, values: [1, 0.641, 0.523, 0.462, 0.421, 0.393, 0.372, 0.356] },
  { id: "2026-02", label: "Feb 2026", size: 1410, values: [1, 0.651, 0.523, 0.469, 0.423, 0.401, 0.373, null] },
  { id: "2026-03", label: "Mar 2026", size: 1562, values: [1, 0.641, 0.536, 0.467, 0.433, 0.399, null, null] },
  { id: "2026-04", label: "Apr 2026", size: 1498, values: [1, 0.664, 0.537, 0.48, 0.432, null, null, null] },
  { id: "2026-05", label: "May 2026", size: 1733, values: [1, 0.661, 0.548, 0.481, null, null, null, null] },
  { id: "2026-06", label: "Jun 2026", size: 1902, values: [1, 0.678, 0.554, null, null, null, null, null] },
  { id: "2026-07", label: "Jul 2026", size: 2046, values: [1, 0.687, null, null, null, null, null, null] },
  { id: "2026-08", label: "Aug 2026", size: 2215, values: [1, null, null, null, null, null, null, null] },
];

export default function Demo() {
  return (
    <CohortGrid
      title="Subscriber retention"
      description="Share of each signup month still subscribed, by months since signup."
      cohorts={cohorts}
      unit="subscribers"
      sizeLabel="Subs"
      showAverage
      showLegend
    />
  );
}
