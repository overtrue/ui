import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * Full-page auth card layout matching overtrue/ui sign-in family.
 * Auth routes are bare (no AppShell chrome); pages wrap form fields as children.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  className,
  illustration,
  embedded = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  illustration?: React.ReactNode;
  /** true when used inside a gallery/demo page (no full-viewport chrome) */
  embedded?: boolean;
}) {
  return (
    <div
      className={cn(
        embedded
          ? "w-full"
          : "flex min-h-svh items-center justify-center bg-background p-4",
        className,
      )}
    >
      <div className={cn("w-full", !embedded && "max-w-sm")}>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
            P
          </div>
          <h1 className="h1">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {illustration ? <div className="mb-4">{illustration}</div> : null}
        <Card className="p-6">{children}</Card>
      </div>
    </div>
  );
}
