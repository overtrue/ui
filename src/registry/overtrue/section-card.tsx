import type { ComponentProps, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SectionCardProps extends Omit<
  ComponentProps<typeof Card>,
  "title"
> {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  contentClassName?: string;
}

/** A shared heading, actions and content surface for admin panels. */
export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
  ...props
}: SectionCardProps) {
  return (
    <Card
      data-slot="section-card"
      className={cn(
        "min-w-0 gap-0 rounded-2xl border border-border/70 bg-card py-0 text-card-foreground ring-0",
        "shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.10)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_1px_2px_rgb(0_0_0/0.5)]",
        className,
      )}
      {...props}
    >
      {(title || description || actions) && (
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-border/60 px-5 py-4 [.border-b]:pb-4">
          <div data-slot="section-card-heading" className="min-w-0 flex-1">
            {title && (
              <CardTitle className="m-0 text-sm leading-6 font-semibold tracking-tight text-card-foreground">
                {title}
              </CardTitle>
            )}
            {description && (
              <CardDescription className="m-0 mt-0.5 text-[13px] leading-5 text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </div>
          {actions && (
            <div
              data-slot="section-card-actions"
              className="flex shrink-0 items-center gap-2"
            >
              {actions}
            </div>
          )}
        </CardHeader>
      )}
      <CardContent className={cn("p-5", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
