import { SectionCard, type SectionCardProps } from "./section-card";
import { cn } from "@/lib/utils";

const edges = {
  top: "inset-x-0 top-0 h-1",
  bottom: "inset-x-0 bottom-0 h-1",
  start: "inset-y-0 start-0 w-1",
  end: "inset-y-0 end-0 w-1",
};
const tones = {
  primary: "var(--color-primary)",
  success: "var(--color-success, var(--color-primary))",
  warning: "var(--color-warning, var(--color-primary))",
  danger: "var(--color-destructive)",
  info: "var(--color-info, var(--color-primary))",
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
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("pointer-events-none absolute", edges[edge])}
        style={{ backgroundColor: tones[tone] }}
      />
      {children}
    </SectionCard>
  );
}
