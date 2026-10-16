/** Adapted from dashboardcn (MIT), copyright 2026 dashboardcn contributors.
 * Source: https://github.com/NoahGdev/dashboardcn/tree/b1ffacbca0f7a0be60135c8665b9e8c267205c48
 * License: https://ui.overtrue.xyz/THIRD_PARTY_NOTICES.txt
 */
import { DeltaBadge } from "@/registry/overtrue/delta-badge";

const rows = [
  { label: "Booked revenue", value: "$48.2K", delta: 0.124 },
  { label: "Client churn", value: "2.1%", delta: 0.08, invert: true },
  {
    label: "Review turnaround",
    value: "2.4 days",
    delta: -0.032,
    invert: true,
  },
  { label: "Open requests", value: "24", delta: 0 },
];

export default function DeltaBadgeDemo() {
  return (
    <div className="flex w-full flex-col gap-3">
      <ul className="divide-y divide-border/60 rounded-2xl border border-border/70 bg-card px-4 text-sm text-card-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-3 py-2">
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              {row.label}
            </span>
            <span className="font-semibold tracking-[-0.01em] tabular-nums">
              {row.value}
            </span>
            <span className="flex w-[4.75rem] justify-end">
              <DeltaBadge delta={row.delta} invert={row.invert} />
            </span>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        {(
          [
            ["outline", "Outline", 0.124],
            ["soft", "Soft", -0.032],
            ["text", "Text", 0.08],
          ] as const
        ).map(([variant, name, delta]) => (
          <div
            key={variant}
            className="flex min-w-0 flex-col items-start gap-2 rounded-xl bg-muted/40 p-3 ring-1 ring-border/60 ring-inset"
          >
            <span>{name}</span>
            <DeltaBadge delta={delta} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  );
}
