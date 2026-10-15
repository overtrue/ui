import { useId, useState } from "react";
import { SegmentedMeter } from "@/registry/overtrue/segmented-meter";

const zones = [
  { from: 0, to: 40, color: "var(--color-chart-2)" },
  { from: 40, to: 75, color: "var(--color-chart-1)" },
  { from: 75, to: 90, color: "var(--color-chart-3)" },
  { from: 90, to: 100, color: "var(--color-chart-5)" },
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
    <div className="flex w-full max-w-lg flex-col gap-5 rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          Booked hours this week
        </label>
        <output
          htmlFor={id}
          className="text-sm font-semibold tracking-[-0.01em] tabular-nums"
        >
          {hours}
          <span className="font-medium text-muted-foreground">
            {" "}
            / {capacity} h
          </span>
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
