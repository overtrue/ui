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
        "min-w-0 gap-0 rounded-lg border border-border bg-card py-0 text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      {(title || description || actions) && (
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4 [.border-b]:pb-4">
          <div className="min-w-0 flex-1">
            {title && (
              <CardTitle className="m-0 text-sm font-semibold leading-6">
                {title}
              </CardTitle>
            )}
            {description && (
              <CardDescription className="m-0 mt-1 text-xs leading-5 text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </CardHeader>
      )}
      <CardContent className={cn("p-5", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
