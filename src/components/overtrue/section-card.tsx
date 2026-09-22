import {
  SectionCard as RegistrySectionCard,
  type SectionCardProps,
} from "@/registry/overtrue/section-card";
import { cn } from "@/lib/utils";

/** Preserve the spacing of the existing workspace examples. */
export function SectionCard({ className, ...props }: SectionCardProps) {
  return <RegistrySectionCard className={cn("mb-4", className)} {...props} />;
}
export type { SectionCardProps };
export { Card, CardContent } from "@/components/ui/card";
