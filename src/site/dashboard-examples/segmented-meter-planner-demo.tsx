import { useId, useState } from "react";
import { SegmentedMeter } from "@/registry/overtrue/segmented-meter";

const zones = [
  { from: 0, to: 40, color: "var(--color-chart-2)" },
  { from: 40, to: 75, color: "var(--color-chart-1)" },
  { from: 75, to: 90, color: "var(--color-chart-3)" },
  { from: 90, to: 100, color: "var(--color-chart-4)" },
];

export default function SegmentedMeterPlannerDemo() {
  const id = useId();
  const [hours, setHours] = useState(124);
  const capacity = 160;
  const percent = Math.round((hours / capacity) * 100);
  const status =
    percent >= 90
      ? "Protect time for reviews before accepting more work."
      : percent >= 75
        ? "A busy week. Keep the remaining time for small requests."
        : "There is room for another piece of work.";
  return (
    <div className="flex w-full max-w-lg flex-col gap-5 rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          Booked hours this week
        </label>
        <output htmlFor={id} className="text-sm tabular-nums">
          {hours} / {capacity} h
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={capacity}
        step={4}
        value={hours}
        onChange={(event) => setHours(Number(event.target.value))}
        aria-describedby={`${id}-summary`}
        className="w-full cursor-pointer accent-primary"
      />
      <div className="px-1.5">
        <SegmentedMeter
          value={percent}
          zones={zones}
          aria-label="Planned team capacity"
          tickFormatter={(value) => `${value}%`}
        />
      </div>
      <div
        id={`${id}-summary`}
        aria-live="polite"
        className="flex flex-col gap-1 text-sm"
      >
        <p className="font-medium">
          {percent}% booked · {capacity - hours} hours available
        </p>
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  );
}
