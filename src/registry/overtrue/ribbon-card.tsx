import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";
import { SectionCard, type SectionCardProps } from "./section-card";
import { cn } from "@/lib/utils";

export interface RibbonCardProps extends SectionCardProps {
  ribbon?: ReactNode;
  ribbonPosition?: "top" | "text";
}
export function RibbonCard({
  ribbon,
  ribbonPosition = "top",
  className,
  children,
  actions,
  ...props
}: RibbonCardProps) {
  const badge =
    ribbon != null ? (
      <Badge className="h-auto max-w-full gap-1 rounded-full border-transparent bg-primary px-2.5 py-0.5 text-xs leading-5 font-medium whitespace-normal text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_1px_2px_rgb(0_0_0/0.08),0_4px_14px_-4px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]">
        {ribbon}
      </Badge>
    ) : null;
  return (
    <SectionCard
      data-slot="ribbon-card"
      data-ribbon-position={ribbonPosition}
      className={cn(
        "relative",
        ribbon != null &&
          ribbonPosition === "top" &&
          "bg-[radial-gradient(55%_60%_at_100%_0%,color-mix(in_oklab,var(--color-primary)_9%,transparent),transparent_70%)]",
        className,
      )}
      actions={
        ribbonPosition === "top" ? (
          <>
            {badge}
            {actions}
          </>
        ) : (
          actions
        )
      }
      {...props}
    >
      {children}
      {ribbonPosition === "text" && badge && (
        <div className="mt-4">{badge}</div>
      )}
    </SectionCard>
  );
}
