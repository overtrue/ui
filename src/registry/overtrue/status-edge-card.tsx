import { SectionCard, type SectionCardProps } from "./section-card";
import { cn } from "@/lib/utils";

const edges = {
  top: "inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,var(--edge)_14%,var(--edge)_86%,transparent)]",
  bottom:
    "inset-x-0 bottom-0 h-0.5 bg-[linear-gradient(90deg,transparent,var(--edge)_14%,var(--edge)_86%,transparent)]",
  start:
    "inset-y-0 start-0 w-0.5 bg-[linear-gradient(180deg,transparent,var(--edge)_14%,var(--edge)_86%,transparent)]",
  end: "inset-y-0 end-0 w-0.5 bg-[linear-gradient(180deg,transparent,var(--edge)_14%,var(--edge)_86%,transparent)]",
};
// A soft wash of the tone that spreads from the edge into the card.
const washes = {
  top: "inset-x-0 top-0 h-28 bg-[radial-gradient(75%_100%_at_50%_0%,color-mix(in_oklab,var(--edge)_var(--edge-wash),transparent),transparent)]",
  bottom:
    "inset-x-0 bottom-0 h-28 bg-[radial-gradient(75%_100%_at_50%_100%,color-mix(in_oklab,var(--edge)_var(--edge-wash),transparent),transparent)]",
  start:
    "inset-y-0 start-0 w-36 bg-[radial-gradient(100%_75%_at_0%_50%,color-mix(in_oklab,var(--edge)_var(--edge-wash),transparent),transparent)] rtl:-scale-x-100",
  end: "inset-y-0 end-0 w-36 bg-[radial-gradient(100%_75%_at_100%_50%,color-mix(in_oklab,var(--edge)_var(--edge-wash),transparent),transparent)] rtl:-scale-x-100",
};
// Status tokens when the theme has them, otherwise emerald and amber.
const tones = {
  primary: "[--edge:var(--color-primary)]",
  success: "[--edge:var(--color-success,var(--color-emerald-500))]",
  warning: "[--edge:var(--color-warning,var(--color-amber-500))]",
  danger: "[--edge:var(--color-destructive)]",
  info: "[--edge:var(--color-info,var(--color-primary))]",
};
export interface StatusEdgeCardProps extends SectionCardProps {
  edge?: keyof typeof edges;
  tone?: keyof typeof tones;
}
/** Pair the decorative edge with a written status in the title or content. */
export function StatusEdgeCard({
  edge = "top",
  tone = "primary",
  children,
  className,
  ...props
}: StatusEdgeCardProps) {
  return (
    <SectionCard
      data-slot="status-edge-card"
      data-tone={tone}
      data-edge={edge}
      className={cn("relative isolate overflow-hidden", tones[tone], className)}
      {...props}
    >
      <span
        aria-hidden="true"
        data-slot="status-edge-card-wash"
        className={cn(
          "pointer-events-none absolute -z-10 [--edge-wash:8%] dark:[--edge-wash:13%]",
          washes[edge],
        )}
      />
      <span
        aria-hidden="true"
        data-slot="status-edge-card-edge"
        className={cn(
          "pointer-events-none absolute dark:shadow-[0_0_12px_color-mix(in_oklab,var(--edge)_65%,transparent)]",
          edges[edge],
        )}
      />
      {children}
    </SectionCard>
  );
}
