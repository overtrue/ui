import { useState } from "react";
import {
  CohortGrid,
  type CohortGridCell,
  type CohortGridCohort,
  type CohortGridMode,
} from "@/registry/overtrue/cohort-grid";
import { cn } from "@/lib/utils";

// Weekly workspace activation cohorts: people who returned to the editor N weeks after joining.
const weeks = ["Aug 3", "Aug 10", "Aug 17", "Aug 24", "Aug 31", "Sep 7", "Sep 14", "Sep 21", "Sep 28"];
const sizes = [412, 386, 455, 438, 502, 476, 531, 497, 560];
const curve = [1, 0.58, 0.47, 0.41, 0.37, 0.345, 0.33, 0.318, 0.31];
const wobble = [0, 0.012, -0.009, 0.006, -0.004, 0.008, -0.006, 0.003, 0];

const cohorts: CohortGridCohort[] = weeks.map((week, i) => ({
  id: `w${i}`,
  label: week,
  size: sizes[i],
  values: curve.map((value, period) => {
    if (period >= weeks.length - i) return null;
    if (period === 0) return 1;
    const drift = wobble[(i + period) % wobble.length] + i * 0.003;
    return Math.round((value + drift) * 1000) / 1000;
  }),
}));

const options: { value: CohortGridMode; label: string }[] = [
  { value: "percent", label: "Percent" },
  { value: "count", label: "People" },
];

export default function Demo() {
  const [mode, setMode] = useState<CohortGridMode>("percent");
  const [selected, setSelected] = useState<CohortGridCell | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <CohortGrid
        title="Weekly return rate"
        description="People who came back to the editor, by weeks since they joined."
        cohorts={cohorts}
        periods={curve.map((_, i) => `W${i}`)}
        mode={mode}
        unit="people"
        sizeLabel="Joined"
        showAverage
        onCellSelect={setSelected}
        actions={
          <div
            role="group"
            aria-label="Show values as"
            className="inline-flex rounded-md border bg-muted/50 p-0.5"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={mode === option.value}
                onClick={() => setMode(option.value)}
                className={cn(
                  "h-7 rounded-[5px] px-2.5 text-xs font-medium text-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
                  "hover:text-foreground aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-xs",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      />
      <p role="status" className="px-1 text-xs text-muted-foreground">
        {selected
          ? `Selected ${selected.label} · ${selected.period}: ${selected.retained?.toLocaleString("en-US")} of ${selected.base.toLocaleString("en-US")} people returned.`
          : "Click a cell, or press Enter on it, to pick a cohort for a follow-up survey."}
      </p>
    </div>
  );
}
