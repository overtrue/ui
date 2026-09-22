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
      <Badge className="max-w-full whitespace-normal rounded px-2 py-1">
        {ribbon}
      </Badge>
    ) : null;
  return (
    <SectionCard
      data-slot="ribbon-card"
      className={cn("relative", className)}
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
